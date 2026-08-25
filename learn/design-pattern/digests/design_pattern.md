---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 11134
created: 2026-08-24
updated: 2026-08-24
---

# Digest — design_pattern

《重学 Java 设计模式》by 小傅哥 (fuzhengwei) — 22 GoF design patterns taught through real internet business scenarios (marketing, 秒杀, payment, ORM, middleware). Each chapter contrasts a "一坨代码/ifelse" implementation with a pattern-refactored one in Java Maven projects (itstack-demo-design-N-00/01/02), following: 开发环境 → pattern intro → 场景模拟 → ifelse实现 → 设计模式实现 (工程结构/类图/代码) → 测试验证 → 总结. Six principles govern the whole book: 单一职责, 里氏替换, 依赖倒置, 接口隔离, 迪米特原则, 开闭原则.

## Overview (L1)

- 前言+阅读建议+参考资料+目录 — hands-on (not theory) Java design-pattern tutorial; 22 real internet business scenarios; patterns traced to Christopher Alexander's 《建筑模式语言》 and the Gang of Four's 1994 book; experienced devs converge on the same 高内聚/低耦合/可扩展/可复用 principles without formal study.
- 目录/创建者模式 intro — TOC organizes 22 patterns into 创建型×5, 结构型×7, 行为型×10, each table listing 类图稿/业务场景/实现要点; the six principles above govern all chapters.
- 创建型 (5节: 工厂方法, 抽象工厂, 建造者, 原型, 单例) — object-creation mechanisms improving flexibility and reusability of existing code.
- 结构型 (7节: 适配器, 桥接, 组合, 装饰器, 外观, 享元, 代理) — assembling objects/classes into larger structures while keeping them flexible and efficient.
- 行为型 (10节: 责任链, 命令, 迭代器, 中介者, 备忘录, 观察者, 状态, 策略, 模板, 访问者) — efficient communication and responsibility delegation among objects.
- Teaching style — every chapter: 场景模拟 + ifelse实现 (the smell) + 设计模式实现 (工程结构/类图/代码) + 总结 (principles satisfied, benefits, trade-offs). Suggested method: study chapter alongside code, run it, then reflect on applying the pattern in your own business.

## Sections (L2)

### factory-method (工厂方法模式)

- Locator: `[[sources/design-pattern/design_pattern#工厂方法模式]]`
- Summary: marketing 积分兑换 prize-awarding scenario; three incompatible third-party prize interfaces (优惠券 `sendCoupon`, 实物商品 `deliverGoods`, 爱奇艺兑换卡 `grantToken`) with different return types/params, more products coming. ifelse `PrizeController.awardToUser` branches on awardType (1/2/3) calling services inline; works but every new product means editing the controller. Refactor: `ICommodity.sendCommodity(uId, commodityId, bizId, extMap)` with `CouponCommodityService`/`GoodsCommodityService`/`CardCommodityService` (each wraps one third-party service, unifies IO, throws RuntimeException on failure) + `StoreFactory.getCommodityService(type)`. Factory method = creation interface, subclasses decide which factory to instantiate.
- Key claims: decouples creator from concrete product logic; satisfies 单一职责 and 开闭原则 (new products added without changing callers); weakness is subclass proliferation, mitigated by later pattern combinations; factory can use switch or map-config instead of if-chains.
- Learner-relevant: canonical "ifelse → factory" before/after; anchors 开闭原则 and 单一职责; motivates why code structure matters for iterative business growth.

### abstract-factory (抽象工厂模式)

- Locator: `[[sources/design-pattern/design_pattern#抽象工厂模式]]`
- Summary: upgrading single-node Redis to clustered Redis (EGM `gain`, IIR `get`) without affecting running systems. ifelse adds a `redisType` param to every `CacheService` method. Refactor: `ICacheAdapter` interface implemented by `EGMCacheAdapter`/`IIRCacheAdapter` mapping method names, plus `JDKProxy.getProxy(interfaceClass, cacheAdapter)` + `JDKInvocationHandler` using JDK dynamic proxy + reflection to route calls without modifying the original `CacheServiceImpl`. Abstract factory = "central factory creating other factories"; solves interface-selection across a product family.
- Key claims: addresses 接口选择 within a product family of differently-named products; proxy approach reuses existing classes unmodified; satisfies 单一职责/开闭/解耦; family growth raises class complexity — mitigatable with proxies and auto-loading.
- Learner-relevant: extends factory method with adapter + JDK proxy; contrasts 工厂方法 (one product hierarchy) vs 抽象工厂 (family of related products); anchors the "upgrade infrastructure behind an interface without touching callers" migration lesson.

