---
source: js逆向课件/day09
source_hash:
  - 781260e2dd4218ebb0a39313efb24ca0df35ec50dc77773ce2dc1e6bd847d5a1
  - 20f583340e07c7a70e3c6354063bb1e48a13ed842f60736f11177632230cd336
  - b4897041324b3048be7bf6cad0702b809f3af52fefe42769584a7c93632c77af
source_lines: 656
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/day09

## Overview (L1)

- **HLS 与 M3U8 流视频爬虫** — 主流视频客户端采用 Apple 的 HLS 技术：流媒体切成若干 TS 片段，由 M3U8 列表文件索引。爬取思路是先下载 M3U8 文件并解析出 TS 片段地址，再批量下载 TS 片段，最后合并成 mp4（建议用专业工具合并）。
- **M3U/M3U8 文件格式** — M3U 本质是纯文本的播放列表文件，只存储媒体地址索引而不存储音视频本身；M3U8 是 M3U 的 UTF-8 扩展格式。文件中以 `#` 开头的是 EXT 标签（如 EXTM3U、EXTINF、ENDLIST），非 `#` 行就是 TS 片段的相对地址。
- **M3U8 实战：三种下载方案** — 抓包定位 m3u8 文件后：同步 requests 逐个下载；协程 + aiohttp 异步下载（回调保存）；线程池 `multiprocessing.dummy.Pool(100)` + `pool.map` 并发下载。并发过大引发 HTTPSConnectionPool 异常时，减少并发或在 headers 加 `Connection: closed`。
- **Selenium 浏览器自动化入门** — Selenium 用代码驱动浏览器执行动作（点击、输入、执行 JS），核心价值是 `page_source` 实现"可见即可得"地拿动态加载数据。涵盖环境安装、浏览器创建、元素定位（find_element 系列 / By 对象）、节点交互（send_keys/clear/click）、execute_script 执行 JS。
- **Selenium 进阶：动作链与页面等待** — 动作链 ActionChains 处理鼠标拖曳等无特定执行对象的操作（iframe 内标签要先 `switch_to.frame`）；页面等待有强制（sleep）、显式（WebDriverWait + EC，智能轮询指定元素）、隐式（implicitly_wait 全局轮询）三种。
- **Selenium 实战：滑动验证与打码平台登录** — 滑动验证用 OpenCV `cv2.matchTemplate` 匹配背景图与缺口图算出距离（注意像素单位换算），再模拟按住拖动；京东登录失败原因是未模拟人的行为且被检测出 selenium。B 站点选验证码走打码平台（图鉴 base64 API）返回坐标后用 ActionChains 点击。
- **Selenium 规避检测（重点）** — 正常浏览器 `window.navigator.webdriver` 为 undefined/false，selenium 下为 true。解法是在打开页面前注入 stealth.min.js：`execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {"source": js})`。

## Sections (L2)

### HLS技术介绍

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/m3u8.md#HLS技术介绍]]`
- Summary: 介绍 Apple 开发的 HTTP Live Streaming（HLS）技术：流媒体切分为若干 TS 片段（如几秒一段），由 M3U8 列表文件组织，客户端播放器批量下载实现流式播放。
- Key claims: 大部分视频客户端采用 HLS 而非直接播放 MP4；HLS 将流媒体切分为若干 TS 片段；M3U8 列表文件将 TS 片段批量索引；爬取 HLS 流媒体的通用思路：先下载 M3U8 文件并分析内容，再批量下载其中定义的 TS 片段，最后组合成 mp4 或直接保存 TS 片段。
- Learner-relevant: 掌握视频爬虫的标准三步套路（m3u8 → ts 列表 → 下载合并），遇到任何 HLS 视频站都有下手路径。

### M3U8文件详解

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/m3u8.md#M3U8文件详解]]`
- Summary: 讲清 M3U 与 M3U8 的格式本质：它们不是音视频文件，而是纯文本的播放列表/索引文件，播放软件按其中记录的地址去在线播放被指向的媒体。
- Key claims: M3U 本质是音视频文件的列表文件，是纯文本；播放软件不播放 M3U 本身，而是根据其记录找到媒体网络地址在线播放；M3U8 是 M3U 的扩展格式（高级 M3U，也属于 M3U）；M3U8 文件中以 `#` 开头的行是 EXT 标签（EXTM3U 头、EXT-X-VERSION、EXTINF 时长、EXT-X-ENDLIST 结束标记等）；非 `#` 开头的行是 TS 片段地址（如相对路径 `/20230512/.../YZefAiEF.ts`）；任何一个 ts 文件都是一小段可独立播放的视频，视频爬虫的目标就是把它们全部爬下来。
- Learner-relevant: 能读懂一份真实 M3U8 文件的结构，知道解析规则就是"跳过 # 行、拼接非 # 行的 ts 地址"。

