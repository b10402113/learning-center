---
source: Designing Data-Intensive Applications
source_lines: 26464
part: 5b
created: 2026-08-24
updated: 2026-08-24
---

## Sections (L2)

### Transmitting Event Streams
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Transmitting Event Streams]]`
- Summary: Introduces the fundamental concept of event streams and the messaging infrastructure needed to transmit them from producers to consumers. Contrasts polling-based approaches (batch-style) with push-based notification systems.
- Key claims: Databases are poor at event notification; specialized messaging tools are needed; polling becomes expensive as frequency increases; direct database triggers are limited.
- Learner-relevant: Establishes the mental model for why streaming systems exist as a category distinct from databases and batch processors.

### Messaging Systems
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Messaging Systems]]`
- Summary: Covers the publish/subscribe model where producers push events to consumers via a messaging layer. Introduces two key design questions: handling backpressure (drop, buffer, or block) and durability guarantees on crash.
- Key claims: Three options when producers outpace consumers—drop messages, buffer in a queue, or apply backpressure; durability requires disk/replication at a cost; lost sensor readings are tolerable but lost counter events are not; batch processing provides automatic retry and idempotent output that messaging should emulate.
- Learner-relevant: Provides the taxonomy for evaluating any message broker; frames the reliability vs. throughput trade-off.

### Direct Messaging from Producers to Consumers
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Direct messaging from producers to consumers]]`
- Summary: Describes messaging patterns where producers communicate directly with consumers over the network without an intermediary broker: UDP multicast, brokerless libraries (ZeroMQ, nanomsg), UDP-based metrics (StatsD, Brubeck), and HTTP/webhook push.
- Key claims: Direct messaging is low-latency but fragile; application code must handle message loss; producers and consumers must be mostly online; producer crashes lose retry buffers.
- Learner-relevant: Understands the fragility of brokerless approaches and why most systems need a broker for durability.

### Message Brokers
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Message brokers]]`
- Summary: A message broker is a database optimized for streaming—it centralizes message storage, tolerates client disconnection/crash, and decouples producers from consumers asynchronously.
- Key claims: Brokers accept messages and hold them until consumed; delivery is asynchronous; brokers may or may not persist to disk; unbonded queueing is the default面对 slow consumers.
- Learner-relevant: Understands the broker as a durable intermediary that solves the fragility of direct messaging.

### Message Brokers Compared to Databases
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Message brokers compared to databases]]`
- Summary: Systematically contrasts message brokers (AMQP/JMS) with databases across four dimensions: data lifetime, working-set assumptions, query mechanisms, and notification vs. snapshot semantics.
- Key claims: Brokers auto-delete messages after delivery (not long-term storage); assume small working sets; support topic subscriptions not arbitrary queries; notify on data change rather than returning point-in-time snapshots.
- Learner-relevant: Clarifies the boundary between a message broker and a database; shows why log-based brokers blur this line.

### Multiple Consumers
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Multiple consumers]]`
- Summary: Two patterns for multi-consumer topics: load balancing (each message to one consumer, parallelizing work) and fan-out (each message to all consumers, enabling independent processing).
- Key claims: Load balancing distributes expensive processing across consumers; fan-out enables multiple independent consumers reading the same stream; the two patterns can be combined with consumer groups.
- Learner-relevant: The load-balancing/fan-out distinction is the foundation for understanding Kafka consumer groups and partitioning strategy.

### Acknowledgments and Redelivery
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Acknowledgments and redelivery]]`
- Summary: Explains how brokers ensure message delivery through acknowledgments: a consumer explicitly acknowledges completion, and undelivered messages are retried on crash/timeout. Shows how load balancing + redelivery can reorder messages.
- Key claims: Acknowledgments prevent message loss on consumer crash; redelivery with load balancing causes message reordering (m3/m4 reorder example); a separate queue per consumer avoids reordering; reordering matters when messages have causal dependencies.
- Learner-relevant: The reordering problem under load balancing + redelivery is a key subtlety for understanding why Kafka's partition-assigned model preserves ordering within a partition.

### Partitioned Logs
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Partitioned Logs]]`
- Summary: Introduces the log-based message broker architecture: messages are appended to an append-only log on disk, partitioned across machines for throughput. Each partition assigns monotonically increasing offsets. Examples: Kafka, Kinesis, DistributedLog.
- Key claims: Append-only logs on disk enable high throughput (millions of msgs/sec) via partitioning; partitions are totally ordered but cross-partition order is not guaranteed; durability comes from disk + replication.
- Learner-relevant: This is the architectural foundation of modern streaming (Kafka, Kinesis); understanding partitioned logs is essential for all subsequent streaming concepts.

