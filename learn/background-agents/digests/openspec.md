---
source: sources/background-agents/20261027/openspec
source_type: codebase
source_lines: 423
language: Markdown, YAML
file_count: 21
status: skipped
skip_reason: "not taught by any current node"
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **`config.yaml`** — OpenSpec 的 spec-driven 專案設定骨架，目前只宣告 `schema: spec-driven`，其餘 context、per-artifact rules、operations guidance 都是註解範例。重點是「專案層規則應該放在這裡，而不是散落在每個 change」。
- **`build-incident-lab`** — 建立可重複的本地事故環境：三個 preset（feature rollout、faulty release、upstream outage）、四路由 operator app、有限事件計畫、權威 observation 與帶 `actionId` 的 operation API。設計上刻意把 lab server 與 agent endpoint 拆成兩個 process，讓「只重啟 agent」的 demo 成立。
- **`build-durable-agent`** — 把 goal 驅動的 incident run 做成 durable：模型一次只選一個結構化 action，harness 負責取狀態、記錄選擇、套用上限與執行；狀態讀取、模型呼叫、工具呼叫、報告各自是具名 Inngest step，等待用事件 correlation，完成條件由 harness 而非模型決定。
- **`add-supervision-and-recovery`** — 補上人與失敗路徑：rollback 與求助都先 persist proposal 再等 correlated decision，核准後重驗 release；action 用 run/cycle/action 推導的穩定 ID 做交易式去重；模擬器可「提交後回 503」；help 非終態，仍需外部恢復證據；並加入 cancel 與決策上限。
- **`package-workshop-lessons`** — 把可運作的 app 包成可教學的工作坊：`lesson-1`–`lesson-6` 與 `complete` branch、由相鄰 diff 產生的六頁教材、VitePress 站台、講者用的精確 diff 與防漂移檢查，以及給學員的 catch-up 路徑。

# L2 detail

