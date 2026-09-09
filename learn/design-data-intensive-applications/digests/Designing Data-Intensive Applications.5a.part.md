---
source: Designing Data-Intensive Applications
source_lines: 26464
part: 5a
created: 2026-08-24
updated: 2026-08-24
---

# Digest: Designing Data-Intensive Applications — Chapter 10

## Sections (L2)

### Ch10: Batch Processing with Unix Tools
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Batch Processing with Unix Tools]]`
- Summary: Introduces batch processing via Unix shell pipelines on log files. Demonstrates how awk, sort, uniq, and head can analyze gigabytes of data in seconds.
- Key claims: Unix tools process large datasets surprisingly well; the pipeline model (data flows through a chain of single-purpose programs) is a foundational design pattern for batch processing.
- Learner-relevant: Establishes the Unix philosophy as the conceptual ancestor of MapReduce and distributed batch systems.

### Ch10: Chain of Commands versus Custom Program
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chain of commands versus custom program]]`
- Summary: Compares a Unix pipeline to a Ruby script doing the same log analysis. The pipeline sorts on disk and streams; the script uses an in-memory hash table.
- Key claims: In-memory aggregation is faster when the working set fits in RAM; the sorting approach handles larger-than-memory datasets by spilling to disk using merge sort's sequential I/O pattern; GNU sort auto-parallelizes across cores.
- Learner-relevant: The in-memory vs. disk-sort trade-off reappears in MapReduce's shuffle phase and in dataflow engines.

### Ch10: The Unix Philosophy
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Unix Philosophy]]`
- Summary: Presents Doug McIlroy's 1964 pipe vision and the 1978 Unix philosophy: programs should do one thing well, expect their output to become input to another program, and favor rapid prototyping.
- Key claims: The Unix philosophy predates Agile/DevOps by decades; composability via small single-purpose tools is a recurring pattern that scales to distributed systems.
- Learner-relevant: The four Unix philosophy tenets map directly to MapReduce design principles (immutable inputs, replaceable outputs, no side effects).

### Ch10: A Uniform Interface
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#A uniform interface]]`
- Summary: Unix programs interoperate because they share a uniform interface: the file descriptor (an ordered sequence of bytes). Newlines separate records; whitespace separates fields.
- Key claims: The uniform byte-stream interface is what enables arbitrary tool composition; it is more remarkable than it appears because most software systems lack this level of interoperability.
- Learner-relevant: HDFS serves the same role for MapReduce that file descriptors serve for Unix pipes — a common storage substrate any job can read from and write to.

### Ch10: Separation of Logic and Wiring
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Separation of logic and wiring]]`
- Summary: stdin/stdout decouple a program's logic from its I/O wiring. Programs don't know or care where input comes from; the shell user controls the pipeline topology.
- Key claims: Separating logic from wiring is a form of loose coupling and inversion of control; it enables composing your own programs with OS-provided tools seamlessly.
- Learner-relevant: MapReduce inherits this separation: mappers/reducers contain only processing logic; the framework handles data routing and fault recovery.

### Ch10: Transparency and Experimentation
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Transparency and experimentation]]`
- Summary: Unix tools treat input as immutable, allow piping output into `less` for inspection, and support intermediate file checkpoints for restartability — all of which make debugging easy.
- Key claims: Immutability of inputs and inspectability of intermediate outputs are key to experimentation; the biggest limitation is single-machine execution, motivating Hadoop.
- Learner-relevant: These properties (immutability, inspectability, restartability) are the same design principles that make MapReduce jobs maintainable and debuggable at scale.

