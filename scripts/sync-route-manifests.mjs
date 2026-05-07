import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(import.meta.dirname, "..");
const voyantCloudRepo = path.resolve(repoRoot, "../voyant-cloud");

/**
 * The public Voyant Data API is composed of seven sub-products served behind
 * the `apps/api` gateway at `api.voyantjs.com/data/{product}/v1/*`. Each
 * sub-product is a private Cloudflare Worker; the gateway strips the
 * `/data/{product}` prefix and forwards to the worker.
 *
 * This script reads each worker's route files and re-prefixes any literal
 * `app.<method>("…")` registrations into their public form. Routes registered
 * through dynamic helpers (e.g. `app.post(opts.basePath, …)` or proxy
 * manifests) are not extractable from text and are tolerated as gaps —
 * `verify-api-parity` only enforces what's parseable.
 *
 * Internal admin routes (`/internal/...`) are skipped: they are gated by
 * `INTERNAL_API_KEY` and never exposed to public consumers.
 */
const products = [
  {
    key: "static",
    routesDir: "apps/data-static-api/src/routes",
    /** Static worker mounts at `/v1/...`. */
    workerPrefix: "",
    publicPrefix: "/data/static",
  },
  {
    key: "fx",
    /** FX is manifest-driven; entries land at `/v1/fx/...`. */
    routesDir: "apps/data-fx-api/src/routes",
    workerPrefix: "",
    publicPrefix: "/data/fx",
    extra: ["apps/data-fx-api/src/routes/fx-manifest.ts"],
  },
  {
    key: "seo",
    routesDir: "apps/data-seo-api/src/routes",
    /** SEO worker mounts at `/seo/v1/...`. */
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
    workerPrefix: "/hotels",
    publicPrefix: "/data/hotels",
  },
  {
    key: "restaurants",
    routesDir: "apps/data-restaurants-api/src/routes",
    workerPrefix: "/restaurants",
    publicPrefix: "/data/restaurants",
  },
  {
    key: "experiences",
    routesDir: "apps/data-experiences-api/src/routes",
    workerPrefix: "/experiences",
    publicPrefix: "/data/experiences",
  },
];

const manifestFile = path.join(repoRoot, "generated", "public-routes.json");

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function* walkRouteFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkRouteFiles(full);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      yield full;
    }
  }
}

function extractLiteralAppRoutes(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  return [
    ...source.matchAll(/\bapp\.(get|post|patch|delete|put)\(\s*"([^"]+)"/g),
  ].map(([, method, route]) => ({ method: method.toUpperCase(), route }));
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

const missing = products.filter(
  (p) => !fileExists(path.join(voyantCloudRepo, p.routesDir)),
);
if (missing.length > 0) {
  console.error(
    `Unable to sync route manifests: missing voyant-cloud route directories:\n${missing
      .map((p) => `  - ${p.routesDir}`)
      .join("\n")}`,
  );
  process.exit(1);
}

const manifest = {};

for (const product of products) {
  const routes = new Set();
  const dir = path.join(voyantCloudRepo, product.routesDir);
  for (const file of walkRouteFiles(dir)) {
    const isFxManifest = file.endsWith("fx-manifest.ts");
    const extracted = isFxManifest
      ? extractFxManifestRoutes(file)
      : extractLiteralAppRoutes(file);
    for (const { method, route } of extracted) {
      const publicRoute = rewriteToPublic(route, product);
      if (!publicRoute) continue;
      routes.add(`${method} ${publicRoute}`);
    }
  }
  manifest[product.key] = [...routes].sort();
}

fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

const summary = Object.entries(manifest)
  .map(([key, routes]) => `  ${key.padEnd(12)} ${routes.length}`)
  .join("\n");
console.log(
  `Synced route manifest to ${path.relative(repoRoot, manifestFile)}.\n${summary}`,
);
