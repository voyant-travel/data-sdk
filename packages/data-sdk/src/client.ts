import { VoyantTransport } from "@voyant-sdk/sdk-core";
import type {
  Aircraft,
  AircraftListParams,
  Airline,
  AirlineSearchParams,
  Airport,
  AirportNearbyParams,
  AirportSearchParams,
  City,
  CityNearbyParams,
  CitySearchParams,
  Country,
  CountryListParams,
  Currency,
  FxHistoryParams,
  FxResponse,
  GeographicRegion,
  Language,
  LightCountry,
  ListResponse,
  NearbyAirport,
  NearbyCity,
  Region,
  RegionListParams,
  SeoRequestOptions,
  SingleResponse,
  Timezone,
  VoyantDataClientOptions,
} from "./types.js";

const STATIC_PREFIX = "/data/static/v1";
// The FX worker namespaces its routes under `/v1/fx/...`, so the gateway
// path is `/data/fx/v1/fx/...` — consumers see the double segment.
const FX_PREFIX = "/data/fx/v1/fx";
const SEO_PREFIX = "/data/seo/v1";

function pruneParams(
  params: object | undefined,
): Record<string, string | number | boolean> {
  if (!params) {
    return {};
  }
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      out[key] = value;
    }
  }
  return out;
}

function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

export class VoyantDataClient {
  readonly transport: VoyantTransport;

  constructor(options: VoyantDataClientOptions) {
    this.transport = new VoyantTransport(options);
  }

  // ---------- /data/static/v1: countries ----------

  readonly countries = {
    list: (params?: CountryListParams) =>
      this.transport.request<ListResponse<Country>>(
        `${STATIC_PREFIX}/countries`,
        { query: pruneParams(params), unwrapData: false },
      ),
    get: (iso2: string) =>
      this.transport.request<SingleResponse<Country>>(
        `${STATIC_PREFIX}/countries/${encodePathSegment(iso2)}`,
        { unwrapData: false },
      ),
    listLight: () =>
      this.transport.request<ListResponse<LightCountry>>(
        `${STATIC_PREFIX}/countries-light`,
        { unwrapData: false },
      ),
  };

  // ---------- /data/static/v1: regions ----------

  readonly regions = {
    list: (params?: RegionListParams) =>
      this.transport.request<ListResponse<Region>>(
        `${STATIC_PREFIX}/regions`,
        { query: pruneParams(params), unwrapData: false },
      ),
    get: (code: string) =>
      this.transport.request<SingleResponse<Region>>(
        `${STATIC_PREFIX}/regions/${encodePathSegment(code)}`,
        { unwrapData: false },
      ),
  };

  // ---------- /data/static/v1: cities ----------

  readonly cities = {
    get: (id: string) =>
      this.transport.request<SingleResponse<City>>(
        `${STATIC_PREFIX}/cities/${encodePathSegment(id)}`,
        { unwrapData: false },
      ),
    search: (params: CitySearchParams) =>
      this.transport.request<ListResponse<City>>(
        `${STATIC_PREFIX}/cities/search`,
        { query: pruneParams(params), unwrapData: false },
      ),
    nearby: (params: CityNearbyParams) =>
      this.transport.request<ListResponse<NearbyCity>>(
        `${STATIC_PREFIX}/cities/nearby`,
        { query: pruneParams(params), unwrapData: false },
      ),
  };

  // ---------- /data/static/v1: airports ----------

  readonly airports = {
    get: (iata: string) =>
      this.transport.request<SingleResponse<Airport>>(
        `${STATIC_PREFIX}/airports/${encodePathSegment(iata)}`,
        { unwrapData: false },
      ),
    search: (params: AirportSearchParams) =>
      this.transport.request<ListResponse<Airport>>(
        `${STATIC_PREFIX}/airports/search`,
        { query: pruneParams(params), unwrapData: false },
      ),
    nearby: (params: AirportNearbyParams) =>
      this.transport.request<ListResponse<NearbyAirport>>(
        `${STATIC_PREFIX}/airports/nearby`,
        { query: pruneParams(params), unwrapData: false },
      ),
  };

  // ---------- /data/static/v1: airlines ----------

  readonly airlines = {
    get: (iata: string) =>
      this.transport.request<SingleResponse<Airline>>(
        `${STATIC_PREFIX}/airlines/${encodePathSegment(iata)}`,
        { unwrapData: false },
      ),
    search: (params: AirlineSearchParams) =>
      this.transport.request<ListResponse<Airline>>(
        `${STATIC_PREFIX}/airlines/search`,
        { query: pruneParams(params), unwrapData: false },
      ),
  };

  // ---------- /data/static/v1: aircraft ----------

