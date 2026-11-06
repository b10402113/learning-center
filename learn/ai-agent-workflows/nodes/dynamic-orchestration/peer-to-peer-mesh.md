# Peer-to-Peer：沒有協調者，關係數隨 agent 數量暴增

到目前為止，前面幾種拓撲都還有一個協調者；把協調者拿掉，就是下一種。在設計多 agent 系統時，最常見的做法通常是有一個主控者（例如 supervisor）統一調度，或者按照固定流程依序執行。但如果你面對的問題沒有自然的階層關係，而且在開始前根本無法預測拆解步驟，該怎麼辦？

這時有人會考慮 Peer-to-Peer（點對點，也稱 any-to-any network、mesh 網狀或去中心化架構）。在這種系統中，所有 agent 平起平坐，沒有任何中央協調者，彼此可以直接對話與傳遞控制權。

這種完全平等的設計看起來非常靈活，但在多 agent 架構中，它本質上就是一種「混亂」模式。

## 什麼是 Peer-to-Peer 架構？

Peer-to-Peer 與 Supervisor（監督者）模式完全相反。在 Supervisor 架構中，只有監督者需要掌握所有子 agent 的資訊；但在 Peer-to-Peer 系統裡，由於沒有中央主管：

<!--image:1-->

- 每一個 agent 都必須知道其他所有 agent 的存在。
- 每一個 agent 都必須理解其他同儕各自具備什麼專長。
- Agent 之間根據需要彼此傳遞資訊與控制權，直到滿足停止條件為止。

這種架構在傳統工作流程（workflow）中沒有直接對應的模式。傳統工作流程必須依賴確定性的程式碼來規劃下一步，而 Peer-to-Peer 系統是讓 agent 自行決定何時開口、要跟誰說話，以及下一個輪到誰。除非我們在程式碼裡寫隨機邏輯（例如 `Math.random()`）隨機指定下一個 agent，否則根本無法用確定性的流程代碼來描述它。

這就像把一群工程師找進同一間會議室討論系統架構：每個人都在場、每個人都有自己的專業背景，任何人都可以在任何時間發言，也可以隨時點名其他人回應。它本質上就是對話分流（conversation triage）的 agent 版本。

以下是 Peer-to-Peer（Swarm）架構的運作原理與職責劃分：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerPeerToPeerMultiAgent.js#L1-L32 -->

```javascript
// =============================================================================
// Career Path — PEER-TO-PEER (SWARM) MULTI-AGENT system
// -----------------------------------------------------------------------------
// How this differs from the other multi-agent files:
//   - careerSequentialMultiAgent.js / careerParallelMultiAgent.js: plain CODE decides which agent runs.
//   - careerSupervisorMultiAgent.js: a boss agent calls workers and gets every result BACK.
//   - careerDispatcherMultiAgent.js: a router agent picks ONE specialist once, then steps aside.
//   - THIS FILE: there is NO boss and NO router. The agents are PEERS. Whichever agent is
//                "active" works on the request, and when it needs a peer's expertise it hands the
//                conversation DIRECTLY to that peer. Handoffs can go in ANY direction,
//                including back to an agent that already had a turn.
//
// How it works (the "swarm" pattern, like LangGraph Swarm):
//   - Every agent gets its own domain tools PLUS a handoff tool for every other peer
//     (e.g. "transfer_to_job_market_analyst"). Handing off is just calling a tool.
//   - All agents share ONE conversation history, so a peer that takes over sees everything
//     that has happened so far. A short note with the handoff says what to do next.
//   - Our code only remembers WHICH agent is active (and runs its next step). It never chooses
//     the next agent. The agents choose, by calling handoff tools.
//   - The agent that has enough information gives the Final Answer. No one has to approve it.
//
//   [User input] -> Career Matcher (default active agent)
//                        |  transfer_to_job_market_analyst  <--->  Job Market Analyst
//                        |  transfer_to_roadmap_advisor     <--->  Roadmap Advisor
//                        '                                  <--->  (every pair of peers can hand off)
//                   The active agent writes the Final Answer -> [Final output]
//
// Inside each agent, the LLM decides its own steps (Thought -> Action -> Observation
// -> ... -> Final Answer). That's what makes each one an AGENT, not just an LLM call.
//
// Run with:  node multi-agent-systems/careerPeerToPeerMultiAgent.js "I love animals and science, hate sitting at a desk"
// =============================================================================
```

