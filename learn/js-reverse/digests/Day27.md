---
source: js逆向课件/Day27
source_hash:
  - a0add0d3f6b375caa38d9cb9737072ea08a3f695dd1fd23090c10fbeb9614f27
  - f1b5056fde61bae82009b15d6775061546edfe513450e17319afdf956e2293e9
  - e3f3ae3e5ae25235fdf6b27579eb1164b4f0fe4ffc9c877e56182a159ff83be9
  - 5d46fd9541f6997dc1f065e79f79f6454de19c32c071b76e484ea70d494c19e2
  - 90a180e1a564b6efdcaad2f68e2ebbc4b862a35b615e765639bc70d0dfdf2194
  - 128bf3f2c0188ab3c68865875a098bb4ffc94fc0dc25de3608d38c5438d6ef33
  - 33d6ceee4a3a95c8bd34b09cf8ac0317ce8d35d9fa6597068818d487e78da08e
  - d4870ef074d183869557674c942cc7a190cef9d744956802714666c76cd0ecca
  - c0c3a9ff56dd83c4d85c2c3ed894eec7206ae24905930fac0747ccd87029a075
  - 7a918f3a142d315b6c13cfea458a86f319f1c092de04eea698109da0e3cd50b8
source_lines: 3266
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/Day27

## Overview (L1)

- **webpack 加载器原理（教学 demo）**：`01 webpack加载器loader.js` 用 80 行还原了 webpack 打包产物的骨架 —— `!function(模块容器){加载器实现}(功能模块)`。先演示数组下标调度，再演示哈希（字符串 key）调度，并把 `__webpack_require__` 挂到 `window.loader` 上，之后就能任意调度某个模块。这是理解全部后续案例的钥匙。
- **逆向套路：loader + mod 分离**：真实站点的 webpack 产物被拆成「loader.js + 若干 mod 文件」。mod 文件通过 `window.webpackJsonp.push([[chunk名], {模块字典}, [依赖chunk]])` 注册模块，loader 劫持 `webpackJsonp.push` 完成注册并暴露调度器。逆向时把 loader 和 mod 一起 require 进 Node（补 `window = global` 等环境），再 `window.loader("模块ID")` 拿到目标函数本地调用。
- **案例一：外贸电商平台**：`02 loader.js`（含 CSS/JS 双 chunk 异步加载表，200+ 个 chunk 名）配合 mod1（app 业务 chunk，含目标模块 `MuMZ`）与 mod2（chunk-libs 第三方库，含 lodash/core-js/MD5）。目标调用是 `window.loader("MuMZ").a("123")`。
- **案例二：财联社**：`05 loader.js` 通过 `get_sign()` 调 `window.loader("W2Yj")(data)` 生成请求签名字段（os/sv/app）。mod1 是含 `W2Yj` 签名模块的 chunk 4（React/Redux 系），mod2/mod3 是 core-js polyfill chunk 0/3，本地复现时三个 mod 都要 require。
- **案例三：沃邮箱**：`09 loader.js` 末尾直接测试 `window.loader(437).encrypt(t, o, n)`，其中 `n='10001'`（hex 65537，RSA 公钥指数）、`o` 为超长 hex 模数 —— 典型 RSA 登录加密。mod1（loginCommon chunk）内含 jQuery 1.11.3 与 437 号加密模块，是数字下标调度的实例。

## Sections (L2)

### webpack加载器loader

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/01 webpack加载器loader.js#webpack加载器loader]]`
- Summary: 80 行的教学 demo，从零还原 webpack 加载器：`!function(e){...}(模块容器)` 的自执行结构、缓存对象 `t`、调度函数 `n(r)`，先写数组下标版本再写哈希 key 版本。
- Key claims: 加载器结构为 `!function(形参){加载器构建}(功能模块)`;调度函数先查缓存 `t[r]` 直接返回 `exports`,未命中则建 `{i, l, exports}` 对象并以 `e[r].call(o.exports, o, o.exports, n)` 执行模块;模块内部用 `this.exports = 值` 对外导出;把调度器挂到 `window.loader` 后即可按模块 ID 任意调度;`window = global` 用于 Node 环境兜底。
- Learner-relevant: 亲手跑通这两个版本，就能在任何 webpack 站点产物里一眼认出「加载器 + 模块字典」结构，是本日全部案例的前置锚点。

