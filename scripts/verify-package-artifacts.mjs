import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const packDir = mkdtempSync(path.join(tmpdir(), "voyant-sdk-pack-"));

const packages = [
  {
    dir: path.join(repoRoot, "packages", "data-sdk"),
    expectedName: "@voyantjs/data-sdk",
  },
];

function packPackage(packageDir) {
  const output = execFileSync("pnpm", ["pack", "--pack-destination", packDir], {
    cwd: packageDir,
    encoding: "utf8",
  }).trim();

  return output.split("\n").at(-1);
}

function readPackedManifest(tarballPath) {
  const raw = execFileSync(
    "tar",
    ["-xOf", tarballPath, "package/package.json"],
    {
      encoding: "utf8",
    },
  );

  return JSON.parse(raw);
}

function readPackedFileList(tarballPath) {
  return execFileSync("tar", ["-tzf", tarballPath], {
    encoding: "utf8",
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function installPackedPackage(appDir, tarballPath, packageName) {
  const [scope, name] = packageName.split("/");
  const scopeDir = path.join(appDir, "node_modules", scope);
  const packageDir = path.join(scopeDir, name);
  const extractDir = mkdtempSync(path.join(tmpdir(), "voyant-sdk-unpack-"));

  mkdirSync(scopeDir, { recursive: true });
  execFileSync("tar", ["-xzf", tarballPath, "-C", extractDir], {
    encoding: "utf8",
  });
  renameSync(path.join(extractDir, "package"), packageDir);
  rmSync(extractDir, { force: true, recursive: true });
}

/**
 * Confirms the public package, when installed, exposes the seven top-level
 * sub-product namespaces (`static`, `fx`, `seo`, `reviews`, `hotels`,
 * `restaurants`, `experiences`) and a representative method on each. The
 * full per-route surface is verified by `verify:client-route-coverage`.
 */
function verifyInstalledImports(tarballs) {
  const appDir = mkdtempSync(path.join(tmpdir(), "voyant-sdk-app-"));

  try {
    mkdirSync(path.join(appDir, "node_modules"), { recursive: true });
    writeFileSync(
      path.join(appDir, "package.json"),
      JSON.stringify(
        {
          name: "voyant-sdk-artifact-test",
          private: true,
          type: "module",
        },
        null,
        2,
      ),
    );

    for (const [packageName, tarballPath] of tarballs) {
      installPackedPackage(appDir, tarballPath, packageName);
    }

    execFileSync(
      "node",
      [
        "--input-type=module",
        "-e",
        `
          import assert from "node:assert/strict";
          import { createVoyantDataClient } from "@voyantjs/data-sdk";

          const data = createVoyantDataClient({ apiKey: "data_key" });

          // air
          assert.equal(typeof data.air.airports.get, "function");
          assert.equal(typeof data.air.airports.search, "function");
          assert.equal(typeof data.air.airports.nearby, "function");
          assert.equal(typeof data.air.airlines.get, "function");
          assert.equal(typeof data.air.airlines.search, "function");
          assert.equal(typeof data.air.aircraft.list, "function");
          assert.equal(typeof data.air.aircraft.get, "function");

          // geo (places + reference)
          assert.equal(typeof data.geo.countries.list, "function");
          assert.equal(typeof data.geo.reference.languages.list, "function");
          assert.equal(typeof data.geo.reference.currencies.get, "function");
          assert.equal(typeof data.geo.reference.timezones.list, "function");

          // fx
          assert.equal(typeof data.fx.latest, "function");
          assert.equal(typeof data.fx.pair, "function");
          assert.equal(typeof data.fx.enriched, "function");
          assert.equal(typeof data.fx.history, "function");
          assert.equal(typeof data.fx.codes, "function");
          assert.equal(typeof data.fx.quota, "function");

          // seo
          assert.equal(typeof data.seo.serp.google.organic.searches.create, "function");
          assert.equal(typeof data.seo.serp.google.organic.searches.screenshot, "function");
          assert.equal(typeof data.seo.keywordsData.googleAds.searchVolume.create, "function");
          assert.equal(typeof data.seo.aiOptimization.aiKeywordData.keywordVolumes.create, "function");
          assert.equal(typeof data.seo.backlinks.summary.create, "function");
          assert.equal(typeof data.seo.dataforseoLabs.google.keywordOverview.create, "function");
          assert.equal(typeof data.seo.onPage.siteAudits.create, "function");
          assert.equal(typeof data.seo.businessData.google.myBusinessInfo.create, "function");
          assert.equal(typeof data.seo.contentAnalysis.search.create, "function");
          assert.equal(typeof data.seo.domainAnalytics.whois.list.create, "function");

          // verticals
          assert.equal(typeof data.reviews.google.reviews.create, "function");
          assert.equal(typeof data.reviews.trustpilot.search.create, "function");
          assert.equal(typeof data.hotels.google.hotelSearches.create, "function");
          assert.equal(typeof data.hotels.tripadvisor.searches.create, "function");
          assert.equal(typeof data.hotels.tripadvisor.reference.locations.list, "function");
          assert.equal(typeof data.restaurants.tripadvisor.searches.create, "function");
          assert.equal(typeof data.experiences.tripadvisor.searches.create, "function");
        `,
      ],
      {
        cwd: appDir,
        encoding: "utf8",
      },
    );
  } finally {
    rmSync(appDir, { force: true, recursive: true });
  }
}

/**
 * Spot-checks that key public types resolve and that representative client
 * methods type-check end-to-end. Each sub-product namespace gets one
 * generic-shape assertion so future shape changes break the build loudly.
 */
function verifyInstalledTypecheck(tarballs) {
  const appDir = mkdtempSync(path.join(tmpdir(), "voyant-sdk-types-"));

  try {
    mkdirSync(path.join(appDir, "node_modules"), { recursive: true });
    writeFileSync(
      path.join(appDir, "package.json"),
      JSON.stringify(
        {
          name: "voyant-sdk-types-test",
          private: true,
          type: "module",
        },
        null,
        2,
      ),
    );

    for (const [packageName, tarballPath] of tarballs) {
      installPackedPackage(appDir, tarballPath, packageName);
    }

    writeFileSync(
      path.join(appDir, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            module: "NodeNext",
            moduleResolution: "NodeNext",
            noEmit: true,
            strict: true,
            target: "ES2022",
          },
          include: ["index.ts"],
        },
        null,
        2,
      ),
    );

    writeFileSync(
      path.join(appDir, "index.ts"),
      `
        import {
          createVoyantDataClient,
          VoyantDataClient,
          type Aircraft,
          type AircraftCategory,
          type Airline,
          type Airport,
          type AirportType,
          type CurrencyEntry,
          type FxLatestResponse,
          type FxPairResponse,
          type GoogleHotelSearchesRequest,
          type GoogleQaRequest,
          type GoogleReviewsRequest,
          type LanguageEntry,
          type ListResponse,
          type Search,
          type SingleResponse,
          type TimezoneEntry,
          type TripadvisorSearchRequest,
          type TrustpilotSearchRequest,
          type VoyantDataClientOptions,
        } from "@voyantjs/data-sdk";

        const client: VoyantDataClient = createVoyantDataClient({
          apiKey: "data_key",
        } satisfies VoyantDataClientOptions);

        // air
        const airportPromise: Promise<SingleResponse<Airport>> =
          client.air.airports.get("LHR");
        const airlinePromise: Promise<SingleResponse<Airline>> =
          client.air.airlines.get("BA");
        const aircraftPromise: Promise<SingleResponse<Aircraft>> =
          client.air.aircraft.get("359");

        // geo reference (languages / currencies / timezones)
        const languagesPromise: Promise<ListResponse<LanguageEntry>> =
          client.geo.reference.languages.list();
        const currenciesPromise: Promise<ListResponse<CurrencyEntry>> =
          client.geo.reference.currencies.list();
        const timezonesPromise: Promise<ListResponse<TimezoneEntry>> =
          client.geo.reference.timezones.list();

        // fx
        const fxLatestPromise: Promise<FxLatestResponse> = client.fx.latest("EUR");
        const fxPairPromise: Promise<FxPairResponse> = client.fx.pair("EUR", "USD", 100);

        // seo (typed namespaces)
        const serpCreatePromise: Promise<SingleResponse<Search>> =
          client.seo.serp.google.organic.searches.create({} as never);

        // verticals — opaque request envelopes
        const googleReviewsReq: GoogleReviewsRequest = {} as GoogleReviewsRequest;
        const googleQaReq: GoogleQaRequest = {} as GoogleQaRequest;
        const trustpilotReq: TrustpilotSearchRequest = {} as TrustpilotSearchRequest;
        const hotelsReq: GoogleHotelSearchesRequest = {} as GoogleHotelSearchesRequest;
        const tripReq: TripadvisorSearchRequest = {} as TripadvisorSearchRequest;
        void client.reviews.google.reviews.create(googleReviewsReq);
        void client.reviews.google.qa.run(googleQaReq);
        void client.reviews.trustpilot.search.create(trustpilotReq);
        void client.hotels.google.hotelSearches.create(hotelsReq);
        void client.hotels.tripadvisor.searches.create(tripReq);
        void client.restaurants.tripadvisor.searches.create(tripReq);
        void client.experiences.tripadvisor.searches.create(tripReq);

        const airportType: AirportType = "large_airport";
        const aircraftCategory: AircraftCategory = "wide_body";

        void airportPromise;
        void airlinePromise;
        void aircraftPromise;
        void languagesPromise;
        void currenciesPromise;
        void timezonesPromise;
        void fxLatestPromise;
        void fxPairPromise;
        void serpCreatePromise;
        void airportType;
        void aircraftCategory;
      `,
    );

    execFileSync(
      process.execPath,
      [
        path.join(repoRoot, "node_modules", "typescript", "bin", "tsc"),
        "-p",
        appDir,
      ],
      {
        cwd: appDir,
        encoding: "utf8",
      },
    );
  } finally {
    rmSync(appDir, { force: true, recursive: true });
  }
}

try {
  const tarballs = new Map();

  for (const pkg of packages) {
    const tarballPath = packPackage(pkg.dir);
    const manifest = readPackedManifest(tarballPath);
    const files = readPackedFileList(tarballPath);
    tarballs.set(pkg.expectedName, tarballPath);

    assert.equal(manifest.name, pkg.expectedName);
    assert.equal(manifest.main, "./dist/index.js");
    assert.equal(manifest.types, "./dist/index.d.ts");
    assert.equal(manifest.publishConfig?.access, "public");
    assert.equal(manifest.exports?.["."].import, "./dist/index.js");
    assert.equal(manifest.exports?.["."].types, "./dist/index.d.ts");

    assert.deepEqual(manifest.bundleDependencies, ["@voyant-sdk/sdk-core"]);
    assert.equal(manifest.dependencies?.["@voyant-sdk/sdk-core"], "0.1.0");

    assert.ok(files.includes("package/README.md"));
    assert.ok(files.includes("package/package.json"));
    assert.ok(files.includes("package/dist/index.js"));
    assert.ok(files.includes("package/dist/index.d.ts"));
    assert.ok(
      files.includes("package/node_modules/@voyant-sdk/sdk-core/package.json"),
    );
    assert.ok(
      files.includes("package/node_modules/@voyant-sdk/sdk-core/dist/index.js"),
    );
    assert.ok(
      files.includes(
        "package/node_modules/@voyant-sdk/sdk-core/dist/index.d.ts",
      ),
    );

    const hasSrcFiles = files.some((file) => file.startsWith("package/src/"));
    assert.equal(hasSrcFiles, false);
  }

  verifyInstalledImports(tarballs);
  verifyInstalledTypecheck(tarballs);

  console.log("Package artifact verification passed.");
} finally {
  rmSync(packDir, { force: true, recursive: true });
}
