---
subject: design-pattern
created: 2026-08-24
updated: 2026-08-24
---

# Mastery — design-pattern

## patterns-foundation

| Strand | Rating |
| --- | --- |
| design-patterns purpose and origin (recurring design problems; Alexander → GoF; communication language) | unknown |
| code smell recognition: type-field ifelse/switch dispatch growing unmaintainable | unknown |
| 单一职责 principle (single responsibility) | unknown |
| 里氏替换 principle (Liskov substitution) | unknown |
| 依赖倒置 principle (dependency inversion) | unknown |
| 接口隔离 principle (interface segregation) | unknown |
| 迪米特原则 (Law of Demeter) | unknown |
| 开闭原则 (open-closed) | unknown |
| 高内聚/低耦合/可扩展/可复用 as the convergence goal | unknown |
| pattern reading loop (场景模拟 → 一坨代码 → 模式重构 → 总结) | unknown |
| recurring structural toolkit (enum + Map dispatch, abstract sealed entry, per-variant classes) | unknown |
| pattern trade-offs and ROI judgment (extensibility at cost of classes; avoid over-application) | unknown |

Notes: probe skipped via /nodes design-pattern/patterns-foundation skip-probe on 2026-08-24

## factory-methods

| Strand | Rating |
| --- | --- |
| ifelse type 分发的坏味道识别与重构动机 | unknown |
| 工厂方法模式：创建接口 + 子类决定实例化哪个产品 | unknown |
| 工厂方法重构路径：PrizeController → ICommodity + StoreFactory | unknown |
| 工厂方法满足的六大原则（开闭原则、单一职责） | unknown |
| 抽象工厂模式：产品族（多个不兼容接口）的统一创建 | unknown |
| 抽象工厂与 JDK 动态代理的结合（ICacheAdapter + JDKProxy） | unknown |
| 工厂方法（单产品层级）vs 抽象工厂（产品族）的辨析 | unknown |
| 工厂方法 vs 抽象工厂的适用场景判断与取舍 | unknown |

Notes: probe skipped via /nodes design-pattern/factory-methods skip-probe on 2026-08-25

## builder-prototype

| Strand | Rating |
| --- | --- |
| 建造者模式的动机：复杂对象的分步组装 vs 工厂的一次性创建 | unknown |
| 建造者模式的角色与结构：IMenu（Builder）、DecorationPackageMenu、Builder | unknown |
| 流式 API（fluent chaining）的实现方式与优势 | unknown |
| 建造者模式满足单一职责原则、易扩展、控制构建细节风险 | unknown |
| 原型模式的动机：避免重复构建开销大的对象 | unknown |
| Cloneable 接口与 clone() 的实现机制 | unknown |
| 深拷贝 vs 浅拷贝的区别与陷阱（集合字段必须深拷贝） | unknown |
| 创建型模式对比：Builder（分步组装）vs Prototype（克隆模板）vs Factory（类型分发） | unknown |

Notes: probe skipped via /nodes design-pattern/builder-prototype skip-probe on 2026-08-25

## singleton

| Strand | Rating |
| --- | --- |
| 单例模式的动机：为什么全局只要一个实例 + 多线程访问挑战 | unknown |
| 基础实现：静态类/ConcurrentHashMap缓存、懒汉非线程安全、synchronized方法、饿汉静态字段 | unknown |
| 静态内部类/Holder 模式：JVM 类加载保证线程安全+懒加载+无锁 | unknown |
| 双重检查锁（DCL）：synchronized块 + volatile + null检查的原理与坑 | unknown |
| CAS + AtomicReference：无锁自旋实现、高并发场景与无限自旋风险 | unknown |
| 枚举单例（Effective Java）：免费序列化保护+反射攻击防御、不可继承的取舍 | unknown |
| 7种实现的决策树：什么场景该用哪种、懒加载 vs 饿汉 vs 枚举的取舍 | unknown |

Notes: probe skipped via /nodes design-pattern/singleton skip-probe on 2026-08-25

## adapter-facade

| Strand | Rating |
| --- | --- |
| 适配器模式的动机：不兼容接口统一给调用方，硬件万能充/转接头类比 | unknown |
| MQ 消息适配场景：RebateInfo 统一消息体 + MQAdapter.filter() 反射映射 | unknown |
| OrderAdapterService 接口抽象：InsideOrderService vs POPOrderAdapterServiceImpl | unknown |
| 适配器 vs 桥接 vs 策略的辨析（都涉及接口/行为封装，意图不同） | unknown |
| 外观/门面模式的动机：降低调用方复杂度，中间层包装统一 API | unknown |
| SpringBoot starter 中间件实现：注解 + AOP + 自动配置 + 外部化配置 | unknown |
| 外观模式适用场景：跨切面关注点（白名单/切量/灰度）的可复用组件 | unknown |
| 适配器（让已有接口兼容）vs 外观（简化子系统入口）的决策判断 | unknown |

Notes: probe skipped via /nodes design-pattern/adapter-facade skip-probe on 2026-08-25

## bridge-composite

| Strand | Rating |
| --- | --- |
| 双维度嵌套 ifelse 的坏味道（channelType × modeType 笛卡尔积爆炸） | unknown |
| 桥接模式的结构：抽象（Abstraction）持有实现（Implementation）的引用，通过构造函数注入 | unknown |
| 组合优于继承：用字段持有另一维度的接口，而非子类化笛卡尔积 | unknown |
| 桥接的真实类比：JDBC 驱动、品牌×产品线、多接口过滤服务 | unknown |
| 桥接 vs 适配器 vs 策略的辨析（结构相似，意图不同） | unknown |
| 组合模式的动机：树结构组织部分-整体关系，替代深层 ifelse 嵌套 | unknown |
| 组合模式的角色：叶子节点（Leaf）与组合节点（Composite）统一接口 | unknown |
| 透明方式 vs 安全方式的组合模式选择 | unknown |
| 递归遍历：组合节点遍历子节点的递归调用机制 | unknown |
| 组合 vs 责任链 vs 策略的辨析（树决策 vs 链式传递 vs 算法替换） | unknown |

Notes: probe skipped via /nodes design-pattern/bridge-composite skip-probe on 2026-08-25

## decorator-proxy

| Strand | Rating |
| --- | --- |
| 装饰器模式的动机：不修改原类的前提下动态添加功能，避免继承子类爆炸 | unknown |
| 装饰器模式的四个角色：Component、ConcreteComponent、Decorator、ConcreteDecorator | unknown |
| 装饰器的核心机制：构造函数注入 + 接口转发（forward）| unknown |
| 装饰器 vs 继承：运行时动态组合 vs 编译时固定，开闭原则的运行时体现 | unknown |
| 装饰器在 JDK I/O 中的体现：BufferedReader(new FileReader(...)) | unknown |
| SsoDecorator 装饰器实战：SSO 拦截器 + 方法级权限控制 | unknown |
| 代理模式的动机：控制对资源/对象的访问，中间层屏蔽细节 | unknown |
| JDK 动态代理机制：Proxy.newProxyInstance + InvocationHandler | unknown |
| MyBatis DAO 代理实战：无实现类的 Mapper bean 注册原理 | unknown |
| Spring BeanFactory + BeanDefinitionRegistryPostProcessor 的代理注册 | unknown |
| 装饰器 vs 代理的辨析：意图不同（加功能 vs 控访问），结构相似 | unknown |
| 框架中的装饰/代理识别：Spring AOP、MyBatis、JDK I/O | unknown |

Notes: probe skipped via /nodes design-pattern/decorator-proxy skip-probe on 2026-08-25