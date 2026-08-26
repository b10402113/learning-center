---
source: 038 REST vs RPC
source_hash: 51d4a2fbde5d733d7c03a2e99c540c9ec6214c0ac756658738290f80f447a139
source_lines: 51
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 038 REST vs RPC

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- REST (Representational State Transfer) and RPC (Remote Procedure Call) are two architectural approaches used for designing networked applications, particularly for web services and APIs. Each has its 
- PreviousServer-Side Caching vs Client-Side CachingNextPolling vs. Long-Polling vs. WebSockets vs. WebhooksMark as CompletedOn this pageREST (Representational State Transfer)

## Sections (L2)

### REST (Representational State Transfer)

- Locator: `[[sources/system-design/completed/20260825_038 REST vs RPC.html#h2-rest-representational-state-transfer]]`
- Summary: Concept : REST is an architectural style that uses HTTP requests to access and manipulate data. It treats server data as resources that can be created, read, updated, or deleted (CRUD operations) using standard HTTP methods (GET, POST, PUT, DELETE). Stateless : Each request from client to server must contain all the necessary information to understand and complete the request. The server does not 
- Key claims: See summary
- Learner-relevant: Core system design concept

### Advantages of REST

- Locator: `[[sources/system-design/completed/20260825_038 REST vs RPC.html#h3-advantages-of-rest]]`
- Summary: Scalability : Stateless interactions improve scalability and visibility. Performance : Can leverage HTTP caching infrastructure. Simplicity and Flexibility : Uses standard HTTP methods, making it easy to understand and implement.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Disadvantages of REST

- Locator: `[[sources/system-design/completed/20260825_038 REST vs RPC.html#h3-disadvantages-of-rest]]`
- Summary: Over-fetching or Under-fetching : Sometimes, it retrieves more or less data than needed. Standardization : Lacks a strict standard, leading to different interpretations and implementations.
- Key claims: See summary
- Learner-relevant: Core system design concept

### RPC (Remote Procedure Call)

- Locator: `[[sources/system-design/completed/20260825_038 REST vs RPC.html#h2-rpc-remote-procedure-call]]`
- Summary: Concept : RPC is a protocol that allows one program to execute a procedure (subroutine) in another address space (commonly on another computer on a shared network). The programmer defines specific procedures. Procedure-Oriented : Clients and servers communicate with each other through explicit remote procedure calls. The client invokes a remote method, and the server returns the results of the exe
- Key claims: Concept : RPC is a protocol that allows one program to execute a procedure (subroutine) in another address space (commonly on another computer on a sh
- Learner-relevant: Core system design concept

### Advantages of RPC

- Locator: `[[sources/system-design/completed/20260825_038 REST vs RPC.html#h3-advantages-of-rpc]]`
- Summary: Tight Coupling : Allows for a more straightforward mapping of actions (procedures) to server-side operations. Efficiency : Binary RPC (like gRPC) can be more efficient in data transfer and faster in performance. Clear Contract : Procedure definitions create a clear contract between the client and server.
- Key claims: Tight Coupling : Allows for a more straightforward mapping of actions (procedures) to server-side operations
- Learner-relevant: Core system design concept

### Disadvantages of RPC

- Locator: `[[sources/system-design/completed/20260825_038 REST vs RPC.html#h3-disadvantages-of-rpc]]`
- Summary: Less Flexible : Tightly coupled to the methods defined on the server. Stateful Interactions : Can maintain state, which might reduce scalability.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Conclusion

- Locator: `[[sources/system-design/completed/20260825_038 REST vs RPC.html#h2-conclusion]]`
- Summary: REST is generally more suited for web services and public APIs where scalability, caching, and a uniform interface are important. RPC is often chosen for actions that are tightly coupled to server-side operations, especially when efficiency and speed are critical, as in internal microservices communication. Previous Server-Side Caching vs Client-Side Caching Next Polling vs. Long-Polling vs. WebSo
- Key claims: Webhooks Mark as Completed On this page REST (Representational State Transfer) Advantages of REST Disadvantages of REST RPC (Remote Procedure Call) Ad
- Learner-relevant: Core system design concept

