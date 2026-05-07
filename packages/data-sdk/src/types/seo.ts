/**
 * Voyant Data SEO white-label types.
 *
 * These mirror the contracts in voyant-cloud's `packages/data-contract` but are
 * standalone — the public SDK ships without any internal monorepo dependencies.
 *
 * Types fall into three buckets:
 *
 * 1. Reference catalogs (locations, languages, categories) — fully shaped.
 * 2. Voyant primitives (Search, jobs, status records) — fully shaped, mirroring
 *    the contract.
 * 3. DataForSEO passthrough request/result envelopes — kept opaque
 *    (`Record<string, unknown>`) so future provider-side field additions don't
 *    require an SDK release. Callers typically pass the documented DataForSEO
 *    request shape and read the documented result shape; the wire is camelCase.
 */

export type OpaqueRecord = Record<string, unknown>;

// ───────────────────────────────────────────────────────────────
// Shared reference shapes
// ───────────────────────────────────────────────────────────────

export interface ResolvedLocation {
  /** DFS numeric location code (`location_code` upstream). */
  id: number;
  name: string;
  /** ISO 3166-1 alpha-2 of the parent country, when applicable. */
  countryIso2?: string;
  type?: string;
  parent?: number;
}

export interface ResolvedLanguage {
  /** BCP-47 / DFS short code (`language_code` upstream). */
  code: string;
  name: string;
}

// ───────────────────────────────────────────────────────────────
// Search lifecycle (white-labeled SERP)
// ───────────────────────────────────────────────────────────────

export type SearchStatus = "queued" | "running" | "succeeded" | "failed";
export type SearchMode = "live" | "async";
export type SearchFormat = "summary" | "detailed" | "html";
export type SearchPriority = "normal" | "high";
export type SearchDevice = "desktop" | "mobile";
export type SearchOs = "windows" | "macos" | "android" | "ios";

export interface CoordinateInput {
  latitude: number;
  longitude: number;
  radius?: number;
  zoom?: number;
}

export type LocationInput =
  | { id: number }
  | { name: string }
  | { coordinate: CoordinateInput };

export type LanguageInput = { code: string } | { name: string };

export interface WebhookConfig {
  url: string;
  /** Webhook payload format. Defaults to "summary" upstream. */
  format?: SearchFormat;
  events?: Array<"completed" | "failed">;
  /** Custom HMAC signing secret (otherwise the org-level secret is used). */
  secret?: string;
}

export interface WebhookState {
  url: string;
  deliveredAt: string | null;
  attempts: number;
  lastError?: string;
}

export interface SearchCost {
  credits: number;
}

export interface DataError {
  code: string;
  message: string;
}

/** A SERP search resource — created via `*.searches.create`. */
export interface Search {
  id: string;
  status: SearchStatus;
  createdAt: string;
  completedAt?: string | null;
  request: unknown;
  result?: OpaqueRecord | null;
  cost?: SearchCost | null;
  webhook?: WebhookState | null;
  error?: DataError;
}

// ───────────────────────────────────────────────────────────────
// SERP feature input types
// ───────────────────────────────────────────────────────────────

export interface GoogleOrganicSearchInput {
  query: string;
  location: LocationInput;
  language: LanguageInput;
  device?: SearchDevice;
  os?: SearchOs;
  limit?: number;
  format?: SearchFormat;
  mode?: SearchMode;
  targetDomain?: string;
  extraQueryParams?: Record<string, string>;
  maxPages?: number;
  stopOn?: Array<{ domain?: string; urlPattern?: string }>;
  priority?: SearchPriority;
  clientReference?: string;
  idempotencyKey?: string;
  webhook?: WebhookConfig;
  detailedOptions?: {
    pixelBoxes?: boolean;
    fetchAiOverview?: boolean;
    peopleAlsoAskExpand?: number;
    viewport?: { width?: number; height?: number; scale?: number };
  };
}

