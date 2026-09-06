---
source: js逆向课件/day10
source_hash:
  - 5b4ed8f22f9560798d7a305397b220519284f9570b900125c9d73e0223c59133
  - 46b58d2663e487bebe64c741d4d2b3827f98a4c929ca9afd84cfc949a035b2a0
source_lines: 453
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/day10

## Overview (L1)

- **Pyppeteer 简介** — Pyppeteer 是"异步的 selenium"，背后依赖开源的 Chromium 浏览器执行网页渲染；首次运行自动下载配置 Chromium，免去驱动与环境配置，且基于 Python async 特性支持异步操作，效率高于 Selenium。
- **Pyppeteer 快速上手与详细用法** — 核心链路：`launch()` 建 Browser → `newPage()` 建选项卡 → `goto()` 请求 → `content()` 取渲染后源码。launch 常用参数（headless、ignoreHTTPSErrors、executablePath、devtools、args）；`setViewport` 解决页面显示尺寸问题；`page.evaluate` 注入 JS 把 `navigator.webdriver` 改为 false 规避检测；`page.type/click/querySelectorAll` 做节点交互（type 带 delay 可模拟人的输入节奏）。
- **Pyppeteer 爬虫练习** — 异步爬取网易新闻首页标题：协程函数返回 `page.content()`，任务对象绑定回调做 lxml/xpath 解析，executablePath 可指向本机已装的 Google Chrome。
- **Pyppeteer 滑动验证** — 与 selenium 思路一致但更拟人：cv2 模板匹配算缺口距离，`page.hover + mouse.down + mouse.move(steps=100) + mouse.up` 分多步慢速滑动，type 输入加随机 delay，模拟人的行为。
- **Scrapy 框架简介与安装** — 框架是集成了各种功能（高性能异步下载、队列、分布式、解析、持久化）的项目半成品；学框架重点是用法而非源码。安装一条 `pip install scrapy`。
- **Scrapy 基本使用与数据解析** — `startproject` 建项目（items/middlewares/pipelines/settings/spiders 目录结构）→ `genspider` 建爬虫 → 写爬虫类（name、start_urls、parse）→ 改 settings（ROBOTSTXT_OBEY=False、LOG_LEVEL、USER_AGENT）→ `scrapy crawl 爬虫名` 运行。数据解析用 `response.xpath`，返回 Selector 对象，`extract()` 取列表全部 data、`extract_first()` 取第一个。

## Sections (L2)

### Pyppeteer简介

- Locator: `[[sources/js-reverse/js逆向课件/day10/Pyppeteer.md#Pyppeteer简介]]`
- Summary: Pyppeteer 是异步版 selenium，背后由 Chromium 浏览器执行网页渲染；先厘清 Chrome 与 Chromium 的渊源，再说明 Pyppeteer 的免配置与异步优势。
- Key claims: Chromium 是谷歌为研发 Chrome 启动的完全开源项目，二者基于相同源代码构建，新功能先在 Chromium 上验证再移植，Chromium 更新更频繁；Pyppeteer 依赖 Chromium 运行，首次运行若未安装会自动安装配置，免去繁琐环境配置；基于 Python async 新特性实现，支持异步操作，效率相对 Selenium 更高。
- Learner-relevant: 建立"selenium 的异步替代品"心智模型，理解为什么渲染爬虫也可以走 asyncio 体系。

### 环境安装

- Locator: `[[sources/js-reverse/js逆向课件/day10/Pyppeteer.md#环境安装]]`
- Summary: Pyppeteer 采用 async 机制，要求 Python 3.5+，安装只需 pip install pyppeteer。
- Key claims: 运行要求 Python 3.5 及以上；安装命令 `pip install pyppeteer`。
- Learner-relevant: 一条命令即可开工，无 chromedriver 配置负担。

### 快速上手

