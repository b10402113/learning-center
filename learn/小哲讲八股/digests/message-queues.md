---
source: 小哲八股-消息队列
source_type: codebase
source_lines: 2152
language: markdown
file_count: 37
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — 消息队列（Kafka / RabbitMQ / RocketMQ）

## Overview (L1)

- 消息队列基础与选型 — 三款产品各有一篇「消息队列有什么作用」，统一讲异步、解耦、削峰三大价值；Kafka 篇额外给出 Kafka/RocketMQ/RabbitMQ 的选型对比（Kafka 1、2；RabbitMQ 1；RocketMQ 1）。
- Kafka 架构与存储内核 — Topic/Partition/Replica/ISR 数据模型、Consumer Group 与 Rebalance、ZooKeeper 职责与 KRaft 去 ZK 演进、顺序写 + 零拷贝 + PageCache + 批量的高吞吐原理（Kafka 3、8–13）。
- Kafka 可靠性与运行问题 — 三端不丢消息、幂等去重、分区级顺序、堆积危害与临时 Topic 分流、基于多级延时 Topic 的延时队列、Pull + 长轮询（Kafka 4–7、14、15）。
- RabbitMQ 架构与特有机制 — Exchange/Binding/Queue 路由、Channel 多路复用、vhost、Confirm 与手动 ACK、死信队列做延时、事务 vs Confirm、镜像/仲裁队列与 HAProxy + Keepalived 高可用（RabbitMQ 全部文件）。
- RocketMQ 架构、集群与事务 — NameServer/Broker/CommitLog + ConsumeQueue、消息不丢的三阶段、局部顺序与 MessageListenerOrderly、半消息 + 回查的事务消息、单/多 Master/多从/Dledger 集群（RocketMQ 全部文件）。
- 横切主题 — 可靠性（如何不丢）、幂等去重、顺序保证、消息堆积、延时队列、高可用、推拉模式七个问题在三款 MQ 上的对比解法；三篇「高频热题」给出面试出题优先级。

## Sections (L2)

### Kafka/1.消息队列有什么作用

- Locator: `[[sources/小哲讲八股/20260926/Kafka/1.消息队列有什么作用.md#1.消息队列有什么作用]]`
- Summary: 用「打电话 vs 发微信」类比，讲 MQ 的三大作用：异步处理、系统解耦、流量削峰。
- Key claims: 串行注册 250ms 可降到 55ms；订单系统只发事件、下游自订阅；MQ 作为蓄水池把 10 万 QPS 拦到数据库能承受的 2000 QPS。
- Learner-relevant: 消息队列课程的公共起点，三款产品共享同一套价值论述。

### Kafka/2.Kafka、RocketMQ和RabbitMQ到底该怎么选

- Locator: `[[sources/小哲讲八股/20260926/Kafka/2.Kafka、RocketMQ和RabbitMQ到底该怎么选.md#2.Kafka、RocketMQ 和 RabbitMQ 到底该怎么选]]`
- Summary: 把三款 MQ 概括为三种设计哲学并给出选型四维度（吞吐、业务复杂度、可靠性、技术栈）。
- Key claims: RabbitMQ 低延迟微秒级、靠 Exchange 路由强但吞吐低且怕堆积；Kafka 靠 PageCache/顺序写/零拷贝做千万级 TPS 但业务功能弱；RocketMQ 纯 Java、支持事务/延时/死信/回溯且天生抗大量 Topic。
- Learner-relevant: 全局对照锚点，为后续三产品分头学习建立坐标系。

### Kafka/3.Kafka的架构是怎样的

- Locator: `[[sources/小哲讲八股/20260926/Kafka/3.Kafka的架构是怎样的.md#3.Kafka的架构是怎样的]]`
- Summary: 从 Producer/Broker/Consumer/ZK-KRaft 与 Topic/Partition 讲 Kafka「分布式、分区、多副本」的提交日志架构。
- Key claims: Partition 是并发最小单元且分区内有序、Topic 整体无序；Replica 分 Leader（读写）/Follower（只同步），ISR 决定强一致写入；存储层为 Segment 顺序追加。
- Learner-relevant: Kafka 全部后续主题（ISR、Rebalance、性能）的架构底座。