- `#L1-L32` — openspec/config.yaml — 全域設定。`schema: spec-driven` 決定 change 產物是 proposal / specs / design / tasks；註解示範 `context`（tech stack、慣例、領域知識）、`rules`（例如 proposal 500 字上限、tasks 切 2 小時）、`operations`（apply/archive 的建議行為）。學習重點：OpenSpec 把「專案上下文」與「產物規則」分開，且 rules 只約束對應產物，不會自動變成操作指令。
- `#L33-L34` — openspec/changes/build-incident-lab/.openspec.yaml — change 中介資料：`schema: spec-driven`、`created: 2026-09-28`。由 `openspec new change` 產生，不應手動建立。
- `#L35-L60` — openspec/changes/build-incident-lab/proposal.md — 提案（Why/What Changes/Capabilities/Impact）。理由：學員需要可信、可重複的事故，且 lab 必須在 agent process 重啟時繼續產生事件。變更包含四路由 operator app（inbox、activity、events、simulator）、Neon + Drizzle 持久化、三個 preset、小型 typed HTTP 端點、獨立 agent endpoint scaffold 與本機 Markdown notes。新 capability 為 `incident-lab`，影響 `background-agents/` 下的 app、server/web 原始碼、schema 與 VitePress。
- `#L61-L90` — openspec/changes/build-incident-lab/design.md — 設計與取捨。Goals：simulator 要能在課堂上被看懂、可重置、且與 agent endpoint 解耦；Non-goals：多租戶、部署、任意 webhook、真實分散式追蹤、壓測。七個決策：lab server 與 agent endpoint 分成兩個 Express；Neon + Drizzle 的緊湊 schema（未 claim 的 DB 72 小時到期）；一次只有一個 active scenario；server-side 有限事件計畫（重啟可續、瀏覽器關掉不影響）；remediation 改變領域狀態使健康訊號可重新驗證；React/Vite 四路由並把 activity log 存 Postgres、trace 交給 Inngest；每個 operation 帶 caller-provided action ID 並先存結果。Risks 涵蓋 reset、事件淹沒、環境差異與模型輸出不穩定。
- `#L91-L107` — openspec/changes/build-incident-lab/tasks.md — 實作清單（全部完成）。三組：專案設定（npm scripts、TS/Vite 設定、Neon + Drizzle schema、可重複執行）、事故領域（三個可重置 preset、帶時間戳的 observation 與有限事件計畫、operation 與 action-ID 去重、run/approval/report 資料契約）、教學 UI 與設定（四路由 app、獨立 Inngest endpoint 與 VitePress、啟動與環境文件）。
- `#L108-L158` — openspec/changes/build-incident-lab/specs/incident-lab/spec.md — 能力規格，五個 Requirement 各帶 Scenario：Scenario selection and reset（reset 產生新 instance、保留舊紀錄）、Event generation controls（有限計畫、可停止、關瀏覽器仍持續）、Authoritative observations（observation 反映已套用的 operation 並標時間）、Correlated operations（重複 action ID 回原結果、不產生第二個 effect）、Operator dashboard（四路由、inbox 待處理 badge、activity 串接式 phase feed、simulator 標示生成訊號）、Local course setup（免帳號 Neon、憑證來自 ignored env、agent 重啟不影響 lab）。
- `#L159-L160` — openspec/changes/build-durable-agent/.openspec.yaml — change 中介資料：`schema: spec-driven`、`created: 2026-09-28`。
- `#L161-L184` — openspec/changes/build-durable-agent/proposal.md — 提案。理由：incident lab 需要一個能跨越瀏覽器請求、持有 goal 的 agent，並讓學員看到 model 決策如何變成 durable、可檢視的 step。變更加入一次一動作的 model adapter 與有界 harness loop、持久化 run/decision/observation/action/report、以 Inngest step 包住狀態讀取與工具呼叫、用 correlated event wait 取代 polling。新 capability 為 `durable-incident-agent`，影響 `server/` 與 lab UI。
- `#L185-L199` — openspec/changes/build-durable-agent/design.md — 設計。五個決策：模型以結構化輸出只選一個動作，harness 負責狀態、記錄、邊界與執行；model/tool call 都在具名 step，每個 cycle 有唯一 deterministic ID；`step.waitForEvent` 以 `labId` 匹配，timeout 觸發重新讀狀態，event 只喚醒不取代權威狀態；完成需在最小時間窗內三次新鮮健康觀察，模型選 `complete` 不能繞過；報告只在驗證恢復後產生並與終態一起持久化。取捨：一次一個 active incident、短 timeout 利於 demo、重啟 agent endpoint 時 Inngest Dev Server 必須活著。
- `#L200-L209` — openspec/changes/build-durable-agent/tasks.md — 實作清單（全部完成）。兩組：Harness and state（有界 state hydration、action selection/execution、run history、明確狀態與 report 持久化）、Durability and waiting（具名 step ID 的 checkpoint 與 endpoint 重啟驗證、event correlation 與喚醒後重讀、三次健康觀察的完成條件）。
- `#L210-L242` — openspec/changes/build-durable-agent/specs/durable-incident-agent/spec.md — 能力規格，四個 Requirement：Goal-driven run（run 獨立於瀏覽器、一次一動作）、Durable step boundaries（狀態讀取、模型選擇、工具效果、報告都要 checkpoint）、Event-based waiting（喚醒或 timeout 後重讀；事件暫停時不燒決策）、Harness-controlled completion（三次近期健康觀察，單一健康樣本不得完成）。每個 Requirement 都有對應 Scenario。
- `#L243-L244` — openspec/changes/add-supervision-and-recovery/.openspec.yaml — change 中介資料：`schema: spec-driven`、`created: 2026-09-28`。
- `#L245-L268` — openspec/changes/add-supervision-and-recovery/proposal.md — 提案。理由：背景 agent 沒有人逐步盯著，工作坊必須示範「風險動作需要人工授權」與「durable retry 仍需應用層 idempotency」。變更：persist rollback/help proposal 並暫停等人、補上漏接通知的 reconcile 與拒絕/到期/重驗、加入 cancellation、決策上限、action-ID 去重與 lost-response 模擬控制、支援需要求助且之後外部恢復的上游事故。新 capability 為 `supervised-recovery`，影響 lab operations API、agent workflow、approval storage 與 dashboard。
- `#L269-L284` — openspec/changes/add-supervision-and-recovery/design.md — 設計。六個決策：先 persist proposal 再等，以 proposal ID 關聯 decision event，喚醒後讀存檔狀態，timeout 也 reconcile；拒絕或到期轉 escalated，核准後重讀狀態並丟棄 stale 的核准；action ID 由 run、decision number、action 推導，operations API 在同一交易存結果與 effect，重複 ID 回原結果；simulator 可提交後回 503 一次；help 非終態，回答後仍要等外部恢復事件與健康觀察；Inngest cancellation 與 run-state 檢查在 durable 邊界停止工作，並以決策上限防無限迴圈。取捨：approval 10 分鐘到期、wait 每 10 秒 reconcile、只處理單一 active scenario。
- `#L285-L294` — openspec/changes/add-supervision-and-recovery/tasks.md — 實作清單（全部完成）。兩組：Human control（persist proposal 與 correlated decision、拒絕/到期/版本變更、help-answer 與外部恢復）、Safe execution（穩定 action ID 與交易式去重、UI fault control、cancellation event、決策上限）。
- `#L295-L331` — openspec/changes/add-supervision-and-recovery/specs/supervised-recovery/spec.md — 能力規格，四個 Requirement：Approval before rollback（先 persist 再等、核准後重驗 release；Scenario：endpoint 重啟期間核准仍只執行一次、拒絕則 escalated 且不改）、Idempotent effects（同 action ID 回原結果、只記一次 effect）、Help and external recovery（help 非終態，未恢復不得宣告成功）、Bounded and cancellable run（接受 cancel、達決策上限即停）。這份 spec 是「權限邊界 + 效果邊界」的正式契約。
- `#L332-L333` — openspec/changes/package-workshop-lessons/.openspec.yaml — change 中介資料：`schema: spec-driven`、`created: 2026-09-28`。
- `#L334-L358` — openspec/changes/package-workshop-lessons/proposal.md — 提案。理由：能跑的 final app 不等於能教的工作坊，每課需要可執行起點、適合講台螢幕的精確打字腳本與 catch-up 解答。變更：六個有序 checkpoint、以講者口吻寫的學員教材（先概念再精確 diff 或完整函式）、VitePress 本機站台、排程/ demo /失敗實驗/設定/catch-up 文件、branch-diff 漂移檢查。新 capability 為 `workshop-lessons`，影響 `lesson-1`–`lesson-6` 與 `complete` branch、`lessons/` 六頁、theme、authoring script。
- `#L359-L375` — openspec/changes/package-workshop-lessons/design.md — 設計。七個決策：`lesson-N` 是第 N 課起點、下一個 branch 是解答、`complete` 是第六課解答；starter 已含 UI/simulator/schema/例行 wiring，live edit 只動 harness 與安全政策；新函式用完整 TypeScript、修改用 contextual diff，且由相鄰 branch 實際 diff 產生並有檢查器；同一份 notes 同時服務講者與學員，先講生命週期與設計觀點再給 code，並連到一手文件；VitePress 用獨立 port，diff 換行、複製時去掉刪除行與前綴；每課固定含工程解釋、lab 設定、code、verify、失敗實驗、challenge、catch-up；Node 腳本從 prose + metadata + diff 生成，並有 optional advanced lab。取捨：所有 branch 都放六頁，學員可超前閱讀。
- `#L376-L386` — openspec/changes/package-workshop-lessons/tasks.md — 實作清單（全部完成）。兩組：Checkpoints（starter、六個 lesson branch 與 final solution，且非教學原始碼保持一致、相鄰 diff 只含預期修改）、Teaching material（六頁含精確 code/失敗實驗/catch-up、以講者對學員的口吻重寫概念段並連一手文件、瀏覽器檢查換行、更新 `course.yaml` 與 branch map）。
- `#L387-L423` — openspec/changes/package-workshop-lessons/specs/workshop-lessons/spec.md — 能力規格，四個 Requirement：Ordered lesson checkpoints（`lesson-1`–`lesson-6` + `complete`，`lesson-N+1` 含第 N 課解答；Scenario：學員在第 4 課落後可 stash 後切到 `lesson-5`）、Exact edit notes（每課指出檔案與位置，新函式完整、修改用紅綠 diff；Scenario：小螢幕仍能一格看到脈絡/刪除/新增）、Shared teaching voice（先概念與取捨再 code，至少一個架構主張連到一手研究或技術來源，並含 engineering challenge）、Local notes and rehearsal（本機服務 notes、偵測漂移的指令、標頭不含時間區塊、以具體 setup 開場）。
