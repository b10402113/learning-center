---
source: sources/real-engineer/20261116/course/078 Your First Implementer Solution.en.txt
source_type: text
source_lines: 83
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 貼上 `agent implement` 後 action 啟動，並額外貼上 `agent in progress`，讓同時跑很多 issue 時看得出狀態。
- Workflow 檔是 `.github/workflows/agent-implement.yaml`，步驟依序為轉換 label、裝 Node 22、裝依賴、裝 Claude Code、migrate/seed DB、讀 ticket、build ticket。
- 真正跑 agent 的是 `npx tsx implement.ts`：呼叫 `Sandcastle.run`，傳入 Claude agent 與旁邊的 prompt file。
- Prompt 很短：在現有 branch 用 git commit、不要用 `--no-verify`、不要碰 `.github`、至少留下一個 commit，push 與開 PR 由 workflow 負責。
- Prompt 要求在 UI 有變化時截 before/after PNG 到 `temp evidence`，workflow 上傳後 PR 就能直接看圖審查。
- Agent 會撞上 repo 的 automated checks（token 上限、mutation test），然後自己拆小重構，甚至做得比人多一輪瀏覽器驗證。
- 一個很小的 issue 變成 22 個檔案的改動：PR 有 before/after 證據、標為 two-way door、blast radius 僅限 lesson page，等於第一個 accelerator。

# L2 detail

- `#L1-L8` — 貼上 `agent implement` 後 action 啟動；另有一個 quality of life 設計：在原 issue 貼上 `agent in progress`，同時跑多個 issue 時一眼看出狀態。
- `#L9-L17` — 點進 implement job 可看到逐步執行與 tool calls（例如「I'm reading the lesson page notes section」）；看到這裡代表環境正常。
- `#L18-L31` — Workflow 定義在 `.github/workflows/agent-implement.yaml`，步驟為：轉換 label、設定 Node.js 22、安裝依賴、安裝 Claude Code、migrate 與 seed 資料庫、讀 ticket，最後用 `npx tsx` 執行 build ticket——這一步最重要。
- `#L32-L38` — `implement.ts` 呼叫 `Sandcastle.run`，傳入 Claude agent 與緊鄰的 prompt file；prompt 很短：在當前 branch 用 git commit、不要 `--no-verify`、不動 `.github`、至少留一個 commit 收尾，push 與開 PR 交給 workflow。
- `#L39-L49` — Prompt 特別要求：UI 有變化時把 before/after 截圖存成 PNG 放進 `temp evidence`，後續 workflow 會上傳讓 issue 引用，因此 PR 不用拉下來跑就能審；即使是遠端執行，agent 仍能存取它需要的資料源以維持回饋迴圈與品質。
- `#L50-L59` — 因為 agent 會 commit，就會撞上 automated checks：檔案超過上限、跑 `npm run test:mutation` 全數通過、token hook 又逼它繼續拆小；作者習慣比較「如果是自己會不會做到這樣」，發現 agent 在重構後還多做一輪瀏覽器驗證，這正是對 agent 建立信心的訊號。
- `#L60-L81` — 一連串收尾動作：issue 上留言並連結 action run、建立 PR（標題取自 issue，可再改進）、PR 有 summary 與證據；before 是只有本人可見的 your notes，after 整合進 questions/discussion 並顯示字數與儲存時間；改動標為 two-way door、blast radius 僅 lesson page，共動了 22 個檔案，把過大的 lesson 元件拆成獨立檔案，還新增 `app modules` 的 lesson viewer（無測試的 deep module）。
- `#L82-L83` — 一個很小的 issue 被轉成一大組可決定是否 merge 的程式改動；工廠快了一點，這是第一個 accelerator。
