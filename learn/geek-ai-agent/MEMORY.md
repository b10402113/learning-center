---
subject: geek-ai-agent
language: zh-Hant
created: 2026-09-22
updated: 2026-09-22
---

# MEMORY — geek-ai-agent

## Goal
能用 AI 主導交付一個企業級 Agent 系統（OryxOS 級），並把同一套 SDD + Harness + Loop 工作流複製到自己的專案。以整門實戰營為載體走完三條線：認知篇建立判斷力；OryxOS 底座從需求分析 → Provider / ReAct / CLI / Notify / Tool / Memory / Sandbox / 排程 / Web → 全流程串聯 → 插件化與動態管理 → 發布 v0.1.0；When 用 Loop 工程做一個分散式延遲投遞元件（etcd 協調、時間輪、Master/Slave、10 秒 failover）。

## Why
讓 OryxOS 從「我讀過」變成「我能自己重建／擴充」——把底座每個能力對回自己寫的 ReAct loop，缺哪層補哪層；並把 Loop Engineering 搬回公司的 Java 平台，讓一個人交付遠超一個人的事。這個動機是卡關（環境摩擦、AI 亂搞、分散式難驗）時真正撐得住的錨。

## Prior experience
- Java 21 / Spring Boot 3.x、Maven 多模組——底層前提已熟，**不重教**，只教它們在 OryxOS／When 裡怎麼被用。
- 自己寫過 OryxOS 的 ReAct loop；了解自寫 loop vs 框架黑盒的取捨。
- Redis、MQ、Docker/Compose。
- 分散式概念（DDIA）：複製、一致性、冪等、exactly-once、event log。
- Claude Code / opencode 重度使用（本身就是帶 harness 的 agent）。
- LangGraph 多節點 agent + SSE 串流（llm-project）。
- **新知識、要從零教**：Spec-Kit、etcd（Lease / Watch / Txn）、時間輪（timing wheel）、Spring AI Alibaba、gRPC、Prometheus / Micrometer、K8s 部署。

## Anchors
- 自己的 OryxOS repo——每個底座能力都可對照「我的 loop 缺這層會怎樣」。
- 公司的 Java 平台——Loop/Harness 最終要搬回去的地方。
- When 的四份文件（業界調研 → 需求 → 技術方案 → AI 編程指引），是可複製的文件鏈範本。
- `agent-harness` 的 TS runtime——同構對照：TS 版能力 vs Java 生產版實作。
- 日常使用 Claude Code / opencode——從「使用者的體感」反推「內部怎麼做」。

## Habits & constraints
- **每週 1–2 小時，且碎片化**——內容必須切成小塊能一次讀完，不能一篇長文壓下來。
- Mac 環境，能跑 Java / OryxOS；可自行安裝 etcd、Redis、Docker。
- 無硬性 deadline，中等壓力。

## Knowledge type
mixed，**procedural 為主**。核心是「會做且能複製」的交付能力；但此主題含大量 declarative 內容（認知篇的判斷、Agent OS 架構、分散式原理、選型取捨），這些要在「做的脈絡」裡講，不空談理論。

## How to teach me
- **架構優先，程式碼為佐證**：先講清楚架構與「這層為什麼存在」，再用 repo 真程式碼對照關鍵片段；不要求每步都自己跑。
- 簡潔、密度高、不要廢話；**跳過 Java / Spring / tooling / basics**。
- 每篇要能**碎片化讀完**，結尾落在「真的能跑或真的能決定」的事上。
- **認知篇也要深教**（不略讀），但用「判斷／取捨」的方式講，不堆名詞與清單。
- 用「為什麼 X 很重要？」點價值，配具體例子與數字，不堆術語。
- 講「為什麼」的機制（為什麼 context 會變笨、為什麼 Lease 能偵測節點死亡、為什麼時間輪是 O(1)）幫我記住「怎麼做」。
- 輸出語言 **zh-Hant**；程式碼、識別字、API 名稱保持英文。
