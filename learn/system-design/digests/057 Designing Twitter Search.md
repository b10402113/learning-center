---
source: 057 Designing Twitter Search
source_lines: 395
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 057 Designing Twitter Search

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- What is Twitter Search?
Try it yourself
- Twitter users can update their status whenever they like. Each status (called a tweet) consists of plain text and our goal is to design a system that allows searching over all the user tweets.

## Sections (L2)

### 1. What is Twitter Search?

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-1-what-is-twitter-search]]`
- Summary: Twitter users can update their status whenever they like. Each status (called a tweet) consists of plain text and our goal is to design a system that allows searching over all the user tweets.
- Key claims: Each status (called a tweet) consists of plain text and our goal is to design a system that allows searching over all the user tweets
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#5LGKXadVNSvgk1T-w3Cvy-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: Let's assume Twitter has 1.5 billion total users with 800 million daily active users. On average Twitter gets 400 million tweets every day. The average size of a tweet is 300 bytes. Let's assume there will be 500M searches every day. The search query will consist of multiple words combined with AND/OR. We need to design a system that can efficiently store and query tweets.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-3-capacity-estimation-and-constraints]]`
- Summary: Storage Capacity: Since we have 400 million new tweets every day and each tweet on average is 300 bytes, the total storage we need, will be: 400M * 300 => 120GB/day Total storage per second: 120GB / 24hours / 3600sec ~= 1.38MB/second
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. System APIs

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-4-system-apis]]`
- Summary: We can have SOAP or REST APIs to expose the functionality of our service; following could be the definition of the search API: search ( api_dev_key , search_terms , maximum_results_to_return , sort , page_token ) Parameters: api_dev_key (string): The API developer key of a registered account. This will be used to, among other things, throttle users based on their allocated quota. search_terms (str
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. High Level Design

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-5-high-level-design]]`
- Summary: At the high level, we need to store all the tweets in a database and also build an index that can keep track of which word appears in which tweet. This index will help us quickly find tweets that the users are trying to search for. High level design for Twitter search
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Detailed Component Design

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-6-detailed-component-design]]`
- Summary: 1. Storage: We need to store 120GB of new data every day. Given this huge amount of data, we need to come up with a data partitioning scheme that will be efficiently distributing the data onto multiple servers. If we plan for next five years, we will need the following storage: 120GB * 365days * 5years ~= 200TB If we never want to be more than 80% full at any time, we approximately will need 250TB
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Fault Tolerance

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-7-fault-tolerance]]`
- Summary: What will happen when an index server dies? We can have a secondary replica of each server and if the primary server dies it can take control after the failover. Both primary and secondary servers will have the same copy of the index. What if both primary and secondary servers die at the same time? We have to allocate a new server and rebuild the same index on it. How can we do that? We don’t know
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Cache

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-8-cache]]`
- Summary: To deal with hot tweets we can introduce a cache in front of our database. We can use Memcached , which can store all such hot tweets in memory. Application servers, before hitting the backend database, can quickly check if the cache has that tweet. Based on clients’ usage patterns, we can adjust how many cache servers we need. For cache eviction policy, Least Recently Used (LRU) seems suitable fo
- Key claims: See summary
- Learner-relevant: Core system design concept

### 9. Load Balancing

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-9-load-balancing]]`
- Summary: We can add a load balancing layer at two places in our system 1) Between Clients and Application servers and 2) Between Application servers and Backend servers. Initially, a simple Round Robin approach can be adopted; that distributes incoming requests equally among backend servers. This LB is simple to implement and does not introduce any overhead. Another benefit of this approach is LB will take
- Key claims: See summary
- Learner-relevant: Core system design concept

### 10. Ranking

- Locator: `[[sources/system-design/completed/20260825_057 Designing Twitter Search.html#h2-10-ranking]]`
- Summary: How about if we want to rank the search results by social graph distance, popularity, relevance, etc? Let's assume we want to rank tweets by popularity, like how many likes or comments a tweet is getting, etc. In such a case, our ranking algorithm can calculate a 'popularity number' (based on the number of likes, etc.) and store it with the index. Each partition can sort the results based on this 
- Key claims: See summary
- Learner-relevant: Core system design concept

