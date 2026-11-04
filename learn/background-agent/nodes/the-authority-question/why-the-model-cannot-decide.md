# 它不該知道自己需要批准

四層權威裡，最容易被搞混的是模型和 harness。在設計具備執行能力的 AI Agent 時，許多人最直覺的安全防線，往往是在提示詞（prompt）裡加上一句話：「如果你要做危險操作，請先詢問人類批准。」

這種做法看似合情合理，但在實務上卻極為脆弱。把「這件事要不要問人」的判斷責任丟給大型語言模型（LLM），就等於把系統的安全邊界押在一個天生帶有隨機性與幻覺特質的模型上。

### 為什麼不能讓模型決定何時求助？

語言模型會產生幻覺。既然它在一般事實、推論或工具調用時都會產生幻覺，為什麼在判斷「此時此刻需不需要人類批准」時就不會出錯？

<!--image:1-->

一旦規則寫在提示詞裡，模型總有幾次會自我感覺良好，認為當前情境完全吻合例外條件，或者誤把破壞性操作當成安全操作，從而略過詢問直接執行。

更棘手的是，當模型「知道」某些工具有人類審批門檻時，它的決策行為會被扭曲。模型可能會在推論時展現意想不到的「小聰明」：它知道選了這項需要人工確認的工具會卡關很久，為了儘早完成交付，它可能會退而求其次選擇繞道，挑選其他不合適甚至更危險的方法；甚至在事後找出一套看似合理的藉口，辯稱「我評估過這裡不需要詢問，原因如下」。

因此，安全的 Agent 設計原則不是「教它何時該問人」，而是**完全不讓它知道某個動作需要被批准**。它只需要專注在當前情境下，挑選出它認為最合理的行動。至於該行動是否需要暫停並等待人工確認，完全是外層控制框架（harness）的責任。

### 確定性與不確定性的職責分離

要構建穩定的背景 Agent，必須清楚劃分「模型該做什麼」與「控制框架該做什麼」：

<!--image:2-->

- **不確定性工作（交給 LLM）**：處理模糊、需要智慧與理解的情境。例如分析當前的系統狀態、解讀日誌、從多種可能的處置方案中挑出當前最合理的一步。
- **確定性工作（交給 Harness）**：執行規則明確、絕對不允許妥協的安全策略。例如工具權限管控、狀態機轉換、在變更系統前攔截執行並發起人工審批。

在外層控制框架的設計中，通常會把所有具備修改性（mutative）、寫入權限的操作，一律放在確定性審批策略之後。Agent 照常發出它想執行的動作指令，控制框架攔截該指令後，在同一個執行循環（loop）內暫停並等待操作員核准，審批通過後再繼續推進，而不是讓 Agent 自行中斷後開一個新循環。

在提示詞的設計上，系統只需要明確告知 Agent：它負責提案，而執行政策由外層框架控制。

<!-- source: sources/background-agent/20261105/server/agent-brain.ts#L1-L51 -->

```typescript
import 'dotenv/config'
import { openai } from '@ai-sdk/openai'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { ACTIONS, type ActionName } from '../shared/types'
import type { AgentState } from './agent-data'

const decisionSchema = z.object({
  action: z.enum(ACTIONS),
  reason: z.string(),
  detail: z.string(),
})

type Decision = { action: ActionName; reason: string; detail: string }

function model() {
  const id = process.env.OPENAI_MODEL
  if (!process.env.OPENAI_API_KEY || !id) {
    throw new Error('Set OPENAI_API_KEY and OPENAI_MODEL in .env before starting an agent run')
  }
  return openai(id)
}

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

export async function writeReport(goal: string, state: AgentState): Promise<string> {
  const result = await generateText({
    model: model(),
    system:
      'Write a brief factual incident report. Include evidence, actions, recovery verification, and any unresolved risk. Do not invent facts.',
    prompt: `Goal: ${goal}\n\nFinal state and history:\n${JSON.stringify(state, null, 2)}`,
  })
  return result.text
}
```

在這個設計中，系統提示詞明確規範了邊界：「選擇你認為有充分理由的操作，控制框架會在執行前套用自己的政策」（Choose the service action you think is justified; the harness applies its own policy before execution）。Agent 不必承擔權限守門員的心理負擔，也不會因為規避審批而扭曲推論路徑。

### 審批不是萬能盾牌

將審批權限收回控制框架，能徹底消除「模型漏問」的風險，但這並不意味著系統就此絕對安全。

審批機制只能確保動作執行前經過人眼檢驗，無法保證模型提議該動作的推論過程毫無瑕疵。舉例來說，Agent 即使只是讀取未經信任的應用程式日誌，也可能被日誌中的惡意內容或誤導資訊污染，進而提出看似合理、實則有害的修復提案。如果審批的操作員未加細察便放行，事故依然會發生。

<!--image:3-->

因此，將安全策略收攏至確定性框架只是第一步，盡可能縮小工具的變更範圍、降低單一操作的風險半徑，才是讓系統在自主運作與人機協作之間保持穩健的根本做法。
