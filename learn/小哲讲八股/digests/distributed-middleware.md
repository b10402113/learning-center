---
source: 小哲八股-分布式与中间件
source_type: codebase
source_lines: 1528
language: markdown
file_count: 30
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — 分布式与中间件（Zookeeper / RPC / 分布式场景 / ElasticSearch）

## Overview (L1)

- **分布式理论基座（CAP / BASE / 最终一致性）** — P（分区容错）是必选前提，实际只在 C 与 A 间权衡；BASE 用基本可用、软状态换最终一致性，是互联网 AP 业务的默认取向。
- **共识与一致性协议（RAFT / ZAB）** — 强领导者 + 过半确认保证已提交不丢；RAFT 拆成选主/日志复制/安全性，ZAB 是 ZK 的对应实现，仅含最新事务 ID 的节点可当选。
- **分布式锁与分布式 ID** — 锁的争抢位置决定作用域（本地锁进程级、分布式锁全局第三方组件）；ID 四方案 UUID / DB 号段 / Redis INCR / 雪花，并处理时钟回拨。
- **分布式事务** — 刚性（2PC/XA，强一致、长锁、单点）与柔性（TCC、MQ 最终一致、Seata AT）之分；Seata 四模式 AT/TCC/XA/Saga 按一致性、侵入性、性能取舍。
- **Zookeeper** — 基于 ZAB 的分布式协调服务，核心是 ZNode 树 + Watcher；临时顺序节点支撑分布式锁，Leader 串行写 + DataTree 保证节点唯一，定位 CP。
- **RPC** — RPC 与 HTTP 是两个维度，重点是私有 TCP 协议 vs 标准 HTTP 的效率/通用性权衡；序列化协议对比与注册中心的注册/订阅、CP vs AP 选型。
- **Elasticsearch** — 基于 Lucene 的分布式搜索分析引擎；倒排索引 + FST + Filesystem Cache 是快的根基，另含分片副本、分词器、与 DB 的一致性、深分页与模糊搜索。

## Sections (L2)

### zookeeper

#### 1.什么是zookeeper？有什么应用场景

- Locator: `[[sources/小哲讲八股/20260926/zookeeper/1.什么是zookeeper？有什么应用场景.md#应用场景]]`
- Summary: ZK 是提供协调服务的高可用分布式文件系统 + 事件监听机制，核心是 ZNode 树、Watcher、ZAB。
- Key claims: ZNode 分持久/临时/顺序节点，是分布式锁基础；保证 CP，写走 Leader、读走任意节点。
- Learner-relevant: 四大场景——统一配置、命名/服务发现、分布式锁、集群管理与 Master 选举。

#### 2.ZK的架构是怎样的

- Locator: `[[sources/小哲讲八股/20260926/zookeeper/2.ZK的架构是怎样的.md#知识点讲解]]`
- Summary: Leader-Follower 主从架构，全量数据在内存；Leader 唯一写入口，Follower 读+投票，Observer 只读不投票。
- Key claims: 写操作转成 Proposal 广播，过半确认即提交，兼顾强一致与高可用；磁盘事务日志+快照做持久化。
- Learner-relevant: 集群角色分工、过半机制、读写分离与 Observer 横向扩展读能力。

#### 3.ZK如何实现分布式锁

- Locator: `[[sources/小哲讲八股/20260926/zookeeper/3.ZK如何实现分布式锁.md#一、 知识点讲解]]`
- Summary: 在 `/locks` 下创建临时顺序节点，序号最小者持锁，未获锁者只监听前一个节点。
- Key claims: 临时节点防宕机死锁，顺序节点形成公平排队；链式唤醒避免“羊群效应”，只在释放时唤醒后一个。
- Learner-relevant: 临时顺序节点、Watcher 链式监听、死锁与惊群防范。

#### 4.ZK的一致性为什么比Redis强

