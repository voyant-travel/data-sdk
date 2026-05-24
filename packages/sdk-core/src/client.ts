import { VoyantApiError } from "./errors.js";
import type { QueryParams, VoyantRequestOptions, VoyantTransportOptions } from "./types.js";

const DEFAULT_BASE_URL = "https://api.voyantjs.com";

function appendQuery(url: URL, query: QueryParams | undefined) {
  if (!query) {
    return;
  }

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === null) {
      continue;
    }

    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (value === undefined || value === null) {
        continue;
      }

      url.searchParams.append(key, String(value));
    }
  }
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function isBodyInit(value: VoyantRequestOptions["body"]): value is BodyInit {
  return (
    value instanceof ArrayBuffer ||
    value instanceof Blob ||
    value instanceof FormData ||
    value instanceof ReadableStream ||
    value instanceof URLSearchParams ||
    typeof value === "string"
  );
}

function maybeJson(text: string, contentType: string | null) {
  if (!text) {
    return null;
  }

  if (contentType?.includes("application/json")) {
    return JSON.parse(text) as unknown;
  }

  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  return text;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function camelCaseKey(key: string) {
  return key.replace(/_([a-z0-9])/g, (_, char: string) =>
    char.toUpperCase(),
  );
}

function camelCaseKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(camelCaseKeys);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      camelCaseKey(key),
      camelCaseKeys(entryValue),
    ]),
  );
}

function getErrorMessage(body: unknown, fallback: string) {
  if (typeof body === "string" && body.length > 0) {
    return body;
  }

  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof body.message === "string" &&
    body.message.length > 0
  ) {
    return body.message;
  }

  return fallback;
}

export class VoyantTransport {
  readonly baseUrl: string;

  private readonly apiKey: string;
  private readonly authHeader: string;
  private readonly authScheme: string | null;
  private readonly defaultHeaders: HeadersInit | undefined;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: VoyantTransportOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.defaultHeaders = options.headers;
    this.fetchImpl = options.fetch ?? fetch;
    this.authHeader = options.authHeader ?? "authorization";
    this.authScheme = options.authScheme === undefined ? "Bearer" : options.authScheme;
    this.userAgent = options.userAgent ?? "voyant-sdk";
  }

  async request<T>(path: string, options: VoyantRequestOptions = {}) {
    const url = new URL(normalizePath(path), this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`);
    appendQuery(url, options.query);

    const headers = new Headers(this.defaultHeaders);
    headers.set(
      this.authHeader,
      this.authScheme ? `${this.authScheme} ${this.apiKey}` : this.apiKey,
    );
    headers.set("x-voyant-sdk", this.userAgent);

    if (options.headers) {
      new Headers(options.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    let body: BodyInit | undefined;
    if (options.body != null) {
      if (isBodyInit(options.body)) {
        body = options.body;
      } else {
        headers.set("content-type", "application/json");
        body = JSON.stringify(options.body);
      }
    }

    const response = await this.fetchImpl(url, {
      body,
      headers,
      method: options.method ?? "GET",
      signal: options.signal,
    });

    const text = await response.text();
    const responseBody = camelCaseKeys(
      maybeJson(text, response.headers.get("content-type")),
    );

    if (!response.ok) {
      throw new VoyantApiError(
        getErrorMessage(
          responseBody,
          `Request failed with status ${response.status}`,
        ),
        {
          body: responseBody,
          requestId: response.headers.get("x-request-id"),
          status: response.status,
        },
      );
    }

    if (options.unwrapData === false) {
      return responseBody as T;
    }

    if (
      responseBody &&
      typeof responseBody === "object" &&
      "data" in responseBody
    ) {
      return responseBody.data as T;
    }

    return responseBody as T;
  }
}
