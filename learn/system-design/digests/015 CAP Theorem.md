---
source: 015 CAP Theorem
source_hash: fd7939143022a7a0f8a3ebd1c7e9a5d63f6aca03a107b2e893a544779c09aa48
source_lines: 17
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 015 CAP Theorem

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- In distributed systems, different types of failures can occur, e.g., servers can crash or fail permanently, disks can go bad resulting in data losses, or network connection can be lost, making a part 
- CAP theorem states that it is impossible for a distributed system to simultaneously provide all three of the following desirable properties:
- Consistency ( C ): All nodes see the same data at the same time. This means users can read or write from/to any node in the system and will receive the same data. It is equivalent to having a single u

## Sections (L2)

### Background

- Locator: `[[sources/system-design/completed/20260825_015 CAP Theorem.html#h2-background]]`
- Summary: In distributed systems, different types of failures can occur, e.g., servers can crash or fail permanently, disks can go bad resulting in data losses, or network connection can be lost, making a part of the system inaccessible. How can a distributed system model itself to get the maximum benefits out of different resources available?
- Key claims: See summary
- Learner-relevant: Core system design concept

### Solution

- Locator: `[[sources/system-design/completed/20260825_015 CAP Theorem.html#h2-solution]]`
- Summary: CAP theorem states that it is impossible for a distributed system to simultaneously provide all three of the following desirable properties: Consistency ( C ): All nodes see the same data at the same time. This means users can read or write from/to any node in the system and will receive the same data. It is equivalent to having a single up-to-date copy of the data. Availability ( A ): Availabilit
- Key claims: CAP theorem states that it is impossible for a distributed system to simultaneously provide all three of the following desirable properties: Consisten; In simple terms, availability refers to a system's ability to remain accessible even if one or more nodes in the system go down
- Learner-relevant: Core system design concept

