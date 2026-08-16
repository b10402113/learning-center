# ADR-0002: Pure-static architecture with a single Sandpack runtime exception

The product is pure-static by design — no server, no accounts, no cloud sync; data
ships in a generated `graph.json` and state lives in `localStorage`. Interactive
lesson examples are rendered with Sandpack, which loads a client-side iframe and
CDN resources at runtime. Sandpack is the one explicit external-runtime exception
to the pure-static rule: an interactive example needs network to load. Everything
else — lesson HTML, math, syntax highlighting, search index — is pre-rendered or
prebuilt at generate time and works offline.

This exception is deliberate: "pure-static" is defined as *no backend of our own*,
not *no external resources whatsoever*. Do not "fix" Sandpack by moving examples to
a backend, and do not extend the exception to other runtime CDNs without an ADR.

Sandpack configs are declared in lessons via ` ```sandpack ` code fences, extracted
at generate time into `graph.json`, and lazy-loaded with `React.lazy` only for
lessons that contain one.