### Kafka/4.如何保证消息不丢失

- Locator: `[[sources/小哲讲八股/20260926/Kafka/4.如何保证消息不丢失.md#4.如何保证消息不丢失]]`
- Summary: 按生产、存储、消费三阶段拆解丢消息原因与参数解法。
- Key claims: `acks=all` + `retries` 保 Producer；副本 ≥3、`min.insync.replicas`>1、`unclean.leader.election.enable=false` 保 Broker；关自动提交、业务成功后再手动提交 Offset 保 Consumer。
- Learner-relevant: 可靠性主题主线，与 RabbitMQ/RocketMQ 同名题构成对比学习。

### Kafka/5.如何避免消息的重复消费

- Locator: `[[sources/小哲讲八股/20260926/Kafka/5.如何避免消息的重复消费.md#5.如何避免消息的重复消费]]`
- Summary: 指出分布式只能做到 At Least Once，重复根因是业务完成但 Offset 提交失败，解法在消费端幂等。
- Key claims: 唯一索引插入、Redis Set 前置去重、乐观锁 `WHERE status=1`、专门去重表 + 本地事务四种手段。
- Learner-relevant: 幂等主题主线，三产品统一落点。

### Kafka/6.如何保证消息的顺序

- Locator: `[[sources/小哲讲八股/20260926/Kafka/6.如何保证消息的顺序.md#6.如何保证消息的顺序]]`
- Summary: Kafka 只保证 Partition 内有序，讲发送端 Key 路由、Broker 重试乱序坑、消费端内存 Hash 队列三处控制。
- Key claims: `Hash(Key)%Partition` 让同 Key 入同分区；重试且 `max.in.flight.requests.per.connection>1` 会乱序，需幂等生产者或设为 1；消费多线程时按 Key 二次 Hash 到内存队列。
- Learner-relevant: 顺序主题主线，明确「分区有序、非全局有序」的边界。

### Kafka/7.消息堆积问题有什么危害如何解决

- Locator: `[[sources/小哲讲八股/20260926/Kafka/7.消息堆积问题有什么危害如何解决.md#7.消息堆积问题有什么危害如何解决]]`
- Summary: 讲堆积后果（含超保留期被删）与「临时 Topic 分流法」应急方案及消费端优化。
- Key claims: 消费者数超过分区数会闲置，加机器无效；应急建 N 倍分区新 Topic + 纯转发程序 + 新消费集群；调大 `fetch.max.bytes`/`max.poll.records`、批量写、消费者内线程池。
- Learner-relevant: 堆积主题主线，体现 Kafka 并行度受分区数限制的独有约束。

### Kafka/8.Kafka为什么那么快

- Locator: `[[sources/小哲讲八股/20260926/Kafka/8.Kafka为什么那么快.md#8.Kafka为什么那么快]]`
- Summary: 归纳高吞吐四要素：磁盘顺序写、零拷贝、PageCache、批量与压缩。
- Key claims: 顺序写省寻道；`sendfile` 让数据从 PageCache 直达网卡，少 2 次拷贝与 2 次上下文切换；写入先落 PageCache 异步刷盘、读取优先命中；Batch + 压缩降网络 I/O。
- Learner-relevant: 性能主题锚点，也是理解「异步刷盘有丢数据风险」的前置。

### Kafka/9.消费者组概念如何理解

- Locator: `[[sources/小哲讲八股/20260926/Kafka/9.消费者组概念如何理解.md#9.消费者组概念如何理解]]`
- Summary: 消费者组是消费端逻辑容器，用组内负载均衡与组间广播统一了点对点和发布订阅两种模型。
- Key claims: 一个 Partition 在同组内只能被一个消费者线程消费；组数可超过分区数但多余消费者闲置；Offset 存在内部 Topic `__consumer_offsets`，故障可续。
- Learner-relevant: 消费模型与水平扩展的核心，承接 Rebalance。

### Kafka/10.如何理解Kafka的Rebalance机制