- Locator: `[[sources/小哲讲八股/20260926/zookeeper/4.ZK的一致性为什么比Redis强.md#知识点讲解]]`
- Summary: 从设计理念/同步机制/故障恢复三维对比 ZK 与 Redis 的一致性。
- Key claims: ZK 走 ZAB 过半落盘才返回，写入成功即不丢；Redis 默认异步复制，Master 挂了有时间窗丢数据；ZK 选举只允许最新事务 ID 节点当选，天然防脑裂。
- Learner-relevant: CP vs AP 权衡、异步复制风险、选举安全性与脑裂。

#### 5.Zookeeper是如何保证创建的节点是唯一的

- Locator: `[[sources/小哲讲八股/20260926/zookeeper/5.Zookeeper是如何保证创建的节点是唯一的.md#一、 知识点讲解]]`
- Summary: 靠内存 DataTree 的路径唯一性 + Leader 串行处理写请求共同保障。
- Key claims: 全路径是唯一 Key，同名直接 `NodeExistsException`；“先检查后执行”在 Leader 串行队列中无并发竞争；再经 ZAB 过半广播原子生效。
- Learner-relevant: DataTree、串行化写、先检查后执行的并发安全。

### RPC

#### 1.什么是RPC和HTTP有什么区别

- Locator: `[[sources/小哲讲八股/20260926/RPC/1.什么是RPC和HTTP有什么区别.md#一、 知识点讲解]]`
- Summary: RPC 是远程调用方法论，HTTP 是具体传输协议；对比通常指 TCP/二进制 RPC 与 HTTP/JSON REST。
- Key claims: Client/Server Stub 把网络细节透明化；RPC 二进制序列化更小更快、自定义报文头更轻，HTTP 通用性最好。
- Learner-relevant: 桩机制、序列化与报文开销、连接模型（长连接+IO 多路复用）、内外接口场景分工。

#### 2.RPC的网络协议使用TCP和HTTP有什么区别

- Locator: `[[sources/小哲讲八股/20260926/RPC/2.RPC的网络协议使用TCP和HTTP有什么区别.md#一、 知识点讲解]]`
- Summary: HTTP 底层也是 TCP，本质是“裸 TCP 上自定义私有协议”与“标准 HTTP 规范”的权衡。
- Key claims: TCP 自定义协议（如 Dubbo）位域精简、二进制解析快、吞吐高；HTTP 通用、穿透防火墙、易调试，但 Header 重、文本解析慢。
- Learner-relevant: 私有协议 vs 标准协议、报文体积与解析开销、L4/L7 转发与调试生态。

#### 3.序列化协议有哪些对比一下优劣势

- Locator: `[[sources/小哲讲八股/20260926/RPC/3.序列化协议有哪些对比一下优劣势.md#一、 知识点讲解]]`
- Summary: 评价序列化看体积、速度、跨语言三指标；分文本类、二进制动态/静态类型、极致性能类。
- Key claims: JSON 通用但冗余大解析慢；Hessian 是 Dubbo 默认、Java 友好；Protobuf/Thrift 靠 IDL 只传值、体积最小跨语言最好；Kryo 最快但仅 Java 且兼容性差；禁用 JDK 原生序列化。
- Learner-relevant: 序列化选型、IDL/Schema、跨语言与兼容性权衡。

#### 4.注册中心怎么理解

- Locator: `[[sources/小哲讲八股/20260926/RPC/4.注册中心怎么理解.md#一、 知识点讲解]]`
- Summary: 注册中心让消费者依赖服务名而非 IP，串起提供者/消费者/注册中心三角，靠心跳与通知动态感知。
- Key claims: 流量不走注册中心（控制面与数据面分离），本地缓存保证注册中心全挂仍可调用；趋势选 AP（Nacos），读脏数据优于全链路瘫痪。
- Learner-relevant: 服务注册/订阅、心跳健康检测、CP vs AP 选型。

### 分布式场景题

