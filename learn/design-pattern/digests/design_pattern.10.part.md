---
source: design_pattern
source_lines: 24398
part: 10
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 10)

## Overview (L1)
- **第 6 节：享元模式**：以商品秒杀活动查询为业务场景（活动信息固定、库存信息变化），先用 ifelse 一把梭实现每次从库/接口取全量数据，再用享元模式重构——享元工厂 `ActivityFactory` 用 `Map` 缓存固定活动信息（内部状态），变化库存走模拟 Redis（外部状态），测试验证固定信息复用、库存动态变化，并做优缺点总结。
- **第 7 节：代理模式**：以模拟 mybatis-spring 中间件代理类生成为业务场景，实现"只定义接口不写实现类即可做增删改查"——自定义 `@Select` 注解 + `IUserDao` 接口 + `MapperFactoryBean`（继承 `FactoryBean`，用 JDK `Proxy.newProxyInstance` 生成代理）+ `RegisterBeanFactory`（把代理 bean 注册进 Spring 容器），测试验证从容器拿到代理并调用返回 SQL 结果，最后总结代理模式的适用面与收益。

## Sections (L2)

### 一、开发环境 (享元)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一、开发环境]]`
- Summary: 明确第 6 节开发环境为 JDK 1.8、Idea + Maven；涉及两个工程——`itstack-demo-design-11-01`（用一坨代码实现业务需求）与 `itstack-demo-design-11-02`（通过设计模式优化代码结构，减少内存使用和查询耗时）。
- Key claims: 工程编号 11 对应享元模式（第 11 个模式案例），01 为一坨实现、02 为模式优化版。
- Learner-relevant: 建立"场景版 → 优化版"双工程对照学习的入口。

### 二、享元模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#二、享元模式介绍]]`
- Summary: 享元模式主要在于共享通用对象，减少内存使用、提升系统访问效率；这类共享对象通常比较耗费内存或需要查询大量接口/使用数据库资源，因此统一抽离为共享对象使用。享元分服务端与客户端两种使用形态，实现中需要用享元工厂管理独立对象与共享对象，避免线程安全问题。
- Key claims: 服务端场景如数据库连接池、多线程线程池，以及服务端包装后下发客户端的数据；客户端场景如游戏地图渲染（树木、花草、鱼虫），用共享对象减少内存占用让游戏更流畅；享元工厂负责管理共享对象，规避线程安全。
- Learner-relevant: 建立享元模式的意图锚点——"共享通用对象 + 工厂管理"，为秒杀案例的固定信息/变化信息拆分做铺垫。

### 三、案例场景模拟
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]`
- Summary: 模拟商品秒杀场景下用享元模式做查询优化：从日均十几单发展到每个时段秒杀量破十万的过程中，初始可用数据库行级锁扣减库存，扛不住后改用 redis 分布式锁控制库存；同时查询时不必每次对不同活动都从库中取，因为除库存外其他活动商品信息固定不变，可缓存到内存。
- Key claims: 活动商品信息属于"不变的信息"，库存部分属于"变化的信息"，二者是享元模式拆分的核心分界；本案例用享元模式工厂结构提供活动商品的查询。
- Learner-relevant: 理解秒杀系统的经典演进路径（DB 行锁 → Redis 分布式锁 + 内存缓存），是"内部状态/外部状态"的天然案例。

### 四、用一坨代码实现 (享元)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#四、用一坨坨代码实现]]`
- Summary: 先展示不考虑扩展性的原始查询实现作为对照组：一般程序员先查询固定信息，再用过滤或 if 判断补充变化信息（库存），一开始看不出问题，但随方法逻辑增多，重复代码越来越多。
- Key claims: 一把梭写法"逻辑很简单，就怕你写乱"；固定内容和变化内容的查询组合靠 CV 堆砌。
- Learner-relevant: 建立"反面教材"基线，用于对比享元重构后的工厂化查询。

#### 1. 工程结构 (ifelse 版)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#1. 工程结构]]`
- Summary: 展示 `itstack-demo-design-11-01` 的极简结构：只有一个 `org.itstack.demo.design.ActivityController.java` 控制类用于查询活动信息。
- Key claims: 工程结构非常简单，一个控制类承担全部查询逻辑。
- Learner-relevant: 直观看出单类堆逻辑的坏味道，为重构后"工厂 + Redis + 控制类"分层做对照。

