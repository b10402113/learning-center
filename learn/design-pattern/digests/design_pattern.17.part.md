---
source: design_pattern
source_lines: 24398
part: 17
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 17)

## Overview (L1)
本部分完成第 10 节访问者模式的完整讲解：模拟校园中学生/老师两种固定身份的数据结构，通过 校长(Principal) 与 家长(Parent) 两个访问者从不同视角读取差异化信息。核心是 `visitor.visit(this)` 的双分派调用，将数据结构与数据操作解耦，测试验证显示家长视角输出学生排名、校长视角输出班级升学率。作者明确提示该类结构较复杂、相对"烧脑"，且实现上会违背迪米特原则。

## Sections (L2)

### 场景模拟工程
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#场景模拟工程]]`
- Summary: 介绍本节的开发环境（JDK 1.8、Idea + Maven），涉及三个工程，核心是 `itstack-demo-design-22-00` 场景模拟工程，用途为"模拟学生和老师信息不同视角访问"，源码经公众号 bugstack 虫洞栈获取（序号 18）。
- Key claims: 该工程专用于模拟学生对老师信息不同视角的访问；环境为 JDK 1.8 + Maven 工程。
- Learner-relevant: 锚定本节实验工程的定位——"同一份数据、多视角访问"，为后续理解访问者模式的目标铺垫。

### 访问者模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#访问者模式介绍]]`
- Summary: 访问者要解决的核心事项是：在一个稳定的数据结构下（如用户信息、雇员信息），增加易变的业务访问逻辑，为增强扩展性而把数据结构与访问逻辑两部分业务解耦的一种设计模式。
- Key claims: 访问者模式核心在于"同一事物不同视角下的访问信息不同"；白话例子——美女手里拿冰淇淋，小朋友注意冰淇淋、大朋友去找自己喜欢的地方观测敌情。
- Learner-relevant: 建立模式的意图记忆点：稳定数据 + 易变访问逻辑解耦，即"数据结构与数据操作分离"。

### 场景简述
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#场景简述]]`
- Summary: 模拟校园中学生与老师两种身份的用户：家长关心孩子的成绩和老师的能力，校长关心老师所在班级的学生人数和升学率（此处为模拟）。学生和老师是固定信息内容，让不同视角用户获取关心的信息适合用访问者模式实现，使实体与业务解耦、增强扩展性。
- Key claims: 学生/老师为固定信息内容，家长/校长视角不同；作者此处笔误写成"观察者模式"，并提示该类结构相对复杂，需要梳理清楚再开发。
- Learner-relevant: 记住"固定结构 + 多视角需求"的选型判据，以及本书对访问者模式"结构复杂、需梳理清楚再开发"的警告。

### 工程结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#工程结构]]`
- Summary: 展示核心工程结构：`user` 包下是 `User` 抽象类及其实现 `Student`/`Teacher`；`visitor` 包下是 `Visitor` 接口及其实现 `Parent`/`Principal`；顶层 `DataView` 数据看板；测试类 `ApiTest`。三条核心逻辑：建立用户抽象类与抽象访问方法、建立访问者接口、最后建设数据看板实现不同视角的访问结果输出。
- Key claims: 类结构相对其他设计模式比较复杂，但作者认为更"烧气有魅力"，能开阔对代码结构的新认知；结构 = 数据结构(用户) + 访问者 + 数据看板三层。
- Learner-relevant: 先建立"用户体系 / 访问者体系 / 数据看板"的三层心智地图，再进入代码。

### 访问者模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#访问者模式模型结构]]`
- Summary: 指出整套设计模式的核心组成部分是 `visitor.visit(this)`，该调用出现在每一个用户实现类（Student、Teacher）里，是连接数据结构与访问者的关键桥接点，后续实现中需重点关注。
- Key claims: `visitor.visit(this)` 是双分派的关键：先按访问者类型分派到具体 visit 重载，再由 this 的具体类型决定调用哪个重载；这一行同时牵动 User 与 Visitor 两个继承体系。
- Learner-relevant: 把"双分派"落实到一行代码 `visitor.visit(this)` 上理解，是本节最需要加深的机制点。

### 代码实现-定义用户抽象类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-定义用户抽象类]]`
- Summary: `public abstract class User` 持有基础信息 name（姓名）、identity（身份；重点班/普通班、特级/普通/实习教师）、clazz（班级），构造器赋值；并声明抽象核心方法 `abstract void accept(Visitor visitor)`，让所有用户实现者都能对外提供一个访问入口。
- Key claims: 基础信息类可理解为业务用户属性类；`accept(Visitor)` 抽象方法是为了让后续用户具体实现者都能提供出访问方法供外部使用。
- Learner-relevant: 数据结构侧的地基：谁能接收访问者，谁就在数据结构体系中声明 `accept`。

