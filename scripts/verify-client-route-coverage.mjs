import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

/**
 * Compares the routes the client *implements* (transport.request calls in
 * `packages/data-sdk/src/client.ts`) against the canonical
 * `generated/public-routes.json` manifest produced by `sync:contracts`.
 *
 * For every product in the manifest, every route must be expressible by some
 * client method, and the client must not expose any URL that isn't in the
 * manifest. Path parameters are normalized to `:param` so that the two ends
 * line up regardless of name (`:iata` vs `:param`, etc.).
 *
 * The client uses two extraction-relevant patterns:
 *
 *   1. Top-level `const STATIC = "/data/static/v1"` constants used as
 *      template-literal heads — resolved by `resolvePrefixConstants`.
 *   2. Per-method `const t = this.transport` aliases — resolved by tracking
 *      every identifier that an enclosing scope binds to `this.transport`,
 *      so `t.request(...)` is treated as a transport call.
 */

const repoRoot = path.resolve(import.meta.dirname, "..");
const routesFile = path.join(repoRoot, "generated", "public-routes.json");
const dataClientFile = path.join(
  repoRoot,
  "packages",
  "data-sdk",
  "src",
  "client.ts",
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeParameterizedPath(pathname) {
  return pathname.replace(/:[A-Za-z0-9_]+/g, ":param");
}

function normalizeRoute(route) {
  // The manifest stores `METHOD /path` lines; strip any querystring the
  // client encodes inline (none of the public routes are query-only and
  // querystrings aren't part of the path-parameter parity).
  const [method, ...pathParts] = route.split(" ");
  const fullPath = pathParts.join(" ");
  const [pathWithoutQuery] = fullPath.split("?");
  return `${method} ${normalizeParameterizedPath(pathWithoutQuery)}`;
}

function resolveRequestMethod(callExpression) {
  const options = callExpression.arguments[1];

  if (!options || !ts.isObjectLiteralExpression(options)) {
    return "GET";
  }

  for (const property of options.properties) {
    if (
      ts.isPropertyAssignment(property) &&
      ts.isIdentifier(property.name) &&
      property.name.text === "method" &&
      (ts.isStringLiteral(property.initializer) ||
        ts.isNoSubstitutionTemplateLiteral(property.initializer))
    ) {
      return property.initializer.text;
    }
  }

  return "GET";
}

function normalizeTemplateBoundaries(routePath) {
  return routePath
    .split("/")
    .map((segment) => (segment.startsWith(":") ? ":param" : segment))
    .join("/");
}

/**
 * Captures only top-level (module-level) string-literal constants. These are
 * the per-product path prefixes (`STATIC`, `FX`, …) used as template heads.
 * Local variables are resolved inline at the call site so that two
 * differently-scoped `const base = ...` declarations don't clobber each
 * other.
 */
function resolvePrefixConstants(sourceFile) {
  const prefixes = new Map();
  for (const stmt of sourceFile.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (
        ts.isIdentifier(decl.name) &&
        decl.initializer &&
        (ts.isStringLiteral(decl.initializer) ||
          ts.isNoSubstitutionTemplateLiteral(decl.initializer))
      ) {
        prefixes.set(decl.name.text, decl.initializer.text);
      }
    }
  }
  return prefixes;
}

/**
 * Walk up the parent chain looking for a `const <name> = <init>` declaration
 * — used to resolve identifier first-arguments of `t.request(...)` and
 * identifier spans inside template literals.
 */
function findLocalDeclaration(name, fromNode) {
  let cursor = fromNode;
  while (cursor) {
    if (
      ts.isBlock(cursor) ||
      ts.isSourceFile(cursor) ||
      ts.isFunctionLike(cursor)
    ) {
      const statements = cursor.statements ?? cursor.body?.statements ?? [];
      for (const stmt of statements) {
        if (!ts.isVariableStatement(stmt)) continue;
        for (const decl of stmt.declarationList.declarations) {
          if (
            ts.isIdentifier(decl.name) &&
            decl.name.text === name &&
            decl.initializer
          ) {
            return decl.initializer;
          }
        }
      }
    }
    cursor = cursor.parent;
  }
  return null;
}

/**
 * Resolve a node to all string-arrays it could evaluate to at runtime.
 * Strings, template literals, conditional expressions, and identifiers that
 * resolve to one of those are all expanded; anything else collapses to a
 * `:param` placeholder inside template spans (so `normalizeTemplateBoundaries`
 * can finalize it).
 */
