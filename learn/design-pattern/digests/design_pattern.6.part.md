---
source: design_pattern
source_lines: 24398
part: 6
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 6)

## Overview (L1)

- **第 5 节：单例模式**：创建型模式的最后一个，给出 7 种单例实现（静态类、懒汉线程不安全/线程安全、饿汉、静态内部类、双重锁校验 DCL、CAS AtomicReference、Effective Java 作者 Joshua Bloch 推荐的枚举单例），逐一分析懒加载与线程安全取舍并做调用验证。
- **第 1 节：适配器模式**：结构型模式第一讲，围绕"营销系统接收多种 MQ 消息（注册开户、内部订单、第三方 POP 订单）字段名各不相同 + 首单判断接口不一致"的场景，演示如何用适配器把差异化接口和差异化 MQ 消息体统一输出。

## Sections (L2)

### Singleton: 开发环境
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 开发环境]]`
- Summary: 指明本节的工程环境为 JDK 1.8、Idea + Maven，涉及 1 个工程，源码需关注公众号 bugstack 虫洞栈回复"源码下载"获取（序号 18）。
- Key claims: 学习讲究"书不是看的，是用的"，提倡逐字逐句深挖、亲力亲为实践，而非把视频当电影、书籍当故事看。
- Learner-relevant: 建立动手实践预期，后续 7 种实现都需自行跑通才真正掌握。

### Singleton: 单例模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 单例模式介绍]]`
- Summary: 说明单例模式是整个设计模式中最简单的模式之一，核心诉求是保证一个类只有一个实例（哪怕多线程并发访问），并提供全局访问该实例的点。
- Key claims: 单例主要解决一个全局使用的类被频繁创建和消费的问题，从而提升整体代码性能。
- Learner-relevant: 抓住"单一实例 + 全局访问点"两个本质，为理解各实现变体的取舍打下基础。

### Singleton: 案例场景
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 案例场景]]`
- Summary: 列举单例模式的日常应用场景：数据库连接池不会反复创建、Spring 中单例 bean 的生成与使用、全局属性保存在代码中的设置。
- Key claims: 单例模式虽不复杂但使用面较广，日常开发中大致以上述几类场景出现。
- Learner-relevant: 用熟悉的场景锚定单例模式的价值，便于迁移到自己的工程。

### Singleton: 7种单例模式实现（总述）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 7种单例模式实现]]`
- Summary: 单例实现方式较多，主要在是否支持懒加载（懒汉模式）、是否线程安全上运用各项技巧；也有场景无需懒加载，直接使用 static 静态类或静态属性和方法供外部调用。
- Key claims: 实现方式的分野集中在"懒汉 vs 饿汉"与"线程安全"两个维度。
- Learner-relevant: 提供一张总览地图，随后 7 个实现小节逐一落位。

### Singleton: 静态类使用（第0种）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 静态类使用]]`
- Summary: 展示 `Singleton_00`，用 `public static Map` 静态成员在首次运行时直接初始化缓存，作为最朴素的做法。
- Key claims: 不需要维持任何状态、仅用于全局访问时静态类更方便；但若需要被继承或维持特定状态，则适合用单例模式。
- Learner-relevant: 区分"静态类"与"单例模式"的适用边界。

### Singleton: 懒汉模式（线程不安全）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 懒汉模式（线程不安全）]]`
- Summary: `Singleton_01` 将构造方法设为 private 禁止外部直接 `new`，在 `getInstance` 中判空后创建实例。
- Key claims: 满足懒加载，但多线程同时获取时会创建多个实例并存（类比一堆人抢厕所），达不到单例要求。
- Learner-relevant: 记住"私有构造 + 判空创建"的基本骨架及其线程隐患。

### Singleton: 懒汉模式（线程安全）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 懒汉模式（线程安全）]]`
- Summary: `Singleton_02` 在 `getInstance` 方法上直接加 `synchronized` 实现线程安全。
- Key claims: 安全但把锁加在方法上，所有访问都因需要锁占用而浪费资源，非特殊情况不建议此方式。
- Learner-relevant: 体会"方法级锁"粒度粗、开销大的缺点，为后续优化（DCL、CAS）铺垫。

