---
source: js逆向课件/day12
source_lines: 1649
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/day12

## Overview (L1)

- **scrapy 内置管道（FilesPipeline / ImagesPipeline）**：scrapy 自带两个专用于二进制资源下载的管道类，ImagesPipeline 面向图片（需 `pip install pillow`），FilesPipeline 面向普通文件；只下图片时两者皆可。核心流程是爬虫提取链接→封装进 item→自定义子类重写 `get_media_requests`/`file_path`/`item_completed` 三个方法，并通过 `IMAGES_STORE`/`FILES_STORE` 及 `IMAGES_THUMBS` 等配置控制存储路径与缩略图。
- **scrapy 深度爬取**：解决两类需求——全站多页爬取与"数据不在同一张页面"的深度详情页爬取。前者用手动请求发送（`yield scrapy.Request(url, callback=self.parse)` + 页码递增模板）；后者必须用请求传参机制（`meta={'item': item}` 把列表页的 item 传给详情页回调），两者可叠加实现整站翻页+进详情页的完整爬取。
- **提高 scrapy 爬取效率**：两条配置级手段——在 settings 中调大 `CONCURRENT_REQUESTS`（默认 32，可设 100）增加并发；设置 `LOG_LEVEL = 'ERROR'` 降低日志级别以减少 CPU 消耗。
- **post 请求发送**：起始 url 的请求由 Spider 父类的 `start_requests` 方法发出，默认发 GET；要发 POST 需在子类重写该方法，改用 `scrapy.FormRequest(url, callback, formdata)` 携带表单参数（示例为百度翻译 sug 接口）。
- **scrapy 五大核心组件**：引擎（数据流处理、框架核心）、调度器（URL 优先队列、去重）、下载器（基于 twisted 异步模型下载网页）、爬虫（提取 Item 与新链接）、项目管道（持久化、验证、清洗实体），合起来构成 scrapy 的运行机制全景。

## Sections (L2)

### scrapy内置管道

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day12/1.内置管道.md#scrapy内置管道]]`
- Summary: 引出 scrapy 内置的 FilesPipeline 与 ImagesPipeline 两个下载管道，说明各自适用范围（图片/音视频等二进制 vs 普通文件）及选型原则。
- Key claims: ImagesPipeline 专门下载图片、音频、视频等二进制文件;FilesPipeline 专门下载文件;只下载图片时两者都可以用，因为图片也是文件
- Learner-relevant: 建立"爬文本用普通管道、下二进制资源用内置管道"的选型直觉，为后续重写两个管道类打基础。

### ImagesPipeline

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day12/1.内置管道.md#ImagesPipeline]]`
- Summary: 以 360 图片（https://image.so.com/z?ch=photography，数据在 xhr 的 json 包中）为例，讲解 ImagesPipeline 的环境安装、编码流程与完整实现。
- Key claims: 需 `pip install pillow`;导入方式 `from scrapy.pipelines.images import ImagesPipeline`;流程为爬虫提取链接→封装 item 提交管道→自定义父类为 ImagesPipeline 的管道类;必须重写三方法：`get_media_requests(item, info)` 对图片地址发起请求返回二进制数据、`file_path(request, response=None, info=None, *, item=None)` 指定保存文件名、`item_completed(results, item, info)` 把 item 传给下一个管道（无下一管道可不写）;配置 `IMAGES_STORE = 'girlsLib'` 设保存根目录;`IMAGES_THUMBS = {'small': (50,50), 'big': (270,270)}` 生成缩略图;360 图片列表数据在 xhr 的 json 包中（`response.json()['list']`，字段 `qhimg_url`/`title`）
- Learner-relevant: 能独立写出"解析 json 图片列表 + ImagesPipeline 子类"的完整图片下载项目，并掌握用 title 自定义文件名的技巧。

