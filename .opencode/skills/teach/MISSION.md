# Mission: 掌握设计模式——从 ifelse 重构到框架源码识别

## Why

面对一坨 ifelse 堆出来的业务代码，能认出该用哪个设计模式并完成重构；读 Spring / MyBatis / 中间件源码时，能认出里面用到的模式。

## Success looks like
- 看到 switch/ifelse 按 type 字段分发的代码，能判断该用工厂、策略、状态还是责任链，并动手重构
- 读到 Spring AOP、MyBatis Mapper 等框架代码时，能认出代理、模板方法、中介者等模式结构
- 22 个模式都能说出动机、角色、适用场景和取舍

## Constraints
- 以中文教学
- JDK 8 + IDEA + Maven 环境，可直接跑代码
- 每周 3-5 小时，集中在周末
- 动手写代码为主，先看烂代码再做重构

## Out of scope
- 纯 UML 建模语法
- 模式的历史学术源流（Alexander、GoF 原著逐章精读）
- 非 Java 语言的模式实现