export interface GoogleAiModeSearchInput {
  query: string;
  location: LocationInput;
  language: LanguageInput;
  device?: SearchDevice;
  os?: SearchOs;
  /** AI Mode supports only "detailed" or "html"; "summary" is rejected upstream. */
  format?: "detailed" | "html";
  mode?: SearchMode;
  priority?: SearchPriority;
  clientReference?: string;
  idempotencyKey?: string;
  webhook?: WebhookConfig;
  detailedOptions?: {
    pixelBoxes?: boolean;
    viewport?: { width?: number; height?: number; scale?: number };
  };
}

export type AdsSearchPlatform =
  | "all"
  | "google_play"
  | "google_maps"
  | "google_search"
  | "google_shopping"
  | "youtube";

export type AdsSearchCreativeFormatFilter = "all" | "text" | "image" | "video";

export interface GoogleAdsSearchInput {
  /** Either advertiserIds (≤25) or target (domain) — exactly one. */
  advertiserIds?: string[];
  target?: string;
  location: LocationInput;
  /** Ads Transparency only supports desktop. */
  device?: "desktop";
  os?: "windows" | "macos";
  limit?: number;
  format?: "detailed";
  mode?: SearchMode;
  priority?: SearchPriority;
  clientReference?: string;
  idempotencyKey?: string;
  webhook?: WebhookConfig;
  creativeFormat?: AdsSearchCreativeFormatFilter;
  platform?: AdsSearchPlatform;
  /** ISO YYYY-MM-DD; min 2018-05-31. */
  dateFrom?: string;
  dateTo?: string;
}

export interface GoogleAdsAdvertisersSearchInput {
  query: string;
  location?: LocationInput;
  device?: "desktop";
  os?: "windows" | "macos";
  format?: "detailed";
  mode?: SearchMode;
  priority?: SearchPriority;
  clientReference?: string;
  idempotencyKey?: string;
  webhook?: WebhookConfig;
}

export type AutocompleteClient =
  | "chrome"
  | "chrome-omni"
  | "gws-wiz"
  | "gws-wiz-serp"
  | "gws-wiz-local"
  | "safari"
  | "firefox"
  | "psy-ab"
  | "toolbar"
  | "youtube"
  | "img"
  | "products-cc";

export interface GoogleAutocompleteSearchInput {
  query: string;
  /** No coordinate variant — only id or name. */
  location: { id: number } | { name: string };
  language: LanguageInput;
  device?: SearchDevice;
  os?: SearchOs;
  format?: "detailed";
  mode?: SearchMode;
  priority?: SearchPriority;
  clientReference?: string;
  idempotencyKey?: string;
  webhook?: WebhookConfig;
  autocompleteOptions?: {
    cursorPosition?: number;
    client?: AutocompleteClient;
  };
}

export interface GoogleMapsSearchInput {
  query?: string;
  location?:
    | { id: number }
    | { name: string }
    | { coordinate: { latitude: number; longitude: number; zoom?: number } };
  language: LanguageInput;
  device?: SearchDevice;
  os?: SearchOs;
  /** Default 100, max 700; mobile capped at 20. */
  limit?: number;
  format?: "detailed";
  mode?: SearchMode;
  priority?: SearchPriority;
  clientReference?: string;
  idempotencyKey?: string;
  webhook?: WebhookConfig;
  /** Provide either { query, location } or { mapsOptions.mapsUrl } — not both. */
  mapsOptions?: {
    searchThisArea?: boolean;
    searchPlaces?: boolean;
    mapsUrl?: string;
  };
  detailedOptions?: {
    pixelBoxes?: boolean;
  };
}

export interface ScreenshotInput {
  preset?: "desktop" | "tablet" | "mobile";
  viewport?: { width?: number; height?: number; scale?: number };
  page?: number;
}

export interface ScreenshotResult {
  shotId: string;
  searchId: string;
  url: string;
  createdAt: string;
  viewport?: { width: number; height: number; scale: number };
  costCredits: number;
}

export interface AiSummaryInput {
  prompt?: string;
  supportExtra?: boolean;
  fetchContent?: boolean;
  includeLinks?: boolean;
}

