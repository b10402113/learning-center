---
subject: ai-agents
status: draft            # draft → confirmed
created: 2026-08-09
---

# ROADMAP — AI Agents

## Goal
端到端地构建并真正跑起来一个可工作的 ReAct 式智能体系统：能做计划、调用工具（如搜索引擎、计算器），跨多轮对话持有记忆，并能基于检索到的文档（RAG）生成有依据的回答。跑起来之后，能说清每个组件在"智能体"里负责什么，也能判断现有框架的好坏。

## How to use
按顺序阅读各 path。每个 path 是一节 10–15 分钟的课。运行 `/nodes ai-agents/<path-id>` 即可确认该 path 并开始节点抽取与文章撰写。

## Paths

### Tier 1 — 心智模型：智能体的引擎
1. **[[learn/ai-agents/paths/llm-engine|大语言模型：智能体的引擎]]** — 10–15 分钟
   - Goal: 能说清一次 LLM 调用到底做了什么——词元、嵌入、自回归解码、上下文窗口、基础模型 vs 指令模型，以及为什么"幻觉"让智能体必须加护栏。
   - Sources:
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.4]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.3]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.4]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.5]]

2. **[[learn/ai-agents/paths/prompting-reasoning|提示工程与推理：让模型"先思考再动手"]]** — 10–15 分钟
   - Goal: 能写出结构化提示词（角色 / 指令 / 上下文 / 格式），用少样本与思维链让模型输出更可靠，并会用自洽性、思维树与输出约束控制"思考"的质量。
   - Sources:
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#6.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#6.3.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#6.3.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#6.3.3]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#6.4]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#6.5]]

### Tier 2 — 智能体的核心机制
3. **[[learn/ai-agents/paths/react-loop|智能体核心：ReAct 思考—行动—观察循环]]** — 10–15 分钟
   - Goal: 能解释并复现一个 ReAct 智能体：为什么 LLM 需要工具、Thought / Action / Observation 循环如何运作、在 LangChain 里如何声明工具并用 AgentExecutor 把它跑起来。
   - Sources:
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.4]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.4.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.4.2]]

4. **[[learn/ai-agents/paths/chains-memory|链与记忆：把多步行为与跨轮上下文组装起来]]** — 10–15 分钟
   - Goal: 能用提示词模板与多提示词链把复杂任务拆成有序子任务，并能在对话缓冲区、窗口式缓冲区、对话摘要三种记忆方案中为智能体挑选合适者并说清权衡。
   - Sources:
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.2.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.2.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.3]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.3.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.3.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.3.3]]

5. **[[learn/ai-agents/paths/retrieval-rag|检索与 RAG：给智能体事实依据]]** — 10–15 分钟
   - Goal: 能构建一个最小 RAG（分块 → 嵌入 → 向量检索 → 重排 → 基于上下文生成），并知道查询改写、多查询、多跳、查询路由等高级技术分别在什么场景用。
   - Sources:
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#8.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#8.2.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#8.2.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#8.2.3]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#8.3]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#8.3.4]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#8.3.5]]

### Tier 3 — 实施与深度
6. **[[learn/ai-agents/paths/build-agent|组装并评估一个可运行的智能体]]** — 10–15 分钟
   - Goal: 把本书全部组件（模型 IO + 提示词模板 + 记忆 + 检索 + 工具 + ReAct 循环）端到端组装成一个可运行的智能体，并用 LLM-as-judge、忠实度 / 引用指标评估其质量。
   - Sources:
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#7.4.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#8.3]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#8.3.5]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#12.4]]

7. **[[learn/ai-agents/paths/training-and-rl|训练视角：智能体的能力从何而来]]** — 10–15 分钟
   - Goal: 能说清"预训练 → 监督微调 → 偏好调优"三步、LoRA / QLoRA、PPO 与 DPO 的区别，并理解大规模强化学习（如 DeepSeek-R1 的可验证奖励）如何炼出"会思考"的模型。
   - Sources:
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#12.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#12.2.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#12.3]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#12.5]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#12.6]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#12.7]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#A.2.1]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#A.2.2]]
     - [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#A.2.3]]

## Status
- [ ] Roadmap and paths confirmed
- [ ] Nodes and path articles written
- [ ] Edges written
