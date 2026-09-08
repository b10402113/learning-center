---
source: 059 Designing Facebook Newsfeed
source_hash: a1d420745b4d98fbf43489e7922d0ec17badd0840bb6dc4b5031722d6c8d833f
source_lines: 434
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 059 Designing Facebook Newsfeed

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- What is Facebook’s newsfeed?
Try it yourself
- A Newsfeed is the constantly updating list of stories in the middle of Facebook’s homepage. It includes status updates, photos, videos, links, app activity, and 'likes' from people, pages, and groups 

## Sections (L2)

### 1. What is Facebook’s newsfeed?

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h2-1-what-is-facebooks-newsfeed]]`
- Summary: A Newsfeed is the constantly updating list of stories in the middle of Facebook’s homepage. It includes status updates, photos, videos, links, app activity, and 'likes' from people, pages, and groups that a user follows on Facebook. In other words, it is a compilation of a complete scrollable version of your friends' and your life story from photos, videos, locations, status updates, and other act
- Key claims: In other words, it is a compilation of a complete scrollable version of your friends' and your life story from photos, videos, locations, status updat
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#d4UpG6oqmSLgedXd2c2yC-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: Let’s design a newsfeed for Facebook with the following requirements: Functional requirements: Newsfeed will be generated based on the posts from the people, pages, and groups that a user follows. A user may have many friends and follow a large number of pages/groups. Feeds may contain images, videos, or just text. Our service should support appending new posts as they arrive to the newsfeed for a
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h2-3-capacity-estimation-and-constraints]]`
- Summary: Let’s assume on average a user has 300 friends and follows 200 pages. Traffic estimates: Let’s assume 300M daily active users with each user fetching their timeline an average of five times a day. This will result in 1.5B newsfeed requests per day or approximately 17,500 requests per second. Storage estimates: On average, let’s assume we need to have around 500 posts in every user’s feed that we w
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. System APIs

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h2-4-system-apis]]`
- Summary: 💡 Once we have finalized the requirements, it's always a good idea to define the system APIs. This should explicitly state what is expected from the system. We can have SOAP or REST APIs to expose the functionality of our service. The following could be the definition of the API for getting the newsfeed: getUserFeed ( api_dev_key , user_id , since_id , count , max_id , exclude_replies ) Parameters
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. Database Design

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h2-5-database-design]]`
- Summary: There are three primary objects: User, Entity (e.g. page, group, etc.), and FeedItem (or Post). Here are some observations about the relationships between these entities: A User can follow other entities and can become friends with other users. Both users and entities can post FeedItems which can contain text, images, or videos. Each FeedItem will have a UserID which will point to the User who cre
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. High Level System Design

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h2-6-high-level-system-design]]`
- Summary: At a high level this problem can be divided into two parts: Feed generation: Newsfeed is generated from the posts (or feed items) of users and entities (pages and groups) that a user follows. So, whenever our system receives a request to generate the feed for a user (say Jane), we will perform the following steps: Retrieve IDs of all users and entities that Jane follows. Retrieve latest, most popu
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Detailed Component Design

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h2-7-detailed-component-design]]`
- Summary: Let’s discuss different components of our system in detail. a. Feed generation Let’s take the simple case of the newsfeed generation service fetching most recent posts from all the users and entities that Jane follows; the query would look like this: ( SELECT FeedItemID FROM FeedItem WHERE UserID in ( SELECT EntityOrFriendID FROM UserFollow WHERE UserID = < current_user_id > and type = 0 ( user ) 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Feed Ranking

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h2-8-feed-ranking]]`
- Summary: The most straightforward way to rank posts in a newsfeed is by the creation time of the posts, but today’s ranking algorithms are doing a lot more than that to ensure “important” posts are ranked higher. The high-level idea of ranking is first to select key “signals” that make a post important and then to find out how to combine them to calculate a final ranking score. More specifically, we can se
- Key claims: See summary
- Learner-relevant: Core system design concept

### 9. Data Partitioning

- Locator: `[[sources/system-design/completed/20260825_059 Designing Facebook Newsfeed.html#h2-9-data-partitioning]]`
- Summary: a. Sharding posts and metadata Since we have a huge number of new posts every day and our read load is extremely high too, we need to distribute our data onto multiple machines such that we can read/write it efficiently. For sharding our databases that are storing posts and their metadata, we can have a similar design as discussed under 'Designing Twitter'. b. Sharding feed data For feed data, whi
- Key claims: See summary
- Learner-relevant: Core system design concept

