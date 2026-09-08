---
source: js逆向课件/day14
source_hash:
  - 9a2cafd77704c5d10d56941f7190afa73243d2919727946fe77bb715ee9b996b
source_lines: 306
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/day14

## Overview (L1)

- CrawlSpider 全站爬取（#CrawlSpider）：Scrapy 封装好的爬虫类，用 `scrapy genspider -t crawl` 创建；核心是 rules 中的 LinkExtractor（链接提取器，按 allow 正则或 restrict_xpaths 提取链接）与 Rule（规则解析器，对提取到的链接发请求并按 callback 解析），二者一一对应。覆盖多页数据爬取、xpath 提取链接，以及 CrawlSpider + 手动 `scrapy.Request(meta={'item':...})` 的深度爬取组合套路。
- 分布式爬虫（#分布式）：原生 scrapy 无法分布式，因为多台电脑无法共享调度器和管道；引入 scrapy-redis 组件提供可共享的调度器与管道。编码要点：父类改 RedisCrawlSpider、start_urls 换成 redis_key（调度器队列名）、settings 指定 RedisPipeline/RFPDupeFilter/Scheduler 及 REDIS_HOST/PORT、修改 redis 配置解除本机绑定，最后 lpush 起始 url 启动爬取。课件提醒分布式日常开发并不常用，更多是噱头。
- 增量式爬虫（#增量式）：监测网站数据更新、只爬最新数据，是一种与具体技术无关的程序设计思路，核心是去重。记录表需兼具去重与持久化，Python 的 set 无法持久化故不可用，选用 redis 的 set：用 `sadd` 写入详情页 url 作唯一标识，返回 1 表示新数据才发起请求，否则跳过。

## Sections (L2)

### CrawlSpider

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day14/scrapy进阶操作.md#CrawlSpider]]`
- Summary: 用 CrawlSpider 实现全站数据爬取：rules + LinkExtractor + Rule 的使用流程，以及多页爬取与深度爬取的完整示例。
- Key claims: CrawlSpider 是 scrapy 封装好的爬虫类，用于全站数据爬取（所有页码对应页面）; 创建命令 scrapy genspider -t crawl spiderName www.xxx.com; 爬虫类多出类变量 rules; LinkExtractor 链接提取器按 allow 正则提取链接（allow 空正则可提取网站所有链接），也可用 restrict_xpaths 按标签定位提取; Rule 规则解析器对提取到的每个链接发请求，并按 callback 指定的回调解析; LinkExtractor 与 Rule 一一对应; scrapy 中四种发请求方式：start_urls、scrapy.Request()、scrapy.FormRequest()、Rule 规则解析器; 提取的页码链接中没有第一页，第一页用 parse_start_url 解析; follow=False 表示不跟进; 深度爬取建议 CrawlSpider 配合手动请求发送：parse_item 中解析列表页 → yield scrapy.Request(detail_url, callback=parse_detail, meta={'item':item}) → parse_detail 从 response.meta 取 item 补全后 yield item
- Learner-relevant: 能用 CrawlSpider 自动翻页爬全站，并掌握"列表页 meta 传 item + 详情页补全"的深度爬取通用套路。

### 分布式

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day14/scrapy进阶操作.md#分布式]]`
- Summary: 讲清 scrapy 无法原生化分布式的两个原因、scrapy-redis 的作用，以及完整的分布式改造八步流程。
- Key claims: 分布式在日常开发中并不常用，只是一个噱头; 原生 scrapy 无法分布式：多台电脑无法共享同一个调度器、无法共享同一个管道; scrapy-redis（pip install scrapy-redis）提供可被共享的调度器和管道，且只可将数据存到 redis; 爬虫改造：from scrapy_redis.spiders import RedisCrawlSpider，父类改为 RedisCrawlSpider，start_urls 替换为 redis_key（其值为调度器队列名称）; settings 指定共享管道 'scrapy_redis.pipelines.RedisPipeline'; 指定共享调度器 SCHEDULER = "scrapy_redis.scheduler.Scheduler"、去重队列 DUPEFILTER_CLASS = "scrapy_redis.dupefilter.RFPDupeFilter"、SCHEDULER_PERSIST = True 允许暂停; 指定 REDIS_HOST/REDIS_PORT; 修改 redis 配置：注释 #bind 127.0.0.1 解除本机绑定，protected-mode 改为 false; 运行后程序等待爬取任务，需在 redis 客户端 lpush 队列名称 起始url 放入起始 url 才开始爬取
- Learner-relevant: 能独立把一个 CrawlSpider 项目改造成多机共享调度/管道的分布式版本，并理解每项配置为何存在。

### 增量式

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day14/scrapy进阶操作.md#增量式]]`
- Summary: 增量式爬虫用于监测网站数据更新，核心是构建可持久化的去重记录表，示例用 redis 的 set 实现只爬最新简历。
- Key claims: 爬虫应用场景分类：通用、聚焦、功能、分布式、增量式; 增量式用来监测网站数据更新情况（只爬最新数据），只是一种程序设计思路，用什么技术都能实现; 核心是去重，用记录表存储爬取过的数据记录; 记录表需具备去重与持久保存两个特性; Python 的 set 可去重但无法持久化存储，不可用; redis 的 set 既能去重又能持久化，是合适方案; 实现手法：conn.sadd('data_id', detail_url) 将详情页 url 作为唯一标识写入记录表，返回 1 说明之前没爬过（有更新）才 yield scrapy.Request 请求详情页，否则打印"暂无数据更新"; 判断标准 = sadd 的返回值，而非查询
- Learner-relevant: 能设计"只爬新增数据"的监控型爬虫，并理解为什么选 redis set 而不是 Python set 做记录表。
