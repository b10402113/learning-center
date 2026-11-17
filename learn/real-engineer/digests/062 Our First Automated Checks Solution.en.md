---
source: sources/real-engineer/20261116/course/062 Our First Automated Checks Solution.en.txt
source_type: text
source_lines: 125
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L25
  - cohort-005-project.3.part.md#L1-L185
---

# L1 overview

- automated checks 的核心交換：拿 tokens 換 CPU cycles、拿機率性換確定性。
- 實作用了 husky（管理 pre-commit hook）與 lint-staged（只對 staged 檔案跑指令）。
- lint-staged 設定對所有檔案跑 `check-file-tokens.js` 與 `prettier --check --ignore-unknown`。
- token 檢查會忽略 `package-lock.json` 與 Drizzle migrations，並在超標時輸出「如何拆分」的詳細指引。
- 錯誤訊息等於「只在需要時才載入的 AGENTS.md」，是 pre-commit 檢查的高價值設計。
- 只檢查 staged 檔案意味著既有 15 個超標檔案不會一次爆掉，只有被改到時才要求拆分（最大的約 18k tokens）。
- agent 一開始把整套 check suite（typecheck、boundaries、全部測試）塞進 hook；作者把預算收斂到 3 秒，砍掉 typecheck（7.8 秒）等項目。
- pre-commit 不是硬閘門：agent 可以用 `HUSKY=0` 跳過；CI 才是唯一真正的 hard stop。

# L2 detail

- `#L1-L3` — 定調：做 automated checks 的感覺是拿 tokens 換 CPU、拿 probabilism 換 determinism。
- `#L4-L19` — 安裝 husky 與 lint-staged：husky 管理 pre-commit hook，lint-staged 對 staged 檔案跑指令；package.json 新增設定，對所有檔案執行 `node scripts/check-file-tokens.js` 與 `prettier --check --ignore-unknown`，並順手把整個 repo 用 Prettier 格式化。
- `#L20-L29` — token 檢查腳本忽略 `package-lock.json`、Drizzle migrations 等大檔；超標時的錯誤訊息會附上具體拆分指示（root module 保留 loader/action/page，業務邏輯移到 app/modules，子元件移到 app/components；測試則依行為拆檔），效果像「按需載入的 AGENTS.md」。
- `#L30-L37` — 研究發現已有約 15 個檔案超標，最大的是 app/routes/instructor.$courseId 約 18k tokens；因為只檢查 staged 檔案，可以現在就採用，日後誰碰到大檔就由誰拆分。
- `#L38-L49` — 發現 hook 走鐘：agent 除了 Prettier 與 token 檢查外，還把整套 check suite 塞進去，包括 format check、typecheck、boundaries、整個測試套件。
- `#L50-L65` — 建立時間預算觀念：pre-commit 不是進 production 前的最後一道，CI 才是；建議 pre-commit 壓在 3 秒內，慢的東西留給 CI，並下 prompt 要求砍掉超出預算的項目。
- `#L66-L83` — agent 回報各項耗時：測試只要 2 秒，typecheck 卻要 7.8 秒；於是砍掉 typecheck、boundaries、測試（建議改放 pre-push 或 CI）；作者補充自己非常不建議用 push hook，若真要用也該維持 3 秒預算，只有 CI 能放寬到數分鐘。
- `#L84-L99` — 準備 commit；因為 Prettier 動了大量檔案，hook 可能會擋；agent 的解法是先用 `HUSKY=0` 跳過 hook，把一次性格式化提交進去（seed script 已達 23k tokens）。
- `#L100-L113` — 關鍵觀察：agent 可以繞過 pre-commit hook，所以它不是硬閘門，CI 才是唯一 hard stop；作者親自示範提交失敗，看到「fail to run tasks for staged files」與超標清單及拆分指示。
- `#L114-L125` — 跳過 hook 完成格式化提交；系統此後會在每次變更時把檔案拆到合理大小；由於只作用於 staged 檔案，可以很積極地加檢查而不影響既有檔案。
