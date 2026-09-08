---
source: 008 Load Balancing Algorithms
source_hash: 182f6657171ea89448bc4e07024c9457734a312b3d99699d02d315a8146cf6b7
source_lines: 231
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 008 Load Balancing Algorithms

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- A load balancing algorithm is a method used by a load balancer to distribute incoming traffic and requests among multiple servers or resources. The primary purpose of a load balancing algorithm is to 
- Load balancing algorithms help to prevent any single server or resource from becoming overwhelmed, which could lead to performance degradation or failure. By distributing the workload, load balancing 
- Here are the most famous load balancing algorithms:

## Sections (L2)

### 1. Round Robin

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h2-1-round-robin]]`
- Summary: This algorithm distributes incoming requests to servers in a cyclic order. It assigns a request to the first server, then moves to the second, third, and so on, and after reaching the last server, it starts again at the first. Pros: Ensures an equal distribution of requests among the servers, as each server gets a turn in a fixed order. Easy to implement and understand. Works well when servers hav
- Key claims: Pros: Ensures an equal distribution of requests among the servers, as each server gets a turn in a fixed order
- Learner-relevant: Core system design concept

### Use Cases

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-use-cases]]`
- Summary: Homogeneous Environments : Suitable for environments where all servers have similar capacity and performance. Stateless Applications : Works well for stateless applications where each request can be handled independently. Round Robin
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Least Connections

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h2-2-least-connections]]`
- Summary: The Least Connections algorithm is a dynamic load balancing technique that assigns incoming requests to the server with the fewest active connections at the time of the request. This method ensures a more balanced distribution of load across servers, especially in environments where traffic patterns are unpredictable and request processing times vary. Pros: Load Awareness : Takes into account the 
- Key claims: The Least Connections algorithm is a dynamic load balancing technique that assigns incoming requests to the server with the fewest active connections ; This method ensures a more balanced distribution of load across servers, especially in environments where traffic patterns are unpredictable and reque
- Learner-relevant: Core system design concept

### Use Cases

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-use-cases]]`
- Summary: Heterogeneous Environments : Suitable for environments where servers have different capacities and workloads, and the load needs to be dynamically distributed. Variable Traffic Patterns : Works well for applications with unpredictable or highly variable traffic patterns, ensuring that no single server is overwhelmed. Stateful Applications : Effective for applications where maintaining session stat
- Key claims: See summary
- Learner-relevant: Core system design concept

### Comparison to Round Robin

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-comparison-to-round-robin]]`
- Summary: Round Robin : Distributes requests in a fixed, cyclic order without considering the current load on each server. Least Connections : Distributes requests based on the current load, directing new requests to the server with the fewest active connections. Least Connections
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Weighted Round Robin

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h2-3-weighted-round-robin]]`
- Summary: Weighted Round Robin (WRR) is an enhanced version of the Round Robin load balancing algorithm. It assigns weights to each server based on their capacity or performance, distributing incoming requests proportionally according to these weights. This ensures that more powerful servers handle a larger share of the load, while less powerful servers handle a smaller share.
- Key claims: This ensures that more powerful servers handle a larger share of the load, while less powerful servers handle a smaller share
- Learner-relevant: Core system design concept

### Pros

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-pros]]`
- Summary: Load Distribution According to Capacity : Servers with higher capacities handle more requests, leading to better utilization of resources. Flexibility : Easily adjustable to accommodate changes in server capacities or additions of new servers. Improved Performance : Helps in optimizing overall system performance by preventing overloading of less powerful servers.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Cons

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-cons]]`
- Summary: Complexity in Weight Assignment : Determining appropriate weights for each server can be challenging and requires accurate performance metrics. Increased Overhead : Managing and updating weights can introduce additional overhead, especially in dynamic environments where server performance fluctuates. Not Ideal for Highly Variable Loads : In environments with highly variable load patterns, WRR may 
- Key claims: See summary
- Learner-relevant: Core system design concept

### Use Cases

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-use-cases]]`
- Summary: Heterogeneous Server Environments : Ideal for environments where servers have different processing capabilities, ensuring efficient use of resources. Scalable Web Applications : Suitable for web applications where different servers may have varying performance characteristics. Database Clusters : Useful in database clusters where some nodes have higher processing power and can handle more queries.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Weighted Least Connections

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h2-4-weighted-least-connections]]`
- Summary: Weighted Least Connections is an advanced load balancing algorithm that combines the principles of the Least Connections and Weighted Round Robin algorithms. It takes into account both the current load (number of active connections) on each server and the relative capacity of each server (weight). This approach ensures that more powerful servers handle a proportionally larger share of the load, wh
- Key claims: This approach ensures that more powerful servers handle a proportionally larger share of the load, while also dynamically adjusting to the real-time l
- Learner-relevant: Core system design concept

### Pros

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-pros]]`
- Summary: Dynamic Load Balancing : Adjusts to the real-time load on each server, ensuring a more balanced distribution of requests. Capacity Awareness : Takes into account the relative capacity of each server, leading to better utilization of resources. Flexibility : Can handle environments with heterogeneous servers and variable load patterns effectively.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Cons

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-cons]]`
- Summary: Complexity : More complex to implement compared to simpler algorithms like Round Robin and Least Connections. State Maintenance : Requires the load balancer to keep track of both active connections and server weights, increasing overhead. Weight Assignment : Determining appropriate weights for each server can be challenging and requires accurate performance metrics.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Use Cases

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-use-cases]]`
- Summary: Heterogeneous Server Environments : Ideal for environments where servers have different processing capacities and workloads. High Traffic Web Applications : Suitable for web applications with variable traffic patterns, ensuring no single server becomes a bottleneck. Database Clusters : Useful in database clusters where nodes have varying performance capabilities and query loads. Weighted Least Con
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. IP Hash

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h2-5-ip-hash]]`
- Summary: IP Hash load balancing is a technique that assigns client requests to servers based on the client's IP address. The load balancer uses a hash function to convert the client's IP address into a hash value, which is then used to determine which server should handle the request. This method ensures that requests from the same client IP address are consistently routed to the same server, providing ses
- Key claims: IP Hash load balancing is a technique that assigns client requests to servers based on the client's IP address; This method ensures that requests from the same client IP address are consistently routed to the same server, providing session persistence
- Learner-relevant: Core system design concept

### Example

- Locator: `[[sources/system-design/completed/20260825_008 Load Balancing Algorithms.html#h3-example]]`
- Summary: Suppose you have three servers (Server A, Server B, and Server C) and a client with the IP address 192.168.1.10 . The load balancer applies a hash function to this IP address, resulting in a hash value. If the hash value is 2 and there are three servers, the load balancer routes the request to Server C ( 2 % 3 = 2 ).
- Key claims: See summary
- Learner-relevant: Core system design concept

