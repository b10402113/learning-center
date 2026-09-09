---
subject: llm-project
status: draft
path: systems (系統鳥瞰)
created: 2026-09-09
---

# ROADMAP — llm-project

## Goal
能獨立搭建一個類似的 NL2SQL 系統——從數倉建模、元數據知識庫構建、多路召回設計、Agent 工作流編排，到前端流式交互，全鏈路跑通。重點理解 RAG 多路召回機制與前後端 SSE 串接。

## Learning path
**系統鳥瞰（systems）**：從「一個查詢怎麼從用戶手指走到資料庫再回來」的完整數據流切入，先建立全局心智模型，再逐層拆開每個模塊。優化整體感——先知道每個零件在哪、幹什麼，再逐個學怎麼做。Tier 從全景到基礎設施到檢索到生成到交付，由粗到細。

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe llm-project/<node-id>` to measure a node, then `/nodes llm-project/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 全景
1. **[[learn/llm-project/nodes/data-flow|一個查詢的完整旅程]]**
   - Goal: 能畫出從用戶提問到結果返回的完整數據流，說清每個階段的輸入/輸出
   - Sources:
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#項目概述]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#概述-1]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#問數智能體]]

### Tier 2 — 數據基礎
2. **[[learn/llm-project/nodes/star-schema|數倉星型模型]]**
   - Goal: 能讀懂 fact_order + 4 張 dim 表的結構，理解事實表/維度表/度量/外鍵的分工
   - Sources:
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#數倉-數據庫]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/5.SQL腳本/dw-schema.sql]]

3. **[[learn/llm-project/nodes/demo-data|演示數據與 SQL 腳本]]**
   - Goal: 能跑通建庫建表 + 插入演示數據的完整流程，理解數據規模與覆蓋範圍
   - Sources:
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/5.SQL腳本/dw-schema-data.sql]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/5.SQL腳本/meta-schema-data.sql]]

4. **[[learn/llm-project/nodes/metadata-tables|元數據知識庫結構]]**
   - Goal: 能說清 table_info/column_info/metric_info/column_metric 四張表的設計意圖與字段含義
   - Sources:
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#元數據知識庫]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/5.SQL腳本/meta-schema.sql]]

### Tier 3 — 元數據構建
5. **[[learn/llm-project/nodes/metadata-sync|元數據同步流水線]]**
   - Goal: 能走讀 MetaKnowledgeService.build()，理解從 YAML 配置到 MySQL + Qdrant + ES 的完整同步流程
   - Sources:
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#具體實現-1]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#核心業務邏輯]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/services/meta_knowledge_service.py]]

6. **[[learn/llm-project/nodes/client-managers|異步客戶端管理]]**
   - Goal: 能說清 MySQL/Qdrant/ES/Embedding 四個客戶端管理器的初始化、單例模式與 lifespan 生命週期
   - Sources:
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#mysql客戶端管理]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/clients/mysql_client_manager.py]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/core/lifespan.py]]

### Tier 4 — 檢索層
7. **[[learn/llm-project/nodes/keyword-extraction|關鍵詞抽取]]**
   - Goal: 能用 jieba 按詞性抽取關鍵詞，理解為什麼需要從自然語言中提取檢索詞
   - Sources:
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#具體實現-2]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/agent/nodes/extract_keywords.py]]

8. **[[learn/llm-project/nodes/column-recall|字段向量召回]]**
   - Goal: 能解釋 LLM 擴展關鍵詞 → Embedding → Qdrant 向量檢索 → 去重的完整鏈路
   - Sources:
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#向量索引]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/extend_keywords_for_column_recall.prompt]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/agent/nodes/recall_column.py]]

9. **[[learn/llm-project/nodes/metric-recall|指標向量召回]]**
   - Goal: 能區分字段召回與指標召回的分工——指標層負責「度量什麼」，字段層負責「從哪裡取」
   - Sources:
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#向量索引]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/extend_keywords_for_metric_recall.prompt]]
     - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/agent/nodes/recall_metric.py]]

