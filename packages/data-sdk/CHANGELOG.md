# @voyantjs/data-sdk

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

- 59fe70f: Initial release of `@voyantjs/data-sdk` — the public TypeScript client for the Voyant Data API.

  Covers all seven data sub-products served at `api.voyantjs.com/data/{product}/v1/*`:
  - **static** — countries, airports, airlines, cities, currencies, languages, regions, geographic regions, timezones, aircraft (21 routes)
  - **fx** — currency rates with optional history (8 routes)
  - **seo** — SERP (Google/Bing/maps/news/images/autocomplete), DataForSEO Labs, Backlinks, On-Page, Content Analysis, Domain Analytics, AI Optimization, Keywords Data, Business Listings, Google My Business (180 routes)
  - **reviews** — Google Reviews + Extended Reviews + Q&A; Trustpilot search + reviews (16 routes)
  - **hotels** — Google hotel searches + info; TripAdvisor hotel-scoped search + reviews + reference (17 routes)
  - **restaurants** — TripAdvisor restaurant-scoped search + reviews + reference (9 routes)
  - **experiences** — TripAdvisor attraction-scoped search + reviews + reference (9 routes)

  Total: 260 routes across the seven namespaces, statically verified to match the upstream API surface.
