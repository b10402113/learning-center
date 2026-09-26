---
source: 小哲八股-Redis
source_type: codebase
source_lines: 2236
language: markdown
file_count: 37
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — Redis

## Overview (L1)

- 总览与性能 — Redis 是基于内存的 NoSQL / 数据结构服务器，快在纯内存、IO 多路复用、单线程命令执行与定制数据结构；本质是 KV 缓存兼内存数据库。
- 并发与线程模型 — 「单线程」特指命令执行；进程实际含主线程、3 个 BIO 后台线程（close_file / aof_fsync / lazy_free）与 Redis 6.0 的网络 I/O 线程组。
- 数据结构 — 5 基础类型（String/Hash/List/Set/ZSet）+ 3 特殊类型（Bitmap/HyperLogLog/Geo）；底层为 SDS、QuickList/Listpack、跳表+Dict。
- 过期与内存管理 — 惰性删除 + 定期删除处理过期 Key；maxmemory 触发 8 种淘汰策略，4.0 起用 UNLINK / Lazy Free 避免删大 Key 阻塞主线程。
- 持久化与事务 — RDB / AOF / 混合持久化与 AOF 重写；MULTI/EXEC 事务无回滚，Lua 脚本以单线程排他执行提供更强的原子性与逻辑能力。
- 缓存问题与一致性 — 穿透/击穿/雪崩、布隆过滤器、本地缓存多级一致性、MySQL-Redis 最终一致性（删除缓存、延迟双删、Canal+MQ）。
- 锁、集群与消息 — 分布式锁（SET NX PX、Lua 解锁、看门狗、Redisson 可重入、RedLock）与 Sentinel/Cluster/哈希槽；热 Key、大 Key、Pipeline、Pub/Sub 与 Stream。

## Sections (L2)

### 1.什么是Redis
- Locator: `[[sources/小哲讲八股/20260926/Redis/1.什么是Redis.md#1.什么是Redis]]`
- Summary: Redis 的定义、定位与整体知识地图：内存 NoSQL + 数据结构服务器，速度来源、持久化与高可用概览。
- Key claims: 内存纳秒级、单线程命令执行 + epoll IO 多路复用是快的基础；支持 String/List/Hash/Set/ZSet；RDB、AOF 持久化，Sentinel/Cluster 高可用。
- Learner-relevant: 为整个 Redis 学习路径定锚——是什么、为什么快、能做什么。

### 2.直接用一个哈希表替代Redis来做缓存可以吗
- Locator: `[[sources/小哲讲八股/20260926/Redis/2.直接用一个哈希表替代Redis来做缓存可以吗.md#2.直接用一个哈希表替代Redis来做缓存可以吗]]`
- Summary: 对比进程内哈希表（本地缓存）与 Redis 远程缓存，说明本地缓存不可完全替代 Redis 的原因。
- Key claims: 本地缓存快 1-2 个数量级但引入状态与水平扩展难题；无 LRU/上限易 OOM；重启丢数据引发雪崩；最佳实践是本地+Redis 多级缓存。
- Learner-relevant: 本地缓存 vs 远程缓存，多级缓存架构的引入动机。

### 3.既然用了本地缓存和Redis两层，怎么保证它们之间的数据一致性呢
- Locator: `[[sources/小哲讲八股/20260926/Redis/3.既然用了本地缓存和Redis两层，怎么保证它们之间的数据一致性呢.md#3.既然用了本地缓存和 Redis 两层，怎么保证它们之间的数据一致性呢]]`
- Summary: 多级缓存一致性方案：短 TTL 兜底 + 主动通知（Pub/Sub、MQ 广播、Canal+MQ）。
- Key claims: 目标是最终一致性而非强一致；本地缓存必须设短 TTL（5-60s）作最后保险；Pub/Sub 即发即弃会丢消息，MQ 广播更可靠，Canal 可解耦业务。
- Learner-relevant: 「主动通知 + 被动兜底」模式，缓存一致性基础。