10. **[[learn/llm-project/nodes/value-recall|值全文召回]]**
    - Goal: 能解釋 ES 全文檢索 + IK 分詞器如何解決「自然語言描述匹配真實維度值」的問題
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#向量索引]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/extend_keywords_for_value_recall.prompt]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/agent/nodes/recall_value.py]]

11. **[[learn/llm-project/nodes/merge-filter|合併收斂與 LLM 過濾]]**
    - Goal: 能走讀三路合并 + filter_table/filter_metric 的精篩邏輯，理解「先召回再裁剪」的設計
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#具體實現-2]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/filter_table_info.prompt]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/filter_metric_info.prompt]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/agent/nodes/merge_retrieved_info.py]]

### Tier 5 — Agent 編排
12. **[[learn/llm-project/nodes/agent-state|Agent 狀態與依賴注入]]**
    - Goal: 能區分 DataAgentState（請求級可變數據）與 DataAgentContext（應用級單例），理解狀態驅動設計
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/agent/state.py]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/agent/context.py]]

13. **[[learn/llm-project/nodes/agent-graph|StateGraph 圖編排]]**
    - Goal: 能讀懂 12 節點圖結構：並行召回分支、validate → correct 條件分支、流式執行機制
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#graph]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/agent/graph.py]]

14. **[[learn/llm-project/nodes/extra-context|上下文注入與日期感知]]**
    - Goal: 能解釋 add_extra_context 節點如何注入當前日期與數據庫方言信息，讓 LLM 具備時間感知
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/agent/nodes/add_extra_context.py]]

### Tier 6 — Prompt 與 SQL 生成
15. **[[learn/llm-project/nodes/prompt-design|Prompt 模板體系]]**
    - Goal: 能說清 Prompt 與代碼分離的設計，理解 load_prompt 機制與模板結構
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/prompt/prompt_loader.py]]

16. **[[learn/llm-project/nodes/keyword-prompts|關鍵詞擴展 Prompts]]**
    - Goal: 能讀懂三個擴展 Prompt（字段/指標/值）的約束設計，理解「查詢擴展」如何提升召回率
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/extend_keywords_for_column_recall.prompt]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/extend_keywords_for_metric_recall.prompt]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/extend_keywords_for_value_recall.prompt]]

17. **[[learn/llm-project/nodes/sql-prompts|SQL 生成與校正 Prompts]]**
    - Goal: 能讀懂 generate_sql + correct_sql 的約束邏輯，理解「最小必要 schema + 口徑遵循 + 校正回路」
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/generate_sql.prompt]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/3.prompts/correct_sql.prompt]]

### Tier 7 — API 與前端
18. **[[learn/llm-project/nodes/fastapi-server|FastAPI 服務器搭建]]**
    - Goal: 能說清 app 入口、lifespan 資源管理、Depends 依賴注入鏈的完整設計
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#具體實現-3]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/main.py]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/api/dependencies.py]]

19. **[[learn/llm-project/nodes/sse-streaming|SSE 流式響應]]**
    - Goal: 能解釋 graph.astream → StreamingResponse 的橋接機制，理解 progress/result/error 三種事件
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#具體實現-3]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/api/routers/query_router.py]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent/app/services/query_service.py]]

20. **[[learn/llm-project/nodes/frontend-integration|Vue 前端與全棧聯調]]**
    - Goal: 能走讀 App.vue 的 SSE 消費邏輯，理解進度步驟渲染與結果表格的前端實現
    - Sources:
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/1.筆記/尚硅谷大模型項目之掌柜問數.md#前後端聯調]]
      - [[sources/llm-project/20260909/尚硅谷大模型項目之掌柜問數/完整代碼/data-agent-fronted/src/App.vue]]

## Status
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
