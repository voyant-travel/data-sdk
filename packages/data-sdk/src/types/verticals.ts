/**
 * Verticals — Reviews, Hotels, Restaurants, Experiences.
 *
 * The verticals share an async-resource shape: a `*Request` payload submitted
 * via `create`, polled via `list`/`get`, and (for the live-capable ones) also
 * `run` for synchronous execution. Result envelopes are being migrated off the
 * opaque `OpaqueRecord` to concrete per-vertical types (see issue #26); Google
 * Hotels is typed first and the rest still default to the opaque shape.
 */

import type {
  GoogleHotelInfoInput,
  GoogleHotelInfoResult,
  GoogleHotelSearchesInput,
  GoogleHotelSearchesResult,
} from "./hotels.js";
import type {
  OpaqueRecord,
  ResolvedLanguage,
  ResolvedLocation,
} from "./seo.js";

export type VerticalAsyncStatus = "queued" | "running" | "succeeded" | "failed";

/** Webhook subscription submitted with a vertical async request. */
export interface VerticalWebhookConfig {
  url: string;
  secretId?: string;
}

export interface VerticalAsyncResource<
  TRequest = OpaqueRecord,
  TResult = OpaqueRecord,
> {
  id: string;
  status: VerticalAsyncStatus;
  createdAt: string;
  completedAt?: string | null;
  request: TRequest;
  result?: TResult | null;
  cost?: { credits: number } | null;
  error?: { code: string; message: string };
  webhook?: {
    url: string;
    deliveredAt: string | null;
    attempts: number;
    lastError?: string;
  } | null;
}

// ───────────────────────────────────────────────────────────────
// Reviews — Google + Trustpilot
// ───────────────────────────────────────────────────────────────

export type GoogleReviewsRequest = OpaqueRecord;
export type GoogleReviews = VerticalAsyncResource<GoogleReviewsRequest>;
/** Google Extended Reviews uses the same request envelope as Google Reviews. */
export type GoogleExtendedReviews = VerticalAsyncResource<GoogleReviewsRequest>;

export type GoogleQaRequest = OpaqueRecord;
export type GoogleQa = VerticalAsyncResource<GoogleQaRequest>;

export type TrustpilotSearchRequest = OpaqueRecord;
export type TrustpilotSearch = VerticalAsyncResource<TrustpilotSearchRequest>;

export type TrustpilotReviewsRequest = OpaqueRecord;
export type TrustpilotReviews = VerticalAsyncResource<TrustpilotReviewsRequest>;

// ───────────────────────────────────────────────────────────────
// Hotels — Google Hotels + TripAdvisor
// ───────────────────────────────────────────────────────────────

export type GoogleHotelSearchesRequest = GoogleHotelSearchesInput;
export type GoogleHotelSearches = VerticalAsyncResource<
  GoogleHotelSearchesRequest,
  GoogleHotelSearchesResult
>;

export type GoogleHotelInfoRequest = GoogleHotelInfoInput;
export type GoogleHotelInfo = VerticalAsyncResource<
  GoogleHotelInfoRequest,
  GoogleHotelInfoResult
>;

// ───────────────────────────────────────────────────────────────
// TripAdvisor — shared shape across hotels / restaurants / experiences
// ───────────────────────────────────────────────────────────────

export type TripadvisorSearchRequest = OpaqueRecord;
export type TripadvisorSearch = VerticalAsyncResource<TripadvisorSearchRequest>;

export type TripadvisorReviewsRequest = OpaqueRecord;
export type TripadvisorReviews =
  VerticalAsyncResource<TripadvisorReviewsRequest>;

/**
 * Reference catalog row exposed by every TripAdvisor-backed vertical's
 * `tripadvisor.reference.locations` namespace.
 */
export type TripadvisorReferenceLocation = ResolvedLocation;

export type TripadvisorReferenceLanguage = ResolvedLanguage;
