# Roadmap

This repo now has working public package surfaces, release scaffolding, CI,
API parity checks, and packed-artifact verification. The remaining work
before the first public release should stay focused on contract generation
and final consumer polish.

## Before first publish

- generate or export contract artifacts from `voyant-cloud` instead of
  relying on hand-mirrored SDK types
- add package-level examples that match real auth and endpoint behavior
- deepen package tests beyond the current smoke coverage
- decide versioning policy for prerelease versus stable releases

## Data SDK follow-up

- decide whether to ship typed wrappers for the most-used DataForSEO
  endpoints (currently a generic pass-through under `client.seo`)
- add narrower error types per `DataErrorCode` so consumers can switch on
  them without parsing the response body
- evaluate whether `LightCountry` should stay separate from `Country` or
  be folded into a single `country.list({ shape: "light" })` option
- decide whether to expose pagination helpers for endpoints that gain
  `nextCursor` in the future

## Repo follow-up

- add package README validation or snippet verification into release checks
- keep docs in Markdown here until the shared docs app is ready in `voyant`
- decide whether to keep a single bootstrap changeset or split release
  notes into more granular prerelease entries before publishing
