---
subject: geek-ai-agent
status: draft
path: systems
created: 2026-09-22
---

# ROADMAP — geek-ai-agent

## Goal

能用 AI 主導交付一個企業級 Agent 系統（OryxOS 級），並把同一套 SDD + Harness + Loop 工作流複製到自己的專案。以整門實戰營為載體走完三條線：認知篇建立判斷力；OryxOS 底座從需求分析 → Provider / ReAct / CLI / Notify / Tool / Memory / Sandbox / 排程 / Web → 全流程串聯 → 插件化與動態管理 → 發布 v0.1.0；When 用 Loop 工程做一個分散式延遲投遞元件（etcd 協調、時間輪、Master/Slave、10 秒 failover）。

## Learning path

**系統優先 (systems)。** 以「一個 Agent OS 如何組裝」與「一個分散式延遲投遞元件如何組裝」為主軸：先建立兩套系統的完整架構地圖（Agent 五元件、Agent OS 五大能力、分散式六機制），再逐層下鑽到模組契約與程式碼實作。它最佳化的是**可重建的系統心智模型**——先看懂全貌，再自己動手重建 OryxOS。Tier 由通而專：Tier 1 建立 Agent／Agent OS 的心智模型；Tier 2 立起 SDD／Harness／Loop 的工作系統；Tier 3–5 走 OryxOS 從藍圖、核心能力到整合交付；Tier 6–7 走 When 從分散式原理到模組聯調。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe geek-ai-agent/<node-id>` to measure a node, then `/nodes geek-ai-agent/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 系統心智模型
1. **[[learn/geek-ai-agent/nodes/agent-anatomy|Agent 五元件與真偽判別]]**
   - Goal: 能用 LLM + Tools + Memory + Loop + Environment 五元件拆解任何號稱 Agent 的系統，並判別真 Agent 與聊天機器人、工作流、LLM 包裝的差別。
   - Sources:
     - [[sources/geek-ai-agent/20260922/03-09 9. 扩展篇：Agent 从技术上看到底是什么.html#technical-definition]]
     - [[sources/geek-ai-agent/20260922/03-09 9. 扩展篇：Agent 从技术上看到底是什么.html#five-components]]
     - [[sources/geek-ai-agent/20260922/03-09 9. 扩展篇：Agent 从技术上看到底是什么.html#confusable-concepts]]
     - [[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#five-components]]
     - [[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#agent-vs-non-agent]]
     - [[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#loop-mechanics]]
     - [[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#five-components]]
     - [[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#react-loop]]
2. **[[learn/geek-ai-agent/nodes/agent-os-landscape|Agent OS 與 OryxOS 定位]]**
   - Goal: 說清 Agent OS 是什麼、企業為何需要私有可控底座、為何選 Java，以及 OryxOS 的定位、邊界與從單機到分散式的演進路線。
   - Sources:
     - [[sources/geek-ai-agent/20260922/03-16 16. 项目篇 OryxOS ：业界调研.html#1.1 一个明确的定义]]
     - [[sources/geek-ai-agent/20260922/03-16 16. 项目篇 OryxOS ：业界调研.html#2.1 OpenClaw 和 Hermes Agent]]
     - [[sources/geek-ai-agent/20260922/03-16 16. 项目篇 OryxOS ：业界调研.html#3.3 严监管企业的刚需]]
     - [[sources/geek-ai-agent/20260922/03-16 16. 项目篇 OryxOS ：业界调研.html#4.1 Java 生态现状]]
     - [[sources/geek-ai-agent/20260922/03-16 16. 项目篇 OryxOS ：业界调研.html#5.1 OryxOS 是什么]]
     - [[sources/geek-ai-agent/20260922/03-16 16. 项目篇 OryxOS ：业界调研.html#6.1 演进的核心原则]]
     - [[sources/geek-ai-agent/20260922/第9节：看懂 Agent OS：OryxOS 的定位、架构与价值.pdf#what-is-agent-os]]
     - [[sources/geek-ai-agent/20260922/第9节：看懂 Agent OS：OryxOS 的定位、架构与价值.pdf#why-java]]
     - [[sources/geek-ai-agent/20260922/第9节：看懂 Agent OS：OryxOS 的定位、架构与价值.pdf#evolution-and-value]]
     - [[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#agent-os-infra]]
     - [[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#oryxos-positioning]]
     - [[sources/geek-ai-agent/20260922/直播1：企业需要怎样的 Agent 底座.pdf#Agent-OS-架构-底座定义与五件事]]

### Tier 2 — 工作系統：方法論
3. **[[learn/geek-ai-agent/nodes/sdd-spec-driven|SDD：規格驅動開發]]**
   - Goal: 理解 spec-as-source 與 SDD 的三種落地模式（Spec-Kit／OpenSpec／手作），並能判斷一個專案該不該用、用哪種。
   - Sources:
     - [[sources/geek-ai-agent/20260922/03-07 7. 认知篇：SDD 和 Harness：AI 编程的两大支柱.html#一、SDD 和 Harness 各自解决什么]]
     - [[sources/geek-ai-agent/20260922/03-07 7. 认知篇：SDD 和 Harness：AI 编程的两大支柱.html#二、SDD 的三种落地模式]]
     - [[sources/geek-ai-agent/20260922/03-10 10. 扩展篇：Spec-Kit 和 OpenSpec 的原理和使用教程.html#二、Spec-Kit 详解]]
     - [[sources/geek-ai-agent/20260922/03-10 10. 扩展篇：Spec-Kit 和 OpenSpec 的原理和使用教程.html#三、OpenSpec 详解]]
     - [[sources/geek-ai-agent/20260922/03-10 10. 扩展篇：Spec-Kit 和 OpenSpec 的原理和使用教程.html#四、Spec-Kit 跟 OpenSpec 的对比]]
     - [[sources/geek-ai-agent/20260922/03-02 2. 认知篇： AI 编程的本质和方法论体系.html#五、方法论的当前景观]]
     - [[sources/geek-ai-agent/20260922/第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine.pdf#sdd]]
     - [[sources/geek-ai-agent/20260922/第13节：Spec-Kit 教程——原理、用处、用法、时机.pdf#原理：spec-as-source 与三大支柱]]
4. **[[learn/geek-ai-agent/nodes/harness-engineering|Harness Engineering]]**
   - Goal: 掌握 Harness 六大工具（CLAUDE.md／Skills／Subagents／Plan Mode／Permission／Hooks）與三道防線，知道何時該加哪一道。
   - Sources:
     - [[sources/geek-ai-agent/20260922/03-07 7. 认知篇：SDD 和 Harness：AI 编程的两大支柱.html#Harness约束落地工具]]
     - [[sources/geek-ai-agent/20260922/第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine.pdf#harness]]
     - [[sources/geek-ai-agent/20260922/03-11 11. 扩展篇：AI 编程实用 Skills 调研与沉淀指南.html#2. Skills 是什么]]
     - [[sources/geek-ai-agent/20260922/03-11 11. 扩展篇：AI 编程实用 Skills 调研与沉淀指南.html#7. 自己沉淀 Skills 的方法论]]
     - [[sources/geek-ai-agent/20260922/03-12 12. 扩展篇：Superpowers 深度介绍.html#完整工作流：一次跑通]]
     - [[sources/geek-ai-agent/20260922/03-13 13. 扩展篇：Hermes Agent 深度介绍.html#技术原理]]
     - [[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#subagents]]
5. **[[learn/geek-ai-agent/nodes/loop-engineering|Loop Engineering]]**
   - Goal: 掌握 Loop 的五要素、判官與停止條件，並理解 SDD → Harness → Loop 的三層關係與業界收斂。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#loop-definition]]
     - [[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#five-elements]]
     - [[sources/geek-ai-agent/20260922/第35节：深聊 Loop 编程与 Harness.pdf#three-layer-relation]]
     - [[sources/geek-ai-agent/20260922/直播2：Loop Engineering 的实践与 OPC 提效.pdf#five-elements]]
     - [[sources/geek-ai-agent/20260922/直播2：Loop Engineering 的实践与 OPC 提效.pdf#judge-integrity]]
     - [[sources/geek-ai-agent/20260922/直播2：Loop Engineering 的实践与 OPC 提效.pdf#harness-three-faces]]
     - [[sources/geek-ai-agent/20260922/第6节：方法论内功：吃透 SDD、Harness 与 Loop Engine.pdf#loop-engine]]
     - [[sources/geek-ai-agent/20260922/第10节：从需求分析到任务拆解：拿到项目如何从零思考.pdf#一条思考路径：先做什么、后做什么]]
6. **[[learn/geek-ai-agent/nodes/workflow-and-boundary|工作流設計與自動化邊界]]**
   - Goal: 能設計一條六階段的人+AI 交付工作流，並用 30% 現實、驗證瓶頸與認知債判準界定 AI 能與不能做的部分。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf#six-stage-pipeline]]
     - [[sources/geek-ai-agent/20260922/第7节：工作流设计力：用 AI 跑通企业级大项目.pdf#personal-workflow]]
     - [[sources/geek-ai-agent/20260922/03-06 6. 认知篇：AI 自动化的边界与人加 AI 协作的新工作流.html#看清边界30%提速是顶级水平]]
     - [[sources/geek-ai-agent/20260922/03-06 6. 认知篇：AI 自动化的边界与人加 AI 协作的新工作流.html#人加AI协作新工作流]]
     - [[sources/geek-ai-agent/20260922/03-14 14. 扩展篇：AI 时代的软件工程.html#generation-to-verification]]
     - [[sources/geek-ai-agent/20260922/03-14 14. 扩展篇：AI 时代的软件工程.html#role-and-risk]]
     - [[sources/geek-ai-agent/20260922/03-15 15. 扩展篇：AI 时代，程序员的能力还怎么养成.html#closing-judgment]]
     - [[sources/geek-ai-agent/20260922/AI时代如何准备面试.pdf#考察点变化]]

### Tier 3 — OryxOS 系統藍圖
7. **[[learn/geek-ai-agent/nodes/oryxos-requirements|OryxOS 需求]]**
   - Goal: 能複述 OryxOS 的五大能力、術語、設計目標、典型場景、核心/擴展/社區範圍與驗收標準，作為後續所有模組的錨。
   - Sources:
     - [[sources/geek-ai-agent/20260922/03-17 17. 项目篇 OryxOS：需求文档.html#1.1 OryxOS 是什么]]
     - [[sources/geek-ai-agent/20260922/03-17 17. 项目篇 OryxOS：需求文档.html#5.3 Provider 抽象]]
     - [[sources/geek-ai-agent/20260922/03-17 17. 项目篇 OryxOS：需求文档.html#5.4 ReAct 循环]]
     - [[sources/geek-ai-agent/20260922/03-17 17. 项目篇 OryxOS：需求文档.html#8.5 安全方面]]
     - [[sources/geek-ai-agent/20260922/03-17 17. 项目篇 OryxOS：需求文档.html#验收标准]]
     - [[sources/geek-ai-agent/20260922/第12节：开发前的工程准备：模块、协作模式与节奏.pdf#9 个 Maven 模块速览]]
     - [[sources/geek-ai-agent/20260922/直播1：企业需要怎样的 Agent 底座.pdf#能力拆解]]
8. **[[learn/geek-ai-agent/nodes/oryxos-technical-solution|OryxOS 技術方案]]**
   - Goal: 看懂 OryxOS 的四層架構、七大技術決策、五大能力如何互相供養、九個 Maven 模組與持久化選型。
   - Sources:
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#1.1 关键技术决策]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#2.1 分层视图]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#4.1 ReAct loop 算法]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#5.1 模块组成]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#项目工程结构]]
     - [[sources/geek-ai-agent/20260922/第12节：开发前的工程准备：模块、协作模式与节奏.pdf#把最容易写错的，先钉死]]
     - [[sources/geek-ai-agent/20260922/oryxos/docs/IndustryResearch.md]]
     - [[sources/geek-ai-agent/20260922/oryxos/docs/DemandAnalysis.md]]
     - [[sources/geek-ai-agent/20260922/oryxos/docs/TechnicalSolution.md]]
     - [[sources/geek-ai-agent/20260922/oryxos/CLAUDE.md]]
9. **[[learn/geek-ai-agent/nodes/oryxos-ai-programming-guide|OryxOS AI 編程指南]]**
   - Goal: 能用兩階段混合模式（Spec-Kit 主體 + 手動提示詞增量）把需求與技術方案轉成按 user story 拆分的可執行任務。
   - Sources:
     - [[sources/geek-ai-agent/20260922/03-19 19. 项目篇 OryxOS：AI 编程指南.html#1.1 主体思路]]
     - [[sources/geek-ai-agent/20260922/03-19 19. 项目篇 OryxOS：AI 编程指南.html#3.2 /speckit.constitution]]
     - [[sources/geek-ai-agent/20260922/03-19 19. 项目篇 OryxOS：AI 编程指南.html#4.1 US-1]]
     - [[sources/geek-ai-agent/20260922/第13节：Spec-Kit 教程——原理、用处、用法、时机.pdf#什么时候用]]
     - [[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#four-step-flow]]
     - [[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#constitution-principles]]
     - [[sources/geek-ai-agent/20260922/oryxos/docs/AiProgrammingGuide.md]]

### Tier 4 — OryxOS 核心能力實作
10. **[[learn/geek-ai-agent/nodes/oryxos-foundation|工程地基（init skill）]]**
   - Goal: 理解並能重建 OryxOS 的六塊工程地基（日誌、監控、HTTP、API 規範、代碼標準、安全、CI），以及 oryxos-init skill 如何把它壓成一個可重用流程。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第15节：完成基础模块开发：用 init skill 起工程地基.pdf#工程地基，包含这六块]]
     - [[sources/geek-ai-agent/20260922/第15节：完成基础模块开发：用 init skill 起工程地基.pdf#oryxos-init skill 做什么]]
     - [[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第四节.pdf#subagent-division]]
     - [[sources/geek-ai-agent/20260922/oryxos/CLAUDE.md]]
11. **[[learn/geek-ai-agent/nodes/oryxos-provider|Provider 抽象]]**
   - Goal: 看懂 Provider 只做選模、呼叫、轉換、審計，並能用顯式 name→ChatModel 映射與工具 schema 轉換實作一層薄介面。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第16节：Agent Provider 原理解析、实现与代码讲解.pdf#一-provider-是什么]]
     - [[sources/geek-ai-agent/20260922/第16节：Agent Provider 原理解析、实现与代码讲解.pdf#三-代码怎么写]]
     - [[sources/geek-ai-agent/20260922/第16节：Agent Provider 原理解析、实现与代码讲解.pdf#四-验收-harness]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#3.2 Provider 名到 ChatModel 的显式映射]]
     - [[sources/geek-ai-agent/20260922/oryxos/docs/TechnicalSolution.md]]
12. **[[learn/geek-ai-agent/nodes/oryxos-react-loop|手寫 ReAct 迴圈]]**
   - Goal: 能手寫 ReActLoop／PromptBuilder／ToolExecutor，說清迴圈只做排程、上下文如何累積與管理，以及為什麼不用框架黑盒。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第17节：ReAct 原理解析、实现与代码讲解.pdf#一-react-是什么]]
     - [[sources/geek-ai-agent/20260922/第17节：ReAct 原理解析、实现与代码讲解.pdf#二-动手前先想清楚]]
     - [[sources/geek-ai-agent/20260922/第17节：ReAct 原理解析、实现与代码讲解.pdf#三-代码怎么写]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#4.1 ReAct loop 算法]]
     - [[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#loop-mechanics]]
     - [[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/ReActLoop.java]]
     - [[sources/geek-ai-agent/20260922/oryxos/CLAUDE.md]]
13. **[[learn/geek-ai-agent/nodes/oryxos-cli-session|CLI 與 Session]]**
   - Goal: 看懂 CLI 作為薄入口的輕/重命令切分，以及 Session 的持久化與冪等 session id 設計。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第18节：CLI 功能概述、实现思路与代码讲解.pdf#一-cli-是什么]]
     - [[sources/geek-ai-agent/20260922/第18节：CLI 功能概述、实现思路与代码讲解.pdf#三-代码怎么写]]
     - [[sources/geek-ai-agent/20260922/第18节：CLI 功能概述、实现思路与代码讲解.pdf#四-验收-harness]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#8.6 命令行工具]]
     - [[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentService.java]]
14. **[[learn/geek-ai-agent/nodes/oryxos-notify|Notify 出站]]**
   - Goal: 能設計 NotifyChannelAdapter 介面與 Webhook 實作，理解 Agent 如何主動推送結果、以及如何擴到企業主流渠道。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第19节：Notify 模块 原理解析、实现与代码讲解.pdf#一-notify-是什么]]
     - [[sources/geek-ai-agent/20260922/第19节：Notify 模块 原理解析、实现与代码讲解.pdf#六-主流-notify-渠道与对接说明]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#8.4 Channel 接入]]
     - [[sources/geek-ai-agent/20260922/oryxos/docs/TechnicalSolution.md]]
15. **[[learn/geek-ai-agent/nodes/oryxos-tool|Tool 體系]]**
   - Goal: 掌握 OryxTool／ToolRegistry 單一抽象、三級 Plugin Tool（SKILL.md+MCP／自寫 MCP／Java Bean）與內建工具，並讓每次執行先過安全白名單。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第20节：Tool 体系 原理解析、实现与代码讲解.pdf#一-tool-是什么]]
     - [[sources/geek-ai-agent/20260922/第20节：Tool 体系 原理解析、实现与代码讲解.pdf#三-代码怎么写]]
     - [[sources/geek-ai-agent/20260922/第20节：Tool 体系 原理解析、实现与代码讲解.pdf#六-把基础工具补齐到业界水准]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#6.1 OryxTool 抽象]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#6.3 Plugin Tool 方式一]]
     - [[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/OryxTool.java]]
16. **[[learn/geek-ai-agent/nodes/oryxos-memory|Memory]]**
   - Goal: 能比較業界記憶方案（Mem0／MemGPT／Zep 等），說清短期 vs 長期、壓縮 vs 提煉，並實作 facade + 可插拔三後端。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#一-为什么-agent-需要-memory]]
     - [[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#六-业界方案盘点]]
     - [[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#十五-分阶段路线总览]]
     - [[sources/geek-ai-agent/20260922/第22节：Memory 实现与代码讲解.pdf#三-代码怎么写]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#5.2 MEMORY.md 文件设计]]
     - [[sources/geek-ai-agent/20260922/oryxos/docs/DemandAnalysis.md]]
     - [[sources/geek-ai-agent/20260922/oryxos/README.md]]
17. **[[learn/geek-ai-agent/nodes/oryxos-sandbox|Sandbox]]**
   - Goal: 能用四維隔離與四檔方案定位風險，實作應用層白名單並接進既有工具，且守住介面不被第一檔帶偏。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#一-为什么需要-sandbox]]
     - [[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#四-第一档应用层白名单]]
     - [[sources/geek-ai-agent/20260922/第23节：Sandbox 原理解析、业界方案与 OryxOS 设计评审.pdf#十四-分阶段实现路线]]
     - [[sources/geek-ai-agent/20260922/第24节：Sandbox 实现与代码讲解.pdf#三-代码怎么写]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#6.7 Sandbox 检查]]
     - [[sources/geek-ai-agent/20260922/oryxos/docs/TechnicalSolution.md]]
18. **[[learn/geek-ai-agent/nodes/oryxos-scheduler-web|定時任務與 Web Service]]**
   - Goal: 理解定時任務作為第三個觸發源與 Web Service 如何把引擎變成 REST 介面，並掌握 10 端點與管理平台。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第25节：定时任务模块 原理解析、实现与代码讲解.pdf#一-定时任务是什么]]
     - [[sources/geek-ai-agent/20260922/第26节：Web Service 与第一版管理平台 实现与代码讲解.pdf#一-Web-Service-是什么-干嘛用的]]
     - [[sources/geek-ai-agent/20260922/第26节：Web Service 与第一版管理平台 实现与代码讲解.pdf#三-代码怎么写]]
     - [[sources/geek-ai-agent/20260922/03-18 18. 项目篇 OryxOS：技术方案文档.html#7.2 核心阶段 10 个端点]]
     - [[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentScheduler.java]]

### Tier 5 — OryxOS 整合、插件化與交付
19. **[[learn/geek-ai-agent/nodes/oryxos-full-flow|全流程串聯]]**
   - Goal: 能把模組對表對賬成一條真能跑的主流程，找出五條典型縫隙，並驗證重啟恢復與多 Agent 並存。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#一-本节目标-让主流程真能用]]
     - [[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#二-3-会撞上的几个典型坑-怎么修]]
     - [[sources/geek-ai-agent/20260922/第28节：全流程串联（二）让底座自己跑得稳.pdf#一-本节目标-让底座自己跑得稳]]
     - [[sources/geek-ai-agent/20260922/第28节：全流程串联（二）让底座自己跑得稳.pdf#二-2-跨重启恢复]]
     - [[sources/geek-ai-agent/20260922/第28节：全流程串联（二）让底座自己跑得稳.pdf#二-3-多-Agent-并存]]
     - [[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentService.java]]
20. **[[learn/geek-ai-agent/nodes/oryxos-plugin-agent|插件化 Agent 與動態管理]]**
   - Goal: 懂一目錄一 Agent 的載入機制（AGENT.md→Profile→註冊→自跑）與動態管理（免重啟掃描、上傳即上線、一句話生成）。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#开篇-为什么敢叫-Agent-OS]]
     - [[sources/geek-ai-agent/20260922/第29节：插件化 Agent 一个目录定义一个会自己跑的 Agent.pdf#一-3-一个-Agent-目录长什么样]]
     - [[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#一-本节目标-Agent-能动态管-免重启]]
     - [[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#二-3-一句话生成一个-Agent]]
     - [[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentLoader.java]]
     - [[sources/geek-ai-agent/20260922/oryxos/CLAUDE.md]]
21. **[[learn/geek-ai-agent/nodes/oryxos-demo-release|Demo 與發布]]**
   - Goal: 能從三個業務 Agent 的目錄差異（光桿 AGENT.md／帶子指令／帶腳本）看清插件化的威力，並完成 v0.1.0 打包與驗收。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#二-Demo-一-每日天气]]
     - [[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#三-Demo-二-每日科技日报]]
     - [[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#四-Demo-三-每日-GitHub-日报]]
     - [[sources/geek-ai-agent/20260922/第31节：天气、科技日报、GitHub 日报 Agent 开发与演示.pdf#五-发布-打包-第一个版本]]
     - [[sources/geek-ai-agent/20260922/第32节：第一阶段总结、后续规划与社区推进.pdf#二-最重要的一张图-底座与-Agent-的分界]]
     - [[sources/geek-ai-agent/20260922/第32节：第一阶段总结、后续规划与社区推进.pdf#四-你带走的工作流]]
     - [[sources/geek-ai-agent/20260922/07-09 第 2 周作业.html#必做作业]]
     - [[sources/geek-ai-agent/20260922/7.26 直播.pdf#OryxOS定位与设计]]
     - [[sources/geek-ai-agent/20260922/oryxos/README.md]]

### Tier 6 — When 分散式系統藍圖
22. **[[learn/geek-ai-agent/nodes/distributed-clustering-fundamentals|集群化六機制與選型]]**
   - Goal: 能用成員、唯一決策、資料定位、故障接管、複製一致性、協調選型六機制拆解任何叢集系統，並判斷 OryxOS 與 When 為何選不同路線。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第33节：分布式 - 集群化架构：原理 + 拆解.pdf#membership]]
     - [[sources/geek-ai-agent/20260922/第33节：分布式 - 集群化架构：原理 + 拆解.pdf#leader-election]]
     - [[sources/geek-ai-agent/20260922/第33节：分布式 - 集群化架构：原理 + 拆解.pdf#data-locator]]
     - [[sources/geek-ai-agent/20260922/第33节：分布式 - 集群化架构：原理 + 拆解.pdf#failover]]
     - [[sources/geek-ai-agent/20260922/第33节：分布式 - 集群化架构：原理 + 拆解.pdf#replication]]
     - [[sources/geek-ai-agent/20260922/第33节：分布式 - 集群化架构：原理 + 拆解.pdf#coordination]]
     - [[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#comparison-table]]
     - [[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#how-to-choose]]
     - [[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#why-db-not-etcd]]
23. **[[learn/geek-ai-agent/nodes/when-spec|When 調研與需求]]**
   - Goal: 能說明延遲投遞的真實需求與現況缺口，並界定 When 的目標/非目標、AI 編程約束、3 週 MVP 與驗收標準。
   - Sources:
     - [[sources/geek-ai-agent/20260922/03-20 20. 项目篇 When：业界调研.html#一延时投递这件事在哪些地方出现]]
     - [[sources/geek-ai-agent/20260922/03-20 20. 项目篇 When：业界调研.html#二消息中间件的延时能力]]
     - [[sources/geek-ai-agent/20260922/03-20 20. 项目篇 When：业界调研.html#八延时投递的底层算法]]
     - [[sources/geek-ai-agent/20260922/03-20 20. 项目篇 When：业界调研.html#十综合判断]]
     - [[sources/geek-ai-agent/20260922/03-21 21. 项目篇 When： 项目需求文档.html#1-项目概述]]
     - [[sources/geek-ai-agent/20260922/03-21 21. 项目篇 When： 项目需求文档.html#4-ai-编程开发约束]]
     - [[sources/geek-ai-agent/20260922/03-21 21. 项目篇 When： 项目需求文档.html#6-训练营版本]]
     - [[sources/geek-ai-agent/20260922/03-21 21. 项目篇 When： 项目需求文档.html#14-验收标准]]
24. **[[learn/geek-ai-agent/nodes/when-technical-solution|When 技術方案]]**
   - Goal: 看懂 When 的六大技術決策、整體架構、多層時間輪、Master/Slave 複製、持久化 key 設計與部署形態。
   - Sources:
     - [[sources/geek-ai-agent/20260922/03-22 22. 项目篇 When：技术方案文档.html#2-核心技术决策]]
     - [[sources/geek-ai-agent/20260922/03-22 22. 项目篇 When：技术方案文档.html#3-整体架构]]
     - [[sources/geek-ai-agent/20260922/03-22 22. 项目篇 When：技术方案文档.html#5-多层时间轮设计]]
     - [[sources/geek-ai-agent/20260922/03-22 22. 项目篇 When：技术方案文档.html#6-masterslave-副本机制]]
     - [[sources/geek-ai-agent/20260922/03-22 22. 项目篇 When：技术方案文档.html#9-持久化层设计]]
     - [[sources/geek-ai-agent/20260922/03-22 22. 项目篇 When：技术方案文档.html#14-部署架构]]

### Tier 7 — When 模組與整合
25. **[[learn/geek-ai-agent/nodes/when-loop-model|When Loop 模型與驗收體系]]**
   - Goal: 能設計 When 的兩次 Loop 跑法、公開/模組兩層 Harness，與不可收買的測試驗收體系（測試金字塔＋故障注入）。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#two-runs]]
     - [[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#harness-two-layers]]
     - [[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#part-one-single-machine]]
     - [[sources/geek-ai-agent/20260922/第37节：设计 When 的 Loop 模型.pdf#part-two-distributed]]
     - [[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#test-pyramid]]
     - [[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#distributed-correctness-hardest]]
     - [[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#fault-injection]]
     - [[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#judge-cannot-be-bribed]]
     - [[sources/geek-ai-agent/20260922/03-23 23. 项目篇 When：AI 编程实施指引.html#3-第一步设计-harness建立护栏]]
     - [[sources/geek-ai-agent/20260922/03-23 23. 项目篇 When：AI 编程实施指引.html#4-第二步从需求和设计拆-spec]]
26. **[[learn/geek-ai-agent/nodes/when-contracts-ingress|公共契約與接入路由]]**
   - Goal: 能定義 Message 模型與狀態機、四大公共介面，並實作 gRPC 契約、接入層與一致雜湊路由。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#message-model]]
     - [[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#state-machine]]
     - [[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#contract-map]]
     - [[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#interface-contract-design]]
     - [[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#features-and-interactions]]
     - [[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#interface-contract-design]]
27. **[[learn/geek-ai-agent/nodes/when-storage-metadata|存儲與元數據]]**
   - Goal: 能設計 StoragePlugin 與 Redis key 結構（避開 big-key），並在 ZK／etcd／Consul 間選型與定義 etcd key space。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#interface-and-key-structure]]
     - [[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#acceptance-and-tests]]
     - [[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#interface-and-key-space]]
     - [[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#field-and-key-definitions]]
28. **[[learn/geek-ai-agent/nodes/when-timewheel-cluster|時間輪與節點集群]]**
   - Goal: 能手寫多層時間輪（O(1) add/remove、跨層 cascade、重啟重建），並實作節點註冊、Lease 續約、Controller 選舉與 Watch。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#why-designed-this-way]]
     - [[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#interface-contract-design]]
     - [[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#field-and-parameter-definitions]]
     - [[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#features-and-interactions]]
     - [[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#acceptance-and-tests]]
29. **[[learn/geek-ai-agent/nodes/when-ha-sink|故障恢復與 Sink]]**
   - Goal: 能實作 Master/Slave 非同步複製與 10 秒接管、Controller 事件驅動決策，以及 SPI 化的 HTTP／Kafka Sink 與重試策略。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第47节：故障恢复——Master-Slave 副本同步（Loop 原料）.pdf#2-为什么这么设计]]
     - [[sources/geek-ai-agent/20260922/第47节：故障恢复——Master-Slave 副本同步（Loop 原料）.pdf#6-接口--契约设计本节新增-ha-契约]]
     - [[sources/geek-ai-agent/20260922/第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）.pdf#5-功能与交互]]
     - [[sources/geek-ai-agent/20260922/第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）.pdf#6-接口--契约设计]]
     - [[sources/geek-ai-agent/20260922/第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）.pdf#7-字段--策略定义]]
30. **[[learn/geek-ai-agent/nodes/when-observability-deploy-console|可觀測、管理台與部署]]**
   - Goal: 能建立五類 Prometheus 指標與 trace_id 串接、Vue 管理台與業務/管理 HTTP API，並用 compose／K8s／CI 一鍵部署。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第50节：可观测体系搭建——Metrics 体系（Loop 原料）.pdf#6-接口--契约设计]]
     - [[sources/geek-ai-agent/20260922/第50节：可观测体系搭建——Metrics 体系（Loop 原料）.pdf#7-字段--指标定义]]
     - [[sources/geek-ai-agent/20260922/第51节：Web 管理台（Loop 原料）.pdf#6-接口--契约设计admin-http-api]]
     - [[sources/geek-ai-agent/20260922/第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）.pdf#6-接口--契约设计配置--制品]]
     - [[sources/geek-ai-agent/20260922/第52节：部署与 CI——docker-compose、Kubernetes（Loop 原料）.pdf#7-字段--阶段定义]]
31. **[[learn/geek-ai-agent/nodes/when-integration-summary|聯調與總結]]**
   - Goal: 能跑通完整 HA 的兩次 Loop 聯調（部署→訊息操作→管理台→故障接管），並複述六大技術決策與硬指標如何被自動驗收。
   - Sources:
     - [[sources/geek-ai-agent/20260922/第46节：Loop 运行演示课（整合运行）.pdf#loop-runner-two-loops-and-context]]
     - [[sources/geek-ai-agent/20260922/第46节：Loop 运行演示课（整合运行）.pdf#problem-handling]]
     - [[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#4-怎么跑四步]]
     - [[sources/geek-ai-agent/20260922/第53节：Loop 运行演示·联调（第二次跑·完整 HA）.pdf#5-该跑出什么]]
     - [[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#3-六大技术决策]]
     - [[sources/geek-ai-agent/20260922/第54节：When 项目总结与后续规划.pdf#5-但这门课真正的主角]]
     - [[sources/geek-ai-agent/20260922/直播2：Loop Engineering 的实践与 OPC 提效.pdf#case-split-and-run]]
     - [[sources/geek-ai-agent/20260922/直播2：Loop Engineering 的实践与 OPC 提效.pdf#boundary-line]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
