---
source: sources/real-engineer/20261116/course/080 Splitting Build From Review Solution.en.txt
source_type: text
source_lines: 111
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 對 draft PR 貼上 `agent:review`，就啟動第二個 workflow；程式在 `agent-review.yaml`，結構與 implementer 相同，只換 prompt。
- Review prompt 要求：用 code review skill、讓人類 reviewer 幾乎沒事可做、能修的都修在 branch 上。
- Sandcastle 的 handlebars 讓 prompt 參數化（baseRef、branch、prNumber）；`output.object` 讓 agent 回傳符合 schema 的結構化輸出。
- 未修的 finding 會變成檔案／行號的 inline comment：schema 就是 GitHub 需要的 path、line、body。
- Review 抓到的問題：route 自己查了 module 該擁有的資料、輸入沒走 Zod 而用 Number coercion、用 lint exemption 偷懶、新增 deep module 卻沒測試、server module 依賴 UI component。
- Review 也抓到兩個 state bug（lesson A 草稿留在 lesson B、儲存覆蓋他人筆記），證明它會重新驅動軟體驗證 implementer 的改動。
- Review 另外列出「這次想要但找不到的規則」，等於邊審邊 retro；並留下一個含測試與 Zod 修正的 commit。
- 結論：用自家 code review 工具審自家 PR 可行，但不完美，下一節要改進。

# L2 detail

- `#L1-L6` — 對 draft PR 貼上 `agent:review`，action 隨即啟動。
- `#L7-L13` — 程式在 `agent-review.yaml`，與 implementer 幾乎相同、只換 prompt；`review/prompt.md` 要求用 code review skill 審查、把人類 reviewer 的工作降到最低、能修的 finding 全部修在 branch 上；handlebars 是 Sandcastle 專屬語法，`baseRef`、`branch`、`PR number` 以 prompt args 傳入，實現參數化 prompt。
- `#L14-L26` — 未修的 finding 會成為該檔案與行號的 inline comment，並以結構化輸出索取；這是 Sandcastle 的 `output.object`，要求 agent 回傳帶特定 schema 的 XML tag（路徑、行號、內容），正好是 GitHub 產生 inline comment 所需；程式比前一個複雜，對 `output.object` 加了錯誤處理；同樣允許附截圖。
- `#L27-L34` — Review 完成後 agent 送出 comments tag 與 JSON 清單；PR 上有原本的 summary 加一大段 review 留言，內容頗嚴重，部分已修好。
- `#L35-L47` — 已修的 finding：route 不該查 module 擁有的資料（原本用 `db.select` 而非 `getQuizForLesson`）；未受信任輸入沒有 schema，只用 `Number` coercion，現在改走 Zod；linter 上偷懶，直接加 lint exemption 而非拆函式（max lines per function），而新檔案從一開始就掛在「本該清空」的豁免清單上——等於 reviewer 在指責 implementer。
- `#L48-L58` — 作者自己也看到的問題：新的 lesson viewer「deep module」有四個 entry point 轉出 17 個 thin query、沒有 test 資料夾，其實不算 deep module；還有重複程式碼、server module 依賴 UI component、重複樣式；spec 變更段落指出 ticket 有達成，但約 90% 的 diff 是未被要求的重構。
- `#L59-L67` — 兩個 state bug（皆已修）：notes 框留著上一課的文字，這是典型 React bug，PR 把 textarea 改成 controlled，按 prev/next 或側欄連結後 lesson A 的草稿留在 lesson B，一次儲存就覆蓋 B 的筆記，未儲存變更在儲存後也未清除；這代表 review 真的去操作軟體、重新驗證 implementer 的成果。
- `#L68-L84` — 未修的留下項：scope creep（root 拆分，這個 PR 其實該拆成兩個）、未被要求的行為（字數計數器、unsaved changes 狀態、client-side save gating、textarea 從六行變四行、last edited 改成 saved——都無害但沒人要求）；最精彩的是「這次 review 想要卻找不到的規則」：新檔案不得加入 lint 豁免清單、新 module 必須附測試、module 必須把 database 當參數傳入、controlled 表單欄位要以它編輯的實體為 key。
- `#L85-L111` — 下方的檔案 inline comment 大多只是重述上面內容；review 另外產生一個 commit，可在 files changed → commits 檢視：lesson notes 元件加上 key、修復 client 與 server 草稿文字同步、補了幾個測試、新增 `getQuizForLesson` 取代直接 `db`、指出 module 沒測試、scope creep、補上 Zod schema 讓 quizId 走 Zod 而非 `Number`；結論是用自家 code review 工具審自家 PR 可行，但作者不認為是完美 review，仍有改進空間，留待下一節處理。
