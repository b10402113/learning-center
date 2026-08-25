---
subject: design-pattern
status: draft            # draft → confirmed
created: 2026-08-24
---

# ROADMAP — design-pattern

## Goal
面对一坨 ifelse 堆出来的业务代码，自己认出该用哪个设计模式并完成重构；同时，读到 Spring / MyBatis / 中间件源码时，能认出里面用到的模式。

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 心智模型 (mental model)
1. **[[learn/design-pattern/nodes/patterns-foundation|<模式思想与六大原则>]]**
   - Goal: 能说出设计模式解决什么问题、六大原则各自管什么，并能从一堆代码里指出"一坨代码"的坏味道在哪里
   - Sources:
     - [[sources/design-pattern/design_pattern.pdf]]
     - [[sources/design-pattern/design_pattern.pdf#工厂方法模式]]

### Tier 2 — 创建型 (creational)
2. **[[learn/design-pattern/nodes/factory-methods|<工厂方法与抽象工厂>]]**
   - Goal: 能用一个创建接口把 type 分发代码重构掉；能区分"单产品工厂"和"产品族工厂"，并讲清各自的适用场景
   - Sources:
     - [[sources/design-pattern/design_pattern.pdf#工厂方法模式]]
     - [[sources/design-pattern/design_pattern.pdf#抽象工厂模式]]

3. **[[learn/design-pattern/nodes/builder-prototype|<建造者与原型>]]**
   - Goal: 能用流式 Builder 组装复杂对象，能用 clone 复制模板对象，并讲清深拷贝/浅拷贝的坑
   - Sources:
     - [[sources/design-pattern/design_pattern.pdf#建造者模式]]
     - [[sources/design-pattern/design_pattern.pdf#原型模式]]

4. **[[learn/design-pattern/nodes/singleton|<单例模式>]]**
   - Goal: 能写出线程安全的单例，并能对比 7 种实现的取舍、说出每种该什么时候用
   - Sources:
     - [[sources/design-pattern/design_pattern.pdf#单例模式]]

### Tier 3 — 结构型 (structural)
5. **[[learn/design-pattern/nodes/adapter-facade|<适配器与外观>]]**
   - Goal: 能把不兼容的第三方接口统一成自己想要的形态；能判断该用适配器还是外观来包一层
   - Sources:
     - [[sources/design-pattern/design_pattern.pdf#适配器模式]]
     - [[sources/design-pattern/design_pattern.pdf#外观模式]]

6. **[[learn/design-pattern/nodes/bridge-composite|<桥接与组合>]]**
   - Goal: 能把嵌套 ifelse 的"双维度"组合拆成桥接；能用树结构组织部分-整体关系
   - Sources:
     - [[sources/design-pattern/design_pattern.pdf#桥接模式]]
     - [[sources/design-pattern/design_pattern.pdf#组合模式]]

7. **[[learn/design-pattern/nodes/decorator-proxy|<装饰器与代理>]]**
   - Goal: 能判断什么时候用装饰器加功能、什么时候用代理控制访问，并能认出框架里的装饰/代理结构
   - Sources:
     - [[sources/design-pattern/design_pattern.pdf#装饰器模式]]
     - [[sources/design-pattern/design_pattern.pdf#代理模式]]

8. **[[learn/design-pattern/nodes/flyweight|<享元模式>]]**
   - Goal: 能用享元缓存共享的固定数据、分离易变状态，减少重复创建的开销
   - Sources:
     - [[sources/design-pattern/design_pattern.pdf#享元模式]]

### Tier 4 — 行为型 (behavioral)
9. **[[learn/design-pattern/nodes/chain-command|<责任链与命令>]]**
   - Goal: 能把多级审批/请求流转拆成可动态编排的责任链；能把请求封装成命令对象交给调用方
   - Sources:
     - [[sources/design-pattern/design_pattern.pdf#责任链模式]]
     - [[sources/design-pattern/design_pattern.pdf#命令模式]]

10. **[[learn/design-pattern/nodes/iterator-mediator|<迭代器与中介者>]]**
    - Goal: 能理解 JDK 迭代器的机制并给自定义结构写遍历；能用中介者把复杂子系统（如 JDBC）包成简单服务
    - Sources:
      - [[sources/design-pattern/design_pattern.pdf#迭代器模式]]
      - [[sources/design-pattern/design_pattern.pdf#中介者模式]]

11. **[[learn/design-pattern/nodes/memento-observer|<备忘录与观察者>]]**
    - Goal: 能实现配置/状态的保存与回滚；能把核心流程里的旁路通知拆成可订阅的观察者
    - Sources:
      - [[sources/design-pattern/design_pattern.pdf#备忘录模式]]
      - [[sources/design-pattern/design_pattern.pdf#观察者模式]]

12. **[[learn/design-pattern/nodes/state-strategy|<状态与策略>]]**
    - Goal: 能把状态流转拆成状态机（enum+map 分发）；能用策略族替代同类的 ifelse 算法分支
    - Sources:
      - [[sources/design-pattern/design_pattern.pdf#状态模式]]
      - [[sources/design-pattern/design_pattern.pdf#策略模式]]

13. **[[learn/design-pattern/nodes/template-visitor|<模板方法与访问者>]]**
    - Goal: 能把固定流程的骨架抽成模板方法；能用双分派让同一数据结构在不同视角下呈现
    - Sources:
      - [[sources/design-pattern/design_pattern.pdf#模板模式]]
      - [[sources/design-pattern/design_pattern.pdf#访问者模式]]

## Status
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written