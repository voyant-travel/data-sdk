import assert from "node:assert/strict";
import test from "node:test";

import { createVoyantDataClient } from "../packages/data-sdk/dist/index.js";

/**
 * The data client is namespaced per sub-product (`air`, `fx`, `seo`,
 * `reviews`, `hotels`, `restaurants`, `experiences`, `geo`). These smoke tests
 * record the URL + method seen by the transport for one representative
 * call in each top-level namespace. They do not exhaust every method —
 * `verify-client-route-coverage` enforces per-route parity against the
 * generated public-routes manifest.
 */

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

test("air — composes airport, airline, and aircraft routes", async () => {
  const recorder = createRecorder({
    responseBody: { data: [], totalCount: 0 },
  });
  const client = createVoyantDataClient({
    apiKey: "air_key",
    fetch: recorder.fetch,
  });

  await client.air.airports.search({
    q: "heathrow",
    country: "GB",
    scheduledServiceOnly: true,
    limit: 5,
  });
  await client.air.airports.nearby({
    latitude: 51.5,
    longitude: -0.1,
    radiusKm: 50,
  });
  await client.air.airports.get("LHR");
  await client.air.airlines.search({ q: "british", activeOnly: true });
  await client.air.airlines.get("BA");
  await client.air.aircraft.list({ category: "wide_body" });
  await client.air.aircraft.get("359");

  const expected = [
    "GET /data/air/v1/airports/search?q=heathrow&country=GB&scheduledServiceOnly=true&limit=5",
    "GET /data/air/v1/airports/nearby?latitude=51.5&longitude=-0.1&radiusKm=50",
    "GET /data/air/v1/airports/LHR",
    "GET /data/air/v1/airlines/search?q=british&activeOnly=true",
    "GET /data/air/v1/airlines/BA",
    "GET /data/air/v1/aircraft?category=wide_body",
    "GET /data/air/v1/aircraft/359",
  ];

  for (const [index, line] of expected.entries()) {
    const [method, pathAndQuery] = line.split(" ");
    const call = recorder.calls[index];
    assert.equal(
      call.method,
      method,
      `call ${index} should be ${method} (${pathAndQuery})`,
    );
    assert.equal(
      call.url,
      `https://api.voyantjs.com${pathAndQuery}`,
      `call ${index} should target ${pathAndQuery}`,
    );
    assert.equal(call.headers.get("authorization"), "Bearer air_key");
  }
});

test("air — filters undefined query params", async () => {
  const recorder = createRecorder();
  const client = createVoyantDataClient({
    apiKey: "air_key",
    fetch: recorder.fetch,
  });

  await client.air.aircraft.list({});
  await client.air.aircraft.list({ manufacturer: undefined });

  assert.equal(
    recorder.calls[0].url,
    "https://api.voyantjs.com/data/air/v1/aircraft",
  );
  assert.equal(
    recorder.calls[1].url,
    "https://api.voyantjs.com/data/air/v1/aircraft",
  );
});

test("fx — composes the eight white-label routes including the double-fx prefix", async () => {
  const recorder = createRecorder({
    responseBody: { result: "success", baseCode: "USD" },
  });
  const client = createVoyantDataClient({
    apiKey: "fx_key",
    fetch: recorder.fetch,
  });

  await client.fx.latest("USD");
  await client.fx.pair("EUR", "USD");
  await client.fx.pair("EUR", "USD", 100);
  await client.fx.enriched("EUR", "USD");
  await client.fx.history("EUR", 2024, 1, 15);
  await client.fx.history("EUR", 2024, 1, 15, 250);
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
    assert.equal(recorder.calls[index].method, "GET");
  }
});

test("fx — returns camelCase fields when the worker forwards snake_case JSON", async () => {
  const recorder = createRecorder({
    responseBody: {
      result: "success",
      source: "bnr",
      base_code: "EUR",
      target_code: "USD",
      conversion_rate: 1.08,
      conversion_result: 108,
      time_last_update_unix: 1710000000,
    },
  });
  const client = createVoyantDataClient({
    apiKey: "fx_key",
    fetch: recorder.fetch,
  });

  const result = await client.fx.pair("EUR", "USD", 100);

  assert.deepEqual(result, {
    result: "success",
    source: "bnr",
    baseCode: "EUR",
    targetCode: "USD",
    conversionRate: 1.08,
    conversionResult: 108,
    timeLastUpdateUnix: 1710000000,
  });
});

test("seo — typed SERP namespace composes the locations + organic search routes", async () => {
  const recorder = createRecorder({
    responseBody: { data: [], totalCount: 0 },
  });
  const client = createVoyantDataClient({
    apiKey: "seo_key",
    fetch: recorder.fetch,
  });

  await client.seo.serp.google.locations.list({ country: "US" });
  await client.seo.serp.google.organic.searches.create({
    keyword: "voyant",
    locationCode: 2840,
    languageCode: "en",
  });

  assert.equal(
    recorder.calls[0].url,
    "https://api.voyantjs.com/data/seo/v1/serp/google/locations?country=US",
  );
  assert.equal(recorder.calls[0].method, "GET");

  assert.equal(
    recorder.calls[1].url,
    "https://api.voyantjs.com/data/seo/v1/serp/google/organic/searches",
  );
  assert.equal(recorder.calls[1].method, "POST");
  assert.deepEqual(JSON.parse(recorder.calls[1].body), {
    keyword: "voyant",
    locationCode: 2840,
    languageCode: "en",
  });
});

