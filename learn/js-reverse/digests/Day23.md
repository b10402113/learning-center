---
source: js逆向课件/Day23
source_hash:
  - 2796452469f406070613a5eda6637a44db4f10b74f4b8000bc64d58e32244e37
  - 821f126192feae34ee5225bba8333dee364c3af8786fc4f1fa8c74a8dc7097fd
  - 9aac9202e4a74658186a98b239a3bd16093ea04dda4d126949a530d1acbfd4a8
  - 8717d030b57cc761b542d9e2d0797881b3fb8c90c8a4b430c98fb9ea90e7f487
  - 8c85b05e3c2c5c7a1796b2979670320ae9379255e4de3155d78549f0b550229c
  - e1481a1939658163eab2474ee9d7982f6a9a9af9591b6c895185eab65ed70b29
  - edf7ea7ae61928c3f2da6d472ee44c66ed0319ddeef56069ed2ca23514eb0dd2
  - 7fbd3b287562f88e65e15e216c330a13c295e6735cdfdb47ccf93f6e3fb24668
  - 4248887b6d4a201226e201eabe76ad4cdc735842a6bbb75576510389b069671a
  - 2a2e9b435e7c3ecb8ea5d7954f5827272488f41d3a3541e1e494da5f69a94285
  - 0dd9fe436f092ef24eb7d0520c34e994a0dff3bebeef7b9967f6ae0f61400054
source_lines: 460
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/Day23

## Overview (L1)

- **基于 Py 逆向的有道翻译**：在 Python 中用 hashlib.md5 手工复现 sign 生成逻辑——拼接 `client=&mysticTime=&product=&key=` 字符串后取 MD5，配合动态时间戳 mysticTime 完成请求，验证"Python 原生复现加密"的可行性。
- **node.js 入门与 crypto 模块**：用 demo.js/demo.py 演示 node 运行 JS、模板字符串、时间戳获取，并引入 crypto-js/crypto 模块，为后续 JS 侧 sign 与 AES 解密做环境铺垫。
- **基于 JS 逆向的有道翻译**：把 sign 生成逻辑搬到 JS（03 有道翻译.js / 03 有道翻译2.js），用 crypto 模块的 createHash("md5") 计算 sign，再通过 execjs 让 Python 调用 JS 的 get_sign，验证"Python 调 JS 执行加密"的混合路线。
- **有道翻译响应解密（Py 版）**：在 Python 中用 PyCryptodome 实现 AES-128-CBC 解密——key/iv 分别由两个 `ydsecret://...` 字符串取 MD5 digest 得到，响应文本先做 base64 url-safe→standard 替换再解密去填充。
- **有道翻译响应解密（JS 版）**：把 AES 解密逻辑写在 JS（decrypt_data）中，Python 通过 execjs 直接调用 JS 解密函数，验证"JS 加密 JS 解密"的对称路线，与 Py 版解密形成对比。

## Sections (L2)

### 基于Py逆向的有道翻译

- Locator: `[[sources/js-reverse/js逆向课件/Day23/01 基于Py逆向的有道翻译.py#基于Py逆向的有道翻译]]`
- Summary: 在 Python 中用 hashlib.md5 手工拼接 `client=&mysticTime=&product=&key=` 字符串后取 MD5 得到 sign，配合动态时间戳 mysticTime 完成有道翻译请求，验证 Python 原生复现加密的可行性。
- Key claims: sign 由 `client=fanyideskweb&mysticTime={时间戳}&product=webfanyi&key=fsdsogkndfokasodnaso` 取 MD5 生成；mysticTime 为毫秒级时间戳；Python 用 hashlib.md5 即可原生复现；无需 JS 运行时即可完成 sign 构造
- Learner-relevant: 掌握"Python 原生复现加密"的最简模式——当加密算法是标准 MD5 时，可直接脱离 JS 环境，降低逆向工程复杂度。

### node.js入门与crypto模块

