---
source: 小哲八股-MySQL
source_type: codebase
source_lines: 2980
language: markdown
file_count: 51
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — MySQL

## Overview (L1)

- 学习地图与高频题 — 导学用“磁盘 I/O 决定论”串起四大模块，热题清单给出面试必问索引、事务、日志、MVCC。
- 架构与存储引擎 — 逻辑架构的 Server/引擎分层、一条 SQL 的执行链路，以及 InnoDB 与 MyISAM 在事务、锁、索引结构（聚簇/非聚簇）上的本质差别。
- 索引与数据结构 — B+ 树的选型理由、树高与磁盘 I/O、回表与覆盖索引、联合索引最左前缀、索引失效、索引下推、字段选型与深分页。
- SQL 优化与执行计划 — EXPLAIN 关键字段解读、rows 的采样统计、慢 SQL 三步分析法，以及“走了索引仍慢”的成因；join/小表驱动与分库分表。
- 事务、MVCC 与锁 — ACID 实现、隔离级别与脏读/不可重复读/幻读、MVCC 版本链与 ReadView、行/表/间隙/临键锁与死锁、乐观锁。
- 日志与写入链路 — Redo/Undo/Binlog 分工、WAL 与两阶段提交、Buffer Pool 与 Change Buffer、页分裂与页合并。
- 复制与架构扩展 — 主从复制三线程模型、异步/半同步/全同步、主从延迟及解决方案、CPU 飙升排查。
- 存储选型杂项 — char/varchar、数据库范式、能否存图片/JSON 与 MongoDB 的取舍对比。

## Sections (L2)

### MySQL数据库导学
- Locator: `[[sources/小哲讲八股/20260926/MySQL/MySQL数据库导学.md#MySQL数据库导学]]`
- Summary: 面试导论，说明为何 MySQL 是后端面试重点，并给出四大知识维度与“磁盘 I/O 决定论”的推导式学习法。
- Key claims: 数据库是系统最脆弱且最难扩展的瓶颈，一条慢 SQL 可拖垮集群；复习框架为索引结构、事务与锁、日志、性能调优；一切设计都在减少磁盘 I/O。
- Learner-relevant: 为整个 MySQL 课程提供总览锚点与“权衡/推导”而非背诵的学习姿态。

### 高频热题
- Locator: `[[sources/小哲讲八股/20260926/MySQL/高频热题.md#高频热题 🔥🔥🔥🔥]]`
- Summary: 列出 14 道最高频面试题及其语雀原文链接，是复习优先级清单。
- Key claims: 最高频集中在逻辑架构、InnoDB/MyISAM、B+ 树选型、回表、最左前缀、索引失效、索引下推、多表 join、ACID、Redo/Undo、隔离级别、脏读/幻读、MVCC。
- Learner-relevant: 可当作节点覆盖度自检清单，确认各考点都有对应 step。

### 1.请简述 MySQL 的逻辑架构。Server 层和存储引擎层分别负责什么？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/1.请简述MySQL的逻辑架构。Server层和存储引擎层分别负责什么？.md#1.请简述 MySQL 的逻辑架构。Server 层和存储引擎层分别负责什么？]]`
- Summary: 用“脑手分离”解释 Server 层（连接器/分析器/优化器/执行器）与插件式存储引擎层的职责划分。
- Key claims: Server 层处理跨引擎的 SQL 逻辑与内置函数、存储过程、视图；引擎层只负责数据存取并通过标准 API 与 Server 通信。
- Learner-relevant: 支撑“MySQL 整体架构”这一最底层锚点，是理解后续执行流程的前提。

### 2.一条 SQL 语句从客户端发出到最终返回结果,经历了哪些过程
- Locator: `[[sources/小哲讲八股/20260926/MySQL/2.一条SQL语句从客户端发出到最终返回结果,经历了哪些过程.md#2.一条 SQL 语句从客户端发出到最终返回结果,经历了哪些过程]]`
- Summary: 按六关卡（连接器→查询缓存→分析器→优化器→执行器→存储引擎）拆解一条 SQL 的完整生命周期。
- Key claims: 查询缓存因失效频繁已在 MySQL 8.0 移除；优化器基于成本生成执行计划；执行器在执行前还要做一次权限校验。
- Learner-relevant: 将架构名词串成一条可复述的执行链路，是解释“SQL 怎么跑”的模板。

