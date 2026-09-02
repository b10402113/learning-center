---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 24398
part: 14
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 14)

## Overview (L1)
备忘录模式：以"系统上线过程中配置文件记录与紧急回滚"为案例，介绍行为型模式备忘录（Memento）的意图——在不破坏封装性的前提下捕获对象内部状态并在对象之外保存。实现上用四个类完成：配置类（ConfigFile）、备忘录类（ConfigMemento）、记录者类（ConfigOriginator）、管理员类（Admin 用 List + Map 存放多版本历史，提供 append/undo/redo/get），测试验证了回滚、前进、定向获取版本三种操作。

观察者模式：以"小客车指标摇号、监听消息通知用户中签"为案例，介绍对象间一对多依赖（一个对象状态改变时所有依赖者都得到通知并自动更新）的意图。先给出直接在摇号方法里顺序拼装"摇号+发短信+发MQ"的一坨代码作为反面实现，再用观察者模式重构：EventListener 接口 + MessageEventListener/MQEventListener 两个监听实现 + EventManager（subscribe/unsubscribe/notify，用枚举 EventType.MQ/Message 区分事件）+ 抽象类 LotteryService 模板方法屏蔽通知细节，测试验证重构后结果一致但核心流程与辅助流程解耦。

## Sections (L2)

### 备忘录模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#备忘录模式介绍]]`
- Summary: 备忘录模式是以"可以恢复或回滚配置、版本、悔棋"为核心功能的行为型设计模式，实现上在不破坏原对象的基础上增加备忘录操作类，记录原对象行为从而实现备忘。生活/开发中的常见例子：后悔药、孟婆汤（一下回滚到 0）、IDEA 编辑与撤销、小霸王游戏机存档、Photoshop。
- Key claims: 属于行为模式；核心是"不破坏原对象 + 备忘录操作类记录行为"；回滚类功能（版本、配置、悔棋）都可用此模式。
- Learner-relevant: 建立模式的意图锚点——看到"需要保存历史状态、可回滚"的需求就联想到备忘录模式。

### 案例场景模拟-配置回滚
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#案例场景模拟]]`
- Summary: 模拟系统发布上线过程中记录线上配置文件用于紧急回滚。大厂系统上线要求易用、安全、可处理紧急状况，为隔离线上与本地环境一般把配置文件抽取到线上，避免误操作把本地配置发布出去；线上配置每次变更都记录版本号、时间、MD5、内容信息、操作人。上线时发现紧急问题就执行回滚，并可设置配置文件是否随系统一起回滚。
- Key claims: 线上配置与本地隔离；变更时记录"版本号/时间/MD5/内容/操作人"五要素；回滚时可让系统与配置文件一起回滚；实际使用会存库，本案例只用内存记录。
- Learner-relevant: 理解"配置快照 + 历史版本"是备忘录模式落地的经典业务场景，为看四个类的分工做准备。

### 备忘录模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#备忘录模式模型结构]]`
- Summary: 展示工程类图：除原有配置类 ConfigFile 外只新增三个类——ConfigMemento（备忘录类，相当于对原有配置类的扩展）、ConfigOriginator（记录者类，获取和返回备忘录对象信息）、Admin（管理员类，按顺序记录执行的备忘信息及某版本下的内容信息）。
- Key claims: 类图相对简单，核心是"原有类不动，新增备忘录类存放记录"；Admin 负责操作/记录备忘信息。
- Learner-relevant: 记住三角色分工（原对象、备忘录、管理者），这是理解任何备忘录实现的结构地图。

### 代码实现-配置信息类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-配置信息类]]`
- Summary: `ConfigFile` 是承载配置内容的 POJO，字段含 versionNo（版本号）、content（内容）、dateTime（时间）、operator（操作人）及 get/set。配置类可以是任何形式，这里只是描述了一个基本配置内容。
- Key claims: 四个字段与场景简述中的记录要素一一对应；配置类可以是任意形态。
- Learner-relevant: 明确"被记录状态"的数据结构——回滚的粒度就是整个 ConfigFile 对象。

### 代码实现-备忘录类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-备忘录类]]`
- Summary: `ConfigMemento` 内部持有一个 ConfigFile 对象，构造器接收并保存配置，提供 getConfigFile/setConfigFile 的存取。它是原有配置类的扩展包装。
- Key claims: 备忘录对象把原配置对象包起来作为快照；可设置和获取配置信息。
- Learner-relevant: 理解"备忘录 = 对原状态对象的包装引用"，这是快照的载体。

