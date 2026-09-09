---
source: js逆向课件/Day24
source_lines: 147
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/Day24

## Overview (L1)

- **招标网 DES 解密**：用 requests 抓取招标网接口的密文响应，再通过 execjs 调用 02 招标网.js 的 decryptByDES 函数完成 DES-ECB 解密，密钥为 `1qaz@wsx3e`，演示"Python 调 JS 解 DES"的实战流程。
- **毛毛租 AES 加解密**：在 Python 中用 PyCryptodome 实现 AES-128-CBC 加密请求体（key/iv 均为 `55b3b62613aef1a0`），base64 编码后 POST；响应则通过 execjs 调用 04 mmz.js 的 decrypt_data 完成 AES 解密，密钥为 `0a1fea31626b3b55`，iv 与 key 相同。
- **今日作业**：预习 oklink.com 以太坊区块列表页面及 API 接口，为后续可能的区块链浏览器逆向案例做铺垫。

## Sections (L2)

### 招标网DES解密

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day24/01 招标网.py#招标网DES解密]]`
- Summary: 用 requests 抓取招标网 cutominfoapi 接口的密文响应，再通过 execjs 调用 02 招标网.js 的 decryptByDES 函数完成 DES-ECB 解密，演示"Python 调 JS 解 DES"的实战流程。
- Key claims: 招标网接口为 GET https://ctbpsp.com/cutominfoapi/recommand/type/5/pagesize/10/currentpage/2；响应为 DES 加密密文；解密函数为 decryptByDES；Python 用 execjs.compile 加载 JS 并调用；与有道翻译案例形成"请求+解密"完整闭环
- Learner-relevant: 掌握 DES-ECB 解密的 JS 调用模式，理解 execjs 在"Python 请求 + JS 解密"混合架构中的桥梁作用。

### 招标网JS解密逻辑

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day24/02 招标网.js#招标网JS解密逻辑]]`
- Summary: 用 CryptoJS 实现 DES-ECB 解密，密钥为 `1qaz@wsx3e`，填充方式为 Pkcs7，密文先 Base64 解析后再解密为 UTF-8 字符串。
- Key claims: keyHex = CryptoJS.enc.Utf8.parse("1qaz@wsx3e")；解密模式为 CryptoJS.mode.ECB；填充为 CryptoJS.pad.Pkcs7；密文通过 CryptoJS.enc.Base64.parse 解析；返回 decrypted.toString(CryptoJS.enc.Utf8)
- Learner-relevant: 掌握 CryptoJS DES 解密的完整 API 链——parse key、Base64 解析密文、decrypt 调用、UTF-8 输出，是 DES 逆向的标准模板。

### 毛毛租AES加密请求

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day24/03 毛毛租.py#毛毛租AES加密请求]]`
- Summary: 在 Python 中用 PyCryptodome 实现 AES-128-CBC 加密请求体（key/iv 均为 `55b3b62613aef1a0`），base64 编码后 POST 到 maomaozu.com/index/build.json；响应则通过 execjs 调用 04 mmz.js 的 decrypt_data 完成 AES 解密。
- Key claims: 请求体为 JSON 格式 {"Type":0,"page":2,"expire":...}；AES 模式为 CBC，key/iv 均为 55b3b62613aef1a0；加密后做 base64 编码再发送；响应解密通过 execjs 调用 JS 侧 decrypt_data；与有道翻译 AES 解密形成对比（key/iv 来源不同）
- Learner-relevant: 掌握"AES 加密请求 + JS 解密响应"的完整流程，理解 key/iv 对称且与 JS 端共享的逆向模式。

### 毛毛租JS解密逻辑

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day24/04 mmz.js#毛毛租JS解密逻辑]]`
- Summary: 用 crypto-js 实现 AES-128-CBC 解密，密钥为 `0a1fea31626b3b55`，iv 与 key 相同，填充方式为 Pkcs7，解密后返回 UTF-8 字符串。
- Key claims: 密钥 e = '0a1fea31626b3b55'；iv 与 key 相同；模式为 cryptoJs.mode.CBC；填充为 cryptoJs.pad.Pkcs7；decrypt_data 函数封装解密逻辑；与有道翻译 AES 解密结构相似但 key 不同
- Learner-relevant: 掌握 crypto-js AES 解密的完整 API 链——parse key、AES.decrypt 调用、UTF-8 输出，理解 iv=key 这种简化模式在逆向中的识别特征。

### 今日作业

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day24/今日作业.txt#今日作业]]`
- Summary: 预习 oklink.com 以太坊区块列表页面及 API 接口，为后续可能的区块链浏览器逆向案例做铺垫。
- Key claims: 页面为 https://www.oklink.com/cn/eth/block-list/page/5；API 为 https://www.oklink.com/api/explorer/v1/eth/blocks；含分页参数 offset/limit 和时间戳 t
- Learner-relevant: 提前熟悉区块链浏览器类站点的请求结构，为后续可能的 token 签名或分页加密逆向做认知准备。
