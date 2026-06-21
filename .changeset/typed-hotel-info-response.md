---
"@voyant-travel/data-sdk": minor
---

Type the Google hotel-info response. `GoogleHotelInfo.result` is now a concrete
`GoogleHotelInfoResult` (discriminated on `format`: `advanced` → `HotelInfoItem`,
or `html`) instead of the opaque record — surfacing the hotel description,
amenities, photo gallery, aggregate reviews, the nightly rate, and per-provider
booking `offers` (each with room/rate `options`) with full type-safety.
`GoogleHotelInfoRequest` is likewise typed. Additive and backward-compatible;
extends the typed-vertical migration (#26) started for hotel-searches.