### 代码实现-记录者类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-记录者类]]`
- Summary: `ConfigOriginator` 持有当前 ConfigFile，在 get/set 之外新增两个方法：`saveMemento()` 保存时创建并返回一个新 ConfigMemento 交给管理者处理；`getMemento(ConfigMemento memento)` 获取时不是直接返回，而是把备忘录里的配置信息写给当前的 this.configFile。
- Key claims: saveMemento 产出快照给 Admin；getMemento 把快照内容还原到当前配置对象（注意是"写入当前对象"而非直接返回）。
- Learner-relevant: 抓住记录者的两个动词：存档（save）与还原（get→write back），对应回滚的实现位置。

### 代码实现-管理员类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-管理员类]]`
- Summary: `Admin` 是备忘录的容器与操作入口：用 `List<ConfigMemento> mementoList` 与 `Map<String,ConfigMemento> mementoMap`（ConcurrentHashMap）两个数据结构存放备忘录，另用 cursorIdx 指针；提供 append（存放）、undo（回滚，指针前移并做边界保护）、redo（前进，指针后移并做边界保护）、get(versionNo)（按版本定向获取）四个操作。
- Key claims: List 保序 + Map 按版本号索引，双结构可按需选用；undo/redo 用游标移动并夹紧边界（不会越界）；get 用 versionNo 定向取。
- Learner-relevant: 这是"多版本历史"能力的具体实现，undo/redo 的游标逻辑是测试期望（回滚两次再前进一次）的行为来源。

### 测试验证-备忘录
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#测试验证]]`
- Summary: 测试类连续保存四份配置（1000001~1000004，内容"哈哈/嘻嘻/么么/嘿嘿"），然后依次执行：undo 1 次（回到 1000004）、再 undo 1 次（回到 1000003）、redo 1 次（前进到 1000004）、get("1000002")（定向取回 1000002）。输出用 JSON 打印完整配置对象，进程以 exit code 0 结束。
- Key claims: 该模式学习重点之一体现在单元测试类上（四次存储 + 历史操作）；回滚、前进、定向获取均符合预期。
- Learner-relevant: 以实测输出印证"多版本可回滚/前进/定向取"的完整闭环，作为 /tackle 验证 undo/redo 行为的实证锚点。

### 总结-备忘录
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]`
- Summary: 该模式满足在不破坏原有属性类的基础上扩充备忘录功能，与平时思路一致但实现上可细细品味，一些源码中有所体现。本案例用内存存快照，关机会丢配置，真实场景需入库；而 Photoshop、运营 ERP 配置活动这类即时性场景用内存恢复也够。若用内存存放备忘录要考虑存储问题，避免内存大量消耗。
- Key claims: 内存 vs 数据库存快照的取舍（即时性场景可内存，需持久化则入库）；内存方式需防内存消耗过大。
- Learner-relevant: 掌握模式的适用边界与存储选型，是选型判断的价值要点。

### 观察者模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#观察者模式介绍]]`
- Summary: 观察者模式简单讲就是"一个行为发生时传递信息给另一个用户接收并做相应处理，两者之间没有直接耦合关联"，如狙击手与李云龙的配合。编程中常用到类似观察者思路的设计或组件：MQ 服务（有通知中心，非逐类通知，但整体算观察者思路）、事件监听总线（让主线服务与其他辅线业务服务分离），目的是降低耦合、增强扩展性。
- Key claims: 核心是行为发生→传递信息→接收处理，两者无直接耦合；MQ 与事件监听总线是观察者思路的落地形态。
- Learner-relevant: 建立意图锚点——主流程完成后要广播给多个辅助处理方，就用观察者模式。

### 案例场景模拟-摇号通知
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#案例场景模拟]]`
- Summary: 模拟每次小客车指标摇号的事件通知场景（真实摇号不会由官网发消息，而是由百度等插件代发短信）。若由你来开发类似摇号功能，需要对用户做事件通知、还要在主流程外加额外辅助流程，该如何处理？多数人实现通知事件比较粗犷，要么没考虑扩展要么压根没考虑；实际上核心类里有核心主链路，也有辅助功能（如行为完成后触发 MQ 给外部、做消息 PUSH 给用户），辅助流程可通过事件通知方式处理。
- Key claims: 摇号结果（未中签遗憾短信）是用户熟悉的触发点；核心链路与辅助流程（MQ、PUSH）应分离，辅助流程走事件通知。
- Learner-relevant: 明确重构动机——把非核心的短信/MQ 通知从主流程剥离，为"一坨代码 vs 观察者模式"的对比铺路。