- Locator: `[[sources/js-reverse/js逆向课件/day10/Pyppeteer.md#快速上手]]`
- Summary: 爬取 quotes.toscrape.com/js/（JS 渲染页）全部数据：launch 建 Browser、newPage 建选项卡、goto 请求、content 取源码，再用 lxml 解析。
- Key claims: `launch(headless=True)` 创建浏览器对象；`bro.newPage()` 相当于新建选项卡返回 Page 对象；`page.goto(url)` 相当于浏览器输入 URL 跳转加载；`page.content()` 返回渲染后的页面源代码；整个流程写在 async 特殊函数内，最后 `asyncio.get_event_loop().run_until_complete(c)` 启动；全程无需配置 Chrome 与浏览器驱动，达到 Selenium 同等效果且异步。
- Learner-relevant: 五行核心 API 走通渲染页面抓取，可与 day08 的 asyncio 知识直接衔接。

### 详细用法

- Locator: `[[sources/js-reverse/js逆向课件/day10/Pyppeteer.md#详细用法]]`
- Summary: 逐项讲 launch 参数、关闭自动化提示条、setViewport 处理页面显示、evaluate 注入 JS 规避检测、type/click 等节点交互。
- Key claims: launch 参数：`ignoreHTTPSErrors`（默认 False）、`headless`（默认 True 无界面，False 有头）、`executablePath`（指定已有 Chrome/Chromium 则不用默认 Chromium）、`devtools`（True 时强制 headless=False）、`args`（额外参数）；关闭"Chrome 正受到自动测试软件的控制"提示条：`args=['--disable-infobars']`；访问淘宝页面显示异常时需 `page.setViewport({'width':1366,'height':768})` 手动设置视口长宽；规避检测：`page.evaluate` 执行 `Object.defineProperties(navigator,{webdriver:{get:()=>false}})` 把 webdriver 标记改回 false；节点交互：`page.type('#kw','周杰伦',{'delay':1000})` 模拟逐字输入（可很好模拟人的行为）、`page.click('#su')` 点击、`page.querySelectorAll('.s_tab_inner > a')` 选择器选中标签再 `.click()`。
- Learner-relevant: 具备独立配置 Pyppeteer 各类运行细节的能力，尤其是视口、提示条与 webdriver 反检测三点。

### 爬虫练习

- Locator: `[[sources/js-reverse/js逆向课件/day10/Pyppeteer.md#爬虫练习]]`
- Summary: 异步爬取网易新闻首页新闻标题：特殊函数内完成 launch/goto/content 并返回源码，任务对象绑定回调用 lxml 解析标题。
- Key claims: `executablePath` 可指向本机已装 Chrome（路径可在浏览器 `chrome://version/` 的"个人资料路径"处查看）；协程函数 `return page_text` 后由 `task.add_done_callback(parse)` 在回调中 `task.result()` 取源码并 xpath 解析；结构与 day08 的多任务协程完全一致（ensure_future + wait）。
- Learner-relevant: 把 Pyppeteer 嵌进 asyncio 任务回调体系，形成"渲染 + 异步 + 解析"的完整可复用模板。

### 滑动验证

- Locator: `[[sources/js-reverse/js逆向课件/day10/Pyppeteer.md#滑动验证]]`
- Summary: 京东登录滑动验证的 Pyppeteer 实现：cv2 模板匹配算距离，page.type 随机 delay 输入账号密码，鼠标 hover/down/多步 move/up 模拟人的滑动轨迹。
- Key claims: 距离计算同 selenium 思路：`cv2.matchTemplate` + `minMaxLoc`，再做像素换算 `value * 278 / 360 - 13`；`page.type("#loginname", ..., {"delay": random.randint(30,60)})` 每字符随机间隔，模拟人输入；`page.waitFor(2000)` 通用等待（数字表示毫秒）；`page.Jeval(selector, "el=>el.src")` 定位元素并执行 JS 箭头函数取属性；三种解析方式 `Page.querySelector()/querySelectorAll()/xpath()`，简写 `Page.J()/JJ()/Jx()`；`el.boundingBox()` 获取元素边界框（x/y/width/height）；滑动序列：`page.hover` 悬停 → `page.mouse.down()` 按下 → `page.mouse.move(x, y, {"steps":100})` 分 100 步慢速移动（steps 越大越慢越像人）→ `mouse.up()` 释放；横向距离再加 `random.uniform(20,40)` 随机偏移。
- Learner-relevant: 对比 day09 的 selenium 滑动验证，理解"拟人化轨迹（delay/steps/随机偏移）"才是通过率的关键。

