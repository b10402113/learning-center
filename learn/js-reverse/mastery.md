subject: js-reverse
created: 2026-09-05
updated: 2026-09-07
---

## 00-crawler-fundamentals — 爬虫基础：定义、分类与合法性

probe skipped via /nodes js-reverse/00-crawler-fundamentals skip-probe on 2026-09-08

### Strands

- 爬虫定义与 B/S 架构中的客户端模拟: unknown
- 通用/聚焦/增量式三种分类的特征与区别: unknown
- 反爬机制与反反爬策略的对立关系: unknown
- 爬虫技术中立性与善意/恶意行为边界: unknown
- 三大法律风险与规避建议: unknown

## 13-ajax-js-intro — Ajax 与 JavaScript 引入

probe skipped via /nodes js-reverse/13-ajax-js-intro skip-probe on 2026-09-07

### Strands

- URL 結構與四種請求形式（同步 vs 非同步）: unknown
- Flask 演示伺服器路由設計與 JSON 介面: unknown
- Ajax 前端演示頁事件驅動與 jQuery $.ajax 流程: unknown
- Python requests 與瀏覽器 Ajax 的映射關係: unknown
---

# Mastery — js-reverse

## 22-supplement-env-rc4 — 实战：补环境与 RC4

probe skipped via /nodes js-reverse/22-supplement-env-rc4 skip-probe on 2026-09-07

### Strands

- window = global 补环境的基本形态与缺失属性补齐: unknown
- Proxy get/set 拦截与 Reflect 操作原对象: unknown
- RC4 算法 KSA 密钥编排与 PRGA 异或输出: unknown
- atob + Int8Array + RC4 + UTF-8 解码的完整解密链: unknown
- 极简壁纸响应解密与图片下载的完整闭环: unknown

## 21-sha1-baidu — 实战：SHA1 与百度 sign

probe skipped via /nodes js-reverse/21-sha1-baidu skip-probe on 2026-09-07

### Strands

- SHA1 算法特征识别（五个魔数 + 80 轮循环）: unknown
- 丁香网参数构造与字典序拼接规则: unknown
- execjs 调用 SHA1 与 GET 请求闭环: unknown
- 百度翻译 get_sign 算法与 gtk 补环境: unknown
- 百度翻译 POST 表单请求闭环: unknown

## 05-process-thread — 进程、线程与并行

probe skipped via /nodes js-reverse/05-process-thread skip-probe on 2026-09-06

### Strands

- 进程与线程的核心模型（工厂-车间-工人）: unknown
- 进程调度与并发/并行辨析: unknown
- 进程四态与同步/异步: unknown
- multiprocessing.Process 实战: unknown
- threading.Thread 与线程池: unknown
- 协程原理与动机: unknown

## 11-deep-crawl-post — 深度爬取与 POST 请求

probe skipped via /nodes js-reverse/11-deep-crawl-post skip-probe on 2026-09-06

### Strands

- 多页翻页爬取（URL 模板 + 页码递增）: unknown
- meta 跨页传参（列表页 → 详情页）: unknown
- FormRequest 发送 POST 请求: unknown
- scrapy 五大核心组件与数据流: unknown
- 爬取效率调优（CONCURRENT_REQUESTS / LOG_LEVEL）: unknown

## 02-modules-web — 模組與網頁基礎

probe skipped via /nodes js-reverse/02-modules-web skip-probe on 2026-09-06

### Strands

- 模块导入与包组织: unknown
- 常用内置模块（time/random/os/json/re）: unknown
- HTTP 协议与请求-响应模式: unknown
- Cookie 原理与规范: unknown
- HTML 文档结构与常用标签: unknown

## 04-session-login — Session、登入與代理

probe skipped via /nodes js-reverse/04-session-login skip-probe on 2026-09-06

### Strands

- Cookie 本质与手动处理: unknown
- Session 自动管理 Cookie: unknown
- 模拟登录流程（session.post → session.get）: unknown
- 代理机制（匿名度、协议、proxies 参数）: unknown
- 代理池与批量爬取: unknown
- 验证码识别（打码平台接入）: unknown

## 12-middleware-crawlspider — 中間件、CrawlSpider 與分散式

probe skipped via /nodes js-reverse/12-middleware-crawlspider skip-probe on 2026-09-06

### Strands

- 下载中间件位置与三个核心方法: unknown
- 代理/UA/Cookie 中间件实现: unknown
- spider 参数的数据交互机制: unknown
- Selenium 篡改响应的混合架构: unknown
- CrawlSpider rules/LinkExtractor/Rule: unknown
- 列表页 meta 传 item + 详情页补全: unknown
- scrapy-redis 分布式改造流程: unknown
- redis set 增量式去重: unknown

## 06-asyncio — asyncio 與異步爬蟲

probe skipped via /nodes js-reverse/06-asyncio skip-probe on 2026-09-06

### Strands

- 并行/并发与同步/异步概念辨析: unknown
- 协程原理与用户空间调度: unknown
- asyncio 四个核心概念（特殊函数/协程对象/任务对象/事件循环）: unknown
- wait/await 语义与多任务调度: unknown
- aiohttp 异步网络请求与代理参数: unknown
- 多任务异步爬虫实战（Flask + aiohttp + xpath）: unknown

## 07-selenium — Selenium 浏览器自动化

probe skipped via /nodes js-reverse/07-selenium skip-probe on 2026-09-06

### Strands

- Selenium 环境搭建与浏览器创建: unknown
- 元素定位与节点交互: unknown
- execute_script 与 page_source 获取动态数据: unknown
- 动作链 ActionChains 与页面等待: unknown
- 滑动验证码与打码平台登录: unknown
- 规避 Selenium 侦测（stealth.min.js）: unknown

