---
source: 小哲八股-Java基础与集合
source_type: codebase
source_lines: 2567
language: markdown
file_count: 45
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — Java基础与集合

## Overview (L1)

- Java 语言定位与面向对象基础 — 前言说明 Java 基础模块是面试开场白；覆盖 Java/C++ 对比（GC、指针、跨平台、单继承）、接口与抽象类的 Is-a/Can-do 选型、多态的三要素与动态绑定、static 的类级语义。
- 等值、包装与不可变对象 — 基本类型为何需要包装类、Java 只有值传递（JVM 栈帧证明）、== 与 equals 的区别、hashCode/equals 契约、Object.clone 浅拷贝与深拷贝方案。
- 数值精度与字符串深入 — 金额禁用 float/double、BigDecimal 必须用 compareTo、自动装箱拆箱与 NPE/缓存坑、Integer 缓存池、new String 对象数、String.intern 版本差异、String/StringBuilder/StringBuffer。
- 运行时机制与语言特性 — 反射的性能开销与优化、静态/动态代理及 JDK 与 CGLIB 对比、SPI 在 JDBC/Dubbo 的应用、泛型擦除与不支持泛型数组、Lambda 的 invokedynamic 实现、注解作为元数据。
- 异常体系与 JDK 版本 — 受检/非受检异常的设计差异、finally 是否一定执行（含 System.exit 例外）、JDK 8/11/17/21 各 LTS 核心新特性。
- 集合框架与 List 家族 — 集合框架两大根接口 Collection/Map；ArrayList 与 LinkedList 的结构/性能对比、1.5 倍扩容策略与空间换时间、CPU 缓存视角、CopyOnWriteArrayList 的写时复制与弱一致性。
- HashMap 与并发 Map — HashMap 1.7→1.8 的结构/插入/扩容差异、红黑树与 8/6 阈值、负载因子 0.75、1.7 死循环；ConcurrentHashMap 1.7 分段锁 vs 1.8 CAS+synchronized、协助扩容、禁 null、size 分段计数。
- 队列、有序集合与迭代器 — ArrayBlockingQueue vs LinkedBlockingQueue、PriorityQueue 二叉堆、DelayQueue 的 Leader-Follower、fail-fast 与 fail-safe、TreeMap/TreeSet 红黑树原理。

## Sections (L2)

### 前言

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/前言.md#前言]]`
- Summary: 说明 Java 基础模块的范围（语法、面向对象、基础特性），强调它是面试开场白。
- Key claims: 基础模块答不好可能直接终止面试；含课程更新与群入口。
- Learner-relevant: 为 Java 基础学习锚定整体范围与优先级。

### 1.Java和C++对比有什么不同

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/1.Java和C++对比有什么不同.md#1.Java和C++对比有什么不同]]`
- Summary: 从内存管理、指针、跨平台、继承四维度对比 Java 与 C++ 的设计哲学。
- Key claims: Java 有 GC、屏蔽指针、字节码跨平台、单继承+多接口；C++ 手动管理、指针运算、机器码、多继承。
- Learner-relevant: 建立 Java 在语言谱系中的定位与取舍。

### 2.Java中接口和抽象类的区别如何选择

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/2.Java中接口和抽象类的区别如何选择.md#2.Java中接口和抽象类的区别如何选择]]`
- Summary: 以 Is-a（抽象类，可存状态、单继承）与 Can-do（接口，无状态、多实现）区分并给出选型策略。
- Key claims: 需要共享状态/通用逻辑选抽象类；定义 API 契约、跨类族解耦选接口；接口无构造器。
- Learner-relevant: 面向对象设计选型的核心判据。

### 3.Java中多态如何理解

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/3.Java中多态如何理解.md#3.Java中多态如何理解]]`
- Summary: 解释多态的表现形式（父类引用指向子类对象）、三前提与动态绑定原理。
- Key claims: 需继承+重写+向上转型；编译看左边、运行看右边；成员变量无多态，private/static/final 为静态绑定。
- Learner-relevant: 理解运行时方法分派与解耦价值。

