---
source: 054 Designing Youtube or Netflix
source_hash: 04d6a3cf0e2150e2270969cdbce8a657e2e94633af2487822bf54cd2f305654a
source_lines: 486
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 054 Designing Youtube or Netflix

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- Youtube is one of the most popular video sharing websites in the world. Users of the service can upload, view, share, rate, and report videos as well as add comments on videos.
- Before looking at the solution, try designing it:

## Sections (L2)

### 1. Why Youtube?

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-1-why-youtube]]`
- Summary: Youtube is one of the most popular video sharing websites in the world. Users of the service can upload, view, share, rate, and report videos as well as add comments on videos.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#vAmlNSsH4NFE5nF7XXFkU-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing Youtube (video)

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h3-designing-youtube-video]]`
- Summary: Here is a video discussing how to design Youtube: Designing Youtube
- Key claims: Here is a video discussing how to design Youtube: Designing Youtube
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: For the sake of this exercise, we plan to design a simpler version of Youtube with following requirements: Functional Requirements: Users should be able to upload videos. Users should be able to share and view videos. Users should be able to perform searches based on video titles. Our services should be able to record stats of videos, e.g., likes/dislikes, total number of views, etc. Users should 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-3-capacity-estimation-and-constraints]]`
- Summary: Let’s assume we have 1.5 billion total users, 800 million of whom are daily active users. If, on average, a user views five videos per day then the total video-views per second would be: 800M * 5 / 86400 sec => 46K videos/sec Let's assume our upload:view ratio is 1:200, i.e., for every video upload we have 200 videos viewed, giving us 230 videos uploaded per second. 46K / 200 => 230 videos/sec Sto
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. System APIs

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-4-system-apis]]`
- Summary: We can have SOAP or REST APIs to expose the functionality of our service. The following could be the definitions of the APIs for uploading and searching videos: uploadVideo ( api_dev_key , video_title , video_description , tags [ ] , category_id , default_language , recording_details , video_contents ) Parameters: api_dev_key (string): The API developer key of a registered account. This will be us
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. High Level Design

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-5-high-level-design]]`
- Summary: At a high-level we would need the following components: Processing Queue: Each uploaded video will be pushed to a processing queue to be de-queued later for encoding, thumbnail generation, and storage. Encoder: To encode each uploaded video into multiple formats. Thumbnails generator: To generate a few thumbnails for each video. Video and Thumbnail storage: To store video and thumbnail files in so
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Database Schema

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-6-database-schema]]`
- Summary: Video metadata storage - MySql Videos metadata can be stored in a SQL database. The following information should be stored with each video: VideoID Title Description Size Thumbnail Uploader/User Total number of likes Total number of dislikes Total number of views For each video comment, we need to store following information: CommentID VideoID UserID Comment TimeOfCreation User data storage - MySq
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Detailed Component Design

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-7-detailed-component-design]]`
- Summary: The service would be read-heavy, so we will focus on building a system that can retrieve videos quickly. We can expect our read:write ratio to be 200:1, which means for every video upload, there are 200 video views. Where would videos be stored? Videos can be stored in a distributed file storage system like HDFS or GlusterFS . How should we efficiently manage read traffic? We should segregate our 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Metadata Sharding

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-8-metadata-sharding]]`
- Summary: Since we have a huge number of new videos every day and our read load is extremely high, therefore, we need to distribute our data onto multiple machines so that we can perform read/write operations efficiently. We have many options to shard our data. Let’s go through different strategies of sharding this data one by one: Sharding based on UserID: We can try storing all the data for a particular u
- Key claims: See summary
- Learner-relevant: Core system design concept

### 9. Video Deduplication

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-9-video-deduplication]]`
- Summary: With a huge number of users uploading a massive amount of video data, our service will have to deal with widespread video duplication. Duplicate videos often differ in aspect ratios or encodings, contain overlays or additional borders, or be excerpts from a longer original video. The proliferation of duplicate videos can have an impact on many levels: Data Storage: We could be wasting storage spac
- Key claims: See summary
- Learner-relevant: Core system design concept

### 10. Load Balancing

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-10-load-balancing]]`
- Summary: We should use 'Consistent Hashing' among our cache servers, which will also help in balancing the load between cache servers. Since we will be using a static hash-based scheme to map videos to hostnames, it can lead to an uneven load on the logical replicas due to each video's different popularity. For instance, if a video becomes popular, the logical replica corresponding to that video will exper
- Key claims: See summary
- Learner-relevant: Core system design concept

### 11. Cache

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-11-cache]]`
- Summary: To serve globally distributed users, our service needs a massive-scale video delivery system. Our service should push its content closer to the user using a large number of geographically distributed video cache servers. We need to have a strategy that will maximize user performance and also evenly distributes the load on its cache servers. We can introduce a cache for metadata servers to cache ho
- Key claims: See summary
- Learner-relevant: Core system design concept

### 12. Content Delivery Network (CDN)

- Locator: `[[sources/system-design/completed/20260825_054 Designing Youtube or Netflix.html#h2-12-content-delivery-network-cdn]]`
- Summary: A CDN is a system of distributed servers that deliver web content to a user based on the user's geographic locations, the origin of the web page, and a content delivery server. Take a look at the 'CDN' section in 'Caching' chapter. Our service can move popular videos to CDNs: CDNs replicate content in multiple places. There’s a better chance of videos being closer to the user and, with fewer hops,
- Key claims: A CDN is a system of distributed servers that deliver web content to a user based on the user's geographic locations, the origin of the web page, and 
- Learner-relevant: Core system design concept

