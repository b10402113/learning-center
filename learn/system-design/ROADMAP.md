---
subject: system-design
status: draft
created: 2025-08-25
---

# ROADMAP — system-design

## Goal
通過系統設計面試，並能將所學應用於生產環境的系統設計。具體目標：能在白板上從零開始設計一個可擴展的系統，清楚解釋每個決策的取捨。

## How to use
依序閱讀各節點。每個節點是一個 step-DAG。先執行 `/probe system-design/<node-id>` 測量該節點的掌握度，再執行 `/nodes system-design/<node-id>` 確認並開始學習。

## Nodes

### Tier 1 — 心智模型

1. **[[learn/system-design/nodes/intro-sdi|系統設計面試入門]]**
   - Goal: 理解系統設計面試在考什麼、回答步驟框架、避開常見陷阱
   - Sources:
     - [[sources/system-design/completed/20260825_001 What is a System Design Interview.html]]
     - [[sources/system-design/completed/20260825_004 Things to Avoid During System Design Interview.html]]
     - [[sources/system-design/completed/20260825_046 System Design Interviews  A step by step guide.html]]
     - [[sources/system-design/completed/20260825_047 System Design Master Template.html]]

2. **[[learn/system-design/nodes/estimation|估算技巧]]**
   - Goal: 掌握 Back-of-the-envelope 估算方法，能在面試中快速估算系統容量
   - Sources:
     - [[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html]]

3. **[[learn/system-design/nodes/distributed-basics|分散式系統基礎]]**
   - Goal: 掌握可擴展性、可靠性、可用性、效率、可管理性等核心特徵
   - Sources:
     - [[sources/system-design/completed/20260825_005 System Design Basics.html]]
     - [[sources/system-design/completed/20260825_006 Key Characteristics of Distributed Systems.html]]

### Tier 2 — 核心元件

4. **[[learn/system-design/nodes/load-balancing|負載均衡]]**
   - Goal: 理解負載均衡器的作用、部署位置、冗餘設計
   - Sources:
     - [[sources/system-design/completed/20260825_007 Load Balancing.html]]

5. **[[learn/system-design/nodes/lb-algorithms|負載均衡演算法]]**
   - Goal: 掌握各負載均衡演算法的原理與適用場景
   - Sources:
     - [[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html]]

6. **[[learn/system-design/nodes/caching|快取]]**
   - Goal: 理解快取層的作用、策略、失效模式
   - Sources:
     - [[sources/system-design/completed/20260825_009 Caching.html]]

7. **[[learn/system-design/nodes/data-partitioning|資料分片]]**
   - Goal: 理解 Partitioning 的分片策略與挑戰
   - Sources:
     - [[sources/system-design/completed/20260825_010 Data Partitioning.html]]

8. **[[learn/system-design/nodes/indexes|索引]]**
   - Goal: 理解資料庫索引原理與查詢優化
   - Sources:
     - [[sources/system-design/completed/20260825_011 Indexes.html]]

9. **[[learn/system-design/nodes/proxy-redundancy|代理與冗餘]]**
   - Goal: 理解 Proxy/Reverse Proxy 角色、冗餘與複製模式
   - Sources:
     - [[sources/system-design/completed/20260825_012 Proxies.html]]
     - [[sources/system-design/completed/20260825_013 Redundancy and Replication.html]]

10. **[[learn/system-design/nodes/consensus|共識與容錯]]**
    - Goal: 掌握 CAP/PACELC 定理、Quorum、一致性雜湊、Leader-Follower
    - Sources:
      - [[sources/system-design/completed/20260825_015 CAP Theorem.html]]
      - [[sources/system-design/completed/20260825_016 PACELC Theorem.html]]
      - [[sources/system-design/completed/20260825_017 Consistent Hashing.html]]
      - [[sources/system-design/completed/20260825_020 Quorum.html]]
      - [[sources/system-design/completed/20260825_021 Leader and Follower.html]]

11. **[[learn/system-design/nodes/communication|通訊與可靠度]]**
    - Goal: 理解 Polling/WebSocket/SSE 通訊模式、Heartbeat、Checksum 機制
    - Sources:
      - [[sources/system-design/completed/20260825_018 LongPolling vs WebSockets vs ServerSent Events.html]]
      - [[sources/system-design/completed/20260825_022 Heartbeat.html]]
      - [[sources/system-design/completed/20260825_023 Checksum.html]]

### Tier 3 — 設計取捨

12. **[[learn/system-design/nodes/consistency-perf|一致性與效能]]**
    - Goal: 理解強/最終一致性、延遲vs吞吐量、ACID vs BASE 的取捨
    - Sources:
      - [[sources/system-design/completed/20260825_024 Importance of Discussing Tradeoffs.html]]
      - [[sources/system-design/completed/20260825_025 Strong vs Eventual Consistency.html]]
      - [[sources/system-design/completed/20260825_026 Latency vs Throughput.html]]
      - [[sources/system-design/completed/20260825_027 ACID vs BASE Properties in Databases.html]]