### 3.InnoDB和MyISAM的主要区别是什么
- Locator: `[[sources/小哲讲八股/20260926/MySQL/3.InnoDB和MyISAM的主要区别是什么.md#3.InnoDB 和 MyISAM 的主要区别是什么]]`
- Summary: 从事务、锁粒度、索引结构、外键、COUNT(*) 五个维度对比 InnoDB 与 MyISAM。
- Key claims: InnoDB 支持 ACID 事务与行级锁并采用聚簇索引；MyISAM 无事务、表级锁、非聚簇索引，但 COUNT(*) 为 O(1)。
- Learner-relevant: 建立存储引擎选型的基本判断，并引出聚簇/非聚簇与回表话题。

### 4.在什么特殊的业务场景下你依然会考虑使用MyISAM
- Locator: `[[sources/小哲讲八股/20260926/MySQL/4.在什么特殊的业务场景下你依然会考虑使用MyISAM.md#4.在什么特殊的业务场景下你依然会考虑使用 MyISAM]]`
- Summary: 说明 MyISAM 仅剩的三种极端适用场景，总体不推荐新项目使用。
- Key claims: 依赖 COUNT(*) O(1) 的统计、一次写入永不修改的归档只读表、硬件资源极受限环境；MyISAM 磁盘占用更小、只缓存索引。
- Learner-relevant: 反向巩固 InnoDB 默认地位，理解功能与资源开销的权衡。

### 5.MyISAM和InnoDB在索引存储结构上有什么本质区别
- Locator: `[[sources/小哲讲八股/20260926/MySQL/5.MyISAM和InnoDB在索引存储结构上有什么本质区别.md#5.MyISAM和InnoDB在索引存储结构上有什么本质区别]]`
- Summary: 对比聚簇索引与非聚簇索引：数据行到底存在哪里，以及辅助索引分别存主键还是物理地址。
- Key claims: InnoDB 主键叶子存完整行、辅助索引存主键值；MyISAM 索引与数据文件（.MYI/.MYD）分离，主键与辅助索引都存物理地址。
- Learner-relevant: 这是理解回表、覆盖索引与页分裂的根节点。

### 6.为什么MySQL使用B+树作为索引结构，而不是B树、哈希表红黑树或二叉搜索树？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/6.为什么MySQL使用B+树作为索引结构，而不是B树、哈希表红黑树或二叉搜索树？.md#6.为什么 MySQL 使用 B+ 树作为索引结构，而不是 B 树、哈希表红黑树或二叉搜索树？]]`
- Summary: 以“IO 友好”为主线，逐一淘汰二叉树、Hash、B 树，论证 B+ 树的优势。
- Key claims: 二叉树太高导致 I/O 多；Hash 不支持范围查询与排序；B+ 树非叶子不存数据使树更矮，叶子双向链表利于顺序扫描。
- Learner-relevant: 索引数据结构选型的核心论证，是树高、回表等话题的起点。

### 7.在生产环境中B+树的高度通常是多少？这通过几次磁盘IO就能找到数据？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/7.在生产环境中B+树的高度通常是多少？这通过几次磁盘IO就能找到数据？.md#7.在生产环境中B+ 树的高度通常是多少？这通过几次磁盘 IO 就能找到数据？]]`
- Summary: 用 16KB 页、BigInt 主键、1KB 行大小的假设，按容量反推 B+ 树高度与磁盘 I/O 次数。
- Key claims: 非叶子页约 1170 个索引、叶子页约 16 行；3 层约 2000 万行，4 层约 200 亿行；根节点常驻内存，实际物理 I/O 常为 1 次甚至 0 次。
- Learner-relevant: 把抽象的树高落到可计算的数字，支撑“为什么快”的定量解释。

### 8.如果表没有主键，InnoDB会如何处理
- Locator: `[[sources/小哲讲八股/20260926/MySQL/8.如果表没有主键，InnoDB会如何处理.md#8.如果表没有主键，InnoDB 会如何处理]]`
- Summary: 解释 InnoDB 作为索引组织表必须有主键，以及无显式主键时的“三级替补”规则。
- Key claims: 优先用户主键，其次第一个非空唯一索引，最后自动生成 6 字节隐藏 ROWID；全局计数器在高并发插入下可能成为瓶颈。
- Learner-relevant: 支撑“必须显式定义自增主键”的工程规范与索引组织表概念。

