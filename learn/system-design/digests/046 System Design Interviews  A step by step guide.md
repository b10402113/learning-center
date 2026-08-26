---
source: 046 System Design Interviews  A step by step guide
source_hash: e645e2cd0027bebfa66ff1775242857019528630e8e7d943ebdcdd2c318dd557
source_lines: 74
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 046 System Design Interviews  A step by step guide

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Generally, software engineers have difficulty with system design interviews (SDIs) for three primary reasons:
- SDIs are similar to coding interviews in that candidates who don't prepare well tend to do poorly, particularly at high-profile companies like Google, Facebook, Amazon, and Microsoft. In these compani
- In this course, we'll follow a step-by-step approach to solve multiple design problems. First, let's go through these steps:

## Sections (L2)

### Step 1: Requirements clarifications

- Locator: `[[sources/system-design/completed/20260825_046 System Design Interviews  A step by step guide.html#h2-step-1-requirements-clarifications]]`
- Summary: It is always a good idea to ask questions about the exact scope of the problem we are trying to solve. Design questions are mostly open-ended, and they don't have ONE correct answer. That's why clarifying ambiguities early in the interview becomes critical. Candidates who spend enough time to define the end goals of the system always have a better chance to be successful in the interview. Also, si
- Key claims: See summary
- Learner-relevant: Core system design concept

### Step 2: Back-of-the-envelope estimation

- Locator: `[[sources/system-design/completed/20260825_046 System Design Interviews  A step by step guide.html#h2-step-2-back-of-the-envelope-estimation]]`
- Summary: It is always a good idea to estimate the scale of the system we're going to design. This will also help later when we focus on scaling, partitioning, load balancing, and caching. What scale is expected from the system (e.g., number of new tweets, number of tweet views, number of timeline generations per sec., etc.)? How much storage will we need? We will have different storage requirements if user
- Key claims: See summary
- Learner-relevant: Core system design concept

### Step 3: System interface definition

- Locator: `[[sources/system-design/completed/20260825_046 System Design Interviews  A step by step guide.html#h2-step-3-system-interface-definition]]`
- Summary: Define what APIs are expected from the system. This will establish the exact contract expected from the system and ensure if we haven't gotten any requirements wrong. Some examples of APIs for our Twitter-like service will be: postTweet ( user_id , tweet_data , tweet_location , user_location , timestamp , … ) generateTimeline ( user_id , current_time , user_location , … ) markTweetFavorite ( user_
- Key claims: See summary
- Learner-relevant: Core system design concept

### Step 4: Defining data model

- Locator: `[[sources/system-design/completed/20260825_046 System Design Interviews  A step by step guide.html#h2-step-4-defining-data-model]]`
- Summary: Defining the data model in the early part of the interview will clarify how data will flow between different system components. Later, it will guide for data partitioning and management. The candidate should identify various system entities, how they will interact with each other, and different aspects of data management like storage, transportation, encryption, etc. Here are some entities for our
- Key claims: See summary
- Learner-relevant: Core system design concept

### Step 5: High-level design

- Locator: `[[sources/system-design/completed/20260825_046 System Design Interviews  A step by step guide.html#h2-step-5-high-level-design]]`
- Summary: Draw a block diagram with 5-6 boxes representing the core components of our system. We should identify enough components that are needed to solve the actual problem from end to end. For Twitter, at a high level, we will need multiple application servers to serve all the read/write requests with load balancers in front of them for traffic distributions. If we're assuming that we will have a lot mor
- Key claims: See summary
- Learner-relevant: Core system design concept

### Step 6: Detailed design

- Locator: `[[sources/system-design/completed/20260825_046 System Design Interviews  A step by step guide.html#h2-step-6-detailed-design]]`
- Summary: Dig deeper into two or three major components; the interviewer's feedback should always guide us to what parts of the system need further discussion. We should present different approaches, their pros and cons, and explain why we will prefer one approach over the other. Remember, there is no single answer; the only important thing is to consider tradeoffs between different options while keeping sy
- Key claims: See summary
- Learner-relevant: Core system design concept

### Step 7: Identifying and resolving bottlenecks

- Locator: `[[sources/system-design/completed/20260825_046 System Design Interviews  A step by step guide.html#h2-step-7-identifying-and-resolving-bottlenecks]]`
- Summary: Try to discuss as many bottlenecks as possible and different approaches to mitigate them. Is there any single point of failure in our system? What are we doing to mitigate it? Do we have enough replicas of the data so that we can still serve our users if we lose a few servers? Similarly, do we have enough copies of different services running such that a few failures will not cause a total system s
- Key claims: See summary
- Learner-relevant: Core system design concept

### Summary

- Locator: `[[sources/system-design/completed/20260825_046 System Design Interviews  A step by step guide.html#h2-summary]]`
- Summary: In short, preparation and being organized during the interview are the keys to success in system design interviews. The steps mentioned above should guide you to remain on track and cover all the different aspects while designing a system. Download Mastering System Design Interview in 7 Steps (pdf) . Let's apply the above guidelines to design a few systems that are asked in SDIs. Happy learning! D
- Key claims: Design Guru's team Previous Read Heavy vs Write Heavy System Next System Design Master Template Mark as Completed On this page Step 1: Requirements cl
- Learner-relevant: Core system design concept

