---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 24398
part: 16
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 16)

## Overview (L1)

- 第 8 节 策略模式：以模拟购买商品时使用的各类营销优惠券（满减、直减、折扣、n元购）计算折扣金额为业务场景，先讲模式意图——定义一系列算法、把它们一个个封装起来并使其可相互替换；再用一个 `discountAmount` 方法靠不断堆 if 的一坨代码实现展示扩展性灾难，最后用「泛型优惠接口 ICouponDiscount + 四种优惠策略实现 + 上下控制类 Context」重构出完全一致的折扣结果，并总结策略模式与命令、适配器、组合模式结构相似而思路不同。
- 第 9 节 模板模式：以模拟爬虫各类电商商品（京东/淘宝/当当）、生成含个人邀请码的营销推广海报为业务场景，先讲模式意图——在抽象类中定义抽象方法的执行顺序，将抽象方法设定为只有子类实现；再用抽象类 NetMall 把「模拟登录 → 爬取信息 → 生成海报」三步执行标准固定下来，三个电商子类各自定制三步实现，测试验证生成 base64 海报，最后总结模板模式控制执行顺序、提取公用代码的优势与超场景使用需谨慎的边界。

## Sections (L2)

### 策略模式：开发环境

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式开发环境]]`
- Summary: 说明本章演示环境与两个对比工程：JDK 1.8 + Idea + Maven；itstack-demo-design-20-01 用一坨代码实现业务需求、20-02 通过设计模式优化改造代码以产生对比学习，源码通过公众号 bugstack虫洞栈回复「源码下载」序号18 获取。
- Key claims: 两个配套工程构成「一坨代码 vs 模式重构」的对比学习路线；演示环境与全书的 JDK1.8+Maven 约定一致。
- Learner-relevant: 为策略模式 before/after 两版实现建立工程坐标。

### 策略模式：模式介绍

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式介绍]]`
- Summary: 用「诸葛亮给刘关张的三个锦囊」类比：锦囊各自对应不同情境的应对策略，整体则是按需取出执行的策略集。点明策略模式是一种行为模式、也是替代大量 ifelse 的利器，解决的是「具有同类可替代行为逻辑算法」的场景，例如不同类型交易方式（信用卡、支付宝、微信）、生成唯一 ID 策略（UUID、DB 自增、DB+Redis、雪花算法、Leaf 算法）等。
- Key claims: 策略模式的意图 = 定义一系列算法，把它们一个个封装起来并使它们可相互替换；适用场景 = 同类可替代的行为/算法，通过策略包装供给外部使用。
- Learner-relevant: 给出「行为模式 + 同类算法可替换 + 干掉 ifelse」的模式定义锚点，是理解后续优惠券策略的核心概念。

### 策略模式：案例场景模拟（营销优惠券）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#案例场景模拟]]`
- Summary: 引入本章业务：模拟购买商品时使用的各种类型优惠券（满减、直减、折扣、n元购）的折扣计算。这个场景是日常购物省钱渠道，大促时用户还要比对哪些商品一起买更优惠；功能最初可能只是简单的金额抵扣，但随着产品不断迭代，优惠券类型和规则越来越多，对程序员开发并不容易，因此模拟其中一个计算优惠的方式并用策略模式实现。
- Key claims: 四种券型 = 满减、直减、折扣、n元购；优惠逻辑会随产品迭代不断膨胀，是 ifelse 维护灾难的典型来源。
- Learner-relevant: 确立「同一动作（算优惠）多种算法（券型）」的可替换场景原型，是策略模式的业务模板。

### 策略模式：一把梭实现（工程结构）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式一把梭工程结构]]`
- Summary: 展示一坨代码工程 itstack-demo-design-20-01 的结构：仅一个核心类 `CouponDiscountService.java`，是最直接的面向过程开发方式。作者指出优惠券最初可能就是一个简单金额抵扣，没有这么多类型，若无扩展性设计，随着产品迭代会越来越混乱。
- Key claims: 原版实现只有一个面向过程的服务类承载全部券型逻辑；初版设计不具备扩展性是后期混乱的根源。
- Learner-relevant: 与重构后「接口 + 四个实现 + 控制类」的结构形成对比，凸显职责划分价值。

