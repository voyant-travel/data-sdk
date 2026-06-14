---
"@voyant-travel/data-sdk": major
---

Move the ISO 4217 currency catalog from `client.geo.reference.currencies` to
`client.fx.currencies`.

Currency reference belongs with the money product, not geography — `fx` already
serves the live supported-code list (`fx.codes()`), so the canonical ISO 4217
catalog (names / symbols / decimal digits) now sits beside it at
`/data/fx/v1/currencies`. `client.geo.reference` keeps `languages` and
`timezones` (the decoders for geo's own multilingual names and place/airport
timezone fields). The `CurrencyEntry` type now lives in the fx module (still
exported from the package root).

Mirrors the platform change (currency catalog moved `data-geo` → `data-fx`).
