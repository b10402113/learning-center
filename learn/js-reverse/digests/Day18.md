---
source: js逆向课件/Day18
source_hash:
  - e5251fe5a335c492ec68788e2ac1be74489f1059de5aab6d3fac4ad3c16ed951
  - a7cef6583ea49928ea980c6da08a4381065bcb8da9fe63fe37d43aa8298e9b90
  - dc44e9691845b1d4f80c404ac1e8917c61e28438a19fc3a62399bd8a1cd119e4
  - e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  - c4529c80b28cf9e46ac5fff1a83164069606563cef2db26130e291e3a31c3750
  - 8d389a2658c58d5d86bde20765059676bef04fdf2e5c319b97b71b9fdb98bfda
  - cec282a87c0bf60eebb9c794fb421ec74b84c0fb51acd8c0c1b856a59d151669
source_lines: 245
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/Day18

## Overview (L1)

- **函数基础**（01 函数基础.js）：函数声明与调用（声明可晚于调用）、参数不匹配时不报错、`arguments` 类数组对象接收任意个参数、无 return 默认返回 undefined，最后用逗号表达式综合练习返回值求值。
- **JS 的作用域**（02 JS的作用域.js）：函数内不加 `var` 赋值会修改全局变量；函数内声明的变量是局部变量；`var` 没有块级作用域（if 块里声明的变量块外仍可见）；函数内可以遮蔽全局名（如局部 `Math`）。
- **匿名函数**（03 匿名函数.js）：函数表达式 `var foo = function(){...}` 与匿名函数自执行 IIFE 的两种写法 `(function(){}())` 前加 `!` 等符号。
- **全局变量污染**（05 全局变量污染.html）：两个 `<script>` 代码块共享全局作用域，同名全局变量 `n` 相互覆盖，点击计数器被另一个代码块污染。
- **闭包**（06 闭包.html，04 闭包函数.js 为空占位）：先演示用 IIFE 构建子作用域隔离计数器变量，再用"外层函数返回内层函数"的标准闭包写法，让每个计数器 `c1`/`c2` 拥有独立私有的 `n`，互不影响且不污染全局。
- **Python 参数对照**（py demo.py）：Python 的默认参数、`*args` 收集位置参数、`**kwargs` 收集关键字参数，与 JS `arguments` 形成映射。

## Sections (L2)

### 函数基础

- Locator: `[[sources/js-reverse/js逆向课件/Day18/01 函数基础.js#函数基础]]`
- Summary: 函数的声明与调用、参数行为、`arguments` 对象与返回值规则，并用逗号表达式做返回值求值练习。
- Key claims: 函数声明可以先调用后声明（`foo()` 写在声明之前）;调用时实参与形参个数不必匹配，缺的形参是 undefined;`arguments` 是类数组对象，`arguments.length` 遍历可求任意个数参数的和;函数没有 return 时默认返回 undefined;`return x = test01(), y = ..., z = ++y` 用逗号表达式依次求值并返回最后一个
- Learner-relevant: `arguments` 是 JS 兼容"不定长参数"的老写法，逆向老代码必见；函数返回 undefined 这一点可用来判断函数用途。

### 作用域

- Locator: `[[sources/js-reverse/js逆向课件/Day18/02 JS的作用域.js#作用域]]`
- Summary: 演示全局变量、局部变量、无 var 赋值改全局、以及 `var` 缺乏块级作用域的现象。
- Key claims: 函数内不写 `var` 直接 `x = 100` 修改的是全局 x;函数内 `var x`/`var y` 是局部变量，其他函数访问不到;`var` 没有块级作用域：if 块内 `var b = 200` 在块外仍然可见;函数内声明的 `var Math = 100` 会遮蔽全局 Math 对象
- Learner-relevant: 判断"这段代码改的是哪个变量"是逆向读代码的基本功；var 无块级作用域是老代码特有的坑。

### 匿名函数

- Locator: `[[sources/js-reverse/js逆向课件/Day18/03 匿名函数.js#匿名函数]]`
- Summary: 匿名函数的两种用法：赋值给变量的函数表达式，和定义后立刻执行的 IIFE。
- Key claims: `var foo = function(){...}` 函数表达式，调用方式与具名函数相同;IIFE 自执行：`(function(x,y){...})(1,2)` 定义即运行;IIFE 变体：`!(function(x,y){...})(1,3)`，前面加 `!`（或 `+` 等）把函数声明转成表达式
- Learner-relevant: IIFE 是闭包和模块化的基础形态，混淆代码大量用 `(function(){...})()` 包裹整段逻辑，必须一眼认出。

### 全局变量污染

- Locator: `[[sources/js-reverse/js逆向课件/Day18/05 全局变量污染.html#全局变量污染]]`
- Summary: 页面两个 `<script>` 代码块都声明全局变量 `n`，后一个覆盖前一个，导致计数器功能被污染，引出"需要构建子作用域"的动机。
- Key claims: 多个 `<script>` 代码块共享同一个全局作用域;同名全局变量后者覆盖前者（n=0 被 n=10 覆盖）;`onclick="counter()"` 内联绑定按钮点击;解决方案的方向：把变量包进函数作用域，不暴露到全局
- Learner-relevant: 理解为什么生产代码要把变量包起来（防冲突、防全局污染），这是读逆向目标代码结构的动机性知识。

### 闭包

- Locator: `[[sources/js-reverse/js逆向课件/Day18/06 闭包.html#闭包]]`
- Summary: 两版闭包方案：用 IIFE 构建子作用域隔离计数器变量；用外层函数返回内层函数，生成各自独立私有状态的计数器。（配套的 04 闭包函数.js 是空占位文件，内容以本 html 为准。）
- Key claims: 方案1：IIFE 内声明 `var n = 0` 和 counter，作用域隔离但只能建一个计数器;方案2：`get_counter()` 返回内层 `counter` 函数，内层持续引用外层的 `n`，这就是闭包;`c1 = get_counter(); c2 = get_counter()` 两次调用各自创建独立的 n，互不影响;闭包变量对外不可直接访问（私有性），也不污染全局;每个闭包实例持有自己那份外层变量，这是 JS 的"函数级作用域 + 函数是一等公民"的直接后果
- Learner-relevant: 闭包是 JS 逆向必考结构：混淆器用闭包藏关键变量和函数，判断"变量在哪个闭包里、被谁持有"才能定位真正的逻辑。

### Python参数对照

- Locator: `[[sources/js-reverse/js逆向课件/Day18/py demo.py#Python参数对照]]`
- Summary: 用 Python 复习默认参数、`*yuan` 收集多余位置参数、`**kwargs` 收集关键字参数，与 JS 的 arguments 机制对照。
- Key claims: `def add(a, b, *yuan)` 把多余位置参数收成元组;`def foo(name, age, **kwargs)` 把多余关键字参数收成字典;调用可用位置传参也可关键字传参;对应 JS 里 `arguments` 接收任意个实参
- Learner-relevant: 已有 Python 基础者按 `*args`/`**kwargs` 理解 `arguments`，读 JS 函数签名时不被"形参个数"迷惑。
