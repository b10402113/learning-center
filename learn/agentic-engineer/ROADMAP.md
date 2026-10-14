---
subject: agentic-engineer
status: confirmed
path: course-order
created: 2026-10-14
---

# ROADMAP — agentic-engineer

## Goal

照講師的步調，把整門 JSMastery Agentic Engineering Course 從頭走到尾。依課程原始順序（Setup & Orientation → Agentic Mindset → How Coding Agents Work → The Building Blocks → Context Engineering → Skills → Vibe Coding vs Agentic Engineering → 九步驟 workflow 實戰 → Prove it Runs → Ship It Like a Team → Find the Root Cause → Code You Didn't Write → Idea to First Ship / Greenfield）逐章前進，每一章照講師的節奏教、照講師的示範操作。終點是能在自己的專案上，用課程的九步驟 workflow（scope → architect → develop → check → test → document → sync → audit → debug）端到端跑完一個功能並交出去，而不只是「讀懂」。不自行重排、不跳過講師安排的前置章節。

## Learning path

**course-order（完全 follow 講師的章節順序）**。角度：不重排、不合併、不跳段，完全照課程錄製的順序走。最佳化：完整性與講師安排的建構節奏——vibe-vs-agentic 的痛感在課程原本的位置被感受到，前置章節一章不缺。適合：想要一套有明確順序、已被驗證的路線照著走的人（對上 MEMORY.md 的明確要求）。

Tier 由一般到特定：先定位與心態，再理解 agent runtime（迴圈、讀法、context），接著是可用的槓桿（原語、context engineering、skills），然後用 A/B 對照說明為何需要 workflow，才進到九步驟 workflow 系統、證明與交付、除錯與舊碼庫，最後以 greenfield 端到端收尾。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe agentic-engineer/<node-id>` to measure a node, then `/nodes agentic-engineer/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 定位與心態

