---
subject: llm-project
language: zh-Hant
created: 2026-09-09
updated: 2026-09-09
---

# MEMORY — llm-project

## Goal
能獨立搭建一個類似的 NL2SQL 系統——從數倉建模、元數據知識庫構建、多路召回設計、Agent 工作流編排，到前端流式交互，全鏈路跑通。重點理解 RAG 多路召回機制與前後端 SSE 串接。

## Why
動機全面：工作中要用 NL2SQL/智能問答產品、想掌握 LangGraph + 多路召回 + RAG 這套可遷移的模式、有個人項目要做、同時需要這塊知識應對面試或轉型。動力是多線並行的，學起來遇到難點時有足夠的錨點堅持下去。

## Prior experience
- Python 熟練：寫過 FastAPI/Django 項目，async/await 用過
- SQL 能寫簡單查詢：SELECT/WHERE/GROUP BY，但 JOIN、子查詢、窗口函數還不熟
- LangGraph Agent 搭過：7-8 個節點，用 FAISS 做 RAG 檢索，有實際經驗
- FastAPI 用過 Depends 依賴注入，但 SSE 流式響應和 lifespan 管理沒碰過
- 向量庫只用過 FAISS，Qdrant/ES 完全沒接觸
- 數倉概念（星型模型、事實表/維度表）完全沒接觸過
- 前端能看懂基本代碼，寫過簡單頁面，Vue/React 有基本概念

## Anchors
- LangGraph Agent → 你搭過 7-8 節點的 Agent，用 FAISS 做 RAG。掌柜問數也是多節點 Agent + RAG，只是把 FAISS 換成 Qdrant/ES，節點更多（12 個），架構可直接遷移
- FAISS 向量檢索 → Qdrant 是同類但功能更豐富（支持過濾、多集合），概念可復用
- FastAPI Depends → 你已會依賴注入，SSE 和 lifespan 是新模式但不難
- 數倉 → 全新領域，需要從星型模型講起，用實際表結構做具體錨點

## Habits & constraints
- 時間不固定，有空就學
- Mac + VSCode 環境，能跑 Python、能裝 Docker
- 偏好先快速過一遍整體架構，再回頭細看具體模塊
- 喜歡 15-20 分鐘一個完整模塊的節奏，不要太慢拖沓

## Knowledge type
mixed，過程性偏重。既要理解原理（星型模型、RAG 架構、LangGraph 狀態機），也要能動手搭出來（寫 SQL、搭工作流、配 Qdrant/ES、寫 Prompt、搭 SSE 接口）。

## How to teach me
- 最有效的方式：看別人寫的項目，對照著改——以掌柜問數源碼為主線，邊讀邊理解
- 討厭講太慢、節奏拖沓——每個模塊控制在 15-20 分鐘
- 先看全貌再深入——roadmap 應該先給整體架構鳥瞰，再分模塊細講
- 代碼示例要完整但不能一下塞太多——每步一個聚焦點
- 錨點對接很重要：每引入新概念時，先連接你已有的 LangGraph/FAISS/FastAPI 經驗
