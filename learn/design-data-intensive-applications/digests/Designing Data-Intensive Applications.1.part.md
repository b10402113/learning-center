# Digest: Designing Data-Intensive Applications — Chapters 1–2

## Sections (L2)

### Ch1: Reliable, Scalable, and Maintainable Applications
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 1: Reliable, Scalable, and Maintainable Applications]]`
- Summary: Introduces the three core concerns of data-intensive systems — reliability, scalability, and maintainability — establishing the conceptual framework for the entire book.
- Key claims: Every data system designer must address these three nonfunctional requirements; they are not one-dimensional labels but engineering trade-offs that require careful thought.
- Learner-relevant: Provides the vocabulary and mental model needed to evaluate every subsequent chapter's techniques against these three goals.

### Ch1: Thinking About Data Systems
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Thinking About Data Systems]]`
- Summary: Motivates why application developers must care about data system internals — when you compose multiple tools into a service, you become a data system designer yourself, needing to reason about correctness, performance, and fault tolerance.
- Key claims: Composite data systems provide guarantees that individual components do not; the boundary between application developer and data system designer is blurry.
- Learner-relevant: Frames the book as relevant not just to database engineers but to any developer building services atop databases.

### Ch1: Reliability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Reliability]]`
- Summary: Defines reliability as "continuing to work correctly, even when things go wrong." Distinguishes faults (one component deviates from spec) from failures (system stops providing service). Introduces fault-tolerance and the deliberate-injection philosophy (Chaos Monkey).
- Key claims: A fault is not the same as a failure; systems can tolerate certain faults to prevent failures; deliberately triggering faults increases confidence in fault-tolerance machinery.
- Learner-relevant: Establishes the fault vs. failure distinction that recurs throughout distributed systems chapters (Chapters 5, 8, 9).

### Ch1: Hardware Faults
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Hardware Faults]]`
- Summary: Hardware faults (disk crashes, RAM errors, power loss) are random and uncorrelated; at scale (10,000 disks), expect ~1 failure/day. Traditional response is redundancy (RAID, dual power supplies, diesel generators). Cloud platforms now make whole-machine loss common, driving software fault-tolerance.
- Key claims: With 10,000 disks at MTTF 10–50 years, expect one disk failure per day; AWS makes VM loss fairly common; software fault-tolerance supplements hardware redundancy.
- Learner-relevant: Motivates why replication and consensus (Chapters 5–7) exist beyond simple backup strategies.

### Ch1: Software Errors
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Software Errors]]`
- Summary: Software bugs are systematic and correlated across nodes — a single bug can crash all instances simultaneously. Examples include the 2012 Linux kernel leap-second bug and cascading failures. Mitigations include thorough testing, process isolation, monitoring, and self-checking.
- Key claims: Systematic software faults cause more failures than uncorrelated hardware faults; bugs lie dormant until unusual circumstances trigger them; no quick fix exists.
- Learner-relevant: Highlights why defensive design patterns (circuit breakers, bulkheads in Chapter 8) matter for data-intensive systems.

### Ch1: Human Errors
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Human Errors]]`
- Summary: Humans are the leading cause of outages (configuration errors account for more downtime than hardware). Best practices: minimize error opportunities, sandbox environments, thorough testing, quick rollback, detailed monitoring/telemetry, good management practices.
- Key claims: Configuration errors are the leading cause of outages in large internet services; a study found hardware faults played a role in only 10–25% of outages.
- Learner-relevant: Motivates infrastructure-as-code, CI/CD pipelines, and observability as essential for data systems.

### Ch1: How Important Is Reliability?
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#How Important Is Reliability]]`
- Summary: Reliability applies beyond mission-critical systems — business applications lose productivity and legal standing; e-commerce loses revenue; even consumer apps hold irreplaceable data (photos, memories). Deliberately sacrificing reliability for cost requires conscious awareness of the trade-off.
- Key claims: A 100ms slowdown reduces Amazon sales by 1%; reliability is a responsibility to users even in "noncritical" apps.
- Learner-relevant: Justifies why the rest of the book devotes substantial attention to reliability mechanisms.