### builder (建造者模式)

- Locator: `[[sources/design-pattern/design_pattern#建造者模式]]`
- Summary: 装修公司 decoration packages (豪华欧式/轻奢田园/现代简约) combining 物料 (ceilings, coats, floors, tiles) implementing `Matter` interface, priced per square meter. ifelse `DecorationPackageController.getMatterList(area, level)` hard-codes each package combo and pricing. Refactor: `IMenu` (fluent `appendCeiling/appendCoat/appendFloor/appendTile` returning `this`, `getDetail`), `DecorationPackageMenu` (accumulates materials, computes price per append), `Builder.levelOne/Two/Three(area)`. Builder separates complex construction from representation so the same process creates different representations.
- Key claims: satisfies 单一职责; with many materials/combinations class expansion becomes a burden — mitigated by DB configuration; the hard part is extracting which build modules fit the builder mindset, needs practice; both versions produce the same quote, proving pattern changes structure not behavior.
- Learner-relevant: canonical fluent-API builder example; useful for 创建型 family comparison (builder vs factory) and "stable parts, variable assembly" lesson.

### prototype (原型模式)

- Locator: `[[sources/design-pattern/design_pattern#原型模式]]`
- Summary: online-exam paper generation. Bad way: `QuestionBankController` hand-builds identical non-shuffled paper per candidate. Refactor: `QuestionBank implements Cloneable`, overrides `clone()` to deep-copy question lists and `Collections.shuffle` question/option ordering via `TopicRandomUtil`; build template once, `questionBank.clone()` per candidate.
- Key claims: intent is creating many duplicate complex objects, especially when construction involves slow DB/RPC; Java requires `Cloneable`; clone() must copy internal collections too or it corrupts the original (deep copy); cons are circular references and deeply nested objects; prototype usage frequency is low; over-applying patterns causes over-design.
- Learner-relevant: distinguishes prototype (clone template) from builder (append assembly) and factory; lesson on shallow vs deep copy in Java.

### singleton (单例模式)

- Locator: `[[sources/design-pattern/design_pattern#单例模式]]`
- Summary: 7 ways to implement a single global instance, contrasted on lazy (懒汉) vs eager (饿汉) loading and thread safety. Triggers: DB connection pools, Spring singleton beans, global property holders.
- Key claims: 7 variants — (0) static class with ConcurrentHashMap cache; (1) lazy thread-unsafe; (2) lazy synchronized method (every call pays lock cost); (3) eager static field (thread-safe, not lazy); (4) static inner class/holder (JVM class-loading guarantee: thread-safe + lazy + no lock — highly recommended); (5) double-checked locking; (6) CAS via AtomicReference (lock-free busy-wait, high concurrency, infinite-spin risk); (7) enum singleton (Effective Java, free serialization + reflection/serialization protection, best way, unusable under inheritance).
- Learner-relevant: practical Java-concurrency lesson (locks vs CAS vs JVM class-loading, reflection/serialization attacks); decision: eager/static when lazy unnecessary, lazy when resources only appear on user-triggered conditions, enum as general best default.

### adapter (适配器模式)

- Locator: `[[sources/design-pattern/design_pattern#适配器模式]]`
- Summary: marketing/rebate system ingesting heterogeneous MQ messages. Bad way: one consumer class per MQ type with hand-rolled field mapping. Refactor: unified `RebateInfo` message body, `MQAdapter.filter()` mapping arbitrary MQ JSON via configurable `Map<String,String> link` + reflection setters, and `OrderAdapterService.isFirst(uId)` interface with `InsideOrderService` (order-count ≤ 1) and `POPOrderAdapterServiceImpl` (direct boolean). Spring itself ships many `*Adapter` classes.
- Key claims: adapter makes incompatible interfaces uniform for the caller (analogues: universal charger, travel adapter); central to 中台 unification; adapts not just interfaces but data/attributes (MQ field-name mapping is the twist); mapping config can live in files/DB; a proxy class can avoid hand-writing consumer classes; same "different-kinds-adapter" idea appears in the factory-method prizes chapter.
- Learner-relevant: contrasts adapter (make existing interfaces compatible) vs facade vs bridge; pattern-recognition lesson: find `Adapter` names in framework source code.