  readonly aircraft = {
    list: (params?: AircraftListParams) =>
      this.transport.request<ListResponse<Aircraft>>(
        `${STATIC_PREFIX}/aircraft`,
        { query: pruneParams(params), unwrapData: false },
      ),
    get: (iata: string) =>
      this.transport.request<SingleResponse<Aircraft>>(
        `${STATIC_PREFIX}/aircraft/${encodePathSegment(iata)}`,
        { unwrapData: false },
      ),
  };

  // ---------- /data/static/v1: reference data ----------

  readonly languages = {
    list: () =>
      this.transport.request<ListResponse<Language>>(
        `${STATIC_PREFIX}/languages`,
        { unwrapData: false },
      ),
    get: (code: string) =>
      this.transport.request<SingleResponse<Language>>(
        `${STATIC_PREFIX}/languages/${encodePathSegment(code)}`,
        { unwrapData: false },
      ),
  };

  readonly currencies = {
    list: () =>
      this.transport.request<ListResponse<Currency>>(
        `${STATIC_PREFIX}/currencies`,
        { unwrapData: false },
      ),
    get: (code: string) =>
      this.transport.request<SingleResponse<Currency>>(
        `${STATIC_PREFIX}/currencies/${encodePathSegment(code)}`,
        { unwrapData: false },
      ),
  };

  readonly timezones = {
    list: () =>
      this.transport.request<ListResponse<Timezone>>(
        `${STATIC_PREFIX}/timezones`,
        { unwrapData: false },
      ),
  };

  readonly geographicRegions = {
    list: () =>
      this.transport.request<ListResponse<GeographicRegion>>(
        `${STATIC_PREFIX}/geographic-regions`,
        { unwrapData: false },
      ),
    get: (code: string) =>
      this.transport.request<SingleResponse<GeographicRegion>>(
        `${STATIC_PREFIX}/geographic-regions/${encodePathSegment(code)}`,
        { unwrapData: false },
      ),
  };

  // ---------- /data/fx/v1: currency exchange ----------

  readonly fx = {
    latest: (base: string) =>
      this.transport.request<FxResponse>(
        `${FX_PREFIX}/latest/${encodePathSegment(base)}`,
        { unwrapData: false },
      ),
    pair: (base: string, target: string, amount?: number) =>
      this.transport.request<FxResponse>(
        amount === undefined
          ? `${FX_PREFIX}/pair/${encodePathSegment(base)}/${encodePathSegment(target)}`
          : `${FX_PREFIX}/pair/${encodePathSegment(base)}/${encodePathSegment(target)}/${encodeURIComponent(String(amount))}`,
        { unwrapData: false },
      ),
    enriched: (base: string, target: string) =>
      this.transport.request<FxResponse>(
        `${FX_PREFIX}/enriched/${encodePathSegment(base)}/${encodePathSegment(target)}`,
        { unwrapData: false },
      ),
    history: ({ amount, base, day, month, year }: FxHistoryParams) =>
      this.transport.request<FxResponse>(
        amount === undefined
          ? `${FX_PREFIX}/history/${encodePathSegment(base)}/${year}/${month}/${day}`
          : `${FX_PREFIX}/history/${encodePathSegment(base)}/${year}/${month}/${day}/${encodeURIComponent(String(amount))}`,
        { unwrapData: false },
      ),
    codes: () =>
      this.transport.request<FxResponse>(`${FX_PREFIX}/codes`, {
        unwrapData: false,
      }),
    quota: () =>
      this.transport.request<FxResponse>(`${FX_PREFIX}/quota`, {
        unwrapData: false,
      }),
  };

  // ---------- /data/seo/v1: DataForSEO passthrough ----------

  /**
   * SEO is a typed pass-through to the DataForSEO surface. The underlying
   * route inventory is large and manifest-driven on the server; rather than
   * mirroring every endpoint statically, this client exposes a generic
   * typed `request` plus `get` and `post` helpers. Consumers translate
   * DataForSEO's `/v3/...` docs path to the Voyant gateway namespace —
   * `/v3/serp/google/organic/live/regular` becomes
   * `/serp/google/organic/live/regular`.
   */
  readonly seo = {
    request: <T>(
      method: "DELETE" | "GET" | "POST" | "PUT",
      path: string,
      options: SeoRequestOptions = {},
    ) => {
      const normalized = path.startsWith("/") ? path : `/${path}`;
      return this.transport.request<T>(`${SEO_PREFIX}${normalized}`, {
        body: options.body as never,
        headers: options.headers,
        method,
        query: options.query,
        signal: options.signal,
        unwrapData: false,
      });
    },
    get: <T>(path: string, options: Omit<SeoRequestOptions, "body"> = {}) =>
      this.seo.request<T>("GET", path, options),
    post: <T>(
      path: string,
      body: unknown,
      options: Omit<SeoRequestOptions, "body"> = {},
    ) => this.seo.request<T>("POST", path, { ...options, body }),
  };
}

export function createVoyantDataClient(options: VoyantDataClientOptions) {
  return new VoyantDataClient(options);
}
