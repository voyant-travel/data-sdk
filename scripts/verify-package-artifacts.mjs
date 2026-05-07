import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
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
  const raw = execFileSync("tar", ["-xOf", tarballPath, "package/package.json"], {
    encoding: "utf8",
  });

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
  execFileSync("tar", ["-xzf", tarballPath, "-C", extractDir], { encoding: "utf8" });
  renameSync(path.join(extractDir, "package"), packageDir);
  rmSync(extractDir, { force: true, recursive: true });
}

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

          assert.equal(typeof data.countries.list, "function");
          assert.equal(typeof data.countries.get, "function");
          assert.equal(typeof data.countries.listLight, "function");
          assert.equal(typeof data.regions.list, "function");
          assert.equal(typeof data.regions.get, "function");
          assert.equal(typeof data.cities.search, "function");
          assert.equal(typeof data.cities.nearby, "function");
          assert.equal(typeof data.cities.get, "function");
          assert.equal(typeof data.airports.search, "function");
          assert.equal(typeof data.airports.nearby, "function");
          assert.equal(typeof data.airports.get, "function");
          assert.equal(typeof data.airlines.search, "function");
          assert.equal(typeof data.airlines.get, "function");
          assert.equal(typeof data.aircraft.list, "function");
          assert.equal(typeof data.aircraft.get, "function");
          assert.equal(typeof data.languages.list, "function");
          assert.equal(typeof data.languages.get, "function");
          assert.equal(typeof data.currencies.list, "function");
          assert.equal(typeof data.currencies.get, "function");
          assert.equal(typeof data.timezones.list, "function");
          assert.equal(typeof data.geographicRegions.list, "function");
          assert.equal(typeof data.geographicRegions.get, "function");
          assert.equal(typeof data.fx.latest, "function");
          assert.equal(typeof data.fx.pair, "function");
          assert.equal(typeof data.fx.enriched, "function");
          assert.equal(typeof data.fx.history, "function");
          assert.equal(typeof data.fx.codes, "function");
          assert.equal(typeof data.fx.quota, "function");
          assert.equal(typeof data.seo.request, "function");
          assert.equal(typeof data.seo.get, "function");
          assert.equal(typeof data.seo.post, "function");
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
          type City,
          type Country,
          type Currency,
          type FxResponse,
          type GeographicRegion,
          type Language,
          type LightCountry,
          type ListResponse,
          type NearbyAirport,
          type NearbyCity,
          type Region,
          type SeoTaskResponse,
          type SingleResponse,
          type Timezone,
          type VoyantDataClientOptions,
        } from "@voyantjs/data-sdk";

        const client: VoyantDataClient = createVoyantDataClient({
          apiKey: "data_key",
        } satisfies VoyantDataClientOptions);

        const countriesPromise: Promise<ListResponse<Country>> =
          client.countries.list({ region: "Europe" });
        const countryPromise: Promise<SingleResponse<Country>> =
          client.countries.get("RO");
        const lightCountriesPromise: Promise<ListResponse<LightCountry>> =
          client.countries.listLight();
        const regionPromise: Promise<SingleResponse<Region>> =
          client.regions.get("US-CA");
        const cityPromise: Promise<SingleResponse<City>> =
          client.cities.get("2643743");
        const nearbyCitiesPromise: Promise<ListResponse<NearbyCity>> =
          client.cities.nearby({ latitude: 51.5, longitude: -0.1, radiusKm: 25 });
        const airportPromise: Promise<SingleResponse<Airport>> =
          client.airports.get("LHR");
        const nearbyAirportsPromise: Promise<ListResponse<NearbyAirport>> =
          client.airports.nearby({ latitude: 51.5, longitude: -0.1, radiusKm: 50 });
        const airlinePromise: Promise<SingleResponse<Airline>> =
          client.airlines.get("BA");
        const aircraftPromise: Promise<SingleResponse<Aircraft>> =
          client.aircraft.get("359");
        const languagesPromise: Promise<ListResponse<Language>> =
          client.languages.list();
        const currenciesPromise: Promise<ListResponse<Currency>> =
          client.currencies.list();
        const timezonesPromise: Promise<ListResponse<Timezone>> =
          client.timezones.list();
        const geoRegionsPromise: Promise<ListResponse<GeographicRegion>> =
          client.geographicRegions.list();

        const fxLatestPromise: Promise<FxResponse> = client.fx.latest("EUR");
        const fxPairPromise: Promise<FxResponse> = client.fx.pair("EUR", "USD", 100);
        const fxHistoryPromise: Promise<FxResponse> = client.fx.history({
          base: "EUR",
          year: 2024,
          month: 1,
          day: 15,
        });

        const seoPromise: Promise<SeoTaskResponse> = client.seo.get(
          "/serp/google/locations",
        );

        const airportType: AirportType = "large_airport";
        const aircraftCategory: AircraftCategory = "wide_body";

        void countriesPromise;
        void countryPromise;
        void lightCountriesPromise;
        void regionPromise;
        void cityPromise;
        void nearbyCitiesPromise;
        void airportPromise;
        void nearbyAirportsPromise;
        void airlinePromise;
        void aircraftPromise;
        void languagesPromise;
        void currenciesPromise;
        void timezonesPromise;
        void geoRegionsPromise;
        void fxLatestPromise;
        void fxPairPromise;
        void fxHistoryPromise;
        void seoPromise;
        void airportType;
        void aircraftCategory;
      `,
    );

    execFileSync(
      process.execPath,
      [path.join(repoRoot, "node_modules", "typescript", "bin", "tsc"), "-p", appDir],
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
    assert.ok(files.includes("package/node_modules/@voyant-sdk/sdk-core/package.json"));
    assert.ok(files.includes("package/node_modules/@voyant-sdk/sdk-core/dist/index.js"));
    assert.ok(files.includes("package/node_modules/@voyant-sdk/sdk-core/dist/index.d.ts"));

    const hasSrcFiles = files.some((file) => file.startsWith("package/src/"));
    assert.equal(hasSrcFiles, false);
  }

  verifyInstalledImports(tarballs);
  verifyInstalledTypecheck(tarballs);

  console.log("Package artifact verification passed.");
} finally {
  rmSync(packDir, { force: true, recursive: true });
}
