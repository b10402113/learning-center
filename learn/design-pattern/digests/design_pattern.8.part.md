---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 24398
part: 8
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 8)

## Overview (L1)

**第 3 节 组合模式**：核心是把相似对象（原子校验/决策逻辑）组合成可被调用的树形结构，对外统一提供服务，类似螺丝螺母通过链接组织出结构树。以营销差异化人群发券为场景——按 性别、年龄段 搭建规则决策树（节点=子叶，果实=最终发券结果），先用一坨 ifelse 快速实现展示其扩展性灾难，再用组合模式重构为可动态配置、可持久化到数据库的决策树引擎，最后对比验证两种实现结果一致。核心收益是符合开闭原则：无需更改模型结构即可新增逻辑节点并组织出新的关系树。

## Sections (L2)

### composite-dev-env（场景模拟工程）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-dev-env]]`
- Summary: 列出本节开发环境（JDK 1.8、Idea + Maven）；涉及两个对比工程：`itstack-demo-design-8-01`（用一坨代码实现业务需求）与 `itstack-demo-design-8-02`（通过设计模式优化改造代码），以产生对比从而学习。
- Key claims: 两个工程分别对应"直写 ifelse"与"组合模式重构"两条实现路径；工程 8-02 是重构后的目标形态。
- Learner-relevant: 先建立"直写 vs 重构"的双工程对照视角，便于后文逐段对比。

### composite-intro（组合模式介绍）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-intro]]`
- Summary: 说明组合模式的定义——通过把相似对象（方法）组合成一组可被调用的结构树对象的设计思路；以螺丝与螺母通过链接组织出结构树作类比，并给出三个原子校验服务（A身份证、B银行卡、C手机号）按需组合成 AB/CBA/单点 等不同关系树对外提供服务的例子。
- Key claims: 组合模式让服务节点自由组合对外提供服务；不同调用方可配置不同的组织关系树，树结构既可配置到数据库也可通过图形界面控制；恰当的设计模式让代码逻辑清晰、易于扩展，并降低团队新人学习成本。
- Learner-relevant: 抓住组合模式的核心动机——同质逻辑的不同组合方式统一对外的能力，作为本节的判别特征。

### composite-scenario-brief（场景简述）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-scenario-brief]]`
- Summary: 引出本节业务场景——一个简化版的营销规则 决策树：根据 性别、年龄 发放不同类型的优惠券，以刺激消费、精准促活。作者用"打车同距离价格不同""浏览男性向商品被推券"等日常营销案例说明场景真实性，并指出组合模式还可用于服务包装：将不同接口组合配置、对外提供服务能力。
- Key claims: 决策树按 性别/年龄 分流发放优惠券，服务差异化人群；不常使用软件的用户常获更大力度促活以增加粘性；组合模式复用场景还包括服务包装——将原子服务按需组合配置、减少开发成本。
- Learner-relevant: 明确本节决策树的具体形态（性别→年龄→发券结果），为阅读代码实现提供业务锚点。

### composite-project-structure（工程结构）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-project-structure]]`
- Summary: 展示"一把梭"工程 `itstack-demo-design-8-01` 的结构：全部业务判断堆在单一类 `EngineController.java` 中。作者用小姐姐与程序员之间"不断加需求"的对话漫画，还原 ifelse 从加性别、加年龄段、细分人群到改年龄段数值的一步步膨胀过程。
- Key claims: 直写版本只有一个 EngineController 类、无任何模型分层；需求层层追加导致 ifelse 与魔法值越积越多，最终值粘错位置引发女性用户客诉；作者评价"公司里要都是这样的程序员绝对省下不少成本……但千万别这么干"。
- Learner-relevant: 认识到"最快完成功能"的代价是扩展与维护成本失控，为理解组合模式重构动机铺垫。

### composite-straightforward-impl（一把梭实现需求）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-straightforward-impl]]`
- Summary: 展示 `EngineController.process(userId, userSex, userAge)` 的 ifelse 直写实现：外层按 性别(man/woman) 分支，内层按 年龄(<25 / >=25) 分支，分别返回 果实A/B/C/D。
- Key claims: 决策结果固定映射为四种果实（man+<25=果实A、man+>=25=果实B、woman+<25=果实C、woman+>=25=果实D）；每加一个维度或改一个阈值都要动判断逻辑与魔法值；实现最快、对新人也友好，但扩展性差。
- Learner-relevant: 记住 ifelse 直写版本的四分支映射，作为后文组合模式重构后的对照基准。