### bridge (桥接模式)

- Locator: `[[sources/design-pattern/design_pattern#桥接模式]]`
- Summary: third-party payment aggregation combining channels (WeChat, Alipay) × modes (password, face, fingerprint). Bad way: single `PayController.doPay()` with nested ifelse over channelType × modeType. Refactor: abstract `Pay` (holds `IPayMode payMode` via constructor — the bridge) with `WxPay`/`ZfbPay` subclasses, and `IPayMode.security(uId)` implemented by `PayCypher`/`PayFaceMode`/`PayFingerprintMode`. Callers compose freely: `new WxPay(new PayFaceMode())`.
- Key claims: decouples abstraction from implementation so multiple matchable axes combine; bridge is a field holding the other axis's interface injected via constructor; real analogues: JDBC drivers, brand desktops/laptops; without it, combinations become a Cartesian product of subclasses; satisfies single responsibility and open-closed; caller side can later be config-driven with abstract factory or strategy + map; pay-mode risk-control differences could reuse adapter.
- Learner-relevant: the "two orthogonal axes" refactoring move — nested channel × mode ifelse signals a bridge opportunity; comparison node: bridge (composition of axes) vs adapter (unifying incompatible interfaces) vs strategy.

### composite (组合模式)

- Locator: `[[sources/design-pattern/design_pattern#组合模式]]`
- Summary: marketing coupon decision tree (decision engine) composing filter nodes into a tree, replacing hand-nested ifelse `EngineController`. `LogicFilter`/`BaseLogic` with `UserAgeFilter`/`UserGenderFilter`, plus `IEngine`/`EngineConfig`/`EngineBase` walking nodes (type 1 = 子叶, 2 = 果实) via `TreeNode`/`TreeNodeLink`; `TreeRich` aggregate holds tree root + node map; tree assembled in tests, liftable to DB/graphical config.
- Key claims: organizes similar objects into a callable structure tree so clients compose services freely; ifelse is fastest but unmaintainable as dimensions grow; tree engine keeps open-closed — new logic nodes/relationships added without changing model structure; reuse via tree-id decouples engine from business; adapter/factory work is the price.
- Learner-relevant: "structural tree composition vs deep ifelse nesting"; applies to packaging/composing service interfaces, not just decision trees.

### decorator (装饰器模式)

- Locator: `[[sources/design-pattern/design_pattern#装饰器模式]]`
- Summary: extends simulated Spring SSO login interceptor (`SsoInterceptor`) with per-user method-access control. Bad way: inheritance (`LoginSsoDecorator extends SsoInterceptor`). Pattern way: abstract `SsoDecorator` implements the interface, holds wrapped interceptor via constructor, forwards `preHandle`; `LoginSsoDecorator extends SsoDecorator` adds method-level auth without touching the original.
- Key claims: adds functionality without modifying the original class, an alternative to inheritance (child-class explosion) and AOP (complexity); four roles: Component, ConcreteComponent, Decorator (abstract, implements interface, constructor receives implementation), ConcreteDecorator; honors single responsibility; `new BufferedReader(new FileReader(...))` is a familiar decorator use; also fits adapting a single-message interface to a list-message provider.
- Learner-relevant: when to prefer decorator over inheritance; wrap-by-constructor + interface-forwarding as the decorator core.

### facade (外观模式)

- Locator: `[[sources/design-pattern/design_pattern#外观模式]]`
- Summary: wraps a SpringBoot HelloWorld `queryUserInfo` API in a whitelist via a custom starter middleware. Bad way: hard-coded whitelist List check inside the controller (duplicated across interfaces). Pattern way: `itstack-demo-design-10-02` middleware — `StarterService` reads config, `StarterServiceProperties` binds `itstack.door` yml, `StarterAutoConfigure` conditionally registers bean, `@DoDoor(key, returnJson)` annotation + `@Aspect` `DoJoinPoint` intercepts methods, extracts key field, compares against whitelist, returns preset JSON for blocked users.
- Key claims: 外观/门面 lowers caller complexity by adding a middle layer wrapping logic into a unified API; usable as interface wrapper or logic wrapper at middleware layer so business code ignores cross-cutting concerns; whitelist/切量 gates during release are common, cross-cutting, reusable components; built on SpringBoot starter + AOP + custom annotation + externalized config; excessive/improper use causes 反设计/过渡设计 — judgment comes from practice.
- Learner-relevant: concrete template for custom SpringBoot starter middleware (annotation + AOP + auto-configuration); shows facade as cross-cutting isolation and reuse, not just interface aggregation.