### 场景模拟工程-摇号接口
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#场景模拟工程]]`
- Summary: 场景模拟工程 itstack-demo-design-18-00 提供模拟小客车摇号服务接口 `MinibusTargetService.lottery(uId)`：`Math.abs(uId.hashCode()) % 2 == 0` 时返回"恭喜你…在本次摇号中签"，否则返回"很遗憾…未中签或摇号资格已过期"。
- Key claims: 模拟接口与真实公平摇号有差别（按 hashCode 奇偶判中签）；返回拼接好的中签/未中签文本。
- Learner-relevant: 这是"事件源"——观察者模式中的被观察者（Subject）行为，后续监听器消费的就是它的输出。

### 场景简述-摇号服务接口
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#场景简述]]`
- Summary: 详述摇号接口的代码形态：`lottery(String uId)` 用 uId 的 hashCode 取绝对值后对 2 取模，偶数为中签，用 concat 拼接提示文案返回；代码带注释说明"模拟摇号，但不是摇号算法"。
- Key claims: 接口入参用户编号 uId、返回结果字符串；判定逻辑简单（hashCode 奇偶），与真实摇号算法无关。
- Learner-relevant: 明确被观察行为的最小实现，为"一把梭"与重构两种写法的对比提供同一被测对象。

### 一把梭实现需求-工程结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一把梭实现需求]]`
- Summary: 需求是在原有摇号接口中加入 MQ 消息发送与短信通知功能，最直接方式是在方法中顺序补充功能。工程 itstack-demo-design-18-01 包含三部分：返回对象 LotteryResult、接口定义 LotteryService、具体实现 LotteryServiceImpl。
- Key claims: 一把梭＝直接在方法体里顺序调用，满足"加上通知"的需求但不考虑扩展。
- Learner-relevant: 记录反面实现的结构，作为重构前后的对照基线。

### 一把梭实现需求-代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一把梭实现需求-代码实现]]`
- Summary: `LotteryServiceImpl.doDraw(uId)` 内顺序执行三部分：摇号（minibusTargetService.lottery）→ 发短信（logger 记录短信通知）→ 发 MQ 消息（logger 记录摇号结果），最后返回 LotteryResult。除摇号外，后面两部分都是非核心主链路功能，会随业务需求不断调整扩充，这种开发方式非常不利于维护。
- Key claims: 整体过程＝摇号＋发短信＋发MQ，全部顺序调用；短信与 MQ 属非核心辅助流程，直接写在主方法里耦合度高、难维护。
- Learner-relevant: 指认"坏味道"——辅助流程与核心流程耦合，是重构的靶点。

### 一把梭实现需求-测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一把梭实现需求-测试验证]]`
- Summary: 测试类调用 `doDraw("2765789109876")`，输出先打印短信通知（未中签/资格过期文案），再打印 MQ 记录，最后返回 LotteryResult（uId、msg、dateTime），exit code 0。
- Key claims: 结果符合预期、是平常开发代码的方式、非常简单；短信与 MQ 的顺序与主方法内代码一致。
- Learner-relevant: 记录一把梭版本的输出基线，重构后应得到相同业务结果但结构与日志来源不同。

### 观察者模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#观察者模式模型结构]]`
- Summary: 重构后工程 itstack-demo-design-18-02 分三大块：事件监听（event/listener 下 EventListener 接口 + MessageEventListener、MQEventListener 实现）、事件处理（EventManager）、具体业务流程（LotteryResult、LotteryService、LotteryServiceImpl）。LotteryService 定义成抽象类，通过抽象类屏蔽事件功能，外部业务流程开发者不需要知道具体通知操作；右下角圆圈图表示核心流程与非核心流程的结构——一般主线流程开发完成后，再用通知方式处理辅助流程，可异步（在 MQ 与定时任务下保证最终一致性）。
- Key claims: 三层结构＝监听器/事件管理/业务流；抽象类把事件通知细节对业务调用方隐藏；辅助流程与主线分离、可异步保证最终一致性。
- Learner-relevant: 形成重构后的整体地图——通知不再散落在业务方法里，而是挂接在事件管理器上。

