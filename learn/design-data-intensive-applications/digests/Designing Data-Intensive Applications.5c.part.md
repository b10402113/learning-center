---
source: Designing Data-Intensive Applications
source_hash: 1186eaa1d12ade984f9007f4eba19c6f3a64ba19cd34fee710a04265e0129944
source_lines: 26464
part: 5c
created: 2026-08-24
updated: 2026-08-24
---

## Sections (L2)

### ch12-data-integration
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Data Integration]]`
- Summary: The opening section frames data integration as the central challenge of Chapter 12: when copies of the same data must live in several storage systems (search indexes, caches, analytics, ML), you need clear inputs/outputs. Funneling all writes through a single system that decides ordering (state machine replication) is the key principle, whether via CDC or event sourcing.
- Key claims: CDC ensures a derived index is entirely derived from the system of record; allowing two clients to write directly to both database and search index creates permanent inconsistency; deciding on a total order is more important than the specific mechanism.
- Learner-relevant: Provides the mental model for why event logs and CDC exist — they solve the dual-write problem introduced in Chapter 11.

### ch12-derived-vs-distributed-transactions
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Derived data versus distributed transactions]]`
- Summary: Compares log-based derived data with distributed transactions (2PC). Both achieve consistency by different means: transactions use locks and atomic commit; CDC/event sourcing use logs and idempotent retries. Transactions provide linearizability; derived systems are async and lack timing guarantees. XA has poor fault tolerance; log-based integration is more robust.
- Key claims: Log-based derived data is the most promising approach for integrating heterogeneous data systems; distributed transactions amplify failures; the two approaches achieve similar goals by different means.
- Learner-relevant: Anchors the chapter's thesis that log-based integration is preferred over 2PC for most cross-system coordination.

### ch12-limits-of-total-ordering
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The limits of total ordering]]`
- Summary: Explains why constructing a totally ordered event log becomes infeasible at scale: partitioned logs, multi-datacenter leaders, microservices with independent state, and offline clients all produce ambiguous ordering. Total order broadcast equals consensus, which doesn't scale beyond a single node's throughput.
- Key claims: Ordering across partitions is ambiguous; cross-datacenter synchronous coordination is impractical; microservices with separate state have no defined inter-service ordering; scaling consensus beyond one node is an open research problem.
- Learner-relevant: Motivates why we must settle for partial/causal ordering in large systems.

### ch12-ordering-events-causality
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Ordering events to capture causality]]`
- Summary: Addresses subtle causal dependencies between events (e.g., unfriend then message). Logical timestamps, event references, and conflict resolution algorithms are starting points, but no simple general solution exists yet.
- Key claims: Causal dependencies arise in ways beyond obvious same-object updates; logical timestamps can provide total ordering without coordination; conflict resolution algorithms help maintain state but not external side effects.
- Learner-relevant: Connects ordering and causality from Chapter 9 to practical dataflow design.

### ch12-batch-and-stream-processing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Batch and Stream Processing]]`
- Summary: Batch and stream processors are the tools for achieving data integration — consuming inputs, transforming, joining, aggregating, and writing derived outputs. The fundamental difference is unbounded vs bounded datasets; the distinction is blurring (Spark does streams on batches, Flink does batches on streams).
- Key claims: Batch and stream processing share many principles; the boundary between them is blurring; derived data outputs include search indexes, materialized views, recommendations, and aggregate metrics.
- Learner-relevant: Bridges Chapter 10 (batch) and Chapter 11 (stream) into a unified data integration picture.

