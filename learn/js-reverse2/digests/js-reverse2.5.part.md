---
source: js-reverse2
source_type: codebase
source_lines: 84602
language: python
part: 5
status: absorbed
absorbed_at: 2026-10-05
created: 2026-10-05
updated: 2026-10-05
---

# Digest — js-reverse2 (part 5)

## Overview (L1)
- **福建电子交易平台 (ggzyfw.fujian.gov.cn)** — POST 招标公告列表 TradesInfo; response body `Data` is AES-CBC/Pkcs7 then base64, request carries a `portal-sign` header = MD5(salt + alphabetically-sorted params). Taught twice over: pure-Python reimplementation vs `execjs` calling extracted JS.
- **caizhaowang / bidcenter (search.bidcenter.com.cn)** — 招标搜索接口返回整段 AES-CBC(ZeroPadding) base64; the JS keeps the key/IV as CryptoJS `{words,sigBytes}` arrays rather than plain strings.
- **xdf / 新东方 (souke.xdf.cn → dsapi.xdf.cn)** — class-search API signed with `sign = MD5(paramString + fixed UUID)`; the param string is built by concatenating a fixed prefix `appId=..&t=..` plus every non-empty field, echoed back in the query string.
- **chinawealth / 中国理财网 (xinxipilu.chinawealth.com.cn)** — product-list request needs a `signature` header computed by the site's bundled `source.js` (`f(json)`), called from Python via `execjs`.
- **有道翻译 (fanyi.youdao.com → dict.youdao.com)** — `sign = MD5("client=..&mysticTime=..&product=..&key=..")` and the response is AES-128-CBC decrypted with an MD5-derived key/IV; shown both as Python reimplementation and as JS calls.
- **招标网 (ctbpsp.com)** — response is DES/ECB/Pkcs7 base64; key reused as a UTF-8 hex string.
- **毛毛租 (maomaozu.com)** — request body AES-CBC/Pkcs7 base64 encrypted with key==iv, response decrypted through `mmz.js`.
- **丁香网 (www.dxy.cn)** — GET case-bank search signed with a pure-JS SHA1 implementation (`u(data)`) over a fixed `appSignKey` + sorted params + timestamp/noncestr.

## Sections (L2)

### day11-12-fujian-response-decrypt
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/02 福建电子交易平台之响应解密.py#1]]`, `[[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/03 福建电子交易平台之响应解密2.py#43]]`, `[[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/04 福建电子交易平台.js#4]]`
- Summary: The list endpoint returns `{Data: "<base64>"}`. `02` does pure-Python AES-CBC-Pkcs7 with fixed key/iv; `03` instead loads `04 福建电子交易平台.js` and calls its `b(t)` via `execjs`. `04`'s `b()` is the original CryptoJS decrypt (`Utf8.parse` key/iv, `AES.decrypt`, `Pkcs7`) returning `toString(Utf8)`.
- Key claims: AES-128-CBC, Pkcs7 padding; key `EB444973714E4A40876CE66BE45D5930`, iv `B5A8904209931867`; payload field `Data`; base64 → AES decrypt; JS entry `b`; `execjs.compile(...).call("b", ...)`; two approaches = direct Python vs call original JS.
- Learner-relevant: Baseline case for 「先 Python 复现、失败再 `execjs` 兜底」. Anchor: any response that is a single base64 string field is usually AES.

