import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { extractPublicRoutes, products } from "./lib/route-extraction.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const voyantCloudRepo = path.resolve(repoRoot, "../voyant-cloud");
const manifestFile = path.join(repoRoot, "generated", "public-routes.json");

const missing = products.filter(
  (p) => !fs.existsSync(path.join(voyantCloudRepo, p.routesDir)),
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
  manifest[product.key] = extractPublicRoutes(product, voyantCloudRepo);
}

fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

const summary = Object.entries(manifest)
  .map(([key, routes]) => `  ${key.padEnd(12)} ${routes.length}`)
  .join("\n");
console.log(
  `Synced route manifest to ${path.relative(repoRoot, manifestFile)}.\n${summary}`,
);
