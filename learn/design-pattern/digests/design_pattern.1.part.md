---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 24398
part: 1
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 1)

## Overview (L1)
- **前言 / 作者 / 技术站 / 源码**: 作者小傅哥,以互联网真实业务场景为素材,投入 50 天从交易、营销、秒杀、中间件、源码等 22 个真实场景中抽离出设计模式实践案例;指出多数人习惯用 ifelse 一把梭堆业务逻辑,学设计模式重在实操而非理论。
- **目录**: 全书按创建型(工厂方法、抽象工厂、建造者、原型、单例)、结构型(适配器、桥接、组合、装饰器、外观、享元、代理)、行为型(责任链、命令、迭代器、中介者、备忘录、观察者、状态、策略、模板方法、访问者等)三组排列,目录顶部先列出设计模式六大原则。
- **开发环境**: JDK 1.8 + Idea + Maven;配套三个工程 `itstack-demo-design-1-00/1-01/1-02`,编号规则为「第几个模式-第几种方案」。
- **第 1 节:工厂方法模式**: 以营销场景积分兑换发放多种类型商品(优惠券/实物商品/第三方爱奇艺兑换卡)为业务场景,先给出 ifelse「一坨代码」实现,再用工厂方法模式重构(统一 `ICommodity` 接口 + `StoreFactory` 工厂),最后用单元测试验证两种实现效果并总结优缺点。

## Sections (L2)

### 前言
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#前⾔言]]`
- Summary: 开篇说明本书定位——实战型而非理论型,带读者用设计模式思想优化真实业务代码;介绍设计模式历史(亚历山大的《建筑模式语言》→1994 年 GoF 四人的《设计模式:可复用面向对象软件的基础》),并给出阅读建议与参考资源(refactoringguru.cn、菜鸟设计模式 RUNOOB)。
- Key claims: 设计模式由多年经验提炼而来,只读理论不上手则「想上道依旧很慌」;没读过设计模式书的老手也能写出好代码,因其经验与模式要求(高内聚、低耦合、可扩展、可复用)几乎一致。
- Learner-relevant: 建立「案例入手 > 纯理论」的学习预期,为后续逐章实战定调。

### 作者
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#作者]]`
- Summary: 作者小傅哥,13 年毕业于软件工程,一线互联网码农,主导过中大型项目、参与大促备战、开发过中间件;书于 5 月 20 日启动、7 月 9 日完成,整理成 PDF 供读者免费学习。
- Key claims: 作者此前已编写《用 Java 实现 JVM》《Netty4.x 专题》《中间件开发》《领域驱动设计》等 9 个专题约 150 篇原创内容。
- Learner-relevant: 提供背景信任,说明本书源自一线真实经验。

### 技术站与交流
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#技术站]]`
- Summary: 列出作者技术输出渠道——公众号 bugstack 虫洞栈、博客 bugstack.cn、GitHub CodeGuide wiki、技术圈子;并给出源码获取方式(公众号回复「源码下载」,编号 18 即 itstack-demo-design)与微信交流联系方式。
- Learner-relevant: 提供后续获取配套源码的操作路径。

### 目录
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#⽬目录]]`
- Summary: 全书目录,先列出设计模式六大原则(单一职责、里氏替换、依赖倒置、接口隔离、迪米特原则、开闭原则),再按创建型、结构型、行为型三大类逐一列出各模式及对应的真实业务场景与实现要点。
- Key claims: 六大原则贯穿各章,会在具体设计模式章节中体现;创建型 5 种、结构型 7 种、行为型 10 余种,每种都绑定一个业务场景(如替换 Redis 双集群、SSO 单点登录扩展、618 大促审批链等);工厂方法场景即「多种类型商品不同接口统一发奖服务搭建场景」。
- Learner-relevant: 让学习者对全书 23 个经典模式与业务场景有一张全局地图,可作为后续选学与回顾的索引。