### 简介

- Locator: `[[sources/js-reverse/js逆向课件/day10/scrapy介绍+环境安装.md#简介]]`
- Summary: 框架是集成了各种功能、通用性强的项目半成品；Scrapy 是为爬取网站数据、提取结构性数据而写的应用框架，学习重点是各功能用法而非源码。
- Key claims: 框架 = 项目的半成品，集成各种功能且通用性强；Scrapy 集成了高性能异步下载、队列、分布式、解析、持久化等功能；初期学框架只需学集成好的各功能用法，前期切勿钻研框架源码。
- Learner-relevant: 建立正确的框架学习观——先会用再谈懂，避免掉进源码深坑。

### 安装

- Locator: `[[sources/js-reverse/js逆向课件/day10/scrapy介绍+环境安装.md#安装]]`
- Summary: Scrapy 安装在 Linux/mac/Windows 上都是 pip install scrapy。
- Key claims: 各平台统一 `pip install scrapy`。
- Learner-relevant: 零门槛安装，可直接进入项目创建。

### 基本使用

- Locator: `[[sources/js-reverse/js逆向课件/day10/scrapy介绍+环境安装.md#基本使用]]`
- Summary: Scrapy 五步上手：startproject 建项目、genspider 建爬虫、理解爬虫文件组成、改 settings 配置、crawl 运行。
- Key claims: `scrapy startproject 项目名` 创建项目；目录结构：items.py 封装数据格式、middlewares.py 所有中间件、pipelines.py 所有管道、settings.py 爬虫配置、spiders 爬虫文件夹、scrapy.cfg 项目配置（不要动）；`scrapy genspider 爬虫名 起始url` 在爬虫文件夹下生成爬虫文件；爬虫类三要素：`name`（爬虫唯一标识）、`start_urls`（列表内 url 都被框架异步发起 get 请求）、`parse(self, response)`（专门用作数据解析，调用次数取决于 start_urls 元素个数，response 是响应对象）；settings 三改：`ROBOTSTXT_OBEY = False`（不遵从 robots 协议）、`LOG_LEVEL = 'ERROR'`（日志级别）、`USER_AGENT` 指定 UA；运行 `scrapy crawl 爬虫名称`（推荐，显示日志）。
- Learner-relevant: 能从零搭起一个 Scrapy 工程并跑通请求，记住 name/start_urls/parse 的骨架含义。

### 数据解析

- Locator: `[[sources/js-reverse/js逆向课件/day10/scrapy介绍+环境安装.md#数据解析]]`
- Summary: 新建解析项目演示 Scrapy 内置 xpath 解析：response.xpath 返回 Selector 对象，用 extract / extract_first 取出 data 属性中的数据。
- Key claims: 解析直接写在 parse 中：`response.xpath(...)`；xpath 最终返回 Selector 对象，想要的数据存在其 data 属性中；`extract()` 获取返回列表中每一个 Selector 的 data 值；`extract_first()` 获取列表第一个 Selector 的 data 值；列表元素只有一个用 extract_first，否则用 extract；示例解析下厨房菜谱列表页的标题；文中末尾预告后续主题：mysql/redis 存储、scrapy 持久化存储。
- Learner-relevant: 分清 Selector 对象与纯文本的区别，掌握 extract/extract_first 的取舍规则，为持久化存储铺路。
