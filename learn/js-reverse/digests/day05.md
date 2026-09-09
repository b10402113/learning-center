---
source: js逆向课件/day05
source_lines: 330
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/day05

## Overview (L1)

- **何为数据解析**：数据解析是把爬到的数据中想要的部分单独提取出来，作用是实现聚焦爬虫；通用原理是"想要的数据存在于 html 标签中或标签属性中"，定位标签再提取数据即可。
- **聚焦爬虫编码流程**：在通用爬虫四步（指定 url、发起请求、获取响应数据）之后插入"数据解析"一步，最后持久化存储；Python 可选技术有 xpath（重点、常用便捷）、bs4、re 正则、pyquery。
- **xpath 解析**：基于 lxml（pip install lxml），流程是先创建 etree 对象加载页面源码，再调用 xpath 函数结合表达式定位标签和提取数据；表达式覆盖层级定位（/ 与 //）、索引定位（下标从 1 开始）、属性定位（//tag[@attr="value"]）、文本提取（/text() 直系、//text() 所有）与属性值提取（/@attrName）。
- **xpath 案例**：碧血剑章节爬取（局部解析用 ./ 相对路径）、简历模板下载（列表页→详情页→下载地址三级请求链）、彼岸图网图片爬取（详情页大图+多页翻页规律），巩固"requests+xpath"的标准组合。
- **防盗链**：服务器通过 referer 请求头溯源请求来源，来源不合规即阻断；破解办法是请求头携带正确的 Referer；微博图片案例还展示了 real_src 伪属性的分析技巧。
- **图片懒加载**：网页用 img 标签的伪属性（自定义属性，如 src2）存图片链接，滚到可视区才由 js 改成真正的 src；爬取时直接解析伪属性的属性值即可。

## Sections (L2)

### 何为数据解析

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day05/数据解析.md#何为数据解析]]`
- Summary: 给出数据解析的概念、作用与通用原理，并把聚焦爬虫的编码流程扩展为五步；列出 Python 四种数据解析技术选型。
- Key claims: 数据解析=从爬取到的数据中单独提取指定想要的数据；作用是实现聚焦爬虫；通用原理：数据存在于 html 标签中或标签属性中，先定位标签再提取标签内文本或属性值；聚焦爬虫流程=指定 url→发起请求→获取响应数据→数据解析→持久化存储；技术选型：xpath（重要、常用便捷）、Bs4（自行了解）、re 正则、pyquery（自行了解）。
- Learner-relevant: 理解"解析即定位标签+取值"这一通用心法，之后任何解析库都只是定位语法不同；明确 xpath 是本课程主攻方向。

### 数据解析的主流策略

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day05/数据解析.md#数据解析的主流策略]]`
- Summary: 主流策略之 xpath 的完整教学：环境安装、两步编码流程、基于 test.html 实验环境的表达式全家桶，以及碧血剑小说、简历模板、彼岸图壁纸三个综合案例。
- Key claims: 环境为 pip install lxml；流程为先创建 etree 对象加载源码（本地文件用 etree.parse，网络页面用 etree.HTML）再调用 xpath 函数；定位表达式：/html/head/meta 绝对路径、//meta 相对定位、//div[1] 索引定位（下标从 1 开始）、//div[@class="song"] 属性定位、//div[@class="tang"]/ul/li/a 层级定位、//div[@class="tang"]//a 跨层级定位；提取表达式：/text() 取直系文本、//text() 取所有文本、//img/@src 取属性值；局部解析用 ./a/text()，. 表示 xpath 的调用者本身；案例套路均为"列表页解析出详情 url+标题→请求详情页→解析正文/下载地址→存储"，多页爬取靠 url 翻页规律（如 free_%d.html、index_%d.html）；彼岸图网需 response.encoding='gbk' 处理编码。
- Learner-relevant: 能独立写出"列表页→详情页→下载"三级请求链的聚焦爬虫，熟练运用 xpath 表达式定位与取值，掌握局部解析 ./ 的相对路径技巧。

### 防盗链

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day05/数据解析.md#防盗链]]`
- Summary: 讲解防盗链反爬原理（referer 溯源）与破解方法，以微博图片抓取为例演示 real_src 伪属性分析与 Referer 请求头携带。
- Key claims: referer 是 HTTP 表头字段，以 URL 格式表示从哪个链接跳转而来，服务器据此溯源，来源不合规立即阻止或返回指定页面；微博案例中 Element 面板看到的 src 与 network 源码不一致，真正要解析的是 real_src 伪属性；直接请求 real_src 图片不显示，加上 Referer 请求头即可，Referer 值从抓包工具中图片数据包的 request headers 获取。
- Learner-relevant: 掌握"抓不到图片先查 Referer"的排错反射，学会比对 Element 与源码差异发现伪属性，这是后续 js 逆向中"前后端数据不一致"分析的前置训练。

### 图片懒加载(作业)

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day05/数据解析.md#图片懒加载(作业)]]`
- Summary: 以站长网美女图片为作业，讲解图片懒加载技术的原理（伪属性存链接、可视区时 js 替换为 src）与爬取对策（直接解析伪属性值）。
- Key claims: 懒加载指网页刷新后只先加载局部几张图片，滚动到浏览器可视化区域时才动态请求加载；实现方式是用 img 标签的伪属性（自定义属性）存储图片链接而非真正的 src（链接一旦写入 src 会被立即加载），进入可视区后 js 把伪属性改写为 src；爬取对策：解析图片时定位伪属性的属性值即可。
- Learner-relevant: 建立"属性可能撒谎"的意识——爬不到图片时检查 src 是否被替换成了伪属性，直接解析伪属性即可拿到真实链接。
