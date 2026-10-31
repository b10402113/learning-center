# Investigator 是唯讀的 sub-agent

目前的計畫裡有三個 agent：billing、technical 和 sales，每個 agent 都有自己的目標。真正負責執行這些目標的，是下一個元件——我們稱為 investigator 的唯讀 sub-agent。

Investigator 只負責讀取資料。它不會寄信、不會退款，也不會修改任何紀錄。正是這項限制，讓整套平行處理設計變得安全；而這點也會反映在我們交給它們的工具上。

<!--image:1-->

建置工作先從 `tools` 匯出兩個小元件開始。Investigator 需要 `CHARGES` 和 `searchKB`，因此我們會把它們一併移到新的 `investigators.ts` 檔案裡。

這些 sub-agent 都很輕量。它們使用的工具確實有 `execute` 函式，因此 AI SDK 會在其中直接執行工具迴圈。不過，investigator 本身不會綁定到 DBOS step，而是嵌在更大的 step 裡執行。

這也表示，investigator 不會享有頂層 agent 那種「一等公民」待遇。Scott Moss 說得很直接：它拿不到角落辦公室，只能坐在小隔間裡。由於互動範圍受限，而且是唯讀操作，因此可以安全地重新執行。

這裡還有一個 chaos hook。環境變數 `CHAOS_FAIL` 可以讓指定的 investigator 每次都直接丟出錯誤，讓你觀察某個 sub-agent 掛掉時，整個工作流程如何優雅地降級。我們會在接下來的兩個步驟使用它。

一個 investigator 由兩個部分組成：system prompt 和工具組。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/investigators.ts#L1-L39 -->
```ts
import { generateText, stepCountIs, tool, type ToolSet } from "ai";
import { z } from "zod";
import { model } from "./model";
import { CHARGES, searchKB } from "./tools";

// Sub-agents are read-only INVESTIGATORS. Their tools have `execute`, so the AI
// SDK runs the tool loop inline and each sub-agent is one bounded interaction we
// can run as a single durable step. Read-only → a re-run on recovery is safe.
const getCharges = tool({
  description: "Look up a customer's charges.",
  inputSchema: z.object({ customerId: z.string() }),
  execute: async ({ customerId }) => CHARGES[customerId] ?? [],
});

const searchKnowledgeBase = tool({
  description: "Search the support knowledge base.",
  inputSchema: z.object({ query: z.string() }),
  execute: async ({ query }) => searchKB(query),
});

type Investigator = { systemPrompt: string; tools: ToolSet };

const INVESTIGATORS: Record<string, Investigator> = {
  billing: {
    systemPrompt:
      "You are a billing investigator. Use getCharges to find duplicate or erroneous charges. Report the charge ids, the amount, and the refund you'd recommend — concisely.",
    tools: { getCharges },
  },
  technical: {
    systemPrompt:
      "You are a technical investigator. Use searchKnowledgeBase to find known bugs and workarounds. Report the issue, any ticket, and the workaround — concisely.",
    tools: { searchKnowledgeBase },
  },
  sales: {
    systemPrompt:
      "You are a sales investigator. Use searchKnowledgeBase for pricing guidance, then state the relevant numbers and next step — concisely.",
    tools: { searchKnowledgeBase },
  },
};
```

每個 investigator 都只會拿到一個工具。billing investigator 只有 `getCharges`，沒有其他工具——它真的只能查詢費用。technical investigator 會使用 `searchKnowledgeBase`，查找已知錯誤與解決方式。sales investigator 使用同一個工具，但查詢的內容會指向定價指引。

<!--image:2-->

System prompt 在這裡扮演重要角色。它會告訴每個 agent 應該回報什麼、回答要多精簡，也會替 agent 打氣，讓它相信自己能做好這份工作。一個工具加上一個 prompt，就是 investigator 的完整身分。

接著來看 runner。`runInvestigator` 會接收 agent 名稱與目標，找到對應的 investigator，然後對它執行一次推論。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/investigators.ts#L41-L60 -->
```ts
// Run one investigator over its objective in its OWN context. Returns findings.
export async function runInvestigator(agent: string, objective: string): Promise<string> {
  // A chaos hook so the failure-handling demo is reproducible:
  // CHAOS_FAIL=technical npm run dev  → the technical investigator always fails.
  if (process.env.CHAOS_FAIL === agent) {
    throw new Error(`investigator '${agent}' crashed (CHAOS_FAIL)`);
  }

  const investigator = INVESTIGATORS[agent];
  if (!investigator) throw new Error(`unknown investigator: ${agent}`);

  const { text } = await generateText({
    model,
    system: investigator.systemPrompt,
    prompt: objective,
    tools: investigator.tools,
    stopWhen: stepCountIs(5),
  });
  return text;
}
```

注意，`runInvestigator` 刻意沒有做一件事：建立訊息歷史。因為這裡沒有來回對話。這是一次性的背景推論，所以 system prompt 放進 `system` 欄位，目標則直接放進 `prompt`。

唯一的限制是 `stepCountIs(5)`。Investigator 最多可以執行五輪，接著就會停止並回傳調查結果。五輪足以讓它呼叫工具、讀取結果，但不至於讓它漫無目的地繞遠路。

<!--image:3-->

所以，每個 investigator 都由一個工具、一個 prompt，以及五輪的執行額度組成。現在三個 investigator 都已經就位。下一個問題是：要讓它們一個接一個執行，還是全部同時執行？
