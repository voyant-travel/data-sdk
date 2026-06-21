/**
 * Google Hotels — typed request + response shapes.
 *
 * First vertical migrated off the opaque `result` envelope (see issue #26):
 * the hotel-search item carries per-night pricing, star rating, coordinates,
 * aggregate reviews, and gallery images. Mirrors the platform `data-contract`
 * `HotelSearchItem`; the remaining verticals follow the same pattern.
 */

import type { LanguageInput, LocationInput } from "./seo.js";
import type { VerticalWebhookConfig } from "./verticals.js";

export interface GoogleHotelSearchesInput {
  keyword?: string;
  location?: LocationInput;
  language?: LanguageInput;
  /** Check-in date, `YYYY-MM-DD`. */
  checkIn?: string;
  /** Check-out date, `YYYY-MM-DD`. */
  checkOut?: string;
  /** Occupancy used for the rate, 1–8. */
  adults?: number;
  /** ISO 4217 currency code (e.g. `"USD"`). */
  currency?: string;
  clientReference?: string;
  webhook?: VerticalWebhookConfig;
}

export interface HotelSearchPrice {
  /** Per-night price for the searched stay, in `currency`. */
  price?: number;
  /** Pre-discount per-night price, when the price reflects a discount. */
  priceWithoutDiscount?: number;
  currency?: string;
  discountText?: string;
  checkIn?: string;
  checkOut?: string;
  visitors?: number;
}

export interface HotelSearchItem {
  type: "hotelSearchItem";
  title: string;
  /** Stable Google Hotels identifier; resolves to hotel-info for full detail. */
  hotelIdentifier?: string;
  stars?: number;
  /** True when the listing is a paid ad placement rather than organic. */
  isPaid?: boolean;
  latitude?: number;
  longitude?: number;
  reviews?: { value: number; votesCount?: number };
  /** Per-night rate for the searched stay; absent when no rate is available. */
  prices?: HotelSearchPrice;
  images?: string[];
}

export interface GoogleHotelSearchesResult {
  items: HotelSearchItem[];
}