### 4.Java中有了基本类型为什么还需要包装类

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/4.Java中有了基本类型为什么还需要包装类.md#4.Java中有了基本类型为什么还需要包装类]]`
- Summary: 包装类让基本类型融入面向对象生态的三个理由。
- Key claims: 泛型/集合只能装引用类型；可表达 null 语义；提供工具方法；高性能场景仍优先基本类型。
- Learner-relevant: 连接基本类型与集合框架的关键桥。

### 5.Java是值传递还是引用传递

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/5.Java是值传递还是引用传递.md#5.Java是值传递还是引用传递]]`
- Summary: 用栈帧局部变量表证明 Java 只有值传递，引用传递的是地址值的副本。
- Key claims: 改属性会影响原对象（看似引用传递），重新赋值不影响（证明是值传递）。
- Learner-relevant: 参数传递语义的高频面试考点。

### 6.金额数可以用浮点数表示吗

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/6.金额数可以用浮点数表示吗.md#6.金额数可以用浮点数表示吗]]`
- Summary: 浮点数二进制无法精确表示小数，金额场景应使用 BigDecimal。
- Key claims: 0.1+0.2!=0.3；浮点不能用 == 比较；BigDecimal 必须用 String 构造或 valueOf。
- Learner-relevant: 精度与金融计算的安全实践。

### 7.Java中BigDecimal的equals方法可以做等值比较吗

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/7.Java中BigDecimal的equals方法可以做等值比较吗.md#7.Java中BigDecimal的equals方法可以做等值比较吗]]`
- Summary: BigDecimal 的 equals 会比较 scale，数值比较必须用 compareTo。
- Key claims: 1.0.equals(1.00) 为 false；compareTo()==0 才表数值相等。
- Learner-relevant: 与金额精度主题配套的等值比较避坑。

### 8.hashCode与equals之间有什么关系_如果只重写equals,不重写hashCode会引发什么问题_

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/8.hashCode与equals之间有什么关系_如果只重写equals,不重写hashCode会引发什么问题_.md#8.hashCode与equals之间有什么关系?如果只重写equals,不重写hashCode会引发什么问题?]]`
- Summary: 说明 hashCode 定桶位置、equals 判重复，违反契约会导致 HashMap/HashSet 失效。
- Key claims: equals 为 true 则 hashCode 必须相等（反之不必然）；只重写 equals 会取不到数据甚至重复存入。
- Learner-relevant: 哈希集合正确性的基础契约。

### 9.==与equals有什么区别

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/9.==与equals有什么区别.md#9.==与equals有什么区别]]`
- Summary: == 比地址/数值，equals 默认为 ==、常被重写为比内容。
- Key claims: 基本类型 == 比数值，引用类型 == 比内存地址；String/Integer 重写 equals 比内容。
- Learner-relevant: 等值判断的分层理解。

### 10.为什么Object.clone()是浅拷贝如何实现深拷贝

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/10.为什么Object.clone()是浅拷贝如何实现深拷贝.md#10.为什么Object.clone()是浅拷贝如何实现深拷贝]]`
- Summary: Object.clone 按位拷贝字段，引用字段共享同一对象；深拷贝用序列化或递归 clone。
- Key claims: 浅拷贝下修改内部 List 会互相影响；推荐序列化/JSON 方案，递归 clone 难维护。
- Learner-relevant: 对象复制的共享陷阱与深拷贝实践。

### 11.什么是自动装箱与拆箱_频繁装箱有什么影响_

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/11.什么是自动装箱与拆箱_频繁装箱有什么影响_.md#11.什么是自动装箱与拆箱?频繁装箱有什么影响?]]`
- Summary: 装箱/拆箱是编译器插入 valueOf/xxxValue 的语法糖，频繁使用有性能与 NPE 风险。
- Key claims: 循环装箱产生大量临时对象加重 GC；null 拆箱抛 NPE；Integer 缓存导致 == 陷阱。
- Learner-relevant: 连接包装类与性能/正确性。