### Ch10: MapReduce and Distributed Filesystems
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#MapReduce and Distributed Filesystems]]`
- Summary: MapReduce is Unix tools distributed across thousands of machines. HDFS (Google File System's open-source reimplementation) provides the distributed filesystem, based on shared-nothing commodity hardware with block replication for fault tolerance.
- Key claims: HDFS scales to tens of thousands of machines with petabytes of storage at much lower cost than dedicated storage appliances; replication (or erasure coding) tolerates machine/disk failures.
- Learner-relevant: HDFS is the storage layer for all Hadoop batch processing; understanding its shared-nothing architecture is prerequisite to understanding MapReduce execution.

### Ch10: MapReduce Job Execution
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#MapReduce Job Execution]]`
- Summary: A MapReduce job follows four steps: (1) split input into records, (2) mapper extracts key-value pairs, (3) framework sorts by key, (4) reducer iterates over grouped values. Mapper output is partitioned by key hash across reducers; the shuffle phase copies sorted partitions from mappers to reducers.
- Key claims: The sort between map and reduce is implicit and automatic; the shuffle is the expensive network operation; data locality (scheduling mappers where data lives) reduces network load.
- Learner-relevant: The map → sort → reduce pipeline is the canonical batch processing pattern; understanding the shuffle is essential for diagnosing performance bottlenecks.

### Ch10: MapReduce Workflows
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#MapReduce workflows]]`
- Summary: Single MapReduce jobs have limited expressiveness; real workflows chain 50–100 jobs. Jobs are linked by HDFS directory names; workflow schedulers (Oozie, Airflow, Luigi) manage dependencies and retries.
- Key claims: Chained MapReduce jobs materialize intermediate state to HDFS between stages (unlike Unix pipes which stream); this has advantages (publication, reuse) and disadvantages (redundant I/O, straggler delays).
- Learner-relevant: Workflow scheduling is a practical necessity; the materialization-vs-pipelining trade-off motivates dataflow engines (Spark, Flink, Tez).

### Ch10: Reduce-Side Joins and Grouping
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Reduce-Side Joins and Grouping]]`
- Summary: Batch joins resolve all occurrences of an association across a dataset. In a sort-merge join, mappers extract the join key from both inputs; the framework sorts and co-locates records with the same key in a single reducer call. Secondary sort orders the values (e.g., user record first, then activity events by timestamp).
- Key claims: Sort-merge joins bring related data together via the map-shuffle-sort mechanism; the reducer only needs one side of the join in memory at a time; this is far more efficient than per-record network lookups.
- Learner-relevant: Join implementation in batch processing is a core pattern; the "bring data to the same place" principle underpins both joins and GROUP BY operations.

### Ch10: GROUP BY
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#GROUP BY]]`
- Summary: GROUP BY in MapReduce uses the same partitioning/sorting mechanism as joins: mappers emit the grouping key, and the framework co-locates all records with the same key for the reducer to aggregate (COUNT, SUM, top-k).
- Key claims: Grouping and joining are structurally identical in MapReduce; sessionization (grouping events by user session) is a key practical use case for A/B testing and analytics.
- Learner-relevant: Understanding that GROUP BY and joins share the same underlying shuffle mechanism clarifies why both benefit from the same optimization strategies.

### Ch10: Handling Skew
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Handling skew]]`
- Summary: Hot keys (celebrity users, popular pages) cause uneven reducer load (skew). Mitigations: Pig's skewed join samples to find hot keys and routes them to random reducers with replicated co-join input; Hive stores hot-key records separately and uses map-side joins for them; two-stage aggregation splits the hot-key group into partial aggregates first.
- Key claims: Skew is a fundamental problem in partitioned systems; randomization and two-stage aggregation are the primary countermeasures; Hive's metadata-driven approach pre-separates hot keys.
- Learner-relevant: Skew handling is a recurring theme across batch processing, stream processing, and distributed databases (Chapters 6 and 11).

### Ch10: Map-Side Joins
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Map-Side Joins]]`
- Summary: When inputs meet certain assumptions (small enough, pre-partitioned, pre-sorted), joins can skip the reduce phase entirely. Variants: broadcast hash joins (small input loaded into each mapper's hash table), partitioned hash joins (both inputs co-partitioned), map-side merge joins (both inputs co-sorted).
- Key claims: Map-side joins trade flexibility for performance; broadcast hash joins are the simplest and most common; partitioned hash joins require co-partitioning by the same key and hash function; map-side merge joins require co-sorting.
- Learner-relevant: Choosing between reduce-side and map-side joins requires understanding data layout metadata (partitioning, sorting) — a key optimization knob in Hive/Spark.

### Ch10: The Output of Batch Workflows
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Output of Batch Workflows]]`
- Summary: Batch outputs are typically search indexes, machine learning models, or key-value stores served as immutable files. Writing directly to a production database from a reducer is a bad idea (slow, fragile, side effects). Instead, build a new database as files in HDFS and bulk-load into serving systems.
- Key claims: Immutable batch outputs enable human fault tolerance (roll back buggy code by switching to old output files); the same pattern enables monitoring, A/B comparison, and safe deployment.
- Learner-relevant: The "build a database, then load it" pattern is the standard way batch systems produce serving-layer data (Lambda/Kappa architecture precursor).

### Ch10: Philosophy of Batch Process Outputs
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Philosophy of batch process outputs]]`
- Summary: Batch jobs follow Unix philosophy: inputs are immutable, outputs fully replace previous output, no side effects. This enables safe rerun, easy rollback, automatic task retry, and code reuse across teams. Avro and Parquet replace raw text with structured, schema-evolvable formats.
- Key claims: Immutability and idempotent outputs are the core batch processing design principles; structured formats (Avro, Parquet) eliminate the brittle text-parsing tax of raw Unix pipelines.
- Learner-relevant: These principles directly motivate the design of streaming systems (Chapter 11) and the trade-offs between batch and stream.

