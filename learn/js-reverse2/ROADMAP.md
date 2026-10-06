---
subject: js-reverse2
status: draft # draft → confirmed
path: systems-first
created: 2026-10-05
---

# ROADMAP — js-reverse2

## Goal

建立完整爬蟲＋反爬的知識體系，最終能獨立面對工作上的目標網站：從抓取、反爬對抗到逆向加密參數（sign / token / 加密 body），理解保護手法後用 Python 穩定重現並爬取資料。廣度優先，但每一塊都要能真的用出來。具體目標網站之後提供。

文章以 zh-Hant（台灣繁體）撰寫，技術名詞保留英文；每個手法都對一個真站／demo 跑一次，並回答「什麼時候用、什麼時候不適用」。

## Learning path

**systems-first（系統全貌優先）。** 先建立「抓取 → 反爬 → 逆向」的整體地圖，講清楚各階段如何相扣，再逐塊往下鑽；優化目標是「知道每一塊自己在哪、何時該用」，適合想先看大圖、以真實案例拆解為主的學習者。分層順序：

- **Tier 1 — 全局心智模型**：Web/HTTP/HTML 是運作對象；爬蟲、反爬與逆向的整張地圖與病根（模擬瀏覽器不足）。
- **Tier 2 — 一般抓取能力**：requests、XPath 解析、會話與代理／驗證碼、併發模型、非同步、瀏覽器自動化、m3u8。
- **Tier 3 — 框架化爬取**：Scrapy 專案、持久化管道、深度爬取與中介軟體、CrawlSpider／分散式／增量。
- **Tier 4 — JS 語言地基**：JS 核心語法、作用域與閉包、原型鏈與 this、window／Promise，作為逆向的語言前提。
- **Tier 5 — 編碼與密碼學**：URL／Base64／摘要、對稱與非對稱加密、國密。
- **Tier 6 — 逆向方法論與工具**：DevTools 定位入口、Hook／Proxy 攔截、Node／execjs、補環境、webpack 拆解。
- **Tier 7 — 真實案例**：依演算法家族分組（簽名／雜湊、對稱、非對稱、webpack、動態 cookie）。
- **Tier 8 — 進階保護**：JSVMP 虛擬機保護概念與元寶實戰還原。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 全局心智模型

