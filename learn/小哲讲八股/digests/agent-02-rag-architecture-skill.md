---
source: 小哲八股-RAG与LLM架构与Skill
source_type: codebase
source_lines: 2204
language: markdown
file_count: 43
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — RAG / LLM系统架构 / Skill / 其他

## Overview (L1)

- RAG 基础与价值 — 把 LLM 的推理能力与知识存储解耦，通过外挂知识库解决幻觉、知识时效、私有数据与成本问题，但救不了“笨”模型，也解决不了全局归纳与检索噪声。
- 切分与文档结构 — Chunk 大小是“颗粒度 vs 上下文”的权衡（经验 256–512 token、10%–20% overlap），可按 token 硬切或按语义软切，并用标题面包屑、父子索引注入结构上下文。
- 检索与召回优化 — Embedding 把文本映射到语义空间，配合余弦/欧氏/内积做向量检索，与 BM25 词法检索互补为 Hybrid Search（RRF 融合），再用 Top-K 两阶段检索＋Rerank＋动态阈值减少召回不准；多轮场景先做 Query 改写。
- LLM 系统架构与工程治理 — 从 InstructGPT 训练路线到线上工程：Gateway 统一路由、无状态服务＋Redis 会话隔离、Memory 与 Context Window 分层、SSE 流式输出、RPM/TPM 双重限流、多层缓存、模型 fallback 与多 Key 池化。
- Agent 与工具协作 — Prompt 是静态调用，Agent 是“感知–规划–行动–反馈”的循环系统；Function Calling 用 Schema 注入＋多轮回调连接外部世界；多 Agent 以流水线、层级调度、反馈迭代三种模式分治。
- Skill 设计机制 — 三层渐进式披露（Metadata 常驻 / SKILL.md 触发时加载 / 资源按需），description 是触发路由核心且需“pushy”以对抗 undertrigger，正文超 500 行下沉 references；触发评估集需复杂查询，run_loop 用 test score 防过拟合。
- 评估与上线 — 评估拆成离线金标准/模型裁判与在线 A/B＋用户反馈；RAG 看 Context Recall/Precision 与忠实度/答案相关性；用“黄金上下文”控制变量定位 Prompt 还是数据问题；A/B 走一致性校验、正交分桶、灰度节奏。
- MCP 与生态 — MCP 用标准化 C/S 协议把模型与外部数据/工具连接解耦，将 N×M 集成简化为 1×N，典型场景是 IDE 增强、企业知识库与运维自动化。

## Sections (L2)

### RAG

#### RAG的整体架构？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/RAG的整体架构？.md#RAG 的整体架构？]]`
- Summary: 按数据流把 RAG 拆为离线的数据准备与索引、在线检索、生成三个关键阶段。
- Key claims: 核心是“检索+生成”外挂知识库而非重训模型；索引侧做提取清洗→分块→向量化→入库；检索侧做 Query 向量化→相似度计算→重排；生成侧组装 Prompt 交 LLM 阅读理解。
- Learner-relevant: RAG 全课程总纲锚点，建立“索引—检索—生成”三段主线。

#### 为什么需要RAG？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/为什么需要RAG？.md#为什么需要 RAG？]]`
- Summary: 解释 LLM 作为“参数化记忆体”的先天局限，以及 RAG 以外部挂载知识库补足。
- Key claims: 解决幻觉（概率生成本能编造）、时效性（训练截止后知识冻结）、私有数据（安全与合规）、成本（远低于 Fine-tuning，微调更适合学格式/语气）。
- Learner-relevant: 回答“为什么要 RAG”，锚定 RAG 与微调的适用边界。

#### RAG能解决哪些问题？不能解决哪些问题？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/RAG能解决哪些问题？不能解决哪些问题？.md#RAG 能解决哪些问题？不能解决哪些问题？]]`
- Summary: 对称盘点 RAG 的能力边界，强调它救“无知”不救“笨”。
- Key claims: 能解决幻觉/可溯源、时效更新、私有数据安全；不能解决基座推理上限、跨海量文档的全局归纳、以及对检索精度的强依赖（Garbage In, Garbage Out）；还会增加复杂度与延迟。
- Learner-relevant: 需求选型与预期管理锚点。

