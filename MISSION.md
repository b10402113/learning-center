# Mission — OryxOS：從 0 寫一個 Agent OS

## Why

學會用 AI coding agent 把企業級真實項目「做成」。先建立一套能落地的 AI 編程工作流（SDD + Harness），再真動手從 0 寫出一個 Agent OS（OryxOS：JDK 21 + Spring Boot + 自研 ReAct loop），把「用 AI 把一件事做成」變成肌肉記憶。

## The goal

完成 OryxOS 節點的五個步驟後，你能：

1. 說清楚 Agent OS 的定義、五項能力、與編排平台/框架/SaaS 的邊界
2. 掌握 Spec-Kit 驅動的 AI 編程全流程（constitution → specify → plan → tasks → implement）
3. 理解七條憲法原則和九模塊技術架構
4. 說明 Provider 抽象層為什麼要用顯式名稱映射而不是類型掃描
5. 描述自研 ReAct 循環引擎的演算法和 Spring AI 的邊界

## How this node fits

OryxOS 是本課程唯一真動手的項目（Tier 3），五個步驟按依賴鏈推進：

1. **Agent OS 概念與 OryxOS 定位** — 理解 Agent OS 的定義、五項能力、選 Java 的理由（本課）
2. **Spec-Kit 工作流與七條憲法** — 掌握雙階段策略和憲法原則（after step 1）
3. **Provider 抽象層與 LLM 對接** — 實作 provider-name→ChatModel 映射（after step 2）
4. **ReAct 循環引擎** — 實作自研循環引擎，核心 ~數十行 Java（after step 3）
5. **Memory、Tool 與 Web Service** — 完成三層記憶、三級工具、10 個 Endpoint（after step 4）

## Success looks like

- 能用四個詞（統一、私有、易接入、可觀測）判斷任何新功能進不進核心範圍
- 能畫出 Agent OS 的五項能力清單並對應五個 user story
- 能解釋為什麼 OryxOS 選 Java 而不是 Node.js/Python
- 能區分 Agent OS、編排平台、框架和大廠 SaaS

## Current status

- [ ] Step 1 — Agent OS 概念與 OryxOS 定位（本課）
- [ ] Step 2 — Spec-Kit 工作流與七條憲法
- [ ] Step 3 — Provider 抽象層與 LLM 對接
- [ ] Step 4 — ReAct 循環引擎
- [ ] Step 5 — Memory、Tool 與 Web Service
