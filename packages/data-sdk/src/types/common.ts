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

/**
 * Opaque passthrough envelope. Used where the wire shape mirrors an upstream
 * provider response and isn't worth statically modeling in the SDK.
 */
export type OpaqueRecord = Record<string, unknown>;

/** A resolved reference location (DFS-style numeric code + names). */
export interface ResolvedLocation {
  /** Numeric location code (`location_code` upstream). */
  id: number;
  name: string;
  /** ISO 3166-1 alpha-2 of the parent country, when applicable. */
  countryIso2?: string;
  type?: string;
  parent?: number;
}

/** A resolved reference language (BCP-47 / short code + name). */
export interface ResolvedLanguage {
  /** BCP-47 / short language code (`language_code` upstream). */
  code: string;
  name: string;
}

export interface CoordinateInput {
  latitude: number;
  longitude: number;
  radius?: number;
  zoom?: number;
}

/** Location selector accepted by search-style requests. */
export type LocationInput =
  | { id: number }
  | { name: string }
  | { coordinate: CoordinateInput };

/** Language selector accepted by search-style requests. */
export type LanguageInput = { code: string } | { name: string };