#### Chunk切多大合适？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/Chunk切多大合适？.md#Chunk 切多大合适？]]`
- Summary: 把 Chunk Size 视为“颗粒度 vs 上下文”的权衡，并给出上限、经验值与解耦策略。
- Key claims: 切小检索准但缺上下文，切大上下文足但信噪比低且耗 Token；上限受 Embedding 模型窗口约束；经验值 256–512 token＋10%–20% overlap；进阶做法是“索引小块、召回父块”解耦。
- Learner-relevant: 分块策略调参锚点，连接 overlap 与父子索引。

#### 按token切vs按语义切？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/按token切vs按语义切？.md#按 token 切 vs 按语义切？]]`
- Summary: 对比按物理长度硬切与按内容逻辑软切两种分块范式的效率与质量权衡。
- Key claims: Token 切分工程简单、长度可控、利批处理，但易截断逻辑成碎片；语义切分（按段落/标题或 Embedding 相似度突变点）召回更准，但慢且贵、长度不一、padding 浪费。
- Learner-relevant: 分块实现方案选型锚点。

#### 重叠（overlap）有什么用？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/重叠（overlap）有什么用？.md#重叠（overlap）有什么用？]]`
- Summary: 说明 overlap 用滑动窗口缓冲机械切分的边界损失。
- Key claims: 防止关键词/句子被切两半导致搜不到；保证边缘词仍有上下文以产出更准的 Embedding；给 LLM 通顺的 Context 降低幻觉；通常取 Chunk Size 的 10%–20%。
- Learner-relevant: 分块边缘语义保护的细节锚点。

#### 文档结构（标题、段落）如何利用？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/文档结构（标题、段落）如何利用？.md#文档结构（标题、段落）如何利用？]]`
- Summary: 把标题/层级/段落边界当作天然语义分割符与上下文锚点来用。
- Key claims: 基于结构切分避免跨章节；用“一级>二级>三级标题”面包屑做元数据增强；父子索引实现“索引小粒度、返回大上下文”；混合检索给标题字段更高权重。
- Learner-relevant: 结构感知切分与父子索引的知识来源。

#### Embedding是什么？和向量搜索的关系？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/Embedding是什么？和向量搜索的关系？.md#Embedding 是什么？和向量搜索的关系？]]`
- Summary: 解释 Embedding 的降维与语义几何化本质，以及向量搜索作为其下游检索手段的关系。
- Key claims: 相对 One-Hot 的稀疏与无语义，Embedding 是低维稠密且语义近则距离近（King-Man+Woman≈Queen）；向量搜索用 ANN（HNSW/IVF）在海量向量中快速找 Top-K；二者是 E-T-L 串行、紧密耦合。
- Learner-relevant: 检索语义化的概念地基。

#### 向量相似度常用哪些算法？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/向量相似度常用哪些算法？.md#向量相似度常用哪些算法？]]`
- Summary: 对比余弦相似度、欧氏距离、内积三种度量的关注点与工程取舍。
- Key claims: Cosine 看方向、对长度不敏感、NLP 通用；L2 看绝对距离、受模长影响、适合模长带信息的场景；归一化后内积等价 Cosine，工程上用点积省去开方除法。
- Learner-relevant: 向量库相似度配置与归一化实践锚点。

#### 向量检索vsBM25的区别？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/向量检索vsBM25的区别？.md#向量检索 vs BM25 的区别？]]`
- Summary: 从“字面匹配到语义理解”梳理 BM25 稀疏检索与向量稠密检索的原理与互补性。
- Key claims: BM25 是 TF-IDF 优化（词频饱和＋长度归一化），完全可解释、长于专有名词/精确匹配，但不懂同义词；向量检索靠 Embedding 泛化强、解决语义鸿沟，但不可解释、精确性弱、成本更高；实战常混合并用 RRF 融合。
- Learner-relevant: 混合检索的动机来源。

