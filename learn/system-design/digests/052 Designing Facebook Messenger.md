---
source: 052 Designing Facebook Messenger
source_hash: 51c3b8d8f9e5967abf7fae86345d15f52a8f966acc70e09f7717fcd392aa9590
source_lines: 447
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 052 Designing Facebook Messenger

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- What is Facebook Messenger?
Try it yourself
- b. Storing and retrieving the messages from the database

## Sections (L2)

### 1. What is Facebook Messenger?

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h2-1-what-is-facebook-messenger]]`
- Summary: Facebook Messenger is a software application that provides text-based instant messaging services to its users. Messenger users can chat with their Facebook friends both from cell phones and Facebook’s website.
- Key claims: Facebook Messenger is a software application that provides text-based instant messaging services to its users
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#J2bc57JWkgJceBR0mDXl1-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing Messenger (video)

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h3-designing-messenger-video]]`
- Summary: Here is a video discussing how to design Facebook Messenger: Designing Messenger
- Key claims: Here is a video discussing how to design Facebook Messenger: Designing Messenger
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: Our Messenger should meet the following requirements: Functional Requirements: Messenger should support one-on-one conversations between users. Messenger should keep track of the online/offline statuses of its users. Messenger should support the persistent storage of chat history. Non-functional Requirements: Users should have a real-time chatting experience with minimum latency. Our system should
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h2-3-capacity-estimation-and-constraints]]`
- Summary: Let's assume that we have 500 million daily active users, and on average, each user sends 40 messages daily; this gives us 20 billion messages per day. Storage Estimation: Let's assume that, on average, a message is 100 bytes. So to store all the messages for one day, we would need 2TB of storage. 20 billion messages * 100 bytes => 2 TB/day To store five years of chat history, we would need 3.6 pe
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. High Level Design

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h2-4-high-level-design]]`
- Summary: At a high level, we will need a chat server that will be the central piece orchestrating all the communications between users. For example, when a user wants to send a message to another user, they will connect to the chat server and send the message to the server; the server then passes that message to the other user and also stores it in the database. High Level Design The detailed workflow woul
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. Detailed Component Design

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h2-5-detailed-component-design]]`
- Summary: Let's try to build a simple solution first where everything runs on one server. At the high level, our system needs to handle the following use cases: Receive incoming messages and deliver outgoing messages. Store and retrieve messages from the database. Keep a record of which user is online or has gone offline, and notify all the relevant users about these status changes. Let's talk about these s
- Key claims: See summary
- Learner-relevant: Core system design concept

### a. Messages Handling

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h3-a-messages-handling]]`
- Summary: How would we efficiently send/receive messages? To send messages, a user needs to connect to the server and post messages for the other users. To get a message from the server, the user has two options: Pull model: Users can periodically ask the server if there are any new messages for them. Push model: Users can keep a connection open with the server and can depend upon the server to notify them 
- Key claims: See summary
- Learner-relevant: Core system design concept

### b. Storing and retrieving the messages from the database

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h3-b-storing-and-retrieving-the-messages-from-the-database]]`
- Summary: Whenever the chat server receives a new message, it needs to store it in the database. To do so, we have two options: Start a separate thread, which will work with the database to store the message. Send an asynchronous request to the database to store the message. We have to keep certain things in mind while designing our database: How to efficiently work with the database connection pool. How to
- Key claims: See summary
- Learner-relevant: Core system design concept

### c. Managing user's status

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h3-c-managing-users-status]]`
- Summary: We need to keep track of user's online/offline status and notify all the relevant users whenever a status change happens. Since we are maintaining a connection object on the server for all active users, we can easily figure out the user's current status from this. With 500M active users at any time, if we have to broadcast each status change to all the relevant active users, it will consume a lot 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Data partitioning

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h2-6-data-partitioning]]`
- Summary: Since we will be storing a lot of data (3.6PB for five years), we need to distribute it onto multiple database servers. So, what will be our partitioning scheme? Partitioning based on UserID: Let's assume we partition based on the hash of the UserID so that we can keep all messages of a user on the same database. If one DB shard is 4TB, we will have "3.6PB/4TB ~= 900" shards for five years. For si
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Cache

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h2-7-cache]]`
- Summary: We can cache a few recent messages (say last 15) in a few recent conversations that are visible in a user's viewport (say last 5). Since we decided to store all of the user's messages on one shard, the cache for a user should entirely reside on one machine too.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Load balancing

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h2-8-load-balancing]]`
- Summary: We will need a load balancer in front of our chat servers that can map each UserID to a server that holds the connection for the user and then direct the request to that server. Similarly, we would need a load balancer for our cache servers.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 9. Fault tolerance and Replication

- Locator: `[[sources/system-design/completed/20260825_052 Designing Facebook Messenger.html#h2-9-fault-tolerance-and-replication]]`
- Summary: What will happen when a chat server fails? Our chat servers are holding connections with the users. If a server goes down, should we devise a mechanism to transfer those connections to some other server? It's extremely hard to failover TCP connections to other servers; an easier approach can be to have clients automatically reconnect if the connection is lost. Should we store multiple copies of us
- Key claims: See summary
- Learner-relevant: Core system design concept

