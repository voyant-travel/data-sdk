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

// ---------------------------------------------------------------------------
// Hotel info — a single hotel in full detail. Mirrors the platform
// `HotelInfoItem`: description, amenities, gallery, reviews, the headline
// nightly rate, and per-provider booking offers (each with room/rate options).
// ---------------------------------------------------------------------------

export interface GoogleHotelInfoInput {
  /** The hotel's name (required to resolve the listing). */
  keyword: string;
  location?: LocationInput;
  language?: LanguageInput;
  /** Response format. `advanced` (default) returns structured data. */
  format?: "advanced" | "html";
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

export interface HotelAmenityCategory {
  category?: string;
  items: Array<{ label: string; available?: boolean }>;
}

/** A bookable room/rate option within a provider's offer. */
export interface HotelOfferOption {
  /** Room or rate name (e.g. "Standard King Room"). */
  title?: string;
  price?: number;
  currency?: string;
  maxVisitors?: number;
  images?: string[];
  freeCancellationUntil?: string;
}

/** A booking option for the hotel, grouped by provider. */
export interface HotelOffer {
  /** Booking provider (e.g. "Booking.com"). */
  provider?: string;
  price?: number;
  currency?: string;
  url?: string;
  officialSite?: boolean;
  freeCancellationUntil?: string;
  options?: HotelOfferOption[];
}

export interface HotelInfoItem {
  type: "hotelInfoItem";
  title: string;
  hotelIdentifier?: string;
  stars?: number;
  starsDescription?: string;
  address?: string;
  phone?: string;
  /** Google Hotels deep link for the searched stay. */
  checkUrl?: string;
  latitude?: number;
  longitude?: number;
  neighborhood?: string;
  description?: string;
  /** Local check-in time, `HH:MM`. */
  checkInTime?: string;
  /** Local check-out time, `HH:MM`. */
  checkOutTime?: string;
  amenities?: HotelAmenityCategory[];
  /** Gallery image URLs. */
  images?: string[];
  reviews?: {
    value: number;
    votesCount?: number;
    ratingDistribution?: {
      1?: number;
      2?: number;
      3?: number;
      4?: number;
      5?: number;
    };
  };
  /** Headline nightly rate for the searched stay. */
  prices?: HotelSearchPrice;
  /** Per-provider booking offers, each with room/rate options. */
  offers?: HotelOffer[];
}

/** Discriminated on `format`: structured `advanced` data or rendered `html`. */
export type GoogleHotelInfoResult =
  | { format: "advanced"; item: HotelInfoItem | null }
  | { format: "html"; html: string };
