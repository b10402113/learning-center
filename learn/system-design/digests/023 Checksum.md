---
source: 023 Checksum
source_hash: 8bf1c3935dcc8311f0b808df9afe266faf21ed3114e08cda225fb5c09d8b4e34
source_lines: 15
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 023 Checksum

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- In a distributed system, while moving data between components, it is possible that the data fetched from a node may arrive corrupted. This corruption can occur because of faults in a storage device, n
- Calculate a checksum and store it with data.
- To calculate a checksum, a cryptographic hash function like MD5, SHA-1, SHA-256, or SHA-512 is used. The hash function takes the input data and produces a string (containing letters and numbers) of fi

## Sections (L2)

### Background

- Locator: `[[sources/system-design/completed/20260825_023 Checksum.html#h2-background]]`
- Summary: In a distributed system, while moving data between components, it is possible that the data fetched from a node may arrive corrupted. This corruption can occur because of faults in a storage device, network, software, etc. How can a distributed system ensure data integrity, so that the client receives an error instead of corrupt data?
- Key claims: See summary
- Learner-relevant: Core system design concept

### Solution

- Locator: `[[sources/system-design/completed/20260825_023 Checksum.html#h2-solution]]`
- Summary: Calculate a checksum and store it with data. To calculate a checksum, a cryptographic hash function like MD5, SHA-1, SHA-256, or SHA-512 is used. The hash function takes the input data and produces a string (containing letters and numbers) of fixed length; this string is called the checksum. When a system is storing some data, it computes a checksum of the data and stores the checksum with the dat
- Key claims: Previous Heartbeat Next Quiz Mark as Completed On this page Background Solution What is a System Design Interview
- Learner-relevant: Core system design concept

