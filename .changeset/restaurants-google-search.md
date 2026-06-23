---
"@voyant-travel/data-sdk": minor
---

Add the live Google Maps restaurant search vertical:
`client.restaurants.google.restaurantSearches.run({ query, location, ... })`
returns typed `RestaurantSearchItem`s (rating, cuisines, price tier, photo,
address, phone, open status, booking link).
