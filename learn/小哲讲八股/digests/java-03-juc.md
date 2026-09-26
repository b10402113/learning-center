---
source: 小哲八股-JUC
source_type: codebase
source_lines: 2252
language: markdown
file_count: 35
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — JUC

## Overview (L1)

- 线程基础与生命周期 — 线程六状态（NEW/RUNNABLE/BLOCKED/WAITING/TIMED_WAITING/TERMINATED）、多线程目的、线程数设置公式、创建线程的四种方式，以及 Runnable 与 Callable 的返回值/异常/启动差异。
- 线程池设计与治理 — ThreadPoolExecutor 七大参数、四步执行流程、核心/非核心线程弹性设计、四种拒绝策略、Executors 五类快捷线程池及其 OOM 隐患（阿里手册规约）。
- 并发执行模型 — 并行流基于 Fork/Join + 工作窃取、默认共用 ForkJoinPool.commonPool()（CPU 核数 - 1）；JDK 21 虚拟线程 M:N 调度与阻塞卸载；ForkJoinPool 与 ThreadPoolExecutor 的队列/调度差异。
- ThreadLocal 与跨线程上下文 — ThreadLocal 以线程对象持有 ThreadLocalMap（Key 弱引用/Value 强引用，泄漏与 remove）、父子线程通信、InheritableThreadLocal 在线程池中的上下文污染与 TTL 方案。
- 锁、内存模型与无锁原子 — synchronized 的 Monitor 与锁升级（偏向→轻量→重量）、ReentrantLock 对比、AQS（state + CLH + CAS）、并发三大原则、JMM/volatile/happens-before/DCL、CAS 与 ABA、AtomicInteger 热点问题与 LongAdder。
- 并发工具类与手写编码题 — CountDownLatch vs CyclicBarrier 的语义与底层差异、CompletableFuture 的无锁栈回调；生产者消费者、DCL、三线程交替打印 ABC、N 线程顺序打印、死锁示例。

## Sections (L2)

### 1.Java线程有哪些状态

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/1.Java线程有哪些状态.md#1.Java线程有哪些状态]]`
- Summary: Java 线程六种状态的语义、触发方法与流转表。
- Key claims: RUNNABLE 合并了 OS 的「就绪」与「运行」；BLOCKED 特指等 synchronized 锁；WAITING 无超时、TIMED_WAITING 有超时。
- Learner-relevant: 线程生命周期，是线程池与锁章节的状态基础。

### 2.Java中多线程的目的是什么

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/2.Java中多线程的目的是什么.md#2.Java中多线程的目的是什么]]`
- Summary: 多线程三大目的：提高 CPU 利用率、应对 IO 阻塞、提升响应与体验。
- Key claims: 多核时代单线程浪费核；IO 等待时 CPU 可切到其他线程；异步处理耗时任务避免主线程卡死。
- Learner-relevant: 并发动机与收益/代价，是线程数设置的前置概念。

### 3.Java的多线程开发中，线程数是不是越多越好？一般怎么设置？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/3.Java的多线程开发中，线程数是不是越多越好？一般怎么设置？.md#3.Java的多线程开发中，线程数是不是越多越好？一般怎么设置？]]`
- Summary: 线程数并非越多越好，按 CPU 密集型与 IO 密集型分别配置。
- Key claims: 代价是上下文切换、约 1MB 栈内存与锁竞争；CPU 密集 N+1，IO 密集约 2N 或 N×(1+Wait/Compute)。
- Learner-relevant: 线程池容量调优的经验公式。

### 4.Java中,什么是线程池

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/4.Java中,什么是线程池.md#4.Java中,什么是线程池]]`
- Summary: 线程池是基于池化思想的线程管理机制，核心类 ThreadPoolExecutor。
- Key claims: 降低创建/销毁资源消耗、提高响应速度、提高可管理性（防 OOM 的防洪堤）。
- Learner-relevant: 线程池总纲，为后续参数/流程/类型铺垫。