### ch12-maintaining-derived-state
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Maintaining derived state]]`
- Summary: Batch processing is functional in flavor (deterministic pure functions); stream processing extends this with managed, fault-tolerant state. Derived data systems should be thought of as data pipelines. Asynchrony makes log-based systems robust — faults are contained locally rather than amplified as in distributed transactions.
- Key claims: Deterministic functions with well-defined inputs/outputs simplify reasoning about dataflows; asynchrony is what makes event-log systems robust; cross-partition secondary indexes are most reliable when maintained asynchronously.
- Learner-relevant: Explains why async event-based architecture is the default recommendation.

### ch12-reprocessing-for-evolution
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Reprocessing data for application evolution]]`
- Summary: Reprocessing existing data allows restructuring into a completely different model, not just schema evolution. Derived views allow gradual, reversible migration — maintain old and new schemas side by side, shift users gradually, and always have a rollback. The railway gauge migration analogy illustrates this.
- Key claims: Reprocessing enables model restructuring beyond simple schema evolution; gradual migration with derived views is reversible at every stage; the railway gauge analogy demonstrates incremental, side-by-side migration.
- Learner-relevant: Provides the practical pattern for evolving data models in production.

### ch12-lambda-architecture
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The lambda architecture]]`
- Summary: Lambda architecture runs batch and stream processors in parallel: the stream processor produces approximate updates quickly; the batch processor later corrects. Influential idea, but has practical problems: maintaining dual logic, merging outputs, and incrementalizing batch defeats its simplicity goal.
- Key claims: Lambda architecture popularized deriving views from immutable event streams; its main problems are maintaining dual logic, merging separate outputs, and the cost of incrementalizing batch processing.
- Learner-relevant: Understands a historically important architecture and its limitations before learning the modern unified approach.

### ch12-unifying-batch-and-stream
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Unifying batch and stream processing]]`
- Summary: Modern systems unify batch and stream in one engine by supporting: replay of historical events through the same processor, exactly-once semantics, and windowing by event time (not processing time). Apache Beam, Flink, and Cloud Dataflow exemplify this.
- Key claims: Replay of historical events + exactly-once semantics + event-time windowing unify batch and stream; this eliminates lambda architecture's dual-maintenance problem; microbatching may perform poorly on hopping/sliding windows.
- Learner-relevant: Shows the current state of the art for processing frameworks.

### ch12-unbundling-databases
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Unbundling Databases]]`
- Summary: Databases, Hadoop, and operating systems all perform information management. Unix and relational databases took different philosophies (low-level pipes vs high-level SQL+transactions). The chapter proposes reconciling them: federated databases unify reads across heterogeneous stores; unbundled databases (via CDC/event logs) unify writes — like unbundling a database's index-maintenance features.
- Key claims: The entire organization's dataflow looks like one huge database; batch/stream processors are like triggers and materialized view maintenance routines; federated databases unify reads, unbundled databases unify writes via event logs.
- Learner-relevant: The central architectural thesis of Chapter 12 — databases are being unbundled into composable components.

### ch12-composing-storage
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Composing Data Storage Technologies]]`
- Summary: Secondary indexes, materialized views, replication logs, and full-text search are all derived data maintained by databases. The same patterns appear in batch/stream processing. CREATE INDEX is essentially reprocessing: scan a consistent snapshot, derive the index, then process the backlog of writes — identical to setting up a new follower or bootstrapping CDC.
- Key claims: Creating an index is remarkably similar to setting up a new follower replica; the meta-database view sees all dataflow across an organization as one huge database; batch/stream processors are like elaborate implementations of triggers and stored procedures.
- Learner-relevant: Shows that familiar database operations (CREATE INDEX) map directly to dataflow patterns.

