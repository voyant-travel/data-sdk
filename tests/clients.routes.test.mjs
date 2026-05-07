import assert from "node:assert/strict";
import test from "node:test";

import { createVoyantDataClient } from "../packages/data-sdk/dist/index.js";

function createRecorder({ responseBody = { data: [], totalCount: 0 } } = {}) {
  const calls = [];

  return {
    calls,
    fetch: async (url, init) => {
      calls.push({
        body: init?.body,
        headers: new Headers(init?.headers),
        method: init?.method ?? "GET",
        url: String(url),
      });

      return new Response(JSON.stringify(responseBody), {
        headers: { "content-type": "application/json" },
        status: 200,
      });
    },
  };
}

test("data client composes static country routes correctly", async () => {
  const recorder = createRecorder({
    responseBody: { data: [], totalCount: 0 },
  });
  const client = createVoyantDataClient({
    apiKey: "static_key",
    fetch: recorder.fetch,
  });

  const list = await client.countries.list({ region: "Europe" });
  await client.countries.get("RO");
  await client.countries.listLight();

  // List endpoints preserve the full envelope rather than auto-unwrapping.
  assert.deepEqual(list, { data: [], totalCount: 0 });

  assert.equal(
    recorder.calls[0].url,
    "https://api.voyantjs.com/data/static/v1/countries?region=Europe",
  );
  assert.equal(recorder.calls[0].method, "GET");
  assert.equal(
    recorder.calls[0].headers.get("authorization"),
    "Bearer static_key",
  );

  assert.equal(
    recorder.calls[1].url,
    "https://api.voyantjs.com/data/static/v1/countries/RO",
  );
  assert.equal(
    recorder.calls[2].url,
    "https://api.voyantjs.com/data/static/v1/countries-light",
  );
});

test("data client composes airport search and nearby correctly", async () => {
  const recorder = createRecorder();
  const client = createVoyantDataClient({
    apiKey: "static_key",
    fetch: recorder.fetch,
  });

  await client.airports.get("LHR");
  await client.airports.search({
    q: "heathrow",
    country: "GB",
    scheduledServiceOnly: true,
    limit: 5,
  });
  await client.airports.nearby({
    latitude: 51.5,
    longitude: -0.1,
    radiusKm: 50,
  });

  assert.equal(
    recorder.calls[0].url,
    "https://api.voyantjs.com/data/static/v1/airports/LHR",
  );

  const searchUrl = new URL(recorder.calls[1].url);
  assert.equal(searchUrl.pathname, "/data/static/v1/airports/search");
  assert.equal(searchUrl.searchParams.get("q"), "heathrow");
  assert.equal(searchUrl.searchParams.get("country"), "GB");
  assert.equal(searchUrl.searchParams.get("scheduledServiceOnly"), "true");
  assert.equal(searchUrl.searchParams.get("limit"), "5");

  const nearbyUrl = new URL(recorder.calls[2].url);
  assert.equal(nearbyUrl.pathname, "/data/static/v1/airports/nearby");
  assert.equal(nearbyUrl.searchParams.get("latitude"), "51.5");
  assert.equal(nearbyUrl.searchParams.get("longitude"), "-0.1");
  assert.equal(nearbyUrl.searchParams.get("radiusKm"), "50");
});

test("data client composes city search and nearby correctly", async () => {
  const recorder = createRecorder();
  const client = createVoyantDataClient({
    apiKey: "static_key",
    fetch: recorder.fetch,
  });

  await client.cities.get("2643743");
  await client.cities.search({ q: "London", country: "GB" });
  await client.cities.nearby({
    latitude: 51.5,
    longitude: -0.1,
    radiusKm: 25,
  });

  assert.equal(
    recorder.calls[0].url,
    "https://api.voyantjs.com/data/static/v1/cities/2643743",
  );
  assert.equal(
    recorder.calls[1].url,
    "https://api.voyantjs.com/data/static/v1/cities/search?q=London&country=GB",
  );
  assert.equal(
    recorder.calls[2].url,
    "https://api.voyantjs.com/data/static/v1/cities/nearby?latitude=51.5&longitude=-0.1&radiusKm=25",
  );
});

