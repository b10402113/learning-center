---
source: js逆向课件/Day26
source_lines: 543
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/Day26

## Overview (L1)

- **OKLink（BTC 区块浏览器）x-apikey 逆向**：`www.oklink.com` 的 BTC 区块列表接口要求请求头 `x-apikey`，由 JS 生成：固定 API_KEY 前 8 字符轮转到末尾、毫秒时间戳加偏移 `1111111111111` 再拼 3 个随机数字，两部分用 `|` 连接后 base64 编码。
- **百度翻译 sign 逆向**：`fanyi.baidu.com/v2transapi` 的表单 sign 由经典 `get_sign` 算法生成——gtk 分两段取整数、长文本截取前/中/后各 10 字符、字符转码后经两段魔数驱动位运算，输出 `(b % 1e6).toString() + "." + (b ^ f)`。
- **补环境**：在 Node 中 `window = global` 后按需补齐浏览器属性（如 `window.screenX/screenY`、`window.gtk`、`window.btoa`），让扣下来的浏览器 JS 能直接运行；配合 Proxy 拦截 get/set 可以观察代码访问了哪些环境属性。
- **Proxy 代理**：用 `new Proxy(obj, {get, set})` 拦截属性读写，set 里可做校验（如 age 范围检查），配合 `Reflect.get/Reflect.set` 操作原对象；是补环境调试的核心工具。
- **极简壁纸（bz.zzzmh.cn）响应解密**：接口 `api.zzzmh.cn/bz/v3/getData` 返回加密字符串，JS 侧解密链为 atob → Int8Array → RC4（固定密钥数组）→ UTF-8 解码，得到 JSON 后可拼 `getUrl` 下载高清壁纸图。
- **requests 重定向处理**：`allow_redirects=True` 自动跟随重定向；设为 `False` 可手动读取 302 响应的 `Location` 头再发第二次请求，理解重定向的底层过程。

## Sections (L2)

### BTC

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day26/01 BTC.py#BTC]]`
- Summary: Python 侧脚本：用 execjs 调 `02 BTC.js` 的 `getApiKey()` 得到 `x-apikey` 请求头，连同 cookies 和大量 `x-` 开头的自定义头一起请求 OKLink 的 BTC 区块列表接口。
- Key claims: 加密结果通过 `execjs.compile(...).call("getApiKey")` 取回并放入 `x-apikey` 头；其余请求头（devid、x-cdn、x-locale、x-utc 等）直接从浏览器复制；接口为 `GET /api/explorer/v1/btc/blocks`，参数 t（时间戳）、offset、limit。
- Learner-relevant: 掌握"加密结果放进请求头而非参数"这类逆向形态，理解自定义请求头（x-apikey）同样可能是 JS 动态生成的。

### BTC的apikey算法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day26/02 BTC.js#BTC的apikey算法]]`
- Summary: OKLink 的 x-apikey 生成逻辑：`encryptApiKey` 把固定 API_KEY 的前 8 个字符切下拼到末尾（字符轮转），`encryptTime` 把当前毫秒时间戳加 `a=1111111111111` 后再拼 3 个随机数字，`comb` 用 `|` 连接两者并 `window.btoa` 编码。
- Key claims: API_KEY 为硬编码 UUID；时间偏移量 a 恒为 1111111111111；随机尾部用 `parseInt(10 * Math.random(), 10)` 生成 3 个数字；依赖 `window.btoa`，Node 下需 `window = global` 才能运行；整体是轻量混淆而非强加密。
- Learner-relevant: 学会识别"字符轮转 + 时间偏移 + base64"这类低成本接口防护，并理解补 `window = global` 是让扣下的代码跑通的第一步。

### 百度翻译

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day26/03 百度翻译.py#百度翻译]]`
- Summary: Python 侧脚本：调 `04 百度翻译.js` 的 `get_sign(wd)` 计算单词的 sign，POST 到 `fanyi.baidu.com/v2transapi`（form 表单携带 query/sign/token/ts 等），带完整百度 cookies 和 Acs-Token 头。
- Key claims: sign 是 form 数据字段而非 URL 参数；还需固定 token（`54d75af...`）与 ts（毫秒时间戳）；Acs-Token 也是必要的请求头；sign 通过 `execjs.compile(...).call("get_sign", wd)` 按单词动态计算。
- Learner-relevant: 掌握 POST + form 加密字段的逆向模式，理解 sign 必须随 query 内容变化、不能写死。

