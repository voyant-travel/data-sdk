import type { VoyantTransportOptions } from "@voyant-sdk/sdk-core";

export type VoyantDataClientOptions = VoyantTransportOptions;

/**
 * Standard list envelope returned by the Voyant Data static endpoints.
 *
 * `nextCursor` is reserved for future paginated endpoints; current static
 * endpoints return the full filtered set.
 */
export interface ListResponse<T> {
  data: T[];
  nextCursor?: string;
  totalCount: number;
}

export interface SingleResponse<T> {
  data: T;
}

// ---------- Static: countries ----------

export interface Country {
  callingCode?: string;
  capital?: string;
  currencies: string[];
  flagEmoji?: string;
  iso2: string;
  iso3: string;
  languages: string[];
  lastUpdated: string;
  name: string;
  numericCode: string;
  officialName: string;
  region: string;
  subregion?: string;
}

export interface CountryListParams {
  region?: string;
  subregion?: string;
}

export interface LightCountry {
  iso2: string;
  name: string;
}

// ---------- Static: regions (ISO 3166-2 subdivisions) ----------

export interface Region {
  code: string;
  countryIso2: string;
  lastUpdated: string;
  name: string;
  parent?: string;
  type: string;
}

export interface RegionListParams {
  country?: string;
  type?: string;
}

// ---------- Static: cities ----------

export interface City {
  alternateNames?: string[];
  asciiName: string;
  countryIso2: string;
  id: string;
  lastUpdated: string;
  latitude: number;
  longitude: number;
  name: string;
  population?: number;
  regionCode?: string;
  timezone?: string;
}

export interface CitySearchParams {
  country?: string;
  limit?: number;
  q: string;
}

export interface CityNearbyParams {
  latitude: number;
  limit?: number;
  longitude: number;
  radiusKm: number;
}

export interface NearbyCity extends City {
  distanceKm: number;
}

// ---------- Static: airports ----------

export type AirportType =
  | "balloonport"
  | "closed"
  | "heliport"
  | "large_airport"
  | "medium_airport"
  | "seaplane_base"
  | "small_airport";

export interface Airport {
  city?: string;
  countryIso2: string;
  elevationFt?: number;
  iataCode: string;
  icaoCode?: string;
  lastUpdated: string;
  latitude: number;
  longitude: number;
  name: string;
  regionCode?: string;
  scheduledService: boolean;
  timezone?: string;
  type: AirportType;
  wikipediaUrl?: string;
}

export interface AirportSearchParams {
  country?: string;
  limit?: number;
  q: string;
  scheduledServiceOnly?: boolean;
}

export interface AirportNearbyParams {
  latitude: number;
  limit?: number;
  longitude: number;
  radiusKm: number;
  scheduledServiceOnly?: boolean;
}

export interface NearbyAirport extends Airport {
  distanceKm: number;
}

// ---------- Static: airlines ----------

export interface Airline {
  active: boolean;
  alias?: string;
  callsign?: string;
  countryIso2?: string;
  countryName?: string;
  iataCode: string;
  icaoCode?: string;
  lastUpdated: string;
  logoUrl?: string;
  name: string;
}

export interface AirlineSearchParams {
  activeOnly?: boolean;
  country?: string;
  limit?: number;
  q: string;
}

// ---------- Static: aircraft ----------

export type AircraftCategory =
  | "helicopter"
  | "narrow_body"
  | "other"
  | "private_jet"
  | "regional_jet"
  | "turboprop"
  | "wide_body";

export interface Aircraft {
  category: AircraftCategory;
  iataCode: string;
  icaoCode?: string;
  lastUpdated: string;
  manufacturer: string;
  name: string;
  rangeKm?: number;
  typicalSeats?: number;
}

export interface AircraftListParams {
  category?: AircraftCategory;
  manufacturer?: string;
}

// ---------- Static: reference data ----------

export interface Language {
  code: string;
  name: string;
}

export interface Currency {
  code: string;
  decimal_digits: number;
  name: string;
  name_plural: string;
  rounding: number;
  symbol: string;
  symbol_native: string;
}

export interface Timezone {
  abbr: string;
  isdst: boolean;
  offset: number;
  text: string;
  utc: string[];
  value: string;
}

export interface GeographicRegion {
  code: string;
  name: string;
}

// ---------- FX (currency exchange) ----------

/**
 * Successful FX response. Mirrors exchangerate-api.com's payload, namespaced
 * under our `/data/fx/v1/...` gateway. Optional fields appear depending on
 * the endpoint and the upstream plan.
 */
export interface FxResponse {
  base_code?: string;
  conversion_rate?: number;
  conversion_rates?: Record<string, number>;
  conversion_result?: number;
  documentation?: string;
  result: "error" | "success";
  supported_codes?: Array<[string, string]>;
  target_code?: string;
  terms_of_use?: string;
  time_eol_unix?: number;
  time_last_update_unix?: number;
  time_last_update_utc?: string;
  time_next_update_unix?: number;
  time_next_update_utc?: string;
  [key: string]: unknown;
}

export interface FxHistoryParams {
  amount?: number;
  base: string;
  day: number;
  month: number;
  year: number;
}

// ---------- SEO (DataForSEO passthrough) ----------

/**
 * SEO endpoints are a thin proxy to DataForSEO. Voyant validates the request
 * surface and centralises auth, but response shapes mirror DataForSEO's
 * tasks-{post,get,ready} envelope.
 */
export interface SeoTaskResponse<TResult = unknown> {
  cost?: number;
  status_code: number;
  status_message: string;
  tasks?: Array<{
    cost?: number;
    data?: Record<string, unknown>;
    id: string;
    path?: string[];
    result?: TResult[];
    result_count?: number;
    status_code: number;
    status_message: string;
  }>;
  tasks_count?: number;
  tasks_error?: number;
  time?: string;
  version?: string;
}

export interface SeoRequestOptions {
  body?: unknown;
  headers?: HeadersInit;
  query?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
}

// ---------- Errors ----------

/**
 * Stable error code surface returned by the Voyant Data API.
 *
 * The HTTP layer still throws `VoyantApiError` from `@voyant-sdk/sdk-core`.
 * This type just names the body codes consumers may want to switch on.
 */
export type DataErrorCode =
  | "INTERNAL_AUTH_REQUIRED"
  | "INVALID_CURSOR"
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "UPSTREAM_FAILED";