### 4.如果Redis的命令执行使用多线程的话性能会不会上升
- Locator: `[[sources/小哲讲八股/20260926/Redis/4.如果Redis的命令执行使用多线程的话性能会不会上升.md#4.如果Redis的命令执行使用多线程的话性能会不会上升]]`
- Summary: 论证通用场景下命令执行多线程化会因锁开销与上下文切换而变慢。
- Key claims: GET/SET 纳秒级，加锁成本可能超过执行本身；全局锁退化为串行、细粒度锁维护成本极高；多核上下文切换破坏 CPU 缓存亲和性；只有 SINTER/SORT/Lua 等重计算场景受益。
- Learner-relevant: 单线程模型合理性的反面论证，解释「为什么不用多线程执行命令」。

### 5.为什么Redis的性能这么好
- Locator: `[[sources/小哲讲八股/20260926/Redis/5.为什么Redis的性能这么好.md#5.为什么Redis的性能这么好]]`
- Summary: 归纳 Redis 高性能的四大来源：纯内存、IO 多路复用、单线程、高效数据结构。
- Key claims: 内存 vs 磁盘差几个数量级；epoll + Reactor 实现非阻塞海量连接；单线程零锁竞争、免上下文切换；SDS/ZipList/SkipList 针对性优化。
- Learner-relevant: 性能主题的核心答案，可与第 1、6 题互为印证。

### 6.整个Redis进程都有哪些线程
- Locator: `[[sources/小哲讲八股/20260926/Redis/6.整个Redis进程都有哪些线程.md#6.整个Redis进程都有哪些线程]]`
- Summary: 澄清「单线程」指命令执行，进程本身多线程：主线程、3 个 BIO 线程、6.0 I/O 线程组。
- Key claims: BIO 三类任务为 bio_close_file、bio_aof_fsync、bio_lazy_free；I/O 线程只做 socket 读写与协议解析，不执行命令。
- Learner-relevant: 线程模型的完整图景，衔接过期/淘汰时的异步删除机制。

### 7.Redis常见的数据结构有哪些？有什么应用场景
- Locator: `[[sources/小哲讲八股/20260926/Redis/7.Redis常见的数据结构有哪些？有什么应用场景.md#7.Redis常见的数据结构有哪些？有什么应用场景]]`
- Summary: 梳理 5 种基础数据结构与 3 种特殊结构，并给出各自典型应用场景。
- Key claims: Hash 支持字段级部分更新；Set 服务端支持交并差；ZSet 跳表实现 O(logN) 排序；Bitmap 签到省内存、HyperLogLog 12KB 估基数、Geo 基于 ZSet 做附近查找。
- Learner-relevant: 数据结构主题总纲，后续 8-11 题逐项深入。

### 8.Redis的String是怎么实现的
- Locator: `[[sources/小哲讲八股/20260926/Redis/8.Redis的String是怎么实现的.md#8.Redis的String是怎么实现的]]`
- Summary: String 底层 SDS（简单动态字符串）的设计与相对 C 字符串的四大优势。
- Key claims: 头部记录 len 实现 O(1) 取长度；以 len 界定边界实现二进制安全；API 自动检查空间防缓冲区溢出；空间预分配 + 惰性释放减少 malloc/free；3.2 后按长度分 5 种 sdshdr。
- Learner-relevant: 数据结构底层实现的入门样本。

### 9.Redis的List是怎么实现的
- Locator: `[[sources/小哲讲八股/20260926/Redis/9.Redis的List是怎么实现的.md#9.Redis的List是怎么实现的]]`
- Summary: List 从 ziplist/linkedlist 混合演进到 QuickList，7.0 起节点换为 Listpack。
- Key claims: QuickList = 双向链表 + 每节点一个 ziplist；兼顾减少指针碎片与局部修改；7.0 用 listpack 替换 ziplist 以消除连锁更新。
- Learner-relevant: 「宏观链表、微观数组」的混合结构思想。

