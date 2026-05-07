# Contracts

This repo should consume public API contracts, not private application code.

## Source of truth

The implementation and route behavior live in `voyant-cloud`, but this repo
should only depend on exported contracts derived from that implementation.

## Generated artifacts

- `pnpm sync:contracts` rebuilds the route inventory from sibling
  `voyant-cloud` route files. It writes `generated/public-routes.json`.
- `generated/public-routes.json`: flat list of public routes (method + path)
  scraped from `voyant-cloud`. Consumed by `verify:api-parity` (server-side
  drift) and `verify:client-route-coverage` (SDK-side drift).
- The manifest is keyed by sub-product (`static`, `fx`). The SEO sub-product
  is intentionally not enumerated — it is manifest-driven on the server and
  exposed by the SDK as a generic typed pass-through.

## Rules

- never import runtime code from `voyant-cloud`
- avoid coupling package internals to private database or service models
- prefer stable API shapes over mirroring every internal naming detail

## Expected flow

1. `voyant-cloud` defines or changes a public data route.
2. `data-sdk` runs `pnpm sync:contracts` to refresh
   `generated/public-routes.json`.
3. `data-sdk` updates `packages/data-sdk/src/{client,types,index}.ts` to
   match.
4. `pnpm verify:client-route-coverage` and `pnpm verify:api-parity` confirm
   the SDK and the server are aligned.
5. Package-level tests verify request shape, auth, and error handling.

## Why this matters

The SDK repo is public. Consumers need visible source, changelogs, and issue
history without exposing private application code.