### 9.什么是回表操作？如何通过覆盖索引CoveringIndex来避免回表？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/9.什么是回表操作？如何通过覆盖索引CoveringIndex来避免回表？.md#9.什么是回表操作？如何通过覆盖索引Covering Index来避免回表？]]`
- Summary: 定义回表（辅助索引拿主键再查聚簇索引），并说明覆盖索引如何避免第二趟查找。
- Key claims: 回表产生额外随机 I/O 与 CPU；覆盖索引不是索引类型而是“查询所需列全在索引中”的状态；把查询列建进联合索引即可实现。
- Learner-relevant: 性能优化的高频锚点，连接索引设计、ICP 与深分页优化。

### 10.为什么建议使用自增ID作为主键，而不推荐使用UUID？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/10.为什么建议使用自增ID作为主键，而不推荐使用UUID？.md#10.为什么建议使用自增 ID 作为主键，而不推荐使用 UUID？]]`
- Summary: 从 B+ 树写入特性与存储空间解释自增 ID 优于 UUID，并给出雪花算法的分布式适用场景。
- Key claims: 自增 ID 顺序追加、几乎无页分裂且仅 8 字节；UUID 无序导致页分裂和随机 I/O，且 32 字节膨胀所有辅助索引。
- Learner-relevant: 直接支撑页分裂/页合并与主键选型，是分布式 ID 话题的切入点。

### 11.解释最左前缀匹配原则
- Locator: `[[sources/小哲讲八股/20260926/MySQL/11.解释最左前缀匹配原则.md#11.解释最左前缀匹配原则]]`
- Summary: 用电话簿类比解释联合索引的最左前缀规则及三种匹配行为。
- Key claims: 不能跳过第一列也不能跳过中间列；范围查询会使后续列停止匹配；原因是 B+ 树多级排序下断裂处之后无序。
- Learner-relevant: 联合索引设计的核心规则，是索引失效与 key_len 分析的基础。

### 12.索引abc查询WHEREb=1会走索引吗WHEREa=1ANDc=1呢
- Locator: `[[sources/小哲讲八股/20260926/MySQL/12.索引abc查询WHEREb=1会走索引吗WHEREa=1ANDc=1呢.md#12.索引 a b c查询 WHERE b=1 会走索引吗WHERE a=1 AND c=1 呢]]`
- Summary: 针对联合索引 (a,b,c) 的两种典型查询给出是否走索引的实战判断。
- Key claims: WHERE b=1 完全不走索引（全表扫描，除非覆盖索引全索引扫描）；WHERE a=1 AND c=1 只命中 a，c 仅作过滤（ICP 可减少回表）。
- Learner-relevant: 最左前缀原则的习题化应用，澄清覆盖索引下的特殊情况。

### 13.哪些操作会导致索引失效
- Locator: `[[sources/小哲讲八股/20260926/MySQL/13.哪些操作会导致索引失效.md#13.哪些操作会导致索引失效]]`
- Summary: 归纳索引失效的“三大忌”（列运算/函数、前置 %、隐式类型转换）与“两个坑”（违反最左前缀、OR）。
- Key claims: 列被加工会使 B+ 树无法二分；隐式类型转换最隐蔽；OR 一侧无索引通常导致全表扫描；优化器可能因成本主动弃用索引。
- Learner-relevant: 慢 SQL 排查的主要病因清单，配合 EXPLAIN 使用。

### 14.什么是索引下推
- Locator: `[[sources/小哲讲八股/20260926/MySQL/14.什么是索引下推.md#14.什么是索引下推]]`
- Summary: 解释 MySQL 5.6 引入的 ICP：把部分过滤下沉到存储引擎层，减少回表。
- Key claims: 索引中已包含的列可在引擎层先判断过滤；示例中回表从 100 次降到 2 次；不改变索引排序规则。
- Learner-relevant: 覆盖索引之外的又一个减少回表的优化，衔接第 9、12 条。

### 15.char和varchar的区别？如何选择
- Locator: `[[sources/小哲讲八股/20260926/MySQL/15.char和varchar的区别？如何选择.md#15.char和varchar的区别？如何选择]]`
- Summary: 对比定长 CHAR 与变长 VARCHAR 的存储方式、尾部空格处理、长度上限与选型原则。
- Key claims: CHAR 空间换时间且会去除尾部空格；VARCHAR 额外 1-2 字节存长度、保留空格，频繁变长更新易产生碎片；固定短字段用 CHAR。
- Learner-relevant: 表结构设计的基础字段选型，影响行大小与缓存命中。

