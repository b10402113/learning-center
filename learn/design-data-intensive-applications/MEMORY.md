---
subject: design-data-intensive-applications
language: zh-Hant
created: 2026-08-21
updated: 2026-08-21
---

# MEMORY — design-data-intensive-applications

## Goal
設計資料系統的架構層——從第一性原理選擇資料庫、劃分策略、複製方案、一致性權衡，並能在設計文件或 RFC 中為每個選擇提出有根據的辯護。

## Why
職涯成長：從功能開發者轉向架構負責人，能獨立主導系統的資料層設計，而不只是寫功能程式碼。

## Prior experience
- 後端開發者，有 PostgreSQL、Redis、MySQL 實務使用經驗
- 理解 SQL、用過 ORM，但未曾從第一性原理為專案選擇資料庫
- 尚無大型生產系統或真實故障排除經驗

## Anchors
- PostgreSQL：關聯式模型、JOIN、ACID、預設隔離級別、schema-on-write
- Redis：快取層、key-value、TTL、單執行緒模型、replication
- MySQL：關聯式模型、InnoDB 存儲引擎、binlog 複製

## Habits & constraints
- 每週 5–7 小時，平日晚間或週末
- 在家用桌機學習
- 無外部截止日期壓力

## Knowledge type
以陳述性為主——需要理解概念與權衡（什麼是 linearizability、為什麼 LSM-tree 寫入更快、共識如何運作），輸出是判斷力而非程式碼。

## How to teach me
以因果鏈和「為什麼 X 存在」為主軸建立心智模型，用類比和你已知的 PostgreSQL/Redis/MySQL 經驗做錨點。每個元素問「這解決了什麼問題」，然後問「不這樣做會怎樣」。用 /tackle 測驗鎖定記憶。
