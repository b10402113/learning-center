---
subject: 小哲讲八股
status: confirmed
path: problem-driven
created: 2026-09-26
---

# ROADMAP — 小哲讲八股

## Goal

把 Java 後端八股（Java 核心 / Spring 全家桶 / MySQL / Redis / MQ / 分散式 / OS / 網路 / AI 加分項）讀成「能講得清楚、扛得住追問」的底層理解——以面試追問當磨刀石，但每個節點都落到「為什麼」的機制，不是死背答案。全部模組都要覆蓋；不熟的部分（JVM/JUC、MySQL 底層、分散式+中間件、OS/網路）展開深教，已熟的實戰面（Java/Spring/Redis/MQ）淺帶。

## Learning path

**problem-driven（問題驅動）**。以「一個後端工程師真的會遇到的問題」為節點單位——「程式怎麼跑起來」「多執行緒為什麼出錯」「查詢為什麼變慢」「讀到舊值怎麼辦」「快取與 DB 為什麼不一致」「訊息為什麼丟/重」「跨服務怎麼協調」「請求到底怎麼走」——每個問題跨模組拉出需要的機制。這條路徑最佳化「場景 → 機制」的連結與動機，先把問題的痛點擺出來再往下挖底層。

分層由近（單機執行與併發）到遠（分散式與系統設計）：

- **Tier 1 — 程式跑起來、多執行緒出錯**：Java 語言/物件、JVM 執行時與類載入、GC 排查、執行緒池、鎖與 JMM、併發工具與手寫題。
- **Tier 2 — 儲存**：MySQL 架構與 SQL 生命週期、索引與慢查詢、事務/MVCC/鎖、日誌與複製、Spring 事務失效、快取一致性。
- **Tier 3 — 中介軟體**：Redis 效能與資料結構、持久化/集群/熱大 Key、分散式鎖；訊息可靠、順序/堆積/延時、Kafka 內核。
- **Tier 4 — 跨服務協調**：分散式理論（CAP/BASE/一致性哈希）、共識與 ZK、分散式 ID、分散式事務、RPC 與註冊中心。
- **Tier 5 — 請求怎麼走**：HTTP/HTTPS 演進、TCP 連線生命週期、TCP 可靠傳輸、進程/記憶體/IO 模型。
- **Tier 6 — 框架與系統設計**：Spring 核心、Spring Boot + Cloud、MyBatis/DDD、Elasticsearch、系統設計實戰、AI 大模型（淺帶）。

## How to use

依序閱讀節點問題，但可依弱項跳讀（Tier 2/4/5 是你的深教區）。每個節點是一個 step-DAG。先執行 `/probe 小哲讲八股/<node-id>` 測量該節點的掌握度（硬性關卡），再執行 `/nodes 小哲讲八股/<node-id>` 確認並拆解步驟，最後 `/teach`。

## Nodes

### Tier 1 — 程式跑起來、多執行緒出錯

1. **[[learn/小哲讲八股/nodes/java-language-objects|Java 語言與物件：一行 Java 到底做了什麼]]**
   - Goal: 講清楚物件如何被建立與比較（值傳遞、==/equals、不可變、字符串池、包裝類、反射/代理/泛型），並俯瞰集合框架的選型
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/Java基础/前言.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Java基础/5.Java是值传递还是引用传递.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Java基础/9.==与equals有什么区别.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Java基础/16.静态代理与动态代理的区别是什么_JDK动态代理与CGLIB动态代理有何不同_.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Java集合/1.介绍一下Java的集合框架是怎样的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Java集合/7.请详细描述HashMap在JDK1.7与JDK1.8中的数据结构差异.md]]

2. **[[learn/小哲讲八股/nodes/jvm-runtime-classloading|JVM 執行時與類載入：類別怎麼被載入、物件存在哪]]**
   - Goal: 講清楚位元組碼如何執行、五個執行時資料區各自裝什麼、物件佈局，以及類載入七階段與雙親委派
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/JVM/4.JVM的运行内存区域是怎样的？.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JVM/6.Java对象的内存布局是怎样的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JVM/8.JVM类加载的过程是怎样的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JVM/9.双亲委派的过程是怎样的？目的是什么？.md]]

