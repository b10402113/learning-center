---
source: js逆向课件/Day20
source_hash:
  - abc2bb7bc2c59f1b3ba35e89e2c6a29ff743e70488cc99d6ef87e9ec4cbd473c
  - 02a89fd87bdbdae78941c0c1cff83e9191bdc78eb401003bc44076c2e179da6e
  - 54915ea584bb80ae236f8253cb6355c974785f9b124e50e81fffb5fbcb57858c
  - f117d5303d33278e5cb2120f8dbab38f2f52649c96d871f69b60f212cfdc3ad0
  - 071712e9435724bbc16e06c75a3b7b6c267e6fbfa98b25ec556b0e5cb0cd80f5
  - a52161fc1301d0876b437a8ffa41375f5a849f210f102eddd9b64cedce1b7a9d
  - eccbdb7a97eb4dc18576ee7b853d4f3ca2576583f20f097e54ed5acf908aa8fd
source_lines: 105
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/Day20

## Overview (L1)

- **url编码**：`urllib.parse.quote/unquote` 对单个值做百分号编码与还原，`urllib.parse.urlencode` 把字典整体编码成 `k1=v1&k2=v2` 查询串，中文和 `&` 等特殊字符都会被转义。
- **base64编码**：把字节流按 3 字节（24 位）切成 4 组 6 位，每组映射到一个可见字符；`base64.b64encode` 处理的是字节，需先 `.encode()`。
- **base64解码**：`base64.b64decode` 还原字节；密文长度非 4 的倍数时需补 `=`（`(4 - len % 4) * "="`）再解码。
- **base64变种**：URL 安全的 base64 用 `-` 替 `+`、`_` 替 `/`；解码前先 `replace("-","+").replace("_","/")` 还原成标准字母表，这是逆向中常见的坎。
- **base64图片**：`data:image/png;base64,...` 形式的内嵌图片，按逗号切出 base64 部分，解码后以二进制写文件即得原始图片。
- **摘要算法**：md5/sha1/sha256/sha512 单向散列，不可逆、同值同结果、结果定长；可 `update` 多段拼接，应用在口令存储与一致性校验。

## Sections (L2)

### url编码

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day20/01 url编码.py#url编码]]`
- Summary: `urllib.parse.quote` 将中文、`&` 等不安全字符转成百分号编码，`unquote` 还原；`urlencode` 将字典编码成表单查询串。
- Key claims: `quote("&apple123")` 会转义 `&`；`urlencode({"k1":"&123","k2":"苑"})` 生成 `k1=%26123&k2=%E8%8B%91` 形式；爬虫构造参数时中文与特殊符号必须编码
- Learner-relevant: 能对请求参数正确编码/解码，能在逆向时识别 URL 里的百分号编码内容并还原。

### base64编码

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day20/02   base64编码.py#base64编码]]`
- Summary: 手工推演示例 `#!@` → 24 位二进制 → 4 组 6 位 → 查表得 `IyEk`，说明 base64 是字节到可见字符的重编码；`b64encode` 输入输出都是字节。
- Key claims: 3 字节(24 位)切为 4 个 6 位分组，6 位(0-63)对应 `A-Za-z0-9+/` 64 字符表；`b64encode(s.encode())` 后 `.decode()` 得到字符串密文；字节不足 3 的倍数时用 `=` 补位
- Learner-relevant: 理解 base64 只是编码不是加密，看到末尾 `=` 且字符集匹配时应第一时间怀疑 base64。

### base64解码

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day20/03   base64解码.py#base64解码]]`
- Summary: `b64decode` 把 base64 串还原为字节，再 `.decode()` 得原文；当密文长度不是 4 的倍数时先补 `=` 再解码。
- Key claims: `data += (4 - len(data) % 4) * "="` 手动补齐填充符；解码结果是 bytes，需按正确字符集 decode；逆向中截取的密文常缺 `=` 填充
- Learner-relevant: 能处理逆向抓到的"缺等号"base64 密文，避免解码报错。

### base64变种

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day20/04 base64变种.py#base64变种]]`
- Summary: URL 安全 base64 变种用 `-` 替换 `+`、`_` 替换 `/`（避免 URL 保留字符冲突）；解码前需替换回标准字符再 `b64decode`。
- Key claims: 变种规则固定：`+ → -`、`/ → _`；`s.replace("-","+").replace("_","/")` 还原后即可标准解码；长密文中混入空格等杂质时也可能出现
- Learner-relevant: 识别"长得像 base64 但解不开"的字符串往往是变种，先做字符替换再解码。

### base64图片

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day20/05 base64图片.py#base64图片]]`
- Summary: 网页内嵌图片形如 `data:image/png;base64,<数据>`，用 `split(",")[-1]` 取数据段，`b64decode` 得图片字节，`open(...,"wb")` 写成 png 文件。
- Key claims: data URL 前缀声明 MIME 类型和编码方式；`split(",")[-1]` 剥离前缀；必须以二进制模式 "wb" 写文件
- Learner-relevant: 能把网页里内嵌的 base64 图片还原成可查看的图片文件。

### 摘要算法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day20/06 摘要算法.py#摘要算法]]`
- Summary: hashlib 提供 md5/sha1/sha256/sha512；先传入盐值再多次 `update` 拼接数据，`hexdigest()` 输出十六进制摘要。
- Key claims: 摘要不可逆（单向）；相同输入必得相同摘要；不同输入结果定长且内容完全不同；`md5(salt)` + `update(data)` 实现"加盐摘要"，多次 update 等价于拼接；应用：数据库口令加密、一致性校验
- Learner-relevant: 理解登录密码常以加盐 md5 存储；逆向 sign 参数时优先尝试 md5(盐+数据) 的拼接组合。
