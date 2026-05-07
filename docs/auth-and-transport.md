# Auth And Transport

`@voyantjs/data-sdk` is built on an internal transport layer shared with
sibling SDK packages.

## Default behavior

- default base URL: `https://api.voyantjs.com`
- default auth header: `authorization`
- default auth scheme: `Bearer`
- default user agent marker: `x-voyant-sdk: voyant-sdk`

## Client options

`@voyantjs/data-sdk` accepts transport-level options such as:

- `apiKey`
- `baseUrl`
- `authHeader`
- `authScheme`
- `headers`
- `fetch`
- `userAgent`

## Request behavior

- query params skip `null` and `undefined`
- arrays are serialized as repeated query params
- non-`BodyInit` objects are JSON-encoded automatically
- `content-type: application/json` is set for JSON request bodies

## Response behavior

- JSON responses are parsed automatically
- plain text that looks like JSON is parsed defensively
- the data SDK preserves the full `{ data, totalCount, nextCursor? }`
  envelope on list endpoints and `{ data }` on single-item endpoints, so
  consumers can paginate without losing metadata

## Errors

Non-2xx responses throw `VoyantApiError` from `@voyant-sdk/sdk-core`, which
includes:

- `status`
- `requestId`
- `body`

The Voyant Data API also returns a stable `code` on its error bodies; see
the `DataErrorCode` type for the supported set (`NOT_FOUND`,
`INVALID_REQUEST`, `INVALID_CURSOR`, `UPSTREAM_FAILED`,
`INTERNAL_AUTH_REQUIRED`, `RATE_LIMITED`).

The request ID should be preserved in logs and support requests whenever
possible.