### 5.Stream API中的并行流是如何工作的?它默认使用什么线程池?

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/5.StreamAPI中的并行流是如何工作的_它默认使用什么线程池_.md#5.Stream API中的并行流是如何工作的?它默认使用什么线程池?]]`
- Summary: 并行流是 Fork/Join 的封装，分治 + 工作窃取。
- Key claims: 默认共用全局 ForkJoinPool.commonPool()，线程数为 CPU 核数 - 1；阻塞 IO 会耗尽公共池拖垮无关业务，仅适合 CPU 密集型。
- Learner-relevant: 并行流陷阱与 ForkJoinPool 关联。

### 6.虚拟线程与传统线程的区别是什么?它如何改变高并发编程模型?

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/6.虚拟线程与传统线程的区别是什么_它如何改变高并发编程模型_.md#6.虚拟线程与传统线程的区别是什么?它如何改变高并发编程模型?]]`
- Summary: JDK 21 虚拟线程：JVM 管理的轻量级线程，M:N 调度。
- Key claims: 传统线程 1:1、约 2MB 栈；虚拟线程几百字节、单机百万级；阻塞时自动卸载，Carrier Thread 继续干活，可写同步阻塞式高并发代码。
- Learner-relevant: 现代并发模型演进，与线程池/响应式编程对比。

### 7.Java中线程池的核心参数有哪些

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/7.Java中线程池的核心参数有哪些.md#7.Java中线程池的核心参数有哪些]]`
- Summary: ThreadPoolExecutor 七个构造参数及「银行网点」比喻。
- Key claims: corePoolSize/maximumPoolSize/keepAliveTime+unit/workQueue/threadFactory/handler；分人员数量、等待区、兜底辅助三类。
- Learner-relevant: 线程池调参的核心词汇表。

### 8.线程池的工作流程是怎样的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/8.线程池的工作流程是怎样的.md#8.线程池的工作流程是怎样的]]`
- Summary: 任务提交后经过核心线程→队列→最大线程→拒绝策略四道关卡。
- Key claims: 核心未满直接建线程；再优先入阻塞队列；队列满才建非核心线程处理新任务；最后拒绝策略。
- Learner-relevant: 线程池行为模型，解释参数如何协同。

### 9.线程池为什么要分别设计核心线程和非核心线程

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/9.线程池为什么要分别设计核心线程和非核心线程.md#9.线程池为什么要分别设计核心线程和非核心线程]]`
- Summary: 核心/非核心区分实现「弹性伸缩」，平衡常态与突发流量。
- Key claims: 核心线程保响应速度与稳定、避免频繁创建销毁；非核心线程扛峰值、空闲超 keepAliveTime 即回收。
- Learner-relevant: 线程池设计哲学与资源取舍。

### 10.Java线程池的拒绝策略有哪些

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/10.Java线程池的拒绝策略有哪些.md#10.Java线程池的拒绝策略有哪些]]`
- Summary: JDK 四种拒绝策略：Abort/CallerRuns/Discard/DiscardOldest。
- Key claims: 默认 AbortPolicy 抛异常；CallerRunsPolicy 由提交线程执行兼作削峰；Discard 静默丢弃；DiscardOldest 丢队头，优先级队列下慎用。
- Learner-relevant: 线程池过载兜底策略选择。

### 11.创建线程有哪些方式

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/11.创建线程有哪些方式.md#11.创建线程有哪些方式]]`
- Summary: 创建线程四种方式：继承 Thread、实现 Runnable、实现 Callable、使用线程池。
- Key claims: 继承 Thread 受单继承限制、耦合高；Runnable 解耦任务与线程；Callable 配合 FutureTask 有返回值；生产环境禁止显式 new Thread。
- Learner-relevant: 线程创建 API 全貌与最佳实践。

### 12.Runnable和Callable具体有什么区别

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/12.Runnable和Callable具体有什么区别.md#12.Runnable 和 Callable 具体有什么区别]]`
- Summary: 从返回值、异常处理、启动方式三维度对比 Runnable 与 Callable。
- Key claims: Runnable.run 返回 void 且不能抛检查型异常；Callable.call 有泛型返回值并 throws Exception；Callable 需 FutureTask 包装或 submit。
- Learner-relevant: 任务抽象与异步结果获取。

