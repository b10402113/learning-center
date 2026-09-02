---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 24398
part: 2
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 2)

## Overview (L1)

第 2 节讲解抽象工厂模式。业务场景是：系统从单机 Redis 升级为 Redis 集群，且需要同时兼容 EGM 与 IIR 两套方法名各异的集群接口，实现平滑过渡且不影响线上运行。本章先用「类型字段 + ifelse」的坏味道实现该需求并指出其难以扩展维护，再用「适配接口 + JDK 动态代理」的方式以抽象工厂思路重构，使原有 Redis 操作类无需任何修改即可接入两套集群，最后通过 JUnit 测试验证两种实现均可正常读写。抽象工厂要解决的是在一个产品族（Redis 集群、操作系统等）存在多个不同类型产品时的接口选择问题，满足单一职责、开闭原则与解耦。

## Sections (L2)

### 一、开发环境
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一、开发环境]]`
- Summary: 说明本章使用的开发环境（JDK 1.8、Idea + Maven）与三个示例工程的分工：itstack-demo-design-2-00 为场景模拟工程（模拟 Redis 升级为集群时的类改造）、2-01 用一坨代码（ifelse）实现需求、2-02 用设计模式优化改造以形成对比学习。
- Key claims: 学习设计模式要「先有案例，再结合案例与自己实际业务尝试重构改造」；三个工程分别对应原样、坏味道、重构三个版本。
- Learner-relevant: 明确了本章的对照实验结构——先写坏代码再重构，是体验设计模式价值的起点。

### 二、抽象工厂模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#二、抽象工厂模式介绍]]`
- Summary: 说明抽象工厂模式与工厂方法模式同样为解决接口选择问题，但抽象工厂是一个中心工厂、用来创建其他工厂。以不同操作系统的回车换行差异（Unix 的 \n、Windows 的 \n\r、Mac 的 \r）和 IDEA 工具在 Win/Mac 的展示差异为例，说明业务开发中常见需要兼容处理的场景，而经验不足的开发常直接堆 ifelse。
- Key claims: 抽象工厂是「创建工厂的工厂」，与工厂方法模式意图相同但结构不同；跨系统/多供应商兼容是抽象工厂的典型适用场景。
- Learner-relevant: 建立抽象工厂「管理一族兼容实现」的心智模型，区别于单点的工厂方法。

### 三、案例场景模拟
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]`
- Summary: 描述业务演化背景：初期预估 QPS 低、并发小，单机 Redis 即可满足；随着业务超预期发展，单机无法承载，需更换为更健壮的 Redis 集群，且不能影响线上、需平滑过渡。由此预见的问题包括：众多服务需一起升级、需兼容集群 A/B 以便灾备、两套集群接口与方法各有差异需适配、不能影响现有系统。
- Key claims: 升级改造的约束是「平滑过渡、兼容两套集群、接口差异需适配、不影响线上」；场景模拟工程 itstack-demo-design-2-00 包含 EGM、IIR、RedisUtils 三个模拟类。
- Learner-relevant: 真实还原「技术债 + 被迫升级」的工程语境，说明接口适配需求的来源。

### 三.1 场景简述
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#场景简述]]`
- Summary: 逐一说明三个模拟对象：RedisUtils 模拟正在被各业务系统固定写死使用的单机服务；EGM 模拟一套集群服务但方法名（如 gain/delete/setEx）与业务系统不同，就像「你 mac 我用 win，做一样的事但有不同操作」；IIR 是另一套集群服务（如 get/setExpire），为了模拟企业中出现两套功能相同但实现不同的服务。
- Key claims: 单机服务的方法名被写死进各业务系统，改动麻烦；EGM 与 IIR 两套集群接口差异是适配的根源；最终要同时满足「兼容两套集群」与「所有业务系统改造不影响线上」。
- Learner-relevant: 认识「相同功能、不同方法名」的多实现形态——这正是适配器/抽象工厂要消灭的耦合。

### 三.2 单集群代码使用
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#单集群代码使用]]`
- Summary: 展示重构前原始的单集群 Redis 使用方式：定义 CacheService 接口（get/set/set-with-timeout/del 四个方法），CacheServiceImpl 内部直接持有 RedisUtils 并逐方法委托调用。
- Key claims: 现有实现简单且对当前场景够用，但所有业务系统共用时，改造就变难；此处代码是后续重构的对象。
- Learner-relevant: 为 ifelse 版与抽象工厂版提供了「改造前基线」，方便对比改动幅度。

### 四、用一坨代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#四、用一坨代码实现]]`
- Summary: 讲解工程 itstack-demo-design-2-01 的坏味道实现：不改类结构图，通过在接口方法中新增 redisType 类型字段，在 CacheServiceImpl 内用 if (1==redisType) 走 EGM、if (2==redisType) 走 IIR，否则走默认 RedisUtils 来区分集群。
- Key claims: 实现过程非常简单、只按类型判断集群，但对使用者很不友好，且难以应对后期扩展与持续维护。
- Learner-relevant: 记住「接口加类型字段 + ifelse」的反模式，作为后续重构对照的坏味道样本。

