# Sequential agents：用 plain code 跑固定順序的管線

管線的形狀清楚了，接著看它在程式裡長什麼樣子。當任務需要多個步驟，每個步驟又不能只是單純呼叫一次 LLM、而是需要自己查資料、推理並使用工具時，很多人會猶豫要不要把所有工具全部塞給同一隻 Agent，讓它一個迴圈跑到底。

但工具一多、任務一雜，單一 Agent 的提示詞就會變得龐大又容易失焦。這時候最穩定的做法，是把任務拆成多隻專責 Agent，並用一般程式碼把牠們串成固定順序的管線（Pipeline，或稱 Linear Delegation）。

## 概念區分：Prompt Chaining、ReAct 與 Sequential

這三種架構在程式碼寫法上非常相似，但底層執行的邏輯截然不同：

<!--image:1-->

- **Prompt Chain（提示詞鏈）**：每一個步驟只有一次單純的 LLM 呼叫，沒有工具、沒有迴圈、不做動態決策。
- **ReAct Agent**：只有單一隻 Agent，身上掛滿所有工具，自己在單一迴圈內把整個任務做到完。
- **Sequential Agents（循序多代理人）**：管線中有多隻獨立的 Agent。每一隻 Agent 內部都是完整的 ReAct 迴圈，但牠們由外部的一般程式碼按固定順序調度。

在循序系統中，Agent 絕對不會自己決定「下一棒是誰」。控制流程的不是 LLM，而是寫死在程式碼裡的協調器（Orchestrator）。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSequentialMultiAgent.js#L1-L30 -->

```javascript
// =============================================================================
// Career Path — SEQUENTIAL MULTI-AGENT system
// -----------------------------------------------------------------------------
// How this differs from the other files:
//   - careerPromptChainWorkflow.js: a workflow of single LLM CALLS (no tools, no loops).
//   - careerReActAgent.js: ONE agent (ReAct loop) that does the whole job.
//   - THIS FILE:      TWO separate agents, each with its own role, instructions,
//                     tools, and ReAct loop, run one after the other.
//
// "Sequential" means plain code (the orchestrator), NOT an LLM, runs the agents
// in a fixed order. Agents pass results through a shared `state` object: each
// agent saves its final answer under its `outputKey`, and the next agent reads it.
// (This is the same pattern as Google ADK's SequentialAgent.)
//
//   [User input] -> Agent 1: Career Matcher  --state.career-->
//                   Agent 2: Roadmap Advisor --state.roadmap--> [Final output]
//
// Inside each agent, the LLM decides its own steps (Thought -> Action -> Observation
// -> ... -> Final Answer). That's what makes each step an AGENT, not just an LLM call.
//
// Run with:  node multi-agent-systems/careerSequentialMultiAgent.js "I love animals and science, hate sitting at a desk"
// =============================================================================

// --- SETUP -------------------------------------------------------------------
// REPLACE: load your real key from an environment variable, e.g.
//   const API_KEY = process.env.OPENAI_API_KEY;   // or ANTHROPIC_API_KEY, etc.
// Never hard-code real keys in source code.
const API_KEY = "FAKE_KEY_FOR_DEMO";
const MODEL = "your-model-name-here"; // REPLACE: e.g. "gpt-4o-mini" or "claude-sonnet-4-5"
const MAX_LOOPS = 5; // Safety limit so no agent can loop forever.
```

## 每一棒都是獨立的 ReAct Agent

在循序管線裡，每一隻 Agent 都擁有專屬的角色描述（System Prompt）、專用工具清單以及獨立的對話紀錄（Transcript / Memory）。

我們不希望 Agent 包山包海，而是希望牠們是高度專業的專才（Specialists）。例如職涯規劃管線可以分成兩棒：
1. **職涯選擇代理人（Career Picker）**：只負責分析使用者的喜好並決定最適合的單一職業，身上只掛載職業搜尋（search_careers）與職缺展望工具。
2. **路徑顧問代理人（Path Advisor）**：只負責規劃如何達成該職業（需要什麼學歷、證照、執照），身上只掛載查需求（get_requirements）與查學程的工具。

因為路徑顧問拿不到職業搜尋工具，它就不可能越權回頭重選職業；每一棒使用的模型甚至可以不同，專才專用讓提示詞與工具調用更加精準。

