---
source: 小哲八股-JVM
source_type: codebase
source_lines: 1263
language: markdown
file_count: 20
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — JVM

## Overview (L1)

- 执行引擎与编译模式 — Java 是半编译半解释语言，javac 产出字节码，运行时解释器配合 JIT 编译热点代码，JIT 还做逃逸分析等优化（文件 1–3）。
- 运行时内存与对象布局 — 五大运行时数据区（共享的堆/方法区，私有的栈/本地方法栈/程序计数器），堆栈差异、对象三块布局，以及永久代改元空间的演进（文件 4–7）。
- 类加载机制 — 加载→连接（验证/准备/解析）→初始化的七阶段，双亲委派"向上委托、向下加载"及其安全与去重目的，以及 SPI 与 Tomcat 打破委派的场景（文件 8–10）。
- GC 基础 — 可达性分析与 GC Roots、四种引用强度、标记-清除/复制/整理三算法与分代收集、STW 的成因与调优取舍（文件 11–14）。
- 垃圾收集器与线上调优 — Serial/Parallel/CMS/G1/ZGC 的演进与对比、三色标记与写屏障、GC 频繁的代码与配置成因、jstat→jmap→MAT 排查四步法（文件 15–20）。

## Sections (L2)

### 1.Java是编译型还是解释型_

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/1.Java是编译型还是解释型_.md#1.Java是编译型还是解释型?]]`
- Summary: 论证 Java 是"半编译、半解释"混合型：javac 先编译成平台无关的 `.class` 字节码，运行时由 JVM 解释执行并交 JIT 编译热点代码。
- Key claims: `.java` 经 javac 编译为字节码而非 CPU 机器码；解释器逐行翻译保持启动快，JIT 负责高频代码提速；"一次编写，到处运行"源于字节码的平台无关性。
- Learner-relevant: 建立 Java 执行模型的入口锚点（编译期 vs 运行期），后续 JIT 与内存区域的先修。

### 2.什么是JIT？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/2.什么是JIT？.md#2.什么是JIT？]]`
- Summary: 解释 JIT（Just-In-Time）如何以"二八定律"平衡解释器启动快与静态编译耗时长的矛盾，通过热点探测在运行时把热代码编译成本地机器码。
- Key claims: 用计数器做热点探测，Server 模式默认阈值约 10000 次；编译结果存于 Code Cache 供后续直接执行；JIT 还做方法内联、死代码消除、逃逸分析等 javac 做不到的激进优化。
- Learner-relevant: 连接"Java 执行流程"到"逃逸分析"，是理解运行时性能优化的核心锚点。

### 3.如何理解JVM的内存逃逸？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/3.如何理解JVM的内存逃逸？.md#3.如何理解JVM的内存逃逸？]]`
- Summary: 逃逸分析判断对象引用是否"逃出"当前方法，未逃逸时 JIT 做栈上分配、标量替换、同步消除三项优化以减少堆分配与 GC 压力。
- Key claims: 对象被 return 或赋给全局变量即"逃逸"；未逃逸对象可分配在栈帧中，方法结束自动销毁、无需 GC；HotSpot 具体实现以标量替换把对象拆成基本类型成员变量。
- Learner-relevant: 关联 JIT 优化与堆/栈区别，解释"为何推荐用局部变量"。

### 4.JVM的运行内存区域是怎样的？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/4.JVM的运行内存区域是怎样的？.md#4.JVM的运行内存区域是怎样的？]]`
- Summary: 概述 JVM 运行时 5 大区域：线程共享的堆与方法区、线程私有的虚拟机栈、本地方法栈、程序计数器，并给出各自职责与异常。
- Key claims: 堆是最大块、对象实例与数组都在此分配，满则 `OutOfMemoryError`；方法区 JDK8 起由永久代改为本地内存中的元空间；程序计数器是唯一不会内存溢出的区域，递归过深抛 `StackOverflowError`。
- Learner-relevant: JVM 内存模型的总纲锚点，后续堆栈、对象布局、GC 均建立在此之上。

### 5.JVM中堆和栈有什么区别？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/5.JVM中堆和栈有什么区别？.md#5.JVM中堆和栈有什么区别？]]`
- Summary: 从物理地址、存储内容、线程可见性、异常类型四维度对比堆与栈，结论是"栈是运行时的单位，堆是存储的单位"。
- Key claims: 栈内存连续、随方法结束自动释放不需 GC，堆内存不连续、依赖 GC 且开销大；栈存局部变量与对象引用、天然线程安全，堆存对象实例且线程共享；栈溢出抛 `StackOverflowError`，堆溢出抛 `OutOfMemoryError`。
- Learner-relevant: 深化文件 4 的内存区域，为对象布局与逃逸分析提供对照。