### 12.Integer的缓存池机制是如何工作的_缓存范围是多少_如何调整_

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/12.Integer的缓存池机制是如何工作的_缓存范围是多少_如何调整_.md#12.Integer的缓存池机制是如何工作的?缓存范围是多少?如何调整?]]`
- Summary: IntegerCache 以享元模式预缓存 -128~127，valueOf 命中则复用引用。
- Key claims: 下限写死不可变，上限可经 -XX:AutoBoxCacheMax 调大；new Integer 永不走缓存。
- Learner-relevant: 解释装箱 == 结果的底层原因。

### 13.newString(abc)到底创建了几个对象_请分情况讨论字符串常量池的状态

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/13.newString(abc)到底创建了几个对象_请分情况讨论字符串常量池的状态.md#13.new String(abc)到底创建了几个对象?请分情况讨论字符串常量池的状态]]`
- Summary: new String("abc") 创建 1 或 2 个对象，取决于常量池是否已有该字面量。
- Key claims: 池中没有则先建池对象再 new（2 个）；已有则只 new（1 个）；new 出的对象与池中地址不同。
- Learner-relevant: 字符串常量池与堆对象的经典题。

### 14.String.intern()方法是什么_在JDK16、17和18中的实现有何不同

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/14.String.intern()方法是什么_在JDK16、17和18中的实现有何不同.md#14.String.intern()方法是什么?在JDK 16、17和18中的实现有何不同]]`
- Summary: intern 保证字符串在常量池唯一；1.6 深拷贝进永久代，1.7+ 改为堆中存引用。
- Key claims: 1.7 起 intern 变浅拷贝，返回引用与原对象相同；1.8 逻辑同 1.7。
- Learner-relevant: 常量池位置与内存优化的版本演进。

### 15.什么是反射_它会带来哪些性能开销_如何优化_

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/15.什么是反射_它会带来哪些性能开销_如何优化_.md#15.什么是反射?它会带来哪些性能开销?如何优化?]]`
- Summary: 反射在运行时获取类信息并调用，是 Spring/MyBatis 基石，但存在性能开销。
- Key claims: 慢在动态解析、安全检查、参数装箱、JIT 无法内联；优化手段有缓存、setAccessible、MethodHandle/字节码生成。
- Learner-relevant: 框架底层机制与性能优化的连接点。

### 16.静态代理与动态代理的区别是什么_JDK动态代理与CGLIB动态代理有何不同_

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/16.静态代理与动态代理的区别是什么_JDK动态代理与CGLIB动态代理有何不同_.md#16.静态代理与动态代理的区别是什么?JDK动态代理与CGLIB动态代理有何不同?]]`
- Summary: 静态代理编译期硬编码，动态代理运行时生成；JDK 基于接口，CGLIB 基于继承。
- Key claims: JDK 需接口、CGLIB 不能代理 final；Spring Boot 2.0 后默认倾向 CGLIB。
- Learner-relevant: AOP 实现机制与选型。

### 17.如何理解Java的SPI机制_它在JDBC或Dubbo中是如何应用的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/17.如何理解Java的SPI机制_它在JDBC或Dubbo中是如何应用的.md#17.如何理解Java的SPI机制?它在JDBC或Dubbo中是如何应用的]]`
- Summary: SPI 以接口定义+第三方实现+运行时加载实现解耦，JDBC 与 Dubbo 是典型应用。
- Key claims: JDK SPI 用 META-INF/services + ServiceLoader，但一次性实例化且无别名；Dubbo ExtensionLoader 支持按需加载、IOC/AOP、@Adaptive。
- Learner-relevant: 插件化/服务发现机制的设计取舍。