export interface AiSummaryResult {
  aiSummaryId: string;
  searchId: string;
  summary: string;
  links?: Array<{ title: string; url: string; domain?: string }>;
  createdAt: string;
  costCredits: number;
}

// ───────────────────────────────────────────────────────────────
// Keywords Data
// ───────────────────────────────────────────────────────────────

export type KeywordsDataSubModule =
  | "googleAds"
  | "googleTrends"
  | "clickstream";

export type KeywordsDataAsyncFeature =
  | "searchVolume"
  | "keywordsForSite"
  | "keywordsForKeywords"
  | "adTrafficByKeywords"
  | "explore";

export interface KeywordsDataJob<TResult = unknown> {
  id: string;
  subModule: KeywordsDataSubModule;
  feature: KeywordsDataAsyncFeature;
  status: "queued" | "running" | "succeeded" | "failed";
  createdAt: string;
  completedAt: string | null;
  request: unknown;
  result: TResult | null;
  cost: { credits: number } | null;
  webhook: {
    url: string;
    deliveredAt: string | null;
    attempts: number;
    lastError?: string;
  } | null;
  error?: { code: string; message: string };
}

export interface GoogleAdsStatus {
  available: boolean;
  message?: string;
  /** ISO timestamp of last status check. */
  checkedAt?: string;
}

export interface GoogleTrendsLocation extends ResolvedLocation {
  /** Google Trends-specific scope. */
  trendsCode?: string;
}

export interface GoogleTrendsCategory {
  id: number;
  name: string;
  parent?: number;
}

export interface ClickstreamLocationLanguage {
  /** Composite resolved location + language entry as DFS exposes them. */
  location: ResolvedLocation;
  language: ResolvedLanguage;
}

export type GoogleAdsSearchVolumeRequest = OpaqueRecord;
export type GoogleAdsKeywordsForSiteRequest = OpaqueRecord;
export type GoogleAdsKeywordsForKeywordsRequest = OpaqueRecord;
export type GoogleAdsAdTrafficByKeywordsRequest = OpaqueRecord;
export type GoogleAdsKeywordVolumesResult = OpaqueRecord;
export type GoogleAdsAdTrafficResult = OpaqueRecord;

export type GoogleTrendsExploreRequest = OpaqueRecord;
export type GoogleTrendsExploreResult = OpaqueRecord;

export type ClickstreamSearchVolumeRequest = OpaqueRecord;
export type ClickstreamGlobalSearchVolumeRequest = OpaqueRecord;
export type ClickstreamBulkSearchVolumeRequest = OpaqueRecord;
export type ClickstreamSearchVolumeResult = OpaqueRecord;
export type ClickstreamGlobalVolumeResult = OpaqueRecord;
export type ClickstreamBulkVolumeResult = OpaqueRecord;

// ───────────────────────────────────────────────────────────────
// AI Optimization
// ───────────────────────────────────────────────────────────────

export interface AiKeywordDataLocation {
  location: ResolvedLocation;
  language: ResolvedLanguage;
}

export type AiKeywordVolumesRequest = OpaqueRecord;
export type AiKeywordVolumesResult = OpaqueRecord;

export type LlmMentionsSearchRequest = OpaqueRecord;
export type LlmMentionsSearchResult = OpaqueRecord;
export type LlmMentionsTopPagesRequest = OpaqueRecord;
export type LlmMentionsTopPagesResult = OpaqueRecord;
export type LlmMentionsTopDomainsRequest = OpaqueRecord;
export type LlmMentionsTopDomainsResult = OpaqueRecord;
export type LlmMentionsAggregatedRequest = OpaqueRecord;
export type LlmMentionsAggregatedResult = OpaqueRecord;
export type LlmMentionsCrossAggregatedRequest = OpaqueRecord;
export type LlmMentionsCrossAggregatedResult = OpaqueRecord;

// ───────────────────────────────────────────────────────────────
// Backlinks
// ───────────────────────────────────────────────────────────────

export interface BacklinksStatus {
  /** ISO timestamp of last DFS index update. */
  lastIndexedAt?: string;
  /** Number of indexed referring domains. */
  referringDomains?: number;
  /** Number of indexed backlinks. */
  backlinks?: number;
}