- Locator: `[[sources/小哲讲八股/20260926/Kafka/10.如何理解Kafka的Rebalance机制.md#10.如何理解Kafka的Rebalance机制]]`
- Summary: Rebalance 是消费者组重新分配分区的协议，讲触发时机、Coordinator 角色与 Stop The World 危害。
- Key claims: 触发于成员变化、分区数变化、正则订阅新增主题；Coordinator 选 Leader 消费者算方案再下发；Eager 模式全程停消费，频繁抖动会造成重平衡风暴与 Lag 飙升。
- Learner-relevant: 高可用与稳定性锚点，直接关联堆积与重复消费成因。

### Kafka/11.Kafka中的zookeeper充当怎样的角色？为什么后面要废除？

- Locator: `[[sources/小哲讲八股/20260926/Kafka/11.Kafka中的zookeeper充当怎样的角色？为什么后面要废除？.md#11.Kafka中的zookeeper充当怎样的角色？为什么后面要废除？]]`
- Summary: 讲旧版 Kafka 依赖 ZooKeeper 做元数据、Controller 选举、健康检测，以及去除它的性能与运维动因。
- Key claims: Controller 故障转移需从 ZK 全量加载元数据，百万分区时集群长时间不可写；ZK 写性能与 Watch 限制单集群分区数；KRaft 把元数据存内部 Topic + Raft 仲裁。
- Learner-relevant: 架构演进锚点，连到 KRaft。

### Kafka/12.Kafka的ISR如何理解

- Locator: `[[sources/小哲讲八股/20260926/Kafka/12.Kafka的ISR如何理解.md#12.Kafka的ISR如何理解]]`
- Summary: ISR 是「跟得上 Leader」的副本集合（AR = ISR + OSR），是可靠性与可用性的动态平衡。
- Key claims: 0.9 后按时间判定（`replica.lag.time.max.ms`）而非落后条数；HW 取 ISR 中最慢副本 LEO，消费者只能读到 HW；新 Leader 默认只从 ISR 选，脏选举会丢数据。
- Learner-relevant: 承接副本机制，是可靠性、HW、Leader 选举的共同基础。

### Kafka/13.KRaft如何理解

- Locator: `[[sources/小哲讲八股/20260926/Kafka/13.KRaft如何理解.md#13.KRaft如何理解]]`
- Summary: KRaft 把元数据也当作日志存入内部 Topic，用 Raft 让 Controller 间同步，实现去 ZK 的自我管理。
- Key claims: 备用 Controller 实时同步日志、内存始终最新，故障切换毫秒级；3 或 5 个 Voter 组成 Controller Quorum 选 Active Controller；单进程统一 Broker 与 Controller 角色，运维减半。
- Learner-relevant: 深化文件 11，理解元数据扩展性与故障恢复时间。

### Kafka/14.如何基于Kafka实现延时队列

- Locator: `[[sources/小哲讲八股/20260926/Kafka/14.如何基于Kafka实现延时队列.md#14.如何基于Kafka实现延时队列]]`
- Summary: Kafka 原生无延时队列，用多级延时 Topic + 转发服务（可配时间轮或 Redis ZSet）模拟。
- Key claims: 按固定延时等级建 `delay-1m` 等 Topic，Delay Service 到期转发到业务 Topic；轮询单条 Sleep 会队头阻塞，故需分级隔离；时间轮把定时任务降到 O(1)；高精度场景用 Redis ZSet 定 Score。
- Learner-relevant: 延时队列主题，与 RocketMQ 原生延时、RabbitMQ 死信 TTL 三者对比。

### Kafka/15.Kafka是基于推模式还是拉模式

- Locator: `[[sources/小哲讲八股/20260926/Kafka/15.Kafka是基于推模式还是拉模式.md#15.Kafka是基于推模式还是拉模式]]`
- Summary: Kafka Consumer 用 Pull，控制权在消费者，配合长轮询解决空轮询。
- Key claims: Push 无法感知消费者处理能力会压垮慢消费者；Pull 天然支持批量与按需消费，起到削峰填谷；长轮询把请求挂起一段时间，有新数据立即返回。
- Learner-relevant: 推拉模式主题，三产品共享的比较题。

### Kafka/高频热题

- Locator: `[[sources/小哲讲八股/20260926/Kafka/高频热题.md#高频热题 🔥🔥🔥🔥]]`
- Summary: Kafka 篇的面试高优先级题目索引，列出选型、不丢、重复、顺序、堆积五题。
- Key claims: 五篇高频题按热度排序并附原文链接。
- Learner-relevant: 复习优先级参考，用于确认哪些步骤需重点掌握。

