---
source: 060 Designing Yelp or Nearby Friends
source_hash: 07e48302ed881a6b289d2e94c4749a02c99859877f09836c652478273eee1f4c
source_lines: 448
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 060 Designing Yelp or Nearby Friends

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- Why Yelp or Proximity Server?
Try it yourself
- Proximity servers are used to discover nearby attractions like places, events, etc. If you haven’t used yelp.com before, please try it before proceeding (you can search for nearby restaurants, theater

## Sections (L2)

### 1. Why Yelp or Proximity Server?

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h2-1-why-yelp-or-proximity-server]]`
- Summary: Proximity servers are used to discover nearby attractions like places, events, etc. If you haven’t used yelp.com before, please try it before proceeding (you can search for nearby restaurants, theaters, etc.) and spend some time understanding different options that the website offers. This will help you a lot in understanding this chapter better.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#Z0lTEEh_HbtG0o1ITcZ8Z-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing Yelp (video)

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h3-designing-yelp-video]]`
- Summary: Here is a video discussing how to design Yelp or Proximity Server: Designing Yelp
- Key claims: Here is a video discussing how to design Yelp or Proximity Server: Designing Yelp
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: What do we wish to achieve from a Yelp like service? Our service will be storing information about different places so that users can perform a search on them. Upon querying, our service will return a list of places around the user. Our Yelp-like service should meet the following requirements: Functional Requirements: Users should be able to add/delete/update Places. Given their location (longitud
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Scale Estimation

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h2-3-scale-estimation]]`
- Summary: Let's build our system assuming that we have 500M places and 100K queries per second (QPS). Let's also assume a 20% growth in the number of places and QPS each year.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Database Schema

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h2-4-database-schema]]`
- Summary: Each Place can have the following fields: LocationID (8 bytes): Uniquely identifies a location. Name (256 bytes) Latitude (8 bytes) Longitude (8 bytes) Description (512 bytes) Category (1 byte): E.g., coffee shop, restaurant, theater, etc. Although a four bytes number can uniquely identify 500M locations, with future growth in mind, we will go with 8 bytes for LocationID. Total size: 8 + 256 + 8 +
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. System APIs

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h2-5-system-apis]]`
- Summary: We can have SOAP or REST APIs to expose the functionality of our service. The following could be the definition of the API for searching: search ( api_dev_key , search_terms , user_location , radius_filter , maximum_results_to_return , category_filter , sort , page_token ) Parameters: api_dev_key (string): The API developer key of a registered account. This will be used to, among other things, thr
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Basic System Design and Algorithm

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h2-6-basic-system-design-and-algorithm]]`
- Summary: At a high level, we need to store and index each dataset described above (places, reviews, etc.). For users to query this massive database, the indexing should be read efficient, since while searching for the nearby places users expect to see the results in real-time. Given that the location of a place doesn't change that often, we don't need to worry about frequent updates of the data. As a contr
- Key claims: See summary
- Learner-relevant: Core system design concept

### a. SQL solution

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h3-a-sql-solution]]`
- Summary: One simple solution could be to store all the data in a database like MySQL. Each place will be stored in a separate row, uniquely identified by LocationID. Each place will have its longitude and latitude stored separately in two different columns, and to perform a fast search; we should have indexes on both these fields. To find all the nearby places of a given location (X, Y) within a radius 'D'
- Key claims: To find all the nearby places of a given location (X, Y) within a radius 'D', we can query like this: Select * from Places where Latitude between X-D 
- Learner-relevant: Core system design concept

### b. Grids

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h3-b-grids]]`
- Summary: We can divide the whole map into smaller grids to group locations into smaller sets. Each grid will store all the Places residing within a specific range of longitude and latitude. This scheme would enable us to query only a few grids to find nearby places. Based on a given location and radius, we can find all the neighboring grids and then query these grids to find nearby places. Let's assume tha
- Key claims: See summary
- Learner-relevant: Core system design concept

### c. Dynamic size grids

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h3-c-dynamic-size-grids]]`
- Summary: Let's assume we don't want to have more than 500 places in a grid so that we can have a faster searching. So, whenever a grid reaches this limit, we break it down into four grids of equal size and distribute places among them. This means thickly populated areas like downtown San Francisco will have a lot of grids, and sparsely populated area like the Pacific Ocean will have large grids with places
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Data Partitioning

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h2-7-data-partitioning]]`
- Summary: What if we have a huge number of places such that our index does not fit into a single machine’s memory? With 20% growth each year we will reach the memory limit of the server in the future. Also, what if one server cannot serve the desired read traffic? To resolve these issues, we must partition our QuadTree! We will explore two solutions here (both of these partitioning schemes can be applied to
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Replication and Fault Tolerance

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h2-8-replication-and-fault-tolerance]]`
- Summary: Having replicas of QuadTree servers can provide an alternate to data partitioning. To distribute read traffic, we can have replicas of each QuadTree server. We can have a primary-secondary configuration where replicas (secondaries) will only serve read traffic; all write traffic will first go to the primary and then applied to secondaries. Secondaries might not have some recently inserted places (
- Key claims: See summary
- Learner-relevant: Core system design concept

### 9. Cache

- Locator: `[[sources/system-design/completed/20260825_060 Designing Yelp or Nearby Friends.html#h2-9-cache]]`
- Summary: To deal with hot Places, we can introduce a cache in front of our database. We can use an off-the-shelf solution like Memcache, which can store all data about hot places. Application servers, before hitting the backend database, can quickly check if the cache has that Place. Based on clients’ usage pattern, we can adjust how many cache servers we need. For cache eviction policy, Least Recently Use
- Key claims: See summary
- Learner-relevant: Core system design concept

