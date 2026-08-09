---
id: embeddings
title: 嵌入：语义的数值表示
subject: ai-agents
tier: 1
order: 2
paths:
  - ai-agents/llm-engine
sources:
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.2]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.2.1]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.3]]"
created: 2026-08-09
updated: 2026-08-09
---

# 嵌入：语义的数值表示

## Big picture
嵌入（embedding）是把文本变成一串数字向量、让"含义"变成"可计算的相似度"的核心技术。词元嵌入、词嵌入、文本嵌入分别服务于词元、单词与整段文本。它是词元之后模型真正处理的东西，也是后面语义搜索与 RAG 的数学底座。

## The idea
模型算不了文字，但算得了数字。嵌入的目标就是把文本映射为一个固定长度的向量，让**含义相近的文本在向量空间中彼此靠近**。

历史起点是 word2vec（2013）：用一个浅层神经网络，从"哪些词倾向于相邻出现"中学习词嵌入。训练后，`cat` 与 `puppy` 的向量会靠近，`apple` 与 `baby` 的向量会远离。你可以把每个向量维度理解为一个"属性/概念"（如 animal、newborn、fruit），虽然真实维度高度抽象，但这个直觉够用。有了向量就能用距离度量语义相似度——`king` 的最近邻是 `prince`、`queen`、`emperor`。

现代 LLM 里嵌入分三个层次：

- **词元嵌入（token embeddings）**：模型为分词器词表中的每个词元保存一个向量，下载预训练模型时，这些向量构成嵌入矩阵。
- **上下文相关嵌入（contextualized embeddings）**：LLM 不再给每个词元一个静态向量，而是结合上下文动态生成——同一个词在不同句子里表示不同。这类向量由 Transformer 块输出（如 DeBERTa 对 "Hello world" 输出 `[1, 4, 384]`：4 个词元、每词元 384 维）。
- **文本嵌入（text embeddings）**：把整句/整段编码成单个向量。简单的做法是平均所有词元嵌入，但高质量的文本嵌入模型（如 `all-mpnet-base-v2`）是专门为此训练的，可把 "Best movie ever!" 变成 768 维向量。

## Why it matters / when it applies
嵌入让"含义"第一次变得可运算：能算相似度、能聚类、能检索。在智能体里，它是 RAG 检索（第 8 章）和语义搜索的核心——先把文档库转成向量，再把用户查询转成向量，用距离找最相关内容。当你需要"按意思找东西"而不是"按关键词找东西"时，就该想到嵌入。

## Connections
- [[learn/ai-agents/nodes/tokenization|词元与分词器]] — 词元嵌入与分词器词表一一绑定，二者不可拆分
- [[learn/ai-agents/nodes/autoregressive-decoding|自回归解码：逐词元生成]] — 每条计算流从嵌入向量出发，流经 Transformer 块后再进入语言建模头
- [[learn/ai-agents/nodes/context-window|上下文窗口]] — 上下文长度限制的是"多少条以嵌入向量为起点的计算流"

## Deep dive
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.2]] — word2vec 的训练直觉：预测相邻词，让相近词向量靠拢
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.2.1]] — 词元嵌入矩阵：模型为词表每个词元保存一个向量
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.3]] — 用 sentence-transformers 生成 768 维文本嵌入的可运行示例

## Check yourself
- 词元嵌入、上下文相关嵌入、文本嵌入三者服务的对象和生成方式有何不同？
- 什么时候用"平均所有词元嵌入"就够了，什么时候必须用专门训练的文本嵌入模型？
- 为什么说"含义相近的文本在向量空间中靠近"是嵌入最可用的性质？

## Answers
- 词元嵌入是每个词元一个静态向量（查表）；上下文相关嵌入由 LLM 结合上下文动态生成；文本嵌入把整段文本压缩成单个向量。
- 做简单 demo 或成本受限时可先平均；要可靠地做语义搜索、聚类、RAG 时，用专门训练的文本嵌入模型效果更好。
- 因为它让我们能用距离/相似度把"语义接近"变成可计算的量，这是检索和推荐的根基。
