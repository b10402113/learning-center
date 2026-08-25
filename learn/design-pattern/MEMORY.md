---
subject: design-pattern
language: zh-CN
created: 2026-08-24
updated: 2026-08-24
---

# MEMORY — design-pattern

## Goal

学完之后要能：**面对一坨 ifelse 堆出来的业务代码，自己认出该用哪个设计模式并完成重构；同时，读到 Spring / MyBatis / 中间件源码时，能认出里面用到的模式**。

## Why

受够了又臭又长的业务代码。自己在开发中真实写过 switch/ifelse 按 type 字段分发的代码，每来一个需求就往上堆分支，越来越难维护。想从根上掌握如何拆解这类结构，而不是继续"打补丁"。

## Prior experience

- 多年 Java + Spring Boot 经验，日常写 CRUD 接口
- 从未系统学过设计模式，只按名字听说过，没研究过结构
- OOP 基础扎实（继承、接口、多态都用得很熟），不需要补语言基础
- 用过 MyBatis mapper、Spring AOP/拦截器、Redis，但没读过框架源码内部实现

## Anchors

- **多第三方集成的适配代码**：一个 Controller/service 对接多个第三方集成，各家接口入参返回形态都不一样——这是全书过半模式能挂靠的真实例子（工厂方法、适配器、外观、中介者、策略都用得上）
- **type 字段分发的业务 service**：switch/ifelse 按类型字段分派到不同实现——桥梁、状态、策略、责任链的天然锚点
- 日常用 `new ArrayList`、`new BufferedReader` 等 JDK 结构，能借此体会装饰器/迭代器等
- 用过 Spring 容器和 MyBatis，读源码时会对代理、中介者、模板方法产生"原来如此"的共鸣

## Habits & constraints

- 每周 3-5 小时，主要集中在周末，较长且专注的学习时段
- 在电脑前、有代码环境时学习；不是碎片时间型
- 环境：JDK 8 + IDEA + Maven（与书中一致），可直接跑书中代码

## Knowledge type

Procedural（程序性/动手型）主导。每个模式都要"先做后学"：先看 ifelse 烂代码，再做模式重构。声明性知识（意图、角色、取舍）通过动手重构的过程来沉淀，而不是先背概念。

## How to teach me

- **动手写代码**：必须亲手输入/运行代码才记得住；只看不敲等于没学
- 先看到"烂代码 → 重构后代码"的对比，结构上的差异会直接让概念"咔哒"一声
- 不要玩具例子——要能跟自己的真实工作（多第三方集成、type 分发）对得上
- 22 个模式要均匀深度，不要因为"偏门"就跳过（访问者、迭代器、享元也要认真学）
- 用中文写作