#### 1.如何理解CAP理论

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/1.如何理解CAP理论.md#一、 知识点讲解]]`
- Summary: CAP 不是随意三选二，P（分区容错）是客观前提，实际只在 C 与 A 之间抉择。
- Key claims: 保 C 则分区时拒绝服务（CP，如 ZK/金融）；保 A 则返回旧数据（AP，如微博信息流/Eureka），对应最终一致性。
- Learner-relevant: 强一致与可用性的权衡、CP/AP 两类系统识别。

#### 2.如何理解BASE理论

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/2.如何理解BASE理论.md#知识点讲解]]`
- Summary: BASE 是 CAP 中 C/A 权衡的结果，用牺牲强一致换基本可用 + 最终一致，与 ACID 相反。
- Key claims: Basically Available（降级/响应变慢）、Soft State（允许中间状态与同步延时）、Eventually Consistent（一段时间后收敛一致）。
- Learner-relevant: 最终一致性、软状态、高并发 AP 场景设计取向。

#### 3.如何理解RAFT协议

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/3.如何理解RAFT协议.md#知识点讲解]]`
- Summary: RAFT 用强领导者模型把共识拆成选主、日志复制、安全性三部分，以易理解为核心目标。
- Key claims: 三态 Leader/Follower/Candidate，随机超时避免选票瓜分，过半当选；日志强单向复制、过半提交；日志匹配原则 + 仅最新日志节点可当选。
- Learner-relevant: 共识算法、任期 Term、过半提交与选举安全。

#### 4.什么是分布式锁？对比本地锁的区别？

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/4.什么是分布式锁？对比本地锁的区别？.md#一、 知识点讲解]]`
- Summary: 分布式锁与本地锁的区别在作用域——锁存在的位置决定它能管多宽。
- Key claims: 本地锁（synchronized/ReentrantLock）是进程级，集群下失效导致超卖；分布式锁是跨进程跨机器的全局锁，依附 Redis/ZK/MySQL 等第三方组件。
- Learner-relevant: 锁作用域、秒杀扣库存/防重提交/定时任务抢占等适用场景。

#### 5.什么是分布式ID？有哪些生成方案

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/5.什么是分布式ID？有哪些生成方案.md#一、 知识点讲解]]`
- Summary: 分布式 ID 是全局唯一标识，需满足唯一、趋势递增、高性能高可用，主流是雪花算法及其变种。
- Key claims: UUID 无序拖慢 B+ 树索引，只适合 Token/TraceID；DB 自增→号段模式；Redis INCR 快但运维复杂；雪花=41 位时间戳+10 位机器+12 位序列，本地生成时间有序但有回拨坑。
- Learner-relevant: 全局唯一 ID、趋势递增与页分裂、雪花结构。

#### 6.什么是一致性哈希

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/6.什么是一致性哈希.md#传统哈希的局限性]]`
- Summary: 一致性哈希把哈希空间组织成环（对 2^32 取模），解决扩缩容时数据迁移量过大的问题。
- Key claims: 普通 `hash(key)%N` 一改 N 几乎全失效引发缓存雪崩；环上顺时针找第一台服务器；增删节点只影响局部数据；节点少会倾斜，用每台约 150 个虚拟节点解决。
- Learner-relevant: 哈希环、单调性、虚拟节点与负载均衡。

#### 7.什么是时钟回播问题？如何解决？

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/7.什么是时钟回播问题？如何解决？.md#一、 知识点讲解]]`
- Summary: NTP 校准把本地时间拨回，使依赖时间戳的 ID 算法可能生成重复 ID。
- Key claims: 轻微回拨（毫秒级）自旋/Sleep 等待追平；严重回拨（秒级）拒绝生成并告警、流量切换；算法级预留回拨标志位区分时间维度。
- Learner-relevant: 雪花算法缺陷、ID 唯一性保障、NTP 与分布式时间。