### 百度翻译sign算法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day26/04 百度翻译.js#百度翻译sign算法]]`
- Summary: `get_sign` 完整实现：超 30 字符的文本截取前 10、中间 10、末尾 10 字符（含代理对处理）；gtk 拆成两段整数 f、m；逐字符转码后经魔数 `+-a^+6` 和 `+-3^+b+-f` 驱动的 `n()` 位运算循环，输出 `((b % 1e6).toString()) + "." + (b ^ f)`。
- Key claims: 需要 `window = global; window.gtk = '320305.131321201'` 补环境；`n(t, e)` 按 `+/-` 与移位字符解析实现 `>>>`、`<<`、`+`、`^` 的动态位运算；文件顶部注释保留了用 Proxy 包装 window 观察 gtk 读取的调试代码；负数结果用 `2147483648 + (2147483647 & b)` 转正。
- Learner-relevant: 认识百度翻译这一广泛引用的 sign 算法，体会"魔数字符串驱动位运算"的混淆手法及 gtk 这类环境依赖的补法。

### 补环境分析

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day26/05 补环境分析.js#补环境分析]]`
- Summary: 最小补环境示例：`window = global` 后手动补 `window.screenX = 0`、`window.screenY = 37`，`foo()` 才能正常计算并返回 `window.screenX + window.screenY + "asdfgh"`。
- Key claims: Node 环境没有浏览器属性，扣下的代码读 `window.screenX` 会得到 undefined；补环境 = 在 Node 里用 global 伪装 window 并按需补齐缺失属性；缺什么补什么，与整套模拟浏览器环境（如 jsdom）相对。
- Learner-relevant: 理解"补环境"概念的最初形态：让依赖浏览器全局对象的加密代码在 Node 中跑通。

### proxy代理使用

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day26/06 proxy代理使用.js#proxy代理使用]]`
- Summary: Proxy 语法练习：用 `new Proxy(obj, {get, set})` 包装普通对象，get/set 中打印 target/属性名/值并配合 Reflect 操作原对象；set 里对 age 做 `< 100` 的范围校验，非法值直接拦截。
- Key claims: `Reflect.get(target, p)` / `Reflect.set(target, p, value)` 是 trap 内操作原对象的正确姿势；在 get 里写 `return window['username']` 这类访问 window 的写法有递归风险；Proxy 常用于包装 `window = global` 来观察扣下的代码读了哪些环境属性、写回什么值。
- Learner-relevant: 掌握 Proxy 的 get/set 拦截与校验写法，为补环境时的"环境探测代理"打基础。

### 极简壁纸

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day26/07 极简壁纸.py#极简壁纸]]`
- Summary: Day25 作业的答案脚本：POST `api.zzzmh.cn/bz/v3/getData` 拿到加密 result 字符串，调 `08 极简壁纸.js` 的 `_0x58b5da` 解密成 JSON，取 list 后用 `i + str(t) + "9"` 拼图片 ID，请求 `bz/v3/getUrl/` 接口下载高清壁纸。
- Key claims: 这是响应体加密（而非参数加密）的案例；解密结果需 `json.loads` 后取 `list`；下载 URL 为 `https://api.zzzmh.cn/bz/v3/getUrl/<id>`；图片按二进制写入本地文件。
- Learner-relevant: 掌握"响应数据解密"完整链路：拿密文 → 调 JS 解密 → 解析 JSON → 拼下载接口 → 落盘文件。

### 极简壁纸解密算法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day26/08 极简壁纸.js#极简壁纸解密算法]]`
- Summary: 扣下的解密模块：入口 `_0x58b5da(result)` = UTF-8 解码（`_0x300484`）← RC4 解密（`_0x476691`，内置 256 字节固定密钥数组）← atob+Int8Array 转字节（`_0x4176cc`）；文件还含 localStorage 读写、节流/防抖、下载 URL 拼接等业务函数。
- Key claims: `_0x476691` 是标准 RC4：KSA 式密钥编排（`i+1 & 0xff`、`j+S[i] & 0xff` 交换）+ PRGA 异或输出；`_0x300484` 手写 UTF-8 变长解码（按 0xfc/0xf8/0xf0/0xe0/0xc0 前缀判断字节数）；依赖 `window.atob`，需 `window = global`；密钥数组硬编码在代码中，可直接复用。
- Learner-relevant: 学会从混淆代码中识别 RC4 与手写 UTF-8 解码的特征，理解"扣入口函数及其依赖链"的扣代码思路。

### 重定向

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day26/09 重定向.py#重定向]]`
- Summary: requests 处理 302 重定向的两种方式：`allow_redirects=False` 手动模式——读第一次响应的 `Location` 头再发第二次请求；`allow_redirects=True` 自动模式——requests 自动跟随到最终页面。
- Key claims: `allow_redirects` 默认对 GET 为 True；手动模式可观察每一跳的 status_code、headers 和 Location；注释代码演示了百度 http→https 的两次请求过程。
- Learner-relevant: 理解重定向链的机制，爬虫遇到 302/Location 时能选择自动跟随或手动拆解每一跳。
