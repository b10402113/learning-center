---
source: js-reverse2
source_type: codebase
source_lines: 589091
language: python
part: 6
status: absorbed
absorbed_at: 2026-10-05
created: 2026-10-05
updated: 2026-10-05
---

# Digest — js-reverse2 (part 6)

## Overview (L1)
- Core JS reverse-engineering case studies, set 2 — webpack, loaders, API signing, and media. This cluster is a catalogue of complete real-target reverses: two national-crypto / RSA request-signing schemes, four webpack loader flavours (array, hash/object, multi-file JSONP, packaged app), and a set of small single-purpose header/sign algorithms.
- The through-line is *the loader and the sign module*: webpack bundles hide the crypto behind a module-id dispatcher (`window.loader` / `__webpack_require__` / `webpackJsonp`), and the job is to expose that dispatcher, stub the browser environment (`window`, `document`, timers), log module ids, then call the exporting module directly. The signed-request cases (四川 SM3/SM4, 理财网 SHA256withRSA, 外贸 RSA-OAEP, 财联社 SHA1+MD5, 沃邮箱 RSA) show the same skeleton with different primitives and canonical-string rules.
- Two supporting axes ride along: environmental patching (`补环境` — Proxy/hook instrumentation of `window` reads) and request-mechanics details (redirects, `execjs` bridging, `json.dumps(separators)` to match JS serialization).

## Sections (L2)

### sichuan-sm4-sm3
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day15-Day16：逆向核心案例解析3/02 sichuan.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day15-Day16：逆向核心案例解析3/01 sichuan.py]]`, `[[sources/js-reverse2/20261005/JS逆向/Day15-Day16：逆向核心案例解析3/demo/sichuan.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day15-Day16：逆向核心案例解析3/demo/sichuan.py]]`, `[[sources/js-reverse2/20261005/JS逆向/Day15-Day16：逆向核心案例解析3/package.json]]`
- Summary: Signing scheme for the 四川 agricultural-machinery subsidy API (`loginSidePageEDE/getPurchaseOfAgriculturalMachinery`), built on `sm-crypto` (Chinese national ciphers). JS helpers: `r=sm3`, `d=sm4.encrypt`, `u=sm4.decrypt` with 32-hex key `30062AFC48C0E7B5B0918851C0445A37`; `h(e)` JSON-parses, sorts keys, builds a canonical `k=v&...` string (encodeURIComponent on keys, JSON.stringify on object values, drop empty/null); `p(e)` decrypts the base64 `parameter` with SM4, sets `timestamp=Date.now()`, re-stringifies, canonicalises `h`, appends the fixed secret `&key=HD7232D2AAAKA@978D8723H211?IER&6`, then returns `{sign: SM4(SM3(str).toUpperCase()), timestamp: SM4(ms), source: "ZRCSL7V0JIRK1PHY"}`. `aaa()` (demo) SM4-encrypts the payload `{year,buyerName,code,areaCode,pageNum,pageSize,...}` into `parameter` and returns `{parameter,h}`. `01 sichuan.py` calls the JS with `execjs` and posts with `verify=False`.
- Key claims: pipeline is SM3 hash then SM4-encrypt, both with the same key; `sm4.encrypt` default is ECB (no IV) and returns a hex/base64 string; sign input is the uppercase SM3 of `sorted-kv-string + "&key=HD7232D2AAAKA@978D8723H211?IER&6"`; `timestamp` and `sign` are both SM4 ciphertexts, `source` is a constant `ZRCSL7V0JIRK1PHY`; `parameter` is SM4 of the JSON payload; the source JS uses `require('sm-crypto')` and the demo omits `encodeURIComponent` on keys.
- Learner-relevant: Reusable pattern for SM3/SM4 (Chinese national standards) and canonical sorted-query signing; shows the payload itself is encrypted, not just signed. Anchor for all request-signing reversals.

### licaiwang-rsa-sha256
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day15-Day16：逆向核心案例解析3/03 理财网.py]]`, `[[sources/js-reverse2/20261005/JS逆向/Day15-Day16：逆向核心案例解析3/04 理财网.js]]`
- Summary: 中国理财网 `xinxipilu.chinawealth.com.cn` product-list API (`lcxp-platService/product/getProductList`). The 79k-line `04 理财网.js` is a Vue 3 SPA bundle (Vue shared runtime, decimal.js, axios, etc.) that also embeds **jsrsasign** (exposed as `He`: `KEYUTIL` + `KJUR.crypto.Signature`) and CryptoJS primitives (AES/MD5/SHA256/RSA). The hand-appended `Me(e,t)` gets the key with `He.KEYUTIL.getKey(t)`, builds `new He.KJUR.crypto.Signature({alg:"SHA256withRSA"})`, `init(o)`, `updateString(e)`, and returns `He.hextob64(n.sign())`. `get_sign(data)` = `Me(JSON.stringify(data), <hardcoded PRIVATE KEY PEM>)`, returning a base64 RSA signature placed in the `signature` header. Python calls it via `execjs` and posts `data=json.dumps(data, separators=(",",":"))`.
- Key claims: asymmetric signing — the site ships its **private** key in the bundle and signs `JSON.stringify(data)` with RSA-SHA256; output is hex-to-base64 of the PKCS#1 signature; header name is `signature`; body is a compact JSON string (`separators` match JS `JSON.stringify`); `JSESSIONID` cookie + `content-type: application/json;charset=UTF-8`.
- Learner-relevant: Recognise RSA signatures and extract the PEM; reimplement with jsrsasign or Python `cryptography` rather than executing the entire Vue bundle. Anchors the "private key in client" failure mode.

