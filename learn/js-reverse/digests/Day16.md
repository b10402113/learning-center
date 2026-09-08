---
source: js逆向课件/Day16
source_hash:
  - eb379e4ecde33f4f83c77321cb8577e73bc8b2e93c19108f3bd37422371395ca
  - 48a1c5e088f37b7ae0b24f683b466f955c49015ccd0794f8c9bb6bfb7a1d19ae
  - ac59690e7845eca5dfc161dcfd87fa833588e1d9d212ccbc83288870b6fdf9ee
  - 7884b80199bf077cfef765205ef25b7fefe54de8486a9c865c79fc8d542e126e
  - c33c024d64094ef8a96eb745926217bfb64d227c6415e845b200dbcf1a238d90
  - 5516ee2c6e3b139843c1791c8544567447c34931ab7d96523df899894f81907d
source_lines: 179
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/Day16

## Overview (L1)

- **JS 的引入方式**（01 JS的引入.html + 02 demo.js）：两种方式——直接写在 HTML 的 `<script>` 标签里，或用 `<script src="...">` 引入外部 js 文件；示例用 `window.onload` 等待 DOM 加载后给按钮绑定点击事件。
- **变量**（03 变量.js）：`var`/`let` 声明变量，`const` 声明常量；支持先声明后赋值（默认 `undefined`），也支持一行多变量声明赋值。
- **基本数据类型**（04 基本数据类型.js）：number、boolean、string 三种基本类型，加数组、object 两种高级类型，以及 undefined/null；用 `typeof` 判断类型。
- **运算符**（05 运算符.js）：重点讲 `==` 与 `===` 的隐式转换区别、`++` 前置/后置自增、短路运算与零值、逗号运算符、三目运算符，最后用一个综合表达式练习手工求值。

## Sections (L2)

### JS的引入

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day16/01 JS的引入.html#JS的引入]]`
- Summary: 演示 JS 的两种引入方式：内联在 HTML 的 `<script>` 中，或外链 `02 demo.js`；两种方式下事件绑定代码相同。
- Key claims: 引入方式1：JS 代码直接放在 HTML 的 `<script>` 标签里;引入方式2：`<script src="02%20demo.js">` 引入外部文件（路径空格被编码为 %20）;`window.onload` 保证 DOM 加载完成后再取元素;`document.getElementsByTagName("button")[0].onclick = function(){...}` 绑定点击事件，`console.log` 打印调试
- Learner-relevant: 逆向时第一步就是找 JS 在哪：内联 `<script>` 还是外部 js 文件；`window.onload`、事件绑定是识别代码入口的常见形态。

### 变量

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day16/03 变量.js#变量]]`
- Summary: 讲解 `var`/`let`/`const` 三种声明方式、先声明后赋值、以及一行连续声明多个变量。
- Key claims: `var x = 100`、`let y = 200` 声明变量，`const` 声明常量;只声明不赋值时默认值为 `undefined`;`var a, b, c = 3, d, e = 5` 一行多变量声明，未赋值的仍是 undefined
- Learner-relevant: 能读懂逆向遇到的变量声明；undefined 默认值也是判断变量是否被赋过值的线索。

### 基本数据类型

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day16/04 基本数据类型.js#基本数据类型]]`
- Summary: 用 `typeof` 逐一检查 string、number、boolean、数组、object 各类型的输出，并演示数组与对象的基本取值。
- Key claims: 基本类型：number、bool、string;高级类型：数组 `[1,2,3]`、object `{name:"yuan"}`;`typeof` 数组和对象都返回 `"object"`;对象取值两种写法等价：`info["name"]` 和 `info.name`;特殊值 undefined 与 null
- Learner-relevant: 看到混淆的变量先想它的类型；`typeof arr === "object"` 这种坑是读混淆代码时常见的判断点。

### 运算符

- Locator: `[[sources/js-reverse/20260908/js逆向课件/Day16/05 运算符.js#运算符]]`
- Summary: 系统讲比较、赋值、自增、短路、逗号、三目等运算符，核心是 `==`/`===` 的区别和综合表达式的手工求值。
- Key claims: `2 == "2"` 为 true（隐式类型转换），`2 === "2"` 为 false（全等比较类型和值）;`"10" > "2"` 为 false（字符串逐位比较）;`level++` 先赋值后自增、`++level` 先自增后赋值;零值：0、""、false 布尔为假;短路运算 `1 && 2` 返回 2、`0 || 100` 返回 100，可写成 `login(...) && show()` 的守卫模式;逗号运算符 `(10,20,30)` 取最后一个值 30;三目：`表达式 ? 值1 : 值2`;综合练习 `e = (e = a>3 ? b : c, m = ..., m++)` 需按逗号顺序逐步求值
- Learner-relevant: `==`/`===` 和短路求值是读 JS 加密逻辑时最常踩的坑；逗号运算符手工求值训练是逆向还原混淆表达式的基本功。