### flyweight (享元模式)

- Locator: `[[sources/design-pattern/design_pattern#享元模式]]`
- Summary: optimizes 秒杀 activity-stock query. Bad way: re-queries all activity info each call. Pattern way: `ActivityFactory` caches fixed activity data in `Map<Long, Activity>` (flyweight factory); changing stock lives in simulated Redis (`RedisUtils` with scheduled task draining an `AtomicInteger`); `ActivityController` combines cached activity + live stock per query.
- Key claims: shares common objects to cut memory use and improve access efficiency; shared object typically memory-heavy or expensive to query (DB/interfaces); distinguish server-side (connection/thread pools) vs client-side (game scene rendering) sharing; factory manages independent vs shared objects to avoid thread-safety issues; map-keyed by fixed id is the critical get/store point, usable in other factories to kill ifelse; trade-off: hard to separate internal from external state in complex business.
- Learner-relevant: sibling of 原型模式 ("reduce overhead" ideas); separating stable identity data from volatile state and caching the former.

### proxy (代理模式)

- Locator: `[[sources/design-pattern/design_pattern#代理模式]]`
- Summary: simulates the mybatis-spring DAO proxy — define `IUserDao` with `@Select(...)`, no implementation, get a working bean. `MapperFactoryBean<T>` implements Spring `FactoryBean`, using `Proxy.newProxyInstance` + `InvocationHandler` to read `@Select` SQL and produce results; `RegisterBeanFactory` (`BeanDefinitionRegistryPostProcessor`) registers the bean definition; spring-config.xml wires it; test fetches `userDao` from the `BeanFactory`.
- Key claims: provides convenient proxy service over access to resources/objects — database access layers shielding connection counts, RPC frameworks generating proxy classes that emit socket calls, MyBatis CRUD without implementation classes; core pieces are JDK dynamic proxy + reflection and Spring bean definition/registration (`GenericBeanDefinition`, constructor args, `BeanDefinitionReaderUtils.registerBeanDefinition`); proxy is common in middleware, rare in pure business CRUD; keeps code clean and highly reusable.
- Learner-relevant: demystifies how MyBatis "works without an impl class"; entry point to Spring bean lifecycle + JDK dynamic proxy in middleware design.

### chain-of-responsibility (责任链模式)

- Locator: `[[sources/design-pattern/design_pattern#责任链模式]]`
- Summary: multi-level approval flow for system releases during 618 promotion; which levels apply depends on date windows. Bad way: one `AuthController.doAuth()` with stacked if blocks hard-coding each level's date window and approver. Refactor: abstract `AuthLink` holding `levelUserId`/`levelUserName` + `next` node + `appendNext()`; `Level1AuthLink`/`Level2AuthLink`/`Level3AuthLink` each `doAuth()` checks whether that level approved, else passes to `next.doAuth(...)` (recursive forwarding); callers build the chain once via `appendNext`; `AuthInfo` packages the return info.
- Key claims: arranges services into ordered sequential processing (analogues: family expense approval by amount, successive-leader sign-off); dynamic ordering lets the chain be config-driven (XML/DB) when business changes often; removes ifelse, respects single responsibility and open-closed; caveats — if is fine for pure judgment, chain should combine with composite-tree flows, over-use risks performance cost and messy orchestration/debugging.
- Learner-relevant: replacing stacked if/else flow decisions with a linked chain; compare chain (sequential hand-off, ordered) vs composite/tree decisions vs strategy; chain assembly can be packaged and configured externally.

### command (命令模式)

- Locator: `[[sources/design-pattern/design_pattern#命令模式]]`
- Summary: upscale restaurant: customers order across eight cuisines, the waiter (小二) relays orders to the right cooks, neither side cares about the other. Bad way: one `XiaoEr` class whose `order(int cuisine)` uses if blocks to map a cuisine number to a canned description. Refactor: abstract command `ICuisine.cook()` with concrete cuisines (each wrapping an `ICook`), abstract implementor `ICook.doCooking()` with concrete cooks, and invoker `XiaoEr` holding `List<ICuisine>` with `order(ICuisine)` and synchronized `placeOrder()` calling `cook()` on each then clearing. Test composes `new GuangDoneCuisine(new GuangDongCook())`.
- Key claims: separates logic implementation from operation request to lower coupling; four roles — abstract command, concrete commands, implementors, caller/invoker; command objects are data-driven, passed via constructors; each class gains single responsibility so dishes/cooks extend independently; cons — command × implementation combinations multiply classes; invoker can support delete/undo.
- Learner-relevant: "split into command / implementor / invoker" refactor for request-decoupled scenarios; comparison vs strategy (both wrap behavior; command couples a receiver, can be queued/undone) and vs observer (event notification vs explicit invocation).

