---
source: sources/agent-harness/20260915/8-implementing-durable-execution.txt
source_type: text
source_lines: 372
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- Harness 需要一個 database 層：安裝 DBOS SDK、Drizzle ORM 與 postgres driver，建立 `db.ts`。
- `db.ts` 的三件事：讀取 `DATABASE_URL`、建立 client 與 Drizzle 實例、確保 event log 資料表存在。
- event log schema 以 `seq`（bigserial）當主鍵，負責事件的排序與去重；`data` 用 `jsonb` 存事件 payload。
- `data` 上的 `AgentEvent` 泛型只是編輯器體驗，資料庫看到的仍是普通 JSON，不影響寫入格式。
- 用 template tag 寫 `CREATE TABLE IF NOT EXISTS` 當作簡易的 runtime migration，避免第一次啟動就炸。
- 這整套資料庫設定與 agent 無關，任何需要持久化的應用都長得一樣，重點在理解 schema 如何對應型別。
- in-memory bus 搬到 harness 並拆掉 class，只留 `subscribe`、`emit`、`history` 三個函式。
- `subscribe` 回傳 cleanup 函式（類似 useEffect 的 cleanup），否則 listener 會累積成 memory leak。
- `emit` 的順序是關鍵：先寫入資料庫、確認成功後才 fan-out 給所有 listener，保證事件不會只在記憶體裡閃現。
- `history` 依 `seq` 排序讀回所有事件，供重啟後 replay。

# L2 detail

- `#L1-L19` — 安裝 DBOS SDK、Drizzle 與 postgres，並在 harness 目錄新增 `db.ts`，定位成 harness 的基礎設施而非業務邏輯。
- `#L20-L77` — 匯入 Drizzle、postgres、`pgTable`/`bigserial`/`jsonb` 與 `AgentEvent` 型別；讀 `DATABASE_URL` 並在缺少時主動丟錯，作為最早的 sanity check。
- `#L78-L98` — 建立 postgres client（`max: 5`）與 Drizzle 實例並匯出 `db`，示範「ORM 就是資料庫的 SDK」這個心智模型。
- `#L99-L155` — 設計 `event_log` 表：`seq` 主鍵提供順序、replay 與去重能力，`data` 用 `jsonb` 存 payload；泛型型別純粹是 DX，不改變資料庫中的 JSON。
- `#L156-L194` — 用 template tag 直接寫 SQL `create table if not exists` 當 runtime migration，並強調這段資料庫工作與 agent 無關，是可複用的樣板。
- `#L195-L243` — 把 bus 從 server 移到 harness，移除保存狀態的 class，只保留 `subscribe`/`emit`/`history` 三個函式與 listeners 集合。
- `#L244-L293` — 實作 `subscribe`：加入 listener 並回傳移除該 listener 的 cleanup 函式，用 useEffect cleanup 類比說明不清理會造成 memory leak。
- `#L294-L356` — 實作 `emit`：組出帶 id 與 timestamp 的 event，先 `insert` 進 event log，寫入成功後才逐一通知 listener——「先落地，再廣播」。
- `#L357-L372` — 實作 `history`：以 `seq` 排序 select 全部事件，map 出 `data` 欄位，作為重啟後 replay 的來源。