### 6.Java对象的内存布局是怎样的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/6.Java对象的内存布局是怎样的.md#6.Java 对象的内存布局是怎样的]]`
- Summary: HotSpot 中对象由对象头、实例数据、对齐填充三部分组成，对象头含 Mark Word、Klass Pointer，数组另有长度字段。
- Key claims: Mark Word 存哈希码、GC 分代年龄、锁状态等且随锁升级动态变化；Klass Pointer 指向方法区类元数据；HotSpot 要求对象大小按 8 字节对齐，不足则填充。
- Learner-relevant: 关联锁状态与 GC 分代年龄，是理解并发与 GC 细节的底层锚点。

### 7.永久代为什么要改成元空间

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/7.永久代为什么要改成元空间.md#7.永久代为什么要改成元空间]]`
- Summary: JDK8 用元空间取代永久代，原因是永久代大小固定、由 `-XX:MaxPermSize` 设定上限，动态代理类易撑爆导致 `PermGen space` OOM。
- Key claims: 永久代物理上仍是堆的一部分且有固定上限；Spring/Hibernate/CGLib 生成大量动态代理类是主要压力来源；元空间移到本地内存、受物理内存限制可自动扩容，降低 OOM 概率。
- Learner-relevant: 补齐方法区演进，解释生产环境常见的元空间问题。

### 8.JVM类加载的过程是怎样的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/8.JVM类加载的过程是怎样的.md#8.JVM类加载的过程是怎样的]]`
- Summary: 类加载把 `.class` 读入内存并生成 `java.lang.Class` 对象，分加载、连接（验证/准备/解析）、初始化三大阶段，共七步。
- Key claims: 加载阶段通过全限定名读二进制流并在堆生成 Class 对象；准备阶段为 static 变量分配内存并设零值（`static int a=666` 此时为 0），但 `static final` 常量此步即为 666；初始化执行 `<clinit>()`，才真正执行静态代码块与赋值。
- Learner-relevant: 类加载机制主锚点，澄清静态变量默认值与赋值的常见误区。

### 9.双亲委派的过程是怎样的？目的是什么？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/9.双亲委派的过程是怎样的？目的是什么？.md#9.双亲委派的过程是怎样的？目的是什么？]]`
- Summary: 双亲委派"向上委托，向下加载"：加载请求先抛给父加载器直到 Bootstrap，父加载器找不到时子加载器才自行加载。
- Key claims: 三个核心加载器为 Bootstrap（C++，rt.jar）、Extension（jre/lib/ext）、Application（Classpath）；判定类相同看"类全名 + 类加载器"；目的为沙箱安全（防篡改核心 API）与避免重复加载。
- Learner-relevant: 类加载机制核心考点，承上启下引出打破双亲委派。

### 10.什么情况下需要打破双亲委派

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/10.什么情况下需要打破双亲委派.md#10.什么情况下需要打破双亲委派]]`
- Summary: 双亲委派"单向可见性"的短板导致两类场景需打破：SPI 让基础类调用用户实现，Web 容器做多版本类隔离。
- Key claims: JDBC 用线程上下文类加载器（默认 AppClassLoader）让 Bootstrap 加载的 `java.sql.Driver` 反向加载第三方驱动；Tomcat 的 `WebAppClassLoader` 优先加载本应用 `/WEB-INF/lib` 再向上委托，实现 Spring 4/5 版本隔离。
- Learner-relevant: 打破委派的实战场景，关联 SPI 与 Tomcat 类隔离。

### 11.JVM是如何判断一个对象是可回收的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/11.JVM是如何判断一个对象是可回收的.md#11.JVM是如何判断一个对象是可回收的]]`
- Summary: JVM 采用可达性分析算法，从 GC Roots 出发遍历引用链，不可达对象判为可回收；引用计数法因循环引用死穴不被采用。
- Key claims: 引用计数法无法回收循环引用对象（A↔B 计数恒为 1）；GC Roots 含虚拟机栈局部变量引用、方法区静态属性引用、方法区常量引用、本地方法栈 JNI 引用四类。
- Learner-relevant: GC 理论起点，四种 GC Roots 是必背细节。

### 12.Java中的强引用、软引用、弱引用、虚引用有什么区别？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/12.Java中的强引用、软引用、弱引用、虚引用有什么区别？.md#12.Java 中的强引用、软引用、弱引用、虚引用有什么区别？]]`
- Summary: 四种引用按强度递减，区别在 GC 回收态度：强引用誓死不收、软引用内存不足才收、弱引用见 GC 就收、虚引用仅用于回收通知。
- Key claims: 软引用适合做内存敏感缓存；弱引用典型用于 `ThreadLocal` 与 `WeakHashMap` 防内存泄漏；虚引用无法 `get()`，配合引用队列用于管理堆外内存释放。
- Learner-relevant: 连接可达性判定与真实内存管理用法。

### 13.常见的垃圾收集算法有哪些

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/13.常见的垃圾收集算法有哪些.md#13.常见的垃圾收集算法有哪些]]`
- Summary: 介绍标记-清除、标记-复制、标记-整理三种基础算法及分代收集策略，本质是时间与空间的权衡。
- Key claims: 标记-清除简单但产生内存碎片；标记-复制高效无碎片但浪费内存，新生代用 Eden:Survivor=8:1 只浪费 10%；分代收集下新生代用复制、老年代用清除或整理。
- Learner-relevant: GC 算法总览，为收集器对比打基础。

