# Parallelization：sectioning 與 voting 的 fan-out／merge

循序管線的延遲會線性疊加，平行化就是為了拆掉這個瓶頸。當我們在設計多 Agent 系統時，如果將所有步驟串成序列（sequential），每個 Agent 都必須等待前一個步驟產出才能接續，延遲（latency）很快就會疊加到無法接受的程度。為了解決這個瓶頸，平行化（Parallelization）是另一種常見的工作流程。

在多 Agent 架構中，平行化有時也被稱為聚合器（aggregator）或集成（ensemble）。它的核心概念很單純：將同一個請求同時分發給多個 Agent 同步處理，完成後再行合併。

## 兩種子型態：Sectioning 與 Voting

在多 Agent 系統中，平行化主要分為兩種類型：

<!--image:1-->

1. **分塊處理（Sectioning）**：不同的 Agent 各自平行處理任務中的某個子任務。例如分析使用者的職涯時，一個 Agent 負責比對興趣、一個 Agent 負責分析工作型態、另一個 Agent 負責調查勞動市場趨勢。各 Agent 各司其職，最後將多個維度的分析結果收斂。
2. **多數決投票（Voting）**：多個 Agent 接收完全相同的任務並各自嘗試解決，最後比對答案並進行對齊協調（reconcile）。

平行化在延遲與成本上的權衡，恰好是序列架構的鏡像。序列架構每一步都要等待，延遲表現極差，但運算資源是依序使用；平行化透過同時派發任務並快速收回，延遲表現大幅改善，但因為同時調用多個 Agent，花費的成本也會顯著增加。尤其是 Voting 模式，原本只執行一次的任務，現在必須執行多次，成本會直接成倍成長。

其實 Voting 的概念並非全新想法。Google 過去發表的自我一致性（Self-Consistency）論文就提出過完全相同的原理：針對同一個推論問題多次取樣，並採用多數決的答案，就能有效提升正確率。在多 Agent 系統中的 Voting，本質上就是將這個概念包裝進 Agent 架構內。

## 職涯推薦與程式碼審查實例

以職涯諮詢情境為例，若要推薦適合的學校，前提是必須先知道目標職涯，這部分無法平行處理；但要評選出最合適的職涯路徑，就很適合採用 Voting 或 Sectioning。

使用者的輸入包含個人特質、興趣與職涯目標，系統同時啟動多個 Agent 各自推導職業選擇。最後，由一個聚合 Agent（Aggregator Agent）或一段確定性的程式碼（deterministic code）來比較與統整所有回應，產出共識度最高、信心水準更強的推薦結果。冗餘（redundancy）提高，整體可靠性也隨之上升。

另一個極為實用的場景是現代軟體開發中的 Pull Request（PR）審查。隨著 AI 生成程式碼普及，工程師手寫程式碼的比例大幅下降，但 PR 的數量與體積卻呈現爆炸性增長。過去 200 行的 PR 就要看很久，現在動輒出現 1000、2000 甚至 3000 行的 PR。

面對如此龐大的 PR，單靠人工難以負荷。此時可以同時派發 3 個不同的 Agent 審閱同一個 PR，請它們各自挑出潛在問題，最後將意見彙整，工程師便能獲得極具參考價值的摘要。

在實作這種審查流程時，若所有 Agent 都使用同一家供應商的同款模型，效益會大打折扣。因為同一模型家族的預訓練資料高度重疊，容易產生盲點。較佳的作法是讓不同的 Agent 採用不同的模型家族與供應商——例如一個 OpenAI 模型、一個 Anthropic 模型，搭配一個開源權重模型（open-weight model），甚至賦予不同的推論深度。這樣能獲得更多視角的檢查反饋，讓冗餘發揮真正的效益。

## 程式碼實作：Fan-out 與 Gather 架構

以下範例展示了以程式碼作為協調者（orchestrator）的 Sectioning 平行架構。程式碼透過標準的 `Promise.all` 同時啟動多個獨立 Agent，各自完成推論後再交由專責的整合 Agent 彙整。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerParallelMultiAgent.js#L1-L36 -->