### 16.什么是数据库范式
- Locator: `[[sources/小哲讲八股/20260926/MySQL/16.什么是数据库范式.md#16.什么是数据库范式]]`
- Summary: 介绍 1NF/2NF/3NF 的目标与反例，并说明互联网场景的反范式实践。
- Key claims: 1NF 列原子性、2NF 消除部分依赖、3NF 消除传递依赖；完全规范化导致多表 JOIN，常用冗余字段换查询性能。
- Learner-relevant: 表设计的理论背景，与“禁止多表 join”形成张力，可作对比锚点。

### 17.为什么阿里开发手册不建议使用多表join
- Locator: `[[sources/小哲讲八股/20260926/MySQL/17.为什么阿里开发手册不建议使用多表join.md#17.为什么阿里开发手册不建议使用多表join]]`
- Summary: 从性能、分库分表架构、资源转移三个维度解释大厂为何禁用多表 JOIN。
- Key claims: NLJ 嵌套循环在无索引/大表下呈指数级扫描；分库后无法跨库 JOIN；把计算从稀缺的 DB 转移到可横向扩展的应用层。
- Learner-relevant: 连接算法与分布式架构约束的交叉点，衔接小表驱动大表与分库分表。

### 18.哪些字段适合建立索引
- Locator: `[[sources/小哲讲八股/20260926/MySQL/18.哪些字段适合建立索引.md#18.哪些字段适合建立索引]]`
- Summary: 给出建索引的八字原则“高频查询，高区分度”与五类优先字段及三类避免字段。
- Key claims: 唯一性字段、WHERE/JOIN 字段、ORDER BY/GROUP BY 字段、长字符串前缀索引；避免低区分度、更新频繁、过长的字段。
- Learner-relevant: 从查询模式反推索引设计的实践准则，衔接基数/区分度与 Filesort。

### 19.深分页有什么问题如何优化
- Locator: `[[sources/小哲讲八股/20260926/MySQL/19.深分页有什么问题如何优化.md#19.深分页有什么问题如何优化]]`
- Summary: 解释 LIMIT offset 的“读出再丢弃”缺陷并给出三种优化方案。
- Key claims: 偏移越大回表越多；覆盖索引+延迟关联子查询、游标法（WHERE id > last_id，O(1) 但不支持跳页）、业务限制或 ElasticSearch。
- Learner-relevant: 回表与索引覆盖的实战综合题，常见于高性能分页场景。

### 20.MySQL中如何分析SQL语句的执行计划
- Locator: `[[sources/小哲讲八股/20260926/MySQL/20.MySQL中如何分析SQL语句的执行计划.md#20.MySQL中如何分析SQL语句的执行计划]]`
- Summary: 讲解 EXPLAIN 五大核心指标：type、possible_keys/key、key_len、rows、Extra。
- Key claims: type 从 system 到 ALL 排序，生产至少 range/ref；key_len 判断联合索引命中列数；警惕 Using filesort/Using temporary，Using index 为佳。
- Learner-relevant: 优化环节的核心工具，几乎所有调优题的答案骨架。

### 21.MySQL的Explain可以统计sql的rows，这个会导致全表扫描吗？如果不会是怎么统计的呢？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/21.MySQL的Explain可以统计sql的rows，这个会导致全表扫描吗？如果不会是怎么统计的呢？.md#21.MySQL的Explain可以统计sql的rows，这个会导致全表扫描吗？如果不会是怎么统计的呢？]]`
- Summary: 说明 EXPLAIN 的 rows 是采样估算值，不会触发全表扫描，并解释 InnoDB 统计信息机制。
- Key claims: 随机抽取少量数据页（默认约 8 页）算平均密度再乘总页数；参考基数与页面数；可用 ANALYZE TABLE 重新采样（大表需谨慎）。
- Learner-relevant: 打破“EXPLAIN 很重”的误解，理解优化器成本估算的来源。

### 22.MySQL可以存储图片吗
- Locator: `[[sources/小哲讲八股/20260926/MySQL/22.MySQL可以存储图片吗.md#22.MySQL可以存储图片吗]]`
- Summary: 说明技术上可用 BLOB 存图片，但生产实践强烈反对。
- Key claims: BLOB 系列按体积分级；大字段挤占 Buffer Pool、备份恢复暴涨、无法接 CDN；标准做法是 MySQL 存 URL、文件放 OSS/S3/MinIO。
- Learner-relevant: 存储与计算分离的架构原则，也复习 Buffer Pool 的价值。