### webpack-variants
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/01 基于数组的webpack.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/02 基于对象的webpack.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/03 多文件的webpack.js]]`
- Summary: Three canonical webpack loader shapes, taught as minimal models. **Array-based**: `!function(e){...}([fn0,fn1])` with cache `t`, `n(r)` returns `t[r].exports` or initialises `o={i,l,exports}`, calls `e[r].call(o.exports,o,o.exports,n)`, and returns `o.exports.exports`; dispatcher calls `n(0)/n(1)`. **Hash/object-based**: `e={"1001":fn,"1002":fn}`, `window.loader=n`, modules export via `this.exports` and can call siblings through `window.loader("1003")`; the loader file sets the module id log `console.log("moduleID:::",r)`. **Multi-file (JSONP)**: full `webpackBootstrap` — `webpackJsonpCallback(data=[chunkIds,moreModules,executeModules])` merges chunks into `modules`, tracks `installedModules`/`installedChunks`/`installedCssChunks`, exposes `window.loader=__webpack_require__`, overrides `jsonpArray.push`, and computes lazy chunk URLs via `jsonpScriptSrc` with per-chunk hashes.
- Key claims: webpack is single-file or multi-file; the require function (`n`/`__webpack_require__`) is the hook point and is usually leaked to `window.loader`; `console.log("moduleID:::",r)` (inserted at `e[r].call(...)`) is the technique for discovering which module produces a value; array ids vs numeric/string hash ids vs chunked `webpackJsonp`; `e.exports = n("56d7")` pattern for entry points.
- Learner-relevant: Classify a bundle and expose its require function, then log module ids to locate the sign module. Anchors all packaged-webpack cases.

### sichuan-webpack-package
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/四川补贴-webpack版本/01 loader.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/四川补贴-webpack版本/02 mod01.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/四川补贴-webpack版本/03 mod02.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/四川补贴-webpack版本/04 sichuanbutie.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/demo02/loader.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day17-Day18：逆向核心案例解析4/demo02/main.js]]`
- Summary: The 四川补贴 case repackaged as a real multi-file webpack app. `01 loader.js` (639 lines) is a `webpackJsonp` bootstrap exposing `window.loader`; `02 mod01.js` (12k) pushes `[["app"], {...}]` app modules (Vue components, the `dd88` sign helper); `03 mod02.js` (122k) pushes `[["chunk-libs"], {...}]` vendor libraries (including crypto); `04 sichuanbutie.js` is the driver: `window.loader("dd88")["b"](JSON.stringify(payload))` → `parameter`, `window.loader("dd88")["c"]({parameter})` → signed request body, and `window.loader("dd88")["a"](t)` → decrypt. `demo02/` is the 阿儿法营 (aerfaying/gitblock) `blockey` React bundle: the 68k loader stubs `setTimeout`/`setInterval` and defines a `Blockey` config (`SCS:"DUE$DEHFYE("`, gitblock CDN paths), sets `window.loader=i`, and emits `console.log("t:::",t)`; `main.js` just does `window.loader(1)`.
- Key claims: sign module id `"dd88"` exports `a`(decrypt)/`b`(encrypt)/`c`(sign); each mod file is a `window.webpackJsonp.push([[chunk],{modules}])`; loader prints the requested module id (`console.log("n:::",n)` / `"t:::"`); `补环境` requires stubbing `document`, `setTimeout`, `setInterval`; aerfaying lazy chunks `blockey-admin`/`login`/`vendor-*`.
- Learner-relevant: The standard workflow for a webpack target — load loader + chunk files in Node, stub DOM/timers, instrument the loader to print module ids, then call the sign module. Anchors the packaged cases and `补环境`.

