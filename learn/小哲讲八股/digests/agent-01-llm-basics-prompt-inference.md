---
source: 小哲八股-大模型基础提示词与推理
source_type: codebase
source_lines: 1613
language: markdown
file_count: 29
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — 大模型基础 / 提示词工程 / 模型推理与性能优化

## Overview (L1)

- LLM 基础与 Transformer 架构 — LLM 是概率预测机，靠规模跨越阈值后涌现推理能力；Transformer 以 Self-Attention 抛掉循环、获得全局视野与并行能力，GPT/BERT/T5 是 Encoder/Decoder 的不同取舍（文件 1–5）。
- 规模与参数 — 参数量决定对高维世界知识的压缩容量与涌现阈值，但受 Chinchilla 定律约束，需与数据量匹配，且推理成本随参数线性放大（文件 6、7）。
- 训练流水线：预训练 → SFT/IFT → RLHF — 预训练用 Next Token Prediction 自监督地建立通用表征；SFT/指令微调把续写机变成指令遵循者；RLHF 用奖励模型把人类偏好变成可微信号再以 PPO 对齐（文件 7–12）。
- 参数高效微调（PEFT） — 冻结主干、只训少量参数；Adapter 串行插层有推理延迟，Prefix Tuning 训练虚拟前缀向量但难优化，LoRA 低秩分解可合并回原权重、零推理延迟，是工业界主流（文件 10、13）。
- 提示词工程：原理与核心技巧 — 不更新参数、只优化输入来激发模型能力；Role/Instruction/Examples 三基石，Zero-shot/Few-shot/CoT 逐级增强，Prompt 顺序改变位置编码与因果上下文从而影响结果（文件 14–17）。
- 提示词工程：可靠性、结构化与安全 — 过长 Prompt 会注意力稀释并触发 Lost-in-the-Middle；减少幻觉靠 Grounding、拒绝出口、CoT 与自检；结构稳定靠 Schema/Function Calling/约束解码/校验重试；安全靠指令-数据分离与纵深防御防注入（文件 18–22）。
- 推理机制与解码采样 — 推理是冻结权重的自回归生成，含 Tokenization/Embedding、逐 token 生成、KV Cache 与解码策略；Temperature 缩放 Logits，Top-k 硬截断，Top-p 动态核采样，温度过高致分布平坦化而胡说（文件 23–26）。
- 推理性能与成本优化 — 长上下文慢源于 Self-Attention O(N²) 与 KV Cache 的访存墙；降延迟靠量化、FlashAttention/算子融合、PagedAttention、投机采样、并行；降 Token 成本靠精简 Prompt、RAG/剪枝、语义缓存与模型路由（文件 27–29）。

## Sections (L2)

### 大模型基础

#### 什么是大语言模型（LLM）？和传统 NLP 模型有什么区别？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/什么是大语言模型（LLM）？和传统NLP模型有什么区别？.md#什么是大语言模型（LLM）？和传统 NLP 模型有什么区别？]]`
- Summary: 定义 LLM 为基于 Transformer 的巨型概率预测机，并从范式、信息表征、开发模式三个维度对比其与传统 NLP 的差异。
- Key claims: 核心任务是给定上下文预测下一个 token；参数/数据突破临界值后涌现推理、计算、代码等未被显式教导的能力；传统 NLP 一任务一模型而 LLM 靠 Prompt 成为通用底座。
- Learner-relevant: 全课程入口锚点——"概率预测机 + 涌现"是后续预训练、采样、幻觉讨论的共同前提。

#### GPT、BERT、T5 的结构差异？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/GPT、BERT、T5的结构差异？.md#GPT、BERT、T5 的结构差异？]]`
- Summary: 将 Transformer 的 Encoder/Decoder 做排列组合，对比三类模型在注意力机制、预训练目标与适用任务上的根本差异。
- Key claims: BERT 是 Encoder-only 双向、擅理解（分类/NER）；GPT 是 Decoder-only 单向 Masked Self-Attention、擅生成；T5 是完整 Encoder-Decoder、统一 Text-to-Text、擅 Seq2Seq。
- Learner-relevant: 承接 Encoder/Decoder 概念，解释"为什么现在主流选 Decoder-only"的结构根源。