#### HybridSearch是什么？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/HybridSearch是什么？.md#Hybrid Search 是什么？]]`
- Summary: 解释混合检索如何双路并行并融合，兼顾语义泛化与关键词精确匹配。
- Key claims: 稠密向量擅长语义但对序列号/生僻专名弱，稀疏关键词擅长词法但无同义理解；Hybrid 并行两路后用 RRF 或归一化加权融合（量级不同不能直接相加），最后接 Rerank 精排。
- Learner-relevant: 召回阶段组合策略的标准答案锚点。

#### Top-K怎么选？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/Top-K怎么选？.md#Top-K 怎么选？]]`
- Summary: 分析 K 值太小的遗漏风险与太大的噪声/成本风险，给出两阶段检索与动态 K 方案。
- Key claims: 太大不仅噪声大还使 LLM 忽略中段内容且费用飙升；做法是粗排 Top-50 保召回、Rerank 后取 Top-3/5；也可用相似度阈值（如 >0.75）动态截断避免硬塞低质内容。
- Learner-relevant: 检索参数与上下文预算控制锚点。

#### 如何减少“召回不准”的问题？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/如何减少“召回不准”的问题？.md#如何减少“召回不准”的问题？]]`
- Summary: 从全链路总结“预处理、混合搜、重排序”三阶段来系统性提升召回质量。
- Key claims: 切片用语义切分＋滑动窗口＋小块父文档索引；检索用向量＋BM25 混合；重排用 Cross-Encoder 把 Top-50 精筛成 Top-5，是提升准确率最立竿见影的手段。
- Learner-relevant: 召回优化清单锚点，汇总前面各分块/检索细节。

#### 多轮对话下如何做检索？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/多轮对话下如何做检索？.md#多轮对话下如何做检索？]]`
- Summary: 解决多轮对话中“指代消解”和“信息省略”问题，把依赖上下文的查询改写成独立查询。
- Key claims: 主流是 Query Rewriting，用 LLM 结合最近 3–5 轮历史生成语义完整的独立 Query 再检索；也可做 Query Expansion 提取实体扩展关键词；历史用滑动窗口/摘要控制 Token。
- Learner-relevant: 多轮 RAG 与上下文管理的交叉锚点。

#### FunctionCalling_ToolCalling原理？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/RAG/FunctionCalling_ToolCalling原理？.md#Function Calling / Tool Calling 原理？]]`
- Summary: 说明模型如何从“文本生成器”变为“逻辑调度器”，通过 Schema 注入与多轮回调调用外部工具。
- Key claims: 模型不执行代码，只生成含函数名与参数的 JSON；中间层应用解析并真正执行 API；再把执行结果作为 ToolMessage 追加回对话历史发起第二轮，模型据此生成自然语言答案。
- Learner-relevant: Agent 工具能力的机制基础。

### LLM架构

#### 一个类似ChatGPT系统如何设计？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/一个类似ChatGPT系统如何设计？.md#一个 类似ChatGPT 系统如何设计？]]`
- Summary: 复刻 InstructGPT 路线，把系统拆为预训练、对齐、推理服务三个阶段。
- Key claims: 基座用 Transformer Decoder-only 做 Next Token Prediction；对齐走 SFT→RM→PPO 的 RLHF；推理服务靠 KV Cache、量化（FP16→INT8/INT4）、SSE 流式输出保障高并发低延迟。
- Learner-relevant: LLM 系统全景与训练/服务分层的总纲锚点。

#### LLMGateway在系统中的作用？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/LLMGateway在系统中的作用？.md#LLM Gateway 在系统中的作用？]]`
- Summary: 定位 Gateway 为业务与模型之间的中间件，解决厂商锁定、稳定性与数据安全。
- Key claims: 统一接口与动态路由实现模型解耦；重试/降级/负载均衡保障高可用；密钥托管与 PII 过滤保合规；语义缓存与 Token 审计控成本、做可观测。
- Learner-relevant: 工程治理层核心组件锚点。

