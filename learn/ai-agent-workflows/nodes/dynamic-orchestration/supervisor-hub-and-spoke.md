# Supervisor 多代理系統：主管拆解，子 agent 不必互相認識

當你把任務交給一個大型語言模型（LLM）處理時，如果需求變得繁雜，單一 prompt 很容易因為上下文過長或邏輯交錯而失誤。直覺的做法是把事情拆給多個專門的 agent 做。但這些子 agent 之間該怎麼協調？它們需要互相溝通嗎？

在 Supervisor（主管）多代理架構中，核心概念只有一句話：由一個主 agent 統籌全局，子 agent 彼此之間完全不需要認識。

## 辦公室層級結構：只有主管知道全貌

Supervisor 系統的運作方式，就像典型的公司組織。

<!--image:1-->

最高層有一位「主管」（Supervisor），負責接收使用者的原始需求。主管把問題拆解成數個子任務，分別指派給底下的「子 agent」（Sub-agents）。每個子 agent 完成工作後，把結果回傳給主管；主管再檢視回傳內容，決定任務是否完成，或是需要再呼叫其他子 agent。

在這個架構下：
- **子 agent 不需要知道其他子 agent 的存在**：它們各自專注於自己的小任務，完成後直接向上呈報。
- **只有主管需要掌握團隊成員的職能**：主管清楚誰擅長什麼、目前進度到哪裡。
- **架構可以層層嵌套**：就像 CEO 底下有主管，主管底下還有下一層主管，最後才到基層執行人員（individual contributors），各層級的主管可以向下指派，再逐層往上匯報。

## 與平行處理的關鍵差異：動態規劃

Supervisor 與單純的「平行處理」（Parallelization）乍看很像，都是找多個 agent 幫忙，但兩者的本質不同。

在平行處理架構中，有哪些子任務是事先用程式碼固定好的。但在 Supervisor 系統中，**子任務是在執行當下由主管動態決定的**。

<!--image:2-->

這其實就是把「規劃」（Planning）的能力獨立做成一個專門的 agent。整個流程中，只有主管負責與使用者互動：

1. 使用者輸入需求（例如提供自己的性格、興趣與職涯目標）。
2. 主管接收請求，現場拆解出子問題，建立計畫。
3. 主管將子任務指派給特定領域的子 agent（例如職涯分析、培訓管道或資金補助 agent）。
4. 子 agent 回傳各自的解答。
5. 主管綜合所有回傳結果。如果發現資訊不足，主管可以自行決定追加更多子任務；如果足夠，就統整為單一回應交還給使用者。

在實作上，最常見的手法就是「把子 agent 包裝成主管的 Tool」：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSupervisorMultiAgent.js#L1-L27 -->

```javascript
// =============================================================================
// Career Path — SUPERVISOR MULTI-AGENT system
// -----------------------------------------------------------------------------
// How this differs from the other multi-agent files:
//   - careerSequentialMultiAgent.js: plain CODE runs the agents in a fixed order.
//   - careerParallelMultiAgent.js:   plain CODE runs the agents all at once.
//   - THIS FILE: a SUPERVISOR agent (an LLM) decides which worker agent to call, in what
//                order, how many times, and when the job is done. Our code only runs
//                whichever worker the supervisor asks for.
//
// How it works (the "subagents as tools" supervisor pattern):
//   - The supervisor is itself a ReAct agent (Thought -> Action -> Observation).
//   - Its TOOLS are the worker agents: "Action: delegate_to_roadmap_advisor" hands a task
//     to that worker, and the worker's final answer comes back as the Observation.
//   - ALL communication goes through the supervisor. Workers never talk to each other or
//     to the user, so the supervisor must put everything a worker needs into its task.
//   - Each worker is a full ReAct agent with its OWN instructions, tools, and memory.
//     A worker starts fresh on every delegation and sees ONLY the task it was given.
//
//   [User input] -> SUPERVISOR (Thought -> Action -> Observation -> ... -> Final Answer)
//                      |  delegate_to_career_matcher      -> Worker 1 (own ReAct loop + tools)
//                      |  delegate_to_job_market_analyst  -> Worker 2 (own ReAct loop + tools)
//                      |  delegate_to_roadmap_advisor     -> Worker 3 (own ReAct loop + tools)
//                      '--> each worker's answer returns to the supervisor as the Observation
//
// Run with:  node multi-agent-systems/careerSupervisorMultiAgent.js "I love animals and science, hate sitting at a desk"
// =============================================================================
```

每個子 agent 都是一個獨立運行的 ReAct 迴圈，擁有自己的 system prompt 與專屬工具：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSupervisorMultiAgent.js#L99-L154 -->

```javascript
// --- AGENT FACTORY -----------------------------------------------------------
// Builds a self-contained ReAct agent (same loop as careerSequentialMultiAgent.js).
//   name:         for logging
//   description:  what this agent is good at (the supervisor reads this to choose workers)
//   role:         the agent's job description (its system prompt)
//   tools:        the tools ONLY this agent may use
// `run(input)` takes plain text, because a worker's input is whatever task the supervisor wrote.
function createAgent({ name, description, role, tools }) {
  const systemPrompt = `${role}

You run in a loop of Thought, Action, Observation.
Available tools:
${Object.entries(tools).map(([toolName, tool]) => `- ${toolName}: ${tool.description}`).join("\n")}

