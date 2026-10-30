---
source: sources/agentic-engineer/20261030/ai-course-demos/001-login-btn-issue
source_type: codebase
source_lines: 811
language: TypeScript
file_count: 24
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- `app/` — 五個路由檔：首頁直接轉 `/login`、登入頁（server component，已登入就轉 `/dashboard`）、受保護的 dashboard，加上 `actions/` 兩個 server action 檔。教學點：這個 app 小到能一次讀完，卻把登入流程拆成「表單 → action → registry → handler」四層，讓 bug 可以藏在型別檢查看不到的查表裡。
- `lib/` — `auth.ts` 負責憑證驗證與一張 handler registry，`session.ts` 用 base64 JSON cookie 管 session，`tasks.ts` 是 in-memory 的 task CRUD。`authHandlers` 的 key 與 action 查表用的字串不一致，是整個 demo 唯一的 bug。
- `components/` — `login-form.tsx` 用 `useActionState` 接 server action，是全 app 唯一會顯示錯誤的地方；`task-list.tsx` 則是純 server-rendered 的表單集合。
- `proxy.ts` — Next 16 的 proxy（前身 middleware），只憑 cookie 是否存在做樂觀轉址，真正的 session 驗證留在每個 page／action。
- `overview.md` — 90 行的 demo brief，把「靜默 bug 怎麼設計」寫成規格：handler 改名、留下一處舊名引用、查表用 optional chaining、而且必須通過 `tsc`。這是理解整個 repo 的入口文件。
- `AGENTS.md` / `CLAUDE.md` / `skills-lock.json` — agent 設定層：AGENTS.md 只有 5 行，要求 agent 先讀 `node_modules/next/dist/docs/`（因為這個 Next 版本與訓練資料不同）；CLAUDE.md 只有一行 `@AGENTS.md`；skills-lock.json 以 lockfile 形式釘住十個 skill 的來源與 hash。

# L2 detail

