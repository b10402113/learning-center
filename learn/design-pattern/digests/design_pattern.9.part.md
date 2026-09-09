---
source: design_pattern
source_lines: 24398
part: 9
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 9)

## Overview (L1)

**第 4 节 装饰器模式**：核心是在不改变原有类的基础上给类新增功能，避免继承导致的子类膨胀与 AOP 的复杂性。以 ERP 单点登录（SSO）拦截服务扩充为案例——先写继承重写的"一坨代码"实现，再用装饰器模式重构，通过抽象装饰角色 `SsoDecorator` 构造函数注入被装饰对象，灵活叠加方法级访问校验。

**第 5 节 外观模式**：也叫门面模式，核心是为子系统的一组接口或通用复杂逻辑提供一个一致的高层包装（中间件层），降低调用方与接口提供方之间的复杂逻辑组合。以给所有服务接口统一添加白名单过滤为案例，结合 SpringBoot 自定义 starter 中间件 + AOP 自定义注解 `@DoDoor` 实现，让业务方只关心业务开发。

## Sections (L2)

### decorator-intro-essay（开场引言：编程感觉与学习观）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-intro-essay]]`
- Summary: 提出"编程感觉"——写代码不止按固定流程写流水式功能，还要思考整套服务的扩展性与可维护性；以"江洋大盗/江洋大偷"比喻业务中用词不当、以"书不是看而是用的"劝诫实操学习。
- Key claims: 大型功能搭建需要驾驭扩展性和维护性的能力；实操技术书要用起来，不是看起来。
- Learner-relevant: 为"何时该用设计模式"铺垫心智：以完成需求为目标而不精益求精，正是代码难以维护的根源。

### decorator-env（开发环境）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-env]]`
- Summary: 列出 JDK 1.8、Idea + Maven 环境；涉及三个工程：9-00 场景模拟工程（模拟单点登录类）、9-01 一坨代码实现、9-02 设计模式优化改造，用于对比学习。
- Key claims: 三工程对比法是本系列统一套路：模拟场景 → 原始实现 → 模式重构。
- Learner-relevant: 工程编号 `itstack-demo-design-9-*` 对应装饰器模式小节。

### decorator-intro（装饰器模式介绍）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-intro]]`
- Summary: 说明装饰器模式核心——在不改原有类的基础上给类新增功能，类似俄罗斯套娃；与继承、AOP 切面对比，装饰器更灵活，可避免子类过多、避免 AOP 复杂度。
- Key claims: 装饰器模式可在不改原有类的前提下新增功能；相比继承避免子类膨胀，相比 AOP 避免复杂度；`new BufferedReader(new FileReader(""))` 这种流的一层层嵌套就是装饰器模式的体现。
- Learner-relevant: 记住装饰器的判别特征：对象逐层包裹、每层叠加职责。

### decorator-scenario（案例场景模拟）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-scenario]]`
- Summary: 模拟单点登录功能扩充场景：初期 ERP 只需账户验证即可访问全部资源；业务发展后出现运营、营销、数据等不同角色，各角色对 ERP 的访问需求不同，又要保证数据安全不给用户最高权限。
- Key claims: 原有 SSO 是组件化通用服务，不能在里面添加用户访问验证功能；此时用装饰器模式扩充单点登录服务，同时保证原有功能不被破坏、可继续使用。
- Learner-relevant: 典型动机——给"不可改动的通用组件"叠加个性化能力。

### decorator-scene-simulate（场景模拟工程）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-scene-simulate]]`
- Summary: 展示 9-00 工程结构：`HandlerInterceptor.java` 与 `SsoInterceptor.java`，模拟 Spring 中的拦截器接口与单点登录拦截服务。
- Key claims: 为避免引入太多 Spring 内容干扰设计模式阅读，使用同名类和方法、尽可能减少外部依赖。
- Learner-relevant: `HandlerInterceptor` / `SsoInterceptor` 是装饰器模式的被装饰对象与统一接口。

