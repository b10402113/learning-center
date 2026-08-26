---
source: 003 What are BackoftheEnvelope Estimations
source_hash: a187e4769effeeb63a1b66ff9923ce95db2f811b913970b3d29519c68719b56d
source_lines: 146
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 003 What are BackoftheEnvelope Estimations

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Back of the envelope estimations in system design interviews are like quick, rough calculations you might do on a napkin during lunch - they're not detailed or exact, but give you a good ballpark figu
- Back-of-the-envelope estimation is a technique used to quickly approximate values and make rough calculations using simple arithmetic and basic assumptions. This method is particularly useful in syste
- During a system design interview, you’ll be asked to design a scalable and reliable system based on a set of requirements. Your ability to make quick estimations is essential for several reasons:

## Sections (L2)

### Purpose

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h2-purpose]]`
- Summary: Back-of-the-envelope estimation is a technique used to quickly approximate values and make rough calculations using simple arithmetic and basic assumptions. This method is particularly useful in system design interviews, where interviewers expect candidates to make informed decisions and trade-offs based on rough estimates.
- Key claims: Back-of-the-envelope estimation is a technique used to quickly approximate values and make rough calculations using simple arithmetic and basic assump
- Learner-relevant: Core system design concept

### Why is Estimation Important in System Design Interviews?

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h2-why-is-estimation-important-in-system-design-interviews]]`
- Summary: During a system design interview, you’ll be asked to design a scalable and reliable system based on a set of requirements. Your ability to make quick estimations is essential for several reasons: Indicates System Scalability : Highlights your understanding of how the system can grow or adapt. Validate proposed solutions: Estimation helps you ensure that your proposed architecture meets the require
- Key claims: See summary
- Learner-relevant: Core system design concept

### 1. Rule of thumb

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-1-rule-of-thumb]]`
- Summary: Rules of thumb are general guidelines or principles that can be applied to make quick and reasonably accurate estimations. They are based on experience and observation, and while not always precise, they can provide valuable insights in the absence of detailed information. For example, estimating that a user will generate 1 MB of data per day on a social media platform can serve as a starting poin
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Approximation

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-2-approximation]]`
- Summary: Approximation involves simplifying complex calculations by rounding numbers or using easier-to-compute values. This technique can help derive rough estimates quickly and with minimal effort. For instance, assuming 1,000 users instead of 1,024 when estimating storage requirements can simplify calculations and still provide a reasonable approximation.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Breakdown and aggregation

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-3-breakdown-and-aggregation]]`
- Summary: Breaking down a problem into smaller components and estimating each separately can make it easier to derive an overall estimate. This technique involves identifying the key components of a system, estimating their individual requirements, and then aggregating these estimates to determine the total system requirements. For example, estimating the storage needs for user data, multimedia content, and
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Sanity check

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-4-sanity-check]]`
- Summary: A sanity check is a quick evaluation of an estimate to ensure its plausibility and reasonableness. This step helps identify potential errors or oversights in the estimation process and can lead to more accurate and reliable results. For example, comparing the estimated storage requirements for a messaging service with the actual storage used by a similar existing service can help validate the esti
- Key claims: A sanity check is a quick evaluation of an estimate to ensure its plausibility and reasonableness
- Learner-relevant: Core system design concept

### Types of Estimations in System Design Interviews

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h2-types-of-estimations-in-system-design-interviews]]`
- Summary: In system design interviews, there are several types of estimations you may need to make: Load estimation: Predict the expected number of requests per second, data volume, or user traffic for the system. Storage estimation: Estimate the amount of storage required to handle the data generated by the system. Bandwidth estimation: Determine the network bandwidth needed to support the expected traffic
- Key claims: See summary
- Learner-relevant: Core system design concept

### Process

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h2-process]]`
- Summary: Understand the Scope : Clarify the scale of the problem - how many users, how much data, etc. Use Simple Math : Utilize basic arithmetic to estimate the scale of data and resources. Round Numbers for Simplicity : Use round numbers to make calculations easier and faster. Be Logical and Reasonable : Ensure your estimations make sense given the context of the problem.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 1. Load Estimation

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-1-load-estimation]]`
- Summary: Suppose you’re asked to design a social media platform with 100 million daily active users (DAU) and an average of 10 posts per user per day. To estimate the load, you’d calculate the total number of posts generated daily: 100 million DAU * 10 posts/user = 1 billion posts/day Then, you can estimate the request rate per second: 1 billion posts/day / 86,400 seconds/day ≈ 11,574 requests/second
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Storage Estimation

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-2-storage-estimation]]`
- Summary: Consider a photo-sharing app with 500 million users and an average of 2 photos uploaded per user per day. Each photo has an average size of 2 MB. To estimate the storage required for one day’s worth of photos, you’d calculate: 500 million users * 2 photos/user * 2 MB/photo = 2,000,000,000 MB/day
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Bandwidth Estimation

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-3-bandwidth-estimation]]`
- Summary: For a video streaming service with 10 million users streaming 1080p videos at 4 Mbps, you can estimate the required bandwidth: 10 million users * 4 Mbps = 40,000,000 Mbps
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Latency Estimation

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-4-latency-estimation]]`
- Summary: Suppose you’re designing an API that fetches data from multiple sources, and you know that the average latency for each source is 50 ms, 100 ms, and 200 ms, respectively. If the data fetching process is sequential, you can estimate the total latency as follows: 50 ms + 100 ms + 200 ms = 350 ms If the data fetching process is parallel, the total latency would be the maximum latency among the source
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. Resource Estimation

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-5-resource-estimation]]`
- Summary: Imagine you’re designing a web application that receives 10,000 requests per second, with each request requiring 10 ms of CPU time. To estimate the number of CPU cores needed, you can calculate the total CPU time per second: 10,000 requests/second * 10 ms/request = 100,000 ms/second Assuming each CPU core can handle 1,000 ms of processing per second, the number of cores required would be: 100,000 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 1. Designing a messaging service

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-1-designing-a-messaging-service]]`
- Summary: Imagine you are tasked with designing a messaging service similar to WhatsApp. To estimate the system’s requirements, you can start by considering the following aspects: Number of users: Estimate the total number of users for the platform. This can be based on market research, competitor analysis, or historical data. Messages per user per day: Estimate the average number of messages sent by each u
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Designing a video streaming platform

- Locator: `[[sources/system-design/completed/20260825_003 What are BackoftheEnvelope Estimations.html#h3-2-designing-a-video-streaming-platform]]`
- Summary: Suppose you are designing a video streaming platform similar to Netflix. To estimate the system’s requirements, consider the following aspects: Number of users: Estimate the total number of users for the platform based on market research, competitor analysis, or historical data. Concurrent users: Estimate the number of users who will be streaming videos simultaneously during peak hours. Video size
- Key claims: See summary
- Learner-relevant: Core system design concept

