---
source: js逆向课件/Day17
source_hash:
  - 575f15839e48f4ce064ebe64d09351eb386cf9a63993112e3db41b256bca2650
  - 3e6f48f312b0d581896e0a86c5c37e76668472b0b815be953dc813418e5b97b9
  - cccea9ae485c252941fc4b59bd9c674afe63e5362f63cc875dbbafa698aa5784
  - c2c33bbf493474f30ec5e8df72c92e734df7db827f165b57750f2d38226f620d
  - e34e18ec2f3c49fbef3c9fd922fba82803439cb618d03fa0c1b35a0e3e53a1d9
  - 54fb97f5534e500023bb3192dc2e87db62f1037054f1066f4e2c457f759df8e7
  - 8a19b9bdc51a2998d1cf258f97a9897bc8813b3354fb1f31558472a08d9a3614
  - f947e16f601370047ee225fd50105552fa6414892736ed5cf4a84f5542b2b305
source_lines: 376
created: 2026-09-05
updated: 2026-09-05
---

# Digest — js逆向课件/Day17

## Overview (L1)

- **Python 对照**（00 py_test.py）：先用 Python 复习条件循环、字符串方法、函数作为变量/参数/返回值（高阶函数）、map/filter，再引出 json 序列化与毫秒时间戳，作为后面 JS 知识的映射锚点。
- **分支语句**（01 JS的分支语句.js）：if-else 双分支、if-else-if 多分支、switch-case（需 break 防穿透，default 兜底）。
- **循环语句**（02 JS的循环语句.js）：while 与 for 都是条件循环，循环三要素——初始变量、条件语句、步进语句。
- **字符串**（03 字符串.js）：大小写转换、slice 切片、split 分割、indexOf 查找、startsWith 判断前缀。
- **数组**（04 数组 .js）：push/pop 操作末尾、unshift/shift 操作首位、reverse、slice、join，重点是 splice 的删除/插入/替换三合一用法；数组遍历对比 for / for-in（拿索引）/ for-of（拿元素）。
- **高阶函数**（05 高阶函数.js）：map 逐元素映射生成新数组、filter 按条件过滤。
- **object 对象**（06 JS的object对象.js）：对象取值两种写法、嵌套结构访问，以及 `JSON.stringify` / `JSON.parse` 与 Python `json.dumps`/`json.loads` 的对应。
- **Date 和 Math 对象**（07 Date对象和Math对象.js）：`new Date()` 取当前时间、`getTime()` 毫秒时间戳、`toLocaleString()` 本地化格式，`Math.random()` 配合 `Math.round` 取随机整数。

## Sections (L2)

### Python对照

- Locator: `[[sources/js-reverse/js逆向课件/Day17/00 py_test.py#Python对照]]`
- Summary: 用 Python 复习循环三要素、字符串方法、高阶函数（函数作参数/返回值）、map/filter、json 序列化和毫秒时间戳，为同一天的 JS 内容提供逐项映射。
- Key claims: 循环三要素：初始变量、条件语句、步进语句;高阶函数定义：函数以函数作为参数或返回值，满足其一即是;`json.loads`/`json.dumps` 是"数据对象 ↔ 字符串"的序列化;`int(time.time()*1000)` 生成毫秒时间戳（13 位数字）
- Learner-relevant: 已有 Python 基础的学习者可以按"Python 概念 → JS 写法"逐项平移，毫秒时间戳是逆向中常见的签名/防重放参数。

### 分支语句

- Locator: `[[sources/js-reverse/js逆向课件/Day17/01 JS的分支语句.js#分支语句]]`
- Summary: 演示 if-else 双分支（可嵌套）、if-else-if 多分支（成绩分级）和 switch-case 星期判断。
- Key claims: if-else 支持任意嵌套;if-else-if 按顺序匹配第一个成立的条件;switch 的每个 case 要写 `break`，否则会穿透继续执行;`default` 处理所有 case 不匹配的情况
- Learner-relevant: 能读懂逆向目标里的分支逻辑；switch 穿透是读代码和还原逻辑时容易漏掉的行为。

### 循环语句

