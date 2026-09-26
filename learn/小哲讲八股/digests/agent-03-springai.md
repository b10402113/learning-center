---
source: 小哲八股-SpringAI
source_type: codebase
source_lines: 3076
language: markdown
file_count: 12
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — Spring AI

## Overview (L1)

- 分层架构与统一契约 — Spring AI 用 Model API 隔离稳定能力、供应商适配器消化协议差异、ChatClient/Advisor 承担应用编排，提供可移植性而非模型等价性（文件 1）。
- 启动装配 — Starter 只聚合依赖，AutoConfiguration 依据类路径/属性/现有 Bean 条件创建 Properties、客户端、ChatModel 与 ChatClient.Builder，自定义 Bean 可让默认配置退让（文件 2）。
- 请求语义与调用链 — Prompt 是有序 Message 集合＋ChatOptions，Message 角色在适配层翻译，结构化输出走"生成前约束＋生成后解析"；ChatClient 分阶段生命周期最后才由终结方法触发调用（文件 3–4）。
- 同步与流式 — call() 等完整 ChatResponse，stream() 从供应商事件流经适配器转成 Flux，两者在 Advisor 接口、错误时机、取消与背压语义上不同，流式优化首片段体验而非总时长（文件 5）。
- 横切编排与状态 — Advisor 是有序双向可递归的责任链，order 划分工具循环内外；Chat Memory 按 conversationId 每轮重注入历史，Memory/Repository 分为策略层与存储层（文件 6–7）。
- 工具与外部能力 — 模型只输出工具名与参数的调用意图，ToolCallback 连接模型可见定义与可执行逻辑，ToolCallingAdvisor 是递归子链循环；MCP 在应用与外部能力间做标准化通信，把远端工具适配成 ToolCallback（文件 8–10）。
- 检索与 RAG — Embedding 把文本投影到语义空间、VectorStore 保存并检索候选，距离近不等于事实正确；RAG 由离线索引链与在线检索生成链接成，任一环节失真都会影响答案（文件 11–12）。

## Sections (L2)

### 01-spring-ai-architecture

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/01-spring-ai-architecture.md#Spring AI整体架构：它怎样把不同模型统一成一套Spring API？]]`
- Summary: 拆解 Spring AI 三层职责——通用 Model API 统一请求/响应与同步流式契约，供应商适配器翻译原生协议，ChatClient 与 Advisor 组合 Memory、RAG、Tool 等应用能力。
- Key claims: Model<Request,Response> 与 StreamingModel 只表达最稳定因果；ChatModel 同时继承 Model 与 StreamingChatModel；公共抽象只覆盖能力交集，供应商专有能力需专属 Options 下沉，得到的是可移植性不是完全等价。
- Learner-relevant: 全课程总纲锚点，建立"稳定契约、边界适配、上层编排"三条线索。

### 02-auto-configuration

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/02-auto-configuration.md#Spring AI自动配置原理：引入一个Starter后发生了什么？]]`
- Summary: 解释 Starter 是依赖清单、AutoConfiguration 才含装配逻辑，说明条件门（类路径/属性/Bean）、配置属性到 ChatModel 的四层对象图，以及多供应商与自定义 Bean 冲突处理。
- Key claims: 默认 Bean 多带 @ConditionalOnMissingBean，用户显式 Bean 会让自动配置退让；多聊天供应商需 spring.ai.model.chat 选择或用 @Qualifier 区分；容器启动成功不等于模型可用，排障先看 Condition Evaluation Report。
- Learner-relevant: 回答"Starter 为何开箱即用"以及配置不生效、Bean 歧义的排查路径。

### 03-prompt-message-structured-output

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/03-prompt-message-structured-output.md#Prompt不只是字符串：Message、Options与结构化输出怎样协作？]]`
- Summary: 说明 Prompt=有序 Message 集合＋本次 ChatOptions，Message 角色在适配层翻译；结构化输出经 BeanOutputConverter→JSON Schema→模型文本→反序列化四步，并区分提示词约束与供应商原生结构化输出。
- Key claims: 直接调 ChatModel.call(Prompt) 时运行时 Options 需完整并整体优先，ChatClient 才做字段级增量合并；entity() 只是便捷，可反序列化不等于业务数据可信；失败分语法、语义、Schema 不兼容与可信指令四类。
- Learner-relevant: "角色化上下文、请求级选项、约束后解析"三个关键词的落点。

