---
source: sources/agent-harness2/20261029/8-implementing-durable-execution.txt
source_type: text
source_lines: 372
supplements:
  - harness-engineering.1.part.md#L1-L39
  - harness-engineering.1.part.md#L1-L29
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 安裝 `@dbos-inc/dbos-sdk`、Drizzle、Postgres，建立 harness 內的 `db.ts`。
- 用 `pgTable` 定義 `event_log`：`seq` 當 primary key 提供順序與去重依據，`data` 用 `jsonb` 存 `AgentEvent`。
- `ensureSchema` 以 `create table if not exists` 做 runtime migration，避免初次啟動就爆錯。
- 把原本在 server 的 in-memory bus 搬到 harness，改成寫入 Postgres 的 durable bus。
- `emit` 先 insert 進 DB、確認落地後才通知 listeners；`history` 依 `seq` 排序回傳，供重連時 replay。
- bus 不再需要 class 保存狀態，只留 `subscribe`、`emit`、`history` 三個函式。

# L2 detail

- `#L1-L9` — 安裝三個依賴：DBOS SDK、Drizzle ORM、Postgres driver。
- `#L10-L27` — 這只是 harness 的基礎資料庫設定，不複雜；Drizzle 視為操作資料庫的 SDK。
- `#L28-L51` — `db.ts` 的 imports：`drizzle-orm/postgres-js`、`postgres`，以及 `pg-core` 的 `pgTable`、`bigserial`、`jsonb`。
- `#L52-L77` — 從 `process.env.DATABASE_URL` 取連線字串，缺少就直接 throw，作為啟動前的 sanity check。
- `#L78-L97` — 建立 `client = postgres(url, { max: 5 })`，再 `export const db = drizzle(client)` 供 app 使用。
- `#L98-L127` — 定義 `event_log` 表；`seq` 是 `bigserial` 兼 primary key，用來維持事件順序、支援 replay 與 de-dupe。
- `#L128-L155` — `data` 是 `jsonb`，可掛 TypeScript generic 標成 `AgentEvent`；這只影響編輯器體驗，資料庫看到的就是普通 JSON。
- `#L156-L182` — `ensureSchema` 用 template tag 寫原生 SQL `create table if not exists`，等於啟動時自動補 migration。
- `#L183-L210` — 這套 schema 與 agent 無關，是任何用資料庫的 app 都會做的事；接著把 bus 從 server 移到 harness 並修正 import。
- `#L211-L243` — bus 必須持久化事件而非留在記憶體，才能在重啟後 replay；因此移除保存狀態的 class，只留三個函式。
- `#L244-L292` — `listeners` 集合；`subscribe` 加入 listener 並回傳 cleanup 函式（類似 useEffect 的 cleanup），避免 memory leak。
- `#L293-L320` — `emit` 是 async，組出帶隨機 `id` 與 `timestamp` 的 `AgentEvent`。
- `#L321-L356` — 先把事件 insert 進 `event_log`，確認寫入成功後才逐一通知 listeners；同時處理 TypeScript 型別錯誤。
- `#L357-L372` — `history` 從 `event_log` 依 `seq` 排序取出所有資料列，map 成 `AgentEvent` 陣列供 replay。
