---
id: tokenization
title: 词元与分词器
subject: ai-agents
tier: 1
order: 1
paths:
  - ai-agents/llm-engine
sources:
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.1.1]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.1.3]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.1.4]]"
created: 2026-08-09
updated: 2026-08-09
---

# 词元与分词器

## Big picture
词元（token）是语言模型看到和处理文本的基本单位，往往既不是"字"也不是"词"。分词器（tokenizer）把文本切成词元并映射成整数 ID，是模型与文本之间的唯一翻译官。词元决定计费、生成长度与上下文窗口的数值，是一切 LLM 行为的度量单位。

## The idea
模型并不直接"读"文字。它读到的是分词器输出的词元 ID 列表（如 `tensor([[1, 14350, 385, ...]])`），每个整数是分词器词表中某个词元的唯一编号。你之前用 ChatGPT 时可能已经注意到模型是"一小块一小块"地生成文字——这些小块就是词元。

分词器做两件事：**编码**（文本 → 词元 ID）和**解码**（ID → 文本）。输入提示词先被分词，模型生成的 ID 也要靠分词器还原成可读文本。

词元不总等于单词。一个完整单词（Write）、单词的一部分（apolog / izing / trag / ic）、标点（.）都可能各是一个词元。常见的子词级分词（subword tokenization，如 GPT 用的 BPE、BERT 用的 WordPiece）用"词根 + 后缀"的共享词元，因此能表达新词、词表更高效——比如 `apology`、`apologize`、`apologetic` 共用一个 `apolog` 词元加不同后缀。相比词级分词（word2vec 时代）、字符级分词和字节级分词，子词级是当前主流。

分词器是在特定数据集上训练出来的，并与模型绑定：换模型通常要换配套分词器，因为模型为词表中的每个词元都保存了嵌入向量。

## Why it matters / when it applies
词元是"语言模型的计量单位"：API 按词元收费、上下文窗口按词元计数、`max_new_tokens` 按词元限长。想理解一次 LLM 调用"做了什么"，先要知道"多少个词元进去了、多少出来了"。遇到计费、长度截断、速度、输出中断这类问题，第一反应都应该是回到词元视角。

## Connections
- [[learn/ai-agents/nodes/embeddings|嵌入：语义的数值表示]] — 词元之后紧跟着的就是嵌入：模型为词表中每个词元保存一个向量
- [[learn/ai-agents/nodes/autoregressive-decoding|自回归解码：逐词元生成]] — 模型每次只预测并生成一个词元，分词器负责把生成的 ID 还原成文字
- [[learn/ai-agents/nodes/context-window|上下文窗口]] — 上下文长度以"能容纳多少个词元"来度量

## Deep dive
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.1.1]] — 完整的编码示例：加载 Phi-3 与配套分词器、打印逐词元解码
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.1.3]] — 决定分词行为的三个因素：分词方法、设计选择、训练数据集
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.1.4]] — 词级、子词级、字符级、字节级四种分词的对比图

## Check yourself
- 为什么说"词元既不是字也不是词"？子词级分词相比词级分词解决了什么问题？
- 什么时候值得关心一个模型用的是哪种分词方案（例如写提示词、估算成本、排查输出被截断）？
- 分词器在输入端和输出端分别扮演什么角色？为什么生成的 ID 必须经过 decode 才能读？

## Answers
- 词元是分词器切出来的最小单元，一个词元可以是完整词、词的一部分或标点；子词级分词用共享的子词表达新词，词表更紧凑、不会遇到"没见过的新词"。
- 当你按词元计费、需要控制上下文长度、或遇到模型不按预期输出格式时，回到词元视角排查最有效。
- 输入时编码（文本→ID）喂给模型，输出时解码（ID→文本）还原给用户；模型内部只处理 ID 序列。