#### Memory和ContextWindow的区别？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/Memory和ContextWindow的区别？.md#Memory 和 Context Window 的区别？]]`
- Summary: 区分模型硬性参数与工程记忆机制两个维度。
- Key claims: Context Window 是模型层固定硬约束、Attention 边界、本身无状态；Memory 是应用层工程机制（向量库/Redis/列表），核心是在有限窗口预算内塞入最高价值历史；比喻为“CPU 缓存 vs 硬盘”。
- Learner-relevant: 上下文管理概念地基。

#### 如何做多轮对话上下文管理？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/如何做多轮对话上下文管理？.md#如何做多轮对话上下文管理？]]`
- Summary: 在无状态 LLM 上通过 Prompt 构造实现多轮，并给出三阶段历史管理策略。
- Key claims: 基础用滑动窗口（System Prompt 常留，FIFO 保留最近 N 轮）；进阶用摘要压缩（System + Summary + 最近 N 轮 + Query）；长期记忆用向量检索历史片段；核心矛盾是窗口、成本与延迟。
- Learner-relevant: Memory 的落地实现锚点。

#### 流式输出是怎么实现的？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/流式输出是怎么实现的？.md#流式输出是怎么实现的？]]`
- Summary: 基于 HTTP 的 SSE 标准实现打字机效果。
- Key claims: 服务端保持长连接并设置 Content-Type: text/event-stream 触发流式；常配 Transfer-Encoding: chunked 分块；数据包格式为 data: <content>\n\n。
- Learner-relevant: 工程体验层的传输机制锚点。

#### 并发下如何保证会话隔离？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/并发下如何保证会话隔离？.md#并发下如何保证会话隔离？]]`
- Summary: 以“服务无状态、状态外部化”为原则实现并发会话隔离。
- Key claims: 每请求携带唯一 session_id 全链路透传；对话历史存 Redis，Key 如 app:chat:history:{session_id} 实现物理隔离；对同一 session 的并发写用分布式锁或原子操作串行化。
- Learner-relevant: 多用户并发工程实践锚点。

#### 你的项目里面调用的是大模型厂商的API，那会不会触发单key的限制？如何解决？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/你的项目里面调用的是大模型厂商的API，那会不会触发单key的限制？如何解决？.md#你的项目里面调用的是大模型厂商的API，那会不会触发单key的限制？如何解决？]]`
- Summary: 系统回答单 Key 限流问题，给出主动控速、水平扩展、架构兜底三层解法。
- Key claims: 限制有 RPM/TPM/TPD 三维，单 Key 必有瓶颈；策略含多 Key 负载均衡、令牌桶主动控速、指数退避＋jitter 重试、多厂商路由；加分项是监控告警、成本归因与 Key 生命周期管理。
- Learner-relevant: 生产级限流与配额治理锚点。

#### 多Agent如何协作？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/多Agent如何协作？.md#多 Agent 如何协作？]]`
- Summary: 用“分治＋SOP 化”把复杂任务拆给不同角色 Agent，归纳四种协作拓扑。
- Key claims: 线性流水线适合确定性任务；层级主从由 Manager 规划路由；动态网状按上下文决定接力；对抗辩论用 Reviewer 迭代提质量；技术关键是共享记忆与结构化通信。
- Learner-relevant: Agent 系统编排模式锚点。

#### Agent和普通Prompt的区别？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/Agent和普通Prompt的区别？.md#Agent 和普通 Prompt 的区别？]]`
- Summary: 区分“问模型”的静态 Prompt 与“用模型”的自动化 Agent 系统。
- Key claims: Prompt 线性、无状态、只产出内容；Agent 基于 ReAct 等引入“观察–思考–行动–再观察”反馈闭环；Agent 由大脑（LLM）、记忆、规划、工具构成，LLM 是控制器而非仅生成器。
- Learner-relevant: Agent 定义与能力边界锚点。

