---
source: 020 Quorum
source_hash: 3b75e09b3f489b22da2b766f6b10e72ca38959683824882cf18dada3683d5809
source_lines: 66
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 020 Quorum

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- In Distributed Systems, data is replicated across multiple servers for fault tolerance and high availability. Once a system decides to maintain multiple copies of data, another problem arises: how to 
- In a distributed environment, a quorum is the minimum number of servers on which a distributed operation needs to be performed successfully before declaring the operation's overall success.
- Suppose a database is replicated on five machines. In that case, quorum refers to the minimum number of machines that perform the same action (commit or abort) for a given transaction in order to deci

## Sections (L2)

### Background

- Locator: `[[sources/system-design/completed/20260825_020 Quorum.html#h2-background]]`
- Summary: In Distributed Systems, data is replicated across multiple servers for fault tolerance and high availability. Once a system decides to maintain multiple copies of data, another problem arises: how to make sure that all replicas are consistent, i.e., if they all have the latest copy of the data and that all clients see the same view of the data?
- Key claims: See summary
- Learner-relevant: Core system design concept

### Solution

- Locator: `[[sources/system-design/completed/20260825_020 Quorum.html#h2-solution]]`
- Summary: In a distributed environment, a quorum is the minimum number of servers on which a distributed operation needs to be performed successfully before declaring the operation's overall success. Suppose a database is replicated on five machines. In that case, quorum refers to the minimum number of machines that perform the same action (commit or abort) for a given transaction in order to decide the fin
- Key claims: In that case, quorum refers to the minimum number of machines that perform the same action (commit or abort) for a given transaction in order to decid; In systems with multiple replicas, there is a possibility that the user reads inconsistent data
- Learner-relevant: Core system design concept

### How It Works

- Locator: `[[sources/system-design/completed/20260825_020 Quorum.html#h3-how-it-works]]`
- Summary: Majority-Based Quorum : The most common type of quorum where an operation requires a majority (more than half) of the nodes to agree or participate. For instance, in a system with 5 nodes, at least 3 must agree for a decision to be made. Read and Write Quorums : For read and write operations, different quorum sizes can be defined. For example, a system might require a write quorum of 4 nodes and a
- Key claims: See summary
- Learner-relevant: Core system design concept

### Distributed Databases

- Locator: `[[sources/system-design/completed/20260825_020 Quorum.html#h3-distributed-databases]]`
- Summary: Ensuring consistency in a database cluster, where multiple nodes might hold copies of the same data.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Cluster Management

- Locator: `[[sources/system-design/completed/20260825_020 Quorum.html#h3-cluster-management]]`
- Summary: In server clusters, a quorum decides which nodes form the 'active' cluster, especially important for avoiding 'split-brain' scenarios where a cluster might be divided into two parts, each believing it is the active cluster.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Consensus Protocols

- Locator: `[[sources/system-design/completed/20260825_020 Quorum.html#h3-consensus-protocols]]`
- Summary: In algorithms like Paxos or Raft, a quorum is crucial for achieving consensus among distributed nodes regarding the state of the system or the outcome of an operation.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Advantages

- Locator: `[[sources/system-design/completed/20260825_020 Quorum.html#h2-advantages]]`
- Summary: Fault Tolerance : Allows the system to tolerate a certain number of failures while still operating correctly. Consistency : Helps maintain data consistency across distributed nodes. Availability : Increases the availability of the system by allowing operations to proceed as long as the quorum condition is met.
- Key claims: Fault Tolerance : Allows the system to tolerate a certain number of failures while still operating correctly
- Learner-relevant: Core system design concept

### Challenges

- Locator: `[[sources/system-design/completed/20260825_020 Quorum.html#h2-challenges]]`
- Summary: Network Partitions : In cases of network failures, forming a quorum might be challenging, impacting system availability. Performance Overhead : Achieving a quorum, especially in large clusters, can introduce latency in decision-making processes. Complexity : Implementing and managing quorum-based systems can be complex, particularly in dynamic environments with frequent node or network changes.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Conclusion

- Locator: `[[sources/system-design/completed/20260825_020 Quorum.html#h2-conclusion]]`
- Summary: Quorum is a fundamental concept in distributed systems, playing a crucial role in ensuring consistency, reliability, and availability in environments where multiple nodes work together. While it enhances fault tolerance, it also introduces additional complexity and requires careful design and management to balance consistency, availability, and performance. Previous Bloom Filters Next Leader and F
- Key claims: Quorum is a fundamental concept in distributed systems, playing a crucial role in ensuring consistency, reliability, and availability in environments ; Previous Bloom Filters Next Leader and Follower Mark as Completed On this page Background Solution How It Works Use Cases Distributed Databases Cluste
- Learner-relevant: Core system design concept

