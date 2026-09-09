---
source: Designing Data-Intensive Applications
source_lines: 26464
part: 3
created: 2026-08-24
updated: 2026-08-24
---

# Part Digest: Chapters 5–6

## Sections (L2)

### Synchronous Versus Asynchronous Replication
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Synchronous Versus Asynchronous Replication]]`
- Summary: Explains the trade-off between synchronous replication (follower must confirm before write is visible) and asynchronous replication (leader writes without waiting). Introduces semi-synchronous as a practical middle ground.
- Key claims: Synchronous replication guarantees consistency but blocks writes if the follower is unavailable; fully asynchronous replication can lose data on leader failure; semi-synchronous keeps at least one follower synchronous to ensure durability.
- Learner-relevant: Understands why distributed databases trade durability for availability and why "eventually consistent" is a design choice, not a bug.

### Research on Replication
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Research on Replication]]`
- Summary: Brief note connecting replication consistency to consensus theory (Chapter 9), mentioning chain replication as a synchronous variant.
- Key claims: Consistency of replication has a strong connection to consensus; chain replication has been implemented in systems like Azure Storage.
- Learner-relevant: Sets up the link between practical replication and the theoretical foundations explored later.

### Setting Up New Followers
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Setting Up New Followers]]`
- Summary: Describes the process of adding a new follower without downtime: take a consistent snapshot, copy it, then have the follower catch up via the replication log.
- Key claims: A snapshot must be tied to an exact position in the replication log; practical steps vary by database (PostgreSQL log sequence number, MySQL binlog coordinates).
- Learner-relevant: Shows that adding capacity in a replicated system requires log-ordered snapshots, not just file copies.

### Handling Node Outages
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Handling Node Outages]]`
- Summary: Covers follower failure (catch-up recovery from log) and leader failure (failover): promoting a follower, reconfiguring clients, and the many things that can go wrong.
- Key claims: Failover risks include losing committed writes, split brain, and incorrect timeout settings; some systems require manual intervention to prevent cascading failures.
- Learner-relevant: Appreciates that automated failover is an unsolved problem in many systems and that human-in-the-loop is sometimes safer.

### Implementation of Replication Logs
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Implementation of Replication Logs]]`
- Summary: Describes four mechanisms for propagating writes: statement-based, WAL shipping, logical (row-based) log, and trigger-based replication.
- Key claims: Statement-based replication has nondeterminism pitfalls; WAL shipping is tightly coupled to storage engine; logical logs decouple replication from storage; trigger-based replication is the most flexible but highest overhead.
- Learner-relevant: Recognizes that the choice of replication log format affects compatibility, operability, and the ability to support heterogeneous systems.

### Problems with Replication Lag
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Problems with Replication Lag]]`
- Summary: Introduces the three anomalies caused by asynchronous replication: reading your own writes (stale after write), monotonic reads (time appears to go backward), and consistent prefix reads (causality violations).
- Key claims: Eventual consistency is deliberately vague with no bound on lag; read-after-write consistency, monotonic reads, and consistent prefix reads are the three key consistency models for replication lag.
- Learner-relevant: Names the exact anomalies that applications must guard against when reading from asynchronous followers.

### Reading Your Own Writes
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Reading Your Own Writes]]`
- Summary: Users may not see their own updates after submitting them if reading from a lagging follower. Solutions include reading from the leader for recent writes, tracking last-update timestamps, or waiting for the replica to catch up.
- Key claims: Read-after-write consistency guarantees a user sees their own submissions; cross-device consistency adds complexity because metadata must be centralized.
- Learner-relevant: A concrete design pattern for web applications with user-generated content.

### Monotonic Reads
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Monotonic Reads]]`
- Summary: Users should never see data moving backward in time. Achieved by routing each user's reads to a single replica (e.g., via user-ID hash).
- Key claims: Monotonic reads is weaker than strong consistency but stronger than eventual consistency; routing by user ID prevents the anomaly.
- Learner-relevant: A simple, practical consistency guarantee that avoids the most confusing user-visible anomaly.

