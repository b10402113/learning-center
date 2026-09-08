---
source: js-reverse/20260908/day01
source_hash:
  - c55ea3f1d609a691e34728bf178300ae90dfbaa75c2e304840fcbac7bc8b3a9e
  - 6ee758bfe933b55a6b21e79db0caf5b098df3c53705beab9e0d37d39218df6a8
  - 80719312743e691c37983bc1c6aa95380b265ebea650f9ec33c2568a4aa70eb3
  - 906fc9c5936c362b5311533419d725c5ad4ca279f7d0ff8d223279be054d2dfd
  - e8f9447b4a0236a93a7fcaeb29614721e529f7608cffc79da1e808ea9087c966
  - 0f7b611387cb04f9fbed077a1405b4dfc97bf67019b1363c5cea53c68873a267
  - 13aee820d4964c1cb6fd7a6688e7ca26f2e1bac3b62e7f3f6a94e743fcc0b857
  - 9fddf2c554ef33ebe53b0bf669adc04a2df743d8d2b575b4d7d4805e2e3da92a
  - f16788e48b04482d37d5f9a978c853c5e152d30cd280bc0bcedd35793a372f2b
  - 5527373031223249fd597207c50867f1d6587ba3fd1f1ef16dbc21af8bd69732
  - e78e629eb4b24e6e7e14b5a29ca773805aaa45e9aa2590c71bc6fa5366e6c602
  - 1de639eac2edc1f438a1958b13fa77b704254be0d0debca892030ac45eb5d476
  - 4f4ada73679281031f39d091d66f7bc8c4cc61c8d6d68e49bdd252c40ea31a59
  - a4c10604f6f119cb409603d5cfc2df07a1b749d0a7d8f0dc48e90ecbfebc97f4
  - 9220ab21441be1b955ca23baa4f167ce9ddc9fa44fcfde860a6cb81dd9552596
  - 814035eddeaf759a9a1aa1b6cc4814adcd39c2eaf6cebd38d208f6501d924568
  - c8b02f186baa0936f4ccffacb4863939624f43ce5084b0d2e977f4ed6293d37b
  - 5644a38bcf43e7addfea7931343e6a00c07e49c01de5203ee8b7cb12129041d6
  - 28315dc14ec5ca57ac9279a1e265e85b2b6dc31e8afc6425fc339659968fcd2a
  - 21e427a1d2fd0a667f9ed09dc42010be0a7f14cec42690bdce3ae8b503e88fde
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