#### 8.什么是分布式事务有哪些解决方案

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/8.什么是分布式事务有哪些解决方案.md#一、 知识点讲解]]`
- Summary: 分布式事务因 ACID 跨节点失效而生，分刚性（强一致 CP）与柔性（最终一致 AP/BASE）。
- Key claims: 2PC/XA 强一致但同步阻塞效率低；TCC 业务层两阶段性能好但侵入大；MQ 最终一致最常用解耦；Seata AT 代理数据源自动记 undo_log，近无侵入。
- Learner-relevant: 分布式事务方案选型、刚性与柔性事务边界。

#### 10.如何理解最终一致性

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/10.如何理解最终一致性.md#知识点讲解]]`
- Summary: 最终一致性是为高并发牺牲强一致的妥协，属于 BASE 核心思想。
- Key claims: 强一致需等所有从库同步、海量并发下加锁等待导致慢甚至不可用；写入立即返回，后台异步同步，无新更新后所有副本最终收敛一致。
- Learner-relevant: 异步复制/消息队列达成收敛、软状态、吞吐量优先设计。

#### 11.什么是分布式事务的两阶段提交

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/11.什么是分布式事务的两阶段提交.md#知识点讲解]]`
- Summary: 2PC 引入协调者，把提交拆成准备与提交两阶段，保证多节点全提交或全回滚。
- Key claims: 准备阶段真实执行本地事务、写 Redo/Undo 并锁资源但不提交；第二阶段全票 Commit 否则 Rollback；缺点是同步阻塞与协调者单点故障。
- Learner-relevant: 协调者/参与者模型、资源锁定、2PC 缺陷与替代方案。

#### 12.如何理解TCC

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/12.如何理解TCC.md#一、 知识点讲解]]`
- Summary: TCC 是应用层 2PC，用业务代码实现资源预留、确认、回滚，不依赖数据库回滚。
- Key claims: Try 做业务检查与资源预留（如冻结金额）；Confirm 不检查直接用预留资源、须幂等；Cancel 释放预留资源、也须幂等（防网络重试）。
- Learner-relevant: 资源预留/冻结、幂等与空回滚、业务侵入性成本。

#### 13.Seata的各种模式对比

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/13.Seata的各种模式对比.md#知识点讲解]]`
- Summary: Seata 四模式 AT/TCC/XA/Saga，本质在一致性强弱、业务侵入性、性能高低三维取舍。
- Key claims: AT 最常用、代理数据源记 Undo Log 二阶段异步删/反向补偿，需全局锁防脏写；TCC 资源预留、并发极高但代码翻倍；XA 强一致但长锁性能差；Saga 拆长事务为短事务、只保最终一致且隔离性差。
- Learner-relevant: Seata 模式选型、Undo Log 与镜像、最终一致与隔离性。

#### 高频热题

- Locator: `[[sources/小哲讲八股/20260926/分布式场景题/高频热题.md#高频热题 🔥🔥🔥🔥]]`
- Summary: 分布式场景题的高频题索引，链到 CAP、BASE、RAFT、分布式锁、分布式 ID、一致性哈希六篇。
- Key claims: 这六题被标注为最高频，是复习优先级参考。
- Learner-relevant: 复习优先级与主题导航。

### ElasticSearch

#### 1.什么是Lucene

- Locator: `[[sources/小哲讲八股/20260926/ElasticSearch/1.什么是Lucene.md#一、 知识点讲解]]`
- Summary: Lucene 是 Java 全文检索类库（发动机），ES 是把它封装成分布式、RESTful 的开箱即用服务。
- Key claims: 核心是倒排索引（词项→文档 ID）；段式存储且段不可变，删除=打 .del 标记、更新=标记删+新增，后台 Merge 合并回收。
- Learner-relevant: 正向/倒排索引、段不可变性、读写免锁与合并。

#### 2.介绍一下ES是什么

- Locator: `[[sources/小哲讲八股/20260926/ElasticSearch/2.介绍一下ES是什么.md#一、 知识点讲解]]`
- Summary: ES 是基于 Lucene 的分布式搜索分析引擎，解决关系库海量全文检索与聚合性能低的问题。
- Key claims: 靠倒排索引实现“内容找 ID”，亿级数据毫秒级；分片切分数据并行查询提吞吐，副本保证高可用。
- Learner-relevant: 倒排索引、分片与副本、分布式水平扩展。