### 外贸电商平台的loader

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/02  外贸电商平台的loader.js#外贸电商平台的loader]]`
- Summary: 从外贸电商平台（物流订舱类业务）提取的真实 webpack loader，顶部 require 两个 mod 文件，尾部用 `window.loader("MuMZ").a("123")` 测试目标加密函数。
- Key claims: webpackJsonp 的 `push` 被 loader 劫持为数组版 `n(n)` 处理器,用于接收 mod 注册的 chunk;调度函数 `f(n)` 同样带缓存 `{i, l, exports}` 并挂到 `window.loader`;`f.e` 实现 chunk 异步加载,内含 200+ 个 `chunk-xxxx` 到 CSS/JS 文件 hash 的映射表;`f.p = "/"` 是资源根路径;loader 本体以 `}([])` 启动,真正模块来自 mod 文件的 webpackJsonp 注册;`u()` 按 chunk 依赖就绪情况逐个执行入口模块。
- Learner-relevant: 展示「loader 只管调度、mod 才是肉」的分工，以及如何在本地 Node 里 require 两个 mod 后用 `window.loader("MuMZ")` 复现加密函数。

### 外贸电商平台的mod1

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/03  外贸电商平台的mod1.js#外贸电商平台的mod1]]`
- Summary: 平台的主业务 chunk（app），33745 行、2.5 MB 的 webpack 模块字典，头部 `window = global` 为本地运行补的环境，目标加密模块 `MuMZ` 就在其中。
- Key claims: 结构为 `(window.webpackJsonp||[]).push([["app"], {模块字典}, [[1,"runtime","chunk-elementUI","chunk-libs"]]])`;模块 key 为 4 位混淆哈希（如 `"+/1R"`、`"MuMZ"`、`"zvER"`）;大量模块是 base64 图片、Vue/ElementUI 组件与业务配置（订舱、冷藏箱类型等）;末尾依赖数组声明它依赖 runtime/elementUI/chunk-libs 三个 chunk;字典顶部模块把 base64 图片直接作为 exports。
- Learner-relevant: 学会在巨型 mod 里按模块 ID（`MuMZ`）定位目标函数、忽略 99% 无关模块，并理解 chunk 依赖数组如何驱动 loader 的调度。

### 外贸电商平台的mod2

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/04  外贸电商平台的mod2.js#外贸电商平台的mod2]]`
- Summary: 平台的 `chunk-libs` 第三方库 chunk，38344 行，打包了 lodash、core-js polyfill、MD5 等基础库，尾部可见完整的 MD5 轮函数实现。
- Key claims: chunk 名为 `"chunk-libs"`,是 mod1（app）依赖的库 chunk;模块间通过 `r("y1pI")` 等哈希 ID 互相引用;内容为 lodash 工具函数、core-js 垫片、Symbol/Set/Array polyfill、MD5 等;逆向时通常整块 require 而不逐模块阅读。
- Learner-relevant: 认识「业务 chunk 依赖库 chunk」的分层，知道这类文件只需保证被加载、不必细读，加密逻辑一般不在 libs chunk 里。

### 财联社的loader

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/05 财联社的loader.js#财联社的loader]]`
- Summary: 财联社网站的 webpack loader，顶部 require 三个 mod 文件，尾部 `get_sign()` 用 `window.loader("W2Yj")(data)` 生成请求签名并打印结果。
- Key claims: 调度函数 `u(r)` 带 try/finally——模块执行抛错时 `delete n[r]` 清缓存防污染;`u.e` 异步加载 chunk 映射到 `static/chunks/` 目录带 hash 文件名;`webpackJsonp.push` 劫持逻辑与数组版一致;签名入参为 `{"os":"web","sv":"7.7.5","app":"CailianpressWeb"}`,说明站点用固定参数算 sign;`u.m`/`u.c`/`u.d`/`u.t`/`u.n` 等挂载函数是 webpack 运行时标准件。
- Learner-relevant: 一个完整可跑的「扣 loader + 三 mod → Node 里出 sign」的最小工作流，`get_sign()` 即本地复现验收点。

