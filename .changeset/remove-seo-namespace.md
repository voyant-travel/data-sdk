---
"@voyant-travel/data-sdk": major
---

Remove the `seo` namespace (SERP, keyword research, backlinks, on-page, domain
analytics, content analysis, business data, DataForSEO Labs). Voyant Data is a
travel-data SDK; the SEO tooling has been retired. Shared reference types
(`LocationInput`, `LanguageInput`, `ResolvedLocation`, `ResolvedLanguage`,
`OpaqueRecord`) that the hotels/restaurants/verticals namespaces depended on now
live in the neutral `types/common` module.