### 18.什么是泛型擦除_为什么Java不支持泛型数组

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/18.什么是泛型擦除_为什么Java不支持泛型数组.md#18.什么是泛型擦除?为什么Java不支持泛型数组]]`
- Summary: Java 泛型仅存在于编译期，运行时被擦除为上界；数组具体化与协变和泛型冲突故禁泛型数组。
- Key claims: 擦除为向后兼容；若允许泛型数组，协变+擦除会绕过运行时检查导致 ClassCastException。
- Learner-relevant: 泛型与数组类型系统冲突的核心解释。

### 19.Lambda表达式的底层实现原理是什么

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/19.Lambda表达式的底层实现原理是什么.md#19.Lambda表达式的底层实现原理是什么]]`
- Summary: Lambda 非匿名内部类语法糖，依赖 invokedynamic + LambdaMetafactory 在运行时生成实现类。
- Key claims: 编译期生成私有静态方法并埋 invokedynamic；运行期动态生成函数式接口实现；懒加载、无需磁盘 I/O。
- Learner-relevant: 函数式编程的 JVM 底层机制。

### 20.String、StringBuilder和StringBuffer的区别

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/20.String、StringBuilder和StringBuffer的区别.md#20.String、StringBuilder和StringBuffer的区别]]`
- Summary: String 不可变；StringBuilder 可变但不安全；StringBuffer 可变且方法加 synchronized。
- Key claims: String 底层 final 数组，拼接产生新对象；性能 StringBuilder > StringBuffer >> String。
- Learner-relevant: 字符串拼接的选型与线程安全权衡。

### 21.Java的注解是什么

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/21.Java的注解是什么.md#21.Java的注解是什么]]`
- Summary: 注解本质是元数据，本身无逻辑，靠编译器或反射读取才会生效。
- Key claims: @Target 定位置、@Retention 定生命周期；RUNTIME 注解是 Spring/MyBatis 基础设施。
- Learner-relevant: 框架声明式编程的底层前提。

### 22.Java中异常分哪两类？有什么区别？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/22.Java中异常分哪两类？有什么区别？.md#22.Java中异常分哪两类？有什么区别？]]`
- Summary: 异常分受检（编译器强制处理）与非受检（继承 RuntimeException，运行期逻辑错误）。
- Key claims: IOException/SQLException 属受检；NPE/越界/除零属非受检；前者代表外部不确定，后者应改代码。
- Learner-relevant: 异常处理策略与健壮性设计。

### 23.Java中trycatchfinally中的finally代码块一定会执行吗

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/23.Java中trycatchfinally中的finally代码块一定会执行吗.md#23.Java中try catch finally中的finally代码块一定会执行吗]]`
- Summary: finally 通常一定执行（连 try 里 return 也会先暂存再执行），但极端情况不执行。
- Key claims: System.exit、JVM 崩溃、线程被 kill 会跳过 finally；不建议在 finally 写 return。
- Learner-relevant: 资源释放与 try/finally 执行顺序。

### 24.JDK各个版本中都有哪些新特性

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/24.JDK各个版本中都有哪些新特性.md#24.JDK各个版本中都有哪些新特性]]`
- Summary: 聚焦四个 LTS 版本（8/11/17/21）的标志性特性。
- Key claims: 8 引入 Lambda/Stream、新日期 API、HashMap 红黑树；11 var/HttpClient；17 Record/Text Blocks/Switch 表达式；21 虚拟线程、Sequenced Collections。
- Learner-relevant: 版本特性地图，便于对照后文源码差异。

### 25.如何理解static关键字

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java基础/25.如何理解static关键字.md#25.如何理解static关键字]]`
- Summary: static 表示属于类而非对象，覆盖变量、方法、代码块、内部类四个维度。
- Key claims: 静态方法无 this/super、不能直接访问非静态成员；静态代码块类加载时执行一次；静态内部类不持有外部引用。
- Learner-relevant: 类级数据共享与工具类/单例的基础。

