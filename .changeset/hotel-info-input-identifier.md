---
"@voyant-travel/data-sdk": patch
---

`GoogleHotelInfoInput` now keys off `hotelIdentifier` (the stable id from a
hotel-search result) instead of `keyword` — DataForSEO's hotel-info endpoint
looks a hotel up by identifier, not by name.
