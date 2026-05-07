# Data SDK

`@voyantjs/data-sdk` is the public TypeScript client for the Voyant Data APIs.

## Sub-products

The Voyant Data product is composed of three sub-products served behind the
public gateway at `https://api.voyantjs.com`:

- `/data/static/v1/*` — typed reference data
  (countries, regions, cities, airports, airlines, aircraft, languages,
  currencies, timezones, geographic regions)
- `/data/fx/v1/fx/*` — currency exchange (exchangerate-api passthrough)
- `/data/seo/v1/*` — DataForSEO passthrough

## Current shape

- `client.countries`, `client.regions`, `client.cities`, `client.airports`,
  `client.airlines`, `client.aircraft` — domain-typed list/get/search/nearby
- `client.languages`, `client.currencies`, `client.timezones`,
  `client.geographicRegions` — reference catalogues
- `client.fx` — eight typed currency-exchange methods
- `client.seo` — generic typed pass-through (`get`, `post`, `request`)

## Key public types

- static: `Country`, `Region`, `City`, `Airport`, `Airline`, `Aircraft`,
  `LightCountry`, `NearbyAirport`, `NearbyCity`, `AirportType`,
  `AircraftCategory`
- reference: `Language`, `Currency`, `Timezone`, `GeographicRegion`
- envelopes: `ListResponse<T>`, `SingleResponse<T>`
- fx: `FxResponse`, `FxHistoryParams`
- seo: `SeoTaskResponse`, `SeoRequestOptions`
- errors: `DataErrorCode`

## Auth scopes

API tokens are scoped per sub-product:

- `client.{countries,regions,cities,airports,airlines,aircraft,languages,
  currencies,timezones,geographicRegions}.*` requires `data:static:read`
- `client.fx.*` requires `data:fx:read`
- `client.seo.*` requires `data:seo:read`

## Example

```ts
import { createVoyantDataClient } from "@voyantjs/data-sdk";

const client = createVoyantDataClient({
  apiKey: process.env.VOYANT_API_KEY!,
});

const europeanCountries = await client.countries.list({ region: "Europe" });
const lhr = await client.airports.get("LHR");
const eurUsd = await client.fx.pair("EUR", "USD", 100);
```

## Why SEO is generic

The DataForSEO surface is hundreds of routes, served by a manifest-driven
proxy on the server. Mirroring every route by hand would be churn for no
ergonomic gain. The `seo` group exposes a generic typed pass-through —
consumers translate DataForSEO's `/v3/...` docs path to the Voyant
namespace by replacing the leading `/v3` with the path part:
`/v3/serp/google/organic/live/regular` becomes
`client.seo.post("/serp/google/organic/live/regular", body)`.