### Ch1: Scalability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Scalability]]`
- Summary: Scalability is the system's ability to cope with increased load — it is not a binary property but a question of trade-offs ("if load doubles, what are our options?"). Requires first defining load parameters and performance metrics.
- Key claims: "X is scalable" is meaningless without specifying the growth dimension; scalability is always relative to a particular load pattern.
- Learner-relevant: Provides the vocabulary (load parameters, performance metrics) used in Chapters 6 (partitioning) and 11 (stream processing).

### Ch1: Describing Load
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Describing Load]]`
- Summary: Load is described with parameters specific to the system: requests/sec, read/write ratio, cache hit rate, etc. The Twitter case study illustrates fan-out as the key challenge — approach 1 (on-read merge) vs. approach 2 (pre-computed timelines with write fan-out) vs. the hybrid approach (celebrity tweets fetched separately).
- Key claims: Twitter's scaling challenge is fan-out, not raw write volume; a tweet delivered to ~75 followers on average but up to 30 million for celebrities; hybrid approach combines write-time fan-out for normal users with read-time merge for celebrities.
- Learner-relevant: Concrete example of how architectural choices depend on load parameters; revisitable in Chapter 12 (batch processing).

### Ch1: Describing Performance
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Describing Performance]]`
- Summary: In batch systems, measure throughput; in online systems, measure response time. Response time is a distribution, not a single number — use percentiles (p50, p95, p99, p999) rather than the mean. Tail latency amplification occurs when multiple backend calls are needed for one user request.
- Key claims: The mean is misleading for response time; high percentiles (tail latencies) directly affect users because the slowest customers are often the most valuable; tail latency amplification means even a small percentage of slow backend calls produces many slow end-user requests.
- Learner-relevant: Percentile-based performance measurement is essential context for understanding Chapters 5 (replication lag), 6 (partitioning), and 12 (batch/stream processing benchmarks).

### Ch1: Approaches for Coping with Load
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Approaches for Coping with Load]]`
- Summary: Scaling up (vertical) vs. scaling out (horizontal/shared-nothing). Elastic vs. manual scaling. No "magic scaling sauce" — architecture must match the specific load pattern (read-heavy, write-heavy, data volume, latency requirements). Stateful distributed systems are fundamentally harder than stateless ones.
- Key claims: There is no generic scalable architecture; systems must be redesigned at each order of magnitude increase in load; common wisdom is to scale up until forced to go distributed.
- Learner-relevant: Sets expectations for Chapters 5–7 (replication, partitioning, transactions) as necessary complexity of distributed data systems.

### Ch1: Maintainability
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Maintainability]]`
- Summary: Most software cost is maintenance, not initial development. Three design principles: operability (make operations easy), simplicity (remove accidental complexity via abstraction), and evolvability (make change easy at the data-system level).
- Key claims: Good operations can work around bad software, but good software cannot run reliably with bad operations; abstraction is the best tool for removing accidental complexity; evolvability extends agility from single files to whole data systems.
- Learner-relevant: These principles inform design choices throughout the book — e.g., why certain replication topologies are preferred (operability), why SQL exists (abstraction/simplicity), and why schema evolution matters (evolvability).

