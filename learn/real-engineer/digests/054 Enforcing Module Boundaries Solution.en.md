---
source: sources/real-engineer/20261116/course/054 Enforcing Module Boundaries Solution.en.txt
source_type: text
source_lines: 93
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L202
  - cohort-005-project.6.part.md#L1-L75
---

# L1 overview

- skill 建立 `dependency-cruiser.cjs`、安裝 dependency-cruiser，並留下一個範例 module（`toSlug` 藏在 `lib/`、只經 `index.ts` 匯出）供 agent 參考形狀。
- Instructor Analytics 被搬進 `modules/instructor-analytics`：`index.server.ts` 匯出型別與 `createInstructorAnalytics`，並刻意設計成 loader 不會把 database 打進 client bundle。
- 執行 `npm run lint:boundaries` 驗證：正常情況零違規；從外部 import `lib/` 的私有 `parseID` 會報錯。
- 關鍵發現：module 自己的測試也不能從 `lib/` 抓 `parseID`，必須經 entry point——這堵死了 agent 寫 tautological／implementation-detail 測試的路，補上本節長久未解的缺口。
- 還需補一條「Instructor Analytics root 不得 import db」的規則；規則由 name、描述與 from/to 路徑 regex 組成，作者刻意保守只鎖這個 root。
- 兩道防線：`lint:boundaries` 併入 `npm run check` 與 `AGENTS.md`，另在 `coding standards` 增列說明，因為 agent 很容易把檢查註解掉來作弊。

# L2 detail

- `#L1-L11` — 執行結果：建立 `dependency-cruiser.cjs`、在 `package.json` 安裝 dependency-cruiser，並建立一個示範 module（`toSlug` 放在 `lib/`，`index.ts` 為唯一入口）。作者認為這個範例對 agent 很有用，因為它展示了應有的形狀；同時 agent 已完成 Instructor Analytics 的搬移。
- `#L12-L22` — 新結構：`modules/instructor-analytics/index.server.ts` 匯出若干型別（作者稱讚）與 `createInstructorAnalytics`（收 database）以及取得資料的 get 函式；甚至設計成 loader 不會把 database 拉進 client bundle。原本的 root 已無法 import `db`，改為 `InstructorAnalytics.getViewer(URLSearchParams, newDate)`。
- `#L23-L34` — 強制機制怎麼跑：`package.json` 新增 `lint:boundaries`: `depcruise app`。跑 `npm run lint:boundaries` 顯示 no dependency violations。接著故意破壞：在 Instructor Analytics 的 `lib/`（本應完全私有）匯出 `parseID`，再從 root import 並呼叫 `parseID("foobar")`；重跑 lint 就報錯——app 不得伸手進 `lib/`。
- `#L35-L49` — 更關鍵的實驗：在 module 自己的測試檔 `instructorAnalytics.test.ts` 裡 import `parseID` 是否允許？答案是不允許——重跑後出現兩個違規。也就是測試必須經 entry point，不能把 interface 後的實作細節挖出來玩耍。這關閉了本節懸而未決的問題「如何阻止 agent 寫爛測試」：測試唯一能 import 的只有 `createInstructorAnalytics`。作者說發現這點時非常爽，因為整類典型 agent 錯誤都變難了。
- `#L50-L67` — 但還差一步：在 Instructor Analytics root 仍可 import `db`，而且因為其他違規都被清掉，這個壞 import 不再被警告。作者指出這本該是 error，否則 module 很容易再次變淺；於是要求 agent 補規則。config 中每條規則有 name（如「Instructor Analytics root no db」）、說明（該 root 只能經 module 取資料，絕不自己查），以及 from／to 的 regex。作者說這裡保守地只鎖這個 root，未來可擴大到所有 routes 只能 import deep modules，但現在不做，因為那會是大工程。
- `#L68-L93` — 補上規則後，故意留下的違規立刻被抓，移除後恢復通過。`lint:boundaries` 也被寫進 `AGENTS.md` 並加入 `npm run check`，成為 agent 每次 commit 都會跑的標準測試。最後把 automated review 也納入：因為 agent 很容易把檢查註解掉來規避，所以在 `coding standards.md` 增列一條作第二道防線，讓 checks 與 review 一起運作。結論：日後把功能重構成 deep module 時，agent 很難再把它 revert 或作弊。
