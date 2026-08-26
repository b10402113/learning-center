---
source: 012 Proxies
source_hash: 8316cc99558625354033e9f93a58976c312da13b8b68125bce4079522287fd57
source_lines: 19
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 012 Proxies

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- A proxy server is an intermediate piece of software or hardware that sits between the client and the server. Clients connect to a proxy to make a request for a service like a web page, file, or connec
- Typically, forward proxies are used to cache data, filter requests, log requests, or transform requests (by adding/removing headers, encrypting/decrypting, or compressing a resource).
- A forward proxy can hide the identity of the client from the server by sending requests on behalf of the client.

## Sections (L2)

### What is a proxy server?

- Locator: `[[sources/system-design/completed/20260825_012 Proxies.html#h2-what-is-a-proxy-server]]`
- Summary: A proxy server is an intermediate piece of software or hardware that sits between the client and the server. Clients connect to a proxy to make a request for a service like a web page, file, or connection from the server. Essentially, a proxy server (aka the forward proxy) is a piece of software or hardware that facilitates the request for resources from other servers on behalf of clients, thus an
- Key claims: Essentially, a proxy server (aka the forward proxy) is a piece of software or hardware that facilitates the request for resources from other servers o
- Learner-relevant: Core system design concept

### Reverse Proxy

- Locator: `[[sources/system-design/completed/20260825_012 Proxies.html#h2-reverse-proxy]]`
- Summary: A reverse proxy retrieves resources from one or more servers on behalf of a client. These resources are then returned to the client, appearing as if they originated from the proxy server itself, thus anonymizing the server. Contrary to the forward proxy, which hides the client's identity, a reverse proxy hides the server's identity. A reverse proxy In the above diagram, the reverse proxy hides the
- Key claims: See summary
- Learner-relevant: Core system design concept

### Summary

- Locator: `[[sources/system-design/completed/20260825_012 Proxies.html#h2-summary]]`
- Summary: A proxy is a piece of software or hardware that sits between a client and a server to facilitate traffic. A forward proxy hides the identity of the client, whereas a reverse proxy conceals the identity of the server. So, when you want to protect your clients on your internal network, you should put them behind a forward proxy; on the other hand, when you want to protect your servers, you should pu
- Key claims: A proxy is a piece of software or hardware that sits between a client and a server to facilitate traffic; Previous Indexes Next Redundancy and Replication Mark as Completed On this page What is a proxy server
- Learner-relevant: Core system design concept