13. **[[learn/system-design/nodes/data-strategies|資料策略]]**
    - Goal: 理解壓縮vs去重、讀寫快取、批量vs串流、SQL vs NoSQL
    - Sources:
      - [[sources/system-design/completed/20260825_028 ReadThrough vs WriteThrough Cache.html]]
      - [[sources/system-design/completed/20260825_029 Batch Processing vs Stream Processing.html]]
      - [[sources/system-design/completed/20260825_034 SQL vs NoSQL (2).html]]
      - [[sources/system-design/completed/20260825_035 PrimaryReplica vs PeertoPeer Replication.html]]
      - [[sources/system-design/completed/20260825_036 Data Compression vs Data Deduplication.html]]
      - [[sources/system-design/completed/20260825_037 ServerSide Caching vs ClientSide Caching.html]]

14. **[[learn/system-design/nodes/arch-patterns|架構模式]]**
    - Goal: 理解 LB vs API Gateway、Proxy vs Reverse Proxy、REST vs RPC
    - Sources:
      - [[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html]]
      - [[sources/system-design/completed/20260825_031 API Gateway vs Direct Service Exposure.html]]
      - [[sources/system-design/completed/20260825_032 Proxy vs Reverse Proxy.html]]
      - [[sources/system-design/completed/20260825_033 API Gateway vs Reverse Proxy.html]]
      - [[sources/system-design/completed/20260825_038 REST vs RPC.html]]
      - [[sources/system-design/completed/20260825_039 Polling vs LongPolling vs WebSockets vs Webhooks.html]]

15. **[[learn/system-design/nodes/deployment|部署與儲存]]**
    - Goal: 理解 Serverless vs 傳統、有狀態vs無狀態、雲端儲存、CDN
    - Sources:
      - [[sources/system-design/completed/20260825_040 CDN Usage vs Direct Server Serving.html]]
      - [[sources/system-design/completed/20260825_041 Serverless Architecture vs Traditional Serverbased.html]]
      - [[sources/system-design/completed/20260825_042 Stateful vs Stateless Architecture.html]]
      - [[sources/system-design/completed/20260825_043 Hybrid Cloud Storage vs AllCloud Storage.html]]

16. **[[learn/system-design/nodes/rate-readwrite|限流與讀寫模式]]**
    - Goal: 理解 Token Bucket/Leaky Bucket 限流演算法、讀寫密集系統的設計差異
    - Sources:
      - [[sources/system-design/completed/20260825_044 Token Bucket vs Leaky Bucket.html]]
      - [[sources/system-design/completed/20260825_045 Read Heavy vs Write Heavy System.html]]

### Tier 4 — 實戰設計

17. **[[learn/system-design/nodes/url-pastebin|URL Shortener & Pastebin]]**
    - Goal: 設計短網址服務與文字分享平台
    - Sources:
      - [[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html]]
      - [[sources/system-design/completed/20260825_049 Designing Pastebin.html]]

18. **[[learn/system-design/nodes/instagram|Instagram]]**
    - Goal: 設計圖片分享平台（上傳、Feed、CDN）
    - Sources:
      - [[sources/system-design/completed/20260825_050 Designing Instagram.html]]

19. **[[learn/system-design/nodes/dropbox|Dropbox]]**
    - Goal: 設計檔案同步與雲端儲存系統
    - Sources:
      - [[sources/system-design/completed/20260825_051 Designing Dropbox.html]]

20. **[[learn/system-design/nodes/messenger|Facebook Messenger]]**
    - Goal: 設計即時通訊系統（訊息儲存、推送、在線狀態）
    - Sources:
      - [[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html]]

21. **[[learn/system-design/nodes/twitter|Twitter]]**
    - Goal: 設計短影音社群平台（推文、Feed、趨勢）
    - Sources:
      - [[sources/system-design/completed/20260825_053 Designing Twitter.html]]

22. **[[learn/system-design/nodes/youtube|YouTube/Netflix]]**
    - Goal: 設計影片串流平台（上傳、轉碼、CDN、推薦）
    - Sources:
      - [[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html]]

23. **[[learn/system-design/nodes/typeahead-ratelimit|Typeahead & Rate Limiter]]**
    - Goal: 設計搜尋建議系統與 API 限流器
    - Sources:
      - [[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html]]
      - [[sources/system-design/completed/20260825_056 Designing an API Rate Limiter.html]]

24. **[[learn/system-design/nodes/search-crawler|Twitter Search & Web Crawler]]**
    - Goal: 設計搜尋引擎與大規模網路爬蟲
    - Sources:
      - [[sources/system-design/completed/20260825_057 Designing Twitter Search.html]]
      - [[sources/system-design/completed/20260825_058 Designing a Web Crawler.html]]

25. **[[learn/system-design/nodes/newsfeed-yelp|Newsfeed & Yelp/Uber]]**
    - Goal: 設計動態消息推送與地理位置服務
    - Sources:
      - [[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html]]
      - [[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html]]
      - [[sources/system-design/completed/20260825_061 Designing Uber backend.html]]

26. **[[learn/system-design/nodes/ticketmaster|Ticketmaster]]**
    - Goal: 設計高併發訂票系統（座位鎖定、公平性）
    - Sources:
      - [[sources/system-design/completed/20260825_062 Designing Ticketmaster.html]]

## Status
- [x] Roadmap partitioned (26 nodes)
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
