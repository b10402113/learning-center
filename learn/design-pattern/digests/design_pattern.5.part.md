---
source: design_pattern
part: 5
created: 2026-08-24
updated: 2026-08-24
---

# Part digest 5 — 观察者, 状态, 策略, 模板, 访问者

## Overview (L1)

- 第6-10节 (观察者, 状态, 策略, 模板, 访问者) — Five behavioral patterns taught through real internet business scenarios, each chapter contrasting a crude ifelse/"一坨代码" implementation with a pattern-based refactor in Java Maven projects (itstack-demo-design-18 to 22). The recurring lesson: patterns replace ifelse with interface/abstract-class polymorphism so core business flows separate from auxiliary/variable logic. Scenarios: lottery draw notifications, marketing activity state approval, coupon discount calculation, e-commerce poster crawlers, and campus user-data access from different perspectives. Chapter structure per pattern: 场景模拟 (interfaces/roles), 一坨代码实现 (the smell), 设计模式实现 (工程结构/类图/代码), 总结 (trade-offs and when to apply).

## Sections (L2)

### observer

- Locator: `[[sources/design-pattern/design_pattern#观察者模式]]`
- Summary: Observer (观察者模式) is a behavioral pattern where one behavior emits information to other recipients that react independently, with no direct coupling between them. Scenario: a 小客车指标摇号 lottery service must notify users via SMS and push a result to MQ after each draw. The bad way inlines both calls sequentially inside `LotteryServiceImpl.doDraw`, mixing auxiliary flow into the core path so every new notification changes core code. The refactor adds an `EventListener` interface (`doEvent(LotteryResult)`), `MessageEventListener`/`MQEventListener` implementations, and an `EventManager` holding `Map<EventType, List<EventListener>>` with subscribe/unsubscribe/notify methods keyed by an `EventType` enum (MQ, Message). `LotteryService` becomes an abstract class whose `draw()` runs the template flow and fires notifications, exposing a `protected abstract doDraw()` for subclasses so callers only see the plain core result.
- Key claims: observer decouples core flow from auxiliary flow (marketing, 裂变, 促活), which changes far more often than core logic; the structure satisfies the open-closed principle — adding listeners or changing notification logic requires no edits to the event manager or business flow; listener interfaces can use generics `<T>` when event payload types vary; trade-offs are that call ordering cannot be controlled and chaining results back from events is awkward, so the scenario must justify its use; MQ services and event-listener buses are cited as everyday observer-style designs.
- Learner-relevant: A reusable template for converting sequential inline side-effects into subscribable events; supports explaining open-closed principle and the core-vs-auxiliary flow split that recurs in later patterns.

### state

- Locator: `[[sources/design-pattern/design_pattern#状态模式]]`
- Summary: State (状态模式) models one behavior's multiple state transitions, where different states allow different next actions. Scenario: a marketing activity (营销活动) goes through 编辑中 → 待审核 → 审核通过/拒绝 → 活动中/关闭/开启, with only legal transitions allowed (e.g. 编辑中 cannot jump directly to 拒绝). The bad way is a single `ActivityExecStatusController.execStatus` built from nested if/else blocks testing every from-state and allowed to-state combination — correct but a wall of procedural branching that invites future developers to stuff more flows in. The refactor defines an abstract `State` class with 7 operations (arraignment, checkPass, checkRefuse, checkRevoke, close, open, doing), one concrete state class per status (EditingState, CheckState, CloseState, DoingState, OpenState, PassState, RefuseState) where each method enforces exactly what that state permits (returning an "0001" refusal otherwise), and a `StateHandler` that maps each `Status` enum to its `State` via a ConcurrentHashMap and dispatches — eliminating ifelse entirely.
- Key claims: each state → next-state rule is distributed into each state's own methods, removing conditional branching; the design satisfies single-responsibility and open-closed principles and shifts code from procedural to object-oriented; the cost is a larger number of implementation classes, so ROI should be evaluated — use it when states are frequently modified, can be componentized, or business vs non-business logic can be pulled apart; refactoring ifelse generally hinges on interfaces/abstract classes plus restructuring.
- Learner-relevant: The canonical pattern for multi-stage approval/workflow engines (审核流, 审批流); anchors how enum + map dispatch replaces branching and why too many classes may be over-engineering.

### strategy