#### 大模型接口如何限流？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/大模型接口如何限流？.md#大模型接口如何限流？]]`
- Summary: 说明 LLM 限流须同时管请求数与 Token 数，并给出分布式实现与兜底策略。
- Key claims: 除 RPM 外必须按“预估 Input＋Max Output Token”限 TPM；集群用 Redis＋Lua 做滑动窗口/令牌桶保证原子性；上游 429 用指数退避重试与消息队列削峰填谷。
- Learner-relevant: 网关限流具体算法锚点。

#### 如何做缓存（Embedding_Prompt_Response）？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/如何做缓存（Embedding_Prompt_Response）？.md#如何做缓存（Embedding / Prompt / Response）？]]`
- Summary: 在 Embedding、Prompt/Context、Response 三层做缓存以降成本、降延迟、提并发。
- Key claims: Embedding 层按文本 Hash 缓存向量；Prompt 层用 KV Cache/Context Caching 复用相同前缀；Response 层分精准匹配与语义缓存（向量相似度阈值如 >0.9）。
- Learner-relevant: 成本与延迟优化的三层缓存锚点。

#### 如何做模型降级（fallback）？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/LLM架构/如何做模型降级（fallback）？.md#如何做模型降级（fallback）？]]`
- Summary: 给出模型降级的触发条件、层级策略与熔断重试配套。
- Key claims: 触发含 API 错误、限流、超时、内容审查拦截、格式解析失败；层级为同源→能力→本地模型→规则/缓存兜底；须配合熔断避免请求堆积，降级前先指数退避重试。
- Learner-relevant: 高可用容灾设计锚点。

### SKILL

#### Skill系统的三层加载机制是什么？为什么要这样设计？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SKILL/Skill系统的三层加载机制是什么？为什么要这样设计？.md#Skill 系统的三层加载机制是什么？为什么要这样设计？]]`
- Summary: 解释渐进式披露的三层结构及用 context window 约束解释设计动机。
- Key claims: 一层 Metadata（name+description，常驻）；二层 SKILL.md body（触发时加载，≤500 行）；三层捆绑资源（按需加载，脚本可不入 context）；本质是把“触达范围”与“加载成本”解耦。
- Learner-relevant: Skill 机制总纲锚点。

#### SKILL.md的description字段为什么是触发机制的核心？它和skillbody的职责边界怎么划分？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SKILL/SKILL.md的description字段为什么是触发机制的核心？它和skillbody的职责边界怎么划分？.md#SKILL.md 的 description 字段为什么是触发机制的核心？它和 skill body 的职责边界怎么划分？]]`
- Summary: 说明 description 承担路由决策，body 承担执行指导，二者不可混淆。
- Key claims: 模型决策时只可见 name+description，故所有“when to use”必须在 description（写进 body 等于把密码锁在门内）；description=何时用（触发场景/边界），body=怎么用（步骤/示例/引用）。
- Learner-relevant: 触发设计职责边界锚点。

#### 一个Skill目录的标准结构是什么？scripts_references_assets分别承担什么职责？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SKILL/一个Skill目录的标准结构是什么？scripts_references_assets分别承担什么职责？.md#一个 Skill 目录的标准结构是什么？scripts / references / assets 分别承担什么职责？]]`
- Summary: 给出 SKILL.md＋捆绑资源的标准目录，并说明三类资源职责与多域组织。
- Key claims: scripts 放可执行脚本、可直接跑不入 context；references 放大体量按需查阅文档（>300 行加目录）；assets 放输出用静态素材；多域场景按变体拆多个 reference 只加载其一。
- Learner-relevant: Skill 工程结构锚点。