### oklink-btc-apikey
- Locator: `[[sources/js-reverse2/20261005/Day26/01 BTC.py]]`, `[[sources/js-reverse2/20261005/Day26/02 BTC.js]]`
- Summary: OKLink BTC block-list `x-apikey` header. `encryptApiKey()` splits `API_KEY="a2c903cc-b31e-4547-9299-b6d07b7631ab"` into chars, `splice(0,8)` and re-appends the first 8 chars (a rotation). `encryptTime(ts)` = digits of `ts + a` (`a=1111111111111`) then appends three `parseInt(10*Math.random())` digits. `comb(e,t) = window.btoa(e + "|" + t)`. `getApiKey()` = `comb(encryptApiKey(), encryptTime(Date.now()))`. Python calls it with `execjs`, sets `x-apikey`, and GETs `/api/explorer/v1/btc/blocks?t=&offset=&limit=`.
- Key claims: key transform is a reversible character rotation; time is obfuscated by adding constant `1111111111111` and suffixing 3 random digits; final header is base64 of `"key|time"`; params include a `t` timestamp and `offset`/`limit` pagination; also `devid`/`x-site-info` headers.
- Learner-relevant: A compact pure-algorithm header sign — no crypto library needed, just char manipulation + base64. Good warm-up for identifying what is decoy randomness.

### baidu-fanyi-sign
- Locator: `[[sources/js-reverse2/20261005/Day26/03 百度翻译.py]]`, `[[sources/js-reverse2/20261005/Day26/04 百度翻译.js]]`
- Summary: Baidu Fanyi `v2transapi` sign. The JS seeds `window.gtk='320305.131321201'`. The obfuscated `get_sign(t)`: detects surrogate pairs, truncates words longer than 30 chars to first-10 + middle-10 + last-10, runs the Unicode char codes through a base64-like table built from `String.fromCharCode` (`+ - a` / `+ - 3 ^ + b` / `+ - f`), then the magic `n(t,e)` loop (shifts by `e.charAt(n+2)` and adds/xors with `4294967295` masking), XORs the two gtk halves `f/m`, and returns `` `${(b%=1e6)}.${b^f}` ``. Python POSTs form data `{from,to,query,simple_means_flag,sign,token,ts,domain}` with a 32-hex `token`, `Acs-Token` header and full cookie jar.
- Key claims: the sign is Baidu's custom hash seeded by constant `gtk` (`320305.131321201`), not a standard md5/sha; output format `digits.digits`; short-text truncation only applies >30 chars; `Acs-Token` header and `token` field are separate; must send `transtype=realtime`.
- Learner-relevant: Canonical worked example of a proprietary hash — recognisable, stable, and testable via `execjs`; anchor for "it's not always MD5".

### bu-huanjing
- Locator: `[[sources/js-reverse2/20261005/Day26/05 补环境分析.js]]`, `[[sources/js-reverse2/20261005/Day26/06 proxy代理使用.js]]`, `[[sources/js-reverse2/20261005/Day26/08 极简壁纸.js]]`
- Summary: Environment patching in miniatures. `05 补环境分析.js` sets `window = global`, defines `window.screenX=0`/`screenY=37` and `foo()` returns `screenX+screenY+"asdfgh"` — the smallest possible "supply the browser globals the bundle reads" demo. `06 proxy代理使用.js` wraps a plain object in `new Proxy(xxx,{get,set})`: `get` logs `(target,p,receiver)` and returns `Reflect.get(target,p)` (with a noted recursion hazard if you return `window['username']` inside `get`), `set` logs and validates (`age` only allowed <100) then `Reflect.set`. The 极简壁纸 bundle shows why this matters in the large: it reads `window.atob`, `window.screen.width`, `localStorage`, `document`, timers, etc.
- Key claims: `补环境` = enumerate and stub every host global the bundle touches (`window`, `document`, `navigator`, `screen`, `localStorage`, `atob`, timers); `Proxy` `get`/`set` traps expose exactly which properties are read/written; `Reflect.get/set` must be used to preserve semantics; naive `get` returning `window[...]` recurses.
- Learner-relevant: The instrumentation primitive for headless-running a browser bundle and discovering the environment surface. Anchors every Node-side webpack execution.

