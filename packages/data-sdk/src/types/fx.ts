/**
 * Voyant Data FX is a thin white-label of exchangerate-api.com. Each route
 * mirrors the upstream response shape; the SDK exposes them as opaque records
 * so future provider field additions don't break callers.
 */
export type FxResponse = Record<string, unknown>;

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
