---
subject: ai-agents-in-action
status: draft
created: 2026-08-17
---

# ROADMAP — ai-agents-in-action

## Goal
能動手構建並交付可運行的 AI agent 系統——從單一 agent（OpenAI Agents SDK）一路到多智能體系統、MCP 伺服器、RAG+記憶、評估與部署。學完能自己搭出工具、MCP server、多智能體流程，且是能部署的形態。

## How to use
按順序閱讀各節點。每個節點是一個 step-DAG。先執行 `/probe ai-agents-in-action/<node-id>` 測量該節點的掌握度，再執行 `/nodes ai-agents-in-action/<node-id>` 確認並開始撰寫。

## Nodes

### Tier 1 — 心智模型
1. **[[learn/ai-agents-in-action/nodes/agents-basics|智能體是什麼]]**
   - Goal: 能用自己的話定義 AI 智能體（感知-決策-行動），並沿「自主性」軸分辨助理 vs 智能體，解釋 sense-plan-act-learn 迴圈與工具的作用。
   - Sources:
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.1.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.1.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.1.3]]
2. **[[learn/ai-agents-in-action/nodes/agent-layers|智能體的五個功能層]]**
   - Goal: 能說出並解釋一個 agent 的五個功能層（persona、工具與行動、推理與規劃、知識與記憶、評估與回饋），並知道它們如何在 agentic loop 中交錯運作。
   - Sources:
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.4]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.5]]
3. **[[learn/ai-agents-in-action/nodes/llm-foundations|LLM 基礎]]**
   - Goal: 能解釋 LLM 是機率 token 機器、token 與採樣參數（temperature/top-p）如何影響輸出，並據此預測與調控 agent 行為。
   - Sources:
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.1.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.1.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.1.3]]

### Tier 2 — 單一智能體建造
4. **[[learn/ai-agents-in-action/nodes/prompt-engineering|提示工程]]**
   - Goal: 能為 agent 塑造可靠 persona——運用核心提示技巧、像 LLM 一樣思考、避開常見陷阱，並知道何時該動手寫提示、何時該換成結構化推理。
   - Sources:
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.2.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.2.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.2.3]]
5. **[[learn/ai-agents-in-action/nodes/building-single-agent|建第一個 agent]]**
   - Goal: 能用 OpenAI Agents SDK 建立、設定並追蹤一個單一 agent——含模型參數、型別輸出、工具整合與 tool-use 追蹤。
   - Sources:
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3.4]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.4]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.4.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.4.2]]
6. **[[learn/ai-agents-in-action/nodes/mcp-fundamentals|MCP 基礎]]**
   - Goal: 能解釋 MCP 解決的標準化問題、其 client/server/service 架構、tools/resources/prompts 三類核心組件，以及它們如何支撐 agent 的功能層。
   - Sources:
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.4]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.5]]
7. **[[learn/ai-agents-in-action/nodes/mcp-building|建與用 MCP 伺服器]]**
   - Goal: 能動手建一個 MCP server（含把既有工具轉成 server）、用 MCP inspector 除錯、理解 STDIO/SSE 傳輸，並讓 agent 透過本機或遠端 MCP 使用外部工具。
   - Sources:
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2.4]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.3.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.3.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.3.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.4]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.4.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.4.2]]
8. **[[learn/ai-agents-in-action/nodes/reasoning-planning|推理與規劃]]**
   - Goal: 能依任務性質選用推理模式——CoT、ReAct、ToT、Reflexion——並用 sequential thinking MCP server 作為外部推理草稿紙，寫出會規劃、會自我修正的 agent。
   - Sources:
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.1.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.1.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.1.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.2.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.2.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.3.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.3.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.3.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.4]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.4.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.4.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.4.3]]

### Tier 3 — 多智能體系統
9. **[[learn/ai-agents-in-action/nodes/multi-agent-architecting|多智能體架構]]**
   - Goal: 能為問題選擇多智能體模式（flow / orchestration / collaboration），設計決策控制與通訊方式（shared memory / 訊息 / MCP），並用成本-能力取捨衡量。
   - Sources:
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.4]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.4.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.4.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.4.3]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.1.1]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.1.2]]
     - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.1.3]]
10. **[[learn/ai-agents-in-action/nodes/agent-flows-handoffs|智能體流程與交接]]**
    - Goal: 能把單體 agent 改造成 agent flow，在流程中引入確定性決策點與 handoff，視覺化並監控流程，並用 input/output guardrails 驗證。
    - Sources:
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.2.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.2.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.2.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.3.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.3.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.3.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.4.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.4.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.4.3]]

### Tier 4 — 知識、記憶與評估
11. **[[learn/ai-agents-in-action/nodes/rag-foundations|RAG 基礎]]**
    - Goal: 能解釋 RAG 的檢索-生成流程、向量資料庫與相似度搜尋的運作原理，並能建出 embedding 檢索的最小實作。
    - Sources:
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.2.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.2.2]]
12. **[[learn/ai-agents-in-action/nodes/rag-agents-memory|RAG agent 與記憶]]**
    - Goal: 能建出向量與混合搜尋的 RAG agent（含 grounding 與引用），並用 MCP 幫 agent 接上持久記憶（graph store、混合記憶、壓縮）。
    - Sources:
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.5]]
13. **[[learn/ai-agents-in-action/nodes/agent-evaluation|評估與回饋]]**
    - Goal: 能對 agent 建立可量測的評估——測試驅動開發、grounding/critic/rubric agent、Phoenix 追蹤與標註——讓改進看得見。
    - Sources:
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.5]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4.4]]

### Tier 5 — 生產與安全
14. **[[learn/ai-agents-in-action/nodes/deploying-agents|部署智能體]]**
    - Goal: 能把 agent 產品化——嵌入網頁/API、Docker 容器化、選擇 runtime 與多智能體拓撲，並處理狀態、可觀測性、可靠性與成本。
    - Sources:
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.1.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.1.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.1.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.2.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.2.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.2.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.5]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.6]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.7]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.8]]
15. **[[learn/ai-agents-in-action/nodes/security-governance|安全、可靠性與治理]]**
    - Goal: 能對 agent 系統做威脅建模，並落實身份/存取、機密管理、工具沙箱、prompt-injection 防禦與政策執行。
    - Sources:
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.5]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.6]]

### Tier 6 — 進階架構與實戰
16. **[[learn/ai-agents-in-action/nodes/agentic-loop|Agentic loop]]**
    - Goal: 能看穿 agent 的三層迴圈（內部 SPAL、任務迴圈、meta 迴圈），並實作 deep research agent 與多智能體編排/協作迴圈。
    - Sources:
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.1.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.1.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.1.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.5]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.6]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.7]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.8]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.4]]
17. **[[learn/ai-agents-in-action/nodes/cognitive-agent|認知智能體]]**
    - Goal: 能把心智理論（Minsky、Baars、Kahneman）對映成可執行的認知架構（工作空間+六模組），並實作後設認知監控與能力衡量。
    - Sources:
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.5]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.5]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.6]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.7]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.8]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.5]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.6]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.7]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.4]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.4.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.4.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.4.3]]
18. **[[learn/ai-agents-in-action/nodes/field-tips|實戰建議]]**
    - Goal: 能把五層的現場經驗法則與客服 / RAG / deep research 三種 agent 的實務建議，轉成自己系統的檢查清單。
    - Sources:
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#11.1]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#11.2]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#11.3]]
      - [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#11.4]]

## Status
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written