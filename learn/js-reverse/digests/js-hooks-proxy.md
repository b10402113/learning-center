---
source: js-hooks-proxy
source_type: text
source_lines: 770
status: absorbed
absorbed_at: 2026-09-20
created: 2026-09-20
updated: 2026-09-20
---

# Digest — js-hooks-proxy

## Overview (L1)

- **Hook 插件** — 在 JavaScript 中拦截和修改函数或方法行为的技术。hook 可在原函数执行前/执行后插入逻辑或替换实现，核心目的是找到函数入口并观察参数与返回值变化，便于分析 JS 逻辑。价值有三：增强可扩展性（不改原码即可加功能）、减少侵入性、便于调试与定位问题。
- **Hook 的典型对象** — 普通函数（`add`）、对象属性（已有属性与不存在属性）、浏览器内置函数（`atob`）、`document.cookie`。高级话题是 hook 检测（`toString()` 检测法与原型链上的 `Function.prototype.toString.call` 检测法）及其破解（重写实例或原型上的 `toString` 返回 `[native code]`）。
- **Proxy 代理机制** — 用 `new Proxy(target, handler)` 包装目标对象，通过 handler 中的 trap 拦截并自定义底层操作。覆盖 `get`/`set`（属性读写）、`getOwnPropertyDescriptor`（属性描述符读取）、`defineProperty`（属性描述符定义）、`apply`（函数调用）、`construct`（new 构造）等，配合 `Reflect` 把操作转发回目标对象。逆向中常用于监控属性变化与补环境（如发现 `window.xxx` 为空则补上该属性）。
- 本簇由课堂笔记 `js进阶02.md`（488 行）与两份配套代码 `01 hook.js`（143 行）、`02 proxy代理.js`（139 行）组成。笔记承载讲解，代码文件提供示例的可运行/可调试版本（示例多被注释保留）。

## Sections (L2)

### Hook 的概念与作用

- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#二. hook插件]]`
- Locator: `[[sources/js-reverse/20260920/课上代码/01 hook.js]]`
- Summary: 定义 hook 为「拦截和修改函数或方法行为的技术」，可在函数执行前、执行后或替换实现逻辑；目的是找到函数入口以及参数变化，便于分析 JS 逻辑。
- Key claims: hook 不修改原代码也不改变调用方式即可增加新功能；作用是可扩展性、低侵入性、便于调试定位；典型逆向场景是发现一个加密函数 `add` 后，想知道它在哪些 JS 代码中被调用。
- Learner-relevant: 建立「hook 是逆向中定位函数调用点与观察入参/出参的第一手段」这一锚点。

### 函数的 hook

- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#3.1 函数的hook]]`
- Locator: `[[sources/js-reverse/20260920/课上代码/01 hook.js]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/assets/image-20251023201840657.png]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/assets/image-20251023203141881.png]]`
- Summary: 四步套路——定义/取得原函数 → 用 `_add = add` 保存原函数 → 用同名变量重新赋值 `add = function(...)` 包裹原函数并打日志 → 调用 `add(1,2)` 观察输出。hook 位置必须在原函数加载完成之后。
- Key claims: 保存原函数是为了不修改原实现；包裹函数先打印参数、再调 `_add`、再打印返回值并 `return result`。
- Learner-relevant: 能独立写出一个函数 hook，理解「保存原函数 + 同名覆盖」是最小可用模式。

### 对象属性的 hook

- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#3.2 对象属性的hook]]`
- Locator: `[[sources/js-reverse/20260920/课上代码/01 hook.js]]`
- Summary: 用 `Object.defineProperty(user, "name", { get(){...}, set(value){...} })` 重新定义属性，把读/写属性都变成可监控的入口；对对象上「不存在」的属性（如 `age`）同样可以 hook。
- Key claims: `get()` 在取属性值时执行、`set(value)` 在设属性值时执行；保存原值到外部变量（如 `_name`）以避免递归自引用；不存在属性也可先定义再监控。
- Learner-relevant: 掌握属性级 hook 写法，能监控网站 JS 对某个对象属性的读写。

### 浏览器环境下 atob 函数的 hook

- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#3.3 浏览器环境下atob函数的hook]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/assets/image-20251023211346475.png]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/assets/image-20251023211726100.png]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/assets/image-20251023211735513.png]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/assets/image-20251023212201290.png]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/assets/image-20251023212234288.png]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/imgs/Snipaste_2024-07-06_09-52-59.png]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/imgs/Snipaste_2024-07-06_10-17-16.png]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/imgs/Snipaste_2024-07-28_09-13-38.png]]`
- Summary: 对浏览器自带的 base64 解码函数 `atob` 做 hook，需在页面加载前完成：空白页打开开发者工具 → 开启 Script 事件监听 → 访问目标页触发断点 → 在 Sources 的 Snippets 新建 hook 代码片段、打断点并运行 → 取消 Script 监听（不可刷新页面），之后即可监控每次 atob 调用。
- Key claims: `atob` 用于 base64 解码；hook 时机必须是页面加载之前；Snippets + 事件监听是实现「先于页面脚本执行」的关键操作链。
- Learner-relevant: 能在真实浏览器里完成一次内置函数的先手 hook，这是逆向 base64 数据的常用起手式。

