---
source: js-reverse2
source_type: codebase
source_lines: 3743
language: javascript
part: 2
status: absorbed
absorbed_at: 2026-10-05
created: 2026-10-05
updated: 2026-10-05
---

# Digest — js-reverse2 (part 2)

## Overview (L1)

- **JS basics & embedding (day05, Day16)** — Why JS exists (browser-side form checks), the 1995 Netscape origin, and the two ways to embed it: inline `<script>` vs external `src="x.js"`. Node.js is introduced as the local runtime for running JS outside a browser.
- **Variables, primitive types & operators (Day16, day05)** — `var`/`let`/`const`, `number/bool/string/undefined/null`, plus arrays and objects as reference types; type coercion, `typeof`, `==` vs `===`, pre/post increment, short-circuit and comma operators.
- **Control flow (Day17, day05)** — Sequence, branch (`if`/`else if`/`switch`), loop (`while`/`for`/`for-in`), and `break`/`continue`.
- **Strings, arrays & higher-order functions (Day17)** — String methods (`split/slice/trim/indexOf/...`), regex `match/replace/search`, array stack/queue/slice/join/`splice`, iteration (`for-in` vs `for-of`), and `map/filter/reduce`.
- **Objects, JSON, Date & Math (Day17, day05)** — Three ways to build an object, `.` vs `[]` access, `for-in` enumeration, `JSON.stringify/parse`, `Date` getters and timestamps, and `Math` helpers.
- **Functions, scope & hoisting (Day18, day06)** — Declaring/calling functions, positional/default params, `arguments`, single `return`, global vs local scope, and `var` hoisting vs `let`/`const` block scoping.
- **Anonymous functions, closures & global pollution (Day18, day06)** — Assigning/IIFE anonymous functions, the "averager" closure, `let`-scoped sub-scopes as a fix for shared-global bugs, and factory functions returning persistent private state.
- **Prototype & call/apply (Day19, day06)** — `prototype` vs instance members, `__proto__`, the prototype chain, and how `call`/`apply` bind `this` to an external object.
- **Arrow functions, window, timers & DOM/Ajax (Day19, day06)** — ES6 arrow syntax, `window` as the browser global (and `globalThis` in Node), `setTimeout`/`setInterval`, jQuery selectors/events, and XHR/`$.ajax` requests.

## Sections (L2)

### js-history-and-embedding

- Locator: `[[sources/js-reverse2/20261005/JS逆向/day05/课堂笔记/1.Javascript入门.md]]`
- Summary: Explains the browser context that produced JavaScript, then how to get JS onto a page and how to run it locally.
- Key claims: JS is a browser script language for front-end logic, user behavior, and event handling; history: NCSA Mosaic → Netscape Navigator (1994) → Mocha → LiveScript → renamed JavaScript in Dec 1995 as a Sun/Netscape marketing deal, not a technical relation; two embedding modes — inline `<script>` code, or external file via `<script src="...">`; Node.js is a cross-platform JS runtime that lets JS run locally (PyCharm can be configured to run `.js` files); comments are `//` single-line and `/* */` multi-line.
- Learner-relevant: Recognize where a page's JS lives and separate inline vs bundled/external scripts — the first practical question when locating encryption logic in a reverse-engineering target.
- Locator (code): `[[sources/js-reverse2/20261005/JS逆向/day05/课上代码/01 js引入方式.html]]`, `[[sources/js-reverse2/20261005/Day16/01 JS的引入.html]]`, `[[sources/js-reverse2/20261005/Day16/02 demo.js]]`

### variables-and-types