### day11-12-fujian-request-sign
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/05 福建电子交易平台之请求加密.py#47]]`, `[[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/06 福建电子交易平台之请求加密2.py#14]]`, `[[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/04 福建电子交易平台.js#20]]`, `[[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/sign值校验.py#1]]`
- Summary: The `portal-sign` request header is generated client-side. JS `u(t)` sorts object keys case-insensitively ascending (custom compare `l`), skips undefined, stringifies nested objects/arrays and concatenates `key+value`; `d(t)` deletes empty/undefined, prepends salt `B3978D054A72A7002063637CCDF6B2E5` and returns lowercase MD5. `05` calls JS `d`; `06`/`sign值校验.py` reimplement it in pure Python (`sorted(..., key=cmp_to_key(custom_sort))`, `json.dumps(separators=(',',':'), ensure_ascii=False)`, `hashlib.md5`).
- Key claims: `portal-sign = md5(salt + concat(sorted params))`; salt `B3978D054A72A7002063637CCDF6B2E5`; header name `portal-sign`; case-insensitive key sort; nested values JSON-encoded; timestamp field `ts`; pure-Python replication uses `functools.cmp_to_key`.
- Learner-relevant: Canonical 「排序 + 拼接 + 固定 salt → MD5」 sign. Crucially, Python's default `json.dumps` separators/spacing must match JS `JSON.stringify`. Anchor: MD5 sign with case-insensitive key order.

### day13-14-caizhaowang
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/02 caizhaowang.js#4]]`, `[[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/03 caizhaowang.py#38]]`
- Summary: `GetSearchProHandler.ashx` returns a whole-body AES base64 blob. JS `AESDecrypt(str)` decrypts with CryptoJS using key/IV stored as integer word arrays (`{"words":[863652730,...],"sigBytes":16}`), mode CBC, `ZeroPadding`, then `JSON.parse(Utf8.stringify(...))`. Python equivalent decodes base64 then AES-CBC with `key='3zKzyf6eEfuDjAG3'`, `iv='fyUANZ0qSNZhhNCV'`.
- Key claims: AES-CBC, ZeroPadding (not Pkcs7); key `3zKzyf6eEfuDjAG3`, iv `fyUANZ0qSNZhhNCV`; CryptoJS key/iv as `{words, sigBytes}`; response is raw base64 (not a JSON field); entry `AESDecrypt`; POST form-urlencoded; `guid`, `keywords`, `page` params.
- Learner-relevant: Recognize CryptoJS 4-word integer arrays as a UTF-8 key/iv (decode to 16 ASCII chars). ZeroPadding vs Pkcs7 distinction. Anchor: key hidden as `words` array.

### day13-14-xdf
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/04 xdf.py#18]]`, `[[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/05 xdf.js#52]]`, `[[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/demo/xdf/xdf.js#15]]`
- Summary: The search URL `dsapi.xdf.cn/product/v2/class/search` must carry a `sign` header. `get_sign(l)` moves `appId`/`t` out, forces `areaCode=undefined`, merges `{cityCode}` and calls `ot(e)`: builds `t = "appId=5053&t=<now>"` then appends every non-null field, returns `{params: t, sign: MD5(t + "750F82C2-D8F6-49F6-878C-1E7EBEBC8DA2")}`. Python passes params to `execjs`, then sends `ret["params"]` as query string and `ret["sign"]` as header.
- Key claims: `sign = MD5(paramString + fixed-UUID)`; appId `5053`; secret `750F82C2-D8F6-49F6-878C-1E7EBEBC8DA2`; param order fixed by insertion (`appId&t&cityCode&pageIndex&pageSize&keyword&order`); keyword double-URL-encoded (`urllib.parse.quote(quote("英语"))`); entry `get_sign` returns `{params, sign}`; MD5 via `CryptoJS.MD5`.
- Learner-relevant: Sign is over the raw (un-encoded) param string but the request needs URL encoding — keep both. Anchor: fixed-order concatenation sign; double encoding of Chinese keyword.

### day13-14-chinawealth-demo
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/demo/test.py#44]]`, `[[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/demo/source.js#1]]`, `[[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/01 请求堆栈.html#1]]`
- Summary: Practice target 中国理财网 product list. `test.py` loads the site's bundled `source.js` (82,883 lines — role: the site's minified app bundle containing the signing function `f`), calls `f(json_data)` with `execjs` and sets it as the `signature` header. `01 请求堆栈.html` is a hand-made page demonstrating call-stack tracing (get_data → b → c → d) so learners practice finding the encrypting frame.
- Key claims: header `signature`; entry exported as `f`; bundled lib `source.js` (>3000 lines, record role only, not hand-read); `execjs.compile(open("source.js").read()).call("f", json_data)`; POST body serialized with `separators=(',',':')`; cookies `JSESSIONID`, `size`.
- Learner-relevant: When the sign lives deep in a bundle, call the whole file rather than extracting one function. Anchor: XHR call-stack tracing to locate the encrypt frame.

