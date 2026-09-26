---
source: 小哲八股-Spring全家族
source_type: codebase
source_lines: 2564
language: markdown
file_count: 40
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — Spring全家族（Spring/SpringBoot/SpringCloud/Mybatis/DDD）

## Overview (L1)

- **Spring 核心与容器（IoC/DI）** — 第 1–2、15 题：Spring 是管理 Bean 的容器，通过 IoC 将对象创建权反转给容器、以 DI 注入依赖；辨析 BeanFactory（容器顶层接口）与 FactoryBean（生产复杂对象的特殊 Bean，取工厂本身要加 `&`）。
- **Bean 生命周期与作用域** — 第 3–6、19 题：核心流程“实例化 → 属性赋值 → 初始化 → 销毁”；Singleton（默认）与 Prototype、Web 作用域；单例线程安全取决于是否有可修改成员变量；循环依赖靠三级缓存提前暴露半成品/代理。
- **AOP 与 Web 层** — 第 7–9、13、16 题：AOP 抽取横切逻辑、底层 JDK 动态代理/CGLIB；过滤器（Servlet 容器）vs 拦截器（Spring MVC）；Spring MVC 前端控制器 + HandlerMapping/HandlerAdapter/ViewResolver 流程；Spring 中的设计模式。
- **事务管理** — 第 10–12 题：声明式事务基于 AOP；传播行为 REQUIRED/REQUIRES_NEW/NESTED；默认只对 RuntimeException/Error 回滚；失效场景（自调用、异常被吞、类型不符、修饰符不对）。
- **Spring Boot** — 第 14、17–18、20 题：约定优于配置、起步依赖、内嵌 Tomcat；自动配置 = SPI 加载 + @Conditional 筛选；自定义 Starter；Spring Task 基于 @Scheduled + ScheduledAnnotationBeanPostProcessor，默认单线程。
- **Spring Cloud 微服务** — 8 个文件：微服务拆分与治理；五大组件（注册中心/负载均衡与调用/断路器/网关/配置中心）从 Netflix 到 Alibaba 的迭代；网关对比、Dubbo vs Feign、负载均衡策略、限流熔断降级、限流算法、Eureka vs Nacos。
- **MyBatis 持久层** — 7 个文件：半自动 ORM、SQL 可控；`#{}` 预编译防注入 vs `${}` 拼接；四大组件插件机制（JDK 动态代理 + 责任链）；一二级缓存；动态 SQL；分页三方式；MyBatis-Plus 增强。
- **DDD 领域驱动设计** — 5 个文件：业务驱动的建模方法论，战略设计（限界上下文、通用语言、子域划分）+ 战术设计（实体/值对象/聚合/聚合根/领域服务），充血模型取代贫血模型。

## Sections (L2)

### 1.什么是Spring框架
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/1.什么是Spring框架.md#1.什么是Spring框架]]`
- Summary: 从核心维度、两大基石（IoC/AOP）、生态演进三个层面定义 Spring，并给出面试答法。
- Key claims: Spring 本质是管理 Bean 的非侵入式容器；IoC 解耦对象创建、AOP 解耦横切逻辑；已衍生 Boot/Cloud/Security 全家桶。
- Learner-relevant: 全家族的总纲，支撑“IoC 与 AOP 是 Spring 两大基石”这一根锚点。

### 2.如何理解IOC
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/2.如何理解IOC.md#2.如何理解IOC]]`
- Summary: 澄清“谁控制谁、反转了什么”，辨析 IoC 与 DI 的关系（思想 vs 手段）。
- Key claims: 反转的是对象的创建权与依赖维护权；IoC 是理论、DI 是实践；目的就是解耦。
- Learner-relevant: 容器思想的入门锚点，衔接 Bean 作用域与生命周期。

### 3.Bean的作用域有哪些
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/3.Bean的作用域有哪些.md#3.Bean的作用域有哪些]]`
- Summary: 讲解 Singleton/Prototype 两个核心作用域与 Request/Session/Application 三个 Web 专用作用域。
- Key claims: Singleton 默认且与容器同生共死；Prototype 只负责创建不负责销毁；Web 作用域仅 WebApplicationContext 可用。
- Learner-relevant: 理解单例共享为何需要关注线程安全（承接第 5 题）。

