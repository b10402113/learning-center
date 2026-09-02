---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 24398
part: 3
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 3)

## Overview (L1)

- 第 3 节 建造者模式：以装修公司推出套餐装修服务（吊顶/涂料/地板/地砖四种物料按品牌自由组合成不同套餐）为业务场景，先讲解模式意图——将复杂对象的构建与其表示相分离，使同样的构建过程可以创建不同表示；再用 ifelse 实现原始需求展示维护灾难，最后用「装修包接口(IMenu) + 装修包实现(DecorationPackageMenu) + 建造者(Builder)」重构出相同的报价结果，并总结选择建造者模式的时机与取舍。改写了互联网代码「需求快速迭代、ifelse 贴膏药式维护」的开场动机与「何时选用此模式」的收尾心得。

## Sections (L2)

### 开发环境

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#开发环境]]`
- Summary: 说明本书演示工程的环境与三个工程的关系：JDK 1.8 + Idea + Maven；itstack-demo-design-3-00（场景模拟工程，模拟装修套餐选择：豪华、田园、简约）、3-01（用一坨代码即 ifelse 实现需求）、3-02（通过设计模式优化改造代码，产生对比以便学习）。
- Key claims: 三个配套工程分别承担「场景模拟 / ifelse 原版 / 模式重构」的对比学习路线；案例围绕装修过程中套餐选择（豪华、田园、简约）展开。
- Learner-relevant: 为后续 ifelse 与建造者两种实现的对比建立工程坐标。

### 建造者模式介绍

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#建造者模式介绍]]`
- Summary: 用「王者荣耀初始化界面：三条路、树木、野怪、守卫塔按网络情况与不同模式反复组装」类比，说明建造者模式是通过将多个简单对象一步步组装出复杂对象的过程；其最终意图是「将复杂的构建与其表示相分离，使得同样的构建过程可以创建不同的表示」。
- Key claims: 相同物料、不同组装产生不同内容正是建造者模式的意图；建造者模式适合「多个简单对象逐步组装成复杂对象」的构造场景。
- Learner-relevant: 给出模式的定义锚点，是理解后续装修套餐组装的核心概念。

### 案例场景模拟

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#案例场景模拟]]`
- Summary: 引入装修公司推出套餐装修服务的业务：套餐背后是不同商品的组合（一级&二级吊顶、多乐士涂料、圣象地板、马可波罗地砖等），按套餐价格选取不同品牌组合，再按装修面积给出整体报价；模拟工程 itstack-demo-design-3-00 提供装修所需物料 ceilling(吊顶)、coat(涂料)、floor(地板)、tile(地砖) 四类。
- Key claims: 套餐服务 = 不同品牌物料按价格档位组合 + 按面积整体报价；演示工程仅含四类物料，实际装修物料远多于此。
- Learner-relevant: 确立「同类物料不同品牌 → 不同套餐」的可复用组合模型，是建造者模式的场景原型。

### 场景简述：物料接口

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#物料接口]]`
- Summary: 定义物料统一接口 Matter，提供 scene()（场景：地板、地砖、涂料、吊顶）、brand()（品牌）、model()（型号）、price()（价格）、desc()（描述）五个方法，保证所有装修材料按统一标准获取信息。
- Key claims: 统一接口使四种物料可以标准化读取品牌、型号、价格与描述；Matter 是所有物料类的公共契约。
- Learner-relevant: 为后面 ifelse 与建造者实现共享同一组物料类奠定基础。

### 场景简述：吊顶

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#吊顶]]`
- Summary: 给出两种吊顶物料的实现：LevelOneCeiling（一级顶，品牌「装修公司自带」，价格 260 元，造型只做低一级、只有一层，一般离顶 120-150mm）与 LevelTwoCeiling（二级顶，价格 850 元，两个层次，二级顶高度一般下吊 20cm，层高很高时可增加每级厚度）。
- Key claims: 同一「吊顶」场景下有低档(260 元)与高档(850 元)两种选择，是套餐档次差异的来源之一。
- Learner-relevant: 展示 Matter 接口的具体实现范式（六个样板方法逐一覆写）。