### zzzmh-bizhi-decrypt
- Locator: `[[sources/js-reverse2/20261005/Day26/07 极简壁纸.py]]`, `[[sources/js-reverse2/20261005/Day26/08 极简壁纸.js]]`
- Summary: 极简壁纸 `api.zzzmh.cn/bz/v3/getData` returns an encrypted `result`. Decryption pipeline `_0x58b5da(x) = _0x300484(_0x476691(_0x4176cc(x)))`: `_0x4176cc` = `atob` then `Int8Array`; `_0x476691` = an RC4-style stream cipher using a hardcoded 256-entry S-box (`_0x5f0aa7`), KSA swap loop and PRGA XOR; `_0x300484` = custom UTF-8 byte decoder (handles 1–6 byte sequences via `0x80/0xC0/0xE0/0xF0/0xF8/0xFC` masks). Helpers: `_0x5d705a`/`_0xb57b6d`/`_0x1bb54c` localStorage get/set/remove with size validation `_0x1e5448` (multiple of 0x18, 0x18..0x60 else 0x18), URL builder `_0x61a1e8` (`getUrl/` + `i + t + size`), `_0x2530e4` click/favorite/download, and debounce/throttle (`_0x374097`/`_0x4be6bf`/`_0x313488`). Python calls `_0x58b5da(result)`, `json.loads(...).get("list")`, then GETs `https://api.zzzmh.cn/bz/v3/getUrl/{i}{t}9` per image and writes `.jpg`.
- Key claims: response is base64 → RC4-variant decrypt → custom UTF-8 decode; the stream cipher uses a fixed key schedule; image URL key is string concat `i + t + "9"`; `size` normalisation clamps to 24/…/96 buckets; obfuscated identifiers (`_0x...`) are the norm.
- Learner-relevant: Recognise an RC4/stream cipher and custom encoding inside an obfuscated bundle, and the "decrypt listing then download assets" loop. Anchors media-reverse cases.

### redirect-and-proxy
- Locator: `[[sources/js-reverse2/20261005/Day26/09 重定向.py]]`, `[[sources/js-reverse2/20261005/Day26/06 proxy代理使用.js]]`
- Summary: Request mechanics. `09 重定向.py` contrasts `requests.get(url, allow_redirects=False)` — read `res.status_code`/`res.headers`, pull `Location`, and issue the next request manually — with `allow_redirects=True` which follows automatically; the commented double-request version is the manual form. (`06 proxy` is covered under `bu-huanjing`.)
- Key claims: 30x responses carry a `Location` header; `allow_redirects=False` stops the chain so intermediate cookies/headers can be captured; `allow_redirects=True` is the default convenience path.
- Learner-relevant: Controls redirect handling when a target uses 302 chains to set auth cookies. Small utility anchor.

### webpack-loader-basics
- Locator: `[[sources/js-reverse2/20261005/Day27/01 webpack加载器loader.js]]`
- Summary: Day27's teaching loader — the corrected/normalized form of the array and hash dispatchers. Shows the commented array version (`!function(e){...}([fn,fn])`, `n(0)/n(1)`) and the active hash/object version keyed `"1001"`/`"1002"` with `window.loader=n` and `console.log(window.loader("1001"))`. Notes the loader shape `function n(r){ if(t[r]) return t[r].exports; var o=t[r]={i:r,l:!1,exports:{}}; e[r].call(o.exports,o,o.exports,n); return o.exports.exports }` and that a module can call a sibling via `window.loader("1003")`.
- Key claims: the require function is `n`; ids may be numeric or string; caching prevents re-execution; return value is `o.exports.exports` (not `o.exports`); global leak `window.loader` is the reversal handle.
- Learner-relevant: The minimal mental model before applying it to real bundles. Anchors the webpack family.

### waimao-loader-rsa
- Locator: `[[sources/js-reverse2/20261005/Day27/02  外贸电商平台的loader.js]]`, `[[sources/js-reverse2/20261005/Day27/03  外贸电商平台的mod1.js]]`, `[[sources/js-reverse2/20261005/Day27/04  外贸电商平台的mod2.js]]`
- Summary: 外贸电商平台 multi-chunk webpack app. Loader: `f(n)` with `console.log("n:::",n)`, `window.loader=f`, `f.e` lazy-loads CSS/JS chunks with big `chunk-017d…` hash maps (`static/js/`, `static/css/`), `f.m/f.c/f.d/f.r/f.t/f.n/f.o/f.p/f.oe` runtime helpers. `03 mod1.js` (33.7k lines) is the app bundle; `04 mod2.js` (38.3k lines) is `chunk-libs` (lodash etc.). The sign module is **`MuMZ`**: `a(e)` = `n("XBrZ").pki.publicKeyFromPem(<2048-bit RSA PUBLIC KEY PEM>).encrypt(e,"RSA-OAEP",{md:sha256,mgf1:{md:sha1}})` then `window.btoa(t)`; `b(e)` = `i.md.md5.create().update(e).digest().toHex()`. The loader's demo is `window.loader("MuMZ").a("123")`.
- Key claims: module id `"MuMZ"` exports `a`(RSA-OAEP encrypt → base64) and `b`(MD5); crypto backend is jsrsasign (`XBrZ`); OAEP uses SHA-256 with MGF1-SHA1; the public key is embedded verbatim — the server holds the private key; many lazy chunks (`chunk-commons` etc.).
- Learner-relevant: Asymmetric (public-key) request encryption and how to reimplement RSA-OAEP in Python or reuse the bundled library. Anchors the "encrypt with public key, server decrypts" class.