1. **[[learn/js-reverse2/nodes/web-http-html-basics|Web、HTTP 與 HTML：爬蟲在跟什麼打交道]]**
   - Goal: 讀得懂一個原始 HTTP request/response（方法、標頭、狀態碼），說得出 Cookie 為何能維持狀態，並認得爬蟲之後要解析的 HTML 標籤。
   - Sources:
     - [[sources/js-reverse2/20261005/day01/http协议相关.md#http协议相关]]
     - [[sources/js-reverse2/20261005/day03/前端.md#前端]]
     - [[sources/js-reverse2/20261005/day01/test.html]]

2. **[[learn/js-reverse2/nodes/crawler-anticrawl-map|爬蟲、反爬與逆向的全貌]]**
   - Goal: 畫出「抓取 → 反爬 → 逆向」的整體地圖，說明爬蟲分類、合法性／robots、四步流程，並解釋「抓不到資料＝模擬瀏覽器不足」這個病根。
   - Sources:
     - [[sources/js-reverse2/20261005/day04/requests基础.md#requests基础]]
     - [[sources/js-reverse2/20261005/JS逆向/day02/课堂笔记/02 初识爬虫[UA检测 乱码 动态数据以及图片数据爬取].md#爬虫初始]]
     - [[sources/js-reverse2/20261005/day06/requests高级.md#requests高级]]

### Tier 2 — 一般抓取能力

3. **[[learn/js-reverse2/nodes/requests-basics|requests 入門與動態資料定位]]**
   - Goal: 用 `requests` 抓 HTML/JSON/圖片，修正編碼、偽裝 UA，並從封包分析定位動態（XHR）資料的 URL 與參數。
   - Sources:
     - [[sources/js-reverse2/20261005/day04/requests基础.md#requests基础]]
     - [[sources/js-reverse2/20261005/JS逆向/day02/课堂笔记/02 初识爬虫[UA检测 乱码 动态数据以及图片数据爬取].md#爬虫初始]]

4. **[[learn/js-reverse2/nodes/xpath-parsing|XPath 與資料解析]]**
   - Goal: 用 lxml/XPath 精準取出想要的欄位，並破解防盜鏈（Referer）與圖片懶載入（`data-original`）。
   - Sources:
     - [[sources/js-reverse2/20261005/day05/数据解析.md#数据解析]]
     - [[sources/js-reverse2/20261005/JS逆向/day03/资料/课堂笔记/03 xpath数据分析以及实战案例.md#数据解析]]
     - [[sources/js-reverse2/20261005/day05/test.html]]

5. **[[learn/js-reverse2/nodes/cookie-session-login-proxy|會話維持：Cookie、登入、代理與驗證碼]]**
   - Goal: 用 `Session` 維持登入、正確帶 Cookie，並用代理池與驗證碼辨識突破頻率與人機限制，判斷何時該用哪一招。
   - Sources:
     - [[sources/js-reverse2/20261005/day06/requests高级.md#requests高级]]
     - [[sources/js-reverse2/20261005/JS逆向/day04/课堂笔记/04 爬虫进阶之防盗链以及代理IP.md#防盗链]]

6. **[[learn/js-reverse2/nodes/concurrency-model|行程、執行緒與協程：併發為何存在]]**
   - Goal: 用單核排程說明併發／平行、同步／非同步，並選對 Process／Thread／Pool／協程來加速 IO 密集的爬取。
   - Sources:
     - [[sources/js-reverse2/20261005/day07/并发编程.md#并发编程]]

7. **[[learn/js-reverse2/nodes/async-crawler|asyncio 與 aiohttp 非同步爬蟲]]**
   - Goal: 寫出多任務非同步爬蟲，說清楚 `await` 該放哪，以及哪些同步模組會破壞非同步效果。
   - Sources:
     - [[sources/js-reverse2/20261005/day08/异步爬虫.md#异步爬虫]]

8. **[[learn/js-reverse2/nodes/browser-automation|瀏覽器自動化與動態渲染]]**
   - Goal: 用 Selenium／Pyppeteer／DrissionPage 處理 JS 渲染與登入，正確設定等待，並隱藏 `navigator.webdriver` 指紋。
   - Sources:
     - [[sources/js-reverse2/20261005/day09/selenium.md#selenium]]
     - [[sources/js-reverse2/20261005/day10/Pyppeteer.md#pyppeteer简介]]
     - [[sources/js-reverse2/20261005/JS逆向/day10/课堂笔记/详细教程.md]]
     - [[sources/js-reverse2/20261005/day09/stealth.min.js]]

9. **[[learn/js-reverse2/nodes/m3u8-hls|M3U8/HLS 串流下載]]**
   - Goal: 解析 M3U8 播放清單、下載並合併 TS 分片，並說出高併發下載時的踩雷與替代寫法。
   - Sources:
     - [[sources/js-reverse2/20261005/day09/m3u8.md#m3u8]]

### Tier 3 — 框架化爬取

10. **[[learn/js-reverse2/nodes/scrapy-basics|Scrapy 入門與框架心智模型]]**
    - Goal: 說出 Scrapy 五大組件與資料流，建立可跑的專案並用 `parse`＋XPath 抓一個站。
    - Sources:
      - [[sources/js-reverse2/20261005/day10/scrapy介绍+环境安装.md#简介]]
      - [[sources/js-reverse2/20261005/day11/1.scrapy基础01.md#简介]]
      - [[sources/js-reverse2/20261005/day11/2.scrapy操作02.md]]

11. **[[learn/js-reverse2/nodes/scrapy-pipelines|Scrapy 持久化與內建管道]]**
    - Goal: 用 Item/Pipeline 把資料寫進檔案／MySQL／Redis，並用 ImagesPipeline／FilesPipeline 批次下載媒體。
    - Sources:
      - [[sources/js-reverse2/20261005/day11/1.scrapy基础01.md#简介]]
      - [[sources/js-reverse2/20261005/day12/1.内置管道.md#scrapy内置管道]]

12. **[[learn/js-reverse2/nodes/scrapy-advanced|Scrapy 深度爬取、中介軟體與分散式]]**
    - Goal: 用 `meta` 串接列表→詳情、寫下載器中介軟體換標頭／代理／Cookie，並用 CrawlSpider 與 scrapy-redis 做全站與分散式、增量爬取。
    - Sources:
      - [[sources/js-reverse2/20261005/day12/2.scrapy深度爬取.md#scrapy深度爬取]]
      - [[sources/js-reverse2/20261005/day13/scrapy操作.md#scrapy的核心组件]]
      - [[sources/js-reverse2/20261005/day14/scrapy进阶操作.md#crawlspider]]

### Tier 4 — JS 語言地基

13. **[[learn/js-reverse2/nodes/js-core|JS 語言核心：型別、運算子與函式]]**
    - Goal: 讀懂混淆前的 JS 基本語法（型別轉換、`==`/`===`、字串/陣列/高階函式），建立後續判讀的詞彙。
    - Sources:
      - [[sources/js-reverse2/20261005/JS逆向/day05/课堂笔记/1.Javascript入门.md]]
      - [[sources/js-reverse2/20261005/Day16/03 变量.js]]
      - [[sources/js-reverse2/20261005/Day16/05 运算符.js]]
      - [[sources/js-reverse2/20261005/Day17/03 字符串.js]]
      - [[sources/js-reverse2/20261005/Day17/05 高阶函数.js]]

14. **[[learn/js-reverse2/nodes/js-scope-closures|JS 作用域、提升與閉包]]**
    - Goal: 解釋 `var` 提升與 `let`/`const` 差異、IIFE 沙箱與閉包私有狀態，認出打包腳本的公開入口。
    - Sources:
      - [[sources/js-reverse2/20261005/Day18/02 JS的作用域.js]]
      - [[sources/js-reverse2/20261005/Day18/03 匿名函数.js]]
      - [[sources/js-reverse2/20261005/Day18/06 闭包.html]]
      - [[sources/js-reverse2/20261005/JS逆向/day06/课堂笔记/2.Javascript高级.md]]

15. **[[learn/js-reverse2/nodes/js-prototype-this|JS 原型鏈、this 與 call/apply]]**
    - Goal: 沿原型鏈找出方法／屬性在哪，並解釋 `this` 綁定與 `call/apply`，看懂混淆碼用計算鍵呼叫方法的手法。
    - Sources:
      - [[sources/js-reverse2/20261005/Day19/01 原型对象（prototype）.js]]
      - [[sources/js-reverse2/20261005/Day19/02 call方法和apply方法.js]]
      - [[sources/js-reverse2/20261005/Day19/03 箭头函数.js]]

16. **[[learn/js-reverse2/nodes/js-async-promise|JS 視窗、計時器與 Promise]]**
    - Goal: 說明 `window`/`globalThis`、計時器、DOM/Ajax 與 `eval`，並讀懂 Promise 鏈如何串起非同步的簽名流程。
    - Sources:
      - [[sources/js-reverse2/20261005/Day19/04 window全局变量.html]]
      - [[sources/js-reverse2/20261005/Day19/05 定时器.js]]
      - [[sources/js-reverse2/20261005/Day28/02 promise语法.html]]
      - [[sources/js-reverse2/20261005/Day28/03 promise的链式操作.html]]
      - [[sources/js-reverse2/20261005/Day28/04 promise的应用.html]]

### Tier 5 — 編碼與密碼學

17. **[[learn/js-reverse2/nodes/encoding-base64-digest|編碼與摘要：URL、Base64、MD5/SHA]]**
    - Goal: 依長度／字母表辨識 Base64（含 URL-safe 與圖片 Data URI）與雜湊（MD5/SHA），並用 Python 重現驗證。
    - Sources:
      - [[sources/js-reverse2/20261005/Day20/01 url编码.py#L1-L16]]
      - [[sources/js-reverse2/20261005/Day20/02   base64编码.py#L1-L21]]
      - [[sources/js-reverse2/20261005/Day20/04 base64变种.py#L1-L7]]
      - [[sources/js-reverse2/20261005/Day20/06 摘要算法.py#L1-L28]]
      - [[sources/js-reverse2/20261005/JS逆向/day07/课上代码/01 base64.py#L1-L57]]

18. **[[learn/js-reverse2/nodes/symmetric-asymmetric-crypto|對稱與非對稱加密：AES/DES、RSA、國密]]**
    - Goal: 從 JS 還原 key/IV/mode/padding，在 Python 重現 AES/DES 與 RSA，並認得國密 SM3/SM4 與 crypto-js/jsencrypt 的特徵。
    - Sources:
      - [[sources/js-reverse2/20261005/JS逆向/day07/课堂笔记/3.加密算法 - 副本.md#L292-L431]]
      - [[sources/js-reverse2/20261005/JS逆向/day07/课上代码/03 AES加密解密.py#L1-L37]]
      - [[sources/js-reverse2/20261005/JS逆向/day07/课上代码/02 加密.js#L1-L31]]
      - [[sources/js-reverse2/20261005/JS逆向/day07/课堂笔记/3.加密算法 - 副本.md#L432-L551]]
      - [[sources/js-reverse2/20261005/JS逆向/Day15-Day16：逆向核心案例解析3/02 sichuan.js]]

### Tier 6 — 逆向方法論與工具

19. **[[learn/js-reverse2/nodes/devtools-trace|DevTools：斷點、請求堆疊與呼叫堆疊]]**
   - Goal: 給定一個加密參數，用請求堆疊／關鍵字搜尋定位入口，設對斷點並讀呼叫堆疊追回產生它的函式。
   - Sources:
     - [[sources/js-reverse2/20261005/Day22/01 断点和请求堆栈.html]]
     - [[sources/js-reverse2/20261005/Day22/02 关于逆向爬虫的技巧]]
     - [[sources/js-reverse2/20261005/Day22/03 有道翻译.py]]
     - [[sources/js-reverse2/20261005/Day21/10 JS的断点.js]]

20. **[[learn/js-reverse2/nodes/hook-proxy|Hook 與 Proxy 攔截]]**
   - Goal: 用 hook 攔截函式／屬性輸入輸出（含原生 API），並用 Proxy 記錄未定義屬性的讀取，同時繞過 `toString` 偵測。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/day09/课堂笔记/js进阶02.md]]
     - [[sources/js-reverse2/20261005/JS逆向/day09/课上代码/01 hook.js]]
     - [[sources/js-reverse2/20261005/JS逆向/day09/课上代码/02 proxy代理.js]]

21. **[[learn/js-reverse2/nodes/node-execjs|Node 執行、execjs 與 JS 前置知識]]**
   - Goal: 把瀏覽器 JS 搬到 Node 執行、用 execjs 從 Python 呼叫，並掌握 descriptor／原型等讀暫停頁面所需的語言知識。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/day08/课堂笔记/js进阶01.md]]
     - [[sources/js-reverse2/20261005/JS逆向/day08/课上代码/03 js前置知识点.js]]
     - [[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/01 node.js理解.js]]
     - [[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/02 前端常见对象.js]]

22. **[[learn/js-reverse2/nodes/env-supplement|補環境與環境檢測]]**
   - Goal: 用 Proxy 監測缺口、補上八個前端物件與 `toString` 標籤，通過「是不是瀏覽器／是不是 Node」檢測，並理解瑞數 cookie 流程。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/JS逆向补环境文档/逆向爬虫之补环境.md]]
     - [[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/01 env.js]]
     - [[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/03 环境检测Demo.js]]
     - [[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/05 Proxy语法.js]]

23. **[[learn/js-reverse2/nodes/webpack-loader|webpack 拆解與模組定位]]**
   - Goal: 判斷 bundle 型態（陣列／物件／多檔 JSONP）、暴露 `require` 函式、以模組 id 記錄定位並呼叫簽名模組。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/01 基于数组的webpack.js]]
     - [[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/02 基于对象的webpack.js]]
     - [[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/03 多文件的webpack.js]]
     - [[sources/js-reverse2/20261005/Day27/01 webpack加载器loader.js]]

### Tier 7 — 真實案例

24. **[[learn/js-reverse2/nodes/cases-sign-hash|案例：簽名與雜湊演算法]]**
   - Goal: 辨識並重現各類簽名配方（排序拼接＋salt→MD5、固定順序＋secret→MD5/SHA1、自家 hash），在 Python 與 execjs 兩路都跑通。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/06 福建电子交易平台之请求加密2.py#14]]
     - [[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/04 xdf.py#18]]
     - [[sources/js-reverse2/20261005/Day23/01 基于Py逆向的有道翻译.py#5]]
     - [[sources/js-reverse2/20261005/Day25/01 丁香网.py#47]]
     - [[sources/js-reverse2/20261005/Day26/03 百度翻译.py]]
     - [[sources/js-reverse2/20261005/Day27/05 财联社的loader.js]]

25. **[[learn/js-reverse2/nodes/cases-symmetric-body|案例：對稱與串流加解密]]**
   - Goal: 從響應／請求中的 base64 還原對稱加解密（AES/DES/SM4/RC4，含 padding 與 key==iv），並處理 URL-safe、加引號等傳輸變體。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/03 caizhaowang.py#38]]
     - [[sources/js-reverse2/20261005/Day24/01 招标网.py#37]]
     - [[sources/js-reverse2/20261005/Day24/03 毛毛租.py#34]]
     - [[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/02 福建电子交易平台之响应解密.py#1]]
     - [[sources/js-reverse2/20261005/Day23/05 基于Py逆向的有道翻译的解密.py#75]]
     - [[sources/js-reverse2/20261005/Day26/07 极简壁纸.py]]

26. **[[learn/js-reverse2/nodes/cases-asymmetric|案例：非對稱（RSA）]]**
   - Goal: 從 bundle 取出公鑰／私鑰 PEM 與演算法參數，重現 RSA 加密與 RSA-SHA256 簽章，並判斷「私鑰在前端」的失效模式。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/Day15-Day16：逆向核心案例解析3/03 理财网.py]]
     - [[sources/js-reverse2/20261005/Day27/02  外贸电商平台的loader.js]]
     - [[sources/js-reverse2/20261005/Day27/09 沃邮箱的loader.js]]

27. **[[learn/js-reverse2/nodes/cases-webpack|案例：webpack 打包站實戰]]**
   - Goal: 對真實 webpack 站台載入 loader＋module、補環境、印模組 id，定位並呼叫簽名／加解密入口。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/四川补贴-webpack版本/01 loader.js]]
     - [[sources/js-reverse2/20261005/Day27/05 财联社的loader.js]]
     - [[sources/js-reverse2/20261005/Day27/09 沃邮箱的loader.js]]
     - [[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/07 aerfa.js]]

28. **[[learn/js-reverse2/nodes/cases-dynamic-cookie|案例：動態 cookie 與風控]]**
   - Goal: 跑通「抓動態輸入→注入→執行 JS→取得 cookie/anti_content→帶資料重放」的完整迴圈，並定位 VM/TS 腳本的入口。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/欧冶最终版/ouyeel.py]]
     - [[sources/js-reverse2/20261005/Day29/pdd.py]]
     - [[sources/js-reverse2/20261005/Day29/05 pdd.js]]

### Tier 8 — 進階保護

29. **[[learn/js-reverse2/nodes/jsvmp-concept|JSVMP 虛擬機保護概念]]**
   - Goal: 說明「指令集加密＋執行期資料」的 VMP 心智模型、bytecode→decoder→switch VM 流程，以及 C 版實作與 IDA 破解路徑。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/Day23：逆向高阶案例1/JSVMP 虚拟机保护技术教程.md]]
     - [[sources/js-reverse2/20261005/JS逆向/Day23：逆向高阶案例1/JSVMP 虚拟机保护技术教程2.md]]

30. **[[learn/js-reverse2/nodes/jsvmp-yuanbao|案例：元寶 JSVMP 還原]]**
   - Goal: 用 dispatch trace 重建 VM 語意，還原 RC4＋salt＋自訂 base64 的簽名鏈，並對照捕獲 token 驗證重建。
   - Sources:
     - [[sources/js-reverse2/20261005/JS逆向/Day24：逆向高阶案例2/资料/分析过程.txt]]
     - [[sources/js-reverse2/20261005/JS逆向/day25/yuanbao.js]]
     - [[sources/js-reverse2/20261005/JS逆向/Day24：逆向高阶案例2/资料/log2.txt]]
     - [[sources/js-reverse2/20261005/JS逆向/day25/logs (2).txt]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
