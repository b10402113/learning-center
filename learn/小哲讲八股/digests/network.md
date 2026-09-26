---
source: 小哲八股-计算机网络
source_type: codebase
source_lines: 2116
language: markdown
file_count: 43
status: absorbed
created: 2026-09-26
absorbed_at: 2026-09-26
updated: 2026-09-26
---

# Digest — 计算机网络

## Overview (L1)

- 分层模型与课程地图 — 导学立起"URL 视角 + 协议拟人"的学习主线，文件 1–2 给出 OSI 七层与 TCP/IP 四层的分层与映射，是全篇的架构总纲。
- HTTP 协议与版本演进 — 文件 3–12 覆盖请求-响应/无状态本质、状态码、报文头、请求方法、GET/POST 对比、缓存，以及 1.0→1.1（长连接/Host/Range）→2.0（多路复用/二进制分帧/HPACK）→3.0（QUIC）的完整改进链。
- HTTPS 加密与证书 — 文件 13–15 讲混合加密（非对称换密钥、对称传数据）与 CA 证书的生成/验证，解决密钥传递、通信效率与身份认证三个问题。
- TCP/UDP 基础与报文结构 — 文件 16、17、35 对比 TCP 与 UDP 的连接性/可靠性/传输方式/开销，拆解 TCP 20 字节首部与 UDP 8 字节首部字段。
- TCP 连接生命周期（握手/挥手/状态机）— 文件 18–27 覆盖三次握手、四次挥手、为什么 3/4 次、ISN 随机化、握手携带数据、2MSL、TIME_WAIT/CLOSE_WAIT 堆积的成因与治理。
- TCP 可靠传输与流控拥塞 — 文件 28–31 以序列号+ACK+超时重传为骨架，叠加快速重传、滑动窗口流量控制与慢启动/拥塞避免/快恢复的拥塞控制。
- TCP 攻击防御与链路/网络层诊断 — 文件 32、34 讲 SYN Flood 与 SYN Cookie；文件 40–42 讲 ARP 解析、ARP 欺骗防范，以及 ping 只走 ICMP 无法测端口。
- DNS 与 URL 到页面加载 — 文件 37–39 讲 DNS 递归+迭代查询、UDP/TCP 选择与 HOSTS 文件；文件 36 把 DNS→TCP/TLS→HTTP→渲染串成完整链路，文件"高频热题"是面试重点索引。

## Sections (L2)

### 计算机网络导学

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/计算机网络导学.md#计算机网络导学]]`
- Summary: 交代为什么死磕网络，指出死记硬背与陷入报头细节两个误区，给出"宏观 URL 视角 + 微观协议拟人"的学习方法。
- Key claims: 网络考点固定、性价比高，能排查超时/丢包/延迟；TCP 是强迫症、UDP 是急性子、HTTP 是无情快递员；网络设计全是权衡，要带着"为什么这么设计"去读。
- Learner-relevant: 全篇学习动机与方法的入口锚点，确立"权衡"这一贯穿始终的判断标准。

### 1.计算机网络这门课主要是讲什么

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/1.计算机网络这门课主要是讲什么.md#1.计算机网络这门课主要是讲什么]]`
- Summary: 用"协议栈"概括网络课程：分散主机如何按既定规则连接并准确高效交换数据，按分层模型解构为四个子问题。
- Key claims: 物理/链路层解决信号传输与点对点连接；网络层解决主机到主机的寻址路由；传输层用端口区分进程并处理丢包/太快；应用层定义 HTTP、DNS 等交互格式。
- Learner-relevant: 建立"分层解耦复杂通信"的总纲，是后面所有协议归位的坐标系。

