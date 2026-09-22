---
source: AI时代如何准备面试
source_type: pdf
source_lines: 705
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — AI时代如何准备面试

## Overview (L1)

- Main line — Interviewers' focus is shifting from "can you execute" to "do you have judgement" (判断); execution is outsourced to AI, judgement cannot be. Every point of the talk (what's tested, resume, follow-up logic, what to prepare) extends from this.
- Market context — AI job demand is real: +200% YoY AI applications in 2025Q1, ~4M China AI talent gap by 2030, AI engineer role demand +69.6%; the gap is in engineering landing/systems integration, an opportunity for people with engineering fundamentals.
- What changed / didn't — Tested points move from writing algorithms/APIs to judging AI output, locating problems, justifying trade-offs, and owning outcomes; fundamentals, system understanding, debugging, and articulating problems only matter more.
- Evidence — An Anthropic RCT (52 engineers learning a new library) found the AI group scored 50 vs 67 for the handwritten group, with debugging the widest gap; the danger of AI is that it removes the "stuck" moments where learning happens.
- Practical method — The right way to present AI experience: what I did with AI (execution), what judgements I made (选型/trade-off/rejections), how I verified it (testing/review), and what I'm responsible for. Five actions and a project that survives three-layer follow-up questioning.

## Sections (L2)