3. **[[learn/小哲讲八股/nodes/jvm-gc-tuning|GC、記憶體壓力與線上排查]]**
   - Goal: 面對「記憶體一直漲、GC 頻繁」能講出可達性分析、引用類型、收集演算法與收集器演進，並給出排查路徑
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/JVM/11.JVM是如何判断一个对象是可回收的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JVM/13.常见的垃圾收集算法有哪些.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JVM/15.常见的垃圾收集器有哪些.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JVM/19.如果线上出现了频繁GC的告警应该如何排查.md]]

4. **[[learn/小哲讲八股/nodes/juc-thread-pool|執行緒池打滿、任務堆積]]**
   - Goal: 講清楚執行緒生命週期、執行緒池七參數與四步流程、拒絕策略、Executors 陷阱與虛擬執行緒的改變
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/1.Java线程有哪些状态.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/7.Java中线程池的核心参数有哪些.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/8.线程池的工作流程是怎样的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/10.Java线程池的拒绝策略有哪些.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/6.虚拟线程与传统线程的区别是什么_它如何改变高并发编程模型_.md]]

5. **[[learn/小哲讲八股/nodes/juc-locks-jmm-cas|鎖、JMM 與無鎖原子]]**
   - Goal: 講清楚 synchronized 的 Monitor 與鎖升級、ReentrantLock、AQS、volatile/JMM/happens-before、CAS/ABA 與 LongAdder
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/16.synchronized是怎么实现的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/19.synchronized与ReentrantLock的区别有哪些.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/20.AQS底层原理是怎样的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/26.Java中volatile是什么_如何理解JMM.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/29.什么是CAS_什么是ABA问题_如何解决ABA问题_.md]]

6. **[[learn/小哲讲八股/nodes/juc-tools-coding|併發工具與手寫併發題]]**
   - Goal: 選對並用對 ThreadLocal/CountDownLatch/CyclicBarrier/CompletableFuture/ForkJoin，並能手寫生產者消費者、DCL、交替打印、死鎖
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/15.什么是ThreadLocal？如何实现的？.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/21.CountDownLatch和CyclicBarrier都有等待的功能,它们有什么区别底层实现一样吗.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/22.CompletableFuture的底层是如何实现的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/31.实现一个生产者消费者的代码.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/JUC/35.实现一个死锁产生示例.md]]

### Tier 2 — 儲存：查得慢 / 讀到舊值 / 不一致

7. **[[learn/小哲讲八股/nodes/mysql-architecture-sql|MySQL 架構與一條 SQL 的生命週期]]**
   - Goal: 講清楚 Server 層與引擎層分工、一條 SQL 從客戶端到返回的完整鏈路、InnoDB 與 MyISAM 的本質差別
   - Sources:
     - [[sources/小哲讲八股/20260926/MySQL/MySQL数据库导学.md]]
     - [[sources/小哲讲八股/20260926/MySQL/1.请简述MySQL的逻辑架构。Server层和存储引擎层分别负责什么？.md]]
     - [[sources/小哲讲八股/20260926/MySQL/2.一条SQL语句从客户端发出到最终返回结果,经历了哪些过程.md]]
     - [[sources/小哲讲八股/20260926/MySQL/3.InnoDB和MyISAM的主要区别是什么.md]]

8. **[[learn/小哲讲八股/nodes/mysql-index-slow-query|索引與慢查詢優化]]**
   - Goal: 面對慢查詢能解釋 B+ 樹選型、樹高與 IO、回表/覆蓋索引、最左前綴、索引失效、索引下推，並用 EXPLAIN/深分頁優化
   - Sources:
     - [[sources/小哲讲八股/20260926/MySQL/6.为什么MySQL使用B+树作为索引结构，而不是B树、哈希表红黑树或二叉搜索树？.md]]
     - [[sources/小哲讲八股/20260926/MySQL/9.什么是回表操作？如何通过覆盖索引CoveringIndex来避免回表？.md]]
     - [[sources/小哲讲八股/20260926/MySQL/11.解释最左前缀匹配原则.md]]
     - [[sources/小哲讲八股/20260926/MySQL/13.哪些操作会导致索引失效.md]]
     - [[sources/小哲讲八股/20260926/MySQL/20.MySQL中如何分析SQL语句的执行计划.md]]
     - [[sources/小哲讲八股/20260926/MySQL/19.深分页有什么问题如何优化.md]]

