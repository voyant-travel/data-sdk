# @voyant-travel/data-sdk

## 0.8.0

### Minor Changes

- 8d08550: Add the live Google Maps restaurant search vertical:
  `client.restaurants.google.restaurantSearches.run({ query, location, ... })`
  returns typed `RestaurantSearchItem`s (rating, cuisines, price tier, photo,
  address, phone, open status, booking link).

## 0.7.1

### Patch Changes

- 4228887: `GoogleHotelInfoInput` now keys off `hotelIdentifier` (the stable id from a
  hotel-search result) instead of `keyword` — DataForSEO's hotel-info endpoint
  looks a hotel up by identifier, not by name.

## 0.7.0

### Minor Changes

- 5ef2a05: Type the Google hotel-info response. `GoogleHotelInfo.result` is now a concrete
  `GoogleHotelInfoResult` (discriminated on `format`: `advanced` → `HotelInfoItem`,
  or `html`) instead of the opaque record — surfacing the hotel description,
  amenities, photo gallery, aggregate reviews, the nightly rate, and per-provider
  booking `offers` (each with room/rate `options`) with full type-safety.
  `GoogleHotelInfoRequest` is likewise typed. Additive and backward-compatible;
  extends the typed-vertical migration (#26) started for hotel-searches.

## 0.6.0

### Minor Changes

- bd1ed1f: Type the Google hotel-search response. `GoogleHotelSearches.result` is now a
  concrete `GoogleHotelSearchesResult` (`{ items: HotelSearchItem[] }`) instead of
  the opaque record — surfacing per-night `prices`, `stars`, `reviews`, `images`,
  and coordinates with full type-safety and autocomplete. `GoogleHotelSearchesRequest`
  is likewise typed (`keyword`, `location`, `language`, `checkIn`/`checkOut`,
  `adults`, `currency`, `webhook`). Additive and backward-compatible; the remaining
  verticals continue to return an opaque `result` (tracked in #26).

## 0.5.0

### Minor Changes

- 8fc3ded: Move the ISO 4217 currency catalog from `client.geo.reference.currencies` to
  `client.fx.currencies`.

  Currency reference belongs with the money product, not geography — `fx` already
  serves the live supported-code list (`fx.codes()`), so the canonical ISO 4217
  catalog (names / symbols / decimal digits) now sits beside it at
  `/data/fx/v1/currencies`. `client.geo.reference` keeps `languages` and
  `timezones` (the decoders for geo's own multilingual names and place/airport
  timezone fields). The `CurrencyEntry` type now lives in the fx module (still
  exported from the package root).

  Mirrors the platform change (currency catalog moved `data-geo` → `data-fx`).

### Patch Changes

- c21e4a9: Rename the GitHub and npm orgs from `voyantjs` to `voyant-travel`. The package
  is now published as `@voyant-travel/data-sdk` and the default base URL is
  `https://api.voyant.travel`. Relicense from FSL-1.1-Apache-2.0 to Apache-2.0.

## 0.4.0

### Minor Changes

- fd00c7e: Replace `client.static` with a dedicated `client.air` aviation namespace.

  The upstream Voyant Data platform retired the `data:static` product (which mixed
  aviation, geography, and reference data) in favour of a proper `data:air`
  sub-product. This is a breaking change:
  - **Removed:** `client.static` (and the `data:static:read` scope).
  - **Added:** `client.air.{airports,airlines,aircraft}` (`/data/air/v1/*`, scope
    `data:air:read`).
  - **Moved to `client.geo`:** countries/regions/cities are canonical places —
    use `client.geo.{countries,regions,cities}`. Languages, currencies, and
    timezones now live under `client.geo.reference.{languages,currencies,timezones}`.

  Migration: `client.static.airports`/`airlines`/`aircraft` →
  `client.air.*`; `client.static.countries`/`regions`/`cities` →
  `client.geo.*`; `client.static.languages`/`currencies`/`timezones` →
  `client.geo.reference.*`. The `Country`/`Region`/`City`/`GeographicRegion`
  types are removed (geo returns `CanonicalPlace`); `Airport`/`Airline`/`Aircraft`
  and `LanguageEntry`/`CurrencyEntry`/`TimezoneEntry` are unchanged.

### Patch Changes

- 2f60527: geo: clarify in the types + README that the full `names` map is opt-in — geo
  reads return only the resolved `name`/`nameLang` by default; pass `names: true`
  to also get the full map.

## 0.3.1

### Patch Changes

- d1d170e: geo: make `CanonicalPlace.names` optional. A geo call with `names: false` omits
  the map from the response, so the field is not always present — typing it as
  required let `place.names.en` compile while being `undefined` at runtime. Guard
  before indexing, or use the resolved `name` field / `placeName` helper.

## 0.3.0

### Minor Changes

- 3cc22ff: geo: multilingual support. Configure a language once with
  `createVoyantDataClient({ lang })` (or override per call) and read the
  server-resolved `place.name`/`place.nameLang` in that language — backed by an
  English then any-available fallback. Adds `PlaceLangParams` (`lang`, `names`) to
  every geo read, `name`/`nameLang` on `CanonicalPlace`, and `names: false` to omit
  the full `names` map.
- 4b60116: geo: add the `subdivisions` typed resource — `client.geo.subdivisions.{list,get}`
  (ISO 3166-2 states/provinces; the id is the code, e.g. `US-CA`) and
  `client.geo.countries.subdivisions(iso2)` for a country's subdivisions.

## 0.2.0

### Minor Changes

- 436be95: Add the `geo` client for the Voyant Data geo API (`/data/geo/v1`): canonical
  travel geography (countries, regions, cities, ports, and the waterway family)
  over one polymorphic places gazetteer, with multilingual names, coordinates,
  hierarchy, and `flows_through` relations, plus a `resolve` endpoint
  (provider label/code → canonical place).

  Surfaces the raw routes under `client.geo.places.*` and typed resources
  `client.geo.{countries,regions,cities,ports,rivers}`; `geo.places.get` returns
  the place with its outgoing relations inline (e.g. a river's countries), and a
  `placeName(place, lang)` helper reads the multilingual `names` map.

## 0.1.3

### Patch Changes

- 7cdf6a2: Bind the transport fetch implementation to `globalThis` so SDK requests work in strict Web Platform runtimes such as Cloudflare Workers.

## 0.1.2

### Patch Changes

- f303c3d: Type FX response provenance as `source?: "bnr" | "voyant-data-fx"`.

## 0.1.1

### Patch Changes

- 640cc5f: Normalize parsed API response keys to camelCase by default, including FX responses forwarded from snake_case upstream payloads.

## 0.1.0

### Minor Changes

- 59fe70f: Initial release of `@voyant-travel/data-sdk` — the public TypeScript client for the Voyant Data API.

  Covers all seven data sub-products served at `api.voyant.travel/data/{product}/v1/*`:
  - **static** — countries, airports, airlines, cities, currencies, languages, regions, geographic regions, timezones, aircraft (21 routes)
  - **fx** — currency rates with optional history (8 routes)
  - **seo** — SERP (Google/Bing/maps/news/images/autocomplete), DataForSEO Labs, Backlinks, On-Page, Content Analysis, Domain Analytics, AI Optimization, Keywords Data, Business Listings, Google My Business (180 routes)
  - **reviews** — Google Reviews + Extended Reviews + Q&A; Trustpilot search + reviews (16 routes)
  - **hotels** — Google hotel searches + info; TripAdvisor hotel-scoped search + reviews + reference (17 routes)
  - **restaurants** — TripAdvisor restaurant-scoped search + reviews + reference (9 routes)
  - **experiences** — TripAdvisor attraction-scoped search + reviews + reference (9 routes)

  Total: 260 routes across the seven namespaces, statically verified to match the upstream API surface.