### 四.1 ifelse实现需求
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ifelse实现需求]]`
- Summary: 给出 CacheServiceImpl 的 ifelse 版核心代码：类中同时持有 redisUtils、egm、iir 三个对象，get/set 等每个方法都通过 redisType 参数走分支调用对应集群。
- Key claims: 若后续增加第三个集群，需要给每个方法再加一个 if 分支，方法签名也随之变动；实现简单但使用繁琐、扩展困难。
- Learner-relevant: 直观看到 ifelse 随集群数量线性膨胀、调用方被迫携带类型参数的痛点。

### 四.2 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#四.2 测试验证]]`
- Summary: 用 JUnit 单元测试验证 ifelse 版接口：set("user_name_01","小傅哥",1) 后 get 取回，日志显示 EGM 写入/获取数据正常，测试结果为「小傅哥」。
- Key claims: 运行结果正常、没有功能问题；但这样的代码一旦生成上线运行，之后再想改就真的难了。
- Learner-relevant: 功能正确 ≠ 结构良好——测试通过不意味着可以放任代码膨胀。

### 五、抽象工厂模式重构代码
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#五、抽象工厂模式重构代码]]`
- Summary: 说明重构思路：采用代理类方式实现抽象工厂的创建与获取，被代理的类就是现有 Redis 操作方法类，使该类在不需要任何修改的情况下即可调用集群 A 和集群 B；由于两套集群部分方法提供不同，需做一个接口适配，这个适配类相当于「工厂中的工厂」，把不同服务抽象为统一接口做相同业务，与上一章工厂方法模式类型相似、可翻阅参考。
- Key claims: 重构让原 Redis 操作类零修改接入两套集群；核心类包括 ICacheAdapter（适配接口）、EGMCacheAdapter/IIRCacheAdapter（两套集群适配实现）、JDKProxy/JDKInvocationHandler（抽象工厂的另一种实现——代理类）。
- Learner-relevant: 确立「适配接口 + 动态代理」即抽象工厂的一种落地形态，与工厂方法呼应。

### 五.1 代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#五.1 代码实现]]`
- Summary: 逐类给出重构实现：ICacheAdapter 定义 get/set/set-with-timeout/del 统一适配接口，让所有集群在统一方法名下操作并方便后续扩展；EGMCacheAdapter 内部持有 EGM 并把 gain→get、delete→del、setEx→带超时 set 映射到统一接口；IIRCacheAdapter 同理把 IIR 的 get/setExpire 映射进来。
- Key claims: 适配器将两套集群的差异化方法名统一到同一接口下，业务方只面向 ICacheAdapter 编程；两个适配实现都只是在统一方法名下的简单包装。
- Learner-relevant: 学会用适配器抹平「同功能异名」的第三方差异，为代理接入做准备。

### 五.2 定义抽象工程代理类和实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#五.2 定义抽象工程代理类和实现]]`
- Summary: 展示 JDKProxy.getProxy 静态工厂：接收接口类与 ICacheAdapter 入参，创建 JDKInvocationHandler 并通过 Proxy.newProxyInstance 生成代理；JDKInvocationHandler 持有 cacheAdapter，在 invoke 中通过方法名反射调用对应集群方法。指出抽象工厂也可用非代理方式实现。
- Key claims: 使用哪个集群由外部入参传递，代理类实现非常简单；invoke 里用方法名反射调用简化整体使用。
- Learner-relevant: 掌握「工厂方法 + JDK 动态代理」组合，理解如何按需选择集群实现且不改原方法。

### 五.3 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#五.3 测试验证]]`
- Summary: 重构版测试：通过 JDKProxy.getProxy(CacheServiceImpl.class, new EGMCacheAdapter()) 与 IIRCacheAdapter 分别生成两个代理，各 set 再 get，日志分别打印 EGM 与 IIR 的写入/获取数据，测试结果都为「小傅哥」。
- Key claims: 通过传入不同集群类型即可调用不同集群方法，无需改原方法，降低修改成本；后续扩展只需按同样方式补充新适配器。
- Learner-relevant: 对比 ifelse 版，验证重构后调用方体验与扩展方式的提升。

### 六、总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]`
- Summary: 总结抽象工厂模式的适用问题：在一个产品族（Redis 集群、操作系统）存在多个不同类型产品的情况下解决接口选择问题，这类场景在业务开发中非常常见，只是有时没有被抽象出来。同时说明该模式满足单一职责、开闭原则、解耦等优点，但随着业务拓展可能造成类实现复杂度上升，可通过引入其他设计方式、代理类及自动生成加载方式降低该缺点。
- Key claims: 「你的代码只是被 ifelse 埋上了」——知道何时可用抽象工厂优化代码，能让层级结构更清晰并提升扩展性与优雅度；类数量增多是可被其他手段缓解的代价，算不上真正缺点。
- Learner-relevant: 收敛本章：识别「产品族多实现」场景 → 用抽象工厂 + 适配 + 代理重构，并用「满足哪些设计原则、代价是什么」来评估模式应用。