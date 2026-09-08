---
source: js逆向课件/Day25
source_hash:
  - c7c46d764b6d10dbf2f06f638ca9761585101e23a74a5026a77e950996dd2ed7
  - 1021e8e5de11a0ffecf4568c7f3ecf09c8e86097eb807689235f280b6816c99b
  - 177cf5b30284ef300ff0fed548dd0f4eeca65589c24204780903fbebb93a039c
  - 153cfc65313c47dd28a56e58fac5ccfe7da48315c8868c4316550f9140b0091e
source_lines: 209
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/Day25

## Overview (L1)

- **丁香网（dxy.cn）病例搜索接口逆向**：完整的"Python 请求 + execjs 调 JS 算 sign"实战案例。目标接口为 `www.dxy.cn/bbs/newweb/case-bank/page-post-info`（GET），请求参数中 `sign` 由 JS 计算生成。
- **sign 参数的构成与拼接规则**：明文串按 `appSignKey=...&keyword=...&noncestr=...&pageNum=...&pageSize=...&sectionCode=0&serverTimestamp=...&timestamp=...` 顺序拼接（key 需按字典序排序），再经 JS 算法加密得到 sign。`noncestr` 为 8 位随机数字（左补零），`timestamp` 为毫秒时间戳，`serverTimestamp = timestamp - 2`。
- **JS 端实为 SHA1 实现**：`02 丁香网.js` 是扣下来的加密代码，核心函数 `u(data)` 走 bytes→words→80 轮循环→hex 的流程，即标准 SHA1；Python 侧用 `execjs.compile(...).call("u", data)` 拿到 sign 后拼进 params 发请求。
- **辅助内容**：`03 test.py` 是 Python 列表推导式的热身练习（注释状态）；`今日作业` 布置对极简壁纸站 `bz.zzzmh.cn` 做逆向（Day26 完成）。

## Sections (L2)

### 丁香网

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day25/01 丁香网.py#丁香网]]`
- Summary: Python 侧完整爬虫脚本：构造 cookies/headers，生成 noncestr 与毫秒 timestamp，按固定顺序拼接含 appSignKey 的明文串，用 execjs 调用 `02 丁香网.js` 的 `u` 函数算出 sign，再 GET 病例搜索接口。
- Key claims: 请求参数含 keyword/sectionCode/pageSize/pageNum/serverTimestamp/timestamp/noncestr/sign；noncestr 用 `str(random.randint(0, 100000000)).rjust(8, '0')` 生成 8 位随机数字；serverTimestamp 取 `timestamp - 2`；明文串各参数按字典序排列拼接；sign 通过 `execjs.compile(open("02 丁香网.js").read()).call("u", data)` 计算。
- Learner-relevant: 掌握"分析参数 → 定位加密函数 → 扣 JS → execjs 补参调用 → 带回 Python 请求"的标准逆向工作流。

### 丁香网sign算法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day25/02 丁香网.js#丁香网sign算法]]`
- Summary: 从浏览器扣下的加密 JS，导出函数 `u(e)`：内部模块 `o` 提供 bytes/words/hex/base64 转换工具，`s` 为核心哈希函数，`u` 把结果转成十六进制字符串返回，即一个手写的 SHA1 实现。
- Key claims: `s` 使用 1732584193、-271733879 等五个初始值和 80 轮循环，是 SHA1 的特征；入口 `u(e)` = `bytesToHex(wordsToBytes(s(e)))`；utf8 处理经 `unescape(encodeURIComponent(e))` 转字节；Webpack 风格的 `n(e,t)` 手写模块加载器（`t.exports`）在扣代码时可直接整体搬运。
- Learner-relevant: 学会识别 SHA1 的代码特征（初始魔数 + 80 轮位运算），知道扣下来的自包含加密模块可以不改逻辑直接在 Node 里跑。

### 列表推导式热身

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day25/03 test.py#列表推导式热身]]`
- Summary: 全部为注释的 Python 热身代码：把 for 循环 append 改写为列表推导式，并演示带 `if` 过滤条件的写法。
- Key claims: `l2 = [i * i for i in l if i % 2 != 0]` 等价于 for 循环 + 条件判断 + append。
- Learner-relevant: 复习 Python 列表推导式，为写爬虫脚本时的简洁数据处理做准备。

### 今日作业

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day25/今日作业#今日作业]]`
- Summary: 作业只有一个目标 URL：`https://bz.zzzmh.cn/index`（极简壁纸站），要求学员独立完成该站的接口逆向。
- Key claims: 该站接口返回 RC4+Base64 加密数据，Day26 的 `07 极简壁纸.py` / `08 极简壁纸.js` 即本作业的讲解答案。
- Learner-relevant: 先自己尝试再对照 Day26 答案，检验独立逆向一个加密响应网站的能力。
