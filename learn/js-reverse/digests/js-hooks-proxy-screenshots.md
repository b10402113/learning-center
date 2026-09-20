---
source: js-hooks-proxy-screenshots
source_type: image
source_lines: 0
status: absorbed
absorbed_at: 2026-09-20
created: 2026-09-20
updated: 2026-09-20
---

# Digest — js-hooks-proxy-screenshots

## Overview (L1)

- 三张未被 `js进阶02.md` 正文引用的配套截图，展示 hook 调试环境与 JS 原型链：DevTools Snippets 中的 atob hook 片段，以及 `User.prototype` / `navigator` 的原型对象与原型链结构。

## Sections (L2)

### atob hook 片段运行

- Locator: `[[sources/js-reverse/20260920/课堂笔记/imgs/Snipaste_2024-07-06_10-07-34.png]]`
- Summary: DevTools Sources > Snippets 面板中的 `hook_atob` 片段，展示 `_atob = atob` 保存原函数与包裹函数的 hook 代码，并通过右键 Run 执行。

### User 对象原型链

- Locator: `[[sources/js-reverse/20260920/课堂笔记/imgs/Snipaste_2024-07-11_09-17-22.png]]`
- Summary: 控制台展开 `User.prototype`，标注「原型对象成员」（username/password/constructor）与「原型的原型成员」（hasOwnProperty/toString/valueOf/`__proto__` 等）。

### navigator 原型链

- Locator: `[[sources/js-reverse/20260920/课堂笔记/imgs/Snipaste_2024-07-11_09-24-19.png]]`
- Summary: 控制台展开 `navigator` 对象，标注「当前对象」、`[[Prototype]]: Navigator`「原型对象」与更上层的 `[[Prototype]]: Object`「原型的原型对象」。