function expandNodeToStrings(node, prefixes) {
  if (!node) return [];
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return [node.text];
  }
  if (ts.isTemplateExpression(node)) {
    let prefix = node.head.text;
    let combos = [prefix];
    for (const span of node.templateSpans) {
      const spanValues = expandSpanExpression(span.expression, prefixes);
      const next = [];
      for (const combo of combos) {
        for (const v of spanValues) {
          next.push(combo + v + span.literal.text);
        }
      }
      combos = next;
    }
    return combos;
  }
  if (ts.isConditionalExpression(node)) {
    return [
      ...expandNodeToStrings(node.whenTrue, prefixes),
      ...expandNodeToStrings(node.whenFalse, prefixes),
    ];
  }
  if (ts.isIdentifier(node)) {
    if (prefixes.has(node.text)) return [prefixes.get(node.text)];
    const decl = findLocalDeclaration(node.text, node);
    if (decl) return expandNodeToStrings(decl, prefixes);
    return [];
  }
  return [];
}

function expandSpanExpression(expression, prefixes) {
  // For span expressions inside a template literal, anything that isn't a
  // known prefix or a resolvable local string becomes a `:param` slot.
  if (ts.isIdentifier(expression) && prefixes.has(expression.text)) {
    return [prefixes.get(expression.text)];
  }
  if (ts.isIdentifier(expression)) {
    const decl = findLocalDeclaration(expression.text, expression);
    if (decl) {
      const resolved = expandNodeToStrings(decl, prefixes);
      if (resolved.length > 0) return resolved;
    }
    // Identifier is a function parameter — expand to all string-literal
    // arguments passed at any call site of the enclosing function.
    const paramValues = expandParameterByCallSites(expression, prefixes);
    if (paramValues.length > 0) return paramValues;
  }
  return [":param"];
}

/**
 * If `identifier` refers to a parameter of any enclosing arrow / function
 * stored under a `const <name> = ...` declaration, scan the SourceFile for
 * every call to `<name>` and return the deduped string-literal arguments at
 * the parameter's position. This is what makes parametric helper closures
 * like
 *
 *   const post = (suffix: string) => ({
 *     create: () => t.request(\`${SEO}/backlinks/${suffix}\`, ...)
 *   });
 *   post("anchors"); post("history"); …
 *
 * extract correctly. The reference to `suffix` lives inside the inner
 * `create` arrow but is bound by the outer `post` arrow, so we walk every
 * enclosing function looking for the binding.
 */
