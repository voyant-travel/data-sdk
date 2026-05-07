import { VoyantTransport } from "@voyant-sdk/sdk-core";

import type {
  Aircraft,
  AiKeywordDataLocation,
  AiKeywordVolumesRequest,
  AiKeywordVolumesResult,
  AiSummaryInput,
  AiSummaryResult,
  Airline,
  Airport,
  AvailableHistoryRequest,
  AvailableHistoryResult,
  BacklinkAnchorsRequest,
  BacklinkAnchorsResult,
  BacklinksDomainIntersectionRequest,
  BacklinksDomainIntersectionResult,
  BacklinksHistoryRequest,
  BacklinksHistoryResult,
  BacklinksIndex,
  BacklinksListRequest,
  BacklinksListResult,
  BacklinksPageIntersectionRequest,
  BacklinksPageIntersectionResult,
  BacklinksStatus,
  BacklinksSummaryRequest,
  BacklinksSummaryResult,
  BulkBacklinksRequest,
  BulkBacklinksResult,
  BulkKeywordDifficultyRequest,
  BulkKeywordDifficultyResult,
  BulkNewLostBacklinksRequest,
  BulkNewLostBacklinksResult,
  BulkNewLostReferringDomainsRequest,
  BulkNewLostReferringDomainsResult,
  BulkPagesSummaryRequest,
  BulkPagesSummaryResult,
  BulkRanksRequest,
  BulkRanksResult,
  BulkReferringDomainsRequest,
  BulkReferringDomainsResult,
  BulkSpamScoreRequest,
  BulkSpamScoreResult,
  BulkTrafficEstimationRequest,
  BulkTrafficEstimationResult,
  BusinessDataAsyncStatus,
  BusinessDataCategory,
  BusinessDataLocation,
  BusinessListingsCategoriesAggregationRequest,
  BusinessListingsCategoriesAggregationResult,
  BusinessListingsSearchRequest,
  BusinessListingsSearchResult,
  CategoriesForDomainRequest,
  CategoriesForDomainResult,
  CategoriesForKeywordsRequest,
  CategoriesForKeywordsResult,
  City,
  ClickstreamBulkSearchVolumeRequest,
  ClickstreamBulkVolumeResult,
  ClickstreamGlobalSearchVolumeRequest,
  ClickstreamGlobalVolumeResult,
  ClickstreamLocationLanguage,
  ClickstreamSearchVolumeRequest,
  ClickstreamSearchVolumeResult,
  CompetitorsDomainRequest,
  CompetitorsDomainResult,
  CompetitorsRequest,
  CompetitorsResult,
  ContentAnalysisCategory,
  ContentAnalysisCategoryTrendsRequest,
  ContentAnalysisCategoryTrendsResult,
  ContentAnalysisLocation,
  ContentAnalysisPhraseTrendsRequest,
  ContentAnalysisPhraseTrendsResult,
  ContentAnalysisRatingDistributionRequest,
  ContentAnalysisRatingDistributionResult,
  ContentAnalysisSearchRequest,
  ContentAnalysisSearchResult,
  ContentAnalysisSentimentAnalysisRequest,
  ContentAnalysisSentimentAnalysisResult,
  ContentAnalysisSummaryRequest,
  ContentAnalysisSummaryResult,
  ContentParsing,
  ContentParsingRequest,
  Country,
  CountryFilteredPaginationParams,
  CurrencyEntry,
  DataforseoLabsCategory,
  DataforseoLabsLocationLanguage,
  DataforseoLabsStatus,
  DomainAnalyticsTechnologyCatalogEntry,
  DomainIntersectionRequest,
  DomainIntersectionResult,
  DomainMetricsByCategoriesRequest,
  DomainMetricsByCategoriesResult,
  DomainPagesRequest,
  DomainPagesResult,
  DomainRankOverviewRequest,
  DomainRankOverviewResult,
  FilterCatalog,
  FxCodesResponse,
  FxEnrichedResponse,
  FxHistoryResponse,
  FxLatestResponse,
  FxPairResponse,
  FxQuotaResponse,
  GeographicRegion,
  GoogleAdsAdTrafficByKeywordsRequest,
  GoogleAdsAdTrafficResult,
  GoogleAdsAdvertisersSearchInput,
  GoogleAdsKeywordVolumesResult,
  GoogleAdsKeywordsForKeywordsRequest,
  GoogleAdsKeywordsForSiteRequest,
  GoogleAdsSearchInput,
  GoogleAdsSearchVolumeRequest,
  GoogleAdsStatus,
  GoogleAiModeSearchInput,
  GoogleAutocompleteSearchInput,
  GoogleExtendedReviews,
  GoogleHotelInfo,
  GoogleHotelInfoRequest,
  GoogleHotelSearches,
  GoogleHotelSearchesRequest,
  GoogleMapsSearchInput,
  GoogleMyBusinessInfo,
  GoogleMyBusinessInfoRequest,
  GoogleMyBusinessUpdates,
  GoogleMyBusinessUpdatesRequest,
  GoogleOrganicSearchInput,
  GoogleQa,
  GoogleQaRequest,
  GoogleReviews,
  GoogleReviewsRequest,
  GoogleTrendsCategory,
  GoogleTrendsExploreRequest,
  GoogleTrendsExploreResult,
  GoogleTrendsLocation,
  HistoricalBulkTrafficEstimationRequest,
  HistoricalBulkTrafficEstimationResult,
  HistoricalKeywordDataRequest,
  HistoricalKeywordDataResult,
  HistoricalRankOverviewRequest,
  HistoricalRankOverviewResult,
  HistoricalSerpsRequest,
  HistoricalSerpsResult,
  InstantPagesRequest,
  InstantPagesResult,
  KeywordIdeasRequest,
  KeywordIdeasResult,
  KeywordOverviewRequest,
  KeywordOverviewResult,
  KeywordSuggestionsRequest,
  KeywordSuggestionsResult,
  KeywordsDataAsyncFeature,
  KeywordsDataJob,
  KeywordsDataSubModule,
  KeywordsForCategoriesRequest,
  KeywordsForCategoriesResult,
  KeywordsForSiteRequest,
  KeywordsForSiteResult,
  LanguageEntry,
  LighthouseAudit,
  LighthouseAvailableAudit,
  LighthouseLanguage,
  LighthouseRequest,
  LighthouseVersion,
  ListResponse,
  LlmMentionsAggregatedRequest,
  LlmMentionsAggregatedResult,
  LlmMentionsCrossAggregatedRequest,
  LlmMentionsCrossAggregatedResult,
  LlmMentionsSearchRequest,
  LlmMentionsSearchResult,
  LlmMentionsTopDomainsRequest,
  LlmMentionsTopDomainsResult,
  LlmMentionsTopPagesRequest,
  LlmMentionsTopPagesResult,
  PageIntersectionRequest,
  PageIntersectionResult,
  PaginationParams,
  RankedKeywordsRequest,
  RankedKeywordsResult,
  ReferringDomainsRequest,
  ReferringDomainsResult,
  ReferringNetworksRequest,
  ReferringNetworksResult,
  Region,
  RelatedKeywordsRequest,
  RelatedKeywordsResult,
  RelevantPagesRequest,
  RelevantPagesResult,
  ResolvedLanguage,
  ResolvedLocation,
  ScreenshotInput,
  ScreenshotResult,
  Search,
  SearchIntentRequest,
  SearchIntentResult,
  SerpCompetitorsRequest,
  SerpCompetitorsResult,
  SingleResponse,
  SiteAudit,
  SiteAuditCreateRequest,
  SiteAuditDuplicateContentResult,
  SiteAuditDuplicateTagsResult,
  SiteAuditKeywordDensityResult,
  SiteAuditLinksResult,
  SiteAuditMicrodataResult,
  SiteAuditNonIndexableResult,
  SiteAuditPageByResourceResult,
  SiteAuditPageScreenshotResult,
  SiteAuditPagesResult,
  SiteAuditRawHtmlResult,
  SiteAuditRedirectChainsResult,
  SiteAuditResourcesResult,
  SiteAuditResultRequest,
  SiteAuditStatus,
  SiteAuditUncrawlableResourcesResult,
  SiteAuditWaterfallResult,
  SubdomainsRequest,
  SubdomainsResult,
  TechnologiesAggregationRequest,
  TechnologiesAggregationResult,
  TechnologiesByDomainRequest,
  TechnologiesByDomainResult,
  TechnologiesDomainsByHtmlTermsRequest,
  TechnologiesDomainsByTechnologyRequest,
  TechnologiesDomainsResult,
  TechnologiesStatsRequest,
  TechnologiesStatsResult,
  TechnologiesSummaryRequest,
  TechnologiesSummaryResult,
  TimeseriesNewLostSummaryRequest,
  TimeseriesNewLostSummaryResult,
  TimeseriesSummaryRequest,
  TimeseriesSummaryResult,
  TimezoneEntry,
  TopSearchesRequest,
  TopSearchesResult,
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
  WhoisListRequest,
  WhoisListResult,
} from "./types/index.js";