### 一、开发环境
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一、开发环境]]`
- Summary: 明确本书配套开发环境为 JDK 1.8、Idea + Maven;介绍每章配套的 1-3 个案例工程及编号规则——`1-00` 为场景模拟工程(提供三组不同奖品发放接口)、`1-01` 为一坨代码/ifelse 实现、`1-02` 为设计模式优化改造后的对比工程。
- Key claims: 编号「1-00」中 1 代表第一个设计模式(工厂方法),00 代表模拟场景;01/02/03 依次代表不同实现方案。
- Learner-relevant: 学习者据此可对照工程看场景版、ifelse 版与模式版三套代码,形成对比学习。

### 二、工厂方法模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#二、⼯⼚⼚⽅方法模式介绍]]`
- Summary: 介绍工厂方法模式(又称工厂模式)的定义与意图——一种创建型设计模式,在父类中提供创建对象的方法,允许子类决定实例化对象的类型;核心意图是「定义一个创建对象的接口,让其子类自己决定实例化哪一个工厂类,工厂模式使其创建过程延迟到子类进行」。
- Key claims: 是 Java 开发中最常见的模式之一;简单说就是为了提供代码结构的扩展性,屏蔽每个功能类的具体实现逻辑,也是去掉众多 ifelse 的方式;缺点是实现的类非常多、维护成本高,但可通过后续设计模式组合逐步降低。
- Learner-relevant: 建立模式的理论锚点(意图 + 优缺点),用于对照后面的 ifelse 与工厂两种实现。

### 三、模拟发奖多种商品
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#三、模拟发奖多种商品]]`
- Summary: 给出业务场景——营销场景(打卡、分享、留言、邀请注册等促活拉新动作返利积分,积分兑换商品)下模拟发放多种类型商品的统一发奖服务;列出三种商品接口:优惠券 `CouponResult sendCoupon(uId, couponNumber, uuid)`、实物商品 `Boolean deliverGoods(DeliverReq req)`、第三方爱奇艺兑换卡 `void grantToken(bindMobileNumber, cardId)`。
- Key claims: 三个接口返回类型不同(对象/布尔/空),入参不同(优惠券需防重、兑换卡需卡 ID、实物商品需发货地址);营销场景复杂、多变、临时,若设计不深会面临紧急 CRUD 导致结构混乱;后续业务发展还会新增商品类型。
- Learner-relevant: 明确「接口不统一」这一痛点,是引入工厂模式统一封装的直接动机。

### 四、用一坨代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#四、⽤用⼀一坨坨代码实现]]`
- Summary: 先展示不考虑扩展性、用 ifelse 一把梭实现发奖需求的原始方案,作为重构前的对照组。
- Key claims: 这是刚入门程序员常用做法,只求尽快满足需求;本节包含工程结构、ifelse 实现与测试验证三个子节。
- Learner-relevant: 建立「反面教材」基线,与第五节工厂重构后的结构形成对比。

### 1. 工程结构 (ifelse 版)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#1. ⼯工工程结构]]`
- Summary: 展示 `itstack-demo-design-1-01` 工程的极简结构:入参对象 `AwardReq`、出参对象 `AwardRes`、接口类 `PrizeController`,外加测试类 `ApiTest`。
- Key claims: 工程结构非常简单,一个 Controller 承担全部三种奖品的发放逻辑。
- Learner-relevant: 直观看出「一个类几千行」的单体结构,为对比重构后的分层结构作铺垫。

### 2. ifelse实现需求
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2. ifelse实现需求]]`
- Summary: 给出 `PrizeController.awardToUser(AwardReq req)` 的完整 ifelse 实现——按 `req.getAwardType()` 分支(1 优惠券、2 实物商品、3 第三方兑换卡),各自 new 对应 Service 并拼装参数调用;失败统一返回 `AwardRes("0001", ...)`,成功返回 `("0000", "发放成功")`,并用 `queryUserName`/`queryUserPhoneNumber` 硬编码用户信息。
- Key claims: 直接按业务实现、研发甚至可提前完成需求,但每次迭代扩展都需要理清每个接口的用法,重构成本高、回归验证时间长,接手的人十分痛苦,ifelse 还会继续增加。
- Learner-relevant: 识别「发散、不可扩展」的坏味道:分支内 new 具体类、硬编码查询、逻辑全部堆在一个方法里。

### 3. 测试验证 (ifelse 版)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#3. 测试验证]]`
- Summary: 编写 `ApiTest.test_awardToUser()` 单测,分别构造优惠券(type=1)、实物商品(type=2,含收货人 extMap)、第三方兑换卡(type=3)三个请求调用 `awardToUser`,打印请求与结果日志。
- Key claims: 运行结果全部 `{"code":"0000","info":"发放成功"}`,`Process finished with exit code 0`——满足当前所有业务需求且写得很快,但「实在难以维护」。
- Learner-relevant: 学会用单元测试固化发奖流程、验证重构前后行为一致(回归基线)。

### 五、工厂模式优化代码
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#五、⼯工⼚厂模式优化代码]]`
- Summary: 用工厂方法模式对发奖代码做一次小型重构,抽离出核心结构;宣称重构后代码结构清晰、具备新增业务需求的扩展性,并说明实际使用中还会继续完善。
- Key claims: 通过案例入手学设计模式比看理论更容易,案例是缩短理论到上手的最佳方式;本节含工程结构、代码实现、测试验证三个子节。
- Learner-relevant: 这是本章核心——见证「接口统一 + 工厂分发」如何替代 ifelse 发散分支。