## 運作範例：開放式協作

假設我們建立了一個點對點網路，裡面有職涯顧問（career）、教育培訓（education）、資金補助（funding）以及就業趨勢（trends）四個專業 agent。

當使用者提出需求：
> 「我想轉職到科技業，可以跟我聊聊有哪些選擇、相關課程和補助方案嗎？請大家一起討論。」

在這個網路中，任何 agent 隨時都能呼叫其他 agent。例如職涯顧問先分析方向，接著把對話交給趨勢 agent 評估就業市場，趨勢 agent 再轉給教育 agent 挑選課程，最後由資金 agent 補上補助方案。當資訊齊全後，網路會產出一份最終回覆：
> 「根據您的興趣與目前的就業市場趨勢，以下提供三條職涯路徑、推薦課程與補助方案，以及您的下一步行動建議。」

<!--image:2-->

這種模式專注於開放、靈活的協作，讓各領域專家隨時接手。在實作上，如果真的要採用這種系統，至少必須在提示詞中對每個 agent 的專長描述得非常精確，清楚規範誰負責處理什麼，才能稍微抑制系統發散的混亂程度。

在具體程式碼中，每個 agent 執行的核心就是不斷讀取共享歷史紀錄，決定是要自己回覆、呼叫自身工具，還是將控制權交棒給同儕：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerPeerToPeerMultiAgent.js#L128-L163 -->

```javascript
  // Runs ONE turn. Reads from and writes to the SHARED history.
  // Returns { type: "final", answer } | { type: "handoff", to } | { type: "continue" }.
  agent.step = async (history) => {
    // The system prompt belongs to THIS agent; the history is shared by everyone.
    const messages = [{ role: "system", content: systemPrompt() }, ...history];

    // REASON: the LLM decides its next Thought + Action.
    const llmOutput = await callLLM(name, messages);
    history.push({ role: "assistant", name, content: llmOutput });
    console.log(`[${name}]\n${llmOutput}\n`);

    // DONE? This agent decided it can answer the user.
    const finalAnswer = llmOutput.match(/Final Answer:\s*([\s\S]*)/);
    if (finalAnswer) return { type: "final", answer: finalAnswer[1].trim() };

    // ACT: run the tool the LLM chose (only from THIS agent's tools).
    const action = llmOutput.match(/Action:\s*(.+)\s*Action Input:\s*(.+)/);
    const toolName = action?.[1].trim();
    const toolInput = action?.[2].trim();
    const tool = toolName && agent.tools[toolName];

    // HANDOFF: the chosen "tool" is a peer. Tell everyone via the shared history, and report
    // who should go next. The orchestrator just follows this; it does not choose.
    if (tool?.handoffTo) {
      history.push({ role: "user", content: `Observation: Transferred to ${tool.handoffTo}. Note from ${name}: ${toolInput}` });
      return { type: "handoff", to: tool.handoffTo };
    }

    // OBSERVE: feed the tool result back so the next step can use it.
    const observation = tool
      ? await tool.run(toolInput)
      : "Invalid action. Use one of the listed tools with the exact format."; // Lets the LLM fix its mistake.
    history.push({ role: "user", content: `Observation: ${observation}` });
    console.log(`[${name}] Observation: ${observation}\n`);
    return { type: "continue" };
  };
```

## 為什麼難以除錯？

Peer-to-Peer 看似有一些好處：它沒有中央聚合器（aggregator），因此不會有「最後彙整步驟失敗導致全局崩潰」的單點故障（single point of failure）；當問題本身缺乏階層關係時，讓 agent 即時分流處理看似很合理。

但代價是極高的維護與除錯成本。在所有多 agent 系統中，Peer-to-Peer 是最難除錯的一種。

AI 公司 Cognition 曾在 2025 年發表過一篇名為《Don't Build Multi-Agents》（別做多 agent 系統）的文章。約十個月後，他們在後續追蹤文章中修正了看法，表示某些多 agent 架構確實運作良好；但即便在該篇後續文章中，他們依然指出：像 Peer-to-Peer 這種讓 agent 任意相連、隨意溝通的網路架構，基本上只是一種令人分心的噱頭（distraction），在真實世界中並不實用。