### Consistent Prefix Reads
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Consistent Prefix Reads]]`
- Summary: Causally related writes must be seen in order. If partitions operate independently, there is no global write ordering, so readers may see answers before questions.
- Key claims: Consistent prefix reads prevent causality violations; in partitioned databases, different partitions have no global ordering, making this harder.
- Learner-relevant: Highlights the interaction between partitioning (Chapter 6) and replication consistency.

### Solutions for Replication Lag
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Solutions for Replication Lag]]`
- Summary: Argues that application-level workarounds for replication lag are fragile; transactions exist to let databases provide stronger guarantees, and abandoning them is not always justified.
- Key claims: Pretending replication is synchronous when it isn't is a recipe for problems; single-node transactions have existed for decades; distributed transactions are discussed in Chapters 7 and 9.
- Learner-relevant: Frames the rest of Part II — transactions and consensus are the proper tools for strong consistency, not application hacks.

### Multi-Leader Replication
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Multi-Leader Replication]]`
- Summary: Extends single-leader replication to allow multiple nodes to accept writes, each acting as a follower to the others. Necessary when writes must be accepted locally despite network partitions.
- Key claims: Multi-leader replication is rarely beneficial within a single datacenter; it shines in multi-datacenter, offline, and collaborative editing scenarios; conflict resolution is the major challenge.
- Learner-relevant: Understands the architectural trade-off — better availability and local latency at the cost of conflict resolution complexity.

### Use Cases for Multi-Leader Replication
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Use Cases for Multi-Leader Replication]]`
- Summary: Three use cases: multi-datacenter operation (local writes, async cross-DC replication), offline-capable clients (each device is a leader), and collaborative editing (each keystroke is a write).
- Key claims: Multi-leader replication between datacenters improves write performance and tolerates DC outages and network problems; offline and collaborative editing are extreme forms of the same pattern.
- Learner-relevant: Identifies the real-world scenarios where multi-leader is the only viable option.

### Handling Write Conflicts
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Handling Write Conflicts]]`
- Summary: The core problem of multi-leader replication — concurrent writes to the same record create conflicts. Covers conflict avoidance, convergent resolution (LWW, merge, CRDTs), and custom conflict handlers.
- Key claims: Conflict detection is typically asynchronous (too late to ask the user); last write wins (LWW) is popular but loses data; CRDTs and operational transformation are promising automatic resolution approaches.
- Learner-relevant: Names the three strategies for handling conflicts (avoid, converge, custom) and the pitfalls of each.

### Multi-Leader Replication Topologies
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Multi-Leader Replication Topologies]]`
- Summary: Describes circular, star, and all-to-all topologies. Circular/star topologies have single points of failure; all-to-all has better fault tolerance but can reorder writes, requiring version vectors for causal ordering.
- Key claims: All-to-all is the most general topology but can cause causality problems; circular and star topologies are simpler but fragile; version vectors are needed to detect concurrent writes.
- Learner-relevant: Connects topology choice to fault tolerance and the need for causal ordering mechanisms.

### Leaderless Replication
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Leaderless Replication]]`
- Summary: Clients write to and read from multiple replicas directly, with no single leader. Inspired by Amazon's Dynamo; used by Riak, Cassandra, and Voldemort.
- Key claims: Leaderless replication eliminates the single leader bottleneck; writes succeed if a quorum of replicas is available; read repair and anti-entropy keep replicas in sync.
- Learner-relevant: A fundamentally different replication model that trades strong consistency for availability.

### Writing to the Database When a Node Is Down
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Writing to the Database When a Node Is Down]]`
- Summary: In a leaderless system, the client writes to all replicas in parallel; if some are down, writes to the available ones still succeed. On read, stale values are detected via version numbers.
- Key claims: Quorum writes ensure the write is durable even if some replicas are unavailable; version numbers allow detecting stale data on read.
- Learner-relevant: Shows how leaderless systems achieve write availability without failover.