### 代码实现-实现用户信息(老师和学生)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-实现用户信息(老师和学生)]]`
- Summary: `Teacher`、`Student` 继承 User 并提供父类构造函数；各自 `accept(Visitor visitor)` 内执行 `visitor.visit(this)`；同时各自提供业务特性方法——老师 `entranceRatio()` 返回随机计算的升学率（BigDecimal 保留两位），学生 `ranking()` 返回随机排名（0–99）。
- Key claims: `visitor.visit(this)` 在 accept 中完成本地对象回传，需要加深理解；特性方法可按业务需求扩展。
- Learner-relevant: 理解"业务数据挂在数据结构类上、访问逻辑留在访问者里"的分工，是双分派的数据来源。

### 代码实现-定义访问数据接口
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-定义访问数据接口]]`
- Summary: `public interface Visitor` 定义两个同名方法 `visit(Student student)` 与 `visit(Teacher teacher)`，仅入参用户类型不同，分别对应访问学生信息与访问老师信息。
- Key claims: 访问接口比较简单，相同方法名、不同入参类型，靠重载区分；让具体访问者实现时能关注每一种用户类型的具体数据对象（升学率、排名）。
- Learner-relevant: 认识到"重载 + this 类型"构成双分派的另一半：访问者的多态分支由此建立。

### 代码实现-实现访问类型(校长和家长)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-实现访问类型(校长和家长)]]`
- Summary: 两个具体访问者实现 Visitor。`Principal`（校长）关注学生姓名+班级、老师姓名+班级+升学率（`entranceRatio()`）；`Parent`（家长）关注学生姓名+班级+排名（`ranking()`）、老师姓名+班级+级别（identity）。各打印各自的差异化信息。
- Key claims: 校长关注学生名称和班级、老师对该班级的升学率；家长关注自己家孩子的排名、老师的班级和教学水平（级别）；两个访问者各自拥有自己的视角需求。
- Learner-relevant: 差异化视角的具体体现——同一批学生/老师，校长与家长看到的是完全不同的字段组合。

### 代码实现-数据看板
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-数据看板]]`
- Summary: `DataView` 构造器初始化基础数据：4 名学生（谢飞机、windy、大毛、Shing，分属重点班/普通班及不同班级）与 4 名老师（BK、娜娜Goddess 特级教师，dangdang 普通教师，泽东 实习教师）；`show(Visitor visitor)` 遍历 userList 逐个调用 `user.accept(visitor)`，从而按传入的访问者差异打印。
- Key claims: 初始化固定数据 + 提供展示类；通过传入不同访问者（校长、家长）差异化打印信息。
- Learner-relevant: 数据看板是"数据结构不动、接入不同访问者即换输出"的调度层，是最直观理解解耦的入口。

### 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#测试验证]]`
- Summary: 编写 `test()`：`dataView.show(new Parent())` 打印"家长视角访问"，`dataView.show(new Principal())` 打印"校长视角访问"。运行结果家长视角看到学生排名（62、51、16、98）与老师级别（特级/普通/实习）；校长视角看到老师升学率（70.62、23.15、70.98、90.14），进程以 exit code 0 正常结束。
- Key claims: 家长和校长分别是不问的访问视角，视角同步、数据差异化；家长看排名、校长看升学率。
- Learner-relevant: 以实测输出印证"同一数据结构、不同访问者输出不同信息"，是判断双分派生效的实证锚点。

### 总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]`
- Summary: 嵌入访问者模式后工程结构容易添加和修改，实现系统服务间解耦，不必为不同信息访问增加多余 if 判断或类的强制转换。缺点：定义抽象类时需等待访问者接口的定义，让代码组织有些难度；从设计模式原则看违背了迪米特原则（最少知道原则），因此使用一定要符合场景并提取其中的设计思想精髓。最后以"二十多种设计模式各有巧妙之处，是解决复杂难题的最佳视角，亲力亲为才能为所欲为"收尾。
- Key claims: 优点＝解耦、避免多余 if 判断与强制转换、结构更清晰；缺点＝需先定义访问者接口、违背迪米特原则；应选型谨慎、符合场景。
- Learner-relevant: 为访问者模式的"适用/慎用"划清边界——结构复杂且违反最少知道原则，是本节的收尾价值判断要点。