這背後主要有四大致命傷：

### 1. 關係數隨 agent 數量暴增，Context 急遽惡化

在 Supervisor 模式下，新增一個 agent 只需要讓 supervisor 認識它；但在 Peer-to-Peer 系統中，每個 agent 都必須保有對其他同儕的認知。這代表 Context（上下文）的大小不是隨著 agent 數量線性成長，而是隨著「關係數量」暴增。

假設系統中原本已有 $N$ 個 agent，當你再加入 1 個新 agent 時，你不是只增加了一條關係，而是必須讓這個新 agent 與原本的 $N$ 個 agent 一一建立關聯，原本的 $N$ 個 agent 也都必須新增對這個新成員的認知。每加一個角色，關係數就會呈現等比級數般的急遽攀升。

<!--image:3-->

在程式實作時，這意味著每個 agent 的工具箱裡，都必須為所有同儕註冊轉移工具：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerPeerToPeerMultiAgent.js#L219-L255 -->

```javascript
// --- CONNECT THE PEERS: give every agent a handoff tool for every OTHER agent --
// This is what makes the system peer-to-peer. There is no hub: every agent can reach every other agent.
const agents = [careerMatcher, jobMarketAnalyst, roadmapAdvisor];

for (const agent of agents) {
  for (const peer of agents.filter((other) => other !== agent)) {
    agent.tools[`transfer_to_${peer.name.toLowerCase().replace(/ /g, "_")}`] = {
      description: `Hand the conversation to ${peer.name} (${peer.description}). Input: a short note with everything they need to know.`,
      handoffTo: peer.name,
    };
  }
}

// --- THE SWARM: our code tracks the active agent, and the agents choose who's next
// This is plain code, not an LLM. It runs the active agent's next step and follows any handoff.
// It never decides who goes next. It only remembers who is active.
async function runSwarm(agents, defaultAgent, userInput) {
  const byName = Object.fromEntries(agents.map((agent) => [agent.name, agent]));
  const history = [{ role: "user", content: userInput }]; // ONE history, shared by every agent.
  let active = defaultAgent;
  const path = [active.name]; // For the final printout only.

  for (let stepNumber = 1; stepNumber <= MAX_STEPS; stepNumber++) {
    const result = await active.step(history);

    // DONE? The active agent wrote the Final Answer.
    if (result.type === "final") return { answer: result.answer, answeredBy: active.name, path };

    // HANDOFF: the agent chose a peer, so that peer becomes the active agent.
    if (result.type === "handoff") {
      console.log(`---------- Handoff: ${active.name} -> ${result.to} ----------\n`);
      active = byName[result.to];
      path.push(active.name);
    }
  }
  throw new Error(`Swarm did not finish within ${MAX_STEPS} steps.`);
}
```

### 2. 協調失敗（Coordination Failure）機率大增

協調失敗指的是兩個 agent 之間無法順暢溝通或正確交接。如果有中央控管者，協調邏輯集中且單純；但在點對點架構中，所有 agent 都在嘗試跟其他所有人溝通，系統中存在大量交接點，任何一處會錯意或格式跑掉，就會引發連鎖反應，可靠度遠低於其他架構。

### 3. 成本高昂

多個 agent 同時運行，彼此來回拋接對話，對話輪數（rounds）不斷複合疊加，共享的歷史紀錄越來越長，Token 消耗量非常驚人。

### 4. 執行軌跡完全不可預測

我們之所以很難替 Peer-to-Peer 系統除錯，是因為我們主動放棄了流程控制權。原本由工程師定義的狀態轉移箭頭，在點對點架構下全由 agent 自己決定——A 呼叫 B、B 轉給 C、C 又拋回 A。在程式真正跑完之前，沒有人能預測執行軌跡會走向哪裡。

<!--image:4-->

了解 Peer-to-Peer 架構有助於看清多 agent 系統的光譜兩端，但在評估是否將它部署到生產環境（Production）時，必須極度謹慎。在絕大多數實務場景中，它應該是窮盡其他方法後的最後手段，而非首選架構。
