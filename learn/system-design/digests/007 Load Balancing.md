---
source: 007 Load Balancing
source_hash: 50edec9cd8d6b9eda3cafb1c9c081106b595df4906e93a95c70474a5be524cdc
source_lines: 25
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 007 Load Balancing

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Load Balancer (LB) is another critical component of any distributed system. It helps to spread the traffic across a cluster of servers to improve responsiveness and availability of applications, websi
- Typically a load balancer sits between the client and the server accepting incoming network and application traffic and distributing the traffic across multiple backend servers using various algorithm
- To utilize full scalability and redundancy, we can try to balance the load at each layer of the system. We can add LBs at three places:

## Sections (L2)

### Benefits of Load Balancing

- Locator: `[[sources/system-design/completed/20260825_007 Load Balancing.html#h2-benefits-of-load-balancing]]`
- Summary: Users experience faster, uninterrupted service. Users won’t have to wait for a single struggling server to finish its previous tasks. Instead, their requests are immediately passed on to a more readily available resource. Service providers experience less downtime and higher throughput. Even a full server failure won’t affect the end user experience as the load balancer will simply route around it
- Key claims: See summary
- Learner-relevant: Core system design concept

### Redundant Load Balancers

- Locator: `[[sources/system-design/completed/20260825_007 Load Balancing.html#h2-redundant-load-balancers]]`
- Summary: The load balancer can be a single point of failure; to overcome this, a second load balancer can be connected to the first to form a cluster. Each LB monitors the health of the other and, since both of them are equally capable of serving traffic and failure detection, in the event the main load balancer fails, the second load balancer takes over. Previous Key Characteristics of Distributed Systems
- Key claims: Previous Key Characteristics of Distributed Systems Next Load Balancing Algorithms Mark as Completed On this page Benefits of Load Balancing Redundant
- Learner-relevant: Core system design concept