### 13.Java中的线程池有哪些类型

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/13.Java中的线程池有哪些类型.md#13.Java中的线程池有哪些类型]]`
- Summary: Executors 提供的 5 种快捷线程池及其特点与坑点。
- Key claims: Fixed 用无界 LinkedBlockingQueue 有 OOM 风险；Cached 最大线程数 Integer.MAX_VALUE 可瞬间创建海量线程；Single 顺序执行；Scheduled 替代 Timer；WorkStealing 基于 ForkJoinPool。
- Learner-relevant: 标准线程池类型与反面教材。

### 14.为什么阿里开发手册禁止直接使用JDK自带的线程池

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/14.为什么阿里开发手册禁止直接使用JDK自带的线程池.md#14.为什么阿里开发手册禁止直接使用JDK自带的线程池]]`
- Summary: 禁用 Executors 快捷方法，核心是规避 OOM 风险。
- Key claims: Fixed/Single 无界队列堆积导致 OOM；Cached 无限线程导致 CPU/内存耗尽；应手动用 ThreadPoolExecutor 构造函数管控资源。
- Learner-relevant: 生产线程池创建的强制规约。

### 15.什么是ThreadLocal？如何实现的？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/15.什么是ThreadLocal？如何实现的？.md#15.什么是ThreadLocal？如何实现的？]]`
- Summary: ThreadLocal 以空间换时间做线程隔离，数据存在 Thread 对象的 ThreadLocalMap 中。
- Key claims: 误区是 ThreadLocal 持 Map，实际是 Thread 持有 threadLocals；Key 弱引用、Value 强引用；线程复用时需 remove 防内存泄漏。
- Learner-relevant: 线程隔离机制与内存泄漏防范。

### 16.synchronized是怎么实现的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/16.synchronized是怎么实现的.md#16.synchronized是怎么实现的]]`
- Summary: synchronized 基于对象 Monitor，字节码为 monitorenter/monitorexit，JDK 1.6 引入锁升级。
- Key claims: Monitor 计数器支持可重入；重量级锁依赖 OS 互斥量、用户态/内核态切换昂贵；锁状态 无锁→偏向→轻量级→重量级。
- Learner-relevant: 锁的底层实现与升级总览。

### 17.synchronized的锁升级的目的是什么

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/17.synchronized的锁升级的目的是什么.md#17.synchronized的锁升级的目的是什么]]`
- Summary: 锁升级目的：避免无竞争场景也动用 OS 重量级锁，减少上下文切换。
- Key claims: 偏向锁优化单线程独占（只记线程 ID）；轻量级锁用 CAS 自旋优化交替/短竞争；重量级锁兜底高并发长耗时场景防 CPU 空转。
- Learner-relevant: 理解锁优化按竞争场景「按需分配」。

### 18.Java并发的三大原则是什么如何理解

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/18.Java并发的三大原则是什么如何理解.md#18.Java并发的三大原则是什么如何理解]]`
- Summary: 并发三特性：原子性、可见性、有序性，对应 JMM 要解决的问题。
- Key claims: 原子性源于线程切换（i++ 三步）用 synchronized/Lock/Atomic 解；可见性源于 CPU 缓存用 volatile/锁解；有序性源于指令重排序用 volatile 内存屏障/锁解。
- Learner-relevant: JMM 章节的总纲与问题—方案映射。

### 19.synchronized与ReentrantLock的区别有哪些

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/19.synchronized与ReentrantLock的区别有哪些.md#19.synchronized 与 ReentrantLock 的区别有哪些]]`
- Summary: 关键字 vs API 类：隐式/显式、功能、便利性与性能对比。
- Key claims: ReentrantLock 基于 AQS，支持公平锁、lockInterruptibly 可中断、多 Condition 精确唤醒；必须 try-finally 中 unlock；JDK 1.6 后性能接近。
- Learner-relevant: 两种互斥锁的选型依据。

### 20.AQS底层原理是怎样的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/20.AQS底层原理是怎样的.md#20.AQS底层原理是怎样的]]`
- Summary: AQS = volatile int state + CLH 变体队列 + CAS。
- Key claims: state 语义随工具变化（ReentrantLock 重入次数、CountDownLatch 倒数、Semaphore 许可）；CAS 成功者得锁；失败线程封装 Node 入双向队列，前驱释放后唤醒。
- Learner-relevant: JUC 同步器共同基石。