### 策略模式：一把梭实现（代码实现）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式一把梭代码实现]]`
- Summary: 给出 `CouponDiscountService.discountAmount(int type, double typeContent, double skuPrice, double typeExt)` 的完整实现：type=1 直减返回 skuPrice-typeContent；type=2 满减先判断 skuPrice<typeExt 则返回原价、否则减 typeContent；type=3 折扣返回 skuPrice×typeContent；type=4 n元购返回 typeContent；其余返回 0D。入参包括券类型、券金额、商品金额，以及为「满多少减多少」额外增加的 typeExt 参数。
- Key claims: 每种券型对应一个 if 分支，方法靠不断堆 if 扩展，实际的代码会比示例多很多；typeExt 参数暴露了方法不易扩展的问题。
- Learner-relevant: 形成对照样本——记住这套「if 堆叠、难扩展」的写法，后续用策略模式等价重构。

### 策略模式：重构（工程结构与模型结构）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式模型结构]]`
- Summary: 展示重构工程 itstack-demo-design-20-02 的结构：`ICouponDiscount.java` 接口、`Context.java` 上下控制类，以及 `event` 包下四种优惠券实现 MJCouponDiscount（满减）、NYGCouponDiscount（n元购）、ZJCouponDiscount（直减）、ZKCouponDiscount（折扣）。点明整体结构不复杂，主要体现不同类型优惠券计算方式的不同策略，包括一个接口类及四种实现，最后由上下控制类处理整体策略服务。
- Key claims: 模型 = 策略接口 + 每类券一个策略实现 + 上下控制类；与命令模式、适配器模式结构相似但思路有差异。
- Learner-relevant: 建立策略模式三要素（接口/实现/上下文）的结构化认知，是全章的核心类图。

### 策略模式：重构（优惠券接口 ICouponDiscount）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#优惠券接口]]`
- Summary: 定义泛型接口 `ICouponDiscount<T>`，声明唯一方法 `BigDecimal discountAmount(T couponInfo, BigDecimal skuPrice)`：入参为券折扣信息（直减、满减、折扣、N元购）与 sku 金额，出参返回最终折扣后的金额。泛型用于不同类型接口传递不同类型的券参数。
- Key claims: 接口抽象了「算优惠」的统一契约，并用泛型兼容不同券型的数据结构；实际开发中接口参数会比示例多，但核心逻辑是这些。
- Learner-relevant: 策略模式第一步——把可变的算法固定为统一接口，客户端面向接口编程。

### 策略模式：重构（四种优惠券策略实现）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#优惠券接口实现]]`
- Summary: 给出四种券型各自的策略实现：满减 `MJCouponDiscount implements ICouponDiscount<Map<String,String>>` 从 map 取 x（满多少）与 n（减多少），skuPrice<x 返回原价、减后不足 1 元返回 1 元、否则返回减后金额；直减 `ZJCouponDiscount implements ICouponDiscount<Double>` 商品价减优惠价、最低支付 1 元；折扣 `ZKCouponDiscount implements ICouponDiscount<Double>` 商品价乘折扣比例、保留两位小数 ROUND_HALF_UP、最低支付 1 元；n元购 `NYGCouponDiscount implements ICouponDiscount<Double>` 无论原价多少都按固定金额购买。
- Key claims: 每种券型一个类、互不干扰，各自封装自己的计算规则；使用 BigDecimal 计算避免金额精度问题，并统一「最低支付 1 元」的兜底规则。
- Learner-relevant: 展示「一个策略一个类」的落地范式——新增券型只需新增实现类，不再改动既有逻辑。

### 策略模式：重构（策略控制类 Context）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#策略控制类]]`
- Summary: 给出泛型控制类 `Context<T>`：持有 `ICouponDiscount<T>` 成员，通过构造器注入具体策略，对外提供统一的 `discountAmount(couponInfo, skuPrice)` 方法转调策略实现。作者补充：也可把各策略包装成 map 结构，让外部只需要对应的泛型类型即可使用相应服务，实现服务配置化。
- Key claims: 控制类 = 策略的持有者与统一入口，构造器注入实现「可替换」；map 包装可让优惠策略按券型配置化取用。
- Learner-relevant: 收口策略模式的调用侧——客户端只面向 Context，换策略即换注入，为测试验证铺路。

