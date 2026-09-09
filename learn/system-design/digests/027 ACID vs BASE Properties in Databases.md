---
source: 027 ACID vs BASE Properties in Databases
source_lines: 47
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 027 ACID vs BASE Properties in Databases

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- When we use an application – whether it's online banking or a shopping site – we expect the data to be correct and the system to work reliably. If you transfer money and a glitch happens, you wouldn’t
- In the world of databases, there are two common models for handling consistency and reliability: ACID and BASE. These acronyms stand for different approaches in database design. In simple terms, ACID 
- ACID is a set of properties that guarantee database transactions are processed reliably. A transaction is a unit of work (like transferring money or booking a ticket) that may involve multiple steps. 

## Sections (L2)

### What is ACID?

- Locator: `[[sources/system-design/completed/20260825_027 ACID vs BASE Properties in Databases.html#h2-what-is-acid]]`
- Summary: ACID is a set of properties that guarantee database transactions are processed reliably. A transaction is a unit of work (like transferring money or booking a ticket) that may involve multiple steps. ACID stands for Atomicity, Consistency, Isolation, Durability . These four properties ensure that even if multiple transactions occur or failures happen, the data remains correct and stable. Atomicity
- Key claims: ACID is a set of properties that guarantee database transactions are processed reliably; A transaction is a unit of work (like transferring money or booking a ticket) that may involve multiple steps
- Learner-relevant: Core system design concept

### What is BASE?

- Locator: `[[sources/system-design/completed/20260825_027 ACID vs BASE Properties in Databases.html#h2-what-is-base]]`
- Summary: BASE is an alternative approach used mainly in many NoSQL and distributed databases. BASE stands for Basically Available, Soft state, Eventually consistent . It is almost the “opposite” of ACID in philosophy. Instead of enforcing strict consistency after every transaction, BASE systems prioritize availability and partition tolerance (being able to distribute data across many servers). The idea is 
- Key claims: Let’s break down the BASE properties with simple terms: Basically Available: The system guarantees availability – it will always try to give you some 
- Learner-relevant: Core system design concept

### ACID vs. BASE – Key Differences and Trade‑Offs

- Locator: `[[sources/system-design/completed/20260825_027 ACID vs BASE Properties in Databases.html#h2-acid-vs-base-key-differences-and-tradeoffs]]`
- Summary: ACID and BASE represent two different priorities in database design. A famous concept in distributed systems, the CAP theorem , says that in the presence of network partitions you can’t have both perfect consistency and perfect availability at the same time. ACID and BASE basically choose different sides of this trade-off: ACID favors consistency , and BASE favors availability . Here are the key d
- Key claims: A famous concept in distributed systems, the CAP theorem , says that in the presence of network partitions you can’t have both perfect consistency and; Here are the key differences and trade-offs between ACID and BASE: CAP Theorem In the CAP theorem, a distributed system can only guarantee two out of 
- Learner-relevant: Core system design concept

### Real-World Examples of ACID and BASE Databases

- Locator: `[[sources/system-design/completed/20260825_027 ACID vs BASE Properties in Databases.html#h2-real-world-examples-of-acid-and-base-databases]]`
- Summary: To cement the idea, let’s look at some real database systems that follow each model: ACID-compliant databases: Most traditional SQL relational databases adhere to ACID properties. Examples include MySQL , PostgreSQL , Oracle Database , SQLite , and Microsoft SQL Server – these systems are built to ensure strict transactional consistency. They are commonly used for applications like banking systems
- Key claims: See summary
- Learner-relevant: Core system design concept

### Conclusion – Choosing ACID or BASE

- Locator: `[[sources/system-design/completed/20260825_027 ACID vs BASE Properties in Databases.html#h2-conclusion-choosing-acid-or-base]]`
- Summary: Both ACID and BASE have their strengths and weaknesses, and neither is “better” in all cases – it truly depends on your application’s needs. ACID guarantees a high level of data integrity and reliability (no half-finished transactions, no dirty reads, no lost updates), which is essential for scenarios like finance, healthcare, inventory management, or any system that can’t afford even minor incons
- Key claims: ACID guarantees a high level of data integrity and reliability (no half-finished transactions, no dirty reads, no lost updates), which is essential fo
- Learner-relevant: Core system design concept

