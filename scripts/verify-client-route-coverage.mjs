import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const repoRoot = path.resolve(import.meta.dirname, "..");
const routesFile = path.join(repoRoot, "generated", "public-routes.json");
const dataClientFile = path.join(repoRoot, "packages", "data-sdk", "src", "client.ts");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeParameterizedPath(pathname) {
  return pathname.replace(/:[A-Za-z0-9_]+/g, ":param");
}

function normalizeRoute(route) {
  const [method, ...pathParts] = route.split(" ");
  return `${method} ${normalizeParameterizedPath(pathParts.join(" "))}`;
}

function resolveStringExpression(expression, sourceFile) {
  if (
    ts.isStringLiteral(expression) ||
    ts.isNoSubstitutionTemplateLiteral(expression)
  ) {
    return expression.text;
  }

  if (ts.isTemplateExpression(expression)) {
    return (
      expression.head.text +
      expression.templateSpans
        .map((span) => `:${span.expression.getText(sourceFile)}${span.literal.text}`)
        .join("")
    );
  }

  return null;
}

/**
 * The data client conditionally swaps between two template paths to model
 * the optional `:amount` segment on `fx.pair` and `fx.history`. Both arms
 * count as real public routes — extract each branch independently.
 */
function resolveRouteExpressions(expression, sourceFile) {
  if (ts.isConditionalExpression(expression)) {
    return [
      ...resolveRouteExpressions(expression.whenTrue, sourceFile),
      ...resolveRouteExpressions(expression.whenFalse, sourceFile),
    ];
  }
  const single = resolveStringExpression(expression, sourceFile);
  return single ? [single] : [];
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

/**
 * Each `${...}` slot in a client route template is always a complete path
 * segment, so collapse any segment that starts with `:` (a leftover slot)
 * down to `:param`. This handles nested calls like
 * `${encodeURIComponent(String(amount))}` without writing a balanced-paren
 * regex.
 */
function normalizeTemplateBoundaries(routePath) {
  return routePath
    .split("/")
    .map((segment) => (segment.startsWith(":") ? ":param" : segment))
    .join("/");
}

/**
 * The client uses two top-level constants for the path prefixes; resolve
 * them so routes are comparable to the manifest entries.
 */
function resolvePrefixConstants(sourceFile) {
  const prefixes = new Map();
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      (ts.isStringLiteral(node.initializer) ||
        ts.isNoSubstitutionTemplateLiteral(node.initializer))
    ) {
      prefixes.set(node.name.text, node.initializer.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return prefixes;
}

function expandPrefixes(route, prefixes) {
  let result = route;
  for (const [name, value] of prefixes) {
    result = result.replaceAll(`:${name}`, value);
  }
  return result;
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
  const routes = new Set();

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "request" &&
      // Only count direct transport calls — skip the generic `seo.request`
      // forwarder, which routes through the same name but is intentionally
      // dynamic and not subject to per-route parity.
      ts.isPropertyAccessExpression(node.expression.expression) &&
      node.expression.expression.name.text === "transport"
    ) {
      const method = resolveRequestMethod(node).toUpperCase();
      for (const rawPath of resolveRouteExpressions(node.arguments[0], sourceFile)) {
        const expanded = expandPrefixes(rawPath, prefixes);
        // SEO is exposed as a generic typed pass-through (`seo.request`),
        // not as per-route methods. The compiled path is intentionally
        // dynamic — exclude it from per-route parity.
        if (expanded.startsWith("/data/seo/v1")) {
          continue;
        }
        const normalized = normalizeTemplateBoundaries(expanded);
        routes.add(`${method} ${normalized}`);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return routes;
}

function verifyProductCoverage(product, clientRoutes, manifestRoutes) {
  const actual = new Set([...clientRoutes].map(normalizeRoute));
  const expected = new Set(manifestRoutes.map(normalizeRoute));

  const missingRoutes = [...expected].filter((route) => !actual.has(route)).sort();
  const unexpectedRoutes = [...actual].filter((route) => !expected.has(route)).sort();

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

assert.ok(fs.existsSync(routesFile), "generated/public-routes.json is missing.");
assert.ok(
  fs.existsSync(dataClientFile),
  "packages/data-sdk/src/client.ts is missing.",
);

const routesManifest = readJson(routesFile);
const clientRoutes = extractClientRoutes(dataClientFile);

const allManifestRoutes = [...routesManifest.static, ...routesManifest.fx];
verifyProductCoverage("Data", clientRoutes, allManifestRoutes);

console.log("Client route coverage verification passed.");