### 2.TCP_IP分层模型和ISO分层模型分别是怎样的？有什么区别？

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/2.TCP_IP分层模型和ISO分层模型分别是怎样的？有什么区别？.md#2.TCP/IP 分层模型和 ISO 分层模型分别是怎样的？有什么区别？]]`
- Summary: 对比理论化的 OSI 七层与实用化的 TCP/IP 四层，讲清合并关系与各自适用场景。
- Key claims: OSI 分层细致但过于复杂未被业界普及；TCP/IP 把会话/表示/应用合并为应用层、物理/链路合并为网络接口层；TCP/IP 因务实成为互联网事实标准。
- Learner-relevant: 分层的核心对照锚点，后续 HTTP、TCP、ARP 的层归属都据此判断。

### 3.什么是HTTP协议

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/3.什么是HTTP协议.md#3.什么是 HTTP 协议]]`
- Summary: 把 HTTP 定义为浏览器与服务器沟通的"语言规范"，从架构、工作模式、特性三个维度介绍。
- Key claims: 应用层协议，底层通常基于 TCP（HTTP/3 基于 UDP）；请求-响应模式，服务器不主动推送；无状态，需 Cookie/Session 补状态；Content-Type 决定可传任意数据。
- Learner-relevant: HTTP 概念入口，连接"无状态"与后续 Cookie/缓存、连接与后续 TCP 章节。

### 4.HTTP状态码有哪些

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/4.HTTP状态码有哪些.md#4.HTTP 状态码有哪些]]`
- Summary: 按第一位数字把状态码分为 1xx–5xx 五大类，重点标注高频码。
- Key claims: 2xx 成功最典型 200；3xx 要区分 301 永久与 302 临时；4xx 是客户端错误（400/401/403/404）；5xx 是服务器错误（500/502）。
- Learner-relevant: 读响应与调试的必备词汇，也是缓存章节（304）的先修。

### 5.http常见报文头字段有哪些

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/5.http常见报文头字段有哪些.md#5.http常见报文头字段有哪些]]`
- Summary: 用"快递单"比喻 Header，按通用/请求/响应/实体四类归纳高频字段。
- Key claims: 通用字段 Connection: keep-alive 与 Cache-Control；请求字段 Host 是 HTTP/1.1 唯一必传；响应字段 Set-Cookie/Server；实体字段 Content-Type 与 Content-Length。
- Learner-relevant: 报文结构锚点，Host 支撑虚拟主机、Content-Length 关联粘包与长连接。

### 6.HTTP常见的请求方式有哪些

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/6.HTTP常见的请求方式有哪些.md#6.HTTP常见的请求方式有哪些]]`
- Summary: 按 RESTful CRUD 归纳核心方法与辅助方法，说明各自语义与场景。
- Key claims: GET/POST/PUT/DELETE 对应查增改删；HEAD 只要头用于健康检查；OPTIONS 用于 CORS 预检；PATCH 做局部更新区别于 PUT 全量替换。
- Learner-relevant: 接口设计意识与幂等/安全概念的入口，衔接 GET vs POST。

### 7.对比GET和POST请求方式

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/7.对比GET和POST请求方式.md#7.对比GET和POST请求方式]]`
- Summary: 从数据位置、语义、幂等性、缓存行为四方面对比 GET 与 POST。
- Key claims: GET 参数在 URL（约 2KB 限制、暴露敏感数据），POST 在 Body（理论上无长度限制、格式多样）；GET 安全且幂等，POST 非幂等；GET 被浏览器主动缓存、POST 默认不缓存。
- Learner-relevant: 常见面试对比题，连接 HTTP 语义与浏览器行为。

### 8.HTTP的缓存是怎样的

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/8.HTTP的缓存是怎样的.md#8.HTTP的缓存是怎样的]]`
- Summary: 讲"先强缓存、失效再协商缓存"的两步流程与状态码表现。
- Key claims: 强缓存命中不发请求，Cache-Control 优先于 Expires；协商缓存带 If-None-Match/If-Modified-Since，未变回 304、变了回 200；ETag 基于内容摘要，比 Last-Modified 更准。
- Learner-relevant: 性能优化核心锚点，串联状态码与请求头字段。