### 开场焦虑 + 考察点变化 / 不变
- Locator: `[[sources/geek-ai-agent/20260922/AI时代如何准备面试.pdf#考察点变化与不变]]`
- Summary: The four anxieties ("skilled with AI" means nothing, whose effort is it, exposing yourself under questioning, no coherent project story) resolve into one shift: from execution to judgement.
- Key claims: past tested execution (hand-write algorithms, memorize APIs, implement from scratch, write fast/much); now tests judgement (is AI's output right, fast problem localization, trade-off/selection reasoning, owning results); unchanged and more important — CS fundamentals (OS/network/database), system understanding, debugging, and explaining problems clearly; AI only amplifies the gap between those with and without fundamentals.
- Learner-relevant: Frames the learner's interview preparation around trainable judgement, not tool lists.

### 硬证据 · Anthropic 随机对照实验 + 机理对照
- Locator: `[[sources/geek-ai-agent/20260922/AI时代如何准备面试.pdf#Anthropic随机对照实验与机理]]`
- Summary: Experimental backing for interviewers' instinct, plus the mechanism that makes "skilled with AI" fail.
- Key claims: 52 engineers learned the same new library, AI group averaged 50 vs handwritten 67; debugging was the widest-gap题型; reason — two modes of AI use: "AI-offload" (take the output, never understand; fastest, error-free-looking, hollowed out) vs "understand-after-generation" (have AI write then interrogate why/how to change; preserves capability); the two operations look nearly identical but have opposite outcomes; "stuck points" are where learning happens and AI smooths them away.
- Learner-relevant: Justifies deliberately retaining productive struggle and interrogating AI output.

### 真实面经 · 案例与追问逻辑
- Locator: `[[sources/geek-ai-agent/20260922/AI时代如何准备面试.pdf#真实面经与追问逻辑]]`
- Summary: Concrete real-world questions and the three-layer follow-up structure.
- Key claims: ByteDance third round asks "Claude Code or Copilot, and why" — testing whether there is judgement behind tool choice (a 2026 standard question); a candidate who wrote "called LLM API, built RAG service" froze on three questions (QPS, how to speed retrieval, what if the vector DB dies) and was rejected — companies want people who solve problems and own availability; follow-up is a "verifiability test" separating AI's credit from yours; three layers — what (most pass), why (why this choice/what was traded; offloaders get stuck), what if it changes (new requirements, 10x pressure, failure — only true system understanding answers).
- Learner-relevant: Gives the learner the exact questioning pattern to rehearse against.

### 真实面经 · 拿到 OFFER 的回答 + 大厂在考什么 / JD 拆解
- Locator: `[[sources/geek-ai-agent/20260922/AI时代如何准备面试.pdf#拿到offer的回答与大厂JD]]`
- Summary: A model answer and cross-cutting job descriptions.
- Key claims: the offer-winning answer states the trade-off with numbers (CoT decomposed complex questions poorly → switched to ReAct, +15% accuracy; ToT worked but 3x tokens, so only offline) — explaining why, not reciting concepts; DeepSeek sets up an "Agent Harness" team benchmarking Claude Code; ByteDance multi-agent framework for review systems; Ant PaaS agent platform requiring multi-agent orchestration; Meituan LLM application backend with agent evaluation standards; a JD decomposed — heavy Claude Code/Cursor use with internal mechanism understanding, agent runtime/container/trajectory replay debugging, Docker/K8s/CI/CD/Git as hard requirements, context window/token mechanics, MCP/Tool Use/Function Calling as plus; "not someone who can use AI, but someone who can make AI into a reliable system and own results."
- Learner-relevant: Shows exactly what top employers test and how to read a JD.

### 认清赛道 + 技术地图 + Debug 能力
- Locator: `[[sources/geek-ai-agent/20260922/AI时代如何准备面试.pdf#认清赛道与技术地图]]`
- Summary: "Agent engineer" is a class of roles, the converging 2026 skill tree, and why debugging is the hardest currency.
- Key claims: application dev / infra platform / algorithm / evaluation / product PM / multimodal; LangChain still first but LangGraph+MCP is production standard, 89% of teams do observability; stacking framework names is an HR template-copy tell; the skill tree — engineering base (Docker/K8s/CI-CD/Git), agent core (ReAct loop, Function Calling/Tool Use, MCP, context/token, memory), systems (REST/gRPC, microservices, MQ, vector DB, concurrency/cost), observability and LLM-as-a-Judge evaluation; framework names are 术 (change), making agents into reliable systems is 道 (persists); AI can write "looks right" code but "why wrong/where wrong" is judgement, not generation — debug makes you the AI-era quality inspector, not a rubber stamp.
- Learner-relevant: A target skill map and the case for deep debugging practice.

### 转岗 · 大趋势 / 后端 / 前端 / 避坑
- Locator: `[[sources/geek-ai-agent/20260922/AI时代如何准备面试.pdf#转岗路径与避坑]]`
- Summary: Transfer pathways and common traps.
- Key claims: polarization — pure algorithm and pure backend roles under pressure, the middle "engineering + AI" composite profile is the biggest gap and 2026's golden window; backend experience transfers directly (high concurrency/microservices, cost control, high availability/degradation, e.g. "keep an LLM service at 99.9% / control cost at 10x traffic" is the API-caller vs AI-architect divider); front-end transfers state management→agent state/memory, async/stream→streaming output/tool calls, schema→Function Calling/structured output, user flows→task planning; three traps — fixating on low-level algorithms (PyTorch/backprop/GPU clusters are for researchers), collecting tutorials without building, resume saying only "called APIs."
- Learner-relevant: Helps the learner pick a realistic transfer path and avoids wasted effort.

### 表达公式 + 强弱讲法 + 五件事 + 长期
- Locator: `[[sources/geek-ai-agent/20260922/AI时代如何准备面试.pdf#表达公式与行动]]`
- Summary: How to talk about AI experience, a before/after example, five actions, and the long-term rule.
- Key claims: formula — (1) what I did with AI, (2) what judgements I made (selection/trade-offs/rejections), (3) how I verified it (testing/review/what I found and fixed), (4) results and my responsibility; weak vs strong telling of the "order service" experience (strong: defined concurrency model, judged optimism lock wrong for write-heavy, switched to segmented lock, load-tested, found a connection leak); five actions — treat AI as a teacher not a ghostwriter, deliberately retain stuck points, every project can state "where my judgement was," root into deep water (system design/distributed/debug/compliance), build a real project that survives three-layer questioning; long term — what matters is not "can you use AI" but "can you own results."
- Learner-relevant: A directly reusable resume/interview narrative template and preparation checklist; also frames the bootcamp's four projects as interview-ready evidence.