9. **[[learn/小哲讲八股/nodes/mysql-transaction-mvcc-locks|事務、MVCC 與鎖]]**
   - Goal: 講清楚 ACID 各自靠什麼機制、隔離級別與三種異常、MVCC 版本鏈與 ReadView、行/間隙/臨鍵鎖與死鎖
   - Sources:
     - [[sources/小哲讲八股/20260926/MySQL/27.什么是ACID？MySQL是分别通过什么机制来实现这四个特性的？.md]]
     - [[sources/小哲讲八股/20260926/MySQL/29.MySQL的四种隔离级别是什么？默认级别是什么？.md]]
     - [[sources/小哲讲八股/20260926/MySQL/31.什么是脏读、不可重复读和幻读.md]]
     - [[sources/小哲讲八股/20260926/MySQL/32.如何理解MVCC.md]]
     - [[sources/小哲讲八股/20260926/MySQL/34.MySQL有哪些锁.md]]
     - [[sources/小哲讲八股/20260926/MySQL/35.给出一个死锁的实际SQL案例.md]]

10. **[[learn/小哲讲八股/nodes/mysql-logs-replication|日誌、WAL、複製與主從]]**
    - Goal: 講清楚 Redo/Undo/Binlog 分工、WAL 與兩階段提交、Buffer Pool/Change Buffer，以及主從複製三線程與延遲治理
    - Sources:
      - [[sources/小哲讲八股/20260926/MySQL/28.RedoLog（重做日志）和UndoLog（回滚日志）的区别是什么.md]]
      - [[sources/小哲讲八股/20260926/MySQL/38.什么是WAL（Write-AheadLogging）技术.md]]
      - [[sources/小哲讲八股/20260926/MySQL/41.什么是二阶段提交_为什么要这么设计_.md]]
      - [[sources/小哲讲八股/20260926/MySQL/44.MySQL主从复制的原理是什么.md]]
      - [[sources/小哲讲八股/20260926/MySQL/46.什么是主从延迟？如何解决？.md]]

11. **[[learn/小哲讲八股/nodes/spring-transaction|Spring 事務管理與失效場景]]**
    - Goal: 講清楚聲明式事務的 AOP 原理、回滾規則、七種傳播行為，並列出常見的事務失效場景
    - Sources:
      - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/10.Spring的事务管理是怎样的.md]]
      - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/11.声明式事务什么情况会失效.md]]
      - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/12.事务的传播规则是怎样的.md]]

12. **[[learn/小哲讲八股/nodes/cache-consistency|快取模式與資料一致性]]**
    - Goal: 面對穿透/擊穿/雪崩能給出方案，並講清楚本地快取與 Redis、Redis 與 MySQL 之間的一致性策略
    - Sources:
      - [[sources/小哲讲八股/20260926/Redis/20.什么是缓存击穿、缓存雪崩和缓存穿透.md]]
      - [[sources/小哲讲八股/20260926/Redis/21.什么是布隆过滤器原理是怎样的.md]]
      - [[sources/小哲讲八股/20260926/Redis/23.如何保证MySQL和Redis的数据一致性.md]]
      - [[sources/小哲讲八股/20260926/Redis/24.canal的工作原理是怎样的.md]]
      - [[sources/小哲讲八股/20260926/Java面试题/系统设计题/16.如何设计多级缓存架构.md]]

### Tier 3 — 中介軟體：Redis 與訊息