### 场景简述：涂料

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#涂料]]`
- Summary: 给出两种涂料物料：DuluxCoat（多乐士，第二代，价格 719 元，阿克苏诺贝尔旗下品牌、畅销全球 100 个国家）与 LiBangCoat（立邦，默认级别，价格 650 元，以开发绿色产品、注重高科技高品质为目标）。
- Key claims: 涂料同样提供品牌差异的两档物料，价格为 719 / 650 元。
- Learner-relevant: 延续「同场景多品牌实现 Matter」的物料库扩展方式。

### 场景简述：地板

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#地板]]`
- Summary: 给出两种地板物料：DerFloor（德尔，A+，价格 119 元，全球领先木地板制造商、北京 2008 奥运会家装公装地板供应商）与 ShengXiangFloor（圣象，一级，价格 318 元，中国地板行业著名品牌，持驰名商标、中国名牌等荣誉）。
- Key claims: 地板档位为 119 / 318 元，低档可选德尔、高档可选圣象。
- Learner-relevant: 完成四种物料中的第三类，为套餐组合提供更多品牌备选。

### 场景简述：地砖

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#地砖]]`
- Summary: 给出两种地砖物料：DongPengTile（东鹏瓷砖，型号 10001，价格 102 元，2014 品牌价值 132.35 亿元位列建陶行业榜首）与 MarcoPoloTile（马可波罗 MARCO POLO，型号缺省，价格 140 元，1996 年诞生、以「文化陶瓷」占领市场、享有「仿古砖至尊」美誉）。
- Key claims: 地砖档位为 102 / 140 元；以上全部物料构成装修公司提供的「装修配置单」，接下来通过案例用不同物料组合出不同套餐服务。
- Learner-relevant: 结束场景模拟部分，完整物料库（吊顶/涂料/地板/地砖各两档）就绪，可供后续两种实现取用。

### 工程结构

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#工程结构]]`
- Summary: 展示 ifelse 工程 itstack-demo-design-3-01 的结构：仅一个核心类 DecorationPackageController.java；作者点明这是「一个类几千行代码」潜质的类，先直白实现功能再以设计模式优化，并强调这类直来直去、无复杂类关系的代码除了扩展性差外，做 demo 工程尚可。
- Key claims: 原版实现只有一个控制器类承载全部套餐逻辑；ifelse 写法的代价是无法良好扩展。
- Learner-relevant: 与重构后「三个核心类」结构形成对比，凸显职责划分的价值。

### ifelse实现需求

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ifelse实现需求]]`
- Summary: 给出 DecorationPackageController.getMatterList(BigDecimal area, Integer level) 的完整实现：按 level 分三段 if（1 豪华欧式 = 二级顶+多乐士+圣象；2 轻奢田园 = 二级顶+立邦+马可波罗地砖；3 现代简约 = 一级顶+立邦+东鹏地砖），每段内部 new 具体物料、加入清单并按面积乘以系数累加价格（吊顶×0.2、涂料×1.4、地板/地砖×面积单价），最后拼接装修清单文本返回；作者总结其为「接收面积与等级参数 → 按等级选料 → 生成清单与成本 → 返回明细」。
- Key claims: 每个 if 块内重复三样物料与三段相同的价格计算逻辑，清单与价格混在一个方法里；面积换算系数：吊顶按面积×0.2、涂料按面积×1.4、地板与地砖按面积直接相乘。
- Learner-relevant: 形成对照样本——记住这套「重复、难扩展」的写法，后续用建造者模式等价重构。

### 测试验证

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#测试验证]]`
- Summary: 用 junit 单测分别调用 getMatterList(132.52,1)、(98.25,2)、(85.43,3)，输出三份装修清单：豪华欧式 198064.39 元、轻奢田园 119865.00 元、现代简约 90897.52 元，均已具备装修公司报价单的观感；作者强调日常写好单测可更好提高系统健壮度，并指出随着老板对业务快速迭代、按户型提供更多套餐，这段 ifelse 代码会迅速扩增到几千行、像膏药一样难以维护。
- Key claims: 三档套餐报价分别为 198064.39 / 119865.00 / 90897.52 元，价格随材料档次递减；ifelse 实现当前满足功能，但面对套餐快速扩张将不可维护。
- Learner-relevant: 提供基准测试数据，重构后应输出完全一致的结果，用于验证模式重构等价性。

