---
source: js逆向课件/Day19
source_hash:
  - 3836fde025509f0658aaa8f609aa226fac2052ae89c130cabe7ef1f84888204d
  - 9d8fe120eee52dd7ba75852f7c9fb27a33d13e4415c0f2f87fc0d36b8af478df
  - 4c67d85cd4cfc590f63097b72af5b9e3290359c35b2ab00427dce9d46f3aec96
  - d3a3bd6dfd9faa154732c59c1971e515eb47b77569b5281bb3bc44001ce77b96
  - fb5b31dccd98d6e26b534464b817dcb8ad0240172dd85d45df3540ffe263b9d1
  - 1b94f4aa9705d40e6e22258c463e7ea64d67e928ec9cdb2793c3e98badf600da
source_lines: 176
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/Day19

## Overview (L1)

- **原型对象（prototype）**：通过 `Person.prototype` 把方法与共享属性挂到原型上，所有实例共享一份，替代每个实例复制一份方法的写法；`实例.__proto__` 与 `构造函数.prototype` 指向同一对象，其 `constructor` 又指回构造函数。
- **call 与 apply**：二者都用于改变函数执行时 `this` 的指向；区别在传参方式——`call` 逐个传参，`apply` 传一个数组（参数列表打包）。
- **箭头函数**：`(x,y)=>x+y` 的简写形式，常用于 `map` 等回调中一行完成映射；逆向 JS 时要能认出这是普通函数的语法糖。
- **window 全局变量**：在 `<script>` 顶层用 `var` 声明的变量和函数会挂到 `window` 上成为全局变量/全局函数，是分析网页全局状态的入口。
- **定时器**：`setInterval` 周期执行、`setTimeout` 延迟执行一次，二者都返回定时器 ID，可分别用 `clearInterval`/`clearTimeout` 取消。
- **时钟显示**：综合案例——`setInterval` 每秒刷新 `new Date().toLocaleString()`，并通过 DOM 操作把时间写入 input 框，演示定时器 + DOM 的配合。

## Sections (L2)

### 原型对象

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day19/01 原型对象（prototype）.js#原型对象]]`
- Summary: 对比"方法写在构造函数里"与"方法挂在 prototype 上"两种写法，演示原型链查找：实例自身没有的属性会沿 `__proto__` 找到 `Person.prototype`。
- Key claims: `Person.prototype.eat = function(){}` 使所有实例共享同一个方法，省内存；`p1.__proto__ === Person.prototype`；`Person.prototype.constructor` 指回 Person；实例可以读到原型上的任意属性（如 `legs_num`）
- Learner-relevant: 读懂逆向中"方法不在实例上而在原型上"的代码组织方式，理解属性查找会沿原型链上行。

### call方法和apply方法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day19/02 call方法和apply方法.js#call方法和apply方法]]`
- Summary: 借用/改变 `this` 指向的两种方式：`eat.call(p, a, b, c)` 逐个传参，`eat.apply(p, data)` 把数组展开成参数列表。
- Key claims: `call` 与 `apply` 第一个参数都是新的 this 对象；`call` 后续参数逐个列出；`apply` 第二个参数是数组；常用于让一个对象借用另一个对象的方法
- Learner-relevant: 面对混淆代码中的 `fn.call(x, ...)` / `fn.apply(x, [...])` 能立即还原其真实调用对象与参数。

### 箭头函数

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day19/03 箭头函数.js#箭头函数]]`
- Summary: ES6 箭头函数的两种形态——单表达式隐式返回 `(x,y)=>x+y` 与带函数体的 `(a,b)=>{...return}`，并用 `arr.map` 演示回调简写。
- Key claims: `i => i * i` 等价于 `function(item){return item*item}`；单表达式省略 return；逆向中箭头函数是普通函数的语法糖，需还原成熟悉形式再分析
- Learner-relevant: 能把压缩/混淆代码里的箭头函数在脑内还原为传统函数，降低阅读门槛。

### window全局变量

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day19/04 window全局变量.html#window全局变量]]`
- Summary: 在 `<script>` 标签顶层用 `var` 声明的变量与函数即全局变量/全局函数，实际挂载在 `window` 对象上。
- Key claims: 顶层 `var username` 等价于 `window.username`；顶层 `function f(){}` 也是全局函数；在控制台可直接访问这些全局名
- Learner-relevant: 逆向网页时知道去 `window` 上找全局状态和入口函数，可用控制台直接探测。

### 定时器

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day19/05 定时器.js#定时器]]`
- Summary: `setInterval(fn, 1000)` 每隔指定毫秒重复执行，`setTimeout(fn, 1000)` 延迟执行一次；二者均返回定时器 ID。
- Key claims: `setInterval` 返回 ID 可供 `clearInterval` 取消；`clearTimeout(ID)` 取消尚未触发的 timeout；定时器是 JS 异步行为的入门形态
- Learner-relevant: 理解网页中周期性任务（如 token 刷新、指纹更新）可能由定时器驱动，能定位其回调函数。

### 时钟显示

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day19/06  时钟显示.html#时钟显示]]`
- Summary: 点击 start 后 `setInterval(show, 1000)` 每秒执行 `show`，取 `new Date().toLocaleString()` 并通过 `document.getElementsByTagName("input")[0].value` 写入输入框。
- Key claims: 定时器回调里做 DOM 操作刷新界面；`toLocaleString()` 输出本地格式时间；按钮 `onclick` 绑定启动函数
- Learner-relevant: 一个完整的"定时器 + DOM"小案例，可作为网页动态行为分析的锚点。
