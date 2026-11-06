# 永遠推導出同一個 action ID

效果擁有者要靠 actionId 認出重複，那麼這個 ID 就必須在重播時穩定不變。當背景工作流程執行到一半遇到網路逾時或服務異常，工作流程引擎會自動重試步驟。如果每次發送請求時都隨機產生一組 UUID 作為識別碼，重試就會被外部系統視為「一筆全新的請求」，進而造成重複扣款、重複建立資源或狀態衝突。

要解決這個問題，識別碼就不能代表單次的 HTTP 嘗試（attempt），而必須代表工作流程在該輪決策中的「單一意圖」（intent）。

### 從隨機 UUID 改為確定性推導

隨機產生的 UUID 具有不確定性（non-deterministic），只要程式重新執行一次，產生的值就完全不同。

如果改用工作流程本身已有的上下文——哪一次執行（`runId`）、第幾輪決策循環（`cycle`），以及選擇了哪一個動作（`decision.action`）——就能組合出完全具備確定性（deterministic）的動作識別碼。不論這一步驟因為錯誤被重放（replay）或重試多少次，推導出來的永遠都會是同一個識別碼：

<!--image:1-->

<!-- source: sources/background-agent/20261105/lessons/05-safe-retries/index.md#L61-L69 -->

```diff
         return { report }
       }

-      // An attempt-local ID is intentionally unsafe when a response is lost.
-      const actionId = `${runId}:${randomUUID()}`
+      const actionId = `${runId}:${cycle}:${decision.action}`
       const policy = actionPolicy[decision.action]
       if (policy === 'approval') {
         const input = { expectedVersion: state.world.version }
```

在實際工作流程的決策環節中，這個推導邏輯讓後續的政策檢查與輸入準備都能綁定同一個意圖：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L141-L147 -->

```typescript
      const actionId = `${runId}:${cycle}:${decision.action}`
      const policy = actionPolicy[decision.action]
      if (policy === 'approval' || policy === 'help') {
        const input =
          policy === 'help'
            ? { question: decision.detail }
            : { expectedVersion: state.world.version }
```

### 在執行步驟中傳遞意圖鍵

推導出穩定的 `actionId` 後，可以直接傳入執行步驟：

<!--image:2-->

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L187-L195 -->

```typescript
      const result = await step.run(`execute-action-${cycle}`, () =>
        executeAction(
          environmentId,
          runId,
          actionId,
          decision.action,
          policy === 'read' ? undefined : state.world.version,
        ),
      )
```

這樣設計帶來了幾個關鍵好處：

1. **外部 API 冪等鍵映射**：可直接將這個 `actionId` 對應到第三方支付或部署服務的冪等鍵（idempotency key）。當網路斷線、客戶端重試時，第三方系統能透過同一個鍵值辨識出這是重複請求，直接回傳上一次的結果，而不是重複執行。如果外部服務不支援冪等鍵，在重試前就需要先透過查詢進行對帳（reconciliation query）。
2. **便於依執行歷程檢索**：因為識別碼以 `${runId}:` 為前綴，資料庫查詢能輕鬆抓出該次執行所觸發的所有動作紀錄：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L73-L78 -->

```typescript
    db
      .select()
      .from(actions)
      .where(like(actions.id, `${runId}:%`))
      .orderBy(desc(actions.createdAt))
      .limit(8),
```

識別碼的核心任務是標記「你想做什麼」，而不是「你連線嘗試了幾次」。只要讓同一個執行輪次的同一個決策始終推導出相同的 `actionId`，系統就能在遭遇故障與重播時，安全地重建出完全一致的意圖鍵。
