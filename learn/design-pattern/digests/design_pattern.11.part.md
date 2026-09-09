---
source: design_pattern
source_lines: 24398
part: 11
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 11)

## Overview (L1)

第 1 节讲解责任链模式（Chain of Responsibility）。业务场景是模拟 618 电商大促期间系统上线的多级负责人审批流程：平常系统上线只需三级负责人审批，临近 618 因稳定性要求提高，审批力度增强，需二级、一级负责人一起加入审批链。本章先用「if + 时间范围判断」的一坨代码实现该需求，指出其难以扩展、流程写死；再用继承统一抽象类 AuthLink、通过 appendNext 串联节点的责任链模式重构，使审批节点可以动态编排、做成可配置化，最后用 JUnit 测试验证链式审批逐级传递直至完成。

## Sections (L2)

### 一、开发环境
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一、开发环境]]`
- Summary: 说明本章开发环境（JDK 1.8、Idea + Maven）与三个示例工程的分工：itstack-demo-design-13-00 为场景模拟工程（模拟一个上线流程审批的接口）、13-01 用一坨代码实现业务需求、13-02 用设计模式优化改造代码，形成对比学习。
- Key claims: 学习编程要有实操场景（「下水试试才能学会狗刨」）；三个工程分别对应场景模拟、坏味道实现、设计模式重构三个版本。
- Learner-relevant: 明确了本章对照实验结构——先模拟场景，再写坏代码，最后用责任链重构。

### 二、责任链模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#二、责任链模式介绍]]`
- Summary: 介绍责任链模式的引入比喻「击鼓传雷」（海边围坐互相传递点燃的炸弹）。说明其核心是解决一组服务中的先后执行处理关系，就像家庭财务支出审批（10 块钱以下找闺女、100 块钱先闺女再媳妇审批），或跳槽时被各个领导依次签字放行的场景。
- Key claims: 责任链模式核心解决「一组服务先后执行处理的关系」；每个审批者像链条上的一个节点，请求沿着链依次传递。
- Learner-relevant: 建立责任链「顺序传递、逐节点处理」的心智模型，与家庭审批、领导签字的日常经验挂钩。

### 三、案例场景模拟
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]`
- Summary: 描述业务背景：阿里、京东、拼多多等一线电商在 618 期间会做运营活动与扩容备战，所有开发系统需陆续上线，为保障线上稳定性尽可能减少上线，并随特定时间点增强审批力度（类似一级响应、二级响应），增加不同级别的负责人加入审批，每个人都像责任链模式中的一个核心点。对研发同学来说不需要关心审批流程细节，只需知道上线更严格、级别更高，仍点击相同的提审按钮等待审核。
- Key claims: 审批链随时间点动态变化（平日三级审批、大促加入二级/一级审批）；研发人员只面向统一的提审入口，不关心内部审批细节。
- Learner-relevant: 还原「流程随业务时间点动态调整」的工程语境，说明为什么需要可编排的审批链。

### 1. 场景模拟工程
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#1. 场景模拟工程]]`
- Summary: 场景模拟工程 itstack-demo-design-13-00 结构非常简单，只有一个模拟审核和查询审核结果的服务类 AuthService，位于 org.itstack.demo.design 下。相当于可以调用该类去审核工程和获取审核结果，结果信息模拟写入缓存实现。
- Key claims: 场景模拟工程只提供 AuthService 单一服务类；审核结果以缓存（内存 Map）形式模拟。
- Learner-relevant: 明确了后续两种实现共同依赖的模拟审核服务基础。

