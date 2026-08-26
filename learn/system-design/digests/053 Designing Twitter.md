---
source: 053 Designing Twitter
source_hash: 61c93f1b027e2eaff5620b08b81d2223181983d7a8a7d5919b2b1321d102c804
source_lines: 471
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 053 Designing Twitter

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- What is Twitter?
Try it yourself
- Twitter is an online social networking service where users post and read short messages called "tweets." Registered users can post and read tweets, but those who are not registered can only read them.

## Sections (L2)

### 1. What is Twitter?

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-1-what-is-twitter]]`
- Summary: Twitter is an online social networking service where users post and read short messages called "tweets." Registered users can post and read tweets, but those who are not registered can only read them. Users access Twitter through their website interface, SMS, or mobile app.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#tV2q3Mq-KMlPa9nZ9jGwT-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: We will be designing a simpler version of Twitter with the following requirements: Functional Requirements Users should be able to post new tweets. A user should be able to follow other users. Users should be able to mark tweets as favorites. The service should be able to create and display a user's timeline consisting of top tweets from all the people the user follows. Tweets can contain photos a
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-3-capacity-estimation-and-constraints]]`
- Summary: Let's assume we have one billion total users with 200 million daily active users (DAU). Also assume we have 100 million new tweets every day and on average each user follows 200 people. How many favorites per day? If, on average, each user favorites five tweets per day we will have: 200M users * 5 favorites => 1B favorites How many total tweet-views will our system generate? Let's assume on averag
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. System APIs

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-4-system-apis]]`
- Summary: 💡 Once we've finalized the requirements, it's always a good idea to define the system APIs. This should explicitly state what is expected from the system. We can have SOAP or REST APIs to expose the functionality of our service. Following could be the definition of the API for posting a new tweet: tweet ( api_dev_key , tweet_data , tweet_location , user_location , media_ids ) Parameters: api_dev_k
- Key claims: tweet_location (string): Optional location (longitude, latitude) this Tweet refers to
- Learner-relevant: Core system design concept

### 5. High Level System Design

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-5-high-level-system-design]]`
- Summary: We need a system that can efficiently store all the new tweets, 100M/86400s => 1150 tweets per second and read 28B/86400s => 325K tweets per second. It is clear from the requirements that this will be a read-heavy system. At a high level, we need multiple application servers to serve all these requests with load balancers in front of them for traffic distributions. On the backend, we need an effic
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Database Schema

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-6-database-schema]]`
- Summary: We need to store data about users, their tweets, their favorite tweets, and people they follow. DB Schema For choosing between SQL and NoSQL databases to store the above schema, please see 'Database schema' under 'Designing Instagram'.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Data Sharding

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-7-data-sharding]]`
- Summary: Since we have a huge number of new tweets every day and our read load is extremely high too, we need to distribute our data onto multiple machines such that we can read/write it efficiently. We have many options to shard our data; let's go through them one by one: Sharding based on UserID: We can try storing all the data of a user on one server. While storing, we can pass the UserID to our hash fu
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Cache

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-8-cache]]`
- Summary: We can introduce a cache for database servers to cache hot tweets and users. We can use an off-the-shelf solution like Memcache that can store the whole tweet objects. Application servers, before hitting database, can quickly check if the cache has desired tweets. Based on clients’ usage patterns we can determine how many cache servers we need. Which cache replacement policy would best fit our nee
- Key claims: If we go with 80-20 rule, that is 20% of tweets generating 80% of read traffic which means that certain tweets are
- Learner-relevant: Core system design concept

### 9. Timeline Generation

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-9-timeline-generation]]`
- Summary: For a detailed discussion about timeline generation, take a look at 'Designing Facebook’s Newsfeed'.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 10. Replication and Fault Tolerance

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-10-replication-and-fault-tolerance]]`
- Summary: Since our system is read-heavy, we can have multiple secondary database servers for each DB partition. Secondary servers will be used for read traffic only. All writes will first go to the primary server and then will be replicated to secondary servers. This scheme will also give us fault tolerance, since whenever the primary server goes down we can failover to a secondary server.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 11. Load Balancing

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-11-load-balancing]]`
- Summary: We can add Load balancing layer at three places in our system 1) Between Clients and Application servers 2) Between Application servers and database replication servers and 3) Between Aggregation servers and Cache server. Initially, a simple Round Robin approach can be adopted; that distributes incoming requests equally among servers. This LB is simple to implement and does not introduce any overh
- Key claims: See summary
- Learner-relevant: Core system design concept

### 12. Monitoring

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-12-monitoring]]`
- Summary: Having the ability to monitor our systems is crucial. We should constantly collect data to get an instant insight into how our system is doing. We can collect following metrics/counters to get an understanding of the performance of our service: New tweets per day/second, what is the daily peak? Timeline delivery stats, how many tweets per day/second our service is delivering. Average latency that 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 13. Extended Requirements

- Locator: `[[sources/system-design/completed/20260825_053 Designing Twitter.html#h2-13-extended-requirements]]`
- Summary: How do we serve feeds? Get all the latest tweets from the people someone follows and merge/sort them by time. Use pagination to fetch/show tweets. Only fetch top N tweets from all the people someone follows. This N will depend on the client's Viewport, since on a mobile we show fewer tweets compared to a Web client. We can also cache next top tweets to speed things up. Alternately, we can pre-gene
- Key claims: See summary
- Learner-relevant: Core system design concept