### ch12-making-unbundling-work
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Making unbundling work]]`
- Summary: Federation (reads) is manageable; synchronizing writes across heterogeneous systems is the harder problem. An async event log with idempotent consumers is more robust than distributed transactions. Log-based integration provides loose coupling at the system level (fault containment via buffering) and human level (independent team development).
- Key claims: An ordered log with idempotent consumers is a simpler abstraction than distributed transactions across heterogeneous systems; loose coupling benefits both fault tolerance and organizational independence; the goal of unbundling is breadth of workload coverage, not depth.
- Learner-relevant: Justifies why log-based integration is preferred for real-world heterogeneous systems.

### ch12-whats-missing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#What's missing]]`
- Summary: The missing piece is a high-level language for composing storage and processing systems — the unbundled equivalent of the Unix shell. Imagine `mysql | elasticsearch` as a pipe that continuously captures database changes and indexes them. Differential dataflow is early-stage research in this direction.
- Key claims: We lack a declarative language for composing data systems like Unix pipes; `mysql | elasticsearch` would be the unbundled equivalent of CREATE INDEX; declarative materialized views (including recursive graph queries) are an open research area.
- Learner-relevant: Identifies the open problem that the field is working toward.

### ch12-designing-around-dataflow
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Designing Applications Around Dataflow]]`
- Summary: The "database inside-out" pattern treats the database as a passive mutable variable and renegotiates the relationship between application code and state. Application code responds to state changes by triggering state changes elsewhere. Derived data maintenance requires stable message ordering and fault tolerance — much less expensive than distributed transactions.
- Key claims: Maintaining derived data is not the same as async job execution — order and fault tolerance are critical; stream operators can be composed like Unix pipes; modern stream processors provide ordering and reliability at scale.
- Learner-relevant: Defines the application design pattern that emerges from unbundled databases.

### ch12-stream-processors-vs-services
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Stream processors and services]]`
- Summary: Dataflow systems compose stream operators similarly to microservices, but use one-directional async message streams instead of sync request/response. The dataflow approach replaces synchronous RPCs with local queries to materialized state (e.g., subscribing to exchange rate updates instead of querying a service), improving both speed and fault tolerance.
- Key claims: The fastest network request is no network request at all; subscribing to a stream replaces sync RPC with a local query; stream-table joins replace service-to-service calls; time dependence of joins applies regardless of approach.
- Learner-relevant: Shows why dataflow architecture outperforms synchronous microservices.

### ch12-observing-derived-state
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Observing Derived State]]`
- Summary: The write path eagerly precomputes derived datasets; the read path serves queries lazily. Caches, indexes, and materialized views shift the boundary between write and read paths. This brings us full circle to the Twitter example from page 11.
- Key claims: Derived datasets are where write path and read path meet; they represent a trade-off between write-time and read-time work; the boundary between write and read paths can be shifted and drawn differently (e.g., for celebrities vs ordinary users).
- Learner-relevant: Provides a unifying mental model for all forms of derived data.

### ch12-stateful-offline-clients
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Stateful, offline-capable clients]]`
- Summary: Moving away from stateless clients to on-device state creates opportunities: device state is a cache of server state; screen pixels are a materialized view of client model objects. This extends the write path all the way to end-user devices via server-sent events and WebSockets.
- Key claims: On-device state is a cache/replica of remote state; the write path can extend to end-user devices; offline-first apps do as much as possible locally and sync in background; each device is a small subscriber to a stream of events.
- Learner-relevant: Connects dataflow architecture to modern mobile/offline-first application design.

### ch12-end-to-end-event-streams
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#End-to-end event streams]]`
- Summary: State changes could flow end-to-end: from one device's interaction, through event logs and derived data systems and stream processors, to another user's UI — all with sub-second delay. Elm and React/Flux/Redux already manage client-side state via event streams. The challenge is that request/response is deeply ingrained in databases, libraries, and protocols.
- Key claims: End-to-end event streams would propagate state changes with sub-second delay; moving from request/response to publish/subscribe dataflow requires rethinking many existing systems; subscribing to changes, not just querying state, is the key paradigm shift.
- Learner-relevant: Articulates the vision for real-time, reactive applications.

