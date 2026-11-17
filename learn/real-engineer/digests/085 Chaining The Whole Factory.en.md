---
source: sources/real-engineer/20261116/course/085 Chaining The Whole Factory.en.txt
source_type: text
source_lines: 53
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L97
---

# L1 overview

- 目前仍有多個手動步驟：explore 後人工挑 ticket、implement 後人工貼 `agent review`、最後人工決定 merge，所以還不夠自主。
- 本節自動化兩段：implement 一律自動請求 review；explore 自行判斷哪些 ticket 可以實作。
- 做法是 `npm run cherry pick` 挑 `chain factory end-to-end` commit，再 `git push`。
- Explore prompt 新增 verdict：每張 issue 給一個標籤，workflow 依標籤分支。
- 三種 verdict：easy call（改動明確、沒人會反對、可放心讓 PR 直接 land）→ 自動進 implementer；needs a human（要先決定 migration、命名、政策、取捨，或 claim 不成立）；blocked（等 repo 外的東西或只有回報者才知道的資訊）。
- 這段判斷文字是 agent 做決策的依據，可依工廠需求調整，甚至附上 easy call／needs a human 的範例。
- Plan schema 會記錄標籤；easy call 就移除 `agent in progress`、貼上 `agent implement`。
- `agent implement` 新增步驟：`github.pr.edit` 貼上 `agent review`，鏈就接到 review。
- 額外好處：send feedback 送出的 issue 會自動帶 `agent explore`，填一張表就能啟動整個工廠。

# L2 detail

- `#L1-L6` — 目前 explore 之後要人工挑 ticket、implement 出 draft PR 後要人工貼 review、之後還要人工決定 merge，整個流程要不斷插手，稱不上自主加速。
- `#L7-L12` — 本節自動化兩塊：implement 完成後一律自動請求 review；以及讓 explore 在探索 ticket 時自行決定哪些該實作；做法是在 branch 上 `npm run cherry pick` 選 `chain factory end-to-end` commit，本機 main 就有了新 commit，再 `git push`。
- `#L13-L21` — Explore prompt 新增 verdict 步驟：每張 issue 給一個 tag，workflow 據此分支為 easy call、needs a human 或 blocked；easy call 的定義是「正確改動清楚、沒人會反對其中任何決策、你願意讓這個 PR 在你不看的情況下 land」。
- `#L22-L29` — needs a human 是有人得先決定某些事（migration、命名、政策、取捨），或 issue 的 claim 站不住腳；blocked 是等 repo 外的東西，或等只有回報者才有的資訊；這段文字是 agent 判斷的依據，可依工廠需求微調，甚至附上各類型的範例。
- `#L30-L36` — easy call 會寫進 plan schema 的標籤；workflow 若看到 easy call，就把它交給 implementer——移除 `agent in progress`、貼上 `agent implement`，第一段鏈就完成，explore 會在判斷可行時自動呼叫 implement。
- `#L37-L41` — implement 呼叫 review：`agent-implement` 新增「hand the pull request to the reviewer」步驟，用 `github.pr.edit` 貼上 `agent review`；鏈一路接到 review，因此只要 label 一張 issue 為 explore，它就會自己 implement 並 review。
- `#L42-L53` — 另一個好處：send feedback 送出的任何 issue 會自動帶上 `agent explore`，等於在 app 內填一張表就能啟動工廠；作者說在 QA 其他東西時順手回饋、最後收到 PR，非常實用；練習是送一則 feedback（作者選 landing page 置中對齊很俗氣、想改左對齊、整體像半成品），按下 file issue 就啟動整個 software factory，也可自己想一個能通過 easy call 的 issue。
