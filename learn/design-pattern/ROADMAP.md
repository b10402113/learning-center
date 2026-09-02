---
subject: design-pattern
status: draft
path: problem-driven
created: 2026-09-01
---

# ROADMAP — design-pattern

## Goal
在架構師/資深崗面試或晉升評審中，能講清楚設計模式的**權衡與適用邊界**：不只說得出某個模式的意圖和結構，還要能在「何時用、為何用、何時不該用、與相似模式怎麼選」這些層面講出深度。

## Learning path
**問題驅動（problem-driven）**：以一個實際後端開發者會撞上的問題為單位組織材料，而不是按 GoF 分類。每個節點 = 一個問題（「ifelse 怎麼拆」「對象怎麼來」「接口對不上怎麼辦」…），節點內的模式步驟共享這個問題的回答；節點之間從「怎麼判斷好代碼」的心智模型出發，先拆最痛的 ifelse 分支，再走對象創建、接口對齊、擴展共享、協作解耦、狀態回溯，最後收在面試必問的「相似模式怎麼選」。

這樣組織的理由：你的目標是「講得出權衡與選型」，而選型恰恰發生在**相似模式之間**——把處理同一類問題的模式放進同一層，比孤立的意圖背誦更能逼出比較。每個模式仍保有完整的一節（場景 → 一坨代碼 → 重構 → 總結），所以面試要的「逐模式講清意圖/結構/適用邊界」不丟；層次則按「問題」而非「創建/結構/行為」重新排列，讓最痛的切膚之痛（ifelse）先行。

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe design-pattern/<node-id>` to measure a node, then `/nodes design-pattern/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 心智模型：怎麼判斷好代碼
1. **[[learn/design-pattern/nodes/design-pattern-basics|設計模式與六大原則]]**
   - Goal: 用六大原則建立「好代碼」的判斷基準，能說出設計模式解決什麼問題、何時該用
   - Sources:
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#⽬目录]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 开篇与设计模式观]]

### Tier 2 — 行為選擇：ifelse 怎麼拆
2. **[[learn/design-pattern/nodes/strategy|策略模式]]**
   - Goal: 講清策略模式「算法族互換」的意圖，用優惠券計算場景拆掉 ifelse，並能說出與命令/適配器/組合的結構相似而思路不同
   - Sources:
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式介绍]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式案例场景模拟]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#策略控制类]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式总结]]
3. **[[learn/design-pattern/nodes/state|狀態模式]]**
   - Goal: 講清狀態模式「狀態驅動行為」的意圖，用審核狀態流轉場景拆掉 ifelse
   - Sources:
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#二、状态模式介绍]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#五、状态模式重构代码]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]
4. **[[learn/design-pattern/nodes/chain-of-responsibility|責任鏈模式]]**
   - Goal: 講清責任鏈「多級處理鏈動態編排」的意圖，用 618 審批場景重構 ifelse
   - Sources:
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#二、责任链模式介绍]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#五、责任链模式重构代码]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]
5. **[[learn/design-pattern/nodes/template-method|模板方法模式]]**
   - Goal: 講清模板方法「固定骨架、子類填步驟」的意圖，用爬蟲→海報場景控制執行順序
   - Sources:
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#模板模式介绍]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#模板模式案例场景模拟]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#定义执行顺序的抽象类]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#模板模式总结]]
6. **[[learn/design-pattern/nodes/command|命令模式]]**
   - Goal: 講清命令模式「請求封裝成對象、解耦請求與實現」的意圖，用點單→烹飪場景
   - Sources:
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式介绍]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-案例场景模拟]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-代码实现]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-总结]]

### Tier 3 — 對象創建：怎麼 new、怎麼省成本
7. **[[learn/design-pattern/nodes/singleton|單例模式]]**
   - Goal: 講清 7 種單例寫法的線程安全與懶載入取捨，能說出何時不該用單例
   - Sources:
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 单例模式介绍]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 7种单例模式实现]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 双重锁校验]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: Effective Java 作者推荐的枚举单例]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Singleton: 总结]]
8. **[[learn/design-pattern/nodes/factory-method|工廠方法模式]]**
   - Goal: 講清工廠方法「統一創建入口、屏蔽實現」的意圖，用發獎多商品場景拆 ifelse
   - Sources:
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#二、⼯⼚⼚⽅方法模式介绍]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#三、模拟发奖多种商品]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#五、⼯工⼚厂模式优化代码]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]
9. **[[learn/design-pattern/nodes/abstract-factory|抽象工廠模式]]**
   - Goal: 講清抽象工廠「產品族接口統一」的意圖，用 Redis 雙集群平滑升級場景
   - Sources:
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#二、抽象工厂模式介绍]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#五、抽象工厂模式重构代码]]
     - [[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]
10. **[[learn/design-pattern/nodes/builder|建造者模式]]**
    - Goal: 講清建造者「複雜對象分步構建、與表示分離」的意圖，用裝修套餐場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#建造者模式介绍]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#案例场景模拟]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#装修包接口]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#建造者方法]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]
11. **[[learn/design-pattern/nodes/prototype|原型模式]]**
    - Goal: 講清原型「克隆複製、省創建成本」的意圖，用試卷混排場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-intro]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-scenario]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#ch4-refactor]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#原型模式模型结构]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]