#### 2. 代码实现 (ifelse 版)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2. 代码实现]]`
- Summary: `ActivityController.queryActivityInfo(Long id)` 模拟从接口获取活动信息：new 一个 `Activity` 设置 id(10001L)、name("图书嗨乐")、desc("图书优惠券分享激励分享活动第二期")、起止时间及库存 `new Stock(1000, 1)` 后返回，类似最开始从数据库获取全部商品信息和库存。
- Key claims: 每查一次都从接口/库取全量数据，相当于"数据库可以抗住购物量"的早期形态；后续业务扩展把库存交给 redis 时，需改为从 redis 取库存而非从库，否则造成数据不统一。
- Learner-relevant: 识别"每次全量查询 + 固定信息重复构造"的浪费点，是享元要消除的冗余。

### 五、享元模式重构代码
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#五、享元模式重构代码]]`
- Summary: 用享元模式对查询代码做一次小型重构。指出享元模式平时开发用得不多（除线程池、数据库连接池、游戏场景渲染外），其设计思想是"减少内存使用、提升效率"，与之前原型模式通过克隆对象生成复杂对象、减少 rpc 调用同属此类思想。
- Key claims: 享元与原型思想相通——都是减少重复构造与外部调用成本；本节含工程结构、模型结构、代码实现、测试验证四个子节。
- Learner-relevant: 建立与已学原型模式的横向联系（都指向"减内存/减调用"），并进入重构实现。

#### 1. 工程结构 (享元版)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#1. 工程结构]]`
- Summary: 展示 `itstack-demo-design-11-02` 的分层结构：`util` 包下 `RedisUtils.java`（模拟 Redis），`org.itstack.demo.design` 下 `Activity.java`、`ActivityController.java`、`ActivityFactory.java`（享元工厂）、`Stock.java`，外加 test 下的 `ApiTest.java`。
- Key claims: 从单类演变为"实体 + 工厂 + Redis 工具 + 控制类"的多类结构，职责开始分离。
- Learner-relevant: 对比 11-01 与 11-02 的工程结构差异，建立重构前后的结构感。

#### 享元模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#享元模式模型结构]]`
- Summary: 展示模拟查询活动场景的类图：左侧是享元工厂，提供固定活动数据的查询；右侧是 Redis 存放的库存数据；最终由活动控制类处理查询操作，返回活动全部信息与库存。因库存是变化的，模拟的 `RedisUtils` 中设置了定时任务消耗库存。
- Key claims: 模型分三块——享元工厂（固定数据）、Redis（变化数据）、控制类（组合返回）；定时任务让库存在使用中持续变化。
- Learner-relevant: 建立享元模式的整体结构图，先明确"谁共享、谁变化、谁组装"再进入代码。

#### 2.1 活动信息
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.1 活动信息]]`
- Summary: `Activity` 实体类包含基础活动信息：`id`（活动ID）、`name`（活动名称）、`desc`（活动描述）、`startTime`（开始时间）、`stopTime`（结束时间）、`stock`（活动库存），附 get/set。
- Key claims: 对象类比较简单，只承载活动的基础信息，是享元要共享的"固定内容"载体。
- Learner-relevant: 掌握固定信息实体的字段集合，为理解内部状态缓存做准备。

#### 2.2 库存信息
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.2 库存信息]]`
- Summary: `Stock` 单独提供一个类保存库存数据：`total`（库存总量）、`used`（库存已用），附 get/set。
- Key claims: 库存单独成类，是享元场景中"变化的外部状态"的数据形态。
- Learner-relevant: 体会把变化数据从固定数据中剥离出来的建模方式。

#### 2.3 享元工厂
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.3 享元工厂]]`
- Summary: `ActivityFactory` 用 `static Map<Long, Activity> activityMap = new HashMap<>()` 存放已从库表或接口查询到的数据；`getActivity(Long id)` 先查 map，命中直接返回，未命中则 new `Activity` 设置固定信息（id 10001、图书嗨乐、第二期描述、起止时间）后 `put` 进 map 再返回。
- Key claims: 享元工厂通过 map 结构缓存内存、下次直接获取，避免重复查询；这种结构在开发中较常见，分布式场景也可把数据放到 redis 中按需选择；"用一个固定 id 存放和获取对象"是关键点。
- Learner-relevant: 掌握享元模式的核心落点——"map 缓存 + id 取放"，是内部状态复用的全部机理。

#### 2.4 模拟Redis类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.4 模拟Redis类]]`
- Summary: `RedisUtils` 用 `ScheduledExecutorService`（单线程调度）与 `AtomicInteger stock` 模拟 redis 操作：构造器中 `scheduleAtFixedRate` 每 100000 微秒让库存 `addAndGet(1)` 模拟库存消耗；提供 `getStockUsed()` 返回当前已用库存。
- Key claims: 除模拟 redis 工具外还提供定时任务模拟库存使用，方便测试时观察到库存变化；`AtomicInteger` 保证并发自增安全。
- Learner-relevant: 理解"变化状态从外部模拟源获取"的写法，以及测试观察变化量的手段。