### 2. 场景简述
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2. 场景简述]]`
- Summary: 给出 AuthService 的核心代码：内部用 ConcurrentHashMap<String, Date> authMap 记录审核结果，提供两个接口——queryAuthInfo(uId, orderId) 查询审核结果，auth(uId, orderId) 处理审核。将「由谁审核 + 审核单子 ID」作为唯一 key 记录到内存 Map 结构中。
- Key claims: 审核状态以「审批人 ID + 订单 ID」为 key 存入内存 Map；auth 写入审核时间（Date 非空代表已审核），queryAuthInfo 返回该时间。
- Learner-relevant: 理解后续责任链各节点判断「是否已审核」依据的是 authMap 中对应时间是否为空。

### 四、用一坨代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#四、用一坨代码实现]]`
- Summary: 讲解工程 itstack-demo-design-13-01 的坏味道实现：按照需求，平常系统上线只需三级负责人审批，618 大促时间点需二级、一级负责人一起加入审批流程，此处用非常直接的 if 判断方式（时间范围判断）实现该需求。
- Key claims: 通过嵌套 if 按时间范围判断该由几级审批人参与；功能实现简单，但实际业务会有很多部门，这样实现很难扩展、改动调整非常麻烦。
- Learner-relevant: 记住「流程写死 + if 判断」的反模式，作为后续责任链重构的对照坏味道样本。

### 1. 工程结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#1. 工程结构]]`
- Summary: itstack-demo-design-13-01 工程结构非常简单，只包含一个审核控制类 AuthController，位于 org.itstack.demo.design 下。就像有些伙伴开始写代码一样，一个类写所有需求。
- Key claims: 一坨代码版本只有一个控制类，所有审批逻辑堆在一个类里。
- Learner-relevant: 直观看到「一个类写所有需求」的典型坏味道起点。

### 2. 代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2. 代码实现]]`
- Summary: 给出 AuthController.doAuth 的核心代码：先查询三级审批（审批人「王工」，id 1000013）是否完成，未完成返回「待三级审批负责人」；再判断审批时间在 2020-06-01 至 06-25 范围内则检查二级审批（「张经理」，1000012）；再判断时间在 2020-06-11 至 06-20 范围内则检查一级审批（「段总」，1000011）；否则返回「审批完成」。
- Key claims: 审批节点与人员一一对应（三级=王工、二级=张经理、一级=段总）；审批力度由时间范围动态叠加（大促期间需三级+二级+一级全部审批）；所有逻辑写死在一个方法内，扩展一个部门就要改一个方法。
- Learner-relevant: 看清 ifelse 版审批流的实现细节与扩展痛点，为对比责任链版本做准备。

### 3. 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#3. 测试验证]]`
- Summary: 用 JUnit 测试逐步验证：模拟三级审批「王工」→ 模拟二级审批「张经理」→ 模拟一级审批「段总」→ 最终输出「审批完成」。每次查询 doAuth 查看审批流程节点，AuthService.auth 模拟对应负责人审批操作节点状态。测试日志逐级返回「待三级/二级/一级审批负责人」直至审批完成，进程正常退出。
- Key claims: 单看测试结果功能满足诉求（能逐级审批并最终完成）；但流程写死（「代码写的死死的」），很难扩展和调整流程。
- Learner-relevant: 功能正确 ≠ 结构良好——为后续责任链重构提供「改动前基线」与对照结果。

### 五、责任链模式重构代码
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#五、责任链模式重构代码]]`
- Summary: 说明重构思路：责任链模式可以让各个服务模块更加清晰，每个模块间通过 next 方式获取，每个 next 由继承的统一抽象类实现，最终所有类的职责可以动态编排使用，编排过程可做成配置化。工程为 itstack-demo-design-13-02，代码结构包含 impl 包下的 Level1AuthLink、Level2AuthLink、Level3AuthLink 三个实现类以及 AuthInfo、AuthLink。
- Key claims: 通过继承统一抽象类实现 next 串联，职责可动态编排且可配置化；责任链让模块清晰、替换掉 if 分支。
- Learner-relevant: 确立责任链重构的核心机制——「统一抽象类 + next 指针 + 动态编排」。

### 责任链模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#责任链模式模型结构]]`
- Summary: 说明责任链结构的核心部分：通过三个实现了统一抽象类 AuthLink 的不同规则类（Level1/Level2/Level3AuthLink），再通过责任编排模拟出一条链路，这个链路就是业务中的责任链。一般使用责任链时，若场景比较固定可以写死到代码中初始化；若业务场景经常变化可做成 xml 配置方式处理，也可落到库里进行初始化。
- Key claims: 三个实现类 + 责任编排构成一条业务责任链；场景固定可写死初始化，场景多变可 xml/落库配置化。
- Learner-relevant: 掌握责任链「节点可增删、编排可配置」的扩展性来源。

