---
source: sources/real-engineer/20261116/course/053 Enforcing Module Boundaries.en.txt
source_type: text
source_lines: 49
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L202
---

# L1 overview

- 問題從「做好」轉為「維持」：下一個 agent 會想重犯舊錯，如何阻止 root 直接呼叫 database、如何確保 deep module 不再變回 shallow。
- 品質機制有層級：human review → automated review → automated checks；越往後越便宜且行為一致，所以盡量把檢查往自動化推。
- TypeScript 的解法是 Dependency Cruiser：JS 只要檔案 `export` 就能任意 import，Dependency Cruiser 可強制 import 規則，Rust 與 Java 也各有對應工具。
- repo 內建一個實驗性 skill `setup-ts-deep-modules`：把每個 package 當 deep module，實作藏在 `lib/`、只能經 `index.ts` 或 `client.ts` 進出，測試與 package 同址。
- 進一步用規則禁止 Instructor Analytics root 自行查 database，使它只能透過 deep module 成長，並把新 module 放到 `app/modules`。

# L2 detail

- `#L1-L6` — code 已變漂亮：loader 呼叫可測試的 deep module，production 跑的 code 與受測 code 相當接近。下一個問題是如何維持——下一個 agent 會想重複舊錯誤，所以要防止檔案直接呼叫 database，並確保 instructor analytics 是這段邏輯唯一的 canonical 所在。
- `#L7-L12` — 既有機制回顧：human review 在此工作型態下很吃力；automated review（讓 agent 看 diff、確認對的地方 import 對的東西）較好；但理想是 human review → automated review → automated checks，因為自動檢查更便宜且每次行為一致。問題是有沒有自動檢查能讓 deep module 保持深。
- `#L13-L27` — 有，且依語言而異。TypeScript 推薦 Dependency Cruiser：JS 中只要檔案 `export const db`，就能在任何地方 import；Dependency Cruiser 讓你能收緊規則、強制 import 只能照規定走，是從 TypeScript 內部強制 deep module 的好方法。作者說自己不是多語言專家，但知道 Rust 與 Java 也有類似工具。
- `#L28-L36` — repo 一直藏著 `setup-ts-deep-modules` skill（實驗性、非公開，因為多數 skills 不綁語言）。它把 Dependency Cruiser 接進 TypeScript repo，使每個 package 成為 deep module：實作放 `lib/` 且外部不得 import，只能從 `index.ts`／`client.ts` 匯出；測試與 package 同址，一切都很 local。skill 內稱 `source/packages`，本課改稱 `source/modules`。
- `#L37-L49` — 再進一步：除了保護 module 不被外部伸手，也要禁止 Instructor Analytics root import 不該 import 的東西——用 Dependency Cruiser 阻止它自己查 database。如此它唯一能成長的方式就是把東西放進 deep modules。指令：使用 `setup-ts-deep-modules`、目錄用 `app/modules`、把剛抽出的 Instructor Analytics module 搬進去、並禁止該 root 直接查 database；skill 會安裝 Dependency Cruiser、替規則寫測試，再搬移檔案。目標是留下一道讓 deep modules 保持深的自動檢查。
