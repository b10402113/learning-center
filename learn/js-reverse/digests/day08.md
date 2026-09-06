---
source: js逆向课件/day08
source_hash:
  - e30eae6f4dc4dcd207fc9abb11642271ec66a0cc42ee64f4c65b48560981569a
source_lines: 380
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/day08

## Overview (L1)

- **回顾：并行/并发与同步/异步** — 并行是同一时刻处理多个任务，并发是基于时间片轮转的伪并行；同步是步骤逐步执行，异步是遇到阻塞操作时交出 CPU 权衡给其他步骤。多进程、多线程和协程都是实现异步机制的手段，核心目的是提升程序执行效率。
- **协程原理（重点）** — 协程（微线程）在单进程/单线程模式下大幅提升运行效率。与依赖操作系统调度的线程/进程不同，协程的任务切换由程序员在用户空间手动控制（挂起当前任务、交出控制权），无需系统调用，从而让 CPU 尽可能留在自己的程序里。优点是轻量级（创建销毁开销小）和可控性（可自定义调度逻辑）。
- **asyncio 核心概念** — Python 3.6+ 的 asyncio 模块检测网络阻塞并做应用级切换。四个核心概念层层递进：特殊函数（async 定义，调用后不立即执行、返回协程对象）→ 协程对象（一组指定形式的操作）→ 任务对象（高级协程，可绑定回调函数，回调中用 `t.result()` 取返回值）→ 事件循环（装载任务对象并启动执行的容器）。
- **多任务异步与 wait/await** — 多任务协程要把多个任务对象经 `asyncio.wait(tasks)` 装入事件循环；wait() 给每个任务赋予可挂起的权限，await 加在每个阻塞操作前人为检测阻塞并挂起任务。注意：特殊函数内部不能出现不支持异步模块的代码（如 time.sleep、requests），否则中断整个异步效果。
- **aiohttp 异步网络请求** — aiohttp 是支持异步的网络请求模块，用法与 requests 相似；常用 `ClientSession` + `get/post`，代理参数是 `proxy='http://ip:port'`（与 requests 不同）；`text()` 取字符串响应、`read()` 取二进制、`json()` 取 JSON。
- **多任务异步爬虫完整实战** — 用 Flask 搭建带 2 秒延迟的本地服务器模拟慢速网站，爬虫端用 aiohttp 发请求、任务对象绑定回调做 lxml/xpath 数据解析，三个 2 秒的请求总耗时约 2 秒，验证异步收益。

## Sections (L2)

### 回顾

- Locator: `[[sources/js-reverse/js逆向课件/day08/异步爬虫.md#回顾]]`
- Summary: 复习并行/并发、同步/异步两组概念，指出进程和线程是实现异步的手段。
- Key claims: 并行是同一时刻处理多个任务；并发是伪并行，基于时间片轮转在任务间快速切换；同步处理中任务步骤一定一步步执行；异步处理在遇到阻塞操作时交出 CPU 使用权去执行其他步骤；最重要核心：异步机制增加程序执行效率，多进程、多线程、协程都是实现异步的手段。
- Learner-relevant: 建立判断标准——遇到 IO 密集型爬虫任务时，能说清为什么选异步以及异步提效的来源。

### 协程（重要！）

- Locator: `[[sources/js-reverse/js逆向课件/day08/异步爬虫.md#协程（重要！）]]`
- Summary: 以"下载多个网页"为需求引出协程：多线程/多进程的切换由操作系统控制、无法人为干涉，协程则由程序员手动控制切换调度。
- Key claims: 协程可在单进程/单线程模式下大幅提升运行效率；线程/进程切换由操作系统实现、不保证切到你的下载任务，效率因此下降；协程切换通过挂起当前任务并把控制权交给下一任务实现，在用户空间进行、不需要系统调用；协程优点是轻量级（占用资源少、创建销毁开销小、切换高效）和可控性（调度由程序员控制、可自定义任务切换逻辑）；总原则是留住 CPU 在自己的程序中。
- Learner-relevant: 理解协程与线程/进程的本质区别（用户空间调度 vs 操作系统调度），为后面 asyncio 的挂起/await 语义打底。

### asyncio模块

- Locator: `[[sources/js-reverse/js逆向课件/day08/异步爬虫.md#asyncio模块]]`
- Summary: 从零讲解 asyncio 协程实现的完整链路：特殊函数 → 协程对象 → 任务对象 → 事件循环，再到 wait/await、aiohttp 与完整异步爬虫实战。
- Key claims: Python 3.6 新增 asyncio，只能检测网络阻塞；`async def` 定义特殊函数，调用后不立即执行而是返回协程对象；任务对象是高级协程，高级之处在于可绑定回调函数（`add_done_callback`，回调必须有且仅有一个参数 t，`t.result()` 取特殊函数返回值）；事件循环是装载任务对象的容器，`loop.run_until_complete` 启动执行；多任务用 `asyncio.wait(tasks)` 接收任务列表，给每个任务赋予可被挂起的权限；await 必须加在每一个阻塞操作前，人为主动检测阻塞并挂起任务；特殊函数内部不可出现不支持异步模块的代码（time.sleep、requests 等），否则中断整个异步效果，要用 `asyncio.sleep`；aiohttp 是支持异步的网络请求模块，`async with aiohttp.ClientSession()` + `sess.get/post`，常用参数 url/headers/params(data)/proxy，代理写法为 `proxy='http://ip:port'`（与 requests 不同）；`response.text()` 取字符串、`read()` 取二进制、`json()` 取 JSON；实战中 Flask 服务器每个路由 sleep(2)，三个请求异步后总耗时约 2 秒；数据解析放在任务回调中完成（lxml + xpath）。
- Learner-relevant: 能独立写出"特殊函数 + 任务列表 + wait + 回调解析"的多任务异步爬虫，并知道 requests/time 必须换成 aiohttp/asyncio.sleep 的原因。