### 9.HTTP1.1相对于1.0有什么改进？

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/9.HTTP1.1相对于1.0有什么改进？.md#9.HTTP1.1 相对于 1.0 有什么改进？]]`
- Summary: 围绕效率讲 HTTP/1.1 相对 1.0 的四项升级：长连接、Host、缓存、断点续传。
- Key claims: 默认 Connection: keep-alive 复用 TCP 连接减少握手挥手开销；强制 Host 支持虚拟主机；引入 Cache-Control 与 ETag；Range 支持断点续传并返回 206。
- Learner-relevant: 版本演进起点，衔接管道机制、HTTP/2 与缓存章节。

### 10.HTTP1.1的管道机制如何理解

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/10.HTTP1.1的管道机制如何理解.md#10.HTTP1.1 的管道机制如何理解]]`
- Summary: 解释管道机制"批量发送请求、按序返回响应"的原理与队头阻塞缺陷。
- Key claims: 建立在 Keep-Alive 之上，可不等响应连发多个请求以压缩 RTT；协议规定响应必须严格按请求顺序返回；一个慢请求会堵死后续所有响应，故现代浏览器默认关闭，等待 HTTP/2 多路复用解决。
- Learner-relevant: 队头阻塞概念的首次出现，是理解 HTTP/2 改进动机的关键。

### 11.HTTP2.0相对HTTP1.1的改进是怎样的

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/11.HTTP2.0相对HTTP1.1的改进是怎样的.md#11.HTTP2.0 相对 HTTP1.1 的改进是怎样的]]`
- Summary: 讲 HTTP/2 用四项改进把"独木桥"升级成"多车道高速"：多路复用、二进制分帧、头部压缩、服务端推送。
- Key claims: Stream ID 让同连接内请求响应用乱序发送再重组，解决应用层队头阻塞；二进制分帧是多路复用基础；HPACK 用字典+索引号压缩重复头部；服务端可预判并主动推送 CSS/JS。
- Learner-relevant: 性能演进核心，衔接管道机制与 HTTP/3 的 TCP 层队头阻塞。

### 12.HTTP3.0的改进是怎样的？

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/12.HTTP3.0的改进是怎样的？.md#12.HTTP3.0 的改进是怎样的？]]`
- Summary: 讲 HTTP/3 弃 TCP 改用基于 UDP 的 QUIC，解决 HTTP/2 在丢包场景下的 TCP 层队头阻塞。
- Key claims: QUIC 在 UDP 上自实现可靠传输，流间物理隔离，一个流丢包不阻塞其他流；合并传输层与 TLS 握手，首次 1-RTT、有票据可 0-RTT；用 Connection ID 标识连接，网络切换不断线。
- Learner-relevant: 版本演进终点，串联队头阻塞、握手延迟与连接迁移概念。

### 13.HTTPS的加密算法的原理是怎样的

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/13.HTTPS的加密算法的原理是怎样的.md#13.HTTPS 的加密算法的原理是怎样的]]`
- Summary: 讲 HTTPS 的"混合加密"体系：非对称加密换密钥、对称加密传数据、CA 证书防中间人。
- Key claims: 握手阶段用非对称加密（RSA/ECC）安全协商 Pre-master secret；拿会话密钥后切换为对称加密（AES）传大量数据；CA 证书用于身份认证防止中间人攻击。
- Learner-relevant: HTTPS 总纲锚点，衔接对称/非对称与 CA 证书两节。

### 14.HTTPS中，什么是对称加密和非对称加密

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/14.HTTPS中，什么是对称加密和非对称加密.md#14.HTTPS 中，什么是对称加密和非对称加密]]`
- Summary: 用"钥匙有几把"区分对称（一把，快但怕偷）与非对称（公私钥对，安全但慢），说明二者互补。
- Key claims: 对称加密代表 AES/DES，速度极快适合批量数据，痛点是密钥分发；非对称代表 RSA/ECC，公钥加密只有私钥可解、私钥签名公钥验证，比对称慢数百上千倍；HTTPS 先非对称送钥匙再对称传数据。
- Learner-relevant: 密码学基础锚点，解释 HTTPS 为何要"混合"而非单一算法。

