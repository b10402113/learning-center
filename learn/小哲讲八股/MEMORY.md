---
subject: 小哲讲八股
language: zh-Hant
created: 2026-09-26
updated: 2026-09-26
---

# MEMORY — 小哲讲八股

## Goal
把 Java 後端八股（Java 核心 / Spring 全家桶 / MySQL / Redis / MQ / 分散式 / OS / 網路）讀成「能講得清楚、扛得住追問」的底層理解——以面試追問當磨刀石，但每個節點都落到「為什麼」的機制，不是死背答案。全部模組都要覆蓋；不熟的部分要展開、多描述。

## Why
不想被看破「只會 CRUD、底層不懂」；把底層補齊，讓日常架構決策有底氣。沿用其他科目「功能開發者 → 架構負責人」這條線。台灣/其他市場，拿這套當 Java 底層與分散式的複習材料，不是死背中國大陸題庫。

## Prior experience
- Java 後端 + Spring 系列實戰（Spring、MyBatis、DI/AOP/starter）
- 大型系統 / 微服務、分散式概念（DDIA：複製、一致性、冪等、event log）
- Redis（緩存 / 分佈式鎖 / 多級緩存）、MQ 發送與事件監聽實戰
- 讀過框架但**未讀框架源碼**
- 弱項：JVM / JUC 底層、MySQL 底層、分散式 + 中間件、OS / 網路底層
- LLM / Agent 很熟（geek-ai-agent、SpringAI、llm-project）→ AI 模組淺帶

## Anchors
- 公司 Java 平台與既有微服務——分散式 / MQ 概念可掛
- 日常用 Redis 緩存、MQ 事件——快取一致性、訊息可靠性、冪等可掛
- 堆過 ifelse 業務大類 / 重構經驗——設計模式、DDD、Spring 設計模式可掛
- Claude Code / opencode 重度使用——LLM / Agent 模組可掛
- 用過 MySQL / Postgres 但沒從第一性原理想過——索引、MVCC、WAL、複製可掛
- MyBatis mapper 接口「沒實現類卻能調用」——代理、插件機制的最佳鉤子

## Habits & constraints
- 每週 1–3 小時、碎片化、時段不固定；Mac；無硬性 deadline
- 內容需切成可一次讀完的小塊，可隨時中斷與繼續
- 無白板 / 繪圖工具；有 IDE，但碎片時間不保證每次動手
- 學習環境：工作機為主

## Knowledge type
mixed。八股主體偏 **declarative**（要「講得出來」機制與取捨）；JUC 手寫題、SQL 調優、系統設計題偏 **procedural**。概念記憶不是瓶頸，瓶頸在「拿到題目後如何一步步講清楚、並扛住追問」。

## How to teach me
- 場景 → 概念、why-first；每個元素問「這解決什麼問題、不這樣做會怎樣」
- 好壞對比（壞味道 vs 重構後、方案 A vs 方案 B）最能記住
- 帶 Q&A 自測（配合 `/tackle`），否則碎片時間下看完就忘
- 不要抽象名詞轟炸；密度高、不鋪陳、不長篇定義
- **弱項深教**：JVM/JUC 底層、MySQL 底層、分散式 + 中間件、OS / 網路
- **已熟淺帶**：Java / Spring / Redis / MQ 的實戰面，LLM / Agent（只帶過）
- 講「為什麼」的機制（為什麼 GC 會 STW、為什麼 AQS 用 CLH 佇列、為什麼有 MVCC、為什麼 epoll 快）幫我記住「怎麼講」
- 輸出語言 **zh-Hant**；簡體術語（如「线程池」「脏读」）在對照面試原題時保留中文，程式碼 / 識別字 / API 名稱保持英文
