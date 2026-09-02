---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 24398
part: 4
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 4)

## Overview (L1)

本节是《重学 Java 设计模式》第 4 节「原型模式」的前半部分：先铺垫模式动机（创建重复对象、对象生成耗时、用克隆节省时间，类比 Ctrl+C/V、`Object.clone()`、细胞有丝分裂），再引入「上机考试抽题混排」业务场景，给出场景模拟工程的两个物料类 `ChoiceQuestion`（选择题）与 `AnswerQuestion`（问答题）。随后展示「一把梭」实现 `QuestionBankController`：硬编码 5 道选择题 + 4 道问答题、拼装输出字符串，测试结果显示三位考生（花花/豆豆/大宝）题目与选项顺序完全一致，未实现乱序，暴露难以扩展的问题。最后是原型模式重构的引入与工程结构（`Topic`、`TopicRandomUtil`、`QuestionBank`、`QuestionBankController`），具体 `clone()` 重构代码留待本部分之后。

## Sections (L2)

### ch4-intro
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-intro]]`
- Summary: 开篇作者论学习态度（成就感、方向不对努力白费、先做 Demo 再谈理论），说明本书以贴近实际场景的案例讲解设计模式，并列出开发环境（JDK 1.8、Idea + Maven）与本节涉及的三个工程：4-00 场景模拟工程、4-01 一坨代码实现、4-02 设计模式优化。
- Key claims: 设计模式学而无效的原因往往是「案例太空太虚，不贴近实际场景」；本节通过三个工程的对比来学习（场景 → 一把梭 → 模式重构）。
- Learner-relevant: 明确本节三个工程各自的职责，为后面对比「一把梭 vs clone() 重构」建立骨架。

### ch4-prototype-intro
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-prototype-intro]]`
- Summary: 介绍原型模式要解决的核心问题：创建重复对象，且对象内容复杂、生成过程耗时长（可能从数据库或 RPC 接口获取数据），因此用克隆的方式节省时间。列举生活/编程中的原型场景：Ctrl+C/V 复制粘贴代码、Java 多数类提供 `Object clone()` API、细胞的有丝分裂。
- Key claims: 原型模式适用于「重复创建且生成成本高」的对象；克隆代替重复创建是核心手段。
- Learner-relevant: 记住「创建重复对象 + 耗时」是使用原型模式的两大触发条件；`Object.clone()` 是 Java 层面的落点。

### ch4-scenario
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-scenario]]`
- Summary: 业务场景设定——从纸质考卷（大家同一套题、可互抄）演进到上机考试后，为保证公平性，同样题目下题目混排、甚至答案选项混排，增加抄袭成本。需求是实现上机考试抽题服务，先建造题库题目场景类：选择题、问答题。给出场景模拟工程 itstack-demo-design-4-00 的结构。
- Key claims: 上机考试的公平性靠「题目乱序 + 选项乱序」实现；场景需要两类题目物料：选择题、问答题。
- Learner-relevant: 明确需求核心是「每人题目和答案乱序」，这是后续 clone() 重构要达成、而一把梭实现没有达成的目标。

### ch4-scene-choice-question
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-scene-choice-question]]`
- Summary: 选择题类 `ChoiceQuestion` 的字段与构造：`name`（题目）、`option`（Map<String,String> 选项 A/B/C/D）、`key`（答案），提供无参与全参构造和 get/set。
- Key claims: 选择题由题目文本、选项 Map、答案键三部分组成。
- Learner-relevant: 物料类字段是后续 `clone()` 浅拷贝时需注意的引用类型（Map option）所在。

### ch4-scene-answer-question
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-scene-answer-question]]`
- Summary: 问答题类 `AnswerQuestion` 的字段与构造：`name`（问题）、`key`（答案），提供无参与全参构造和 get/set。作者提示可自行扩充更多题目类型作为学习扩展。
- Key claims: 问答题由问题文本与答案字符串组成，相对简单。
- Learner-relevant: 两个物料类都是值字段为主，可自行添加其他题目类型加深练习。

### ch4-simple-project-structure
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-simple-project-structure]]`
- Summary: 一把梭实现工程的目录结构 itstack-demo-design-4-01，只有单个类 `QuestionBankController`。作者预告：一个类几千行代码也见过，这是有「这种潜质」的类。
- Key claims: 一把梭实现集中在一个类里，面向过程、不考虑扩展性。
- Learner-relevant: 该类的规模与职责混乱程度是后续重构的对比基线。

### ch4-simple-implementation
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-simple-implementation]]`
- Summary: `QuestionBankController.createPaper(candidate, number)` 的实现：硬编码构造 5 道 Java 选择题（JAVA 版本定义、main 方法、变量命名、标识符、表达式求值）与 4 道脑筋急转弯式问答题，存入两个 List；再遍历拼装出含「考生/考号/选择题/问答题」的格式化字符串返回。作者点评：这类代码易理解但不面向对象、不考虑扩展性；代码分三部分——建题入集合、定义详情字符串包装结果、返回结果；且没有实现乱序，若要加乱序复杂度还会增加，此处不展开，只为后文对比重构。
- Key claims: 一把梭实现无法乱序，所有人的试卷顺序完全一样，达不到公平性需求；代码难扩展，题目增多与乱序功能会让它越来越混乱。
- Learner-relevant: 记住问题点：①顺序固定不满足乱序需求；②扩展性差；这两点正是原型模式重构要解决的。

### ch4-simple-test
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-simple-test]]`
- Summary: 用 junit 单元测试验证 `createPaper`，为花花、豆豆、大宝三位考生各打印一份试卷。结果三份试卷题目与选项顺序完全一致，印证「没有达到乱序要求」；作者强调日常编写单测能提高系统健壮度。
- Key claims: 三位考生的试卷内容相同、顺序也相同，验证了一把梭实现未实现乱序；单测是验证接口服务的标准手段。
- Learner-relevant: 测试结果 = 一把梭实现的缺陷实锤，可直接对照重构后版本看差异。

### ch4-refactor
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-refactor]]`
- Summary: 进入原型模式重构小节：要解决的问题是创建大量重复的类——不同用户需要相同试卷，但题目不便每次都从库中获取（有时来自远程 RPC），创建对象非常耗时，且对象增多会严重影响效率。指出原型模式非常重要的手段是克隆：需要用克隆的类都要 `implements Cloneable` 接口。
- Key claims: 原型模式的必要前提是对象实现 `Cloneable`；克隆用于避免每次从库/RPC 重复获取并构造对象。
- Learner-relevant: 记住 Java 原型模式的两个关键点：`Cloneable` 接口 + 重写 `clone()`；并注意此处引出了克隆（后续必涉及浅拷贝/深拷贝）。

### ch4-refactor-structure
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-refactor-structure]]`
- Summary: 重构工程 itstack-demo-design-4-02 的目录结构，比一把梭版本多了几个类：`Topic`（题目/选项/答案载体）、`TopicRandomUtil`（乱序工具）、`QuestionBank`（题库，重点的 clone 载体）、`QuestionBankController`（对外接口），末尾标注「原型模式模型结构」。具体的类实现代码在本部分之后的篇幅中。
- Key claims: 重构工程用 `Topic` + `TopicRandomUtil` + `QuestionBank` 分担职责；`QuestionBank` 承担题库原型，通过 clone 产出各考生乱序试卷。
- Learner-relevant: 记住四个类的分工，尤其 `QuestionBank.clone()` 将是下一部分的核心，届时重点看乱序与浅/深拷贝处理。