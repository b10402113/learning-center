---
source: js-reverse2
source_type: codebase
source_lines: 182225
language: javascript
part: 7
status: absorbed
absorbed_at: 2026-10-05
created: 2026-10-05
updated: 2026-10-05
---

# Digest — js-reverse2 (part 7)

## Overview (L1)
- Environment supplementation (补环境) — the cluster's core skill: run browser crypto code under Node.js by faking the missing BOM/DOM objects it touches, discovered by proxying every global so every `get`/`set` is logged.
- Proxy hooks + Node execution — `Proxy` traps + `Reflect` intercept all reads/writes on `window`/`document`/`navigator`/… ; huge webpack bundles (`loader.js`, `mod1.js`, `mod2.js`) are run through a bundler loader to call the crypto entry (`window.dt`, `loader(id)`).
- 补环境 theory → practice — the theory doc lists the eight frontend objects, then the 瑞数 (rs) two-request/two-cookie flow and a full `window/document/location/navigator` supplement; practice files (`env.js`, `env01.js`, `ts.js`, `auto.js`, `main.js`) restore cookies. 欧冶 (ouyeel) is the worked case.
- Promise semantics (Day28) — callback hell → `new Promise` executor/`resolve`/`reject` → `.then` chaining as a flat async pipeline → promise-wrapped `$.ajax` application.
- pdd case (Day29) — the canonical bundled-bundle补环境: `env.js` + `mod1`/`mod2` + `04 loader.js`, entry `get_anti_content()` calling `loader("fbeZ")`, `lt.updateServerTime`, then `window.dt()`; driven from Python via `execjs`.

## Sections (L2)

### nodejs-execution
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/01 node.js理解.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/test.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/demo/test.js]]`
- Summary: Why browser code breaks under Node: the top-level object differs (`window` vs `global`) and Node-only symbols (`global`, `process`, `Buffer`, `__dirname`, `__filename`) leak into feature checks. `test.js` shows `global.x`/`global["x"]` for a bare `x = 100`. `demo/test.js` shows the `jsdom` alternative: `new JSDOM("<html></html>")` yields a `dom.window` usable as a fake browser.
- Key claims: alias `window = global` so global vars land on `window`; `delete global/process/Buffer/__dirname/__filename` hides Node markers from env checks; bare assignments create globals; jsdom provides a real DOM window when hand-faking is too costly; Node has no `window`/`document`/`navigator` natively.
- Learner-relevant: First move of every补环境 task — decide hand-fake vs `jsdom`, and neutralize Node-only identifiers before running the target.

### frontend-objects
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/02 前端常见对象.js]]`
- Summary: Minimal fakes and the "eight frontend objects" pattern. `window` with `addEventListener` plus a `toString()` returning `'[object Window]'`; `self = top = window`; a feature check `window.toString() === '[object Window]'` decides normal vs fake return.
- Key claims: fake the `toString` tag so `Object.prototype.toString`-style checks pass; alias `self`/`top`/`window` to the same object; a wrong tag makes the script return a decoy/false value. (The theory doc's full list of eight: window, document, navigator, location, screen, history, localStorage/sessionStorage, element.)
- Learner-relevant: `toString` spoofing is a recurring detection point; always mirror `self`/`top`/`window` and match the class tag.

### env-detection
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/03 环境检测Demo.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/04 环境检测Demo2.js]]`
- Summary: A black-box `get_sign()` that does BOM/DOM work (`window.addEventListener`, `document.getElementById`, `createElement('canvas')`, `getContext('2d').fillRect`, `navigator.toString()`, `navigator.userAgent.length`) then validates the environment. Demo2 wraps all fakes in a `setProxyArr(["window","document","kw","canvas","ctx","navigator"])` logging every property access.
- Key claims: two detection philosophies — "am I a browser?" (must pass) and "am I Node?" (must fail); `document.getElementById(id)`/`createElement(ele)` are logged so you know which id/tag the code asks for; canvas chain `createElement→getContext→fillRect` must be stubbed.
- Learner-relevant: Proxied fakes convert a black box into a missing-API log; stub return shapes per logged call rather than guessing.

### proxy
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/05 Proxy语法.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/06 Proxy数组插件.js]]`
- Summary: `new Proxy(target, {get,set})` traps every read/write; the handler must return/forward via `Reflect` to avoid recursion. The array plugin `setProxyArr(names)` loops N names, builds one handler each, and wraps `global[name] || {}` in place.
- Key claims: `get` must `return Reflect.get(target, p)` (or `target[p]`); `set` must `return Reflect.set(target, p, value, receiver)`; naive `return window['username']` inside `get` recurses infinitely; proxy all relevant BOM/DOM names in one call; each access logs object/property/type/value for gap discovery.
- Learner-relevant: Reusable hook harness for any补环境 target; run once to log, then fill only the logged properties.

