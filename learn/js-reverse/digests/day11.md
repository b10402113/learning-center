---
source: js逆向课件/day11
source_hash:
  - 374b6dd599b6fc67ba7d578fceb363b31de917c5ca6a06eb0a8209f6849601a8
  - 6326dad7774fb02102cda99a23de7db06a460cec08e4922348bd0a75c1af5198
  - e451ef8a54b757cfe5259e816ee9440440fb981bdd1b489194f3a5ba4e1754fb
  - e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  - 565a23a9c215212f4d2e7e6dcb9f7d253dcc7f86561e6c464d1ee8a831a7e05c
  - ace6f71d511f85f22b4e813faa1a3e12628b4dbbf77eadf872a9173555c94f5b
  - e0a3f6b0ad17de798712118ed5fadfc97b199f806cb61837cff642a48c59b2dd
  - 9f9dbca1007b9f1d25edc2ccb44c41494914fdaaaf6646d7fdec3f5e64ad72a7
  - fe9dd85d1d32a493649baad8b0ab02b4acffd907782e71716c3b0827fd87a3f8
  - 1f6a48b265924fbd63d379ff3f88d9929a6340218c94aa7bc3dffd7f6fe97a57
  - 41de3d28e39421bf32918ad3384673fa7c62164cbe126f77144517e1a5fe10cf
  - e43d80287560268443fcaba218d0055f444eb698a0774f225d8a3ecfdb42b49f
  - 50bc1e719931dff353a61933ef2fea89acc1794a071670825a72928e80c2663d
  - ba88f16c8c497bb61afb5261ca108060c40f2d0301d9608786c4d07ef44f95d7
  - 4477647ef03e803d47478215aa44a335b9640b813cf4520607696d72a1ded4e6
  - 1fd4e2dad65c5be57cd3695b064203d4422244d05a8b91466e28ea5aa4f80e00
  - 77e566fcd877d8309e80599b7f1595efcf21eb343d3b1527b02050126464e7fa
  - 317ffd94fea63f5376e08a03cc1e81d03aaba1744268e5222fb8fb2c384e09ce
  - 541cdc8b31534ea62361c24782c8ce0318c8b7ad9b76a4f27986d8bcf25c05b3
  - e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  - 1104b3402ab25c88d895afc6c828e35f5d409afe91d0166cd3c0d87d4c2fabcb
  - c344012c62656dac500c66372ec5a7a2172d1ddf600358192f35b447797c782c
  - 55db708c15443a908c4c8f133de300723f557fec183848a0e4e672eb8e8ef122
  - 1f6a48b265924fbd63d379ff3f88d9929a6340218c94aa7bc3dffd7f6fe97a57
  - 8c4784b452aefddb5731534c66862f4ae8be85c0d3ee1e530a1a1bfeaa4b2fa6
  - 0e7547350ebd86832fe30e2ab99d60ad29cea14c97aadacbdad77ca4fa69d2cf
  - 50bc1e719931dff353a61933ef2fea89acc1794a071670825a72928e80c2663d
  - d0055ef9428061659205bfa52e6202761677cf55f8576549b3fb41f234bab604
  - 7ee07d3af990020e2eaac76b1cdb6751b54a7d1504a926e1b9c1bb01d855cd15
  - 77e566fcd877d8309e80599b7f1595efcf21eb343d3b1527b02050126464e7fa
  - 22feea8c99b005c3d5679cfa9652f265ca460aecddfab80c5680887202428284
  - e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  - fafa45e312a59b19edaf9145a28f85bef0cf1297887f150afa17056ae2be0b8a
  - 70e510ed07ceb11d4a7387223c671631d7496b9a15233ae246f232903f6a5617
  - 18eccaaff3a77ec1470699edbd61de1cebf3dbd4de30c2c8087f701cd350cc0e
  - 903df354bf30c41581444ec5ed1918f8338d6a61e38a6fef5dfebbd8bf7912d7
  - fa5f0e8ab91d7b59ce691b905b137c020dddece9c287b2b4494f18a4a9b21ef1
  - d6debb152d369e5770835aabef3e0bf7fd1c3e0635889ee2660bd19c783aff75
  - e97c7f11e78c503c336ab9e78e0c2912743c0970152ecf891ae4cd87a79738ea
  - 732ddbd0a989fa917157c66488cda2141b960858f1b953475348a44960f8321c
  - 50bc1e719931dff353a61933ef2fea89acc1794a071670825a72928e80c2663d
  - ad8feedb5d5d227d636bdaad9f087e0c8ce6db26c1290cb64bd61588d2197e1b
  - 3f76e1788d92d1ae81e20933021506c357827c3f6cb3812439a4710293cc51fe
  - 6fc92c7926b8b159be240f3f69d7e70247c1579b9bcff97b3498a58ad40854eb
  - 42a896b3b6d010d7b2a7a13832be333d03b8c313a7143213b36dca1a55174d37
