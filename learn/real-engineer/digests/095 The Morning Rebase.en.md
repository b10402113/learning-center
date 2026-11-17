---
source: sources/real-engineer/20261116/course/095 The Morning Rebase.en.txt
source_type: text
source_lines: 19
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 要解決的痛點：PR 在清單上被放著爛掉，兩週前的 PR 底下的 codebase 已經翻了好幾輪，根本不知道從何救起。
- 提案的 task 叫 auto rebase：每天（例如午夜）把所有 open PR rebase 到它的 base branch。
- 隔天早上醒來，那些 PR 就沒有 merge conflict，而且多半已經被 agent 處理完。
- 這個設計的第一原則是 determinism——不要一開始就對所有東西猛丟 agent。
- rebase 可以先「確定性地」試一次，成功就完全不需要 agent；甚至有些版本根本不需要 agent。
- 必須考慮的失敗型態：merge conflict、PR 已完全過期、或已被後續工作取代。
- 還要考慮 runner 的分配：同時可能有一百個 PR 要處理，一台 runner 顯然吃不下全部。

# L2 detail

- `#L1-L8` — 問題場景與提案：PR 清單上有些 PR 被晾著，兩週未動而底下 codebase 早已大幅變動，根本不知從何救起；因此提出 auto rebase task，每天（例如午夜）把所有 open PR rebase 到目標分支，讓人早上醒來就沒有 merge conflict、大多已被 agent 處理完。
- `#L9-L15` — determinism 優先：不要對所有東西直接丟 agent；rebase 可以先確定性地試一次，成功就完全不需要 agent，甚至有些版本整條流程都用不到 agent。同時要想清楚失敗型態——merge conflict、PR 已完全過期、或已被後續工作取代。
- `#L16-L19` — runner 分配問題：同時可能有一百個 PR 要處理，一台 runner 顯然吃不下，必須先設計每台 runner 各自負責什麼。
