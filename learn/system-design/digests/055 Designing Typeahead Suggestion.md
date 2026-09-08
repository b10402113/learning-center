---
source: 055 Designing Typeahead Suggestion
source_hash: 03a168502506f0d8439a34f00c44b5fd09cda3843920413fa1dce28a367b7f61
source_lines: 399
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 055 Designing Typeahead Suggestion

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- What is Typeahead Suggestion?
Try it yourself
- Designing Typeahead Suggestion (video)

## Sections (L2)

### 1. What is Typeahead Suggestion?

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-1-what-is-typeahead-suggestion]]`
- Summary: Typeahead suggestions enable users to search for known and frequently searched terms. As the user types into the search box, it tries to predict the query based on the characters the user has entered and gives a list of suggestions to complete the query. Typeahead suggestions help the user to articulate their search queries better. It’s not about speeding up the search process but rather about gui
- Key claims: See summary
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#GodhAdTCbhhOo504kMFw8-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing Typeahead Suggestion (video)

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h3-designing-typeahead-suggestion-video]]`
- Summary: Here is a video discussing how to design Typeahead Suggestion: Designing Typeahead Suggestion
- Key claims: Here is a video discussing how to design Typeahead Suggestion: Designing Typeahead Suggestion
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: Functional Requirements: As the user types in their query, our service should suggest top 10 terms starting with whatever the user has typed. Non-function Requirements: The suggestions should appear in real-time. The user should be able to see the suggestions within 200ms.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Basic System Design and Algorithm

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-3-basic-system-design-and-algorithm]]`
- Summary: The problem we are trying to solve is that we have a lot of 'strings' that we need to store in such a way that users can search with any prefix. Our service will suggest the next terms matching the given prefix. For example, if our database contains the following terms: cap, cat, captain, or capital, and the user has typed in 'cap', our system should suggest 'cap', 'captain' and 'capital'. As we h
- Key claims: A trie is a tree-li
- Learner-relevant: Core system design concept

### 4. Permanent Storage of the Trie

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-4-permanent-storage-of-the-trie]]`
- Summary: How to store trie in a file so that we can rebuild our trie easily - this will be needed when a machine restarts? We can take a snapshot of our trie periodically and store it in a file. This will enable us to rebuild a trie if the server goes down. To store, we can start with the root node and save the trie level-by-level. With each node, we can store what character it contains and how many childr
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. Scale Estimation

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-5-scale-estimation]]`
- Summary: If we are building a service that has the same scale as that of Google we can expect 5 billion searches every day, which would give us approximately 60K queries per second. Since there will be a lot of duplicates in 5 billion queries, we can assume that only 20% of these will be unique. If we only want to index the top 50% of the search terms, we can get rid of a lot of less frequently searched qu
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Data Partition

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-6-data-partition]]`
- Summary: Although our index can easily fit on one server, we can still partition it in order to meet our requirements of higher efficiency and lower latencies. How can we efficiently partition our data to distribute it onto multiple servers? a. Range Based Partitioning: What if we store our phrases in separate partitions based on their first letter. So we save all the terms starting with the letter ‘A’ in 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Cache

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-7-cache]]`
- Summary: We should realize that caching the top searched terms will be extremely helpful in our service. There will be a small percentage of queries that will be responsible for most of the traffic. We can have separate cache servers in front of the trie servers holding the most frequently searched terms and their typeahead suggestions. Application servers should check these cache servers before hitting th
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Replication and Load Balancer

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-8-replication-and-load-balancer]]`
- Summary: We should have replicas for our trie servers both for load balancing and also for fault tolerance. We also need a load balancer that keeps track of our data partitioning scheme and redirects traffic based on the prefixes.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 9. Fault Tolerance

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-9-fault-tolerance]]`
- Summary: What will happen when a trie server goes down? As discussed above we can have a primary-secondary configuration; if the primary dies, the secondary can take over after failover. Any server that comes back up, can rebuild the trie based on the last snapshot.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 10. Typeahead Client

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-10-typeahead-client]]`
- Summary: We can perform the following optimizations on the client-side to improve user's experience: The client should only try hitting the server if the user has not pressed any key for 50ms. If the user is constantly typing, the client can cancel the in-progress requests. Initially, the client can wait until the user enters a couple of characters. Clients can pre-fetch some data from the server to save f
- Key claims: See summary
- Learner-relevant: Core system design concept

### 11. Personalization

- Locator: `[[sources/system-design/completed/20260825_055 Designing Typeahead Suggestion.html#h2-11-personalization]]`
- Summary: Users will receive some typeahead suggestions based on their historical searches, location, language, etc. We can store the personal history of each user separately on the server and also cache them on the client. The server can add these personalized terms in the final set before sending it to the user. Personalized searches should always come before others. Previous Designing Youtube or Netflix 
- Key claims: See summary
- Learner-relevant: Core system design concept

