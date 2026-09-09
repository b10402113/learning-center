---
source: js逆向课件/day03
source_lines: 1032
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/day03

## Overview (L1)

- **包与模块（复习）**（6.包与模块.md）— 与 day02 的《6.包与模块》几乎逐字相同的复习课件：模块三种来源与 import 即执行、`__name__` 入口判断、包与 `__init__`、常见模块 time/random/os、json 序列化、re 正则；唯一实质差异是正则案例改用分组 `<hTml>(.*)</HtMl>` 提取标签内文本。
- **Web 基本概念与 HTTP 协议**（前端.md 第1章）— 两种软件开发架构 C/S 与 B/S；HTTP 是传输超文本的协议，特性为请求-响应模式与无状态；拆解请求报文（请求头/请求体、GET vs POST）与响应报文（响应头/响应体/状态码）。
- **Cookie**（前端.md 1.2）— HTTP 无状态催生了 cookie：服务器创建、浏览器存储的键值对；工作流程为首次访问→服务器下发→浏览器保存→再次访问自动携带；规范上限 4KB/单服务器 20 个/单浏览器 300 个，且不同浏览器不共享。
- **HTML 基础**（前端.md 第2章）— HTML 是描述性标记语言而非编程语言，浏览器下载文档后本地渲染；文档骨架（DOCTYPE/html/head/body）、标签语法与常用标签（标题/段落/格式化/块级 vs 内联/超链接/图片/列表/表格）；重点是表单标签（form/input 控件/文件上传）与多媒体标签。

## Sections (L2)

### 模块介绍

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#模块介绍]]`
- Summary: 复习模块概念：为编写可维护代码把函数分组放到不同文件，一个 py 文件就是一个模块（与 day02 同名课件一致）。
- Key claims: 模块分三种：解释器内建、第三方、应用程序自定义; 模块提高代码可读性与可维护性，并避免函数名/变量名冲突
- Learner-relevant: 巩固 import 的对象是什么、为什么要拆模块。

### 模块导入

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#模块导入]]`
- Summary: 复习 import / from-import 各种写法与"导入即执行"行为，沿用 cal.py、logger.py、main.py 三文件案例。
- Key claims: `import 模块名`、`import 模块名 as 别名`、`from 模块名 import 成员/*`; 导入模块会执行其顶层代码，多次导入只执行一次; 执行源文件名不要与模块名同名
- Learner-relevant: 熟练读懂项目中各种 import 形式。

### __name__

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#__name__]]`
- Summary: 复习内置变量 `__name__`：被导入模块打印各自模块名，入口执行文件打印 `__main__`。
- Key claims: `__name__=="__main__"` 用于声明程序入口; 也可对导入的模块做功能测试
- Learner-relevant: 分清入口文件与被导入模块的行为差异。

### 什么是包

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#什么是包]]`
- Summary: 复习包的概念：比模块更高级的组织方式，即包含 `__init__` 文件的文件夹。
- Key claims: 包是对相关功能 py 文件的组织方式; 模块越来越多、维护效率下降时引入包
- Learner-relevant: 理解第三方库目录里 `__init__.py` 的作用。

### 导入包的语法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#导入包的语法]]`
- Summary: 复习三种导入包的语法，m_log 包 + logger.py 模块案例演示。
- Key claims: `import 包名[.模块名 [as 别名]]`; `from 包名 import 模块名 [as 别名]`; `from 包名.模块名 import 成员名 [as 别名]`
- Learner-relevant: 熟练使用包级导入。

### time模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#time模块]]`
- Summary: 复习 time 模块：时间戳、格式化时间字符串、sleep 暂停与计时案例。
- Key claims: time.time() 时间戳可算程序耗时; strftime('%Y-%m-%d %X') 格式化人可读时间; sleep(n) 暂停 n 秒
- Learner-relevant: 时间戳参数与耗时测量的日常操作。

