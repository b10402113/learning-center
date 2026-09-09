---
source: 050 Designing Instagram
source_lines: 615
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 050 Designing Instagram

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- What is Instagram?
Try it yourself
- Instagram is a social networking service that enables its users to upload and share their photos and videos with other users. Instagram users can choose to share information either publicly or private

## Sections (L2)

### 1. What is Instagram?

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-1-what-is-instagram]]`
- Summary: Instagram is a social networking service that enables its users to upload and share their photos and videos with other users. Instagram users can choose to share information either publicly or privately. Anything shared publicly can be seen by any other user, whereas privately shared content can only be accessed by the specified set of people. Instagram also enables its users to share through many
- Key claims: Instagram is a social networking service that enables its users to upload and share their photos and videos with other users
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#BcB-WXFjh14pK38aZRkD3-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing Instagram (video)

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h3-designing-instagram-video]]`
- Summary: Here is a video discussing how to design Instagram: Designing Instagram
- Key claims: Here is a video discussing how to design Instagram: Designing Instagram
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: We'll focus on the following set of requirements while designing Instagram: Functional Requirements Users should be able to upload/download/view photos. Users can perform searches based on photo/video titles. Users can follow other users. The system should generate and display a user's News Feed consisting of top photos from all the people the user follows. Non-functional Requirements Our service 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Some Design Considerations

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-3-some-design-considerations]]`
- Summary: The system would be read-heavy, so we will focus on building a system that can retrieve photos quickly. Practically, users can upload as many photos as they like; therefore, efficient management of storage should be a crucial factor in designing this system. Low latency is expected while viewing photos. Data should be 100% reliable. If a user uploads a photo, the system will guarantee that it will
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-4-capacity-estimation-and-constraints]]`
- Summary: Let's assume we have 500M total users, with 1M daily active users. 2M new photos every day, 23 new photos every second. Average photo file size => 200KB Total space required for 1 day of photos 2M * 200KB => 400 GB Total space required for 10 years: 400GB * 365 (days a year) * 10 (years) ~= 1425TB
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. High Level System Design

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-5-high-level-system-design]]`
- Summary: At a high-level, we need to support two scenarios, one to upload photos and the other to view/search photos. Our service would need some object storage servers to store photos and some database servers to store metadata information about the photos. Instagram - High Level Design
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Database Schema

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-6-database-schema]]`
- Summary: 💡 Defining the DB schema in the early stages of the interview would help to understand the data flow among various components and later would guide towards data partitioning. We need to store data about users, their uploaded photos, and the people they follow. The Photo table will store all data related to a photo; we need to have an index on (PhotoID, CreationDate) since we need to fetch recent p
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Data Size Estimation

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-7-data-size-estimation]]`
- Summary: Let's estimate how much data will be going into each table and how much total storage we will need for 10 years. User: Assuming each "int" and "dateTime" is four bytes, each row in the User's table will be of 68 bytes: UserID (4 bytes) + Name (20 bytes) + Email (32 bytes) + DateOfBirth (4 bytes) + CreationDate (4 bytes) + LastLogin (4 bytes) = 68 bytes If we have 500 million users, we will need 32
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Component Design

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-8-component-design]]`
- Summary: Photo uploads (or writes) can be slow as they have to go to the disk, whereas reads will be faster, especially if they are being served from cache. Uploading users can consume all the available connections, as uploading is a slow process. This means that 'reads' cannot be served if the system gets busy with all the 'write' requests. We should keep in mind that web servers have a connection limit b
- Key claims: Uploading users can consume all the available connections, as uploading is a slow process; This means that 'reads' cannot be served if the system gets busy with all the 'write' requests
- Learner-relevant: Core system design concept

### 9. Reliability and Redundancy

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-9-reliability-and-redundancy]]`
- Summary: Losing files is not an option for our service. Therefore, we will store multiple copies of each file so that if one storage server dies, we can retrieve the photo from the other copy present on a different storage server. This same principle also applies to other components of the system. If we want to have high availability of the system, we need to have multiple replicas of services running in t
- Key claims: See summary
- Learner-relevant: Core system design concept

### 10. Data Sharding

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-10-data-sharding]]`
- Summary: Let's discuss different schemes for metadata sharding: a. Partitioning based on UserID Let's assume we shard based on the 'UserID' so that we can keep all photos of a user on the same shard. If one DB shard is 1TB, we will need four shards to store 3.7TB of data. Let's assume, for better performance and scalability, we keep 10 shards. So we'll find the shard number by UserID % 10 and then store th
- Key claims: See summary
- Learner-relevant: Core system design concept

### 11. Ranking and News Feed Generation

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-11-ranking-and-news-feed-generation]]`
- Summary: To create the News Feed for any given user, we need to fetch the latest, most popular, and relevant photos of the people the user follows. For simplicity, let's assume we need to fetch the top 100 photos for a user's News Feed. Our application server will first get a list of people the user follows and then fetch metadata info of each user's latest 100 photos. In the final step, the server will su
- Key claims: See summary
- Learner-relevant: Core system design concept

### 12. News Feed Creation with Sharded Data

- Locator: `[[sources/system-design/completed/20260825_050 Designing Instagram.html#h2-12-news-feed-creation-with-sharded-data]]`
- Summary: One of the most important requirements to create the News Feed for any given user is to fetch the latest photos from all people the user follows. For this, we need to have a mechanism to sort photos on their time of creation. To efficiently do this, we can make photo creation time part of the PhotoID. As we will have a primary index on PhotoID, it will be quite quick to find the latest PhotoIDs. W
- Key claims: See summary
- Learner-relevant: Core system design concept

