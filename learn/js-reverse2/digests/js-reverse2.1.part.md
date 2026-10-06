---
source: js-reverse2
source_type: codebase
source_lines: 15593
language: python
part: 1
status: absorbed
absorbed_at: 2026-10-05
created: 2026-10-05
updated: 2026-10-05
---

# Digest — js-reverse2 (part 1)

## Overview (L1)

- `day01/http协议相关.md` (+ `test.html`) — HTTP request/response message structure, request/response headers, status codes, statelessness and Cookie, then HTML document structure, basic/common tags, `a`/`img`/list/table/form/media elements. The shared foundation for everything else.
- `day02/4.函数操作.md` — Python functions: `def`/call, `return` (single, multiple, None), nested functions returning functions, parameters (positional vs default) and the odd/even counting exercise.
- `day02/5.文件操作.md` — File I/O: `open()`/file handle, read modes `r/w/a/+` and `b`, `read/readline/readlines/write/close`, `with`, encoding/`errors`, binary image copy, and a register/login persistence exercise.
- `day02/6.包与模块.md` (near-duplicate at `day03/6.包与模块.md`) — modules vs packages, import forms, `__name__ == "__main__"`, then common stdlib modules: `time`, `random`, `os`, `json` (dumps/loads/dump/load), and `re` regex (findall).
- `day03/前端.md` — A second pass over the same Web basics: C/S vs B/S, HTTP protocol and its headers, Cookie origin/definition/rules, and the full HTML tag tour (largely overlapping `day01`).
- `day04/requests基础.md` — Crawler intro and legality/robots, then `requests` basics: 4-step coding flow, GET, encoding fixes (`response.encoding`), `params`, UA spoofing, POST with `data`, dynamically-loaded data via global packet search, and image download via `content`/`urlretrieve`.
- `day05/数据解析.md` (+ `test.html`) — Data parsing concepts and XPath as the primary tool (`lxml.etree`, `etree.HTML/parse`, `/` vs `//`, attribute/index/hierarchy location, `text()`/`@attr` extraction), plus anti-hotlink (`Referer`) and image lazy-loading (`data-original`), with novel/resume/image download cases.
- `day06/requests高级.md` — Video source parsing (`<source src>`), Cookie handling (manual vs `requests.Session` auto), simulated login (17k), proxies (types, anonymity, proxy pool), and CAPTCHA OCR via the tutu/图鉴 platform.
- `day07/并发编程.md` — The conceptual core of concurrency: process/thread model, scheduling, concurrency vs parallelism, sync vs async, process states, then `multiprocessing.Process` (start/join/daemon), `threading.Thread` and `multiprocessing.dummy.Pool`, and the rationale for coroutines.
- `day08/异步爬虫.md` — Coroutines with `asyncio`: special `async` functions, coroutine object, task (`ensure_future`), event loop, `add_done_callback`, `await`/`asyncio.sleep`, `asyncio.wait`, and `aiohttp` for a real multi-task async crawler against a local Flask server.
- `day09/selenium.md` — Selenium browser automation: driver setup, element location (old `find_element_by_*` and new `By`), node interaction, `execute_script`, `page_source`, dynamic data ("可见即可得"), ActionChains, waits (explicit/implicit/forced), slider CAPTCHA with OpenCV, bilibili CAPTCHA login, and `window.navigator.webdriver` evasion via `stealth.min.js`.
- `day09/m3u8.md` — HLS/M3U8 streaming: M3U vs M3U8 structure, `#EXTINF`/TS segment list parsing, then sync, coroutine, and thread-pool downloads of TS fragments.
- `day10/Pyppeteer.md` — Pyppeteer as async Selenium: `launch`, `newPage`, `goto`, `content`, viewport, node interaction via `type/click/querySelectorAll`, news-title crawling, `window.navigator.webdriver` evasion, and slider CAPTCHA.
- `day10/scrapy介绍+环境安装.md` — Scrapy overview and environment: `startproject`, `genspider`, directory layout, `settings.py` (ROBOTSTXT_OBEY/LOG_LEVEL/USER_AGENT), `crawl`, `parse`, and XPath `extract()/extract_first()`.
- `day11/1.scrapy基础01.md` + `2.scrapy操作02.md` (+ `biliDB`, `biliPro` demos) — Scrapy in depth: project/spider creation, parsing, terminal-based persistence (`-o csv`), pipeline-based persistence (`items.py`, `process_item`, `open_spider`/`close_spider`, `ITEM_PIPELINES`), multiple pipelines to file/MySQL/Redis with priority and `return item`, and `ImagesPipeline` media download.
- `day12/1.内置管道.md` + `2.scrapy深度爬取.md` (+ `imgPro`, `filePro`, `deepPro`, `postPro` demos) — Built-in `ImagesPipeline`/`FilesPipeline` (with thumbnails, `IMAGES_STORE`/`FILES_STORE`, `file_urls`/`files`), deep crawling via `scrapy.Request` manual requests and `meta` request-参数 passing, pagination, efficiency tuning, `start_requests`/`FormRequest` POST, and the five core components.
- `day13/scrapy操作.md` (+ `middlePro`, `wangyiPro` demos) — Scrapy core components and middleware: downloader middleware `process_request/process_response/process_exception`, changing request headers/proxy/cookies, `spider`-parameter data exchange for proxy pools, and combining middleware with Selenium to rewrite 163 news responses into `HtmlResponse`.
- `day14/scrapy进阶操作.md` — Advanced Scrapy: `CrawlSpider` with `LinkExtractor` + `Rule` (allow regex, `restrict_xpaths`, `follow`, callback), distributed crawling via `scrapy-redis` (shared scheduler/dupefilter/pipeline, `redis_key`, `lpush`), and incremental crawling using a Redis SET dedup record table.
- `JS逆向/day02/课堂笔记/02 初识爬虫[UA检测 乱码 动态数据以及图片数据爬取].md` (+ `课上代码` demos + saved HTML dumps) — Streamlined re-teach of crawler intro and `requests`: install, 4-step flow, 东方财富 encoding, 51 game `params`, 人事考试网 UA, POST search, 智慧职教 dynamic JSON, image via `content`. Duplicates `day04/requests基础.md` in topic with a newer course codebase.
- `JS逆向/day03/资料/课堂笔记/03 xpath数据分析以及实战案例.md` (+ `课上代码/day03` demos) — XPath-focused re-teach: 下厨房/肯德基 assignments, `lxml` XPath expressions, 碧血剑 novel, resume RAR download, and image lazy-loading. Overlaps `day05/数据解析.md`.
- `JS逆向/day04/课堂笔记/04 爬虫进阶之防盗链以及代理IP.md` (+ `大作业记录`, `思路分析`, `课上代码/day04` demos) — Anti-hotlink (`Referer` + `real_src`) and proxy IPs (anonymity, types, proxy pool) re-teach, plus the stage-capstone analysis of scraping 考试宝 (`ks.wangxiao.cn`) daily-practice questions with cookie + dynamic `day/sign/subsign` parameters. Overlaps `day06/requests高级.md`.
- `day09/stealth.min.js` — Vendored minified anti-detection script (137 KB, single-line blob, no readable structure); injected via `Page.addScriptToEvaluateOnNewDocument` to hide `navigator.webdriver`. Role recorded, not read line-by-line.

