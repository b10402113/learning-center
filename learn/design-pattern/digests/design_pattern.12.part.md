---
source: design_pattern
source_lines: 24398
part: 12
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 12)

## Overview (L1)

**命令模式**：以高档餐厅点单烹饪（顾客→小二→厨师）为场景，说明命令模式将请求封装成对象、解耦"操作请求"与"逻辑实现"。先用一个 `XiaoEr` 类 + if 语句"一坨代码"实现点单，再按命令（ICuisine 菜品）、命令实现者（ICook 厨师）、调用者（XiaoEr 小二）三层拆解重构，并用四菜四厨的测试验证点单→下单→烹饪的全流程。

**迭代器模式**：以遍历公司树形组织架构（员工表 + 节点链路）为场景，说明迭代器提供统一方式顺序访问聚合对象且不暴露内部表示。参照 JDK 的 `Collection/Iterable/Iterator` 三接口自定义迭代器，`GroupStructure` 用两张 Map 存员工与链路关系并实现深度优先遍历，测试输出验证遍历顺序与开闭/单一职责收益。

## Sections (L2)

### 命令模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式介绍]]`
- Summary: 命令模式在互联网开发中使用较少，但日常的 Ctrl+C/Ctrl+V 与桌面应用就是其应用场景。它属于行为模式，以数据驱动方式把"命令对象"通过构造函数传给调用者，调用者再提供操作命令执行的实现方法，把逻辑实现与操作请求分离、降低耦合方便扩展。开发环境为 JDK 1.8 + Idea + Maven，涉及 itstack-demo-design-14-01（一坨代码实现）与 14-02（设计模式优化）两个工程。
- Key claims: 命令模式将逻辑实现与操作请求分离，降低耦合方便扩展；实现要点四点——抽象命令类（声明执行命令的接口方法）、具体命令实现类（接口的具体实现，一组相似行为逻辑）、实现者（为命令做实现的具体类）、调用者（处理命令的具体操作者，对外提供命令服务）。
- Learner-relevant: 先建立"命令 / 实现者 / 调用者"三层心智模型，再进入餐厅案例验证。

### 命令模式-案例场景模拟
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-案例场景模拟]]`
- Summary: 模拟餐厅中点餐交厨师烹饪：点餐人只需把菜系交给小二，小二再把各项菜品交给对应厨师烹饪，点餐人不必与各厨师直接交流，只在下令的统一环境里操作。场景包含山东（鲁菜）、四川（川菜）、江苏（苏菜）、广东（粤菜）、福建（闽菜）、浙江（浙菜）、湖南（湘菜）等不同菜系，每种菜系有不同厨师。
- Key claims: 命令场景核心是调用方不需要关心具体逻辑实现；客户不关心谁烹饪（只关心早上菜），厨师不关心谁点餐（只关心还有多少菜要做），中间衔接由小二完成；可思考"哪部分是命令模式的拆解、哪部分是调用者、哪部分是命令实现逻辑"。
- Learner-relevant: 用"顾客—小二—厨师"角色映射命令模式三层结构，为动手重构做铺垫。

### 命令模式-一把梭实现需求
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-一把梭实现需求]]`
- Summary: 不考虑设计模式时，一个 `XiaoEr` 类就能实现点单系统：用 `ConcurrentHashMap<Integer,String> cuisineMap` 存菜品，`order(int cuisine)` 里用多个 if 语句按菜系编号写入"某厨师，烹饪某菜"的描述，`placeOrder()` 打印整个菜单。这类复杂场景直接开发也能达到目的，但后续菜品扩展、厨师实现与调用方式会变得非常耦合、难以扩展。
- Key claims: 一坨代码 = 单类 + if 判断类型分支；`order()` 点单添加菜品、`placeOrder()` 展示菜品信息两个方法；大量 if 语句后续需要大量精力维护，实际逻辑更复杂时都写在单类里会耦合非常严重。
- Learner-relevant: 建立"没有模式时的痛点基线"，与后面三层重构形成对比，理解命令模式解决的核心问题。