### decorator-scene-desc（场景简述：接口与单点登录模拟）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-scene-desc]]`
- Summary: 给出模拟代码：`HandlerInterceptor` 接口声明 `preHandle(request, response, handler)`；`SsoInterceptor` 实现它，从 request 截取子串模拟 cookie 中的 ticket 校验，等于 "success" 即放行。
- Key claims: 实际单点登录基于 `org.springframework.web.servlet.HandlerInterceptor` 实现；模拟实现只是截取字符串，实际需从 `HttpServletRequest` 获取 cookie 解析 ticket。
- Learner-relevant: 明确被扩展的基线功能：登录凭证校验。

### decorator-plain-implement（一坨代码实现：继承重写）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-plain-implement]]`
- Summary: 指出此场景大多数实现都采用继承类的方式，通过继承后重写方法把自己的逻辑覆盖进去；简单场景且不需持续维护扩展时此类实现没问题、不会导致子类过多。
- Key claims: 继承重写是通用做法；但在复杂业务流程代码中会变得混乱。
- Learner-relevant: 记录下"继承方式"作为后续对比的基线。

### decorator-plain-structure（一坨实现工程结构）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-plain-structure]]`
- Summary: 9-01 工程只含 `LoginSsoDecorator.java`，通过继承 `SsoInterceptor` 重写方法功能。
- Key claims: 工程结构非常简单，仅一个继承子类。
- Learner-relevant: 一个扩展就产生一个子类，为"子类膨胀"埋下伏笔。

### decorator-plain-code（继承方式代码实现）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-plain-code]]`
- Summary: `LoginSsoDecorator extends SsoInterceptor`，静态 `authMap` 记录用户可访问的方法（huahua/doudou → queryUserInfo）；重写 `preHandle`：先校验 ticket 成功，再取 userId 查 `authMap`，方法匹配才放行。
- Key claims: 通过继承重写把"个人可访问哪些方法"的功能加进方法中；代码看着还算清晰，但复杂业务流程下会混乱。
- Learner-relevant: 理解要新增的职责：基于用户角色的方法级访问校验。

### decorator-plain-test（继承方式测试验证）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-plain-test]]`
- Summary: 测试类构造 `LoginSsoDecorator`，用 `1successhuahua` 请求调用 `preHandle`；结果为"登录校验：1successhuahua 拦截"。
- Key claims: 测试结果满足预期，已做拦截；可尝试模拟单点登录并继承扩展功能。
- Learner-relevant: 注意这里测试写死了 ticket 成功但方法校验拦截，代表"票有效但无权限"的分支。

### decorator-refactor（装饰器模式重构）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-refactor]]`
- Summary: 说明装饰器主要解决直接继承下功能不断横向扩展导致子类膨胀的问题；用装饰器后比直接继承更灵活、不再需要维护子类。给出四个角色：抽象构件 Component（定义抽象接口）、具体构件 ConcreteComponent（实现抽象接口）、装饰角色 Decorator（定义抽象类并继承接口方法保证一致性）、具体装饰角色 ConcreteDecorator（扩展具体实现逻辑）。
- Key claims: 核心内容体现在抽象类的定义和实现上；四角色模型是装饰器模式的标准结构。
- Learner-relevant: 用四角色表去套本案例：Component=HandlerInterceptor、ConcreteComponent=SsoInterceptor、Decorator=SsoDecorator、ConcreteDecorator=LoginSsoDecorator。

### decorator-refactor-structure（装饰器模式模型结构）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-refactor-structure]]`
- Summary: 9-02 工程含 `SsoDecorator.java`（抽象类）与 `LoginSsoDecorator.java`；给出装饰器实现的类图结构，重点类 `SsoDecorator` 是抽象类，完成对接口 `HandlerInterceptor` 的继承。
- Key claims: 装饰角色继承接口后会提供构造函数，入参就是被继承接口的实现类，从而方便扩展出不同功能组件。
- Learner-relevant: 构造函数注入是装饰器"组合优于继承"的关键落点。

