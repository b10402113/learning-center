---
source: 009 Caching
source_hash: 231945c7ef42bffa6f5e8399c11650c7f2a7377fd83c572495b03d29a36b38a4
source_lines: 121
created: 2025-08-25
updated: 2025-08-25
---

# Digest — 009 Caching

## Overview (L1)

- )}.discussion_discussion__isThirdLayout__1BDcf::-webkit-scrollbar-button:single-button:vertical:decrement:hover{background-image:url(data:image/svg+xml;utf8,)}.discussion_discussion__isThirdLayout__1B
- Load balancing helps you scale horizontally across an ever-increasing number of servers, but caching will enable you to make vastly better use of the resources you already have as well as making other
- The cache is a high-speed storage layer that sits between the application and the original source of the data, such as a database, a file system, or a remote web service. When data is requested by the
- Caching can be used for various types of data, such as web pages, database queries, API responses, images, and videos. The goal of caching is to reduce the number of times data needs to be fetched fro

## Sections (L2)

### What is Caching?

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h2-what-is-caching]]`
- Summary: The cache is a high-speed storage layer that sits between the application and the original source of the data, such as a database, a file system, or a remote web service. When data is requested by the application, it is first checked in the cache. If the data is found in the cache, it is returned to the application. If the data is not found in the cache, it is retrieved from its original source, s
- Key claims: The cache is a high-speed storage layer that sits between the application and the original source of the data, such as a database, a file system, or a
- Learner-relevant: Core system design concept

### Key terminology and concepts

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h2-key-terminology-and-concepts]]`
- Summary: 1. Cache: A temporary storage location for data or computation results, typically designed for fast access and retrieval. 2. Cache hit: When a requested data item or computation result is found in the cache. 3. Cache miss: When a requested data item or computation result is not found in the cache and needs to be fetched from the original data source or recalculated. 4. Cache eviction: The process 
- Key claims: See summary
- Learner-relevant: Core system design concept

### Types of Caching

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h2-types-of-caching]]`
- Summary: Caching can be implemented in various ways, depending on the specific use case and the type of data being cached. Here are some of the most common types of caching:
- Key claims: See summary
- Learner-relevant: Core system design concept

### 1. In-memory caching

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-1-in-memory-caching]]`
- Summary: In-memory caching stores data in the main memory of the computer, which is faster to access than disk storage. In-memory caching is useful for frequently accessed data that can fit into the available memory. This type of caching is commonly used for caching API responses, session data, and web page fragments. To implement in-memory caching, software engineers can use various techniques, including 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Disk caching

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-2-disk-caching]]`
- Summary: Disk caching stores data on the hard disk, which is slower than main memory but faster than retrieving data from a remote source. Disk caching is useful for data that is too large to fit in memory or for data that needs to persist between application restarts. This type of caching is commonly used for caching database queries and file system data. Cache Types
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Database caching

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-3-database-caching]]`
- Summary: Database caching stores frequently accessed data in the database itself, reducing the need to access external storage. This type of caching is useful for data that is stored in a database and frequently accessed by multiple users. Database caching can be implemented using a variety of techniques, including database query caching and result set caching.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Client-side caching

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-4-client-side-caching]]`
- Summary: This type of caching occurs on the client device, such as a web browser or mobile app. Client-side caching stores frequently accessed data, such as images, CSS, or JavaScript files, to reduce the need for repeated requests to the server. Examples of client-side caching include browser caching and local storage.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. Server-side caching

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-5-server-side-caching]]`
- Summary: This type of caching occurs on the server, typically in web applications or other backend systems. Server-side caching can be used to store frequently accessed data, precomputed results, or intermediate processing results to improve the performance of the server. Examples of server-side caching include full-page caching, fragment caching, and object caching.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. CDN caching

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-6-cdn-caching]]`
- Summary: CDN caching stores data on a distributed network of servers, reducing the latency of accessing data from remote locations. This type of caching is useful for data that is accessed from multiple locations around the world, such as images, videos, and other static assets. CDN caching is commonly used for content delivery networks and large-scale web applications.
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. DNS caching

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-7-dns-caching]]`
- Summary: DNS cache is a type of cache used in the Domain Name System (DNS) to store the results of DNS queries for a period of time. When a user requests to access a website, their computer sends a DNS query to a DNS server to resolve the website’s domain name to an IP address. The DNS server responds with the IP address, and the user’s computer can then access the website using the IP address. DNS caching
- Key claims: DNS cache is a type of cache used in the Domain Name System (DNS) to store the results of DNS queries for a period of time
- Learner-relevant: Core system design concept

### Cache Invalidation

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h2-cache-invalidation]]`
- Summary: While caching can significantly improve performance, we must ensure that the data in the cache is still correct—otherwise, we serve out-of-date (stale) information. This is where cache invalidation comes in. Ensure Data Freshness When the underlying data changes—say a product’s price updates in your database—you must mark or remove the old (cached) data so users don’t see stale information. This p
- Key claims: See summary
- Learner-relevant: Core system design concept

### Cache Invalidation Methods

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-cache-invalidation-methods]]`
- Summary: Here are the famous cache invalidation methods: Purge : The purge method removes cached content for a specific object, URL, or a set of URLs. It's typically used when there is an update or change to the content and the cached version is no longer valid. When a purge request is received, the cached content is immediately removed, and the next request for the content will be served directly from the
- Key claims: See summary
- Learner-relevant: Core system design concept

### Cache read strategies

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h2-cache-read-strategies]]`
- Summary: Here are the two famous cache read strategies:
- Key claims: See summary
- Learner-relevant: Core system design concept

### Read through cache

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-read-through-cache]]`
- Summary: A read-through cache strategy is a caching mechanism where the cache itself is responsible for retrieving the data from the underlying data store when a cache miss occurs. In this strategy, the application requests data from the cache instead of the data store directly. If the requested data is not found in the cache (cache miss), the cache retrieves the data from the data store, updates the cache
- Key claims: A read-through cache strategy is a caching mechanism where the cache itself is responsible for retrieving the data from the underlying data store when
- Learner-relevant: Core system design concept

### Read aside cache

- Locator: `[[sources/system-design/completed/20260825_009 Caching.html#h3-read-aside-cache]]`
- Summary: A read-aside cache strategy, also known as cache-aside or lazy-loading , is a caching mechanism where the application is responsible for retrieving the data from the underlying data store when a cache miss occurs. In this strategy, the application first checks the cache for the requested data. If the data is found in the cache (cache hit), the application uses the cached data. However, if the data
- Key claims: A read-aside cache strategy, also known as cache-aside or lazy-loading , is a caching mechanism where the application is responsible for retrieving th; The read-aside cache strategy provides better control over the caching process, as the application can decide when and how to update the cache
- Learner-relevant: Core system design concept