### 14.什么是STW

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/14.什么是STW.md#14.什么是STW]]`
- Summary: STW（Stop The World）是 GC 时强制暂停所有用户线程以保证引用关系一致性、准确标记垃圾的机制。
- Key claims: 所有收集器都会触发 STW，CMS/G1 只是切碎或缩短停顿；Full GC 停顿最长可能达数十秒到分钟级；调优在吞吐量优先与响应时间优先间取舍。
- Learner-relevant: 解释 GC 卡顿根因，是收集器演进史的主线。

### 15.常见的垃圾收集器有哪些

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/15.常见的垃圾收集器有哪些.md#15.常见的垃圾收集器有哪些]]`
- Summary: 按串行、并行、并发、全能四类梳理 Serial、Parallel、CMS、G1 的特征、目标与适用场景。
- Key claims: Parallel 关注吞吐量，是 JDK8 默认；CMS（ParNew+CMS）关注低延迟、并发标记清除但有碎片且 JDK14 被移除；G1 关注可预测停顿，JDK9 起默认，用 Region 打破物理分代，适合 6G+ 大内存。
- Learner-relevant: 收集器选型总表，衔接文件 16 与 20 的对比。

### 16.G1对比CMS优势在哪

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/16.G1对比CMS优势在哪.md#16.G1对比CMS优势在哪]]`
- Summary: 从碎片、停顿可控性、内存布局灵活性三方面对比 G1 与 CMS，说明 G1 为超大内存场景解决 CMS 遗留问题。
- Key claims: CMS 用标记-清除且不移动对象，碎片导致大对象分配触发 Full GC；G1 整体标记-整理、局部 Region 间标记-复制，天然无碎片；G1 支持 `-XX:MaxGCPauseMillis` 建立可预测停顿模型。
- Learner-relevant: 深化收集器理解，解释大内存下为何迁移到 G1。

### 17.Java中什么是三色标记算法

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/17.Java中什么是三色标记算法.md#17.Java 中什么是三色标记算法]]`
- Summary: 三色标记以白/灰/黑记录对象扫描状态，解决并发标记中用户线程修改引用导致的一致性（对象消失）问题。
- Key claims: 对象消失需同时满足黑色对象新增指向白色对象的边、灰色对象切断到该白色对象的边；CMS 用增量更新（破坏条件1，黑色重置为灰色），G1 用原始快照 SATB（破坏条件2，记录被删除的引用）配合写屏障。
- Learner-relevant: 并发 GC 的核心机制，解释 CMS 与 G1 的底层差异。

### 18.GC频繁有可能是什么原因造成的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/18.GC频繁有可能是什么原因造成的.md#18.GC频繁有可能是什么原因造成的]]`
- Summary: 从代码与配置两层面分析 GC 频繁成因：对象产生过快或存活过久导致老年代持续高水位。
- Key claims: 大对象在 Eden 放不下直接进老年代触发 Full GC；static Map 只存不删、ThreadLocal 未 remove 等内存泄漏让老年代可用空间递减至 OOM；`-Xms` 与 `-Xmx` 不一致引发扩容震荡、`-Xmn` 过小导致对象过早晋升。
- Learner-relevant: 把 GC 理论对接到线上问题的诊断清单。

### 19.如果线上出现了频繁GC的告警应该如何排查

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/19.如果线上出现了频繁GC的告警应该如何排查.md#19.如果线上出现了频繁GC的告警应该如何排查]]`
- Summary: 给出"观测—隔离—分析—解决"四步排查法：区分 GC 类型、jstat 诊断、摘流量后 jmap dump、MAT 离线分析。
- Key claims: 用 `jstat -gcutil <pid> 1000` 观察 Eden/O/Metaspace，老年代持续 90% 以上且 FG 后不降多为内存泄漏；Dump 前须先摘除负载均衡流量防止 STW 造成超时；用 MAT 的 Dominator Tree 与 Path to GC Roots 定位引用源。
- Learner-relevant: JVM 调优的实战操作流程，串联工具与内存区域知识。

### 20.ZGC是什么什么情况下考虑选择

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/JVM/20.ZGC是什么什么情况下考虑选择.md#20.ZGC是什么什么情况下考虑选择]]`
- Summary: 介绍低延迟收集器 ZGC 的染色指针、读屏障与近乎全程并发，并给出选用场景。
- Key claims: ZGC 目标为 TB 级堆下停顿控制在 10ms 内且不随堆增大而增长；染色指针把 GC 状态存在 64 位引用高位而非对象头，读屏障以指针自愈修正被移动对象地址；适合 32G+ 超大堆、对延迟零容忍业务，JDK21 分代 ZGC 提升吞吐量。
- Learner-relevant: 收集器演进前沿，收束 STW 优化主线。