### Logs Compared to Traditional Messaging
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Logs compared to traditional messaging]]`
- Summary: Compares log-based brokers with AMQP/JMS-style brokers on fan-out, load balancing, ordering, and parallelism trade-offs. Logs support non-destructive fan-out and coarse-grained load balancing by partition.
- Key claims: Logs support non-destructive fan-out naturally; load balancing assigns entire partitions (not individual messages); max parallelism equals number of partitions; head-of-line blocking risk on slow messages; JMS/AMQP is preferable when per-message parallelism and message independence matter.
- Learner-relevant: Explains the fundamental trade-off between partition-based log systems (ordered, high-throughput) and message-queue systems (per-message parallelism, unordered).

### Consumer Offsets
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Consumer offsets]]`
- Summary: Explains how log-based brokers track consumer progress via offsets—analogous to replication log sequence numbers. The broker only needs to store the offset, not per-message acknowledgments.
- Key claims: Offset < current offset = processed; offset > current offset = unseen; periodic offset checkpointing reduces bookkeeping; the broker acts as a leader DB and consumer as a follower; on consumer failover, messages after last offset may be processed twice.
- Learner-relevant: Consumer offsets are the core mechanism for at-least-once delivery in Kafka; understanding them clarifies why exactly-once is hard.

### Disk Space Usage
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Disk space usage]]`
- Summary: Discusses log retention and the bounded circular buffer behavior on disk. Includes a back-of-the-envelope calculation showing a 6 TB drive at 150 MB/s can buffer ~11 hours of max-rate messages.
- Key claims: Old log segments are deleted or archived; throughput remains constant regardless of retention because every message is written to disk; unlike memory-based brokers that slow down when spilling to disk, disk-based logs have constant performance.
- Learner-relevant: The constant-throughput property of disk-based logs is a key operational advantage for predictable streaming performance.

### When Consumers Cannot Keep Up with Producers
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#When consumers cannot keep up with producers]]`
- Summary: In the log-based approach, a slow consumer eventually misses messages when the log's disk buffer is exhausted. This is a bounded-size buffer with disk backing. Monitoring consumer lag allows human intervention before data loss.
- Key claims: Consumer lag can be monitored and alerted on; only the slow consumer is affected (not other consumers or producers); experimental/diagnostic consumers can read production logs without disrupting service; dead consumers stop consuming resources.
- Learner-relevant: Consumer lag monitoring is a critical operational practice; the isolation property makes log-based brokers safe for debugging production streams.

### Replaying Old Messages
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Replaying old messages]]`
- Summary: Unlike AMQP/JMS where acknowledging deletes messages, log-based brokers allow consumers to reset offsets and reprocess old messages—making consuming a read-only operation.
- Key claims: Consumer offset is under the consumer's control and can be reset; reprocessing enables experimentation, bug recovery, and new derived views; log-based messaging is like batch processing with repeatable transformations.
- Learner-relevant: The ability to replay is what makes log-based brokers suitable as a "filesystem for streams" and enables derived data systems to be rebuilt from scratch.

### Databases and Streams
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Databases and Streams]]`
- Summary: Bridges the gap between databases and streams by showing that database writes are events, and replication logs are streams of write events. Introduces the state machine replication principle.
- Key claims: A database write is an event that can be captured and processed; replication logs are streams of write events; state machine replication: same events in same order across replicas yields same final state; the connection between databases and streams is fundamental, not just about physical storage.
- Learner-relevant: This is the conceptual bridge that makes the rest of the chapter possible—understanding that databases and streams are two views of the same data.

