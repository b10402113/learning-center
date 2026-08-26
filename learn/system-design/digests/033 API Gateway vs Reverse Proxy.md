---
source: 033 API Gateway vs Reverse Proxy
source_hash: 5e4e18ede435b84d77c5c443ee7eaa86292839c758fae26a28c06fab5ce5099d
source_lines: 55
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 033 API Gateway vs Reverse Proxy

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- API Gateway and Reverse Proxy are both architectural components that manage incoming requests, but they serve different purposes and operate in somewhat different contexts.
- While both API Gateways and Reverse Proxies manage traffic, they cater to different needs. An API Gateway is more about managing, routing, and orchestrating API calls in a microservices architecture, 
- PreviousProxy vs. Reverse ProxyNextSQL vs. NoSQLMark as CompletedOn this pageAPI Gateway

## Sections (L2)

### API Gateway

- Locator: `[[sources/system-design/completed/20260825_033 API Gateway vs Reverse Proxy.html#h3-api-gateway]]`
- Summary: Purpose : An API Gateway is a management tool that acts as a single entry point for a defined group of microservices, handling requests and routing them to the appropriate service. Functionality : Routing : Routes requests to the correct microservice. Aggregation : Aggregates results from multiple microservices. Cross-Cutting Concerns : Handles cross-cutting concerns like authentication, authoriza
- Key claims: Purpose : An API Gateway is a management tool that acts as a single entry point for a defined group of microservices, handling requests and routing th
- Learner-relevant: Core system design concept

### Reverse Proxy

- Locator: `[[sources/system-design/completed/20260825_033 API Gateway vs Reverse Proxy.html#h3-reverse-proxy]]`
- Summary: Purpose : A Reverse Proxy is a type of proxy server that retrieves resources on behalf of a client from one or more servers. It sits between the client and the backend services or servers. Functionality : Load Balancing : Distributes client requests across multiple servers to balance load and ensure reliability. Security : Provides an additional layer of defense (hides the identities of backend se
- Key claims: Purpose : A Reverse Proxy is a type of proxy server that retrieves resources on behalf of a client from one or more servers; Security : Provides an additional layer of defense (hides the identities of backend servers)
- Learner-relevant: Core system design concept

### Key Differences

- Locator: `[[sources/system-design/completed/20260825_033 API Gateway vs Reverse Proxy.html#h3-key-differences]]`
- Summary: Primary Role : An API Gateway primarily facilitates and manages application-level traffic, acting as a gatekeeper for microservices. A Reverse Proxy focuses more on network-level concerns like load balancing, security, and caching for a wider range of applications. Complexity and Functionality : API Gateways are more sophisticated in functionality, often providing additional features like request 
- Key claims: See summary
- Learner-relevant: Core system design concept

### Conclusion

- Locator: `[[sources/system-design/completed/20260825_033 API Gateway vs Reverse Proxy.html#h3-conclusion]]`
- Summary: While both API Gateways and Reverse Proxies manage traffic, they cater to different needs. An API Gateway is more about managing, routing, and orchestrating API calls in a microservices architecture, whereas a Reverse Proxy is about general server efficiency, security, and network traffic management. In practice, many modern architectures might use both, with an API Gateway handling application-sp
- Key claims: NoSQL Mark as Completed On this page API Gateway Reverse Proxy Key Differences Conclusion What is a System Design Interview
- Learner-relevant: Core system design concept

