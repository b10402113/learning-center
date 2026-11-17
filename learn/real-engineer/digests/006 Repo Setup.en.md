---
source: sources/real-engineer/20261116/course/006 Repo Setup.en.txt
source_type: text
source_lines: 79
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L161
---

# L1 overview

- 目標是把課程 repo `Cohort005project` 放上自己的機器，再變成自己 GitHub 上的 repo；這和 crash course 的 repo 不同，即使做過也別跳過。
- 流程是 `git clone`（用 HTTPS）→ `cd` → `code .`，IDE 可自由選擇，用 terminal 也行。
- 必須 fork 出自己的一份，因為你需要自己的 issues 和 pull requests 當 ticket tracker，指令是 `npx aihero-cli fork`。
- fork 會把本地 git history 重設成單一 commit 並推到新的 public repo；不用怕，專案內有自訂指令保留回原始 upstream 的連結。
- repo 要設成 public，因為後面會用 GitHub Actions，而它對 public repo 免費，private 的額度不夠慷慨。
- 要建的東西是 crash course 那個 Cadence 平台的平行宇宙版本，刻意沿用你已熟悉的理解。
- 啟動流程是 `npm install` → `npm run db:seed`（種本地 SQLite）→ `npm run dev`，開在 `localhost:5175`。
- 之後會有兩個免費註冊：通知系統用 Knock（免費開發者帳號，需 email），whiteboard 用 tlDraw（Google 帳號登入）。

# L2 detail

- `#L1-L4` — 本課要把課程 repo `Cohort005project` 弄到本機並轉成自己的 GitHub repo；這是和 crash course 不同的 repo，是新的遊樂場，做過也要重做。
- `#L5-L18` — 先 clone：複製 HTTPS（比 SSH 好）URL，執行 `git clone`，放到自己慣用的目錄，再 `cd Cohort005project`，用 `code .` 在 VS Code 開啟（不強制 VS Code，其他 IDE 或純 terminal 都可以）。接著要在 GitHub 建立自己版本的 repo，因為你不只需要程式碼，還需要自己的 issues 與 pull requests；作者把它做成一行指令 `npx aihero-cli fork`（會詢問是否安裝指定版本的 `aihero-cli`）。
- `#L19-L33` — fork 過程：輸入名稱（作者示範 `Cohort005project fork 3`），工具會把此資料夾的 git history 換成單一全新 commit、建立新的 public GitHub repo、把檔案以 origin 推上去；本地歷史被重設看起來嚇人但正是要的，因為專案裡有自訂指令保留指向原始 upstream 的連結，按 Y 確認後 public repo 就緒。
- `#L34-L39` — 現在你有自己的 repo，含自己的 issues 與 PR，將當作 ticket tracker；設成 public 是因為後面會依賴 GitHub Actions，public repo 免費，private 雖有免費額度但不夠大方，公開也很適合學習。
- `#L40-L57` — 要建的東西和 crash course 很像，是 Cadence 課程平台的平行宇宙版本；刻意不換新 playground，讓你用既有理解承接新知識。`npm i`（會有 deprecation 與 vulnerability 警告，可忽略）→ `npm run db:seed` 種本地 SQLite → `npm run dev`，在 `localhost:5175` 看到 Cadence 上線。
- `#L58-L71` — 後續需要的免費註冊：做通知系統時會用 Knock，可開免費開發者帳號，不需付費或信用卡，但要給 email 才能完全照著做；很後面會做 whiteboarding，用作者最愛的 tlDraw，用 Google 帳號登入即可。
- `#L72-L79` — 設定完成；遇到問題去 Discord 發問，作者可能據此推出修正並寫進下方的 troubleshooting 區塊，遇到狀況先查那裡。
