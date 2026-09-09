---
source: js逆向课件/day13
source_lines: 700
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/day13

## Overview (L1)

- **scrapy 核心组件回顾**：重申五大组件（引擎、调度器、下载器、爬虫、项目管道）的职责，作为理解中间件位置与作用的前置地图。
- **中间件（爬虫中间件 vs 下载中间件）**：下载中间件位于引擎与下载器之间，可拦截框架中所有请求和响应——拦截请求可改 ip、头信息（UA）、cookie；拦截响应可篡改响应数据。三个核心方法：`process_request`（处理请求对象）、`process_response`（处理响应对象，可返回新的 HtmlResponse）、`process_exception`（修正异常请求），`spider` 参数可实现爬虫类与中间件的数据交互。
- **三类请求中间件实战**：代理中间件 `request.meta['proxy'] = proxy`（全局代理会拉低整体请求效率）；UA 中间件 `request.headers['User-Agent'] = ua`（从列表随机选）；Cookie 中间件 `request.cookies = cookies` / `request.headers['cookie']`。借助 spider 参数可在爬虫文件里定义代理池，中间件中 `random.choice` 取用。
- **中间件结合 selenium 篡改响应**：网易新闻（https://news.163.com/）案例——板块页新闻为动态加载，响应不满足需求；在 `process_response` 中用 spider 持有的浏览器对象 `bro.get()`、滚动到底、取 `page_source`，实例化新的 `HtmlResponse` 替换原响应，从而让 scrapy 解析到动态渲染后的页面；爬虫重写 `closed` 关闭浏览器。

## Sections (L2)

### scrapy的核心组件

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day13/scrapy操作.md#scrapy的核心组件]]`
- Summary: 与 day12 相同的五大组件清单，作为本日中间件教学的前置：引擎、调度器、下载器、爬虫、项目管道各自的职责。
- Key claims: 引擎处理整个系统的数据流、触发事务（框架核心）;调度器是 URL 优先队列，决定下一个抓取网址并去重;下载器建立在 twisted 异步模型上;爬虫提取 Item 与后续链接;项目管道持久化、验证、清洗实体
- Learner-relevant: 给出中间件所处的组件坐标图， learner 凭"位置"推出中间件能拦截什么。

### 中间件

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day13/scrapy操作.md#中间件]]`
- Summary: 引出 scrapy 的两类中间件（爬虫中间件、下载中间件），下载中间件位于引擎与下载器之间，能拦截所有请求和响应；并给出中间件类的骨架代码与三个核心方法。
- Key claims: scrapy 中间件有两个：爬虫中间件和下载中间件;下载中间件位于引擎和下载器之间，引擎向下载器传请求对象、下载器向引擎返响应对象;作用是拦截框架中所有请求和响应：拦截请求可修改请求 ip、头信息、设置 cookie，拦截响应可修改响应数据;`process_request(self, request, spider)` 拦截处理所有请求对象，返回 None 继续;`process_response(self, request, response, spider)` 拦截处理所有响应对象，可返回自定义新响应对象（如 `HtmlResponse(request=request, body='123', url=request.url, encoding='utf-8')` 篡改响应数据）;`process_exception(self, request, exception, spider)` 拦截发生异常的请求对象;spider 参数是爬虫类实例化对象，可实现爬虫类和中间类的数据交互
- Learner-relevant: 建立"中间件 = 全局请求/响应拦截点"的心智模型，知道 UA/代理/cookie/改响应四件事都在这里做。

### 开发代理中间件

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day13/scrapy操作.md#开发代理中间件]]`
- Summary: 在 `process_request` 中给请求设置代理的最小实现，并指出全局代理的效率弊端。
- Key claims: 设置代理：`request.meta['proxy'] = 'http://ip:port'`;要让所有请求都走代理则把代理操作写在 process_request 中;弊端：会让整体请求效率变低
- Learner-relevant: 能写出代理中间件，并理解"每请求都挂代理"是效率与反反爬的权衡。

### 开发UA中间件

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day13/scrapy操作.md#开发UA中间件]]`
- Summary: 在 `process_request` 中给请求随机设置 User-Agent 的实现。
- Key claims: 设置 UA：`request.headers['User-Agent'] = '从列表中随机选择的一个UA值'`
- Learner-relevant: 掌握 UA 池随机化的标准写法，直接对接反爬场景的请求头伪装需求。

### 开发Cookie中间件

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day13/scrapy操作.md#开发Cookie中间件]]`
- Summary: 在 `process_request` 中为请求设置 cookie 的两种写法。
- Key claims: `request.cookies = cookies`;也可 `request.headers['cookie'] = 'xxx'`
- Learner-relevant: 知道给 scrapy 请求挂 cookie 的两条等价路径，服务于带登录态的爬取。

### 中间件中spider参数的作用：

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day13/scrapy操作.md#中间件中spider参数的作用：]]`
- Summary: 用"代理池"示例演示 spider 参数如何打通爬虫文件与中间件的数据交互：代理池定义在爬虫类中，中间件通过 `spider.proxy_list` 取用并随机选择。
- Key claims: spider 参数可实现爬虫文件和中间件的数据交互;爬虫文件中定义类属性 `proxy_list`（代理池）;中间件中 `proxy_list = spider.proxy_list` 获取，`import random; request.meta['proxy'] = random.choice(proxy_list)` 随机挂代理
- Learner-relevant: 学会把"数据源"放在爬虫类、把"消费逻辑"放在中间件的协作模式，这是后面 selenium 案例复用的关键机制。

### 中间件结合selenium实现修改响应数据

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day13/scrapy操作.md#中间件结合selenium实现修改响应数据]]`
- Summary: 网易新闻（https://news.163.com/）完整案例：国内/国际板块新闻为动态加载，scrapy 拿到的响应不满足需求；在 `process_response` 中用爬虫实例化的 selenium 浏览器渲染页面，用 `page_source` 构造新 `HtmlResponse` 替换原响应。
- Key claims: 爬虫类中实例化浏览器对象 `bro = webdriver.Chrome(...)` 作为类属性;parse 解析五个板块 url 存入 `self.model_urls`，逐一 yield Request 给 `parse_model`;板块页数据动态加载，直接 xpath 解析拿不到（不满足需求的响应对象）;process_response 中判断 `request.url in spider.model_urls`，是则 `bro.get(request.url)` + `sleep(2)` + `bro.execute_script('window.scrollTo(0,document.body.scrollHeight)')` 滚动加载 + 取 `bro.page_source`;用 `HtmlResponse(url=request.url, body=page_text, request=request, encoding='utf-8')` 实例化新响应对象返回，否则原样返回 response;详情页用请求传参 `meta={'item': item}` 延续深度爬取套路;重写 `closed(self, spider)` 方法在结束时 `self.bro.quit()` 关闭浏览器
- Learner-relevant: 打通"scrapy 调度 + selenium 渲染"的混合架构——动态页交给浏览器、静态页走原生管道，是应对动态加载站点的主力方案；文末提到 crawlSpider、分布式、增量为后续待学主题。
