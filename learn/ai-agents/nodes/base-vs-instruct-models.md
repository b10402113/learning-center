---
id: base-vs-instruct-models
title: 基础模型与指令模型
subject: ai-agents
tier: 1
order: 5
paths:
  - ai-agents/llm-engine
sources:
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.4]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]]"
created: 2026-08-09
updated: 2026-08-09
---

# 基础模型与指令模型

## Big picture
"LLM"不是一个东西，而是一条生产线上的两种产物：先在海量文本上预训练出**基础模型（base / foundation model）**——它只会续写、不会听话；再经过**微调（fine-tuning / post-training）**得到**指令模型 / 对话模型（instruct / chat model）**——它才会回答你的问题。你日常打交道的 ChatGPT、Claude，几乎都是指令模型。

## The idea
传统机器学习是一步到位：为某个特定任务（如分类）收集结构化数据，直接训练出模型。LLM 走的是**两步路线**，这是它在训练范式上最本质的区别：

**第一步：预训练（pretraining）。** 在海量互联网文本上做"预测下一个词"的语言建模，消耗绝大部分算力和时间。这一阶段不针对任何具体任务，产出的就是**基础模型 / 基座模型**。基础模型通常**不遵循指令**——给它一句"告诉我羊驼的事"，它大概率不是回答问题，而是把它当作文本去续写。书中例子：Llama 2 在 2 万亿词元的数据集上预训练，成本极其高昂。

**第二步：微调（fine-tuning / post-training）。** 在基础模型之上，用更小、更针对性的有监督数据继续训练，让模型适配特定任务或行为——最常见的就是学会**遵循人类指令**，成为指令模型或对话模型。因为预训练已被别人烧过钱，微调能帮普通人在自己数据上获得专用模型，这也是 LoRA 等高效微调存在的意义（第 12 章展开）。

换个角度看：基础模型是"补全模型（completion model）"，看到输入就续写最可能的下一段；指令模型接收提示词，输出的是"最可能符合该提示词的回答"。二者底层都是[[learn/ai-agents/nodes/autoregressive-decoding|自回归]]逐词元生成，区别在训练目标与数据，不在架构。GPT 系列正是从"生成式预训练"起家——名字里的 Generative 与 Pre-Training 就是这条路线。

## Why it matters / when it applies
选模型、看模型卡、读论文时，第一要问的就是"这是 base 还是 instruct/chat 版"——拿基础模型当聊天机器人用，效果会非常糟糕。写代码或调用 API 时注意区分模型名后缀（如 `-instruct`、`-chat`、`-base`）。同时，微调给"把通用模型变成领域专属"提供了可行路径，这也是判断"该用现成模型还是自己微调"时的重要背景知识。

## Connections
- [[learn/ai-agents/nodes/autoregressive-decoding|自回归解码：逐词元生成]] — 基础与指令模型共享同一套自回归生成机制，区别在训练数据与目标
- [[learn/ai-agents/nodes/hallucination|幻觉：为什么智能体需要护栏]] — 微调能让模型更会"听话"，但不会消灭其编造倾向，护栏仍然必要
- [[learn/ai-agents/nodes/tokenization|词元与分词器]] — 指令模型常依赖特殊词元（如 `<|assistant|>`）标记角色边界，这来自它的对话式训练格式

## Deep dive
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.4]] — 传统一步式训练 vs LLM 两步式训练（预训练 → 微调）的对比图
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]] — 从"自动补全"到"回答问题"：指令模型与对话模型由何而来

## Check yourself
- 基础模型和指令模型在训练过程上有什么相同与不同？为什么基础模型"不听话"？
- 什么时候你会坚持用基础模型而非指令模型？什么场景必须用指令模型？
- "补全模型"和"指令模型"的称呼分别强调了这个模型的什么行为？

## Answers
- 相同点：都是自回归的仅解码器 Transformer；不同点：基础模型只做无任务预训练，指令模型还经过了有监督微调以遵循指令，所以更"听话"。
- 当需要研究续写特性、做底层研究或需要原始生成能力时可能用基础模型；凡是面向用户、要完成任务与遵循指令的智能体应用，都该用指令/对话模型。
- "补全模型"强调它会续写输入文本，"指令模型"强调它输出的是回应提示词意图的答案——同一机制，不同训练目标。