### Singleton: 饿汉模式（线程安全）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 饿汉模式（线程安全）]]`
- Summary: `Singleton_03` 在类加载时直接 `new` 实例（与开头的静态 Map 初始化一致），程序启动即创建，后续直接获取。
- Key claims: 不是懒加载，无论是否用到该类都会在启动之初创建，如同游戏启动就把全部地图实例化导致手机内存满、卡顿。
- Learner-relevant: 掌握"启动即建、天然线程安全、但非懒加载"的代价模型。

### Singleton: 使用类的静态内部类（线程安全）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 使用类的静态内部类]]`
- Summary: `Singleton_04` 通过静态内部类 `SingletonHolder` 持有实例，`getInstance` 返回 `SingletonHolder.instance`。
- Key claims: 既保证线程安全又保证懒加载，且不会因加锁耗费性能；JVM 虚拟机保证类的构造方法在多线程环境下可被正确加载；是非常推荐的一种单例实现。
- Learner-relevant: 作为推荐的实现方案，理解"JVM 类加载机制天然提供线程安全 + 懒加载"。

### Singleton: 双重锁校验（线程安全）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 双重锁校验]]`
- Summary: `Singleton_05` 先在外层判空直接返回，再进 `synchronized(Singleton_05.class)` 块内二次判空后创建实例（DCL，Double-Checked Locking）。
- Key claims: 双重锁是方法级锁的优化，减少了部分获取实例的耗时，同时满足懒加载。
- Learner-relevant: 掌握 DCL 的"两重判空 + 类锁"写法及其在加锁粒度上的改进。

### Singleton: CAS「AtomicReference」（线程安全）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: CAS AtomicReference]]`
- Summary: `Singleton_06` 用 `AtomicReference<Singleton_06>` 包装实例，在自旋循环中先取值判空，再用 `compareAndSet(null, new Singleton_06())` 原子替换，并给出 main 打印两次同一地址的验证。
- Key claims: java 并发库提供 AtomicInteger/AtomicBoolean/AtomicLong/AtomicReference 等原子类；CAS 不依赖传统加锁，靠忙等算法与底层硬件保证线程安全，无线程切换和阻塞开销、可支持较大并发；缺点是忙等，一直获取不到会陷入死循环。
- Learner-relevant: 见识"无锁并发"思路在单例上的应用，同时记住忙等死循环的代价。

### Singleton: Effective Java 作者推荐的枚举单例（线程安全）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: Effective Java 作者推荐的枚举单例]]`
- Summary: `Singleton_07` 用单元素枚举 `enum Singleton_07 { INSTANCE; }` 实现单例，调用方式为 `Singleton_07.INSTANCE.test()`；介绍作者 Joshua Bloch（约书亚·布洛克），曾为 Java 平台设计并实现许多功能、担任过 Google 首席 Java 架构师。
- Key claims: 该方式解决了最主要的线程安全、自由串行化、单一实例三件事；与公有域方法功能相近但更简洁，无偿提供串行化机制，绝对防止对此实例化（即使面对复杂的串行化或反射攻击），单元素枚举类型已成为实现 Singleton 的最佳方法；但此方式在存在继承场景下不可用。
- Learner-relevant: 记住"枚举单例 = 最佳实践"这一结论及其对反射/序列化攻击的天然防御，并了解继承场景的限制。

### Singleton: 总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 总结]]`
- Summary: 回看单例模式的各种实现，可以看到 Java 基本功的体现：懒汉、饿汉、线程安全、静态类、内部类、加锁、串行化等。
- Key claims: 若类全局可用且无需懒加载，直接创建给外部调用即可；若有大量类需在用户触发条件（如游戏关卡）后才显示，则必须用懒加载；线程安全按需选择；建议学习时多加实践，并推荐阅读 Effective Java、关注 Joshua Bloch 的 Github（github.com/jbloch）。
- Learner-relevant: 给出实现选择的决策清单，并把读者引向 Effective Java 进一步深挖。