### decorator-refactor-code（装饰器代码实现）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-refactor-code]]`
- Summary: 两个类：抽象装饰角色 `SsoDecorator implements HandlerInterceptor`——私有构造、带 `HandlerInterceptor` 入参的构造、覆盖 `preHandle` 转调被装饰对象；具体装饰角色 `LoginSsoDecorator extends SsoDecorator`——构造透传 `handlerInterceptor`，重写 `preHandle` 时先 `super.preHandle` 校验、失败即返回，再取 userId 查 `authMap` 做方法校验并打日志。
- Key claims: 装饰类三个重点：继承处理接口、提供构造函数、覆盖 `preHandle`；这样踢掉了用子类继承实现逻辑扩展的方式；具体装饰类只关心扩展部分功能，不影响原有类核心服务，也不产生多余子类。
- Learner-relevant: `super.preHandle(request, response, handler)` 在扩展方法里实现了父类功能（被装饰对象原有校验），是装饰器叠加职责的模板。

### decorator-refactor-test（装饰器测试验证）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-refactor-test]]`
- Summary: 测试中 `new LoginSsoDecorator(new SsoInterceptor())` 把原单点登录类透传给装饰器；日志输出"模拟单点登录方法访问拦截校验：huahua queryUserInfo"，结果为"登录校验：1successhuahua 放行"。
- Key claims: 传递者和装饰器都可以是多组的，实际业务中常因太多类型的子类实现不易维护而改用装饰器模式；结果符合预期，扩展了方法拦截校验。
- Learner-relevant: 顺带给出另一个适用场景：接口原收单个消息、外部升级发 list 集合时，可用装饰器适配 list、对使用者仍给 for 循环后的单个消息。

### decorator-summary（装饰器总结）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-summary]]`
- Summary: 装饰器满足单一职责原则，可在自己装饰类中完成功能扩展、不影响主类，并可按需在运行时添加和删除逻辑；装饰器与继承父类重写方法需按需选择，不一定某个最好。
- Key claims: 实现重点是对抽象类继承接口方式的使用，同时设定被继承接口可通过构造函数传递实现类，由此增加扩展性并在重写方法里实现父类功能；生活类比：夏天穿短裤、冬天穿棉裤、雨天穿雨衣——根本本身没被改变，需求被不同装饰实现。
- Learner-relevant: 形成决策判断：频繁横向扩展、要运行时增减功能 → 装饰器；简单固定场景 → 继承足够。

### facade-intro-essay（开场引言：容易背后的承担）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-intro-essay]]`
- Summary: 以"你感受到的容易，一定有人为你承担不容易"类比编程团队中有人只做简单调用、有人开发核心服务与接口；并提出"没有最好的编程语言，语言只是工具""设计是编程的智慧"。警示反设计与过渡设计。
- Key claims: 设计模式解决程序中不合理、不易扩展、不易维护的问题，是干掉大部分 ifelse 的利器；不合理设计/乱用设计模式会导致"反设计、过渡设计"，使编程更复杂难维护。
- Learner-relevant: 设计能力来自实践项目中不断改造优化，应对当前服务体量，避免为用而用。

### facade-env（开发环境）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-env]]`
- Summary: JDK 1.8、Idea + Maven、SpringBoot 2.1.2.RELEASE；三工程：10-00 场景模拟工程（模拟一个提供接口服务的 SpringBoot 工程）、10-01 一坨代码实现、10-02 通过设计模式开发为中间件、包装通用型核心逻辑。
- Key claims: 外观模式小节走 SpringBoot + 中间件路线，工程编号 `itstack-demo-design-10-*`。
- Learner-relevant: 与装饰器小节对比，本案例的重构落点是"中间件"，不是简单类结构。

### facade-intro（外观模式介绍）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-intro]]`
- Summary: 外观模式也叫门面模式，主要解决降低调用方使用接口的复杂逻辑组合；调用方与接口提供方之间增加一个中间层用于包装逻辑、提供 API 接口；有时也用在中间件层，对服务中通用性复杂逻辑做中间件层包装，让使用方只关心业务开发。
- Key claims: 现实类比——早年注册网站要填姓名、昵称、手机号、QQ、邮箱、住址等很多信息，现在只需一步（手机号或微信登录）；服务端对前端做接口包装，注册时从各渠道获取用户信息，获取不到让用户后续补全（营销补全信息给奖励），拉动注册量与活跃度。
- Learner-relevant: 外观模式 = 面向调用方做接口/逻辑的统一包装层，降低使用复杂度。

