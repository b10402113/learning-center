---
source: 061 Designing Uber backend
source_hash: 8622d9ac0aeb14cd255479218025a4b04a68cc39beba518dfd5ae5ebc621796d
source_lines: 389
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 061 Designing Uber backend

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- Uber enables its customers to book drivers for taxi rides. Uber drivers use their personal cars to drive customers around. Both customers and drivers communicate with each other through their smartpho
- Before looking at the solution, try designing it:

## Sections (L2)

### 1. What is Uber?

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#h2-1-what-is-uber]]`
- Summary: Uber enables its customers to book drivers for taxi rides. Uber drivers use their personal cars to drive customers around. Both customers and drivers communicate with each other through their smartphones using the Uber app.
- Key claims: See summary
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#X38JhIJAzN1GIqhq69lbS-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing Uber (video)

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#h3-designing-uber-video]]`
- Summary: Here is a video discussing how to design Uber: Designing Uber
- Key claims: Here is a video discussing how to design Uber: Designing Uber
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: Let’s start with building a simpler version of Uber. There are two types of users in our system: 1) Drivers 2) Customers. Drivers need to regularly notify the service about their current location and their availability to pick passengers. Passengers get to see all the nearby available drivers. Customer can request a ride; nearby drivers are notified that a customer is ready to be picked up. Once a
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#h2-3-capacity-estimation-and-constraints]]`
- Summary: Let's assume we have 300M customers and 1M drivers with 1M daily active customers and 500K daily active drivers. Let's assume 1M daily rides. Let’s assume that all active drivers notify their current location every three seconds. Once a customer puts in a request for a ride, the system should be able to contact drivers in real-time.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Basic System Design and Algorithm

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#h2-4-basic-system-design-and-algorithm]]`
- Summary: We will take the solution discussed in 'Designing Yelp' and modify it to make it work for the above-mentioned "Uber" use cases. The biggest difference we have is that our QuadTree was not built keeping in mind that there would be frequent updates to it. So, we have two issues with our Dynamic Grid solution: Since all active drivers are reporting their locations every three seconds, we need to upda
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. Fault Tolerance and Replication

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#h2-5-fault-tolerance-and-replication]]`
- Summary: What if a Driver Location server or Notification server dies? We would need replicas of these servers, so that if the primary dies the secondary can take control. Also, we can store this data in some persistent storage like SSDs that can provide fast IOs; this will ensure that if both primary and secondary servers die we can recover the data from the persistent storage.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Ranking

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#h2-6-ranking]]`
- Summary: How about if we want to rank the search results not just by proximity but also by popularity or relevance? How can we return top rated drivers within a given radius? Let's assume we keep track of the overall ratings of each driver in our database and QuadTree. An aggregated number can represent this popularity in our system, e.g., how many stars does a driver get out of ten? While searching for th
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Advanced Issues

- Locator: `[[sources/system-design/completed/20260825_061 Designing Uber backend.html#h2-7-advanced-issues]]`
- Summary: How will we handle clients on slow and disconnecting networks? What if a client gets disconnected when they are a part of a ride? How will we handle billing in such a scenario? How about if clients pull all the information, compared to servers always pushing it? Previous Designing Yelp or Nearby Friends Next Designing Ticketmaster Mark as Completed On this page What is Uber? Try it yourself Design
- Key claims: See summary
- Learner-relevant: Core system design concept