### 4.Bean的生命周期是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/4.Bean的生命周期是怎样的.md#4.Bean的生命周期是怎样的]]`
- Summary: 把复杂源码拆成实例化、属性赋值、初始化、销毁四阶段，突出初始化中的扩展点。
- Key claims: 初始化阶段依次做 Aware 检查、BeanPostProcessor 前置/后置；AOP 代理发生在 postProcessAfterInitialization；销毁执行 DisposableBean/destroy-method。
- Learner-relevant: 循环依赖与 AOP 代理时机的底层背景。

### 5.单例Bean的线程安全如何理解
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/5.单例Bean的线程安全如何理解.md#5.单例Bean的线程安全如何理解]]`
- Summary: 用有无状态区分单例 Bean 的线程安全性，并给出三种解决方案。
- Key claims: Spring 不对单例 Bean 做线程安全封装；无状态 Bean（Controller/Service/Dao）天然安全；有状态可改成员变量则危险，可用 ThreadLocal/原子类/改多例解决。
- Learner-relevant: 与第 19 题“并发访问单例 Controller”同一主题，可交叉引用。

### 6.单例Bean的循环依赖问题是如何解决的
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/6.单例Bean的循环依赖问题是如何解决的.md#6.单例Bean的循环依赖问题是如何解决的]]`
- Summary: 详解三级缓存结构与 A/B 循环依赖的逐步解决流程，并说明为何需要三级而非两级。
- Key claims: 仅能解决单例 + Setter/字段注入；三级缓存存 ObjectFactory 以处理 AOP 代理；构造器注入无法解决，可用 @Lazy 或改 Setter。
- Learner-relevant: 生命周期与 AOP 代理机制的综合应用点。

### 7.什么是AOP_有什么应用场景_
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/7.什么是AOP_有什么应用场景_.md#7.什么是AOP?有什么应用场景?]]`
- Summary: 用 OOP 局限与 AOP 横向抽取对比说明切面思想，并列出典型场景。
- Key claims: AOP 是 OOP 的补充，抽取横切关注点；通过动态代理织入；场景含日志监控、声明式事务、权限控制。
- Learner-relevant: AOP 概念的入门锚点，衔接其实现原理。

### 8.AOP的实现原理是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/8.AOP的实现原理是怎样的.md#8.AOP的实现原理是怎样的]]`
- Summary: 对比 JDK 动态代理与 CGLIB 的适用条件、原理与局限，并说明 Spring 的选择策略。
- Key claims: JDK 代理要求实现接口、基于 InvocationHandler；CGLIB 基于继承、无法代理 final；Spring Boot 2.x 后默认强制 CGLIB。
- Learner-relevant: 声明式事务失效、MyBatis 插件等“代理”主题的公共底层。

### 9.拦截器和过滤器有什么区别
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/9.拦截器和过滤器有什么区别.md#9.拦截器和过滤器有什么区别]]`
- Summary: 以“进公司办事”类比区分 Filter（Servlet 容器）与 Interceptor（Spring MVC）。
- Key claims: Filter 在 DispatcherServlet 之前、基于回调、难注入 Bean；Interceptor 在 DispatcherServlet 到 Controller 之间、基于反射、支持 @Autowired。
- Learner-relevant: Web 请求链路与 Spring MVC 流程的边界认知。

### 10.Spring的事务管理是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/10.Spring的事务管理是怎样的.md#10.Spring的事务管理是怎样的]]`
- Summary: 对比编程式与声明式事务，说明 @Transactional 的 AOP 原理及关注属性。
- Key claims: 声明式事务基于 AOP 代理自动开启/提交/回滚；核心配置为传播行为、隔离级别、回滚规则；默认只对 RuntimeException 回滚。
- Learner-relevant: 事务主题的总纲，承接失效场景与传播规则。

### 11.声明式事务什么情况会失效
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/11.声明式事务什么情况会失效.md#11.声明式事务什么情况会失效]]`
- Summary: 归纳自调用、异常被吞、异常类型不符、修饰符不对四类失效场景及解法。
- Key claims: 失效本质是绕过 AOP 代理或异常处理不当；Checked Exception 需 rollbackFor；private/final/static 方法无法被代理增强。
- Learner-relevant: 把 AOP 动态代理知识落到实战踩坑。