### 1.介绍一下Java的集合框架是怎样的

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/1.介绍一下Java的集合框架是怎样的.md#1.介绍一下Java的集合框架是怎样的]]`
- Summary: 集合框架由 Collection（List/Set/Queue）与独立的 Map 两大派系加工具类构成。
- Key claims: Map 不继承 Collection；HashMap 为数组+链表+红黑树、非线程安全；Collections 是工具类、Iterator 是标准遍历方式。
- Learner-relevant: 整套集合知识的顶层地图。

### 2.ArrayList与LinkedList在物理存储随机访问性能插入删除开销上的对比

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/2.ArrayList与LinkedList在物理存储随机访问性能插入删除开销上的对比.md#2.ArrayList与LinkedList在物理存储随机访问性能插入删除开销上的对比]]`
- Summary: 数组连续 vs 链表分散，随机访问 O(1) vs O(N)，头尾增删各有优劣。
- Key claims: ArrayList 中间增删 O(N) 需搬移，LinkedList 节点多存 prev/next 更占内存；按索引插入仍需先 O(N) 查找。
- Learner-relevant: List 选型的结构基础。

### 3.ArrayList的扩容策略是什么

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/3.ArrayList的扩容策略是什么.md#3.ArrayList的扩容策略是什么]]`
- Summary: JDK 1.8 懒加载默认容量 10，扩容为旧容量 1.5 倍并经 System.arraycopy 搬运。
- Key claims: 公式 oldCap + (oldCap>>1)；扩容是 O(N)；预估容量时应用 new ArrayList<>(n) 避免多次扩容。
- Learner-relevant: 动态数组的性能成本与预设容量的实践。

### 4.ArrayList的扩容为什么不是按需扩容？倍数扩容不会导致内存浪费吗？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/4.ArrayList的扩容为什么不是按需扩容？倍数扩容不会导致内存浪费吗？.md#4.ArrayList的扩容为什么不是按需扩容？倍数扩容不会导致内存浪费吗？]]`
- Summary: 按需扩容会退化为 O(N²)，倍数扩容以少量空间浪费换取均摊 O(1)。
- Key claims: 每次 +1 导致 1+2+…+N 次拷贝；倍数扩容低频发生，均摊成本 O(1)；可指定初始容量折中。
- Learner-relevant: 空间换时间的复杂度分析范例。

### 5.为什么在现代CPU架构下ArrayList往往比LinkedList性能更好

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/5.为什么在现代CPU架构下ArrayList往往比LinkedList性能更好.md#5.为什么在现代CPU架构下ArrayList往往比LinkedList性能更好]]`
- Summary: CPU 以 Cache Line 取数，ArrayList 连续内存契合空间局部性，LinkedList 易 Cache Miss。
- Key claims: Cache Line 通常 64 字节；链表节点含指针降低缓存有效利用率。
- Learner-relevant: 用硬件缓存视角解释理论复杂度与实际性能的偏差。

### 6.CopyOnWriteArrayList的实现原理及适用场景。为什么它是“弱一致性”的？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/6.CopyOnWriteArrayList的实现原理及适用场景。为什么它是“弱一致性”的？.md#6.CopyOnWriteArrayList的实现原理及适用场景。为什么它是“弱一致性”的？]]`
- Summary: 读写分离，读无锁、写加锁并复制新数组；迭代器持旧数组快照故弱一致。
- Key claims: 适用读多写少（白名单/监听器）；缺点是写时复制整数组、内存与 GC 压力大且不实时。
- Learner-relevant: 并发容器一致性与适用场景判断。