#### Transformer 架构是怎样的？为什么能成为主流架构？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/Transformer架构是怎样的？为什么能成为主流架构？.md#Transformer 架构是怎样的？为什么能成为主流架构？]]`
- Summary: 系统拆解 Transformer 各组件——Self-Attention、Multi-Head、Positional Encoding、Add & Norm、FFN——并解释其超越 RNN/LSTM 的两大原因。
- Key claims: Self-Attention 用 Q/K/V 与 softmax(QKᵀ/√dₖ) 让任意两 token 一步建立联系；多头从多子空间捕捉语法/指代/语义等关系；位置编码注入顺序感，残差+LayerNorm 让网络可堆深，FFN 提供非线性。
- Learner-relevant: 架构总纲，Self-Attention/位置编码/KV Cache/复杂度章节的共同先修。

#### Self-Attention 的作用是什么？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/Self-Attention的作用是什么？.md#Self-Attention 的作用是什么？]]`
- Summary: 聚焦 Self-Attention 的两个核心价值：解决长距离依赖（全局视野）与实现并行计算（高效），并简述 Q/K/V 的特征提取作用。
- Key claims: RNN/LSTM 逐字处理会信息衰减，Self-Attention 靠 Q·K 点积让任意两位置直接交互；基于矩阵乘法可一次性并行算所有位置，是千亿参数模型得以训练的关键。
- Learner-relevant: 把"全局视野 + 并行"从架构章抽成独立考点，是理解长上下文与推理加速的起点。

#### Encoder / Decoder-only 模型的区别？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/Encoder_Decoder-only模型的区别？.md#Encoder / Decoder-only 模型的区别？]]`
- Summary: 以注意力掩码的"可视范围"和预训练目标为主线，对比 Encoder-only 与 Decoder-only，并解释行业为何转向 Decoder-only。
- Key claims: Encoder 全向可见、用 MLM 填空、擅判别式任务；Decoder 因果掩码、只能看上文、用 CLM（Next Token Prediction）、擅生成；参数够大后 Decoder-only 的理解能力已能覆盖 Encoder 场景。
- Learner-relevant: 连接 BERT/GPT 结构差异与"因果掩码"概念，后者也是 Prompt 顺序敏感的成因之一。

#### 为什么 LLM 需要大量参数？参数多一定好吗？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/为什么LLM需要大量参数？参数多一定好吗？.md#为什么 LLM 需要大量参数？参数多一定好吗？]]`
- Summary: 论证参数是记忆高维世界知识的"存储单元"，并从 Chinchilla 定律、推理成本、数据质量三方面说明参数并非越多越好。
- Key claims: 参数太少会欠拟合，突破阈值才涌现推理/多步计算；Chinchilla 指出最优性能需参数量与数据量同步增长，否则过拟合；175B 推理成本可达 7B 的几十倍，高质量数据可让小模型媲美大模型。
- Learner-relevant: 为"模型选型/成本权衡"提供理论锚点，衔接推理成本与模型路由策略。

#### 预训练在做什么？为什么有效？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/预训练在做什么？为什么有效？.md#预训练在做什么？为什么有效？]]`
- Summary: 说明预训练是在海量无标注文本上做 Next Token Prediction 的自监督学习，本质是信息压缩与概率分布建模，并从三方面解释其有效性。
- Key claims: 目标是最大化 Σ log P(xₜ | x_{<t})；有效性来自表征学习（离散词→连续向量空间）、提供通用参数初始化（迁移学习高起点）、Scaling Law 下的能力涌现。
- Learner-relevant: 训练流水线的第一阶段锚点，理解 SFT、指令微调、RLHF 都建立在预训练表征之上。