### 命令模式-工程结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-工程结构]]`
- Summary: 重构后工程 itstack-demo-design-14-02 按三层组织：`cook` 包放实现者（`ICook` 接口 + `GuangDongCook/JiangSuCook/ShanDongCook/SiChuanCook` 四个实现），`cuisine` 包放命令（`ICuisine` 接口 + `GuangDoneCuisine/JiangSuCuisine/ShanDongCuisine/SiChuanCuisine` 四个实现），外加调用者 `XiaoEr`，测试类为 `ApiTest`。
- Key claims: 整体分为三大块——命令实现（菜品）、逻辑实现（厨师）、调用者（小二），这就是命令模式的核心内容；拆解后可非常方便地扩展菜品与厨师，对调用者保持松耦合，整体框架下容易加入实现逻辑。
- Learner-relevant: 从类图看清三层职责边界，知道新菜新厨各自加在哪一层。

### 命令模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式模型结构]]`
- Summary: 模型结构图直观展示命令模式的三层骨架：`ICuisine`（抽象命令，声明 `cook()` 烹饪方法）→ 四个具体菜品命令（构造时注入 `ICook`）→ `ICook`（抽象实现者，声明 `doCooking()`）→ 四个具体厨师实现 → `XiaoEr`（调用者，持有 `List<ICuisine>` 并统一执行）。
- Key claims: 命令/实现者/调用者三层是命令模式核心；每个具体命令都持有一个对应实现者对象，通过 `cook.doCooking()` 触发实现。
- Learner-relevant: 以此结构图为参照理解"请求被封装成对象"在代码里到底长什么样。

### 命令模式-代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-代码实现]]`
- Summary: 分五步落地：1) 抽象命令 `ICuisine` 只声明 `void cook()`；2) 四个具体命令 `XxxCuisine implements ICuisine`，构造器注入 `ICook` 并在 `cook()` 中调用 `cook.doCooking()`；3) 抽象实现者 `ICook` 声明 `void doCooking()`；4) 四个具体厨师 `XxxCook implements ICook`，在 `doCooking()` 打日志模拟通知厨房烹饪；5) 调用者 `XiaoEr` 持 `List<ICuisine> cuisineList`，`order(ICuisine)` 添加菜品、`synchronized placeOrder()` 遍历逐个 `cuisine.cook()` 后清空列表。扩展时每个类都具备单一职责，只需新增类即可。
- Key claims: 命令实现过程可按逻辑补充，抽象比较简单时只模拟烹饪流程；"命令实现 + 实现者"两两组合形成具体命令对象（如 `GuangDoneCuisine(GuangDongCook)`）；调用者把外部传入的菜品与厨师组合做具体调用；扩展新菜/新厨时每个类具备单一职责原则。
- Learner-relevant: 掌握命令模式五要素的 Java 写法，是后续 /tackle 判"命令与实现者如何组合注入"的事实依据。

### 命令模式-测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-测试验证]]`
- Summary: 测试类先以"菜系+厨师"组合创建四个命令对象（`new GuangDoneCuisine(new GuangDongCook())` 等），再依次 `xiaoEr.order(...)` 点单四道菜，最后 `xiaoEr.placeOrder()` 下单。运行输出显示四位厨师各自打印烹饪日志，进程以 exit code 0 结束。
- Key claims: 每个具体命令都拥有一个对应实现类可自由组合；点单把四种菜品对象添加给小二，下单等于把菜单传递给厨师；实现还支持扩展删除/撤销（客户取消某菜品）；输出验证了"交给调用者的点单由不同厨师具体实现（烹饪）"。
- Learner-relevant: 用输出结果印证命令模式"请求与实现解耦、可灵活组合扩展"的收益，作 /tackle 判断依据。

### 命令模式-总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-总结]]`
- Summary: 命令模式的使用场景需要分为命令、实现、调用者三大块，三块内容的拆分是选对场景的关键因素；拆分后逻辑具备单一职责、便于扩展。与 if 语句实现相比降低耦合、方便其他命令与实现扩展，但代价是在各种命令与实现组合下会扩展出很多实现类，需要专门管理。设计模式学习要勤加练习，哪怕先模仿实现，多次练习后再找可优化场景逐步应用，提升代码设计感。
- Key claims: 三层拆分让逻辑具备单一职责性质、便于扩展；缺点＝命令与实现组合多导致实现类膨胀、需要管理；通过实践建立"设计感觉"。
- Learner-relevant: 形成命令模式的选型判据（何时该用、代价是什么），作为本章价值判断要点。

