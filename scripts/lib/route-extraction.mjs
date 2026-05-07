/**
 * Shared route extractor for the public Voyant Data API surface.
 *
 * Used by both `sync-route-manifests.mjs` (which writes the canonical
 * `generated/public-routes.json`) and `verify-api-parity.mjs` (which re-runs
 * the extractor and asserts no drift). Keeping the logic in one place avoids
 * the two scripts disagreeing about what counts as a public route.
 *
 * The public surface is composed of seven Cloudflare Workers, each exposing
 * its routes through a mix of three patterns:
 *
 *   1. Literal `app.<method>("/path", ...)` calls. Easy: regex.
 *   2. Module-local `BASE_PATH` constants — `app.post(BASE_PATH, ...)` and
 *      template-stringed children like `app.get(\`${BASE_PATH}/:id\`, ...)`.
 *      Resolved by reading any `const BASE_PATH = "..."` declaration in the
 *      same file.
 *   3. Cross-module helpers that fan out a fixed shape:
 *        - `defineAsyncTrio(app, { basePath: "..." })` — POST + GET + GET/:id
 *        - `registerTripadvisorReferenceRoutes(app, "/{prefix}/v1")` —
 *          locations + locations/:countryCode + languages
 *      Both are hard-coded against the helper definitions in voyant-cloud
 *      (`apps/data-{reviews,hotels,restaurants,experiences}-api` +
 *      `packages/data-runtime/src/tripadvisorReference.ts`).
 *
 * `rewriteToPublic` then maps a worker-internal path (`/reviews/v1/...`) to
 * its gateway form (`/data/reviews/v1/...`) and drops anything that isn't
 * exposed publicly (internal admin, postbacks, screenshots, voyant-async
 * tasks, the static `countries-light` frontend optimization).
 */
import fs from "node:fs";
import path from "node:path";

/**
 * `extraFiles` covers callbacks invoked from the worker's top-level `app.ts`
 * — chiefly the shared `registerTripadvisorReferenceRoutes(app, "/{prefix}/v1")`
 * helper that mounts the TripAdvisor reference catalogs on hotels +
 * restaurants + experiences.
 */
export const products = [
  {
    key: "static",
    routesDir: "apps/data-static-api/src/routes",
    workerPrefix: "",
    publicPrefix: "/data/static",
  },
  {
    key: "fx",
    routesDir: "apps/data-fx-api/src/routes",
    workerPrefix: "",
    publicPrefix: "/data/fx",
  },
  {
    key: "seo",
    routesDir: "apps/data-seo-api/src/routes",
    workerPrefix: "/seo",
    publicPrefix: "/data/seo",
  },
  {
    key: "reviews",
    routesDir: "apps/data-reviews-api/src/routes",
    workerPrefix: "/reviews",
    publicPrefix: "/data/reviews",
  },
  {
    key: "hotels",
    routesDir: "apps/data-hotels-api/src/routes",
    extraFiles: ["apps/data-hotels-api/src/app.ts"],
    workerPrefix: "/hotels",
    publicPrefix: "/data/hotels",
  },
  {
    key: "restaurants",
    routesDir: "apps/data-restaurants-api/src/routes",
    extraFiles: ["apps/data-restaurants-api/src/app.ts"],
    workerPrefix: "/restaurants",
    publicPrefix: "/data/restaurants",
  },
  {
    key: "experiences",
    routesDir: "apps/data-experiences-api/src/routes",
    extraFiles: ["apps/data-experiences-api/src/app.ts"],
    workerPrefix: "/experiences",
    publicPrefix: "/data/experiences",
  },
];

function* walkRouteFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkRouteFiles(full);
    else if (entry.isFile() && entry.name.endsWith(".ts")) yield full;
  }
}

function extractBasePathConstants(source) {
  const consts = new Map();
  for (const match of source.matchAll(
    /\b(?:const|let|var)\s+(BASE_PATH|basePath)\s*=\s*"([^"]+)"/g,
  )) {
    consts.set(match[1], match[2]);
  }
  return consts;
}

function extractLiteralAppRoutes(source) {
  return [
    ...source.matchAll(/\bapp\.(get|post|patch|delete|put)\(\s*"([^"]+)"/g),
  ].map(([, method, route]) => ({ method: method.toUpperCase(), route }));
}

function extractIdentifierAppRoutes(source, consts) {
  const routes = [];
  for (const [name, value] of consts) {
    const literal = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // app.post(BASE_PATH, ...)
    for (const match of source.matchAll(
      new RegExp(`\\bapp\\.(get|post|patch|delete|put)\\(\\s*${literal}\\b`, "g"),
    )) {
      routes.push({ method: match[1].toUpperCase(), route: value });
    }
    // app.get(`${BASE_PATH}/:id`, ...) — pull the suffix between the closing
    // brace of the slot and the closing backtick.
    for (const match of source.matchAll(
      new RegExp(
        `\\bapp\\.(get|post|patch|delete|put)\\(\\s*\`\\$\\{${literal}\\}([^\`]*)\``,
        "g",
      ),
    )) {
      routes.push({
        method: match[1].toUpperCase(),
        route: `${value}${match[2]}`,
      });
    }
  }
  return routes;
}