- Locator: `[[sources/design-pattern/design_pattern#策略模式]]`
- Summary: Strategy (策略模式) is a behavioral pattern and a "利器" for replacing large ifelse blocks over same-kind replaceable algorithms. Scenario: computing discounted amounts for coupon types — 直减 (direct subtraction), 满减 (threshold-based), 折扣 (percentage), n元购 (fixed price). The bad way is a single `CouponDiscountService.discountAmount(int type, ...)` with one if-branch per coupon type and a growing, non-extensible parameter list. The refactor defines `ICouponDiscount<T>` with `BigDecimal discountAmount(T couponInfo, BigDecimal skuPrice)`, four implementations (ZJCouponDiscount, MJCouponDiscount, ZKCouponDiscount, NYGCouponDiscount) each encapsulating one formula with a 1-yuan minimum-pay rule, and a generic `Context<T>` that holds an `ICouponDiscount<T>` and delegates — it may also be wrapped as a map so callers pick a strategy by type. BigDecimal is used throughout for money math.
- Key claims: strategy cleanly isolates each coupon algorithm, meeting isolation and extensibility needs and easily absorbing new coupon types; the approach suits scenarios with interchangeable behavior logic such as payment types (credit card/alipay/wechat) and unique-ID generation (UUID, DB auto-increment, DB+Redis, snowflake, Leaf); structurally similar to command and adapter patterns but with a different intent, so choosing among them needs practice-based experience.
- Learner-relevant: A concrete, immediately transferable ifelse-replacement technique for pricing/rule engines; the Context-wrapper shape recurs and can be compared against command/adapter/combination patterns.

### template-method

- Locator: `[[sources/design-pattern/design_pattern#模板模式]]`
- Summary: Template method (模板模式) fixes the execution order of abstract methods in an abstract class so subclasses implement steps without a separate public entry point — "you arrange it clearly, implementers just fill in their part" (the 西游记 81-tribulations analogy). Scenario: a crawler (模拟爬取) for e-commerce goods that generates promotional posters (海报 with personal invite codes) for JD, Taobao, and DangDang. The abstract `NetMall` holds a concrete `generateGoodsPoster(skuUrl)` that runs three steps in order — `login(uId,uPwd)`, `reptile(skuUrl)`, `createBase64(goodsInfo)` — declared as `protected abstract` methods; subclasses `JDNetMall`, `TaoBaoNetMall`, `DangDangNetMall` implement each step (mock login, regex-extract product title, encode poster as base64). The fixed steps exist because some goods are only crawlable when logged in (logged-in prices differ) and each site parses differently, while poster generation is nearly identical except for a source marker.
- Key claims: template method gives unified control over execution order and common input/output while letting implementers focus on their own business logic; it is an optimization for moving common subclass methods up to the parent and extracting reusable code, with the parent managing behavior and subclasses extending the variable parts; its typical usage is lighter-weight than a full algorithm skeleton; every pattern fits its own scenarios and should not be force-applied, otherwise maintainers lose the reason the structure exists.
- Learner-relevant: The pattern behind "skeleton + hooks" frameworks and any fixed pipeline (login → crawl → render); reusable for describing abstract-class design and when not to over-apply it.

### visitor

- Locator: `[[sources/design-pattern/design_pattern#访问者模式]]`
- Summary: Visitor (访问者模式) adds changeable access logic on top of a stable data structure (user/employee info), decoupling the two — "the same thing looks different from different perspectives" (a girl holding an ice-cream: kids watch the ice-cream, friends scout the scene). Scenario: campus users 学生/老师 form a fixed dataset; 家长 cares about student ranking and teacher skill, 校长 cares about teacher class size and entrance rates (升学率). Structure: abstract `User` (name, identity, clazz) with the core `abstract void accept(Visitor)`, subclasses `Student` (exposes `ranking()`) and `Teacher` (exposes `entranceRatio()`) whose `accept` calls `visitor.visit(this)`; a `Visitor` interface with overloaded `visit(Student)`/`visit(Teacher)`; implementations `Parent` and `Principal` print only what their role cares about; `DataView.show(Visitor)` iterates the user list calling `accept`, so passing a different visitor produces different output without if/cast branching.
- Key claims: the keystone is `visitor.visit(this)` in each user class — the double dispatch that routes each concrete element to the matching visitor overload; the pattern decouples entities from access business logic and avoids extra if-checks or class casts when adding view points; trade-offs are that it complicates structure (User must wait for the Visitor interface to be defined) and violates the Law of Demeter (最少知道原则), so it must be applied only where the scenario fits; the book notes observer-style decoupling could be an alternative but the visitor class structure is heavier.
- Learner-relevant: Demonstrates double dispatch and how to separate a stable data model from varying views/reports — applicable to reporting dashboards, exports, and role-based rendering.

## Cross-cutting lessons

- Each chapter follows 场景模拟 → 一坨代码实现 → 设计模式实现 (工程结构 + 类图 + 代码) → 总结; all five refactors eliminate ifelse in favor of interface/abstract-class polymorphism.
- Recurring structural toolkit: enum + Map dispatch (state's StateHandler, observer's EventType, strategy's Context), abstract class as a sealed entry point (observer's draw(), template's generateGoodsPoster), and per-variant classes implementing one role.
- Recurring trade-off framing: patterns satisfy open-closed/single-responsibility, buy extensibility at the cost of more classes and sometimes indirect structure (visitor's Law-of-Demeter violation); the book repeatedly urges judging ROI per scenario and gaining judgment through hands-on practice.