### 15.什么是CA证书？是如何生成的？

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/15.什么是CA证书？是如何生成的？.md#15.什么是CA证书？是如何生成的？]]`
- Summary: 讲 CA 证书作为信任锚点的作用（身份验证 + 公钥分发）与从 CSR 到签发、验证的生成流程。
- Key claims: 服务端本地生成公私钥并打包成 CSR；CA 验证域名所有权后用自己私钥对信息摘要签名，签名+原始信息构成证书；浏览器用内置 CA 公钥验签并比对指纹以确认证书真实。
- Learner-relevant: 把"公钥归属"问题闭环，是 HTTPS 安全链条的最后一块拼图。

### 16.对比TCP和UDP协议的区别

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/16.对比TCP和UDP协议的区别.md#16.对比 TCP 和 UDP 协议的区别]]`
- Summary: 从连接性、可靠性、传输方式、效率开销四方面对比 TCP 与 UDP，并给出各自适用场景。
- Key claims: TCP 面向连接、可靠、面向字节流（有粘包）、首部最小 20 字节；UDP 无连接、不可靠、面向报文（保留边界）、首部仅 8 字节且支持广播；TCP 适合网页/邮件/文件，UDP 适合直播/会议/DNS/游戏。
- Learner-relevant: 传输层二分总纲，后续报文头、握手与可靠性章节的总入口。

### 17.TCP报文头有什么字段

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/17.TCP报文头有什么字段.md#17.TCP报文头有什么字段]]`
- Summary: 按地址、可靠性、控制位、流量控制、校验五块拆解 20 字节 TCP 首部。
- Key claims: 源/目的端口标识进程；序号解决乱序、确认号解决丢包；6 个标志位 SYN/ACK/FIN/RST/PSH/URG 标记报文目的；窗口大小是流量控制核心；数据偏移与校验和辅助定位和完整性。
- Learner-relevant: 握手、挥手、流控三章的字段词典，所有状态迁移都建立在这些位上。

### 18.TCP三次握手的过程是怎样的

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/18.TCP三次握手的过程是怎样的.md#18.TCP 三次握手的过程是怎样的]]`
- Summary: 逐步描述三次握手的报文内容、含义与状态迁移。
- Key claims: 第一次 Client 发 SYN=1, seq=x 进入 SYN_SENT；第二次 Server 回 SYN=1,ACK=1,seq=y,ack=x+1 进入 SYN_RCVD；第三次 Client 回 ACK=1,seq=x+1,ack=y+1，双方进入 ESTABLISHED；本质是协商 ISN 并确认双方收发能力。
- Learner-relevant: 连接建立的过程锚点，后续为什么三次、ISN、携带数据三题都从这里展开。

### 19.TCP为什么要三次握手而不是两次

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/19.TCP为什么要三次握手而不是两次.md#19.TCP 为什么要三次握手而不是两次]]`
- Summary: 解释三次握手是为了防失效报文 + 确认双向能力 + 同步 ISN。
- Key claims: 两次握手会让迷路的历史 SYN 使服务器挂起死连接；三次时客户端可回 RST 拒绝；第二次只同步客户端 ISN，只有第三次才能让服务端确认自己的 ISN 被收到；TCP 全双工，第三次让服务端确认自身发送能力可用。
- Learner-relevant: 反直觉高频题，把握手过程提升到"不可靠信道建立可靠双向关联"的设计视角。