source_lines: 1704
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/day11

## Overview (L1)

- 框架概念与安装（1.scrapy基础01.md#简介、#安装）：框架是集成了各种通用功能的"项目半成品"；Scrapy 是为爬取网站数据、提取结构性数据而生的应用框架，内置高性能异步下载、队列、分布式、解析、持久化等能力。学习重点是用法而非源码，前期切勿钻研源码。安装只需 `pip install scrapy`，终端能识别 scrapy 指令即成功。
- 项目创建与基本使用（#基本使用）：`scrapy startproject` 建项目、`scrapy genspider` 建爬虫文件；认识项目目录结构（items/middlewares/pipelines/settings/spiders）与爬虫文件组成（name、allowed_domains、start_urls、parse）。settings.py 三项关键配置：ROBOTSTXT_OBEY = False、LOG_LEVEL = 'ERROR'、指定 USER_AGENT。用 `scrapy crawl 爬虫名称` 运行。
- 数据解析（#数据解析）：在 parse 方法中用 response.xpath 解析页面；xpath 返回的是 Selector 对象列表，需 `extract()` 提取全部文本或 `extract_first()` 提取第一个；区分 Element 选项卡（渲染后效果）与 Network（请求对应原始响应）。
- 持久化存储两条路线（#持久化存储 及其子节）：终端指令式只存 parse 返回值到 .csv 等文本文件，简单但局限强；管道式（推荐）经 items.py 定义字段 → 爬虫 yield item → pipelines.py 的 process_item/open_spider/close_spider 处理 → settings.py 开启 ITEM_PIPELINES，可存文件也可存数据库。
- 多管道与数据库存储（2.scrapy操作02.md#管道深入操作）：一个管道类对应一个存储载体，多个管道类按优先级数字从小到大串联，item 只先交给优先级最高者，靠 return item 向下传递；示例覆盖文件、MySQL（pymysql）、Redis（lpush）三种载体。
- 多媒体资源爬取（#scrapy爬取多媒体资源数据）：用专用管道类 ImagesPipeline（依赖 Pillow），自定义子类重写 get_media_requests（请求图片地址）、file_path（指定保存文件名）、item_completed（把 item 传给下一管道），并在 settings 中开启管道、用 IMAGES_STORE 指定存储文件夹。

## Sections (L2)

### 简介

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day11/1.scrapy基础01.md#简介]]`
- Summary: 解释什么是框架（集成各种功能、通用性强的项目半成品），以及 Scrapy 作为爬取网站数据、提取结构性数据的应用框架的定位。
- Key claims: 框架 = 项目的半成品，集成高性能异步下载、队列、分布式、解析、持久化等功能; 学习框架重点是学各功能用法; 前期切勿钻研框架源码; Scrapy 是为爬取网站数据、提取结构性数据而编写的应用框架，非常出名强悍
- Learner-relevant: 建立对"框架"的正确学习心态——先会用再谈原理，避免一上来陷入源码。

### 安装

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day11/1.scrapy基础01.md#安装]]`
- Summary: Linux/mac 与 Windows 均在任意目录下 `pip install scrapy` 完成安装。
- Key claims: 安装命令为 pip install scrapy（任意目录）; 安装后终端输入 scrapy 回车无"找不到指令"提示即表示安装成功
- Learner-relevant: 能自行完成环境搭建并验证安装结果。

### 基本使用

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day11/1.scrapy基础01.md#基本使用]]`
- Summary: 演示 Scrapy 的第一个完整流程：创建项目、创建爬虫文件、编写爬虫、改配置、运行。
- Key claims: scrapy startproject 项目名称 创建项目; 项目结构含 items.py（封装数据格式）、middlewares.py、pipelines.py（管道）、settings.py（配置）、spiders 文件夹; scrapy.cfg 是项目配置信息，不要删改; scrapy genspider 爬虫名 起始url 创建爬虫文件; 爬虫类有 name（唯一标识）、allowed_domains、start_urls（默认都被 get 请求）、parse(response)（调用次数取决于请求次数）; settings 三大修改：ROBOTSTXT_OBEY = False、LOG_LEVEL = 'ERROR'、USER_AGENT 指定浏览器 UA; scrapy crawl 爬虫名称 运行（推荐，显示日志）
- Learner-relevant: 能独立跑通第一个 Scrapy 项目，理解目录结构与爬虫文件各组成部分的含义。

