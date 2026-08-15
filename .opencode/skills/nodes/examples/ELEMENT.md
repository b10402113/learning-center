# Worked element examples

Complete `learn/<subject>/elements/<element-id>.md` files as they should look after `/nodes`. Each example shows one element `type` with its frontmatter, body sections, glosses, cross-element `Connections`, source-linked `Deep dive`, and retrieval `Questions`, in the subject's `language`.

---

## Example 1 — `article` element

```markdown
---
id: oop-paradigm
title: 物件導向典範 (Object-Oriented Paradigm)
subject: design-patterns
tier: 1
order: 1
type: article
nodes:
  - design-patterns/oop-foundation
sources:
  - "[[sources/design-patterns/oop-ch1#object-oriented-programming]]"
created: 2026-08-10
updated: 2026-08-10
---

# 物件導向典範 (Object-Oriented Paradigm)

## Problem Statement

在早期撰寫程式時，通常採用「程序式設計」（Procedural Programming），也就是把指令由上到下一行一行寫出來，並透過大量的全域變數與函式來處理資料。當專案規模變大、邏輯變得複雜時，程式碼會變成難以牽一髮而動全身的「義大利麵條程式碼」（Spaghetti Code）。變數容易被意外修改，且相同邏輯在不同地方重複出現，導致協作困難、維護成本極高。

## Why it matters

物件導向提供了一種符合人類認知直覺的「模組化」架構思維。它將複雜的系統拆解成互相獨立卻又能彼此溝通的個體，大幅提升了程式碼的**可讀性**、**可重用性**與**易維護性**，是建構大型軟體系統與團隊協作不可或缺的基礎。

## How it works

物件導向程式設計（OOP）透過將「資料（屬性，Attributes）」與「操作這些資料的行為（方法，Methods）」綁定在一起，形成一個個獨立的「物件（Objects）」。
它主要依賴四大核心特性來解決上述問題：

1. **封裝（Encapsulation）**：隱藏物件內部的細節與狀態，只對外提供必要的接口（API），防止外部程式隨意修改內部資料。
2. **繼承（Inheritance）**：允許新的類別（Class）直接沿用現有類別的屬性與方法，減少重複撰寫相同的程式碼。
3. **多型（Polymorphism）**：相同的介面或呼叫方式，可以根據不同的物件型態，展現出不同的實作結果，提升系統的彈性。
4. **抽象（Abstraction）**：提取出事物的核心特徵，忽略不必要的細節，讓開發者只需專注於「這東西能做什麼」，而不是「這東西底層怎麼實作的」。

## In plain terms

不要把程式當作「一份從頭讀到尾的待辦事項清單」，而是把程式碼想像成「一家公司」。公司裡有各式各樣的員工（物件），每個員工都有自己的職稱和專業能力（屬性與方法）。身為老闆（主程式），你不需要知道會計是怎麼按計算機的，你只需要叫會計（呼叫物件）去「產出財務報表（執行方法）」就好，員工們彼此會互相溝通合作來完成任務。

## Analogy

想像你在設計一款「汽車」。

- **類別（Class）**：就像是汽車的「設計藍圖」，定義了這輛車會有幾個輪子、什麼顏色，以及具有加速、煞車等功能。
- **物件（Object）**：根據藍圖真正被製造出來、停在你車庫裡的那台「實體汽車」。
- **封裝**：你只需要知道踩油門（呼叫方法）車子就會往前跑，完全不需要懂引擎內部是如何進行噴油與燃燒的（隱藏實作細節）。
- **繼承**：如果今天要設計一台「電動車」，你可以直接拿「一般汽車」的藍圖來擴充（繼承），只要把「引擎」換成「馬達」，而不需要把輪胎、方向盤等設計圖重畫一遍。

## Practical use

在後端架構或資料庫設計中極為常見。例如使用 SQLAlchemy 建立資料庫模型時，我們不會手寫一長串的 SQL 語法，而是會定義一個 `User` 類別，裡面的屬性包含 `id`、`username`、`email` 等。當我們需要更新資料庫時，只需實例化一個 `User` 物件，並呼叫類似 `user.save()` 的方法即可。在建構如高併發的股票監控系統時，也會將每一檔股票實作為一個物件，負責封裝自身的價格狀態（State）與價格更新邏輯（Method），再由外部的佇列系統來排程呼叫。

## Prerequisites

- 基本資料型別與變數 (Data Types & Variables) — variables hold values; types constrain what values are valid
- 函式與參數傳遞 (Functions & Parameters) — functions take inputs and return outputs
- 變數作用域 (Variable Scope) — variables live in scopes; understanding scope prevents accidental mutation

## Connections

- [[design-patterns/encapsulation|封裝 (Encapsulation)]] — OOP paradigm introduces the four features; encapsulation is the first and most foundational one
- [[design-patterns/inheritance|繼承 (Inheritance)]] — OOP paradigm introduces the four features; inheritance enables code reuse across the hierarchy

## Deep dive

- [[sources/design-patterns/oop-ch1#object-oriented-programming]] — the original walkthrough of class vs. object with historical context (Simula → Smalltalk → C++)

## Questions

### Q1. 物件導向典範與程序式設計的主要差異是什麼？
A1. 程序式設計把指令由上到下排列、以全域變數與函式處理資料；物件導向把資料與行為綁定成物件，以封裝、繼承、多型、抽象四大特性組織程式碼。

### Q2. 為什麼物件導向適合大型專案？
A2. 因為物件把狀態與行為封裝在一起，模組邊界清楚，修改一個物件不會牽一髮而動全身；同時繼承與多型讓相同邏輯可以复用而不重複撰寫。
```

