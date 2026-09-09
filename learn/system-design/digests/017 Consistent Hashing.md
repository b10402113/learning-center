---
source: 017 Consistent Hashing
source_lines: 64
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 017 Consistent Hashing

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- While designing a scalable system, the most important aspect is defining how the data will be partitioned and replicated across servers. Let's first define these terms before moving on:
- Data partitioning: It is the process of distributing data across a set of servers. It improves the scalability and performance of the system.
- Data replication: It is the process of making multiple copies of data and storing them on different servers. It improves the availability and durability of the data across the system.

## Sections (L2)

### Background

- Locator: `[[sources/system-design/completed/20260825_017 Consistent Hashing.html#h2-background]]`
- Summary: While designing a scalable system, the most important aspect is defining how the data will be partitioned and replicated across servers. Let's first define these terms before moving on: Data partitioning: It is the process of distributing data across a set of servers. It improves the scalability and performance of the system. Data replication: It is the process of making multiple copies of data an
- Key claims: See summary
- Learner-relevant: Core system design concept

### What is data partitioning?

- Locator: `[[sources/system-design/completed/20260825_017 Consistent Hashing.html#h2-what-is-data-partitioning]]`
- Summary: As stated above, the act of distributing data across a set of nodes is called data partitioning. There are two challenges when we try to distribute data: How do we know on which node a particular piece of data will be stored? When we add or remove nodes, how do we know what data will be moved from existing nodes to the new nodes? Additionally, how can we minimize data movement when nodes join or l
- Key claims: See summary
- Learner-relevant: Core system design concept

### Consistent Hashing to the rescue

- Locator: `[[sources/system-design/completed/20260825_017 Consistent Hashing.html#h2-consistent-hashing-to-the-rescue]]`
- Summary: Distributed systems can use Consistent Hashing to distribute data across nodes. Consistent Hashing maps data to physical nodes and ensures that only a small set of keys move when servers are added or removed. Consistent Hashing stores the data managed by a distributed system in a ring. Each node in the ring is assigned a range of data. Here is an example of the consistent hash ring: Consistent Has
- Key claims: Consistent Hashing maps data to physical nodes and ensures that only a small set of keys move when servers are added or removed; This means that each node will be assigned one token
- Learner-relevant: Core system design concept

### Virtual nodes

- Locator: `[[sources/system-design/completed/20260825_017 Consistent Hashing.html#h2-virtual-nodes]]`
- Summary: Adding and removing nodes in any distributed system is quite common. Existing nodes can die and may need to be decommissioned. Similarly, new nodes may be added to an existing cluster to meet growing demands. To efficiently handle these scenarios, Consistent Hashing makes use of virtual nodes (or Vnodes). As we saw above, the basic Consistent Hashing algorithm assigns a single token (or a consecut
- Key claims: See summary
- Learner-relevant: Core system design concept

### Advantages of Vnodes

- Locator: `[[sources/system-design/completed/20260825_017 Consistent Hashing.html#h3-advantages-of-vnodes]]`
- Summary: Vnodes gives the following advantages: As Vnodes help spread the load more evenly across the physical nodes on the cluster by dividing the hash ranges into smaller subranges, this speeds up the rebalancing process after adding or removing nodes. When a new node is added, it receives many Vnodes from the existing nodes to maintain a balanced cluster. Similarly, when a node needs to be rebuilt, inst
- Key claims: See summary
- Learner-relevant: Core system design concept

### Data replication using Consistent Hashing

- Locator: `[[sources/system-design/completed/20260825_017 Consistent Hashing.html#h2-data-replication-using-consistent-hashing]]`
- Summary: To ensure highly availability and durability , Consistent Hashing replicates each data item on multiple N nodes in the system where the value N is equivalent to the replication factor. The replication factor is the number of nodes that will receive the copy of the same data. For example, a replication factor of two means there are two copies of each data item, where each copy is stored on a differ
- Key claims: See summary
- Learner-relevant: Core system design concept

### Consistent Hashing in System Design Interviews

- Locator: `[[sources/system-design/completed/20260825_017 Consistent Hashing.html#h2-consistent-hashing-in-system-design-interviews]]`
- Summary: As we saw above, Consistent Hashing helps with efficiently partitioning and replicating data; therefore, any distributed system that needs to scale up or down or wants to achieve high availability through data replication can utilize Consistent Hashing. A few such examples could be: Any system working with a set of storage (or database) servers and needs to scale up or down based on the usage, e.g
- Key claims: See summary
- Learner-relevant: Core system design concept

### Consistent Hashing use cases

- Locator: `[[sources/system-design/completed/20260825_017 Consistent Hashing.html#h2-consistent-hashing-use-cases]]`
- Summary: Amazon's Dynamo and Apache Cassandra use Consistent Hashing to distribute and replicate data across nodes. Previous PACELC Theorem Next Long-Polling vs WebSockets vs Server-Sent Events Mark as Completed On this page Background What is data partitioning? Consistent Hashing to the rescue Virtual nodes Advantages of Vnodes Data replication using Consistent Hashing Consistent Hashing in System Design 
- Key claims: Previous PACELC Theorem Next Long-Polling vs WebSockets vs Server-Sent Events Mark as Completed On this page Background What is data partitioning; Consistent Hashing to the rescue Virtual nodes Advantages of Vnodes Data replication using Consistent Hashing Consistent Hashing in System Design Inte
- Learner-relevant: Core system design concept