### random模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#random模块]]`
- Summary: 复习 random 常用随机函数（了解级别）。
- Key claims: random/randint/randonrange/uniform 生成随机数; choice/sample 从序列取样; shuffle 原地打乱列表
- Learner-relevant: 随机延迟、随机取样等脚本技巧。

### os模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#os模块]]`
- Summary: 复习 os 与 os.path 常用接口（了解级别）。
- Key claims: 目录/文件操作（makedirs、listdir、remove、rename 等）; os.path.exists/isfile/isdir/join/abspath/getsize 高频路径工具; os.system 运行 shell 命令
- Learner-relevant: 文件系统日常操作速查。

### 序列化模块：json

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#序列化模块：json]]`
- Summary: 复习 json 序列化/反序列化与 dumps/loads/dump/load 四方法（重点）。
- Key claims: dumps 将字典转 json 字符串、loads 反之; dump/load 直接配合文件句柄做持久化读写
- Learner-relevant: 接口 json 数据解析的核心技能。

### 正则模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/6.包与模块.md#正则模块]]`
- Summary: 复习正则常用语法与 re.findall 用法；与 day02 版本的差异在于提取标签内容的案例改用分组捕获 `<hTml>(.*)</HtMl>`，findall 直接返回分组内（标签之间）的文本。
- Key claims: 单字符 `.`/`\d`/`[]`、数量 `*`/`+`/`?`/`{m,n}`、边界 `^`/`$`、分组 `()`; `.*` 贪婪、`.*?` 非贪婪; re.findall 返回匹配内容列表，加分组后返回分组捕获内容; 练习含提取数字、https?://、分组提取标签文本、非贪婪 `h.*?\.`、`sa{1,2}s`、手机号
- Learner-relevant: 用分组精确提取目标片段（如标签内文本），爬虫取数的核心手法。

### 软件开发的架构

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#软件开发的架构]]`
- Summary: 把常见应用分为需安装的桌面应用类（qq、网盘）与浏览器直接访问的 web 类（百度、知乎），引出两种软件开发架构。
- Key claims: 应用本质都是两个程序之间的通讯; C/S=Client/Server，提供数据方是服务器、访问数据方是客户端（如腾讯视频客户端+机房服务器程序）; B/S=Browser/Server，浏览器也是一种客户端，免安装，通过 HTTP/HTTPS 请求服务器网页资源
- Learner-relevant: 建立"逆向抓包就是在观察 B/S 通讯"的认知框架。

### http协议简介

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#http协议简介]]`
- Summary: 解释 HTTP 是服务器与本地浏览器之间传输超文本的协议，用《智取威虎山》黑话类比"协议=双方约定的沟通方式"。
- Key claims: HTTP=Hyper Text Transfer Protocol（超文本传输协议）的缩写; 超文本=含有指向其他资源链接的文本，还含图片、视频、动画等多媒体; 协议是 Server 与 Client 之间相互传输数据的约定形式
- Learner-relevant: 抓包前先理解通信双方"按什么规矩说话"。

### 基于请求－响应模式

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#基于请求－响应模式]]`
- Summary: HTTP 的第一条特性：请求只能由客户端发出，服务器收到请求后才响应该请求。
- Key claims: 先有客户端请求才有服务器端响应; 服务器在没有接收到请求之前不会发送响应
- Learner-relevant: 解释浏览器分析里每个操作都对应一对 request/response。

### 无状态

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#无状态]]`
- Summary: HTTP 的第二条特性（重要）：协议自身不保存通信状态，由此引出"保持状态"的需求与 Cookie 技术。
- Key claims: 协议不保留之前请求或响应的信息，每次请求都是全新（"人生只如初见"）; 无状态是为更快处理大量事务、保证可伸缩性而刻意设计; 用户登录后跨页面保持登录态等业务推动了状态保持需求; HTTP/1.1 引入 Cookie 技术来管理状态; HTTP 报文分请求报文与响应报文
- Learner-relevant: 逆向登录态/会话保持问题的理论根源——为什么需要 cookie。