### 20.TCP四次挥手的过程是怎样的

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/20.TCP四次挥手的过程是怎样的.md#20.TCP 四次挥手的过程是怎样的]]`
- Summary: 逐步描述四次挥手的报文、含义与状态迁移，强调全双工导致收发通道需分别关闭。
- Key claims: Client 发 FIN=1,seq=u 进 FIN-WAIT-1；Server 回 ACK 进 CLOSE-WAIT（最易卡住），Client 进 FIN-WAIT-2；Server 发 FIN 进 LAST-ACK；Client 回 ACK 后进 TIME-WAIT 等 2MSL 才 CLOSED，Server 直接 CLOSED。
- Learner-relevant: 连接释放过程锚点，TIME_WAIT/CLOSE_WAIT、2MSL 等题都以此为基。

### 21.TCP断开连接为什么是四次而不是三次

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/21.TCP断开连接为什么是四次而不是三次.md#21.TCP 断开连接为什么是四次而不是三次]]`
- Summary: 用"握手一拍即合可合并、挥手因有数据未完须分头行动"解释 4 vs 3 的差异。
- Key claims: 建立时 ACK 与 SYN 无历史包袱可合并；断开时收到 FIN 必须立即回 ACK，但服务器可能还有缓存数据没发完；ACK 与 FIN 之间存在 CLOSE-WAIT 时间差，故必须分两次。
- Learner-relevant: 与"为什么三次握手"配对，反复强化全双工与 CLOSE-WAIT 概念。

### 22.TCP断开连接为什么一般要让客户端去完成

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/22.TCP断开连接为什么一般要让客户端去完成.md#22.TCP 断开连接为什么一般要让客户端去完成]]`
- Summary: 说明主动关闭方进 TIME_WAIT 的资源代价，故让客户端"背锅"保护服务器集中资源。
- Key claims: 谁主动关闭谁进 TIME_WAIT 并保留 2MSL；服务器主动关会积累大量 TIME_WAIT 占满有限本地端口、耗尽 TCB 内存；客户端连接少，几十个 TIME_WAIT 无感；本质是"分散客户端资源换集中服务器资源"。
- Learner-relevant: 把状态机知识与资源分配/高并发场景连接起来。

### 23.三次握手的ISN初始序列号能不能固定

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/23.三次握手的ISN初始序列号能不能固定.md#23.三次握手的ISN初始序列号能不能固定]]`
- Summary: 论证 ISN 绝不能固定，必须随时间动态生成（通常基于时钟，RFC1948）。
- Key claims: ISN 固定会招致 TCP 序列号预测攻击，攻击者可盲发带正确确认号的伪造报文；五元组相同的新旧连接快速复用时，固定 ISN 会让滞留旧报文落入新连接接收窗导致数据错乱。
- Learner-relevant: 安全 + 数据隔离双视角，深化序号机制与连接唯一性。

### 24.三次握手的过程可以携带数据吗

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/24.三次握手的过程可以携带数据吗.md#24.三次握手的过程可以携带数据吗]]`
- Summary: 回答"第三次可以、前两次通常不可以"，并给出安全理由与 TFO 特例。
- Key claims: 前两次带数据会加剧 SYN Flood（服务器为未验证身份开缓冲区）；第三次时客户端已 ESTABLISHED，携带数据符合 RFC 793 且提高效率；TFO 允许第一次带数据但前提是持有服务器颁发的 Cookie。
- Learner-relevant: 连接握手与安全/效率权衡的交叉点，衔接 SYN Flood 章节。

### 25.第四次挥手为什么要等待2MSL

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/25.第四次挥手为什么要等待2MSL.md#25.第四次挥手为什么要等待2MSL]]`
- Summary: 解释 TIME_WAIT 等 2MSL 是为可靠关闭与旧报文隔离买最后一份保险。
- Key claims: 最后一个 ACK 丢失时，服务端会重传 FIN，客户端须在线重发 ACK 以免服务端报错；2MSL = 去 ACK 最多 1MSL + 回来重传 FIN 最多 1MSL；等待还能保证旧连接报文在网络中自然消亡，避免干扰同端口新连接。
- Learner-relevant: TIME_WAIT 的核心原理题，衔接 TIME_WAIT 堆积问题。

