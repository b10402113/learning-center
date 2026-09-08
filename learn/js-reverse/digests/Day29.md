---
source: js逆向课件/Day29
source_hash:
  - eb8d1b9b829605246491360bfb3889d43a45746e5c6d172b2f9588ccdf4c9525
  - 0b825db7c263387596fa06a82e55dc79f0ee9530571f91fcfe1e1328fa23ea4a
  - 42203eb975f394e81de5cca5a85049acebca89da1c657688422934864ee334f0
  - 81cfb51fcf8d2b64b22aa3830f68cb26970f8ff00727e990bab6d56945e82154
  - 17a0793c773fd613017a77040b605428ea1dbe75b93addb951ee309290eba586
  - 214ec5a924e6d14d228ed022e57443f0ee101ce6681fa9c00cc0c7d4ad0f7ae3
  - a236723a90fd59c2b06b3cd079db8c0677dbcc4ed7743d781c4f1ecca5a62ef4
source_lines: 242
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/Day29

## Overview (L1)

- **补环境（browser-environment supplementation）**: 本日核心方法论——在 Node（或 execjs）里运行网页抽取出的 JS 前，先用一个 env shim 把 `window/document/navigator/screen/history/location` 等浏览器全局对象补齐（01 env.js，61 行），并删除 `global/Buffer` 等指纹暴露点；文件末尾还附有一段被注释的 `browser_proxy` Proxy 方案，可监控环境属性的 get/set 以定位缺失或被检测的环境项。
- **Pinduoduo anti_content 实战**: 完整案例把站点两个 webpack 混淆 chunk（02 mod1.js 约 2.4 万行、03 mod2.js 约 1.2 万行）配合自带的 webpack loader（04 loader.js）在补好的环境中跑起来，loader 把 `window.loader` 暴露到全局，从而可以按模块 id（如 `fbeZ`）懒加载任意 chunk 内模块。
- **加密入口定位与调用**: 05 pdd.js 展示了本地生成 `anti_content` 的三步固定套路——`window.loader("fbeZ")` 初始化风控模块、`window.lt['updateServerTime']` 更新服务器时间、`window.dt()` 取出结果；配合 pdd.py 用 `execjs` 在 Python 侧调用该函数，带 `anti_content` 参数请求拼多多 `query_tf_goods_info` 接口完成联调。
- **test.js 仅为环境冒烟测试**（hello world），无教学内容。

## Sections (L2)

### env环境补齐

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day29/01 env.js#env环境补齐]]`
- Summary: Node 环境下补齐浏览器全局对象的 shim：`window = global` 后删除 `global` 与 `Buffer`，再伪造 `document`（含 `addEventListener` 与硬编码 `_nano_fp` cookie）、`screen`、`navigator`（`webdriver: false`、Mac Chrome 120 UA）、`history`、指向 `www.pinduoduo.com/home/baby/` 的 `location`。
- Key claims: `delete global` 与 `delete Buffer` 用于抹掉 Node 环境指纹，防止站点 JS 检测宿主;cookie 中的 `_nano_fp` 是拼多多风控指纹字段，需替换成真实抓包值;`navigator.webdriver: false` 用于绕过自动化检测;被注释的 `browser_proxy` 用 Proxy 拦截各环境对象的 get/set，是排查"补环境缺什么/被读什么"的调试利器;location 各字段要与目标站真实 URL 一致，避免 referer/origin 类校验失败。
- Learner-relevant: 学会"最小可用补环境"清单——哪些对象必须补、哪些字段必须真实；掌握用 Proxy 代理观察代码读环境的行为，这是补环境调试的核心循环。

### mod1混淆模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day29/02 mod1.js#mod1混淆模块]]`
- Summary: 从拼多多页面保存下来的 webpack 混淆 chunk（chunk id 34，约 24304 行），通过 `window.webpackJsonp.push` 注册大量业务与第三方模块；风控关键模块 id 为 `fbeZ`，运行后会挂出 `window.lt` 与 `window.dt` 两个全局对象供外部驱动。
- Key claims: 文件以 `window.webpackJsonp.push([[34], {...}])` 形式注册模块表，模块按短哈希字符串 id（如 `+s0g`、`fbeZ`）索引;`fbeZ` 是 anti_content 生成模块，产出 `window.lt`（含 `updateServerTime` 等更新接口）与 `window.dt`（加密结果取值函数）;chunk 内混有 moment.js locale 等无关 vendor 代码，逆向时按 id 定位而非通读;读取了 `window.location`、`window.history`、`window.addEventListener` 等环境点，是补环境需求的来源。
- Learner-relevant: 理解巨型混淆 chunk 的正确姿势——不通读，靠搜索关键全局（`window.dt/lt`）反查模块 id，再用 loader 按需加载；知道业务代码读哪些环境字段，补环境才有依据。