### 21.CountDownLatch和CyclicBarrier都有等待的功能,它们有什么区别底层实现一样吗

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/21.CountDownLatch和CyclicBarrier都有等待的功能,它们有什么区别底层实现一样吗.md#21.CountDownLatch 和 CyclicBarrier 都有等待的功能,它们有什么区别底层实现一样吗]]`
- Summary: 一个等多个（一次性）vs 多个互相等（可循环）。
- Key claims: CountDownLatch 基于 AQS 共享模式，state 即计数；CyclicBarrier 基于 ReentrantLock + Condition，计数是受锁保护的普通变量；CyclicBarrier 自动重置可多轮使用。
- Learner-relevant: 同步工具语义与底层实现差异。

### 22.CompletableFuture的底层是如何实现的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/22.CompletableFuture的底层是如何实现的.md#22.CompletableFuture的底层是如何实现的]]`
- Summary: 基于 CAS 状态机 + Treiber Stack 无锁栈的回调链。
- Key claims: volatile result 兼存结果与状态，complete 用 CAS 更新；thenApply 封装 Completion 压栈；完成后 postComplete 循环弹栈触发 tryFire；默认用 commonPool。
- Learner-relevant: 异步编排与无锁回调实现。

### 23.ForkJoinPool是什么和ThreadPoolExecutor区别是什么

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/23.ForkJoinPool是什么和ThreadPoolExecutor区别是什么.md#23.ForkJoinPool是什么和ThreadPoolExecutor区别是什么]]`
- Summary: ForkJoinPool 为分治/递归任务设计，与 ThreadPoolExecutor 的队列与调度不同。
- Key claims: TPE 单公共队列「争抢」；FJP 每线程独立双端队列；FJP 工作窃取从他队尾部偷任务，锁冲突小、CPU 利用率高。
- Learner-relevant: 两类线程池的适用场景与底层结构。

### 24.Java中父子线程如何通信

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/24.Java中父子线程如何通信.md#24.Java中父子线程如何通信]]`
- Summary: 线程通信基于共享内存：共享变量（volatile/锁）与 InheritableThreadLocal。
- Key claims: volatile/synchronized 保证共享变量可见性与安全；InheritableThreadLocal 在创建子线程时拷贝父线程变量，常用于全链路追踪透传。
- Learner-relevant: 父子线程数据传递的两种方式。

### 25.Java中使用InheritableThreadLocal有什么坑吗在线程池里好用吗

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/25.Java中使用InheritableThreadLocal有什么坑吗在线程池里好用吗.md#25.Java中使用 InheritableThreadLocal 有什么坑吗在线程池里好用吗]]`
- Summary: ITL 在线程池中会上下文污染，严禁直接使用，标准方案是阿里 TTL。
- Key claims: ITL 只在 new Thread 时拷贝；线程池复用线程不触发拷贝导致脏读串号；TTL 把捕获/回放/恢复挪到任务提交执行时。
- Learner-relevant: 线程池下上下文透传的正确做法。

### 26.Java中volatile是什么_如何理解JMM

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/26.Java中volatile是什么_如何理解JMM.md#26.Java中volatile是什么?如何理解JMM]]`
- Summary: volatile 保证可见性与有序性、不保证原子性；JMM 定义主内存与工作内存关系。
- Key claims: 写强制刷主内存并使其他缓存失效；读写插入内存屏障禁止重排序；JMM 三问题（可见性/原子性/有序性）及对应解决方案。
- Learner-relevant: 内存模型与 volatile 语义核心。

### 27.什么是happens-before

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/27.什么是happens-before.md#27.什么是happens-before]]`
- Summary: Happens-Before 是 JMM 保证操作可见性的规则集。
- Key claims: 强调结果可见性与逻辑顺序而非物理时间，允许不改变结果的重排序；六条规则含程序次序、管程锁定、volatile、传递性、线程启动、线程终止。
- Learner-relevant: 判断线程安全与数据竞争的规范依据。