### supplement-theory
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/JS逆向补环境文档/逆向爬虫之补环境.md]]`
- Summary: The key theory document (608 lines). §1 principle: copied browser crypto code fails under Node because it calls browser-only APIs — you must simulate (补) those objects. §2 enumerates the eight frontend objects and their commonly used members. §3 explains Proxy as the monitoring mechanism and gives the reusable `setProxyArr`. §4 is the 瑞数 (rs) case.
- Key claims: eight objects = window (addEventListener/setInterval/setTimeout/name/self/document/navigator/location/screen/history/toString), document (body/documentElement/cookie/getElement* /createElement/toString), navigator (userAgent/toString), location (href/toString), screen (avail*), history (back/forward/go), localStorage/sessionStorage (getItem/setItem/removeItem), element (style/innerHTML/getAttribute; canvas `toDataURL`); class tags via `toString` are detection points; env checks are either "is browser" or "is not Node" (delete `global`/`process`/`Buffer`); 瑞数 flow = first request returns cookie1 + HTML with (a) dynamic `meta` content, (b) `ts` decryptor, (c) big IIFE setting `window.$_ts`; these three generate cookie2 for the second request; rs `VM`-prefixed files are eval/`new Function` temporaries; rs3/4 cookies end in S (server) and T (JS), rs5/6 also O/P; cookie's first digit = version; bypass via automation / 补环境 / pure-algorithm; rs entry located by searching `.call`, `eval(WindowObject, IIFE)`.
- Learner-relevant: This is the canonical theory+worked-example reference; anchors the 瑞数/欧冶/pdd cases to one supplement procedure.

### env-supplement-practice
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/01 env.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/01 env01.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/02 ts.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/03 auto.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/04 main.js]]`
- Summary: Progressive补齐 for the 欧冶/rs-style target. `env.js` sets `content`, no-op `setInterval`, `window = global` with `window.window/self/top` self-aliases, `addEventListener/attachEvent`, `div/head/script/document/location` fakes, then `setProxyArr(["window","document","div","script","head","meta"])`. `env01.js` is the fuller version; `ts.js` is a single-line minified VM/TS decryptor (2287 bytes, 0 lines); `auto.js` is the auto-generated second script; `main.js` runs `./01 env01`, `./02 ts`, `./03 auto` then `console.log(document.cookie)`.
- Key claims: order matters — env first, then run `ts`/`auto` sources, then read `document.cookie`; `window.window=window` satisfies self-reference checks; no-op timers/`addEventListener`/`attachEvent`; `document.createElement('div')` and `getElementsByTagName` return shaped fakes; `location` object mirrors a real URL's parts; missing-property logs come from the proxy pass.
- Learner-relevant: Template for restoring a cookie from dynamically-fetched TS/auto scripts; demonstrates why minified one-liners are recorded by role not read.

