---
"@voyantjs/data-sdk": minor
---

geo: multilingual support. Configure a language once with
`createVoyantDataClient({ lang })` (or override per call) and read the
server-resolved `place.name`/`place.nameLang` in that language — backed by an
English then any-available fallback. Adds `PlaceLangParams` (`lang`, `names`) to
every geo read, `name`/`nameLang` on `CanonicalPlace`, and `names: false` to omit
the full `names` map.