#### description为什么要刻意写得「pushy」一点？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SKILL/description为什么要刻意写得「pushy」一点？.md#description 为什么要刻意写得「pushy」一点？]]`
- Summary: 解释模型系统性 undertrigger 倾向，以及用“pushy”描述对抗的设计原则与边界。
- Key claims: 原因是模型偏好已有能力、描述保守、触发有不确定性成本；写法是主动枚举触发场景、用 whenever/even if 等包容语言、覆盖间接表达；但须准确，过宽会走向 overtrigger。
- Learner-relevant: 触发率优化的经验锚点。

#### Description优化的run_loop是怎么工作的？为什么用testscore而不是trainscore选最优描述？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SKILL/Description优化的run_loop是怎么工作的？为什么用testscore而不是trainscore选最优描述？.md#Description 优化的 run_loop 是怎么工作的？为什么用 test score 而不是 train score 选最优描述？]]`
- Summary: 说明自动化优化 description 的迭代流程及其中的防过拟合选择。
- Key claims: 评估集按 60/40 切固定 train/test；对每条查询跑 3 次取平均消除随机；Claude 分析 train 失败案例提新描述候选；最多迭代 5 次；用 test score 选最优以防过拟合 train 特定措辞。
- Learner-relevant: Skill 描述优化的方法论锚点。

#### 如何设计好的Skill触发评估集？为什么简单的单步查询不适合作为测试用例？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SKILL/如何设计好的Skill触发评估集？为什么简单的单步查询不适合作为测试用例？.md#如何设计好的 Skill 触发评估集？为什么简单的单步查询不适合作为测试用例？]]`
- Summary: 说明触发评估集的作用，以及为何简单查询会产出假阴性。
- Key claims: 模型只对“自己无法直接处理的复杂任务”才调 Skill，简单单步能被直接完成故不触发；好用例应有多步骤/专业格式要求、体现真实意图、覆盖正负样本、足够具体。
- Learner-relevant: 触发集设计原则锚点。

#### 什么类型的Skill需要设计testcases？什么类型不需要？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SKILL/什么类型的Skill需要设计testcases？什么类型不需要？.md#什么类型的 Skill 需要设计 test cases？什么类型不需要？]]`
- Summary: 以“输出能否客观验证”为判断轴区分应写与不必写测试的 Skill。
- Key claims: 需要的是文件转换/数据提取/代码生成/固定工作流等有明确对错标准的；不需要的是写作风格/创意生成/艺术设计等主观类；主观类强行写断言会过宽或限制发挥，宜人工 review。
- Learner-relevant: Skill 测试策略选择锚点。

#### SKILL.md建议保持在500行以内，超出时应该怎么处理？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SKILL/SKILL.md建议保持在500行以内，超出时应该怎么处理？.md#SKILL.md 建议保持在 500 行以内，超出时应该怎么处理？]]`
- Summary: 说明 500 行警戒线的原因，并给出“加层级＋明确指针”而非删减的重构方案。
- Key claims: 正文整体加载会挤占 context、分散注意力、混杂分支；做法是区分“全局必知”留 SKILL.md 与“按需查阅”下沉 references/，并写明确跳转指针；超大 reference 加目录。
- Learner-relevant: Skill 信息架构重构锚点。

#### 在没有subagent的环境（如Claude.ai）下，Skill的测试流程要做哪些降级处理？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SKILL/在没有subagent的环境（如Claude.ai）下，Skill的测试流程要做哪些降级处理？.md#在没有 subagent 的环境（如 Claude.ai）下，Skill 的测试流程要做哪些降级处理？]]`
- Summary: 对比完整 subagent 环境与 Claude.ai 的测试流程，逐项给出降级方案。
- Key claims: 无 subagent 时测试改串行、由作者自测（有作者偏见，靠人工 review 补偿）、跳过 HTML review/baseline/定量 benchmark/run_loop；核心“草稿→测试→反馈→修改”闭环不变，只是精度更低、更依赖人工。
- Learner-relevant: 受限环境下的 Skill 迭代权衡锚点。

### 其他