### 12.事务的传播规则是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/12.事务的传播规则是怎样的.md#12.事务的传播规则是怎样的]]`
- Summary: 重点讲 REQUIRED/REQUIRES_NEW/NESTED，其余四种一笔带过。
- Key claims: REQUIRED 默认合并同一物理事务、一起回滚；REQUIRES_NEW 挂起当前事务、内外隔离（适合日志）；NESTED 用保存点，子回滚不影响父、父回滚子随行。
- Learner-relevant: 业务方法互相调用时的事务边界判断。

### 13.SpringMVC怎么理解
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/13.SpringMVC怎么理解.md#13.SpringMVC怎么理解]]`
- Summary: 介绍前端控制器模式下的一个核心调度器 + 四个辅助组件与标准请求流程。
- Key claims: DispatcherServlet 统一入口；HandlerMapping 映射、HandlerAdapter 统一调用、ViewResolver 解析视图；流程为分发→查找→执行→解析→渲染。
- Learner-relevant: 拦截器/过滤器与 Web 请求处理链路的框架背景。

### 14.SpringBoot对比Spring有何区别
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/14.SpringBoot对比Spring有何区别.md#14.SpringBoot对比Spring有何区别]]`
- Summary: 从配置、依赖管理、运行模式三方面对比 Spring 与 Spring Boot。
- Key claims: Boot 采用约定优于配置的自动配置；起步依赖统一版本；内嵌 Tomcat 打可执行 JAR。
- Learner-relevant: 引入 Spring Boot 模块，衔接自动配置与 Starter。

### 15.BeanFactory和FactroyBean的关系
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/15.BeanFactory和FactroyBean的关系.md#15.BeanFactory和FactroyBean的关系]]`
- Summary: 辨析容器顶层接口 BeanFactory 与扩展接口 FactoryBean 的定位、作用与获取方式。
- Key claims: BeanFactory 是基础设施/容器；FactoryBean 是生产复杂对象的特殊 Bean；`getBean("x")` 取产品、`getBean("&x")` 取工厂本身。
- Learner-relevant: 名称易混的两个核心接口，属 IoC 容器认知的一部分。

### 16.Spring中用到了哪些设计模式
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/16.Spring中用到了哪些设计模式.md#16.Spring中用到了哪些设计模式]]`
- Summary: 按“创建-结构-行为”梳理 Spring 中六种典型设计模式及其体现。
- Key claims: 工厂（BeanFactory）、代理（AOP）、单例（默认作用域）、模板方法（JdbcTemplate/RestTemplate）、适配器（HandlerAdapter）、观察者（Spring Event）。
- Learner-relevant: 把前面各知识点串成设计模式视角的复习线。

### 17.Springboot是如何实现自动配置的
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/17.Springboot是如何实现自动配置的.md#17.Springboot是如何实现自动配置的]]`
- Summary: 用“SPI 加载 + @Conditional 筛选”三步解释自动配置原理。
- Key claims: @EnableAutoConfiguration 经 @Import 引入 AutoConfigurationImportSelector；读取 META-INF/spring.factories 得候选配置类；@ConditionalOnClass/@ConditionalOnMissingBean 按类路径与已有 Bean 决定是否生效。
- Learner-relevant: Spring Boot 最核心面试点，与 Starter 互为表里。

### 18.Springboot的starter是什么_有什么应用场景
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/18.Springboot的starter是什么_有什么应用场景.md#18.Springboot的starter是什么?有什么应用场景]]`
- Summary: 说明 Starter 是依赖聚合（“套餐”/BOM），并列举官方与自定义 Starter 场景。
- Key claims: Starter 的 pom 只有 dependencies、无 Java 代码；实现依赖聚合与版本锁定；自定义场景如统一日志、鉴权、短信 Starter。
- Learner-relevant: 与自动配置共同构成 Spring Boot 的两大简化机制。

