---
source: 018 LongPolling vs WebSockets vs ServerSent Events
source_hash: 2bad6f0f8530e18f2f2460d4ee154379e3a86fd16fe6e140f617be7307be1d1e
source_lines: 45
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 018 LongPolling vs WebSockets vs ServerSent Events

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Long-Polling, WebSockets, and Server-Sent Events are popular communication protocols between a client like a web browser and a web server. First, let’s start with understanding what a standard HTTP we
- Polling is a standard technique used by the vast majority of AJAX applications. The basic idea is that the client repeatedly polls (or requests) a server for data. The client makes a request and waits
- The problem with Polling is that the client has to keep asking the server for any new data. As a result, a lot of responses are empty, creating HTTP overhead.

## Sections (L2)

### Ajax Polling

- Locator: `[[sources/system-design/completed/20260825_018 LongPolling vs WebSockets vs ServerSent Events.html#h2-ajax-polling]]`
- Summary: Polling is a standard technique used by the vast majority of AJAX applications. The basic idea is that the client repeatedly polls (or requests) a server for data. The client makes a request and waits for the server to respond with data. If no data is available, an empty response is returned. The client opens a connection and requests data from the server using regular HTTP. The requested webpage 
- Key claims: Polling is a standard technique used by the vast majority of AJAX applications
- Learner-relevant: Core system design concept

### HTTP Long-Polling

- Locator: `[[sources/system-design/completed/20260825_018 LongPolling vs WebSockets vs ServerSent Events.html#h2-http-long-polling]]`
- Summary: This is a variation of the traditional polling technique that allows the server to push information to a client whenever the data is available. With Long-Polling, the client requests information from the server exactly as in normal polling, but with the expectation that the server may not respond immediately. That’s why this technique is sometimes referred to as a "Hanging GET". If the server does
- Key claims: This is a variation of the traditional polling technique that allows the server to push information to a client whenever the data is available
- Learner-relevant: Core system design concept

### WebSockets

- Locator: `[[sources/system-design/completed/20260825_018 LongPolling vs WebSockets vs ServerSent Events.html#h2-websockets]]`
- Summary: WebSocket provides Full duplex communication channels over a single TCP connection. It provides a persistent connection between a client and a server that both parties can use to start sending data at any time. The client establishes a WebSocket connection through a process known as the WebSocket handshake. If the process succeeds, then the server and client can exchange data in both directions at
- Key claims: WebSocket provides Full duplex communication channels over a single TCP connection; It provides a persistent connection between a client and a server that both parties can use to start sending data at any time
- Learner-relevant: Core system design concept

### Server-Sent Events (SSEs)

- Locator: `[[sources/system-design/completed/20260825_018 LongPolling vs WebSockets vs ServerSent Events.html#h2-server-sent-events-sses]]`
- Summary: Under SSEs the client establishes a persistent and long-term connection with the server. The server uses this connection to send data to a client. If the client wants to send data to the server, it would require the use of another technology/protocol to do so. Client requests data from a server using regular HTTP. The requested webpage opens a connection to the server. The server sends the data to
- Key claims: See summary
- Learner-relevant: Core system design concept

