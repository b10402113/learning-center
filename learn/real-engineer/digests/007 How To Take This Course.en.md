---
source: sources/real-engineer/20261116/course/007 How To Take This Course.en.txt
source_type: text
source_lines: 63
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L161
---

# L1 overview

- 課程以練習為主：規劃功能、修 bug、審 diff、親手建出軟體工廠的一部分。
- 核心難題是讓你的程式碼和作者的保持同步，避免分岔後得到不同的 agent 結果；解法是沿用 crash course 的三個指令。
- `npm run reset` 列出可回首的課程檢查點，可用它重設目前分支，或從該 commit 開新分支；但它會刪掉現有工作，等同 `git reset`，動手前先 commit 或開分支。
- `npm run cherry pick` 把該課的 commit 疊在你的工作之上、保留你的改動，代價是可能產生 merge conflict。
- 之後建工廠時會大量使用 `cherry pick`，讓你保留自己選的模型又能吃到作者的更新。
- `npm run pull` 用於作者在 cohort 進行中推出修正時，把 upstream 變更併進來，同樣保留你的工作。
- reset 不會重裝套件，所以之後要補跑 `npm install`、`npm run db:migrate`、`npm run db:seed`。

# L2 detail

- `#L1-L9` — 課程由練習構成（規劃功能、修 bug、審 diff、建與規劃工廠）；課程設計上的難點是如何讓學員跟上、程式碼不與作者分岔，否則 agent 結果會不同。
- `#L10-L22` — 沿用 crash course 的練習機制，三個指令各有用途；`npm run reset` 在 `npm install` 後即可執行，會列出可回首的課程檢查點（如 seed Liam's refund、create glossary、fix refund drift），選一個後可選擇重設目前分支，或保留目前分支並從該 commit 開新分支；作者示範選 add grill and domain skills 並重設目前分支，系統警告將丟棄的 commit。
- `#L23-L33` — reset 會刪除所有現有工作，概念等同 `git reset`，有要保留的東西必須先 commit 或放到分支；接著示範先 `npm run reset` 回到 main 起點、重設目前分支，再執行 `npm run cherry pick`。
- `#L34-L47` — cherry pick 顯示同一份 commit 清單，但選擇後是把該課 commit 疊在你的工作之上而非取代；實測把 `package.json` 改成 "awesome horse platform" 並 commit，cherry pick 後改動仍在，而 `npm run reset` 會把它還原；代價是可能與作者變更產生 merge conflict。後面建工廠時會常用 cherry pick，以便自選模型又能取得作者更新。
- `#L48-L54` — `npm run pull` 用於課程進行中作者發現問題並推送修正時，會先在 Discord 公告，你再執行把變更合併進來；和 cherry pick 一樣盡量保留現有工作、可能衝突，但不像 reset 會刪掉工作。
- `#L55-L63` — 總結三者：reset 取代你的工作、cherry pick 疊加、pull 拉入 upstream；並提醒 reset 只改原始碼不會重裝套件，必要時依序跑 `npm install`（補新套件）、`npm run db:migrate`（套用資料遷移）、`npm run db:seed`（把資料庫種成該課預期狀態）；每堂課都有可 reset 的 commit 讓你對齊畫面。