### composite-code-impl（代码实现）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-code-impl]]`
- Summary: 组合模式重构的核心代码，分为模型、过滤、引擎三块。基础对象：`TreeRich`（聚合对象，含树信息）、`EngineResult`（决策返回对象）、`TreeNode`（树节点，子叶/果实）、`TreeNodeLink`（树节点链路）、`TreeRoot`（树根）。决策逻辑：接口 `LogicFilter` 定义 `filter`（逻辑决策器）与 `matterValue`（获取决策值）；抽象类 `BaseLogic` 实现接口并提供通用决策方法（ruleLimitType 1等于/2大于/3小于/4小于等于/5大于等于）；`UserAgeFilter`/`UserGenderFilter` 分别从决策物料取 age/gender。引擎：接口 `IEngine` 统一入口；`EngineConfig` 用 map 静态注册 userAge/userGender 过滤器；抽象类 `EngineBase` 提供遍历决策树的核心流程 `engineDecisionMaker`；`TreeEngineHandle` 实现具体决策并返回 `EngineResult`。
- Key claims: `TreeNode` 用 `nodeType` 区分 1子叶/2果实，子叶节点通过 `ruleKey` 映射到具体 `LogicFilter`；`BaseLogic.filter` 遍历节点链路，按规则类型比对 `matterValue` 与 `ruleLimitValue`，返回下一节点 ID；`engineDecisionMaker` 从树根出发 while 循环，只要节点仍为子叶就取决策值→查过滤器→算下一节点，直到落到果实节点；`EngineConfig` 的 map 结构可抽取到数据库便于动态管理；决策值来源可扩展为数据库、RPC 接口、缓存运算等。
- Learner-relevant: 理解"节点/链路/过滤器/引擎"四个角色及其协作方式，就能看懂整棵树的组织与执行——这是组合模式在本书中的完整落地形态。

### composite-test-verify（测试验证）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-test-verify]]`
- Summary: 两套实现的测试验证对比。直写版本：`test_EngineController` 传入 userId=Oli09pLkdjh、性别 man、年龄 29，预期结果 果实B（对应业务：给头秃程序员发枸杞优惠券）。重构版本：`@Before init()` 手动组装整棵决策树（treeId=10001，根节点 1 规则 userGender，节点 11/12 规则 userAge，果实 111/112/121/122 = A/B/C/D，链路 1→11/12、11→111/112、12→121/122），再以相同入参调用 `TreeEngineHandle.process`。
- Key claims: 两次测试传入相同决策物料（man、29 岁）均得到 果实B；组合模式日志逐节点打印"决策树引擎=>… treeNode：11 ruleKey：userGender、treeNode：112 ruleKey：userAge"，与 ifelse 结果一致；决策树与业务通过 treeId 解耦，可按需传树ID；手动组装可抽取到数据库并扩展到图形界面配置，后续扩展只需在关系树中加节点。
- Learner-relevant: 验证重构后行为与直写完全一致（果实B），同时看到树的组装、配置与执行三者是如何解耦的。

### composite-model-structure（组合模式模型结构）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-model-structure]]`
- Summary: 整体解读组合模式的模型结构：模拟指导树由一组树ID（1、11、12、111、112、121、122）经节点串联组合成关系树；类图左侧是决策过滤器适配层——`LogicFilter` 接口、`BaseLogic` 抽象实现与 `UserAgeFilter`/`UserGenerFilter` 两个具体实现；右侧是对决策树执行引擎的定义——引擎接口 + 基础配置，配置中设定所需的决策节点。
- Key claims: 决策树的组织关系（节点-链路-果实）与执行引擎（过滤器-配置-引擎流程）被明确分层；新增决策能力只需新增一个 `LogicFilter` 实现并在配置 map 注册，即可参与组织新的关系树。
- Learner-relevant: 形成"过滤器适配层 + 引擎执行层 + 树模型数据层"的整体心智模型，作为阅读全部重构代码的索引图。

### composite-summary（总结）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-summary]]`
- Summary: 总结组合模式的适用价值与边界：主要解决一系列简单逻辑节点（或扩展的复杂逻辑节点）在不同结构组织下、对调用方仍然非常简单的问题；保证了开闭原则，无需更改模型结构即可提供新逻辑节点并组织出新关系树；但对功能差异化非常大的接口做包装会比较困难，需要额外的适配与特定化开发。
- Key claims: 组合模式让调用方以统一入口使用按树组织的逻辑节点，屏蔽内部结构差异；遵循开闭原则——扩展靠新增节点而非修改既有模型；对差异过大的接口包装并非不能处理，但需适配改造；好的代码结构源于对扩展性与可维护性的极致追求，不被"远不能给你指导提升能力的言论"影响而放弃自己的追求。
- Learner-relevant: 掌握组合模式的适用条件（同质逻辑的不同组合）与不适用场景（大差异化接口），用于后续设计模式选型判断。