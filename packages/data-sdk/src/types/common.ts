import type { QueryValue, VoyantTransportOptions } from "@voyant-sdk/sdk-core";

export interface VoyantDataClientOptions extends VoyantTransportOptions {
  /**
   * Default language for geo reads (e.g. `"ro"`, `"fr"`, `"ja"`). When set, the
   * `geo` namespace requests names in this language and resolves `place.name`
   * to it (falling back to English, then any available name). Override per call
   * with a `lang` param. Other products are unaffected.
   */
  lang?: string;
}

/** Standard envelope for collection endpoints. */
export interface ListResponse<T> {
  data: T[];
  totalCount: number;
  nextCursor?: string;
}

/** Standard envelope for single-resource endpoints. */
export interface SingleResponse<T> {
  data: T;
}

/**
 * Common pagination knobs. The index signature lets callers add provider
 * passthrough query params without losing the typed shortcuts.
 */
export interface PaginationParams {
  limit?: number;
  cursor?: string;
  [key: string]: QueryValue;
}

export interface CountryFilteredPaginationParams extends PaginationParams {
  country?: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/** Job status returned by Voyant Async Layer endpoints. */
export type AsyncJobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed";
