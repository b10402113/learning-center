---
source: js逆向课件/Day21
source_lines: 600
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/Day21

## Overview (L1)

- **AES 对称加密**：pycryptodome 的 `AES.new(key, MODE_CBC, iv)` 加密，key 与 iv 都必须 16 字节，明文须 `pad` 到 16 的倍数；密文通常再做 base64 编码传输。
- **AES 解密**：流程与加密对称——base64 解码 → `aes.decrypt` → `unpad` 去填充 → `.decode()` 得原文；key/iv 错了则解不出正确结果。
- **RSA 公私钥**：`RSA.generate(1024)` 生成密钥对，公钥/私钥分别导出为 PEM 文件；公钥加密私钥解密用于数据加密，反向用于数字签名。
- **RSA 加密与解密**：`PKCS1_v1_5` 套件用公钥 `encrypt`、私钥 `decrypt`；密文同样做 base64 编解码以适配网络传输。
- **JS 版本的算法**：网页端用 CryptoJS 实现同样的 md5 与 AES-128-CBC（PKCS7 填充），key/iv 用 `CryptoJS.enc.Utf8.parse` 转换；Python 与 JS 的算法结果可以互解。
- **解密 JS 的 AES 数据 + 自己爬虫自己**：从网页 JS 中抠出 key/iv，用 Python 复现其 AES 加密生成 sign 参数，绕过自己写的带签名校验的 Flask 接口——逆向还原加密流程的完整闭环。
- **断点调试**：PyCharm 与浏览器 DevTools 对顺序执行的小脚本打断点，逐行观察变量取值，是逆向分析加密流程的基本功。

## Sections (L2)

### AES对称加密

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/01 aes对称加密.py#AES对称加密]]`
- Summary: 演示 AES-128-CBC 加密全流程：`pad` 填充明文 → `AES.new(key, mode=AES.MODE_CBC, iv)` → `encrypt` 得密文字节 → base64 编码成可传输字符串。
- Key claims: key 必须正好 16 字节（AES-128）；iv 必须正好 16 字节；明文须填充到 16 的倍数（`pad(data.encode(), 16)`）；约定俗成"先 AES 加密，再 base64 编码"传输；对称加密加解密共用同一 key
- Learner-relevant: 抓包看到 base64 密文且前端有 CryptoJS 时，能按此流程在 Python 里复现加密。

### AES算法解密

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/02 aes算法解密.py#AES算法解密]]`
- Summary: 加密的逆操作：base64 解码得密文字节 → 用相同 key/iv 构建 AES 对象 `decrypt` → `unpad(data, 16)` 去填充 → `.decode()` 还原原文。
- Key claims: 解密用的 key/iv 必须与加密完全一致（示例中 iv 不同即解错）；`unpad` 去掉 PKCS7 填充字节；流程为 base64 解码 → AES 解密 → unpad → decode
- Learner-relevant: 拿到 key/iv 后能独立解出密文；解出乱码时第一反应是核对 key/iv/模式。

### RSA非对称加密的公私钥

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/03 rsa非对称加密的公私钥.py#RSA非对称加密的公私钥]]`
- Summary: `RSA.generate(1024)` 生成密钥对，`publickey().exportKey()` 与 `exportKey()` 分别把公钥、私钥写入 `rsa.public.pem` / `rsa.private.pem`。
- Key claims: 公钥可分发、私钥保密；PEM 是密钥的文本存储格式；1024 位为示例强度；与 AES 不同，RSA 加解密双方持有不同密钥
- Learner-relevant: 理解非对称加密的角色分工，能识别网站下发的 PEM 公钥文件。

### RSA加密

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/04 rsa加密.py#RSA加密]]`
- Summary: 公钥加密流程：读入 `rsa.public.pem` → `RSA.importKey` 得公钥对象 → `PKCS1_v1_5.new` 构建算法对象 → `encrypt` 加密 → base64 编码输出。
- Key claims: 公钥加密、私钥解密用于数据加密；私钥加密、公钥解密用于数字签名；`PKCS1_v1_5` 是常用的 RSA 填充方案；密文同样先 base64 编码再传输
- Learner-relevant: 遇到前端用公钥加密提交数据（如登录密码）时，能识别其 RSA+base64 的组合套路。