/**
 * `defineAsyncTrio(app, { basePath: "...", ... })` registers three routes:
 *
 *   POST {basePath}
 *   GET  {basePath}
 *   GET  {basePath}/:id
 *
 * Defined identically across the reviews + hotels workers. Restaurants /
 * experiences inline the trio directly so they're picked up by the BASE_PATH
 * + literal extractors above.
 */
function extractDefineAsyncTrioRoutes(source) {
  const routes = [];
  for (const match of source.matchAll(
    /\bdefineAsyncTrio[^(]*\([\s\S]*?basePath:\s*"([^"]+)"/g,
  )) {
    const basePath = match[1];
    routes.push({ method: "POST", route: basePath });
    routes.push({ method: "GET", route: basePath });
    routes.push({ method: "GET", route: `${basePath}/:id` });
  }
  return routes;
}

/**
 * `registerTripadvisorReferenceRoutes(app, "/{prefix}/v1")` mounts three
 * GETs under `<prefix>/tripadvisor/reference/...`. Hard-coded against the
 * helper in voyant-cloud's `packages/data-runtime/src/tripadvisorReference.ts`.
 */
function extractTripadvisorReferenceRoutes(source) {
  const routes = [];
  for (const match of source.matchAll(
    /\bregisterTripadvisorReferenceRoutes\(\s*app\s*,\s*"([^"]+)"/g,
  )) {
    const basePath = match[1];
    routes.push({ method: "GET", route: `${basePath}/tripadvisor/reference/locations` });
    routes.push({
      method: "GET",
      route: `${basePath}/tripadvisor/reference/locations/:countryCode`,
    });
    routes.push({ method: "GET", route: `${basePath}/tripadvisor/reference/languages` });
  }
  return routes;
}

/**
 * The FX manifest defines its routes as `live("/v1/fx/...", …)` calls — extract
 * them as GETs.
 */
function extractFxManifestRoutes(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  return [
    ...source.matchAll(/\b(?:live|history|metadata|quota)\(\s*"(\/v1\/[^"]+)"/g),
  ].map(([, route]) => ({ method: "GET", route }));
}

/**
 * Generic file-local helper expansion. The SEO worker mounts several routes
 * via tiny in-file helpers — `defineLocationsRoute(app, "/path", ...)`,
 * `defineLanguagesRoute(app, "/path", ...)`, etc — that take the route path
 * as a string argument. This walks the file twice:
 *
 *   1. Find every `function defineFoo(app, basePath, ...) { ... }` and the
 *      `app.<method>(...)` calls inside its body, recording the template
 *      pattern relative to `basePath`.
 *   2. Find every call site `defineFoo(app, "<literal-path>", ...)` and
 *      synthesize each helper body's routes with `basePath` substituted.
 *
 * Only handles helpers whose first non-`app` parameter is a string literal
 * route path. Anything else falls through to the literal extractor, which
 * picks up the routes registered with explicit path strings.
 */
function extractInFileHelperRoutes(source) {
  const routes = [];
  // Patterns: `function name(app: App, basePath: string, ...)`
  const helpers = new Map(); // helperName → { pathParamName, patterns: Array<{method, suffix}> }
  // Match `function name<...>(app: App, basePath: string, ...)`.
  // `[\s\S]` instead of `.` so multi-line signatures are matched.
  for (const fnMatch of source.matchAll(
    /\bfunction\s+(\w+)\s*(?:<[^>]+>\s*)?\(\s*app\s*:[^,)]+,\s*(\w+)\s*:\s*string[\s\S]*?\)\s*[:{]/g,
  )) {
    const [, helperName, pathParam] = fnMatch;
    // Find the helper body: from match end to matching close-brace.
    const bodyStart = source.indexOf("{", fnMatch.index + fnMatch[0].length - 1);
    if (bodyStart < 0) continue;
    let depth = 0;
    let bodyEnd = -1;
    for (let i = bodyStart; i < source.length; i++) {
      if (source[i] === "{") depth++;
      else if (source[i] === "}") {
        depth--;
        if (depth === 0) {
          bodyEnd = i;
          break;
        }
      }
    }
    if (bodyEnd < 0) continue;
    const body = source.slice(bodyStart, bodyEnd);

    const patterns = [];
    // app.method(pathParam, ...)
    for (const m of body.matchAll(
      new RegExp(`\\bapp\\.(get|post|patch|delete|put)\\(\\s*${pathParam}\\b`, "g"),
    )) {
      patterns.push({ method: m[1].toUpperCase(), suffix: "" });
    }
    // app.method(`${pathParam}/...`, ...)
    for (const m of body.matchAll(
      new RegExp(
        `\\bapp\\.(get|post|patch|delete|put)\\(\\s*\`\\$\\{${pathParam}\\}([^\`]*)\``,
        "g",
      ),
    )) {
      patterns.push({ method: m[1].toUpperCase(), suffix: m[2] });
    }
    if (patterns.length > 0) {
      helpers.set(helperName, { patterns });
    }
  }

  // Now find every call: helperName(app, "<path>", ...) or
  // helperName<TGen>(app, "<path>", ...).
  for (const [helperName, { patterns }] of helpers) {
    const escaped = helperName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const callMatch of source.matchAll(
      new RegExp(
        `\\b${escaped}\\s*(?:<[^>]+>\\s*)?\\(\\s*app\\s*,\\s*"([^"]+)"`,
        "g",
      ),
    )) {
      const basePath = callMatch[1];
      for (const { method, suffix } of patterns) {
        routes.push({ method, route: `${basePath}${suffix}` });
      }
    }
  }
  return routes;
}

