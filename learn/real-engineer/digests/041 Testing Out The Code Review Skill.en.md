---
source: sources/real-engineer/20261116/course/041 Testing Out The Code Review Skill.en.txt
source_type: text
source_lines: 33
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L89
---

# L1 overview

- 目標：在人工介入前先拉高這個可疑的低品質 PR。
- 指令是 `code review <PR 號碼>`，並加上「fix what you find」。
- 作者主張 automated review 應主動修掉發現的問題，而不是只丟評論給人，否則整體更慢。
- 只有拿不準或有疑慮的東西才交還給人類。
- 審查是兩軸：coding standards 與 spec；agent 有時會走不該走的捷徑，所以要用書面 spec 驗證。
- 不一定有 spec（有時從 grilling 直接進實作），本課的 spec 放在 gist，用 to spec、to tickets 的格式。
- 流程：把 spec 貼成 issue，取得 issue 編號後連同 PR 號碼與修正指示一起交給 agent。

# L2 detail

- `#L1-L12` — 面對這個可疑地低品質的 PR，先記下 PR 編號，執行 `code review PR 34`，並追加「and fix what you find」；理由是自動審查若只產出一堆評論再轉給人類，整個流程反而更慢，所以它應主動修，只有棘手或不確定的部分才留給人，目標是讓人類審查盡可能快而有效率。
- `#L13-L24` — 說明兩軸審查：除了 coding standards，還需要 spec 當基準；寫程式的過程複雜，agent 可能做出不該做的捷徑，因此要用書面 spec 核對；並非總有 spec（有時從 grilling 直接進實作），但本課有，作者放在 gist，採典型的 to spec / to tickets 佈局。
- `#L25-L33` — 操作步驟：把 spec 腳本貼成 issue（示範得到 issue 35，原始 spec 就是 issue 35），再把它連同正確的 PR 與「fix what you find」一起交給 agent；預期會找出不少問題，產出更值得人工審查的版本。
