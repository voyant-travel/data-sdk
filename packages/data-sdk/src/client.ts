import { VoyantTransport } from "@voyant-sdk/sdk-core";
import type { QueryParams } from "@voyant-sdk/sdk-core";

import type {
  Aircraft,
  Airline,
  AsyncJobStatus,
  Airport,
  CanonicalPlace,
  CanonicalPlaceType,
  CountryFilteredPaginationParams,
  CurrencyEntry,
  FxCodesResponse,
  FxEnrichedResponse,
  FxHistoryResponse,
  FxLatestResponse,
  FxPairResponse,
  FxQuotaResponse,
  GoogleExtendedReviews,
  GoogleHotelInfo,
  GoogleHotelInfoRequest,
  GoogleHotelSearches,
  GoogleHotelSearchesRequest,
  GoogleQa,
  GoogleQaRequest,
  GoogleRestaurantSearchesInput,
  GoogleRestaurantSearchesResult,
  GoogleReviews,
  GoogleReviewsRequest,
  LanguageEntry,
  ListResponse,
  PaginationParams,
  PlaceLangParams,
  PlaceListParams,
  PlaceRelationKind,
  PlaceResolveRequest,
  PlaceResolveResult,
  PlaceWithRelations,
  SingleResponse,
  TimezoneEntry,
  TripadvisorReferenceLanguage,
  TripadvisorReferenceLocation,
  TripadvisorReviews,
  TripadvisorReviewsRequest,
  TripadvisorSearch,
  TripadvisorSearchRequest,
  TrustpilotReviews,
  TrustpilotReviewsRequest,
  TrustpilotSearch,
  TrustpilotSearchRequest,
  VoyantDataClientOptions,
} from "./types/index.js";

const AIR = "/data/air/v1";
const FX = "/data/fx/v1";
const REVIEWS = "/data/reviews/v1";
const HOTELS = "/data/hotels/v1";
const RESTAURANTS = "/data/restaurants/v1";
const EXPERIENCES = "/data/experiences/v1";
const GEO = "/data/geo/v1";

function enc(value: string): string {
  return encodeURIComponent(value);
}

interface AsyncListParams extends PaginationParams {
  status?: AsyncJobStatus;
}

/**
 * Public client for the Voyant Data API. All sub-products (`air`, `fx`,
 * `reviews`, `hotels`, `restaurants`, `experiences`, `geo`) are routed through
 * `api.voyant.travel/data/{product}/v1/*`.
 */
export class VoyantDataClient {
  readonly transport: VoyantTransport;
  /** Default language for geo reads; see {@link VoyantDataClientOptions.lang}. */
  private readonly lang?: string;

  readonly air: ReturnType<VoyantDataClient["buildAir"]>;
  readonly fx: ReturnType<VoyantDataClient["buildFx"]>;
  readonly geo: ReturnType<VoyantDataClient["buildGeo"]>;
  readonly reviews: ReturnType<VoyantDataClient["buildReviews"]>;
  readonly hotels: ReturnType<VoyantDataClient["buildHotels"]>;
  readonly restaurants: {
    tripadvisor: ReturnType<VoyantDataClient["buildTripadvisorVertical"]>;
    google: ReturnType<VoyantDataClient["buildGoogleRestaurants"]>;
  };
  readonly experiences: {
    tripadvisor: ReturnType<VoyantDataClient["buildTripadvisorVertical"]>;
  };

  /**
   * Namespaces are constructed in the body after `this.transport` is wired —
   * not as class field initializers — because field initializers fire before
   * the constructor body, so they would close over an `undefined` transport.
   */
  constructor(options: VoyantDataClientOptions) {
    this.transport = new VoyantTransport(options);
    this.lang = options.lang;
    this.air = this.buildAir();
    this.fx = this.buildFx();
    this.geo = this.buildGeo();
    this.reviews = this.buildReviews();
    this.hotels = this.buildHotels();
    this.restaurants = {
      tripadvisor: this.buildTripadvisorVertical(RESTAURANTS),
      google: this.buildGoogleRestaurants(),
    };
    this.experiences = {
      tripadvisor: this.buildTripadvisorVertical(EXPERIENCES),
    };
  }

  // ─────────────────────────────────────────────────────────────
  // /data/geo — canonical travel geography (gazetteer + resolver)
  // ─────────────────────────────────────────────────────────────