### 28.为什么单例模式的DCL模式需要用volatile

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/28.为什么单例模式的DCL模式需要用volatile.md#28.为什么单例模式的DCL模式需要用volatile]]`
- Summary: DCL 需 volatile 是为禁止指令重排序，防半初始化对象。
- Key claims: new 分三步（分配/初始化/赋值引用），可能重排为 1→3→2；线程 B 可能读到非 null 但未初始化的对象；volatile 内存屏障保证 1→2→3。
- Learner-relevant: 有序性与 DCL 的经典结合。

### 29.什么是CAS_什么是ABA问题_如何解决ABA问题_

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/29.什么是CAS_什么是ABA问题_如何解决ABA问题_.md#29.什么是CAS?什么是ABA问题?如何解决ABA问题?]]`
- Summary: CAS 乐观锁（V/A/B，Unsafe→CPU cmpxchg），ABA 问题及版本号解法。
- Key claims: 仅当 V==A 才更新为 B，失败自旋；CAS 只看结果不看过程，A→B→A 会误判；链表/栈场景危害大，解决靠加版本号/时间戳。
- Learner-relevant: 无锁编程基石与 ABA 陷阱。

### 30.Java中AtomicInteger适合高并发,但在竞争极其激烈的时候它的性能会下降,你知道为什么吗？有什么优化的方案吗？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/30.Java中AtomicInteger适合高并发,但在竞争极其激烈的时候它的性能会下降,你知道为什么吗？有什么优化的方案吗？.md#30.Java中AtomicInteger 适合高并发,但在竞争极其激烈的时候它的性能会下降,你知道为什么吗？有什么优化的方案吗？]]`
- Summary: AtomicInteger 高竞争下自旋浪费 CPU，优化用 LongAdder 分散热点。
- Key claims: 单点 value 导致 N-1 线程 CAS 失败重试；LongAdder 用 base + Cell[] 分治（空间换时间）；sum() 为最终一致而非实时精确。
- Learner-relevant: CAS 热点竞争与分段累加优化。

### 31.实现一个生产者消费者的代码

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/31.实现一个生产者消费者的代码.md#31.实现一个生产者消费者的代码]]`
- Summary: 用 synchronized + wait/notifyAll 实现固定容量仓库的生产者消费者。
- Key claims: 满/空条件判断必须用 while 防虚假唤醒；wait 释放锁、notifyAll 广播；临界区独占保证 LinkedList 安全。
- Learner-relevant: 线程通信与等待通知机制的实战。

### 32.实现DCL的代码

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/32.实现DCL的代码.md#32.实现DCL的代码]]`
- Summary: 标准 DCL 单例代码：两次检查 + volatile。
- Key claims: 第一次检查保性能（免锁）、第二次保唯一；volatile 禁止 1→3→2 重排防半初始化。
- Learner-relevant: 懒加载单例的线程安全写法。

### 33.实现三个线程交替打印ABC的代码

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/33.实现三个线程交替打印ABC的代码.md#33.实现三个线程交替打印ABC的代码]]`
- Summary: ReentrantLock + 三个 Condition 精确唤醒 + state % 3 状态机交替打印。
- Key claims: 用多个 Condition 实现点对点精确唤醒（优于 notifyAll）；state%3 控制轮次闭环；await 仍放 while 防虚假唤醒。
- Learner-relevant: Condition 精确唤醒与状态机设计。

### 34.实现顺序打印数字N个线程

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/34.实现顺序打印数字N个线程.md#34.实现顺序打印数字N个线程]]`
- Summary: 用 synchronized + wait/notifyAll 与取模实现 N 线程顺序打印。
- Key claims: 第 i 号线程只认 currentNumber % N == i；必须用 notifyAll（notify 随机唤醒可致死锁）；double-check 防获锁后超标。
- Learner-relevant: N 线程轮转与广播唤醒的必要性。

### 35.实现一个死锁产生示例

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JUC/35.实现一个死锁产生示例.md#35.实现一个死锁产生示例]]`
- Summary: 两线程以相反顺序获取两把锁的死锁示例。
- Key claims: 满足死锁四条件（互斥、请求与保持、不剥夺、循环等待）；用 sleep 保证必现；破坏任一条件即可避免死锁。
- Learner-relevant: 死锁成因与演示。
