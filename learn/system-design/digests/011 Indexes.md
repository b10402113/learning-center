---
source: 011 Indexes
source_hash: 24d31fe209c223750db77a1f0b27e68084e58e0b651d4edb869a9ff1747fd230
source_lines: 18
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 011 Indexes

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Indexes are well known when it comes to databases. Sooner or later there comes a time when database performance is no longer satisfactory. One of the very first things you should turn to when that hap
- The goal of creating an index on a particular table in a database is to make it faster to search through the table and find the row or rows that we want. Indexes can be created using one or more colum
- A library catalog is a register that contains the list of books found in a library. The catalog is organized like a database table generally with four columns: book title, writer, subject, and date of

## Sections (L2)

### Example: A library catalog

- Locator: `[[sources/system-design/completed/20260825_011 Indexes.html#h2-example-a-library-catalog]]`
- Summary: A library catalog is a register that contains the list of books found in a library. The catalog is organized like a database table generally with four columns: book title, writer, subject, and date of publication. There are usually two such catalogs: one sorted by the book title and one sorted by the writer name. That way, you can either think of a writer you want to read and then look through the
- Key claims: A library catalog is a register that contains the list of books found in a library; Simply saying, an index is a data structure that can be perceived as a table of contents that points us to the location where actual data lives
- Learner-relevant: Core system design concept

### How do Indexes decrease write performance?

- Locator: `[[sources/system-design/completed/20260825_011 Indexes.html#h2-how-do-indexes-decrease-write-performance]]`
- Summary: An index can dramatically speed up data retrieval but may itself be large due to the additional keys, which slow down data insertion & update. When adding rows or making updates to existing rows for a table with an active index, we not only have to write the data but also have to update the index. This will decrease the write performance. This performance degradation applies to all insert, update,
- Key claims: See summary
- Learner-relevant: Core system design concept

