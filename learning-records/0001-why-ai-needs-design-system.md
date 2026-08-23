# 0001 — AI 需要 Design System：視覺合約與兩道鎖

- **日期**: 2026-08-22
- **Node**: design-system-boundary（step 1 / 4）
- **來源**:
  - `sources/vertex-learning-platform/AGENTS.md#ui-rules`
  - `sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:1649-1700`

## 非顯而易見的領悟

1. **AI 的視覺不一致不是 bug，是預設行為。** 它不是「偶爾記錯」，而是「根本沒有在記」——沒有跨對話的視覺記憶。這個歸因決定了解法方向：不能靠「提醒它」，只能靠「寫下來的約束」。
2. **規則和規格是不同的東西，缺一不可。** 規則（AGENTS.md 的「You do not design UI」）管行為邊界；規格（Design System 的 token / 元件）管具體內容。有規則無規格 → AI 不知道該做什麼；有規格無規則 → AI 會在規格之外自己加料。「規則關上門，規格把門焊死。」
3. **設計稿是 source of truth，AI 的職責是複製不是改善。** 這反轉了「讓 AI 更有創意」的直覺：在 UI 工作上，恰恰要把 AI 的創意限制在實作層（responsive 重排、sidebar 折疊），而非設計層。

## 對後續的影響

- 本 node 後三步（tailwind-v4-tokens → typed-component-library → showcase-validation）都是這份「視覺合約」的落地，是同一信念的技術化。
- 在自己的 Next.js 專案上可直接套用：design/ 資料夾 + AGENTS.md UI 規則 + 逐步 token 化。
- 與先前 node（agentic-engineering-workflow）的 scope boundary 概念互相印證：設計系統本身就是 AGENTS.md 強制的一條範圍邊界。

## 待覆核／開放問題

- 「設計稿一定要是圖片嗎，能不能用文字描述？」—— 目前的理解：圖片是為了讓 AI 有唯一、可視覺比對的 source of truth，這也為 step 4 的視覺 diff 埋下伏筆。