#### SFT 与预训练的区别及联系

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/SFT与预训练的区别及联系.md#SFT与预训练的区别及联系]]`
- Summary: 对比预训练（学常识/知识广度）与 SFT（用指令-回答对把"续写器"变"指令遵循者"），强调 SFT 是"激活"而非"灌输"。
- Key claims: 预训练自监督、海量无标注、解决"知不知道"；SFT 全监督、高质量精选、解决"听不听话"；SFT 不主要灌输新知识，预训练没学到的底层能力难以靠少量 SFT 补齐。
- Learner-relevant: 建立"预训练打底、微调对齐"的两阶段心智模型，是 SFT/RLHF 差异的前置。

#### 指令微调是什么？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/指令微调是什么？.md#指令微调是什么？]]`
- Summary: 讲解指令微调（IFT）如何用 <指令, 输入, 输出> 三元组把基座模型转化为能理解并执行人类指令的对话模型。
- Key claims: 数据集构建是灵魂，含 Instruction/Input/Output；Loss 通常只对 Output 部分计算并 Mask 掉 Prompt；核心价值是"激发泛化能力"，能对未见新指令零样本执行，是通往 RLHF 的必经之路。
- Learner-relevant: SFT 的具体实现形态，衔接 Prompt Engineering 的 Instruction 概念与 RLHF 流程。

#### 全参微调 vs 参数高效微调，如何选择？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/全参微调vs参数高效微调，如何选择？.md#全参微调 vs 参数高效微调，如何选择？]]`
- Summary: 从性能上限与训练成本的权衡出发，给出全参微调（FFT）与参数高效微调（PEFT）的选择框架。
- Key claims: FFT 更新全部参数、显存需参数量的 3–4 倍、性能上限最高但易过拟合/灾难性遗忘；PEFT 冻结主干只训 0.1%–10% 参数、抗遗忘好；选择看算力资源、任务领域跨度（激发能力 vs 注入新知识）、数据量级。
- Learner-relevant: PEFT 策略的选择依据，引出 Adapter/Prefix/LoRA 三种具体实现。

#### SFT 和 RLHF 的区别？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/SFT和RLHF的区别？.md#SFT 和 RLHF 的区别？]]`
- Summary: 从数据形态、优化目标、解决问题三个维度区分 SFT（学会做事/模仿学习）与 RLHF（符合人类价值观/强化学习）。
- Key claims: SFT 用 (Prompt, Response) 对做全监督、最大化似然、交叉熵损失，上限受标注质量限制；RLHF 用偏好排序数据训奖励模型、最大化期望奖励，并用 KL 散度约束防模型崩塌；SFT 解决"懂不懂会不会"，RLHF 解决"好不好安不安全"。
- Learner-relevant: 对齐阶段的两步对比锚点，直接支撑 RLHF 三步流程的理解。

#### RLHF 的流程是怎样的？为什么要加 Reward Model？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/RLHF的流程是怎样的？为什么要加RewardModel？.md#RLHF 的流程是怎样的？为什么要加 Reward Model？]]`
- Summary: 按 InstructGPT 三步走拆解 RLHF——SFT 冷启动、训练 Reward Model、PPO 优化——并解释奖励模型存在的必要性。
- Key claims: RM 是输入 Prompt+Answer、输出标量的回归/打分模型，用人类排序数据训练；PPO 阶段 Policy Model 生成、RM 打分、PPO 更新，并加 KL 惩罚约束不偏离 SFT 模型；RM 本质是人类偏好的"代理"，把难量化感觉变成可微函数，免去人类实时参与数百万次迭代。
- Learner-relevant: 对齐流水线的高潮考点，综合 SFT、偏好数据、PPO、KL 约束等概念。

#### Adapter / Prefix Tuning/Lora 的原理？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/大模型基础/Adapter_PrefixTuning_Lora的原理？.md#Adapter / Prefix Tuning/Lora 的原理？]]`
- Summary: 对比三种 PEFT 技术的原理：Adapter（插入瓶颈层）、Prefix Tuning（可训练虚拟前缀向量）、LoRA（低秩分解旁路更新）。
- Key claims: Adapter 串行插层、参数约 3% 但增加推理延迟；Prefix Tuning 在每层拼接连续向量、不改结构但优化难、占用序列长度；LoRA 将 ΔW 分解为 A×B（r≪d），训练后合并 W+AB，实现零推理延迟，是工业界主流。
- Learner-relevant: PEFT 三种实现的技术细节终点，LoRA"零延迟"是模型落地选型的关键论据。

