import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(import.meta.dirname, "..");
const voyantCloudRepo = path.resolve(repoRoot, "../voyant-cloud");

/**
 * The public Voyant Data API is composed of three sub-products served behind
 * the `apps/api` gateway. The gateway strips the product prefix
 * (`/data/static`, `/data/fx`, `/data/seo`) and forwards the remainder to a
 * private downstream Worker. This script reads the downstream route files
 * and re-prefixes them so the manifest reflects what consumers actually call.
 *
 * SEO is intentionally excluded — it is manifest-driven on the server and
 * exposed by the SDK as a generic typed pass-through, not as individual
 * client methods.
 */
const sources = [
  {
    name: "static",
    files: [
      "apps/data-static-api/src/routes/aircraft.ts",
      "apps/data-static-api/src/routes/airlines.ts",
      "apps/data-static-api/src/routes/airports.ts",
      "apps/data-static-api/src/routes/cities.ts",
      "apps/data-static-api/src/routes/countries.ts",
      "apps/data-static-api/src/routes/reference.ts",
      "apps/data-static-api/src/routes/regions.ts",
    ],
    publicPrefix: "/data/static",
  },
  {
    name: "fx",
    manifestFile: "apps/data-fx-api/src/routes/fx-manifest.ts",
    publicPrefix: "/data/fx",
  },
];

const manifestFile = path.join(repoRoot, "generated", "public-routes.json");

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function joinPath(prefix, suffix) {
  if (!prefix) return suffix;
  if (suffix === "/" || suffix === "") return prefix;
  return `${prefix}${suffix.startsWith("/") ? "" : "/"}${suffix}`;
}

/**
 * Routes registered through `app.<method>("path", ...)` in a Hono module.
 * Internal sync routes (`/v1/internal/*`) are filtered — they are never
 * part of the public consumer surface.
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

/**
 * The FX manifest is an array of entries with a `path` field; each entry
 * generates one Hono GET handler at runtime.
 */
function extractManifestRoutes(filePath, publicPrefix) {
  const source = fs.readFileSync(filePath, "utf8");
  return [...source.matchAll(/[a-z]+\(\s*"(\/v1\/[^"]+)"/g)].map(
    ([, route]) => `GET ${joinPath(publicPrefix, route)}`,
  );
}

const requiredFiles = sources.flatMap((source) =>
  source.files
    ? source.files.map((rel) => path.join(voyantCloudRepo, rel))
    : [path.join(voyantCloudRepo, source.manifestFile)],
);

if (!requiredFiles.every(fileExists)) {
  console.error(
    "Unable to sync route manifests: sibling voyant-cloud route files were not found.",
  );
  process.exit(1);
}

const manifest = {};
for (const source of sources) {
  if (source.files) {
    const routes = source.files.flatMap((rel) =>
      extractAppRoutes(path.join(voyantCloudRepo, rel), source.publicPrefix),
    );
    manifest[source.name] = [...new Set(routes)].sort();
  } else {
    const routes = extractManifestRoutes(
      path.join(voyantCloudRepo, source.manifestFile),
      source.publicPrefix,
    );
    manifest[source.name] = [...new Set(routes)].sort();
  }
}

fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `Synced route manifest to ${path.relative(repoRoot, manifestFile)}.`,
);