---

## Example 2 — `video` element

```markdown
---
id: oop-history-video
title: 物件導向發展史 (History of OOP)
subject: design-patterns
tier: 1
order: 2
type: video
videoUrl: "https://www.youtube.com/embed/d9WKdX0b-CQ"
nodes:
  - design-patterns/oop-foundation
sources:
  - "[[sources/design-patterns/oop-ch1#oop-history]]"
created: 2026-08-10
updated: 2026-08-10
---

# 物件導向發展史 (History of OOP)

## Why this video

This short lecture traces the lineage from Simula (1960) through Smalltalk to C++, so the learner can see how the four features accumulated over decades rather than appearing all at once.

## Key takeaways

- Simula introduced the class/object distinction in 1960 but did not yet have all four features.
- Smalltalk (1970s) was the first language to fully embrace the object-oriented programming paradigm.
- C++ (circa 1980) popularized OOP by adding it as a layer on top of C, which gave it a massive installed base.

## Connections

- [[design-patterns/oop-paradigm|物件導向典範 (Object-Oriented Paradigm)]] — the paradigm overview; this video adds the historical timeline behind it

## Deep dive

- [[sources/design-patterns/oop-ch1#oop-history]] — original chapter section on Simula → Smalltalk → C++ evolution

## Questions

### Q1. 哪一個語言被認為是第一個真正意義上的物件導向程式語言？
A1. Smalltalk。Simula 最早引入類別與物件概念，但 Smalltalk 是第一個完整擁抱物件導向典範的語言。

### Q2. 為什麼 C++ 對物件導向的普及影響最大？
A2. 因為 C++ 是在 C 的基礎上加入物件導向特性，而 C 當時已有龐大的使用者群與既有程式碼，所以 C++ 能快速被廣泛採用。
```

---

## Example 3 — `question` element

```markdown
---
id: oop-four-features-quiz
title: 物件導向四大特性自測 (OOP Four Features Quiz)
subject: design-patterns
tier: 1
order: 3
type: question
questions:
  - question: "下列哪一項不是物件導向的四大特性？"
    options:
      - "封裝 (Encapsulation)"
      - "遞迴 (Recursion)"
      - "繼承 (Inheritance)"
      - "多型 (Polymorphism)"
    answer: 1
  - question: "哪一個特性讓新類別可以沿用現有類別的屬性與方法？"
    options:
      - "封裝 (Encapsulation)"
      - "抽象 (Abstraction)"
      - "繼承 (Inheritance)"
      - "多型 (Polymorphism)"
    answer: 2
nodes:
  - design-patterns/oop-foundation
sources:
  - "[[sources/design-patterns/oop-ch1#four-features]]"
created: 2026-08-10
updated: 2026-08-10
---

# 物件導向四大特性自測 (OOP Four Features Quiz)

## Context

This self-test checks whether you can distinguish the four OOP features from each other and from concepts that belong elsewhere (like recursion, which is a general programming technique, not an OOP feature). Answer correctly to mark this element complete.

## Connections

- [[design-patterns/oop-paradigm|物件導向典範 (Object-Oriented Paradigm)]] — the article that introduces the four features tested here
- [[design-patterns/encapsulation|封裝 (Encapsulation)]] — one of the four features probed in Q1 and Q2
```
