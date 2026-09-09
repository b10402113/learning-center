---
subject: llm-project
created: 2026-09-09
updated: 2026-09-09
---

# Mastery — llm-project

## data-flow

- overview:
  - 全局架構: unknown
  - 數據流階段: unknown
  - 輸入輸出: unknown
- metadata-foundation:
  - MySQL 結構化存儲: unknown
  - Qdrant 向量索引: unknown
  - ES 全文索引: unknown
- retrieval-to-sql:
  - 關鍵詞抽取: unknown
  - 三路並行召回: unknown
  - SQL 生成與校驗: unknown
- streaming-stack:
  - SSE 流式協議: unknown
  - 前端消費: unknown

> probe skipped via /nodes llm-project/data-flow skip-probe on 2026-09-09

## star-schema

- star-schema-concepts:
  - 星型模型定義: unknown
  - 事實表 vs 維度表: unknown
  - 多維分析: unknown
- fact-order-structure:
  - 外鍵連接: unknown
  - 度量字段: unknown
  - order_id 格式: unknown
- dim-tables-structure:
  - dim_customer 結構: unknown
  - dim_date 結構: unknown
  - dim_product 結構: unknown
  - dim_region 結構: unknown

> probe skipped via /nodes llm-project/star-schema skip-probe on 2026-09-09

## metadata-tables

- metadata-layer:
  - 元數據知識庫目的: unknown
  - table_info 設計: unknown
  - column_info 設計: unknown
- metric-layer:
  - metric_info 設計: unknown
  - column_metric 關聯: unknown
  - 指標別名匹配: unknown
- nl2sql-flow:
  - 四表協同角色: unknown
  - role 分類機制: unknown

> probe skipped via /nodes llm-project/metadata-tables skip-probe on 2026-09-09

## demo-data

- star-schema-structure:
  - dw 表結構: unknown
  - 事實表與維度表分工: unknown
- demo-data-scale:
  - 數據規模與覆蓋: unknown
  - 行數與維度範圍: unknown
- metadata-content:
  - column_info.role 分類: unknown
  - 指標定義與關聯: unknown
  - 表角色登記: unknown
- initialization-flow:
  - 建庫建表順序: unknown
  - 數據完整性驗證: unknown
  - dw 與 meta 上下游關係: unknown

> probe skipped via /nodes llm-project/demo-data skip-probe on 2026-09-09