### 代码实现-事件监听接口定义
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-事件监听接口定义]]`
- Summary: `EventListener` 接口只定义一个方法 `void doEvent(LotteryResult result)`；若方法入参信息类型可变，可使用泛型 `<T>` 包装。
- Key claims: 监听器的统一契约是 doEvent(result)；泛型可让入参类型更灵活。
- Learner-relevant: 理解观察者模式中"观察者（监听器）统一接口"的角色，是实现类的骨架。

### 代码实现-两个监听事件的实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-两个监听事件的实现]]`
- Summary: `MessageEventListener` 实现短信通知（打印"给用户 uId 发送短信通知"），`MQEventListener` 实现 MQ 记录（打印"记录用户 uId 摇号结果(MQ)"），两者都从 result 取 uId 与 msg。真实业务会调用外部接口并控制异常处理，必要时按泛型对事件内容做不同包装。
- Key claims: 两个监听实现都很简单，职责单一（短信 / MQ 各自处理）；真实场景需补外部调用与异常控制。
- Learner-relevant: 看到辅助流程被打散成独立类——新增一种通知只需新增一个监听器。

### 代码实现-事件处理类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-事件处理类]]`
- Summary: `EventManager` 用 `Map<Enum<EventType>, List<EventListener>>` 按事件类型分组存放监听器，构造器按传入的枚举（MQ、Message）初始化空列表；提供三个主要方法：subscribe（订阅，把监听器加入对应类型的列表）、unsubscribe（取消订阅，从列表移除）、notify（通知，遍历该类型监听器逐个 doEvent）。
- Key claims: 订阅/取消订阅/通知三方法对应监听器的添加、移除、使用；用枚举 EventType.MQ / EventType.Message 限定事件类型，防止外部乱传信息。
- Learner-relevant: 事件管理器是"一对多通知"的中枢，枚举约束使事件类型可枚举、可扩展。

### 代码实现-业务抽象类接口
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-业务抽象类接口]]`
- Summary: `LotteryService` 改为抽象类：构造器中 new EventManager 并 subscribe 两个监听器（MQ、Message）；公开方法 `draw(uId)` 调用抽象方法 doDraw 拿到结果后按需 `eventManager.notify(...)` 触发通知再返回结果；`protected abstract LotteryResult doDraw(uId)` 由继承者实现，protected 保证外部调用方只能走 draw 才能完成事件通知。
- Key claims: 模板方法思想——draw 里编排"取结果＋通知"，子类只实现核心 doDraw；枚举传什么类型就触发什么事件通知、按需添加；抽象类把事件功能对业务方屏蔽。
- Learner-relevant: 这是"通知与核心流程解耦"的关键设计：调用方拿到的仍是 draw，但通知由基类统一挂接。

### 代码实现-业务接口实现类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-业务接口实现类]]`
- Summary: `LotteryServiceImpl extends LotteryService`，只重写 `doDraw`：调用 minibusTargetService.lottery 摇号，返回 `new LotteryResult(uId, lottery, new Date())`，不再包含任何短信/MQ 辅助流程。
- Key claims: 业务实现里已经没有额外辅助流程，只有核心流程处理；代码显著变简单。
- Learner-relevant: 对比一把梭版本——核心方法回归单一职责，辅助流程全部移交给事件管理器。

### 测试验证-观察者
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#测试验证]]`
- Summary: 测试类调用 `draw("2765789109876")`（与一把梭测试几乎无差别），输出来自 MQEventListener 的"记录用户摇号结果(MQ)"与 MessageEventListener 的"给用户发送短信通知(短信)"，再返回 LotteryResult，exit code 0；测试结果满足预期。
- Key claims: 从调用方看几乎没有区别，但这种实现方式非常方便维护代码、扩展新需求；日志来源从实现类换成了各监听器。
- Learner-relevant: 用"同一结果、同一调用形态"印证重构无行为回归，同时结构上获得可扩展性，是模式魅力的实证。

### 总结-观察者
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]`
- Summary: 从过程式开发到观察者模式的面向对象开发，设计模式改造后拆分了核心流程与辅助流程——核心流程一般不常变化，辅助流程（营销、裂变、促活等）会随业务变化，因此用模式架设代码很有必要。该模式结构上满足开闭原则：新增或修改监听事件不需要改动事件处理类；但可能无法控制调用顺序、且做事件结果返回后的继续操作有限，使用时要考虑场景合理性。任何设计模式都不是单独使用的，需结合其他模式共同建设；引入模式是为了更易扩展和维护，不能反而把结构搞复杂、难维护。
- Key claims: 优点＝核心/辅助流程解耦、满足开闭原则（新增监听不改事件处理类）；注意点＝难控调用顺序、事件结果回传后的继续处理受限；切忌为用而用导致过度设计。
- Learner-relevant: 收尾价值判断——观察者模式的适用场景与边界，以及"模式要组合、合理用"的总原则。