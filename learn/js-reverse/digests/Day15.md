---
source: js逆向课件/Day15
source_lines: 114
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/Day15

## Overview (L1)

- **URL 的结构与向服务器发请求的四种形式**（笔记）：拆解 `协议://域名(80端口)/路径?查询参数`，以百度搜索 `?wd=alex` 为例；发请求的四种方式：地址栏回车（GET）、a 标签超链接（GET）、form 表单、以及 JS 的 Ajax 技术。前三种是同步、页面全覆盖、由浏览器完成；Ajax 则是 JS 技术，可类比 Python 的 requests。
- **Flask 演示服务器**（`01 server/myServer.py`）：提供 `/index`（渲染模板并注入当前时间）、`/login`（渲染登录表单页）、`/books`（`jsonify` 返回随机抽取的 4 本名著）三个路由，是后续 Ajax 请求的目标服务。
- **Ajax 前端演示页**（`01 server/templates/index.html` + `static/index.js`）：点击事件驱动，用 jQuery `$.ajax` 向 `/books` 发 GET 请求并把返回的 JSON 数组渲染进 DOM；login.html 演示 form 表单提交。
- **Python 客户端对照**（`test.py`）：用 `requests.get("http://127.0.0.1:5000/books")` 加 `res.json()` 直接消费同一接口，建立"浏览器 Ajax = Python requests"的映射。

## Sections (L2)

### URL与请求方式

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day15/笔记#URL与请求方式]]`
- Summary: 笔记拆解 URL 的组成（协议、域名/端口、路径、查询参数），并列出向服务器发送请求的四种形式及其特点。
- Key claims: URL 结构为 `协议://域名(80端口)/路径?查询参数`，如 `https://www.baidu.com/s?wd=alex`;发请求的四种形式：地址栏+回车（GET）、a 标签超链接（GET）、form 表单（登录、注册）、Ajax;前三种是同步请求、页面全覆盖、由浏览器完成;Ajax 是 JS 的技术，可理解成 Python 的 requests
- Learner-relevant: 为逆向分析打地基：看到任何请求先拆 URL 结构，再判断它是浏览器同步行为还是 JS 发出的 Ajax，这决定了逆向时要不要去找 JS 代码。

### Flask演示服务器

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day15/01 server/myServer.py#Flask演示服务器]]`
- Summary: 一个最小 Flask 服务器，含 `/index`、`/login`、`/books` 三个路由，分别演示模板渲染、表单页和 JSON 接口。
- Key claims: `/index` 用 `render_template` 渲染 index.html 并注入当前时间变量;`/books` 用 `random.sample` 从书单随机抽 4 本，以 `jsonify` 返回 JSON;`template_folder="templates"`、`static_folder="static"` 是 Flask 默认目录约定
- Learner-relevant: 提供本地可控的目标站点（127.0.0.1:5000），后续所有 Ajax/请求分析都可以在自己机器上复现和抓包。

### Ajax前端演示页

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day15/01 server/templates/index.html#Ajax前端演示页]]`
- Summary: index.html 引入本地 index.js、CDN 的 jQuery，点击段落时用 `$.ajax` 请求 `/books` 并把结果渲染到页面；配套 login.html 演示 form 表单。
- Key claims: JS 是事件驱动的：`dom.onclick = function(){...}` 绑定点击后才发请求;`$.ajax({url, type:"get", success: callback})` 发送异步请求，回调里拿到 JSON 数组;`$("p").eq(2).html(res.join(","))` 把数据写回 DOM;login.html 用 `<form action="/login">` 提交用户名密码，是同步全覆盖的对照
- Learner-relevant: 理解"页面数据不是 HTML 里带的，而是 JS 点击后从接口异步取回"——这是逆向时判断数据来源（HTML vs 接口）的直接依据。

### Python客户端对照

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day15/test.py#Python客户端对照]]`
- Summary: 用 Python `requests` 直接 GET `/books` 接口并解析 JSON，演示同一接口可以被浏览器外的客户端消费。
- Key claims: `requests.get("http://127.0.0.1:5000/books")` 拿到 Response;`res.json()` 把 JSON 响应解析为 Python 对象
- Learner-relevant: 建立"接口一旦看清，就能用 Python 复现"的逆向工作流锚点：抓到 Ajax 请求 → 照着用 requests 重放。
