/**
 * Restaurants — typed live Google Maps restaurant search.
 *
 * The restaurants product exposes a LIVE `:run` search (no async lifecycle):
 * each result carries rating + review count, cuisines, price tier, a photo,
 * address/coordinates, phone, open status, and a booking deep link. Mirrors the
 * platform `data-contract` `RestaurantSearchItem`.
 */

import type { LanguageInput, LocationInput } from "./seo.js";
import type { VerticalWebhookConfig } from "./verticals.js";

export interface GoogleRestaurantSearchesInput {
  /** Search query — a cuisine, a name, or omitted for "restaurants". */
  query?: string;
  location?: LocationInput;
  language?: LanguageInput;
  /** Max results to fetch. */
  limit?: number;
  clientReference?: string;
  webhook?: VerticalWebhookConfig;
}

export interface RestaurantSearchItem {
  type: "restaurantSearchItem";
  title: string;
  /** Google Place id / cid — stable identifiers for the venue. */
  placeId?: string;
  cid?: string;
  rating?: { value: number; count?: number };
  /** Price tier, 1–4 ("$"–"$$$$"). */
  priceLevel?: number;
  category?: string;
  cuisines?: string[];
  address?: string;
  neighborhood?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  url?: string;
  domain?: string;
  /** Cover photo. */
  image?: string;
  totalPhotos?: number;
  /** True when currently open. */
  openNow?: boolean;
  /** Deep link to reserve a table. */
  bookUrl?: string;
  snippet?: string;
}

export interface GoogleRestaurantSearchesResult {
  items: RestaurantSearchItem[];
}