### day23-youdao-sign
- Locator: `[[sources/js-reverse2/20261005/Day23/01 基于Py逆向的有道翻译.py#5]]`, `[[sources/js-reverse2/20261005/Day23/04 基于JS逆向的有道翻译.py#5]]`, `[[sources/js-reverse2/20261005/Day23/03 有道翻译.js#21]]`
- Summary: `dict.youdao.com/webtranslate` needs `sign`. Python approach (`01`) builds `s = "client=fanyideskweb&mysticTime=<ts>&product=webfanyi&key=fsdsogkndfokasodnaso"` and MD5s it. JS approach (`04`) compiles `03 有道翻译.js` and calls `get_sign(t)`; the JS defines `j` (md5), `k(e,t)=j(\`client=..&mysticTime=..&product=..&key=..\`)`, `get_sign` with fixed key. Both POST the same form incl. `mysticTime`, `client`, `product`, `keyid=webfanyi`.
- Key claims: `sign = MD5` of fixed-order query string; key/secret `fsdsogkndfokasodnaso`; `client=fanyideskweb`, `product=webfanyi`, `keyid=webfanyi`; uses Node `crypto` (`createHash("md5")`) not crypto-js; timestamp `mysticTime` sent alongside; py-vs-JS parity.
- Learner-relevant: Same protection solved two ways — pure Python vs calling the original JS. Anchor: MD5 sign where the input string is fully visible in the JS.

### day23-youdao-decrypt
- Locator: `[[sources/js-reverse2/20261005/Day23/05 基于Py逆向的有道翻译的解密.py#75]]`, `[[sources/js-reverse2/20261005/Day23/06 基于JS逆向的有道翻译的解密.py#75]]`, `[[sources/js-reverse2/20261005/Day23/03 有道翻译.js#48]]`
- Summary: Response body is URL-safe base64 (`-`/`_`). Python `05` swaps `-`/`_` back to `+`/`/`, base64-decodes, derives `key = md5("ydsecret://query/key/...")` and `iv = md5("ydsecret://query/iv/...")` (digest bytes), AES-CBC decrypts then `unpad`. JS `06` instead calls `decrypt_data` from the JS file, which uses `crypto.createDecipheriv("aes-128-cbc", md5(o), md5(n))` with `update(t,"base64","utf-8")`.
- Key claims: AES-128-CBC; key = MD5 of `ydsecret://query/key/B*RGygVywfNBwpmBaZg*WT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl`; iv = MD5 of `ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4`; URL-safe base64; Node `createDecipheriv`; Python `unpad(data,16)`.
- Learner-relevant: Recover AES key/iv by MD5-hashing secret URL strings (digest, not hexdigest). Anchor: URL-safe base64 handling and md5-derived key/iv.

### day24-zhaobiao-des-decrypt
- Locator: `[[sources/js-reverse2/20261005/Day24/02 招标网.js#3]]`, `[[sources/js-reverse2/20261005/Day24/01 招标网.py#37]]`
- Summary: `ctbpsp.com` recommendation API returns a quoted base64 blob. `decryptByDES` parses ciphertext with `CryptoJS.enc.Base64.parse`, decrypts **DES/ECB/Pkcs7** with `keyHex = Utf8.parse("1qaz@wsx3e")`, returns UTF-8 string. Python strips surrounding quotes and calls `execjs` `decryptByDES`.
- Key claims: algorithm **DES** (not AES), ECB mode, Pkcs7; key `1qaz@wsx3e` (hex comment `ctpstp@custominfo!@#qweASD`); `CryptoJS.enc.Base64.parse`; response wrapped in double quotes (`strip('"')`); GET URL-encoded path pagination.
- Learner-relevant: DES uses 8-byte key and ECB — don't assume AES. Anchor: recognizing CryptoJS.DES and base64.parse usage.

