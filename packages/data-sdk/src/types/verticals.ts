/**
 * Verticals — Reviews, Hotels, Restaurants, Experiences.
 *
 * The verticals share an async-resource shape: a `*Request` payload submitted
 * via `create`, polled via `list`/`get`, and (for the live-capable ones) also
 * `run` for synchronous execution. All result envelopes are kept opaque to
 * tolerate provider-side passthrough drift; concrete fields live in the docs
 * and on the resource records themselves.
 */

import type { OpaqueRecord, ResolvedLanguage, ResolvedLocation } from "./seo.js";

export type VerticalAsyncStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed";

export interface VerticalAsyncResource<TRequest = OpaqueRecord> {
  id: string;
  status: VerticalAsyncStatus;
  createdAt: string;
  completedAt?: string | null;
  request: TRequest;
  result?: OpaqueRecord | null;
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

export type GoogleHotelSearchesRequest = OpaqueRecord;
export type GoogleHotelSearches =
  VerticalAsyncResource<GoogleHotelSearchesRequest>;

export type GoogleHotelInfoRequest = OpaqueRecord;
export type GoogleHotelInfo = VerticalAsyncResource<GoogleHotelInfoRequest>;

// ───────────────────────────────────────────────────────────────
// TripAdvisor — shared shape across hotels / restaurants / experiences
// ───────────────────────────────────────────────────────────────

export type TripadvisorSearchRequest = OpaqueRecord;
export type TripadvisorSearch =
  VerticalAsyncResource<TripadvisorSearchRequest>;

export type TripadvisorReviewsRequest = OpaqueRecord;
export type TripadvisorReviews =
  VerticalAsyncResource<TripadvisorReviewsRequest>;

/**
 * Reference catalog row exposed by every TripAdvisor-backed vertical's
 * `tripadvisor.reference.locations` namespace.
 */
export type TripadvisorReferenceLocation = ResolvedLocation;

export type TripadvisorReferenceLanguage = ResolvedLanguage;