### Keeping Systems in Sync
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Keeping Systems in Sync]]`
- Summary: Real applications combine multiple data systems (OLTP DB, cache, search index, data warehouse). Keeping them in sync is hard. Dual writes have race conditions and atomicity problems.
- Key claims: Periodic batch dumps (ETL) are slow; dual writes suffer from race conditions (Figure 11-4: database sees B then A, search index sees A then B, permanently inconsistent); dual writes also face the atomic commit problem; state machine replication works with a single leader.
- Learner-relevant: The dual-write race condition is the core problem that change data capture solves; understanding this motivates the entire CDC/event-sourcing section.

### Change Data Capture (CDC)
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Change Data Capture]]`
- Summary: CDC observes all data changes written to a database and extracts them as a stream, enabling other systems (search index, cache, warehouse) to follow the database as a follower.
- Key claims: CDC makes one database the leader and derived systems the followers; log-based brokers preserve ordering (avoiding the reordering problem); CDC is usually asynchronous (replication lag applies); implementations include Databus, Wormhole, Sherpa, Bottled Water, Maxwell, Debezium, Mongoriver, GoldenGate.
- Learner-relevant: CDC is the primary mechanism for solving the dual-write problem in production; it turns databases into streams that derived systems consume.

### Initial Snapshot
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Initial snapshot]]`
- Summary: When full log history is unavailable, a new derived system must start from a consistent snapshot at a known log offset. CDC tools may integrate this or leave it manual.
- Key claims: Full log history is often impractical (disk space, replay time); snapshot must correspond to a known log offset; rebuilding a full-text index requires a complete database copy.
- Learner-relevant: The snapshot + offset technique is the standard bootstrap procedure for new followers/derived systems.

### Log Compaction
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Log compaction]]`
- Summary: Log compaction periodically discards older values for the same key, keeping only the most recent. This makes the log represent the current state of the database without retaining all history.
- Key claims: Compaction keeps only the latest value per primary key; tombstones (null values) indicate deletions; compacted log disk usage depends on current DB size, not total writes; new consumers can rebuild from offset 0 of a compacted topic; supported by Apache Kafka.
- Learner-relevant: Log compaction is what allows a message broker to serve as durable state storage (not just transient messaging), enabling log-compacted topics in Kafka.

### API Support for Change Streams
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#API support for change streams]]`
- Summary: Increasingly, databases expose change streams as first-class interfaces (RethinkDB, Firebase, CouchDB, Meteor, VoltDB). Kafka Connect integrates CDC tools with Kafka for downstream processing.
- Key claims: Change streams are becoming a native database feature; VoltDB exports committed transactions as a log of tuples; Kafka Connect bridges CDC tools to Kafka for derived data and stream processing.
- Learner-relevant: First-class change streams reduce the need for fragile trigger-based or log-parsing CDC implementations.

### Event Sourcing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Event Sourcing]]`
- Summary: Event sourcing stores all state changes as immutable events in an append-only log, applied at the application level (unlike CDC which operates at the DB level). Events represent user actions, not low-level state mutations.
- Key claims: CDC operates at the database level; event sourcing operates at the application level with immutable, application-meaningful events; event sourcing makes applications easier to evolve, debug, and guard against bugs; similar to chronicle data model and fact tables in star schemas.
- Learner-relevant: Event sourcing is a data modeling technique that pairs naturally with CQRS and log-based brokers.