test("data client composes airline, aircraft, and reference routes", async () => {
  const recorder = createRecorder();
  const client = createVoyantDataClient({
    apiKey: "static_key",
    fetch: recorder.fetch,
  });

  await client.airlines.get("BA");
  await client.airlines.search({ q: "british", activeOnly: true });
  await client.aircraft.list({ category: "wide_body" });
  await client.aircraft.get("359");
  await client.languages.list();
  await client.languages.get("en");
  await client.currencies.list();
  await client.currencies.get("USD");
  await client.timezones.list();
  await client.geographicRegions.list();
  await client.geographicRegions.get("eu");
  await client.regions.list({ country: "US", type: "state" });
  await client.regions.get("US-CA");

  const expectedPaths = [
    "/data/static/v1/airlines/BA",
    "/data/static/v1/airlines/search?q=british&activeOnly=true",
    "/data/static/v1/aircraft?category=wide_body",
    "/data/static/v1/aircraft/359",
    "/data/static/v1/languages",
    "/data/static/v1/languages/en",
    "/data/static/v1/currencies",
    "/data/static/v1/currencies/USD",
    "/data/static/v1/timezones",
    "/data/static/v1/geographic-regions",
    "/data/static/v1/geographic-regions/eu",
    "/data/static/v1/regions?country=US&type=state",
    "/data/static/v1/regions/US-CA",
  ];

  for (const [index, expectedPath] of expectedPaths.entries()) {
    assert.equal(
      recorder.calls[index].url,
      `https://api.voyantjs.com${expectedPath}`,
      `call ${index} should target ${expectedPath}`,
    );
  }
});

test("data client composes FX routes (including double-fx prefix)", async () => {
  const recorder = createRecorder({
    responseBody: { result: "success", base_code: "USD" },
  });
  const client = createVoyantDataClient({
    apiKey: "fx_key",
    fetch: recorder.fetch,
  });

  await client.fx.latest("USD");
  await client.fx.pair("EUR", "USD");
  await client.fx.pair("EUR", "USD", 100);
  await client.fx.enriched("EUR", "USD");
  await client.fx.history({ base: "EUR", year: 2024, month: 1, day: 15 });
  await client.fx.history({
    base: "EUR",
    year: 2024,
    month: 1,
    day: 15,
    amount: 250,
  });
  await client.fx.codes();
  await client.fx.quota();

  const expected = [
    "/data/fx/v1/fx/latest/USD",
    "/data/fx/v1/fx/pair/EUR/USD",
    "/data/fx/v1/fx/pair/EUR/USD/100",
    "/data/fx/v1/fx/enriched/EUR/USD",
    "/data/fx/v1/fx/history/EUR/2024/1/15",
    "/data/fx/v1/fx/history/EUR/2024/1/15/250",
    "/data/fx/v1/fx/codes",
    "/data/fx/v1/fx/quota",
  ];

  for (const [index, path] of expected.entries()) {
    assert.equal(
      recorder.calls[index].url,
      `https://api.voyantjs.com${path}`,
      `fx call ${index} should target ${path}`,
    );
  }
});

test("data client composes SEO pass-through routes", async () => {
  const recorder = createRecorder({
    responseBody: { tasks: [] },
  });
  const client = createVoyantDataClient({
    apiKey: "seo_key",
    fetch: recorder.fetch,
  });

  await client.seo.get("/serp/google/locations");
  await client.seo.post("/serp/google/organic/live/regular", [
    { keyword: "voyant" },
  ]);
  await client.seo.request("DELETE", "/some/cleanup/endpoint");

  assert.equal(
    recorder.calls[0].url,
    "https://api.voyantjs.com/data/seo/v1/serp/google/locations",
  );
  assert.equal(recorder.calls[0].method, "GET");

  assert.equal(
    recorder.calls[1].url,
    "https://api.voyantjs.com/data/seo/v1/serp/google/organic/live/regular",
  );
  assert.equal(recorder.calls[1].method, "POST");
  assert.deepEqual(JSON.parse(recorder.calls[1].body), [
    { keyword: "voyant" },
  ]);

  assert.equal(
    recorder.calls[2].url,
    "https://api.voyantjs.com/data/seo/v1/some/cleanup/endpoint",
  );
  assert.equal(recorder.calls[2].method, "DELETE");
});

test("data client filters undefined query params", async () => {
  const recorder = createRecorder();
  const client = createVoyantDataClient({
    apiKey: "static_key",
    fetch: recorder.fetch,
  });

  await client.countries.list({});
  await client.countries.list({ region: undefined });

  assert.equal(
    recorder.calls[0].url,
    "https://api.voyantjs.com/data/static/v1/countries",
  );
  assert.equal(
    recorder.calls[1].url,
    "https://api.voyantjs.com/data/static/v1/countries",
  );
});
