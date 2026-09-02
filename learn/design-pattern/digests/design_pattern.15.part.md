---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 24398
part: 15
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 15)

## Overview (L1)
第 7 节讲解状态模式（State pattern）：允许对象在内部状态发生改变时改变它的行为，使对象看起来好像修改了它的类。场景是模拟营销活动的审核状态流转（编辑→待审核→审核通过/拒绝→活动中→关闭/开启），先给出 if-else 一把梭的直白实现，再重构为 State 抽象类 + 具体状态类 + StateHandler 的统一处理中心，最后通过测试验证两种实现下有效流转与拒绝流转均符合预期。

## Sections (L2)

### 一、开发环境
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一、开发环境]]`
- Summary: 说明本章示例的开发环境为 JDK 1.8、Idea + Maven，涉及三个工程：itstack-demo-design-19-00（场景模拟工程，模拟营销活动操作服务：查询、审核）、19-01（用一坨代码实现业务需求）、19-02（通过设计模式优化改造，产生对比从而学习）。
- Key claims: 三个工程分别承担「场景模拟」「坏实现」「模式重构」三个角色；源码需关注公众号 bugstack 虫洞栈 序号 18 获取。
- Learner-relevant: 建立「坏实现 vs 模式重构」对照学习的心理预期。

### 二、状态模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#二、状态模式介绍]]`
- Summary: 解释状态模式的本质——描述一个行为下的多种状态变更，通过改变状态让整个行为发生变化，并给出两个生活化类比：网站登录与不登录展示内容不同、磁带放音机按钮在特定状态下才可按下（按钮互斥）。
- Key claims: 状态模式通过改变内部状态来改变对象行为；磁带机类比点出「只有处于某个状态下才能触发另一操作」，这是状态机约束流转的关键。
- Learner-relevant: 用登录态与放音机类比为状态模式建立直观锚点。

### 三、案例场景模拟
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]`
- Summary: 引入营销活动审核状态流转场景——活动上线需多层级审核，审核通过才能进入活动中，不能从编辑直接到活动中；大部分程序员都开发过此类需要审核后才对外发布的业务。随后拆解场景模拟工程结构（ActivityInfo / Status / ActivityService 三个类）及其代码实现。
- Key claims: 活动枚举 7 个状态：1创建编辑(Editing)、2待审核(Check)、3审核通过(Pass，任务扫描成活动中)、4审核拒绝(Refuse，可撤审回到编辑状态)、5活动中(Doing)、6活动关闭(Close)、7活动开启(Open，任务扫描成活动中)；ActivityService 用静态 ConcurrentHashMap 记录活动ID与状态，提供 init/queryActivityInfo/queryActivityStatus/execStatus（synchronized 且校验 beforeStatus 后才变更），实际开发中这类信息来自数据库或 Redis。
- Learner-relevant: 记住 7 个状态枚举与「审核通过/开启后需任务扫描才进入活动中」的流转细节。

### 四、用一坨坨代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#四、用一坨坨代码实现]]`
- Summary: 展示最粗暴的 if-else 直白实现：ActivityExecStatusController 通过嵌套 if 按 beforeStatus 判断允许的 afterStatus 集合，合法的调用 ActivityService.execStatus 变更状态并返回 code 0000 成功，否则返回 0001 拒绝。状态流转规则：1编辑中→提审、关闭；2审核通过→拒绝、关闭、活动中；3审核拒绝→撤审、关闭；4活动中→关闭；5活动关闭→开启；6活动开启→关闭。
- Key claims: 面向过程式 if-else 在不需要改动与迭代的场景下可用，但状态和需求变化时难以维护、后人看不懂且容易乱填流程，「越来越乱就是从点滴开始的」；测试验证编辑中→审核拒绝被拒(code 0001)、编辑中→提交审核成功(code 0000)，符合预期但不建议这样开发。
- Learner-relevant: 识别直白实现的可维护性痛点，作为状态模式重构的对照基线。

### 五、状态模式重构代码
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#五、状态模式重构代码]]`
- Summary: 用状态模式做一次小重构：State 抽象类定义 7 个操作接口（活动提审 arraignment、审核通过 checkPass、审核拒绝 checkRefuse、撤审撤销 checkRevoke、活动关闭 close、活动开启 open、活动执行 doing），每种状态一个实现类（EditingState、CheckState、PassState、RefuseState、DoingState、CloseState、OpenState），每个方法内直接控制该状态能流转到下一步，不再需要 if 判断；StateHandler 用 Map<Enum<Status>, State> 把状态与实现关联，对外提供同名接口供调用方直接使用。附 4 组测试：编辑→提审成功(0000)、编辑→开启被拒(0001)、拒绝→活动中被拒(0001)、拒绝→撤审成功(0000)。
- Key claims: 关键点是每个状态到下一个状态的流转都分配到各实现类的方法中控制，消除了 if 语言判断；StateHandler 让外部调用无需再像坏实现那样传两个状态判断，接口名更直观；测试覆盖了有效流转与拒绝流转两种情形，不同状态服务处理不同内容。
- Learner-relevant: 掌握「抽象类接口 + 具体状态类 + 集中式 Handler 映射」的状态模式三件套骨架，这是本章可直接照抄的实现结构。

### 六、总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]`
- Summary: 对比两种实现方式：设计模式处理后已无 if-else，结构更清晰、易于扩展；代码从面向过程转向面向对象结构，满足单一职责与开闭原则，增加和修改功能不影响整体。同时指出状态模式在状态与流转较多时会产生较多实现类，带来编码时间成本，需要按需评估投入回报率，关键看是否经常修改、能否组件化、能否抽离业务与非业务功能。
- Key claims: 状态模式极大改变原有代码结构，让扩展和维护更容易；符合单一职责与开闭原则；代价是类数量增多，需按场景评估投入产出。
- Learner-relevant: 理解状态模式的收益与成本权衡，学会判断何时值得用状态模式。