### RabbitMQ/1.消息队列有什么作用

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/1.消息队列有什么作用.md#1.消息队列有什么作用]]`
- Summary: 与 Kafka/RocketMQ 篇内容一致的 MQ 三大作用：异步、解耦、削峰。
- Key claims: 异步缩短主链路耗时；解耦让上游不感知下游；削峰用 MQ 做蓄水池保护数据库。
- Learner-relevant: 三产品公共起点，便于横向对照。

### RabbitMQ/2.RabbitMQ的架构是怎样的

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/2.RabbitMQ的架构是怎样的.md#2.RabbitMQ的架构是怎样的]]`
- Summary: RabbitMQ 基于 AMQP，逻辑模型为 Producer→Exchange→（Binding/Routing Key）→Queue，讲 Channel、vhost 与集群模型。
- Key claims: 生产者只发 Exchange，不感知 Queue，无匹配 Queue 会丢弃或进死信；Channel 复用同一 TCP 连接做多路复用；集群默认只全量同步元数据，消息只在所属节点，需镜像队列保数据。
- Learner-relevant: RabbitMQ 全部主题的架构底座，突出与 Kafka 的「路由/存储分离」差异。

### RabbitMQ/3.如何保证消息不丢失

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/3.如何保证消息不丢失.md#3.如何保证消息不丢失]]`
- Summary: 按发送/存储/消费三阶段给全链路可靠性方案。
- Key claims: 发送用 Confirm + 重试、`mandatory=true` + ReturnListener 防路由失败；存储做 Exchange/Queue/Message 三层持久化（`delivery_mode=2`）+ 镜像队列；消费关 `autoAck` 改手动 `basicAck`。
- Learner-relevant: 可靠性主题，与 Kafka `acks`、RocketMQ 同步刷盘对照。

### RabbitMQ/4.如何避免消息的重复消费

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/4.如何避免消息的重复消费.md#4.如何避免消息的重复消费]]`
- Summary: 重复根因是 ACK 丢失导致重新入队，解法是消费端幂等（f(f(x))=f(x)）。
- Key claims: 每条消息需全局唯一 ID 供「查账」；数据库唯一键可在重复时抛 DuplicateKeyException 后直接 ACK；Redis SETNX 做前置校验但需数据库兜底。
- Learner-relevant: 幂等主题，三产品解法一致。

### RabbitMQ/5.如何保证消息顺序

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/5.如何保证消息顺序.md#5.如何保证消息顺序]]`
- Summary: RabbitMQ 只保证 Queue 内 FIFO，多消费者与 NACK 重入队会乱序，用「同源消息串行化」解决。
- Key claims: 乱序源于并行消费与重试重入队；简单方案单 Queue 单 Consumer 牺牲吞吐；推荐按 `Hash(OrderID)%N` 拆成 N 个 Queue 各自单线程消费。
- Learner-relevant: 顺序主题，与 Kafka 分区、RocketMQ MessageQueue 对照。

### RabbitMQ/6.如何解决消息堆积问题

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/6.如何解决消息堆积问题.md#6.如何解决消息堆积问题]]`
- Summary: RabbitMQ 内存存储、堆积会刷盘拖垮上游，讲临时队列分片应急与 Lazy Queues 兜底。
- Key claims: 简单加消费者常因队列锁/业务瓶颈无效；SOP 是停旧消费者、临时消费者轮询转发到 N 个 temp_queue、再 N 倍工作消费者并行消化；`x-queue-mode: lazy` 直接落盘抗数亿堆积。
- Learner-relevant: 堆积主题，突出 RabbitMQ「怕堆积」的短板。

### RabbitMQ/7.死信队列怎么理解

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/7.死信队列怎么理解.md#7.死信队列怎么理解]]`
- Summary: 死信队列本质是普通队列，通过 DLX 接收被拒/过期/超长的消息，并常用来实现延时队列。
- Key claims: 三种死信来源——`basic.reject/nack`（`requeue=false`）、TTL 过期、`x-max-length` 溢出；在业务队列声明 `x-dead-letter-exchange` 转发；无消费者 + TTL 队列配合 DLX 可实现延时投递。
- Learner-relevant: RabbitMQ 特有机制，是延时队列主题的关键依赖。