### 迭代器模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式介绍]]`
- Summary: 迭代器模式最常见的形态就是日常使用的 `iterator` 遍历。业务开发中直接使用场景不多，但几乎每天都要用 JDK 提供的 list 集合遍历。增强 for 循环虽然循环输出数据，但它不是迭代器模式。迭代器模式特点是实现 `Iterable` 接口，通过 `next` 方式获取集合元素，同时具备删除等操作，而增强 for 循环不可以。
- Key claims: 迭代器模式可让我们以相同方式遍历不同数据结构（数组、链表、树等），用户无需关心每种结构的遍历处理逻辑，使用统一易用；迭代器 = 实现 Iterable + 通过 next 获取元素 + 具备删除等操作；增强 for 循环 ≠ 迭代器模式。开发环境涉及单工程 itstack-demo-design-15-00（开发树形组织架构关系迭代器）。
- Learner-relevant: 先纠正"增强 for 就是迭代器"的常见误解，再进入自定义迭代器实现。

### 迭代器模式-案例场景模拟
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式-案例场景模拟]]`
- Summary: 模拟迭代遍历输出公司树形组织架构中的雇员列表。大部分公司组织架构是金字塔式的树形结构，分一级、二级、三级等部门，每个部门由雇员填充，整体呈现树形组织架构关系。常用遍历是 JDK 默认的 list 遍历，但对偏业务特性的树形结构需要遍历时，可以自己实现迭代器。
- Key claims: 组织架构 = 树形结构 + 各部门雇员填充；对业务特性较强的树形结构，遍历需要自定义实现；案例将用树形数据结构表达组织层次关系并完成迭代器功能。
- Learner-relevant: 明确"树形结构 + 自定义迭代器"的目标场景，与 List 遍历形成对比。

### 迭代器模式-工程结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式-工程结构]]`
- Summary: 工程 itstack-demo-design-15-00 分为自定义集合三接口（`Collection/Iterable/Iterator`，包 `org.itstack.demo.design.lang`）与数据结构实现（包 `group`：`Employee` 雇员、`Link` 树节点链路、`GroupStructure` 组织结构实现）两大部分，外加测试类 `ApiTest`。由于组织关系树由节点和节点间关系链构成，比通用迭代器实现多一些入参。
- Key claims: 实现参照 JDK 的 Collection/Iterable/Iterator 三接口模式，可与 list 源码对照学习；左侧接口定义与 JDK 方式一致，右侧在数据结构中实现迭代器功能。
- Learner-relevant: 从类图分清"接口层 vs 实现层"，知道自定义集合如何借 JDK 骨架。

### 迭代器模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式模型结构]]`
- Summary: 模型结构图左侧是对迭代器的定义（`Iterator<E>` 的 hasNext/next、`Iterable<E>` 的 iterator()、`Collection<E,L>` 的增删与链路操作），右侧是在数据结构中实现迭代器功能。书中实现的是较简单的树形深度遍历方式，读者后续可扩展为横向（宽度）遍历。
- Key claims: 左侧部分与 JDK 的实现方式一样，学习时可互相参考、自己扩展；当前实现一种简单的树形结构深度遍历，可扩展为宽度遍历。
- Learner-relevant: 建立"迭代器接口定义 + 树形深度遍历实现"的整体图景，理解深度遍历与宽度遍历的扩展关系。

