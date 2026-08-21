Ch 3: Storage and Retrieval — How database storage engines (LSM-trees, B-trees, column stores) work under the hood and why OLTP vs OLAP demand different designs
Ch 4: Encoding and Evolution — How data is serialized across processes (Thrift, Protobuf, Avro) and the compatibility rules that make schema evolution safe

---

## Sections (L2)

### ch3-data-structures-powering-db
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Data Structures That Power Your Database]]`
- Summary: Introduces the core question of this chapter: what data structures do databases use under the hood to efficiently store and retrieve data, given the constraints of disks and memory.
- Key claims: Storage engines fall into two broad categories—those optimized for transaction processing (OLTP) and those optimized for analytics (OLAP); the choice of index structure fundamentally determines read/write performance characteristics.
- Learner-relevant: Establishes the vocabulary and framing needed to reason about every subsequent storage-engine subsection.

### ch3-hash-indexes-bitcask
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Hash Indexes]]`
- Summary: Explains how an append-only log with an in-memory hash index (the Bitcask approach) provides fast key-value reads and writes, and details practical concerns: segment splitting, compaction, tombstones, crash recovery, checksums, and concurrency.
- Key claims: Append-only writes are sequential and thus fast on both HDDs and SSDs; compaction prevents the log from growing unboundedly; the hash table must fit in memory, limiting the number of keys; range queries are not efficient.
- Learner-relevant: Provides the simplest mental model for a log-structured storage engine and surfaces the trade-offs (memory-bound index, no range scans) that more advanced structures address.

### ch3-sstables-lsm-trees
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#SSTables and LSM-Trees]]`
- Summary: Describes Sorted String Tables (SSTables)—segment files where key-value pairs are sorted by key—and how they are merged efficiently via a mergesort-like algorithm. Introduces the memtable (in-memory red-black tree), the write-ahead log for crash recovery, and Bloom filters for existence checks. Covers size-tiered vs leveled compaction strategies.
- Key claims: Sorted key order enables efficient merge operations that work even for datasets larger than memory; a sparse in-memory index is sufficient because scanning a few KB is fast; LSM-trees achieve high write throughput by converting random writes into sequential writes; Bloom filters prevent unnecessary disk reads for nonexistent keys.
- Learner-relevant: This is the foundational mechanism behind LevelDB, RocksDB, Cassandra, and HBase—understanding it explains the write-performance advantage of log-structured engines.

### ch3-b-trees
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#B-Trees]]`
- Summary: Explains B-tree architecture—fixed-size pages (traditionally 4 KB), a branching factor of several hundred, O(log n) lookup depth—and how updates work: overwriting pages in place. Covers the write-ahead log (WAL) needed for crash safety, latch-based concurrency control, and common optimizations (copy-on-write, key abbreviation, sibling pointers, fractal trees).
- Key claims: B-trees remain the most widely used index in relational databases; a four-level tree with branching factor 500 can index 256 TB; in-place overwrites require a WAL and careful concurrency control; each key exists in exactly one place, simplifying transactional locking.
- Learner-relevant: Provides the counterpoint to log-structured indexes and explains why B-trees dominate OLTP despite LSM-trees' write advantages.