- Locator: `[[sources/js-reverse/js逆向课件/Day23/02 node.js#node.js入门与crypto模块]]`
- Summary: 用 demo.js/demo.py 演示 node 运行 JS、模板字符串、时间戳获取，并引入 crypto-js/crypto 模块，为后续 JS 侧 sign 与 AES 解密做环境铺垫。
- Key claims: node 可执行 JS 文件；模板字符串用反引号包裹变量；`time.time()*1000` 取毫秒时间戳；crypto-js/crypto 是后续 sign 与 AES 解密的依赖模块
- Learner-relevant: 建立 node 运行 JS 的基本认知，理解为什么后续 sign 和 AES 解密可以先在 node 中调通再交给 execjs。

### 有道翻译JS侧sign生成

- Locator: `[[sources/js-reverse/js逆向课件/Day23/03 有道翻译.js#有道翻译JS侧sign生成]]`
- Summary: 把 sign 生成逻辑搬到 JS，用 crypto.createHash("md5") 计算 sign；03 有道翻译.js 暴露 get_sign(t) 供外部调用，03 有道翻译2.js 则封装 get_sign() 同时返回 [sign, 时间戳]。
- Key claims: JS 用 crypto.createHash("md5").update(e).digest("hex") 生成 sign；get_sign(t) 接收外部时间戳；get_sign() 内部生成时间戳并返回 [sign, e]；sign 拼接逻辑与 Py 版一致
- Learner-relevant: 理解同一加密逻辑的双语实现，为 execjs"Python 调 JS"混合路线提供可调用的 JS 入口函数。

### 基于JS逆向的有道翻译

- Locator: `[[sources/js-reverse/js逆向课件/Day23/04 基于JS逆向的有道翻译.py#基于JS逆向的有道翻译]]`
- Summary: Python 通过 execjs.compile 加载 03 有道翻译.js，调用 js_compile.call("get_sign", t) 获取 sign，再发送有道翻译请求，验证"Python 调 JS 执行加密"的混合路线。
- Key claims: execjs.compile 编译 JS 代码；js_compile.call("get_sign", t) 调用 JS 函数；sign 由 JS 侧生成后返回给 Python；请求仍由 requests 发送
- Learner-relevant: 掌握 execjs 混合路线——当 JS 加密逻辑复杂或含浏览器对象时，用 Python 调 JS 比纯 Py 复现更稳妥，是逆向工程中的常用折中。

### 有道翻译响应解密Py版

- Locator: `[[sources/js-reverse/js逆向课件/Day23/05 基于Py逆向的有道翻译的解密.py#有道翻译响应解密Py版]]`
- Summary: 在 Python 中用 PyCryptodome 实现 AES-128-CBC 解密——key/iv 分别由两个 `ydsecret://...` 字符串取 MD5 digest 得到，响应文本先做 base64 url-safe→standard 替换再解密去填充。
- Key claims: key = md5("ydsecret://query/key/B*RGygVywfNBwpmBaZg*WT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl").digest()；iv = md5("ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4").digest()；响应文本需 replace("-","+").replace("_","/") 再做 base64.b64decode；AES 模式为 CBC，去填充用 unpad(data, 16)
- Learner-relevant: 掌握"Python 原生 AES 解密"的完整流程——key/iv 派生、base64 变体处理、CBC 解密与去填充，是响应解密的标准模板。

### 有道翻译响应解密JS版

- Locator: `[[sources/js-reverse/js逆向课件/Day23/06 基于JS逆向的有道翻译的解密.py#有道翻译响应解密JS版]]`
- Summary: 把 AES 解密逻辑写在 JS（decrypt_data）中，Python 通过 execjs 直接调用 JS 解密函数，验证"JS 加密 JS 解密"的对称路线，与 Py 版解密形成对比。
- Key claims: JS 侧 decrypt_data 封装 AES-128-CBC 解密逻辑；Python 用 js_compile.call("decrypt_data", response.text) 调用；JS 内部用 cryptoJs.createDecipheriv 解密；与 Py 版解密结果等价
- Learner-relevant: 理解"JS 加密 JS 解密"的对称性——当加密逻辑已用 JS 实现时，解密也优先用 JS 实现可减少跨语言移植成本，是逆向工程中的实用策略。