### iterator (迭代器模式)

- Locator: `[[sources/design-pattern/design_pattern#迭代器模式]]`
- Summary: deep traversal of a company's tree-shaped org structure. JDK list iteration does not apply to business-specific tree data, so the chapter hand-builds an iterator. Recaps the JDK trio: `Collection`, `Iterable` (provides `iterator()`), `Iterator` (`hasNext()`, `next()`). Refactor mirrors the trio as interfaces `Iterator<E>`, `Iterable<E>`, `Collection<E, L>` (two generics for employees and node links), entities `Employee`/`Link`, and core `GroupStructure implements Collection<Employee, Link>` backed by maps (employeeMap, linkMap id→children, invertedMap toId→fromId). Anonymous `Iterator` walks depth-first: descend to deepest node, scan siblings, ascend via inverted map, until `totalIdx` reaches employee count.
- Key claims: one uniform way to traverse different data structures (array, linked list, tree) while caller ignores traversal logic; enhanced-for is not the iterator pattern; implementation is complex, adds classes, separates traversal from data structure (single responsibility, open-closed); iteration strategy swappable depth-first ↔ breadth-first; hard spots are the three interfaces, tree data relationships, depth-traversal algorithm.
- Learner-relevant: JDK internals lesson (how `Iterator`/`Iterable`/`Collection` really work, e.g. `ArrayList.Itr`); depth-first vs breadth-first traversal over a graph/tree built from node + link records.

### mediator (中介者模式)

- Locator: `[[sources/design-pattern/design_pattern#中介者模式]]`
- Summary: writing a MyBatis-style ORM over raw JDBC. Bad way: direct `JDBCUtil` — `Class.forName`, `DriverManager.getConnection`, `Statement`, `ResultSet` while-loop; every business repeats boilerplate. Refactor packages the DB layer behind a mediator: `SqlSession` interface (`selectOne`/`selectList`/`close`) implemented by `DefaultSqlSession` (prepares statements from parsed `XNode` mapper elements, reflects `ResultSet` columns into POJOs via `setXxx`); `SqlSessionFactory.openSession()` with `DefaultSqlSessionFactory` (holds `Configuration`: connection + mapperElement); `SqlSessionFactoryBuilder.build(Reader)` uses SAXReader (with `XMLMapperEntityResolver` for offline parsing) to parse `mybatis-config-datasource.xml` and `<select>` statements, mapping `#{...}` to `?` via regex into namespace+id-keyed `XNode`s. Usage mirrors real MyBatis.
- Key claims: inserts a mediator layer wrapping repeated calls among complex components, exposing a simple generic extensible service (analogues: airport tower, bus station, 中台 wrapping all interfaces); same idea aggregates N external prize/interface providers into one prize-center service; benefits — callers don't know JDBC internals, multi-datasource extension easy at the connection builder, satisfies single responsibility, open-closed, Law of Demeter; doubles as a source-code reading exercise.
- Learner-relevant: hands-on "how MyBatis actually works" lesson (SqlSession → factory → builder → XML parsing); mediator vs facade comparison (both wrap subsystems; mediator coordinates peers, facade simplifies one interface); 中台/aggregation-service design idea.

### memento (备忘录模式)

