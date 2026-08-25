---
source: design_pattern
part: 3
created: 2026-08-24
updated: 2026-08-24
---

# Part digest 3 — 组合, 装饰器, 外观, 享元, 代理

## Overview (L1)

- 第3–7节（结构型模式的核心部分）— Five structural patterns, each told as "bad ifelse/inheritance implementation" vs "refactored with the pattern" in a Java Maven project (itstack-demo-design-8/9/10/11/12). Scenarios span a marketing coupon decision tree, SSO login interception, a SpringBoot whitelist middleware, Redis 秒杀 stock query, and a mybatis-spring DAO proxy. Each chapter closes with a 总结 contrasting the pattern against the smell and naming trade-offs.

## Sections (L2)

### composite (组合模式)

- Locator: `[[sources/design-pattern/design_pattern#组合模式]]`
- Summary: Builds a marketing coupon decision tree (decision engine) by composing filter nodes into a tree structure, replacing a hand-nested ifelse `EngineController`. Introduces `LogicFilter`/`BaseLogic` with concrete `UserAgeFilter`/`UserGenderFilter`, plus an `IEngine`/`EngineConfig`/`EngineBase` engine that walks nodes (type 1 = 子叶, 2 = 果实) via `TreeNode`/`TreeNodeLink` links until reaching a "fruit" coupon. A `TreeRich` aggregate holds tree root + node map; the tree is assembled manually in tests and can be lifted to DB/graphical config.
- Key claims: 组合模式 organizes similar objects into a callable structure tree so clients can freely compose services (e.g. A/B/C atomic validators composed per caller); the ifelse version is fastest to write but unmaintainable as dimensions grow (gender → age → marital/children → value tweaks); the tree engine keeps the open-closed principle — new logic nodes and relationship trees can be added without changing model structure; reuse via tree-id decouples engine from business; adapter/factory work is the price of the refactor.
- Learner-relevant: Anchors "structural tree composition vs deep ifelse nesting"; pattern applies not just to decision trees but to packaging/composing service interfaces.

### decorator (装饰器模式)

- Locator: `[[sources/design-pattern/design_pattern#装饰器模式]]`
- Summary: Extends a simulated Spring SSO login interceptor (`HandlerInterceptor` → `SsoInterceptor`) with per-user method-access control. The bad way overrides via inheritance (`LoginSsoDecorator extends SsoInterceptor`); the pattern way introduces an abstract `SsoDecorator` that implements the interface, holds the wrapped interceptor via constructor, and forwards `preHandle`, then `LoginSsoDecorator extends SsoDecorator` adds method-level auth without touching the original.
- Key claims: 装饰器核心 is adding functionality without modifying the original class, an alternative to inheritance (child-class explosion) and AOP (complexity); four roles: Component, ConcreteComponent, Decorator (abstract, implements interface, constructor receives implementation), ConcreteDecorator; decorator honors single responsibility — extension logic lives in the decorator and can be added/removed at runtime; nesting pattern like `new BufferedReader(new FileReader(...))` is a familiar decorator use; also fits adapting a single-message interface to a list-message provider.
- Learner-relevant: Distinguishes when to prefer decorator over inheritance; demonstrates wrap-by-constructor + interface-forwarding as the decorator core.

### facade (外观模式)

- Locator: `[[sources/design-pattern/design_pattern#外观模式]]`
- Summary: Wraps a SpringBoot HelloWorld `queryUserInfo` API in a whitelist via a custom starter middleware. The bad way hard-codes a whitelist `List` check inside the controller (duplicated across every interface). The pattern way builds `itstack-demo-design-10-02` as a middleware: `StarterService` reads config, `StarterServiceProperties` binds `itstack.door` yml, `StarterAutoConfigure` conditionally registers the bean, `@DoDoor(key, returnJson)` annotation + `@Aspect` `DoJoinPoint` intercept methods, extract the key field, compare against whitelist, and return a preset JSON for blocked users.
- Key claims: 外观/门面模式 lowers caller complexity by adding a middle layer that wraps logic into a unified API; usable as an interface wrapper or as a logic wrapper at the middleware layer so business code ignores cross-cutting concerns; whitelist/切量 gates during release are common, cross-cutting, and should be a reusable component rather than pasted code; built on SpringBoot starter + AOP + custom annotation + externalized config; excessive/improper pattern use causes 反设计/过渡设计 — design judgment comes from practice.
- Learner-relevant: Concrete template for custom SpringBoot starter middleware (annotation + AOP + auto-configuration); shows facade as cross-cutting isolation and reuse, not just interface aggregation.

### flyweight (享元模式)

- Locator: `[[sources/design-pattern/design_pattern#享元模式]]`
- Summary: Optimizes a 秒杀 activity-stock query. The bad way re-queries all activity info each call (`ActivityController.queryActivityInfo` builds a full `Activity` from "interface/db"). The pattern splits fixed vs changing state: `ActivityFactory` caches fixed activity data in a `Map<Long, Activity>` (flyweight factory), while changing stock lives in simulated Redis (`RedisUtils` with a scheduled task draining an `AtomicInteger`), and `ActivityController` combines cached activity + live stock per query.
- Key claims: 享元模式 shares common objects to cut memory use and improve access efficiency — the shared object is typically memory-heavy or expensive to query (DB/interfaces); distinguish server-side (DB connection pools, thread pools) vs client-side (game scene rendering) sharing; the factory manages independent vs shared objects to avoid thread-safety issues; map-keyed by fixed id is the critical get/store point, also usable in other factories to kill ifelse; trade-off: hard to separate internal from external state in complex business, which makes the factory messy and hard to maintain.
- Learner-relevant: Links to 原型模式 as sibling "reduce overhead" ideas; lesson on separating stable identity data from volatile state and caching the former.

### proxy (代理模式)

- Locator: `[[sources/design-pattern/design_pattern#代理模式]]`
- Summary: Simulates the mybatis-spring DAO proxy — define an interface (`IUserDao` with `@Select("select userName from user where id = #{uId}")`), no implementation, and get a working bean. `MapperFactoryBean<T>` implements Spring `FactoryBean`, using `Proxy.newProxyInstance` + `InvocationHandler` to read the `@Select` SQL and produce a result; `RegisterBeanFactory` (`BeanDefinitionRegistryPostProcessor`) registers the bean definition with a constructor arg for the interface; spring-config.xml wires it; the test fetches `userDao` from the `BeanFactory` and calls it.
- Key claims: 代理模式 provides convenient proxy service over access to resources/objects — e.g. database access layers shielding connection counts, RPC frameworks generating proxy classes that emit socket calls, MyBatis doing CRUD without implementation classes; core pieces are proxy-class creation (JDK dynamic proxy + reflection) and Spring bean definition/registration (`GenericBeanDefinition`, constructor args, `BeanDefinitionReaderUtils.registerBeanDefinition`); proxy is very common in middleware development though rare in pure business CRUD; proxy keeps code clean and highly reusable ("light switch over 220v"), extensible to service packaging, IoT components, caching.
- Learner-relevant: Demystifies how MyBatis "works without an impl class"; entry point to Spring bean lifecycle + JDK dynamic proxy in middleware design.