### Ch1: Summary
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Summary]]`
- Summary: Recapitulates the three pillars: reliability (faults in hardware, software, humans), scalability (describing load, measuring performance, choosing architectures), and maintainability (operability, simplicity, abstractions). States there are no easy fixes — only patterns and techniques that recur across application types.
- Key claims: The chapters ahead cover the concrete techniques; Part III covers multi-component systems.
- Learner-relevant: Orienting summary before diving into Chapters 2–4 on data models, storage, and encoding.

### Ch2: Data Models and Query Languages
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Chapter 2: Data Models and Query Languages]]`
- Summary: Introduces data models as layered abstractions: real world → application objects → general-purpose data model (JSON, relational, graph) → bytes on disk/network → hardware representation. Each layer hides complexity below. Data models embody assumptions about usage patterns — some operations are fast, others awkward.
- Key claims: Data models profoundly affect what software can and cannot do; choosing the right model for the application is crucial; Chapter 2 covers models and query languages, Chapter 3 covers storage engines.
- Learner-relevant: Frames the entire Chapter 2 vs. Chapter 3 split — this chapter is "what" (data model + query language), next is "how" (storage engine implementation).

### Ch2: Relational Model Versus Document Model
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Relational Model Versus Document Model]]`
- Summary: The relational model (Codd, 1970) organized data into tables of tuples and dominated for 25–30 years. It grew from business data processing on mainframes. Competitors (network model, hierarchical model, object databases, XML databases) each generated hype but never displaced SQL.
- Key claims: The relational model generalized well beyond its original scope; NoSQL emerged from 2009 with four driving forces: greater scalability needs, open-source preference, specialized query needs, and frustration with rigid schemas.
- Learner-relevant: Historical context for understanding why the relational model is the baseline that document and graph models must be compared against.

### Ch2: The Birth of NoSQL
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Birth of NoSQL]]`
- Summary: "NoSQL" originated as a Twitter hashtag in 2009 for a meetup on open-source, distributed, nonrelational databases, later reinterpreted as "Not Only SQL." Driving forces: scalability for very large datasets or high write throughput, preference for open source, specialized query needs not supported by relational model, desire for more dynamic/expressive data models.
- Key claims: The term "NoSQL" is misleading — it doesn't refer to any specific technology; polyglot persistence (using different databases for different use cases) is the likely future.
- Learner-relevant: Explains the NoSQL movement's motivations, which inform why document and graph databases exist alongside relational ones.

### Ch2: The Object-Relational Mismatch
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Object-Relational Mismatch]]`
- Summary: Object-oriented programming creates an "impedance mismatch" with relational tables. A résumé (LinkedIn profile) is naturally hierarchical — one-to-many relationships (positions, education, contact info). Relational model shreds this into multiple tables with foreign keys; document model (JSON) keeps it as a self-contained nested structure with better locality.
- Key claims: JSON representation provides better locality (all info in one place, one query) vs. relational (multiple queries or messy joins); ORM frameworks reduce but cannot eliminate the impedance mismatch; the tree structure of one-to-many relationships maps naturally to documents.
- Learner-relevant: Core trade-off between document and relational models — locality vs. normalization — that recurs throughout the book (especially Chapters 3, 5, and 6).

### Ch2: Many-to-One and Many-to-Many Relationships
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Many-to-One and Many-to-Many Relationships]]`
- Summary: When data is normalized (region_id as an ID rather than a string), many-to-one relationships arise. Relational databases handle this with joins; document databases have weak join support, forcing the application to emulate joins. As features grow (e.g., recommendations with author references), data becomes more interconnected and many-to-many relationships become unavoidable.
- Key claims: Normalization removes duplication and ensures consistency; many-to-one relationships don't fit the document model well; document databases may force the application to manage denormalization and consistency.
- Learner-relevant: The key tension: document model excels at tree-structured data but struggles with many-to-many; this motivates the graph model discussion later in Chapter 2.