```javascript
// =============================================================================
// Career Path — PARALLEL MULTI-AGENT system
// -----------------------------------------------------------------------------
// How this differs from the other files:
//   - careerParallelWorkflow.js: parallel LLM CALLS (no tools, no loops).
//   - careerSequentialMultiAgent.js: several agents run ONE AFTER ANOTHER.
//   - THIS FILE: several AGENTS run AT THE SAME TIME, each with its own role,
//                instructions, tools, memory, and ReAct loop, followed by one
//                "merger" agent that combines what they found.
//
// "Parallel" means plain code (the orchestrator), NOT an LLM, starts every agent
// at once with Promise.all and waits for all of them. (Same idea as Google ADK's ParallelAgent.)
//   - The agents are INDEPENDENT: each works in its own branch, with its own messages,
//     and never sees the others' work while running.
//   - Each agent saves its answer under its OWN `outputKey` in the shared `state`,
//     so no two agents ever write to the same place.
//   - After they all finish, a merger agent reads every result from `state`.
//     This "fan-out, then gather" shape is the standard way to use parallel agents.
//
//   [User input] --+--> Agent 1: Interest Matcher    --state.interests-+
//                  +--> Agent 2: Work Style Analyst  --state.workStyle-+--> Agent 4: Career Advisor
//                  +--> Agent 3: Job Market Analyst  --state.jobMarket-+      (merger) --> [Final output]
//
// Inside each agent, the LLM decides its own steps (Thought -> Action -> Observation
// -> ... -> Final Answer). That's what makes each one an AGENT, not just an LLM call.
//
// Run with:  node multi-agent-systems/careerParallelMultiAgent.js "I love animals and science, hate sitting at a desk"
// =============================================================================

// --- SETUP -------------------------------------------------------------------
// REPLACE: load your real key from an environment variable, e.g.
//   const API_KEY = process.env.OPENAI_API_KEY;   // or ANTHROPIC_API_KEY, etc.
// Never hard-code real keys in source code.
const API_KEY = "FAKE_KEY_FOR_DEMO";
const MODEL = "your-model-name-here"; // REPLACE: e.g. "gpt-4o-mini" or "claude-sonnet-4-5"
const MAX_LOOPS = 5; // Safety limit so no agent can loop forever.
```

在內部實作上，每個 Agent 都是獨立的 ReAct 迴圈，具備自己專屬的系統提示詞、工具與記憶體（對話歷史），彼此完全隔離，互不干涉：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerParallelMultiAgent.js#L90-L145 -->

```javascript
// --- AGENT FACTORY -----------------------------------------------------------
// Builds a self-contained ReAct agent (same loop as careerSequentialMultiAgent.js).
//   name:       for logging
//   role:       the agent's job description (its system prompt)
//   tools:      the tools ONLY this agent may use
//   task:       builds this agent's input from the shared state
//   outputKey:  where this agent's final answer is saved in the shared state
function createAgent({ name, role, tools, task, outputKey }) {
  const systemPrompt = `${role}

You run in a loop of Thought, Action, Observation.
Available tools:
${Object.entries(tools).map(([toolName, tool]) => `- ${toolName}: ${tool.description}`).join("\n")}

To use a tool, respond EXACTLY like this, then stop and wait for the Observation:
Thought: <your reasoning>
Action: <tool name>
Action Input: <tool input>