> Note on duplicates: `JS逆向/day01` is byte-identical to `day01`; `JS逆向/day02–04` re-teach the `day04–06` topics with a newer codebase. These are covered once under their canonical `dayNN` sections; they add no unique concepts.

## Sections (L2)

### day01-http协议与HTML基础

- Locator: `[[sources/js-reverse2/20261005/day01/http协议相关.md#http协议相关]]`
- Summary: Opens with C/S vs B/S architecture and why crawlers must "simulate the browser", then explains the HTTP request/response message format and its headers, GET vs POST, statelessness, and how Cookie restores state; closes with an HTML crash course (document skeleton, tag syntax, links, images, lists, tables, forms, audio/video). Grouped demo `test.html` is the HTML playground.
- Key claims: HTTP = HyperText Transfer Protocol; request line = method + URL + version; request headers include `User-Agent` (载体身份), `Referer` (防盗链), `Accept*`, `Host`, `X-Requested-With: XMLHttpRequest`; response headers include `Location`, `Content-Type`, `Content-Encoding`, `Content-Length`; response status codes report success/error; HTTP is stateless, Cookie is a server-created key-value pair stored in the client browser and auto-sent on later requests; different browsers do not share cookies; Cookie limit ~4KB/20 per server/300 per browser; `<a href>`, `<img src/alt>`, `<table><tr><td>`, `<form action/method/enctype>`, file upload needs `multipart/form-data`.
- Learner-relevant: Can read a raw HTTP request/response, explain why a session persists via Cookie, and recognize the HTML tags a crawler will later parse. Anchors the whole course: "crawling = simulating the browser well enough".