- Locator: `[[sources/design-pattern/design_pattern#备忘录模式]]`
- Summary: recording online configuration files during release for emergency rollback. Real systems keep version number, time, MD5, content, operator, often in DB; demo keeps in memory. Adds three classes without modifying the original `ConfigFile`: `ConfigMemento` (thin wrapper holding a `ConfigFile`), `ConfigOriginator` (get/set `ConfigFile` + `saveMemento()` returning a new memento + `getMemento(memento)` writing content back into the current `ConfigFile`), and `Admin` (manager keeping `List<ConfigMemento>` + versionNo→memento map; `append`, `undo`, `redo`, `get(versionNo)`). Test saves four versions, then undo twice, redo once, get by version.
- Key claims: intent is restore/rollback — configs, versions, regret moves (IDEA undo/redo, console save-games, Photoshop history) — built on not breaking the original object; `getMemento` assigns the remembered `ConfigFile` into the current object rather than returning it directly; in-memory suits ephemeral scenarios (Photoshop history, ERP activity editing) but risks data loss/memory use — store in DB for durable cases; point is experienced via test/history operations.
- Learner-relevant: undo/redo/versioning implementation lesson (cursor-based list + version map, save/undo/redo/get); comparison vs state pattern (memento snapshots state, state switches behavior) and vs prototype (snapshot copying).

### observer (观察者模式)

- Locator: `[[sources/design-pattern/design_pattern#观察者模式]]`
- Summary: 小客车指标摇号 lottery service must notify users via SMS and push to MQ after each draw. Bad way inlines both calls sequentially inside `LotteryServiceImpl.doDraw`, mixing auxiliary flow into core. Refactor: `EventListener` interface (`doEvent(LotteryResult)`), `MessageEventListener`/`MQEventListener`, `EventManager` holding `Map<EventType, List<EventListener>>` with subscribe/unsubscribe/notify keyed by an `EventType` enum (MQ, Message). `LotteryService` becomes an abstract class whose `draw()` runs the template flow and fires notifications, exposing `protected abstract doDraw()` for subclasses.
- Key claims: decouples core flow from auxiliary flow (marketing, 裂变, 促活) which changes more often than core logic; satisfies open-closed — adding listeners/notification logic requires no edits to the event manager or business flow; listener interfaces can use generics `<T>` when payload types vary; trade-offs — call ordering uncontrollable, chaining results back from events awkward; MQ services and event-listener buses are everyday observer-style designs.
- Learner-relevant: reusable template for converting sequential inline side-effects into subscribable events; supports open-closed principle and the core-vs-auxiliary flow split recurring in later patterns.

### state (状态模式)

- Locator: `[[sources/design-pattern/design_pattern#状态模式]]`
- Summary: models one behavior's multiple state transitions; different states allow different next actions. Scenario: 营销活动 goes 编辑中 → 待审核 → 审核通过/拒绝 → 活动中/关闭/开启, only legal transitions allowed. Bad way: single `ActivityExecStatusController.execStatus` with nested if/else testing every from-state/to-state combination. Refactor: abstract `State` class with 7 operations (arraignment, checkPass, checkRefuse, checkRevoke, close, open, doing), one concrete state class per status (EditingState, CheckState, CloseState, DoingState, OpenState, PassState, RefuseState) where each method enforces exactly what that state permits (returning "0001" refusal otherwise), and a `StateHandler` mapping each `Status` enum to its `State` via ConcurrentHashMap, dispatching — eliminating ifelse entirely.
- Key claims: each state → next-state rule is distributed into each state's own methods, removing conditional branching; satisfies single-responsibility and open-closed; shifts code from procedural to object-oriented; cost is a larger number of classes, so ROI should be evaluated — use when states are frequently modified, componentizable, or business/non-business logic can be pulled apart.
- Learner-relevant: canonical pattern for multi-stage approval/workflow engines (审核流, 审批流); how enum + map dispatch replaces branching and why too many classes may be over-engineering.

### strategy (策略模式)

- Locator: `[[sources/design-pattern/design_pattern#策略模式]]`
- Summary: behavioral pattern and a "利器" for replacing large ifelse over same-kind replaceable algorithms. Scenario: computing discounted amounts for coupon types — 直减, 满减, 折扣, n元购. Bad way: single `CouponDiscountService.discountAmount(int type, ...)` with one if-branch per coupon type and a growing parameter list. Refactor: `ICouponDiscount<T>` with `BigDecimal discountAmount(T couponInfo, BigDecimal skuPrice)`, four implementations (ZJCouponDiscount, MJCouponDiscount, ZKCouponDiscount, NYGCouponDiscount) each encapsulating one formula with a 1-yuan minimum-pay rule, and a generic `Context<T>` holding an `ICouponDiscount<T>` and delegating — may also be wrapped as a map so callers pick a strategy by type. BigDecimal used throughout for money math.
- Key claims: cleanly isolates each coupon algorithm, meeting isolation and extensibility needs, easily absorbing new coupon types; suits interchangeable behavior logic such as payment types (credit card/alipay/wechat) and unique-ID generation (UUID, DB auto-increment, DB+Redis, snowflake, Leaf); structurally similar to command and adapter but different intent — choosing among them needs practice-based experience.
- Learner-relevant: concrete, immediately transferable ifelse-replacement for pricing/rule engines; the Context-wrapper shape recurs and can be compared against command/adapter/combination patterns.

