/**
 * Voyant Data FX is a thin white-label of exchangerate-api.com. Each route
 * mirrors the upstream response shape; the SDK exposes them as opaque records
 * so future provider field additions don't break callers.
 */
export type FxSource = "bnr" | "voyant-data-fx";

/**
 * ISO 4217 currency catalog entry (`/data/fx/v1/currencies`) — the canonical
 * formatting/decoder catalog, distinct from the live `fx.codes()` supported set.
 */
export interface CurrencyEntry {
  code: string;
  name: string;
  namePlural: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
}

export interface FxResponse extends Record<string, unknown> {
  source?: FxSource;
}

export interface FxLatestResponse extends FxResponse {
  result: string;
  documentation?: string;
  termsOfUse?: string;
  timeLastUpdateUnix?: number;
  timeLastUpdateUtc?: string;
  timeNextUpdateUnix?: number;
  timeNextUpdateUtc?: string;
  baseCode: string;
  conversionRates: Record<string, number>;
}

export interface FxPairResponse extends FxResponse {
  result: string;
  documentation?: string;
  termsOfUse?: string;
  timeLastUpdateUnix?: number;
  timeLastUpdateUtc?: string;
  timeNextUpdateUnix?: number;
  timeNextUpdateUtc?: string;
  baseCode: string;
  targetCode: string;
  conversionRate: number;
  conversionResult?: number;
}

export interface FxEnrichedResponse extends FxResponse {
  result: string;
  baseCode: string;
  targetCode: string;
  conversionRate: number;
  targetData?: Record<string, unknown>;
}

export interface FxHistoryResponse extends FxResponse {
  result: string;
  baseCode: string;
  year: number;
  month: number;
  day: number;
  conversionAmount?: number;
  conversionRates: Record<string, number>;
}

export interface FxCodesResponse extends FxResponse {
  result: string;
  supportedCodes: Array<[string, string]>;
}

export interface FxQuotaResponse extends FxResponse {
  result: string;
  planQuota: number;
  requestsRemaining: number;
  refreshDayOfMonth: number;
}