### 1. 工程结构 (工厂版)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#1. ⼯工工程结构]]`
- Summary: 展示 `itstack-demo-design-1-02` 的分层结构:接口 `ICommodity.java`、接口实现 `store/impl` 下的 `CardCommodityService`、`CouponCommodityService`、`GoodsCommodityService`,以及工厂 `StoreFactory.java`,外加测试类。
- Key claims: 工程结构分层后一眼可看出每个类职责——接口定义、实现按奖品类型隔离、工厂负责按类型取服务;这种分层更好扩展。
- Learner-relevant: 直观对比 1-01 的单类结构与 1-02 的「接口 + 实现 + 工厂」结构。

### 2.1 定义发奖接口
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.1 定义发奖接⼝口]]`
- Summary: 定义统一发奖接口 `ICommodity`,方法签名 `void sendCommodity(String uId, String commodityId, String bizId, Map<String, String> extMap) throws Exception`。
- Key claims: 所有奖品(实物、虚拟、第三方)都必须实现此接口以保证入参出参的统一性;入参包括用户 ID、奖品 ID、业务 ID 以及用于实物发货地址的扩展字段。
- Learner-relevant: 掌握工厂方法模式的第一步——用统一接口收敛三种异构接口。

### 2.2 实现奖品发放接口
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.2 实现奖品发放接⼝口]]`
- Summary: 给出三个实现类:优惠券 `CouponCommodityService`(调用 `couponService.sendCoupon`,非 0000 抛 `RuntimeException`)、实物商品 `GoodsCommodityService`(拼装 `DeliverReq` 调 `deliverGoods`,失败抛「实物商品发放失败」)、第三方爱奇艺卡 `CardCommodityService`(查手机号后调 `grantToken`)。
- Key claims: 每种奖品的实现都在自己的类中,新增、修改或删除都不会影响其他奖品功能的测试,降低回归测试可能;新增奖品只需按此结构填充,易于维护扩展;调用方不再关心内部逻辑,按统一方式处理即可。
- Learner-relevant: 体会单一职责——每个业务逻辑实现都在所属自己的类中完成。

### 2.3 创建商店工厂
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.3 创建商店⼯工⼚厂]]`
- Summary: 创建 `StoreFactory`,方法 `getCommodityService(Integer commodityType)` 按类型返回对应 `ICommodity` 实现(1 优惠券、2 实物、3 兑换卡),空类型返回 null,未知类型抛「不存在的商品服务类型」。
- Key claims: 工厂类让代码干净整洁地处理不同类型商品,新增商品在该处扩展即可;不喜欢 if 也可改用 switch 或 map 配置结构;实际编码中 if 后建议加括号(示例为求简洁省略)。
- Learner-relevant: 工厂是「把 ifelse 从调用方收敛到一处」的落点,体现了创建对象延迟到子类(实现类)进行的意图。

### 3. 测试验证 (工厂版)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#3. 测试验证]]`
- Summary: 编写 `ApiTest.test_commodity()` 单测,通过 `StoreFactory.getCommodityService(type)` 拿到三个 `ICommodity` 服务,依次发放优惠券、实物商品(带 extMap)、爱奇艺兑换卡,日志输出每种奖品的请求参数与测试结果。
- Key claims: 三种发放全部成功(优惠券 code 0000、实物 true、兑换卡 success),`exit code 0`;封装后能清晰看到整套发奖服务的完整性,统一了入参、统一了结果;这样的代码上线运行内心不恐慌。
- Learner-relevant: 验证重构后行为与 ifelse 版一致,同时代码可读性与扩展性显著提升(回归对照闭环)。

### 六、总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]`
- Summary: 总结工厂方法模式重构的收益与代价:模式本身不复杂,理解后反而更简单;明确其优点与缺点,并给出后续学习路径。
- Key claims: 优点——避免创建者与具体产品逻辑耦合、满足单一职责(每个业务逻辑在所属自己的类中完成)、满足开闭原则(无需更改调用方即可引入新的产品类型);缺点——奖品类型非常多时实现子类会急速扩张,需结合其他模式优化(后续章节会逐步涉及)。
- Learner-relevant: 收束本章:工厂方法解决「发散的 ifelse 分支 + 接口不统一」问题,同时记住其类爆炸的局限,为学习抽象工厂等其他创建型模式埋下伏笔。