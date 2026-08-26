---
source: 030 Load Balancer vs API Gateway
source_hash: 317c846fee77dd2de0b958c95a9510fd16f98cf8024834fd7d4fde55ddc68691
source_lines: 63
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 030 Load Balancer vs API Gateway

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Load Balancer and API Gateway are two crucial components in modern web architectures, often used to manage incoming traffic and requests to web applications. While they have some overlapping functiona
- Imagine an e-commerce website experiencing high volumes of traffic. A load balancer sits in front of the website’s servers and evenly distributes incoming user requests to prevent any single server fr
- Consider a mobile banking application that needs to interact with different services like account details, transaction history, and currency exchange rates. An API Gateway sits between the app and the

## Sections (L2)

### Load Balancer

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h2-load-balancer]]`
- Summary: Purpose : A Load Balancer is primarily used to distribute network or application traffic across multiple servers. This distribution helps to optimize resource use, maximize throughput, reduce response time, and ensure reliability. How It Works : It accepts incoming requests and then routes them to one of several backend servers based on factors like the number of current connections, server respon
- Key claims: See summary
- Learner-relevant: Core system design concept

### Example of Load Balancer:

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h3-example-of-load-balancer]]`
- Summary: Imagine an e-commerce website experiencing high volumes of traffic. A load balancer sits in front of the website’s servers and evenly distributes incoming user requests to prevent any single server from becoming overloaded. This setup increases the website's capacity and reliability, ensuring all users have a smooth experience.
- Key claims: See summary
- Learner-relevant: Core system design concept

### API Gateway

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h2-api-gateway]]`
- Summary: Purpose : An API Gateway is an API management tool that sits between a client and a collection of backend services. It acts as a reverse proxy to route requests, simplify the API, and aggregate the results from various services. Functionality : The API Gateway can handle a variety of tasks, including request routing, API composition, rate limiting, authentication, and authorization. Usage : Common
- Key claims: See summary
- Learner-relevant: Core system design concept

### Example of API Gateway:

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h3-example-of-api-gateway]]`
- Summary: Consider a mobile banking application that needs to interact with different services like account details, transaction history, and currency exchange rates. An API Gateway sits between the app and these services. When the app requests user account information, the Gateway routes this request to the appropriate service, handles authentication, aggregates data from different services if needed, and 
- Key claims: See summary
- Learner-relevant: Core system design concept

### Key Differences:

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h2-key-differences]]`
- Summary: Focus : Load balancers are focused on distributing traffic to prevent overloading servers and ensure high availability and redundancy. API Gateways are more about providing a central point for managing, securing, and routing API calls. Functionality : While both can route requests, the API Gateway offers more functionalities like API transformation, composition, and security.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Is it Possible to Use a Load Balancer and an API Gateway Together?

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h2-is-it-possible-to-use-a-load-balancer-and-an-api-gateway-together]]`
- Summary: Yes, you can use a Load Balancer and an API Gateway together in a system architecture, and they often complement each other in managing traffic and providing efficient service delivery. The typical arrangement is to place the Load Balancer in front of the API Gateway, but the actual setup can vary based on specific requirements and architecture decisions. Here’s how they can work together:
- Key claims: See summary
- Learner-relevant: Core system design concept

### Load Balancer Before API Gateway

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h3-load-balancer-before-api-gateway]]`
- Summary: Most Common Setup : The Load Balancer is placed in front of the API Gateway. This is the typical configuration in many architectures. Functionality : The Load Balancer distributes incoming traffic across multiple instances of the API Gateway, ensuring that no single gateway instance becomes a bottleneck. Benefits : High Availability : This setup enhances the availability and reliability of the API
- Key claims: See summary
- Learner-relevant: Core system design concept

### Load Balancer After API Gateway

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h3-load-balancer-after-api-gateway]]`
- Summary: Alternative Configuration : In some cases, the API Gateway can be placed in front of the Load Balancer, especially when the Load Balancer is used to distribute traffic to various microservices or backend services. Functionality : The API Gateway first processes and routes the request to an internal Load Balancer, which then distributes the request to the appropriate service instances. Use Case : U
- Key claims: See summary
- Learner-relevant: Core system design concept

### Combination of Both

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h3-combination-of-both]]`
- Summary: Hybrid Approach : Some architectures might have Load Balancers at both ends – before and after the API Gateway. Reasoning : External traffic is first balanced across API Gateway instances for initial processing (authentication, rate limiting, etc.), and then further balanced among microservices or backend services.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Conclusion:

- Locator: `[[sources/system-design/completed/20260825_030 Load Balancer vs API Gateway.html#h2-conclusion]]`
- Summary: In a complex web architecture: A Load Balancer would be used to distribute incoming traffic across multiple servers or services, enhancing performance and reliability. An API Gateway would be the entry point for clients to interact with your backend APIs or microservices, providing a unified interface, handling various cross-cutting concerns, and reducing the complexity for the client applications
- Key claims: See summary
- Learner-relevant: Core system design concept