export interface BacklinksIndex {
  size?: number;
  lastUpdated?: string;
}

export type BacklinksSummaryRequest = OpaqueRecord;
export type BacklinksSummaryResult = OpaqueRecord;
export type BacklinksHistoryRequest = OpaqueRecord;
export type BacklinksHistoryResult = OpaqueRecord;
export type BacklinksListRequest = OpaqueRecord;
export type BacklinksListResult = OpaqueRecord;
export type BacklinkAnchorsRequest = OpaqueRecord;
export type BacklinkAnchorsResult = OpaqueRecord;

export type DomainPagesRequest = OpaqueRecord;
export type DomainPagesResult = OpaqueRecord;
export type ReferringDomainsRequest = OpaqueRecord;
export type ReferringDomainsResult = OpaqueRecord;
export type ReferringNetworksRequest = OpaqueRecord;
export type ReferringNetworksResult = OpaqueRecord;

export type CompetitorsRequest = OpaqueRecord;
export type CompetitorsResult = OpaqueRecord;
export type BacklinksDomainIntersectionRequest = OpaqueRecord;
export type BacklinksDomainIntersectionResult = OpaqueRecord;
export type BacklinksPageIntersectionRequest = OpaqueRecord;
export type BacklinksPageIntersectionResult = OpaqueRecord;

export type TimeseriesSummaryRequest = OpaqueRecord;
export type TimeseriesSummaryResult = OpaqueRecord;
export type TimeseriesNewLostSummaryRequest = OpaqueRecord;
export type TimeseriesNewLostSummaryResult = OpaqueRecord;

export type BulkRanksRequest = OpaqueRecord;
export type BulkRanksResult = OpaqueRecord;
export type BulkBacklinksRequest = OpaqueRecord;
export type BulkBacklinksResult = OpaqueRecord;
export type BulkSpamScoreRequest = OpaqueRecord;
export type BulkSpamScoreResult = OpaqueRecord;
export type BulkReferringDomainsRequest = OpaqueRecord;
export type BulkReferringDomainsResult = OpaqueRecord;
export type BulkNewLostBacklinksRequest = OpaqueRecord;
export type BulkNewLostBacklinksResult = OpaqueRecord;
export type BulkNewLostReferringDomainsRequest = OpaqueRecord;
export type BulkNewLostReferringDomainsResult = OpaqueRecord;
export type BulkPagesSummaryRequest = OpaqueRecord;
export type BulkPagesSummaryResult = OpaqueRecord;

// ───────────────────────────────────────────────────────────────
// Domain Analytics
// ───────────────────────────────────────────────────────────────

export interface DomainAnalyticsTechnologyCatalogEntry {
  group: string;
  category: string;
  technology: string;
  description?: string;
}

export type TechnologiesAggregationRequest = OpaqueRecord;
export type TechnologiesAggregationResult = OpaqueRecord;
export type TechnologiesSummaryRequest = OpaqueRecord;
export type TechnologiesSummaryResult = OpaqueRecord;
export type TechnologiesStatsRequest = OpaqueRecord;
export type TechnologiesStatsResult = OpaqueRecord;
export type TechnologiesDomainsByTechnologyRequest = OpaqueRecord;
export type TechnologiesDomainsByHtmlTermsRequest = OpaqueRecord;
export type TechnologiesDomainsResult = OpaqueRecord;
export type TechnologiesByDomainRequest = OpaqueRecord;
export type TechnologiesByDomainResult = OpaqueRecord;

export type WhoisListRequest = OpaqueRecord;
export type WhoisListResult = OpaqueRecord;

// ───────────────────────────────────────────────────────────────
// Content Analysis
// ───────────────────────────────────────────────────────────────

export type ContentAnalysisLocation = ResolvedLocation;

export interface ContentAnalysisCategory {
  id: number;
  name: string;
  parent?: number;
}

