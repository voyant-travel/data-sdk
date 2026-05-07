# Package APIs

This document is a compact map of the current SDK surface.

## `@voyantjs/data-sdk`

Root client:

- `createVoyantDataClient(options)`
- `new VoyantDataClient(options)`

### Static reference data (`/data/static/v1`)

- `client.countries.list({ region?, subregion? })`
- `client.countries.get(iso2)`
- `client.countries.listLight()`
- `client.regions.list({ country?, type? })`
- `client.regions.get(code)`
- `client.cities.get(id)`
- `client.cities.search({ q, country?, limit? })`
- `client.cities.nearby({ latitude, longitude, radiusKm, limit? })`
- `client.airports.get(iata)`
- `client.airports.search({ q, country?, scheduledServiceOnly?, limit? })`
- `client.airports.nearby({ latitude, longitude, radiusKm, scheduledServiceOnly?, limit? })`
- `client.airlines.get(iata)`
- `client.airlines.search({ q, country?, activeOnly?, limit? })`
- `client.aircraft.list({ manufacturer?, category? })`
- `client.aircraft.get(iata)`
- `client.languages.list()`
- `client.languages.get(code)`
- `client.currencies.list()`
- `client.currencies.get(code)`
- `client.timezones.list()`
- `client.geographicRegions.list()`
- `client.geographicRegions.get(code)`

### Currency exchange (`/data/fx/v1/fx`)

- `client.fx.latest(base)`
- `client.fx.pair(base, target, amount?)`
- `client.fx.enriched(base, target)`
- `client.fx.history({ base, year, month, day, amount? })`
- `client.fx.codes()`
- `client.fx.quota()`

### DataForSEO passthrough (`/data/seo/v1`)

- `client.seo.get<T>(path, options?)`
- `client.seo.post<T>(path, body, options?)`
- `client.seo.request<T>(method, path, options?)`

## Selected public types

- `Country`, `Region`, `City`, `Airport`, `Airline`, `Aircraft`,
  `LightCountry`
- `Language`, `Currency`, `Timezone`, `GeographicRegion`
- `AirportType`, `AircraftCategory`
- `NearbyAirport`, `NearbyCity`
- `ListResponse<T>`, `SingleResponse<T>`
- `FxResponse`, `FxHistoryParams`
- `SeoTaskResponse`, `SeoRequestOptions`
- `DataErrorCode`
- `VoyantDataClientOptions`