### 10.ZipList有连锁更新的问题，那Listpack是怎么解决这个问题的？
- Locator: `[[sources/小哲讲八股/20260926/Redis/10.ZipList有连锁更新的问题，那Listpack是怎么解决这个问题的？.md#10.ZipList 有连锁更新的问题，那 Listpack 是怎么解决这个问题的？]]`
- Summary: 解释 ZipList 连锁更新的根因及 Listpack 用后置 backlen 彻底解耦节点的方案。
- Key claims: ZipList 每节点存 prevlen（1 或 5 字节），跨 254 阈值会多米诺式重分配，O(1) 退化为 O(N)；Listpack 移除 prevlen，尾部存 element-tot-len，靠它仍可逆序遍历。
- Learner-relevant: 紧凑编码结构的经典权衡，连接 List/ZSet/Stream 的底层。

### 11.ZSet的底层实现原理是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Redis/11.ZSet的底层实现原理是怎样的.md#11.ZSet的底层实现原理是怎样的]]`
- Summary: ZSet 按数据量在 ZipList/Listpack 与 SkipList+Dict 之间动态切换，并解释为何不用红黑树。
- Key claims: 小数据默认 <128 元素且 <64 字节用 ZipList；大数据用跳表做 O(logN) 有序查找、Dict 让 ZSCORE 降到 O(1)，二者共享元素指针；选跳表因范围查询更高效、实现更简单。
- Learner-relevant: 排行榜/延时队列的底层依据。

### 12.既然多线程执行这么麻烦，那Redis是怎么解决Key过期和淘汰的？这会不会阻塞主线程
- Locator: `[[sources/小哲讲八股/20260926/Redis/12.既然多线程执行这么麻烦，那Redis是怎么解决Key过期和淘汰的？这会不会阻塞主线程.md#12.既然多线程执行这么麻烦，那 Redis 是怎么解决 Key 过期和淘汰的？这会不会阻塞主线程]]`
- Summary: 过期删除采用惰性+定期混合策略，内存淘汰在写命令前触发；大 Key 删除的阻塞问题由 4.0 Lazy Free 解决。
- Key claims: 定期删除每 100ms 随机采样 20 个、过期比例 >25% 重复且有时间上限；近似 LRU 随机采样（默认 5 个）；4.0 前 DEL 同步阻塞，4.0 后 UNLINK + bio_lazy_free 异步释放。
- Learner-relevant: 过期/淘汰主题的核心，衔接线程模型与淘汰策略。

### 13.Redis的内存满了会怎样？有哪些策略不同策略的应用场景有什么不同？
- Locator: `[[sources/小哲讲八股/20260926/Redis/13.Redis的内存满了会怎样？有哪些策略不同策略的应用场景有什么不同？.md#13.Redis的内存满了会怎样？有哪些策略不同策略的应用场景有什么不同？]]`
- Summary: 达到 maxmemory 后的行为与 8 种淘汰策略的二维拆解及选型场景。
- Key claims: 默认 noeviction 写命令报 OOM、读命令正常；维度一为 allkeys/volatile，维度二为 LRU/LFU/Random/TTL；纯缓存推荐 allkeys-lru/lfu，混合场景用 volatile-lru；每次命令前采样 5 个渐进淘汰。
- Learner-relevant: 淘汰策略的选型判断，区别于过期删除策略。

### 14.Redis的持久化机制有哪些
- Locator: `[[sources/小哲讲八股/20260926/Redis/14.Redis的持久化机制有哪些.md#14.Redis的持久化机制有哪些]]`
- Summary: 三种持久化：RDB 快照、AOF 日志、4.0 混合持久化，含 bgsave fork 与 AOF 刷盘策略。
- Key claims: RDB 靠 fork 子进程 + 写时复制（COW）生成静态快照、恢复快但可能丢分钟级数据；AOF 三种 appendfsync 策略，默认 everysec 最多丢 1 秒；混合持久化在 AOF 重写时头部放 RDB、尾部放增量命令。
- Learner-relevant: 持久化主题总纲，后续 15、16 题展开。

