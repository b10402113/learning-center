---
source: sources/real-engineer/20261116/course/061 Our First Automated Checks.en.txt
source_type: text
source_lines: 63
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L25
---

# L1 overview

- 從 gist 挑兩個點子實作：pre-commit hook，以及一個不用 linter 的自訂檢查。
- harness 的「每次檔案編輯就跑檢查」hook 不划算：同一 session 會改大量檔案，又慢又吵、token 效率差。
- agent 通常知道自己把檔案改成壞狀態，lint 的提醒對它是無用資訊。
- 更好的做法是叫 agent commit，由 pre-commit hook 統一批次給回饋，資訊在對的時間出現。
- 自訂檢查：限制 staged 檔案不得超過 5,000 tokens。
- 理由：codebase 變大後 agent 會生出巨型檔案，10,000 tokens 的檔案它無法整個載入 context，只能靠 grep 找內容。
- prompt 要求 husky/lint-staged 風格的 pre-commit hook：Prettier format check 加上 token 上限（bytes/4 粗估），超標就報錯並給拆分指引；整個 hook 要壓在 3 秒內。

# L2 detail

- `#L1-L3` — 從上一個練習的 gist 出發，確定要採用 pre-commit hook。
- `#L4-L21` — 回應常見問題：harness 的 file-edit hook 會在每次編輯時跑檢查，但一次 session 會改很多檔案，導致變慢、吵雜、token 浪費；agent 往往已知自己把檔案弄壞，lint 訊息無用；改成在 commit 時批次執行 pre-commit hook，能在正確時機給正確資訊。
- `#L22-L31` — 同意把 format check 放進 pre-commit；同時要先打破「自動檢查非得靠 linter」的觀念——作者最愛用的檢查之一完全不用 linter，而且極簡。
- `#L32-L43` — 三個要求：設好 pre-commit hook、正確設定 Prettier 並在其中跑 format check、限制 staged 檔案最多 5,000 tokens；原因是 codebase 變大後 agent 傾向造巨型檔案，10,000 tokens 的檔案難以導航，agent 無法整檔載入 context，只能靠 grep 搜尋。
- `#L44-L57` — 具體 prompt：pre-commit hook 做 Prettier format check；自訂 script 檢查 staged 檔案是否超過 5,000 tokens（以 bytes ÷ 4 粗估），超標就報錯並提供拆分指引。
- `#L58-L63` — 額外要求：hook 執行時間壓在 3 秒內，若 agent 放了超過負擔的東西就要糾正。