### 23.MySQL可以存储JSON数据吗_对比使用MongoDB来存储呢_
- Locator: `[[sources/小哲讲八股/20260926/MySQL/23.MySQL可以存储JSON数据吗_对比使用MongoDB来存储呢_.md#23.MySQL可以存储JSON数据吗?对比使用MongoDB来存储呢?]]`
- Summary: 对比 MySQL 5.7+ 原生 JSON 与 MongoDB 在一致性、查询、索引、Schema 上的差异与选型。
- Key claims: MySQL JSON 以二进制存储、按 Key 读取 O(1)，但需借助虚拟生成列才能建索引；核心交易选 MySQL，纯嵌套/大写入选 MongoDB。
- Learner-relevant: 关系型与文档型的选型判断，延伸非结构化数据场景。

### 24.MySQL为什么说需要小表驱动大表
- Locator: `[[sources/小哲讲八股/20260926/MySQL/24.MySQL为什么说需要小表驱动大表.md#24.MySQL为什么说需要小表驱动大表]]`
- Summary: 用嵌套 for 循环类比解释小表驱动大表能减少外层循环次数，提升 NLJ 效率。
- Key claims: 前提是被驱动表连接字段有索引；“小表”指 WHERE 过滤后参与 JOIN 的结果集小，而非总行数少。
- Learner-relevant: JOIN 优化与执行计划的关键直觉，修正对“小表”的常见误解。

### 25.如何分析慢sql
- Locator: `[[sources/小哲讲八股/20260926/MySQL/25.如何分析慢sql.md#25.如何分析慢sql]]`
- Summary: 给出慢 SQL 三步法：慢查询日志定位 → EXPLAIN 分析 → SHOW PROFILE 看资源消耗。
- Key claims: 设置 slow_query_log 与 long_query_time，配合 mysqldumpslow；关注 type/key/rows/Extra；Show Profile 定位 CPU、I/O、锁等待。
- Learner-relevant: 调优的标准作业流程，可作为复习串讲主线。

### 26.有没有可能走了索引，但是sql执行依然很慢
- Locator: `[[sources/小哲讲八股/20260926/MySQL/26.有没有可能走了索引，但是sql执行依然很慢.md#26.有没有可能走了索引，但是sql执行依然很慢]]`
- Summary: 列举走索引仍慢的四类原因：回表代价、深分页、锁等待、系统刷脏页。
- Key claims: 区分度低导致大量随机 I/O 回表；LIMIT 偏移大；X 锁/MDL 锁等待；Redo 写满或 Buffer Pool 置换触发刷脏。
- Learner-relevant: 打破“key 非 NULL 就快”的误区，综合串起回表、分页、锁、WAL。

### 27.什么是ACID？MySQL是分别通过什么机制来实现这四个特性的？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/27.什么是ACID？MySQL是分别通过什么机制来实现这四个特性的？.md#27.什么是 ACID？MySQL 是分别通过什么机制来实现这四个特性的？]]`
- Summary: 说明 ACID 四特性及 InnoDB 的实现机制对应关系。
- Key claims: 原子性靠 Undo Log、持久性靠 Redo Log（WAL）、隔离性靠锁+MVCC，一致性是前三者共同保证的最终目标。
- Learner-relevant: 事务模块的总纲，向前连接隔离级别、向后连接日志系统。

### 28.RedoLog（重做日志）和UndoLog（回滚日志）的区别是什么
- Locator: `[[sources/小哲讲八股/20260926/MySQL/28.RedoLog（重做日志）和UndoLog（回滚日志）的区别是什么.md#28.Redo Log（重做日志）和 Undo Log（回滚日志）的区别是什么]]`
- Summary: 从功能（持久性 vs 原子性/MVCC）、物理/逻辑、写入方式三方面对比 Redo Log 与 Undo Log。
- Key claims: Redo 是物理日志、循环写、崩溃恢复；Undo 是逻辑日志、追加写、回滚并兼职 MVCC，由 Purge 线程清理。
- Learner-relevant: 日志体系的核心二分，是 MVCC 版本链与两阶段提交的基础。

### 29.MySQL的四种隔离级别是什么？默认级别是什么？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/29.MySQL的四种隔离级别是什么？默认级别是什么？.md#29.MySQL 的四种隔离级别是什么？默认级别是什么？]]`
- Summary: 从低到高介绍 RU/RC/RR/Serializable 各级别解决的问题与默认值。
- Key claims: MySQL 默认 RR；RC 是 Oracle/PostgreSQL 默认；InnoDB 在 RR 下借助 MVCC 与 Next-Key Lock 已解决大部分幻读。
- Learner-relevant: 事务隔离的概念框架，衔接脏读/幻读与锁。