### day02-函数操作

- Locator: `[[sources/js-reverse2/20261005/day02/4.函数操作.md#函数]]`
- Summary: Python function fundamentals — defining and calling functions, `return` semantics (expression, multiple values, implicit `None`), nested functions and returning a function vs calling it, and function parameters (positional vs default) with a counting exercise.
- Key claims: `def name(params): ... return expr`; defining does not execute the body, calling does; no `return` yields `None`; `return a,b,c` bundles into a tuple that can be unpacked; code after `return` is unreachable; `return inner` returns the function object, `return inner()` returns its result; positional params must match count/order; default params must follow positional params; Python does not type-check arguments (weak/dynamic typing).
- Learner-relevant: Can write reusable helper functions with correct parameter/return conventions — the baseline for every later crawler helper.

### day02-文件操作

- Locator: `[[sources/js-reverse2/20261005/day02/5.文件操作.md#文件操作]]`
- Summary: File I/O as the persistence layer for crawled data: the `open()` file-handle model, modes, the read/write method family, `with` context management, text encoding pitfalls, and binary read/write for images, ending with a register/login exercise.
- Key claims: `open(filename, mode)` returns a file object; default mode `r`; modes `r/w/a/+` and binary `b` (bytes, needs own encoding); `w+` truncates, `a+` appends; `read(size)` (avoid reading huge files whole), `readline()`, `readlines()` (list, memory risk), `write()`, `close()`; `with open(...) as fp` guarantees close; non-UTF-8 files need `encoding` and `errors='ignore'`; binary copy uses `rb` + `wb` and `content`-style bytes.
- Learner-relevant: Can persist scraped text or binary assets to disk safely — directly used for saving HTML/JSON/images later.

### day02-包与模块与常见模块

- Locator: `[[sources/js-reverse2/20261005/day02/6.包与模块.md#模块与包]]`
- Summary: Code organization (module = `.py` file, package = folder with `__init__.py`), the three import styles, `__name__`/`__main__` entry-point idiom, then a tour of the stdlib modules a crawler needs: `time`, `random`, `os`, `json`, `re`.
- Key claims: modules are built-in/third-party/self-defined; `import m`, `import m as a`, `from m import x`, `from m import *`; importing runs the module once; `__name__` is `"__main__"` only in the executed file; package import forms `import pkg.mod`, `from pkg import mod`, `from pkg.mod import name`; `time.time()/strftime/sleep`; `os.getcwd/listdir/makedirs/path.join/...`; JSON: `dumps`(dict→str), `loads`(str→dict), `dump`(write file), `load`(read file); regex via `re.findall`, with `. ^ $ [] \d * + ? {m,n}`, greedy vs non-greedy `.*?`.
- Learner-relevant: Can structure a multi-file crawler project, time requests, build paths, save structured data as JSON, and extract text with regex (`day02/6` and `day03/6` differ only cosmetically — one heading level and one regex group).

### day03-前端

- Locator: `[[sources/js-reverse2/20261005/day03/前端.md#前端]]`
- Summary: A condensed second pass over the same前端 material as `day01`: Web architecture, HTTP characteristics and headers, Cookie (origin/definition/rules), and the full HTML tag reference. Best treated as a review of `day01` rather than new content.
- Key claims: B/S is a form of C/S; request/response mode; HTTP is stateless, Cookie keeps state; Cookie is server-defined and browser-stored, size limits 4KB/20/300; identical HTML tag coverage (headings, `p`, `br`, formatting, `div/span`, `a`, `img`, `ul/ol`, `table`, `form`, `video/audio`).
- Learner-relevant: Reinforcement of `day01`; useful as a quick reference if the learner skipped the first explanation.

