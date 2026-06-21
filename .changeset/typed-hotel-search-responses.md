---
"@voyant-travel/data-sdk": minor
---

Type the Google hotel-search response. `GoogleHotelSearches.result` is now a
concrete `GoogleHotelSearchesResult` (`{ items: HotelSearchItem[] }`) instead of
the opaque record — surfacing per-night `prices`, `stars`, `reviews`, `images`,
and coordinates with full type-safety and autocomplete. `GoogleHotelSearchesRequest`
is likewise typed (`keyword`, `location`, `language`, `checkIn`/`checkOut`,
`adults`, `currency`, `webhook`). Additive and backward-compatible; the remaining
verticals continue to return an opaque `result` (tracked in #26).