### 实战

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/m3u8.md#实战]]`
- Summary: 以 mjtt5.tv 为例完整实战：进入播放页、定位 ts 数据包找 url 规律、抓包全局搜索 m3u8、解析出 ts 链接，并给出同步、协程、线程池三套下载代码。
- Key claims: 操作流程：进播放页 → 点播放定位 ts 数据包提取 url 规律 → 抓包刷新全局搜索 m3u8 → 解析 m3u8 提取 ts 链接；解析方法：按行 split，非 `#` 开头的行即 ts 地址，需拼上 m3u8 所在目录前缀；同步方案用 requests 逐个 `.content` 下载保存为 ts 文件；协程方案：requests 取 m3u8 文本 + aiohttp 异步请求各 ts（`read()` 取二进制），任务回调 `save_ts_data` 保存；ts 合并最好用网上专业工具，手动合并经常出问题；协程要点：一个 url 列表配一个 loop，两个资源列表需要两个 loop 时千万别嵌套 loop，特殊方式是开两个线程各封装一个 loop；线程池方案：`multiprocessing.dummy.Pool(100)` + `pool.map(get_request, ts_url_list)`；HTTPSConnectionPool 异常原因是并发量太大，解法是减少并发或在 headers 加 `Connection: closed`。
- Learner-relevant: 能对任意 m3u8 视频站落地三种下载方案之一，并能排查高并发下的连接池异常。

### 简介

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#简介]]`
- Summary: Selenium 是浏览器自动化工具：用代码制定一系列行为动作，执行代码时动作同步触发在浏览器中；本课重点是 page_source 实现可见即可得与验证码模拟登录。
- Key claims: 自动化指通过代码形式制定行为动作并同步触发到浏览器；两大重点：page_source 实现可见即可得、验证码的模拟登录。
- Learner-relevant: 明确 Selenium 在爬虫中的定位——解决 requests 拿不到的动态渲染与登录场景。

### 环境安装

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#环境安装]]`
- Summary: 安装两步：pip install selenium，再下载与浏览器匹配的 chromedriver 驱动。
- Key claims: `pip install selenium`；驱动下载地址为 chromedriver.storage.googleapis.com；win64 系统选 win32 驱动即可；驱动版本要与本机 Chrome 匹配。
- Learner-relevant: 能独立配好 selenium + chromedriver 运行环境，注意驱动与浏览器版本对应。

### 效果展示

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#效果展示]]`
- Summary: 一个百度示例串起完整自动化流程：打开页面、点击设置、改每页条数、处理 alert 弹窗、输入搜索、点击结果、关闭浏览器。
- Key claims: `webdriver.Chrome(executable_path='./chromedriver')` 创建浏览器；`find_element(By.XPATH, ...)` / `By.LINK_TEXT` / `By.ID` 定位元素并 `.click()`；`switch_to.alert.accept()` 处理警告框（accept 确定 / dismiss 取消）；`send_keys()` 输入文字；`driver.quit()` 关闭浏览器；每步之间用 sleep 保证加载。
- Learner-relevant: 第一次见到"代码驱动浏览器"的完整闭环，可照抄改造为自己的自动化脚本。

### 浏览器创建

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#浏览器创建]]`
- Summary: Selenium 支持多种浏览器与无界面浏览器，直接实例化对应 webdriver 类即可。
- Key claims: 支持 Chrome、Firefox、Edge、Safari 及无界面的 PhantomJS；分别用 `webdriver.Chrome()` / `webdriver.Firefox()` / `webdriver.Edge()` / `webdriver.PhantomJS()` / `webdriver.Safari()` 创建。
- Learner-relevant: 知道 webdriver 家族不止 Chrome，可按目标站点与环境切换浏览器。

### 元素定位

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#元素定位]]`
- Summary: webdriver 提供一系列元素定位方法：既可直接用 find_element_by_xxx 系列，也可用 By 对象统一风格定位。
- Key claims: 单元素方法有 by_id / by_name / by_class_name / by_tag_name / by_link_text / by_xpath / by_css_selector；推荐统一写法 `driver.find_element(By.xxx, value)` 返回定位到的标签；`find_elements`（复数）返回定位到的标签列表。
- Learner-relevant: 记住 7 种定位方式与 By 统一写法，任意页面元素都能找到下手入口。

### 节点交互

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#节点交互]]`
- Summary: 定位到节点后可驱动浏览器模拟操作：send_keys 输入文字、clear 清空、click 点击。
- Key claims: `send_keys()` 输入文字；`clear()` 清空文字；`click()` 点击按钮；这三个是最常见的节点交互方法。
- Learner-relevant: 组合"定位 + 交互"即可完成搜索框输入、按钮点击等绝大多数页面操作。

### 执行js

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#执行js]]`
- Summary: Selenium API 未覆盖的操作（如滚动进度条）可用 execute_script 直接注入执行 JavaScript。
- Key claims: `execute_script()` 可直接模拟运行 JavaScript；典型例子 `document.documentElement.scrollTo(0,2000)` 实现页面向下滚动；滚动是触发动态加载（懒加载）数据的常用手段。
- Learner-relevant: 掌握 JS 注入这个万能后门，API 没有的浏览器行为都能补齐。