### 财联社的mod1

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/06 财联社的mod1.js#财联社的mod1]]`
- Summary: 财联社的 chunk 4，4260 行，包含目标签名模块 `W2Yj`，同时打包了 React/Redux 运行时（`q1tI` 即 React 模块 ID）。
- Key claims: 结构为 `push([[4], {模块字典}])`,头部 `window = global`;模块 key 为 4 位混淆哈希;可见 redux 的 Subscription/Provider 等实现,证明站点是 React 技术栈;`W2Yj` 被 loader 的 `get_sign` 直接调用,是本案例唯一需要细读的模块;读前 ~300 行足以判定「这是 webpack 模块字典 + React 库 chunk」。
- Learner-relevant: 掌握「先读文件头 100–300 行判定结构，再按模块 ID 精确定位」的省力读法，避免被 4000+ 行淹没。

### 财联社的mod2

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/07 财联社的mod2.js#财联社的mod2]]`
- Summary: 财联社的 chunk 0，1637 行，几乎全是 core-js 风格的 ES5/ES6 polyfill 模块（Object 描述符、迭代器、getPrototypeOf 等）。
- Key claims: chunk ID 为数字 0;模块是 `p9MR`（core-js 根）系的 polyfill,如 Object.keys、Array 迭代器、`_createPartialApplication` 等;本身无业务加密逻辑,仅为 chunk 4 提供运行环境;本地复现时必须 require,否则调度 `W2Yj` 会因缺依赖报错。
- Learner-relevant: 理解「无价值但不可缺」的 polyfill chunk——逆向时不读它，但跑通环境离不开它。

### 财联社的mod3

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/08 财联社的mod3.js#财联社的mod3]]`
- Summary: 财联社的 chunk 3，583 行，同样是 core-js 系 polyfill：Promise、setImmediate、querystring 序列化等模块。
- Key claims: chunk ID 为数字 3;含 `p9MR.Promise`、setImmediate/clearImmediate 的多环境降级实现（process.nextTick → Dispatch → MessageChannel → onreadystatechange → setTimeout）;含 querystring 的 stringify/parse 模块;与 mod2 同属支撑 chunk,被 mod1 的签名模块间接依赖。
- Learner-relevant: 补全「三个 mod 都要 require 才能出 sign」的认知，体会 webpack 多 chunk 依赖闭环在本地复现中的处理方式。

### 沃邮箱的loader

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/09 沃邮箱的loader.js#沃邮箱的loader]]`
- Summary: 中国联通沃邮箱登录页的 webpack loader（`login.54f91.js`），只 require 一个 mod，尾部直接测试 `window.loader(437).encrypt(t, o, n)` 完成登录密码加密。
- Key claims: chunk 名映射为 `{'0': 'loginCommon', '6': 'login'}`,即登录页拆成 loginCommon + login 两个异步 chunk;入口模块 329 在 `document.onreadystatechange` 里 `Promise.all([t.e(0), t.e(6)])` 再加载模块 338;`c.p = window.__webpack_public_path__` 动态取资源根路径;尾部测试参数 `o` 为 256 字节级超长 hex 模数、`n = '10001'`(hex 65537)——标准 RSA 公钥加密入参;模块 ID 用数字下标（437）而非哈希,对应数组/数字版调度。
- Learner-relevant: 一个「数字模块 ID 调度 + RSA 登录加密」的对照案例，`console.log(window.loader(437).encrypt(...))` 即本地复现验收点。

### 沃邮箱的mod1

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day27/10 沃邮箱的mod1.js#沃邮箱的mod1]]`
- Summary: 沃邮箱的 loginCommon chunk（chunk 0），21508 行、914 KB，内含 jQuery 1.11.3 完整源码与目标加密模块 437（RSA 加密入口 `encrypt(t, o, n)`）。
- Key claims: 头部 `window = global; document = {}` 为 Node 运行补的浏览器环境;结构为 `push([[0], {336: 入口调用 init(n(342)), 342: jQuery, ..., 437: 加密模块}])`;jQuery 以 UMD 形式内嵌,版本字符串 `'1.11.3'` 可直接确认;437 号模块导出 `encrypt(明文, hex模数, hex指数)`,是登录密码 RSA 加密的实现位置;文件尾 sourceMappingURL 指向 `loginCommon.54f91.js.map`。
- Learner-relevant: 学会确认「老站 = jQuery + 数字模块 ID」的旧版 webpack 形态，并按数字 ID 437 在 2 万行里定位 RSA 加密函数。