### Deriving Current State from the Event Log
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Deriving current state from the event log]]`
- Summary: Applications using event sourcing must transform the event log into current state suitable for reads. This transformation should be deterministic. Log compaction differs from CDC: event sourcing events are not overridable by later events, so full history may be needed.
- Key claims: Users want current state, not event history; the transformation from events to state must be deterministic; CDC events override prior values (compaction works); event sourcing events are additive (full history needed); snapshots are a performance optimization, not a substitute.
- Learner-relevant: The distinction between CDC log compaction and event sourcing history is subtle but important for system design.

### Commands and Events
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Commands and events]]`
- Summary: Event sourcing distinguishes commands (requests that may fail validation) from events (validated, immutable facts). Events are generated only after successful validation, typically in a serializable transaction.
- Key claims: Commands are requests that can be rejected; events are facts that cannot be rejected by consumers; validation must happen synchronously before event generation; alternatively, split into tentative + confirmation events for async validation.
- Learner-relevant: The command/event distinction is critical for designing correct event-sourced systems and avoiding invalid events in the log.

### State, Streams, and Immutability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#State, Streams, and Immutability]]`
- Summary: Mutable state and append-only event logs are two sides of the same coin: state is the integral of the event stream over time; the changelog is the derivative of state by time. The log is the source of truth; the database is a cache of the latest log values.
- Key claims: Application state = integral of event stream; changelog = derivative of state by time; mutable state and immutable events do not contradict; Pat Helland: "the database is a cache of a subset of the log."
- Learner-relevant: The state ↔ stream duality is a deep conceptual insight that unifies batch, stream, and database thinking.

### Advantages of Immutable Events
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Advantages of immutable events]]`
- Summary: Immutability provides auditability (accounting ledger analogy), easier debugging/bug recovery, and captures richer information than mutable state (e.g., items added then removed from a cart).
- Key claims: Accountants use append-only ledgers for centuries; bugs that overwrite data are hard to recover from without immutability; removed cart items are lost in mutable DBs but preserved in event logs.
- Learner-relevant: Immutability is not just a streaming concern—it improves auditability, debugging, and analytics across all data systems.

### Deriving Several Views from the Same Event Log
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Deriving several views from the same event log]]`
- Summary: Separating writes (event log) from reads (materialized views) enables multiple read-optimized views from one log. This is CQRS: the event log is write-optimized, views are read-optimized, and normalization/denormalization debates become irrelevant.
- Key claims: Multiple consumers can derive different views from the same log; CQRS separates write and read models; denormalization in read views is fine because the translation layer keeps them consistent; running old and new systems side-by-side is easier than schema migration.
- Learner-relevant: CQRS + event sourcing is a powerful architectural pattern that decouples schema evolution from application deployment.

### Concurrency Control
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Concurrency control]]`
- Summary: Event sourcing simplifies concurrency: self-contained events require only a single atomic append (no multi-object transactions). If event log and state share the same partition, single-threaded log consumers need no concurrency control.
- Key claims: Multi-object transactions often stem from single user actions touching multiple places; event sourcing makes each user action a single append; partitioned log + state enables single-threaded consumption without locking; the log removes concurrency non-determinism by defining a serial order.
- Learner-relevant: Understanding how partitioning eliminates concurrency complexity is key to designing scalable stream processors.

### Limitations of Immutability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Limitations of immutability]]`
- Summary: Immutability is not always feasible: high-churn workloads cause unbounded history growth; privacy regulations (GDPR) may require data deletion; true deletion is hard because copies exist in many places.
- Key claims: High churn + high update rate = prohibitively large immutable history; privacy laws require excision (Datomic) or shunning (Fossil); deletion is "making data harder to retrieve" rather than impossible; compaction and garbage collection are crucial for operational robustness.
- Learner-relevant: The tension between immutability's benefits and real-world deletion requirements is a practical design constraint.

### Processing Streams
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Processing Streams]]`
- Summary: Three uses of streams: (1) write to storage for querying, (2) push events to humans, (3) process streams into derived streams. The chapter focuses on option 3. Stream processors differ from batch because streams never end—sorting, fault tolerance, and joins all change.
- Key claims: Stream processing is like batch processing on unbounded data; streams never end (sorting impossible, fault tolerance cannot restart from beginning); MapReduce dataflow patterns apply; the crucial difference from batch is that a stream is infinite.
- Learner-relevant: The "stream never ends" insight reframes every batch processing concept for the streaming context.

### Complex Event Processing (CEP)
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Complex event processing]]`
- Summary: CEP detects patterns in event streams using declarative queries. The relationship between queries and data is inverted: queries are stored long-term, events flow past them. Implementations: Esper, IBM InfoSphere Streams, Samza with SQL.
- Key claims: CEP is like regex for events; queries are stored, events flow past; the database/CEP inversion: DB stores data transiently, CEP stores queries permanently; CEP engines maintain internal state machines for pattern matching.
- Learner-relevant: CEP is the event-pattern-matching use case; understanding the query/data inversion is conceptually important.

