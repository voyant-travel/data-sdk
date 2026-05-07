import type { QueryValue, VoyantTransportOptions } from "@voyant-sdk/sdk-core";

export type VoyantDataClientOptions = VoyantTransportOptions;

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
