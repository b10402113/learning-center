---
subject: js-reverse
status: draft
path: 案例驱动（practice-first）：每个节点 = 一个真实案例，从简单到复杂；概念在案例需求时拉进来
created: 2026-09-05
---

# ROADMAP — js-reverse

## Goal
能够独立爬取需要登入验证的网站内容，特别是已购买课程的字幕，并延伸作为自己模型的训练资料来源。

## Learning path
案例驱动（practice-first）：每个节点即一个真实案例，从简单到复杂。先跑通一个完整爬虫流程，再逐层加入登入、加密、模块化等难度。概念在案例需求时才拉进来。最快对齐「爬登入后网站」的具体目标，适合想尽早爬动真实网站、能接受「先求动再求懂」的学习者。

## How to use
按顺序读节点。每个节点是一个 step-DAG。对每个节点先跑 `/probe js-reverse/<node-id>` 测量掌握度（硬性门槛），再跑 `/nodes js-reverse/<node-id>` 确认并展开步骤。

## Nodes

### Tier 1 — 基础工具箱
1. **[[learn/js-reverse/01-python-functions|Python 基础：函式与档案操作]]**
   - Goal: 定义/呼叫函式、读写档案、with 上下文管理器
   - Sources:
     - [[sources/js-reverse/js逆向课件/day02/4.函数操作.md#函数操作]]
     - [[sources/js-reverse/js逆向课件/day02/5.文件操作.md#文件操作]]
     - [[sources/js-reverse/js逆向课件/day02/6.包与模块.md#包与模块]]
2. **[[learn/js-reverse/02-modules-web|模组与网页基础]]**
   - Goal: 模组汇入、HTTP 协议、Cookie、HTML 结构
   - Sources:
     - [[sources/js-reverse/js逆向课件/day03/6.包与模块.md#包与模块复习]]
     - [[sources/js-reverse/js逆向课件/day03/前端.md#Web基本概念与HTTP协议]]
     - [[sources/js-reverse/js逆向课件/day03/前端.md#Cookie]]
     - [[sources/js-reverse/js逆向课件/day03/前端.md#HTML基础]]
3. **[[learn/js-reverse/03-requests-xpath|requests 与 xpath 解析]]**
   - Goal: 用 requests 发请求、用 xpath 定位并提取数据
   - Sources:
     - [[sources/js-reverse/js逆向课件/day04/requests基础.md#requests基础操作]]
     - [[sources/js-reverse/js逆向课件/day05/数据解析.md#何为数据解析]]
     - [[sources/js-reverse/js逆向课件/day05/数据解析.md#xpath解析]]
4. **[[learn/js-reverse/04-session-login|Session、登入与代理]]**
   - Goal: cookie/session 自动管理、模拟登入、代理与验证码
   - Sources:
     - [[sources/js-reverse/js逆向课件/day06/requests高级.md#Cookie两种处理方式]]
     - [[sources/js-reverse/js逆向课件/day06/requests高级.md#模拟登录]]
     - [[sources/js-reverse/js逆向课件/day06/requests高级.md#代理]]

### Tier 2 — 爬虫工具链
5. **[[learn/js-reverse/05-process-thread|进程、线程与并行]]**
   - Goal: 进程/线程模型、threading、进程池
   - Sources:
     - [[sources/js-reverse/js逆向课件/day07/并发编程.md#核心概念]]
     - [[sources/js-reverse/js逆向课件/day07/并发编程.md#进程与进程调度]]
     - [[sources/js-reverse/js逆向课件/day07/并发编程.md#multiprocessing.Process]]
     - [[sources/js-reverse/js逆向课件/day07/并发编程.md#线程与线程池]]
6. **[[learn/js-reverse/06-asyncio|asyncio 与异步爬虫]]**
   - Goal: 协程、asyncio 事件循环、aiohttp 多任务异步请求
   - Sources:
     - [[sources/js-reverse/js逆向课件/day08/异步爬虫.md#协程原理]]
     - [[sources/js-reverse/js逆向课件/day08/异步爬虫.md#asyncio核心概念]]
     - [[sources/js-reverse/js逆向课件/day08/异步爬虫.md#aiohttp异步网络请求]]
7. **[[learn/js-reverse/07-selenium|Selenium 浏览器自动化]]**
   - Goal: 驱动浏览器、元素定位、动作链、隐蔽 selenium 侦测
   - Sources:
     - [[sources/js-reverse/js逆向课件/day09/selenium.md#Selenium浏览器自动化入门]]
     - [[sources/js-reverse/js逆向课件/day09/selenium.md#Selenium进阶动作链与页面等待]]
     - [[sources/js-reverse/js逆向课件/day09/selenium.md#Selenium规避检测]]
8. **[[learn/js-reverse/08-pyppeteer|Pyppeteer 异步浏览器]]**
   - Goal: Pyppeteer 异步控制、滑动验证、拟人操作
   - Sources:
     - [[sources/js-reverse/js逆向课件/day10/Pyppeteer.md#Pyppeteer简介]]
     - [[sources/js-reverse/js逆向课件/day10/Pyppeteer.md#Pyppeteer快速上手与详细用法]]
9. **[[learn/js-reverse/09-scrapy-intro|Scrapy 框架入门]]**
   - Goal: 专案结构、Spider 编写、Response 解析、终端运行
   - Sources:
     - [[sources/js-reverse/js逆向课件/day10/scrapy介绍+环境安装.md#Scrapy框架简介与安装]]
     - [[sources/js-reverse/js逆向课件/day11/1.scrapy基础01.md#项目创建与基本使用]]

### Tier 3 — Scrapy 进阶
10. **[[learn/js-reverse/10-scrapy-pipeline|Scrapy 管道与持久化]]**
    - Goal: Item 封装、Pipeline 三方法、多管道与资料库储存
    - Sources:
      - [[sources/js-reverse/js逆向课件/day11/1.scrapy基础01.md#持久化存储两条路线]]
      - [[sources/js-reverse/js逆向课件/day11/2.scrapy操作02.md#管道深入操作]]
      - [[sources/js-reverse/js逆向课件/day12/1.内置管道.md#scrapy内置管道]]
11. **[[learn/js-reverse/11-deep-crawl-post|深度爬取与 POST 请求]]**
    - Goal: 翻页、meta 跨页传参、FormRequest 发送 POST
    - Sources:
      - [[sources/js-reverse/js逆向课件/day12/2.scrapy深度爬取.md#scrapy深度爬取]]
      - [[sources/js-reverse/js逆向课件/day12/2.scrapy深度爬取.md#post请求发送]]
12. **[[learn/js-reverse/12-middleware-crawlspider|中间件、CrawlSpider 与分散式]]**
    - Goal: 下载中间件、UA/代理中间件、CrawlSpider 全站爬取
    - Sources:
      - [[sources/js-reverse/js逆向课件/day13/scrapy操作.md#中间件]]
      - [[sources/js-reverse/js逆向课件/day14/scrapy进阶操作.md#CrawlSpider全站爬取]]

### Tier 4 — JavaScript 基础
13. **[[learn/js-reverse/13-ajax-js-intro|Ajax 与 JavaScript 引入]]**
    - Goal: Flask 伺服器、Ajax 请求、JS 引入方式、Ajax = requests 映射
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day15/笔记#URL的结构与向服务器发请求的四种形式]]
      - [[sources/js-reverse/js逆向课件/Day15/01 server/templates/index.html#Ajax前端演示页]]
14. **[[learn/js-reverse/14-js-variables-control|JS 变数、型别与控制流]]**
    - Goal: var/let/const、资料型别、分支、回圈、字串、阵列
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day16/03 变量.js#变量]]
      - [[sources/js-reverse/js逆向课件/Day16/05 运算符.js#运算符]]
      - [[sources/js-reverse/js逆向课件/Day17/01 JS的分支语句.js#分支语句]]
      - [[sources/js-reverse/js逆向课件/Day17/04 数组 .js#数组]]
15. **[[learn/js-reverse/15-js-scope-prototype|JS 函式、作用域与原型]]**
    - Goal: 闭包、作用域链、原型物件、箭号函式、定时器
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day18/02 JS的作用域.js#JS的作用域]]
      - [[sources/js-reverse/js逆向课件/Day18/06 闭包.html#闭包]]
      - [[sources/js-reverse/js逆向课件/Day19/01 原型对象（prototype）.js#原型对象]]
      - [[sources/js-reverse/js逆向课件/Day19/03 箭头函数.js#箭头函数]]
16. **[[learn/js-reverse/16-encoding-crypto|编码与加密特征]]**
    - Goal: 认得 base64、摘要算法、AES、RSA 的特征
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day20/02 base64编码.py#base64编码]]
      - [[sources/js-reverse/js逆向课件/Day20/06 摘要算法.py#摘要算法]]
      - [[sources/js-reverse/js逆向课件/Day21/01 aes对称加密.py#AES对称加密]]
      - [[sources/js-reverse/js逆向课件/Day21/03 rsa非对称加密的公私钥.py#RSA公私钥]]

### Tier 5 — JS 逆向实战
17. **[[learn/js-reverse/17-debugging-tips|DevTools 断点与逆向技巧]]**
    - Goal: 呼叫堆叠回溯、关键字搜寻、加密值三大藏身处
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day22/01 断点和请求堆栈.html#断点和请求堆栈]]
      - [[sources/js-reverse/js逆向课件/Day22/02 关于逆向爬虫的技巧.md#关于逆向爬虫的技巧]]
18. **[[learn/js-reverse/18-sign-python|实战：sign 逆向（Python 原生）]]**
    - Goal: 用 Python hashlib 复现有道 sign，不依赖 JS 执行环境
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day23/01 基于Py逆向的有道翻译.py#基于Py逆向的有道翻译]]
19. **[[learn/js-reverse/19-sign-execjs|实战：sign 逆向（JS 执行）]]**
    - Goal: 用 execjs 执行 JS 版 sign 与 AES 解密，混合路线
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day23/03 有道翻译.js#基于JS逆向的有道翻译]]
      - [[sources/js-reverse/js逆向课件/Day23/06 基于JS逆向的有道翻译的解密.py#有道翻译响应解密JS版]]
20. **[[learn/js-reverse/20-des-aes-cases|实战：DES/AES 案例]]**
    - Goal: 招标网 DES-ECB、毛毛租 AES-CBC 加解密
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day24/01 招标网.py#招标网DES解密]]
      - [[sources/js-reverse/js逆向课件/Day24/03 毛毛租.py#毛毛租AES加解密]]
21. **[[learn/js-reverse/21-sha1-baidu|实战：SHA1 与百度 sign]]**
    - Goal: 丁香网 SHA1 sign、百度翻译 gtk 位元运算 sign
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day25/01 丁香网.py#丁香网病例搜索接口逆向]]
      - [[sources/js-reverse/js逆向课件/Day26/03 百度翻译.py#百度翻译sign逆向]]
22. **[[learn/js-reverse/22-supplement-env-rc4|实战：补环境与 RC4]]**
    - Goal: window 补环境、Proxy 拦截、极简壁纸 RC4 响应解密
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day26/05 补环境分析.js#补环境]]
      - [[sources/js-reverse/js逆向课件/Day26/07 极简壁纸.py#极简壁纸响应解密]]
23. **[[learn/js-reverse/23-webpack-analysis|实战：webpack 模组化分析]]**
    - Goal: loader 调度器、mod 模组注册、财联社/沃邮箱案例
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day27/01 webpack加载器loader.js#webpack加载器原理]]
      - [[sources/js-reverse/js逆向课件/Day27/05 财联社的loader.js#案例二财联社]]
      - [[sources/js-reverse/js逆向课件/Day27/09 沃邮箱的loader.js#案例三沃邮箱]]
24. **[[learn/js-reverse/24-promise-async|Promise 与异步模式]]**
    - Goal: 回呼地狱、Promise 语法与链式操作、async 基础
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day28/01 死亡回调.html#回调地狱]]
      - [[sources/js-reverse/js逆向课件/Day28/02 promise语法.html#Promise基本语法]]
      - [[sources/js-reverse/js逆向课件/Day28/03 promise的链式操作.html#Promise链式操作]]
25. **[[learn/js-reverse/25-pdd-supplement-env|实战：拼多多进阶补环境]]**
    - Goal: 完整 env shim、风控 anti_content token 生成
    - Sources:
      - [[sources/js-reverse/js逆向课件/Day29/01 env.js#补环境]]
      - [[sources/js-reverse/js逆向课件/Day29/05 pdd.js#Pinduoduo anti_content实战]]

## Status
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
