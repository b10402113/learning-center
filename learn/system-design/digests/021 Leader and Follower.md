---
source: 021 Leader and Follower
source_hash: fcdaebd8ee414da258f4c9932aa4bf1a7df80c800db6931c88bb7a4129e882ec
source_lines: 14
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 021 Leader and Follower

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Distributed systems keep multiple copies of data for fault tolerance and higher availability. A system can use quorum to ensure data consistency between replicas, i.e., all reads and writes are not co
- Allow only a single server (called leader) to be responsible for data replication and to coordinate work.
- At any time, one server is elected as the leader. This leader becomes responsible for data replication and can act as the central point for all coordination. The followers only accept writes from the 

## Sections (L2)

### Background

- Locator: `[[sources/system-design/completed/20260825_021 Leader and Follower.html#h2-background]]`
- Summary: Distributed systems keep multiple copies of data for fault tolerance and higher availability. A system can use quorum to ensure data consistency between replicas, i.e., all reads and writes are not considered successful until a majority of nodes participate in the operation. However, using quorum can lead to another problem, that is, lower availability; at any time, the system needs to ensure that
- Key claims: See summary
- Learner-relevant: Core system design concept

### Solution

- Locator: `[[sources/system-design/completed/20260825_021 Leader and Follower.html#h2-solution]]`
- Summary: Allow only a single server (called leader) to be responsible for data replication and to coordinate work. At any time, one server is elected as the leader. This leader becomes responsible for data replication and can act as the central point for all coordination. The followers only accept writes from the leader and serve as a backup. In case the leader fails, one of the followers can become the le
- Key claims: Leader entertains requests from the client and is responsible for replicating and coordinating with followers Previous Quorum Next Heartbeat Mark as C
- Learner-relevant: Core system design concept

