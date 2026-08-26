---
source: 016 PACELC Theorem
source_hash: 873b216256d304d9c1033b6783a92e22f18a933806ba8eaa7960c2c9bbb928ab
source_lines: 24
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 016 PACELC Theorem

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- We cannot avoid partition in a distributed system, therefore, according to the CAP theorem, a distributed system should choose between consistency or availability. ACID (Atomicity, Consistency, Isolat
- One place where the CAP theorem is silent is what happens when there is no network partition? What choices does a distributed system have when there is no partition?
- The PACELC theorem states that in a system that replicates data:

## Sections (L2)

### Background

- Locator: `[[sources/system-design/completed/20260825_016 PACELC Theorem.html#h2-background]]`
- Summary: We cannot avoid partition in a distributed system, therefore, according to the CAP theorem, a distributed system should choose between consistency or availability. ACID (Atomicity, Consistency, Isolation, Durability) databases, such as RDBMSs like MySQL, Oracle, and Microsoft SQL Server, chose consistency (refuse response if it cannot check with peers), while BASE (Basically Available, Soft-state,
- Key claims: We cannot avoid partition in a distributed system, therefore, according to the CAP theorem, a distributed system should choose between consistency or ; One place where the CAP theorem is silent is what happens when there is no network partition
- Learner-relevant: Core system design concept

### Solution

- Locator: `[[sources/system-design/completed/20260825_016 PACELC Theorem.html#h2-solution]]`
- Summary: The PACELC theorem states that in a system that replicates data: if there is a partition ('P'), a distributed system can tradeoff between availability and consistency (i.e., 'A' and 'C'); else ('E'), when the system is running normally in the absence of partitions, the system can tradeoff between latency ('L') and consistency ('C'). The first part of the theorem ( PAC ) is the same as the CAP theo
- Key claims: The PACELC theorem states that in a system that replicates data: if there is a partition ('P'), a distributed system can tradeoff between availability; The first part of the theorem ( PAC ) is the same as the CAP theorem, and the ELC is the extension
- Learner-relevant: Core system design concept

### Examples

- Locator: `[[sources/system-design/completed/20260825_016 PACELC Theorem.html#h2-examples]]`
- Summary: Dynamo and Cassandra are PA/EL systems: They choose availability over consistency when a partition occurs; otherwise, they choose lower latency. BigTable and HBase are PC/EC systems: They will always choose consistency, giving up availability and lower latency. MongoDB can be considered PA/EC (default configuration): MongoDB works in a primary/secondaries configuration. In the default configuratio
- Key claims: As all replication is done asynchronously (from primary to secondaries), when there is a network partition in which primary is lost or becomes isolate
- Learner-relevant: Core system design concept

