# Data SDK

`@voyant-travel/data-sdk` is the public TypeScript client for the Voyant Data APIs.

## Sub-products

The Voyant Data product is composed of Cloudflare Workers served behind the
public gateway at `https://api.voyant.travel/data/{product}/v1/*`:

- `air` — aviation reference data (airports, airlines, aircraft)
- `fx` — currency exchange (exchangerate-api.com white-label, `/data/fx/v1/fx/*`) + the ISO 4217 currency catalog (`/data/fx/v1/currencies`)
- `reviews` — Google Reviews / Extended Reviews / Q&A + Trustpilot
- `hotels` — Google Hotels + TripAdvisor (hotel-scoped)
- `restaurants` — TripAdvisor restaurants
- `experiences` — TripAdvisor attractions / experiences
- `geo` — canonical travel geography (countries, regions, cities, ports,
  waterways) + reference lookups (languages, timezones)

## Current shape

Every sub-product is a top-level namespace on the client. Examples:

- `client.air.airports.get("LHR")`
- `client.geo.countries.list()`
- `client.fx.latest("USD")`
- `client.reviews.google.qa.run(input)`
- `client.hotels.google.hotelSearches.create(input)`
- `client.hotels.tripadvisor.reference.locations.list({ country: "GB" })`
- `client.restaurants.tripadvisor.searches.create(input)`
- `client.experiences.tripadvisor.reviews.list({ limit: 5 })`

`list` / `search` / `nearby` return `ListResponse<T>` (`{ data, totalCount,
nextCursor? }`); `get(id)` returns `SingleResponse<T>` (`{ data }`).

## Key public types

- air: `Airport`, `AirportType`, `Airline`, `Aircraft`, `AircraftCategory`
- geo: `CanonicalPlace`, `CanonicalPlaceType`, `PlaceWithRelations`,
  `PlaceResolveRequest`, `PlaceResolveResult`, `LanguageEntry`, `TimezoneEntry`
- envelopes: `ListResponse<T>`, `SingleResponse<T>`, `PaginationParams`
- fx: `FxLatestResponse`, `FxPairResponse`, `FxEnrichedResponse`,
  `FxHistoryResponse`, `FxCodesResponse`, `FxQuotaResponse`, `CurrencyEntry`
- verticals: `GoogleReviewsRequest`, `GoogleQaRequest`,
  `TrustpilotSearchRequest`, `GoogleHotelSearchesRequest`,
  `TripadvisorSearchRequest`, `TripadvisorReviewsRequest`,
  `TripadvisorReferenceLocation`
- hotels (typed response): `GoogleHotelSearchesResult`, `HotelSearchItem`,
  `HotelSearchPrice`, `GoogleHotelInfoResult`, `HotelInfoItem`, `HotelOffer`,
  `HotelOfferOption`, `HotelAmenityCategory` — both Google Hotels endpoints have
  concrete `result` types (search: per-night `prices`, `stars`, `reviews`,
  `images`; info: description, amenities, gallery, reviews, and per-provider
  `offers` with room/rate `options`). Other verticals still return an opaque
  `result`.
- errors: `DataErrorCode`

## Auth scopes

API tokens are scoped per sub-product:

- `client.air.*` requires `data:air:read`
- `client.fx.*` requires `data:fx:read`
- `client.reviews.*` requires `data:reviews:read`
- `client.hotels.*` requires `data:hotels:read`
- `client.restaurants.*` requires `data:restaurants:read`
- `client.experiences.*` requires `data:experiences:read`
- `client.geo.*` requires `data:geo:read`

## Example

```ts
import { createVoyantDataClient } from "@voyant-travel/data-sdk";

const client = createVoyantDataClient({
  apiKey: process.env.VOYANT_API_KEY!,
});

const countries = await client.geo.countries.list();
const lhr = await client.air.airports.get("LHR");
const eurUsd = await client.fx.pair("EUR", "USD", 100);
```