## 08-pyppeteer — Pyppeteer 异步浏览器

probe skipped via /nodes js-reverse/08-pyppeteer skip-probe on 2026-09-06

### Strands

- Pyppeteer 定位与异步优势: unknown
- 环境安装与 Python 版本要求: unknown
- 核心 API 链路（launch/newPage/goto/content）: unknown
- asyncio 任务回调与多任务异步: unknown
- launch 参数与视口设置: unknown
- webdriver 反检测注入: unknown
- type/click 节点交互与拟人输入: unknown
- cv2 模板匹配算缺口距离: unknown
- 拟人化滑动轨迹（hover/down/move/up）: unknown

## 14-js-variables-control — JS 变数、型别与控制流

probe skipped via /nodes js-reverse/14-js-variables-control skip-probe on 2026-09-07

### Strands

- var/let/const 变量宣告与 undefined 默认值: unknown
- 运算符（==/===/短路/三目/逗号）与综合表达式求值: unknown
- 分支语句（if-else/switch-case）与穿透: unknown
- 阵列操作（push/pop/splice）与遍历（for/for-in/for-of）: unknown

## 15-js-scope-prototype — JS 函式、作用域与原型

probe skipped via /nodes js-reverse/15-js-scope-prototype skip-probe on 2026-09-07

### Strands

- 函数声明提升与 arguments 对象: unknown
- 全局变量、局部变量与 var 无块级作用域: unknown
- 全局变量污染与子作用域隔离: unknown
- IIFE 与闭包私有状态: unknown
- 原型链查找与 call/apply: unknown
- 箭头函数还原为传统函数: unknown
- window 全局变量挂载: unknown
- setInterval/setTimeout 与定时器取消: unknown

## 09-scrapy-intro — Scrapy 框架入门

probe skipped via /nodes js-reverse/09-scrapy-intro skip-probe on 2026-09-06

### Strands

- 框架概念与学习心态（先会用再谈源码）: unknown
- 安装与环境验证: unknown
- 项目创建与目录结构: unknown
- Spider 三要素（name/start_urls/parse）: unknown
- settings 三项关键配置: unknown
- response.xpath 与 extract/extract_first: unknown
- scrapy crawl 运行与日志: unknown
- 持久化存储两条路线（终端指令 vs 管道）: unknown

## 20-des-aes-cases — 实战：DES/AES 案例

probe skipped via /nodes js-reverse/20-des-aes-cases skip-probe on 2026-09-07

### Strands

- DES-ECB 解密的 JS 调用模式: unknown
- execjs 在"Python 请求 + JS 解密"混合架构中的桥梁作用: unknown
- CryptoJS DES 解密的完整 API 链: unknown
- AES-128-CBC 加密请求 + JS 解密响应的完整流程: unknown
- key/iv 对称且与 JS 端共享的逆向模式: unknown
- crypto-js AES 解密的完整 API 链: unknown

## 19-sign-execjs — 实战：sign 逆向（JS 执行）

probe skipped via /nodes js-reverse/19-sign-execjs skip-probe on 2026-09-07

### Strands

- execjs 混合路线的适用场景与动机: unknown
- JS 侧 get_sign 函数与 crypto 模块调用: unknown
- execjs.compile 与 call 调用机制: unknown
- JS 侧 AES 解密与 crypto-js createDecipheriv: unknown
- Python 调 JS 解密的完整流程: unknown

## 16-encoding-crypto — 编码与加密特征

probe skipped via /nodes js-reverse/16-encoding-crypto skip-probe on 2026-09-07

### Strands

- base64 编码原理与特征识别: unknown
- base64 变种（URL 安全型）与解码坑: unknown
- 摘要算法（md5/sha1/sha256）单向散列特征: unknown
- AES 对称加密 CBC 模式与 PKCS7 填充: unknown
- RSA 非对称加密公私钥分工与加解密流程: unknown
- JS 端 CryptoJS 与 Python 端 pycryptodome 互解: unknown

## 18-sign-python — 实战：sign 逆向（Python 原生）

probe skipped via /nodes js-reverse/18-sign-python skip-probe on 2026-09-07

### Strands

- sign 逆向的基本流程（抓包 → 定位 → 复现）: unknown
- MD5 摘要算法与 hashlib.md5 用法: unknown
- 动态时间戳 mysticTime 的生成与拼接: unknown
- 请求参数排序与 key=value 拼接规则: unknown
- Python 原生复现 vs execjs 混合路线的取舍: unknown
- 有道翻译请求结构与 pointParam 字段含义: unknown

## 23-webpack-analysis — 实战：webpack 模组化分析

probe skipped via /nodes js-reverse/23-webpack-analysis skip-probe on 2026-09-07

### Strands

- webpack 加载器自执行结构与调度函数（缓存 + 模块执行）: unknown
- 数组下标 vs 哈希 key 两种调度方式: unknown
- webpackJsonp.push 劫持与模块注册机制: unknown
- loader + mod 分离模式与本地 Node 复现流程: unknown
- 财联社 get_sign() 与 W2Yj 签名模块定位: unknown
- 沃邮箱数字模块 ID 437 与 RSA 登录加密: unknown

## 25-pdd-supplement-env — 实战：拼多多进阶补环境

probe skipped via /nodes js-reverse/25-pdd-supplement-env skip-probe on 2026-09-07

### Strands

- 最小可用补环境清单（window/document/navigator/screen/history/location）: unknown
- Node 环境指纹抹除（delete global/Buffer）: unknown
- webpack 混淆 chunk 结构与模块注册机制: unknown
- webpack JSONP loader 运行时（模块注册/缓存/按需 require）: unknown
- anti_content 生成三步固定套路（loader 初始化 → updateServerTime → dt 取值）: unknown
- execjs 联调与拼多多接口请求构造: unknown