### 26.什么情况下会出现大量的time_wait？有什么危害？如何应对？

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/26.什么情况下会出现大量的time_wait？有什么危害？如何应对？.md#26.什么情况下会出现大量的time_wait？有什么危害？如何应对？]]`
- Summary: 分析大量 TIME_WAIT 的成因（高频短连接且主动关闭）、端口耗尽危害与应用层/内核两层解法。
- Key claims: HTTP 客户端无连接池、微服务频繁新建短连接最常见；TIME_WAIT 占随机临时端口，耗尽后报 Cannot assign requested address；治本开 Keep-Alive 与连接池，治标开 tcp_tw_reuse 并调小 tcp_fin_timeout。
- Learner-relevant: 把状态机知识落到线上排查与调优，面试与实战双重价值。

### 27.出现大量的close_wait的原因可能是什么？如何解决？

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/27.出现大量的close_wait的原因可能是什么？如何解决？.md#27.出现大量的close_wait的原因可能是什么？如何解决？]]`
- Summary: 指出大量 CLOSE_WAIT 是被动关闭方应用层 Bug——收到 FIN 回了 ACK 却迟迟不调 close()。
- Key claims: 成因含资源泄漏（close 未放 finally 或异常跳过）与线程阻塞（死循环/死锁/数据库卡死）；也可能是连接池握着已被对端断开的僵尸连接；解法是查代码保证 close 一定执行、用 jstack 查阻塞、检查框架超时与释放配置。
- Learner-relevant: 与 TIME_WAIT 形成"正常 vs 代码缺陷"的对照，训练区分主动/被动关闭。

### 28.TCP是如何保证数据不丢失的

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/28.TCP是如何保证数据不丢失的.md#28.TCP是如何保证数据不丢失的]]`
- Summary: 概括 TCP 以 ARQ（带确认的重传）为核心的一系列防线：序列号、ACK、超时重传、流控/拥塞控制、校验和。
- Key claims: 每个字节编号解决乱序与重复；ACK 是判断到达的唯一依据；RTO 超时未确认即重传；流量控制防接收方溢出、拥塞控制防网络过载；校验和失败直接丢弃等待重传。
- Learner-relevant: 可靠传输总纲锚点，后面快速重传/流控/拥塞三节都挂在这里。

### 29.为什么有了超时重传以后还需要快速重传

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/29.为什么有了超时重传以后还需要快速重传.md#29.为什么有了超时重传以后还需要快速重传]]`
- Summary: 对比超时重传"保底但慢"与快速重传"利用冗余 ACK 抢修"的区别。
- Key claims: RTO 通常略大于 RTT，丢包时发送方要空等数百毫秒、吞吐断崖；接收方遇空洞会发重复 ACK，发送方连收 3 个 DupACK 即立即重传而无需等计时器；超时重传视为严重拥塞进慢启动，快速重传进快速恢复更温和。
- Learner-relevant: 重传机制进阶，衔接拥塞控制的快重传/快恢复。

### 30.流量控制的目的是什么？工作流程是怎样的？

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/30.流量控制的目的是什么？工作流程是怎样的？.md#30.流量控制的目的是什么？工作流程是怎样的？]]`
- Summary: 讲流量控制匹配发送速率与接收能力，通过滑动窗口（Window 字段）实现并处理零窗口死锁。
- Key claims: 接收方在 ACK 里填 rwnd 告知剩余缓存，发送方未确认数据量不超过该值；缓存满时通告 Window=0，发送方停发；为防通知报文丢失导致互等死锁，发送方启动持续定时器发 1 字节探测报文。
- Learner-relevant: 点对点流控锚点，与拥塞控制的"全局 vs 局部"对比是高频辨析点。