### 代码实现：装修包接口

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#装修包接口]]`
- Summary: 重构方案的第一步：定义 IMenu 接口，声明 appendCeiling(Matter)（吊顶）、appendCoat(Matter)（涂料）、appendFloor(Matter)（地板）、appendTile(Matter)（地砖）四个填充物料的方法，以及 getDetail()（明细）方法；作者说明接口类定义了填充各项物料与最终获取全部明细的方法。
- Key claims: 接口把「逐项填充物料」和「输出明细」抽象为统一契约；构建过程与具体物料解耦。
- Learner-relevant: 这是建造者模式「将构建与表示分离」的结构化体现。

### 代码实现：装修包实现

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#装修包实现]]`
- Summary: 给出 DecorationPackageMenu 实现类：持有 list(装修清单)、price(装修价格)、area(面积)、grade(装修等级) 字段，构造函数接收 Double area 与 String grade；四个 appendXxx 方法把物料加入清单、按各自系数累加价格（吊顶×0.2、涂料×1.4、地板/地砖×面积单价），且每个方法都返回 this 以支持链式连续填充；getDetail() 拼接完整装修清单文本。
- Key claims: 每个填充方法返回 this 实现流畅的链式调用；吊顶与涂料按平米数乘以常数计算报价，地板与地砖按面积直接累加；清单文本输出格式与原 ifelse 版一致。
- Learner-relevant: 展示了建造者模式的「填充器」角色——承载物料与价格计算的中间衔接层。

### 代码实现：建造者方法

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#建造者方法]]`
- Summary: 给出 Builder 类：levelOne(area)（豪华欧式 = 二级顶+多乐士+圣象）、levelTwo(area)（轻奢田园 = 二级顶+立邦+马可波罗地砖）、levelThree(area)（现代简约 = 一级顶+立邦+东鹏地砖）三个方法，用同一套「new DecorationPackageMenu(area, 等级).appendCeiling(...).appendCoat(...).appendFloor/appendTile(...)」的链式建造方式组装不同套餐；作者指出若业务扩展可将套餐内容配置到数据库自动生成，但整体思路仍可用创建者模式搭建。
- Key claims: 统一的建造方式、通过不同物料填充出不同装修风格；套餐即「构造参数+逐项物料填充」的组合，与 ifelse 分支一一对应。
- Learner-relevant: 建造者模式的收口——把「创建过程」集中到 Builder，新增套餐只需新增一个建造方法而非改 ifelse。

### 测试验证

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#测试验证]]`
- Summary: 用单测调用 builder.levelOne(132.52D).getDetail()、levelTwo(98.25D)、levelThree(85.43D)，输出三份清单与 ifelse 版本结果完全一致（198064.39 / 119865.00 / 90897.52 元），但调用方式更加链式清晰；作者总结重构后的代码结构可方便、有条理地扩展业务开发，而非把所有代码写进 ifelse。
- Key claims: 重构前后测试输出完全一致，证明模式重构保持行为等价；调用方式从「传 int 等级」变为「按档次链式组装」，语义更直观。
- Learner-relevant: 用等价性测试证明建造者模式对原功能零破坏，同时获得可扩展性。

### 总结

- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]`
- Summary: 提炼建造者模式的选用时机与代价：当「一些基本物料不变，而组合经常变化」时适合用此模式构建代码；它满足单一职责原则，具备可复用、建造者独立、易扩展、便于控制细节风险等优点；但物料与组合特别多时类不断扩展也会造成维护困难，此时可把重复内容抽象到数据库按需配置以减少代码重复。
- Key claims: 选用时机 = 基本物料稳定 + 组合频繁变化；优点 = 单一职责、可复用、易扩展、细节风险可控；缺点 = 物料/组合过多时类膨胀，可用数据库配置缓解；设计模式提供的是思想，能否清晰提炼出建造模块需经项目锻炼。
- Learner-relevant: 收束为「何时用建造者模式」的判断标准，是全章知识点的可迁移结论。