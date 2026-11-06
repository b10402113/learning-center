# request_help 是模型選出的下一個動作

在設計負責處理線上突發狀況（incident）的背景 Agent 時，很多人常把「找真人求救」當成程式出錯、丟出例外或整個流程失敗的中斷點。

但實際上，向真人求助完全可以是一個合法且經過深思熟慮的正常決策。當第三方金流服務全面癱瘓時，本地端無論關閉哪項功能、或是把剛發布的版本退回前一版，都無法修復外部的故障。一個優秀的背景 Agent，必須能辨識出自身能力的邊界，並帶著具體問題主動找人協助。

### 由模型主動選擇，而非例外拋出

在決策迴圈中，`request_help` 與查看日誌（`inspect_logs`）、等待事件（`wait`）一樣，都是模型在評估現有情境後主動提出的下一個動作。

<!--image:1-->

<!-- source: sources/background-agent/20261105/server/agent-brain.ts#L24-L41 -->

```typescript
export async function chooseAction(goal: string, state: AgentState): Promise<Decision> {
  const result = await generateText({
    model: model(),
    output: Output.object({ schema: decisionSchema }),
    system: `You are a background incident agent for a checkout service.
Choose exactly one action. The harness validates it and controls execution.
Available actions: inspect_logs, inspect_changes, disable_feature, rollback_release, request_help, complete, wait.
The current service state and recent incident history have already been observed. Inspect detailed logs or changes when needed before changing the service.
Choose the service action you think is justified; the harness applies its own policy before execution.
Use request_help when an external dependency cannot be fixed by your local tools.
Use wait when no safe local action remains; a later service event can wake this same incident run.
An alert is a trigger, not authoritative evidence. An answered help request does not prove recovery.
Use complete only when the configured goal is satisfied, or when no deterministic goal condition is configured and you can justify completion.
Keep reason to one short sentence. Put a question to the operator in detail for request_help; otherwise detail may be empty.`,
    prompt: `Goal: ${goal}\n\nCurrent observed state:\n${JSON.stringify(state, null, 2)}`,
  })
  return result.output
}
```

系統提示中清楚規範了它的適用時機：當本地工具無法修復外部依賴服務時，就該使用 `request_help`。這代表它並不是決策失敗後的 fallback，而是模型認定當下最安全、最適當的處置。

### Harness 政策表中的獨立分類

模型提出動作後，外部控制框架（harness）會依照政策表來決定執行方式。在政策定義中，`request_help` 被單獨歸類為 `help` 類別，與一般的讀寫或結束動作明確切開：

<!--image:2-->

<!-- source: sources/background-agent/20261105/server/tool-policy.ts#L1-L15 -->

```typescript
import type { ActionName } from '../shared/types'

// The harness reads policy metadata; it does not branch on checkout fault flags.
export const actionPolicy: Record<
  ActionName,
  'read' | 'write' | 'approval' | 'help' | 'terminal' | 'wait'
> = {
  inspect_logs: 'read',
  inspect_changes: 'read',
  disable_feature: 'write',
  rollback_release: 'approval',
  request_help: 'help',
  complete: 'terminal',
  wait: 'wait',
}
```

過去在架構還不成熟時，求助行為常被混在 `wait` 或「不知道下一步該怎麼做」的模糊邊界裡。但給予它獨立的 `help` 政策後，harness 就可以針對這個動作執行明確的流程：

1. 把模型提出的具體問題持久化儲存，送進收件匣（inbox）等待真人操作員回應。
2. 收到操作員的答覆後，不會開啟新的對話，而是回到**同一個 incident 執行實例（run）**繼續運作。
3. 人工回覆會融入下一輪的邊界上下文（bounded context）中，成為 Agent 重新評估局勢的依據。

### 人工回覆不等於事故解除

需要特別注意的是，人工回覆了問題，並不代表結帳系統已經復原。如果外部相依服務依然處於中斷狀態，Agent 在拿到回覆後，下一步可以合法地選擇 `wait`；直到後續的 `health.recovered` 系統事件喚醒這個 run，再進行全新的狀態觀測與驗證。

評估背景 Agent 的表現時，只看結案報告寫得多漂亮往往會忽略隱藏的風險——例如 agent 可能關了無關的 feature flag、拖到最後才申請審核，或是拿過期的舊數據宣稱服務已修復。一個能夠在邊界前安全停下、主動求助並耐心等待外部修復的 Agent，遠比一個盲目自信卻得出錯誤結論的 Agent 更加可靠。