### 迭代器模式-代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式-代码实现]]`
- Summary: 分六步实现：1) 雇员实体类 `Employee`（uId、name、desc）；2) 树节点链路 `Link`（fromId、toId），用 A→B、B→C 描述完整树组织结构；3) 迭代器定义 `Iterator<E>`（hasNext 判断是否有下一元素、next 获取下一元素，与 JDK 一致便于对照 list 源码）；4) 可迭代接口 `Iterable<E>`（提供 iterator() 获取迭代器）；5) 集合功能接口 `Collection<E,L> extends Iterable<E>`（add/remove/addLink/removeLink/iterator，两个泛型分别对应"添加元素"与"添加树节点链路关系"）；6) 核心实现 `GroupStructure implements Collection<Employee, Link>`：用 `employeeMap` 存雇员、`linkMap`（key→List<Link>）存组织关系、`invertedMap` 存反向关系链，`iterator()` 返回匿名迭代器。
- Key claims: 迭代器实现思路三步——树形结构做深度遍历（左侧一直遍历到最深节点）、遍历到最深后开始遍历最深节点的横向节点、横向节点完成后向上寻找横向节点直至树结构全部遍历完成；`getCursorIdx` 给每个层级定义宽度遍历进度（cursor）；元素添加/删除用两张 Map 结构实现，添加时向 map 填充指向关系（A->B）构建树形组织关系；迭代器功能实现支持遍历中使用 hasNext/next。
- Learner-relevant: 掌握"树形深度遍历迭代器"的关键代码（linkMap + invertedMap + cursorIdx 回溯），是本章最难理解、最值得反复练习的要点。

### 迭代器模式-测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式-测试验证]]`
- Summary: 测试 `test_iterator` 先创建 `GroupStructure("1","小傅哥")` 作为组织头，添加 2~8 号七名员工（二/三/四级部门），再用 `addLink` 建立节点关系（1→(2,3)、2→(4,5)、5→(6,7,8)），随后 `groupStructure.iterator()` 配合 `while(iterator.hasNext())` 逐条打印。输出按深度顺序：2 花花→4 蹦蹦→5 大烧→6 虎哥→7 玲姐→8 秋雅→3 豆包，进程 exit code 0 结束。
- Key claims: 遍历结果印证是顺着树形结构深度遍历，一直走到右侧节点 3（雇员 Id：2、4、5、6、7、8、3）；结果覆盖全部节点、无重复遗漏。
- Learner-relevant: 用真实输出验证"自定义树形迭代器"的深度优先顺序，作为 /tackle 判断迭代顺序正确性的实证锚点。

### 迭代器模式-总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式-总结]]`
- Summary: 迭代器设计模式满足单一职责和开闭原则，外界调用方不需要知道任何不同数据结构在遍历上的差异，方便扩展、让遍历更干净整洁。但从实现看，迭代器模式的实现过程相对复杂，类的实现上扩增了需要外部定义的类，使遍历与原数据结构分开；虽然麻烦，但使用 JDK 时迭代器模式很好用，方便扩展与升级。对新人不易理解的点包括迭代器三个接口的定义、树形结构的数据关系、树结构深度遍历思路，需要反复实现练习、事必躬亲才能真正掌握。
- Key claims: 优点＝满足单一职责与开闭原则、调用方无需知道遍历差异、扩展方便；代价＝实现较复杂、需要额外定义类使遍历与数据分离；难点＝三接口定义、树形数据关系、深度遍历思路。
- Learner-relevant: 形成迭代器模式的收益/成本判据，并明确需要刻意练习的三个难点。

### 迭代器模式-开发环境与实现前阅读
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式-开发环境与实现前阅读]]`
- Summary: 实现迭代器模式前可先阅读 java 中 list 关于 iterator 的实现部分，几乎所有迭代器开发都按此模式实现，主要分三块：Collection（集合方法部分，为自定义数据结构添加 add、remove、iterator 等核心通用方法）、Iterable（提供获取迭代器，被 Collection 继承）、Iterator（定义 hasNext、next 两个方法，在具体数据结构中写实现方式）。
- Key claims: 三接口职责——Collection 提供增删与 iterator 通用方法、Iterable 提供迭代器获取并被 Collection 继承、Iterator 声明 hasNext/next 并在具体数据结构中实现；组织关系结构树因由节点和节点间关系链构成，会比通用实现多一些入参。
- Learner-relevant: 实现前先对齐 JDK list 迭代器的三接口骨架，作为自定义实现的参照模板。