13. **[[learn/小哲讲八股/nodes/redis-perf-datastructures|Redis 為何快、資料怎麼存]]**
    - Goal: 講清楚 Redis 的單執行緒模型與多執行緒演進，以及 SDS/QuickList/Listpack/跳表等底層結構與過期淘汰
    - Sources:
      - [[sources/小哲讲八股/20260926/Redis/1.什么是Redis.md]]
      - [[sources/小哲讲八股/20260926/Redis/5.为什么Redis的性能这么好.md]]
      - [[sources/小哲讲八股/20260926/Redis/7.Redis常见的数据结构有哪些？有什么应用场景.md]]
      - [[sources/小哲讲八股/20260926/Redis/11.ZSet的底层实现原理是怎样的.md]]
      - [[sources/小哲讲八股/20260926/Redis/12.既然多线程执行这么麻烦，那Redis是怎么解决Key过期和淘汰的？这会不会阻塞主线程.md]]

14. **[[learn/小哲讲八股/nodes/redis-persistence-cluster|Redis 持久化、集群與熱/大 Key]]**
    - Goal: 講清楚 RDB/AOF/混合持久化與重寫、Sentinel/Cluster/哈希槽，以及熱 Key 與大 Key 的成因與治理
    - Sources:
      - [[sources/小哲讲八股/20260926/Redis/14.Redis的持久化机制有哪些.md]]
      - [[sources/小哲讲八股/20260926/Redis/15.对比RDB和AOF.md]]
      - [[sources/小哲讲八股/20260926/Redis/28.Redis的集群方案有哪些.md]]
      - [[sources/小哲讲八股/20260926/Redis/31.Redis的热Key问题如何理解_如何解决.md]]
      - [[sources/小哲讲八股/20260926/Redis/32.Redis的大Key问题如何理解_如何解决_.md]]

15. **[[learn/小哲讲八股/nodes/redis-distributed-lock|Redis 分散式鎖怎麼做才對]]**
    - Goal: 講清楚 SET NX PX、Lua 解鎖、看門狗續期、Redisson 可重入與 RedLock 的爭議與適用邊界
    - Sources:
      - [[sources/小哲讲八股/20260926/Redis/25.Redis如何实现分布式锁.md]]
      - [[sources/小哲讲八股/20260926/Redis/26.Redission的分布式锁是可重入的吗？具体是如何实现的可重入？.md]]
      - [[sources/小哲讲八股/20260926/Redis/27.什么是RedLock.md]]
      - [[sources/小哲讲八股/20260926/Redis/18.为什么说Lua脚本是原子性的？如果Lua脚本执行了一半断电了怎么办？.md]]

16. **[[learn/小哲讲八股/nodes/mq-reliability|訊息可靠性：不丟與不重]]**
    - Goal: 講清楚生產者/儲存/消費者三端不丟的機制，以及冪等去重與事務消息（並在三款 MQ 上做對比）
    - Sources:
      - [[sources/小哲讲八股/20260926/Kafka/4.如何保证消息不丢失.md]]
      - [[sources/小哲讲八股/20260926/Kafka/5.如何避免消息的重复消费.md]]
      - [[sources/小哲讲八股/20260926/RabbitMQ/3.如何保证消息不丢失.md]]
      - [[sources/小哲讲八股/20260926/RocketMQ/7.如何理解RocketMQ的事务消息.md]]

17. **[[learn/小哲讲八股/nodes/mq-order-backlog-delay|訊息順序、堆積與延時]]**
    - Goal: 講清楚順序保證的範圍與做法、堆積的成因與治理、延時隊列的多種實現與推拉模式差異
    - Sources:
      - [[sources/小哲讲八股/20260926/Kafka/6.如何保证消息的顺序.md]]
      - [[sources/小哲讲八股/20260926/Kafka/7.消息堆积问题有什么危害如何解决.md]]
      - [[sources/小哲讲八股/20260926/Kafka/14.如何基于Kafka实现延时队列.md]]
      - [[sources/小哲讲八股/20260926/RocketMQ/5.如何保证消息顺序.md]]
      - [[sources/小哲讲八股/20260926/RabbitMQ/7.死信队列怎么理解.md]]