#### 2.4 活动控制类
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.4 活动控制类]]`
- Summary: `ActivityController` 持有 `RedisUtils` 实例；`queryActivityInfo(Long id)` 先通过 `ActivityFactory.getActivity(id)` 获取享元缓存的固定活动信息，再从 redis 取已用库存 `new Stock(1000, redisUtils.getStockUsed())` 回填到 activity，最终返回包装完整的活动信息给调用方。
- Key claims: 因为库存变化而活动信息固定，控制类把"工厂取固定 + redis 补变化"组合为统一入口；固定信息复用、变化信息实时获取。
- Learner-relevant: 看到享元模式的完整装配流程——工厂负责内部状态复用，控制类负责叠加外部状态。

#### 3. 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#3. 测试验证]]`
- Summary: 编写 `ApiTest.test_queryActivityInfo`：for 循环查询同一活动 id 十次，每次打印活动 JSON 并 `Thread.sleep(1200)` 保证库存定时任务变化；输出显示 `stock.used` 从 1 递增到 114（1、18、30、42、54、66、78、90、102、114），而 desc、name、startTime 等固定字段始终不变，进程以 exit code 0 结束。
- Key claims: 固定信息（活动描述/名称/时间）十次完全相同，印证享元缓存复用；库存 used 随时间任务持续变化，印证变化状态单独获取；测试中的 sleep 仅用于观察定时任务，实际开发不会有。
- Learner-relevant: 以真实运行结果作为"固定共享 + 变化外部"的证据锚点，可直接用于 /tackle 判断享元拆分效果。

### 六、总结 (享元)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]`
- Summary: 享元模式的设计重点是享元工厂：在有大量重复对象可复用的场景下，服务端减少接口调用、客户端减少内存占用；通过 map 结构用固定 id 存放和获取对象是关键点，且不仅享元模式，其他工厂、适配器、组合模式也可用 map 结构存放服务供外部获取，减少 ifelse 判断。同时指出缺点：复杂业务中不容易区分内部和外部状态（如活动信息与库存变化），拆分不好会把享元工厂设计得非常混乱、难以维护。
- Key claims: 优点＝服务端减接口调用、客户端减内存占用；通用手法＝map + 固定 id 存取对象、减少 ifelse；缺点＝内部/外部状态难区分时工厂易混乱难维护。
- Learner-relevant: 收束享元章节：把握"共享复用 + map 工厂"的适用边界与"状态难拆"的警示，为后续结构型模式（适配器、组合）中 map 用法的共性做铺垫。

### 一、开发环境 (代理)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一、开发环境]]`
- Summary: 明确第 7 节开发环境为 JDK 1.8、Idea + Maven、Spring 4.3.24.RELEASE；本节省去"一坨代码"工程，直接给一个工程 `itstack-demo-design-12-00`，描述为"模拟MyBatis开发中间件代理类部分"。
- Key claims: 工程编号 12 对应代理模式；代理章节直接以中间件实现为目标，无 ifelse 对照组。
- Learner-relevant: 调整预期——本节不是"坏代码→好代码"，而是从零实现一个 mybatis 式中间件核心。

### 二、代理模式介绍
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#二、代理模式介绍]]`
- Summary: 代理模式像"老大和小弟""分销商"，主要解决为某些资源的访问、对象类的易用操作上提供方便使用的代理服务；这种设计思想常见于系统与使用过的组件中，用非常简单的易用方式控制原本需要写很多代码才能使用的服务类。
- Key claims: 三个典型场景——1) 数据库访问层提供较基础的应用，减少应用服务扩容时数据库连接数暴增；2) 中间件如 RPC 框架，拿到 jar 包接口描述后服务启动时生成对应代理类，调用接口实际是通过代理类发 socket 信息；3) MyBatis 只定义接口不写实现类，即可对 xml 或自定义注解里的 sql 语句做增删改查。
- Learner-relevant: 建立"代理 = 给复杂服务提供简单可控入口"的意图锚点，秒懂 MyBatis 为什么能"只有接口也能跑"。