### Read Repair and Anti-Entropy
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Read Repair and Anti-Entropy]]`
- Summary: Two mechanisms for bringing replicas back in sync: read repair (client writes back newer values detected during reads) and anti-entropy (background process copies missing data).
- Key claims: Read repair works well for frequently read values; without anti-entropy, rarely-read values may become permanently stale on some replicas.
- Learner-relevant: Understands that replica convergence is lazy, not eager, in leaderless systems.

### Quorums for Reading and Writing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Quorums for Reading and Writing]]`
- Summary: Defines the quorum condition w + r > n: if every write is confirmed by w replicas and every read queries r replicas, at least one read replica must have the latest write.
- Key claims: The quorum condition w + r > n ensures that read and write sets overlap; w and r are configurable to trade consistency for latency/availability; n, w, r are the fundamental tuning knobs.
- Learner-relevant: The mathematical foundation of quorum-based consistency — the single most important formula in leaderless replication.

### Limitations of Quorum Consistency
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Limitations of Quorum Consistency]]`
- Summary: Even with w + r > n, edge cases exist: sloppy quorums break the overlap guarantee, concurrent writes create ambiguity, partial failures cause inconsistency, and clock skew undermines LWW.
- Key claims: Dynamo-style databases are optimized for eventual consistency, not strong guarantees; the anomalies from "Problems with Replication Lag" still apply; stronger guarantees require transactions or consensus.
- Learner-relevant: Prevents over-reliance on quorum parameters as a substitute for proper consistency guarantees.

### Sloppy Quorums and Hinted Handoff
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Sloppy Quorums and Hinted Handoff]]`
- Summary: When the designated n nodes for a value are unreachable, writes are accepted by other available nodes (sloppy quorum) and forwarded later (hinted handoff). Increases write availability at the cost of read consistency.
- Key claims: A sloppy quorum is only a durability guarantee, not a quorum in the traditional sense; the hinted handoff restores the value to its home node once connectivity is restored.
- Learner-relevant: Distinguishes between availability-oriented and consistency-oriented quorum designs.

### Detecting Concurrent Writes
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Detecting Concurrent Writes]]`
- Summary: In leaderless and multi-leader systems, concurrent writes to the same key create conflicts. Covers LWW (data loss), the happens-before relationship, version vectors, and merging sibling values.
- Key claims: Two operations are concurrent if neither happens before the other; version vectors distinguish concurrent writes from causal dependencies; merging siblings is the same problem as multi-leader conflict resolution; CRDTs can automate merging.
- Learner-relevant: The formal framework for understanding concurrency in distributed systems — happens-before, version vectors, and sibling merging.

### Summary (Chapter 5)
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 5: Replication > Summary]]`
- Summary: Recaps the three replication approaches (single-leader, multi-leader, leaderless), the trade-offs of sync vs. async, the consistency models for replication lag, and the concurrency challenges.
- Key claims: Single-leader is easiest to understand; multi-leader and leaderless trade consistency for robustness; the choice depends on the application's tolerance for stale reads and conflict resolution.
- Learner-relevant: Synthesizes the chapter into a decision framework for choosing a replication strategy.

---

### Partitioning and Replication
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Partitioning and Replication]]`
- Summary: Partitioning is usually combined with replication — copies of each partition live on multiple nodes for fault tolerance. Each node may be leader for some partitions and follower for others.
- Key claims: Partitioning is for scalability; replication is for fault tolerance; the two are orthogonal and can be combined independently.
- Learner-relevant: Establishes that partitioning and replication are complementary, not competing, strategies.

### Partitioning of Key-Value Data
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Partitioning of Key-Value Data]]`
- Summary: The goal is to spread data and query load evenly across nodes. Skewed partitioning (hot spots) undermines scalability. Random assignment avoids hot spots but makes lookups impossible without querying all nodes.
- Key claims: Skew makes partitioning ineffective; a hot spot is a partition with disproportionately high load; the ideal partitioning scheme distributes both data and queries evenly.
- Learner-relevant: Frames the fundamental challenge of partitioning — even distribution — before diving into specific strategies.