### day04-requests基础与爬虫初识

- Locator: `[[sources/js-reverse2/20261005/day04/requests基础.md#requests基础]]`
- Summary: The canonical crawler on-ramp: what a crawler is and its legality/robots, crawler categories (general/focused/functional/incremental/distributed), the anti-crawl vs anti-anti-crawl framing, then hands-on `requests` with six escalating cases ending at dynamic JSON and binary images.
- Key claims: crawler = program simulating a browser to fetch data; failing to get data usually means "not simulating the browser enough"; focused crawler = general + parsing; robots is a君子协议, not a technical block; 4-step flow = specify URL → request → get response → persist; `requests.get(url, params=...)`; fix `response.encoding`; `headers={...}` with `User-Agent` defeats UA-checking; `requests.post(url, data=...)` for form POST; dynamic data must be located by global packet search then replayed with its own URL+params (+`Referer`); `response.json()` deserializes; `response.content` is bytes for images; `urlretrieve` writes a URL straight to file.
- Learner-relevant: Can fetch HTML/JSON/images, handle encoding and UA, and extract dynamic XHR data from packet analysis — the core skill the whole JS-reverse course later attacks.

### day05-数据解析

- Locator: `[[sources/js-reverse2/20261005/day05/数据解析.md#数据解析]]`
- Summary: Turns general crawlers into focused crawlers via parsing. XPath is the primary tool; the lesson teaches `lxml.etree` loading, the full XPath expression vocabulary, then applies it to a novel, resume (RAR) download, and lazy-loaded images; ends with anti-hotlink and lazy-load countermeasures. `test.html` is the practice DOM.
- Key claims: parsing general principle = locate the tag, extract text or attribute; focused flow adds a 解析 step; parser options are xpath/bs4/re/pyquery; `etree.parse(file)` vs `etree.HTML(text)`; `//` all, `/` direct child, `//tag[@attr="v"]`, `//tag[n]` (1-indexed), hierarchy chains; `/text()` direct text vs `//text()` all text, `@attr` for attributes; local extraction via `./`; browser Element view ≠ network source (`real_src`); anti-hotlink requires a matching `Referer` header; lazy-load stores the real URL in a pseudo-attribute like `data-original`.
- Learner-relevant: Can write XPath to pull exactly the fields wanted from a page, download binary attachments, and defeat Referer checks and lazy-loading.

### day06-requests高级

- Locator: `[[sources/js-reverse2/20261005/day06/requests高级.md#requests高级]]`
- Summary: Advanced `requests` topics: extracting video playback URLs, Cookie handling (manual vs automatic `Session`), simulated login, proxy usage/anonymity/proxy pools, and CAPTCHA OCR integration.
- Key claims: video URL hides in `<source src>` (prefix `https:`); Cookie is server-created and stored client-side, enabling免密登录; manual Cookie is brittle (expiry, dynamic parts); `requests.Session()` captures cookies on a first request and auto-sends them on later requests (needs ≥2 requests); `proxies={'http'/'https': 'ip:port'}` routes requests; proxy anonymity = transparent/anonymous/high-anonymous; proxy type must match the request scheme; proxy pool enables high-frequency batch crawling; CAPTCHA via `ttshitu`/图鉴 `base64_api(uname,pwd,img,typeid)` and `getImgCodeText`.
- Learner-relevant: Can maintain login sessions, rotate proxies to avoid IP bans, and outsource CAPTCHA solving — the operational toolkit for real targets.

### day07-并发编程

