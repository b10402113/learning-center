---
source: 022 Heartbeat
source_lines: 14
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 022 Heartbeat

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- In a distributed environment, work/data is distributed among servers. To efficiently route requests in such a setup, servers need to know what other servers are part of the system. Furthermore, server
- Each server periodically sends a heartbeat message to a central monitoring server or other servers in the system to show that it is still alive and functioning.
- Heartbeating is one of the mechanisms for detecting failures in a distributed system. If there is a central server, all servers periodically send a heartbeat message to it. If there is no central serv

## Sections (L2)

### Background

- Locator: `[[sources/system-design/completed/20260825_022 Heartbeat.html#h2-background]]`
- Summary: In a distributed environment, work/data is distributed among servers. To efficiently route requests in such a setup, servers need to know what other servers are part of the system. Furthermore, servers should know if other servers are alive and working. In a decentralized system, whenever a request arrives at a server, the server should have enough information to decide which server is responsible
- Key claims: See summary
- Learner-relevant: Core system design concept

### Solution

- Locator: `[[sources/system-design/completed/20260825_022 Heartbeat.html#h2-solution]]`
- Summary: Each server periodically sends a heartbeat message to a central monitoring server or other servers in the system to show that it is still alive and functioning. Heartbeating is one of the mechanisms for detecting failures in a distributed system. If there is a central server, all servers periodically send a heartbeat message to it. If there is no central server, all servers randomly choose a set o
- Key claims: If there is a central server, all servers periodically send a heartbeat message to it
- Learner-relevant: Core system design concept