### 30.读已提交为什么性能比可重复读要好？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/30.读已提交为什么性能比可重复读要好？.md#30.读已提交为什么性能比可重复读要好？]]`
- Summary: 解释 RC 并发性能通常优于 RR 的反直觉现象，核心在锁而非 ReadView 开销。
- Key claims: RR 默认 Next-Key Lock 锁间隙导致冲突多；RC 关闭间隙锁只用 Record Lock；RC 对不匹配记录可立即释放锁。
- Learner-relevant: 隔离级别与锁机制交叉的高阶对比，深化对间隙锁成本的理解。

### 31.什么是脏读、不可重复读和幻读
- Locator: `[[sources/小哲讲八股/20260926/MySQL/31.什么是脏读、不可重复读和幻读.md#31.什么是脏读、不可重复读和幻读]]`
- Summary: 用“假数据/变数据/新数据”区分三种并发异常，并说明各自对应的操作与解法。
- Key claims: 脏读读未提交、不可重复读针对 UPDATE/DELETE（行锁可解）、幻读针对 INSERT（需间隙锁）。
- Learner-relevant: 隔离级别的问题定义，直接支撑“幻读为什么需要 Next-Key Lock”。

### 32.如何理解MVCC
- Locator: `[[sources/小哲讲八股/20260926/MySQL/32.如何理解MVCC.md#32.如何理解MVCC]]`
- Summary: 拆解 MVCC 三要素：隐式字段、Undo Log 版本链、ReadView 可见性算法，并对比 RC/RR 的快照时机。
- Key claims: DB_TRX_ID 与 DB_ROLL_PTR 串起版本链；可见性按 trx_id 与活跃事务列表判断；RC 每次查询新建 ReadView、RR 仅首次生成并复用。
- Learner-relevant: 非阻塞读写的核心机制，是理解 RR 与 RC 差异的钥匙。

### 33.可重复读（RR）级别下，MySQL彻底解决幻读了吗？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/33.可重复读（RR）级别下，MySQL彻底解决幻读了吗？.md#33.可重复读（RR）级别下，MySQL 彻底解决幻读了吗？]]`
- Summary: 说明 RR 下快照读靠 MVCC、当前读靠 Next-Key Lock，但特殊“先快照读再 UPDATE”仍会漏出幻读。
- Key claims: 快照读看不到新插入；当前读锁间隙阻止插入；先快照读未果、他人提交后被本事务 UPDATE 会因 trx_id 变为自身而使该行“复活”。
- Learner-relevant: 幻读解决方案的边界案例，深化当前读 vs 快照读的区分。

### 34.MySQL有哪些锁
- Locator: `[[sources/小哲讲八股/20260926/MySQL/34.MySQL有哪些锁.md#34.MySQL 有哪些锁]]`
- Summary: 从锁粒度、互斥属性、InnoDB 行锁算法三个维度系统梳理 MySQL 锁。
- Key claims: 全局锁/表锁（含 MDL）/行锁；S 锁、X 锁、意向锁 IS/IX；Record Lock、Gap Lock、Next-Key Lock（RR 默认单位）。
- Learner-relevant: 锁机制的完整分类总览，衔接死锁、乐观锁与隔离级别。

### 35.给出一个死锁的实际SQL案例
- Locator: `[[sources/小哲讲八股/20260926/MySQL/35.给出一个死锁的实际SQL案例.md#35.给出一个死锁的实际 SQL 案例]]`
- Summary: 用转账场景复现 AB-BA 交叉死锁，展示 InnoDB 死锁检测与回滚机制。
- Key claims: 两事务以相反顺序锁 id=1/id=2 形成等待环；wait-for graph 检测后回滚代价较小的事务；对策是固定顺序加锁、拆分大事务。
- Learner-relevant: 行锁与事务交互的经典案例，连接加锁顺序规范。

### 36.MySQL如何实现乐观锁？底层不也是加了行锁吗？为什么还要叫做乐观锁呢？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/36.MySQL如何实现乐观锁？底层不也是加了行锁吗？为什么还要叫做乐观锁呢？.md#36.MySQL如何实现乐观锁？底层不也是加了行锁吗？为什么还要叫做乐观锁呢？]]`
- Summary: 解释乐观锁是应用层 CAS（version 字段）逻辑，虽然 UPDATE 瞬间有行锁，但锁持有时间极短。
- Key claims: 通过 `WHERE version=old` 判断受影响行数决定重试；悲观锁从 SELECT FOR UPDATE 起全程持锁；乐观锁适合读多写少。
- Learner-relevant: 悲观/乐观锁的语义区分，澄清“逻辑锁 vs 物理锁”的常见困惑。