### ch12-reads-are-events
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Reads are events too]]`
- Summary: Read requests can also be represented as events routed through a stream processor, performing a stream-table join between read queries and the database. This enables tracking causal dependencies (what the user saw before deciding) and supports multi-partition queries via stream infrastructure.
- Key claims: Serving requests is fundamentally performing joins; a one-off read is a pass-through join; a subscription is a persistent join; recording read events enables tracking causal dependencies and data provenance.
- Learner-relevant: Deepens the dataflow model by treating reads and writes uniformly as events.

### ch12-multi-partition-processing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Multi-partition data processing]]`
- Summary: Treating queries as streams enables distributed execution of complex queries combining data from multiple partitions — similar to MPP databases' internal query graphs but implementable with stream processors. Storm's distributed RPC and fraud prevention systems exemplify this.
- Key claims: Stream processors can execute multi-partition joins using existing routing/partitioning infrastructure; this is an alternative to MPP databases for applications at the limits of off-the-shelf solutions; fraud prevention requires joining reputation scores from differently partitioned datasets.
- Learner-relevant: Shows the scalability ceiling of the dataflow approach for complex queries.

### ch12-aiming-for-correctness
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Aiming for Correctness]]`
- Summary: Stateful systems require more careful thought than stateless services because errors persist. Transactions (atomicity, isolation, durability) are the traditional tools, but foundations are weaker than they seem: weak isolation levels confuse, NoSQL abandons transactions for messy semantics, and Jepsen reveals discrepancies between claimed and actual safety.
- Key claims: Stateful systems are fundamentally harder than stateless services; transaction foundations are weaker than they appear; weak isolation levels are hard to use correctly; Jepsen exposes gaps between claims and reality.
- Learner-relevant: Frames the correctness challenge that motivates the rest of the chapter.

### ch12-end-to-end-argument
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The End-to-End Argument for Databases]]`
- Summary: Using a database with strong safety properties does not guarantee application correctness. The end-to-end argument (Saltzer, Reed, Clark 1984) says correctness can only be fully implemented with application knowledge at the endpoints. TCP suppresses duplicates at connection level, but not across HTTP retries. End-to-end operation IDs (UUIDs in form fields) are needed for true exactly-once execution.
- Key claims: Serializable transactions don't save you from application bugs; correctness requires end-to-end solutions, not just middle-layer guarantees; the end-to-end argument applies to duplicate suppression, data integrity checks, and encryption; low-level reliability features reduce but don't eliminate need for higher-level checks.
- Learner-relevant: The key insight that correctness must be verified end-to-end, not just at the database layer.

### ch12-exactly-once-execution
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Exactly-once execution of an operation]]`
- Summary: Exactly-once means the final effect is as if no faults occurred, even if operations were retried. Making operations idempotent (via operation IDs, unique constraints) is the most effective approach. A money transfer transaction (Example 12-1) is actually not correct because it's not idempotent.
- Key claims: Non-idempotent transactions can cause double-charges on network interruption; operation IDs passed end-to-end enable true exactly-once semantics; database uniqueness constraints prevent duplicate inserts even at weak isolation levels.
- Learner-relevant: Concrete pattern for implementing exactly-once at the application level.

### ch12-enforcing-constraints
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Enforcing Constraints]]`
- Summary: Uniqueness constraints require consensus (a single leader or partitioned processing). In log-based messaging, a stream processor on a single thread sequentially processes requests in a log partition, deterministically deciding which conflicting operation came first. Multi-partition transactions can be decomposed into two-stage partitioned logs without atomic commit.
- Key claims: Uniqueness in log-based messaging is essentially total order broadcast (equivalent to consensus); multi-partition transactions can be decomposed into two differently partitioned stages with end-to-end request IDs; single-object writes are atomic in almost all data systems, avoiding the need for multi-partition atomic commit.
- Learner-relevant: Shows how to enforce constraints without distributed transactions.