### 19.Spring框架有多线程吗（比如同一个controller被多个用户同时访问）？底层原理是怎样的？
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/19.Spring框架有多线程吗（比如同一个controller被多个用户同时访问）？底层原理是怎样的？.md#19.Spring框架有多线程吗（比如同一个controller被多个用户同时访问）？底层原理是怎样的？]]`
- Summary: 澄清请求线程由 Web 容器线程池创建，多个线程并发访问单例 Controller。
- Key claims: Tomcat 从线程池分配线程处理请求；Controller/Service 默认单例、堆中仅一份；靠“无状态”设计保证安全。
- Learner-relevant: 单例线程安全话题的并发视角补充（与第 5 题互参）。

### 20.SpringTask是什么？实现原理是怎样的？
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Spring_SpringBoot/20.SpringTask是什么？实现原理是怎样的？.md#20.SpringTask是什么？实现原理是怎样的？]]`
- Summary: 介绍轻量级定时任务 @Scheduled 的扫描注册与调度执行两阶段原理。
- Key claims: @EnableScheduling 注册 ScheduledAnnotationBeanPostProcessor 扫描 @Scheduled；任务交 TaskScheduler，底层 JDK ScheduledExecutorService；默认单线程，任务会互相阻塞，生产需自定义线程池。
- Learner-relevant: 结合 BeanPostProcessor 扩展点，展示生命周期机制的实际应用。

### 1.怎么理解微服务
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/SpringCloud/1.怎么理解微服务.md#1.怎么理解微服务]]`
- Summary: 用“大排档 vs 美食城”类比讲单体到微服务的演进及 Spring Cloud 的治理角色。
- Key claims: 微服务按业务领域拆分、独立进程/部署/扩展；带来分布式复杂性；Spring Cloud 提供注册、RPC、熔断、网关等治理工具。
- Learner-relevant: 微服务模块总纲，解释 Spring Cloud 存在的意义。

### 2.什么是SpringCloud_有哪些组件_
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/SpringCloud/2.什么是SpringCloud_有哪些组件_.md#2.什么是SpringCloud?有哪些组件?]]`
- Summary: 按“五大件”梳理注册中心、负载均衡与调用、断路器、网关、配置中心，并对比新旧组件。
- Key claims: Eureka/Hystrix/Zuul/Ribbon 为经典一代；Nacos/Sentinel/Gateway/OpenFeign/Spring Cloud LoadBalancer 为主流一代；Nacos 兼具注册与配置中心。
- Learner-relevant: Spring Cloud 全景索引，其余文件均可挂到五大件下。

### 3.ZuulGateway和Nginx有什么区别
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/SpringCloud/3.ZuulGateway和Nginx有什么区别.md#3.ZuulGateway和Nginx有什么区别]]`
- Summary: 区分流量网关（Nginx）与业务网关（Zuul/Gateway），并对比 Zuul 与 Gateway 的 I/O 模型。
- Key claims: Nginx 为 C 语言流量网关、性能极强；Zuul 基于 Servlet/BIO 阻塞模型；Gateway 基于 WebFlux/Netty 的 NIO 响应式模型。
- Learner-relevant: 网关组件的选型与原理认知。

### 4.Dubbo和Feign有什么区别
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/SpringCloud/4.Dubbo和Feign有什么区别.md#4.Dubbo和Feign有什么区别]]`
- Summary: 从通信协议与生态定位对比 Dubbo（TCP/Hessian2）与 Feign（HTTP/JSON）。
- Key claims: Dubbo 长连接、二进制序列化、完整服务治理框架；Feign 基于 HTTP、JSON 文本、只是声明式客户端组件，需其他组件配合。
- Learner-relevant: 远程调用组件的横向对比。

### 5.常见的负载均衡策略有哪些
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/SpringCloud/5.常见的负载均衡策略有哪些.md#5.常见的负载均衡策略有哪些]]`
- Summary: 介绍轮询、加权轮询、IP 哈希、最小连接数、一致性哈希五种策略及场景。
- Key claims: 加权轮询生产最常用；IP 哈希解决 Session 共享；最小连接数为动态策略适合耗时差异大；一致性哈希减少节点故障的重哈希范围。
- Learner-relevant: 负载均衡与限流/熔断共同构成流量治理主题。

