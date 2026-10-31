---
source: sources/background-agents/20261027/vite.config.ts
source_type: text
source_lines: 18
status: skipped
skip_reason: "not taught by any current node"
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 前端建置 — Vite + React plugin，root 指向 `web`，固定 port 5173。
- API 代理 — `/api` 轉到 `http://127.0.0.1:3001`，讓 operator UI 與 operator API 同源。

# L2 detail

- `#L1-L2` — 引入 `defineConfig` 與 React plugin。
- `#L3-L17` — 設定 plugins、root、strictPort、`/api` proxy、輸出到 `../dist`。
- `#L18` — 檔案結尾。