### 15.对比RDB和AOF
- Locator: `[[sources/小哲讲八股/20260926/Redis/15.对比RDB和AOF.md#15.对比RDB和AOF]]`
- Summary: 从记录本质、恢复速度、文件体积、安全性四维度对比 RDB 与 AOF。
- Key claims: RDB 记「最终状态」、AOF 记「操作过程」；RDB 物理拷贝恢复快、AOF 逐条重放慢；RDB 二进制紧凑、AOF 文本更大；同时存在时优先加载 AOF。
- Learner-relevant: 持久化选型的对比框架。

### 16.如何理解AOF重写机制
- Locator: `[[sources/小哲讲八股/20260926/Redis/16.如何理解AOF重写机制.md#16.如何理解AOF重写机制]]`
- Summary: AOF 重写不是分析旧文件，而是基于当前内存逆向重建最小命令集，并用重写缓冲区保证增量一致。
- Key claims: 把「历史过程」压缩成「最终状态」（如 100 万次 INCR → 一条 SET）；子进程重写期间主线程新写命令同时进 AOF 缓冲区与重写缓冲区；完成后追加增量并原子替换旧文件。
- Learner-relevant: 文件膨胀治理与增量一致性机制。

### 17.Redis的事务是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Redis/17.Redis的事务是怎样的.md#17.Redis的事务是怎样的]]`
- Summary: Redis 事务是命令打包串行执行，MULTI/EXEC/DISCARD/WATCH，无回滚机制。
- Key claims: 入队语法错误则整个事务放弃；运行时错误仅该条失败、后续照常执行；作者认为回滚复杂且影响性能；单线程保证隔离性；生产更推荐 Lua 脚本。
- Learner-relevant: 事务主题，「半吊子原子性」是高频考点。

### 18.为什么说Lua脚本是原子性的？如果Lua脚本执行了一半断电了怎么办？
- Locator: `[[sources/小哲讲八股/20260926/Redis/18.为什么说Lua脚本是原子性的？如果Lua脚本执行了一半断电了怎么办？.md#18.为什么说 Lua 脚本是原子性的？如果 Lua 脚本执行了一半断电了怎么办？]]`
- Summary: Lua 原子性实为单线程排他执行的隔离性；断电场景靠 AOF 恢复保证「要么全有要么全无」。
- Key claims: 脚本执行期间阻塞其他客户端请求；脚本内部报错不回滚（伪原子性）；未刷盘则重启后当未执行，刷一半则由 redis-check-aof 截断残缺记录。
- Learner-relevant: 原子性语义辨析，和事务、MySQL 事务对比。

### 19.Lua脚本和Redis事务对比一下
- Locator: `[[sources/小哲讲八股/20260926/Redis/19.Lua脚本和Redis事务对比一下.md#19.Lua脚本和Redis事务对比一下]]`
- Summary: Lua 脚本是 Redis 事务的「完全体」替代：支持服务端逻辑判断且网络开销更低。
- Key claims: 事务无法根据中间结果做 if-else，Lua 可以 GET 后计算再决定命令；事务需多次 RTT，Lua 一次 EVAL 完成。
- Learner-relevant: 原子业务逻辑的实现选型。

### 20.什么是缓存击穿、缓存雪崩和缓存穿透
- Locator: `[[sources/小哲讲八股/20260926/Redis/20.什么是缓存击穿、缓存雪崩和缓存穿透.md#20.什么是缓存击穿、缓存雪崩和缓存穿透]]`
- Summary: 区分穿透（查不存在）、击穿（单点热点过期）、雪崩（大批量过期/宕机）及对应方案。
- Key claims: 穿透用布隆过滤器或缓存空对象；击穿用互斥锁或逻辑过期；雪崩用随机 TTL、高可用集群、降级限流。
- Learner-relevant: 缓存三大经典问题的核心答案。