### RSA算法解密

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/05 rsa算法解密.py#RSA算法解密]]`
- Summary: 私钥解密流程：base64 解码 → 读入私钥 PEM → `RSA.importKey` → `PKCS1_v1_5.new` → `decrypt(encrypt_data, None)` 还原原文。
- Key claims: 解密方必须持有私钥；`rsa.decrypt(encrypt_data, None)` 第二参为哨兵值；与 AES 解密同为"base64 解码在前"的固定顺序
- Learner-relevant: 完成 RSA 加解密闭环，理解"只有私钥持有方能解密"的直觉。

### JS版本的算法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/06 JS版本的算法.js#JS版本的算法]]`
- Summary: 网页端用 CryptoJS 实现与 Python 互通的加密：`CryptoJS.MD5(data).toString()` 出 md5；`CryptoJS.AES.encrypt` 以 `enc.Utf8.parse` 的 key/iv、CBC 模式、Pkcs7 填充做 AES-128 加密。
- Key claims: `CryptoJS.enc.Utf8.parse('...')` 把字符串转成 CryptoJS 的字参数；`{iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}` 对应 Python 的 CBC+PKCS7；`encrypted.toString()` 默认输出 base64 密文；JS 端算出的结果与 Python 端互解一致
- Learner-relevant: 前端逆向的核心对象——能在压缩代码里认出 CryptoJS 的调用形态并提取 key/iv。

### 解密js的aes加密数据

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/07 解密js的aes加密数据.py#解密js的aes加密数据]]`
- Summary: 用 Python 解密由 06 的 JS 代码加密出的密文：base64 解码 → 用 JS 里的同一 key/iv 做 AES-CBC 解密 → unpad 还原，验证两端算法互通。
- Key claims: key=`0123456789abcdef`、iv=`1234567890abcdef` 与 JS 端逐字一致；JS 的 Pkcs7 填充即 Python 的 `pad/unpad(...,16)`；跨语言加解密成立的前提是 key/iv/模式/填充四要素一致
- Learner-relevant: 建立"前端加密、后端复现解密"的完整心智模型，是逆向加密参数的模板。

### 自己爬虫自己

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/08 自己爬虫自己.py#自己爬虫自己]]`
- Summary: 模拟逆向实战：目标 Flask 接口要求带 `sign`（AES 加密的参数 JSON）才能返回数据；爬虫端把参数 `json.dumps` 后用约定 key/iv AES 加密、base64 编码，作为 sign 拼进请求成功取回数据。
- Key claims: 签名校验接口的通用形态——sign = base64(AES(json(参数)))；`json.dumps(my_params)` 保证拼接顺序稳定；逆向任务的目标就是把这套加密流程从 JS 中还原并在 Python 复现
- Learner-relevant: 站在攻防两侧各写一遍，体会加密参数逆向的完整闭环与套路。

### 断点应用

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/09 断点应用.py#断点应用]]`
- Summary: 极简的顺序赋值打印脚本（x/y/z 三个变量），用作 PyCharm 断点练习素材：打断点后逐行执行，观察变量面板中取值变化。
- Key claims: 断点让程序在指定行暂停；单步执行可逐行观察变量；调试器是分析加密流程、定位关键函数的手段而非目的
- Learner-relevant: 把"打断点、看变量"内化为逆向分析的第一反应。

### JS的断点

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day21/10 JS的断点.js#JS的断点]]`
- Summary: 与 09 对应的 JS 版顺序脚本，在浏览器 DevTools Sources 面板对 JS 代码打断点、单步执行、查看变量，为后续在真实网页里断点分析加密函数做铺垫。
- Key claims: DevTools Sources 面板可对任意加载的 JS 文件打断点；断点暂停时可查看调用栈与作用域变量；配合搜索/格式化（pretty print）定位加密函数
- Learner-relevant: 掌握浏览器端断点调试，进入"JS 逆向"的主战场工具链。