- Locator: `[[sources/js-reverse2/20261005/Day16/03 变量.js]]`
- Summary: Variable declaration forms and the JS type system, including conversion and the primitive/reference distinction.
- Key claims: `var` and `let` declare variables, `const` declares a constant; a declared-but-unassigned variable is `undefined`; multiple variables can be created in one statement (`var a, b, c = 3, d, e = 5`); `typeof` identifies types (`number/bool/string/object/undefined`); arrays `[]` and objects `{}` are reference types (`typeof [] === "object"`); conversions: `parseInt(str)`, `num.toString()`, `num.toString(16)`, `parseInt("AB",16)===171`, and implicit coercion (`1 + true === 2`); primitive copy is by value, reference copy shares the same heap object, so `arr2 = arr1; arr1.push(3)` mutates both.
- Learner-relevant: Read obfuscated code that depends on loose typing and recognize when two variables alias the same array/object — a common source of "why did this value change?" confusion.
- Locator (code): `[[sources/js-reverse2/20261005/Day16/04 基本数据类型.js]]`

### operators

- Locator: `[[sources/js-reverse2/20261005/Day16/05 运算符.js]]`
- Summary: Arithmetic, assignment, comparison, logical, comma, and ternary operators, including JS-specific coercions.
- Key claims: Arithmetic `+ - * / % **`; pre/post increment semantics (`a++` uses then adds, `++a` adds then uses); `==` does type coercion and compares value, `===` compares value and type (`2 == "2"` true, `2 === "2"` false), `!==` is strict inequality; logical `&& || !` short-circuit; every type has a "zero/falsy" value (`0`, `""`, `false`); short-circuit is idiomatically used as a guard (`login(...) && show()`); comma operator evaluates left-to-right and returns the last value; ternary `条件?值1:值2`.
- Learner-relevant: Decode dense one-liners where evaluation order and coercion decide the result — e.g. the worked `e = (e = a>3?b:c, m = e<b++?...:..., m++)` example.
- Locator (code): `[[sources/js-reverse2/20261005/JS逆向/day05/课上代码/02 js代码测试.js]]`

### control-flow

- Locator: `[[sources/js-reverse2/20261005/Day17/01 JS的分支语句.js]]`
- Summary: Branching with `if`/`else if`/`else` and `switch`, and the three-part structure of loops.
- Key claims: `if` supports nested and multi-branch `else if` chains; `switch` matches by value with `case`/`break`/`default`, and a missing `break` falls through; `while` uses condition + step, and `for(init; cond; step)` is the three-element loop; `for-in` iterates indices/keys; `break` exits the loop, `continue` skips one iteration.
- Learner-relevant: Follow control flow inside minified decoders and dispatch-style functions; `switch` fall-through and `break` placement are frequent sources of surprising behavior.
- Locator (code): `[[sources/js-reverse2/20261005/Day17/02 JS的循环语句.js]]`, `[[sources/js-reverse2/20261005/JS逆向/day05/课上代码/03 流程控制语句.js]]`

### strings-and-arrays

- Locator: `[[sources/js-reverse2/20261005/JS逆向/day05/课堂笔记/1.Javascript入门.md]]`
- Summary: String manipulation and regular expressions, then the array API and iteration.
- Key claims: String methods: `split("-")`, `substr(start,len)`, `trim()`, `slice(start,end)` (open interval, negative indices allowed), `substring`, `length`, `charAt(i)`/`s[i]`, `indexOf`/`lastIndexOf` (return `-1` if absent), `toUpperCase`, `startsWith`, `charCodeAt(i)`, `String.fromCharCode(ascii)`; regex was `match(/\d{11}/g)`, `replace(/(\d{3})\d{4}(\d{4})/,"$1****$2")` with capture groups, `search`, modifiers `i`/`g`; arrays built by literal `[]` or `new Array(...)`; methods `length`, index access, `pop`/`push` (end), `shift`/`unshift` (front), `reverse`, `slice`, `concat`, `join`, `splice(start,deleteCount,...insert)` for delete/insert/replace; iteration `for-in` yields keys, `for-of` yields values.
- Learner-relevant: Strings and arrays are where obfuscated sign/param-building code lives; recognizing `split/join/replace` transforms is essential to tracing a value from input to ciphertext.
- Locator (code): `[[sources/js-reverse2/20261005/Day17/03 字符串.js]]`, `[[sources/js-reverse2/20261005/Day17/04 数组 .js]]`