### ch3-comparing-btrees-lsm
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Comparing B-Trees and LSM-Trees]]`
- Summary: Head-to-head comparison of B-trees and LSM-trees. B-trees write data at least twice (WAL + page); LSM-trees may rewrite data many times through compaction (write amplification). LSM-trees achieve higher write throughput and better compression; B-trees offer more predictable read latency (no compaction interference) and simpler transactional locking since each key exists in one place.
- Key claims: LSM-trees are typically faster for writes, B-trees for reads; write amplification is a key concern on SSDs with limited overwrite cycles; compaction can cause latency spikes at high percentiles; benchmarks are workload-dependent—empirical testing is essential.
- Learner-relevant: Equips the learner to make informed decisions about storage engine selection and to understand the performance tuning knobs of real systems.

### ch3-other-indexing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Other Indexing Structures]]`
- Summary: Extends beyond primary key indexes to cover secondary indexes (heap file vs clustered index vs covering index), multi-column / concatenated indexes, multi-dimensional indexes (R-trees, space-filling curves), full-text search and fuzzy indexes (Lucene's finite-state automata, Levenshtein edit distance), and in-memory databases (VoltDB, Redis, RAMCloud, anti-caching).
- Key claims: Secondary indexes can be built on top of any primary index structure; clustered and covering indexes trade write overhead and storage for read speed; multi-dimensional indexes enable efficient geospatial and range queries across multiple fields; in-memory databases are faster not primarily because they avoid disk reads (the OS caches disk blocks anyway) but because they avoid encoding data for on-disk representation.
- Learner-relevant: Broadens the learner's toolkit beyond simple key-value lookups to the indexing strategies that power real-world query workloads.

### ch3-transaction-vs-analytics
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Transaction Processing or Analytics]]`
- Summary: Defines the fundamental distinction between OLTP (small reads/writes by key, user-facing, gigabytes–terabytes) and OLAP (large scans and aggregates, analyst-facing, terabytes–petabytes). Explains why using the same database for both degrades OLTP performance, motivating the separation into a data warehouse.
- Key claims: OLTP systems require low-latency random access; OLAP systems require high-throughput sequential scans; the access patterns are fundamentally different enough that most vendors now optimize for one or the other, not both.
- Learner-relevant: Provides the architectural motivation for column-oriented storage and data warehousing, which the following sections detail.

### ch3-data-warehousing
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Data Warehousing]]`
- Summary: Explains the ETL pipeline—extracting data from multiple OLTP systems, transforming it into an analysis-friendly schema, and loading it into a read-only data warehouse. Lists major vendors (Teradata, Vertica, Amazon RedShift) and open-source SQL-on-Hadoop projects (Hive, Spark SQL, Impala, Presto, Drill).
- Key claims: Data warehouses exist to isolate expensive analytic queries from latency-sensitive OLTP systems; ETL transforms data into a schema optimized for analytics rather than transactions; the warehouse is the standard enterprise architecture for business intelligence.
- Learner-relevant: Establishes the real-world context in which column-oriented storage and star schemas are deployed.

### ch3-star-snowflake-schemas
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Stars and Snowflakes: Schemas for Analytics]]`
- Summary: Describes the star schema (a central fact table surrounded by dimension tables representing who/what/where/when/how/why) and the snowflake variant (normalized dimensions). Notes that fact tables can be extremely large (petabytes at companies like Apple/Walmart/eBay) while dimension tables are comparatively small.
- Key claims: Star schemas are the dominant modeling pattern for data warehouses; fact tables capture individual events (sales, clicks) for maximum analytical flexibility; snowflake schemas are more normalized but star schemas are preferred for analyst usability.
- Learner-relevant: Provides the data-model foundation that column-oriented storage and aggregation optimizations are built upon.

### ch3-column-oriented-storage
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Column-Oriented Storage]]`
- Summary: Explains why row-oriented storage is inefficient for analytics (a 100-column table scanned for 3–5 columns wastes I/O) and how column-oriented storage solves this by storing each column in a separate file. Covers column compression via bitmap encoding and run-length encoding, memory bandwidth and vectorized processing (SIMD, L1 cache efficiency), sort order in column stores (composite sort keys), multiple sort orders (Vertica/C-Store), and writing to column stores (LSM-tree-like batching). Introduces materialized views and data cubes as pre-computed aggregation caches.
- Key claims: Column-oriented storage dramatically reduces I/O for analytic queries by reading only relevant columns; bitmap indexes enable fast bitwise AND/OR operations for filtering; vectorized processing exploits CPU cache lines for throughput; sorting by a primary key accelerates both scans and compression; materialized data cubes pre-compute aggregates but sacrifice the flexibility of raw-data queries.
- Learner-relevant: This is the core technical explanation for why modern analytics databases achieve orders-of-magnitude speedups over row stores for scan-heavy workloads.

