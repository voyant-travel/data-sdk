---
"@voyantjs/data-sdk": patch
---

Bind the transport fetch implementation to `globalThis` so SDK requests work in strict Web Platform runtimes such as Cloudflare Workers.
