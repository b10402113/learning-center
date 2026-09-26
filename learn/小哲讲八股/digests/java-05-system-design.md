---
source: 小哲八股-系统设计题
source_type: codebase
source_lines: 1038
language: markdown
file_count: 16
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — 系统设计题（Java面试）

## Overview (L1)

- **缓存与一致性** — URL 短链、朋友圈点赞、多级缓存三题都围绕 Redis 热点数据与冷热分离；核心难点是本地缓存 L1 与分布式缓存 L2 的一致性（MQ 广播/PubSub 清 Key）。
- **秒杀 / 限流 / 高并发写** — 双十一秒杀、分布式精确限流、1 元拍卖、订单超时取消，共用同一套套路：Redis+Lua 原子预减、MQ 削峰、数据库兜底。
- **Feed / 社交 / 榜单** — Feed 流读写扩散、点赞冷热分离、积分实时排行榜、购物车，考察推拉权衡与时间轴分级存储。
- **基础设施 / 去重与分布式能力** — 分布式爬虫、10 亿 URL 判重、分布式日志、百万 Excel 导入，核心工具是布隆过滤器、分治分片、Kafka。
- **可用性** — 单点问题与冗余，扫码登录的长轮询状态机，考察无状态应用层负载均衡与数据层主从+故障转移。

## Sections (L2)

### 1.设计一个URL短链接系统

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/1.设计一个URL短链接系统.md#二、 针对追问的深度解析]]`
- Summary: 长 URL → 唯一 ID → Base62 短码，读取时 302 跳转；百亿级用分库分表+NoSQL，热点短码进 Redis。
- Key claims: 推荐分布式 ID 发号器（雪花/Redis INCR 号段）而非 MD5 截断；302 保留点击统计，301 丢失；6 位 Base62 ≈ 568 亿容量。
- Learner-relevant: ID 生成、Base62 编码、K-V 存储选型、读多写少缓存策略。

### 2.如何在分布式环境下实现精确限流

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/2.如何在分布式环境下实现精确限流.md#二、 两种主流的“精确”实现方案]]`
- Summary: 单机限流管不住全局，必须收敛计数到 Redis；ZSet 滑动窗口极致精确但费内存，Lua 令牌桶是生产通用解。
- Key claims: Lua 脚本保证“读令牌+扣令牌”原子；时间基准应取 Redis 时间；Redis 宕机需本地降级兜底。
- Learner-relevant: 限流算法族（固定/滑动窗口、令牌桶）、原子性、降级设计。

### 3.设计一个分布式的网页爬虫系统

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/3.设计一个分布式的网页爬虫系统.md#二、 关键技术追问解析]]`
- Summary: 调度中心+下载器+解析器+去重+存储五组件用 Redis/Kafka 解耦；去重用布隆过滤器，礼貌爬取靠域名队列隔离与延时。
- Key claims: 布隆过滤器只存位数组、允许误判换空间；每个域名一个子队列并遵循“上次访问+延时阈值”。
- Learner-relevant: 生产者消费者解耦、布隆过滤器、限速与反爬伦理。

### 4.设计一个游戏积分实时排行榜

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/4.设计一个游戏积分实时排行榜.md#追问二：如果用户量达到亿级，单机 Redis 存不下怎么办？]]`
- Summary: 千万级直接用 Redis ZSet；亿级用 Hash 分片（UserID%N）+ 归并排序取全局 Top N；多时间维度用 key 后缀+写扩散。
- Key claims: ZSet 底层是 HashMap+跳表，ZADD/ZRANGE 均 O(log N)；周/月/总榜分 Key 异步更新并配 EXPIRE 管理生命周期。
- Learner-relevant: 跳表原理、分治/分片、缓存 Key 设计与过期策略。

### 5.设计一个类似微博或朋友圈的Feed流系统

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/5.设计一个类似微博或朋友圈的Feed流系统.md#追问一：什么是推模式与拉模式？]]`
- Summary: Feed 本质是读写扩散权衡——推模式写扩散读快，适合朋友圈；拉模式读扩散写快，适合微博；大 V 用推拉结合。
- Key claims: 大 V 超过阈值（如 50 万粉）只写发件箱，粉丝刷新时读端聚合合并；进阶为在线推、离线拉。
- Learner-relevant: 写扩散/读扩散、热点大 V 处理、缓存击穿预防。

### 6.描述PC端微信扫码登录的完整交互流程

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/6.描述PC端微信扫码登录的完整交互流程.md#一、 完整交互流程]]`
- Summary: PC 拿 UUID 生成二维码并长轮询；手机扫码后服务端绑定 UUID↔UserToken；确认后发一次性 Ticket，PC 换 Session。
- Key claims: 长轮询优于短轮询与 WebSocket（低频场景、兼容性好、服务端挂起~25s）；Ticket 必须一次性防重放。
- Learner-relevant: 状态机、长轮询、Redis 存 UUID 状态、一次性凭证安全。

### 7.设计一个双十一秒杀系统

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/7.设计一个双十一秒杀系统.md#二、 面试追问]]`
- Summary: 三层漏斗 CDN→Redis→MQ→DB；库存预热进 Redis，Lua 原子预减，只有抢到名额的请求才异步落库。
- Key claims: 防超卖：Redis Lua 预减 + SQL `stock > 0` 行锁兜底；防脚本用动态 Path 两段式；MQ 削峰填谷+业务解耦。
- Learner-relevant: 高并发漏斗、超卖与幂等、削峰、前端防抖。

