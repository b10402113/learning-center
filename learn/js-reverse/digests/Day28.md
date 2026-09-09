---
source: js逆向课件/Day28
source_lines: 245
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/Day28

## Overview (L1)

- **回调地狱（死亡回调）**：用嵌套 setTimeout 和 `$.ajax` 的 success 回调演示串行请求的层层嵌套写法——请求 A 的回调里发请求 B、B 的回调里发请求 C，代码右移加深、难以阅读和维护，这是 Promise 要解决的核心痛点。
- **Promise 基本语法**：`new Promise(function(resolve, reject))` 包裹异步操作，Promise 有等待（pending）状态，`resolve` 执行把状态改为 fulfilled、`reject` 执行改为 rejected；`p.then(成功回调, 失败回调)` 分别在两种状态下触发。
- **Promise 链式操作**：在 `then` 的回调里 `return` 一个新的 Promise 即可串联串行请求：A 的响应处理完返回 `get_B()`，下一个 `then` 处理 B 的响应，以此类推，彻底拉平回调嵌套。
- **Promise 实战应用**：把 `$.ajax` 封装进 Promise（成功时 `resolve(res)`）得到 `fetchData(url)`，再对和风天气真实 API 做 `fetchData(url).then(...).then(...)` 链式调用。

## Sections (L2)

### 死亡回调

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day28/01 死亡回调.html#死亡回调]]`
- Summary: 用三层嵌套的 setTimeout 模拟"发 A 请求→响应后再发 B→再发 C"的串行流程，另附注释版 `$.ajax` 三层嵌套示例；主流程 `console.log("next ...")` 会先于所有回调执行。
- Key claims: 串行异步用回调写法会产生右移的嵌套金字塔；回调在定时器到点后才执行，不阻塞后续同步代码；嵌套越深，错误处理与阅读成本越高。
- Learner-relevant: 直观感受回调地狱的问题，为理解 Promise 的动机建立锚点。

### promise语法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day28/02 promise语法.html#promise语法]]`
- Summary: `test()` 内部 `new Promise(...)` 包裹 setTimeout 模拟异步请求，按 code 是否为 500 决定走 `reject(data)` 还是 `resolve(data)`；返回的 p 先处于等待状态，`p.then(成功函数, 失败函数)` 在状态落定后触发对应回调。
- Key claims: Promise 构造函数接收带 `resolve`/`reject` 两个参数的执行器函数；`reject` 将状态置为 rejected，`resolve` 置为 fulfilled；then 的第一个函数在 fulfilled 时触发、第二个在 rejected 时触发；Promise 对象可从函数返回，供外部继续消费。
- Learner-relevant: 掌握 Promise 三状态（pending/fulfilled/rejected）与 then 双回调的触发条件，这是读懂加密站点异步请求代码的基础。

### promise的链式操作

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day28/03 promise的链式操作.html#promise的链式操作]]`
- Summary: 把三个串行请求各自封装成返回 Promise 的函数 `get_A/get_B/get_C`，在 `get_A().then(...)` 的回调里 `return get_B()`，继续 `.then(...)` `return get_C()`，用链式调用改写了 01 中的三层嵌套。
- Key claims: then 的回调里返回新 Promise，下一个 then 会等它落定再执行；上一个 then 拿到的 res 是上一个 Promise resolve 的数据；链式写法与嵌套写法语义等价但结构扁平。
- Learner-relevant: 学会用链式 Promise 拉平串行异步流程，能对应到逆向调试中多个接口依次请求的代码形态。

### promise的应用

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day28/04 promise的应用.html#promise的应用]]`
- Summary: 实战封装：`fetchData(url)` 用 `new Promise` 包裹 `$.ajax`，在 success 回调里 `resolve(res)`；对和风天气 API 连续发两次请求，用 `.then(...).then(...)` 链式处理 `res.now` 与 `res.refer`。
- Key claims: 任何回调风格的异步 API（如 $.ajax）都可以用 Promise 包一层；成功时 resolve、失败可在 error 回调里 reject；链式调用可对同一接口复用 fetchData 串行请求多次。
- Learner-relevant: 会把任意 AJAX 封装成 Promise 并链式消费，为阅读现代加密网站的请求代码（fetch/axios 同源思想）做准备。