### Adapter: 开篇与设计模式观
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 开篇与设计模式观]]`
- Summary: 以"擦屁屁纸 80% 的面积都是保护手的"引入适配器，指出工作三年左右的程序员读 Spring/Mybatis/Dubbo 源码费劲的原因：框架复杂度随时间增长，核心代码只占约 20%，其余大部分是为保证核心流程正常运行的辅助代码；框架中不仅用设计模式，而且常是多种模式综合运用。
- Key claims: Spring 源码中搜 `Adapter` 会出现很多实现类，如 `UserCredentialsDataSourceAdapter`；适配器在生活里随处可见（万能充、数据线、MAC 转换头、出国插座转换器等）。
- Learner-relevant: 用框架源码实例（Spring Adapter）证明适配器模式的实际存在，建立"综合运用设计模式"的阅读心态。

### Adapter: 开发环境
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 开发环境]]`
- Summary: 环境为 JDK 1.8、Idea + Maven，涉及三个工程：`itstack-demo-design-6-00`（场景模拟工程，模拟多个 MQ 消息体）、`itstack-demo-design-6-01`（用一坨代码实现业务需求）、`itstack-demo-design-6-02`（通过设计模式优化改造代码，产生对比性从而学习）。
- Key claims: 通过 00→01→02 三个工程形成"原始场景 → 坏实现 → 模式重构"的对照学习路径。
- Learner-relevant: 明确本节工程结构，为对照学习建立索引。

### Adapter: 适配器模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 适配器模式介绍]]`
- Summary: 适配器模式的主要作用是把原本不兼容的接口通过适配修改做到统一，让用户方便使用，如同万能充、数据线、转换头、出国插座都是为适配各种不同的"口"做兼容。
- Key claims: 业务开发中常需做不同接口的兼容，尤其是中台服务需要把各个业务线的各种类型服务统一包装后再对外提供接口。
- Learner-relevant: 记住经典定义——将原本不兼容的接口通过适配修改做到统一，并把"中台统一包装"作为落地场景。

### Adapter: 案例场景模拟
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 案例场景模拟]]`
- Summary: 随业务发展，基础系统成型后要做用户拉新促活保障 DAU 增速与 ROI 转化，于是出现营销系统（裂变、拉客、每月首单奖励等）；系统需要接收各种各样的 MQ 消息或接口，若一个个开发则成本大、后期拓展难。
- Key claims: 希望有一个系统可以配置一下就把外部 MQ 接入（如注册开户消息、商品下单消息）；适配器思想恰好可运用到这里——适配器不只可以适配接口，往往还可以适配一些属性信息。
- Learner-relevant: 建立"MQ 接入成本高、需要统一接入"的业务动机，并记住"适配器也能适配属性"这一关键扩展点。

### Adapter: 场景模拟工程（三种 MQ + 两个接口）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 场景模拟工程]]`
- Summary: 工程 `itstack-demo-design-6-00` 模拟三个不同类型的 MQ 消息（`create_account` 注册开户、`OrderMq` 内部订单、`POPOrderDelivered` 第三方订单）与两个查询接口（`OrderService.queryUserOrderCount` 查内部下单数量、`POPOrderService.isFirstOrder` 判第三方是否首单）。
- Key claims: 三个 MQ 消息体中都有用户 ID、时间、业务 ID 等必要字段，但字段属性并不一致（如用户 ID 在不同 MQ 里叫 `uId`、`uid`、`number` 等）；两个接口的判断逻辑和出参都不同（一个查订单数量，一个直接判首单）。
- Learner-relevant: 用具体字段差异（number/uid/uId）体会"同值不同名"的兼容问题，这是后续适配的核心输入。

