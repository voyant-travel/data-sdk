# `@voyantjs/data-sdk`

Public TypeScript client for the Voyant Data APIs.

## Scope

`@voyantjs/data-sdk` is the unified client for the eight sub-products that
make up the Voyant Data product, all served behind a single hostname:

- `client.air` — aviation reference data (airports, airlines, aircraft)
- `client.fx` — currency exchange (exchangerate-api.com white-label)
- `client.seo` — DataForSEO white-label, namespaced by sub-product
  (`serp`, `keywordsData`, `aiOptimization`, `backlinks`, `domainAnalytics`,
  `contentAnalysis`, `onPage`, `businessData`, `dataforseoLabs`)
- `client.reviews` — Google Reviews + Trustpilot (async resources)
- `client.hotels` — Google Hotels + TripAdvisor (async resources, plus a
  shared `tripadvisor.reference` catalog)
- `client.restaurants` — TripAdvisor restaurants (async resources +
  reference)
- `client.experiences` — TripAdvisor attractions/experiences (async
  resources + reference)
- `client.geo` — canonical travel geography (gazetteer + resolver): countries,
  regions, cities, ports, and waterways (rivers/seas/lakes/canals) with
  multilingual names, coordinates, hierarchy, and `flows_through` relations,
  plus `resolve` (provider label/code → canonical place)

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

const countries = await client.geo.countries.list();
const lhr = await client.air.airports.get("LHR");
const eurUsd = await client.fx.pair("EUR", "USD", 100);

// geo: typed resources over one polymorphic gazetteer
const danube = await client.geo.rivers.get("river:Q1653");
// danube.relations.flowsThrough === ["DE", "AT", "SK", "HU", ...]
const roRivers = await client.geo.countries.rivers("RO");
const match = await client.geo.resolve("Dunărea"); // → the Danube

// multilingual: set a language once and read `place.name` in it
const ro = createVoyantDataClient({
  apiKey: process.env.VOYANT_API_KEY!,
  lang: "ro",
});
const de = await ro.geo.countries.get("DE");
// de.data.name === "Germania", de.data.nameLang === "ro"
const fr = await ro.geo.countries.get("DE", { lang: "fr" }); // per-call override → "Allemagne"
```

## Shape

Every sub-product is a top-level namespace on the client:

- aviation: `client.air.{airports,airlines,aircraft}`
- currency exchange: `client.fx.{latest,pair,enriched,history,codes,quota}`
- SERP, keywords, AI optimization, backlinks, on-page, content analysis,
  domain analytics, business data, dataforseo-labs:
  `client.seo.{serp,keywordsData,aiOptimization,backlinks,onPage,
contentAnalysis,domainAnalytics,businessData,dataforseoLabs}`
- async-resource verticals (Reviews, Hotels, Restaurants, Experiences):
  `client.{reviews,hotels,restaurants,experiences}` with `create`/`list`/
  `get`/(some) `run` per resource
- geography: `client.geo.places.{list,search,get,children,ancestors,related,
resolve}` (the raw routes) plus typed resources
  `client.geo.{countries,regions,subdivisions,cities,ports,rivers}`, reference
  catalogs `client.geo.reference.{languages,currencies,timezones}`, and a one-shot
  `client.geo.resolve(label)`. `geo.places.get(id)` returns the place with its
  outgoing relations inline (e.g. a river's `flows_through` countries).
  Multilingual: set `lang` on the client (or pass `lang` per call) and read the
  server-resolved `place.name`/`place.nameLang`; pass `names: true` to also get
  the full `names` map (omitted by default). The `placeName(place, lang)` helper
  re-resolves from a `names` map client-side

The static groups follow a consistent shape: `list` / `search` / `nearby`
return a `ListResponse<T>` envelope (`{ data, totalCount, nextCursor? }`),
and `get(id)` returns `SingleResponse<T>` (`{ data }`). Async-resource
verticals follow the same envelopes: `create` and `get` return
`SingleResponse<T>`; `list` returns `ListResponse<T>`.

## Key public types

Useful exported types include:

- air: `Airport`, `AirportType`, `Airline`, `Aircraft`, `AircraftCategory`
- envelopes: `ListResponse<T>`, `SingleResponse<T>`,
  `PaginationParams`, `CountryFilteredPaginationParams`
- fx: `FxLatestResponse`, `FxPairResponse`, `FxEnrichedResponse`,
  `FxHistoryResponse`, `FxCodesResponse`, `FxQuotaResponse`
- seo / serp: `Search`, `GoogleOrganicSearchInput`, `GoogleAiModeSearchInput`,
  `GoogleMapsSearchInput`, `ScreenshotResult`, `AiSummaryResult`
- verticals: `GoogleReviewsRequest`, `GoogleQaRequest`,
  `TrustpilotSearchRequest`, `GoogleHotelSearchesRequest`,
  `TripadvisorSearchRequest`, `TripadvisorReviewsRequest`,
  `TripadvisorReferenceLocation`
- geo: `CanonicalPlace`, `CanonicalPlaceType`, `PlaceWithRelations`,
  `PlaceRelation`, `PlaceResolveRequest`, `PlaceResolveResult`,
  `CountryAttributes`, `CityAttributes`, `WaterwayAttributes`, `LanguageEntry`,
  `CurrencyEntry`, `TimezoneEntry` (+ `placeName` helper)
- options: `VoyantDataClientOptions`

## Notes

- default base URL is `https://api.voyantjs.com`
- request auth defaults to `authorization: Bearer <apiKey>`
- API tokens are scoped per sub-product (`data:air:read`,
  `data:fx:read`, `data:seo:read`, `data:reviews:read`,
  `data:hotels:read`, `data:restaurants:read`, `data:experiences:read`,
  `data:geo:read`)
- responses preserve the full `{ data, totalCount, nextCursor? }` envelope
  so consumers can paginate without losing metadata

For repo-level context, see [../../docs/data.md](../../docs/data.md).