### template-method (模板模式)

- Locator: `[[sources/design-pattern/design_pattern#模板模式]]`
- Summary: fixes the execution order of abstract methods in an abstract class so subclasses implement steps without a separate public entry point — "you arrange it clearly, implementers just fill in their part" (西游记 81-tribulations analogy). Scenario: crawler for e-commerce goods generating promotional posters with personal invite codes for JD, Taobao, DangDang. Abstract `NetMall` holds concrete `generateGoodsPoster(skuUrl)` running three steps in order — `login(uId,uPwd)`, `reptile(skuUrl)`, `createBase64(goodsInfo)` — declared `protected abstract`; subclasses `JDNetMall`, `TaoBaoNetMall`, `DangDangNetMall` implement each step (mock login, regex-extract product title, encode poster as base64). Fixed steps exist because some goods only crawl when logged in (logged-in prices differ) and each site parses differently, while poster generation is nearly identical except a source marker.
- Key claims: gives unified control over execution order and common input/output while letting implementers focus on their own business logic; optimization for moving common subclass methods up to the parent and extracting reusable code, parent manages behavior, subclasses extend variable parts; typical usage is lighter-weight than a full algorithm skeleton; every pattern fits its own scenarios and should not be force-applied.
- Learner-relevant: the pattern behind "skeleton + hooks" frameworks and any fixed pipeline (login → crawl → render); reusable for abstract-class design and when not to over-apply it.

### visitor (访问者模式)

- Locator: `[[sources/design-pattern/design_pattern#访问者模式]]`
- Summary: adds changeable access logic on top of a stable data structure (user/employee info), decoupling the two — "the same thing looks different from different perspectives" (girl holding ice-cream: kids watch the ice-cream, friends scout the scene). Scenario: campus users 学生/老师 form a fixed dataset; 家长 cares about student ranking and teacher skill, 校长 cares about teacher class size and 升学率. Structure: abstract `User` (name, identity, clazz) with core `abstract void accept(Visitor)`, subclasses `Student` (exposes `ranking()`) and `Teacher` (exposes `entranceRatio()`) whose `accept` calls `visitor.visit(this)`; `Visitor` interface with overloaded `visit(Student)`/`visit(Teacher)`; implementations `Parent` and `Principal` print only what their role cares about; `DataView.show(Visitor)` iterates the user list calling `accept`.
- Key claims: keystone is `visitor.visit(this)` in each user class — double dispatch routing each concrete element to the matching visitor overload; decouples entities from access business logic, avoids if-checks/class casts when adding view points; trade-offs — complicates structure (User must wait for Visitor interface), violates the Law of Demeter, must be applied only where the scenario fits; observer-style decoupling could be an alternative but visitor is heavier.
- Learner-relevant: demonstrates double dispatch and separating a stable data model from varying views/reports — applicable to reporting dashboards, exports, role-based rendering.

## Cross-cutting lessons

- Every chapter: 场景模拟 → 一坨代码实现 → 设计模式实现 (工程结构 + 类图 + 代码) → 总结; all refactors eliminate ifelse in favor of interface/abstract-class polymorphism.
- Recurring structural toolkit: enum + Map dispatch (state's StateHandler, observer's EventType, strategy's Context), abstract class as sealed entry point (observer's draw(), template's generateGoodsPoster), per-variant classes implementing one role.
- Recurring trade-off framing: patterns satisfy open-closed/single-responsibility, buy extensibility at the cost of more classes and sometimes indirect structure (visitor's Law-of-Demeter violation); judge ROI per scenario, gain judgment through hands-on practice.
- Pattern-family distinctions to stress: 工厂方法 (one hierarchy) vs 抽象工厂 (product family); adapter (unify incompatible interfaces) vs bridge (compose orthogonal axes) vs facade (single simplified facade) vs mediator (coordinate peers); command vs strategy vs observer; memento vs state vs prototype; decorator vs inheritance vs proxy.
