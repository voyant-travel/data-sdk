# FAQ

## Why is there no docs app in this repo?

Because the shared docs app will live in `voyant`. This repo only needs
enough Markdown to explain the SDK packages and how they are maintained.

## Why is `sdk-core` private?

It exists to share transport behavior without making that shared layer part
of the public support surface.

## Why not import code directly from `voyant-cloud`?

Because this repo is public and the SDK should depend on public contracts,
not private application internals.

## Why does the SDK only enumerate `static` and `fx` routes?

The third sub-product, `seo`, is a proxy to DataForSEO with hundreds of
manifest-driven endpoints. Mirroring every route by hand would be churn for
no ergonomic gain. The `seo` group exposes a typed pass-through instead.

## Why does the FX path contain `/fx/` twice?

The public path for FX endpoints is `/data/fx/v1/fx/...`. This is a
consequence of how the FX worker namespaces its own routes
(`/v1/fx/latest/:base`) underneath the gateway prefix (`/data/fx`). The SDK
hides this from callers — `client.fx.latest("USD")` constructs the right
path automatically.