### Tier 4 — 接口對齊與統一出口
12. **[[learn/design-pattern/nodes/adapter|適配器模式]]**
    - Goal: 講清適配器「異構接口統一輸出」的意圖，用多 MQ 消息體場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 适配器模式介绍]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 案例场景模拟]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 适配器模式重构代码]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 总结]]
13. **[[learn/design-pattern/nodes/bridge|橋接模式]]**
    - Goal: 講清橋接「抽象與實現分離、多維度獨立變化」的意圖，用支付渠道×支付模式場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#场景模拟工程]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#场景简述]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#ifelse实现需求]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#桥接模式模型结构]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]
14. **[[learn/design-pattern/nodes/facade|外觀模式]]**
    - Goal: 講清外觀「複雜子系統統一門面」的意圖，用白名單中間件場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-intro]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-scenario]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-plain-implement]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-refactor]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#facade-summary]]
15. **[[learn/design-pattern/nodes/proxy|代理模式]]**
    - Goal: 講清代理「不寫實現類也能調用、攔截增強」的意圖，用 MyBatis mapper 中間件場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#二、代理模式介绍]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#四、代理类模式实现过程]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#代理模式中间件模型结构]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#五、总结]]

### Tier 5 — 擴展與共享
16. **[[learn/design-pattern/nodes/decorator|裝飾器模式]]**
    - Goal: 講清裝飾器「不改原類疊加功能」的意圖，用 SSO 校驗場景，能說出與繼承、AOP 的取捨
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-intro]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-scenario]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-plain-implement]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-refactor]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#decorator-summary]]
17. **[[learn/design-pattern/nodes/composite|組合模式]]**
    - Goal: 講清組合「樹形結構統一調用、符合開閉」的意圖，用規則決策樹場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-intro]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-scenario-brief]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-straightforward-impl]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-code-impl]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#composite-summary]]
18. **[[learn/design-pattern/nodes/flyweight|享元模式]]**
    - Goal: 講清享元「共享內部狀態、外部狀態分離」的意圖，用秒殺活動場景，能掛上 Redis 緩存經驗
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#二、享元模式介绍]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#三、案例场景模拟]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#五、享元模式重构代码]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#六、总结]]

### Tier 6 — 對象協作解耦
19. **[[learn/design-pattern/nodes/observer|觀察者模式]]**
    - Goal: 講清觀察者「一對多通知」的意圖，用搖號中籤通知場景，能對照 MQ 事件經驗
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#观察者模式介绍]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#案例场景模拟-摇号通知]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#一把梭实现需求-代码实现]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#观察者模式模型结构]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#总结-观察者]]
20. **[[learn/design-pattern/nodes/mediator|中介者模式]]**
    - Goal: 講清中介者「集中協調、解耦網狀依賴」的意圖，用手寫 ORM 的 SqlSession 場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#场景模拟工程]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#一把梭实现需求]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#中介者模式模型结构]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]

### Tier 7 — 狀態回溯與遍歷
21. **[[learn/design-pattern/nodes/memento|備忘錄模式]]**
    - Goal: 講清備忘錄「狀態快照與回滾」的意圖，用配置回滾場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#备忘录模式介绍]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#案例场景模拟-配置回滚]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#备忘录模式模型结构]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-管理员类]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#总结-备忘录]]
22. **[[learn/design-pattern/nodes/iterator|迭代器模式]]**
    - Goal: 講清迭代器「統一方式遍歷聚合對象、不暴露內部表示」的意圖，用組織樹遍歷場景
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式介绍]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式-案例场景模拟]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式-代码实现]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#迭代器模式-总结]]
23. **[[learn/design-pattern/nodes/visitor|訪問者模式]]**
    - Goal: 講清訪問者「數據結構與操作分離、雙分派」的意圖，用校長/家長視角場景，並說出為何它較「燒腦」且可能違反迪米特
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#访问者模式介绍]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#场景简述]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#访问者模式模型结构]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现-数据看板]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]

### Tier 8 — 面試衝刺：相似模式怎麼選
24. **[[learn/design-pattern/nodes/pattern-selection|相似模式選型對比]]**
    - Goal: 就面試常見的相似模式對照題（策略/狀態/命令/模板、代理/裝飾/適配、工廠/建造者、觀察者/中介者）講出適用邊界與選型理由
    - Sources:
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#策略模式总结]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#命令模式-总结]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#Adapter: 总结]]
      - [[sources/design-pattern/completed/20260901_design_pattern.pdf#总结-观察者]]

## Status
- [x] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written