### 04-chatclient-lifecycle

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/04-chatclient-lifecycle.md#为什么说它是“两阶段API”？]]`
- Summary: 沿一行 `.call().content()` 走完 ChatClient 生命周期：Builder 存预设、prompt() 建请求规格、call()/stream() 选路径、终结方法才触发、再经 Advisor 环绕链与 ChatModel，最后适配返回形态。
- Key claims: call() 本身不发起模型请求，content()/chatResponse()/entity() 才终结；Advisor 按 getOrder() 排序、同步接口是环绕调用；一次业务调用不等于一次模型请求（工具/重试/递归会多次访问）；请求级值不应放进共享默认配置。
- Learner-relevant: "预设、累积、执行、适配"四动词，解释为何没发请求/信息不足。

### 05-call-vs-stream

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/05-call-vs-stream.md#什么场景不应该使用stream？]]`
- Summary: 区分首片段延迟与完整响应延迟，说明 Flux 来自供应商事件流经模型适配器转换，流式 Advisor 链逐片处理，并讨论背压、取消、工具停顿、流式错误与选型。
- Key claims: 流式优化等待体验、不保证缩短总生成时间，一个 chunk 不等于一个字；Reactor 背压只控制本地发布消费，不能保证远端模型暂停；已输出内容后失败通常不宜自动重试；部分结果、取消与慢消费者策略明确才值得流式。
- Learner-relevant: "完整值与事件流、完整后处理与逐片处理、本地背压与远端生成"三组对照。

### 06-advisor-chain

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/06-advisor-chain.md#Advisor责任链：Memory、RAG和Tool为什么都能插进同一次调用？]]`
- Summary: 拆开 Advisor 的有序双向责任链：CallAdvisor 对完整值、StreamAdvisor 对 Flux，请求按 order 从小到大进入、响应沿调用栈反向返回，Context 承载本次调用共享状态，递归 Advisor 可复制下游子链。
- Key claims: Advisor 是环绕调用而非前后回调，可修改请求、短路或递归；order 决定谁看原始/增强数据、谁能再短路后运行、谁在递归内外，是行为边界非排序配置；最常见的失败在多个 Advisor 组合而非单接口。
- Learner-relevant: 连接 Memory、RAG、Tool 的统一编排抽象，order 语义的架构意义。

### 07-chat-memory

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/07-chat-memory.md#Chat Memory原理：无状态大模型为什么看起来记得聊天内容？]]`
- Summary: 解释无状态模型的多轮连续感来自 Memory Advisor 每轮按 conversationId 读取并注入历史、生成后再保存；区分 ChatMemory 策略层与 ChatMemoryRepository 存储层，并讨论窗口淘汰、隔离与失忆/串话排查。
- Key claims: 默认策略是 MessageWindowChatMemory（默认 20 条消息），超限保留 SystemMessage 并按完整对话轮次推进切点；消息数上限不等于 Token 上限；Memory Advisor 默认在工具循环外侧，只保存最终交互；Chat Memory 不等于完整 Chat History，审计需单独持久化。
- Learner-relevant: 理解 conversationId 隔离、JDBC Repository 不支持工具消息、双写模式。

### 08-tool-calling

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/08-tool-calling.md#Tool Calling原理：模型如何决定并调用Java方法？]]`
- Summary: 从六步协议往返讲到 ToolCallback 核心抽象与 @Tool 生成 JSON Schema，说明模型只拥有选择权、Java 方法始终在应用进程执行，以及参数合法为何仍不等于安全。
- Key claims: 模型不进入 JVM，只返回工具名与结构化参数；ToolCallback 由 ToolDefinition（面向模型）、call（面向执行）、ToolMetadata（面向编排）组成；一次用户请求可能触发多次模型请求；Schema 只约束形状，身份、权限、幂等、审计须在应用侧完成。
- Learner-relevant: 建立"模型选择、框架解析编排、Java 执行"的责任边界与工具安全直觉。