### day24-maomaozu-aes-request
- Locator: `[[sources/js-reverse2/20261005/Day24/03 毛毛租.py#34]]`, `[[sources/js-reverse2/20261005/Day24/04 mmz.js#3]]`
- Summary: `www.maomaozu.com/index/build.json` takes an AES-encrypted request body and returns an encrypted reply. Python pads `{"Type":0,"page":2,"expire":..}` (manual `\b` padding + `pad(...,16)`), AES-CBC-Pkcs7 with key==iv `55b3b62613aef1a0`, base64-encodes and POSTs. Response decrypted via `mmz.js` `decrypt_data` → `d(e,a)` AES-CBC-Pkcs7 Utf8.parse key, iv=key, using key `0a1fea31626b3b55`.
- Key claims: request key/iv `55b3b62613aef1a0`, response key/iv `0a1fea31626b3b55`; AES-CBC-Pkcs7; key==IV; base64 transport; entry `decrypt_data`; sec-key cookies (`SECKEY_ABVK`, `BMAP_SECKEY`) are unrelated to the body crypto.
- Learner-relevant: Request and response can use different symmetric keys; key==iv is a common shortcut. Anchor: end-to-end encrypt-request/decrypt-response pair.

### day25-dxy-sha1-sign
- Locator: `[[sources/js-reverse2/20261005/Day25/02 丁香网.js#96]]`, `[[sources/js-reverse2/20261005/Day25/01 丁香网.py#47]]`
- Summary: `dxy.cn` case-bank search needs a `sign` param. The JS is a self-contained SHA1 implementation (`o` = base, `i` = utf8/bin helpers, `s` = core, `u(e,n)` = hex digest). Python builds the exact string `appSignKey=<key>&keyword=..&noncestr=..&pageNum=..&pageSize=..&sectionCode=0&serverTimestamp=..&timestamp=..`, calls `execjs` `u`, and adds `sign` to params. `noncestr` is 8-digit zero-padded random; `serverTimestamp = timestamp - 2`.
- Key claims: hash = SHA1 (hex); key `4bTogwpz7RzNO2VTFtW7zcfRkAE97ox6ZSgcQi7FgYdqrHqKB7aGqEZ4o7yssa2aEXoV3bQwh12FFgVNlpyYk2Yjm9d2EZGeGu3`; param order fixed; `noncestr` 8 digits; `serverTimestamp` ≈ current time −2; implementation is bundled pure-JS SHA1 (no crypto-js/Node crypto).
- Learner-relevant: Not every sign is MD5 — identify the hash by reading the algorithm. Anchor: raw JS hash implementation extracted and called via execjs.

## Cross-cutting techniques
- **Two-approach pattern**: every crypto case is solved twice — pure-Python reimplementation and `execjs` calling the extracted/ bundled JS. Pick Python for portability, JS when the algorithm is entangled with browser globals.
- **Transport shapes**: raw base64 body, base64 field (`Data`), URL-safe base64 (`-`/`_`), quoted base64 (`strip('"')`).
- **Sign recipes**: `sort keys + concat + salt → MD5` (福建), `fixed-order concat + UUID → MD5` (xdf), `fixed-order query + key → MD5` (有道), `fixed-order query + key → SHA1` (丁香).
- **Crypto variants seen**: AES-CBC (Pkcs7 / ZeroPadding), AES-128-CBC with MD5-derived key/iv, DES-ECB, key==iv.

## Sources
- `[[sources/js-reverse2/20261005/JS逆向/Day11-day12：逆向入门到精通核心案例1/]]`
- `[[sources/js-reverse2/20261005/JS逆向/Day13-day14：逆向核心案例解析2/]]`
- `[[sources/js-reverse2/20261005/Day23/]]`
- `[[sources/js-reverse2/20261005/Day24/]]`
- `[[sources/js-reverse2/20261005/Day25/]]`
