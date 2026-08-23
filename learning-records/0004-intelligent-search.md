# 0004 — 智慧搜尋架構：Grounding 消除幻覺，Server Route 保護邊界

- **日期**: 2026-08-22
- **Node**: intelligent-search（step 1 / 4）
- **來源**:
  - `sources/vertex-learning-platform/AGENTS.md#search-behavior`
  - `sources/vertex-learning-platform/AGENTS.md#search-config`
  - `sources/vertex-learning-platform/AGENTS.md#decisions`
  - `sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:6505-6800`

## 非顯而易見的領悟

1. **搜尋功能最大的風險不是「找不到」，而是「編造」。** LLM 的幻覺傾向是內建的，不是邊緣案例。Grounding 機制從根本上消除了這個風險：模型只選 ID，Sanity 供事實。這和 design-system node 的「你不設計 UI」是同一種防護模式：用寫下來的規則限制 AI 的自由度，但這次限制的不是視覺而是事實。
2. **影片文件是內部查表，不是獨立實體。** 搜尋結果中的「影片結果」實際上是「使用了某個影片的課程」的引用。這確保了影片文件的 id 永遠不會暴露給使用者，搜尋結果永遠透過課程呈現。這個設計決策直接影響了搜尋結果的結構——video result 永遠帶有 course、module、lesson 的完整路徑。
3. **Chapters-first 時間戳解析是品質與覆蓋率的取捨。** 章節標籤品質高但覆蓋率低（不是每部影片都有章節），逐字稿覆蓋率高但品質低（語音辨識可能有錯字）。兩階段機制確保了「能用高品質的就用高品質的，不能用才退而求其次」。
4. **搜尋規則的雙重寫入是對 LLM 行為的防禦性編程。** 模型更傾向於遵循內聯系統提示中的指令，但 Context 文件是動態可調的。將關鍵規則（如「不要編造」）寫在兩處，是為了確保無論配置如何調整，底線規則始終被執行。這和 AGENTS.md 的「browsing stays public」是同一種防護模式。

## 對後續的影響

- 搜尋 API 的 server route 架構和 Clerk auth 的 server-client 邊界完全一致——可以在自己的 Next.js 專案上直接套用。
- Transcript chunks 的 45 秒 / 350 字元設計是一個可複用的模式：任何需要將大量文本切成可搜尋片段的場景都可以參考。
- Config-as-Content 模式（Context document 控制搜尋行為）是一個值得深入理解的架構決策：它讓非技術人員也能調整搜尋行為，而不需要修改程式碼。

## 待覆核／開放問題

- Semantic search 被關掉時（`text::semanticSimilarity()` errors），keyword fallback 的搜尋品質下降多少？——需要實測。
- Context document 的變更生效時間是「下一次請求」，但 inline system prompt 變更需要「server restart」——這個時間差在生產環境中會造成什麼影響？
- Code Rabbit 在搜尋 PR 中發現的「ground video moments before creating timestamp links」問題，具體的實作修正方案是什麼？