### 获取页面源码数据(重要)

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#获取页面源码数据(重要)]]`
- Summary: 通过 `page_source` 属性拿到浏览器当前渲染后的网页源代码，之后用正则、BeautifulSoup、pyquery、lxml 等解析库提取信息。
- Key claims: `page_source` 返回的是渲染后的动态页面源码，不是原始 HTML；拿到后可交给任意解析库（正则 / BS4 / pyquery / etree）提取数据。
- Learner-relevant: 这是 Selenium 爬虫的核心产出点——"可见即可得"，动态加载的数据也逃不出 xpath。

### 获取动态加载数据

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#获取动态加载数据]]`
- Summary: 用 execute_script 滚动 + page_source 实现可见即可得，示例爬取豆瓣电影分类页中动态加载的电影详情。
- Key claims: 滚动 `document.documentElement.scrollTo(0,2000)` 触发懒加载；滚动后 `page_source` 拿到含动态数据的源码；再用 lxml xpath 解析出电影名；这就是"可见即可得"的实现范式：滚动 → 取源码 → 解析。
- Learner-relevant: 面对无接口可抓的懒加载页面，有一套保底的抓取方案。

### 动作链

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#动作链]]`
- Summary: 输入、点击是针对具体节点的交互；鼠标拖曳、键盘按键等无特定对象的动作用动作链 ActionChains 执行，示例完成 iframe 中的拖曳方块。
- Key claims: `ActionChains(bro)` 实例化动作链并绑定浏览器；`click_and_hold(tag)` 点击并长按；`move_by_offset(x,y).perform()` 移动并立即执行（perform 让动作链生效）；定位 iframe 子页面内的标签会报错，必须先 `bro.switch_to.frame('iframeResult')` 切入再定位。
- Learner-relevant: 记住 iframe 是定位失败的常见原因，动作链是滑动验证码等交互场景的基础。

### 页面等待

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#页面等待]]`
- Summary: 动态 HTML 页面元素出现时间不确定，需设置等待；有强制、显式、隐式三种等待方式。
- Key claims: 强制等待 `time.sleep(n)` 阻塞固定秒数；显式等待（智能等待）`WebDriverWait(chrome, 10, 0.5)` + `EC.presence_of_element_located((By.ID, ...))` 针对指定元素轮询（默认每 0.5s），找到即返回、超时抛异常，原理是 while 循环不停尝试，是最灵活的方式；隐式等待 `driver.implicitly_wait(10)` 对全局生效，n 秒内不断循环找元素，超时报错。
- Learner-relevant: 能按场景选等待策略：调试用 sleep、关键元素用显式、全局兜底用隐式。

### 滑动验证

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#滑动验证]]`
- Summary: 京东登录滑动验证完整案例：保存背景图与缺口图，OpenCV 模板匹配算出滑动距离，ActionChains 按住拖动释放。
- Key claims: `cv2.matchTemplate(background, gap, cv2.TM_CCOEFF_NORMED)` + `cv2.minMaxLoc` 得到缺口 x 坐标；必须做像素单位换算（`value * 278 / 360`，图片显示尺寸与原图尺寸不一致）；取图：`get_attribute("src")` 拿到大小图地址后 `urlretrieve` 保存；拖动三步：click_and_hold 按住 → move_by_offset 移动 → release 释放；验证不通过的两个原因：没有模拟人的行为动作、被检测出是 selenium。
- Learner-relevant: 掌握 opencv 缺口识别 + 动作链拖动的滑动验证通用解法，也理解为什么它常失败（行为轨迹不像人）。

### 带验证码的模拟登录

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#带验证码的模拟登录]]`
- Summary: B 站登录案例：填表点击后，对验证码对话框截图，交给图鉴打码平台识别出点选坐标，再用 ActionChains 逐个点击并确认。
- Key claims: 打码平台（图鉴 ttshitsu）走 base64 接口：图片 b64 编码 + typeid 类型编号 POST 到 `/predict`，返回识别结果；typeid 覆盖数英混合、计算题、汉字、坐标点选、缺口识别、拼图等类型（点选 1~4 坐标是 27）；验证码框截图用 `code_tag.screenshot('./code.png')`；结果形如 `154,251|145,167`，split 后逐坐标 `move_to_element_with_offset(code_tag, x, y).click().perform()`；开发者工具里可能定位到多个验证码 div，需要都定位到逐一尝试；最后点 `geetest_commit` 确认。
- Learner-relevant: 学会用打码平台这种工程化方案处理各类验证码，而非自己训练识别模型。

### 规避检测（重要）

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day09/selenium.md#规避检测（重要）]]`
- Summary: 大网站会检测 `window.navigator.webdriver`（正常为 undefined/false，selenium 下为 true）；解法是打开页面前注入 stealth.min.js。
- Key claims: 检测原理：正常浏览器 `window.navigator.webdriver` 为 undefined/false，selenium 驱动时为 true；解法：读取本地 stealth.min.js 文件内容；用 `execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {"source": js})` 让 Selenium 在打开任何页面之前先执行该 JS；execute_cdp_cmd 即执行 CDP（Chrome DevTools Protocol）命令，等价于在开发者工具中执行指令。
- Learner-relevant: 这是过反爬检测的关键一招，配合 stealth.min.js 让自动化浏览器指纹接近真人。
