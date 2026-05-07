import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { extractPublicRoutes, products } from "./lib/route-extraction.mjs";

/**
 * Re-runs the route extraction performed by `sync-route-manifests.mjs` and
 * compares the result against the checked-in manifest. Fails if the two have
 * drifted — i.e. the upstream voyant-cloud routes have changed and
 * `pnpm sync:contracts` was not re-run.
 */

const repoRoot = path.resolve(import.meta.dirname, "..");
const voyantCloudRepo = path.resolve(repoRoot, "../voyant-cloud");
const manifestFile = path.join(repoRoot, "generated", "public-routes.json");

if (!fs.existsSync(manifestFile)) {
  console.log(
    "Skipping API parity verification: generated/public-routes.json missing.",
  );
  process.exit(0);
}

if (
  !products.every((p) => fs.existsSync(path.join(voyantCloudRepo, p.routesDir)))
) {
  console.log(
    "Skipping API parity verification: sibling voyant-cloud route directories not found.",
  );
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));

for (const product of products) {
  const expected = extractPublicRoutes(product, voyantCloudRepo);
  const actual = manifest[product.key] ?? [];

  const missing = expected.filter((r) => !actual.includes(r));
  const stale = actual.filter((r) => !expected.includes(r));

  assert.equal(
    missing.length,
    0,
    `${product.key}: manifest is missing public routes that exist in voyant-cloud:\n${missing.join("\n")}`,
  );
  assert.equal(
    stale.length,
    0,
    `${product.key}: manifest contains routes no longer present in voyant-cloud:\n${stale.join("\n")}`,
  );
}

const totalRoutes = Object.values(manifest).flat().length;
console.log(
  `API parity verification passed for ${products.length} products (${totalRoutes} routes total).`,
);
