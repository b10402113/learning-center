---
source: js-reverse2
source_type: codebase
source_lines: 777
language: python
part: 3
status: absorbed
absorbed_at: 2026-10-05
created: 2026-10-05
updated: 2026-10-05
---

# Digest — js-reverse2 (part 3)

## Overview (L1)
- Encoding & encryption algorithms reverse engineers must recognize — URL encoding, Base64 (encode/decode/variants/images), digest algorithms (MD5/SHA), and the symmetric/asymmetric crypto families (AES/DES, RSA) as taught for JS 逆向 work.
- Day20 builds the algorithmic primitives in Python (`urllib.parse`, `base64`, `hashlib`); `JS逆向/day07` pairs the theory note (`3.加密算法`) with runnable Python (`pycryptodome`) and JS (`crypto-js` / `jsencrypt`) implementations, plus the Node.js/V8 rationale for running JS outside the browser.

## Sections (L2)
### url-encoding
- Locator: `[[sources/js-reverse2/20261005/Day20/01 url编码.py#L1-L16]]`
- Summary: URL percent-encoding via `urllib.parse`: `quote`/`unquote` for single values and `urlencode` for building query strings from a dict, with `&` and CJK characters shown as the motivating edge cases.
- Key claims: `urllib.parse.quote(val)` percent-encodes; `unquote` reverses; `urlencode(dict)` joins `k=v&k2=v2` and encodes keys/values; reserved chars like `&` must be escaped inside values; CJK (e.g. 苑) becomes `%XX%XX%XX` UTF-8 bytes.
- Learner-relevant: Recognize/decrypt percent-encoded query params and reproduce `urlencode` output in Python when reconstructing a fetch/爬虫 target; anchor = every HTTP request's query string.

### base64-encode
- Locator: `[[sources/js-reverse2/20261005/Day20/02   base64编码.py#L1-L21]]`; `[[sources/js-reverse2/20261005/JS逆向/day07/课上代码/01 base64.py#L1-L57]]`
- Summary: Base64 encoding in Python: the 3-byte→4-char regrouping, padding with `=`, and the `str → encode() → b64encode() → decode()` chain; includes the `you` / `cool` / `#!@` worked examples and the input-length→padding rules.
- Key claims: alphabet = `A-Z a-z 0-9 + /` with `=` padding; each 3 input bytes → 4 output chars (6 bits/char); output length always a multiple of 4; 1 leftover byte → `==`, 2 leftover bytes → `=`; `base64.b64encode(bytes).decode()` returns string; encoding is NOT compression (adds ~1/3) and is reversible; `b'eW91'` for `you`, `eW91eQ==` for `youy`.
- Learner-relevant: Decode any b64 blob seen in JS payloads and re-encode to verify a signature input; anchor = the base64 strings embedded in almost every front-end token.

### base64-decode
- Locator: `[[sources/js-reverse2/20261005/Day20/03   base64解码.py#L1-L15]]`
- Summary: Base64 decoding in Python with `base64.b64decode`, including the common manual padding fix when a scraped string isn't a multiple of 4.
- Key claims: `base64.b64decode(data)` returns bytes, `.decode()` → UTF-8 text; if `len(data) % 4 != 0` decoding errors, so pad with `"=" * (4 - len(data) % 4)`; still-padded strings like `IyFA` (=`#!@`) decode directly.
- Learner-relevant: Correctly decode truncated/unpadded b64 parameters found in URLs before feeding them to further decryption; anchor = the error `binascii.Error: Invalid base64-encoded string`.

### base64-variants
- Locator: `[[sources/js-reverse2/20261005/Day20/04 base64变种.py#L1-L7]]`
- Summary: URL-safe Base64 variant where the standard `+` and `/` characters are substituted with `-` and `_` before decoding.
- Key claims: standard rule = `+`→`-`, `/`→`_`; decode by `s.replace("-","+").replace("_","/")` then `b64decode`; appears in JWT, URL params, and many front-end libs' "url safe" mode.
- Learner-relevant: Spot a URL-safe alphabet and normalize it before standard decoding; anchor = JWT segments (`header.payload.signature`) which are exactly this variant.

### base64-image
- Locator: `[[sources/js-reverse2/20261005/Day20/05 base64图片.py#L1-L12]]`
- Summary: Decoding a Data URI image: split off the `data:image/png;base64,` prefix, base64-decode the payload, and write the resulting bytes to a `.png` file.
- Key claims: Data URI form `data:image/<type>;base64,<data>`; take `s.split(",")[-1]` as the payload; `base64.b64decode(payload)` → raw bytes; write with `open(path,"wb")`/`f.write(img_bytes)`; common in login-captcha (验证码) delivery and inlined CSS images.
- Learner-relevant: Extract and save an inline captcha image from a network response before running OCR; anchor = `<img src="data:image/png;base64,...">` on login pages.

