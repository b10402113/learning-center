---
id: llm-engine
title: 大语言模型：智能体的引擎
subject: ai-agents
tier: 1
order: 1
duration: 10-15 minutes
status: edges-written
goal: 能说清一次 LLM 调用到底做了什么——词元、嵌入、自回归解码、上下文窗口、基础模型 vs 指令模型，以及为什么"幻觉"让智能体必须加护栏。
sources:
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.2]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.4]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.1]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.3]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.1]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.4]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.5]]"
  - "[[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.6]]"
nodes:
  - ai-agents/tokenization
  - ai-agents/embeddings
  - ai-agents/autoregressive-decoding
  - ai-agents/context-window
  - ai-agents/base-vs-instruct-models
  - ai-agents/hallucination
created: 2026-08-09
updated: 2026-08-09
---

# 大语言模型：智能体的引擎

## Learning goal
能说清一次 LLM 调用到底做了什么——词元、嵌入、自回归解码、上下文窗口、基础模型 vs 指令模型，以及为什么"幻觉"让智能体必须加护栏。

## Nodes
- [[learn/ai-agents/nodes/tokenization|词元与分词器]]
- [[learn/ai-agents/nodes/embeddings|嵌入：语义的数值表示]]
- [[learn/ai-agents/nodes/autoregressive-decoding|自回归解码：逐词元生成]]
- [[learn/ai-agents/nodes/context-window|上下文窗口]]
- [[learn/ai-agents/nodes/base-vs-instruct-models|基础模型与指令模型]]
- [[learn/ai-agents/nodes/hallucination|幻觉：为什么智能体需要护栏]]

## Lesson

### 先问一个问题：一次 LLM 调用到底做了什么？

你在聊天框里输入一句话，回车，模型开始"打字"——这背后其实是一连串可拆解的步骤。这一课把整条链路拆开看一遍。看懂它，你就有了判断任何智能体框架（包括你天天在用的 opencode、Claude Code）优劣的第一块基石：它们都只是在这条链路上加了工程外壳。

### 第一步：把文本切成词元

模型并不"读"文字。你的输入先经过**分词器**被切成**词元**——一个词元可能是完整单词、单词的一部分，甚至只是标点。每个词元被映射成一个整数 ID，模型真正处理的是一串 ID。

这是整条链路的计量单位：API 按词元收费、上下文按词元计数、生成长度按词元截断。你看到模型"一个词一个词往外蹦"，因为它的输出单位本来就是词元。详见 [[learn/ai-agents/nodes/tokenization|词元与分词器]]。

### 第二步：把词元变成向量

模型算不了文字，但算得了数字。每个词元进入模型前先被替换成自己的**嵌入向量**——一串固定长度的数字，让"含义相近的词在向量空间里彼此靠近"（`cat` 靠近 `puppy`，远离 `apple`）。这是 word2vec 以来的老思路，如今 LLM 更进一步：不再给每个词一个静态向量，而是结合上下文动态生成。把整段文本压成单个向量的**文本嵌入**，则是后面 RAG 检索的地基。详见 [[learn/ai-agents/nodes/embeddings|嵌入：语义的数值表示]]。

### 第三步：自回归地"猜下一个词元"

模型本身只是一台"预测下一个词元"的机器。它对词表里**每一个**词元打分（`Dear` 40%、`Title` 13%、`To` 8%……），按**解码策略**挑一个输出，再把它拼回输入、重复。这就是**自回归解码**——一次只生成一个词元，用已生成的去预测下一个。这也解释了为什么同一提示词多次回答可能不同：采样引入了随机性。详见 [[learn/ai-agents/nodes/autoregressive-decoding|自回归解码：逐词元生成]]。

### 一个硬边界：上下文窗口

模型一次能同时处理多少词元是有限度的，这个限度叫**上下文窗口**。4K 上下文 = 一次最多 4000 条词元计算流，而且因为自回归，每生成一个词元窗口就增长一格。工程上，**KV 缓存**让长生成从 21.8 秒压到 4.5 秒，这也是 API 会流式输出的原因。长对话"越聊越笨"、检索文档"塞不进去"，几乎都是撞上了窗口。详见 [[learn/ai-agents/nodes/context-window|上下文窗口]]。

### 模型从哪来：基础模型 vs 指令模型

你用的 LLM 是两步训练出来的。先在海量文本上预训练出**基础模型**——它只会续写、不听话；再微调成**指令模型 / 对话模型**——它才会回答你的问题。同一套自回归架构，差别在训练数据和目标。这也是为什么拿 `base` 模型当聊天机器人用会一塌糊涂：模型名后缀里的 `-instruct`、`-chat` 不是装饰。详见 [[learn/ai-agents/nodes/base-vs-instruct-models|基础模型与指令模型]]。

### 最后也是最关键的：幻觉，为什么智能体必须加护栏

把前四步串起来看，答案已经呼之欲出：模型的目标函数是"下一个词像不像样"，**不是**"这句话真不真实"。它没有验证事实的环节，所以它会流畅、自信地编造——这就是**幻觉**。微调能让它更听话，却根除不了这种倾向，因为它是自回归 + 采样 + 语言建模的结构性产物。

所以真正的智能体从不裸用模型。它在模型周围修护栏：用**工具**调用搜索引擎、计算器取真实结果；用**检索（RAG）**把相关文档带进上下文；用约束和评估检查输出忠实度。护栏的本质，是把"事实来源"从模型的记忆里搬到外部可验证的地方。详见 [[learn/ai-agents/nodes/hallucination|幻觉：为什么智能体需要护栏]]。

### 把这一课接到你的目标上

回到你天天用的 opencode：你给它一句话，它"思考"、调工具、读文件、分步执行——这就是后续课程要讲的**提示工程**（怎么让模型想得更可靠）、**ReAct 循环**（思考—行动—观察）和 **RAG**（给模型事实依据）。这一课建立的发动机视角，是所有工程外壳下面那个共同的引擎：词元 → 嵌入 → 自回归 → 上下文窗口 → 指令化 → 幻觉护栏。先跑通这条链路的心智模型，再去读任何智能体框架都会容易得多。

## Sources
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.2]]
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.2.7]]
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.4]]
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.1]]
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#2.3]]
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.1]]
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.4]]
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#3.1.5]]
- [[sources/ai-agents/图解大模型：生成式AI原理与实战 (Jay Alammar, Maarten Grootendorst, [沙特] 杰伊 阿拉马尔 etc.) (Z-Library).pdf#1.6]]
