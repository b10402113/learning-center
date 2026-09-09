---
source: 010 Data Partitioning
source_lines: 45
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 010 Data Partitioning

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Data partitioning is process of dividing a large database (DB) into smaller, more manageable parts called partitions or shards. Each partition is independent and contains a subset of the overall data.
- In data partitioning, the dataset is typically partitioned based on a certain criterion, such as data range, data size, or data type. Each partition is then assigned to a separate processing node, whi
- Data partitioning can help improve performance and scalability of large-scale data processing applications, as it allows processing to be distributed across multiple nodes, minimizing data transfer an

## Sections (L2)

### 1. Partitioning Methods

- Locator: `[[sources/system-design/completed/20260825_010 Data Partitioning.html#h2-1-partitioning-methods]]`
- Summary: Designing an effective partitioning scheme can be challenging and requires careful consideration of the application requirements and the characteristics of the data being processed. Below are three of the most popular schemes used by various large-scale applications. a. Horizontal Partitioning: Also known as sharding, horizontal data partitioning involves dividing a database table into multiple pa
- Key claims: Each shard is typically assigned to a different database server, which allows for parallel processing and faster query execution times
- Learner-relevant: Core system design concept

### 2. Partitioning Criteria

- Locator: `[[sources/system-design/completed/20260825_010 Data Partitioning.html#h2-2-partitioning-criteria]]`
- Summary: Data partitioning criteria are the factors or characteristics of data that can be used to divide a large dataset into smaller parts or partitions. Here are some of the most common criteria used for data partitioning: a. Key or Hash-based Partitioning: Under this scheme, we apply a hash function to some key attributes of the entity we are storing; that yields the partition number. For example, if w
- Key claims: For example, if we have 100 DB servers and our ID is a numeric value that gets incremented by one each time a new record is inserted
- Learner-relevant: Core system design concept

### 3. Common Problems of Data Partitioning

- Locator: `[[sources/system-design/completed/20260825_010 Data Partitioning.html#h2-3-common-problems-of-data-partitioning]]`
- Summary: On a partitioned database, there are certain extra constraints on the different operations that can be performed. Most of these constraints are due to the fact that operations across multiple tables or multiple rows in the same table will no longer run on the same server. Below are some of the constraints and additional complexities introduced by Partitioning: a. Joins and Denormalization: Perform
- Key claims: See summary
- Learner-relevant: Core system design concept

