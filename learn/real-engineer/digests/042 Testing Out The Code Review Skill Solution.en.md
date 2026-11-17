---
source: sources/real-engineer/20261116/course/042 Testing Out The Code Review Skill Solution.en.txt
source_type: text
source_lines: 89
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L89
---

# L1 overview

- 實跑：agent 先定位 fixed point（main，即 PR base），再把 standards review 與 spec review 丟成背景 agent 並行。
- 兩份報告回來後立刻動手修，展現「make it good」階段的主動性，不把決策丟回給人。
- Standards 報告抓到：缺 lesson 時回傳錯誤而非 throw、用了 learner 但 glossary 要 student、違反 glossary 對 note 私密的定義、十幾處註解與旁邊程式矛盾。
- 判斷題（judgment calls）：save.tsx 重複程式、saved 的 N+1 查詢、root 檔內 bookmarks/notes 邏輯無測試、`data clumps`；後者是 skill 內建、源自 Martin Fowler《Refactoring》的 code smell。
- Spec 報告分三類：未滿足的 user story（最後編輯時間、note 位置）、spec 沒要求的東西（instructor student notes）、做錯的地方（上限 5000 而非 2000、未檢查 content access）。
- 人只對判斷題表示同意、對 foreign key `on delete no action` 提問，agent 另外改寫 PR body。
- 修完後 evidence 變強、驗證邏輯以 pseudocode 呈現；Merge Danger 仍是 one-way、blast radius 仍是 privacy，但講師與管理員已讀不到筆記內容，風險明顯降低。

# L2 detail

- `#L1-L10` — 起跑：agent 先辨識 fixed point（此例為 main，即 PR base），再以背景 agent 並行啟動 standards review 與 spec review；兩份報告很快回來，隨即進入修正，作者強調這正是「make it good」階段的主動性，不把決定推給人類。
- `#L11-L21` — Standards 報告內容：多處違反 repo 文件化規則——缺 lesson 時回傳 error 而非 throw，違反 `CODING_STANDARDS.md` 的回應規則；用 learner 而 glossary 要求 student；違反 glossary 對 note 的定義（筆記應私人，卻也顯示給講師）；另有約十幾處註解與旁邊程式碼互相矛盾。
- `#L22-L33` — 判斷題與其來源：save.tsx 有重複程式、saved 有 N+1 查詢、bookmarks/notes 邏輯放在 root 檔且無測試、以及所謂 `data clumps`（inline body 與 updated at 型別宣告在兩處）；`data clumps` 是 skill 內建的通用 code smell，多數取自 Martin Fowler 的《Refactoring》，所以即使沒有 `CODING_STANDARDS.md` 也能抓到東西。
- `#L34-L47` — 作者授權 agent 自行判斷處理這些標準類判斷題；接著看 spec 缺口：引用未在 diff 實現的 user story（lesson 頁從未顯示筆記最後編輯時間、notebook 放在 lesson 內容下而非影片下）；也指出 spec 未要求卻實作的 instructor student notes、以及做錯的部分（上限應 5000 而非 2000、兩個 action 都沒檢查 content access，任何登入者都能對任何 lesson 加書籤或筆記），並描述它新增模組、測試、lesson route 改呼叫 require content access。
- `#L48-L60` — 底部決策清單：作者同意 agent 對「儲存空白筆記」的處理，請它更新 PR 描述，並針對 `on delete no action` 的 foreign key 提問表達不確定、需要討論；agent 一邊回答一邊修其他已同意的項目，並改寫 PR 描述（過程中動用了 PR skill）。
- `#L61-L77` — agent 建議 foreign key 維持現狀，作者同意並請它推上 PR；它順口問要不要開 follow-up issue（作者說不用，但指出 code review 是發現 follow-up 需求的好時機）；修正後 PR body 被細緻改寫，save note 的驗證邏輯以 pseudocode 呈現（trim、空則拒絕、超過 2000 字拒絕、衝突則替換 body 並更新 updated at），evidence 也變豐富，開始實際執行測試。
- `#L78-L89` — Merge Danger 檢查：仍是 one-way door、blast radius 仍是 privacy，但講師與平台管理員已無法讀取筆記內容，風險低於原本（原本宣稱私人卻不私人）；作者總結 proper automated review 能在人工之前大幅提升 PR 品質，靠的是同時對照 spec 與 standards，並預告還沒真正點進 files changed 做人工審查。