### Adapter: 场景简述（各 MQ 与接口的字段细节）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 场景简述]]`
- Summary: 逐一展示 `create_account`（number 开户编号、address 开户地、accountDate 开户时间、desc 描述）、`OrderMq`（uid 用户 ID、sku 商品、orderId 订单 ID、createOrderTime 下单时间）、`POPOrderDelivered`（uId 用户 ID、orderId 订单号、orderTime 下单时间、sku 商品、skuName 商品名称、decimal 金额）、`OrderService`（`queryUserOrderCount` 返回 long 订单数量）与 `POPOrderService`（`isFirstOrder` 返回 boolean 是否首单）。
- Key claims: 不同 MQ 及不同接口是对同一信息的不同表达，后续将对它们做相应适配。
- Learner-relevant: 记住三类 MQ 字段映射表与两个接口签名，作为理解适配映射（link）的素材。

### Adapter: 用一坨代码实现（未使用模式）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 用一坨代码实现]]`
- Summary: 工程 `itstack-demo-design-6-01` 以最朴素的方式实现：为每个 MQ 建一个消费类（`create_accountMqService`、`OrderMqService`、`POPOrderDeliveredService`），在 `onMessage` 里用 `JSON.parseObject` 解析消息后逐字段取用处理业务。
- Key claims: 大部分时候接 MQ 都是创建一个类用于消费、把 MQ 消息属性转换给自己的方法；但当 MQ 消息增加到几十几百个，这种写法作为中台就很难优化。
- Learner-relevant: 先看"坏味道"——每新增一个 MQ 就新增一个手工类，为理解适配器的价值设对照。

### Adapter: 适配器模式重构代码（总述）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 适配器模式重构代码]]`
- Summary: 用适配器模式做一次小重构，核心是"多种差异化类型的接口做统一输出"；本节同时体现接口适配与 MQ 消息体适配两种（后者是把适配思想从接口换到 MQ 消息体，增加认知）；若接收 MQ 后不想一个个开发消费类，还可配合代理类处理。
- Key claims: 工厂方法模式中的不同种类奖品处理其实也是适配器的应用；MQ 兼容的核心部分是处理适配不同类型的字段。
- Learner-relevant: 强调"统一输出"目标，并预告"MQ 适配 + 接口适配"双线结构。

### Adapter: 工程结构（重构后）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 工程结构（重构后）]]`
- Summary: 工程 `itstack-demo-design-6-02` 的包结构包含 `RebateInfo`（统一 MQ 消息体）、`MQAdapter`（MQ 消息适配类）、`OrderAdapterService` 接口及其两个实现 `InsideOrderService`、`POPOrderAdapterServiceImpl`（接口适配）。
- Key claims: 适配器模型结构包含接口适配与 MQ 适配两类；业务发展很快需要对下单用户首单才给奖励，于是在 MQ 适配之上再增加对接口的适配操作。
- Learner-relevant: 用目录树锚定"统一消息体 + 适配器 + 统一接口"的类协作关系。

### Adapter: 统一的 MQ 消息体 RebateInfo
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 统一的MQ消息体]]`
- Summary: 定义通用消息体 `RebateInfo`，字段为 userId（用户 ID）、bizId（业务 ID）、bizTime（业务时间）、desc（业务描述），把接入进来的所有消息统一处理成该结构。
- Key claims: MQ 消息中有多种多样的类型属性，虽然它们提供给使用方的值相同，但直接接入会在 MQ 特别多时很麻烦。
- Learner-relevant: 明确"统一输出目标结构"——任何 MQ 最终都落到 RebateInfo。

### Adapter: MQ 消息体适配类 MQAdapter
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: MQ消息体适配类]]`
- Summary: `MQAdapter.filter` 提供两个重载：一个接收 json 字符串（先用 `JSON.parseObject(strJson, Map.class)` 转 Map），一个直接接收 Map；核心逻辑是遍历 `Map<String,String> link` 映射关系，从原 Map 按源字段名取值，再用反射 `RebateInfo.class.getMethod("set"+key...)` 给目标属性赋值。
- Key claims: `link` 准确描述"当前 MQ 中某属性名映射为我们的某属性名"（如用户 ID `uId`→`userId`）；MQ 消息基本都是 json 格式可转 Map 结构，最后用反射方式给类型赋值；在实际业务中映射关系可交给配置文件或数据库后台配置，减少编码。
- Learner-relevant: 掌握"字段映射 link + Map 中转 + 反射赋值"的 MQ 适配机制，这是本节的核心代码。