### 21.什么是布隆过滤器原理是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Redis/21.什么是布隆过滤器原理是怎样的.md#21.什么是布隆过滤器原理是怎样的]]`
- Summary: 布隆过滤器=位数组+多个哈希函数，用极小空间换取「一定不存在 / 可能存在」判断。
- Key claims: 任一哈希位为 0 则一定不存在，全为 1 则可能存在（哈希碰撞误判）；插入查询 O(k) 极快；标准版不支持删除；经典用于防缓存穿透。
- Learner-relevant: 防穿透的核心数据结构原理。

### 22.如果随着系统运行，有越来越多的数据被删除，布隆过滤器又不支持删除，会导致误判率越来越高，这应该怎么处理？
- Locator: `[[sources/小哲讲八股/20260926/Redis/22.如果随着系统运行，有越来越多的数据被删除，布隆过滤器又不支持删除，会导致误判率越来越高，这应该怎么处理？.md#22.如果随着系统运行，有越来越多的数据被删除，布隆过滤器又不支持删除，会导致误判率越来越高，这应该怎么处理？]]`
- Summary: 解决标准布隆过滤器数据删除导致误判率失控的两种工程路径。
- Key claims: 定时重建（新建过滤器、重载有效数据、原子替换）成本最低；计数布隆过滤器支持删减但空间开销为标准的 3-4 倍。
- Learner-relevant: 布隆过滤器的工程化取舍。

### 23.如何保证MySQL和Redis的数据一致性
- Locator: `[[sources/小哲讲八股/20260926/Redis/23.如何保证MySQL和Redis的数据一致性.md#23.如何保证MySQL和Redis的数据一致性]]`
- Summary: 旁路缓存模式下选「删除缓存」而非「更新缓存」，选「先写库后删缓存」，并用异步补偿兜底。
- Key claims: 更新缓存在并发下易后写先至产生永久脏数据；先删缓存会让旧数据被读回；延迟双删（写库前后各删、第二次延时 500ms）与 Canal+MQ 异步删除保证最终一致性。
- Learner-relevant: 数据库-缓存一致性是面试必考，连接 Canal 与消息队列。

### 24.canal的工作原理是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Redis/24.canal的工作原理是怎样的.md#24.canal的工作原理是怎样的]]`
- Summary: Canal 伪装成 MySQL Slave 订阅 Binlog，解析二进制流为结构化事件并投递下游。
- Key claims: 流程为建连接、认证、发 COM_BINLOG_DUMP、接收 Binlog；解析为含库表名、操作类型、Before/After Image 的 Entry；常投递到 Kafka/RocketMQ 或同步到 ES/Redis。
- Learner-relevant: 解耦式缓存同步/异构同步的核心组件。

### 25.Redis如何实现分布式锁
- Locator: `[[sources/小哲讲八股/20260926/Redis/25.Redis如何实现分布式锁.md#25.Redis如何实现分布式锁]]`
- Summary: 分布式锁三要点：原子加锁、防误删解锁、自动续期；生产用 Redisson。
- Key claims: 用 SET key value NX PX 一次原子设置值+过期时间，避免 SETNX+EXPIRE 死锁；Value 用 UUID 唯一标识，解锁用 Lua 先比对再 DEL；Redisson Watchdog 默认 30s 自动续期。
- Learner-relevant: 分布式锁主题总纲。

### 26.Redission的分布式锁是可重入的吗？具体是如何实现的可重入？
- Locator: `[[sources/小哲讲八股/20260926/Redis/26.Redission的分布式锁是可重入的吗？具体是如何实现的可重入？.md#26.Redission的分布式锁是可重入的吗？具体是如何实现的可重入？]]`
- Summary: Redisson 用 Hash + Lua 实现可重入锁，Field 存 UUID:ThreadID、Value 存重入计数。
- Key claims: 无锁时创建 Hash 计数置 1；同线程重入用 HINCRBY 加一并刷新过期；解锁减一，归零才 DEL；Lua 保证判断与操作原子。
- Learner-relevant: 可重入锁的数据结构设计。

