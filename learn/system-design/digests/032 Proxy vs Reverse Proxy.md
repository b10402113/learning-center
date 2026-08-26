---
source: 032 Proxy vs Reverse Proxy
source_hash: 81168f256bbe15a792e6c3cdd38fa7ebdbbf1b0cdf2a979d69882094a8b958ba
source_lines: 51
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 032 Proxy vs Reverse Proxy

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Proxy and Reverse Proxy are both intermediary entities in a network that manage and redirect traffic, but they differ in terms of their operational setup and the direction in which they handle traffic
- While both Proxy and Reverse Proxy serve as intermediaries in network traffic, their roles are essentially opposite. A Proxy is client-facing, managing outgoing traffic and user access, while a Revers
- PreviousAPI Gateway vs Direct Service ExposureNextAPI Gateway vs. Reverse ProxyMark as CompletedOn this pageProxy (Forward Proxy)

## Sections (L2)

### Proxy (Forward Proxy)

- Locator: `[[sources/system-design/completed/20260825_032 Proxy vs Reverse Proxy.html#h2-proxy-forward-proxy]]`
- Summary: Operational Direction : A Proxy, often referred to as a Forward Proxy, serves as an intermediary for requests from clients (like browsers) seeking resources from other servers. The clients connect to the proxy server, which then forwards the request to the destination server on behalf of the client. Functionality : Privacy and Anonymity : Hides the identity of the client from the internet servers 
- Key claims: See summary
- Learner-relevant: Core system design concept

### Reverse Proxy

- Locator: `[[sources/system-design/completed/20260825_032 Proxy vs Reverse Proxy.html#h2-reverse-proxy]]`
- Summary: Operational Direction : A Reverse Proxy, in contrast, is an intermediary for requests from clients (external or internal) directed to one or more servers. The clients connect to the reverse proxy server, which then forwards the request to the appropriate backend server. Functionality : Load Balancing : Distributes incoming requests evenly among multiple servers to balance the load. Security and An
- Key claims: See summary
- Learner-relevant: Core system design concept

### Key Differences

- Locator: `[[sources/system-design/completed/20260825_032 Proxy vs Reverse Proxy.html#h2-key-differences]]`
- Summary: Direction of Traffic : A Proxy (Forward Proxy) acts on behalf of clients (users), managing outbound requests to the internet or other networks. A Reverse Proxy acts on behalf of servers, managing inbound requests from the outside to the server infrastructure. Intended Purpose : Proxies are typically used for client privacy, internet access control, and caching. Reverse Proxies are used for server 
- Key claims: See summary
- Learner-relevant: Core system design concept

### Conclusion

- Locator: `[[sources/system-design/completed/20260825_032 Proxy vs Reverse Proxy.html#h2-conclusion]]`
- Summary: While both Proxy and Reverse Proxy serve as intermediaries in network traffic, their roles are essentially opposite. A Proxy is client-facing, managing outgoing traffic and user access, while a Reverse Proxy is server-facing, managing incoming traffic to the server infrastructure. Their deployment and specific functionalities reflect these distinct roles. Previous API Gateway vs Direct Service Exp
- Key claims: Reverse Proxy Mark as Completed On this page Proxy (Forward Proxy) Reverse Proxy Key Differences Conclusion What is a System Design Interview
- Learner-relevant: Core system design concept