### Partitioning by Key Range
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Partitioning by Key Range]]`
- Summary: Assigns contiguous key ranges to partitions (like an encyclopedia). Enables efficient range scans but risks hot spots when keys are sequentially assigned (e.g., timestamps).
- Key claims: Key range partitioning supports range queries and concatenated indexes; partition boundaries must adapt to data distribution; timestamp-based keys cause all writes to hit the latest partition.
- Learner-relevant: Understands when range partitioning works (sensor data with composite keys) and when it fails (monotonically increasing keys).

### Partitioning by Hash of Key
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Partitioning by Hash of Key]]`
- Summary: Uses a hash function to distribute keys uniformly across partitions, eliminating hot spots but destroying the sort order needed for range queries.
- Key claims: Hash partitioning distributes keys evenly but makes range queries expensive (scatter/gather across all partitions); Cassandra's compound primary key is a hybrid: hash the first column for partitioning, sort by the remaining columns within a partition.
- Learner-relevant: The core trade-off of partitioning: even distribution vs. range query efficiency.

### Consistent Hashing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Consistent Hashing]]`
- Summary: Clarifies that "consistent hashing" as used in databases is a misleading term — it refers to hash partitioning with random boundaries, not the original CDN caching algorithm. Recommends avoiding the term.
- Key claims: The term "consistent hashing" is confusing because it has nothing to do with consistency guarantees; most database documentation uses it inaccurately; "hash partitioning" is clearer.
- Learner-relevant: Corrects a widespread terminological confusion that trips up many practitioners.

### Skewed Workloads and Relieving Hot Spots
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Skewed Workloads and Relieving Hot Spots]]`
- Summary: Even with hash partitioning, a single very hot key (e.g., a celebrity's profile) creates a hot spot. The application can split writes by appending a random number, but reads must then merge results.
- Key claims: Hashing cannot eliminate hot spots for a single very hot key; application-level splitting (random suffix) distributes writes but complicates reads and requires tracking which keys are split.
- Learner-relevant: Shows that partitioning is not a silver bullet — some hot spots require application-level intervention.

### Partitioning and Secondary Indexes
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Partitioning and Secondary Indexes]]`
- Summary: Secondary indexes don't map neatly to partitions. Two approaches exist: document-partitioned (local) and term-partitioned (global), each with different trade-offs for reads and writes.
- Key claims: Document-partitioned indexes are local (one per partition) but require scatter/gather on reads; term-partitioned indexes are global (partitioned by indexed value) but slow down writes.
- Learner-relevant: The fundamental trade-off in secondary index design for partitioned databases.

### Partitioning Secondary Indexes by Document
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Partitioning Secondary Indexes by Document]]`
- Summary: Each partition maintains its own secondary index covering only its documents. Writes go to a single partition, but reads require scatter/gather across all partitions.
- Key claims: Document-partitioned (local) indexes are simple to write to but expensive to read from; scatter/gather is prone to tail latency amplification; widely used (MongoDB, Riak, Cassandra, Elasticsearch).
- Learner-relevant: Understands why multi-index queries in partitioned databases can be expensive.

### Partitioning Secondary Indexes by Term
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Partitioning Secondary Indexes by Term]]`
- Summary: A global index partitioned by the indexed value. Reads are efficient (single partition), but writes may affect multiple index partitions, requiring distributed transactions or async propagation.
- Key claims: Term-partitioned indexes improve read performance but complicate writes; updates are often asynchronous, introducing propagation delays; Amazon DynamoDB uses global secondary indexes with eventual consistency.
- Learner-relevant: Understands the inverse trade-off from document-partitioned indexes.

