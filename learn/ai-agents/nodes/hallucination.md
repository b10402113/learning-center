---
id: hallucination
title: 幻觉：为什么智能体需要护栏
subject: ai-agents
tier: 1
order: 6
paths:
  - ai-agents/llm-engine
sources:
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.6]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.3]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]]"
created: 2026-08-09
updated: 2026-08-09
---

# 幻觉：为什么智能体需要护栏

## Big picture
幻觉（hallucination）是 LLM 用非常流畅、自信的语气编造出与事实不符内容的倾向。它根植于模型的训练与生成机制本身：模型学的是"文本续写模式"，不是"世界事实库"。因此幻觉无法靠"更听话"根除，智能体必须在模型之外加护栏——这就是工具、检索、约束等一切工程手段存在的理由。

## The idea
要理解幻觉，回到模型真正在做什么：[[learn/ai-agents/nodes/autoregressive-decoding|自回归解码]]下，模型只是根据上下文为下一个词元打概率分，然后按[[learn/ai-agents/nodes/base-vs-instruct-models|解码策略]]采样一个。它内部根本没有"这句话是否真实"的验证环节——它的目标函数是"文本看起来像什么"，不是"事实是什么"。书中明确提醒：LLM 生成的内容不一定是真实的，且它们可能"自信地"输出错误的文本。

为什么会"自信"？因为训练时，模型见过的真实文本本身就用笃定的口吻陈述，模型学到了"流畅、肯定"这种文风，而采样机制又让它有能力把低概率的编造也说出来。微调可以改善行为（让它少说越界的话、更贴合指令），但无法消除这种倾向——幻觉是**自回归 + 采样 + 语言建模目标**的结构性产物，而不是一个可以修补的 bug。

那智能体怎么办？**不指望模型，而是在它周围修护栏**：
- **工具（tool）**：让它调用搜索引擎、计算器、数据库，用外部真实结果替代内部猜测；
- **检索（RAG）**：把相关文档带进上下文，让答案"有据可依"（本书第 8 章）；
- **约束与评估**：约束输出格式、设置上限、用指标和 LLM-as-judge 检查忠实度（第 8 章、第 12 章）。

护栏的本质是：承认模型是不完美的事实源，把"事实来源"挪到模型之外、可验证的地方。

## Why it matters / when it applies
只要输出会被当作事实使用（报告、客服、代码、医疗/财务建议），就要把"防幻觉"当作第一设计约束。判断一个智能体系统是否可靠，就看它有没有把关键事实从"模型记忆"迁移到"外部来源 + 验证"。你还会在调参时遇到它：温度、采样等解码设置影响输出的多样性，但不会根除幻觉。

## Connections
- [[learn/ai-agents/nodes/autoregressive-decoding|自回归解码：逐词元生成]] — 采样式逐词元生成是幻觉的直接机制来源
- [[learn/ai-agents/nodes/base-vs-instruct-models|基础模型与指令模型]] — 微调让模型更会遵循指令，但改变不了它"会编造"的底层倾向
- [[learn/ai-agents/nodes/context-window|上下文窗口]] — 窗口里信息不足、提示词缺失关键事实时，模型更容易凭概率"填坑"编造

## Deep dive
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.6]] — 负责任的 LLM：生成内容不一定是真实的，且可能"自信地"输出错误文本
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.3]] — 采样与贪心的取舍：多样性带来的副作用之一就是幻觉
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]] — 生成式 LLM 本质是"补全"，补全不以事实为准

## Check yourself
- 幻觉与自回归生成机制之间的关系是什么？为什么微调不能根除幻觉？
- 判断一个智能体系统是否防住幻觉，你会看它的哪些设计？
- 同样的提示词，为什么温度调高往往更"敢编"？

## Answers
- 模型按概率采样下一个词元、目标函数只在乎文本像不像样，从不验证事实；微调改变的是行为倾向与指令遵循，不改变这种底层生成机制。
- 看关键事实是否来自外部来源（工具/检索）、输出是否有约束与上限、是否有忠实度/引用类的验证环节。
- 温度越高采样越随机，越可能选中概率低的"编造"词元；反之接近贪心会更保守，但也不能保证正确。
