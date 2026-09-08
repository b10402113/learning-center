---
source: 044 Token Bucket vs Leaky Bucket
source_hash: fcee24f388f75796ef9ed9d7d3debb6ff6d5daa69c59a6010564a87d744ae34f
source_lines: 61
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 044 Token Bucket vs Leaky Bucket

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Token Bucket and Leaky Bucket are two algorithms used for network traffic shaping and rate limiting. They help manage the rate of traffic flow in a network, but they do so in slightly different ways.
- Choosing between Token Bucket and Leaky Bucket depends on the specific requirements for traffic management in a network. Token Bucket offers more flexibility and is better suited for bursty traffic sc
- PreviousHybrid Cloud Storage vs All-Cloud StorageNextRead Heavy vs Write Heavy SystemMark as CompletedOn this pageToken Bucket Algorithm

## Sections (L2)

### Token Bucket Algorithm

- Locator: `[[sources/system-design/completed/20260825_044 Token Bucket vs Leaky Bucket.html#h2-token-bucket-algorithm]]`
- Summary: Mechanism : The token bucket algorithm is based on tokens being added to a bucket at a fixed rate. Each token represents permission to send a certain amount of data. When a packet (data) needs to be sent, it can only be transmitted if there is a token available, which is then removed from the bucket. Characteristics : Burst Allowance : Can handle bursty traffic because the bucket can store tokens,
- Key claims: When a packet (data) needs to be sent, it can only be transmitted if there is a token available, which is then removed from the bucket; The service allows data bursts for fast initial streaming (buffering) as long as tokens are available in the bucket
- Learner-relevant: Core system design concept

### Leaky Bucket Algorithm

- Locator: `[[sources/system-design/completed/20260825_044 Token Bucket vs Leaky Bucket.html#h2-leaky-bucket-algorithm]]`
- Summary: Mechanism : In the leaky bucket algorithm, packets are added to a queue (bucket), and they are released at a steady, constant rate. If the bucket (buffer) is full, incoming packets are discarded or queued for later transmission. Characteristics : Smooth Traffic : Ensures a steady, uniform output rate regardless of the input burstiness. Overflow : Can result in packet loss if the bucket overflows. 
- Key claims: Characteristics : Smooth Traffic : Ensures a steady, uniform output rate regardless of the input burstiness; Ensures a steady, consistent flow of traffic
- Learner-relevant: Core system design concept

### Key Differences

- Locator: `[[sources/system-design/completed/20260825_044 Token Bucket vs Leaky Bucket.html#h2-key-differences]]`
- Summary: Traffic Burst Handling : Token bucket allows for bursts of data until the bucket's tokens are exhausted, making it suitable for applications where such bursts are common. In contrast, the leaky bucket smooths out the data flow, releasing packets at a steady, constant rate. Use Cases : Token bucket is ideal for applications that require flexibility and can tolerate bursts, like video streaming. Lea
- Key claims: Traffic Burst Handling : Token bucket allows for bursts of data until the bucket's tokens are exhausted, making it suitable for applications where suc
- Learner-relevant: Core system design concept

### Conclusion

- Locator: `[[sources/system-design/completed/20260825_044 Token Bucket vs Leaky Bucket.html#h2-conclusion]]`
- Summary: Choosing between Token Bucket and Leaky Bucket depends on the specific requirements for traffic management in a network. Token Bucket offers more flexibility and is better suited for bursty traffic scenarios, while Leaky Bucket is ideal for maintaining a uniform output rate. Previous Hybrid Cloud Storage vs All-Cloud Storage Next Read Heavy vs Write Heavy System Mark as Completed On this page Toke
- Key claims: Previous Hybrid Cloud Storage vs All-Cloud Storage Next Read Heavy vs Write Heavy System Mark as Completed On this page Token Bucket Algorithm Leaky B
- Learner-relevant: Core system design concept

