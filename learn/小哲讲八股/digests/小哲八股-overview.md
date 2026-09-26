---
source: 小哲八股-总览与学习路线
source_type: codebase
source_lines: 1573
language: markdown
file_count: 5
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — 小哲讲八股（总览与学习路线）

## Overview (L1)

- **index.md** — 全站目录：Java 面试题（Java基础/集合/JVM/JUC/Spring_SpringBoot/SpringCloud/Mybatis/DDD/系统设计题）、Redis、MySQL、Agent开发（大模型基础/提示词工程/RAG/SKILL/模型推理&性能优化/LLM架构/其他/SpringAI）、Kafka、RabbitMQ、RocketMQ、zookeeper、RPC、ElasticSearch、分布式场景题、操作系统、计算机网络，逐题链接。
- **学习路线/速通版（1-2周，应急）** — 面试临近时的高频核心题清单：Java基础+集合+JVM+JUC、Spring、MySQL、Redis、MQ、网络、OS、AI 各挑高频题。
- **学习路线/标准版（1个月）** — 完整过一遍所有模块、重点模块深入，含每模块推荐题单与时长分配。
- **学习路线/完整版（2个月+）** — 面向中大厂深度备战：全部题目 + 系统设计 + 编程题 + DDD，含时长表。
- **观看视频方式.md** — 课程视频平台与购课看课方式说明（抖音/视频号/小红书/快手、电脑与 App、投屏），非技术内容。

## Sections (L2)

### index.md（全站总目录）

- Locator: `[[sources/小哲讲八股/20260926/index.md#小哲讲八股2]]`
- Summary: 课程的全部题目标题目录，按「Java面试题 / Redis / MySQL / Agent开发 / Kafka / RabbitMQ / RocketMQ / zookeeper / RPC / ElasticSearch / 分布式场景题 / 操作系统 / 计算机网络」分节；每节按子模块列出所有题目文件。
- Key claims: 需要掌握的主题集合是「Java 基础/集合/JVM/JUC/Spring 全家桶/MyBatis/DDD + MySQL + Redis + 消息队列（Kafka/RabbitMQ/RocketMQ）+ 分布式（CAP/BASE/分布式锁/ID/事务）+ ZK/RPC/ES + 操作系统 + 计算机网络 + AI/大模型（基础、提示词、RAG、LLM 架构、SpringAI）」；这是中国大陆后端/Java 岗面试的典型八股范围。
- Learner-relevant: 作为 `roadmap` 的主题清单与边界；决定 node 如何按模块分区。

### 学习路线/速通版（1-2周，面试临近/应急）

- Locator: `[[sources/小哲讲八股/20260926/学习路线/速通版（1-2周，面试临近_应急）.md#速通版（1-2周，面试临近/应急）]]`
- Summary: 时间紧迫时的最小题单，只覆盖各模块最常考的题；末尾给出每模块 1-3 天的时长分配。
- Key claims: 面试最高频集中在集合（HashMap/ConcurrentHashMap）、JVM（内存区/类加载/GC）、JUC（线程池/synchronized/volatile/CAS）、Spring（IOC/Bean 生命周期/循环依赖/AOP/事务）、MySQL（B+树/回表/最左前缀/索引失效/ACID/隔离级别/MVCC/锁/WAL）、Redis（性能/数据结构/持久化/缓存三兄弟/一致性/分布式锁）、TCP（握手挥手/可靠性）、OS（进程线程协程/虚拟内存/IO 多路复用）。
- Learner-relevant: 若学习者的目标是「临近面试应急」，roadmap 应按此路线排序并压缩低频模块。

### 学习路线/标准版（1个月，正常备战节奏）

- Locator: `[[sources/小哲讲八股/20260926/学习路线/标准版（1个月，正常备战节奏）.md#标准版（1个月，正常备战节奏）]]`
- Summary: 一个月完整过一遍所有模块、重点模块深入的题单，含每模块时长（Java 核心 1 周、Spring 3 天、MySQL 1 周、Redis 4 天、MQ 3 天、网络+OS 1 周、分布式 3 天、AI 2 天）。
- Key claims: 相比速通版补上了 SpringCloud、MyBatis、JVM 调优、MySQL 复制/主从、Redis 集群/热 key、分布式理论等；AI 模块完整展开（大模型基础/提示词/RAG/推理优化/LLM 架构）。
- Learner-relevant: 默认路线模板；roadmap 可据此分 tier（基础 → 存储 → 中间件 → 分布式 → 系统 → AI）。

### 学习路线/完整版（2个月+）

- Locator: `[[sources/小哲讲八股/20260926/学习路线/完整版（2个月+）.md#完整版（2个月+）]]`
- Summary: 面向中大厂的完整题单：所有模块全部题目 + 系统设计题（16 题）+ DDD + JUC 手写编程题 + 更深的 SQL/JVM/Redis 细节。
- Key claims: 完整版额外包含 JUC 手写题（生产者消费者/DCL/交替打印/死锁）、系统设计题、DDD、ElasticSearch、RPC 序列化、分布式事务 TCC/Seata 等；时长 2 个月+。
- Learner-relevant: 若目标是中大厂，roadmap 应包含系统设计题与 DDD 作为高阶节点。

### 观看视频方式.md

- Locator: `[[sources/小哲讲八股/20260926/观看视频方式.md#🌟🌟🌟🌟观看视频方式]]`
- Summary: 课程视频在抖音/视频号/小红书/快手等平台购课后的看课、投屏、电脑与 App 登录方式说明。
- Key claims: 与知识内容无关，仅为课程交付渠道说明。
- Learner-relevant: 可忽略，不进入学习图。