### Rebalancing Partitions
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Rebalancing Partitions]]`
- Summary: As data grows or nodes fail, partitions must be moved between nodes. Three goals: fair load distribution, continued availability during rebalancing, and minimal data movement.
- Key claims: Rebalancing must meet three requirements: fairness, availability during transfer, and minimal data movement; the choice of rebalancing strategy depends on the partitioning scheme.
- Learner-relevant: Rebalancing is a critical operational concern that affects every partitioned database.

### Fixed Number of Partitions
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Fixed Number of Partitions]]`
- Summary: Create many more partitions than nodes (e.g., 1000 partitions for 10 nodes); assign several partitions per node. When nodes are added or removed, partitions are moved between nodes.
- Key claims: The number of partitions is fixed at database setup and determines the maximum cluster size; rebalancing moves whole partitions, not individual keys; used by Riak, Elasticsearch, Couchbase, Voldemort.
- Learner-relevant: The most common rebalancing strategy — simple and operationally predictable.

### Dynamic Partitioning
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Dynamic Partitioning]]`
- Summary: Partitions split when they grow too large and merge when they shrink. Adapts the number of partitions to the data volume, avoiding both oversized and undersized partitions.
- Key claims: Dynamic partitioning is natural for key-range partitioning (HBase, RethinkDB); an empty database starts with a single partition, creating a temporary hot spot; pre-splitting mitigates the cold-start problem.
- Learner-relevant: Shows how databases avoid the "right number of partitions" problem by adjusting dynamically.

### Partitioning Proportionally to Nodes
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Partitioning Proportionally to Nodes]]`
- Summary: The number of partitions is proportional to the number of nodes (fixed partitions per node). New nodes split existing partitions and take one half. Used by Cassandra.
- Key claims: Each node owns a fixed number of partitions (Cassandra default: 256); rebalancing is done by splitting random partitions; randomization can produce unfair splits but averages out over many partitions.
- Learner-relevant: A third rebalancing strategy that keeps partition size stable as the cluster grows.

### Operations: Automatic or Manual Rebalancing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Operations: Automatic or Manual Rebalancing]]`
- Summary: Fully automated rebalancing is convenient but risky — an overloaded node can trigger cascading failures. A human in the loop is slower but safer.
- Key claims: Automatic failure detection + automatic rebalancing can cause cascading failures; many systems use a middle ground (auto-propose, human-commit).
- Learner-relevant: Operational wisdom — automation is not always better, especially for expensive operations like rebalancing.

### Request Routing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Request Routing]]`
- Summary: When a client wants to read or write a key, how does it know which node to contact? Three approaches: any-node + forwarding, routing tier, or client-aware routing. Many systems use ZooKeeper for partition metadata.
- Key claims: The core problem is keeping routing information consistent as partitions move; ZooKeeper is widely used for cluster metadata (HBase, SolrCloud, Kafka); Cassandra and Riak use gossip protocols instead.
- Learner-relevant: The service discovery problem that every distributed database must solve.

### Parallel Query Execution
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Parallel Query Execution]]`
- Summary: MPP databases break complex queries into stages that execute in parallel across partitions, especially beneficial for analytics workloads with joins and aggregations.
- Key claims: MPP query optimizers decompose complex queries for parallel execution; parallel query execution is a specialized topic explored further in Chapter 10.
- Learner-relevant: Acknowledges that partitioned databases support more than simple key lookups — complex analytical queries can be parallelized.

### Summary (Chapter 6)
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 6: Partitioning > Summary]]`
- Summary: Recaps the two main partitioning approaches (key range vs. hash), the secondary index strategies (document-partitioned vs. term-partitioned), and the rebalancing and routing techniques.
- Key claims: Key range partitioning supports range queries but risks hot spots; hash partitioning distributes evenly but kills range queries; secondary indexes add a second dimension of partitioning trade-offs.
- Learner-relevant: Synthesizes the chapter into a decision framework for choosing a partitioning strategy.