### 31.拥塞控制的目的是什么，以及工作流程是怎样的。

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/31.拥塞控制的目的是什么，以及工作流程是怎样的。.md#31.拥塞控制的目的是什么，以及工作流程是怎样的。]]`
- Summary: 讲拥塞控制防网络/路由器过载，维护动态 cwnd，含慢启动、拥塞避免、快重传、快恢复四算法。
- Key claims: 慢启动 cwnd 从 1 起每 ACK 翻倍（指数）直到 ssthresh；超过门限改线性每 RTT 加 1；收到 3 个重复 ACK 触发快重传并进快恢复（门限与 cwnd 减半后线性）；仅超时重传这种严重拥塞才把 cwnd 重置为 1 重开慢启动。
- Learner-relevant: 拥塞控制总纲，与流量控制形成核心辨析对，串起快速重传。

### 32.什么是TCP泛洪攻击？如何解决？

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/32.什么是TCP泛洪攻击？如何解决？.md#32.什么是 TCP 泛洪攻击？如何解决？]]`
- Summary: 介绍 SYN Flood 的 DoS 原理：伪造源 IP 狂发 SYN 塞满半连接队列，并给出三层防御。
- Key claims: 服务器为每个 SYN 回 SYN+ACK 并占半连接队列等 ACK，伪造源 IP 导致永远等不到、队列耗尽、正常请求被丢；内核层启用 SYN Cookies、调小 tcp_synack_retries、调大 tcp_max_syn_backlog；网络层用防火墙/高防代理三次握手。
- Learner-relevant: 把握手机制转化为攻击面，衔接 SYN Cookie 深入。

### 34.什么是SYNcookie

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/34.什么是SYNcookie.md#34.什么是 SYN cookie]]`
- Summary: 讲 SYN Cookie 用"推迟资源分配、服务器状态无状态化"对抗 SYN Flood 的原理。
- Key claims: 队列满时收到 SYN 不再分配内存，按源/目的 IP、端口、时间戳算 Hash 作为 ISN 放入 SYN+ACK；服务器发完即忘、零内存；客户端回 ACK 时用确认号减 1 还原 Cookie 校验，通过才真正分配资源建连。
- Learner-relevant: SYN Flood 的具体防御实现，展示"无状态"设计思想。

### 35.UDP报文头有哪些字段

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/35.UDP报文头有哪些字段.md#35.UDP报文头有哪些字段]]`
- Summary: 拆解固定 8 字节的 UDP 首部四个字段及其含义。
- Key claims: 源端口与目的端口各 2 字节，源端口无需回复时可置 0；长度字段为 Header+Data 总和，最小值为 8；校验和可选（IPv4 可空、IPv6 强制），出错时直接丢弃、不通知不重传。
- Learner-relevant: UDP 报文结构锚点，与 TCP 20 字节首部形成轻量对比。

### 36.浏览器输入URL到显示页面的完整过程

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/36.浏览器输入URL到显示页面的完整过程.md#36.浏览器输入URL到显示页面的完整过程]]`
- Summary: 把输入 URL 到页面显示拆成网络通信与页面渲染两大阶段，串联 DNS、TCP/TLS、HTTP 与渲染流水线。
- Key claims: 网络阶段为 URL 解析→层层缓存 DNS→TCP 三次握手→(HTTPS)TLS 握手→发请求收响应；渲染阶段为 DOM+CSSOM→Render Tree（剔除 display:none）→Layout/回流→Paint→Composite；DNS 查找顺序为浏览器→hosts/系统→路由器→ISP/LDNS→根服务器。
- Learner-relevant: 全篇的综合大题，是把各协议按时间顺序串起来的面试压轴锚点。

### 37.DNS的查询过程是怎样的

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/37.DNS的查询过程是怎样的.md#37.DNS的查询过程是怎样的]]`
- Summary: 描述"先查缓存、再递归+迭代问路"的 DNS 解析过程与本地/外部两阶段。
- Key claims: 客户端到本地 DNS（LDNS）是递归查询，只发一次等最终结果；LDNS 到根、顶级域、权威域是迭代查询，逐级拿到下一跳地址；LDNS 拿到 IP 后按 TTL 缓存再返回客户端。
- Learner-relevant: DNS 核心过程锚点，是 URL 全流程大题的关键一步。