18. **[[learn/小哲讲八股/nodes/kafka-internals|Kafka 儲存內核與三款 MQ 選型]]**
    - Goal: 講清楚 Kafka 的高吞吐內核、ISR/Rebalance、ZK 的角色與 KRaft 演進，並能做 MQ 選型
    - Sources:
      - [[sources/小哲讲八股/20260926/Kafka/3.Kafka的架构是怎样的.md]]
      - [[sources/小哲讲八股/20260926/Kafka/8.Kafka为什么那么快.md]]
      - [[sources/小哲讲八股/20260926/Kafka/9.消费者组概念如何理解.md]]
      - [[sources/小哲讲八股/20260926/Kafka/12.Kafka的ISR如何理解.md]]
      - [[sources/小哲讲八股/20260926/Kafka/2.Kafka、RocketMQ和RabbitMQ到底该怎么选.md]]

### Tier 4 — 跨服務協調

19. **[[learn/小哲讲八股/nodes/distributed-foundations|分散式理論基座：CAP/BASE 與一致性哈希]]**
   - Goal: 講清楚 CAP 的取捨、BASE 與最終一致性的定位，以及一致性哈希為何能減少擴容搬遷
   - Sources:
     - [[sources/小哲讲八股/20260926/分布式场景题/1.如何理解CAP理论.md]]
     - [[sources/小哲讲八股/20260926/分布式场景题/2.如何理解BASE理论.md]]
     - [[sources/小哲讲八股/20260926/分布式场景题/6.什么是一致性哈希.md]]
     - [[sources/小哲讲八股/20260926/分布式场景题/10.如何理解最终一致性.md]]

20. **[[learn/小哲讲八股/nodes/consensus-zookeeper|共識與協調：RAFT/ZAB 與 Zookeeper]]**
   - Goal: 講清楚 RAFT 選主/日誌複製/安全性、ZAB 與 ZK 架構，以及 ZK 如何實現分散式鎖與節點唯一
   - Sources:
     - [[sources/小哲讲八股/20260926/分布式场景题/3.如何理解RAFT协议.md]]
     - [[sources/小哲讲八股/20260926/zookeeper/1.什么是zookeeper？有什么应用场景.md]]
     - [[sources/小哲讲八股/20260926/zookeeper/2.ZK的架构是怎样的.md]]
     - [[sources/小哲讲八股/20260926/zookeeper/3.ZK如何实现分布式锁.md]]
     - [[sources/小哲讲八股/20260926/zookeeper/5.Zookeeper是如何保证创建的节点是唯一的.md]]

21. **[[learn/小哲讲八股/nodes/distributed-id|分散式 ID 與時鐘回撥]]**
   - Goal: 講清楚 UUID/號段/Redis INCR/雪花等方案的取捨，以及時鐘回撥的成因與解法
   - Sources:
     - [[sources/小哲讲八股/20260926/分布式场景题/5.什么是分布式ID？有哪些生成方案.md]]
     - [[sources/小哲讲八股/20260926/分布式场景题/7.什么是时钟回播问题？如何解决？.md]]

22. **[[learn/小哲讲八股/nodes/distributed-transaction|分散式事務：2PC/TCC 與 Seata]]**
   - Goal: 講清楚剛性與柔性事務的分野、2PC 的兩階段與缺點、TCC 的補償，以及 Seata 四模式的取捨
   - Sources:
     - [[sources/小哲讲八股/20260926/分布式场景题/8.什么是分布式事务有哪些解决方案.md]]
     - [[sources/小哲讲八股/20260926/分布式场景题/11.什么是分布式事务的两阶段提交.md]]
     - [[sources/小哲讲八股/20260926/分布式场景题/12.如何理解TCC.md]]
     - [[sources/小哲讲八股/20260926/分布式场景题/13.Seata的各种模式对比.md]]

23. **[[learn/小哲讲八股/nodes/rpc-registry|RPC、序列化與註冊中心]]**
   - Goal: 講清楚 RPC 與 HTTP 的維度差異、私有 TCP 協議 vs 標準 HTTP 的取捨、序列化協議對比與註冊中心選型
   - Sources:
     - [[sources/小哲讲八股/20260926/RPC/1.什么是RPC和HTTP有什么区别.md]]
     - [[sources/小哲讲八股/20260926/RPC/2.RPC的网络协议使用TCP和HTTP有什么区别.md]]
     - [[sources/小哲讲八股/20260926/RPC/3.序列化协议有哪些对比一下优劣势.md]]
     - [[sources/小哲讲八股/20260926/RPC/4.注册中心怎么理解.md]]