### 数据解析

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day11/1.scrapy基础01.md#数据解析]]`
- Summary: 以 B 站搜索页为例讲解 parse 内用 response.xpath 做数据解析的写法。
- Key claims: xpath 提取到的是 Selector 对象，文本存在对象内部; extract() 提取返回列表中每个 selector 的文本; extract_first() 提取第一个 selector 的文本; Element 选项卡是所有数据渲染完毕后的效果，Network 才是请求对应响应的具体结果; '//text()' 可取标签下所有文本再用 ''.join 拼接
- Learner-relevant: 能写出 xpath + extract 的解析代码，并理解为什么抄 Element 选项卡的 xpath 可能拿不到数据。

### 持久化存储

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day11/1.scrapy基础01.md#持久化存储]]`
- Summary: 总述两种持久化方案：基于终端指令（简单但局限强）与基于管道（推荐，效率高但编码流程多）。
- Key claims: 两种方案：终端指令式与管道式（推荐）; 管道式优点是极大提升数据存储效率，缺点是编码流程较多
- Learner-relevant: 在动手存数据前先做方案选型判断。

### 基于终端指令的持久化存储

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day11/1.scrapy基础01.md#基于终端指令的持久化存储]]`
- Summary: 将爬取数据封装为 parse 返回值，用 `-o` 参数直接存成文本文件。
- Key claims: 只可将 parse 方法的返回值存储到指定后缀的文本文件; 命令：scrapy crawl 爬虫名 -o bilibili.csv; 优点简单便捷; 缺点局限性强——存不了数据库、后缀通常限定 .csv、数据必须封装进 parse 返回值
- Learner-relevant: 掌握最快落盘的方式，并明确它何时不够用。

### 基于管道实现持久化存储

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day11/1.scrapy基础01.md#基于管道实现持久化存储]]`
- Summary: 六步编码流程：解析数据 → items.py 定义字段并封装 item → yield 提交管道 → pipelines.py 接收 → 管道内持久化 → settings 开启管道。
- Key claims: 管道只可接收 item 类型对象，不可接收其他类型; items.py 中用 scrapy.Field() 定义字段; yield item 将 item 提交给管道; process_item 接收 item，调用次数取决于提交 item 的个数，必须 return item; open_spider 只在 process_item 前调用一次（如打开文件），close_spider 只在结束后调用一次（如关闭文件）; 管道机制默认未开启，需在 settings.py 解除 ITEM_PIPELINES 注释
- Learner-relevant: 能完整实现爬取数据经管道写入文件的闭环，这是后续数据库存储与图片管道的地基。

### 管道深入操作

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day11/2.scrapy操作02.md#管道深入操作]]`
- Summary: 用多个管道类把同一份数据分别存到文件、MySQL、Redis，讲清多管道的优先级与 item 传递机制。
- Key claims: 一个管道类负责将数据存储到一个具体载体，存多个载体需定义多个管道类; 爬虫只将 item 提交给优先级最高的管道，数字越小优先级越高; 优先级最高管道的 process_item 必须 return item 才能把 item 传给下一个管道; MySQL 管道：pymysql.Connect 建连接 + cursor 执行 sql + conn.commit 提交事务，close_spider 中关闭游标和连接; Redis 管道：Redis(host, port) 建连接，lpush(列表名, item) 存入列表; ITEM_PIPELINES 字典中数字表示运行优先级（300/301/302 示例）
- Learner-relevant: 能把同一份爬取结果同时落盘文件和数据库，并解释 item 在多管道间的流转顺序。

### scrapy爬取多媒体资源数据

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day11/2.scrapy操作02.md#scrapy爬取多媒体资源数据]]`
- Summary: 用专有管道 ImagesPipeline 爬取并保存图片二进制数据（示例：pic.netbian.com）。
- Key claims: 需 pip install PIL / Pillow; 编码流程：爬虫提取图片链接 → 封装到 item 提交管道 → 自定义父类为 ImagesPipeline 的管道类并重写三个方法; get_media_requests(item, info) 对图片地址发起请求获取二进制数据; file_path(request, ...) 指定保存图片的名称; item_completed(results, item, info) 返回 item 给下一个管道（没有下一管道可不写）; settings 中开启该管道并用 IMAGES_STORE = 'girlsLib' 指定存储文件夹
- Learner-relevant: 能爬取整站图片并按自定义命名保存，理解"专用管道"与普通管道的差异。