### 7.请详细描述HashMap在JDK1.7与JDK1.8中的数据结构差异

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/7.请详细描述HashMap在JDK1.7与JDK1.8中的数据结构差异.md#7.请详细描述HashMap在JDK 1.7与JDK 1.8中的数据结构差异]]`
- Summary: 1.7 数组+链表、头插法、rehash；1.8 加红黑树、改尾插法、用位运算免 rehash。
- Key claims: 链表>8 且数组>64 才转树；1.8 扩容依 hash&oldCap 决定原地或原下标+oldCap。
- Learner-relevant: HashMap 演进的核心主线。

### 8.Java的HashMap为什么要引入红黑树？链表转红黑树的阈值为什么是8？退化阈值为什么是6？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/8.Java的HashMap为什么要引入红黑树？链表转红黑树的阈值为什么是8？退化阈值为什么是6？.md#8.Java的HashMap为什么要引入红黑树？链表转红黑树的阈值为什么是8？退化阈值为什么是6？]]`
- Summary: 红黑树兜底极端冲突为 O(logN)；阈值 8 基于泊松分布，退化 6 防震荡。
- Key claims: 树节点约占两倍空间；桶内 8 个节点概率仅约 0.00000006；6~8 间留缓冲避免链表/树频繁切换。
- Learner-relevant: 数据结构阈值背后的统计学与工程权衡。

### 9.Java的HashMap的扩容机制是怎样的？负载因子为什么默认是0.75？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/9.Java的HashMap的扩容机制是怎样的？负载因子为什么默认是0.75？.md#9.Java的HashMap的扩容机制是怎样的？负载因子为什么默认是0.75？]]`
- Summary: 容量*负载因子为阈值，双倍扩容，1.8 用 hash&oldCap 免 rehash；0.75 是时空折中。
- Key claims: 默认 16*0.75=12 触发扩容；1.0 冲突严重、0.5 频繁扩容浪费。
- Learner-relevant: 哈希表容量与冲突率的平衡直觉。

### 10.HashMap的死循环问题在JDK1.7中是如何产生的？JDK1.8解决了吗？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/10.HashMap的死循环问题在JDK1.7中是如何产生的？JDK1.8解决了吗？.md#10.HashMap的死循环问题在JDK 1.7中是如何产生的？JDK 1.8解决了吗？]]`
- Summary: 1.7 并发扩容头插法使链表倒置并可能成环；1.8 尾插法保持顺序根除死循环。
- Key claims: 成环后 get 无限循环致 CPU 100%；1.8 仍线程不安全（会覆盖数据）。
- Learner-relevant: 并发误用非线程安全容器的严重后果。

### 11.ConcurrentHashMap在JDK17与JDK18中的实现有何本质区别

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/11.ConcurrentHashMap在JDK17与JDK18中的实现有何本质区别.md#11.ConcurrentHashMap在JDK 17与JDK 18中的实现有何本质区别]]`
- Summary: 1.7 分段锁（Segment+HashEntry，并发度 16）；1.8 抛弃 Segment，改 CAS+synchronized 锁头节点。
- Key claims: 1.8 空槽用 CAS 无锁插入、有数据只锁链表头；并发度随数组长度增长。
- Learner-relevant: 并发 Map 锁粒度演进。

### 12.ConcurrentHashMap是如何实现扩容的？多线程协助扩容的机制是怎样的？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/12.ConcurrentHashMap是如何实现扩容的？多线程协助扩容的机制是怎样的？.md#12.ConcurrentHashMap是如何实现扩容的？多线程协助扩容的机制是怎样的？]]`
- Summary: transferIndex 分片(步长16)、ForwardingNode 感知、多线程 helpTransfer 协助迁移。
- Key claims: 遇 hash=-1 的 fwd 节点不阻塞而加入扩容；迁移按 hash&oldCap 高低位拆分，读操作转发新表。
- Learner-relevant: 并发扩容不停止世界的设计。