export type ContentAnalysisSearchRequest = OpaqueRecord;
export type ContentAnalysisSearchResult = OpaqueRecord;
export type ContentAnalysisSummaryRequest = OpaqueRecord;
export type ContentAnalysisSummaryResult = OpaqueRecord;
export type ContentAnalysisSentimentAnalysisRequest = OpaqueRecord;
export type ContentAnalysisSentimentAnalysisResult = OpaqueRecord;
export type ContentAnalysisRatingDistributionRequest = OpaqueRecord;
export type ContentAnalysisRatingDistributionResult = OpaqueRecord;
export type ContentAnalysisPhraseTrendsRequest = OpaqueRecord;
export type ContentAnalysisPhraseTrendsResult = OpaqueRecord;
export type ContentAnalysisCategoryTrendsRequest = OpaqueRecord;
export type ContentAnalysisCategoryTrendsResult = OpaqueRecord;

// ───────────────────────────────────────────────────────────────
// On-Page (Site Audit + Lighthouse + Instant Pages + Content Parsing)
// ───────────────────────────────────────────────────────────────

export type SiteAuditStatus = "queued" | "running" | "completed" | "failed";

export interface SiteAudit {
  id: string;
  status: SiteAuditStatus;
  request: unknown;
  createdAt: string;
  completedAt?: string | null;
  result?: OpaqueRecord | null;
  error?: DataError;
}

export type SiteAuditCreateRequest = OpaqueRecord;
export type SiteAuditResultRequest = OpaqueRecord;
export type SiteAuditPagesResult = OpaqueRecord;
export type SiteAuditResourcesResult = OpaqueRecord;
export type SiteAuditUncrawlableResourcesResult = OpaqueRecord;
export type SiteAuditPageByResourceResult = OpaqueRecord;
export type SiteAuditLinksResult = OpaqueRecord;
export type SiteAuditRedirectChainsResult = OpaqueRecord;
export type SiteAuditDuplicateTagsResult = OpaqueRecord;
export type SiteAuditDuplicateContentResult = OpaqueRecord;
export type SiteAuditNonIndexableResult = OpaqueRecord;
export type SiteAuditWaterfallResult = OpaqueRecord;
export type SiteAuditKeywordDensityResult = OpaqueRecord;
export type SiteAuditMicrodataResult = OpaqueRecord;
export type SiteAuditRawHtmlResult = OpaqueRecord;
export type SiteAuditPageScreenshotResult = OpaqueRecord;

export interface LighthouseAvailableAudit {
  id: string;
  title?: string;
  description?: string;
}
export interface LighthouseLanguage {
  code: string;
  name: string;
}
export interface LighthouseVersion {
  version: string;
  releasedAt?: string;
}
export type LighthouseRequest = OpaqueRecord;
export type LighthouseAudit = OpaqueRecord;

export type InstantPagesRequest = OpaqueRecord;
export type InstantPagesResult = OpaqueRecord;

export interface ContentParsing {
  id: string;
  status: SiteAuditStatus;
  createdAt: string;
  completedAt?: string | null;
  request: unknown;
  result?: OpaqueRecord | null;
}
export type ContentParsingRequest = OpaqueRecord;

// ───────────────────────────────────────────────────────────────
// Business Data
// ───────────────────────────────────────────────────────────────

export type BusinessDataAsyncStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed";

export type BusinessDataLocation = ResolvedLocation;

export interface BusinessDataCategory {
  id: number;
  name: string;
  parent?: number;
}

export type BusinessListingsSearchRequest = OpaqueRecord;
export type BusinessListingsSearchResult = OpaqueRecord;
export type BusinessListingsCategoriesAggregationRequest = OpaqueRecord;
export type BusinessListingsCategoriesAggregationResult = OpaqueRecord;

export interface AsyncResource<TRequest = unknown, TResult = OpaqueRecord> {
  id: string;
  status: BusinessDataAsyncStatus;
  createdAt: string;
  completedAt?: string | null;
  request: TRequest;
  result?: TResult | null;
  error?: DataError;
}

export type GoogleMyBusinessInfo = AsyncResource;
export type GoogleMyBusinessInfoRequest = OpaqueRecord;
export type GoogleMyBusinessUpdates = AsyncResource;
export type GoogleMyBusinessUpdatesRequest = OpaqueRecord;