### Tier 5 — 請求怎麼走（網路與 OS）

24. **[[learn/小哲讲八股/nodes/http-https|HTTP 演進與 HTTPS]]**
   - Goal: 講清楚 HTTP 1.0→1.1→2→3 的改進鏈、HTTPS 混合加密與 CA 憑證，以及狀態碼/快取/方法語義
   - Sources:
     - [[sources/小哲讲八股/20260926/计算机网络/3.什么是HTTP协议.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/11.HTTP2.0相对HTTP1.1的改进是怎样的.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/12.HTTP3.0的改进是怎样的？.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/13.HTTPS的加密算法的原理是怎样的.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/15.什么是CA证书？是如何生成的？.md]]

25. **[[learn/小哲讲八股/nodes/tcp-connection-lifecycle|TCP 連線生命週期與異常狀態]]**
   - Goal: 講清楚三次握手/四次揮手/狀態機/2MSL，並能診斷大量 TIME_WAIT/CLOSE_WAIT 的成因與治理
   - Sources:
     - [[sources/小哲讲八股/20260926/计算机网络/18.TCP三次握手的过程是怎样的.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/19.TCP为什么要三次握手而不是两次.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/20.TCP四次挥手的过程是怎样的.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/26.什么情况下会出现大量的time_wait？有什么危害？如何应对？.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/27.出现大量的close_wait的原因可能是什么？如何解决？.md]]

26. **[[learn/小哲讲八股/nodes/tcp-reliability|TCP 可靠傳輸、流控擁塞與周邊協議]]**
   - Goal: 講清楚序號/ACK/超時重傳/快速重傳、滑動窗口流控與擁塞控制，並帶過 UDP/ARP/DNS
   - Sources:
     - [[sources/小哲讲八股/20260926/计算机网络/28.TCP是如何保证数据不丢失的.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/29.为什么有了超时重传以后还需要快速重传.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/30.流量控制的目的是什么？工作流程是怎样的？.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/31.拥塞控制的目的是什么，以及工作流程是怎样的。.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/16.对比TCP和UDP协议的区别.md]]
     - [[sources/小哲讲八股/20260926/计算机网络/37.DNS的查询过程是怎样的.md]]

27. **[[learn/小哲讲八股/nodes/os-process-io|進程、記憶體與 IO 模型]]**
   - Goal: 講清楚進程/線程/協程與 IPC/死鎖、虛擬記憶體與分頁/TLB，以及 BIO/NIO/AIO、epoll/Reactor/零拷貝
   - Sources:
     - [[sources/小哲讲八股/20260926/操作系统/6.对比进程线程和协程.md]]
     - [[sources/小哲讲八股/20260926/操作系统/11.进程间的通信方式都有哪些？.md]]
     - [[sources/小哲讲八股/20260926/操作系统/16.什么是虚拟内存_为什么需要虚拟内存.md]]
     - [[sources/小哲讲八股/20260926/操作系统/21.如何理解同步_异步、阻塞_非阻塞、BIO_NIO_AIO.md]]
     - [[sources/小哲讲八股/20260926/操作系统/22.操作系统中如何理解IO多路复用.md]]
     - [[sources/小哲讲八股/20260926/操作系统/32.什么是零拷贝（ZeroCopy）？Sendfile和mmap是如何减少上下文切换和数据拷贝的？.md]]

### Tier 6 — 框架替你做了什麼、設計一個系統

28. **[[learn/小哲讲八股/nodes/spring-core-ioc-aop|Spring 核心：IoC、Bean 與 AOP]]**
   - Goal: 講清楚 IoC/DI、Bean 生命週期與三級快取解循環依賴、AOP 代理、Spring MVC 流程與框架中的設計模式
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/2.如何理解IOC.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/4.Bean的生命周期是怎样的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/6.单例Bean的循环依赖问题是如何解决的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/8.AOP的实现原理是怎样的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/13.SpringMVC怎么理解.md]]

