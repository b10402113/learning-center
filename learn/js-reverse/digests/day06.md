---
source: js逆向课件/day06
source_hash:
  - 83dcde6795213ba18a2bbd85f053bb728f1a07a7e0cac84ed34d887cff55735b
  - 33983b41957e1ba5187187fa8aad7c70c76fb19584b6fa490fb59c09653fd2fd
  - 1de639eac2edc1f438a1958b13fa77b704254be0d0debca892030ac45eb5d476
  - 66edc12c99f62d91e54790f2c1d2f778a775ed3e708c693ddbca4e9b7e359ded
  - f0798750d4791ae7faef65a8b88525c639e2fab31e4934df3a066467eb0df37c
  - c13e80ed33f624895c4a44fef8e18cbf7f7e1e6c986917f43914e43f36c4708d
  - b07395ec9fb1dcb15a048b3a1af1435979328d402dd8a9b764053b832d5744e8
  - 5e1d24f7a266590119f0288bc597b1fd15dfcdcbc1a4c3286f453246931bbf44
source_lines: 354
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/day06

## Overview (L1)

- **视频数据爬取**：视频播放地址不在页面明文里，需抓包点击播放定位视频数据包找规律；51miz 案例中真正的地址藏在 video 标签下 source 子标签的 src 属性（需补全 https: 协议头）。
- **Cookie**：cookie 是服务器创建、返回并保存在客户端的键值对数据，下次访问自动携带（免密登录的典型基础）；雪球网案例说明只带 UA 不够时，模拟力度的重点通常放在请求头的 cookie 上。
- **Cookie 两种处理方式**：手动处理（复制抓包 cookie 到 headers，缺点是有时效性和动态变化数据）与自动处理（session 对象——先发一次请求捕获 cookie 存入 session，再用携带 cookie 的 session 发后续请求，至少两次请求）。
- **模拟登录**：17k 书架案例演示"session.post 登录接口拿 cookie → session.get 动态加载接口拿数据"的标准模拟登录流程。
- **代理**：代理服务器转发请求和响应，用来隐藏客户端真实 ip、对抗 ip 黑名单；按匿名度分透明/匿名/高匿（推荐高匿），按类型分 http/https；实战包括单代理测试与代理池批量爬取。
- **验证码**：接入图鉴平台（ttshitu.com）打码服务，把验证码图片 base64 编码后 POST 到识别接口，按 typeid 支持数英混合、计算题、汉字、坐标点选、缺口识别、拼图等几乎全部验证码类型。

## Sections (L2)

### 视频数据爬取

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day06/requests高级.md#视频数据爬取]]`
- Summary: 以 51miz 视频站为例，讲解如何通过抓包定位视频播放数据包、观察地址规律，并在页面源码中找到存放播放地址的标签进行爬取。
- Key claims: 视频详情页页面数据中看不到播放地址，只有播放图片；打开抓包工具点击播放按钮可找到视频播放数据包，播放地址形如 https://video-js.51miz.com/preview/video/00/00/11/63/V-116374-7B5E698E.mp4；video 标签的 poster 属性只含地址的相似部分且测试不可用，真正的播放地址在其子标签 source 的 src 属性中，需补全 "https:" 协议头；下载用 requests.get().content 二进制写入，文件名可从地址按 / 切分取末段。
- Learner-relevant: 学会"抓包找数据包→找地址规律→回页面源码找载体标签"的视频爬取三步法，理解媒体资源往往藏在子标签属性而非主标签中。

### Cookie

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day06/requests高级.md#Cookie]]`
- Summary: 讲解 cookie 的本质与作用，用雪球网热帖案例演示"只带 UA 拿不到数据 → 补 cookie 即可"的诊断过程，并对比 cookie 的手动处理与 session 自动处理两种方式。
- Key claims: cookie 本质是键值对形式的数据，由服务器创建返回给客户端保存在浏览器中，下次访问自动携带，典型案例是免密登录；拿不到数据唯一原因是模拟力度不够，模拟重点通常在请求头；雪球热帖是 ajax 动态加载，请求参数（如 max_id）拼接在 url 后且可能动态变化；手动处理 cookie 的缺点是编写麻烦、存在有效时长、可能含实时变化的局部数据；自动处理基于 session 对象：创建空白 session→用 session 发请求捕获服务器下发的 cookie→再用携带 cookie 的 session 请求目标网址，至少需要两次请求。
- Learner-relevant: 掌握 session 自动处理 cookie 的标准套路，形成"数据拿不到先查请求头、尤其 cookie"的排错优先级。

### 模拟登录

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day06/requests高级.md#模拟登录]]`
- Summary: 以 17k 小说网站架数据为例，演示用 session.post 提交登录表单捕获 cookie，再携带 cookie 请求书架动态接口获取登录后数据的完整模拟登录流程。
- Key claims: 登录请求 post 到 https://passport.17k.com/ck/user/login，data 携带 loginName 与 password；书架数据是动态加载接口 https://user.17k.com/ck/author/shelf 返回的 json；流程为 session.post(登录) 拿 cookie → session.get(书架接口).json() 拿数据。
- Learner-relevant: 能把 cookie 知识落成"登录拿 cookie、带 cookie 访问受保护接口"的可复用模拟登录模板。

### 代理

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day06/requests高级.md#代理]]`
- Summary: 系统讲解代理的概念与作用、匿名度三档与协议类型两档，并通过 cip.cc 查本机 ip、单代理验证、代理池批量爬取三级实战演示 requests 中 proxies 参数的使用。
- Key claims: 代理服务器用来转发请求和响应；高频请求会被网站检测并把客户端 ip 加入黑名单，使用代理后服务器看到的是代理 ip；匿名度分透明（知道用代理且知道真实 ip）、匿名（知道用代理但不知真实 ip）、高匿（都不知道，推荐）；类型分 http（只转发 http 请求）与 https；requests 使用 proxies={'http':'ip:port'} 参数；代理来源如芝麻代理；实战可构建代理池（封装多个代理 ip:端口的容器），用 random.choice 随机取代理配合 time.sleep 批量爬取以避免本机 ip 被封。
- Learner-relevant: 理解代理在反反爬中的定位，能按匿名度和协议类型正确选购代理，并写出带代理池的批量爬虫。

### 验证码

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day06/requests高级.md#验证码]]`
- Summary: 介绍图鉴平台打码服务的接入流程：注册后从开发文档提取源码、封装 tujian.py 模块，把验证码图片 base64 编码后提交识别接口，按 typeid 识别各类验证码。
- Key claims: 推荐图鉴平台 http://www.ttshitu.com/；封装流程为读取图片→base64 编码→POST 到 http://api.ttshitu.com/predict（json 携带 username/password/typeid/image）→返回 result；typeid 覆盖纯数字/纯英文/数英混合、闪动 GIF、计算题、汉字、通用文字、问答题、recaptcha、旋转角度、坐标点选（1~8 个坐标、轨迹）、缺口识别（返回 X 轴坐标）、拼图识别等类型；可识别本地滑动验证和坐标点击验证。
- Learner-relevant: 遇到验证码拦截时知道"打码平台+typeid 对照表"是工程上的标准解法，为后续遇到滑块/缺口验证的逆向分析提供先修认知。