### 13.为什么ConcurrentHashMap不允许Key或Value为null？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/13.为什么ConcurrentHashMap不允许Key或Value为null？.md#13.为什么ConcurrentHashMap不允许Key或Value为null？]]`
- Summary: 多线程下 get 返回 null 有二义性，check-then-act 非原子，故禁 null。
- Key claims: 无法区分“键不存在”与“值为 null”；确认期间数据可能被其他线程改动。
- Learner-relevant: 并发环境下 API 设计的保守取舍。

### 14.ConcurrentHashMap的size()方法是如何保证高并发下的统计准确性的？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/14.ConcurrentHashMap的size()方法是如何保证高并发下的统计准确性的？.md#14.ConcurrentHashMap的size()方法是如何保证高并发下的统计准确性的？]]`
- Summary: 用 LongAdder 式热点分散：baseCount + CounterCell 数组，size 求和无需加锁。
- Key claims: 高并发下 baseCount CAS 失败则落到 CounterCell 分片更新；size 是弱一致近似值。
- Learner-relevant: 高并发计数与 LongAdder 的经典实现。

### 15.ArrayBlockingQueue与LinkedBlockingQueue在实现上有何区别？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/15.ArrayBlockingQueue与LinkedBlockingQueue在实现上有何区别？.md#15.ArrayBlockingQueue与LinkedBlockingQueue在实现上有何区别？]]`
- Summary: 前者单锁读写互斥、数组预分配；后者 putLock/takeLock 锁分离、链表逐节点创建。
- Key claims: ABQ 有界不可扩容、GC 友好；LBQ 默认容量 Integer.MAX_VALUE，易 OOM 且 GC 压力大。
- Learner-relevant: 阻塞队列的并发性能与内存权衡。

### 16.PriorityQueue的底层数据结构是什么？它是如何维持堆属性的？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/16.PriorityQueue的底层数据结构是什么？它是如何维持堆属性的？.md#16.PriorityQueue的底层数据结构是什么？它是如何维持堆属性的？]]`
- Summary: 物理动态数组、逻辑完全二叉树（小顶堆），入队上浮、出队下沉维持堆序。
- Key claims: 孩子下标 2i+1/2i+2、父节点 (i-1)/2；操作复杂度 O(logN)。
- Learner-relevant: 堆数据结构与优先队列实现。

### 17.DelayQueue的实现原理及其在定时任务中的应用。

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/17.DelayQueue的实现原理及其在定时任务中的应用。.md#17.DelayQueue的实现原理及其在定时任务中的应用。]]`
- Summary: 内部用 PriorityQueue，元素须实现 Delayed；take 用 Leader-Follower 精准等待。
- Key claims: 队头永远最快过期；只有 Leader 限时 awaitNanos，Follower 无限等待；适合订单超时、缓存淘汰。
- Learner-relevant: 延时任务与减少无效唤醒的线程协作模式。

### 18.Java中的集合框架中，什么是fail-fast？什么是fail-safe？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/18.Java中的集合框架中，什么是fail-fast？什么是fail-safe？.md#18.Java中的集合框架中，什么是fail-fast？什么是fail-safe？]]`
- Summary: fail-fast 用 modCount 检测并发修改抛异常；fail-safe 基于副本/弱一致不抛异常。
- Key claims: ArrayList/HashMap 是 fail-fast，CopyOnWriteArrayList/ConcurrentHashMap 是 fail-safe；后者可能读到旧数据。
- Learner-relevant: 迭代期间修改集合的行为差异。

### 19.TreeMap和TreeSet的原理是怎样的？

- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Java集合/19.TreeMap和TreeSet的原理是怎样的？.md#19.TreeMap和TreeSet的原理是怎样的？]]`
- Summary: TreeMap 基于红黑树保证 Key 有序，增删查稳定 O(logN)；TreeSet 是 TreeMap 的包装。
- Key claims: TreeSet.add 实为 treeMap.put(element, PRESENT)；TreeMap 的 Key 不能为 null。
- Learner-relevant: 有序集合与红黑树的自平衡特性。