### Ch10: Comparing Hadoop to Distributed Databases
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Comparing Hadoop to Distributed Databases]]`
- Summary: MPP databases (Teradata, etc.) predate MapReduce by a decade. Hadoop's advantage is storage diversity (any format, schema-on-read) and processing diversity (arbitrary code, not just SQL). MPP databases offer tighter integration and better query performance but require upfront modeling.
- Key claims: "Raw data is better" (sushi principle) — collecting data quickly in any format often beats waiting for ideal schema design; Hadoop's open platform supports diverse workloads (OLTP via HBase, analytics via Impala, ML via Spark) on one cluster.
- Learner-relevant: The Hadoop-vs-MPP comparison frames the modern data lake vs. data warehouse debate; understanding the trade-offs informs architecture decisions.

### Ch10: Designing for Frequent Faults
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Designing for frequent faults]]`
- Summary: MapReduce retries at task granularity and eagerly writes to disk because Google's mixed-use datacenters preempt low-priority batch tasks ~5% per hour. MPP databases abort entire queries on node failure. The MapReduce design is optimized for environments where preemption is frequent.
- Key claims: At Google, a 1-hour MapReduce task has ~5% preemption risk; a 100-task job has >50% chance of at least one preemption; MapReduce's overhead is justified by the resource utilization gains of overcommitment.
- Learner-relevant: Fault-tolerance strategy must match the operating environment; understanding why MapReduce is designed this way prevents misapplying its patterns to low-preemption clusters.

### Ch10: Beyond MapReduce — Materialization of Intermediate State
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Beyond MapReduce]]`
- Summary: MapReduce materializes all intermediate state to HDFS, causing unnecessary disk I/O, redundant mappers, and straggler-induced delays. Dataflow engines (Spark, Tez, Flink) handle an entire workflow as one job with explicit data-flow graphs, allowing pipelined execution between operators.
- Key claims: Dataflow engines avoid materializing intermediate state to HDFS; they use the same shuffle mechanism but keep intermediate data on local disk or in memory; operators can start as soon as input is ready without waiting for the entire prior stage.
- Learner-relevant: Dataflow engines are the modern successors to MapReduce; understanding the materialization trade-off is key to choosing and tuning Spark/Flink jobs.

### Ch10: Dataflow Engines — Fault Tolerance
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Fault tolerance]]`
- Summary: Spark/Flink/Tez avoid writing intermediate state to HDFS, so faults require recomputation rather than re-reading. Spark uses RDD lineage tracking; Flink checkpoints operator state. Deterministic operators avoid cascading faults from inconsistent recomputation.
- Key claims: Recomputation is only cheaper than materialization when intermediate data is much smaller than source data or when computation is CPU-intensive; nondeterminism (hash iteration order, random numbers, system clock) must be eliminated for reliable recomputation.
- Learner-relevant: The fault-tolerance trade-off (recompute vs. materialize) is a central design decision in every distributed processing engine.

### Ch10: Graphs and Iterative Processing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Graphs and Iterative Processing]]`
- Summary: Graph algorithms (PageRank, transitive closure) require iteration — repeating computation until convergence. MapReduce is inefficient for this because it re-reads the entire dataset each iteration. The Pregel model (BSP) lets vertices maintain state across iterations and communicate via messages in synchronized rounds.
- Key claims: Pregel (Giraph, GraphX, Gelly) is the dominant batch graph-processing model; vertices communicate only by message passing in fixed rounds; if a graph fits in memory on one machine, single-machine algorithms often outperform distributed Pregel due to communication overhead.
- Learner-relevant: Graph batch processing is a specialized but important case; understanding Pregel's round-based model clarifies why graph algorithms are expensive to distribute.

### Ch10: High-Level APIs and Languages
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#High-Level APIs and Languages]]`
- Summary: Higher-level APIs (Hive, Pig, Spark DataFrames, Flink) use relational-style operators (join, group, filter, aggregate) instead of raw map/reduce. Cost-based optimizers automatically choose join algorithms. Declarative features enable column-oriented storage reads, vectorized execution, and JVM/LLVM code generation.
- Key claims: Batch processing frameworks are converging with MPP databases by adopting declarative query features while retaining the flexibility to run arbitrary code; the extensibility vs. optimization trade-off is being bridged by hybrid designs.
- Learner-relevant: Modern Spark/Flink usage is almost entirely through high-level APIs; understanding the optimizer's role explains why writing declarative DataFrame code often outperforms hand-tuned map/reduce.

### Ch10: Summary
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Summary]]`
- Summary: Recapitulates the chapter: Unix philosophy → MapReduce → dataflow engines. The two core problems are partitioning (bringing related data together) and fault tolerance (retry vs. recompute). Batch processing reads bounded input and produces derived output without modifying the input.
- Key claims: The partitioning and fault-tolerance trade-offs define the design space of all distributed batch processing systems; batch processing's bounded-input assumption distinguishes it from stream processing (Chapter 11).
- Learner-relevant: The summary crystallizes the chapter's key insight: batch processing is about deriving new datasets from immutable inputs, with partitioning and fault tolerance as the two fundamental engineering challenges.