/**
 * Cross-feature SERP search routes mounted by `serp-searches.ts` and
 * `serp-actions.ts`. Both files iterate a hard-coded `SUPPORTED_FEATURES`
 * list and register routes via template literals — too dynamic for the
 * literal-string extractor. Hard-coded against the worker's source so the
 * manifest captures the routes consumers actually see.
 */
const SERP_FEATURES = [
  "organic",
  "ai-mode",
  "maps",
  "autocomplete",
  "ads-advertisers",
  "ads-search",
];
const SERP_ACTION_FEATURES = ["organic", "ai-mode", "maps"];

function extractSerpSearchesRoutes() {
  const routes = [];
  for (const feature of SERP_FEATURES) {
    const base = `/seo/v1/serp/google/${feature}/searches`;
    routes.push({ method: "GET", route: `${base}/:id` });
    routes.push({ method: "GET", route: base });
  }
  return routes;
}

function extractSerpActionsRoutes() {
  const routes = [];
  for (const feature of SERP_ACTION_FEATURES) {
    const base = `/seo/v1/serp/google/${feature}/searches/:id`;
    routes.push({ method: "POST", route: `${base}/screenshot` });
    routes.push({ method: "POST", route: `${base}/ai-summary` });
  }
  return routes;
}

function extractFromFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  if (filePath.endsWith("fx-manifest.ts")) {
    return extractFxManifestRoutes(filePath);
  }
  if (filePath.endsWith("serp-searches.ts")) {
    return extractSerpSearchesRoutes();
  }
  if (filePath.endsWith("serp-actions.ts")) {
    return [
      ...extractLiteralAppRoutes(source),
      ...extractSerpActionsRoutes(),
    ];
  }
  const consts = extractBasePathConstants(source);
  return [
    ...extractLiteralAppRoutes(source),
    ...extractIdentifierAppRoutes(source, consts),
    ...extractDefineAsyncTrioRoutes(source),
    ...extractTripadvisorReferenceRoutes(source),
    ...extractInFileHelperRoutes(source),
  ];
}

function rewriteToPublic(route, product) {
  if (route.includes("/internal/")) return null;
  if (route.endsWith("/health") || route === "/health") return null;
  // DFS postback receivers — gateway-internal, never called by SDK consumers.
  if (route.includes("/postbacks/")) return null;
  // Voyant Async Layer task tracking — exposed in the SEO worker but not part
  // of the public consumer surface (consumers track jobs via the per-feature
  // resources and the keywords-data jobs namespace).
  if (route.includes("/voyant/tasks")) return null;
  // Cross-feature SERP shot-id retrieval — served as a binary R2 stream, not
  // a JSON route worth surfacing as a typed SDK method.
  if (route.includes("/screenshots/")) return null;
  // The static `countries-light` route is a frontend-optimized variant; the
  // canonical shape lives under `/countries`. Not exposed by the SDK.
  if (route.endsWith("/countries-light")) return null;
  if (
    product.workerPrefix &&
    (route === product.workerPrefix ||
      route.startsWith(`${product.workerPrefix}/`))
  ) {
    return `${product.publicPrefix}${route.slice(product.workerPrefix.length)}`;
  }
  if (route.startsWith("/v1/") || route === "/v1") {
    return `${product.publicPrefix}${route}`;
  }
  return null;
}

/**
 * Walk a product's route directory, extract every public route, prefix with
 * the gateway path, dedupe, and return a sorted `METHOD /path` list.
 */
export function extractPublicRoutes(product, voyantCloudRepo) {
  const routes = new Set();
  const files = [];
  const dir = path.join(voyantCloudRepo, product.routesDir);
  if (fs.existsSync(dir)) {
    for (const f of walkRouteFiles(dir)) files.push(f);
  }
  for (const extra of product.extraFiles ?? []) {
    const full = path.join(voyantCloudRepo, extra);
    if (fs.existsSync(full)) files.push(full);
  }
  for (const file of files) {
    for (const { method, route } of extractFromFile(file)) {
      const publicRoute = rewriteToPublic(route, product);
      if (!publicRoute) continue;
      routes.add(`${method} ${publicRoute}`);
    }
  }
  return [...routes].sort();
}