### 8.订单下单30分钟未支付自动取消如何实现

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/8.订单下单30分钟未支付自动取消如何实现.md#利用 Redis 实现]]`
- Summary: 摒弃 DB 定时轮询，改用事件驱动：Redis ZSet 延迟队列、RabbitMQ 死信队列/延迟插件、单机时间轮算法。
- Key claims: ZSet 以“执行时间戳”为 score，ZRANGEBYSCORE 取到期任务并 ZREM 后执行；RabbitMQ 用 TTL+DLX 曲线实现延迟。
- Learner-relevant: 延迟任务方案对比、时间戳队列、消息中间件高级特性。

### 9.设计购物车功能

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/9.设计购物车功能.md#二、 Redis 数据结构设计]]`
- Summary: “Redis 为主、DB 为辅”混合存储；未登录用临时 UUID，登录瞬间合并，Redis 用 Hash 存 SKU。
- Key claims: 登录时按 SKU 合并数量；购物车不锁库存，下单才扣；结算必须查实时价格；需限制商品种类上限。
- Learner-relevant: 登录态合并、Hash 结构、价格/库存一致性时机。

### 10.设计朋友圈点赞功能

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/10.设计朋友圈点赞功能.md#一、基于“时间轴”的冷热分离]]`
- Summary: “冷热分离+时间轴分级存储”：7 天内热动态点赞存 Redis ZSet 并设 TTL，历史全量落 MySQL/HBase，按发布时间路由查询。
- Key claims: Redis Key 必须设 EXPIRE 控制内存水位；写流程先 Redis 后 MQ 落库；读时共同好友用内存交集过滤。
- Learner-relevant: 冷热分离、TTL 内存控制、异步持久化、集合交集。

### 11.现有10亿条url，再额外提供若干条url，如何快速判断是否存在于这10亿条url中？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/11.现有10亿条url，再额外提供若干条url，如何快速判断是否存在于这10亿条url中？.md#一、 核心方案：布隆过滤器]]`
- Summary: 内存受限（60GB+）无法 HashMap；标准解是布隆过滤器，1% 误判率下约需 1.2~1.5GB；零误判则走分治分片。
- Key claims: 布隆只会误判“存在”不会误判“不存在”，且不支持删除；分治按 `Hash % N` 切片到多节点精确查找。
- Learner-relevant: 布隆过滤器原理与内存估算、分治思想、精确 vs 近似权衡。

### 12.设计双十一促销1元拍卖特斯拉的功能

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/12.设计双十一促销1元拍卖特斯拉的功能.md#三、 性能优化]]`
- Summary: 瓶颈在写，竞价全在 Redis 用 Lua 原子完成，MySQL 只归档；价格更新用 WebSocket 广播。
- Key claims: Lua 内校验 `bidPrice > max_price + step` 才更新，无需分布式锁；出价成功发 MQ 异步落 `bid_log`；WebSocket/Netty 推送实时价。
- Learner-relevant: 并发写热点、Lua 原子性、MQ 异步落库、实时推送。

### 13.设计一个高性能的分布式日志系统

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/13.设计一个高性能的分布式日志系统.md#二、 关键模块详细设计]]`
- Summary: 数据流水线：采集 Agent（Sidecar 异步写盘）→ Kafka 缓冲削峰 → 清洗 → Elasticsearch 索引 → Kibana/Grafana 展示。
- Key claims: 采集忌业务代码直接 HTTP 上报，应物理隔离；ES 靠倒排索引强于全文检索但写入与磁盘膨胀是瓶颈；冷热分离。
- Learner-relevant: 日志采集架构、Kafka 削峰解耦、倒排索引、冷热分层存储。

### 14.实现百万级数据从Excel导入到数据库

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/14.实现百万级数据从Excel导入到数据库.md#二、 详细落地步骤]]`
- Summary: 读用 EasyExcel（SAX 流式）避免 OOM，写用批量合并+`rewriteBatchedStatements=true`，再异步化与部分成功。
- Key claims: 攒够 1000 条批量插入把网络 IO 从 100 万降到 1000 次；错误数据记日志/返回 Excel，不全事务回滚。
- Learner-relevant: 流式解析、JDBC 批处理、异步任务、容错与部分成功。

### 15.什么是单点问题？如何解决？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/15.什么是单点问题？如何解决？.md#二、 面试标准回答]]`
- Summary: 单点即无备份组件故障导致整体不可用；解决方针是“冗余”，应用层多机+负载均衡，数据层主从复制+自动故障转移。
- Key claims: 应用层无状态可水平扩展，LB 自动剔除故障节点；MySQL 一主多从自动选主，Redis 用 Sentinel 监控选主。
- Learner-relevant: 高可用基础、无状态设计、主从与故障转移。

### 16.如何设计多级缓存架构

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/系统设计题/16.如何设计多级缓存架构.md#二、 关键读写流程与一致性难题]]`
- Summary: L1 本地 Caffeine + L2 Redis 双层；读取逐级回填，难点是数据变更时上百台机器的 L1 一致性。
- Key claims: 变更时先更新 DB 再删 Redis，并用 MQ 广播/PubSub 通知所有节点清 Caffeine；本地缓存的根本价值是抗热 Key、保护 Redis 网卡。
- Learner-relevant: 多级缓存、缓存一致性、热 Key 治理、回填策略。
