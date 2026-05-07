import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(import.meta.dirname, "..");
const voyantCloudRepo = path.resolve(repoRoot, "../voyant-cloud");
const manifestFile = path.join(repoRoot, "generated", "public-routes.json");

const STATIC_ROUTE_FILES = [
  "apps/data-static-api/src/routes/aircraft.ts",
  "apps/data-static-api/src/routes/airlines.ts",
  "apps/data-static-api/src/routes/airports.ts",
  "apps/data-static-api/src/routes/cities.ts",
  "apps/data-static-api/src/routes/countries.ts",
  "apps/data-static-api/src/routes/reference.ts",
  "apps/data-static-api/src/routes/regions.ts",
];

const FX_MANIFEST_FILE = "apps/data-fx-api/src/routes/fx-manifest.ts";

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function joinPath(prefix, suffix) {
  if (!prefix) return suffix;
  if (suffix === "/" || suffix === "") return prefix;
  return `${prefix}${suffix.startsWith("/") ? "" : "/"}${suffix}`;
}

/**
 * Same extraction shape as `sync-route-manifests.mjs` so the two scripts
 * agree on what counts as a public route.
 */
function extractAppRoutes(filePath, publicPrefix) {
  const source = fs.readFileSync(filePath, "utf8");
  return [
    ...source.matchAll(/\bapp\.(get|post|patch|delete|put)\(\s*"([^"]+)"/gs),
  ]
    .filter(([, , route]) => !route.includes("/v1/internal"))
    .map(
      ([, method, route]) =>
        `${method.toUpperCase()} ${joinPath(publicPrefix, route)}`,
    );
}

function extractManifestRoutes(filePath, publicPrefix) {
  const source = fs.readFileSync(filePath, "utf8");
  return [...source.matchAll(/[a-z]+\(\s*"(\/v1\/[^"]+)"/g)].map(
    ([, route]) => `GET ${joinPath(publicPrefix, route)}`,
  );
}

function verifyManifest(label, actualRoutes, expectedRoutes) {
  const missingRoutes = [...actualRoutes]
    .filter((route) => !expectedRoutes.has(route))
    .sort();
  const staleRoutes = [...expectedRoutes]
    .filter((route) => !actualRoutes.has(route))
    .sort();

  assert.equal(
    missingRoutes.length,
    0,
    `${label} SDK is missing public routes from voyant-cloud:\n${missingRoutes.join("\n")}`,
  );

  assert.equal(
    staleRoutes.length,
    0,
    `${label} SDK parity manifest contains routes no longer present in voyant-cloud:\n${staleRoutes.join("\n")}`,
  );
}

const requiredFiles = [
  manifestFile,
  ...STATIC_ROUTE_FILES.map((rel) => path.join(voyantCloudRepo, rel)),
  path.join(voyantCloudRepo, FX_MANIFEST_FILE),
];

if (!requiredFiles.every(fileExists)) {
  console.log(
    "Skipping API parity verification: sibling voyant-cloud route files not found.",
  );
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));

const actualStaticRoutes = new Set(
  STATIC_ROUTE_FILES.flatMap((rel) =>
    extractAppRoutes(path.join(voyantCloudRepo, rel), "/data/static"),
  ),
);
const actualFxRoutes = new Set(
  extractManifestRoutes(
    path.join(voyantCloudRepo, FX_MANIFEST_FILE),
    "/data/fx",
  ),
);

verifyManifest("Static", actualStaticRoutes, new Set(manifest.static));
verifyManifest("FX", actualFxRoutes, new Set(manifest.fx));

console.log("API parity verification passed for Static and FX routes.");