### 27.什么是RedLock
- Locator: `[[sources/小哲讲八股/20260926/Redis/27.什么是RedLock.md#27.什么是RedLock]]`
- Summary: RedLock 用 N 个独立 Redis 节点 + 过半机制解决主从异步复制导致的锁丢失，但生产少用。
- Key claims: 需 N/2+1 节点加锁成功且总耗时小于 TTL；解决单点故障与主从切换锁丢失；依赖系统时钟，Martin Kleppmann 质疑 NTP 跳变/GC 停顿下会失效；运维重，强一致场景更推荐 ZooKeeper。
- Learner-relevant: 分布式锁的安全性边界与共识组件选型。

### 28.Redis的集群方案有哪些
- Locator: `[[sources/小哲讲八股/20260926/Redis/28.Redis的集群方案有哪些.md#28.Redis的集群方案有哪些]]`
- Summary: 集群方案演进：主从+Sentinel → 代理分片（Codis）→ 官方 Redis Cluster。
- Key claims: 主从+Sentinel 做读写分离与故障转移但无法水平扩容；代理方案多一层转发且 Codis 逐渐退场；Cluster 去中心化、Gossip 通信、16384 哈希槽、MOVED 重定向。
- Learner-relevant: 架构演进主线，连接哈希槽与热/大 Key。

### 29.Redis如何实现延时队列
- Locator: `[[sources/小哲讲八股/20260926/Redis/29.Redis如何实现延时队列.md#29.Redis如何实现延时队列]]`
- Summary: 用 ZSet 以执行时间戳为 Score 实现延时队列，Lua 保证取出不重复，Redisson 优化为 ZSet+List。
- Key claims: 生产者 ZADD 未来时间戳，消费者 ZRANGEBYSCORE 轮询到期任务；并发下用 Lua「查+ZREM」保证只被消费一次；Redisson RDelayedQueue 用后台线程搬运到 List，消费者 BLPOP，避免空轮询。
- Learner-relevant: ZSet 的典型生产应用。

### 30.为什么哈希槽的数量固定是16384个
- Locator: `[[sources/小哲讲八股/20260926/Redis/30.为什么哈希槽的数量固定是16384个.md#30.为什么哈希槽的数量固定是 16384 个]]`
- Summary: 16384（2^14）而非 CRC16 上限 65536，是为压缩 Gossip 心跳包的 myslots Bitmap。
- Key claims: 65536 槽需 8KB 包头、16384 槽仅 2KB，缩小 4 倍；官方集群规模建议 ≤1000 节点，16384 槽已足够均匀（每节点约 16 槽）。
- Learner-relevant: Cluster 设计的带宽与规模权衡。

### 31.Redis的热Key问题如何理解_如何解决
- Locator: `[[sources/小哲讲八股/20260926/Redis/31.Redis的热Key问题如何理解_如何解决.md#31.Redis的热Key问题如何理解?如何解决]]`
- Summary: 热 Key 导致流量倾斜到单分片，先监控发现再用多级缓存/Key 备份分流。
- Key claims: 后果为单分片 CPU/网卡打满甚至击穿数据库；发现靠客户端统计上报或 redis-cli --hotkeys；解法为本地缓存（最有效）、key_1..key_N 随机读分流、写热点用 MQ 削峰或本地聚合。
- Learner-relevant: 集群下的热点治理，与多级缓存呼应。

