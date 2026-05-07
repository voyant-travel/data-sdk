import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

/**
 * Re-runs the route extraction performed by `sync-route-manifests.mjs` and
 * compares the result against the checked-in manifest. Fails if the two have
 * drifted — i.e. the upstream voyant-cloud routes have changed and
 * `pnpm sync:contracts` was not re-run.
 */

const repoRoot = path.resolve(import.meta.dirname, "..");
const voyantCloudRepo = path.resolve(repoRoot, "../voyant-cloud");
const manifestFile = path.join(repoRoot, "generated", "public-routes.json");

const products = [
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

function fileExists(p) {
  return fs.existsSync(p);
}

function* walkRouteFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkRouteFiles(full);
    else if (entry.isFile() && entry.name.endsWith(".ts")) yield full;
  }
}

function extractLiteralAppRoutes(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  return [
    ...source.matchAll(/\bapp\.(get|post|patch|delete|put)\(\s*"([^"]+)"/g),
  ].map(([, method, route]) => ({ method: method.toUpperCase(), route }));
}

function extractFxManifestRoutes(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  return [
    ...source.matchAll(
      /\b(?:live|history|metadata|quota)\(\s*"(\/v1\/[^"]+)"/g,
    ),
  ].map(([, route]) => ({ method: "GET", route }));
}

function rewriteToPublic(route, product) {
  if (route.includes("/internal/")) return null;
  if (route.endsWith("/health") || route === "/health") return null;
  if (route.includes("/postbacks/")) return null;
  if (route.includes("/voyant/tasks")) return null;
  if (route.includes("/screenshots/")) return null;
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

function extractPublicRoutes(product) {
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
  return [...routes].sort();
}

if (!fileExists(manifestFile)) {
  console.log(
    "Skipping API parity verification: generated/public-routes.json missing.",
  );
  process.exit(0);
}

if (
  !products.every((p) =>
    fileExists(path.join(voyantCloudRepo, p.routesDir)),
  )
) {
  console.log(
    "Skipping API parity verification: sibling voyant-cloud route directories not found.",
  );
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));

for (const product of products) {
  const expected = extractPublicRoutes(product);
  const actual = manifest[product.key] ?? [];

  const missing = expected.filter((r) => !actual.includes(r));
  const stale = actual.filter((r) => !expected.includes(r));

  assert.equal(
    missing.length,
    0,
    `${product.key}: manifest is missing public routes that exist in voyant-cloud:\n${missing.join(
      "\n",
    )}`,
  );
  assert.equal(
    stale.length,
    0,
    `${product.key}: manifest contains routes no longer present in voyant-cloud:\n${stale.join(
      "\n",
    )}`,
  );
}

const totalRoutes = Object.values(manifest).flat().length;
console.log(
  `API parity verification passed for ${products.length} products (${totalRoutes} routes total).`,
);
