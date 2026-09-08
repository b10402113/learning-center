---
source: js逆向课件/Day22
source_hash:
  - 415184bfb58143da3bc3a575ad391eae1bca19b211b328358173eafd8a39e7d3
  - a9d66bc1d6d882ac71bf9c915cf4c4680b02ac9d342a41bacc52aee41f8eac32
  - 7e196c52f8e42f5c5a2099d750c003a721034cb46e44bf5285cf7c0a9dda8c2d
  - 415184bfb58143da3bc3a575ad391eae1bca19b211b328358173eafd8a39e7d3
  - a9d66bc1d6d882ac71bf9c915cf4c4680b02ac9d342a41bacc52aee41f8eac32
  - 7e196c52f8e42f5c5a2099d750c003a721034cb46e44bf5285cf7c0a9dda8c2d
  - 2094bf86c43ab51ff28c5e04108b58d28059437c7e2f68556b89c66f0256dac8
  - 2094bf86c43ab51ff28c5e04108b58d28059437c7e2f68556b89c66f0256dac8
source_lines: 220
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/Day22

## Overview (L1)

- **断点和请求堆栈**：用一个纯前端 HTML 演示页构造 test01→test06 的函数调用链，数据加密发生在 test02、ajax 发送在 test06；配合浏览器断点与 Call Stack 面板可逐层回溯调用堆栈，定位加密函数的真实位置。
- **关于逆向爬虫的技巧**：逆向值的三大藏身位置——查询参数与 form 数据、请求头、cookie；定位入口的两类方法：请求堆栈+加密数据、关键字搜索（关联 key、url 路径、敏感词 md5/sha1/encrypt/decrypt/JSON.stringify/JSON.parse）。
- **有道翻译抓包基线**：用 requests 复刻 POST https://dict.youdao.com/webtranslate 的完整抓包请求，暴露出动态参数 sign 与 mysticTime；硬编码抓包值会过期失效，由此引出下一日的 sign 逆向。
- **今日作业**：预习毛毛租网站（https://www.maomaozu.com/#/build 及 build.json 接口），为 Day24 的 AES 加解密实战案例做铺垫。

## Sections (L2)

### 断点和请求堆栈

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day22/01 断点和请求堆栈.html#断点和请求堆栈]]`
- Summary: 用一个纯前端 HTML 演示页构造 test01→test06 的函数调用链，数据加密发生在 test02、ajax 发送在 test06；配合浏览器断点与 Call Stack 面板可逐层回溯调用堆栈，定位加密函数的真实位置。
- Key claims: 函数调用链 test01→test06；encrypt 函数在 test02 中执行加密；test06 负责发送 ajax 请求；通过浏览器 Call Stack 面板可逆向回溯调用来源；适用于定位真实加密函数位置
- Learner-relevant: 建立"请求堆栈回溯"的基本思路——从请求入口逐层向上找加密逻辑，是逆向定位的第一步锚点。

### 关于逆向爬虫的技巧

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day22/02 关于逆向爬虫的技巧#关于逆向爬虫的技巧]]`
- Summary: 总结逆向值三大藏身位置（查询参数与 form 数据、请求头、cookie），并给出定位入口的两类方法：请求堆栈+加密数据、关键字搜索。
- Key claims: 逆向值位置分三类——数据中、请求头、cookie；入口定位方法一为请求堆栈配合加密数据追踪；方法二为关键字搜索（关联 key、url 路径、敏感词 md5/sha1/encrypt/decrypt/JSON.stringify/JSON.parse）
- Learner-relevant: 把"找加密参数"从盲目试错变成按图索骥；关键字搜索是堆栈法之外的备选入口，当调用栈深或混淆时尤为有效。

### 有道翻译抓包基线

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day22/03 有道翻译.py#有道翻译抓包基线]]`
- Summary: 用 requests 复刻 POST https://dict.youdao.com/webtranslate 的完整抓包请求，暴露出动态参数 sign 与 mysticTime；硬编码抓包值会过期失效，由此引出下一日的 sign 逆向。
- Key claims: 有道翻译接口为 POST https://dict.youdao.com/webtranslate；请求体含动态参数 sign 和 mysticTime；硬编码的 sign/mysticTime 会过期失效；sign 字段是后续逆向的核心目标
- Learner-relevant: 从"能抓包复刻"到"发现动态参数不可复用"，自然过渡到 Day23 的 sign 逆向实战，建立问题驱动的学习动机。

### 今日作业

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day22/今日作业#今日作业]]`
- Summary: 预习毛毛租网站（https://www.maomaozu.com/#/build 及 build.json 接口），为 Day24 的 AES 加解密实战案例做铺垫。
- Key claims: 预习目标为 maomaozu.com 及其 build.json 接口；该接口涉及 AES 加解密；是 Day24 的核心实战案例
- Learner-relevant: 提前熟悉目标站点的请求结构，降低 Day24 进入 AES 加密时的认知负担。