---

### ch4-formats-for-encoding
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Formats for Encoding Data]]`
- Summary: Introduces the fundamental problem of encoding in-memory data structures into byte sequences for storage or network transmission. Surveys language-specific formats (Java Serializable, pickle—convenient but non-portable, insecure, and lacking compatibility guarantees), textual formats (JSON, XML, CSV—widely interoperable but ambiguous about numbers, binary strings, and schemas), and binary formats (MessagePack—compact but still schema-less, so field names are encoded every time).
- Key claims: Language-specific encodings are a bad choice for anything beyond transient use due to security and portability issues; JSON/XML/CSV are adequate for cross-organization interchange but suffer from numeric ambiguity (e.g., JavaScript cannot represent integers > 2^53) and lack of binary string support; schema-less binary encodings like MessagePack save modest space (66 bytes vs 81 bytes for the example record) but not dramatically.
- Learner-relevant: Establishes the encoding landscape and motivates why schema-driven binary formats exist.

### ch4-thrift-protobuf
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Thrift and Protocol Buffers]]`
- Summary: Details how Thrift (Facebook) and Protocol Buffers (Google) use schemas with numeric field tags to achieve compact binary encoding. Explains BinaryProtocol (59 bytes for the example record), CompactProtocol (34 bytes via variable-length integers and packed type+tag bytes), and Protocol Buffers (33 bytes). Covers schema evolution rules: fields are identified by tag numbers (not names), new fields require new tags, old fields can only be removed if optional, and tag numbers can never be reused.
- Key claims: Field tags replace field names, dramatically reducing encoded size; schema evolution is safe as long as new fields are optional/have defaults and tag numbers are never reused; changing a field's datatype is possible but risks truncation (e.g., 32-bit to 64-bit); Protocol Buffers' repeated field encoding allows optional-to-repeated evolution that Thrift's dedicated list type does not.
- Learner-relevant: Provides concrete understanding of how the two most widely-used binary serialization formats work and their specific compatibility rules.

### ch4-avro
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Avro]]`
- Summary: Explains Apache Avro's schema-driven encoding (32 bytes for the example record—the most compact), where encoded data contains no field tags or type markers, only values concatenated in schema order. Describes the writer's schema / reader's schema resolution mechanism, compatibility rules (fields must have defaults to be added or removed), and how the writer's schema is communicated: embedded at the start of files, versioned per-record in databases, or negotiated on connection setup.
- Key claims: Avro's schema resolution matches fields by name, so writer and reader schemas can have fields in different orders; no tag numbers means Avro is uniquely friendly to dynamically generated schemas (e.g., from a relational database dump); the writer's schema must be discoverable by the reader, which is achieved through file headers, schema version databases, or connection negotiation.
- Learner-relevant: Avro's design philosophy—name-based resolution and no tag numbers—represents a fundamentally different trade-off from Thrift/Protobuf, with practical implications for schema evolution in Hadoop ecosystems and dynamic-data scenarios.

### ch4-code-generation-dynamic-languages
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Code generation and dynamically typed languages]]`
- Summary: Contrasts how Thrift/Protobuf rely on code generation (valuable in statically typed languages for type checking and IDE support, but awkward in dynamically typed languages) with Avro's approach of optional code generation and self-describing files that can be read directly without a compilation step.
- Key claims: Code generation is most useful in statically typed languages; in dynamically typed languages like Python/Ruby/JS, generated code is an unnecessary obstacle; Avro object container files are self-describing and can be opened directly with the Avro library.
- Learner-relevant: Helps the learner choose an encoding format based on their programming language ecosystem.