### facade-scenario（案例场景模拟）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-scenario]]`
- Summary: 模拟将所有服务接口添加白名单的场景：项目发展路上每次发版上线都要测试，测试验证一般走白名单开量或切量；如果在每个接口中都添加这样的逻辑会非常麻烦且不易维护。
- Key claims: 白名单过滤是一类具备通用逻辑的共性需求，非常适合开发成组件来治理服务，让研发更多关心业务开发；外观模式通常用于对复杂或多个接口包装统一对外提供服务，本案例把这种设计思路放到中间件层，让服务可以统一控制。
- Learner-relevant: 识别"横切共性需求 → 中间件/门面"的思路，这是外观模式的升级应用。

### facade-scene-simulate（场景模拟工程）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-scene-simulate]]`
- Summary: 10-00 是一个 SpringBoot HelloWorld 工程，含 `domain/UserInfo`、`web/HelloWorldController`、`HelloWorldApplication` 启动类、`application.yml`；提供查询用户信息接口 `queryUserInfo`，为后续扩展白名单过滤做准备。
- Key claims: 工程是 SpringBoot HelloWorld，接口查询用户信息。
- Learner-relevant: 记下基线接口 `GET /api/queryUserInfo?userId=xxx`，后续测试都在它上面验证。

### facade-scene-desc（场景简述：基础查询接口）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-scene-desc]]`
- Summary: `HelloWorldController` 用 `@RestController`，`queryUserInfo(@RequestParam userId)` 从 yml 读取端口、返回 `UserInfo("虫虫:"+userId, 19, "天津市南开区旮旯胡同100号")`；启动类加 `@Configuration` 注解以便后续读取白名单配置。
- Key claims: 后续需要在此接口扩展白名单，只有指定用户可以查询；`@Configuration` 是为了读取白名单配置。
- Learner-relevant: 理解"被装饰/被包装"的业务接口长什么样。

### facade-plain-implement（一坨代码实现：直接加 if）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-plain-implement]]`
- Summary: 最简单的做法是直接修改代码累加 if 块；快是修改当前内容快，慢是同类内容几百个都要如此修改时扩展和维护会越来越慢。
- Key claims: if 块几乎是实现需求最快也是最慢的方式。
- Learner-relevant: 明确反模式：把非业务逻辑直接塞进每个接口。

### facade-plain-structure（一坨实现工程结构）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-plain-structure]]`
- Summary: 10-01 工程只模拟一个 Api 接口类 `HelloWorldController`，在里面添加白名单功能。
- Key claims: 类似此类的接口会有很多都需要修改，所以不推荐此种方式。
- Learner-relevant: 单一改动点很多 → 需要统一的包装层。

### facade-plain-code（if 块代码实现）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-plain-code]]`
- Summary: `queryUserInfo` 内硬编码 `userList`（1001/aaaa/ccc），`!userList.contains(userId)` 则返回 `UserInfo("1111", "非白名单可访问用户拦截！")`，否则返回正常用户信息。
- Key claims: 白名单代码占据了一大块，但它不是业务逻辑，而是上线开量前测试验证所需；日常这样开发可用本设计模式优化处理方式，让后续扩展和摘除更容易。
- Learner-relevant: 看到"业务代码被横切逻辑污染"的样子。

### facade-refactor（外观模式重构）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-refactor]]`
- Summary: 用外观模式（门面模式）结合 SpringBoot 自定义 starter 中间件开发方式，统一处理所有需要白名单的地方；涉及知识：SpringBoot 的 starter 中间件开发方式、面向切面编程与自定义注解、外部自定义配置信息的透传（SpringBoot 与 Spring 获取配置存在差异）。
- Key claims: 重构核心是门面模式 + starter 中间件统一治理白名单。
- Learner-relevant: 预置三段背景知识（starter、AOP+注解、配置透传），后续代码逐一对号入座。