### higher-order-functions

- Locator: `[[sources/js-reverse2/20261005/Day17/05 高阶函数.js]]`
- Summary: Passing functions as arguments to map/filter/reduce.
- Key claims: `arr.map(fn)` returns a new array of transformed elements (`[1,2,3].map(item => item*item+1)`); `arr.filter(fn)` keeps elements where `fn` returns truthy; `reduce` is listed alongside them (handout); callbacks receive each item as the first argument.
- Learner-relevant: Modern obfuscators route string tables through `map/reduce`; reading a callback chain lets you mentally evaluate transforms without running code.
- Locator (code): `[[sources/js-reverse2/20261005/Day19/03 箭头函数.js]]`

### objects-json

- Locator: `[[sources/js-reverse2/20261005/JS逆向/day05/课堂笔记/1.Javascript入门.md]]`
- Summary: Object construction and JSON serialization.
- Key claims: Three creation forms — `new Object()` then assign, object literal `{name:"alvin", say:function(){...}}`, and a constructor function with `this` used via `new`; member access by `.` or `["key"]`; enumerate with `for(var attr in person)`; JSON syntax: `{}` or `[]`, comma-separated, no trailing comma, keys must be double-quoted strings; `JSON.stringify(obj)` → string, `JSON.parse(str)` → object; nested objects/arrays supported.
- Learner-relevant: API payloads and config blobs are JSON; being fluent in `.`/`[]` access and stringify/parse lets you reproduce request bodies and decode responses.
- Locator (code): `[[sources/js-reverse2/20261005/Day17/06 JS的object对象.js]]`

### date-and-math

- Locator: `[[sources/js-reverse2/20261005/Day17/07 Date对象和Math对象.js]]`
- Summary: Built-in Date and Math objects.
- Key claims: `new Date()` gives now; `new Date("2004/3/20 11:12")` parses a string; `toLocaleString()`; getters `getDate/getDay/getMonth(0-11)/getFullYear/getHours/getMinutes/getSeconds/getMilliseconds`, and `getTime()` = milliseconds since 1970-01-01 00:00:00 UTC; Math: `abs`, `ceil`, `floor`, `max`, `min`, `random` (0-1), `round`; idiom `Math.round(Math.random()*10)` for a 0-10 integer.
- Learner-relevant: Timestamps and random nonces are embedded in signed requests; knowing `getTime()` and `random()` idioms lets you spot a signing value quickly.
- Locator (code): `[[sources/js-reverse2/20261005/JS逆向/day05/课上代码/03 流程控制语句.js]]`

### function-basics

- Locator: `[[sources/js-reverse2/20261005/Day18/01 函数基础.js]]`
- Summary: Function declaration, invocation, parameters, `arguments`, and return semantics.
- Key claims: `function name(params){ body; return value; }`, case-sensitive, callable before/after definition; positional params allow extra/missing args; default params (`gender="male"`); `arguments` is an array-like object holding all passed args (usable for variadic length functions); `return` terminates the function and yields a value; no `return` → `undefined`; a comma `return x,y` only returns `x`; multiple return values require an array/object.
- Learner-relevant: Functions are the unit of a reversed algorithm; reading signature, `arguments` usage, and return shape tells you how a helper is meant to be called.
- Locator (code): `[[sources/js-reverse2/20261005/JS逆向/day06/课上代码/01 js函数.js]]`

### scope-hoisting

- Locator: `[[sources/js-reverse2/20261005/Day18/02 JS的作用域.js]]`
- Summary: Global vs local scope, hoisting, and the `var`/`let`/`const` differences.
- Key claims: Variables declared in a function are local and die when the call ends; outer/global variables are shared and a function can mutate them; assigning an undeclared name (`name = '大马猴'`) creates an implicit **global** variable; `var` **hoists** — the declaration is lifted to the top so `console.log(name)` before `var name=...` prints `undefined`; `var` allows redeclaration, `let` forbids hoisting (ReferenceError) and redeclaration in the same scope (SyntaxError, checked before execution); `const` declares a value that cannot be reassigned; a block's `var` leaks out of the block while `let` does not.
- Learner-relevant: Hoisting and implicit globals are core to reading legacy/obfuscated JS, where a variable may be "used" before it appears textually.
- Locator (code): `[[sources/js-reverse2/20261005/JS逆向/day06/课堂笔记/2.Javascript高级.md]]`

