# SDK Design

This repo should optimize for clear public SDKs, not for mirroring internal
app structure.

## Design goals

- product-scoped packages
- predictable auth and transport behavior
- explicit method names
- stable entrypoints
- easy future split into separate repos if needed

## Client shape

Current design:

- `@voyantjs/data-sdk` has a root client plus operation-scoped groups
  (`countries`, `regions`, `cities`, `airports`, `airlines`, `aircraft`,
  `languages`, `currencies`, `timezones`, `geographicRegions`, `fx`, `seo`)
- shared request machinery lives in `sdk-core`

## Why not one client type for everything

One giant client would make package boundaries and auth stories less clear.
Splitting per Voyant product (`@voyantjs/data-sdk`, future hosted-service
SDKs) keeps the auth scopes, the publish cadence, and the docs cleanly
separable.

## Why static typing for static + fx, generic for SEO

- `static` and `fx` have stable, hand-curated route surfaces — typing them
  pays for itself in autocomplete and request validation.
- `seo` is hundreds of manifest-driven proxy routes; a generic typed
  pass-through stays in sync without per-route code churn.

## Naming rule

Prefer names that describe the public action:

- `airports.search`
- `cities.nearby`
- `countries.list`

Avoid leaking internal route or job terminology unless it is already part of
the public API language.

## Shared runtime rule

If code in `sdk-core` needs to know what a country, an airport, or an FX
quote means semantically, it probably does not belong in `sdk-core`.
