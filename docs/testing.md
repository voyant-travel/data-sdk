# Testing

This repo publishes SDK packages, so tests should focus on client behavior
rather than application behavior.

## What to test

- auth header construction
- query parameter serialization
- JSON request body encoding
- response envelope handling
- non-JSON response handling
- API error construction
- package export shape

## What not to test here

- private business logic from `voyant-cloud`
- database behavior
- product UI behavior
- implementation details that belong to server-side tests

## Recommended layers

- unit tests for `sdk-core` transport behavior
- package tests for Data client method wiring
- fixture-based response tests for common endpoint shapes
- publish verification tests for package exports and built files

## Current baseline

The repo includes Node-native smoke tests under `tests/` that exercise:

- `sdk-core` transport behavior against mocked `fetch`
- Data client route composition (`countries`, `airports`, `fx`, `seo`)
- envelope handling for list and single-item endpoints

## Good test boundaries

- `sdk-core` should be tested with mocked `fetch`
- `@voyantjs/data-sdk` should verify route composition and option forwarding

## Contract drift

When a route or response contract changes in `voyant-cloud`, update the SDK
tests at the same time so contract drift is visible immediately.