### 38.DNS是基于TCP还是UDP

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/38.DNS是基于TCP还是UDP.md#38.DNS是基于 TCP 还是 UDP]]`
- Summary: 回答"常规查询用 UDP、区域传送与超大数据包用 TCP"，并说明切换机制。
- Key claims: 普通域名查询求快，用 UDP，传统限制 512 字节；区域传送（主从同步）要求强一致故用 TCP；响应超过 512 字节且未开启 EDNS 时服务器置 TC（Truncated）标志位，客户端改走 TCP 重发取完整数据。
- Learner-relevant: UDP 适用场景的具体例证，连接 DNS 与传输层选择。

### 39.HOST文件是什么

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/39.HOST文件是什么.md#39.HOST文件是什么]]`
- Summary: 把 HOSTS 文件定义为本地的静态域名-IP 通讯录，优先级高于 DNS 缓存与服务器。
- Key claims: 解析顺序为 HOSTS → 本地 DNS 缓存 → DNS 服务器，故可本地劫持域名；纯文本逐行 `IP 域名`；常用于开发测试、用 127.0.0.1/0.0.0.0 屏蔽广告、绕过 DNS 污染直连。
- Learner-relevant: DNS 本地阶段的补充，也是调试与安全场景的实用锚点。

### 40.ARP协议的目的是什么？工作流程是怎样的

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/40.ARP协议的目的是什么？工作流程是怎样的.md#40.ARP协议的目的是什么？工作流程是怎样的]]`
- Summary: 说明 ARP 是局域网内把 IP 解析为 MAC 的"翻译官"，并给出四步工作流程。
- Key claims: 链路层只认 MAC，故跨/同局域网发包都需目标 MAC；先查 ARP 缓存，未命中则广播 ARP Request（目标 MAC 全 F）；目标主机单播回 ARP Reply，其他主机丢弃；发起方更新缓存并设 TTL。
- Learner-relevant: 网络层到链路层的桥梁锚点，URL 全流程中"找 MAC"那一步。

### 41.ARP攻击是什么如何防范

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/41.ARP攻击是什么如何防范.md#41.ARP攻击是什么如何防范]]`
- Summary: 讲 ARP 欺骗利用"无状态、无验证"漏洞冒充网关，造成断网与中间人嗅探，及两级防范。
- Key claims: 攻击者持续发伪造 ARP Reply 把网关 IP 映射到自己的 MAC；后果为流量经攻击者导致 DoS 或 MITM 窃取数据；小规模用静态 ARP 绑定，企业级用交换机 DHCP Snooping + DAI 丢弃非法映射报文。
- Learner-relevant: 链路层安全锚点，训练"协议无验证 → 安全风险"的分析范式。

### 42.ping能不能ping端口

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/42.ping能不能ping端口.md#42.ping能不能ping端口]]`
- Summary: 回答 ping 不能测端口，因 ICMP 在网络层无端口概念，并给出测端口的替代工具。
- Key claims: ping 走 ICMP（第三层）只探主机可达，报文无端口字段；端口是 TCP/UDP（第四层）概念；命令行 `ping ip:port` 语法不支持；测端口用 telnet、nc -v -z、tcping。
- Learner-relevant: 用分层解释工具边界，是分层模型与 ICMP/TCP 的实战辨析题。

### 高频热题

- Locator: `[[sources/小哲讲八股/20260926/计算机网络/高频热题.md#高频热题 🔥🔥🔥🔥]]`
- Summary: 面经式索引页，列出 12 道标注为高热的网络面试题及其原文外链。
- Key claims: 高频题集中在模型对比、GET/POST、HTTP 版本演进、HTTPS 加密、TCP/UDP 对比、三次握手/四次挥手、流量/拥塞控制、DNS 查询与 URL 全流程。
- Learner-relevant: 复习优先级参考，可据此校验本 digest 各 L2 条目的覆盖完整度。