### mod2混淆模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day29/03 mod2.js#mod2混淆模块]]`
- Summary: 站点的另一个 webpack 混淆 chunk（chunk id 0，约 12197 行），主体是 core-js 风格的 polyfill 模块（Symbol、Set、Object.getPrototypeOf、async 辅助等），为 mod1 的运行提供 ES 标准库垫片依赖。
- Key claims: 以 `window.webpackJsonp.push([[0], {...}])` 注册，与 mod1 共用同一张模块表;内容大量是 core-js 的 `e.exports = n("WEpk").Symbol/Set/Object.getPrototypeOf` 式垫片模块;不直接产出加密结果，但缺了它 mod1 的目标模块无法解析依赖;同样会读取 `window.location/document` 等环境对象。
- Learner-relevant: 明白"两个 chunk 一个模块空间"——抽取站点 JS 时 chunk 要抓全，漏掉垫片 chunk 会让目标模块在 require 链上断链。

### loader加载器

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day29/04 loader.js#loader加载器]]`
- Summary: 从站点还原/抠出的 webpack runtime（JSONP loader，120 行）：接管 `webpackJsonp.push`，维护模块注册表 `l.m`、缓存 `l.c`、已加载标记 `o` 与延迟执行队列，并把加载函数 `l` 挂到 `window.loader`，还内置 `l.d/l.r/l.t/l.n` 等 define/interop 辅助。
- Key claims: `f.push = r` 劫持了 `webpackJsonp.push`，使各 chunk 注册时既登记模块又执行依赖回调;`window.loader = l` 是逆向时手动调用任意模块 id 的入口（`window.loader("fbeZ")`）;`console.log("r:::",r)` 是讲师加的模块加载日志，观察哪些 id 被实际加载;`l.t/l.n` 处理 ESM/CJS interop，还原 loader 时要一并带上。
- Learner-relevant: 掌握 webpack runtime 的最小结构（注册、缓存、按需 require、interop），学会把站点 loader 抠出来改造（挂全局 + 加日志），让巨型 chunk 变成可按 id 查询的模块库。

### pdd案例调用

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day29/05 pdd.js#pdd案例调用]]`
- Summary: 本地生成 anti_content 的组装脚本（16 行）：按顺序 require env → mod1 → mod2 → loader，然后定义 `get_anti_content()`，内部依次 `window.loader("fbeZ")` 初始化、`window.lt['updateServerTime'](new Date().getTime())` 更新时间、`window.dt()` 返回加密串。
- Key claims: require 顺序即环境就绪顺序，env 必须最先;`get_anti_content` 是被 execjs 调用的对外函数名;`updateServerTime` 用本地时间近似服务器时间，时间因子参与加密结果;每次调用前重新初始化 `fbeZ` 模块可重置内部状态。
- Learner-relevant: 学到"抠出来之后怎么组装"的固定模板：补环境 → 挂 chunk → 跑 loader → 包一个可被外部（Python/HTTP）调用的纯函数。

### python联调

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day29/pdd.py#python联调]]`
- Summary: Python 侧联调脚本：用 `execjs.compile(open("05 pdd.js").read()).call("get_anti_content")` 在本地执行 JS 拿到 anti_content，再带上它请求 `https://apiv2.pinduoduo.com/api/gindex/tf/query_tf_goods_info` 商品列表接口。
- Key claims: `execjs.compile(...).call("get_anti_content")` 是 PyExecJS 调 JS 函数的标准用法;headers 中 Origin/Referer/User-Agent 需与浏览器一致，`sec-ch-ua` 系列头也参与风控;params 里 `anti_content` 必须为本地新生成的值，不能复用抓包旧值;接口返回 `tf_id/page/size` 对应的商品信息 JSON。
- Learner-relevant: 打通"JS 逆向产物 → Python 爬虫参数"的最后一公里：execjs 每次请求前实时生成 anti_content，即可稳定翻页拉取接口数据。

### test冒烟测试

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day29/test.js#test冒烟测试]]`
- Summary: 仅 `console.log("hello world")` 的冒烟测试文件，用于确认 Node/execjs 执行环境可用。
- Key claims: 无实质内容;文件内注释演示了 `new f` 构造函数痕迹的写法。
- Learner-relevant: 无需精读，知道它是环境连通性自检即可。