### Ch2: Are Document Databases Repeating History?
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Are Document Databases Repeating History]]`
- Summary: The hierarchical model (IBM IMS, 1968) was a tree-of-records structure similar to JSON. It handled one-to-many well but made many-to-many difficult and had no joins — developers had to choose between duplication and manual reference resolution. The network model (CODASYL) allowed multiple parents per record but required programmers to manually track access paths (pointers on disk), making code complex and inflexible.
- Key claims: IMS and document databases face the same fundamental limitation: difficulty with many-to-many relationships; CODASYL's access paths were efficient but inflexible; the relational model's key insight was laying all data openly and letting a query optimizer handle access paths automatically.
- Learner-relevant: Historical parallel that shows document databases are not a new idea — they revisit problems already solved by the relational model, with trade-offs on both sides.

### Ch2: The Relational Model
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The relational model]]`
- Summary: The relational model laid out data as simple collections of tuples — no nested structures, no access paths. The query optimizer automatically decides execution strategy. New queries can leverage new indexes without code changes. This general-purpose optimizer, built once, benefits all applications.
- Key claims: The relational model's breakthrough was making access paths automatic via the query optimizer rather than manual via programmer; this made data models far more evolvable; you only build a query optimizer once.
- Learner-relevant: Explains why SQL databases have dominated for decades — the optimizer is the key abstraction that makes the relational model powerful despite its simplicity.

### Ch2: Comparison to Document Databases
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Comparison to document databases]]`
- Summary: Document databases reverted to hierarchical nesting for one-to-many but remain similar to relational for many-to-many (foreign keys / document references, resolved at read time via joins or follow-up queries). Document databases have not followed the CODASYL path of mandatory pointer-based access.
- Key claims: For many-to-many relationships, relational and document databases are not fundamentally different; document databases have weak join support compared to relational.
- Learner-relevant: Clarifies that the difference is about where joins happen (database vs. application code) and how strongly joins are supported.

### Ch2: Relational Versus Document Databases Today
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Relational Versus Document Databases Today]]`
- Summary: Summary of the trade-offs: document model → schema flexibility, better locality, closer to app data structures; relational model → better join support, better many-to-many handling. For highly interconnected data, document model is awkward, relational is acceptable, graph is most natural.
- Key claims: The best data model depends on the relationships in the data — no universal answer; convergence is happening as both sides adopt features of the other.
- Learner-relevant: Decision framework for choosing between relational, document, and graph models based on data interconnectedness.

### Ch2: Schema Flexibility in the Document Model
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Schema flexibility in the document model]]`
- Summary: Document databases are "schema-on-read" (structure implicit, interpreted at read time) vs. relational's "schema-on-write" (structure explicit, enforced at write time). Schema-on-read is like dynamic type checking; schema-on-write is like static type checking. Schema changes in relational databases (ALTER TABLE) are fast in most systems (milliseconds) except MySQL, which copies the entire table.
- Key claims: "Schemaless" is misleading — the code assumes a structure; schema-on-read is better for heterogeneous data or data controlled by external systems; schema-on-write is better when all records share the same structure.
- Learner-relevant: The schema-on-read vs. schema-on-write distinction is foundational for understanding encoding formats (Chapter 4) and schema evolution.

### Ch2: Data Locality for Queries
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Data locality for queries]]`
- Summary: Documents are stored as single continuous strings — good locality when you need the whole document, but the database must load the entire document even if you only need a small part. Entire document must be rewritten on updates (unless encoded size doesn't change). Locality advantage is not unique to document model: Spanner allows interleaved rows, Oracle has multi-table index clusters, Bigtable has column families.
- Key claims: Document locality advantage applies only when you access large parts of the document at once; locality grouping is a general technique available in relational systems too (Spanner, Oracle, Bigtable).
- Learner-relevant: Connects to Chapter 3 (storage engines) where locality and data layout are key performance considerations.

### Ch2: Convergence of Document and Relational Databases
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Convergence of document and relational databases]]`
- Summary: Most relational databases now support XML (since mid-2000s) and JSON (PostgreSQL 9.3+, MySQL 5.7+, DB2 10.5+). On the document side, RethinkDB supports joins, MongoDB drivers resolve references. The two models are converging — a hybrid is the best future path.
- Key claims: Relational databases are adding JSON/XML support; document databases are adding relational features; convergence benefits applications by allowing them to use the combination that best fits their needs.
- Learner-relevant: The trend toward polyglot and hybrid persistence shapes modern architecture choices.

### Ch2: Query Languages for Data
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Query Languages for Data]]`
- Summary: SQL is declarative (specify what data you want, not how to get it) vs. imperative (specify step-by-step instructions). Declarative languages are more concise, hide implementation details, enable automatic optimization, and lend themselves to parallel execution. The CSS/XSL vs. JavaScript DOM manipulation analogy illustrates this on the web.
- Key claims: Declarative languages allow the database to improve performance without changing queries; declarative languages are more parallelizable because they specify result patterns not algorithms; SQL's limitations (no ordering guarantee) are actually strengths for optimization.
- Learner-relevant: The declarative vs. imperative distinction underpins why SQL exists, why query optimizers matter, and why MongoDB eventually added its aggregation pipeline.

