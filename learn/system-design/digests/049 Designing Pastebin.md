---
source: 049 Designing Pastebin
source_hash: f511b8b74140f8d4406d9fc1e047aae7b1b849e9b629944273891f310cda9e5b
source_lines: 479
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 049 Designing Pastebin

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- What is Pastebin?
Try it yourself
- Pastebin like services enable users to store plain text or images over the network (typically the Internet) and generate unique URLs to access the uploaded data. Such services are also used to share d

## Sections (L2)

### 1. What is Pastebin?

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-1-what-is-pastebin]]`
- Summary: Pastebin like services enable users to store plain text or images over the network (typically the Internet) and generate unique URLs to access the uploaded data. Such services are also used to share data over the network quickly, as users would just need to pass the URL to let other users see it. If you haven't used pastebin.com before, please try creating a new 'Paste' there and spend some time g
- Key claims: See summary
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#Dzzg0nLQAgIuHRYje_SSh-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: Our Pastebin service should meet the following requirements: Functional Requirements: Users should be able to upload or “paste” their data and get a unique URL to access it. Users will only be able to upload text. Data and links will expire after a specific timespan automatically; users should also be able to specify expiration time. Users should optionally be able to pick a custom alias for their
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Some Design Considerations

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-3-some-design-considerations]]`
- Summary: Pastebin shares some requirements with 'URL Shortening service', but there are some additional design considerations we should keep in mind. What should be the limit on the amount of text user can paste at a time? We can limit users not to have Pastes bigger than 10MB to stop the abuse of the service. Should we impose size limits on custom URLs? Since our service supports custom URLs, users can pi
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-4-capacity-estimation-and-constraints]]`
- Summary: Our services will be read-heavy; there will be more read requests compared to new Paste creation. We can assume a 5:1 ratio between the read and write. Traffic estimates: Pastebin services are not expected to have traffic similar to Twitter or Facebook, let’s assume here that we get one million new pastes added to our system every day. This leaves us with five million reads per day. New Pastes per
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. System APIs

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-5-system-apis]]`
- Summary: We can have SOAP or REST APIs to expose the functionality of our service. Following could be the definitions of the APIs to create/retrieve/delete Pastes: addPaste ( api_dev_key , paste_data , custom_url = None user_name = None , paste_name = None , expire_date = None ) Parameters: api_dev_key (string): The API developer key of a registered account. This will be used to, among other things, thrott
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Database Design

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-6-database-design]]`
- Summary: A few observations about the nature of the data we are storing: We need to store billions of records. Each metadata object we are storing would be small (less than 1KB). Each paste object we are storing can be of medium size (it can be a few MB). There are no relationships between records, except if we want to store which user created what Paste. Our service is read-heavy.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Database Schema:

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h3-database-schema]]`
- Summary: We would need two tables, one for storing information about the Pastes and the other for users’ data. DB Schema Here, 'URlHash' is the URL equivalent of the TinyURL, and 'ContentKey' is a reference to an external object storing the contents of the paste; we'll discuss the external storage of the paste contents later in the chapter.
- Key claims: DB Schema Here, 'URlHash' is the URL equivalent of the TinyURL, and 'ContentKey' is a reference to an external object storing the contents of the past
- Learner-relevant: Core system design concept

### 7. High Level Design

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-7-high-level-design]]`
- Summary: At a high level, we need an application layer that will serve all the read and write requests. Application layer will talk to a storage layer to store and retrieve data. We can segregate our storage layer with one database storing metadata related to each paste, users, etc., while the other storing the paste contents in some object storage (like Amazon S3 ). This division of data will also allow u
- Key claims: See summary
- Learner-relevant: Core system design concept

### a. Application layer

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h3-a-application-layer]]`
- Summary: Our application layer will process all incoming and outgoing requests. The application servers will be talking to the backend data store components to serve the requests. How to handle a write request? Upon receiving a write-request, our application server will generate a six-letter random string, which would serve as the key of the paste (if the user has not provided a custom key). The applicatio
- Key claims: Since we are generating a random key, there is a possibility that the newly generated key could match an existing one
- Learner-relevant: Core system design concept

### b. Datastore layer

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h3-b-datastore-layer]]`
- Summary: We can divide our datastore layer into two: Metadata database: We can use a relational database like MySQL or a Distributed Key-Value store like Dynamo or Cassandra. Object storage: We can store our contents in an Object Storage like Amazon's S3. Whenever we feel like hitting our full capacity on content storage, we can easily increase it by adding more servers. Detailed component design for Paste
- Key claims: See summary
- Learner-relevant: Core system design concept

### 9. Purging or DB Cleanup

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-9-purging-or-db-cleanup]]`
- Summary: Please see ' Designing a URL Shortening service '.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 10. Data Partitioning and Replication

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-10-data-partitioning-and-replication]]`
- Summary: Please see ' Designing a URL Shortening service '.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 11. Cache and Load Balancer

- Locator: `[[sources/system-design/completed/20260825_049 Designing Pastebin.html#h2-11-cache-and-load-balancer]]`
- Summary: Please see ' Designing a URL Shortening service '.
- Key claims: See summary
- Learner-relevant: Core system design concept

