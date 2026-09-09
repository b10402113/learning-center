---
source: 048 Designing a URL Shortening Service like TinyURL
source_lines: 9538
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 048 Designing a URL Shortening Service like TinyURL

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- Why do we need URL shortening?
Try it yourself
- Designing URL Shortener (video)

## Sections (L2)

### 1. Why do we need URL shortening?

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h2-1-why-do-we-need-url-shortening]]`
- Summary: URL shortening is used to create shorter aliases for long URLs. We call these shortened aliases “short links.” Users are redirected to the original URL when they hit these short links. Short links save a lot of space when displayed, printed, messaged, or tweeted. Additionally, users are less likely to mistype shorter URLs. For example, if we shorten the following URL through TinyURL: https://www.d
- Key claims: See summary
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#UJDWuXoZGEQf6mAO0N3p9-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing URL Shortener (video)

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h3-designing-url-shortener-video]]`
- Summary: Here is a video discussing how to design URL Shortner: URL Shortener (1) from dg on Vimeo Playing in picture-in-picture (opens a new window) Like Play 00:00 1:16:18 CC/subtitles Settings Transcript Quality Auto Speed Normal CC/subtitles English (auto-generated) CC Fullscreen ; 1080p 720p 540p 360p 240p en-x-autogen ext Other Options 1080p 720p 540p 360p 240p Audio Please select the correct time in
- Key claims: Here is a video discussing how to design URL Shortner: URL Shortener (1) from dg on Vimeo Playing in picture-in-picture (opens a new window) Like Play
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: 💡 You should always clarify requirements at the beginning of the interview. Be sure to ask questions to find the exact scope of the system that the interviewer has in mind. Our URL shortening system should meet the following requirements: Functional Requirements: Given a URL, our service should generate a shorter and unique alias of it. This is called a short link. This link should be short enough
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h2-3-capacity-estimation-and-constraints]]`
- Summary: Our system will be read-heavy. There will be lots of redirection requests compared to new URL shortenings. Let’s assume a 100:1 ratio between read and write. Traffic estimates: Assuming, we will have 500 million new URL shortenings per month, with 100:1 read/write ratio, we can expect 50 billion redirections during the same period: 100 * 500M => 50B What would be Queries Per Second (QPS) for our s
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. System Interface Definition

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h2-4-system-interface-definition]]`
- Summary: 💡 Once we've finalized the requirements, it's always a good idea to define the system APIs. This should explicitly state what is expected from the system. We can have SOAP or REST APIs to expose the functionality of our service. Following could be the definitions of the APIs for creating and deleting URLs: Here are the different APIs that could be part of a URL shortening service, along with their
- Key claims: See summary
- Learner-relevant: Core system design concept

### 1. Create Short URL API

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h3-1-create-short-url-api]]`
- Summary: Generates a shortened URL from a long URL, with optional custom alias and expiration date. Endpoint: POST /shorten Parameters: original_url (string, required): The original long URL that needs to be shortened. custom_alias (string, optional): A custom alias for the shortened URL if the user wants to specify one. expiration_date (timestamp, optional): The date and time when the shortened URL should
- Key claims: See summary
- Learner-relevant: Core system design concept

### 2. Redirect API

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h3-2-redirect-api]]`
- Summary: Redirects users from a shortened URL to the original long URL. Endpoint: GET /{shortened_url} Parameters: shortened_url (string, required): The shortened URL that needs to be resolved to the original URL. Response: Redirects to the original_url .
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Analytics API

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h3-3-analytics-api]]`
- Summary: Provides detailed analytics for a shortened URL, including click count and user demographics. Endpoint: GET /analytics/{shortened_url} Parameters: shortened_url (string, required): The shortened URL for which analytics data is requested. start_date (timestamp, optional): The start date for filtering analytics data. end_date (timestamp, optional): The end date for filtering analytics data. Response
- Key claims: Provides detailed analytics for a shortened URL, including click count and user demographics
- Learner-relevant: Core system design concept

### 4. URL Management API

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h3-4-url-management-api]]`
- Summary: Retrieves a list of all URLs shortened by a specific user, with metadata. Endpoint: GET /user/urls Parameters: user_id (string, required): The ID of the user whose URLs are being requested. page (integer, optional): The page number for paginated results. page_size (integer, optional): The number of results per page. Response: urls (list): A list of URLs shortened by the user, including metadata li
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. Delete Short URL API

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h3-5-delete-short-url-api]]`
- Summary: Deletes a specified shortened URL from the service. Endpoint: DELETE /{shortened_url} Parameters: shortened_url (string, required): The shortened URL that needs to be deleted. user_id (string, required): The ID of the user requesting the deletion. Response: status (string): Confirmation of deletion or error message if the operation fails. These APIs cover the essential operations for a URL shorten
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. Database Design

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h2-5-database-design]]`
- Summary: 💡 Defining the DB schema in the early stages of the interview would help to understand the data flow among various components and later would guide towards data partitioning. A few observations about the nature of the data we will store: We need to store billions of records. Each object we store is small (less than 1K). There are no relationships between records—other than storing which user creat
- Key claims: Since we anticipate storing billions of rows, and we don’t need to use relationships between objects – a NoSQL store like DynamoDB , Cassandra or Riak
- Learner-relevant: Core system design concept

### 6. Basic System Design and Algorithm

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h2-6-basic-system-design-and-algorithm]]`
- Summary: The problem we are solving here is how to generate a short and unique key for a given URL. In the TinyURL example in Section 1, the shortened URL is “ https://tinyurl.com/vzet59pa” . The last eight characters of this URL constitute the short key we want to generate. We’ll explore two solutions here:
- Key claims: See summary
- Learner-relevant: Core system design concept

### a. Encoding actual URL

- Locator: `[[sources/system-design/completed/20260825_048 Designing a URL Shortening Service like TinyURL.html#h3-a-encoding-actual-url]]`
- Summary: We can compute a unique hash (e.g., MD5 or SHA256 , etc.) of the given URL. The hash can then be encoded for display. This encoding could be base36 ([a-z ,0-9]) or base62 ([A-Z, a-z, 0-9]) and if we add ‘+’ and ‘/’ we can use Base64 encoding. A reasonable question would be, what should be the length of the short key? 6, 8, or 10 characters? Using base64 encoding, a 6 letters long key would result 
- Key claims: See summary
- Learner-relevant: Core system design concept