### Ch2: MapReduce Querying
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#MapReduce Querying]]`
- Summary: MapReduce is a programming model for distributed bulk processing (popularized by Google). MongoDB uses a limited form for read-only queries across documents. Map and reduce functions must be pure (no side effects, no additional DB queries). It is lower-level than SQL — two coordinated JavaScript functions vs. one declarative query. MongoDB 2.2 added the aggregation pipeline as a more declarative alternative.
- Key claims: MapReduce is neither fully declarative nor fully imperative; it is lower-level than SQL; the aggregation pipeline proves that "NoSQL systems may find themselves accidentally reinventing SQL, albeit in disguise."
- Learner-relevant: MapReduce is the conceptual precursor to Hadoop/Spark (Chapter 10); the aggregation pipeline example shows how declarative thinking permeates even NoSQL systems.

### Ch2: Graph-Like Data Models
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Graph-Like Data Models]]`
- Summary: When many-to-many relationships are very common, graph models are the most natural fit. A graph = vertices + edges. Examples: social graphs, web graphs, road networks. Graphs can be heterogeneous (Facebook: people, locations, events, comments as different vertex types). Discussed: property graph model (Neo4j) and triple-store model (Datomic), plus three query languages (Cypher, SPARQL, Datalog).
- Key claims: Graph models excel at many-to-many relationships; they are good for evolvability — new entity types and relationships can be added without schema changes.
- Learner-relevant: Completes the spectrum of data models (relational → document → graph) and introduces the query languages that will be compared.

### Ch2: Property Graphs
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Property Graphs]]`
- Summary: Property graph model: vertices have unique ID, incoming/outgoing edges, and key-value properties; edges have unique ID, head/tail vertices, a label, and key-value properties. Can be represented as two relational tables (vertices + edges) with JSON property columns. Key features: any vertex can connect to any vertex (no schema restrictions), efficient bidirectional traversal, different relationship labels for different kinds of information.
- Key claims: A graph store can be modeled as two relational tables (vertices and edges); graphs are flexible for modeling heterogeneous data (different regional structures in different countries, varying granularity).
- Learner-relevant: The property graph model is the foundation for Cypher queries and Neo4j-style graph databases.

### Ch2: The Cypher Query Language
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Cypher Query Language]]`
- Summary: Cypher is a declarative query language for property graphs (Neo4j). Uses arrow notation for edges: `(Idaho)-[:WITHIN]->(USA)`. Pattern matching with MATCH clause. Variable-length path traversal: `:WITHIN*0..` means "follow a WITHIN edge zero or more times." The same query (emigration from US to Europe) requires only 4 lines in Cypher vs. 29 in SQL with recursive CTEs.
- Key claims: Cypher's pattern matching syntax is far more concise than SQL for graph queries; variable-length path traversal (`:WITHIN*0..`) is a core graph query concept; declarative graph languages let the optimizer choose execution strategy.
- Learner-relevant: Cypher is the benchmark graph query language; its conciseness for graph traversals illustrates why graph databases exist as a separate category.

### Ch2: Graph Queries in SQL
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Graph Queries in SQL]]`
- Summary: Graph data can be stored in relational databases and queried with SQL using recursive common table expressions (WITH RECURSIVE, since SQL:1999). The same query that takes 4 lines in Cypher takes 29 lines in SQL. Different data models are designed for different use cases — the length difference reflects design intent, not deficiency.
- Key claims: Recursive CTEs enable graph traversals in SQL but with much more verbose syntax; the comparison shows that data models should match the application's relationship patterns.
- Learner-relevant: Demonstrates that relational databases can handle graphs, but the ergonomics are poor — motivating graph databases for graph-heavy workloads.