### 浏览器环境下 cookie 的 hook

- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#3.4 浏览器环境下cookie的hook]]`
- Summary: 操作步骤同 atob hook。用 `Object.defineProperty(document, 'cookie', { get(){...}, set(value){...} })` 监控 cookie 的读取与设置。
- Key claims: 先 `_cookie = document.cookie` 保存原值；再对 `document` 的 `cookie` 属性定义 get/set 打印日志。
- Learner-relevant: 能监控站点何时读出/写入 cookie，定位重要凭证的生成位置。

### Hook 检测与破解

- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#3.5 hook检测与破解检测]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/imgs/Snipaste_2024-07-06_10-48-42.png]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/imgs/Snipaste_2024-07-06_10-51-28.png]]`
- Summary: 网站通过 `toString()` 检测函数是否被 hook——原生函数的 `toString()` 返回 `function atob() { [native code] }`，被 hook 后返回的是包裹函数源码，两者不同。破解方式是在 hook 时重写 `toString`；若对方用原型链上的 `Function.prototype.toString.call(atob)` 检测，则重写 `Function.prototype.toString`。
- Key claims: `[native code]` 是内置函数实现被隐藏的标记；原型链检测绕过了实例上的 `toString` 重写；破解原型链检测时 `function ${this.name}() { [native code] }` 用 `this.name` 动态适配调用者（但直接写死会污染所有调用者）。
- Learner-relevant: 理解「hook 会增加被检测风险」，并掌握两级 `toString` 对抗与各自代价。

### Proxy 代理机制

- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#三. proxy代理机制]]`
- Locator: `[[sources/js-reverse/20260920/课上代码/02 proxy代理.js]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/imgs/Snipaste_2024-07-06_12-43-54.png]]`
- Summary: `new Proxy(target, handler)` 包装目标对象；handler 的 `get(target, p, receiver)` / `set(target, p, value, receiver)` 拦截属性读写，并用 `Reflect.get` / `Reflect.set` 转发。监控不存在属性时 `Reflect.get` 返回 undefined，据此判断缺哪个属性并补充。
- Key claims: Proxy 参数 1 是被代理对象、参数 2 是处理器；捕获器（traps）在对应操作时被调用；`Reflect` 提供转发原操作的默认行为；该机制可直接用于逆向补环境（把空的 `window.xxx` 补齐）。
- Learner-relevant: 能用 Proxy 监控对象读写，理解 Proxy + Reflect 是动态分析对象行为的主工具。

### 属性描述符拦截

- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#3. 属性描述符]]`
- Locator: `[[sources/js-reverse/20260920/课上代码/02 proxy代理.js]]`
- Summary: 有些网站通过属性描述符读写属性。`Object.getOwnPropertyDescriptor(Stu, "name")` 读取描述符，`Object.defineProperty(Person, 'name', {...})` 定义描述符；Proxy 相应提供 `getOwnPropertyDescriptor(target, p)` 与 `defineProperty(target, p, descriptor)` 两个 trap 来拦截。
- Key claims: 描述符包含 `value`/`writable`/`enumerable`/`configurable`；拦截时先用 `Reflect.getOwnPropertyDescriptor` / `Reflect.defineProperty` 得到结果，再打日志并返回。
- Learner-relevant: 能监控那些「不走普通点号读写、而走属性描述符 API」的网站代码。

### 函数调用与构造拦截

- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#4. 函数调用拦截监控]]`
- Locator: `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md#5. 对象构造方法拦截监控]]`
- Locator: `[[sources/js-reverse/20260920/课上代码/02 proxy代理.js]]`
- Summary: `apply(target, thisArg, argList)` 拦截函数调用，`construct(target, argArray, newTarget)` 拦截 `new` 构造；两者分别用 `Reflect.apply` / `Reflect.construct` 执行原操作并打印信息。
- Key claims: `apply` 的 `argList` 是函数参数数组，`thisArg` 是 this 指针；`construct` 在 `new Animal()` 时触发，`newTarget` 是代理后的对象。
- Learner-relevant: 补齐 Proxy 的五类 trap，面对「函数被调用」或「对象被 new」的监控需求都能下手。

## Sources

- `[[sources/js-reverse/20260920/课堂笔记/js进阶02.md]]`
- `[[sources/js-reverse/20260920/课上代码/01 hook.js]]`
- `[[sources/js-reverse/20260920/课上代码/02 proxy代理.js]]`
