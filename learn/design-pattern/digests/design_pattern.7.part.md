---
source: design_pattern
source_lines: 24398
part: 7
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 7)

## Overview (L1)

第 2 节讲解桥接模式，以「多支付渠道（微信、支付宝）× 多支付模式（刷脸、指纹、密码）」的 2×3 组合场景展开。先用一个全是 ifelse 的 PayController 演示笛卡尔积式膨胀的坏味道，再以「支付抽象类组合支付模式接口」的方式桥接重构，展示抽象与实现分离、各自独立变化的思路，并通过工程对比（itstack-demo-design-7-01 与 7-02）与测试验证说明桥接模式带来的整洁与扩展性。

## Sections (L2)

### 场景模拟工程
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#场景模拟工程]]`
- Summary: 交代开发环境（JDK 1.8、Idea + Maven）与两个对比工程：itstack-demo-design-7-01 用一坨代码实现需求，itstack-demo-design-7-02 通过设计模式优化改造，产出对比以学习。
- Key claims: 两个工程分别代表「ifelse 直写」与「桥接模式重构」两种实现，用于对照学习；开发环境为 JDK 1.8 与 Idea + Maven。
- Learner-relevant: 确立了全章「先写坏代码、再重构对比」的学习方法，便于读者把两种实现放在一起看差异。

### 场景简述: 支付渠道接口(微信/支付宝), 支付模式(刷脸/指纹)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#场景简述]]`
- Summary: 讲述案例场景：支付行业出现微信、支付宝等多支付服务，第三方平台把市面占据 90% 以上的支付服务聚合到一起，供店铺、超市、地摊使用，同时支持人脸、扫描、密码多种支付方式。案例模拟这样一个第三方平台，出现多支付与多模式融合使用的问题。
- Key claims: 商家不愿改变用户习惯，催生聚合支付平台；若给每一种支付渠道都实现一次不同模式，即使靠继承也要开发很多类，且随着接入更多支付渠道或方式会呈爆炸式扩展；核心矛盾是多支付渠道 × 多支付模式的组合。
- Learner-relevant: 给出了一个真实的组合膨胀场景，让读者先思考「这种场景该如何实现」，再引出桥接模式。

### 工程结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#工程结构]]`
- Summary: 展示两个工程的目录结构：7-01 只有一个 PayController.java，所有支付和模式功能都在这个类里用 ifelse 实现；7-02 拆分为 channel（Pay.java 抽象类、WxPay、ZfbPay）与 mode（IPayMode 接口、PayCypher、PayFaceMode、PayFingerprintMode）两个包。
- Key claims: 7-01 是单类 ifelse 的坏结构；7-02 通过 channel/mode 双包拆分，把支付渠道与支付模式解耦成两个独立维度。
- Learner-relevant: 通过目录结构对比直观看到桥接模式重构前后的类组织差异，理解「拆桥」带来的物理结构变化。

### ifelse实现需求
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ifelse实现需求]]`
- Summary: 展示 7-01 的坏味道实现：PayController.doPay 用 channelType 与 modeType 两个 int 参数做双层 ifelse 嵌套，分别处理微信/支付宝渠道与密码/人脸/指纹三种模式，所有组合逻辑堆在一个方法里。
- Key claims: 该方法通过用户 ID、交易 ID、金额、渠道、模式五个字段控制支付方式，是「最差的一种写法」，即使写 ifelse 也有可优化的写法；渠道数 × 模式数每增加一维，ifelse 分支就线性膨胀。
- Learner-relevant: 建立「笛卡尔积膨胀的 ifelse 是坏味道」的体感，作为后续桥接重构的对比基线。

### 代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现]]`
- Summary: 展示桥接模式重构后的核心代码：Pay 抽象类持有 IPayMode payMode 并通过构造函数传入（这是桥的核心）；WxPay、ZfbPay 两个支付渠道实现 transfer 并调用 payMode.security 做风控校验；IPayMode 接口只定义 security(String uId)，由 PayCypher（密码）、PayFaceMode（刷脸）、PayFingerprintMode（指纹）三个模式实现各自的风控校验。
- Key claims: 桥的核心是「抽象类中组合实现接口，通过构造函数传递实现」，即 IPayMode payMode 字段；支付渠道与支付模式分离后可单独使用，需要组合时只需把模式传给支付对象；不同模式的刷脸/指纹校验逻辑差异可用适配器模式处理（本章不展开）。
- Learner-relevant: 掌握桥接模式的标准写法——抽象类 A 组合接口 B、构造注入、A 的扩展类与 B 的实现类可独立变化，这正是把 ifelse 二维组合转成二维类组合的关键。

### 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#测试验证]]`
- Summary: 对比两种实现的测试：ifelse 版调用 doPay("weixin_1092033111", …, 1, 2) 传数字渠道/模式参数；桥接版调用 new WxPay(new PayFaceMode()).transfer(...) 与 new ZfbPay(new PayFingerprintMode()).transfer(...)，测试覆盖「微信+人脸」「支付宝+指纹」两个组合。两侧测试结果一致，但桥接版调用方式更整洁、干净、易使用。
- Key claims: 外部调用方不需要关心具体实现，只按需组合选择即可；桥接版进一步可用抽象工厂或策略模式配合 map 结构把服务配置化（本章不展开，避免喧宾夺主）；「内容一样，但实现方式有了很大变化，不能只看结果还要看过程」。
- Learner-relevant: 说明重构不改外部可观察结果、只改善内部结构，且桥接模式可与其他模式（抽象工厂/策略）组合使用。

### 桥接模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#桥接模式模型结构]]`
- Summary: 图解桥接模式在支付场景中的模型：左侧 Pay 是抽象类，下挂微信支付、支付宝支付两个渠道实现；右侧 IPayMode 是接口，下挂刷脸、指纹两个模式实现；支付类型 × 支付模式即可得到相应组合。
- Key claims: 桥接模式的主要作用是将抽象部分与实现部分分离，把多种可匹配的使用进行组合；核心实现是 A 类中含 B 类接口，通过构造函数传递 B 类实现，这个 B 类就是设计的「桥」；典型适用场景包括 JDBC 多种驱动程序、同品牌台式机和笔记本、多类接口同组过滤服务等——若组合中每个类都各自实现不同服务会出现笛卡尔积，用桥接模式则非常简单。
- Learner-relevant: 建立「两两相乘的组合 → 抽象类×接口两棵继承树桥接」的心智模型，并能识别 JDBC 等现实中的桥接案例。

### 总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]`
- Summary: 总结桥接模式在本案例中的价值与选用原则：通过微信/支付宝两个支付渠道与刷脸、指纹、密码三种模式的组合，体现桥接模式简化开发、增强后续迭代扩展性的合理性；满足单一职责与开闭原则，各部分内容清晰易维护易扩展。
- Key claims: 选择设计模式要以符合场景为主，不要刻意使用；同一场景因业务复杂可能需要多种设计模式组合才能设计得更合理，这种经验需在实际项目中积累运用；若实现的是高内聚代码则桥接反而会复杂，重构前要考虑好整体设计。
- Learner-relevant: 提炼出桥接模式的适用判据——存在可拆分的「相互组合」维度时用桥接，否则没必要强用；同时点出它与策略/适配器/抽象工厂常组合出现的生态位，帮助读者把握模式选型边界。