### 提示词工程

#### 什么是 Prompt Engineering？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/提示词工程/什么是PromptEngineering？.md#什么是 Prompt Engineering？]]`
- Summary: 定义 Prompt Engineering 为不更新参数、通过优化输入文本挖掘与引导 LLM 能力的离散优化技术，并给出三个实践维度。
- Key claims: 作用是划定解空间、激发内在知识、通过 CoT 把推理显性化；从"玄学抽卡"走向工程化（结构化设计、模块化、版本管理与自动评测）；三维度是准确性控制（Few-shot/CoT）、结构化输出、系统工程化（ReAct/工具调用/RAG）。
- Learner-relevant: 提示词工程章节的总纲，串联 Few-shot、CoT、结构化输出、Function Calling 等后续点。

#### Prompt 中 role / instruction / examples 各起什么作用？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/提示词工程/Prompt中role_instruction_examples各起什么作用？.md#Prompt 中 role / instruction / examples 各起什么作用？]]`
- Summary: 拆解高质量 Prompt 的三基石：Role 收敛生成范围，Instruction 明确任务与边界，Examples 利用上下文学习消除歧义。
- Key claims: Role 激活相关潜空间、确立专业度/语气/视角；Instruction 越具体发散性越低，含格式/字数/CoT 要求，明确边界能降幻觉；Examples（Few-Shot）让模型模式识别复刻格式，是提升稳定性最有效的手段。
- Learner-relevant: Prompt 结构化的基础组件，是 Few-shot 与输出格式稳定的前置概念。

#### Zero-shot / Few-shot / Chain-of-Thought 区别？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/提示词工程/Zero-shot_Few-shot_Chain-of-Thought区别？.md#Zero-shot / Few-shot / Chain-of-Thought 区别？]]`
- Summary: 对比三种提示范式：Zero-shot 裸考泛化、Few-shot 靠上下文学习照猫画虎、CoT 显式展示推导步骤。
- Key claims: Zero-shot 靠预训练知识分布直接泛化；Few-shot 提升输出格式与领域规律依从性但复杂推理帮助有限；CoT 把多跳推理拆成线性步骤，大幅提升数学/逻辑/符号推理准确率。
- Learner-relevant: 提示技巧的进阶阶梯，CoT 也是减少幻觉的重要手段。

#### 为什么 prompt 顺序会影响结果？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/提示词工程/为什么prompt顺序会影响结果？.md#为什么 prompt 顺序会影响结果？]]`
- Summary: 从 Transformer 数学原理（位置编码、因果掩码）与训练数据统计规律两方面解释 Prompt 顺序为何决定输出。
- Key claims: 顺序改变使 token 的位置编码与作为 Query 可关注的前文都变化，注意力权重与隐藏状态随之改变；自回归下顺序改变即条件概率的条件改变；模型普遍存在"近因效应"，重要指令放末尾遵循更好。
- Learner-relevant: 连接位置编码/因果掩码与工程技巧，是 RLHF 后理解 Prompt 敏感性的关键。

#### Prompt 过长会带来什么问题？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/提示词工程/Prompt过长会带来什么问题？.md#Prompt 过长会带来什么问题？]]`
- Summary: 从模型效果、工程性能、成本三层说明长 Prompt 的代价：Lost-in-the-Middle、注意力稀释、首字延迟与吞吐下降、成本激增。
- Key claims: 模型对上下文头尾关注度最高、中间易被忽略；token 越多注意力权重越分散，指令遵循变弱、幻觉增加；Prompt 长度决定 Prefill 耗时，KV Cache 挤占显存压制并发；出错重试与多轮纠偏带来隐形成本。
- Learner-relevant: 衔接注意力机制、KV Cache 与成本控制，是上下文管理策略的动机。

