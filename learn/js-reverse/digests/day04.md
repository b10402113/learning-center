---
source: js逆向课件/day04
source_hash:
  - 1de639eac2edc1f438a1958b13fa77b704254be0d0debca892030ac45eb5d476
  - 66edc12c99f62d91e54790f2c1d2f778a775ed3e708c693ddbca4e9b7e359ded
  - f0798750d4791ae7faef65a8b88525c639e2fab31e4934df3a066467eb0df37c
  - c13e80ed33f624895c4a44fef8e18cbf7f7e1e6c986917f43914e43f36c4708d
  - b07395ec9fb1dcb15a048b3a1af1435979328d402dd8a9b764053b832d5744e8
  - 67d5782e81e8f002807e800ef563fcd900433941b1a49ed695e11207acee0c1c
source_lines: 311
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/day04

## Overview (L1)

- **爬虫相关介绍**：爬虫是通过编写程序"模拟"浏览器上网并"抓取"数据的过程；按应用场景分为通用、聚焦、功能、增量式、分布式五类。核心诊断思路：爬不到想要的数据，唯一原因是"程序模拟浏览器的力度不够"。
- **矛与盾与 robots 协议**：反爬机制是网站阻止采集的手段，反反爬策略是爬虫破解反爬的手段，二者贯穿整个课程；Robots 协议（网络爬虫排除标准）只是"盗亦有道"的君子协议，靠爬虫自觉遵守，起不到技术防止作用。
- **爬虫合法性探究**：爬虫技术本身中立、不被法律禁止，但获取数据的行为有违法风险；风险集中在强破反爬、干扰网站运营、抓取受法律保护数据三方面，对应的三条自保原则是遵守 robots、避免干扰运营、审查并删除敏感抓取内容。
- **requests 基础操作**：requests 是基于网络请求的模块（pip install requests），编码流程四步为指定 url → 发起请求 → 获取响应数据 → 持久化存储；以东方财富首页爬取为入门案例。
- **常见问题与技巧**：中文乱码用 response.encoding = 'utf-8' 解决；GET 参数用 params 字典封装、POST 参数用 data 携带；UA 检测用 UA 伪装破解；动态加载数据需抓包定位真正的数据包并模拟请求（注意携带 Referer）。
- **图片数据爬取**：两种方式——requests 的 content 属性拿二进制数据写文件（可配合 UA 伪装），或 urllib.request.urlretrieve 直接按地址存储（无需 UA 时更简洁）。

## Sections (L2)

### 爬虫相关介绍

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day04/requests基础.md#爬虫相关介绍]]`
- Summary: 定义什么是爬虫（模拟浏览器上网抓取数据），并按应用场景给出五类爬虫分类，同时引出反爬/反反爬的对抗关系与 Robots 君子协议。
- Key claims: 爬虫=模拟浏览器+抓取数据，浏览器本身是纯天然爬虫工具；分类为通用（整页源码）、聚焦（页面局部数据，建立在通用之上）、功能（浏览器/app 自动化操作）、增量式（监测网站更新）、分布式（机群联合爬取）；爬不到数据的唯一原因是模拟浏览器的力度不够；反爬机制对应门户网站、反反爬策略对应爬虫程序；Robots 协议全称"网络爬虫排除标准"，需自觉遵守而无强制力。
- Learner-relevant: 建立课程的世界观——一切爬虫问题都归结为"模拟力度"，后续每个案例都是这一原则的具体展开；五类分类帮助定位自己要写的爬虫类型。

### 爬虫合法性探究

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day04/requests基础.md#爬虫合法性探究]]`
- Summary: 论证爬虫技术本身中立合法，但使用行为存在违法风险，并列出三大风险与三条避坑原则。
- Key claims: 爬虫批量获取前端公开信息原则上合法，配合黑客技术攻击后台窃取数据则违法；风险三方面：强行突破反爬措施、干扰被访问网站正常运营、抓取受法律保护的特定数据；自保三原则：遵守 robots 协议、优化代码避免干扰运行、审查抓取内容并及时删除个人信息/隐私/商业秘密；搜索引擎类"善意爬虫"被欢迎，抢票软件类高频"恶意爬虫"被厌恶。
- Learner-relevant: 在写第一行爬虫代码前建立法律与道德边界意识，知道哪些操作绝对不能做。

### requests基础操作(代码实操重点！！！)

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day04/requests基础.md#requests基础操作(代码实操重点！！！)]]`
- Summary: requests 模块的完整入门：编码四流程，以及东方财富、51游戏搜索、人事考试网（UA 检测/POST）、智慧职教（动态加载）、肯德基、图片爬取等递进案例。
- Key claims: 编码流程为指定 url→发起请求→获取响应数据→持久化存储；response.text 返回字符串、response.content 返回二进制、response.json() 直接反序列化；中文乱码用 response.encoding='utf-8' 处理；GET 参数用 params 字典、POST 参数用 data 字典封装；User-Agent 是请求载体身份标识，UA 检测的反反爬是 UA 伪装；动态加载数据=不是通过浏览器地址栏 url 请求到的数据，需抓包工具 Ctrl+F 全局搜索定位数据包，再提取 url/请求参数模拟请求，且请求头常需携带 Referer；图片爬取方式一为 requests.get().content 写 wb 文件（需 UA 伪装时用），方式二为 urlretrieve(img_url, 路径) 直接存储。
- Learner-relevant: 掌握 requests 爬虫的标准编码范式与两大反爬破解（UA 伪装、动态数据包定位），能独立完成页面爬取、搜索参数处理、动态数据抓取和图片下载。
