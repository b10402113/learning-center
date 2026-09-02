---
source: Designing Data-Intensive Applications
source_hash: 1186eaa1d12ade984f9007f4eba19c6f3a64ba19cd34fee710a04265e0129944
source_lines: 26464
part: 4
created: 2026-08-24
updated: 2026-08-24
---

## Sections (L2)

### Ch 7: The Slippery Concept of a Transaction
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Slippery Concept of a Transaction]]`
- Summary: Introduces transactions as an abstraction layer for fault-tolerance, examining what ACID actually guarantees versus what the marketing term implies. Defines atomicity, consistency, isolation, and durability in precise terms, distinguishing each from common misunderstandings.
- Key claims: ACID is mostly a marketing term whose components vary by database implementation; atomicity means abortability (not concurrency); consistency in ACID is an application-level property, not a database one; durability is never absolute (hardware can fail, disks corrupt).
- Learner-relevant: Corrects the common confusion between ACID's letters; grounds the learner in the real guarantees behind each term so they can evaluate database claims critically.

### Ch 7: Weak Isolation Levels
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Weak Isolation Levels]]`
- Summary: Catalogs the concurrency anomalies that arise in real databases—dirty reads, dirty writes, read skew, lost updates, write skew, phantoms—and maps each to the isolation levels that prevent or fail to prevent them.
- Key claims: Read committed prevents dirty reads and dirty writes; snapshot isolation (MVCC) prevents read skew but not write skew; most databases use weaker isolation than serializable by default; weak isolation bugs cause real financial losses.
- Learner-relevant: Builds the vocabulary needed to reason about which isolation level a given workload actually requires, and what anomalies remain when you choose a weaker level.

### Ch 7: Read Committed
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Read Committed]]`
- Summary: Defines the most basic isolation level: no dirty reads and no dirty writes. Explains implementation via row-level locks and the double-version trick that avoids holding read locks.
- Key claims: Read committed is the default in Oracle, PostgreSQL, and SQL Server; preventing dirty writes is done with row-level locks held until commit/abort; preventing dirty reads uses two committed versions rather than read locks.
- Learner-relevant: Provides the baseline isolation level that every application can reasonably expect; establishes the foundation for understanding why stronger levels are needed.

### Ch 7: Snapshot Isolation and Repeatable Read
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Snapshot Isolation and Repeatable Read]]`
- Summary: Explains snapshot isolation via MVCC: each transaction reads from a consistent snapshot, readers never block writers. Covers visibility rules, how MVCC indexes work, and the naming confusion between "repeatable read" and "serializable."
- Key claims: Snapshot isolation uses MVCC to present a frozen view of the database at transaction start; readers never block writers and writers never block readers; the SQL standard's definition of "repeatable read" is ambiguous and inconsistent across databases.
- Learner-relevant: Clarifies why long-running analytical queries and backups need consistent snapshots, and why the name "repeatable read" is unreliable.

### Ch 7: Preventing Lost Updates
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Preventing Lost Updates]]`
- Summary: Covers four approaches to preventing lost updates: atomic write operations, explicit locking, automatic detection under snapshot isolation, and compare-and-set. Notes that leaderless replication requires different strategies (LWW vs. commutative operations).
- Key claims: Atomic operations (e.g., `UPDATE SET value = value + 1`) are the best first choice; explicit `SELECT FOR UPDATE` works but is error-prone; PostgreSQL and SQL Server detect lost updates automatically under snapshot isolation, but MySQL/InnoDB does not; LWW in replicated databases is prone to data loss.
- Learner-relevant: Gives the learner concrete techniques to prevent the most common write-write anomaly.

### Ch 7: Write Skew and Phantoms
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Write Skew and Phantoms]]`
- Summary: Introduces write skew as a generalization of lost updates: two transactions read the same data, make decisions, and write to different objects, violating a constraint. Explains phantoms (a write changing the result of a search query) and the "materializing conflicts" workaround.
- Key claims: Write skew is not detected by snapshot isolation in PostgreSQL, MySQL, Oracle, or SQL Server; materializing conflicts is a last resort; only true serializable isolation prevents all write skew.
- Learner-relevant: Reveals a subtle class of bugs that many developers miss; motivates the need for serializable isolation.

