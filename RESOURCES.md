# Resources — 資料複製：單一領導者複製

## 主要來源

### Designing Data-Intensive Applications（DDIA）
- **第五章：複製（Replication）** — 單一領導者複製的核心來源
  - 5.1 單一領導者複製（Single-Leader Replication）
    - 5.1.1 複製的用途（Leaders and Followers）
    - 5.1.2 設定新 follower（Setting Up New Followers）
    - 5.1.3 處理 node 中斷（Handling Node Outages）
    - 5.1.4 複製日誌的實作（Implementation of Replication Logs）
    - 5.1.5 複製延遲的問題（Problems with Replication Lag）
  - 5.2 多領導者複製（Multi-Leader Replication）
  - 5.3 無領導者複製（Leaderless Replication）
- 本地 PDF 路徑：`sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf`

### PostgreSQL 文件
- [Chapter 26. Replication](https://www.postgresql.org/docs/current/different-rep-solutions.html) — PostgreSQL 官方對不同複製方案的分類
- [Streaming Replication](https://www.postgresql.org/current/runtime-streaming-replication.html) — PostgreSQL streaming replication 的實作細節

### MySQL 文件
- [Replication Format](https://dev.mysql.com/doc/refman/8.0/en/replication-formats.html) — MySQL binlog 的 Statement / Row / Mixed 格式

## 補充來源

### 觀念性
- [Martin Kleppmann — Replication and Consistency (YouTube)](https://www.youtube.com/watch?v=9sMTOo_VNw) — Kleppmann 本人講解複製的一致性問題
- [Jepsen — Consistency Models](https://jepsen.io/consistency) — 各種一致性模型的實證測試

### 實作案例
- [Amazon DynamoDB — Leader Replication](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TransactionalReplications.html) — 雲端資料庫的複製策略
- [CockroachDB — Raft Consensus](https://www.cockroachlabs.com/docs/stable/architecture/replication-layer.html) — 從單一領導者到共識協議的演進

## 建議學習順序

1. **DDIA 5.1** — 先讀完 single-leader replication 的完整小節
2. **PostgreSQL / MySQL 文件** — 對照實際資料庫的實作
3. **Jepsen** — 理解一致性模型的真實行為
4. **DDIA 5.2–5.3** — 擴展到 multi-leader 和 leaderless 的比較
