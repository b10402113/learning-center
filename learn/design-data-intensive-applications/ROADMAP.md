---
subject: design-data-intensive-applications
status: draft
created: 2026-08-21
---

# ROADMAP — design-data-intensive-applications

## Goal
設計資料系統的架構層——從第一性原理選擇資料庫、劃分策略、複製方案、一致性權衡，並能在設計文件或 RFC 中為每個選擇提出有根據的辯護。

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 基礎概念（Fundamentals）

1. **[[learn/design-data-intensive-applications/nodes/data-system-pillars|資料系統的三個支柱]]**
   - Goal: 區分 reliability / scalability / maintainability，能在設計討論中用這三個詞準確描述系統的非功能需求
   - Sources:
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Reliability]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Scalability]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Maintainability]]

2. **[[learn/design-data-intensive-applications/nodes/data-models-and-query-languages|資料模型與查詢語言]]**
   - Goal: 比較 relational / document / graph 三種模型的取捨，為一個具體應用場景選出合適的模型
   - Sources:
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Relational Model Versus Document Model]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Graph-Like Data Models]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Query Languages for Data]]

### Tier 2 — 存儲與編碼（Storage & Encoding）

3. **[[learn/design-data-intensive-applications/nodes/storage-engines-write-path|存儲引擎：寫路徑]]**
   - Goal: 解釋 LSM-tree 的寫入路徑（memtable → WAL → compaction），說明為什麼 log-structured 存儲能實現高寫入吞吐
   - Sources:
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Hash Indexes]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#SSTables and LSM-Trees]]

4. **[[learn/design-data-intensive-applications/nodes/storage-engines-read-path|存儲引擎：讀路徑與比較]]**
   - Goal: 解釋 B-tree 的讀寫機制，比較 LSM-tree vs B-tree 在讀寫性能、壓縮、寫放大上的核心取捨
   - Sources:
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#B-Trees]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Comparing B-Trees and LSM-Trees]]

5. **[[learn/design-data-intensive-applications/nodes/columnar-storage|列式存儲與分析引擎]]**
   - Goal: 說明 row-oriented vs column-oriented 存儲的 I/O 差異，解釋為什麼 OLAP 系統能比 OLTP 快幾個數量級
   - Sources:
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Transaction Processing or Analytics]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Column-Oriented Storage]]

6. **[[learn/design-data-intensive-applications/nodes/encoding-and-evolution|編碼與模式演進]]**
   - Goal: 說明 Thrift / Protobuf / Avro 的兼容性規則，解釋 forward / backward compatibility 在滾動部署中的意義
   - Sources:
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Thrift and Protocol Buffers]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Avro]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Dataflow Through Databases]]

### Tier 3 — 分佈式機制（Distributed Mechanisms）

7. **[[learn/design-data-intensive-applications/nodes/single-leader-replication|單 leader 複製]]**
   - Goal: 解釋 sync / async / semi-sync 複製的取捨，能列舉 replication lag 導致的三種異常
   - Sources:
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Synchronous Versus Asynchronous Replication]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Problems with Replication Lag]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Implementation of Replication Logs]]

8. **[[learn/design-data-intensive-applications/nodes/multi-leader-and-leaderless-replication|多 leader 與無 leader 複製]]**
   - Goal: 比較 multi-leader vs leaderless 的適用場景，解釋 quorum（w + r > n）的數學原理與局限
   - Sources:
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Multi-Leader Replication]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Leaderless Replication]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Quorums for Reading and Writing]]

9. **[[learn/design-data-intensive-applications/nodes/partitioning-strategies|分區策略]]**
   - Goal: 比較 key-range vs hash partitioning 的核心取捨，解釋 secondary index 在分區環境下的兩種策略
   - Sources:
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Partitioning by Key Range]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Partitioning by Hash of Key]]
     - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Partitioning and Secondary Indexes]]

10. **[[learn/design-data-intensive-applications/nodes/transactions-and-isolation|事務與隔離級別]]**
    - Goal: 區分 ACID 中每個字母的真實含義，比較 read committed / snapshot isolation / serializable 各能防止哪些異常
    - Sources:
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Slippery Concept of a Transaction]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Weak Isolation Levels]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Serializability]]

11. **[[learn/design-data-intensive-applications/nodes/distributed-systems-challenges|分佈式系統的困難]]**
    - Goal: 解釋 partial failure 為何是分布式系統的核心難題，說明 unreliable networks、unreliable clocks、process pauses 各自帶來的具體問題
    - Sources:
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Unreliable Networks]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Unreliable Clocks]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Knowledge, Truth, and Lies]]

12. **[[learn/design-data-intensive-applications/nodes/consistency-and-consensus|一致性與共識]]**
    - Goal: 定義 linearizability，比較 linearizability vs serializability 的區別，解釋為什麼 consensus 是分布式系統最重要的抽象
    - Sources:
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Linearizability]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Linearizability Versus Serializability]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Relying on Linearizability]]

### Tier 4 — 派生數據與集成（Derived Data & Integration）

13. **[[learn/design-data-intensive-applications/nodes/batch-and-stream-processing|批處理與流處理]]**
    - Goal: 說明 MapReduce → dataflow engine 的演進邏輯，比較 batch 與 stream 在容錯、窗口、joins 上的根本差異
    - Sources:
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#MapReduce and Distributed Filesystems]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Beyond MapReduce]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Processing Streams]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Stream Joins]]

14. **[[learn/design-data-intensive-applications/nodes/data-integration-and-correctness|資料集成與正確性]]**
    - Goal: 說明 CDC / event sourcing 如何解決 dual-write 問題，解釋 unbundled database 架構，能判斷何時需要 coordination 何時可以避免
    - Sources:
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Change Data Capture]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Event Sourcing]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Unbundling Databases]]
      - [[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The End-to-End Argument for Databases]]

## Status
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
