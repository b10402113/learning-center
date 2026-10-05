---
subject: next-js
created: 2026-10-04
updated: 2026-10-04
---

# Mastery — next-js

## runtime-and-rendering-strategies — 執行環境與渲染策略：Node / Edge、SSG / ISR / SSR / PPR

- rendering-definition-and-axes: unknown
- build-time-vs-run-time: unknown
- runtime-environment-node-vs-edge: unknown
- ssg-build-time-static: unknown
- isr-incremental-static-regeneration: unknown
- ssr-per-request-render: unknown
- ppr-static-shell-plus-streaming: unknown
- choosing-strategy-by-content-freshness: unknown
- edge-runtime-limitations: unknown
- edge-vs-serverless-functions: unknown
- switching-runtime-and-revalidate-in-code: unknown

> probe skipped via /nodes next-js/runtime-and-rendering-strategies skip-probe on 2026-10-04; teach every step deep.

## project-structure-layers — 專案結構與分層：feature 放哪裡

- top-level-config-and-dependency-layer: unknown
- public-static-assets-and-node-modules: unknown
- app-file-conventions-page-layout-globals: unknown
- root-layout-wraps-all-routes-via-children: unknown
- route-groups-without-changing-url: unknown
- nested-layout-shells: unknown
- where-new-feature-code-belongs: unknown

> probe skipped via /nodes next-js/project-structure-layers skip-probe on 2026-10-04; teach every step deep.

## file-based-routing-layouts — 檔案式路由、layout 與 route groups

- folders-are-routes: unknown
- page-file-convention: unknown
- nested-routes: unknown
- dynamic-segment-square-brackets: unknown
- params-prop: unknown
- layout-children-slot: unknown
- root-layout-required: unknown
- nested-layout-stacking: unknown
- route-groups-parentheses: unknown
- route-groups-not-in-url: unknown
- url-to-file-tree-reverse: unknown

> probe skipped via /nodes next-js/file-based-routing-layouts skip-probe on 2026-10-04; teach every step deep.

## component-composition-patterns — 元件組合模式：server shell + client island

- server-shell-client-island: unknown
- presentational-components: unknown
- generic-renderer-composition: unknown
- boundary-placement-decision: unknown

> probe skipped via /nodes next-js/component-composition-patterns skip-probe on 2026-10-04; teach every step deep.

## server-data-fetching — 在 RSC 裡抓資料：何時 server、何時 client

- rsc-vs-client-fetching: unknown
- server-fetch-benefits-fcp-seo-dedup-security: unknown
- server-component-async-fetch: unknown
- direct-database-call-in-rsc: unknown
- params-and-searchparams-in-rsc: unknown
- network-waterfall-and-parallel-requests: unknown
- n-plus-one-and-populate: unknown
- paginated-search-action: unknown
- client-fetching-when-necessary: unknown

> probe skipped via /nodes next-js/server-data-fetching skip-probe on 2026-10-04; teach every step deep.

## fetch-caching-and-dedup — Fetch 快取與 request dedup

- extended-fetch-over-axios: unknown
- fetch-default-auto-cache: unknown
- cache-no-store-vs-force-cache: unknown
- next-revalidate-per-fetch: unknown
- request-dedup-same-url-options: unknown
- dedup-scope-single-render: unknown
- dedup-across-generateMetadata-page-layout: unknown
- react-cache-for-non-fetch: unknown
- fetch-cache-vs-react-cache-lifetime: unknown
- route-handler-default-get-cache: unknown
- force-dynamic-opt-out: unknown
- stale-data-debugging: unknown

> probe skipped via /nodes next-js/fetch-caching-and-dedup skip-probe on 2026-10-04; teach every step deep.

## client-islands-and-dynamic-imports — Client 邊界陷阱與 client-only 套件

- use-client-subtree-boundary: unknown
- imports-become-client-code: unknown
- client-cannot-nest-server-component: unknown
- browser-only-packages-fail-ssr: unknown
- mdx-editor-ssr-unsupported: unknown
- theme-provider-client-isolation: unknown
- dynamic-import-ssr-false: unknown
- dynamic-import-with-rhf-value-onchange: unknown
- audit-use-client-misuse: unknown
- server-component-bundle-leak: unknown

> probe skipped via /nodes next-js/client-islands-and-dynamic-imports skip-probe on 2026-10-04; teach every step deep.

## streaming-suspense-ppr — 串流、Suspense、PPR 與 after()

- rsc-vs-ssr-and-hydration: unknown
- streaming-and-selective-hydration: unknown
- suspense-boundary-and-fallback: unknown
- ppr-static-shell-plus-streaming: unknown
- promise-props-and-use-hook: unknown
- use-hook-loops-and-conditionals: unknown
- promise-vs-await-blocking-server: unknown
- loading-file-vs-suspense-boundary: unknown
- after-post-response-api: unknown
- after-allowed-contexts: unknown
- after-cannot-modify-response: unknown
- view-counter-strategy-tradeoffs: unknown
- promise-all-parallel-requests: unknown
- sequential-waterfall-optimization: unknown

> probe skipped via /nodes next-js/streaming-suspense-ppr skip-probe on 2026-10-04; teach every step deep.

## route-handlers-rest — Route Handlers 與 REST API 設計

- route-handler-file-convention: unknown
- http-method-exports: unknown
- no-separate-server-serverless: unknown
- nested-and-dynamic-routes: unknown
- params-vs-searchparams: unknown
- reading-params-and-nexturl-searchparams: unknown
- response-envelope-action-response: unknown
- status-codes-200-201-204-400-404-500: unknown
- zod-validation-and-duplicate-checks: unknown
- centralized-error-handling: unknown
- api-fetch-wrapper-client: unknown
- when-route-handler-vs-server-action: unknown

> probe skipped via /nodes next-js/route-handlers-rest skip-probe on 2026-10-04; teach every step deep.

## revalidation-and-cache-layers — Revalidation 與多層快取

- cache-layers-scope-and-lifetime: unknown
- time-based-revalidate-values: unknown
- page-level-vs-fetch-level-revalidate: unknown
- on-demand-revalidate-path: unknown
- on-demand-revalidate-tag: unknown
- fetch-tags-and-cache-tags: unknown
- unstable-cache-cross-request: unknown
- react-cache-per-request: unknown
- react-cache-vs-unstable-cache: unknown
- route-handler-get-default-cache: unknown
- force-dynamic-opt-out: unknown
- stale-data-root-cause: unknown

> probe skipped via /nodes next-js/revalidation-and-cache-layers skip-probe on 2026-10-04; teach every step deep.