- Locator: `[[sources/js-reverse/js逆向课件/Day17/02 JS的循环语句.js#循环语句]]`
- Summary: while 与 for 循环的写法，强调两者本质都是条件循环，都要满足循环三要素。
- Key claims: while 三要素：`count = 0` 初始、`count < 10` 条件、`count++` 步进;`for (var count = 0; count < 10; count++)` 把三要素写在一行;循环体放具体业务逻辑
- Learner-relevant: 循环是还原加密算法（如多次哈希、异或轮次）的基本结构，识别三要素就能快速界定循环边界。

### 字符串

- Locator: `[[sources/js-reverse/js逆向课件/Day17/03 字符串.js#字符串]]`
- Summary: 常用字符串方法：大小写转换、slice 切片、split 分割、indexOf 查找、startsWith 前缀判断。
- Key claims: `toUpperCase()`/`toLowerCase()` 转大小写;`slice(1,4)` 按索引切片、`slice(6)` 切到末尾;`split(" ")` 按分隔符切出数组，可再取 `.length`;`indexOf("yuan")` 返回查找位置（找不到 -1）;`startsWith("He")` 判断前缀
- Learner-relevant: 字符串切片和拼接是绝大多数 JS 签名算法的原材料，这些方法名是逆向搜代码的关键词。

### 数组

- Locator: `[[sources/js-reverse/js逆向课件/Day17/04 数组 .js#数组]]`
- Summary: 数组的增删与遍历全集：push/pop、unshift/shift、reverse、slice、join、splice，以及 for / for-in / for-of 三种遍历的区别。
- Key claims: `push`/`pop` 操作末尾元素，`unshift`/`shift` 操作首位元素;`reverse()` 倒序、`slice(1,3)` 切片、`join(",")` 拼接成字符串;`splice(i, n)` 删除、`splice(i, 0, ...items)` 插入、`splice(i, n, ...items)` 替换，一个方法三种用法;for-in 拿到的是索引（key），for-of 拿到的是元素（value）
- Learner-relevant: splice 一法三用在逆向中高频出现；for-in/for-of 的区别是判断代码在遍历键还是值的直接依据。

### 高阶函数

- Locator: `[[sources/js-reverse/js逆向课件/Day17/05 高阶函数.js#高阶函数]]`
- Summary: 演示数组的 `map` 映射和 `filter` 过滤，回调函数以匿名函数形式传入。
- Key claims: `arr.map(function(item){ return item*item+1 })` 对每个元素应用函数并返回新数组;`l.filter(function(item){ return item%2===0 })` 按回调返回的布尔值筛选元素;map/filter 不修改原数组，返回新数组;对应 Python 的 `map`/`filter`
- Learner-relevant: 高阶函数是现代 JS（含混淆代码）处理数据的主流写法，认出 map/filter 就能推断该行在变换数组。

### object对象

- Locator: `[[sources/js-reverse/js逆向课件/Day17/06 JS的object对象.js#object对象]]`
- Summary: 对象的字面量定义、两种取值写法、嵌套数组/对象结构访问，以及 JSON 序列化与反序列化。
- Key claims: 取值两种写法：`info["name"]` 与 `info.name` 等价;嵌套访问链式取值：`info2.gfs[0].name`;`JSON.stringify(data)` 对象转 JSON 字符串（对应 `json.dumps`）;`JSON.parse(res)` JSON 字符串转对象（对应 `json.loads`），解析后可直接访问嵌套字段
- Learner-relevant: JSON.parse/stringify 是前后端数据边界；逆向接口时见到 `\uXXXX` 转义要知道 parse 后就是正常中文。

### Date对象和Math对象

- Locator: `[[sources/js-reverse/js逆向课件/Day17/07 Date对象和Math对象.js#Date对象和Math对象]]`
- Summary: 用 `new Date()` 取当前时间并演示毫秒时间戳，用 Math 对象生成随机整数。
- Key claims: `now.getTime()` 返回 13 位毫秒时间戳（如 1701528252028），等价 Python `int(time.time()*1000)`;`toLocaleString()` 输出本地化日期时间字符串;`Math.round(Math.random()*10)` 生成 0-10 的随机整数
- Learner-relevant: 毫秒时间戳是逆向中最常见的动态参数（签名、token 里几乎必有），要能一眼认出 13 位数字就是它。