// ───────────────────────────────────────────────────────────────
// DataForSEO Labs (Google sub-module)
// ───────────────────────────────────────────────────────────────

export interface DataforseoLabsStatus {
  available: boolean;
  message?: string;
  checkedAt?: string;
}

export interface DataforseoLabsLocationLanguage {
  location: ResolvedLocation;
  language: ResolvedLanguage;
}

export interface DataforseoLabsCategory {
  id: number;
  name: string;
  parent?: number;
}

export type KeywordOverviewRequest = OpaqueRecord;
export type KeywordOverviewResult = OpaqueRecord;
export type BulkKeywordDifficultyRequest = OpaqueRecord;
export type BulkKeywordDifficultyResult = OpaqueRecord;
export type SearchIntentRequest = OpaqueRecord;
export type SearchIntentResult = OpaqueRecord;
export type AvailableHistoryRequest = OpaqueRecord;
export type AvailableHistoryResult = OpaqueRecord;
export type RelatedKeywordsRequest = OpaqueRecord;
export type RelatedKeywordsResult = OpaqueRecord;
export type KeywordSuggestionsRequest = OpaqueRecord;
export type KeywordSuggestionsResult = OpaqueRecord;
export type KeywordIdeasRequest = OpaqueRecord;
export type KeywordIdeasResult = OpaqueRecord;
export type KeywordsForSiteRequest = OpaqueRecord;
export type KeywordsForSiteResult = OpaqueRecord;
export type HistoricalKeywordDataRequest = OpaqueRecord;
export type HistoricalKeywordDataResult = OpaqueRecord;

export type CategoriesForDomainRequest = OpaqueRecord;
export type CategoriesForDomainResult = OpaqueRecord;
export type CategoriesForKeywordsRequest = OpaqueRecord;
export type CategoriesForKeywordsResult = OpaqueRecord;
export type KeywordsForCategoriesRequest = OpaqueRecord;
export type KeywordsForCategoriesResult = OpaqueRecord;
export type DomainMetricsByCategoriesRequest = OpaqueRecord;
export type DomainMetricsByCategoriesResult = OpaqueRecord;
export type TopSearchesRequest = OpaqueRecord;
export type TopSearchesResult = OpaqueRecord;

export type SerpCompetitorsRequest = OpaqueRecord;
export type SerpCompetitorsResult = OpaqueRecord;
export type RankedKeywordsRequest = OpaqueRecord;
export type RankedKeywordsResult = OpaqueRecord;
export type CompetitorsDomainRequest = OpaqueRecord;
export type CompetitorsDomainResult = OpaqueRecord;
export type DomainIntersectionRequest = OpaqueRecord;
export type DomainIntersectionResult = OpaqueRecord;
export type SubdomainsRequest = OpaqueRecord;
export type SubdomainsResult = OpaqueRecord;
export type RelevantPagesRequest = OpaqueRecord;
export type RelevantPagesResult = OpaqueRecord;
export type DomainRankOverviewRequest = OpaqueRecord;
export type DomainRankOverviewResult = OpaqueRecord;
export type HistoricalRankOverviewRequest = OpaqueRecord;
export type HistoricalRankOverviewResult = OpaqueRecord;
export type PageIntersectionRequest = OpaqueRecord;
export type PageIntersectionResult = OpaqueRecord;
export type HistoricalSerpsRequest = OpaqueRecord;
export type HistoricalSerpsResult = OpaqueRecord;
export type BulkTrafficEstimationRequest = OpaqueRecord;
export type BulkTrafficEstimationResult = OpaqueRecord;
export type HistoricalBulkTrafficEstimationRequest = OpaqueRecord;
export type HistoricalBulkTrafficEstimationResult = OpaqueRecord;

// ───────────────────────────────────────────────────────────────
// Endpoint filter catalogs (echoed by `*/filters`)
// ───────────────────────────────────────────────────────────────

export interface FilterCatalog {
  endpoints: Record<string, readonly string[]>;
}