### 37.为什么需要RedoLog？直接把数据写回磁盘不行吗
- Locator: `[[sources/小哲讲八股/20260926/MySQL/37.为什么需要RedoLog？直接把数据写回磁盘不行吗.md#37.为什么需要 Redo Log？直接把数据写回磁盘不行吗]]`
- Summary: 从性能（随机写 vs 顺序写）与崩溃恢复两个维度解释 Redo Log 的必要性。
- Key claims: 直接刷 16KB 随机数据页存在写放大且慢；Redo Log 追加写把随机 I/O 变顺序 I/O；先写日志后刷页保证 Crash Safe。
- Learner-relevant: WAL 思想的动机说明，是日志写入链路的核心。

### 38.什么是WAL（Write-AheadLogging）技术
- Locator: `[[sources/小哲讲八股/20260926/MySQL/38.什么是WAL（Write-AheadLogging）技术.md#38.什么是 WAL（Write-Ahead Logging）技术]]`
- Summary: 定义 WAL“先写日志再写磁盘”的规则及其带来的性能与持久性收益。
- Key claims: 日志顺序追加替代数据页随机写；日志落盘即视为事务成功，脏页可异步 CheckPoint 刷盘；宕机后重放日志恢复。
- Learner-relevant: 统一 Redo Log、两阶段提交、Buffer Pool 刷脏的底层原理。

### 39.Binlog和RedoLog的区别？有了RedoLog为什么还需要Binlog
- Locator: `[[sources/小哲讲八股/20260926/MySQL/39.Binlog和RedoLog的区别？有了RedoLog为什么还需要Binlog.md#39.Binlog 和 Redo Log 的区别？有了 Redo Log 为什么还需要 Binlog]]`
- Summary: 从层级、物理/逻辑、写入方式、作用四维对比 Binlog 与 Redo Log，并解释二者并存的原因。
- Key claims: Binlog 属 Server 层、逻辑、追加写、用于复制与归档恢复；Redo Log 属 InnoDB、物理、循环写、用于崩溃恢复；Redo 无法保存历史与支持异构同步。
- Learner-relevant: 三日志体系的关键辨析，直接支撑两阶段提交与主从复制。

### 40.Binlog的三种格式StatementRowMixed有什么优缺点
- Locator: `[[sources/小哲讲八股/20260926/MySQL/40.Binlog的三种格式StatementRowMixed有什么优缺点.md#40.Binlog 的三种格式Statement Row Mixed有什么优缺点]]`
- Summary: 对比 Statement、Row、Mixed 三种 Binlog 格式在日志体积与一致性上的取舍。
- Key claims: Statement 省空间但 UUID/NOW/RAND 等易主从不一致；Row 安全但批量更新时日志暴涨，5.7+ 默认；Mixed 自动切换但存在判断失误风险。
- Learner-relevant: 复制一致性细节，连接主从复制与故障恢复。

### 41.什么是二阶段提交_为什么要这么设计_
- Locator: `[[sources/小哲讲八股/20260926/MySQL/41.什么是二阶段提交_为什么要这么设计_.md#41.什么是二阶段提交?为什么要这么设计?]]`
- Summary: 解释 2PC 如何在 Redo Log 与 Binlog 之间保证原子一致的提交过程。
- Key claims: Prepare（Redo 置 PREPARE）→ 写 Binlog 并刷盘 → Commit（Redo 置 COMMIT）；崩溃恢复依据 Binlog 是否完整决定回滚或提交。
- Learner-relevant: 日志一致性的核心机制，是“断电数据为何不丢/不重”的解释。

### 42.MySQL的BufferPool是用来做什么的
- Locator: `[[sources/小哲讲八股/20260926/MySQL/42.MySQL的BufferPool是用来做什么的.md#42.MySQL 的 Buffer Pool 是用来做什么的]]`
- Summary: 说明 Buffer Pool 是 InnoDB 最核心内存组件，负责读缓存与写缓冲，并用改进 LRU 管理。
- Key claims: 读命中返回内存速度，未命中加载数据页；写只改内存并标脏由后台异步刷盘；LRU 分 New/Old 区防止全表扫描冲掉热数据。
- Learner-relevant: 内存与磁盘交互的核心缓冲，衔接刷脏、Change Buffer 与性能抖动。