1. **[[learn/agentic-engineer/nodes/course-orientation|課程定位與設定]]**
   - Goal: 說出課程核心主張（寫程式已商品化、判斷力才是差異）、確認自己的先備條件、把 CLI/IDE 裝好，並知道每一章要產出什麼。
   - Sources:
     - [[sources/agentic-engineer/20261014/1. Setup & Orientation/1. What This Course Will and Wont Make You.srt#1-what-this-course-will-and-wont-make-you]]
     - [[sources/agentic-engineer/20261014/1. Setup & Orientation/2. Prerequisites Who is this course for.srt#2-prerequisites-who-is-this-course-for]]
     - [[sources/agentic-engineer/20261014/1. Setup & Orientation/3. The Two Scenarios Youll Build In.srt#3-the-two-scenarios-youll-build-in]]
     - [[sources/agentic-engineer/20261014/1. Setup & Orientation/4. Install the CLI in Your IDE.srt#4-install-the-cli-in-your-ide]]
     - [[sources/agentic-engineer/20261014/1. Setup & Orientation/5. How to Take This Course Use the Cheat Sheet.srt#5-how-to-take-this-course-use-the-cheat-sheet]]
     - [[sources/agentic-engineer/20261014/SOURCE CODE.html#course-index]]

2. **[[learn/agentic-engineer/nodes/agentic-mindset|Agentic Mindset：AI 為何崩壞，如何指揮]]**
   - Goal: 用「你是架構師、agent 是引擎」的心態取代許願式 prompt，並能用「沒有真 context／沒有真計畫」兩個根因診斷 AI coding 為什麼崩壞。
   - Sources:
     - [[sources/agentic-engineer/20261014/2. Agentic Mindset/1. Why AI Coding Falls Apart.srt#why-ai-coding-falls-apart]]
     - [[sources/agentic-engineer/20261014/2. Agentic Mindset/2. Direct the AI Dont Rely on Hope.srt#direct-the-ai-dont-rely-on-hope]]
     - [[sources/agentic-engineer/20261014/2. Agentic Mindset/4. Vibe Coding vs. Agentic Engineering.srt#vibe-coding-vs-agentic-engineering]]

### Tier 2 — 代理程式怎麼運作

3. **[[learn/agentic-engineer/nodes/agent-loop|Agent 迴圈：Read → Decide → Act → Observe]]**
   - Goal: 說出 agent 的 Read→Decide→Act→Observe 迴圈，並在一個真實小 bug 上認出每個階段、理解一個壞讀取如何複利到後面每一次迴圈。
   - Sources:
     - [[sources/agentic-engineer/20261014/3. How Coding Agents Work/1. The Agent Loop.srt#the-agent-loop]]
     - [[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/overview.md]]

4. **[[learn/agentic-engineer/nodes/how-agents-read-code|Agent 如何讀你的程式庫]]**
   - Goal: 解釋 agent 沒有索引、靠 grep/glob/read 現場找路，並用「你沒說、它沒讀＝它不知道」判斷它到底知道什麼；親手追一次「auth 在哪」的搜尋路徑。
   - Sources:
     - [[sources/agentic-engineer/20261014/3. How Coding Agents Work/2. What the Agent Sees (9_11_2026 1：22：42 PM).html#what-the-agent-sees]]
     - [[sources/agentic-engineer/20261014/3. How Coding Agents Work/3. How Agents Read Your Codebase.srt#how-agents-read-your-codebase]]
     - [[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/lib/auth.ts]]
     - [[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/app/actions/auth-actions.ts]]

5. **[[learn/agentic-engineer/nodes/context-window-and-rot|Context Window、Context Rot 與 Session 衛生]]**
   - Goal: 說明 context window 為什麼會滿、rot 為什麼在裝滿前就開始掉品質、以及何時該 clear、何時該 compact。
   - Sources:
     - [[sources/agentic-engineer/20261014/3. How Coding Agents Work/4. Context Windows and Why They Fill.srt#context-windows-and-why-they-fill]]
     - [[sources/agentic-engineer/20261014/3. How Coding Agents Work/5. Context Rot： Quality Slips Before The Window Fills (9_11_2026 1：26：48 PM).html#context-rot-quality-slips-before-the-window-fills]]
     - [[sources/agentic-engineer/20261014/3. How Coding Agents Work/6. Topic Switching： When Unrelated Work Pulls Focus (9_11_2026 1：27：19 PM).html#topic-switching-when-unrelated-work-pulls-focus]]
     - [[sources/agentic-engineer/20261014/3. How Coding Agents Work/7. Clearing vs. Compacting.srt#clearing-vs-compacting]]
     - [[sources/agentic-engineer/20261014/3. How Coding Agents Work/8. Tokens What Costs What.srt#tokens-what-costs-what]]

### Tier 3 — 可用的槓桿：原語、context、skills

6. **[[learn/agentic-engineer/nodes/primitives-tools-mcp|四大原語：Tools 與 MCP]]**
   - Goal: 用四大原語（tools／MCP／subagents／skills）當共通詞彙，說明 tools 是什麼、MCP 何時值得接、以及它的安全與 context 成本。
   - Sources:
     - [[sources/agentic-engineer/20261014/4. The Building Blocks/1. The Four Primitives Your Vocabulary Map.srt#the-four-primitives-your-vocabulary-map]]
     - [[sources/agentic-engineer/20261014/4. The Building Blocks/2. Tools： What the Model Can Call (9_11_2026 1：31：10 PM).html#tools-what-the-model-can-call]]
     - [[sources/agentic-engineer/20261014/4. The Building Blocks/3. MCP： Extending the Agent (and When It's Worth It) (9_11_2026 1：32：13 PM).html#mcp-extending-the-agent-and-when-its-worth-it]]
     - [[sources/agentic-engineer/20261014/ai-course-demos/003-mcp-server/lib/prisma.ts]]

7. **[[learn/agentic-engineer/nodes/subagents-and-model-choice|Subagents 與模型選擇]]**
   - Goal: 建立並使用 subagent 把重讀取隔離掉，並用「harness 佔 80%、model 佔 20%」與 deep/fast 分層挑選模型。
   - Sources:
     - [[sources/agentic-engineer/20261014/4. The Building Blocks/4. Subagents Agents with Their Own Context.srt#subagents-agents-with-their-own-context]]
     - [[sources/agentic-engineer/20261014/4. The Building Blocks/5. Configuring And Using A Subagent (9_11_2026 1：33：02 PM).html#configuring-and-using-a-subagent]]
     - [[sources/agentic-engineer/20261014/4. The Building Blocks/6. Mapping Primitives Across Tools (9_11_2026 1：33：34 PM).html#mapping-primitives-across-tools]]
     - [[sources/agentic-engineer/20261014/4. The Building Blocks/7. Choosing a Model： Harness vs. Reasoning (9_11_2026 1：33：59 PM).html#choosing-a-model-harness-vs-reasoning]]
     - [[sources/agentic-engineer/20261014/skills/.claude/agents/scout.md]]

8. **[[learn/agentic-engineer/nodes/context-engineering|Context Engineering：Always-on／On-demand／Reference]]**
   - Goal: 把 always-on／on-demand／reference 三種 context 分清楚，並寫出一個夠小、每次 session 都付得起的 AGENTS.md（知道 Claude Code 只讀 CLAUDE.md、要靠 import 帶進 AGENTS.md）。
   - Sources:
     - [[sources/agentic-engineer/20261014/5. Context Engineering/1. What Context Engineering Means.srt#1-what-context-engineering-means]]
     - [[sources/agentic-engineer/20261014/5. Context Engineering/2. The Three Types of Context (9_11_2026 1：34：51 PM).html#2-the-three-types-of-context]]
     - [[sources/agentic-engineer/20261014/5. Context Engineering/3. CLAUDE.md AGENTS.md How They Load.srt#3-claudemd-agentsmd-how-they-load]]
     - [[sources/agentic-engineer/20261014/ai-course-demos/004-agent-context/AGENTS.md]]
     - [[sources/agentic-engineer/20261014/ai-course-demos/004-agent-context/types/order.ts]]

9. **[[learn/agentic-engineer/nodes/code-structure-as-context|程式結構即 Context]]**
   - Goal: 用檔案大小、可預測命名與 colocation 三個結構選擇，降低 agent 每次讀取的固定 context 成本。
   - Sources:
     - [[sources/agentic-engineer/20261014/5. Context Engineering/4. Code Structure That Makes Agents Work Better (9_11_2026 1：35：43 PM).html#4-code-structure-that-makes-agents-work-better]]

10. **[[learn/agentic-engineer/nodes/skills-anatomy-authoring|Skills：SKILL.md 解剖與親手撰寫]]**
    - Goal: 讀懂一個 SKILL.md（frontmatter 的 description 當觸發器、body 按需載入），親手做出一個可用的 skill，並分清楚 personal 與 project skill。
    - Sources:
      - [[sources/agentic-engineer/20261014/6. Skills — The System You Needed/1. Skills The Discipline You Did by Hand.srt#1-skills-the-discipline-you-did-by-hand]]
      - [[sources/agentic-engineer/20261014/6. Skills — The System You Needed/2. How to Read a SKILL.md file.srt#2-how-to-read-a-skillmd-file]]
      - [[sources/agentic-engineer/20261014/6. Skills — The System You Needed/3. Build Your Own Skill.srt#3-build-your-own-skill]]
      - [[sources/agentic-engineer/20261014/skills/docs/conventions.md]]
      - [[sources/agentic-engineer/20261014/skills/scripts/check-portability.mjs]]

11. **[[learn/agentic-engineer/nodes/skills-vs-mcp|Skills vs MCP：何時用哪個]]**
    - Goal: 在一個具體工具上分辨「skill 帶的是慣例」與「MCP 連的是你的實例」兩種機制，知道何時兩個都要。
    - Sources:
      - [[sources/agentic-engineer/20261014/6. Skills — The System You Needed/4. Skills vs. MCP： Which to use and when (9_11_2026 1：37：53 PM).html#4-skills-vs-mcp-which-to-use-and-when]]
      - [[sources/agentic-engineer/20261014/skills/README.md]]

### Tier 4 — 為什麼要 workflow：A/B 對照

12. **[[learn/agentic-engineer/nodes/vibe-vs-agentic-experiment|A/B 實驗：Vibe Build vs Agentic Build]]**
    - Goal: 從同一句 prompt 產出的兩份程式碼，指出 vibe build 的四個架構級殺手，並說出 workflow 版本每一行程式為什麼存在。
    - Sources:
      - [[sources/agentic-engineer/20261014/7. Vibe Coding vs Agentic Engineering/1. The Experiment One App Two Builds.srt#the-experiment-one-app-two-builds]]
      - [[sources/agentic-engineer/20261014/7. Vibe Coding vs Agentic Engineering/2. The Vibe Build A Working App in One Session.srt#the-vibe-build-a-working-app-in-one-session]]
      - [[sources/agentic-engineer/20261014/7. Vibe Coding vs Agentic Engineering/3. Watch It Break.srt#watch-it-break]]
      - [[sources/agentic-engineer/20261014/7. Vibe Coding vs Agentic Engineering/4. Autopsy Reading the Vibe Codebase.srt#autopsy-reading-the-vibe-codebase]]
      - [[sources/agentic-engineer/20261014/7. Vibe Coding vs Agentic Engineering/5. Workflow-First Decide Before You Build.srt#workflow-first-decide-before-you-build]]
      - [[sources/agentic-engineer/20261014/7. Vibe Coding vs Agentic Engineering/6. Autopsy The Workflow Codebase.srt#autopsy-the-workflow-codebase]]
      - [[sources/agentic-engineer/20261014/reel-vibe_coded/src/lib/engine.ts]]
      - [[sources/agentic-engineer/20261014/reel-agentic_engineering/src/lib/feed/generate.ts]]
      - [[sources/agentic-engineer/20261014/reel-agentic_engineering/docs/adr/0007-recommendation-feed-reasons/0007-recommendation-feed-reasons.md]]

13. **[[learn/agentic-engineer/nodes/two-bills-economics|兩份帳單：Token 與 Runtime 經濟學]]**
    - Goal: 用量級講清楚 vibe 與 workflow 兩份帳單（執行成本約 60x、建置 token 的浪費來源），並說出三個降本修正。
    - Sources:
      - [[sources/agentic-engineer/20261014/7. Vibe Coding vs Agentic Engineering/7. The Two Bills (9_11_2026 1：40：21 PM).html#the-two-bills]]
      - [[sources/agentic-engineer/20261014/skills/scripts/analyze-token-usage.mjs]]

### Tier 5 — Workflow 系統

14. **[[learn/agentic-engineer/nodes/jsm-skills-system|JSM Skills System：安裝與九步驟地圖]]**
    - Goal: 安裝九個 skill 並畫出完整迴圈（idea→scope→architect→develop→audit→check verify→test→review→document→sync，debug 隨時），說出每個 skill 的入口與產物。
    - Sources:
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/1. Installing the JSM Skills System.srt#installing-the-jsm-skills-system]]
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/2. Why the Workflow Is Structured This Way.srt#why-the-workflow-is-structured-this-way]]
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/3. Nine Skills： Finding Your Entry Point (9_11_2026 1：41：29 PM).html#nine-skills-finding-your-entry-point]]
      - [[sources/agentic-engineer/20261014/skills/README.md]]
      - [[sources/agentic-engineer/20261014/skills/docs/workflow-guide.md]]

15. **[[learn/agentic-engineer/nodes/skill-scope|/scope：動工前先挑戰想法]]**
    - Goal: 用一句話或一份 brain dump 跑 /scope，產出 docs/scope/scope.md，並選對 build approach 與 workflow tier。
    - Sources:
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/4. scope Challenge the Idea Before Any Code.srt#scope-challenge-the-idea-before-any-code]]
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/5. Demo Running scope.srt#demo-running-scope]]
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/6. Reading a Spec： What the Build Sees and What You Keep (9_11_2026 1：42：57 PM).html#reading-a-spec-what-the-build-sees-and-what-you-keep]]
      - [[sources/agentic-engineer/20261014/skills/skills/scope/SKILL.md]]

16. **[[learn/agentic-engineer/nodes/skill-architect|/architect：把 Load-bearing 決定寫成 Spec]]**
    - Goal: 跑 /architect，用一輪一輪帶建議選項的決策訪談，把 load-bearing 決定寫成 docs/specs 的 spec（index／rationale／verify），並用第二個模型 cross-check。
    - Sources:
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/7. Demo Running architect.srt#demo-running-architect]]
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/8. Challenge： Scope Your Own Real Idea (9_11_2026 1：44：36 PM).html#challenge-scope-your-own-real-idea]]
      - [[sources/agentic-engineer/20261014/skills/skills/architect/SKILL.md]]

17. **[[learn/agentic-engineer/nodes/skill-develop-audit-sync|/develop、/audit、/sync：建置、建圖、對帳]]**
    - Goal: 用 /develop 依 spec 建置（just-in-time 依賴、spec gate、Assumed 逃生口），用 /audit 產生 AGENTS.md，用 /sync 對帳 scope／specs 與實況。
    - Sources:
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/9. Demo Planning a Feature with develop.srt#demo-planning-a-feature-with-develop]]
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/10. Demo Running audit.srt#demo-running-audit]]
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/11. sync： Understand It, Then Automate It (9_11_2026 1：45：40 PM).html#sync-understand-it-then-automate-it]]
      - [[sources/agentic-engineer/20261014/8. Workflow Ship Something Real/12. Install Supabase MCP.srt#install-supabase-mcp]]
      - [[sources/agentic-engineer/20261014/skills/skills/develop/SKILL.md]]
      - [[sources/agentic-engineer/20261014/skills/skills/audit/SKILL.md]]
      - [[sources/agentic-engineer/20261014/skills/skills/sync/SKILL.md]]

### Tier 6 — 證明它會跑

18. **[[learn/agentic-engineer/nodes/two-kinds-of-proof|兩種證明：check verify vs test]]**
    - Goal: 區分 check verify（今天能不能跑）與 test（以後還會不會跑）兩種證明與 alpha／beta tier，並記住 verify 先、test 後。
    - Sources:
      - [[sources/agentic-engineer/20261014/9. Workflow Prove it Runs/1. Walkthrough Prove it Runs.srt#walkthrough-prove-it-runs]]
      - [[sources/agentic-engineer/20261014/9. Workflow Prove it Runs/2. Two Kinds of Proof.srt#two-kinds-of-proof]]

19. **[[learn/agentic-engineer/nodes/check-verify-and-test|實跑 check verify 與 test]]**
    - Goal: 實跑 check verify 對照 verify.md 的驗收條件找出真 bug，再跑 test 把一次性驗證變成回歸保護。
    - Sources:
      - [[sources/agentic-engineer/20261014/9. Workflow Prove it Runs/3. Demo Running check verify.srt#demo-running-check-verify]]
      - [[sources/agentic-engineer/20261014/9. Workflow Prove it Runs/4. Demo Running test.srt#demo-running-test]]
      - [[sources/agentic-engineer/20261014/skills/skills/check/SKILL.md]]
      - [[sources/agentic-engineer/20261014/skills/skills/test/SKILL.md]]

20. **[[learn/agentic-engineer/nodes/ship-it-like-a-team|像團隊一樣交付：check review 與 document]]**
    - Goal: 用不同模型跑 check review 拿到第二個視角，並用 /document 從 diff／spec／review／tests 產出 PR／changelog／release-note／postmortem。
    - Sources:
      - [[sources/agentic-engineer/20261014/10. Workflow Ship It Like a Team/1. Why a Second Mind Matters.srt#why-a-second-mind-matters]]
      - [[sources/agentic-engineer/20261014/10. Workflow Ship It Like a Team/2. Demo - Running check review.srt#demo-running-check-review]]
      - [[sources/agentic-engineer/20261014/10. Workflow Ship It Like a Team/3. document： The Record That Travels With Your Code (9_11_2026 1：49：59 PM).html#document-the-record-that-travels-with-your-code]]
      - [[sources/agentic-engineer/20261014/skills/skills/document/SKILL.md]]

21. **[[learn/agentic-engineer/nodes/the-loop-youll-run|你真正會跑的那個迴圈]]**
    - Goal: 講清楚 skill 帶狀態與流程、人帶判斷，並說出五個只有人能做的放行決定。
    - Sources:
      - [[sources/agentic-engineer/20261014/10. Workflow Ship It Like a Team/4. The Loop Youll Actually Run.srt#the-loop-youll-actually-run]]
      - [[sources/agentic-engineer/20261014/skills/docs/workflow-guide.md]]

### Tier 7 — 除錯與接手別人的碼

22. **[[learn/agentic-engineer/nodes/debug-method|除錯方法：三種壞法與科學方法]]**
    - Goal: 用「這是哪一種壞」分流，並對一般 code bug 套用 observe→hypothesize→test 的科學方法、一次只改一件事。
    - Sources:
      - [[sources/agentic-engineer/20261014/11. Workflow Find the Root Cause/1. The Three Kinds of Broken.srt#the-three-kinds-of-broken]]
      - [[sources/agentic-engineer/20261014/11. Workflow Find the Root Cause/2. The Method That Works on Any Code.srt#the-method-that-works-on-any-code]]
      - [[sources/agentic-engineer/20261014/11. Workflow Find the Root Cause/3. Demo Running debug.srt#demo-running-debug]]
      - [[sources/agentic-engineer/20261014/skills/skills/debug/SKILL.md]]

23. **[[learn/agentic-engineer/nodes/debug-ai-code-and-sessions|除錯 AI 寫的碼與救回卡住的 Session]]**
    - Goal: 對 AI 寫的碼用「把它當陌生人寫的」還原意圖，並在 agent 卡住時用五步升級與 clear／compact 判斷救回 session。
    - Sources:
      - [[sources/agentic-engineer/20261014/11. Workflow Find the Root Cause/4. Debugging Code You Didn't Write (9_11_2026 1：51：47 PM).html#debugging-code-you-didnt-write]]
      - [[sources/agentic-engineer/20261014/11. Workflow Find the Root Cause/5. Recover a Broken Session (9_11_2026 1：52：08 PM).html#recover-a-broken-session]]

24. **[[learn/agentic-engineer/nodes/brownfield-reality|沒有白紙：Brownfield 的風險]]**
    - Goal: 說出 agent 在舊碼庫為什麼會失敗（沒有地圖）與兩個風險方向，並用 workflow 的「先理解、再安全地改」兩步對應。
    - Sources:
      - [[sources/agentic-engineer/20261014/12. Workflow Code You Didn't Write/1. Nobody Starts from Scratch (9_11_2026 1：52：40 PM).html#nobody-starts-from-scratch]]
      - [[sources/agentic-engineer/20261014/skills/docs/workflow-guide.md]]

25. **[[learn/agentic-engineer/nodes/working-in-legacy-code|在舊碼庫裡工作：先 audit，再最小變更]]**
    - Goal: 在一個真實舊專案上跑 /audit 建地圖，再用 /scope→/architect→/develop 做一個最小安全變更，並記住地圖是證據不是真相。
    - Sources:
      - [[sources/agentic-engineer/20261014/12. Workflow Code You Didn't Write/2. Demo Running audit on a Real Open-Source Project.srt#demo-running-audit-on-a-real-open-source-project]]
      - [[sources/agentic-engineer/20261014/12. Workflow Code You Didn't Write/3. Demo Your First Change in Legacy Code.srt#demo-your-first-change-in-legacy-code]]

### Tier 8 — Greenfield 端到端

26. **[[learn/agentic-engineer/nodes/greenfield-scope-architect|Greenfield：Scope 與架構技術棧]]**
    - Goal: 對自己的點子跑 /scope 與 /architect，選定決策並讓第二個模型 cross-check spec，再把 context clear 乾淨。
    - Sources:
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#install-skills]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#scope-the-idea]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#choose-build-approach]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#architect-stack-interview]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#agent-skills-and-mcp]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#spec-cross-check]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#clear-context-and-continue]]

27. **[[learn/agentic-engineer/nodes/greenfield-scaffold-tooling|Greenfield：Scaffold、Tooling 與規範]]**
    - Goal: 從 spec 0001 生出可跑的 scaffold、env 與 GitHub repo，用 /audit 捕捉規範、用 tooling 強制執行。
    - Sources:
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#scaffold-stack-architecture]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#env-keys-and-verification]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#audit-standards-capture]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#tooling-enforcement]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#skills-and-context-management]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#testing-decision-and-ownership]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#git-and-github-push]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#data-model-handoff]]

28. **[[learn/agentic-engineer/nodes/greenfield-data-model|Greenfield：設計資料模型]]**
    - Goal: 跑 architect data model，在 full target model 與 thin thread 之間選定、寫出九表遷移，處理 ownership 與 RLS，並對 live DB 驗證。
    - Sources:
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#scope-and-spec-context]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#full-target-model-vs-thin-thread]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#taste-profile-storage]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#ratings-profile-and-target-model]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#scoped-query-helper-ownership]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#schema-layout-enums-and-movie-identity]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#rating-state-and-starter-deck]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#cross-check-second-model]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#supabase-mcp-setup]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#migration-applied-and-verification]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/3. Data Model.srt#cold-start-and-auth-trigger]]

29. **[[learn/agentic-engineer/nodes/greenfield-verify-review-document|Greenfield：Verify、Review、Document]]**
    - Goal: 對資料模型跑 check verify、check review（換模型）、document，走完一次完整交付。
    - Sources:
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/4. Use Check-Verify command for Data Model.srt#use-check-verify-command-for-data-model]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/5. Review the Data Model Audit.srt#review-the-data-model-audit]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/6. Use Document SKILL for Data Model.srt#use-document-skill-for-data-model]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/7. Architect the Movie Catalog and Cache.srt#architect-the-movie-catalog-and-cache]]

30. **[[learn/agentic-engineer/nodes/greenfield-catalog-design-slice|Greenfield：Catalog、Design System 與第一個 Slice]]**
    - Goal: 實作 catalog 與 design system、跑第一個 thin slice（core taste loop），在 showcase 收尾並講出 batch architect 的 pro tip。
    - Sources:
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/8. Implement the Movie Catalog and Cache.srt#implement-the-movie-catalog-and-cache]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/9. Setup Design System and UI Foundation.srt#setup-design-system-and-ui-foundation]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/10. Update the Design System.srt#update-the-design-system]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/11. Design System Output.srt#design-system-output]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/12. First Slice Core taste loop.srt#first-slice-core-taste-loop]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/13. App Showcase.srt#app-showcase]]
      - [[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/14. Final Pro Tip.srt#final-pro-tip]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