### Stream Analytics
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Stream analytics]]`
- Summary: Stream analytics computes aggregations and statistical metrics over time windows (event rate, rolling averages, trend detection). Often uses probabilistic algorithms (Bloom filters, HyperLogLog, percentile estimation) for memory efficiency.
- Key claims: Analytics focuses on aggregations over time windows, not specific event patterns; probabilistic algorithms are an optimization, not inherent to streaming; frameworks: Storm, Spark Streaming, Flink, Samza, Kafka Streams; hosted: Google Cloud Dataflow, Azure Stream Analytics.
- Learner-relevant: Understanding that probabilistic algorithms are optional (not fundamental) corrects a common misconception about stream processing.

### Maintaining Materialized Views
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Maintaining materialized views]]`
- Summary: Stream processors can maintain materialized views (caches, search indexes, warehouses) by consuming change streams. Unlike analytics windows, view maintenance may require the entire history (window = beginning of time). Samza and Kafka Streams support this via log compaction.
- Key claims: Materialized view maintenance requires all events over arbitrary time periods; log-compacted topics allow rebuilding views from offset 0; Samza and Kafka Streams support long-lived state via Kafka log compaction.
- Learner-relevant: Materialized view maintenance is the "keeping derived systems in sync" use case—the streaming equivalent of ETL.

### Search on Streams
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Search on streams]]`
- Summary: Stream search stores queries and matches documents against them (inverted from traditional search). Used in media monitoring, real-time alerts, and property listing notifications. Elasticsearch percolator is one implementation.
- Key claims: Stream search inverts the traditional index-then-query model; stored queries match against incoming documents; query indexing can optimize matching; Elasticsearch percolator supports this pattern.
- Learner-relevant: The query/document inversion in stream search parallels the CEP inversion and reinforces the "queries as data" mental model.

### Message Passing and RPC
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Message passing and RPC]]`
- Summary: Actor frameworks and RPC-like message passing share messaging infrastructure with stream processing but serve different purposes. Actors are for concurrency/distributed execution; streams are for data management. Crossover exists (Storm distributed RPC, actor-based stream processing).
- Key claims: Actor communication is ephemeral, one-to-one; event logs are durable, multi-subscriber; actors support arbitrary (cyclic) communication; streams are acyclic pipelines; many actor frameworks lack crash-recovery guarantees.
- Learner-relevant: Clarifies the boundary between stream processing and actor/message-passing models—they overlap but serve different architectural concerns.

### Reasoning About Time
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Reasoning About Time]]`
- Summary: Time in streaming is tricky: batch processes use event timestamps deterministically; many stream frameworks use processing time (local system clock), which breaks with processing lag. Event time vs. processing time is a fundamental distinction.
- Key claims: Batch processes use event timestamps for determinism; stream frameworks often use processing time, which introduces artifacts on backlog processing; confusing event time and processing time produces bad data (Figure 11-7: anomalous spike on processor restart).
- Learner-relevant: The event time vs. processing time distinction is the most common source of bugs in stream analytics.

### Event Time versus Processing Time
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Event time versus processing time]]`
- Summary: Processing delays (queuing, network faults, restarts, reprocessing) mean event time and processing time diverge. Messages can arrive out of order. The Star Wars analogy (episodes released in non-narrative order) illustrates the disconnect.
- Key claims: Many causes of delay: queuing, network faults, contention, restarts, reprocessing; out-of-order delivery is common; event timestamps are more meaningful but harder to trust (especially on user devices); processing-time windowing produces artifacts.
- Learner-relevant: Practical examples of why event-time processing is necessary despite being harder to implement.

