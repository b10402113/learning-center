---
id: context-window
title: 上下文窗口
subject: ai-agents
tier: 1
order: 4
paths:
  - ai-agents/llm-engine
sources:
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.4]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.5]]"
created: 2026-08-09
updated: 2026-08-09
---

# 上下文窗口

## Big picture
上下文窗口（context window，也称上下文长度）是模型一次能处理的最大词元数。它划定了"模型一次能『看得见』多少内容"的边界——既是能力的上限，也是智能体设计中记忆、检索和长度控制的源头约束。

## The idea
Transformer 的一个突出特性是**并行处理输入词元**：每个输入词元都有一条独立的计算流，上下文长度就是"一次能同时跑多少条流"。一个 4K 上下文的模型只能处理 4000 个词元，也就是 4000 条流。

每条流从一个输入向量（词元嵌入 + 位置信息）开始，流经所有 Transformer 块后，在末尾产生一个输出向量。**对文本生成来说，只有最后一条流的输出向量被喂给语言建模头来预测下一个词元**——那为什么要算前面所有流？因为前面的流会在每个块的注意力机制里为最终流提供信息。

上下文窗口会"长大"：由于自回归生成，每生成一个词元就把它拼回输入，当前上下文长度随之增加（见 [[learn/ai-agents/nodes/autoregressive-decoding|自回归解码]]）。窗口不是静态的输入槽，而是"提示词 + 已生成词元"的总和。

窗口还有一个工程上的意义——**键值缓存（KV cache）**。生成第二个词元时，如果没有缓存，前面所有流的计算要全部重做；有了缓存，只有最后一条流是活跃的，其余直接复用。书中实测：生成 100 个词元，启用缓存 4.5 秒，禁用缓存 21.8 秒，差距近 5 倍。这也是 LLM API 会**流式输出**词元、而非等全部生成完的原因。

## Why it matters / when it applies
上下文窗口决定三件智能体大事：能塞进多少系统提示词和对话历史（影响记忆设计）、能带多少检索文档（影响 RAG 的分块与数量）、生成长度上限（影响输出与费用）。长对话"越聊越笨"、RAG 检索结果"装不进去"，几乎都是窗口撞顶了。设计智能体时，第一件事就是盘点"窗口里放了什么、占了多少词元"。

## Connections
- [[learn/ai-agents/nodes/tokenization|词元与分词器]] — 窗口以词元为单位，理解分词才能估算占用
- [[learn/ai-agents/nodes/autoregressive-decoding|自回归解码：逐词元生成]] — 生成使上下文增长，输入与输出共享同一个窗口
- [[learn/ai-agents/nodes/embeddings|嵌入：语义的数值表示]] — 每条计算流从词元嵌入向量起步，窗口决定流的数量上限

## Deep dive
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.4]] — 并行计算流与 4K 上下文的具体含义
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.5]] — KV 缓存把 21.8 秒压到 4.5 秒的实测
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]] — 上下文长度的概念与"生成时窗口增长"

## Check yourself
- 上下文长度、计算流数量、输入词元数三者是什么关系？"4K 上下文"意味着什么？
- 为什么生成时要缓存键值对，而不是把之前的流重算一遍？缓存与否对用户感受影响多大？
- 长对话或 RAG 里，什么时候你会主动去估算"窗口里现在有多少词元"？

## Answers
- 4K 上下文 = 一次最多 4000 条计算流 = 提示词与已生成词元合计不超过 4000 个词元。
- 缓存复用前面流的注意力结果，只算最后一条流；书中 100 词元生成从 21.8 秒降到 4.5 秒，所以 API 会流式输出。
- 当对话历史越积越多、或要往提示词里塞大量检索文档时，先算词元占用，避免撞上窗口上限。