When you are done, respond EXACTLY like this:
Thought: <your reasoning>
Final Answer: <your answer>`;

  async function run(state) {
    // Each agent has its OWN memory (messages). It only sees what `task` gives it.
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: task(state) },
    ];

    for (let loop = 1; loop <= MAX_LOOPS; loop++) {
      // REASON: the LLM decides its next Thought + Action.
      const llmOutput = await callLLM(name, messages);
      messages.push({ role: "assistant", content: llmOutput });
      console.log(`[${name}] loop ${loop}\n${llmOutput}\n`);

      // DONE? The agent decided it has finished its job.
      const finalAnswer = llmOutput.match(/Final Answer:\s*([\s\S]*)/);
      if (finalAnswer) return finalAnswer[1].trim();

      // ACT: run the tool the LLM chose (only from THIS agent's tools).
      const action = llmOutput.match(/Action:\s*(.+)\s*Action Input:\s*(.+)/);
      const tool = action && tools[action[1].trim()];
      const observation = tool
        ? await tool.run(action[2].trim())
        : "Invalid action. Use one of the listed tools with the exact format."; // Lets the LLM fix its mistake.

      // OBSERVE: feed the result back for the next loop.
      messages.push({ role: "user", content: `Observation: ${observation}` });
      console.log(`[${name}] Observation: ${observation}\n`);
    }
    throw new Error(`${name} did not finish within ${MAX_LOOPS} loops.`);
  }

  return { name, outputKey, run };
}
```

中央狀態物件（`state`）會為每個 Agent 分配獨立的 `outputKey`。平行分發（fan-out）完成後，再將所有分析結果一次餵給整合者（gather）：

<!--image:2-->

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerParallelMultiAgent.js#L147-L260 -->

```javascript
// --- PARALLEL AGENTS: each looks at the SAME user input from a DIFFERENT angle
// They must not depend on each other's output, which is why they can run at once.
// Each one only reads `state.userInput`.

// Agent 1: Job = which careers match what the user LIKES.
const interestMatcher = createAgent({
  name: "Interest Matcher",
  role: "You are an interest matcher. Find careers that match the user's likes and interests. Do not worry about anything else.",
  task: (state) => `My likes and dislikes: ${state.userInput}`,
  outputKey: "interests",
  tools: {
    search_careers: {
      description: "Finds careers that match a list of interests. Input: comma-separated interests.",
      // REPLACE: call a real source (O*NET Interest Profiler API, your own DB...).
      run: async (interests) => `Careers matching "${interests}": Wildlife Biologist, Veterinarian, Park Ranger, Lab Researcher.`,
    },
  },
});

// Agent 2: Job = which careers fit what the user DISLIKES (work style).
const workStyleAnalyst = createAgent({
  name: "Work Style Analyst",
  role: "You are a work style analyst. Find careers whose day-to-day work avoids what the user dislikes. Do not worry about anything else.",
  task: (state) => `My likes and dislikes: ${state.userInput}`,
  outputKey: "workStyle",
  tools: {
    find_careers_by_work_style: {
      description: "Finds careers by typical work setting. Input: comma-separated work styles, e.g. 'outdoor, active' or 'office'.",
      // REPLACE: call a real source (O*NET work context data, your own DB...).
      run: async (styles) => `Careers with "${styles}" work: Wildlife Biologist, Park Ranger, Forester, Veterinarian (clinic and field).`,
    },
  },
});

// Agent 3: Job = how healthy the job market is for the user's fields.
const jobMarketAnalyst = createAgent({
  name: "Job Market Analyst",
  role: "You are a job market analyst. Report on demand and growth for careers in the user's fields of interest. Do not worry about anything else.",
  task: (state) => `My likes and dislikes: ${state.userInput}`,
  outputKey: "jobMarket",
  tools: {
    get_job_outlook: {
      description: "Looks up job growth for careers in a field. Input: comma-separated fields.",
      // REPLACE: call a real source (BLS Occupational Outlook data, a jobs API...).
      run: async (fields) =>
        `Outlook for "${fields}": Veterinarian +19% (much faster than average); ` +
        "Wildlife Biologist +3% (average, competitive); Park Ranger +2% (slow).",
    },
  },
});

// --- MERGER AGENT: runs AFTER the parallel agents, using all their results ---
// Job = weigh the three reports, choose ONE career, and explain how to get there.
const careerAdvisor = createAgent({
  name: "Career Advisor",
  role:
    "You are a career advisor. You receive reports from three specialists. Choose the ONE best career, " +
    "say why, then explain how to get there: school, certifications, experience, and timeline.",
  // <- reads ALL three parallel agents' outputs from the shared state
  task: (state) =>
    `User's likes and dislikes: ${state.userInput}\n\n` +
    `Interest Matcher report: ${state.interests}\n` +
    `Work Style Analyst report: ${state.workStyle}\n` +
    `Job Market Analyst report: ${state.jobMarket}`,
  outputKey: "plan",
  tools: {
    get_career_requirements: {
      description: "Looks up the schooling, certifications, and experience needed for a career. Input: a career name.",
      // REPLACE: call a real source (web search API, O*NET API, BLS data...).
      run: async (career) =>
        `${career}: Bachelor's in Biology/Zoology/Wildlife Science; Master's for research roles; ` +
        "Associate Wildlife Biologist cert (The Wildlife Society); field technician experience.",
    },
  },
});

