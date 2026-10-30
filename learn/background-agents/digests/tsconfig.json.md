---
source: sources/background-agents/20261027/tsconfig.json
source_type: text
source_lines: 16
status: skipped
skip_reason: "Repository scaffolding, not part of the course material."
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- TypeScript 設定 — target ES2022、ESNext modules、Bundler resolution、`react-jsx`、strict、noEmit。
- 型別範圍 — 納入 `server`、`shared`、`web` 與兩支設定檔，排除 `service` 與 `scripts`（lint 另外涵蓋 service）。

# L2 detail

- `#L1-L3` — 開啟 compilerOptions 與目標／模組設定。
- `#L4-L15` — 模組解析、JSX、strict、skipLibCheck、esModuleInterop、resolveJsonModule、noEmit、node 與 vite/client 型別。
- `#L16` — include 清單結尾。