### 请求协议

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#请求协议]]`
- Summary: 拆解请求报文的请求头与请求体（报文体/请求参数），列出常用请求头字段，并对比 GET 与 POST 两种请求方式。
- Key claims: 请求头是请求的"自我介绍"，服务器据此获取客户端信息; User-Agent 是请求载体的身份标识、Referer 表明来源页面（防盗链）、X-Requested-With: XMLHttpRequest 代表 ajax 访问; 请求体存储将要发送给服务器的数据; GET 把数据放 URL 后以 ? 分隔、& 相连，大小受 URL 长度限制; POST 把数据放在请求体中，无大小限制且不明文拼在 URL 里
- Learner-relevant: 抓包看请求头与参数、判断接口 GET/POST 的直接前置知识。

### 响应协议

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#响应协议]]`
- Summary: 拆解响应报文的响应头、响应体与响应状态码（了解级别）。
- Key claims: Location 告诉浏览器跳到哪里、Content-Type 说明回送数据类型、Refresh 定时刷新、Content-Disposition 以下载方式打开数据、Expires/Cache-Control/Pragma 控制缓存; 响应体是根据请求发回客户端的指定数据; 状态码表示服务器对请求的受理结果（正常还是出错）
- Learner-relevant: 看懂响应状态码与响应头，判断请求成败和数据类型。

### 什么是cookie

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#什么是cookie]]`
- Summary: 从 HTTP 无状态的"由来"讲起，定义 cookie 为服务器发送、存储在浏览器上的一组组键值对（"服务器给客户端的小甜点"）。
- Key claims: cookie 是浏览器的技术; 键值对数据由服务器创建，存储在客户端浏览器中; 下次访问服务器时浏览器自动携带这些键值对，服务器提取有用信息识别用户
- Learner-relevant: 理解登录后服务器如何"认得"你。

### cookie的原理

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#cookie的原理]]`
- Summary: 讲解 cookie 的完整工作流程（重点）：首次带空 cookie 访问 → 服务器产生内容 → 浏览器保存本地 → 再次访问自动携带。
- Key claims: 浏览器再次访问时自动带上 Cookie，服务器据其内容判断"这是谁"; cookie 的内容由服务器自主设计，客户端无法干涉
- Learner-relevant: 逆向中"带 cookie 重放请求"有效性的原理依据。

### cookie的规范

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#cookie的规范]]`
- Summary: 列出 HTTP 规范对 cookie 数量与大小的限制，以及浏览器大战下的实际差异。
- Key claims: 单个 cookie 大小上限 4KB; 一个服务器最多在客户端浏览器上保存 20 个 cookie; 一个浏览器最多保存 300 个（因为可访问多个服务器）; 部分浏览器自行扩展至 8KB/500 个; 不同浏览器之间不共享 cookie
- Learner-relevant: 解释多浏览器/多账号场景下 cookie 相互隔离的现象。

### HTML概述

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#HTML概述]]`
- Summary: 定义 HTML 为制作网页的标准标记语言（了解级别），说明浏览器的工作方式。
- Key claims: HTML=HyperText Markup Language，扩展名 .html/.htm; 是描述性标记语言而非编程语言，写给浏览器看; 超文本可包含文本、图片、视频、音频、链接等元素; 用户访问网页是把服务器的 HTML 文档下载到本地，由浏览器按顺序解释渲染成网页效果; 每个标签代表的意义与外观各不相同
- Learner-relevant: 知道逆向分析的"页面"本质是一份可下载的文本文档。

### HTML结构和标签格式

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#HTML结构和标签格式]]`
- Summary: 给出标准 HTML 文档骨架并逐行解释，随后说明标签的语法规则。
- Key claims: `<!DOCTYPE html>` 告诉浏览器用什么解析器解析文档; `<html>` 是文档起止标记，内含 head 与 body; head 内容不在浏览器窗口显示（title 定义标题栏标题，meta charset 声明 UTF-8 编码）; body 之间是可见的网页主体; 标签分闭合与自闭合两种，HTML 不区分大小写，属性可带可不带; 网页可见数据只能写在标签之间或属性中
- Learner-relevant: 能定位页面元素在文档结构中的位置。