### 三、案例场景模拟
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]`
- Summary: 本案例模拟实现 mybatis-spring 中代理类生成部分：MyBatis 只需要定义接口不写实现类即可完成增删改查，本章通过实现一个这样的代理类交给 Spring 管理的核心过程来讲述代理模式；并说明此类案例在业务开发中不多见（是中间件开发思想），可作为 Spring bean 定义注册、代理与反射调用的入门。
- Key claims: 核心目标＝用代理类给接口生成实现类并交给 Spring 管理；涉及 Spring bean 定义注册、代理与反射调用知识。
- Learner-relevant: 明确"中间件视角的代理模式"学习路径，先看懂 MyBatis 魔法再动手实现。

### 四、代理类模式实现过程
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#四、代理类模式实现过程]]`
- Summary: 用代理类模式模拟 MyBatis 对类的代理过程——只定义接口，即可关联方法注解中的 sql 语句完成数据库操作；先提示三个前置知识点：`BeanDefinitionRegistryPostProcessor`（Spring 处理 bean 定义注册的接口）、`GenericBeanDefinition`（定义 bean 信息，mybatis-spring 中用的是略不同的 `ScannedGenericBeanDefinition`）、`FactoryBean`（处理 bean 工厂的类，非常常见）。
- Key claims: 代理章节的三大技术支点＝bean 定义注册处理器、bean 定义信息、工厂 bean；理解它们才能看懂后续注册与代理代码。
- Learner-relevant: 预热 Spring 中间件三件套，是阅读后续代码的前置知识清单。

#### 1. 工程结构 (代理版)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#1. 工程结构]]`
- Summary: 展示 `itstack-demo-design-12-00` 结构：`agent` 包下 `MapperFactoryBean.java`、`RegisterBeanFactory.java`、`Select.java`（自定义注解），`org.itstack.demo.design` 下 `IUserDao.java`（Dao 接口），resources 下 `spring-config.xml`，test 下 `ApiTest.java`。
- Key claims: 核心处理类全部抽在 `agent` 包，体现"中间件 + 功能使用"分离的组织方式。
- Learner-relevant: 建立"中间件实现（agent）与使用方（dao/配置/测试）"分层的工程视图。

#### 代理模式中间件模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代理模式中间件模型结构]]`
- Summary: 展示中间件模型：涉及的类不多但都是抽离出的核心处理类，主要工作是对类的代理和注册到 Spring 中；图中最上面是中间件的实现部分，下面对应的是功能的使用。
- Key claims: 模型核心＝"生成代理类 + 注册进 Spring 容器"两件事；实现层与使用层上下分离。
- Learner-relevant: 把握中间件模型整体骨架，先看"代理从哪来、注册到哪去"。

#### 2.1 自定义注解
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.1 自定义注解]]`
- Summary: 定义 `@Select` 注解，标注 `@Documented`、`@Retention(RetentionPolicy.RUNTIME)`、`@Target({ElementType.METHOD})`，含 `String value() default ""` 存放 sql 语句，模拟 mybatis-spring 中用在方法层面的自定义注解。
- Key claims: 注解必须 `RUNTIME` 保留期才能被反射读取；`@Target(METHOD)` 限定用在方法上；value 承载 sql 语句。
- Learner-relevant: 掌握"自定义注解 + 反射读取"的前置机制，是代理拦截方法时取 SQL 的入口。

#### 2.2 Dao层接口
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.2 Dao层接口]]`
- Summary: 定义 Dao 层接口 `IUserDao`，方法 `queryUserInfo(String uId)` 上标注 `@Select("select userName from user where id = #{uId}")`，与使用 mybatis 组件的方式一样——只定义接口、不写实现类。
- Key claims: 接口上以注解写 sql 语句，`#{uId}` 为占位符；这正是 mybatis 用户日常写法的模拟。
- Learner-relevant: 明确"我要代理的就是这个只有方法的接口"，为代理实现类提供目标类型。