### Adapter: 测试 MQ 适配类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 测试MQ适配类]]`
- Summary: 单元测试分别构造 `create_account` 与 `OrderMq` 消息并配置各自 link 映射，调用 `MQAdapter.filter` 后打印适配前后结果，展示统一后的 `RebateInfo` 字段（bizId、bizTime、userId 等）。
- Key claims: 同样的字段值在适配前后拥有统一的字段属性，业务开发因此变得非常简单；真实的业务场景可把这种映射配置关系交给配置文件或数据库后台配置；还可以加入代理类把映射配置交给它，就不需要每个 mq 都手动创建类了。
- Learner-relevant: 用测试输出验证"同值异名 → 统一字段"的落点，并记住配置化 + 代理类的进一步演进方向。

### Adapter: 代码实现（接口使用适配）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 接口使用适配]]`
- Summary: 因拉新增多，营销活动改为"只有首单用户才给奖励"，但 MQ 中并无判断首单的属性，只能通过接口查询；两个接口 `OrderService.queryUserOrderCount`（出参 long，查订单数量）与 `POPOrderService.isFirstOrder`（出参 boolean，直接判首单）判断逻辑和使用方式都不同，需用适配器统一。
- Key claims: 一个接口直接判断是否首单，另一个需要根据订单数量判断；用 if 语句也能实现，但这类代码很难维护。
- Learner-relevant: 建立"接口出参/语义不同，需要统一包装"的第二个适配动机。

### Adapter: 定义统一适配接口 OrderAdapterService
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 定义统一适配接口]]`
- Summary: 定义 `OrderAdapterService` 接口，方法 `boolean isFirst(String uId)`；后续实现类都完成此接口，并把具体逻辑包装到指定类中，满足单一职责。
- Key claims: 统一接口将差异逻辑封装到各自的适配实现类里。
- Learner-relevant: 记住"统一接口 isFirst(uId) + 各实现类包装差异逻辑"的类适配结构。

### Adapter: 实现两个不同的接口
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 实现两个不同的接口]]`
- Summary: `InsideOrderService` 内部包装 `OrderService`，`isFirst` 返回 `queryUserOrderCount(uId) <= 1` 自判是否首单；`POPOrderAdapterServiceImpl` 内部包装 `POPOrderService`，`isFirst` 直接转发 `popOrderService.isFirstOrder(uId)`。
- Key claims: 两个实现类各自完成各自的判断方式，尤其是提供订单数量的接口需要自己判断当前接到 MQ 时订单数量是否 <= 1。
- Learner-relevant: 对比"直接判断"与"数量推导"两种被适配逻辑在统一接口下的落地差异。

### Adapter: 测试接口适配类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 测试接口适配类]]`
- Summary: 单元测试分别以 `POPOrderAdapterServiceImpl` 与 `InsideOrderService` 调用 `isFirst("100001")`，输出"接口适配(POP)：true"与"接口适配(自营)：false"，并打印底层服务日志。
- Key claims: 此时接口已经做了统一包装，外部使用时不需要关心内部的具体逻辑，调用时只需传入统一参数，即满足了适配的作用。
- Learner-relevant: 用测试结果确认"统一入参、统一出参、外部无感知"的适配效果。

### Adapter: 总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 总结]]`
- Summary: 不使用适配器模式这些功能同样可实现，但使用后代码干净整洁易于维护、减少大量重复的判断和使用、更易于维护和拓展。
- Key claims: 对 MQ 这种多种消息体中"不同属性同类的值"进行适配，再加上代理类，就可以用简单的配置方式接入对方提供的 MQ 消息，而不需要大量重复开发，非常利于拓展；设计模式在实际使用中往往综合运用、不会单一出现。
- Learner-relevant: 收束到"配置化接入 + 少写代码 + 利于拓展"的价值结论，并提醒多种模式综合使用。