### 43.什么是ChangeBuffer？它对什么类型的索引有效？为什么？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/43.什么是ChangeBuffer？它对什么类型的索引有效？为什么？.md#43.什么是 Change Buffer？它对什么类型的索引有效？为什么？]]`
- Summary: 解释 Change Buffer 缓存非唯一二级索引的变更以避免随机读，并说明为何唯一索引不适用。
- Key claims: 变更页不在内存时先记入 Change Buffer，后续 Merge；仅对普通二级索引有效；唯一索引必须读页做去重检查，缓存失去意义。
- Learner-relevant: 写入优化的进阶机制，深化“写多读少 + 普通索引”的调优判断。

### 44.MySQL主从复制的原理是什么
- Locator: `[[sources/小哲讲八股/20260926/MySQL/44.MySQL主从复制的原理是什么.md#44.MySQL 主从复制的原理是什么]]`
- Summary: 用“主库写日志、从库抄日志、重放日志”概括主从复制的三线程模型。
- Key claims: 主库 Binlog Dump Thread 发送 Binlog；从库 I/O Thread 写入 Relay Log 解耦；SQL Thread 重放；默认异步故存在延迟。
- Learner-relevant: 复制链路的基础模型，衔接三种复制模式与主从延迟。

### 45.异步复制、半同步复制和全同步复制的区别
- Locator: `[[sources/小哲讲八股/20260926/MySQL/45.异步复制、半同步复制和全同步复制的区别.md#45.异步复制、半同步复制和全同步复制的区别]]`
- Summary: 按主库等待从库确认的程度对比异步、半同步、全同步复制的性能与一致性。
- Key claims: 异步性能最好但可能丢数据；半同步等至少 1 个从库 ACK（RPO 近 0，高可用首选）；全同步需全部节点提交，性能最差。
- Learner-relevant: 一致性与可用性的权衡，是架构设计题的常见考点。

### 46.什么是主从延迟？如何解决？
- Locator: `[[sources/小哲讲八股/20260926/MySQL/46.什么是主从延迟？如何解决？.md#46.什么是主从延迟？如何解决？]]`
- Summary: 解释主从延迟根因（并发回放不对等、大事务）并给出技术+业务四类解决方案。
- Key claims: 主库多线程写 vs 从库单 SQL 线程串行回放；开启并行复制（MTS）、拆分大事务、核心业务强制读主、Redis 缓存兜底。
- Learner-relevant: 读写分离落地的核心痛点，串联 Binlog、复制模式与缓存。

### 47.MySQL服务器CPU飙升到100%如何排查
- Locator: `[[sources/小哲讲八股/20260926/MySQL/47.MySQL服务器CPU飙升到100%如何排查.md#47.MySQL服务器CPU 飙升到 100% 如何排查]]`
- Summary: 给出“定位-止血-根治”三步排查法处理 CPU 100%。
- Key claims: top -c 确认 mysqld，SHOW FULL PROCESSLIST 看 State/Time；紧急 KILL 线程止血；EXPLAIN 找全表扫描/索引失效并加索引或改写 SQL。
- Learner-relevant: 线上应急与慢 SQL 排查的综合演练，复习 EXPLAIN 与索引失效。

### 48.MySQL的分库分表是什么
- Locator: `[[sources/小哲讲八股/20260926/MySQL/48.MySQL的分库分表是什么.md#48.MySQL的分库分表是什么]]`
- Summary: 介绍垂直/水平分库分表的四种拆法及其代价。
- Key claims: 垂直分库按业务、垂直分表按字段热度；水平分库/分表按分片键分散数据；代价是分布式事务、跨库 JOIN、全局唯一 ID（雪花算法）。
- Learner-relevant: 架构扩展的终极手段，呼应自增 ID/UUID 与多表 join 的约束。

### 49.什么是InnoDB的页分裂和页合并
- Locator: `[[sources/小哲讲八股/20260926/MySQL/49.什么是InnoDB的页分裂和页合并.md#49.什么是InnoDB的页分裂和页合并]]`
- Summary: 解释 16KB 页在插入/删除时触发的页分裂与页合并及其代价。
- Key claims: 页满插入中间值会申请新页并迁移约 50% 数据，产生 I/O 与碎片；删除至低于 MERGE_THRESHOLD（默认 50%）会尝试与相邻页合并；自增主键可避免分裂。
- Learner-relevant: 主键顺序写入性能的物理原因，闭环解释“为什么用自增 ID”。