### anonymous-functions-and-closures

- Locator: `[[sources/js-reverse2/20261005/JS逆向/day06/课堂笔记/2.Javascript高级.md]]`
- Summary: Anonymous functions, IIFE sandboxing, and closures as private persistent state.
- Key claims: `var foo = function(){...}` then `foo()`; self-executing `(function(x,y){...})(2,3)` and `!(function(){})()`; a function can return an inner function (`bar()()`); the global-pollution bug is two scripts both using `var name`/`var n` in the same global scope, so a timer callback may read a value another script overwrote; wrapping each script in an IIFE creates a sub-scope to isolate variables; a closure is an inner function using a non-global variable of its enclosing function, keeping that variable resident in memory and private — e.g. `make_averager()` returns `averager`, which keeps its own `series` across calls while nothing external can touch it; the crypto-tool example returns `{encrypt, decrypt}` so callers get public methods while `log_msg`/internals stay hidden (uses `atob`/`btoa` base64).
- Learner-relevant: Closures are how libraries and minified modules expose a public API over hidden internals — recognizing the IIFE+return pattern is how you find the callable entry point of a packed script.
- Locator (code): `[[sources/js-reverse2/20261005/Day18/03 匿名函数.js]]`, `[[sources/js-reverse2/20261005/Day18/05 全局变量污染.html]]`, `[[sources/js-reverse2/20261005/Day18/06 闭包.html]]`, `[[sources/js-reverse2/20261005/JS逆向/day06/课上代码/02 闭包函数.js]]`

### prototype-and-call-apply

- Locator: `[[sources/js-reverse2/20261005/Day19/01 原型对象（prototype）.js]]`
- Summary: Prototypal inheritance and the call/apply `this`-binding mechanism.
- Key claims: A constructor function is like a Python class; `new User(...)` creates instances; per-instance members (`this.eat`) are duplicated, whereas `User.prototype.eat = function(){}` stores a shared method among all instances (prototype ~ class members); `User.prototype === u1.__proto__`; the **prototype chain** is the object-inheritance lookup: if the object lacks a property, JS walks `__proto__` up to `Object.prototype`, so `u1.toString()` resolves; `Function.prototype`/`__proto__.constructor` exposes the constructor; `fn.call(obj, arg1, arg2, ...)` runs `fn` with `this` bound to `obj`; `fn.apply(obj, [args])` is the same but takes an array of args (e.g. `eat.apply(p, data)`); the handout shows the reverse-engineering idiom `new ct(...)['$_CAE'](fn)` calling a prototype method by bracket name.
- Learner-relevant: call/apply and prototype lookup appear constantly in obfuscated "vm"-style code where methods are invoked with an explicit `this` and properties are reached by computed string keys.
- Locator (code): `[[sources/js-reverse2/20261005/Day19/02 call方法和apply方法.js]]`, `[[sources/js-reverse2/20261005/JS逆向/day06/课上代码/03 js的各种操作.js]]`

### arrow-window-timers-dom