### ch4-merits-of-schemas
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#The Merits of Schemas]]`
- Summary: Summarizes the advantages of schema-driven binary encodings (Thrift/Protobuf/Avro): compact encoding (omitting field names), schemas as living documentation, compile-time schema compatibility checking, and code generation for type safety. Notes historical precedent in ASN.1 (1984) and notes that relational databases also use proprietary binary protocols via ODBC/JDBC.
- Key claims: Schema-driven binary encodings are more compact, better documented, and more safely evolvable than schema-less formats; schema evolution provides the same flexibility as schemaless databases but with stronger guarantees and better tooling.
- Learner-relevant: Provides the synthesis argument for why binary schema-driven formats are the preferred choice for internal systems.

### ch4-dataflow-through-databases
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Dataflow Through Databases]]`
- Summary: Explains the compatibility requirements when data flows through a database: backward compatibility (new code reads old data) and forward compatibility (old code reads new data) are both needed because multiple application versions coexist during rolling upgrades. Warns about the subtle trap where an old application version reads a record, updates it, and writes it back—potentially dropping unknown fields if the encoding isn't preserved through the round-trip.
- Key claims: "Data outlives code"—database contents persist for years while application code is replaced in minutes; simple schema changes (adding nullable columns) are preferred over full rewrites; the unknown-field-preservation problem is an application-level concern even when the encoding supports it.
- Learner-relevant: Explains why forward and backward compatibility aren't just theoretical concerns but have practical consequences during rolling deployments.

### ch4-dataflow-through-services
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Dataflow Through Services: REST and RPC]]`
- Summary: Covers client-server communication over networks. Contrasts REST (design philosophy using HTTP features, simple data formats, dominant for public APIs) with SOAP (XML-based, WSDL code generation, complex WS-* standards, fallen out of favor). Explains the fundamental problems with the RPC abstraction (location transparency is flawed): network requests are unpredictable, have timeouts that create ambiguity, require idempotence for safe retries, have variable latency, and require cross-language type translation. Surveys modern RPC frameworks (gRPC, Finagle, Thrift, Rest.li) that acknowledge these realities. Notes that for RPC over services, only backward compatibility on requests and forward compatibility on responses is needed (servers update first, then clients).
- Key claims: REST's appeal is that it doesn't hide the network; RPC's fundamental flaw is pretending a remote call is like a local function call; modern RPC frameworks use futures/promises and streams to be explicit about async failure; REST dominates public APIs while RPC frameworks focus on intra-organization communication; API versioning has no industry consensus.
- Learner-relevant: Explains the design trade-offs behind API architecture choices and why encoding compatibility matters differently in databases vs services.

### ch4-message-passing-dataflow
- Locator: `[[sources/design-data-intensive-applications/Designing Data-Intensive Applications.pdf#Message-Passing Dataflow]]`
- Summary: Describes asynchronous message-passing systems (message brokers like RabbitMQ, Kafka, ActiveMQ) as a middle ground between RPC and databases. Brokers provide buffering, auto-redelivery, sender-recipient decoupling, and fan-out. Messages are one-way (no direct reply), and the broker doesn't enforce a data model—encoding compatibility is the publisher/consumer's responsibility. Also covers distributed actor frameworks (Akka, Orleans, Erlang OTP) where the actor model's built-in assumption of message loss makes location transparency more natural than in RPC, but rolling upgrades still require compatible serialization.
- Key claims: Message brokers decouple producers and consumers, improving reliability and flexibility; the one-way asynchronous pattern avoids RPC's timeout-ambiguity problem; distributed actor frameworks integrate the broker into the programming model but don't eliminate the need for schema compatibility during rolling upgrades; Akka defaults to Java serialization (no compatibility), Orleans requires full cluster replacement for upgrades, Erlang OTP makes schema changes difficult.
- Learner-relevant: Completes the picture of dataflow modes and explains why encoding compatibility is a universal concern across databases, services, and message-passing systems.