function expandParameterByCallSites(identifier, prefixesForCallSites) {
  for (const fn of enclosingFunctions(identifier)) {
    const paramIndex = (fn.parameters ?? []).findIndex(
      (p) => ts.isIdentifier(p.name) && p.name.text === identifier.text,
    );
    if (paramIndex < 0) continue;
    const ownerName = findOwningName(fn);
    if (!ownerName) return [];

    // Constrain the call-site search to the helper's lexical scope so two
    // different helpers with the same name (each `private buildXxx()`
    // method has its own `const post = ...`) don't cross-pollinate.
    const searchRoot = findCallSiteSearchRoot(fn);

    const values = new Set();
    function isMatchingCallee(expr) {
      if (ts.isIdentifier(expr) && expr.text === ownerName) return true;
      if (
        ts.isPropertyAccessExpression(expr) &&
        ts.isIdentifier(expr.name) &&
        expr.name.text === ownerName
      ) {
        return true;
      }
      return false;
    }
    function visit(node) {
      if (ts.isCallExpression(node) && isMatchingCallee(node.expression)) {
        const arg = node.arguments[paramIndex];
        if (arg) {
          for (const v of expandNodeToStrings(arg, prefixesForCallSites)) {
            values.add(v);
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(searchRoot);
    return [...values];
  }
  return [];
}

/**
 * The lexical scope a helper's call sites can live in. For a `const helper`
 * inside a method body, that's the enclosing method (class methods are
 * `private` and aren't callable from elsewhere by name). For a method
 * declaration on a class, that's the whole source file (the method is
 * referenced via `this.<method>(...)` from sibling methods).
 */
function findCallSiteSearchRoot(fn) {
  // Class method — calls live in `this.method(...)` across siblings.
  if (ts.isMethodDeclaration(fn)) return fn.getSourceFile();
  // const helper = (...) => ... — search the enclosing function/method/block.
  let cursor = fn.parent;
  while (cursor) {
    if (
      ts.isMethodDeclaration(cursor) ||
      ts.isFunctionDeclaration(cursor) ||
      ts.isFunctionExpression(cursor) ||
      ts.isArrowFunction(cursor) ||
      ts.isBlock(cursor)
    ) {
      return cursor;
    }
    cursor = cursor.parent;
  }
  return fn.getSourceFile();
}

function* enclosingFunctions(node) {
  let cursor = node.parent;
  while (cursor) {
    if (
      ts.isArrowFunction(cursor) ||
      ts.isFunctionExpression(cursor) ||
      ts.isFunctionDeclaration(cursor) ||
      ts.isMethodDeclaration(cursor)
    ) {
      yield cursor;
    }
    cursor = cursor.parent;
  }
}

function findOwningName(fn) {
  // const post = (...) => ... → name is "post"
  if (
    fn.parent &&
    ts.isVariableDeclaration(fn.parent) &&
    ts.isIdentifier(fn.parent.name)
  ) {
    return fn.parent.name.text;
  }
  // function post(...) { ... }
  if (ts.isFunctionDeclaration(fn) && fn.name) return fn.name.text;
  // private buildSearchFeature(...) { ... } — method on a class.
  if (ts.isMethodDeclaration(fn) && ts.isIdentifier(fn.name))
    return fn.name.text;
  return null;
}

/**
 * Returns the set of identifier names that, within the given subtree, alias
 * `this.transport` (e.g. `const t = this.transport;`). The `request` call on
 * any of those identifiers is then treated as a transport call.
 */
function collectTransportAliases(rootNode) {
  const aliases = new Set();
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isPropertyAccessExpression(node.initializer) &&
      node.initializer.name.text === "transport" &&
      node.initializer.expression.kind === ts.SyntaxKind.ThisKeyword
    ) {
      aliases.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(rootNode);
  return aliases;
}

function isTransportRequestCall(node, aliases) {
  if (!ts.isCallExpression(node)) return false;
  if (!ts.isPropertyAccessExpression(node.expression)) return false;
  if (node.expression.name.text !== "request") return false;

  const target = node.expression.expression;
  // `this.transport.request(...)` — direct.
  if (
    ts.isPropertyAccessExpression(target) &&
    target.name.text === "transport" &&
    target.expression.kind === ts.SyntaxKind.ThisKeyword
  ) {
    return true;
  }
  // `t.request(...)` where `t` is a `const t = this.transport;` alias.
  if (ts.isIdentifier(target) && aliases.has(target.text)) {
    return true;
  }
  return false;
}

function extractClientRoutes(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const prefixes = resolvePrefixConstants(sourceFile);
  const aliases = collectTransportAliases(sourceFile);
  const routes = new Map(); // public route → product key

  function classifyProduct(expanded) {
    if (expanded.startsWith("/data/air/")) return "air";
    if (expanded.startsWith("/data/fx/")) return "fx";
    if (expanded.startsWith("/data/seo/")) return "seo";
    if (expanded.startsWith("/data/reviews/")) return "reviews";
    if (expanded.startsWith("/data/hotels/")) return "hotels";
    if (expanded.startsWith("/data/restaurants/")) return "restaurants";
    if (expanded.startsWith("/data/experiences/")) return "experiences";
    if (expanded.startsWith("/data/geo/")) return "geo";
    return null;
  }

  function visit(node) {
    if (isTransportRequestCall(node, aliases)) {
      const method = resolveRequestMethod(node).toUpperCase();
      for (const rawPath of expandNodeToStrings(node.arguments[0], prefixes)) {
        const product = classifyProduct(rawPath);
        if (!product) continue;
        const normalized = normalizeTemplateBoundaries(rawPath);
        const key = `${method} ${normalized}`;
        if (!routes.has(key)) routes.set(key, product);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return routes;
}

function verifyProductCoverage(product, clientRoutes, manifestRoutes) {
  const actual = new Set(clientRoutes.map(normalizeRoute));
  const expected = new Set(manifestRoutes.map(normalizeRoute));

  const missingRoutes = [...expected]
    .filter((route) => !actual.has(route))
    .sort();
  const unexpectedRoutes = [...actual]
    .filter((route) => !expected.has(route))
    .sort();

  assert.equal(
    missingRoutes.length,
    0,
    `${product} client is missing generated public routes:\n${missingRoutes.join("\n")}`,
  );
  assert.equal(
    unexpectedRoutes.length,
    0,
    `${product} client exposes routes not present in the generated public manifest:\n${unexpectedRoutes.join("\n")}`,
  );
}

assert.ok(
  fs.existsSync(routesFile),
  "generated/public-routes.json is missing.",
);
assert.ok(
  fs.existsSync(dataClientFile),
  "packages/data-sdk/src/client.ts is missing.",
);

const routesManifest = readJson(routesFile);
const clientRoutesByProduct = extractClientRoutes(dataClientFile);

// Group client routes by product so each product's client surface is
// compared against its own manifest slice independently.
const groupedClientRoutes = new Map();
for (const [route, product] of clientRoutesByProduct) {
  if (!groupedClientRoutes.has(product)) groupedClientRoutes.set(product, []);
  groupedClientRoutes.get(product).push(route);
}

const productOrder = [
  "air",
  "fx",
  "seo",
  "reviews",
  "hotels",
  "restaurants",
  "experiences",
  "geo",
];
for (const product of productOrder) {
  const manifest = routesManifest[product] ?? [];
  const client = groupedClientRoutes.get(product) ?? [];
  verifyProductCoverage(product, client, manifest);
}

console.log("Client route coverage verification passed.");
