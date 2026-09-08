---
source: 025 Strong vs Eventual Consistency
source_hash: a420c909fe0602ead132531545a0007229686dc11b42d236437680122afac400
source_lines: 42
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 025 Strong vs Eventual Consistency

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- In distributed systems and databases, data consistency refers to the property that all copies of data (on different servers or nodes) reflect the same state. When multiple users or services access dat
- Strong consistency (sometimes called strict consistency or linearizability) guarantees that any read of data will return the most recent write. In other words, once a write operation completes, all su
- In a strongly consistent system, a write operation is propagated to all replicas before it is considered successful. The above diagram shows a user writing a value to the US West database node, which 

## Sections (L2)

### Introduction

- Locator: `[[sources/system-design/completed/20260825_025 Strong vs Eventual Consistency.html#h2-introduction]]`
- Summary: In distributed systems and databases, data consistency refers to the property that all copies of data (on different servers or nodes) reflect the same state. When multiple users or services access data spread across servers, we want them all to see the same values . Consistency is important because if one part of the system has outdated information while another has new information, it can lead to
- Key claims: In distributed systems and databases, data consistency refers to the property that all copies of data (on different servers or nodes) reflect the same
- Learner-relevant: Core system design concept

### What is Strong Consistency?

- Locator: `[[sources/system-design/completed/20260825_025 Strong vs Eventual Consistency.html#h2-what-is-strong-consistency]]`
- Summary: Strong consistency (sometimes called strict consistency or linearizability ) guarantees that any read of data will return the most recent write . In other words, once a write operation completes, all subsequent reads (from any user or any location) will see that update. There are no “stale” (out-of-date) reads under strong consistency – every read gets the latest committed data. To achieve this, s
- Key claims: Strong consistency (sometimes called strict consistency or linearizability ) guarantees that any read of data will return the most recent write; This ensures that no matter which node a read comes from, the data is up-to-date
- Learner-relevant: Core system design concept

### What is Eventual Consistency?

- Locator: `[[sources/system-design/completed/20260825_025 Strong vs Eventual Consistency.html#h2-what-is-eventual-consistency]]`
- Summary: Eventual consistency is a looser model of consistency that guarantees that if no new updates are made to a piece of data, all copies of that data will eventually become consistent (the same) . The key word here is “eventually.” It doesn’t promise immediate consistency, only that given enough time (and no more changes), all nodes will converge to the latest value. In an eventually consistent system
- Key claims: Eventual consistency is a looser model of consistency that guarantees that if no new updates are made to a piece of data, all copies of that data will
- Learner-relevant: Core system design concept

### Comparison: Strong vs. Eventual Consistency

- Locator: `[[sources/system-design/completed/20260825_025 Strong vs Eventual Consistency.html#h2-comparison-strong-vs-eventual-consistency]]`
- Summary: Now that we’ve defined both models, let’s compare strong and eventual consistency side by side. Each model has its own guarantees and ideal use cases. Below is a summary of key differences: Aspect Strong Consistency Eventual Consistency Data Guarantee Every read gets the latest write (no stale data). The system behaves like a single up-to-date copy of data. Reads might be stale right after a write
- Key claims: Each model has its own guarantees and ideal use cases; Below is a summary of key differences: Aspect Strong Consistency Eventual Consistency Data Guarantee Every read gets the latest write (no stale data)
- Learner-relevant: Core system design concept

### When to Use Which?

- Locator: `[[sources/system-design/completed/20260825_025 Strong vs Eventual Consistency.html#h2-when-to-use-which]]`
- Summary: Choosing the right consistency model depends on your application’s requirements and what trade-offs you’re willing to make. Here are some guidelines to help decide: Use Strong Consistency when correctness is critical: If your application cannot tolerate any divergence or stale reads, strong consistency is the way to go. This is often true for financial systems (banking, stock trading, payment proc
- Key claims: See summary
- Learner-relevant: Core system design concept

### Conclusion

- Locator: `[[sources/system-design/completed/20260825_025 Strong vs Eventual Consistency.html#h2-conclusion]]`
- Summary: Strong consistency offers a guarantee that everyone sees the same data at the same time, which simplifies development and ensures correctness – at the cost of speed and sometimes availability. Eventual consistency relaxes the rules, allowing temporary differences in data across the system, which boosts performance, scalability, and fault tolerance – at the cost of requiring the application to tole
- Key claims: Strong consistency offers a guarantee that everyone sees the same data at the same time, which simplifies development and ensures correctness – at the
- Learner-relevant: Core system design concept

