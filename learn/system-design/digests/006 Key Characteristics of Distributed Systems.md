---
source: 006 Key Characteristics of Distributed Systems
source_lines: 62
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 006 Key Characteristics of Distributed Systems

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Key characteristics of a distributed system include Scalability, Reliability, Availability, Efficiency, and Manageability. Let's briefly review them:
- Scalability is the capability of a system, process, or a network to grow and manage increased demand. Any distributed system that can continuously evolve in order to support the growing amount of work
- A system may have to scale because of many reasons like increased data volume or increased amount of work, e.g., number of transactions. A scalable system would like to achieve this scaling without pe

## Sections (L2)

### Scalability

- Locator: `[[sources/system-design/completed/20260825_006 Key Characteristics of Distributed Systems.html#h2-scalability]]`
- Summary: Scalability is the capability of a system, process, or a network to grow and manage increased demand. Any distributed system that can continuously evolve in order to support the growing amount of work is considered to be scalable. A system may have to scale because of many reasons like increased data volume or increased amount of work, e.g., number of transactions. A scalable system would like to 
- Key claims: See summary
- Learner-relevant: Core system design concept

### Reliability

- Locator: `[[sources/system-design/completed/20260825_006 Key Characteristics of Distributed Systems.html#h2-reliability]]`
- Summary: Reliability refers to the ability of a system to continue operating correctly and effectively in the presence of faults, errors, or failures. In simple terms, a distributed system is considered reliable if it keeps delivering its services even when one or several of its software or hardware components fail. Reliability represents one of the main characteristics of any distributed system, since in 
- Key claims: Reliability refers to the ability of a system to continue operating correctly and effectively in the presence of faults, errors, or failures
- Learner-relevant: Core system design concept

### The Difference Between Reliability and Fault Tolerance

- Locator: `[[sources/system-design/completed/20260825_006 Key Characteristics of Distributed Systems.html#h3-the-difference-between-reliability-and-fault-tolerance]]`
- Summary: Although these terms often overlap, the main differences can be summarized as follows: Scope : Reliability focuses on the end-to-end correctness and consistency of the entire system’s operation over time. Fault tolerance focuses on the system’s ability to continue operating when individual components fail. Perspective : Reliability is primarily a user-centric concept: Can the system consistently m
- Key claims: See summary
- Learner-relevant: Core system design concept

### Availability

- Locator: `[[sources/system-design/completed/20260825_006 Key Characteristics of Distributed Systems.html#h2-availability]]`
- Summary: By definition, availability is the time a system remains operational to perform its required function in a specific period. It is a simple measure of the percentage of time that a system, service, or a machine remains operational under normal conditions. An aircraft that can be flown for many hours a month without much downtime can be said to have a high availability. Availability takes into accou
- Key claims: It is a simple measure of the percentage of time that a system, service, or a machine remains operational under normal conditions
- Learner-relevant: Core system design concept

### Efficiency

- Locator: `[[sources/system-design/completed/20260825_006 Key Characteristics of Distributed Systems.html#h2-efficiency]]`
- Summary: To understand how to measure the efficiency of a distributed system, let's assume we have an operation that runs in a distributed manner and delivers a set of items as result. Two standard measures of its efficiency are the response time (or latency) that denotes the delay to obtain the first item and the throughput (or bandwidth) which denotes the number of items delivered in a given time unit (e
- Key claims: See summary
- Learner-relevant: Core system design concept

### Serviceability or Manageability

- Locator: `[[sources/system-design/completed/20260825_006 Key Characteristics of Distributed Systems.html#h2-serviceability-or-manageability]]`
- Summary: Another important consideration while designing a distributed system is how easy it is to operate and maintain. Serviceability or manageability is the simplicity and speed with which a system can be repaired or maintained; if the time to fix a failed system increases, then availability will decrease. Things to consider for manageability are the ease of diagnosing and understanding problems when th
- Key claims: See summary
- Learner-relevant: Core system design concept