### Ch2: Triple-Stores and SPARQL
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Triple-Stores and SPARQL]]`
- Summary: Triple-store model stores all data as (subject, predicate, object) triples. Object can be a primitive value (property on subject vertex) or another vertex (edge). Turtle format is a human-readable serialization. RDF (Resource Description Framework) is the data model; URIs prevent namespace conflicts for internet-wide data exchange. SPARQL is the query language for triple-stores, predating Cypher (Cypher borrowed its pattern matching from SPARQL).
- Key claims: Triple-stores are mostly equivalent to property graphs using different terminology; SPARQL is even more concise than Cypher for the same query; RDF was intended for internet-wide data exchange but the semantic web hasn't materialized — yet triple-stores remain useful internally.
- Learner-relevant: SPARQL and RDF are important for knowledge graphs and linked data; understanding the triple-store model completes the graph database picture.

### Ch2: Graph Databases Compared to the Network Model
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Graph Databases Compared to the Network Model]]`
- Summary: Graph databases vs. CODASYL network model: (1) no schema restrictions on which record types can be associated; (2) any vertex can be accessed directly by ID or index, not only by traversal; (3) vertices/edges are unordered (ordering only at query time); (4) support for declarative query languages (Cypher, SPARQL) rather than only imperative traversal.
- Key claims: Modern graph databases are fundamentally different from CODASYL: no schema restriction on associations, direct vertex access by ID, no ordering constraint, declarative query support.
- Learner-relevant: Prevents the common misconception that graph databases are a regression to the 1970s network model.

### Ch2: The Foundation: Datalog
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Foundation: Datalog]]`
- Summary: Datalog (1980s academic research) is a subset of Prolog. Data model is similar to triple-stores but generalized: `predicate(subject, object)`. Rules define new predicates derived from existing data or other rules; rules can reference other rules recursively. Used in practice by Datomic and Cascalog (Hadoop). More powerful than Cypher/SPARQL for complex, reusable queries but less convenient for one-off queries.
- Key claims: Datalog provides the foundation that Cypher and SPARQL build upon; rules can be combined and reused across queries; Datalog requires a different thinking style but excels at complex, evolving data relationships.
- Learner-relevant: Datalog is the conceptual ancestor of modern graph query languages; understanding it provides deeper insight into how Cypher and SPARQL work under the hood.

### Ch2: Summary
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Summary]]`
- Summary: Recap of the data model landscape: hierarchical (tree, one-to-many) → relational (many-to-many) → NoSQL divergence into document (self-contained documents, rare inter-document relationships) and graph (anything potentially related to everything). All three models are widely used today. Schema enforcement can be explicit (on write) or implicit (on read). Query languages discussed: SQL, MapReduce, aggregation pipeline, Cypher, SPARQL, Datalog. Many specialized models unmentioned (genome databases, particle physics, full-text search).
- Key claims: No single data model fits all use cases — polyglot persistence is the reality; document and graph databases typically don't enforce schemas but applications still assume structure; Chapter 3 will cover how these data models are implemented in storage engines.
- Learner-relevant: Completes the data model survey; sets up Chapter 3 (storage and retrieval) as the implementation layer behind these abstract models.
