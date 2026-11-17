---
source: sources/real-engineer/20261116/course/070 Diagnosing Bugs Solution.en.txt
source_type: text
source_lines: 35
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.5.part.md#L1-L587
---

# L1 overview

- Prompt 描述症狀（頂部 select、dark mode toggle 失效），並明說「你大概缺少能解決問題的資料，先接上 browser console」。
- agent 立刻改用 Playwright：用真實 Chrome 開啟應用、點擊操作，因而取得 browser console。
- console 顯示 page error：server-only 程式碼漏進 client bundle，破壞 hydration，只剩不需 JavaScript 的控件可用。
- 這正好解釋症狀：底部 select 不需要 JS 才正常，頂部 select 需要 JS 所以壞掉。
- diagnosing-bugs 的循環：持續嘗試，失敗就換假設，直到找到能穩定重現與解釋的原因。
- 修法是改用替代方式通過已載入的資料；接著加 regression guard。
- regression guard 直接複用既有 automated checks：新增 Dependency Cruiser boundary 規則，禁止 AppComponents 在 runtime import AppDB。
- 最後驗證規則在 buggy code 上變紅、在修正後變綠。
- 結論：agent 一旦拿到對的資料源，修 bug 幾乎變得容易；常被說「不會修 bug」其實是資料不足。

# L2 detail

- `#L1-L10` — 組合 prompt：描述頂部 selector 失效、dark mode toggle 失效，推測 agent 缺少關鍵資料，要求先連 browser console；順帶提 dev server 在 localhost:5175（預設為 5173）；agent 立刻用 Playwright 以真實 Chrome 除錯、點擊操作，並取得 console。
- `#L11-L13` — console 的 page error 指出 server-only 程式碼漏進 client bundle，導致 hydration 失敗，只剩非 JS 控件可用；這解釋了底部 select（不需 JS）正常、頂部 select（需 JS）失效。
- `#L14-L19` — diagnosing-bugs 的本質是找一個可穩定重現的 loop：先建立一致的失敗，若第一個假設不成立就持續換假設，直到找到吻合的原因（例如發現資料已通過每個 user，改採替代方式）。
- `#L20-L29` — 修正後加上 regression guard，並複用既有的 lint boundaries：新增 Dependency Cruiser 規則，禁止 AppComponents 在 runtime import AppDB；再次確認規則在 buggy code 上紅、在修正後綠，最後給出完整讀數：連上 console → 找到確切原因 → 修好 → 用 lint boundaries 防止再犯。
- `#L30-L35` — 結論：agent 取得正確資料源後，處理這類 bug 幾乎輕而易舉，因為它吸收與整理 log 的能力遠勝人類；人們常說 agent 不會修 bug，往往只是它沒有對的資料；diagnosing-bugs 的額外嚴謹之處在於內建 retro，讓同一 bug 不再發生。