#### Prompt 如何减少模型幻觉？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/提示词工程/Prompt如何减少模型幻觉？.md#Prompt如何减少模型幻觉？]]`
- Summary: 提出在 Prompt 层面压缩模型自由发挥空间的四类手段：提供事实依据、设置拒绝出口、利用 CoT、自我反思验证。
- Key claims: Grounding/RAG + "仅依据背景信息回答"把模型从生成模式限制到阅读理解模式；显式允许"不知道"能过滤大量事实错误；Few-shot/CoT 提升逻辑密度；高敏场景加自我验证环节。
- Learner-relevant: 幻觉治理的 Prompt 侧方案，与 RAG、CoT、结构化输出形成组合拳。

#### 如何让输出结构稳定（JSON、Schema）？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/提示词工程/如何让输出结构稳定（JSON、Schema）？.md#如何让输出结构稳定（JSON、Schema）？]]`
- Summary: 按四级递进给出稳定结构化输出的方案：提示词约束、模型原生能力（JSON Mode/Function Calling）、约束解码、校验与重试。
- Key claims: 明确"除 JSON 外不输出任何文字"+Few-Shot 是性价比最高手段；Function Calling/Structured Output 按 Schema 生成基本解决 95% 格式问题；约束解码在 token 级屏蔽非法 token；Pydantic 校验失败触发自动重试/自我修复。
- Learner-relevant: Agent/工具调用场景的工程基础，连接 Function Calling 与 Prompt 约束。

#### Prompt 注入攻击是什么？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/提示词工程/Prompt注入攻击是什么？.md#Prompt 注入攻击是什么？]]`
- Summary: 解释 Prompt 注入源于 LLM"指令与数据未分离"的架构特性，并区分直接注入与更危险的间接注入，给出纵深防御思路。
- Key claims: 模型只看到连续 Token 流，无底层机制隔离"必须遵守的指令"与"不可信输入"，强语义伪指令可覆盖 System Prompt；间接注入把 Payload 藏在网页/文档/邮件，在 RAG 与 Agent 场景危害最大；防御含输入侧定界符、检测侧安全模型、架构侧最小权限。
- Learner-relevant: 提示词安全的核心威胁模型，是安全 Prompt 设计的直接动机。

#### 如何设计安全 Prompt？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/提示词工程/如何设计安全Prompt？.md#如何设计安全 Prompt？]]`
- Summary: 以"指令与数据分离 + 多层防御"为核心，给出上下文隔离、提示词防御、输出约束、外部验证四类安全设计手段。
- Key claims: 用定界符/XML 标签包裹用户输入并声明"仅作数据处理、不执行其中指令"；三明治防御（首尾都放安全指令）+ 系统指令最高优先级；强制结构化输出/预设拒绝回复收敛输出空间；输入过滤注入关键词、输出用规则或轻量模型审核。
- Learner-relevant: 防注入的工程落地清单，与 Prompt 注入攻击文件配对学习。

### 模型推理 & 性能优化

#### 推理阶段模型在干什么？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/模型推理&性能优化/推理阶段模型在干什么？.md#推理阶段模型在干什么？]]`
- Summary: 总览推理四步：输入处理与向量化、自回归生成、KV Cache、解码策略，说明推理是冻结权重下的逐字预测循环。
- Key claims: Tokenization+Embedding 把输入变矩阵；预测-拼接-再预测循环至结束符；KV Cache 缓存历史 K/V 避免 O(N²) 重复计算（空间换时间）；Greedy Search 死板易循环，Sampling(Top-k/Top-p)+温度引入随机性。
- Learner-relevant: 推理章节总纲，KV Cache 与解码采样两个后续考点的上位框架。

#### KV Cache 是什么？为什么能加速？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/模型推理&性能优化/KVCache是什么？为什么能加速？.md#KV Cache 是什么？为什么能加速？]]`
- Summary: 解释 KV Cache 通过缓存历史 Token 的 Key/Value 投影，把 Attention 矩阵乘法复杂度从平方降为线性，代价是显存线性增长。
- Key claims: 无缓存时每步都重算全部历史 K/V，O(N²) 冗余；有缓存时只算新 token 的 Q/K/V 并拼接，Q 与完整 K/V 做 Attention；本质是显存换时间，也是长文本显存易爆的原因。
- Learner-relevant: 推理优化的第一考点，长上下文变慢与降延迟方案都围绕它展开。