### Ch 7: Serializability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Serializability]]`
- Summary: Presents three approaches to achieving serializable isolation: actual serial execution, two-phase locking (2PL), and serializable snapshot isolation (SSI). Compares their trade-offs in performance, scalability, and complexity.
- Key claims: Serial execution is viable for in-memory OLTP but limited to a single CPU core; 2PL is the traditional approach but suffers from high-latency tail and deadlocks; SSI provides serializability with only a small performance penalty over snapshot isolation.
- Learner-relevant: Equips the learner to choose among the three serializability strategies based on workload constraints.

### Ch 7: Two-Phase Locking (2PL)
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Two-Phase Locking (2PL)]]
- Summary: Explains 2PL's lock protocol: shared mode for reads, exclusive mode for writes, held until commit/abort. Covers predicate locks for preventing phantoms, index-range locks as a practical approximation, and the performance costs of lock contention.
- Key claims: 2PL makes writers block readers and vice versa (opposite of snapshot isolation); predicate locks prevent phantoms but are expensive; index-range locks are the practical approximation used by MySQL and SQL Server.
- Learner-relevant: Provides the historical baseline for serializable isolation; explains why 2PL fell out of favor for latency-sensitive workloads.

### Ch 7: Serializable Snapshot Isolation (SSI)
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Serializable Snapshot Isolation (SSI)]]
- Summary: Describes SSI as an optimistic concurrency control technique built on snapshot isolation. Tracks dependencies between transactions' reads and writes, aborting only when a serialization conflict is detected. Used by PostgreSQL 9.1+ and FoundationDB.
- Key claims: SSI detects two conflict types—stale MVCC reads and writes that affect prior reads—using index-based tripwires; writers never block readers; SSI scales across machines (FoundationDB) unlike serial execution; requires short read-write transactions to keep abort rates low.
- Learner-relevant: Represents the state of the art in serializable isolation; shows that serializability and good performance are not fundamentally at odds.

### Ch 7: Summary
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Summary]]` (Chapter 7)
- Summary: Recaps the isolation levels and the anomalies each prevents: dirty reads, dirty writes, read skew, lost updates, write skew, phantoms. Lists the three serializability implementations and their trade-offs.
- Key claims: Only serializable isolation prevents all race conditions; weak isolation levels push concurrency management into application code; the examples use relational data but the principles apply to all data models.
- Learner-relevant: Serves as a quick-reference table for which isolation level handles which anomaly.

### Ch 8: The Trouble with Distributed Systems
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Trouble with Distributed Systems]]`
- Summary: Opens Chapter 8 by framing partial failure as the defining challenge of distributed systems. Contrasts supercomputing (fail-stop) with cloud computing (tolerate faults), and explains why reliable systems can be built from unreliable components.
- Key claims: Partial failure is nondeterministic and the core difficulty; supercomputers escalate partial failure to total failure; cloud services must handle faults at the node level; reliable higher-level systems can be built from unreliable parts (error-correcting codes, TCP over IP).
- Learner-relevant: Establishes the mindset shift required when moving from single-machine to distributed programming.

### Ch 8: Unreliable Networks
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Unreliable Networks]]`
- Summary: Covers the six things that can go wrong when sending a request over the network, the difficulty of fault detection, the problem of choosing timeouts, and why asynchronous networks have unbounded delays due to queueing.
- Key claims: You cannot distinguish between a lost request, a dead node, and a lost response; timeouts are the only fault detection mechanism but cannot distinguish network vs. node failure; network delays are mostly caused by queueing (congestion, CPU scheduling, VM pauses); circuit-switched networks give bounded delays but waste bandwidth.
- Learner-relevant: Explains why network unreliability is an inherent property, not a bug to be fixed, and why timeout tuning is an empirical art.

### Ch 8: Unreliable Clocks
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Unreliable Clocks]]`
- Summary: Examines time-of-day vs. monotonic clocks, NTP synchronization pitfalls, why LWW conflict resolution is dangerous, how Spanner uses TrueTime's confidence intervals, and how GC pauses break lease-based leader election.
- Key claims: Time-of-day clocks can jump backward or forward; LWW silently drops writes when clocks skew; Google's TrueTime API returns a confidence interval `[earliest, latest]`; Spanner waits out the uncertainty before committing; process pauses (GC, VM migration, SIGSTOP) can be arbitrarily long.
- Learner-relevant: Reveals why relying on wall-clock time for ordering or correctness is hazardous; introduces the tools (TrueTime, fencing tokens) used to mitigate these risks.