### 32.Redis的大Key问题如何理解_如何解决_
- Locator: `[[sources/小哲讲八股/20260926/Redis/32.Redis的大Key问题如何理解_如何解决_.md#32.Redis的大Key问题如何理解?如何解决?]]`
- Summary: 大 Key 指 Value 过大或集合元素过多，危害为阻塞主线程与打满带宽，治理策略是拆分/压缩/不存。
- Key claims: 常见阈值 String >10KB、集合 >5000 元素或 >10MB；DEL 大 Key 为 O(N) 阻塞数秒；检测用 --bigkeys 或 rdb-tools 离线分析；用 UNLINK 替代 DEL 异步释放。
- Learner-relevant: 与大 Key、Lazy Free、BIO 线程直接相连。

### 33.Redis的pipeline是什么_有什么应用场景_
- Locator: `[[sources/小哲讲八股/20260926/Redis/33.Redis的pipeline是什么_有什么应用场景_.md#33.Redis的pipeline是什么?有什么应用场景?]]`
- Summary: Pipeline 是客户端批量打包命令减少 RTT 与系统调用的网络优化，不具备原子性。
- Key claims: 减少 write/read 系统调用与上下文切换，批量命令吞吐可差几十倍；中间命令失败后续仍执行；适合无依赖的批量读写、数据导入/迁移；应按 batch（如 500 条）分批避免阻塞。
- Learner-relevant: 网络层面的优化手段，区别于事务/Lua。

### 34.Redis的发布订阅模式是怎样的_有什么应用场景_
- Locator: `[[sources/小哲讲八股/20260926/Redis/34.Redis的发布订阅模式是怎样的_有什么应用场景_.md#34.Redis的发布订阅模式是怎样的?有什么应用场景?]]`
- Summary: Pub/Sub 是基于频道的「转发而非存储」一对多广播，即发即弃、不保证可靠。
- Key claims: 消息不落地、Redis 仅做路由器；订阅者短暂掉线期间消息永久丢失；适用弹幕/即时通知/缓存失效广播，不可当专业 MQ；可靠升级版为 Redis 5.0 Stream。
- Learner-relevant: 消息语义起点，连接本地缓存一致性与 Stream。

### 35.Redis的stream是怎样的_有什么应用场景
- Locator: `[[sources/小哲讲八股/20260926/Redis/35.Redis的stream是怎样的_有什么应用场景.md#35.Redis的stream是怎样的?有什么应用场景]]`
- Summary: Stream 是 Redis 5.0 引入的仅追加日志型数据结构，类轻量 Kafka，支持持久化、消费组与 ACK。
- Key claims: 底层用基数树压缩时间戳前缀 ID；消费组支持多播与组内负载均衡并维护游标；PEL + XACK 提供至少一次语义与崩溃恢复；适合中小规模异步解耦，海量/极高可靠场景选 Kafka/RocketMQ。
- Learner-relevant: Redis 消息队列的成熟形态。

### 36.Stream底层的基数树实现原理是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Redis/36.Stream底层的基数树实现原理是怎样的.md#36.Stream底层的基数树实现原理是怎样的]]`
- Summary: Stream 底层是 Rax（基数树）与 Listpack 的混合：Rax 做索引、Listpack 存消息。
- Key claims: 基数树是前缀树压缩版，合并单子节点路径，利用 Stream ID 前缀重合省内存；宏节点设计让 Rax 叶子挂 Listpack（50-100 条消息），形成「目录+内容页」两级索引；XRANGE 先树查找再 Listpack 内顺序/二分。
- Learner-relevant: 索引结构与紧凑存储结合的进阶实现。

### 高频热题
- Locator: `[[sources/小哲讲八股/20260926/Redis/高频热题.md#高频热题 🔥🔥🔥🔥]]`
- Summary: 课程标注的 Redis 高频面试题清单，指向 9 个核心主题的原文链接。
- Key claims: 高频命中本地缓存替代、性能、数据结构、内存淘汰、持久化、RDB/AOF 对比、缓存三大问题、MySQL-Redis 一致性、分布式锁。
- Learner-relevant: 复习优先级的参考索引。