To use a tool, respond EXACTLY like this, then stop and wait for the Observation:
Thought: <your reasoning>
Action: <tool name>
Action Input: <tool input, on ONE line>

When you are done, respond EXACTLY like this:
Thought: <your reasoning>
Final Answer: <your answer>`;

  async function run(input) {
    // Each agent has its OWN memory (messages). It only sees the input it was given.
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: input },
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

  return { name, description, run };
}
```

主管自己沒有業務層面的工具，它的「工具箱」裡裝的就是各個子 agent 的委派函式：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSupervisorMultiAgent.js#L205-L242 -->

```javascript
// --- SUPERVISOR: its "tools" are the worker agents ---------------------------
// Each worker becomes a delegation tool, e.g. "delegate_to_roadmap_advisor".
// When the supervisor calls it, we run that worker with the task the supervisor wrote,
// and the worker's final answer is returned as the Observation.
const workers = [careerMatcher, jobMarketAnalyst, roadmapAdvisor];

const delegationTools = Object.fromEntries(
  workers.map((worker) => [
    `delegate_to_${worker.name.toLowerCase().replace(/ /g, "_")}`,
    {
      description: `${worker.name}: ${worker.description}`,
      run: (task) => worker.run(task),
    },
  ])
);

// The supervisor has NO domain tools of its own. It can only delegate and then combine results.
const supervisor = createAgent({
  name: "Supervisor",
  description: "Manages the team.",
  role:
    "You are the supervisor of a career advice team. You have specialist workers, each available as a tool. " +
    "Decide which worker to call next based on what you have learned so far. Workers cannot see the user's " +
    "message or each other's results, so put EVERYTHING a worker needs into its task. " +
    "When you have enough information, give the user the final answer: the ONE best career, why it fits, " +
    "and how to get there (school, certifications, experience, timeline).",
  tools: delegationTools,
});

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

console.log(`User input: ${userInput}\n`);
supervisor
  .run(userInput)
  .then((answer) => console.log(`=== FINAL ANSWER ===\n${answer}`))
  .catch((err) => console.error("System failed:", err.message));
```

## Supervisor 架構計分卡：Context、可靠度與成本

評估是否要採用 Supervisor 架構時，可以從以下三個維度來看：

<!--image:3-->

### 1. 上下文管理（Context）：極佳
雖然主管必須掌握全局，需要較大的 context，但底下的子 agent 只需要非常窄、非常聚焦的 context。你可以打造一整個高度特化的子 agent 團隊，每個只負責一件微小的任務。整個系統只要主管採用最高階的模型即可。

至於主管如何決定要把哪些 context 交給子 agent？這主要取決於你在主管的 system prompt（或 harness 框架）中如何規定。例如可以指示主管「指派研究任務時，務必附上先前取得的相關文件」；如果沒有寫明規則，主管模型就會自行判斷該給子 agent 多少資訊。

### 2. 可靠度（Reliability）：強
當任務被切成非常專注的區塊時，子 agent 犯錯的機率大幅降低。要求越小，agent 越容易做對。此外，主管也扮演把關者的角色，如果子 agent 回傳的內容看起來不對勁，主管有能力察覺並重新指派或修正。

### 3. 成本（Cost）：非常高
這是採用 Supervisor 架構最大的阻礙。主管需要強大的理解與推理能力，才能把任務拆好並管理子 agent，因此主管必須使用等級最高、成本最貴的模型。如果系統中有多層主管，成本還會倍增。

Anthropic 的研究曾指出：一般單一 agent 消耗的 token 大約是普通對話（chat）的 4 倍；但多代理系統（multi-agent system）消耗的 token，大約是一般對話的 15 倍。

因此，在決定要不要引進主管架構時，問題通常不是「它有沒有比較厲害」，而是「這個任務值不值得花上 15 倍對話的 token 成本」。

## 失敗模式與適用情境判斷

Supervisor 架構並非萬靈丹，它有鮮明的適用與不適用場景。

### 失敗模式：蓋出一座「蓋橡皮圖章的塔」
主管架構常見的風險在於：當多層主管疊加在一起時，如果沒有搭配針對具體事實的有效反思機制（reflection），主管們很容易對彼此的幻覺（hallucinations）自信地點頭背書，變成一座互相「蓋橡皮圖章」的高塔。

<!--image:4-->

雖然使用高階模型的主管通常能發揮一定程度的把關作用、看出奇怪的地方，但這種多層背書的風險依然存在。

### 什麼時候適合？
- **廣度優先的研究任務（Breadth-first research）**：需要從大量互不相關的文件中搜集資料，且資訊正確性要求極高。
- **任務確實可以被拆開、獨立執行**：子任務之間沒有強烈的依賴關係。

### 什麼時候不適合？
- **常見問答機器人（FAQ Bot）**：邏輯簡單，用主管架構純粹是浪費錢。
- **子任務間有高度相依性或需要共享 context**：例如寫程式（Coding）。在寫程式的任務中，幾乎每段程式碼都相依於其他部分，很難讓主管把工作拆成互不干涉的子任務丟給多個 agent 平行開發。
- **流程路徑固定且有明確先後順序**：
  在常見的職涯推薦範例中（分析職涯 → 推薦學校 → 尋找補助），如果沒有先確定推薦的職涯，根本不可能去查學校；加上分支路徑只有固定的幾條，這種情境硬用 Supervisor 只會讓架構過度複雜，白白浪費極高昂的推論成本。