### RabbitMQ/8.RabbitMQ的事务消息怎么理解

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/8.RabbitMQ的事务消息怎么理解.md#8.RabbitMQ的事务消息怎么理解]]`
- Summary: 讲 AMQP 事务（`txSelect/txCommit/txRollback`）保证发送原子性，但因同步阻塞性能暴跌而被 Confirm 取代。
- Key claims: 事务同步串行、吞吐下降多个数量级；Confirm 异步回调 Ack，兼顾可靠与高性能，是生产主流，但批量时不保证严格原子性。
- Learner-relevant: 事务主题，注意与 RocketMQ 事务消息（半消息+回查）本质不同。

### RabbitMQ/9.RabbitMQ如何实现高可用

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/9.RabbitMQ如何实现高可用.md#9.RabbitMQ如何实现高可用]]`
- Summary: 从数据层（镜像队列/仲裁队列）与接入层（HAProxy + Keepalived VIP）两层面讲 RabbitMQ 高可用。
- Key claims: 原生集群只同步元数据，故需镜像队列做主从复制；仲裁队列基于 Raft，多数派落盘即成功，容错与写入更稳；HAProxy 做 TCP 负载 + Keepalived 虚拟 IP 防接入单点。
- Learner-relevant: 高可用主题，与 Kafka ISR/KRaft、RocketMQ Dledger 对照。

### RabbitMQ/10.RabbitMQ是拉模式还是推模式

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/10.RabbitMQ是拉模式还是推模式.md#10.RabbitMQ是拉模式还是推模式]]`
- Summary: RabbitMQ 同时支持推（`basic.consume`）与拉（`basic.get`），生产常用推 + QoS 背压。
- Key claims: 推模式实时低延迟但需 `prefetch_count` 限流防压垮消费者；拉模式一问一答、轮询开销大且延迟高，仅适合低频脚本。
- Learner-relevant: 推拉主题，与 Kafka/RocketMQ 的 Pull+长轮询形成对照。

### RabbitMQ/高频热题

- Locator: `[[sources/小哲讲八股/20260926/RabbitMQ/高频热题.md#高频热题 🔥🔥🔥🔥]]`
- Summary: RabbitMQ 篇面试高优先级题目索引，列出作用、不丢、重复、顺序、死信五题。
- Key claims: 五篇高频题按热度排序并附原文链接。
- Learner-relevant: 复习优先级参考。

### RocketMQ/1.消息队列有什么作用

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/1.消息队列有什么作用.md#1.消息队列有什么作用]]`
- Summary: 与 Kafka/RabbitMQ 篇内容一致的 MQ 三大作用：异步、解耦、削峰。
- Key claims: 异步剥离非核心链路缩短 RT；解耦断掉上下游强依赖；削峰把瞬时流量拦在 MQ 中平滑消费。
- Learner-relevant: 三产品公共起点。

### RocketMQ/2.RocketMQ的架构是怎么样的

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/2.RocketMQ的架构是怎么样的.md#2.RocketMQ的架构是怎么样的]]`
- Summary: 讲 NameServer/Broker/Producer/Consumer 四组件与 CommitLog + ConsumeQueue 存储、MessageQueue 消费模型。
- Key claims: NameServer 无状态、节点不通信、最终一致，极度稳定；CommitLog 全 Topic 混写顺序落盘，ConsumeQueue 存 Offset 索引，故抗万级 Topic；Broker 分 Master/Slave，新版 DLedger 基于 Raft 自动选举。
- Learner-relevant: RocketMQ 全部后续主题的架构底座。

### RocketMQ/3.RocketMQ是如何保证消息不丢失的

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/3.RocketMQ是如何保证消息不丢失的.md#3.RocketMQ是如何保证消息不丢失的]]`
- Summary: 按生产（同步发送 + 重试 + 事务消息）、存储（同步刷盘 + 同步复制）、消费（先业务后 Offset + 重试死信）三阶段保证可靠。
- Key claims: `flushDiskType=SYNC_FLUSH` 才真落盘；`brokerRole=SYNC_MASTER` 主从都写成功才回 ACK；消费失败默认 16 次梯度重试后进死信。
- Learner-relevant: 可靠性主题，与 Kafka/RabbitMQ 同名题对照。