### 2. 代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2. 代码实现]]`
- Summary: 逐一给出重构核心代码：AuthInfo 包装责任链处理过程中返回的结果（code + 不定长 infos 拼接 info）；AuthLink 是链接起来的核心抽象类，持有 levelUserId/levelUserName 标记每个审核节点的人员信息、private AuthLink next 责任链指针，提供 next() 获取下一节点、appendNext() 追加下一节点并返回 this（支持链式调用），并声明抽象方法 doAuth(uId, orderId, authDate) 供不同审核级别实现不同业务。
- Key claims: appendNext 返回 this 实现链式组装；next 为 null 表示链尾；levelUserId/levelUserName 是责任链中的公用信息，标记每个审核节点人员。
- Learner-relevant: 学会「抽象类持 next 指针 + appendNext 链式编排 + 抽象 doAuth」的责任链骨架写法。

### 2.3 三个审核实现类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.3 三个审核实现类]]`
- Summary: 给出 Level1AuthLink、Level2AuthLink、Level3AuthLink 三个实现类：先通过 AuthService.queryAuthInfo(levelUserId, orderId) 判断本节点是否已审核，未审核则返回「待某级审批负责人」；已审核则取 super.next()，无下一节点则返回该级「审批完成」结果（含时间与审批人）；Level2/Level3 额外用 beginDate/endDate 时间范围判断在 618 期间是否需要本级审批，范围内则继续 next.doAuth(uId, orderId, authDate) 把请求传递给下一节点，像递归调用。
- Key claims: 每级节点「先查自身审核状态，未审返回待审，已审则判断时间范围后递交给 next」；next.doAuth 递归传递请求直到链尾输出完成；三级负责人在链首，一级负责人在链尾。
- Learner-relevant: 理解责任链每个节点的「自审 + 传递」职责，以及时间范围如何动态决定审批链长度。

### 3. 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#3. 测试验证]]`
- Summary: 用 JUnit 测试验证责任链：通过链式构造 AuthLink authLink = new Level3AuthLink("1000013","王工").appendNext(new Level2AuthLink("1000012","张经理").appendNext(new Level1AuthLink("1000011","段总")))，把不同责任节点组装成一条完整业务责任链（实际业务中会包装到控制层）；随后不断执行 authLink.doAuth(...) 查看审核链路，通过返回结果对数据做 3、2、1 级负责人审批，直至最后审核全部完成。测试日志逐级返回「待三级/二级/一级审批负责人」最终输出「一级审批完成…审批人：段总」，进程正常退出。
- Key claims: 责任链已生效，按链条结构一层层审批直至一级完成；责任链设计方式便于扩展和维护，把 if 语句干掉了。
- Learner-relevant: 对比 ifelse 版，验证重构后审批链的可编排性与扩展性提升。

### 六、总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]`
- Summary: 总结从 if 语句重构到责任链模式的收益：代码结构变得清晰干净，解决了大量 if 语句的使用。说明并非 if 语句不好，只是 if 不适合做系统流程设计，在做判断和行为逻辑处理中仍非常可用；组合模式搭建的流程决策树可以与责任链模型组合扩展使用，重点在于如何关联链路，最终的执行都在执行中间的关系链。
- Key claims: 责任链很好地处理了单一职责和开闭原则，解耦使对象关系更清晰，外部调用方不需要关心责任链如何处理（可将责任链组合包装后提供给外部）；但要选择适当场景使用，避免造成性能问题以及编排混乱、调试测试疏漏。
- Learner-relevant: 收敛本章：识别「先后顺序审批/处理」场景 → 用责任链抽象类 + appendNext 编排重构，同时用「if 适合判断、不适合流程设计」来界定模式边界与代价。