const STATIC = "/data/static/v1";
const FX = "/data/fx/v1";
const SEO = "/data/seo/v1";
const REVIEWS = "/data/reviews/v1";
const HOTELS = "/data/hotels/v1";
const RESTAURANTS = "/data/restaurants/v1";
const EXPERIENCES = "/data/experiences/v1";

function enc(value: string): string {
  return encodeURIComponent(value);
}

interface AsyncListParams extends PaginationParams {
  status?: BusinessDataAsyncStatus;
}

/**
 * Public client for the Voyant Data API. All seven sub-products (`static`,
 * `fx`, `seo`, `reviews`, `hotels`, `restaurants`, `experiences`) are routed
 * through `api.voyantjs.com/data/{product}/v1/*`.
 */
export class VoyantDataClient {
  readonly transport: VoyantTransport;

  readonly static: ReturnType<VoyantDataClient["buildStatic"]>;
  readonly fx: ReturnType<VoyantDataClient["buildFx"]>;
  readonly seo: ReturnType<VoyantDataClient["buildSeo"]>;
  readonly reviews: ReturnType<VoyantDataClient["buildReviews"]>;
  readonly hotels: ReturnType<VoyantDataClient["buildHotels"]>;
  readonly restaurants: {
    tripadvisor: ReturnType<VoyantDataClient["buildTripadvisorVertical"]>;
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
    this.static = this.buildStatic();
    this.fx = this.buildFx();
    this.seo = this.buildSeo();
    this.reviews = this.buildReviews();
    this.hotels = this.buildHotels();
    this.restaurants = {
      tripadvisor: this.buildTripadvisorVertical(RESTAURANTS),
    };
    this.experiences = {
      tripadvisor: this.buildTripadvisorVertical(EXPERIENCES),
    };
  }

  // ─────────────────────────────────────────────────────────────
  // /data/static — owned reference data
  // ─────────────────────────────────────────────────────────────