#### 3.ES的性能高的底层原理是什么？

- Locator: `[[sources/小哲讲八股/20260926/ElasticSearch/3.ES的性能高的底层原理是什么？.md#一、 知识点讲解]]`
- Summary: ES 快不只是倒排索引，而在数据结构与操作系统特性结合——FST 与 Filesystem Cache。
- Key claims: FST 极度压缩，使 Term Index 常驻内存，先在内存定位 Block 再一次磁盘 IO 取倒排链；索引文件不可变使 OS 可放心 Page Cache，查询多为内存搜索。
- Learner-relevant: FST、Page Cache/预热、JVM Heap 与 OS 内存配比。

#### 4.什么是倒排索引

- Locator: `[[sources/小哲讲八股/20260926/ElasticSearch/4.什么是倒排索引.md#4.什么是倒排索引]]`
- Summary: 对比正排（文档→关键词，检索需全表扫）与倒排（关键词→文档 ID，检索直接命中）。
- Key claims: 正排写入快检索慢；倒排把关系反转，是搜索引擎与全文检索的核心数据结构。
- Learner-relevant: 正排/倒排映射、全文检索提速原理。

#### 5.如何理解ES的分词器如何选择合适的分词器

- Locator: `[[sources/小哲讲八股/20260926/ElasticSearch/5.如何理解ES的分词器如何选择合适的分词器.md#知识点讲解]]`
- Summary: 分词器是文本→倒排词项的处理管道，由字符过滤器、分词器、词元过滤器三组件按序组成。
- Key claims: 选型本质在召回率与索引大小/性能间权衡，粒度越细召回高但索引大；英文用 Standard Analyzer，中文标准分词按单字不可用，生产标配 IK。
- Learner-relevant: 分词 Pipeline、粒度权衡、中英文分词选型。

#### 6.如何保证ES和数据库的数据一致性

- Locator: `[[sources/小哲讲八股/20260926/ElasticSearch/6.如何保证ES和数据库的数据一致性.md#知识点讲解]]`
- Summary: ES 与 DB 是异构系统，强一致做不到，工程上追求最终一致，主流三种同步方案。
- Key claims: 同步双写简单但耦合、影响主流程；异步 MQ 解耦但需处理消息不丢、幂等与顺序；监听 Binlog（Canal 伪装 Slave）零侵入、容错最强，重点推荐。
- Learner-relevant: 异构数据同步、最终一致性、Canal/Binlog 订阅。

#### 7.如何解决ES的深分页问题

- Locator: `[[sources/小哲讲八股/20260926/ElasticSearch/7.如何解决ES的深分页问题.md#由于分布式架构导致的“读放大”]]`
- Summary: 深分页慢源于分布式读放大——协调节点需向所有分片召回前 from+size 条再全局排序。
- Key claims: `from+size` 每页 O(N) 累积成本，仅适合浅分页；Scroll 建快照、非实时、耗上下文，仅用于离线导出；Search After 用上一页 sort values 定位，性能恒定，适合 Feed 流实时深分页。
- Learner-relevant: 读放大、`max_result_window`、Scroll 与 Search After 选型。

#### 8.ES是如何进行模糊搜索的

- Locator: `[[sources/小哲讲八股/20260926/ElasticSearch/8.ES是如何进行模糊搜索的.md#一、 知识点讲解]]`
- Summary: 模糊搜索基于编辑距离（插入/删除/替换/换位），并用自动机技术高效找词。
- Key claims: `fuzziness` 控制最大编辑距离（长度短 0-1、长 2）；Lucene 不为每个 Term 算距离，而是构建编辑距离 DFA 与词典 FST 求交，快速跳过不可能前缀。
- Learner-relevant: 编辑距离/Levenshtein、DFA 与 FST 相交、fuzzy 参数调优。
