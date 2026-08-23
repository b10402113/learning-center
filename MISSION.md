# Mission — 智慧搜尋：MCP + Grounding + 兩段式時間戳

## Why

「如果 AI 寫程式讓你覺得危險，很好——你才是工程師。」Vertex 的招牌功能是智慧搜尋——學習者輸入自然語言，平台從影片逐字稿中找出精確到秒級的片段。但搜尋功能最大的風險不是「找不到」，而是「編造」。LLM 有能力自行組合看似合理的課程名稱、價格、時間戳，但這些資訊可能根本不存在。你需要理解 grounding 機制（模型只選 ID、Sanity 供事實）、兩段式時間戳解析（chapters-first, transcript fallback）、以及 server-only 的搜尋 API 架構——讓 AI 代理不會做出「能跑但危險」的決定。

## The goal

完成這一系列課程後，你能：架 Sanity Context MCP + server 端 search API；說清「模型只選 ID、Sanity 供事實」的 grounding 原理；理解 chapters-first 時間戳解析；以及建立完整的 search UI 架構認知。每課結束後都落在一件「真的能跑或真的能決定」的事上。

## How this node fits

智慧搜尋是 Vertex 的核心差異化功能，四層理解一層疊一層：

1. **架構** — 瀏覽器 → server route → MCP → LLM → Sanity → 回傳結果（本課）
2. **Grounding** — 模型只選 ID，Sanity 供事實，結果不可能造假
3. **時間戳** — chapters-first 兩段式解析，45 秒 transcript chunks
4. **Search UI** — 全頁結果、兩種結果類型、排序控制

它們共同確保：瀏覽器永遠不直接呼叫 MCP 或 LLM，搜尋結果永遠基於真實資料，時間戳永遠可驗證。

## Success looks like

- 能畫出搜尋請求從瀏覽器到 MCP 再回到 UI 的完整流程
- 能說出「為什麼模型只能返回 ID 而不是完整內容」
- 能解釋 chapters-first 時間戳解析的兩階段機制
- 能判斷哪個金鑰可以放 `NEXT_PUBLIC_`、哪個不行（沿用 Clerk node 的邊界認知）

## Current status

- [x] Design System node（Lesson 1–2 已完成）
- [x] Clerk Auth node（Lesson 3 已完成）
- [ ] Lesson 4 — 智慧搜尋架構（本課）
- [ ] 後續 node 待規劃