- `#L1-L26` — `package.json` — Next 16.2.10 + React 19.2.4，Tailwind v4 走 `@tailwindcss/postcss`；只有 dev/build/start/lint 四個 script，沒有任何測試框架，所以「bug 是否存在」只能靠實際點擊或 agent 自己推理，而不是跑測試。
- `#L1-L34` — `tsconfig.json` — `strict: true`、`moduleResolution: bundler`、路徑別名 `@/*`。重點在 strict 也救不了這個 bug：`Record<string, AuthHandler>` 用任意字串索引永遠合法，TypeScript 無法知道 key 存不存在。
- `#L1-L7` — `next.config.ts` — 空白設定，示範這個 repo 沒有用任何編譯期魔法掩蓋 runtime 行為。
- `#L1-L18` — `eslint.config.mjs` — `core-web-vitals` 加 TypeScript 規則，忽略 `.next`、`out`、`build`；lint 也不會抓到查表 key 打錯。
- `#L1-L7` — `postcss.config.mjs` — 只有 `@tailwindcss/postcss` 一個 plugin，Tailwind v4 不再需要 `tailwind.config`。
- `#L1-L3` — `pnpm-workspace.yaml` — 以 `ignoredBuiltDependencies` 跳過 sharp、unrs-resolver 的 build script，屬於安裝環境的雜訊設定。
- `#L1-L33` — `app/layout.tsx` — root layout：Geist 字型變數、`metadata`（title「Task Manager」）、`min-h-full flex flex-col` 的外框；提供 agent 判斷「這是 App Router 專案」的第一個線索。
- `#L1-L26` — `app/globals.css` — Tailwind v4 的 `@import "tailwindcss"` 加 `@theme inline` 把字型變數接進 design token，另有 prefers-color-scheme 的明暗兩套背景色。
- `#L1-L5` — `app/page.tsx` — 首頁只有 `redirect("/login")`，說明進入點不是導覽頁而是守門邏輯。
- `#L1-L24` — `app/login/page.tsx` — server component：先 `getSession()`，有 session 就 `redirect("/dashboard")`，否則渲染 `LoginForm`。這裡證明「登入頁本身是正常的」，把嫌疑範圍縮到表單送出之後。
- `#L1-L42` — `app/dashboard/page.tsx` — 受保護頁面：沒 session 就轉回 `/login`，用 `getUserById` 取 email、`getTasks` 取清單，右上角掛一個 `logout` 表單。是驗證「登入成功後長什麼樣」的對照組。
- `#L1-L26` — `proxy.ts` — 樂觀驗證閘門：`protectedRoutes` 沒有 session cookie 就轉 `/login`，`publicRoutes` 有 cookie 就轉 `/dashboard`；`config.matcher` 排除 api、`_next` 靜態資源與圖片。註解明講真正的檢查在各 page／action，這正是為什麼偽造 cookie 值也能過 proxy。
- `#L1-L30` — `app/actions/auth-actions.ts` — bug 現場。`login` 用 `authHandlers["login"]` 取 handler，再用 `handler?.(formData)` 呼叫；registry 裡的 key 其實叫 `authenticate`，於是 lookup 回 `undefined`、optional chaining 讓呼叫變成 no-op、`outcome?.success` 為 undefined，最後回傳 `{ error: undefined }`，畫面完全沒有變化。`logout` 用的 key 存在，所以登出正常——這個不對稱是 agent 破案的關鍵對比。
- `#L1-L37` — `app/actions/task-actions.ts` — 三個 task server action，共用 `requireUserId()` 從 session 取 userId，寫入後 `revalidatePath("/dashboard")`；示範同一份 codebase 裡「正確的 action」長什麼樣。
- `#L1-L62` — `lib/auth.ts` — 核心 auth 模組：`verifyCredentials` 在隔離測試下完全正確（單一 demo 使用者 `demo@example.com` / `password123`）、`getUserById` 供 dashboard 用，以及 `authHandlers` registry 內含 `authenticate` 與 `logout` 兩個 handler。學習點：registry 模式讓「新增流程」變成加一個 key，也讓「改名」變成一個不會報錯的靜默故障。
- `#L1-L50` — `lib/session.ts` — session cookie 的建立／讀取／刪除：`Buffer.from(JSON.stringify(...)).toString("base64")`，`httpOnly`、`sameSite: "lax"`、七天效期。decode 有 try/catch 與欄位檢查，但沒有簽章，所以只是 demo 等級的「記住你是誰」。
- `#L1-L50` — `lib/tasks.ts` — 以 userId 為 key 的 `Map<string, Task[]>`，首次存取時種兩筆種子任務（其中一筆就叫「Find the login bug」），提供 `getTasks`／`addTask`／`toggleTask`／`removeTask`。註解明說重啟就清空，持久化不在範圍內。
- `#L1-L61` — `components/login-form.tsx` — client component：`useActionState(login, {})` 拿到 `state`、`formAction`、`pending`，兩個受控輸入加一個 `disabled={pending}` 的送出鈕；錯誤訊息只在 `state.error` 為 truthy 時渲染，正好對應 bug 產生 `{ error: undefined }` 的靜默結果。
- `#L1-L73` — `components/task-list.tsx` — 三個 `<form action={...}>` 分別接 add／toggle／remove，用 hidden input 傳 task id；完全沒有 client state，展示 server action 可以撐起整個互動。
- `#L1-L5` — `AGENTS.md` — 只有一段 `nextjs-agent-rules`：宣告這個 Next.js 與模型訓練資料不同、API 與檔案結構都可能變，要求 agent 寫任何程式前先讀 `node_modules/next/dist/docs/` 的對應指南。這是「把版本不確定性寫進 context」的最小範例。
- `#L1-L1` — `CLAUDE.md` — 整個檔案只有一行 `@AGENTS.md`，用匯入避免兩份 agent 指令漂移；與 004 的空 CLAUDE.md 形成對照。
- `#L1-L90` — `overview.md` — demo brief（Lessons 2.1 + 2.3）：app 概念、要植入的 bug 機制（handler 改名 + registry optional chaining，且不得被 TypeScript 抓到）、拍片要捕捉的 read→decide→act→observe 迴圈，以及 2.3 的硬性命名要求（auth／session／login 必須可 grep）。是「先設計教學效果再寫程式」的範本。
- `#L1-L36` — `README.md` — create-next-app 的預設說明，唯一價值是確認專案沒有額外 runbook；所有真正說明都在 `overview.md` 與 `AGENTS.md`。
- `#L1-L65` — `skills-lock.json` — `version: 1` 加十個 skill（architect、audit、debug、document、honest、mvp、plan、remember、review、teach），每個都記錄 `source`（GitHub repo）、`sourceType`、`skillPath` 與 `computedHash`。學習點：skill 被當成有版本、可驗證的依賴，而不是複製貼上的提示詞。