- Locator: `[[sources/js-reverse2/20261005/Day19/03 箭头函数.js]]`
- Summary: ES6 arrow functions, the browser `window` global, timers, and (as background) DOM/jQuery/Ajax.
- Key claims: `var fn = function(){}` simplifies to `var fn = () => {}`; one param may drop parens (`name => {}`), body with a single expression has implicit return (`v => v*v`), multi-statement bodies need `{}` + `return`; arrows appear as short callbacks (`arr.map(i => i*i)`); `window` is the browser global so `a === window.a` and `window.mm = "爱你"` makes bare `mm` resolve; `window` exists only in a browser — in Node/PyCharm use `globalThis`, and `globalThis.a = 10` exposes bare `a`; inside an IIFE a local function can be exported to the world via `window.chi = chi`; `setTimeout(fn, ms)` runs once, `setInterval(fn, ms)` repeats and returns an id, `clearTimeout/clearInterval(id)` cancel; the clock example pairs `setInterval(show,1000)` with `new Date().toLocaleString()` and DOM writes; DOM lookup `getElementById/ClassName/TagName/querySelector(All)`, static (`onclick=`) vs dynamic (`ele.onclick=fn`) event binding; jQuery `$()` selectors/`.click()/.text()`, and Ajax via `$.ajax({url,type,data,success,error})` or raw `XMLHttpRequest`.
- Learner-relevant: Timers hide delayed decryption/parameter generation and window/globalThis tells you what `this`/bare identifiers resolve to; DOM and Ajax explain where requests are actually fired from.
- Locator (code): `[[sources/js-reverse2/20261005/Day19/04 window全局变量.html]]`, `[[sources/js-reverse2/20261005/Day19/05 定时器.js]]`, `[[sources/js-reverse2/20261005/Day19/06  时钟显示.html]]`, `[[sources/js-reverse2/20261005/JS逆向/day05/课堂笔记/1.Javascript入门.md]]`

### js-basics-notes

- Locator: `[[sources/js-reverse2/20261005/JS逆向/day05/课堂笔记/1.Javascript入门.md]]`
- Summary: The full "Javascript基础入门" handout — origin, Node/PyCharm setup, primitive types, flow control, arrays, objects/JSON, Date/Math, and functions — the primary narrated reference for this cluster.
- Key claims: Consolidates the intro-level material above; explicitly frames every later lesson as JS fundamentals needed before reverse engineering; also demonstrates local execution with Node.js and PyCharm.
- Learner-relevant: A single self-contained read that gives the vocabulary and working examples for all intro-level sections; use it as the anchor handout for the basics.

### js-advanced-notes

- Locator: `[[sources/js-reverse2/20261005/JS逆向/day06/课堂笔记/2.Javascript高级.md]]`
- Summary: The full "Javascript高级" handout — var hoisting vs let/const, closures, timers, `eval` decryption, prototype/prototype-chain, `window`/`globalThis`, call/apply, arrow functions, `exports/require`, DOM, jQuery, and Ajax.
- Key claims: Adds `eval` as a reverse-engineering staple — it runs a **string** as code, so `eval`-obfuscated payloads can be extracted by copying the inner string and printing it; the handout walks a packed `eval(function(p,a,c,k,e,d){...})` sample and points to an online unpacker; documents `exports.add = add` + `const functions = require('./functions')` for Node modules; catalogues `window`'s child objects (`navigator/screen/history/location/document`) as the Browser Object Model.
- Learner-relevant: This is the bridge from language fundamentals to reverse engineering — hoisting, closures, prototype, call/apply, eval, and window/globalThis are exactly the constructs you meet in obfuscated anti-crawl code.

### browser-execution-context

- Locator: `[[sources/js-reverse2/20261005/Day15/01 server/templates/index.html]]`
- Summary: A small Flask-served page that loads external JS and jQuery and wires an event handler that fires an Ajax call.
- Key claims: HTML loads CSS and two `<script>` tags (local `/static/index.js` and CDN jQuery); an inline `onclick`-style handler sends `$.ajax({url:".../books", type:"get", success: fn})` and writes the response into a `<p>` via `p3.html(res.join(","))`; `Day15/01 server/static/index.js` uses `document.getElementsByTagName("h3")[0]` with `dom.onclick = function(){ this.style.color = "green" }` to show event-driven DOM mutation.
- Learner-relevant: A concrete end-to-end example of JS in a real page — where scripts are loaded, how events trigger requests, and how the response is rendered; useful ground truth before reversing minified equivalents.
