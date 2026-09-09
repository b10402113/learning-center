---
source: js-reverse/20260908/day01
source_lines: 773
status: absorbed
absorbed_at: 2026-09-08
created: 2026-09-08
updated: 2026-09-08
---

# Digest — js-reverse/20260908/day01

## Overview (L1)

- **Python prerequisite overview** — Lists required Python basics: syntax, variables, constants, data types, flow control (while/for/if), functions (definition, calling, parameters, return values), built-in functions, packages/modules, OOP (not primary focus).
- **Software architecture (C/S vs B/S)** — Distinguishes desktop apps (C/S: Client-Server) from web apps (B/S: Browser-Server); B/S is a variant of C/S where the browser is the client. Links both to web scraping: scraping targets server-side data.
- **HTTP protocol fundamentals** — Defines HTTP as the transport protocol for hypertext between server and client. Explains request protocol (request line, headers, body, GET vs POST) and response protocol (status line, headers, body, status codes). Covers HTTP characteristics: request-response model and statelessness.
- **Cookie mechanism** — Explains why cookies exist (HTTP statelessness), what cookies are (key-value pairs set by server, stored in browser), and the cookie lifecycle (server creates → browser stores → browser sends on next request). Uses hospital visit analogy.
- **HTML basics** — Covers HTML structure, tag syntax, basic tags (headings, paragraphs, line breaks, text formatting, special characters, div/span), hyperlinks (a tag with href/title/target), images (img tag), lists (ul/ol/li), tables (table/tr/td with colspan/rowspan), forms (form tag with input types, select, textarea), and multimedia tags (video/audio).
- **test.html** — A hands-on HTML file demonstrating form elements: text input, password, checkboxes, radio buttons, date picker, dropdown select, and textarea, with submit/reset buttons.

## Sections (L2)

### 软件开发架构与爬虫关联

- Locator: [[sources/js-reverse/20260908/day01/http协议相关.md#软件开发的架构]]
- Summary: Introduces C/S and B/S architectures as the two main application communication models. Establishes that web scraping targets server-side data in B/S architecture.
- Key claims: C/S = Client-Server (desktop apps like QQ, WeChat); B/S = Browser-Server (web apps); B/S is essentially a C/S variant; web scraping = fetching data from B/S servers.
- Learner-relevant: Foundation for understanding what a web scraper communicates with and why HTTP matters for scraping.

### HTTP协议简介

- Locator: [[sources/js-reverse/20260908/day01/http协议相关.md#111http协议简介]]
- Summary: Defines HTTP as Hyper Text Transfer Protocol — the standard for transmitting hypertext between server and client. Uses a cultural analogy (bandit code from a Chinese film) to explain what a protocol is.
- Key claims: HTTP = Hypertext Transfer Protocol; "hypertext" includes text, images, video, animation; a protocol is a predefined communication convention.
- Learner-relevant: Core vocabulary for every subsequent networking and scraping concept.

### 请求协议与响应协议

- Locator: [[sources/js-reverse/20260908/day01/http协议相关.md#112http请求协议与响应协议]]
- Summary: Breaks down HTTP message structure into request (request line, headers, blank line, body) and response (status line, headers, blank line, body). Details GET vs POST differences.
- Key claims: Request line = method + URL + protocol/version; GET data goes in URL (limited length), POST data goes in body (unlimited); common request headers include User-Agent, Referer, Accept, Cookie; response headers include Content-Type, Set-Cookie.
- Learner-relevant: Directly relevant to constructing HTTP requests in Python (requests library) and understanding what a browser sends when accessing a page.

### HTTP协议特性

- Locator: [[sources/js-reverse/20260908/day01/http协议相关.md#113-http协议特性]]
- Summary: Explains two core HTTP properties: request-response model (client initiates, server responds) and statelessness (each request is independent, no memory of previous requests).
- Key claims: HTTP is stateless by default; statelessness causes problems for login sessions; Cookie was introduced to solve statelessness.
- Learner-relevant: Statelessness is why cookies and sessions exist — essential for scraping authenticated sites.

### Cookie概述

- Locator: [[sources/js-reverse/20260908/day01/http协议相关.md#12cookie概述]]
- Summary: Explains cookie origin (HTTP statelessness problem), what a cookie is (server-set key-value pairs stored in browser), and the cookie lifecycle with a hospital visit analogy.
- Key claims: Cookies are created by the server and stored in the browser; different browsers don't share cookies; cookies are sent automatically on subsequent requests; the server uses cookies to identify users.
- Learner-relevant: Understanding cookies is critical for scraping sites that require login or session persistence.

### HTML基础

- Locator: [[sources/js-reverse/20260908/day01/http协议相关.md#21-html概述]]
- Summary: Introduces HTML as the markup language for web pages. Covers document structure (DOCTYPE, html, head, body), tag syntax (open/close, self-closing, attributes), and basic tags (headings, paragraphs, formatting, div/span).
- Key claims: HTML is a markup language, not a programming language; browsers download HTML then render it; tags are either block-level or inline; UTF-8 is the standard encoding.
- Learner-relevant: HTML parsing (BeautifulSoup, lxml) is a core scraping skill — knowing the structure helps locate data.

### 超链接与图片标签

- Locator: [[sources/js-reverse/20260908/day01/http协议相关.md#25超链接标签]]
- Summary: Covers the a tag (href for URL, title for tooltip, target for window behavior) and img tag (src for image source, alt for fallback text, width/height for sizing). Explains how links connect web pages and how to follow them programmatically.
- Key claims: href can be a network URL or local file path; empty href refreshes current page; target=_blank opens in new tab; img src can be network or local.
- Learner-relevant: Link following is the foundation of web crawlers; img src extraction is common in image scraping tasks.

### 表格与表单

- Locator: [[sources/js-reverse/20260908/day01/http协议相关.md#28表格标签]]
- Summary: Covers HTML tables (table/tr/td with colspan/rowspan for cell merging) and forms (form tag with action/method, input types including text/password/checkbox/radio/date/file, select dropdown, textarea, submit/reset).
- Key claims: Form action = server URL; method GET puts data in URL, POST in body; enctype multipart/form-data required for file uploads; checkbox values define what gets submitted; radio buttons share name for mutual exclusion.
- Learner-relevant: Form data submission is how login forms and search queries work — essential for reverse-engineering POST requests in scraping.

### 多媒体标签

- Locator: [[sources/js-reverse/20260908/day01/http协议相关.md#210多媒体标签]]
- Summary: Covers video and audio tags with attributes: src, autoplay, controls, loop, width/height. Notes browser compatibility differences for media formats.
- Key claims: video/audio support autoplay, loop, and controls attributes; different browsers support different media formats; media URLs in src attributes can be extracted for downloading.
- Learner-relevant: Extracting video/audio URLs from HTML is a common scraping task (e.g., downloading embedded media).

### test.html 实践

- Locator: [[sources/js-reverse/20260908/day01/test.html]]
- Summary: A working HTML file demonstrating a complete form with text input, password, checkboxes, radio buttons, date picker, select dropdown, textarea, and submit/reset buttons. Commented-out sections show earlier practice with headings, paragraphs, div/span, links, images, and lists.
- Key claims: This file is a hands-on companion to the HTML lecture; form elements match the exact structure covered in the theory section.
- Learner-relevant: Can be used to practice form data extraction and understand how form fields map to POST parameters.