#### 2.3 代理类定义
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.3 代理类定义]]`
- Summary: `MapperFactoryBean<T> implements FactoryBean<T>`：构造函数透传 `Class<T> mapperInterface`（mybatis 中同样透传）；`getObject()` 内定义 `InvocationHandler` 匿名类——调用方法时取 `Select` 注解并打印 `select.value().replace("#{uId}", args[0].toString())` 的 SQL，返回 `args[0] + ",小傅哥,bugstack.cn..."` 模拟查询结果，最后用 `Proxy.newProxyInstance(classLoader, new Class[]{mapperInterface}, handler)` 生成接口代理对象；`getObjectType()` 返回 mapperInterface，`isSingleton()` 返回 true。
- Key claims: 核心三方法——`getObject()` 用 JDK 动态代理生成接口实现并注入方法拦截逻辑；`getObjectType()` 声明对象类型；`isSingleton()` 声明单例；mybatis 源码中确有 `MapperFactoryBean` 同类。
- Learner-relevant: 这是代理模式的机制核心——`InvocationHandler` + `Proxy.newProxyInstance` 的 JDK 动态代理样板，是"接口无实现却可调用"的答案。

#### 2.4 将Bean定义注册到Spring容器
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.4 将Bean定义注册到Spring容器]]`
- Summary: `RegisterBeanFactory implements BeanDefinitionRegistryPostProcessor`，在 `postProcessBeanDefinitionRegistry` 中：new `GenericBeanDefinition` → `setBeanClass(MapperFactoryBean.class)` → `setScope("singleton")` → `addGenericArgumentValue(IUserDao.class)` 透传构造函数参数 → 用 `BeanDefinitionHolder`（bean 名 "userDao"）包裹 → `BeanDefinitionReaderUtils.registerBeanDefinition` 注册到容器（即 `DefaultListableBeanFactory`）；`postProcessBeanFactory` 留空。
- Key claims: 这是 Spring 中 bean 注册过程的源码演示；`GenericBeanDefinition` 定义 bean 基本信息和构造函数参数；注册后代理 bean 即被 Spring 容器管理，可方便获取。
- Learner-relevant: 掌握"BeanDefinitionRegistryPostProcessor 手工注册 bean"的中间件套路，理解代理对象如何进入容器供使用者注入。

#### 2.5 配置文件spring-config
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#2.5 配置文件spring-config]]`
- Summary: 提供 `spring-config.xml`，`default-autowire="byName"`，注册一个 `<bean id="userDao" class="org.itstack.demo.design.agent.RegisterBeanFactory"/>`，通过该 bean 触发后置处理器完成代理注册；并说明 mybatis 真实使用中一般配置扫描 dao 层包以减少这类配置。
- Key claims: 配置触发点是 `RegisterBeanFactory` 这个后置处理器；mybatis 用包扫描替代手写 bean 配置。
- Learner-relevant: 理解中间件如何被一行配置激活，以及真实 mybatis 的包扫描演进。

#### 3. 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#3. 测试验证]]`
- Summary: `test_IUserDao` 用 `ClassPathXmlApplicationContext("spring-config.xml")` 加载 BeanFactory，`getBean("userDao", IUserDao.class)` 取代理实例，调用 `queryUserInfo("100001")`；运行日志显示 `MapperFactoryBean - SQL: select userName from user where id = 100001`（从注解取值并做了 `#{uId}` 占位替换），测试结果返回 `100001,小傅哥,bugstack.cn - 沉淀、分享、成长，让自已和他人都能有所收获！`，exit code 0。
- Key claims: 全程没有写 `IUserDao` 实现类，却成功调用并返回结果，证明代理给接口生成了实现；注解中的 sql 被打印并简单适配了占位参数；mybatis 真实框架会把 sql 交给 `SqlSession` 实现类处理返回数据库数据，本例结果固定，可继续与数据库操作层关联完善。
- Learner-relevant: 以真实运行结果验证"接口无实现 + 代理生成 + 容器管理"闭环，是代理模式效果的直接证据锚点。

### 五、总结 (代理)
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#五、总结]]`
- Summary: 本章通过开发 mybatis-spring 中间件的部分核心功能体现代理模式的强大，涉及代理类创建与 Spring bean 注册等知识点，业务开发中少见但中间件开发中非常常见；代理模式除中间件外还可包装服务、物联网组件，让复杂服务变为轻量级调用与缓存使用，如同家里的电灯开关——不能直接操作 220V 电线但可用开关避免触电。
- Key claims: 代理模式让代码更整洁干净易于维护；虽然额外增加很多类、包括自己处理 bean 注册，但中间件复用性极高、更智能，可方便扩展到各个服务应用中；"开关 vs 220V 电线"类比＝代理隐藏复杂访问细节、提供安全简易入口。
- Learner-relevant: 收束代理章节：以"开关"类比理解代理价值，记住"代价是类更多、收益是复用与扩展"，为后续在 MyBatis/RPC 等框架中识别代理思想做伏笔。