  private buildGeo() {
    const t = this.transport;
    const lang = this.lang;
    // Merge the client's default language into a geo query. An explicit per-call
    // `lang`/`names` wins (it follows the spread). Returns undefined when there
    // is neither a default nor params, so no empty query string is sent.
    const withLang = (params?: QueryParams): QueryParams | undefined =>
      lang === undefined ? params : { lang, ...params };

    const places = {
      list: (params?: PlaceListParams) =>
        t.request<ListResponse<CanonicalPlace>>(`${GEO}/places`, {
          query: withLang(params),
          unwrapData: false,
        }),
      search: (
        params: {
          q: string;
          type?: CanonicalPlaceType;
          limit?: number;
        } & PlaceLangParams,
      ) =>
        t.request<ListResponse<CanonicalPlace>>(`${GEO}/places/search`, {
          query: withLang(params),
          unwrapData: false,
        }),
      get: (id: string, params?: PlaceLangParams) =>
        t.request<PlaceWithRelations>(`${GEO}/places/${enc(id)}`, {
          query: withLang(params),
          unwrapData: false,
        }),
      children: (
        id: string,
        params?: { type?: CanonicalPlaceType } & PlaceLangParams,
      ) =>
        t.request<ListResponse<CanonicalPlace>>(
          `${GEO}/places/${enc(id)}/children`,
          { query: withLang(params), unwrapData: false },
        ),
      ancestors: (id: string, params?: PlaceLangParams) =>
        t.request<{ data: CanonicalPlace[] }>(
          `${GEO}/places/${enc(id)}/ancestors`,
          { query: withLang(params), unwrapData: false },
        ),
      related: (
        id: string,
        params?: {
          relation?: PlaceRelationKind;
          type?: CanonicalPlaceType;
          direction?: "incoming" | "outgoing";
        } & PlaceLangParams,
      ) =>
        t.request<ListResponse<CanonicalPlace>>(
          `${GEO}/places/${enc(id)}/related`,
          { query: withLang(params), unwrapData: false },
        ),
      resolve: (request: PlaceResolveRequest, params?: PlaceLangParams) =>
        t.request<PlaceResolveResult>(`${GEO}/places/resolve`, {
          method: "POST",
          body: request,
          query: withLang(params),
          unwrapData: false,
        }),
    };

    // Typed convenience surfaces over the single `places` table — callers write
    // geo.countries.list() instead of geo.places.list({ type: "country" }).
    const typed = (type: CanonicalPlaceType) => ({
      list: (params?: Omit<PlaceListParams, "type">) =>
        places.list({ ...params, type }),
      get: (id: string, params?: PlaceLangParams) => places.get(id, params),
    });

    return {
      places,
      countries: {
        ...typed("country"),
        /** Rivers flowing through this country. */
        rivers: (iso2: string) =>
          places.related(iso2, { relation: "flows_through", type: "river" }),
        /** ISO 3166-2 subdivisions (states/provinces) of this country. */
        subdivisions: (iso2: string, params?: PlaceLangParams) =>
          places.children(iso2, { ...params, type: "subdivision" }),
      },
      regions: typed("region"),
      /** ISO 3166-2 subdivisions; the id is the code, e.g. `US-CA`. */
      subdivisions: typed("subdivision"),
      cities: typed("city"),
      ports: typed("port"),
      rivers: {
        ...typed("river"),
        /** The countries a river flows through. */
        countries: (id: string) =>
          places.related(id, {
            relation: "flows_through",
            direction: "outgoing",
          }),
      },
      // Reference catalogs that decode geo's own data but are not places:
      // languages (multilingual place names) + timezones (place/airport tz
      // fields), under /data/geo/v1/reference/*. Currencies live with fx.
      reference: {
        languages: {
          list: () =>
            t.request<ListResponse<LanguageEntry>>(
              `${GEO}/reference/languages`,
              { unwrapData: false },
            ),
          get: (code: string) =>
            t.request<SingleResponse<LanguageEntry>>(
              `${GEO}/reference/languages/${enc(code)}`,
              { unwrapData: false },
            ),
        },
        timezones: {
          list: () =>
            t.request<ListResponse<TimezoneEntry>>(
              `${GEO}/reference/timezones`,
              { unwrapData: false },
            ),
        },
      },
      /** Resolve a single provider label/code to a canonical place (any type). */
      resolve: (
        label: string,
        hints?: {
          providerCode?: string;
          countryHint?: string;
          typeHint?: CanonicalPlaceType;
        },
      ) => places.resolve({ items: [{ label, ...hints }] }),
    };
  }