// --- PARALLEL ORCHESTRATOR: plain code, starts every agent at once, no LLM ---
// Promise.all starts all agents immediately and waits for the slowest one, so the
// total time is about that of ONE agent instead of the sum of all of them.
// If any agent throws, Promise.all rejects and the whole run fails. Use Promise.allSettled if you'd rather keep partial results.
async function runParallel(agents, state) {
  console.log(`\n========== Running in parallel: ${agents.map((a) => a.name).join(", ")} ==========\n`);
  const results = await Promise.all(agents.map((agent) => agent.run(state)));

  // Save results only AFTER all agents finish, each under its own key, so agents never overwrite each other.
  agents.forEach((agent, i) => (state[agent.outputKey] = results[i]));
  return state;
}

// --- THE SYSTEM: fan out (parallel), then gather (merger) --------------------
// Fixed order, decided by code: all parallel agents first, then the merger.
async function runCareerSystem(userInput) {
  const state = { userInput };
  await runParallel([interestMatcher, workStyleAnalyst, jobMarketAnalyst], state);

  console.log(`\n========== Running ${careerAdvisor.name} ==========\n`);
  state[careerAdvisor.outputKey] = await careerAdvisor.run(state);
  return state;
}

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

runCareerSystem(userInput)
  .then((state) => {
    console.log("\n========== FINAL RESULT ==========");
    console.log(`User input: ${state.userInput}\n`);
    console.log(`Interest Matcher: ${state.interests}\n`);
    console.log(`Work Style Analyst: ${state.workStyle}\n`);
    console.log(`Job Market Analyst: ${state.jobMarket}\n`);
    console.log(`Career plan:\n${state.plan}`);
  })
  .catch((err) => console.error("System failed:", err.message));
```

## 合併步驟的單點故障與拆除時機

雖然平行多 Agent 能帶來低延遲與高可靠性，但在架構上必須留意兩個關鍵問題：

### 1. 聚合步驟是單點故障（Single Point of Failure）

平行化架構最終都有一個合併／聚合步驟（Merge / Aggregator step）。即便前方的多個 Agent 提供了充足的冗餘來提升可靠度，這個聚合步驟本身依然是一個單點故障風險點。

<!--image:3-->

如果聚合步驟採用 LLM 來統整，它依然有可能發生理解錯誤或幻覺（hallucination）。因此，設計聚合步驟時有兩種常見對策：
- 使用能力最強的模型來消化多個輸入並做總結。
- 盡可能改用確定性程式碼（deterministic code）進行資料比對與計票，完全避開 LLM 產生幻覺的風險。

### 2. 何時該拆除這個模式？

隨著基礎模型的能力不斷演進，不同模型對於多數任務的分歧度已經大幅降低。早期的 LLM 問三次可能會給出三種完全不同的答案，尤其在生成程式碼時一致性很低；但現在的模型能力大幅提升，多數情況下都能直接給出正確解答。

因此，在維護平行多 Agent 系統時，必須持續監控各 Agent 之間的輸出。如果你發現多個模型給出的答案高度一致、極少出現歧見，這代表多數決帶來的冗餘價值已經消失。此時就應該拆除平行架構，退回單一 Agent 系統，避免白白浪費運算成本。
