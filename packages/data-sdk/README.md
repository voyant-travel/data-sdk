# `@voyantjs/data-sdk`

Public TypeScript client for the Voyant Data APIs.

## Scope

`@voyantjs/data-sdk` is for the hosted Voyant Data product:

- static reference data (countries, regions, cities, airports, airlines,
  aircraft, languages, currencies, timezones, geographic regions)
- currency exchange (`fx`) — exchangerate-api.com white-label
- DataForSEO passthrough (`seo`) — generic typed proxy

## Install

```sh
pnpm add @voyantjs/data-sdk
```

## Usage

```ts
import { createVoyantDataClient } from "@voyantjs/data-sdk";

const client = createVoyantDataClient({
  apiKey: process.env.VOYANT_API_KEY!,
});

const countries = await client.countries.list({ region: "Europe" });
const lhr = await client.airports.get("LHR");
const eurUsd = await client.fx.pair("EUR", "USD", 100);
```

## Shape

Root groups:

- `countries`, `regions`, `cities`, `airports`, `airlines`, `aircraft`
- `languages`, `currencies`, `timezones`, `geographicRegions`
- `fx` (8 typed currency-exchange methods)
- `seo` (generic DataForSEO passthrough — `seo.get`, `seo.post`, `seo.request`)

The static groups follow a consistent shape: `list` / `search` / `nearby`
return a `ListResponse<T>` envelope (`{ data, totalCount, nextCursor? }`),
and `get(id)` returns `SingleResponse<T>` (`{ data }`).

## Key public types

Useful exported types include:

- `Country`, `Region`, `City`, `Airport`, `Airline`, `Aircraft`
- `Language`, `Currency`, `Timezone`, `GeographicRegion`, `LightCountry`
- `AirportType`, `AircraftCategory`
- `NearbyAirport`, `NearbyCity` (extend their parent with `distanceKm`)
- `ListResponse<T>`, `SingleResponse<T>`
- `FxResponse`, `FxHistoryParams`
- `SeoRequestOptions`, `SeoTaskResponse`
- `DataErrorCode`
- `VoyantDataClientOptions`

## Notes

- default base URL is `https://api.voyantjs.com`
- request auth defaults to `authorization: Bearer <apiKey>`
- API tokens are scoped (`data:static:read`, `data:fx:read`, `data:seo:read`);
  requests fail with `403` if the token does not include the required scope
- responses preserve the full `{ data, totalCount, nextCursor? }` envelope
  so consumers can paginate without losing metadata

For repo-level context, see [../../docs/data.md](../../docs/data.md).