29. **[[learn/小哲讲八股/nodes/springboot-cloud|Spring Boot 自動配置與 Spring Cloud 微服務]]**
   - Goal: 講清楚自動配置/Starter/Spring Task 的原理，以及微服務組件、限流熔斷降級與負載均衡策略
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/17.Springboot是如何实现自动配置的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/18.Springboot的starter是什么_有什么应用场景.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/SpringCloud/2.什么是SpringCloud_有哪些组件_.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/SpringCloud/6.如何理解限流熔断和降级.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/SpringCloud/8.常见的限流算法有哪些.md]]

30. **[[learn/小哲讲八股/nodes/mybatis-ddd|MyBatis 持久層與 DDD 領域建模]]**
   - Goal: 講清楚 ORM/#{} vs ${}/插件/緩存/動態 SQL/分頁，以及 DDD 的限界上下文、聚合與充血模型
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/Mybatis/1.什么是Mybatis_什么是ORM框架_.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Mybatis/3.Mybatis插件是什么？运行原理是怎样的？.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/Mybatis/4.Mybatis的缓存机制是怎样的.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/DDD/2.一个例子理解DDD.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/DDD/4.什么是聚合？什么是聚合根？.md]]

31. **[[learn/小哲讲八股/nodes/elasticsearch|Elasticsearch 全文檢索]]**
   - Goal: 講清楚倒排索引與 FST/FileSystem Cache 為何快、分詞器選擇、與 DB 一致性、深分頁與模糊搜索
   - Sources:
     - [[sources/小哲讲八股/20260926/ElasticSearch/1.什么是Lucene.md]]
     - [[sources/小哲讲八股/20260926/ElasticSearch/3.ES的性能高的底层原理是什么？.md]]
     - [[sources/小哲讲八股/20260926/ElasticSearch/4.什么是倒排索引.md]]
     - [[sources/小哲讲八股/20260926/ElasticSearch/6.如何保证ES和数据库的数据一致性.md]]
     - [[sources/小哲讲八股/20260926/ElasticSearch/7.如何解决ES的深分页问题.md]]

32. **[[learn/小哲讲八股/nodes/system-design|系統設計實戰]]**
   - Goal: 用「Redis 原子預減 + MQ 削峰 + DB 兜底」套路設計秒殺/短鏈/Feed/爬蟲/排行榜，並講清楚每個決策的取捨
   - Sources:
     - [[sources/小哲讲八股/20260926/Java面试题/系统设计题/1.设计一个URL短链接系统.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/系统设计题/7.设计一个双十一秒杀系统.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/系统设计题/5.设计一个类似微博或朋友圈的Feed流系统.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/系统设计题/16.如何设计多级缓存架构.md]]
     - [[sources/小哲讲八股/20260926/Java面试题/系统设计题/13.设计一个高性能的分布式日志系统.md]]

33. **[[learn/小哲讲八股/nodes/ai-llm-agent|AI 大模型與 Agent 應用（加分項，淺帶）]]**
   - Goal: 帶過 LLM/Transformer 基礎、預訓練→SFT→RLHF/PEFT、提示詞工程、RAG、LLM 系統架構與 Spring AI（你已熟，快速複習）
   - Sources:
     - [[sources/小哲讲八股/20260926/Agent开发/大模型基础/什么是大语言模型（LLM）？和传统NLP模型有什么区别？.md]]
     - [[sources/小哲讲八股/20260926/Agent开发/大模型基础/Transformer架构是怎样的？为什么能成为主流架构？.md]]
     - [[sources/小哲讲八股/20260926/Agent开发/RAG/RAG的整体架构？.md]]
     - [[sources/小哲讲八股/20260926/Agent开发/LLM架构/一个类似ChatGPT系统如何设计？.md]]
     - [[sources/小哲讲八股/20260926/Agent开发/SpringAI/01-spring-ai-architecture.md]]

## Status

- [x] Roadmap partitioned (33 nodes, problem-driven)
- [ ] Step articles written
- [ ] Edges written