### 6.如何理解限流熔断和降级
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/SpringCloud/6.如何理解限流熔断和降级.md#6.如何理解限流熔断和降级]]`
- Summary: 用“预防/止损/兜底”区分限流、熔断、降级三者的分工与场景。
- Key claims: 限流限制入口流量（令牌桶/漏桶）；熔断在错误率超阈值时快速失败，有打开/关闭/半开三态；降级提供 Plan B，可被动也可主动。
- Learner-relevant: 微服务高可用“三板斧”的概念锚点。

### 7.Eureka和Nacos的区别是什么
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/SpringCloud/7.Eureka和Nacos的区别是什么.md#7.Eureka和Nacos的区别是什么]]`
- Summary: 从 CAP 取舍、功能覆盖面、通信机制三方面对比 Eureka 与 Nacos。
- Key claims: Eureka 仅 AP、纯注册中心、短轮询；Nacos 支持 AP/CP 切换（Raft）、注册+配置二合一、推拉结合实时性更强。
- Learner-relevant: 注册中心组件选型的核心对比题。

### 8.常见的限流算法有哪些
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/SpringCloud/8.常见的限流算法有哪些.md#8.常见的限流算法有哪些]]`
- Summary: 讲解固定窗口、滑动窗口、漏桶、令牌桶四种限流算法的原理与缺陷。
- Key claims: 固定窗口有临界突刺问题；滑动窗口是 Sentinel 默认统计模式；漏桶强行削峰、匀速出；令牌桶允许突发流量、Gateway 默认基于 Redis 令牌桶。
- Learner-relevant: 限流概念背后的算法实现细节。

### 1.什么是Mybatis_什么是ORM框架_
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Mybatis/1.什么是Mybatis_什么是ORM框架_.md#1.什么是Mybatis?什么是ORM框架?]]`
- Summary: 介绍 ORM 的映射作用与 MyBatis 作为“半自动化 ORM 框架”的定位。
- Key claims: ORM 建立 Java 对象与数据库表的映射、免写 JDBC；MyBatis 只做参数/结果映射、SQL 仍手写，换来 SQL 可控与可优化。
- Learner-relevant: MyBatis 模块入口，对比 Hibernate 的自动化程度。

### 2.#和$的区别是什么？什么情况必须用$
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Mybatis/2.#和$的区别是什么？什么情况必须用$.md#2.#和$的区别是什么？什么情况必须用$]]`
- Summary: 对比 `#{}` 预编译占位与 `${}` 字符串替换的处理机制和安全性。
- Key claims: `#{}` 替换为 JDBC `?` 并 setXxx、可防 SQL 注入；`${}` 直接拼接不加引号、有注入风险；查询参数绝大多数用 `#{}`。
- Learner-relevant: MyBatis 安全与参数绑定的核心考点。

### 3.Mybatis插件是什么？运行原理是怎样的？
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Mybatis/3.Mybatis插件是什么？运行原理是怎样的？.md#3.Mybatis插件是什么？运行原理是怎样的？]]`
- Summary: 说明 MyBatis 插件是拦截器，基于 JDK 动态代理 + 责任链包裹四大核心组件。
- Key claims: 可拦截 Executor/StatementHandler/ParameterHandler/ResultSetHandler；PageHelper 拦截 StatementHandler 改 SQL 加 LIMIT；pluginAll + Proxy 生成“代理的代理”。
- Learner-relevant: 分页实现与插件机制的公共底层。

### 4.Mybatis的缓存机制是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Mybatis/4.Mybatis的缓存机制是怎样的.md#4.Mybatis的缓存机制是怎样的]]`
- Summary: 讲解一级（SqlSession）与二级（Mapper/Namespace）缓存的范围、流程与局限。
- Key claims: 一级缓存默认开启、增删改或 commit/close 即清空；二级缓存默认关闭、跨 Session 共享；基于 Namespace 隔离多表查询会脏读，故生产中很少用。
- Learner-relevant: 持久层缓存与数据一致性的权衡。