test("reviews — google + trustpilot async resources hit the right URLs", async () => {
  const recorder = createRecorder({ responseBody: { data: { id: "rev_1" } } });
  const client = createVoyantDataClient({
    apiKey: "reviews_key",
    fetch: recorder.fetch,
  });

  await client.reviews.google.reviews.create({ keyword: "Eiffel Tower" });
  await client.reviews.google.reviews.get("rev_1");
  await client.reviews.google.qa.run({ keyword: "Eiffel Tower" });
  await client.reviews.trustpilot.search.create({ domain: "voyantjs.com" });
  await client.reviews.trustpilot.reviews.list({
    status: "succeeded",
    limit: 5,
  });

  const expected = [
    {
      method: "POST",
      url: "https://api.voyantjs.com/data/reviews/v1/google/reviews",
    },
    {
      method: "GET",
      url: "https://api.voyantjs.com/data/reviews/v1/google/reviews/rev_1",
    },
    {
      method: "POST",
      url: "https://api.voyantjs.com/data/reviews/v1/google/qa:run",
    },
    {
      method: "POST",
      url: "https://api.voyantjs.com/data/reviews/v1/trustpilot/searches",
    },
    {
      method: "GET",
      url: "https://api.voyantjs.com/data/reviews/v1/trustpilot/reviews?status=succeeded&limit=5",
    },
  ];

  for (const [index, exp] of expected.entries()) {
    assert.equal(recorder.calls[index].method, exp.method);
    assert.equal(recorder.calls[index].url, exp.url);
  }
});

test("hotels — google hotels + tripadvisor reviews compose to the right URLs", async () => {
  const recorder = createRecorder({ responseBody: { data: { id: "h_1" } } });
  const client = createVoyantDataClient({
    apiKey: "hotels_key",
    fetch: recorder.fetch,
  });

  await client.hotels.google.hotelSearches.create({ keyword: "London" });
  await client.hotels.google.hotelInfo.run({ keyword: "Ritz London" });
  await client.hotels.tripadvisor.searches.list({ limit: 10 });
  await client.hotels.tripadvisor.reference.locations.list({ country: "GB" });
  await client.hotels.tripadvisor.reference.languages.list();

  const expected = [
    {
      method: "POST",
      url: "https://api.voyantjs.com/data/hotels/v1/google/hotel-searches",
    },
    {
      method: "POST",
      url: "https://api.voyantjs.com/data/hotels/v1/google/hotel-info:run",
    },
    {
      method: "GET",
      url: "https://api.voyantjs.com/data/hotels/v1/tripadvisor/searches?limit=10",
    },
    {
      method: "GET",
      url: "https://api.voyantjs.com/data/hotels/v1/tripadvisor/reference/locations?country=GB",
    },
    {
      method: "GET",
      url: "https://api.voyantjs.com/data/hotels/v1/tripadvisor/reference/languages",
    },
  ];

  for (const [index, exp] of expected.entries()) {
    assert.equal(recorder.calls[index].method, exp.method);
    assert.equal(recorder.calls[index].url, exp.url);
  }
});

test("restaurants — tripadvisor namespace targets /data/restaurants/v1/tripadvisor/*", async () => {
  const recorder = createRecorder({ responseBody: { data: { id: "r_1" } } });
  const client = createVoyantDataClient({
    apiKey: "restaurants_key",
    fetch: recorder.fetch,
  });

  await client.restaurants.tripadvisor.searches.create({ keyword: "Paris" });
  await client.restaurants.tripadvisor.reviews.get("r_1");
  await client.restaurants.tripadvisor.reference.locations.listByCountry("FR");

  assert.equal(recorder.calls[0].method, "POST");
  assert.equal(
    recorder.calls[0].url,
    "https://api.voyantjs.com/data/restaurants/v1/tripadvisor/searches",
  );
  assert.equal(recorder.calls[1].method, "GET");
  assert.equal(
    recorder.calls[1].url,
    "https://api.voyantjs.com/data/restaurants/v1/tripadvisor/reviews/r_1",
  );
  assert.equal(recorder.calls[2].method, "GET");
  assert.equal(
    recorder.calls[2].url,
    "https://api.voyantjs.com/data/restaurants/v1/tripadvisor/reference/locations/FR",
  );
});

test("experiences — tripadvisor namespace targets /data/experiences/v1/tripadvisor/*", async () => {
  const recorder = createRecorder({ responseBody: { data: { id: "e_1" } } });
  const client = createVoyantDataClient({
    apiKey: "experiences_key",
    fetch: recorder.fetch,
  });

  await client.experiences.tripadvisor.searches.create({ keyword: "Rome" });
  await client.experiences.tripadvisor.reviews.list({ limit: 5 });
  await client.experiences.tripadvisor.reference.languages.list();

  assert.equal(recorder.calls[0].method, "POST");
  assert.equal(
    recorder.calls[0].url,
    "https://api.voyantjs.com/data/experiences/v1/tripadvisor/searches",
  );
  assert.equal(recorder.calls[1].method, "GET");
  assert.equal(
    recorder.calls[1].url,
    "https://api.voyantjs.com/data/experiences/v1/tripadvisor/reviews?limit=5",
  );
  assert.equal(recorder.calls[2].method, "GET");
  assert.equal(
    recorder.calls[2].url,
    "https://api.voyantjs.com/data/experiences/v1/tripadvisor/reference/languages",
  );
});