### Knowing When You're Ready
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Knowing when you're ready]]`
- Summary: When using event-time windows, you can never be certain all events for a window have arrived. Stragglers (delayed events) must be handled by either ignoring them or publishing corrections/retractions.
- Key claims: Window completeness is uncertain; straggler events arrive after window is declared complete; two strategies: ignore stragglers (track as metric) or publish corrections with retraction; watermarks ("no more messages before t") help but require per-producer tracking.
- Learner-relevant: The straggler problem is why real stream processors need correction/retraction mechanisms, not just simple windowing.

### Whose Clock Are You Using, Anyway?
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Whose clock are you using, anyway?]]`
- Summary: When events are buffered at multiple points (e.g., mobile devices offline), timestamps are unreliable. Three-timestamp logging (device time, send time, receive time) helps estimate clock offset.
- Key claims: Mobile devices can buffer events for hours/days; user-controlled clocks are unreliable; server-received time is more accurate but less meaningful for user interaction; three timestamps enable clock offset estimation; this problem affects batch processing too, not just streaming.
- Learner-relevant: The three-timestamp technique is a practical pattern for handling clock skew in distributed event collection.

### Types of Windows
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Types of windows]]`
- Summary: Four common window types: tumbling (fixed, non-overlapping), hopping (fixed, overlapping), sliding (variable-boundary, time-based), and session (activity-based, variable duration).
- Key claims: Tumbling windows: fixed length, no overlap; hopping windows: fixed length, overlapping (smoothing); sliding windows: all events within a time interval of each other; session windows: grouped by user activity gaps (e.g., 30-minute inactivity = session end).
- Learner-relevant: The window type determines the aggregation semantics; choosing the wrong window type produces incorrect analytics.

### Stream Joins
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Stream joins]]`
- Summary: Three types of joins in stream processing: stream-stream (window join), stream-table (enrichment), and table-table (materialized view maintenance). All require maintaining state from one input and querying it on the other.
- Key claims: Stream-stream joins match related events within a time window; stream-table joins enrich activity events with database state (via local copy maintained by CDC); table-table joins maintain materialized views of two changelogs; all three share the same stateful join pattern.
- Learner-relevant: The three-join taxonomy is the framework for understanding all streaming join implementations.

### Stream-Stream Join (Window Join)
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Stream-stream join (window join)]`
- Summary: Joins two activity streams (e.g., search queries and clicks) within a time window. Requires maintaining indexed state of recent events and checking for matches as each event arrives.
- Key claims: Example: search + click events joined by session ID within 1 hour; embedding details in click events is insufficient (misses non-clicked searches); requires maintaining a time-windowed index of events; unmatched events may emit negative results.
- Learner-relevant: Stream-stream joins are the most challenging join type due to the need to maintain large time-windowed state.

### Stream-Table Join (Stream Enrichment)
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Stream-table join (stream enrichment)]`
- Summary: Enriches a stream of activity events by looking up related data in a database (local copy maintained via CDC). Similar to hash joins in batch, but the local copy must be kept up to date as the database changes.
- Key claims: Activity events + user profile DB → enriched events; remote DB queries are too slow; local copy (in-memory hash table or local index) avoids round-trips; CDC keeps the local copy current; conceptually similar to stream-stream join with infinite window on the table side.
- Learner-relevant: Stream-table enrichment is the most common streaming join pattern in practice (e.g., user activity + profile data).

### Table-Table Join (Materialized View Maintenance)
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Table-table join (materialized view maintenance)]`
- Summary: Joins two database changelogs to maintain a materialized view (e.g., Twitter timeline = tweets JOIN follows). Each change on one side is joined with the latest state of the other side.
- Key claims: Twitter timeline example: tweets + follows → per-user timeline cache; the join corresponds directly to a SQL JOIN; the result is a continuously updated materialized view; the join operation follows a product rule (u·v)' = u'v + uv'.
- Learner-relevant: Table-table joins are the foundation for maintaining derived data systems (search indexes, caches, timelines) in real-time.