### facade-refactor-structure（外观模式模型结构）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-refactor-structure]]`
- Summary: 10-02 工程结构含 `annotation/DoDoor`、`config/StarterAutoConfigure`、`config/StarterService`、`config/StarterServiceProperties`、`DoJoinPoint`、`resources/META-INF/spring.factories`；给出外观模式中间件实现思路——右侧是获取配置文件，左侧是切面处理。
- Key claims: 门面模式可以是对接口的包装提供接口服务，也可以是对逻辑的包装、通过自定义注解对接口提供服务能力。
- Learner-relevant: 理解门面中间件的两半：配置侧（右侧）+ 切面侧（左侧）。

### facade-refactor-config（配置服务与自动配置类）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-refactor-config]]`
- Summary: 三块配置代码：`StarterService` 简单持有 `userStr` 并提供 `split` 切分；`StarterServiceProperties` 用 `@ConfigurationProperties("itstack.door")` 定义配置字段；`StarterAutoConfigure` 用 `@Configuration`、`@ConditionalOnClass`、`@EnableConfigurationProperties`、`@Bean`、`@ConditionalOnMissingBean`、`@ConditionalOnProperty` 组装 Bean，读 `itstack.door.userStr`。
- Key claims: 配置文件从 `application.yml` 的 `itstack.door` 前缀获取；条件注解控制中间件按配置启用。
- Learner-relevant: SpringBoot starter 的标准配置注入写法：Properties + AutoConfigure + 条件 Bean。

### facade-refactor-annotation（门面注解与切面逻辑）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-refactor-annotation]]`
- Summary: 自定义注解 `@DoDoor`（`@Retention(RUNTIME)` + `@Target(METHOD)`），入参 `key`（要取的入参属性字段，如 userId）与 `returnJson`（拦截后返回的 Json）；切面 `DoJoinPoint` 用 `@Aspect` + `@Component`，`@Pointcut("@annotation(...DoDoor)")` 切中所有加注解的方法，`doRouter` 环绕逻辑：取方法注解 → 取 key 字段值 → 空则放行 → 与 `starterService.split(",")` 白名单比对 → 命中放行 `jp.proceed()`，否则 `returnObject` 按 `returnJson` 构造拦截返回。
- Key claims: 切面核心是 `doRouter(ProceedingJoinPoint jp)`；`getFiledValue` 获取入参属性（主要是 userId）做拦截校验；`returnObject` 返回拦截转换对象（非白名单用户访问时返回提示信息）。
- Learner-relevant: AOP + 自定义注解是门面模式在 Spring 中的落地形态；注意字段取值对单值参数走 `args[0].toString()` 的兼容逻辑。

### facade-refactor-test（测试验证：接入中间件）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-refactor-test]]`
- Summary: 在 10-00 工程引入中间件 jar 包、配置 `application.yml`（`itstack.door.enabled: true`、`userStr: 1001,aaaa,ccc`）、在 Controller 添加 `@DoDoor(key="userId", returnJson="{...拦截提示...}")` 注解；启动 SpringBoot（Tomcat 8080）。
- Key claims: 白名单用户访问 `?userId=1001` 返回正常数据（code 0000）；非白名单 `?userId=小团团` 返回 `{"code":"1111","info":"非白名单可访问用户拦截！"}`，即自定义注解中的拦截信息。
- Learner-relevant: 验证"业务接口零改动、仅加注解即被门面治理"——这是外观模式中间件化的收益证明。

### facade-summary（外观模式总结）
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-summary]]`
- Summary: 通过中间件方式实现外观模式，增强代码隔离性与复用性，使用灵活并降低每个系统都开发此类服务的风险；白名单只是简单起点，实际业务复杂得多。
- Key claims: 一个小小的开始会影响后续无限扩展，使用设计模式让代码结构更干净整洁；很多时候不是设计模式没有用，而是编程经验不足导致学了也难以驾驭，需按本系列案例实操增强设计能力。
- Learner-relevant: 形成判断：跨接口的共性横切需求 → 用外观模式/中间件统一包装，隔离性与复用性双赢。