每一隻 Agent 內部都會跑自己的 ReAct 迴圈（交替執行 Thought、Action、Observation），直到模型給出最終答案，或者觸發防呆的停止條件（`maxSteps` 或 `MAX_LOOPS`）。當 Agent 在步數上限內沒能完成任務時，程式必須有明確的處置，例如返回 `null` 或直接拋出錯誤，避免把半成品或壞掉的輸出交接給下一棒。

<!--image:2-->

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSequentialMultiAgent.js#L71-L126 -->

```javascript
// --- AGENT FACTORY -----------------------------------------------------------
// Builds a self-contained ReAct agent (same loop as careerReActAgent.js).
//   name:       for logging
//   role:       the agent's job description (its system prompt)
//   tools:      the tools ONLY this agent may use
//   task:       builds this agent's input from the shared state
//   outputKey:  where this agent saves its final answer in the shared state
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
      console.log(`[${name}] loop ${loop}\n${llmOutput}`);

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
      console.log(`Observation: ${observation}\n`);
    }
    throw new Error(`${name} did not finish within ${MAX_LOOPS} loops.`);
  }

  return { name, outputKey, run };
}
```

## 交接閘門（Handoff Gate）與最小交接物件

循序架構最大的好處，是它保留了工作流程的明確控制點。當第一棒執行完畢後，協調器在呼叫第二棒之前可以插入檢查閘門（Gate）。

驗證交接物件可以確保：如果第一棒選出的職業無效或品質不佳，錯誤就不會沿著管線一路往下蔓延，避免可靠度分數中的複合錯誤（Compounding Errors）。

更關鍵的是上下文的隔離：
- 第二棒的輸入，只需要**第一棒產出的最終交接物件**（例如選定職業名稱）以及必要的使用者原始輸入。
- 第二棒**不需要**第一棒完整的對話紀錄（Transcript）、工具呼叫過程或推理軌跡。

把前一棒的推導雜訊全部濾掉，只傳遞交接物件，能讓後續每一棒的上下文視窗維持在極小且高度專注的狀態。

<!--image:3-->

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSequentialMultiAgent.js#L128-L184 -->

```javascript
// --- AGENT 1: Career Matcher -------------------------------------------------
// Job: read the user's likes/dislikes and decide ONE career.
const careerMatcher = createAgent({
  name: "Career Matcher",
  role: "You are a career matcher. Choose the ONE career that best fits the user's likes and dislikes, and say why.",
  task: (state) => `My likes and dislikes: ${state.userInput}`,
  outputKey: "career",
  tools: {
    search_careers: {
      description: "Finds careers that match a list of interests. Input: comma-separated interests.",
      // REPLACE: call a real source (O*NET Interest Profiler API, your own DB...).
      run: async (interests) => `Careers matching "${interests}": Wildlife Biologist, Veterinarian, Park Ranger, Lab Researcher.`,
    },
  },
});

// --- AGENT 2: Roadmap Advisor ------------------------------------------------
// Job: take the career Agent 1 chose and explain how to get there.
const roadmapAdvisor = createAgent({
  name: "Roadmap Advisor",
  role: "You are a career roadmap advisor. Explain how to reach the given career: school, certifications, experience, and timeline.",
  task: (state) => `Chosen career (from the Career Matcher): ${state.career}`, // <- reads Agent 1's output
  outputKey: "roadmap",
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

// --- SEQUENTIAL ORCHESTRATOR: plain code, fixed order, no LLM ----------------
// Runs each agent in order and saves its answer into the shared state, so the
// next agent can use it. The orchestrator never decides anything on its own.
async function runSequential(agents, state) {
  for (const agent of agents) {
    console.log(`\n========== Running ${agent.name} ==========`);
    state[agent.outputKey] = await agent.run(state);
  }
  return state;
}

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

runSequential([careerMatcher, roadmapAdvisor], { userInput })
  .then((state) => {
    console.log("\n========== FINAL RESULT ==========");
    console.log(`User input: ${state.userInput}\n`);
    console.log(`Career: ${state.career}\n`);
    console.log(`How to get there:\n${state.roadmap}`);
  })
  .catch((err) => console.error("Pipeline failed:", err.message));
```

循序管線的協調器（如範例中的 `runSequential`）本質上就是幾行循序執行的普通 JavaScript。它兼顧了工作流程的確定性與個別 Agent 內部的自主探索能力，是從單一 Agent 邁向多 Agent 系統時最容易掌控也最穩固的起點。