  private buildStatic() {
    const t = this.transport;
    return {
      countries: {
        list: (params?: { region?: string; subregion?: string }) =>
          t.request<ListResponse<Country>>(`${STATIC}/countries`, {
            query: params,
            unwrapData: false,
          }),
        get: (iso2: string) =>
          t.request<SingleResponse<Country>>(
            `${STATIC}/countries/${enc(iso2)}`,
            { unwrapData: false },
          ),
      },
      regions: {
        list: (params?: { country?: string; type?: string }) =>
          t.request<ListResponse<Region>>(`${STATIC}/regions`, {
            query: params,
            unwrapData: false,
          }),
        get: (code: string) =>
          t.request<SingleResponse<Region>>(`${STATIC}/regions/${enc(code)}`, {
            unwrapData: false,
          }),
      },
      cities: {
        get: (id: string) =>
          t.request<SingleResponse<City>>(`${STATIC}/cities/${enc(id)}`, {
            unwrapData: false,
          }),
        search: (params: { q: string; country?: string; limit?: number }) =>
          t.request<ListResponse<City>>(`${STATIC}/cities/search`, {
            query: params,
            unwrapData: false,
          }),
        nearby: (params: {
          latitude: number;
          longitude: number;
          radiusKm: number;
          limit?: number;
        }) =>
          t.request<ListResponse<City & { distanceKm: number }>>(
            `${STATIC}/cities/nearby`,
            { query: params, unwrapData: false },
          ),
      },
      airports: {
        get: (iata: string) =>
          t.request<SingleResponse<Airport>>(
            `${STATIC}/airports/${enc(iata)}`,
            { unwrapData: false },
          ),
        search: (params: {
          q: string;
          country?: string;
          scheduledServiceOnly?: boolean;
          limit?: number;
        }) =>
          t.request<ListResponse<Airport>>(`${STATIC}/airports/search`, {
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
            `${STATIC}/airports/nearby`,
            { query: params, unwrapData: false },
          ),
      },
      airlines: {
        get: (iata: string) =>
          t.request<SingleResponse<Airline>>(
            `${STATIC}/airlines/${enc(iata)}`,
            { unwrapData: false },
          ),
        search: (params: {
          q: string;
          country?: string;
          activeOnly?: boolean;
          limit?: number;
        }) =>
          t.request<ListResponse<Airline>>(`${STATIC}/airlines/search`, {
            query: params,
            unwrapData: false,
          }),
      },
      aircraft: {
        list: (params?: { manufacturer?: string; category?: string }) =>
          t.request<ListResponse<Aircraft>>(`${STATIC}/aircraft`, {
            query: params,
            unwrapData: false,
          }),
        get: (iata: string) =>
          t.request<SingleResponse<Aircraft>>(
            `${STATIC}/aircraft/${enc(iata)}`,
            { unwrapData: false },
          ),
      },
      languages: {
        list: () =>
          t.request<ListResponse<LanguageEntry>>(`${STATIC}/languages`, {
            unwrapData: false,
          }),
        get: (code: string) =>
          t.request<SingleResponse<LanguageEntry>>(
            `${STATIC}/languages/${enc(code)}`,
            { unwrapData: false },
          ),
      },
      currencies: {
        list: () =>
          t.request<ListResponse<CurrencyEntry>>(`${STATIC}/currencies`, {
            unwrapData: false,
          }),
        get: (code: string) =>
          t.request<SingleResponse<CurrencyEntry>>(
            `${STATIC}/currencies/${enc(code)}`,
            { unwrapData: false },
          ),
      },
      timezones: {
        list: () =>
          t.request<ListResponse<TimezoneEntry>>(`${STATIC}/timezones`, {
            unwrapData: false,
          }),
      },
      geographicRegions: {
        list: () =>
          t.request<ListResponse<GeographicRegion>>(
            `${STATIC}/geographic-regions`,
            { unwrapData: false },
          ),
        get: (code: string) =>
          t.request<SingleResponse<GeographicRegion>>(
            `${STATIC}/geographic-regions/${enc(code)}`,
            { unwrapData: false },
          ),
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
    };
  }

  // ─────────────────────────────────────────────────────────────
  // /data/seo — DataForSEO white-label, organized by sub-product.
  // ─────────────────────────────────────────────────────────────

  private buildSeo() {
    return {
      serp: this.buildSerp(),
      keywordsData: this.buildKeywordsData(),
      aiOptimization: this.buildAiOptimization(),
      backlinks: this.buildBacklinks(),
      domainAnalytics: this.buildDomainAnalytics(),
      contentAnalysis: this.buildContentAnalysis(),
      onPage: this.buildOnPage(),
      businessData: this.buildBusinessData(),
      dataforseoLabs: this.buildDataforseoLabs(),
    };
  }

  private buildSerp() {
    const t = this.transport;
    return {
      google: {
        locations: {
          list: (params?: CountryFilteredPaginationParams) =>
            t.request<ListResponse<ResolvedLocation>>(
              `${SEO}/serp/google/locations`,
              { query: params, unwrapData: false },
            ),
          listByCountry: (countryCode: string, params?: PaginationParams) =>
            t.request<ListResponse<ResolvedLocation>>(
              `${SEO}/serp/google/locations/${enc(countryCode)}`,
              { query: params, unwrapData: false },
            ),
        },
        languages: {
          list: () =>
            t.request<ListResponse<ResolvedLanguage>>(
              `${SEO}/serp/google/languages`,
              { unwrapData: false },
            ),
        },
        organic: {
          searches: {
            ...this.buildSearchFeature<GoogleOrganicSearchInput>(
              `${SEO}/serp/google/organic`,
            ),
            screenshot: this.buildScreenshotMethod(
              `${SEO}/serp/google/organic`,
            ),
            aiSummary: this.buildAiSummaryMethod(`${SEO}/serp/google/organic`),
          },
        },
        aiMode: {
          languages: {
            list: () =>
              t.request<ListResponse<ResolvedLanguage>>(
                `${SEO}/serp/google/ai-mode/languages`,
                { unwrapData: false },
              ),
          },
          searches: {
            ...this.buildSearchFeature<GoogleAiModeSearchInput>(
              `${SEO}/serp/google/ai-mode`,
            ),
            screenshot: this.buildScreenshotMethod(
              `${SEO}/serp/google/ai-mode`,
            ),
            aiSummary: this.buildAiSummaryMethod(`${SEO}/serp/google/ai-mode`),
          },
        },
        autocomplete: {
          searches: this.buildSearchFeature<GoogleAutocompleteSearchInput>(
            `${SEO}/serp/google/autocomplete`,
          ),
        },
        maps: {
          searches: {
            ...this.buildSearchFeature<GoogleMapsSearchInput>(
              `${SEO}/serp/google/maps`,
            ),
            // Both screenshot and ai-summary URLs are mounted by the worker,
            // although the screenshot handler returns FEATURE_NOT_SUPPORTED
            // at our edge for Maps (no HTML payload upstream). Exposing them
            // keeps the client surface aligned with the public manifest.
            screenshot: this.buildScreenshotMethod(`${SEO}/serp/google/maps`),
            aiSummary: this.buildAiSummaryMethod(`${SEO}/serp/google/maps`),
          },
        },
        adsSearch: {
          locations: {
            list: (params?: CountryFilteredPaginationParams) =>
              t.request<ListResponse<ResolvedLocation>>(
                `${SEO}/serp/google/ads-search/locations`,
                { query: params, unwrapData: false },
              ),
            listByCountry: (countryCode: string, params?: PaginationParams) =>
              t.request<ListResponse<ResolvedLocation>>(
                `${SEO}/serp/google/ads-search/locations/${enc(countryCode)}`,
                { query: params, unwrapData: false },
              ),
          },
          searches: this.buildSearchFeature<GoogleAdsSearchInput>(
            `${SEO}/serp/google/ads-search`,
          ),
        },
        adsAdvertisers: {
          locations: {
            list: (params?: CountryFilteredPaginationParams) =>
              t.request<ListResponse<ResolvedLocation>>(
                `${SEO}/serp/google/ads-advertisers/locations`,
                { query: params, unwrapData: false },
              ),
            listByCountry: (countryCode: string, params?: PaginationParams) =>
              t.request<ListResponse<ResolvedLocation>>(
                `${SEO}/serp/google/ads-advertisers/locations/${enc(countryCode)}`,
                { query: params, unwrapData: false },
              ),
          },
          searches: this.buildSearchFeature<GoogleAdsAdvertisersSearchInput>(
            `${SEO}/serp/google/ads-advertisers`,
          ),
        },
      },
    };
  }

  /**
   * Common create / get / listReady trio shared by every SERP feature. The
   * screenshot + ai-summary actions are added separately by `buildSerp` for
   * the features that support them upstream — keeping them out of this
   * helper so route-coverage verification doesn't see optional methods that
   * map to non-existent worker routes.
   */
  private buildSearchFeature<TInput>(base: string) {
    const t = this.transport;
    return {
      create: (request: TInput) =>
        t.request<SingleResponse<Search>>(`${base}/searches`, {
          method: "POST",
          body: request as object,
          unwrapData: false,
        }),
      get: (id: string) =>
        t.request<SingleResponse<Search>>(`${base}/searches/${enc(id)}`, {
          unwrapData: false,
        }),
      listReady: (params?: PaginationParams) =>
        t.request<ListResponse<Search>>(`${base}/searches`, {
          query: { ready: true, ...params },
          unwrapData: false,
        }),
    };
  }

  private buildScreenshotMethod(base: string) {
    const t = this.transport;
    return (id: string, request?: ScreenshotInput) =>
      t.request<SingleResponse<ScreenshotResult>>(
        `${base}/searches/${enc(id)}/screenshot`,
        {
          method: "POST",
          body: (request ?? {}) as object,
          unwrapData: false,
        },
      );
  }

  private buildAiSummaryMethod(base: string) {
    const t = this.transport;
    return (id: string, request?: AiSummaryInput) =>
      t.request<SingleResponse<AiSummaryResult>>(
        `${base}/searches/${enc(id)}/ai-summary`,
        {
          method: "POST",
          body: (request ?? {}) as object,
          unwrapData: false,
        },
      );
  }

  private buildKeywordsData() {
    const t = this.transport;
    return {
      googleAds: {
        status: {
          get: () =>
            t.request<SingleResponse<GoogleAdsStatus>>(
              `${SEO}/keywords-data/google-ads/status`,
              { unwrapData: false },
            ),
        },
        locations: {
          list: (params?: CountryFilteredPaginationParams) =>
            t.request<ListResponse<ResolvedLocation>>(
              `${SEO}/keywords-data/google-ads/locations`,
              { query: params, unwrapData: false },
            ),
          listByCountry: (countryCode: string, params?: PaginationParams) =>
            t.request<ListResponse<ResolvedLocation>>(
              `${SEO}/keywords-data/google-ads/locations/${enc(countryCode)}`,
              { query: params, unwrapData: false },
            ),
        },
        languages: {
          list: () =>
            t.request<ListResponse<ResolvedLanguage>>(
              `${SEO}/keywords-data/google-ads/languages`,
              { unwrapData: false },
            ),
        },
        searchVolume: {
          create: (request: GoogleAdsSearchVolumeRequest) =>
            t.request<
              SingleResponse<
                | GoogleAdsKeywordVolumesResult
                | KeywordsDataJob<GoogleAdsKeywordVolumesResult>
              >
            >(`${SEO}/keywords-data/google-ads/search-volume`, {
              method: "POST",
              body: request,
              unwrapData: false,
            }),
        },
        keywordsForSite: {
          create: (request: GoogleAdsKeywordsForSiteRequest) =>
            t.request<
              SingleResponse<
                | GoogleAdsKeywordVolumesResult
                | KeywordsDataJob<GoogleAdsKeywordVolumesResult>
              >
            >(`${SEO}/keywords-data/google-ads/keywords-for-site`, {
              method: "POST",
              body: request,
              unwrapData: false,
            }),
        },
        keywordsForKeywords: {
          create: (request: GoogleAdsKeywordsForKeywordsRequest) =>
            t.request<
              SingleResponse<
                | GoogleAdsKeywordVolumesResult
                | KeywordsDataJob<GoogleAdsKeywordVolumesResult>
              >
            >(`${SEO}/keywords-data/google-ads/keywords-for-keywords`, {
              method: "POST",
              body: request,
              unwrapData: false,
            }),
        },
        adTrafficByKeywords: {
          create: (request: GoogleAdsAdTrafficByKeywordsRequest) =>
            t.request<
              SingleResponse<
                | GoogleAdsAdTrafficResult
                | KeywordsDataJob<GoogleAdsAdTrafficResult>
              >
            >(`${SEO}/keywords-data/google-ads/ad-traffic-by-keywords`, {
              method: "POST",
              body: request,
              unwrapData: false,
            }),
        },
      },
      googleTrends: {
        locations: {
          list: (params?: CountryFilteredPaginationParams) =>
            t.request<ListResponse<GoogleTrendsLocation>>(
              `${SEO}/keywords-data/google-trends/locations`,
              { query: params, unwrapData: false },
            ),
          listByCountry: (countryCode: string, params?: PaginationParams) =>
            t.request<ListResponse<GoogleTrendsLocation>>(
              `${SEO}/keywords-data/google-trends/locations/${enc(countryCode)}`,
              { query: params, unwrapData: false },
            ),
        },
        languages: {
          list: () =>
            t.request<ListResponse<ResolvedLanguage>>(
              `${SEO}/keywords-data/google-trends/languages`,
              { unwrapData: false },
            ),
        },
        categories: {
          list: () =>
            t.request<ListResponse<GoogleTrendsCategory>>(
              `${SEO}/keywords-data/google-trends/categories`,
              { unwrapData: false },
            ),
        },
        explore: {
          create: (request: GoogleTrendsExploreRequest) =>
            t.request<
              SingleResponse<
                | GoogleTrendsExploreResult
                | KeywordsDataJob<GoogleTrendsExploreResult>
              >
            >(`${SEO}/keywords-data/google-trends/explore`, {
              method: "POST",
              body: request,
              unwrapData: false,
            }),
        },
      },
      clickstream: {
        locationsLanguages: {
          list: (
            params?: PaginationParams & {
              country?: string;
              languageCode?: string;
            },
          ) =>
            t.request<ListResponse<ClickstreamLocationLanguage>>(
              `${SEO}/keywords-data/clickstream-data/locations-languages`,
              { query: params, unwrapData: false },
            ),
        },
        searchVolume: {
          create: (request: ClickstreamSearchVolumeRequest) =>
            t.request<SingleResponse<ClickstreamSearchVolumeResult>>(
              `${SEO}/keywords-data/clickstream-data/search-volume`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        globalSearchVolume: {
          create: (request: ClickstreamGlobalSearchVolumeRequest) =>
            t.request<SingleResponse<ClickstreamGlobalVolumeResult>>(
              `${SEO}/keywords-data/clickstream-data/global-search-volume`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        bulkSearchVolume: {
          create: (request: ClickstreamBulkSearchVolumeRequest) =>
            t.request<SingleResponse<ClickstreamBulkVolumeResult>>(
              `${SEO}/keywords-data/clickstream-data/bulk-search-volume`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
      },
      jobs: {
        get: (id: string) =>
          t.request<SingleResponse<KeywordsDataJob<unknown>>>(
            `${SEO}/keywords-data/jobs/${enc(id)}`,
            { unwrapData: false },
          ),
        listReady: (
          params?: PaginationParams & {
            subModule?: KeywordsDataSubModule;
            feature?: KeywordsDataAsyncFeature;
          },
        ) =>
          t.request<ListResponse<KeywordsDataJob<unknown>>>(
            `${SEO}/keywords-data/jobs`,
            { query: { ready: true, ...params }, unwrapData: false },
          ),
      },
    };
  }

  private buildAiOptimization() {
    const t = this.transport;
    return {
      aiKeywordData: {
        locationsLanguages: {
          list: (
            params?: PaginationParams & {
              country?: string;
              languageCode?: string;
            },
          ) =>
            t.request<ListResponse<AiKeywordDataLocation>>(
              `${SEO}/ai-optimization/ai-keyword-data/locations-languages`,
              { query: params, unwrapData: false },
            ),
        },
        keywordVolumes: {
          create: (request: AiKeywordVolumesRequest) =>
            t.request<SingleResponse<AiKeywordVolumesResult>>(
              `${SEO}/ai-optimization/ai-keyword-data/keyword-volumes`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
      },
      llmMentions: {
        search: {
          create: (request: LlmMentionsSearchRequest) =>
            t.request<SingleResponse<LlmMentionsSearchResult>>(
              `${SEO}/ai-optimization/llm-mentions/search`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        topPages: {
          create: (request: LlmMentionsTopPagesRequest) =>
            t.request<SingleResponse<LlmMentionsTopPagesResult>>(
              `${SEO}/ai-optimization/llm-mentions/top-pages`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        topDomains: {
          create: (request: LlmMentionsTopDomainsRequest) =>
            t.request<SingleResponse<LlmMentionsTopDomainsResult>>(
              `${SEO}/ai-optimization/llm-mentions/top-domains`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        aggregatedMetrics: {
          create: (request: LlmMentionsAggregatedRequest) =>
            t.request<SingleResponse<LlmMentionsAggregatedResult>>(
              `${SEO}/ai-optimization/llm-mentions/aggregated-metrics`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        crossAggregatedMetrics: {
          create: (request: LlmMentionsCrossAggregatedRequest) =>
            t.request<SingleResponse<LlmMentionsCrossAggregatedResult>>(
              `${SEO}/ai-optimization/llm-mentions/cross-aggregated-metrics`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
      },
    };
  }

  private buildBacklinks() {
    const t = this.transport;
    const post = <Req, Res>(suffix: string) => ({
      create: (request: Req) =>
        t.request<SingleResponse<Res>>(`${SEO}/backlinks/${suffix}`, {
          method: "POST",
          body: request as object,
          unwrapData: false,
        }),
    });
    return {
      status: {
        get: () =>
          t.request<SingleResponse<BacklinksStatus>>(
            `${SEO}/backlinks/status`,
            { unwrapData: false },
          ),
      },
      index: {
        get: () =>
          t.request<SingleResponse<BacklinksIndex>>(`${SEO}/backlinks/index`, {
            unwrapData: false,
          }),
      },
      filters: {
        get: () =>
          t.request<SingleResponse<FilterCatalog>>(
            `${SEO}/backlinks/filters`,
            { unwrapData: false },
          ),
      },
      summary: post<BacklinksSummaryRequest, BacklinksSummaryResult>("summary"),
      history: post<BacklinksHistoryRequest, BacklinksHistoryResult>("history"),
      backlinks: post<BacklinksListRequest, BacklinksListResult>("backlinks"),
      anchors: post<BacklinkAnchorsRequest, BacklinkAnchorsResult>("anchors"),
      domainPages: post<DomainPagesRequest, DomainPagesResult>("domain-pages"),
      referringDomains: post<ReferringDomainsRequest, ReferringDomainsResult>(
        "referring-domains",
      ),
      referringNetworks: post<
        ReferringNetworksRequest,
        ReferringNetworksResult
      >("referring-networks"),
      competitors: post<CompetitorsRequest, CompetitorsResult>("competitors"),
      domainIntersection: post<
        BacklinksDomainIntersectionRequest,
        BacklinksDomainIntersectionResult
      >("domain-intersection"),
      pageIntersection: post<
        BacklinksPageIntersectionRequest,
        BacklinksPageIntersectionResult
      >("page-intersection"),
      timeseriesSummary: post<
        TimeseriesSummaryRequest,
        TimeseriesSummaryResult
      >("timeseries-summary"),
      timeseriesNewLostSummary: post<
        TimeseriesNewLostSummaryRequest,
        TimeseriesNewLostSummaryResult
      >("timeseries-new-lost-summary"),
      bulkRanks: post<BulkRanksRequest, BulkRanksResult>("bulk-ranks"),
      bulkBacklinks: post<BulkBacklinksRequest, BulkBacklinksResult>(
        "bulk-backlinks",
      ),
      bulkSpamScore: post<BulkSpamScoreRequest, BulkSpamScoreResult>(
        "bulk-spam-score",
      ),
      bulkReferringDomains: post<
        BulkReferringDomainsRequest,
        BulkReferringDomainsResult
      >("bulk-referring-domains"),
      bulkNewLostBacklinks: post<
        BulkNewLostBacklinksRequest,
        BulkNewLostBacklinksResult
      >("bulk-new-lost-backlinks"),
      bulkNewLostReferringDomains: post<
        BulkNewLostReferringDomainsRequest,
        BulkNewLostReferringDomainsResult
      >("bulk-new-lost-referring-domains"),
      bulkPagesSummary: post<BulkPagesSummaryRequest, BulkPagesSummaryResult>(
        "bulk-pages-summary",
      ),
    };
  }

  private buildDomainAnalytics() {
    const t = this.transport;
    return {
      technologies: {
        locations: {
          list: (params?: CountryFilteredPaginationParams) =>
            t.request<ListResponse<ResolvedLocation>>(
              `${SEO}/domain-analytics/technologies/locations`,
              { query: params, unwrapData: false },
            ),
          listByCountry: (countryCode: string, params?: PaginationParams) =>
            t.request<ListResponse<ResolvedLocation>>(
              `${SEO}/domain-analytics/technologies/locations/${enc(countryCode)}`,
              { query: params, unwrapData: false },
            ),
        },
        languages: {
          list: () =>
            t.request<ListResponse<ResolvedLanguage>>(
              `${SEO}/domain-analytics/technologies/languages`,
              { unwrapData: false },
            ),
        },
        catalog: {
          list: (
            params?: PaginationParams & {
              group?: string;
              category?: string;
              technology?: string;
            },
          ) =>
            t.request<
              ListResponse<DomainAnalyticsTechnologyCatalogEntry>
            >(`${SEO}/domain-analytics/technologies/catalog`, {
              query: params,
              unwrapData: false,
            }),
        },
        filters: {
          get: () =>
            t.request<SingleResponse<FilterCatalog>>(
              `${SEO}/domain-analytics/technologies/filters`,
              { unwrapData: false },
            ),
        },
        aggregation: {
          create: (request: TechnologiesAggregationRequest) =>
            t.request<SingleResponse<TechnologiesAggregationResult>>(
              `${SEO}/domain-analytics/technologies/aggregation`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        summary: {
          create: (request: TechnologiesSummaryRequest) =>
            t.request<SingleResponse<TechnologiesSummaryResult>>(
              `${SEO}/domain-analytics/technologies/summary`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        stats: {
          create: (request: TechnologiesStatsRequest) =>
            t.request<SingleResponse<TechnologiesStatsResult>>(
              `${SEO}/domain-analytics/technologies/stats`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        domainsByTechnology: {
          create: (request: TechnologiesDomainsByTechnologyRequest) =>
            t.request<SingleResponse<TechnologiesDomainsResult>>(
              `${SEO}/domain-analytics/technologies/domains-by-technology`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        domainsByHtmlTerms: {
          create: (request: TechnologiesDomainsByHtmlTermsRequest) =>
            t.request<SingleResponse<TechnologiesDomainsResult>>(
              `${SEO}/domain-analytics/technologies/domains-by-html-terms`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        byDomain: {
          create: (request: TechnologiesByDomainRequest) =>
            t.request<SingleResponse<TechnologiesByDomainResult>>(
              `${SEO}/domain-analytics/technologies/by-domain`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
      },
      whois: {
        filters: {
          get: () =>
            t.request<SingleResponse<FilterCatalog>>(
              `${SEO}/domain-analytics/whois/filters`,
              { unwrapData: false },
            ),
        },
        list: {
          create: (request: WhoisListRequest) =>
            t.request<SingleResponse<WhoisListResult>>(
              `${SEO}/domain-analytics/whois/list`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
      },
    };
  }

  private buildContentAnalysis() {
    const t = this.transport;
    return {
      locations: {
        list: (params?: CountryFilteredPaginationParams) =>
          t.request<ListResponse<ContentAnalysisLocation>>(
            `${SEO}/content-analysis/locations`,
            { query: params, unwrapData: false },
          ),
        listByCountry: (countryCode: string, params?: PaginationParams) =>
          t.request<ListResponse<ContentAnalysisLocation>>(
            `${SEO}/content-analysis/locations/${enc(countryCode)}`,
            { query: params, unwrapData: false },
          ),
      },
      languages: {
        list: () =>
          t.request<ListResponse<ResolvedLanguage>>(
            `${SEO}/content-analysis/languages`,
            { unwrapData: false },
          ),
      },
      categories: {
        list: (params?: PaginationParams & { parent?: string | number }) =>
          t.request<ListResponse<ContentAnalysisCategory>>(
            `${SEO}/content-analysis/categories`,
            { query: params, unwrapData: false },
          ),
      },
      filters: {
        get: () =>
          t.request<SingleResponse<FilterCatalog>>(
            `${SEO}/content-analysis/filters`,
            { unwrapData: false },
          ),
      },
      search: {
        create: (request: ContentAnalysisSearchRequest) =>
          t.request<SingleResponse<ContentAnalysisSearchResult>>(
            `${SEO}/content-analysis/search`,
            { method: "POST", body: request, unwrapData: false },
          ),
      },
      summary: {
        create: (request: ContentAnalysisSummaryRequest) =>
          t.request<SingleResponse<ContentAnalysisSummaryResult>>(
            `${SEO}/content-analysis/summary`,
            { method: "POST", body: request, unwrapData: false },
          ),
      },
      sentimentAnalysis: {
        create: (request: ContentAnalysisSentimentAnalysisRequest) =>
          t.request<
            SingleResponse<ContentAnalysisSentimentAnalysisResult>
          >(`${SEO}/content-analysis/sentiment-analysis`, {
            method: "POST",
            body: request,
            unwrapData: false,
          }),
      },
      ratingDistribution: {
        create: (request: ContentAnalysisRatingDistributionRequest) =>
          t.request<
            SingleResponse<ContentAnalysisRatingDistributionResult>
          >(`${SEO}/content-analysis/rating-distribution`, {
            method: "POST",
            body: request,
            unwrapData: false,
          }),
      },
      phraseTrends: {
        create: (request: ContentAnalysisPhraseTrendsRequest) =>
          t.request<SingleResponse<ContentAnalysisPhraseTrendsResult>>(
            `${SEO}/content-analysis/phrase-trends`,
            { method: "POST", body: request, unwrapData: false },
          ),
      },
      categoryTrends: {
        create: (request: ContentAnalysisCategoryTrendsRequest) =>
          t.request<
            SingleResponse<ContentAnalysisCategoryTrendsResult>
          >(`${SEO}/content-analysis/category-trends`, {
            method: "POST",
            body: request,
            unwrapData: false,
          }),
      },
    };
  }

  private buildOnPage() {
    const t = this.transport;
    const auditChild = <T>(suffix: string) =>
      (id: string, request?: SiteAuditResultRequest) =>
        t.request<SingleResponse<T>>(
          `${SEO}/on-page/site-audits/${enc(id)}/${suffix}`,
          { method: "POST", body: (request ?? {}) as object, unwrapData: false },
        );
    return {
      filters: {
        get: () =>
          t.request<SingleResponse<FilterCatalog>>(
            `${SEO}/on-page/filters`,
            { unwrapData: false },
          ),
      },
      lighthouse: {
        availableAudits: {
          list: () =>
            t.request<ListResponse<LighthouseAvailableAudit>>(
              `${SEO}/on-page/lighthouse/available-audits`,
              { unwrapData: false },
            ),
        },
        languages: {
          list: () =>
            t.request<ListResponse<LighthouseLanguage>>(
              `${SEO}/on-page/lighthouse/languages`,
              { unwrapData: false },
            ),
        },
        versions: {
          list: () =>
            t.request<ListResponse<LighthouseVersion>>(
              `${SEO}/on-page/lighthouse/versions`,
              { unwrapData: false },
            ),
        },
        audits: {
          create: (request: LighthouseRequest) =>
            t.request<SingleResponse<LighthouseAudit>>(
              `${SEO}/on-page/lighthouse/audits`,
              { method: "POST", body: request, unwrapData: false },
            ),
          get: (id: string) =>
            t.request<SingleResponse<LighthouseAudit>>(
              `${SEO}/on-page/lighthouse/audits/${enc(id)}`,
              { unwrapData: false },
            ),
          run: (request: LighthouseRequest) =>
            t.request<SingleResponse<LighthouseAudit>>(
              `${SEO}/on-page/lighthouse/audits:run`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
      },
      siteAudits: {
        create: (request: SiteAuditCreateRequest) =>
          t.request<SingleResponse<SiteAudit>>(
            `${SEO}/on-page/site-audits`,
            { method: "POST", body: request, unwrapData: false },
          ),
        listReady: (
          params?: PaginationParams & { status?: SiteAuditStatus },
        ) =>
          t.request<ListResponse<SiteAudit>>(`${SEO}/on-page/site-audits`, {
            query: params,
            unwrapData: false,
          }),
        get: (id: string) =>
          t.request<SingleResponse<SiteAudit>>(
            `${SEO}/on-page/site-audits/${enc(id)}`,
            { unwrapData: false },
          ),
        stop: (id: string) =>
          t.request<SingleResponse<SiteAudit>>(
            `${SEO}/on-page/site-audits/${enc(id)}/stop`,
            { method: "POST", body: {}, unwrapData: false },
          ),
        pages: auditChild<SiteAuditPagesResult>("pages"),
        resources: auditChild<SiteAuditResourcesResult>("resources"),
        uncrawlableResources: auditChild<SiteAuditUncrawlableResourcesResult>(
          "uncrawlable-resources",
        ),
        pagesByResource: auditChild<SiteAuditPageByResourceResult>(
          "pages-by-resource",
        ),
        links: auditChild<SiteAuditLinksResult>("links"),
        redirectChains: auditChild<SiteAuditRedirectChainsResult>(
          "redirect-chains",
        ),
        duplicateTags: auditChild<SiteAuditDuplicateTagsResult>(
          "duplicate-tags",
        ),
        duplicateContent: auditChild<SiteAuditDuplicateContentResult>(
          "duplicate-content",
        ),
        nonIndexable: auditChild<SiteAuditNonIndexableResult>("non-indexable"),
        waterfall: (
          id: string,
          request: SiteAuditResultRequest & { url: string },
        ) =>
          t.request<SingleResponse<SiteAuditWaterfallResult>>(
            `${SEO}/on-page/site-audits/${enc(id)}/waterfall`,
            { method: "POST", body: request, unwrapData: false },
          ),
        keywordDensity: (
          id: string,
          request: SiteAuditResultRequest & { url: string },
        ) =>
          t.request<SingleResponse<SiteAuditKeywordDensityResult>>(
            `${SEO}/on-page/site-audits/${enc(id)}/keyword-density`,
            { method: "POST", body: request, unwrapData: false },
          ),
        microdata: (
          id: string,
          request: SiteAuditResultRequest & { url: string },
        ) =>
          t.request<SingleResponse<SiteAuditMicrodataResult>>(
            `${SEO}/on-page/site-audits/${enc(id)}/microdata`,
            { method: "POST", body: request, unwrapData: false },
          ),
        rawHtml: (
          id: string,
          request: SiteAuditResultRequest & { url: string },
        ) =>
          t.request<SingleResponse<SiteAuditRawHtmlResult>>(
            `${SEO}/on-page/site-audits/${enc(id)}/raw-html`,
            { method: "POST", body: request, unwrapData: false },
          ),
        pageScreenshot: (
          id: string,
          request: SiteAuditResultRequest & { url: string },
        ) =>
          t.request<SingleResponse<SiteAuditPageScreenshotResult>>(
            `${SEO}/on-page/site-audits/${enc(id)}/page-screenshot`,
            { method: "POST", body: request, unwrapData: false },
          ),
      },
      instantPages: {
        create: (request: InstantPagesRequest) =>
          t.request<SingleResponse<InstantPagesResult>>(
            `${SEO}/on-page/instant-pages`,
            { method: "POST", body: request, unwrapData: false },
          ),
      },
      contentParsings: {
        parse: (request: ContentParsingRequest) =>
          t.request<
            SingleResponse<{
              query: ContentParsingRequest;
              items: unknown[];
              cost: { credits: number };
            }>
          >(`${SEO}/on-page/content-parsings:parse`, {
            method: "POST",
            body: request,
            unwrapData: false,
          }),
        create: (request: ContentParsingRequest) =>
          t.request<SingleResponse<ContentParsing>>(
            `${SEO}/on-page/content-parsings`,
            { method: "POST", body: request, unwrapData: false },
          ),
        get: (id: string) =>
          t.request<SingleResponse<ContentParsing>>(
            `${SEO}/on-page/content-parsings/${enc(id)}`,
            { unwrapData: false },
          ),
      },
    };
  }

  private buildBusinessData() {
    const t = this.transport;
    return {
      businessListings: {
        locations: {
          list: (params?: CountryFilteredPaginationParams) =>
            t.request<ListResponse<BusinessDataLocation>>(
              `${SEO}/business-data/business-listings/locations`,
              { query: params, unwrapData: false },
            ),
          listByCountry: (countryCode: string, params?: PaginationParams) =>
            t.request<ListResponse<BusinessDataLocation>>(
              `${SEO}/business-data/business-listings/locations/${enc(countryCode)}`,
              { query: params, unwrapData: false },
            ),
        },
        categories: {
          list: (params?: PaginationParams & { parent?: string | number }) =>
            t.request<ListResponse<BusinessDataCategory>>(
              `${SEO}/business-data/business-listings/categories`,
              { query: params, unwrapData: false },
            ),
        },
        filters: {
          get: () =>
            t.request<SingleResponse<FilterCatalog>>(
              `${SEO}/business-data/business-listings/filters`,
              { unwrapData: false },
            ),
        },
        search: {
          create: (request: BusinessListingsSearchRequest) =>
            t.request<SingleResponse<BusinessListingsSearchResult>>(
              `${SEO}/business-data/business-listings/search`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        categoriesAggregation: {
          create: (request: BusinessListingsCategoriesAggregationRequest) =>
            t.request<
              SingleResponse<BusinessListingsCategoriesAggregationResult>
            >(`${SEO}/business-data/business-listings/categories-aggregation`, {
              method: "POST",
              body: request,
              unwrapData: false,
            }),
        },
      },
      google: {
        locations: {
          list: (params?: CountryFilteredPaginationParams) =>
            t.request<ListResponse<BusinessDataLocation>>(
              `${SEO}/business-data/google/locations`,
              { query: params, unwrapData: false },
            ),
          listByCountry: (countryCode: string, params?: PaginationParams) =>
            t.request<ListResponse<BusinessDataLocation>>(
              `${SEO}/business-data/google/locations/${enc(countryCode)}`,
              { query: params, unwrapData: false },
            ),
        },
        languages: {
          list: () =>
            t.request<ListResponse<ResolvedLanguage>>(
              `${SEO}/business-data/google/languages`,
              { unwrapData: false },
            ),
        },
        myBusinessInfo: {
          create: (request: GoogleMyBusinessInfoRequest) =>
            t.request<SingleResponse<GoogleMyBusinessInfo>>(
              `${SEO}/business-data/google/my-business-info`,
              { method: "POST", body: request, unwrapData: false },
            ),
          list: (params?: AsyncListParams) =>
            t.request<ListResponse<GoogleMyBusinessInfo>>(
              `${SEO}/business-data/google/my-business-info`,
              { query: params, unwrapData: false },
            ),
          get: (id: string) =>
            t.request<SingleResponse<GoogleMyBusinessInfo>>(
              `${SEO}/business-data/google/my-business-info/${enc(id)}`,
              { unwrapData: false },
            ),
          run: (request: GoogleMyBusinessInfoRequest) =>
            t.request<SingleResponse<GoogleMyBusinessInfo>>(
              `${SEO}/business-data/google/my-business-info:run`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        myBusinessUpdates: {
          create: (request: GoogleMyBusinessUpdatesRequest) =>
            t.request<SingleResponse<GoogleMyBusinessUpdates>>(
              `${SEO}/business-data/google/my-business-updates`,
              { method: "POST", body: request, unwrapData: false },
            ),
          list: (params?: AsyncListParams) =>
            t.request<ListResponse<GoogleMyBusinessUpdates>>(
              `${SEO}/business-data/google/my-business-updates`,
              { query: params, unwrapData: false },
            ),
          get: (id: string) =>
            t.request<SingleResponse<GoogleMyBusinessUpdates>>(
              `${SEO}/business-data/google/my-business-updates/${enc(id)}`,
              { unwrapData: false },
            ),
        },
      },
    };
  }

  private buildDataforseoLabs() {
    const t = this.transport;
    const post = <Req, Res>(suffix: string) => ({
      create: (request: Req) =>
        t.request<SingleResponse<Res>>(
          `${SEO}/dataforseo-labs/google/${suffix}`,
          { method: "POST", body: request as object, unwrapData: false },
        ),
    });
    return {
      status: {
        get: () =>
          t.request<SingleResponse<DataforseoLabsStatus>>(
            `${SEO}/dataforseo-labs/status`,
            { unwrapData: false },
          ),
      },
      locationsLanguages: {
        list: (
          params?: PaginationParams & {
            country?: string;
            languageCode?: string;
          },
        ) =>
          t.request<ListResponse<DataforseoLabsLocationLanguage>>(
            `${SEO}/dataforseo-labs/locations-languages`,
            { query: params, unwrapData: false },
          ),
      },
      categories: {
        list: (params?: PaginationParams & { parent?: string | number }) =>
          t.request<ListResponse<DataforseoLabsCategory>>(
            `${SEO}/dataforseo-labs/categories`,
            { query: params, unwrapData: false },
          ),
      },
      google: {
        filters: {
          get: () =>
            t.request<SingleResponse<FilterCatalog>>(
              `${SEO}/dataforseo-labs/google/filters`,
              { unwrapData: false },
            ),
        },
        keywordOverview: post<KeywordOverviewRequest, KeywordOverviewResult>(
          "keyword-overview",
        ),
        bulkKeywordDifficulty: post<
          BulkKeywordDifficultyRequest,
          BulkKeywordDifficultyResult
        >("bulk-keyword-difficulty"),
        searchIntent: post<SearchIntentRequest, SearchIntentResult>(
          "search-intent",
        ),
        availableHistory: {
          create: (request?: AvailableHistoryRequest) =>
            t.request<SingleResponse<AvailableHistoryResult>>(
              `${SEO}/dataforseo-labs/google/available-history`,
              {
                method: "POST",
                body: (request ?? {}) as object,
                unwrapData: false,
              },
            ),
        },
        relatedKeywords: post<RelatedKeywordsRequest, RelatedKeywordsResult>(
          "related-keywords",
        ),
        keywordSuggestions: post<
          KeywordSuggestionsRequest,
          KeywordSuggestionsResult
        >("keyword-suggestions"),
        keywordIdeas: post<KeywordIdeasRequest, KeywordIdeasResult>(
          "keyword-ideas",
        ),
        keywordsForSite: post<KeywordsForSiteRequest, KeywordsForSiteResult>(
          "keywords-for-site",
        ),
        historicalKeywordData: post<
          HistoricalKeywordDataRequest,
          HistoricalKeywordDataResult
        >("historical-keyword-data"),
        categoriesForDomain: post<
          CategoriesForDomainRequest,
          CategoriesForDomainResult
        >("categories-for-domain"),
        categoriesForKeywords: {
          languages: {
            list: () =>
              t.request<ListResponse<ResolvedLanguage>>(
                `${SEO}/dataforseo-labs/google/categories-for-keywords/languages`,
                { unwrapData: false },
              ),
          },
          create: (request: CategoriesForKeywordsRequest) =>
            t.request<SingleResponse<CategoriesForKeywordsResult>>(
              `${SEO}/dataforseo-labs/google/categories-for-keywords`,
              { method: "POST", body: request, unwrapData: false },
            ),
        },
        keywordsForCategories: post<
          KeywordsForCategoriesRequest,
          KeywordsForCategoriesResult
        >("keywords-for-categories"),
        domainMetricsByCategories: post<
          DomainMetricsByCategoriesRequest,
          DomainMetricsByCategoriesResult
        >("domain-metrics-by-categories"),
        topSearches: post<TopSearchesRequest, TopSearchesResult>(
          "top-searches",
        ),
        serpCompetitors: post<SerpCompetitorsRequest, SerpCompetitorsResult>(
          "serp-competitors",
        ),
        rankedKeywords: post<RankedKeywordsRequest, RankedKeywordsResult>(
          "ranked-keywords",
        ),
        competitorsDomain: post<
          CompetitorsDomainRequest,
          CompetitorsDomainResult
        >("competitors-domain"),
        domainIntersection: post<
          DomainIntersectionRequest,
          DomainIntersectionResult
        >("domain-intersection"),
        subdomains: post<SubdomainsRequest, SubdomainsResult>("subdomains"),
        relevantPages: post<RelevantPagesRequest, RelevantPagesResult>(
          "relevant-pages",
        ),
        domainRankOverview: post<
          DomainRankOverviewRequest,
          DomainRankOverviewResult
        >("domain-rank-overview"),
        historicalRankOverview: post<
          HistoricalRankOverviewRequest,
          HistoricalRankOverviewResult
        >("historical-rank-overview"),
        pageIntersection: post<
          PageIntersectionRequest,
          PageIntersectionResult
        >("page-intersection"),
        historicalSerps: post<HistoricalSerpsRequest, HistoricalSerpsResult>(
          "historical-serps",
        ),
        bulkTrafficEstimation: post<
          BulkTrafficEstimationRequest,
          BulkTrafficEstimationResult
        >("bulk-traffic-estimation"),
        historicalBulkTrafficEstimation: post<
          HistoricalBulkTrafficEstimationRequest,
          HistoricalBulkTrafficEstimationResult
        >("historical-bulk-traffic-estimation"),
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