### 策略模式：测试验证

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式测试验证]]`
- Summary: 用四组 junit 单测分别验证四种券：直减 100-10 优惠后 90；满减（满100减10，商品100元）优惠后 90；折扣 9 折优惠后 90.00；n元购 90 元优惠后 90。四组测试均满足预期——四种券在原价 100 元上折扣 10 元、最终支付 90 元，与一把梭版本的意图一致。
- Key claims: 重构后四种券的计算结果与原 ifelse 逻辑等价（原价 100 → 支付 90）；不同券型通过注入不同策略实现获得不同计算路径。
- Learner-relevant: 用等价性测试证明策略重构对功能零破坏，同时获得开闭性收益。

### 策略模式：总结

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式总结]]`
- Summary: 提炼本章结论：策略模式案例相对简单，逻辑主要体现在不同类型优惠券的计算策略上，结构较简单但实际开发中非常常用；它与命令模式、适配器模式结构相似但思路有差异。使用策略模式可以把方法中的 if 语句优化掉——大量 if 使代码难以扩展、不好维护，而策略模式能很好满足隔离性与扩展性，方便承接不断新增的需求。
- Key claims: 策略模式与命令、适配器、组合模式结构近似但各有逻辑特点，选型需结合实践积累经验；核心收益 = 干掉大量 ifelse、满足隔离性与扩展性、易承接新需求。
- Learner-relevant: 收束为「何时用策略模式」的判断标准，并提示与相似模式辨析，是可迁移的选型结论。

### 模板模式：开发环境

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#模板模式开发环境]]`
- Summary: 说明本章演示环境：JDK 1.8 + Idea + Maven，涉及工程三个，源码通过公众号 bugstack虫洞栈回复「源码下载」序号18 获取；其中 itstack-demo-design-21-00 为场景模拟工程，用于模拟爬虫商品生成海报场景。
- Key claims: 配套工程 21-00 承载「模拟爬虫生成海报」的场景模拟；演示环境与全书一致。
- Learner-relevant: 建立模板模式章节的工程与场景坐标。

### 模板模式：模式介绍

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#模板模式介绍]]`
- Summary: 点明模板模式的核心设计思路：在抽象类中定义抽象方法的执行顺序，将抽象方法设定为只有子类实现、但不设计独立访问的方法，简单说就是「把你安排得明明白白」。用西游记九九八十一难类比：每一关都是师傅被掳走、打妖怪、妖怪被收走，具体什么妖怪、怎么打由你自己定义，执行顺序和基本策略由框架（观音）固定。
- Key claims: 模板模式意图 = 定义一个操作中的算法的骨架，将一些步骤延迟到子类中，使子类不改变算法结构即可重定义某些特定步骤；父类定义执行标准并串联成完整业务流程。
- Learner-relevant: 给出「骨架固定 + 步骤下放子类」的模式定义锚点，是理解爬虫三步流程的核心概念。

### 模板模式：案例场景模拟（爬虫海报）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#模板模式案例场景模拟]]`
- Summary: 引入本章业务：模拟爬虫各类电商商品、生成含个人邀请码的营销推广海报以赚取商品返利（声明是模拟爬取、并未真爬）。整个爬取过程分为三个步骤：模拟登录、爬取信息、生成海报；并给出三点理由支持模板模式：有些商品只有登录后才可爬取且登录能看到特定价格（与未登录不同）；不同电商网站爬取方式与解析方式不同，可作为每个实现类的特定实现；生成海报步骤基本一样，但会有特定商品来源标识。
- Key claims: 三步骨架 = 模拟登录 → 爬取信息 → 生成海报；公共骨架 + 各站差异步骤正是模板模式要抽象的结构。
- Learner-relevant: 确立「统一流程 + 子类定制」的业务模板，是模板模式的场景原型。

### 模板模式：搭建工程（工程结构与模型结构）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#模板模式模型结构]]`
- Summary: 展示工程 itstack-demo-design-21-00 的结构：`NetMall.java`（定义抽象方法执行顺序的核心抽象类）、`HttpClient.java`、`group` 包下三个模拟电商实现 JDNetMall、TaoBaoNetMall、DangDangNetMall，以及测试类 ApiTest。指出模板模式的业务场景在平时开发中不算多，因为要在抽象类中定义逻辑行为的执行顺序；它可控制整套逻辑的执行顺序与统一的输入输出，实现方只需关心自己的业务逻辑。本章只需记住三步实现：模拟登录、爬取信息、生成海报。
- Key claims: 模型 = 一个核心抽象类 + 三个电商子类实现；模板模式收益 = 统一执行顺序与输入输出、实现方只关心自身业务。
- Learner-relevant: 建立模板模式「抽象骨架类 + 具体子类」的结构化认知，是全章核心类图。