#### Temperature / Top-k / Top-p 的区别？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/模型推理&性能优化/Temperature_Top-k_Top-p的区别？.md#Temperature / Top-k / Top-p 的区别？]]`
- Summary: 对比三个采样参数的生效阶段与机制：Temperature 缩放 Logits 调陡峭度，Top-k 硬截断保前 k 个，Top-p 按累积概率动态截断。
- Key claims: Temperature 在 Softmax 前作用、全局调分布，高温平滑增创造、低温尖锐增确定；Top-k 固定保留 k 个，死板不随上下文变化；Top-p 保留累积概率达 p 的最小集合，模型确定时候选池自动收窄、不确定时自动扩大。
- Learner-relevant: 解码策略核心考点，与"温度太高会胡说"及输出稳定性直接相关。

#### 为什么 temperature 太高会胡说？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/模型推理&性能优化/为什么temperature太高会胡说？.md#为什么 temperature 太高会胡说？]]`
- Summary: 从 Logits→Temperature 缩放→Softmax 三步数学过程说明高温度如何使分布平坦化、抬高长尾词概率并导致自回归误差累积。
- Key claims: T 过大时 Logits/T 趋近 0，Softmax 后方差变小、分布趋向均匀；正确词与错误词差距被抹平，长尾/语法错误/逻辑错误 token 被采样概率大升；自回归特性使一次错误被后续继续"编"下去，表现为胡说八道。
- Learner-relevant: 把采样参数与幻觉因果链连起来，深化 Temperature/Top-p 的工程取值依据。

#### 为什么长上下文会变慢？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/模型推理&性能优化/为什么长上下文会变慢？.md#为什么长上下文会变慢？]]`
- Summary: 从算法复杂度、显存带宽墙、批处理效率三方面解释长上下文变慢：Self-Attention O(N²)、KV Cache 搬运 IO 受限、Batch Size 被迫下降。
- Key claims: 注意力矩阵 N×N，长度翻倍计算量变 4 倍，Prefill 阶段最耗时；Decode 阶段受显存带宽限制，KV Cache 可能比权重还大，时间耗在"搬数据"；长上下文挤占显存使 Batch Size 骤减、GPU 利用率与吞吐下降。
- Learner-relevant: 把复杂度、KV Cache 与硬件瓶颈整合，是降延迟方案的问题定义。

#### 如何降低推理延迟？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/模型推理&性能优化/如何降低推理延迟？.md#如何降低推理延迟？]]`
- Summary: 围绕"减少显存访问量 + 提升计算效率"，给出量化、注意力/算子优化、显存管理、投机采样、并行五大类降延迟手段。
- Key claims: 量化（GPTQ/AWQ/SmoothQuant/KV Cache 量化）直接减少搬运量、收益最明显；FlashAttention 用 Tiling+Recompute 减 HBM 读写，算子融减少 Kernel 开销；PagedAttention 借鉴虚拟内存分页减少碎片、支撑更大 Batch；投机采样用小模型草稿+大模型并行验证打破串行解码；超大模型用张量并行 TP。
- Learner-relevant: 推理优化方案的集成清单，综合量化、Attention、显存管理与解码技巧。

#### 如何降低 Token 成本？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/模型推理&性能优化/如何降低Token成本？.md#如何降低 Token 成本？]]`
- Summary: 以"总成本=（输入+输出 Token）× 单价"为框架，从精简 Prompt、上下文管理、缓存、模型策略四方面降本。
- Key claims: 精简 Prompt/结构化输出/Prompt 压缩减少 token；RAG 只喂 Top-k 片段、历史记录滑动窗口或摘要剪枝；语义缓存（向量相似度）直接复用答案、延迟归零；模型路由用小模型分流、微调替 Few-shot 把例子内化进权重从而缩短输入。
- Learner-relevant: 工程成本控制总纲，串联 RAG、缓存、模型路由与微调的落地决策。