### Time-Dependence of Joins
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Time-dependence of joins]]`
- Summary: When state changes over time, the join result depends on which version of the state is used. Cross-stream ordering is non-deterministic, making joins non-deterministic (same input → different output on replay).
- Key claims: Order of state-maintaining events matters; cross-partition ordering is not guaranteed; tax rate example: join with rate at time of sale vs. current rate; non-deterministic joins cannot be replayed identically; SCD (slowly changing dimensions) use version identifiers to make joins deterministic but prevent log compaction.
- Learner-relevant: Time-dependence is why stream joins are fundamentally different from batch joins and why exactly-once replay is hard.

### Fault Tolerance
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Fault Tolerance]]`
- Summary: Batch frameworks achieve exactly-once semantics by retrying failed tasks with discardable output. Stream processing cannot discard infinite output, so requires finer-grained recovery: microbatching, checkpointing, atomic commit, or idempotence.
- Key claims: Batch achieves effectively-once by retrying with discarded output; streams are infinite so cannot restart from beginning; microbatching (Spark Streaming) and checkpointing (Flink) provide exactly-once within the framework; external side effects (DB writes, emails) break the exactly-once guarantee.
- Learner-relevant: The fault tolerance challenge in streaming is fundamentally different from batch because of the infinite, continuous nature of streams.

### Microbatching and Checkpointing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Microbatching and checkpointing]]`
- Summary: Microbatching (Spark Streaming) breaks streams into ~1s batches treated as miniature batch jobs. Checkpointing (Flink) periodically snapshots operator state to durable storage and replays from the last checkpoint on failure.
- Key claims: Microbatch size is a latency vs. scheduling-overhead trade-off (~1s typical); microbatching implicitly provides tumbling windows; Flink checkpointing uses barriers in the message stream; both provide exactly-once within the framework but not for external side effects.
- Learner-relevant: Microbatching vs. checkpointing is a key architectural choice in stream processing frameworks.

### Atomic Commit Revisited
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Atomic commit revisited]]`
- Summary: True exactly-once requires atomic commit of all outputs, side effects, state changes, and input acknowledgments. Modern stream processors (Cloud Dataflow, VoltDB) implement this internally by managing state and messaging within the framework, not across heterogeneous systems.
- Key claims: All outputs/side effects must happen atomically or not at all; this is the distributed transaction problem from Chapter 9; Google Cloud Dataflow and VoltDB implement efficient internal atomic commit; Kafka plans similar features; overhead is amortized by batching multiple messages per transaction.
- Learner-relevant: Internal atomic commit (within the framework) is more practical than cross-system XA transactions for achieving exactly-once semantics.

### Idempotence
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Idempotence]]`
- Summary: Idempotent operations have the same effect whether performed once or many times. Even non-idempotent operations can be made idempotent with metadata (e.g., Kafka message offsets). Idempotence achieves effectively-once semantics with lower overhead than distributed transactions.
- Key claims: Setting a key to a fixed value is idempotent; incrementing a counter is not; idempotence can be achieved by tracking the last processed offset; requires: deterministic processing, same message replay order, no concurrent updates; fencing may be needed for failover.
- Learner-relevant: Idempotence is the practical alternative to distributed transactions for achieving exactly-once in most streaming systems.

### Rebuilding State After a Failure
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Rebuilding state after a failure]]`
- Summary: Stateful stream processors must recover state after failure. Options: remote replicated datastore (slow per-message), local state with periodic replication (Flink → HDFS, Samza/Kafka Streams → compacted Kafka topic), or rebuild from input streams (replay short windows, rebuild from log-compacted changelog).
- Key claims: Remote state is slow; local replicated state is faster; Flink checkpoints to HDFS; Samza/Kafka Streams replicate via compacted Kafka topics; state can sometimes be rebuilt from input streams (short window replay or log-compacted changelog); optimal strategy depends on infrastructure (network vs. disk latency/bandwidth).
- Learner-relevant: State recovery strategy is a critical design decision that varies by framework and infrastructure; understanding the trade-offs helps choose the right approach.
