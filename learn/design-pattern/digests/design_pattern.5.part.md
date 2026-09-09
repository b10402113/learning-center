---
source: design_pattern
source_lines: 24398
part: 5
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 5)

## Overview (L1)
本部分完成第 4 节原型模式的重构实现与收尾：以试卷克隆（QuestionBank implements Cloneable + TopicRandomUtil 乱序工具包 + QuestionBankController 初始化模板）为例演示 clone() 的完整落地，并用三名考生试卷测试验证了"同题库、异序题"的效果，随后对原型模式做优缺点总结。此 chunk 不含第 5 节单例模式的引入内容。

## Sections (L2)

### 原型模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#原型模式模型结构]]`
- Summary: 展示重构后工程结构：核心题库类 `QuestionBank` 负责将各题组装并最终输出试卷；针对每一份试卷都用克隆方式复制，复制完成后对试卷中题目以及每个题目的答案进行乱序处理，为此提供工具包 `TopicRandomUtil`。
- Key claims: 试卷生成流程 = 克隆原型 → 题目乱序 → 答案乱序；`TopicRandomUtil` 是乱序复用的工具包。
- Learner-relevant: 建立原型模式重构的整体骨架，先明确"谁是被克隆的原型、clone 后做什么"再进入代码。

### 代码实现-题目选项乱序操作工具包
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-题目选项乱序操作工具包]]`
- Summary: `TopicRandomUtil.random(Map<String,String> option, String key)` 先把 option 的 key 收集进 List，用 `Collections.shuffle` 打乱，再按新 key 重排选项内容到新 Map，同时记录正确答案在新位置上的 key，最后返回新的 `Topic(optionNew, keyNew)`。
- Key claims: 乱序操作就是把 A 的选项内容给 B、B 的可能给 C，同时记录正确答案处理后的位置；Map 的 key 属性存放答案。
- Learner-relevant: 理解"选项乱序 + 答案 key 同步重定位"的实现要点，为 QuestionBank.clone() 的答案乱序做准备。

### 代码实现-克隆对象处理类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-克隆对象处理类]]`
- Summary: `QuestionBank implements Cloneable`，持有 candidate（考生）、number（考号）及两个题目集合；两个 `append()` 链式添加题目，风格类似建造者模式加物料；重写 `clone()`：`super.clone()` 后对 `choiceQuestionList`、`answerQuestionList` 两个 ArrayList 也各自 `clone()`，再对题目集合 `Collections.shuffle` 乱序，并逐题用 TopicRandomUtil 乱序选项、回写新 option 与新 key。
- Key claims: clone() 不只复制对象本身，还必须同时复制两个集合，才能保证操作克隆对象时不影响原对象；`Collections.shuffle` 可打乱集合产生新顺序。
- Learner-relevant: 体会原型模式"复制 + 差异化处理"的写法，及此处浅拷贝集合（ArrayList.clone() 复制容器、元素仍是同一批引用）对后续深拷贝/循环引用问题的伏笔。

### 代码实现-初始化试卷数据
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-初始化试卷数据]]`
- Summary: `QuestionBankController` 构造器初始化模板：5 道选择题（JAVA 版本、main 方法、变量命名等）+ 4 道脑筋急转弯式问答题；`createPaper(candidate, number)` 通过 `questionBank.clone()` 复制出考生专属问卷，设置考生与考号后 `toString()` 返回试卷。
- Key claims: 所有考生试卷题目一样、题目顺序不一致；创建过程使用的是克隆方式 `(QuestionBank) questionBank.clone()`。
- Learner-relevant: 理解"模板只初始化一次、每份试卷从原型克隆"的高效出卷模型，是原型模式的核心收益点。

### 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#测试验证]]`
- Summary: 编写 `test_QuestionBank`，对花花、豆豆、大宝三名考生各调用一次 `createPaper` 并打印；输出显示每人选择题序号、选项顺序、答案位置及问答题顺序都各自乱序。
- Key claims: 每人题目和答案都是差异化的乱序（花花、豆豆、大宝的试卷都存在着题目和选项的混乱排序），运行以 exit code 0 正常结束。
- Learner-relevant: 以三份真实输出印证原型模式"同一原型、多份差异化副本"，可作为 /tackle 判断"clone 后互不影响"的实证锚点。

### 总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]`
- Summary: 原型模式实际使用频率不高，仅特殊场景需要时可按此模式优化。优点：便于通过克隆创建复杂对象、可避免重复初始化操作、不需要与类中所属的其他类耦合；缺点：若对象包含循环引用的克隆、或类中深度使用对象克隆，都会使模式变得异常麻烦。设计模式是整套思想，合理运用能提升架构质量，永远不要硬凑设计模式，否则造成过渡设计与浪费的开发和维护成本。学习阶段：初期做代码优化、中期用设计模式、后期把控全局服务搭建。
- Key claims: 优点＝克隆建复杂对象/免重复初始化/解耦；缺点＝循环引用与深度对象克隆会异常麻烦；切忌硬凑模式导致过渡设计。
- Learner-relevant: 为原型模式的选型边界划清"适用/慎用"判据，是本章收尾的价值判断要点。