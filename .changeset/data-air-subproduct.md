---
"@voyantjs/data-sdk": major
---

Replace `client.static` with a dedicated `client.air` aviation namespace.

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