- Locator: `[[sources/js-reverse2/20261005/day07/并发编程.md#并发编程]]`
- Summary: The conceptual foundation of performance: the process/thread mental model, CPU scheduling, concurrency vs parallelism, sync vs async, process states, then concrete Python implementations of processes, threads, thread pools, and the motivation for coroutines.
- Key claims: single-core CPU runs one task at a time; process = 车间, thread = 工人, memory is shared within a process but isolated across processes; parallelism needs multiple CPUs, concurrency is pseudo-parallel via time-slice rotation; process states ready/running/blocked/terminated; `multiprocessing.Process(target=, args=).start()`; `join()` makes the main process wait; process data is isolated (global changes don't propagate); `daemon=True` kills the child with the parent; `threading.Thread`, thread memory is shared; `Pool(5).map(fn, urls)` for thread pools; coroutines keep CPU in our own program by manually yielding at every blocking point in a single process/thread.
- Learner-relevant: Can explain why async speeds up IO-bound crawling and choose process/thread/coroutine appropriately.

### day08-异步爬虫

- Locator: `[[sources/js-reverse2/20261005/day08/异步爬虫.md#异步爬虫]]`
- Summary: Coroutine implementation with `asyncio`, culminating in a real async crawler using `aiohttp`. Builds from the conceptual recap through special functions, coroutine objects, tasks, event loops, callbacks, and `await`, then replaces `requests` with `aiohttp`.
- Key claims: `async def` makes a special function whose body does not run on call but returns a coroutine object; task = `asyncio.ensure_future(coroutine)`, a higher-level coroutine; event loop (`asyncio.get_event_loop()`) is the container that runs tasks; `task.add_done_callback(fn)` runs `fn` on completion, `t.result()` retrieves the return value; `asyncio.wait(tasks)` grants suspendability; each blocking operation needs `await`; async functions must not contain non-async modules (e.g. plain `requests`, `time.sleep`) or the whole async effect breaks; `aiohttp.ClientSession` + `async with await sess.get(...)` and `await response.text()/read()`; proxy param is `proxy=`.
- Learner-relevant: Can write a multi-task asynchronous crawler and know precisely where `await` must go and what breaks async.

### day09-selenium

- Locator: `[[sources/js-reverse2/20261005/day09/selenium.md#selenium]]`
- Summary: Browser automation with Selenium — the answer to "visible = obtainable". Covers driver setup, element location APIs, interaction, JS execution, `page_source`, waits, ActionChains, slider CAPTCHA, CAPTCHA login, and detection evasion.
- Key claims: Selenium drives a real browser via a matching `chromedriver`; `webdriver.Chrome(executable_path=...)`; location via `find_element_by_*` or `By.XPATH/ID/LINK_TEXT/...`, `find_element` (one) vs `find_elements` (list); `send_keys`/`clear`/`click`; `execute_script` for scrolling/JS; `page_source` gives the rendered DOM so dynamic data becomes parseable; `switch_to.frame` for iframes; ActionChains for drag/press-move; waits: forced `sleep`, explicit `WebDriverWait(chrome,10).until(EC...)`, implicit `implicitly_wait(10)`; slider distance via `cv2.matchTemplate` + `minMaxLoc`; login CAPTCHA via third-party OCR + `ActionChains` click coordinates; `window.navigator.webdriver` is `true` under Selenium → evade by injecting `stealth.min.js` through `execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {...})`.
- Learner-relevant: Can automate login, scroll, and extraction of JavaScript-rendered pages, and can hide the automation fingerprint.

### day09-m3u8

- Locator: `[[sources/js-reverse2/20261005/day09/m3u8.md#m3u8]]`
- Summary: HLS streaming download. Explains M3U/M3U8 as playlists of TS segments, shows parsing the M3U8 by skipping `#` lines, and gives sync, `aiohttp` coroutine, and thread-pool versions of downloading all TS pieces.
- Key claims: HLS splits video into TS segments listed by an M3U8 playlist; M3U8 entries include `#EXT-X-VERSION`, `#EXT-X-TARGETDURATION`, `#EXT-X-PLAYLIST-TYPE:VOD`, `#EXTINF` duration, and `#EXT-X-ENDLIST`; non-`#` lines are TS URLs that must be joined to the base; segments can be merged to mp4 (better with a dedicated tool); async version binds a save callback per task; thread pool `Pool(100).map` can also work; add `Connection: closed` to avoid `HTTPSConnectionPool` errors under high concurrency; never nest event loops.
- Learner-relevant: Can download segmented HLS video, and sees the same concurrency patterns applied to a different data type.

### day10-Pyppeteer

- Locator: `[[sources/js-reverse2/20261005/day10/Pyppeteer.md#pyppeteer简介]]`
- Summary: Pyppeteer as an async, self-installing alternative to Selenium. Covers `launch`/`newPage`/`goto`/`content`, viewport setup, autobars disabling, webdriver evasion, node interaction, a news-crawling practice, and slider CAPTCHA.
- Key claims: Pyppeteer drives Chromium (auto-downloads if missing) and is built on `async`; `await launch(headless=..., args=..., executablePath=...)`; `await bro.newPage()`, `await page.goto(url)`, `await page.content()`; disable "自动测试软件控制" bar via `--disable-infobars`; `setViewport({'width','height'})` fixes broken layout; evade detection by `page.evaluate("... Object.defineProperties(navigator,{webdriver:{get:()=>false}})")`; interaction `page.type(selector, text, {delay})`, `page.click`, `page.querySelectorAll`, `page.J/Jeval`; slider uses `cv2.matchTemplate` and `page.mouse.down/move({steps})/up`.
- Learner-relevant: Can render and scrape JS sites asynchronously without managing a separate driver, and bypass the `webdriver` fingerprint.

### day10-scrapy介绍与环境安装

- Locator: `[[sources/js-reverse2/20261005/day10/scrapy介绍+环境安装.md#简介]]`
- Summary: First contact with the Scrapy framework: what a framework is, install, project/spider creation, the generated directory layout, the spider class contract, settings that must change, and basic `parse`/XPath extraction.
- Key claims: framework = a通用 project half-product; `pip install scrapy`; `scrapy startproject 名` creates `items.py/middlewares.py/pipelines.py/settings.py/spiders/` + `scrapy.cfg`; `scrapy genspider name start_url`; spider defines `name`, `allowed_domains`, `start_urls`, and `parse(self, response)`; set `ROBOTSTXT_OBEY=False`, `LOG_LEVEL='ERROR'`, a browser `USER_AGENT`; run with `scrapy crawl name`; `response.xpath(...)` returns Selectors, `extract()`/`extract_first()` pull strings.
- Learner-relevant: Can scaffold and run a minimal Scrapy project and know which settings to touch first.

### day11-scrapy基础与操作

- Locator: `[[sources/js-reverse2/20261005/day11/1.scrapy基础01.md#简介]]`
- Summary: Full Scrapy workflow. Covers project construction, XPath parsing of a real search page, and two persistence routes: terminal `-o csv` versus the recommended pipeline (items → `yield` → `process_item`), extended to multiple concurrent pipelines writing to file, MySQL, and Redis, plus `ImagesPipeline` for media. Demos live in `biliDB` and `biliPro`.
- Key claims: `parse` runs once per request; `parse` may `return` a list of dicts persisted via `scrapy crawl name -o file.csv` (weak/locked to text); pipeline route: define fields in `items.py`, instantiate `Item`, assign, `yield item`; pipeline `process_item(self,item,spider)` returns item to pass on; `open_spider`/`close_spider` run once; enable by uncommenting `ITEM_PIPELINES` with priority numbers (smaller runs first); item passes only to the highest-priority pipeline, which must `return item` to reach the next; MySQL via `pymysql.Connect/cursor/execute/commit`, Redis via `redis.Redis().lpush`; `ImagesPipeline` (subclass, override `get_media_requests`/`file_path`/`item_completed`, set `IMAGES_STORE`).
- Learner-relevant: Can persist scraped data to files, databases, and media stores cleanly using the framework's intended extension points.

### day12-scrapy内置管道

- Locator: `[[sources/js-reverse2/20261005/day12/1.内置管道.md#scrapy内置管道]]`
- Summary: The built-in download pipes. `ImagesPipeline` for images/audio/video and `FilesPipeline` for arbitrary files, including the `file_urls`/`files` item contract, `meta`-carried filenames, and thumbnail configuration. Demos in `imgPro` and `filePro`.
- Key claims: `from scrapy.pipelines.images import ImagesPipeline` and `...files import FilesPipeline`; subclass and override `get_media_requests` (yield `scrapy.Request(url, meta={...})`), `file_path` (return filename), `item_completed`; `IMAGES_STORE` and `FILES_STORE` set save roots; `IMAGES_THUMBS={'small':(50,50),'big':(270,270)}` generates thumbnails; `FilesPipeline` requires item fields `file_urls` and `files`; images may arrive from XHR JSON, not HTML.
- Learner-relevant: Can batch-download images/videos/documents through Scrapy with a few overrides rather than hand-rolling loops.

### day12-scrapy深度爬取

- Locator: `[[sources/js-reverse2/20261005/day12/2.scrapy深度爬取.md#scrapy深度爬取]]`
- Summary: Deep (multi-level) crawling and pagination plus efficiency and POST. Explains combining list pages with detail pages via manual `scrapy.Request` and `meta`, pagination with a URL template, speed settings, overriding `start_requests` to send POST, and the five core Scrapy components. Demo in `deepPro`/`postPro`.
- Key claims: deep crawl = data not on one page; use `yield scrapy.Request(url=detail_url, callback=self.parse_detail, meta={'item':item})` and read it in the callback via `response.meta['item']`; pagination via a `url_model` and a page counter guarded by `if self.page_num <= 5`; efficiency: raise `CONCURRENT_REQUESTS` (default 32) and set `LOG_LEVEL='ERROR'`; `start_urls` requests are actually issued by the inherited `start_requests`; override it and use `scrapy.FormRequest(url, formdata=...)` for POST (`response.json()` parses JSON); five components = Engine, Scheduler (dedup queue), Downloader (twisted async), Spiders, Pipeline.
- Learner-relevant: Can crawl list→detail structures, paginate, POST to JSON APIs, and tune concurrency.

### day13-scrapy操作与中间件

- Locator: `[[sources/js-reverse2/20261005/day13/scrapy操作.md#scrapy的核心组件]]`
- Summary: Middleware and core-component architecture. Explains downloader middleware hooks, uses them to set proxy/UA/cookie, and combines a proxy pool with Selenium to replace a dynamic page's response. Demos in `middlePro` and `wangyiPro`.
- Key claims: two middlewares = spider and downloader; downloader middleware sits between Engine and Downloader and can intercept every request/response; `process_request(request, spider)` (return `None` to continue), `process_response(request, response, spider)` (must return a response), `process_exception(request, exception, spider)`; set proxy via `request.meta['proxy']`, UA via `request.headers['User-Agent']`, cookie via `request.headers['cookie']`/`request.cookies`; `spider` param lets middleware read spider attributes (e.g. `spider.proxy_list`); to handle JS-rendered pages, in `process_response` run Selenium on the target URL and return `HtmlResponse(url=..., body=page_text, request=request, encoding='utf-8')`.
- Learner-relevant: Can inject proxies/headers/cookies globally and splice rendered HTML into Scrapy's response flow.

### day14-scrapy进阶CrawlSpider分布式增量

- Locator: `[[sources/js-reverse2/20261005/day14/scrapy进阶操作.md#crawlspider]]`
- Summary: Three advanced topics: `CrawlSpider` for rule-driven全站 crawling; distributed crawling with `scrapy-redis`; and incremental crawling via a Redis dedup record table.
- Key claims: `scrapy genspider -t crawl name url` produces a `CrawlSpider` with `rules`; `LinkExtractor(allow=regex, restrict_xpaths=...)` extracts links and `Rule(link, callback=..., follow=...)` requests them; empty `allow` regex extracts all links; `parse_start_url` handles the start URL; four request-sending mechanisms = `start_urls`, `scrapy.Request`, `scrapy.FormRequest`, `Rule`; native Scrapy cannot distribute because scheduler/pipeline are not shared; `scrapy-redis` supplies shared scheduler + dupefilter + pipeline, storing only to Redis; subclass `RedisCrawlSpider`, replace `start_urls` with `redis_key` (queue name), configure `DUPEFILTER_CLASS=Scheduler=...`, `SCHEDULER_PERSIST=True`, `REDIS_HOST/PORT`, uncomment `bind`/disable `protected-mode`, then `lpush queue start_url`; incremental crawling = update-monitoring with dedup: a redis SET as a persistent record table, `conn.sadd('data_id', url)` returns `1` for new URLs only.
- Learner-relevant: Can run rule-based site-wide crawls, understand the distributed architecture, and design incremental updates that skip already-seen items.

### js逆向-day02-初识爬虫

- Locator: `[[sources/js-reverse2/20261005/JS逆向/day02/课堂笔记/02 初识爬虫[UA检测 乱码 动态数据以及图片数据爬取].md#爬虫初始]]`
- Summary: A cleaner, newer-codebase re-teach of crawler intro and `requests` (duplicating `day04`). Six runnable demos in `课上代码` plus saved HTML dumps (`caifu.html`, `51游戏.html`, `人事考试网.html`, `人事考试网站内搜索.html`) and a downloaded image. Useful as a second, more current phrasing and as reference outputs.
- Key claims: crawler is a B/S or C/S client simulating the browser; categories general/focused/incremental; UA-check vs UA-spoofing; encoding fix tries `utf-8` then `gbk`; `requests.get(url, params=dict)` for query params, `requests.post(url, data=dict)` for form data; dynamic data via global packet search (two cases: no page-matching packet, or matching packet without the desired data); `response.json()`, `response.content`, `urlretrieve`; summary mapping content-type → `.text`/`.json()`/`.content`.
- Learner-relevant: Reinforces the `requests` workflow on a newer codebase; concrete saved HTML/JSON make the abstract steps verifiable.

### js逆向-day03-xpath数据分析以及实战案例

- Locator: `[[sources/js-reverse2/20261005/JS逆向/day03/资料/课堂笔记/03 xpath数据分析以及实战案例.md#数据解析]]`
- Summary: XPath-focused re-teach (duplicating `day05`). Starts from the 下厨房/肯德基 assignments, drills `lxml` XPath expressions on a shared `test.html`, then applies them to the 碧血剑 novel, resume RAR, and lazy-loaded images. Demos in `课上代码/day03` include scraped outputs (`xiaoshuodir`, `jianlidir`, `meinvdir`).
- Key claims: same XPath vocabulary as `day05` (`/` one level, `//` any level, `[@attr=...]`, `[n]` 1-indexed, `/text()` vs `//text()`, `@attr`); local parse with `./`; 下厨房 search has `keyword` + fixed `cat=1001`; KFC is POST with `Form Data` (use `data=`, not `params=`); resume RAR downloaded via `response.content` into `wb`; lazy-load image URL is in `data-original` and needs a scheme prefix.
- Learner-relevant: Same capability as `day05`, with a concrete browse-able reference output tree for novel/resume/image scraping.

### js逆向-day04-防盗链代理与大作业

- Locator: `[[sources/js-reverse2/20261005/JS逆向/day04/课堂笔记/04 爬虫进阶之防盗链以及代理IP.md#防盗链]]`
- Summary: Anti-hotlink + proxy re-teach (duplicating `day06`) plus the stage capstone: scraping 考试宝 (`ks.wangxiao.cn`) practice questions. `大作业记录` and `思路分析` record the capstone's step-by-step approach and the discovered URL transformation. Demos in `课上代码/day04` (Weibo images, local IP, news proxy pool).
- Key claims: Referer is the anti-hotlink trigger; the real image URL is in `real_src`, not `src`; send a matching `Referer` header; proxy anonymity transparent/anonymous/high-anonymous; proxy type must match scheme; proxy pool generated from a provider API and applied with `proxies={'https': random.choice(pool)}`; capstone requires login cookie + three dynamic params (`day`, `sign`, `subsign`) extracted from each question's detail URL, then a POST per question to fetch JSON (type/content/options/answer).
- Learner-relevant: Can defeat Referer/lazy protections and proxy limiting, and has a realistic multi-constraint capstone that previews the JS-reverse work ahead.