### ch12-timeliness-and-integrity
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Timeliness and Integrity]]`
- Summary: "Consistency" conflates two separate requirements: timeliness (users observe up-to-date state) and integrity (absence of corruption, no data loss, correct derivations). Violations of timeliness are "eventual consistency"; violations of integrity are "perpetual inconsistency." Integrity is far more important than timeliness in most applications.
- Key claims: Timeliness violations are temporary; integrity violations are permanent; dataflow systems decouple timeliness and integrity; exactly-once semantics preserves integrity; integrity is central to streaming systems.
- Learner-relevant: Reframes "consistency" into two distinct, independently addressable properties.

### ch12-coordination-avoiding-systems
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Coordination-avoiding data systems]]`
- Summary: Dataflow systems can maintain integrity without atomic commit or synchronous coordination. Many applications tolerate loosely interpreted constraints (apologize and fix later) rather than strict linearizable enforcement. This enables multi-datacenter operation with weak timeliness but strong integrity. Coordination reduces inconsistencies but also reduces availability — the sweet spot balances both.
- Key claims: Dataflow systems can provide strong integrity without coordination; many business contexts tolerate temporarily violated constraints with compensating transactions; coordination-avoiding systems can operate across datacenters asynchronously; the optimal trade-off minimizes total "apologies" from both inconsistencies and outages.
- Learner-relevant: The practical framework for deciding when coordination is needed vs when it can be avoided.

### ch12-trust-but-verify
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Trust, but Verify]]`
- Summary: System models assume certain things can't happen, but in reality violations have a probability (random bit-flips, disk corruption, software bugs). Even mature databases have bugs (MySQL uniqueness, PostgreSQL serializability). Applications have even more bugs and often don't use database constraints correctly.
- Key claims: Data corruption on disk and via network can evade checksums; random bit-flips are rare but not impossible (rowhammer); widely-used databases have correctness bugs; many applications don't correctly use database features for integrity.
- Learner-relevant: Motivates why auditing and verification are necessary, not optional.

### ch12-auditability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Designing for auditability]]`
- Summary: Event-based systems provide better auditability than transaction logs: user input is a single immutable event, derivations are deterministic and repeatable, and data provenance is explicit. Cryptographic tools (Merkle trees, distributed ledgers) can prove integrity robustly to hardware and software issues. HDFS and S3 already continuously audit by reading back files and comparing replicas.
- Key claims: Event sourcing enables deterministic, repeatable derivation for auditability; Merkle trees and certificate transparency offer cryptographic integrity checking; the culture of ACID led to blind trust rather than verification; continuous end-to-end integrity checks increase confidence and enable faster evolution.
- Learner-relevant: Provides the design philosophy for building trustworthy, self-auditing data systems.

### ch12-doing-the-right-thing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Doing the Right Thing]]`
- Summary: The final section addresses ethics: data is about people and must be treated with humanity and respect. Predictive analytics can amplify bias and create "algorithmic prison." Automated systems lack accountability. Feedback loops create downward spirals. Surveillance capitalism extracts data as a core asset. The Industrial Revolution's pollution parallels data as the pollution of the information age.
- Key claims: Data-driven decision making can systematically and arbitrarily exclude people without proof of guilt; algorithms codify past discrimination; privacy is the freedom to choose what to reveal, not secrecy; behavioral data is the core asset of ad-funded services, making surveillance the business model; data is the pollution problem of the information age.
- Learner-relevant: Provides the ethical framework for building data-intensive systems responsibly.

### ch12-legislation-and-self-regulation
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Legislation and self-regulation]]`
- Summary: Data protection laws exist but may be ineffective against Big Data's philosophy of maximizing collection and unforeseen use. The tech industry needs a culture shift: stop regarding users as metrics, remember they are humans deserving respect, self-regulate data practices, educate users, purge data when no longer needed, and explore cryptographic access control.
- Key claims: Big Data philosophy conflicts with data protection principles; the tech industry needs a culture shift toward respecting users; data should be purged when no longer needed; cryptographic protocols can enforce access control more robustly than policy alone; ubiquitous surveillance is not inevitable.
- Learner-relevant: Closing call to action for engineers to take ethical responsibility.