### 5.Mybatis的动态SQL是怎样的
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Mybatis/5.Mybatis的动态SQL是怎样的.md#5.Mybatis的动态SQL是怎样的]]`
- Summary: 归纳 if/choose、where/set、foreach 四类动态 SQL 标签及用途。
- Key claims: if 做条件拼接；choose/when/otherwise 类似 switch；where 智能去开头 AND/OR、set 去尾部逗号；foreach 处理 IN 查询与批量插入。
- Learner-relevant: XML 层条件拼装的实践技能。

### 6.Mybatis如何实现分页查询
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Mybatis/6.Mybatis如何实现分页查询.md#6.Mybatis如何实现分页查询]]`
- Summary: 对比 RowBounds 逻辑分页、手写 SQL 物理分页、插件分页三种方式。
- Key claims: RowBounds 全量查询有 OOM 风险；手写 LIMIT 性能最好但方言耦合；PageHelper/MyBatis-Plus 基于拦截器自动加 LIMIT 并 COUNT，是标准方案。
- Learner-relevant: 与插件机制互相印证的分页实战题。

### 7.Mybatis-Plus是什么
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/Mybatis/7.Mybatis-Plus是什么.md#7.Mybatis-Plus是什么]]`
- Summary: 介绍 MP“只做增强不做改变”的定位、通用 CRUD 与条件构造器。
- Key claims: 继承 BaseMapper 即得 17 个通用单表方法、无需 XML；QueryWrapper/LambdaQueryWrapper 链式构造条件、Lambda 引用字段防拼写错误；内置分页等插件。
- Learner-relevant: MyBatis 生态的效率增强工具，与分页插件呼应。

### 1.什么是DDD
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/DDD/1.什么是DDD.md#1.什么是DDD]]`
- Summary: 从战略设计（限界上下文、通用语言）与战术设计（实体/值对象/聚合/领域服务）概述 DDD。
- Key claims: DDD 是“先业务后技术”的方法论；限界上下文解决业务边界；充血模型拒绝贫血、让对象自己管业务逻辑。
- Learner-relevant: DDD 模块总纲，衔接贫血/充血模型与聚合。

### 2.一个例子理解DDD
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/DDD/2.一个例子理解DDD.md#2.一个例子理解DDD]]`
- Summary: 以下单系统为例，从 CRUD 写法重写为将 pay/cancel 规则内聚到 Order 的充血设计。
- Key claims: 业务规则应待在“最懂业务的对象”里；Service 只做协调；DDD 降低变更成本、天然适合按领域边界拆微服务。
- Learner-relevant: 用具体代码对照理解贫血/充血模型。

### 3.什么是贫血模型_什么是充血模型_
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/DDD/3.什么是贫血模型_什么是充血模型_.md#3.什么是贫血模型?什么是充血模型?]]`
- Summary: 用“钱包”例子对比贫血（数据归对象、逻辑归 Service）与充血（数据与行为绑定）两种模型。
- Key claims: 贫血模型是披着 OO 外衣的面向过程、易致 Service 臃肿；充血模型逻辑内聚、Service 变薄，是真正的面向对象。
- Learner-relevant: DDD 战术设计的核心辨析。

### 4.什么是聚合？什么是聚合根？
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/DDD/4.什么是聚合？什么是聚合根？.md#4.什么是聚合？什么是聚合根？]]`
- Summary: 以订单/订单项解释聚合是一致性边界、聚合根是外部唯一入口。
- Key claims: 聚合内对象同生共死、修改须同一事务；只有聚合根拥有全局唯一 ID、外界只能引用聚合根；由聚合根统一执行业务检查。
- Learner-relevant: DDD 一致性边界的核心概念。

### 5.如何进行领域划分
- Locator: `[[sources/小哲讲八股/20260926/Java面试题/DDD/5.如何进行领域划分.md#5.如何进行领域划分]]`
- Summary: 讲解战略层按核心域/支撑域/通用域划分，战术层用事件风暴确定限界上下文。
- Key claims: 核心域自研重投、支撑域普通团队、通用域拿来主义；事件风暴梳理领域事件圈出限界上下文；理想为一子域=一上下文=一微服务。
- Learner-relevant: 连接 DDD 与微服务拆分边界的落地方法。