  // ─────────────────────────────────────────────────────────────
  // /data/air — aviation reference data (airports, airlines, aircraft)
  // ─────────────────────────────────────────────────────────────

  private buildAir() {
    const t = this.transport;
    return {
      airports: {
        get: (iata: string) =>
          t.request<SingleResponse<Airport>>(`${AIR}/airports/${enc(iata)}`, {
            unwrapData: false,
          }),
        search: (params: {
          q: string;
          country?: string;
          scheduledServiceOnly?: boolean;
          limit?: number;
        }) =>
          t.request<ListResponse<Airport>>(`${AIR}/airports/search`, {
            query: params,
            unwrapData: false,
          }),
        nearby: (params: {
          latitude: number;
          longitude: number;
          radiusKm: number;
          scheduledServiceOnly?: boolean;
          limit?: number;
        }) =>
          t.request<ListResponse<Airport & { distanceKm: number }>>(
            `${AIR}/airports/nearby`,
            { query: params, unwrapData: false },
          ),
      },
      airlines: {
        get: (iata: string) =>
          t.request<SingleResponse<Airline>>(`${AIR}/airlines/${enc(iata)}`, {
            unwrapData: false,
          }),
        search: (params: {
          q: string;
          country?: string;
          activeOnly?: boolean;
          limit?: number;
        }) =>
          t.request<ListResponse<Airline>>(`${AIR}/airlines/search`, {
            query: params,
            unwrapData: false,
          }),
      },
      aircraft: {
        list: (params?: { manufacturer?: string; category?: string }) =>
          t.request<ListResponse<Aircraft>>(`${AIR}/aircraft`, {
            query: params,
            unwrapData: false,
          }),
        get: (iata: string) =>
          t.request<SingleResponse<Aircraft>>(`${AIR}/aircraft/${enc(iata)}`, {
            unwrapData: false,
          }),
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // /data/fx — exchangerate-api.com white-label.
  //
  // The FX worker namespaces routes under `/v1/fx/...`, so the public path is
  // `/data/fx/v1/fx/...` (the `fx` segment is intentional — it preserves the
  // upstream URL hierarchy under our gateway).
  // ─────────────────────────────────────────────────────────────

  private buildFx() {
    const t = this.transport;
    const base = `${FX}/fx`;
    return {
      latest: (currency: string) =>
        t.request<FxLatestResponse>(`${base}/latest/${enc(currency)}`, {
          unwrapData: false,
        }),
      pair: (base_: string, target: string, amount?: number) => {
        const path =
          amount === undefined
            ? `${base}/pair/${enc(base_)}/${enc(target)}`
            : `${base}/pair/${enc(base_)}/${enc(target)}/${amount}`;
        return t.request<FxPairResponse>(path, { unwrapData: false });
      },
      enriched: (base_: string, target: string) =>
        t.request<FxEnrichedResponse>(
          `${base}/enriched/${enc(base_)}/${enc(target)}`,
          { unwrapData: false },
        ),
      history: (
        currency: string,
        year: number,
        month: number,
        day: number,
        amount?: number,
      ) => {
        const root = `${base}/history/${enc(currency)}/${year}/${month}/${day}`;
        const path = amount === undefined ? root : `${root}/${amount}`;
        return t.request<FxHistoryResponse>(path, { unwrapData: false });
      },
      codes: () =>
        t.request<FxCodesResponse>(`${base}/codes`, { unwrapData: false }),
      quota: () =>
        t.request<FxQuotaResponse>(`${base}/quota`, { unwrapData: false }),
      // ISO 4217 currency catalog — Voyant-owned static reference (not a
      // passthrough), at /data/fx/v1/currencies (no extra /fx segment). The
      // canonical formatting/decoder catalog; `codes` is the live supported set.
      currencies: {
        list: () =>
          t.request<ListResponse<CurrencyEntry>>(`${FX}/currencies`, {
            unwrapData: false,
          }),
        get: (code: string) =>
          t.request<SingleResponse<CurrencyEntry>>(
            `${FX}/currencies/${enc(code)}`,
            { unwrapData: false },
          ),
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // /data/reviews — Google + Trustpilot
  // ─────────────────────────────────────────────────────────────

  private buildReviews() {
    const t = this.transport;
    return {
      google: {
        reviews: {
          create: (request: GoogleReviewsRequest) =>
            t.request<SingleResponse<GoogleReviews>>(
              `${REVIEWS}/google/reviews`,
              { method: "POST", body: request, unwrapData: false },
            ),
          list: (params?: AsyncListParams) =>
            t.request<ListResponse<GoogleReviews>>(
              `${REVIEWS}/google/reviews`,
              { query: params, unwrapData: false },
            ),
          get: (id: string) =>
            t.request<SingleResponse<GoogleReviews>>(
              `${REVIEWS}/google/reviews/${enc(id)}`,
              { unwrapData: false },
            ),
        },
        extendedReviews: {
          create: (request: GoogleReviewsRequest) =>
            t.request<SingleResponse<GoogleExtendedReviews>>(
              `${REVIEWS}/google/extended-reviews`,
              { method: "POST", body: request, unwrapData: false },
            ),
          list: (params?: AsyncListParams) =>
            t.request<ListResponse<GoogleExtendedReviews>>(
              `${REVIEWS}/google/extended-reviews`,
              { query: params, unwrapData: false },
            ),
          get: (id: string) =>
            t.request<SingleResponse<GoogleExtendedReviews>>(
              `${REVIEWS}/google/extended-reviews/${enc(id)}`,
              { unwrapData: false },
            ),
        },
        qa: {
          create: (request: GoogleQaRequest) =>
            t.request<SingleResponse<GoogleQa>>(`${REVIEWS}/google/qa`, {
              method: "POST",
              body: request,
              unwrapData: false,
            }),
          list: (params?: AsyncListParams) =>
            t.request<ListResponse<GoogleQa>>(`${REVIEWS}/google/qa`, {
              query: params,
              unwrapData: false,
            }),
          get: (id: string) =>
            t.request<SingleResponse<GoogleQa>>(
              `${REVIEWS}/google/qa/${enc(id)}`,
              { unwrapData: false },
            ),
          run: (request: GoogleQaRequest) =>
            t.request<SingleResponse<GoogleQa>>(`${REVIEWS}/google/qa:run`, {
              method: "POST",
              body: request,
              unwrapData: false,
            }),
        },
      },
      trustpilot: {
        search: {
          create: (request: TrustpilotSearchRequest) =>
            t.request<SingleResponse<TrustpilotSearch>>(
              `${REVIEWS}/trustpilot/searches`,
              { method: "POST", body: request, unwrapData: false },
            ),
          list: (params?: AsyncListParams) =>
            t.request<ListResponse<TrustpilotSearch>>(
              `${REVIEWS}/trustpilot/searches`,
              { query: params, unwrapData: false },
            ),
          get: (id: string) =>
            t.request<SingleResponse<TrustpilotSearch>>(
              `${REVIEWS}/trustpilot/searches/${enc(id)}`,
              { unwrapData: false },
            ),
        },
        reviews: {
          create: (request: TrustpilotReviewsRequest) =>
            t.request<SingleResponse<TrustpilotReviews>>(
              `${REVIEWS}/trustpilot/reviews`,
              { method: "POST", body: request, unwrapData: false },
            ),
          list: (params?: AsyncListParams) =>
            t.request<ListResponse<TrustpilotReviews>>(
              `${REVIEWS}/trustpilot/reviews`,
              { query: params, unwrapData: false },
            ),
          get: (id: string) =>
            t.request<SingleResponse<TrustpilotReviews>>(
              `${REVIEWS}/trustpilot/reviews/${enc(id)}`,
              { unwrapData: false },
            ),
        },
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // /data/hotels — Google + TripAdvisor
  // ─────────────────────────────────────────────────────────────

  private buildHotels() {
    const t = this.transport;
    return {
      google: {
        hotelSearches: {
          create: (request: GoogleHotelSearchesRequest) =>
            t.request<SingleResponse<GoogleHotelSearches>>(
              `${HOTELS}/google/hotel-searches`,
              { method: "POST", body: request, unwrapData: false },
            ),
          list: (params?: AsyncListParams) =>
            t.request<ListResponse<GoogleHotelSearches>>(
              `${HOTELS}/google/hotel-searches`,
              { query: params, unwrapData: false },
            ),
          get: (id: string) =>
            t.request<SingleResponse<GoogleHotelSearches>>(
              `${HOTELS}/google/hotel-searches/${enc(id)}`,
              { unwrapData: false },
            ),
          run: (request: GoogleHotelSearchesRequest) =>
            t.request<SingleResponse<GoogleHotelSearches>>(
              `${HOTELS}/google/hotel-searches:run`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        hotelInfo: {
          create: (request: GoogleHotelInfoRequest) =>
            t.request<SingleResponse<GoogleHotelInfo>>(
              `${HOTELS}/google/hotel-info`,
              { method: "POST", body: request, unwrapData: false },
            ),
          list: (params?: AsyncListParams) =>
            t.request<ListResponse<GoogleHotelInfo>>(
              `${HOTELS}/google/hotel-info`,
              { query: params, unwrapData: false },
            ),
          get: (id: string) =>
            t.request<SingleResponse<GoogleHotelInfo>>(
              `${HOTELS}/google/hotel-info/${enc(id)}`,
              { unwrapData: false },
            ),
          run: (request: GoogleHotelInfoRequest) =>
            t.request<SingleResponse<GoogleHotelInfo>>(
              `${HOTELS}/google/hotel-info:run`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
      },
      tripadvisor: this.buildTripadvisorVertical(HOTELS),
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Restaurants — live Google Maps search (no async lifecycle).
  // ─────────────────────────────────────────────────────────────

  private buildGoogleRestaurants() {
    const t = this.transport;
    return {
      restaurantSearches: {
        /** Live restaurant search — returns results immediately. */
        run: (request: GoogleRestaurantSearchesInput) =>
          t.request<SingleResponse<GoogleRestaurantSearchesResult>>(
            `${RESTAURANTS}/google/restaurant-searches:run`,
            { method: "POST", body: request, unwrapData: false },
          ),
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // TripAdvisor verticals — same shape under hotels/restaurants/experiences.
  // The reference catalogs (locations + languages) are duplicated under each
  // vertical because the gateway exposes them at three distinct URLs (one per
  // worker); a shared sub-method would obscure that. The data is identical
  // — the URL is the only thing that differs.
  // ─────────────────────────────────────────────────────────────

  private buildTripadvisorVertical(productPrefix: string) {
    const t = this.transport;
    const base = `${productPrefix}/tripadvisor`;
    return {
      searches: {
        create: (request: TripadvisorSearchRequest) =>
          t.request<SingleResponse<TripadvisorSearch>>(`${base}/searches`, {
            method: "POST",
            body: request,
            unwrapData: false,
          }),
        list: (params?: AsyncListParams) =>
          t.request<ListResponse<TripadvisorSearch>>(`${base}/searches`, {
            query: params,
            unwrapData: false,
          }),
        get: (id: string) =>
          t.request<SingleResponse<TripadvisorSearch>>(
            `${base}/searches/${enc(id)}`,
            { unwrapData: false },
          ),
      },
      reviews: {
        create: (request: TripadvisorReviewsRequest) =>
          t.request<SingleResponse<TripadvisorReviews>>(`${base}/reviews`, {
            method: "POST",
            body: request,
            unwrapData: false,
          }),
        list: (params?: AsyncListParams) =>
          t.request<ListResponse<TripadvisorReviews>>(`${base}/reviews`, {
            query: params,
            unwrapData: false,
          }),
        get: (id: string) =>
          t.request<SingleResponse<TripadvisorReviews>>(
            `${base}/reviews/${enc(id)}`,
            { unwrapData: false },
          ),
      },
      reference: {
        locations: {
          list: (params?: CountryFilteredPaginationParams) =>
            t.request<ListResponse<TripadvisorReferenceLocation>>(
              `${base}/reference/locations`,
              { query: params, unwrapData: false },
            ),
          listByCountry: (countryCode: string, params?: PaginationParams) =>
            t.request<ListResponse<TripadvisorReferenceLocation>>(
              `${base}/reference/locations/${enc(countryCode)}`,
              { query: params, unwrapData: false },
            ),
        },
        languages: {
          list: () =>
            t.request<ListResponse<TripadvisorReferenceLanguage>>(
              `${base}/reference/languages`,
              { unwrapData: false },
            ),
        },
      },
    };
  }
}

export function createVoyantDataClient(options: VoyantDataClientOptions) {
  return new VoyantDataClient(options);
}
