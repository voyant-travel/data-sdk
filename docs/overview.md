# Overview

`data-sdk` publishes one public TypeScript package:

- `@voyantjs/data-sdk`

Shared transport and error handling stay in a private internal package so the
public SDK boundary stays clean.

## Package boundaries

- `@voyantjs/data-sdk` wraps the Voyant Data APIs (`/data/static`,
  `/data/fx`, `/data/seo`).
- `@voyant-sdk/sdk-core` contains shared request plumbing only.