### FilesPipeline

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day12/1.内置管道.md#FilesPipeline]]`
- Summary: 以 twisted 文档（https://docs.twistedmatrix.com/en/stable/core/examples/）为例，讲解 FilesPipeline 的约定式用法：item 必须含 `file_urls` 与 `files` 两个字段。
- Key claims: 导入方式 `from scrapy.pipelines.files import FilesPipeline`;编码流程：spider 把下载链接放入 item 的 `file_urls` 字段→提交给 FilesPipeline→管道检测到该字段自动下载→结果写入 `files` 字段;Item 必须包含 `file_urls` 和 `files` 两个字段;配置 `FILES_STORE` 设保存路径;相对链接需补全域名（在页面下载链接处右击查看链接地址观察如何补全）
- Learner-relevant: 理解 FilesPipeline 与 ImagesPipeline 的差异（约定字段驱动 vs 重写方法驱动），能落地一个文档附件批量下载项目。

### scrapy深度爬取

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day12/2.scrapy深度爬取.md#scrapy深度爬取]]`
- Summary: 讲解多页全站爬取与深度（详情页）爬取两类需求的实现：手动请求发送 + 请求传参（meta），以东莞阳光网问政平台（https://wz.sun0769.com/political/index/politicsNewest）为例。
- Key claims: "深度"即爬取的数据不在同一张页面中，必须使用请求传参机制才能完整实现;手动请求发送：`yield scrapy.Request(url=new_url, callback=self.parse)`，callback 指定解析方法;请求传参：`yield scrapy.Request(meta={}, url=detail_url, callback=self.parse_detail)`，meta 字典可传递给 callback 回调函数，回调中用 `response.meta['item']` 接收;多页爬取：定义通用 url 模板 `url_model = '...&page=%d'` + 类属性 `page_num` 计数，在 parse 末尾判断页码上限（如 `page_num <= 5`）后递增并 yield 新 Request 自我回调
- Learner-relevant: 掌握 scrapy 最核心的"翻页 + 进详情页"组合套路，能把列表页字段与详情页字段合入同一个 item 再交管道持久化。

### 如何提高scrapy的爬取效率

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day12/2.scrapy深度爬取.md#如何提高scrapy的爬取效率]]`
- Summary: 两条 settings 级性能调优手段：增加并发线程数、降低日志级别。
- Key claims: scrapy 默认并发线程为 32 个，可在 settings 中改 `CONCURRENT_REQUESTS = 100`;运行时大量日志输出会推高 CPU 使用率，可在配置文件写 `LOG_LEVEL = 'ERROR'`（或 WARNING）减少日志
- Learner-relevant: 面对爬取慢的问题，先从并发数与日志级别这两个最低成本的配置入手调优。

### post请求发送

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day12/2.scrapy深度爬取.md#post请求发送]]`
- Summary: 解释起始 url 为何"自动"被请求——Spider 父类的 `start_requests` 方法；要发 POST 需子类重写该方法改用 FormRequest，示例为百度翻译 sug 接口。
- Key claims: 起始 url 的请求由爬虫类继承的 Spider 父类 `start_requests(self)` 方法发出;该方法默认对 start_urls 发 GET 请求，发 POST 必须子类重写;`yield scrapy.Request()` 发 GET，`yield scrapy.FormRequest(url, callback, formdata)` 发 POST（formdata 传 post 请求参数，如 `{"kw": "dog"}`）;示例接口 https://fanyi.baidu.com/sug，响应用 `response.json()` 解析
- Learner-relevant: 能解释 scrapy 起始请求的内部机制，并为任何 post 接口写出 FormRequest 版爬虫（对接后续逆向出的 post 参数）。

### scrapy的核心组件

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day12/2.scrapy深度爬取.md#scrapy的核心组件]]`
- Summary: 介绍 scrapy 五大核心组件（引擎、调度器、下载器、爬虫、项目管道）的职责分工，勾勒框架整体运行机制。
- Key claims: 引擎(Scrapy)处理整个系统的数据流、触发事务，是框架核心;调度器(Scheduler)接收引擎请求压入队列、再次请求时返回，相当于 URL 优先队列，决定下一个抓取网址并去重;下载器(Downloader)下载网页内容返回给蜘蛛，建立在 twisted 高效异步模型上;爬虫(Spiders)从特定网页提取所需信息（Item），也可提取链接让 Scrapy 继续抓取下一页;项目管道(Pipeline)负责持久化实体、验证实体有效性、清除不需要的信息，按特定次序处理数据
- Learner-relevant: 拿到理解中间件位置（day13）所需的组件地图——知道请求/响应在引擎、调度器、下载器、爬虫、管道之间如何流动。