### 模板模式：抽象类定义执行顺序（NetMall）

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#定义执行顺序的抽象类]]`
- Summary: 给出抽象类 `NetMall`（基础电商推广服务）：持有 uId/uPwd 与构造器；对外公开方法 `generateGoodsPoster(String skuUrl)` 依次执行——1 验证登录（login 失败返回 null）、2 爬虫商品（reptile 提取商品信息）、3 组装海报（createBase64 返回 base64 图片信息）；并声明三个抽象方法 login（模拟登录）、reptile（爬虫提取商品信息，含登录后的优惠价格）、createBase64（生成商品海报信息），让外部继承方实现。
- Key claims: 抽象类只固定「生成最优价商品海报、海报含推广邀请码」的目标与三步执行顺序；三个抽象方法不设独立访问，全部交由子类实现，这是模板模式的灵魂。
- Learner-relevant: 展示模板方法本体的写法——非抽象方法编排骨架、抽象方法下放子类，是子类继承的契约。

### 模板模式：模拟爬虫京东

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#模拟爬虫京东]]`
- Summary: 给出 `JDNetMall extends NetMall`：login 模拟京东用户登录并返回 true；reptile 通过 HttpClient.doGet 抓取页面、用正则 `(?<=title>).*(?=</title)` 截取商品名、固定 price 为 5999.00 存入 ConcurrentHashMap 返回；createBase64 用 BASE64Encoder 对 JSON.toJSONString(goodsInfo) 编码模拟生成海报图片。
- Key claims: 三个子类步骤各自定制爬取与解析方式，抽象类完全复用；商品名来自正则解析、价格为模拟值 5999.00 元。
- Learner-relevant: 第一个子类样板——示范如何按模板契约实现登录/爬取/生成三步。

### 模板模式：模拟爬虫淘宝

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#模拟爬虫淘宝]]`
- Summary: 给出 `TaoBaoNetMall extends NetMall`，实现与京东类同：login 模拟淘宝用户登录返回 true；reptile 同样用正则解析商品名、固定 price 为 4799.00；createBase64 对商品 JSON 编码生成 base64 海报。作者注明"同上"，即模拟登录、爬取与创建图片 base64 的套路一致。
- Key claims: 三个步骤的骨架行为一致，仅爬取解析与价格（4799.00）不同；验证了「公共模板 + 差异化子类」的复用。
- Learner-relevant: 第二个子类，对比京东实现强化「只改差异部分」的模式认知。

### 模板模式：模拟爬虫当当

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#模拟爬虫当当]]`
- Summary: 给出 `DangDangNetMall extends NetMall`，套路与京东、淘宝一致：login 模拟当当用户登录返回 true；reptile 用正则解析商品名、固定 price 为 4548.00；createBase64 对商品 JSON 编码生成 base64 海报。作者再次注明"同上"。
- Key claims: 三个电商子类共用同一个三步执行骨架，差异只在各自的价格与日志标识（4548.00）；子类无需关心调用逻辑。
- Learner-relevant: 第三个子类完成三站点示范，印证模板模式对多实现的一致控制。

### 模板模式：测试验证

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#模板模式测试验证]]`
- Summary: 给出测试类 test_NetMall：提供京东/淘宝/当当三条商品链接，实例化 `new JDNetMall("1000001","*******")` 调用 generateGoodsPoster 生成京东商品（https://item.jd.com/100008348542.html）的推广海报。运行日志依次输出模拟京东用户登录、模拟京东商品爬虫解析（Apple iPhone 11 5999.00 元）、模拟生成京东商品 base64 海报，最终打印 base64 编码的测试结果，进程正常退出；可替换为 new TaoBaoNetMall 或 new DangDangNetMall 验证其他站点。
- Key claims: 一次调用即按抽象类固定顺序完整执行三步，子类差异化实现被自动编排；更换电商只需替换实例化的子类对象，调用方零改动。
- Learner-relevant: 用等价演示证明模板模式统一流程的价值——骨架固定、站点可插拔。

### 模板模式：总结

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#模板模式总结]]`
- Summary: 提炼本章结论：模板模式在定义统一结构（执行标准）上非常方便，很好地控制了后续实现者不用关心调用逻辑、按统一方式执行，类的继承者只需关心具体业务逻辑实现；它也是为解决「子类通用方法放到父类中」设计的优化，提取公用代码、行为由父类管理、扩展可变部分，非常利于开发拓展和迭代。但每种设计模式都有自身特定场景，超过场景外的建设需要额外考虑其他模式的运用，而不是生搬硬套。
- Key claims: 收益 = 统一执行标准、提取公用代码、父类管行为、子类扩展可变部分；边界 = 每种模式有特定场景，超场景应用需慎重、活学活用需多实践。
- Learner-relevant: 收束为「何时用模板模式」的判断标准，并提示不可生搬硬套，是可迁移的选型结论。