### Ch 8: Knowledge, Truth, and Lies
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Knowledge, Truth, and Lies]]`
- Summary: Explores what a node can and cannot know in a distributed system. Covers majority quorums for truth, fencing tokens for preventing stale leaders, Byzantine faults (honest vs. dishonest nodes), and the system model taxonomy (synchronous/partially synchronous/asynchronous × crash-stop/crash-recovery/Byzantine).
- Key claims: A node cannot trust its own judgment; truth is defined by a majority quorum; fencing tokens prevent stale writes from corrupting resources; Byzantine fault tolerance requires a >2/3 supermajority and is impractical for most server-side systems; system models formalize which faults algorithms must tolerate; safety properties must always hold, liveness properties may be delayed.
- Learner-relevant: Provides the theoretical vocabulary (safety/liveness, system models, quorums) needed to reason about and compare distributed algorithms in Chapter 9.

### Ch 8: Summary
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Summary]]` (Chapter 8)
- Summary: Recap of the three fundamental sources of partial failure: unreliable networks (packets lost/delayed), unreliable clocks (NTP drift, LWW risks), and process pauses (GC, VM suspend). Emphasizes that fault tolerance must be designed in, not assumed.
- Key claims: Timeouts cannot distinguish network from node failure; clock skew causes silent data loss; a paused process can be declared dead and later resume without knowing it; distributed algorithms rely on quorums rather than single-node judgment.
- Learner-relevant: A concise summary of all the problems Chapter 9's algorithms are designed to solve.

### Ch 9: Consistency and Consensus
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Consistency and Consensus]]`
- Summary: Introduces the chapter's goal—finding general-purpose fault-tolerant abstractions (like consensus) that applications can rely on. Maps the chapter's three sections: linearizability, ordering guarantees, and distributed transactions/consensus.
- Key claims: Consensus is the most important distributed abstraction; it prevents split brain in leader election; transaction isolation and distributed consistency are mostly independent concerns; stronger guarantees cost performance or fault-tolerance.
- Learner-relevant: Sets up the roadmap for the chapter and motivates why consensus is the central problem.

### Ch 9: Consistency Guarantees
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Consistency Guarantees]]`
- Summary: Defines eventual consistency as the weakest guarantee (replicas converge eventually but timing is unspecified) and motivates the exploration of stronger models. Notes that stronger guarantees trade performance/fault-tolerance for easier correctness.
- Key claims: Eventual consistency means convergence, not recency; it is hard for developers because it differs from single-threaded variable semantics; stronger models are easier to use correctly but have higher costs.
- Learner-relevant: Establishes the baseline consistency model and why stronger models exist.

### Ch 9: Linearizability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Linearizability]]`
- Summary: Defines linearizability as the illusion of a single copy of data with atomic operations. Uses detailed timing diagrams (Figures 9-2 through 9-4) to show what operations must return under linearizability, and what constitutes a violation.
- Key claims: Linearizability is a recency guarantee: once a write is visible, all subsequent reads must see it; concurrent reads may return old or new values; the system appears to have a single copy; it can be checked by recording all request/response timings.
- Learner-relevant: Provides the precise definition of the strongest commonly-used consistency model, essential for reasoning about distributed storage correctness.

### Ch 9: Linearizability Versus Serializability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Linearizability Versus Serializability]]`
- Summary: Distinguishes serializability (transaction isolation over multiple objects) from linearizability (recency guarantee on a single register). Notes that combining both yields strict serializability (strong-1SR).
- Key claims: Serializability is about transaction ordering; linearizability is about recency of individual reads/writes; 2PL and serial execution are typically linearizable; SSI is not linearizable by design; the combination is called strict serializability.
- Learner-relevant: Clears up the most common confusion in distributed systems terminology.

### Ch 9: Relying on Linearizability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Relying on Linearizability]]`
- Summary: Identifies three use cases where linearizability is essential: locking/leader election (to prevent split brain), uniqueness constraints (username, seat booking), and cross-channel timing dependencies (file storage + message queue race conditions).
- Key claims: Distributed locks must be linearizable; hard uniqueness constraints require linearizability; cross-channel systems fail without it because messages can outrun replication.
- Learner-relevant: Shows when linearizability is a hard requirement vs. when weaker guarantees suffice.
