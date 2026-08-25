# 0005 — 單一領導者複製：Leader-Follower 的角色分工

- **日期**: 2026-08-23
- **Node**: single-leader-replication（step 1 / 4）
- **來源**:
  - `sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf`（第五章 5.1）
  - PostgreSQL 官方文件 — Different Solutions

## 非顯而易見的領悟

1. **複製的三個理由全部跟讀取有關，跟寫入無關。** 提高可用性、降低延遲、擴大吞吐量——都是讓更多人更快地「看到」資料。寫入在單一領導者模型中始終被限制在一個 node 上，目的是確保一致性。這和 design-system node 的「你不設計 UI」是同一種防護模式：限制自由度來保障正確性。

2. **Follower 不是備份。** 備份是離線的、低頻的、用來災難恢復的。Follower 是即時的、持續複製的、可以立即接管服務的。混淆兩者會導致錯誤的容錯決策——例如「我有備份所以不需要 failover」。

3. **從 follower 讀取是大多數系統的預設，但 replication lag 是不可避免的。** 這不是 bug，而是設計取捨：你想要低延遲就要接受可能讀到舊資料。理解這個取捨是後續理解 synchronous vs asynchronous 複製的基礎。

## 對後續的影響

- 本 node 後三步（複製機制 → 同步 vs 非同步 → Failover）都是這份「角色分工」的延伸。
- 在自己的專案上可直接判斷：什麼時候需要 multi-leader（多個寫入入口），什麼時候 leaderless 足夠。
- 與 Clerk auth node 的「middleware 是 resolver 不是 gate」互相印證：複製架構中 leader 也是「resolver」（處理寫入），不是「gate」（阻擋所有操作）。

## 待覆核／開放問題

- PostgreSQL 的 synchronous replication 在 follower 故障時會阻塞 leader 寫入——這在生產環境中是否真的是合理的預設行為？
- MySQL 的 semi-synchronous replication 跟 PostgreSQL 的 synchronous replication 有什麼實質差異？
- Multi-leader replication 的衝突解決策略中，哪一種在實務上最常用？