### 09-tool-calling-advisor

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/09-tool-calling-advisor.md#ToolCallingAdvisor递归循环：一次提问为什么会请求模型多次？]]`
- Summary: 解释 ToolCallingAdvisor 为何是递归 Advisor：模型响应仍含工具调用时，执行工具、更新会话历史并重入自身之后的子链，直到无工具调用、returnDirect、资格拒绝或异常退出。
- Key claims: 递归只 copy(this) 复制当前 Advisor 之后的下游子链，上游鉴权/总计时只跑一次；DEFAULT_ORDER 为 HIGHEST_PRECEDENCE+300，排在它前/后决定在循环外/内；Memory 默认序 HIGHEST_PRECEDENCE+200 在循环外；生产还需总轮数、超时、预算、幂等与副作用审批护栏。
- Learner-relevant: "子链递归、顺序边界、退出护栏"，解释一次 .call() 多次模型请求。

### 10-mcp

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/10-mcp.md#MCP原理：它和Tool Calling到底是什么关系？]]`
- Summary: 区分 Tool Calling（模型↔AI 应用的能力协商）与 MCP（AI 应用↔外部能力提供方的标准通信），讲清 Client/Session/Transport 三层、initialize 握手、Tools/Resources/Prompts 能力类型、Spring AI 适配与传输选型。
- Key claims: 远端 MCP Tool 被适配成普通 ToolCallback 后进入 ToolCallingAdvisor 循环，模型无需懂 MCP；握手协商的是协议版本与 capabilities，不等于权限授权；STDIO 适合本地受控子进程（stdout 仅能出协议消息），Streamable HTTP 适合独立远端服务；MCP 只解决互操作性，不解决可信性、幂等与成本。
- Learner-relevant: "分层、协商、适配"，理解本地 @Tool 与远程能力的统一抽象。

### 11-embedding-vector-store

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/11-embedding-vector-store.md#向量检索原理：Embedding与VectorStore怎样找到“意思相近”的内容？]]`
- Summary: 说明 EmbeddingModel 把文本投影到语义空间、VectorStore 保存向量/原文/元数据并检索，查询需用兼容模型生成查询向量，并拆解 topK、阈值、Filter 与距离计算。
- Key claims: 相似是相对某 Embedding 模型而言，距离近只表语义模式相似、不证明真实或有权读取；VectorStoreRetriever 只读、VectorStore 增写，职责拆分减少误操作面；Filter 解决资格、阈值解决相关、topK 控制上下文；换模型常需重建索引（双写—回填—对比—切流）。
- Learner-relevant: "同一语义空间才能比较；Filter 解决资格；相似不是事实证明"。

### 12-rag-pipeline

- Locator: `[[sources/小哲讲八股/20260926/Agent开发/SpringAI/12-rag-pipeline.md#RAG完整链路：文档如何经过ETL、切片、检索进入最终答案？]]`
- Summary: 从离线索引（Reader/Transformer/Writer 三函数式接口）到在线问答，讲 Document 文本+元数据、切片策略、QuestionAnswerAdvisor 朴素 RAG、RetrievalAugmentationAdvisor 模块化四阶段与分层排障。
- Key claims: ETL 接口只解决组件组合，不解决批次/重试/版本/权限等任务一致性；元数据必须在写入前设计，且区分用于过滤与参与 Embedding 的字段；模块化 RAG 分 Pre-Retrieval（查询变换）、Retrieval（含 DocumentJoiner 合并）、Post-Retrieval、Generation；排障顺序按读取→索引→检索→生成前进，RAG 上限常在知识加工与检索链里。
- Learner-relevant: 完整数据链锚点，把 Embedding/VectorStore/Advisor 串成端到端 RAG。