### 基本标签

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#基本标签]]`
- Summary: 演示标题、段落、换行、文本格式化、特殊符号标签，并区分块级与内联标签及 div/span 的定位。
- Key claims: h1-h6 标题、p 段落、br 换行; b/strong 粗体、em/i 斜体、del 删除文本、&nbsp; 空格; 块级标签(block)独占一行，内联标签(inline)按文本内容占位; div 是无实际意义的块级元素、span 是无实际意义的行内元素，均专为 CSS 样式服务，单独存在不影响页面
- Learner-relevant: 读懂页面结构、写 CSS 选择器定位元素的基础。

### 超链接标签

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#超链接标签]]`
- Summary: 讲解 a 超链接作为浏览者与服务器交互的主要手段，及其 href/title/target 属性。
- Key claims: href 规定点击后的跳转目标，可为 http(s):// 开头的网络链接或 file:///、盘符开头的本地链接; href 值留空则默认刷新当前页面; title 是悬浮提示信息; target=_blank 新建窗口打开、_self 为默认覆盖自身窗口
- Learner-relevant: 理解页面间跳转与请求来源（Referer）的源头。

### img标签

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#img标签]]`
- Summary: 讲解用 img 标签加载图片的常用属性，jpg/png/gif 是 web 三种常用图片格式。
- Key claims: src 指定图像 URL（本地或网络地址），值不正确则显示裂图; alt 指定图像无法显示时的替换文本; width/height 控制显示尺寸、border 默认 0、title 是悬浮提示; 点击图片跳转可配合 a 标签包裹 img
- Learner-relevant: 爬取图片资源、分析图片防盗链时的入口标签。

### 列表标签

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#列表标签]]`
- Summary: 演示无序列表 ul 与有序列表 ol 的基本写法。
- Key claims: ul 可带 type 属性（如 square）控制项目符号; ol 可带 start 属性指定起始编号（如 start="100"）; li 为列表项
- Learner-relevant: 认识导航、排行榜等常见列表结构的 HTML 形态。

### 表格标签

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#表格标签]]`
- Summary: 讲解 table/tr/td 的表格结构与 table、td 的常用属性，含单元格合并示例。
- Key claims: tr 定义行、td 定义列，border 默认 0 不显示边框; table 属性含 width/height/align/bgcolor、background/cellpadding/cellspacing 等; td 支持 rowspan/colspan 分别合并行与列
- Learner-relevant: 数据密集页面（表格）解析的基础。

### 表单标签

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#表单标签]]`
- Summary: 讲解表单作为浏览器与服务器间数据传递的桥梁：表单标签/表单域/表单按钮三要素，各类 input 控件与文件上传的 enctype 要求。
- Key claims: form 的 action 指向服务器处理程序 URL，method 取 get/post（默认 get），target 控制打开方式; enctype 默认 application/x-www-form-urlencoded，文件上传必须 multipart/form-data; input type 有 text/password/checkbox/radio/date/file/submit/reset 等; 单选框的 name 属性值必须一样否则无法单选; checkbox/radio 的 value 是提交给服务器的内容; textarea 为多行文本、select/option 为下拉选择
- Learner-relevant: 登录/搜索表单是逆向最常见的请求来源，须认识每个控件与提交参数的对应关系。

### 多媒体标签

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day03/前端.md#多媒体标签]]`
- Summary: 演示 video 与 audio 标签及其播放控制属性。
- Key claims: autoplay 控制自动播放、controls 控制是否显示播放控件（默认不显示）、loop 控制循环次数（正整数指定次数，loop 或 -1 无限循环）、width/height 设置窗口尺寸; 因版权等原因不同浏览器支持的播放格式不同
- Learner-relevant: 音视频站点逆向时的页面入口标签。