### digest-algorithms
- Locator: `[[sources/js-reverse2/20261005/Day20/06 摘要算法.py#L1-L28]]`; `[[sources/js-reverse2/20261005/JS逆向/day07/课上代码/01 base64.py#L41-L49]]`; `[[sources/js-reverse2/20261005/JS逆向/day07/课堂笔记/3.加密算法 - 副本.md#L233-L290]]`
- Summary: One-way hash/digest algorithms via `hashlib` (`md5`, `sha1`, `sha256`, `sha512`): fixed-length output, irreversibility, identical input → identical digest, and incremental `update()` feeding multiple chunks.
- Key claims: imports `from hashlib import md5, sha1, sha256, sha512`; `md5(prefix).update(data.encode()).hexdigest()` → 32-char hex; `digest()` → raw bytes; MD5 = 128-bit/16-byte → 32/64 hex; irreversibility, deterministic (same input same output), different input → different output, fixed length; common uses = DB password storage (注册密码) and 一致性校验; optional salt/twice-hash raises cracking cost; brute-force/撞库 via `{明文:密文}` dictionaries; JS equivalent `CryptoJS.MD5(data).toString()`; `e10adc3949ba59abbe56e057f20f883e` = `123456`.
- Learner-relevant: Recognize a 32-hex signature as MD5 and reproduce it (with the discovered salt) in Python/Node; anchor = password fields and API `sign=` params.

### nodejs-and-crypto-primer
- Locator: `[[sources/js-reverse2/20261005/JS逆向/day07/课堂笔记/3.加密算法 - 副本.md#L1-L224]]`
- Summary: Why a reverse engineer runs JS locally: the V8 engine inside browsers executes JS, and Node.js is the V8-based runtime that frees JS from the browser — needed to execute a site's crypto functions during 逆向.
- Key claims: V8 = JS VM; Node.js = Chrome V8 JavaScript runtime environment; install via nodejs.org, then point PyCharm ("Languages & Frameworks" → Node.js and NPM) at the `node` binary; note equates Python interpreter ↔ Node.js and Python code ↔ JS code; base64 recap defines alphabet `A-Z a-z 0-9 + /` and `=`, 3 bytes→4 chars, multiple-of-4 output.
- Learner-relevant: Set up Node to run lifted crypto code and use PyCharm to develop side-by-side Python/JS; anchor = needing to execute an obfuscated JS `sign` function.

### symmetric-encryption
- Locator: `[[sources/js-reverse2/20261005/JS逆向/day07/课堂笔记/3.加密算法 - 副本.md#L292-L431]]`; `[[sources/js-reverse2/20261005/JS逆向/day07/课上代码/03 AES加密解密.py#L1-L37]]`
- Summary: DES/AES symmetric encryption theory plus matching Python (`Crypto.Cipher.AES`) and JS (`crypto-js`) encrypt/decrypt code with key/IV/padding/mode parameters.
- Key claims: symmetric = same key for encrypt/decrypt; AES replaces DES; DES ciphertext multiple of 8, AES multiple of 16; params Key/Data/Mode/padding/iv; ECB encrypts independent blocks, CBC XORs previous ciphertext for stronger security; IV is 16 random bytes needed again at decrypt, used with CBC; Python needs `pip install pycryptodome`; `AES.new(key, AES.MODE_CBC, iv)`, `pad(text.encode(),16)` / `unpad(source,16)`, ciphertext base64-wrapped for transport; JS uses `CryptoJS.enc.Utf8.parse(key)`, `CryptoJS.AES.encrypt(plaintext, key, {iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})`, `decrypted.toString(CryptoJS.enc.Utf8)`; keywords `encrypt`/`decrypt`, key never hardcoded in real code.
- Learner-relevant: Recover key/IV/mode from JS, then decrypt a captured AES-CBC payload in Python and verify against the JS result; anchor = encrypted request bodies on high-security sites.

### asymmetric-encryption
- Locator: `[[sources/js-reverse2/20261005/JS逆向/day07/课堂笔记/3.加密算法 - 副本.md#L432-L551]]`; `[[sources/js-reverse2/20261005/JS逆向/day07/课上代码/02 加密.js#L1-L31]]`
- Summary: RSA public/private-key asymmetric encryption: theory, key generation, JS via `jsencrypt`, and Python via `Crypto.PublicKey.RSA` + `PKCS1_v1_5`.
- Key claims: non-symmetric = two keys, public encrypts / private decrypts; private derived from public-ish key pair, public can be shared, slower than symmetric; generate in Python with `RSA.generate(1024)` and export via `exportKey()` to `rsa.public.pem`/`rsa.private.pem`; JS `npm install jsencrypt`, `new JSEncrypt()`, `setPublicKey`/`setPrivateKey`, `encrypt`/`decrypt`; Python `RSA.importKey`, `PKCS1_v1_5.new(rsa_pk).encrypt(...)` then base64 for transport; web-reverse keywords `RSA`, `setPublicKey`, `setPrivateKey`, `encrypt`, `decrypt`; JS file shows `window = globalThis; self = globalThis;` shim needed so `jsencrypt` runs under Node.
- Learner-relevant: Locate the site's public key, replicate RSA-encrypt in Python to forge a valid payload, or decrypt a captured blob when the private key leaks; anchor = payment-password fields and license/activation flows.

### crypto-summary
- Locator: `[[sources/js-reverse2/20261005/JS逆向/day07/课堂笔记/3.加密算法 - 副本.md#L540-L555]]`
- Summary: Closing cheat-sheet distinguishing encoding from encryption and the fingerprint of each algorithm family.
- Key claims: Base64 is an encoding, not encryption, often a step inside an encryption pipeline; Base64 elements = letters/digits/`+`/`/`/`=` with length a multiple of 4; MD5 is non-reversible, hex `[0-9a-f]`, length 32 or 64; DES/AES symmetric → must find the key, `encrypt`/`decrypt`; RSA asymmetric → find the public key, `encrypt`/`decrypt`.
- Learner-relevant: Quickly classify an unknown ciphertext by length/alphabet and pick the right attack; anchor = triage step at the start of any 逆向 job.