### RocketMQ/4.如何避免消息的重复消费

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/4.如何避免消息的重复消费.md#4.如何避免消息的重复消费]]`
- Summary: 重复来自发送端重试与消费端负载均衡，RocketMQ 不保证不重发，靠消费端幂等。
- Key claims: Message ID 在重试场景会变，故应用 `msg.getKeys()` 业务唯一键；手段含数据库唯一索引、Redis SETNX、状态机 `WHERE status='UNPAID'` 条件更新。
- Learner-relevant: 幂等主题，强调「业务唯一键优于 Message ID」。

### RocketMQ/5.如何保证消息顺序

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/5.如何保证消息顺序.md#5.如何保证消息顺序]]`
- Summary: 区分全局顺序（不实用）与局部/分区顺序，讲发送、存储、消费三环节协同。
- Key claims: 发送用 `MessageQueueSelector` 按业务 ID Hash 入同队列；Broker 同 Queue 天然 FIFO；消费用 `MessageListenerOrderly`，先取队列分布式锁再本地锁单线程处理。
- Learner-relevant: 顺序主题，分布式锁 + 本地锁是其独有设计点。

### RocketMQ/6.如何避免消息丢失问题

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/6.如何避免消息丢失问题.md#6.如何避免消息丢失问题]]`
- Summary: 从消息生命周期三阶段讲丢失点与兜底，内容与文件 3 高度重叠。
- Key claims: 发送同步 + 回调确认（`SEND_OK`）；存储同步刷盘 + 多机冗余；消费先消费后确认、宕机则重投。
- Learner-relevant: 文件 3 的复述，可作可靠性主题的复习对照。

### RocketMQ/7.如何理解RocketMQ的事务消息

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/7.如何理解RocketMQ的事务消息.md#7.如何理解RocketMQ的事务消息]]`
- Summary: 讲两阶段提交 + 补偿机制：半消息、执行本地事务、Commit/Rollback，以及事务回查。
- Key claims: 半消息存内部 Topic `RMQ_SYS_TRANS_HALF_TOPIC` 对消费者不可见；Broker 定时（默认 60s）回查生产者确认事务状态；保证本地事务与消息发送最终一致。
- Learner-relevant: 分布式事务主题，与 RabbitMQ 事务模式形成本质对比。

### RocketMQ/8.RocketMQ有几种集群方式

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/8.RocketMQ有几种集群方式.md#8.RocketMQ有几种集群方式]]`
- Summary: 讲单 Master、多 Master、多 Master 多 Slave（异步复制/同步双写）、Dledger 四种集群及取舍。
- Key claims: 单 Master 严禁生产；多 Master 性能最高但故障消息暂时不可消费；主从异步复制有丢数据风险、同步双写零丢失但约 10% 性能损耗；主从均不支持自动故障转移，Dledger 基于 Raft 才能秒级切换。
- Learner-relevant: 高可用主题，Dledger 与 Kafka KRaft、RabbitMQ 仲裁队列对照。

### RocketMQ/9.RocketMQ是拉模式还是推模式

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/9.RocketMQ是拉模式还是推模式.md#9.RocketMQ是拉模式还是推模式]]`
- Summary: RocketMQ 本质是拉模式，`PushConsumer` 只是长轮询包装出的「伪推送」。
- Key claims: 纯 Push 无法感知消费者能力易压垮下游；长轮询在无消息时挂起请求、有新消息或超时再返回；兼得背压与低延迟。
- Learner-relevant: 推拉主题，与 Kafka 长轮询几乎同构。

### RocketMQ/高频热题

- Locator: `[[sources/小哲讲八股/20260926/RocketMQ/高频热题.md#高频热题 🔥🔥🔥🔥]]`
- Summary: RocketMQ 篇面试高优先级题目索引，列出作用、不丢、重复、顺序、丢失、事务六题。
- Key claims: 六篇高频题按热度排序并附原文链接。
- Learner-relevant: 复习优先级参考。