### ouyeel-case
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/欧冶最终版/ouyeel.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/欧冶最终版/ouyeel.py]]`, `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/demo/欧冶最终版/ouyeel.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day21-Day22：逆向核心案例解析6/demo/欧冶最终版/ouyeel.py]]`
- Summary: End-to-end working case. `ouyeel.js` mixes补环境 (metaContent, `window=self=top=global`, no-op timers/`addEventListener`, `window.ActiveXObject=undefined`, `div`/`_head`/`script`/`meta`/`form`/`document`/`location`/`navigator`) plus placeholders `'ts_js'` / `'auto_script_js'` and a `get_cookies()` API returning `document.cookie`. `ouyeel.py` does request1 → extracts `//meta[2]/@content`, `//script[1]/text()`, and `script[@src]` auto JS → string-substitutes them into the JS → `execjs.compile` → `get_cookies()` → parses first cookie pair → request2 with data → paginates and clears cookies per page.
- Key claims: dynamic `meta` content and TS/auto script are per-request and must be fetched then injected (don't hardcode); `meta.getAttribute('r')→'m'` and `script.getAttribute('r')→'m'` satisfy the checks; `parentElement`/`parentNode` with `removeChild` are required; `location.href` matches the referer/path; cookie2 is the first `split(';')[0]` key=value; Python glue handles fetch/substitute/execjs/page loop.
- Learner-relevant: Full template of "fetch dynamic inputs → inject → run JS → harvest cookie → replay with data" for a dynamically-protected site.

### aerfa-loader
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/07 aerfa.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/08 loader.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/09 aerfa_webpack.js]]`, `[[sources/js-reverse2/20261005/JS逆向/Day19-Day20：逆向核心案例解析5/demo/laoder.js]]`
- Summary: Webpack-bundle invocation. `07 aerfa.js` is the standalone `get_s(e,t)` signer: `t = Date.now()+2592e6+(t||3e4)`, `s = Sha1(e + "&t=" + t)`. `08 loader.js` (~71k lines) is the full webpack runtime+bundle; it installs `window.loader = l` and runs module ids on demand. `09 aerfa_webpack.js` only `require("./08 loader")` and calls `window.loader(1).default.parseURLSearchParams("a=1&b=2")`; `demo/laoder.js` (~72k lines) is the same idea, requiring `sha1` and stubbing `window.matchMedia`/`HTMLIFrameElement`, with a `console.log` interceptor.
- Key claims: large bundle files are recorded by role only (runtime + modules, accessed by numeric/string module id); call the export via `window.loader(id).default.<fn>`; the loader exposes `l.m/l.c/l.d/l.r/l.t/l.n/l.o/l.p` and `window.webpackJsonp`; `aerfa` signer uses SHA1 over `url + "&t=" + timestamp`.
- Learner-relevant: To reuse a webpack crypto bundle under Node you need the loader runtime plus a `window` shim; then call by module id instead of reimplementing.

### promise
- Locator: `[[sources/js-reverse2/20261005/Day28/01 死亡回调.html]]`, `[[sources/js-reverse2/20261005/Day28/02 promise语法.html]]`, `[[sources/js-reverse2/20261005/Day28/03 promise的链式操作.html]]`, `[[sources/js-reverse2/20261005/Day28/04 promise的应用.html]]`
- Summary: Callback hell (nested `setTimeout`/nested `$.ajax`) motivating Promises. `02` shows `new Promise((resolve,reject)=>{...})` and `.then(onFulfilled, onRejected)`; `03` refactors A/B/C requests into `get_A/get_B/get_C` each returning a Promise and flattens with `.then().then().then()`, returning the next Promise to chain; `04` wraps `$.ajax` in `fetchData(url)` and chains two requests.
- Key claims: executor runs immediately; `resolve`→fulfilled triggers `then`'s first callback, `reject`→rejected triggers the second; a promise is pending until settled; `.then` returns a new promise so returning a promise from a handler chains/serializes; promise output order is preserved for sequential requests.
- Learner-relevant: Recognizing promise chains is essential for tracing async crypto flows (a signer may depend on an earlier promise); the flat chain reads like sequential steps.

### pdd-case
- Locator: `[[sources/js-reverse2/20261005/Day29/01 env.js]]`, `[[sources/js-reverse2/20261005/Day29/02 mod1.js]]`, `[[sources/js-reverse2/20261005/Day29/03 mod2.js]]`, `[[sources/js-reverse2/20261005/Day29/04 loader.js]]`, `[[sources/js-reverse2/20261005/Day29/05 pdd.js]]`, `[[sources/js-reverse2/20261005/Day29/pdd.py]]`
- Summary: Pinduoduo `anti_content` case. `01 env.js`: `window=global`, `delete global/Buffer`, fakes for `document` (cookie `_nano_fp=...`), `screen`, `navigator` (appVersion/userAgent/webdriver=false), `history.back`, `location` (pinduoduo URL) plus commented `browser_proxy` template. `02 mod1.js` (~24k lines), `03 mod2.js` (~12k lines) are webpack module bundles (`window.webpackJsonp.push([...])`), `04 loader.js` is the runtime exposing `window.loader`. `05 pdd.js`: require env+mod1+mod2+loader, `get_anti_content()` → `window.loader("fbeZ")`, `window.lt['updateServerTime'](Date.now())`, `return window.dt()`. `pdd.py` compiles the JS with `execjs` and calls it, feeding `anti_content` as a request param.
- Key claims: hot-load a module bundle by `window.loader("fbeZ")` before calling the crypto; must call `lt.updateServerTime` with current ms or the sign is stale; missing fixes: `document.cookie` seeds `_nano_fp`, `webdriver:false` defeats automation detection, `screen.availWidth/Height` present; Python drives via `execjs` and passes `anti_content` as a query param.
- Learner-relevant: Canonical bundled补环境 (env + webpack modules + loader + entry); the same four-file shape recurs across real sites — recognize it and swap the module id and entry function.
