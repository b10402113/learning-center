---
subject: agentic-engineer
language: zh-Hant
created: 2026-10-14
updated: 2026-10-14
---

# MEMORY — agentic-engineer

## Goal
**照講師的步調，把整門 JSMastery Agentic Engineering Course 從頭走到尾。** 依課程原始順序（Setup & Orientation → Agentic Mindset → How Coding Agents Work → The Building Blocks → Context Engineering → Skills → Vibe Coding vs Agentic Engineering → Workflow: Ship Something Real → Prove it Runs → Ship It Like a Team → Find the Root Cause → Code You Didn't Write → Idea to First Ship / Greenfield）逐章前進，每一章照講師的節奏教、照講師的示範操作。終點是能在自己的專案上，用課程的九步驟 workflow（scope → architect → develop → check → test → document → sync → audit → debug）端到端跑完一個功能並交出去，而不只是「讀懂」。不自行重排、不跳過講師安排的前置章節。

## Why
要一套**有明確順序、業界實戰、已被驗證**的完整方法，把 agentic engineering 的 workflow 紀律補齊，並拿它對照、校正自己既有的 loop/harness 做法。runtime 那層（OryxOS、TS agent harness）我有；缺的是「照著一套被操過的路線，把每個階段的產物與判斷力做實」——所以跟著講師的步調走，比我自己挑重點更能補到盲點。這門課同時是我下一步 skills system 的直接素材。

## Prior experience
- Claude Code / opencode 重度使用者：approval、sub-agent、hook、worktree、skill、MCP 都有體感。
- 自寫過 OryxOS 的 ReAct loop（Java 21 + Spring Boot）。
- 打造過 TypeScript agent harness runtime（durable execution、memory compaction、handoff、階層式 sub-agents）。
- 讀過 loop engineering（四態終止、guardrails、evidence gate、multi-agent contract、readiness review）。
- TS/Node/React/Next.js 全端日常可用；也熟 Java、Python。
- LangGraph 多節點 agent + SSE 串流（llm-project）；DDIA 的冪等／event log／一致性讀過。
- **要確認的斷層**：JSM 這套九步驟 workflow 的實際操作節奏與交付物、context engineering 的具體守則、SKILL.md 的設計慣例、以及課程 workflow demo 的逐步流程。

## Anchors
- 自己的 side project（TS/Node 全端）——workflow 要落地的地方。
- OryxOS、agent-harness——拿課程的 workflow 對照自己 runtime 的缺口。
- 日常使用 Claude Code / opencode——從「使用者的體感」反推「課程為什麼這樣設計」。
- 課程自帶素材：`skills/`（JSM Skills System 九個 skill）、`ai-course-demos/`（001 login bug、003 MCP server、004 agent context）、第 7 章兩個 reel app、第 13 章 greenfield movie app——示範都能對回真程式碼。
- 公司 Java 平台——workflow 準則最終要搬回去的地方。

## Habits & constraints
- 每週約 1–3 小時，時間破碎；長段落在週末或晚間。
- Mac 環境；能跑 Node/Next.js（課程 demo 為 Next.js + TypeScript）。
- 無硬性 deadline，中等壓力。
- 每章要能**一次性讀完、可隨時中斷再續**；demo 有空就跟著作，不綁死主進度。

## Knowledge type
mixed，**procedural 為主**。核心是「照講師的節奏學會並能複製這套 workflow」——每一章的交付物（spec、audit、PR、test、document）都要能真的做出來。Declarative 的概念（agent loop、context rot、always-on/on-demand context、skills vs MCP）在課堂操作的脈絡裡講，不空談。

## How to teach me
- **完全 follow 講師的步調與章節順序**——不重排、不合併、不自行跳段；講師先講什麼就先講什麼。
- **架構優先，程式碼為佐證**：先講清楚「這層為什麼存在、產物是什麼」，再用課程 repo（`skills/`、`ai-course-demos/`）的真程式碼對照。
- 已熟的部分（agent loop、context window、MCP、subagents、Claude Code 操作）**略讀**，只補課程特有觀點與操作細節；新內容（JSM 九步驟 workflow、SKILL.md 設計、context engineering 守則、greenfield 全流程）**深教**。
- **簡潔、密度高、不要廢話**；每章能碎片化讀完，結尾落在「真的能跑或真的能決定」的事上。
- 講「為什麼」的機制（為什麼 context 會變笨、為什麼 skill 用 description 觸發、為什麼要 check-verify 再 test）幫我記住「怎麼做」。
- 輸出語言 **zh-Hant**；程式碼、識別字、API 名稱與產品名稱保持英文。
