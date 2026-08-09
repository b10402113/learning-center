---
id: autoregressive-decoding
title: 自回归解码：逐词元生成
subject: ai-agents
tier: 1
order: 3
paths:
  - ai-agents/llm-engine
sources:
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.1]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.3]]"
created: 2026-08-09
updated: 2026-08-09
---

# 自回归解码：逐词元生成

## Big picture
生成式 LLM 的核心不是"一次写完一段话"，而是一次只预测并生成**一个词元**，把刚生成的词元拼回输入，再预测下一个——这个循环叫自回归（autoregressive）解码。它是"LLM 到底怎么输出文本"这个问题最直接的答案。

## The idea
从外部看，LLM 接收提示词、输出回答。拆开看，模型其实只是个"预测下一个词元"的机器：它读取当前全部输入词元，为词表中的**每一个**词元打一个概率分（比如 `Dear` 40%、`Title` 13%、`To` 8%……），然后按某种解码策略挑一个，输出；再把输出词元追加到提示词末尾，重复整个过程。

生成 "Dear Sarah," 时，实际发生了多次前向传播：第 1 步出 `Dear`，第 2 步把它拼回去出 `Sarah`，第 3 步出 `,`，第 4 步出换行符。输出突然停止通常不是"想完了"，而是撞上了 `max_new_tokens` 之类的长度上限。

**架构三件套**支撑这个过程：
1. **分词器** — 文本 ↔ 词元 ID（见 [[learn/ai-agents/nodes/tokenization|词元与分词器]]）
2. **堆叠的 Transformer 块** — 每个输入词元一条计算流，流经所有块（见 [[learn/ai-agents/nodes/embeddings|嵌入]] 与上下文窗口）
3. **语言建模头（lm_head）** — 把最后一个词元的输出向量变成"词表中每个词元一个概率"的分数列表

**解码策略决定怎么从概率里挑一个**：贪心解码永远选概率最高者（等价于 temperature=0）；更好的做法是按概率**采样**，让低概率词元也有机会被选中，输出更自然、更多样。采样是"同样一个提示词，模型每次回答不同"的根本原因。

## Why it matters / when it applies
自回归特性解释了智能体调试中最常见的一批现象：回答是逐步生成的（所以能流式输出）、每次结果可能不同（采样）、输出长度受 `max_new_tokens` 控制、上下文随生成不断变长（见 [[learn/ai-agents/nodes/context-window|上下文窗口]]）。只要你在写 `model.generate(...)`、调温度参数、或者纠结"为什么这次和上次不一样"，就是在和自回归打交道。

## Connections
- [[learn/ai-agents/nodes/tokenization|词元与分词器]] — 自回归每次预测的是"下一个词元 ID"
- [[learn/ai-agents/nodes/embeddings|嵌入：语义的数值表示]] — 词元进入模型后先被换成嵌入向量，再流经计算流
- [[learn/ai-agents/nodes/context-window|上下文窗口]] — 每次生成都把新词元拼回输入，上下文随之增长
- [[learn/ai-agents/nodes/hallucination|幻觉：为什么智能体需要护栏]] — 采样式生成必然带来"自信地编造"，是幻觉的机制根源

## Deep dive
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.1]] — 逐词元生成的四步示意图与自回归定义
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.3]] — 解码策略：贪心 vs 采样，以及 temperature 与概率分布的关系
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]] — 仅解码器（GPT）架构为何天然适配这种逐词元补全

## Check yourself
- 自回归解码与"一次生成整段文本"的本质区别是什么？它和 BERT 这类表示模型有何不同？
- 什么时候该把 temperature 设低（趋向贪心），什么时候设高？为什么采样会导致同一提示词多次输出不同？
- 为什么模型在 `max_new_tokens` 用尽时会"戛然而止"？

## Answers
- 自回归是一次预测并追加一个词元、再基于累积输入预测下一个；它用"早期预测去产生后续预测"。BERT 不做文本生成，而是产出表示，属于非自回归。
- 需要稳定、确定、格式严格时（如结构化输出、工具调用参数）调低；需要多样、创意输出时调高。采样按概率抽取，所以同一提示词结果可能不同。
- 因为生成是循环逐词元的，长度上限一到循环就停，并非模型"说完"了。