#### RAG的评估指标有哪些？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/其他/RAG的评估指标有哪些？.md#RAG 的评估指标有哪些？]]`
- Summary: 把 RAG 评估拆成检索层与生成层各两个核心指标。
- Key claims: 检索看 Context Recall（决定上限、别漏关键信息）与 Context Precision（抗噪、上下文纯净度）；生成看忠实度（防幻觉、只认检索内容）与答案相关性（别答非所问）。
- Learner-relevant: RAG 质量度量锚点。

#### 什么是MCP？有什么应用场景？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/其他/什么是MCP？有什么应用场景？.md#什么是MCP？有什么应用场景？]]`
- Summary: 介绍 MCP 作为模型与外部数据/工具连接的开放标准，及其架构与场景。
- Key claims: 类 USB 协议，把 N×M 集成简化为 1×N；架构含 Host/Server/Client（C/S 1:1 连接）；场景为 IDE 本地环境增强、企业内部知识库打通、运维与自动化 Agent。
- Learner-relevant: 工具生态与集成标准化锚点。

#### 如何评估一个大模型应用效果？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/其他/如何评估一个大模型应用效果？.md#如何评估一个大模型应用效果？]]`
- Summary: 从结果质量与工程性能两维度、离线与在线两阶段建立全链路评估体系。
- Key claims: 质量看准确性/相关性/安全性/一致性；性能看首字延迟/吞吐/成本；方法含规则指标（EM/ROUGE/BLEU 有局限）、模型裁判、金标准数据集；离线跑分达标再上线，在线用埋点与 A/B。
- Learner-relevant: 应用评估方法论锚点。

#### 模型升级如何做A_BTest？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/其他/模型升级如何做A_BTest？.md#模型升级如何做 A/B Test？]]`
- Summary: 把模型升级 A/B 拆为上线前一致性校验、实验设计配置、灰度观测三阶段。
- Key claims: 先做离线/在线一致性校验防特征不一致崩塌；用 Hash(User_ID)%100 分桶并保证正交、先跑 AA 验证分流均匀；指标分核心业务/护栏/技术三类；灰度按 1%→5–10%→50%→100%，P-value<0.05 且护栏不恶化才推全。
- Learner-relevant: 线上实验与发布的工程锚点。

#### 如何定位是Prompt问题还是数据问题？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/其他/如何定位是Prompt问题还是数据问题？.md#如何定位是 Prompt 问题还是数据问题？]]`
- Summary: 用“黄金上下文”控制变量法解耦数据与指令来定位问题来源。
- Key claims: 手动注入完美参考资料绕过检索：答对了说明是数据链路问题（召回低/噪声/切片不当），仍答错说明是 Prompt 或模型能力问题；再分别针对性优化（检索/Top-K/父文档 vs Few-Shot/CoT）。
- Learner-relevant: 故障归因与调试锚点。

#### 如何判断一个需求值不值得用大模型？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/其他/如何判断一个需求值不值得用大模型？.md#如何判断一个需求值不值得用大模型？]]`
- Summary: 从任务模糊性、确定性/容错率要求、延迟与成本三方面判断 LLM 适用性。
- Key claims: 能用 if-else/正则/成熟算法解决且达标就不必用；LLM 适合非结构化理解与生成；要求 100% 精确或毫秒级实时不适合直接接管；须评估业务价值能否覆盖 Token 与算力成本。
- Learner-relevant: 需求选型与价值判断锚点。

#### 你觉得大模型适合哪些业务？哪些场景不适合用大模型？

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/其他/你觉得大模型适合哪些业务？哪些场景不适合用大模型？.md#你觉得大模型适合哪些业务？哪些场景不适合用大模型？]]`
- Summary: 归纳 LLM 的核心优势（通识理解与生成）与短板（幻觉与不可控）对应的适配场景。
- Key claims: 适合内容生成与辅助、非结构化数据结构化提取、新一代自然交互界面；不适合 100% 精确严肃逻辑、简单确定任务（成本倒挂）、超低延时实时决策、极端私密黑盒环境。
- Learner-relevant: 场景选型与面试观点锚点。
