---
source: 058 Designing a Web Crawler
source_hash: 870bd95f24ba3137bfaaba4733a4efdf146b31df8a8eab9b8b3591fbca3052a7
source_lines: 423
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 058 Designing a Web Crawler

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- What is a Web Crawler?
Try it yourself
- Difficulties in implementing an efficient web crawler

## Sections (L2)

### 1. What is a Web Crawler?

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-1-what-is-a-web-crawler]]`
- Summary: A web crawler is a software program that browses the World Wide Web in a methodical and automated manner. It collects documents by recursively fetching links from a set of starting pages. Many sites, particularly search engines, use web crawling as a means of providing up-to-date data. Search engines download all the pages to create an index on them to perform faster searches. Some other uses of w
- Key claims: A web crawler is a software program that browses the World Wide Web in a methodical and automated manner
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#4E5ZAI5qoiYwy9k0EfVJ8-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing Web Crawler (video)

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h3-designing-web-crawler-video]]`
- Summary: Here is a video discussing how to design a Web Crawler: Designing Web Crawler
- Key claims: Here is a video discussing how to design a Web Crawler: Designing Web Crawler
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: Let's assume we need to crawl all the web. Scalability: Our service needs to be scalable such that it can crawl the entire Web and can be used to fetch hundreds of millions of Web documents. Extensibility: Our service should be designed in a modular way with the expectation that new functionality will be added to it. There could be newer document types that need to be downloaded and processed in t
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Some Design Considerations

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-3-some-design-considerations]]`
- Summary: Crawling the web is a complex task, and there are many ways to go about it. We should be asking a few questions before going any further: Is it a crawler for HTML pages only? Or should we fetch and store other types of media, such as sound files, images, videos, etc.? This is important because the answer can change the design. If we are writing a general-purpose crawler to download different media
- Key claims: Crawling the web is a complex task, and there are many ways to go about it
- Learner-relevant: Core system design concept

### 4. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-4-capacity-estimation-and-constraints]]`
- Summary: If we want to crawl 15 billion pages within four weeks, how many pages do we need to fetch per second? 15B / (4 weeks * 7 days * 86400 sec) ~= 6200 pages/sec What about storage? Page sizes vary a lot, but, as mentioned above since, we will be dealing with HTML text only, let's assume an average page size of 100KB. With each page, if we are storing 500 bytes of metadata, total storage we would need
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. High Level Design

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-5-high-level-design]]`
- Summary: The basic algorithm executed by any Web crawler is to take a list of seed URLs as its input and repeatedly execute the following steps. Pick a URL from the unvisited URL list. Determine the IP Address of its host-name. Establish a connection to the host to download the corresponding document. Parse the document contents to look for new URLs. Add the new URLs to the list of unvisited URLs. Process 
- Key claims: See summary
- Learner-relevant: Core system design concept

### How to crawl?

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-how-to-crawl]]`
- Summary: Breadth-first or depth-first? Breadth First Search (BFS) is usually used. However, Depth First Search (DFS) is also utilized in some situations, such as, if your crawler has already established a connection with the website, it might just DFS all the URLs within this website to save some handshaking overhead. Path-ascending crawling: Path-ascending crawling can help discover a lot of isolated reso
- Key claims: See summary
- Learner-relevant: Core system design concept

### Difficulties in implementing an efficient web crawler

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-difficulties-in-implementing-an-efficient-web-crawler]]`
- Summary: There are two important characteristics of the Web that makes Web crawling a very difficult task: 1. Large volume of Web pages: A large volume of web pages implies that web crawler can only download a fraction of the web pages at any time and hence it is critical that web crawler should be intelligent enough to prioritize download. 2. Rate of change on web pages. Another problem with today's dynam
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Detailed Component Design

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-6-detailed-component-design]]`
- Summary: Let's assume our crawler is running on one server and all the crawling is done by multiple working threads where each working thread performs all the steps needed to download and process a document in a loop. The first step of this loop is to remove an absolute URL from the shared URL frontier for downloading. An absolute URL begins with a scheme (e.g., “HTTP”) which identifies the network protoco
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. Fault Tolerance

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-7-fault-tolerance]]`
- Summary: We should use consistent hashing for distribution among crawling servers. Consistent hashing will not only help in replacing a dead host but also help in distributing load among crawling servers. All our crawling servers will be performing regular checkpointing and storing their FIFO queues to disks. If a server goes down, we can replace it. Meanwhile, consistent hashing should shift the load to o
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Data Partitioning

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-8-data-partitioning]]`
- Summary: Our crawler will be dealing with three kinds of data: 1) URLs to visit 2) URL checksums for dedupe 3) Document checksums for dedupe. Since we are distributing URLs based on the hostnames, we can store these data on the same host. So, each host will store its set of URLs that need to be visited, checksums of all the previously visited URLs, and checksums of all the downloaded documents. Since we wi
- Key claims: See summary
- Learner-relevant: Core system design concept

### 9. Crawler Traps

- Locator: `[[sources/system-design/completed/20260825_058 Designing a Web Crawler.html#h2-9-crawler-traps]]`
- Summary: There are many crawler traps, spam sites, and cloaked content. A crawler trap is a URL or set of URLs that cause a crawler to crawl indefinitely. Some crawler traps are unintentional. For example, a symbolic link within a file system can create a cycle. Other crawler traps are introduced intentionally. For example, people have written traps that dynamically generate an infinite Web of documents. T
- Key claims: A crawler trap is a URL or set of URLs that cause a crawler to crawl indefinitely; Previous Designing Twitter Search Next Designing Facebook’s Newsfeed Mark as Completed On this page What is a Web Crawler
- Learner-relevant: Core system design concept