### cailianshe-loader-sign
- Locator: `[[sources/js-reverse2/20261005/Day27/05 财联社的loader.js]]`, `[[sources/js-reverse2/20261005/Day27/06 财联社的mod1.js]]`, `[[sources/js-reverse2/20261005/Day27/07 财联社的mod2.js]]`, `[[sources/js-reverse2/20261005/Day27/08 财联社的mod3.js]]`
- Summary: 财联社 (Cailianpress) webpack bundle. Loader: `u(r)` with `try/finally` cache-delete on throw, `console.log("r:::",r)`, `window.loader=u`, lazy chunks at `static/chunks/{hash}.{hash}.js` (ids 24/25/66–70). The sign module is **`W2Yj`**: `p(e,t)` recursively serialises params (object keys sorted by `pLtp`/`o`, arrays/objects bracketed, falsy filtered by `f`, joined with `&`); the export runs `t = f(c(e).map(...))`, then `t = KjvB.sync(t)` (SHA-1 — `KjvB` wraps native `crypto.subtle` SHA-1 with module `c4+4` fallback; `e.exports.sync = a` is the synchronous hex path), then `t = aCH8(t)` (**MD5** — blueimp-style `_ff/_gg/_hh/_ii` implementation). `get_sign()` passes `{os:"web",sv:"7.7.5",app:"CailianpressWeb"}` and returns `window.loader("W2Yj")(data)`. `06 mod1.js` (4.3k) is the React/axios app tier, `07 mod2.js` (1.6k), `08 mod3.js` (583).
- Key claims: signature = sorted query-string → SHA-1 → MD5 (two hash layers); `KjvB.sync` is a WebCrypto-or-js SHA-1 with a `sync` alias; `aCH8` is the recognisable blueimp MD5 (constants `1732584193`, `_ff/_gg/_hh/_ii`); payload is `{os,sv,app}`; loader deletes the cache entry when a module throws.
- Learner-relevant: Layered canonical-serialization + hash signing, and identifying a bundled MD5/SHA-1 by its constants. Anchors "hash chains" and canonical-string bugs.

### wo-mail-rsa
- Locator: `[[sources/js-reverse2/20261005/Day27/09 沃邮箱的loader.js]]`, `[[sources/js-reverse2/20261005/Day27/10 沃邮箱的mod1.js]]`
- Summary: 沃邮箱 (China Unicom mailbox) login bundle. Loader: `c(e)` with `console.log("e:::",e)`, `window.loader=c`, chunk names `loginCommon`/`login` (`{0:'loginCommon',6:'login'}`). `10 mod1.js` (21.5k lines) hosts the RSA library (module `595`, a JSEncrypt-style class with `setPublic`/`setPrivate`) and app code. Module **`437`**: modulus `o='C4E3F7212602E1E396C0B6623CF11D26…C4E3F721…28F2D5F8…E73E41'` and exponent `'10001'`; exports `encrypt(t,e,n){ var r=new i; r.setPublic(e,n); return r.encrypt(t) }`, `hashPassword(t) { return '#!'+r(t,o,'10001') }`, and `loadPassword` (decrypt from `location.hash` using the private key). The loader test does `window.loader(437).encrypt(t, o, n)`.
- Key claims: password is RSA-encrypted with a hardcoded public modulus/exponent before login; module id `437`; wrapped result prefixed `#!`; the same bundle carries the private key only for a dev `loadPassword` helper; JSEncrypt-style API `setPublic(string, exp)`.
- Learner-relevant: Login RSA encryption — spot the modulus/exponent pair and reuse the bundled library or Python `rsa`. Anchors credential-scheme reverses.

## TOC
part 6: sichuan-sm4-sm3 · licaiwang-rsa-sha256 · webpack-variants · sichuan-webpack-package · oklink-btc-apikey · baidu-fanyi-sign · bu-huanjing · zzzmh-bizhi-decrypt · redirect-and-proxy · webpack-loader-basics · waimao-loader-rsa · cailianshe-loader-sign · wo-mail-rsa
