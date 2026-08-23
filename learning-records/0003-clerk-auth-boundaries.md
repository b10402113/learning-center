# 0003 — Clerk 認證與安全邊界：Resolver 不是 Gate，Token 有明確邊界

- **日期**: 2026-08-22
- **Node**: clerk-auth-and-boundaries（step 1–3 / 3）
- **來源**:
  - `sources/vertex-learning-platform/AGENTS.md#traps`
  - `sources/vertex-learning-platform/AGENTS.md#app-structure`
  - `sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt`

## 非顯而易見的領悟

1. **Middleware 是 resolver 不是 gate，這是被廣泛誤解的概念。** 在 Next.js + Clerk 的架構下，middleware 讀取 session cookie、驗證 JWT、附加 auth state，但不阻擋任何路由。保護路由是 page/layout 層級的顯式檢查（`auth()` 回傳值是否為 null）。這個歸因決定了一切：如果 middleware 是 gate，你要嘛全部放行（受保護頁面裸奔），要嘛全部攔截（公開頁面看不到）。Resolver 模型讓你做到「精準保護」。
2. **NEXT_PUBLIC_ 前綴不是配置選項，而是 Next.js 的架構邊界。** Bundler 在 build 時把 `NEXT_PUBLIC_*` 的值硬編碼進 client bundle，忽略其他 env。判斷原則：「只能做事、不能被拿來做別的事」→ client-safe；「能做有副作用的操作」→ 絕對不能出現在瀏覽器端。但這道防線只在 build 時生效，development 模式下不會阻止你——不能依賴框架來擋安全問題。
3. **Auth state 的流動路徑是：middleware → server component → props → client component。** Client component 只透過 props 接收渲染所需的資料（使用者名稱、頭像 URL），拿不到 token 本身。把 `auth()` 的回傳值直接傳給 client component 是安全邊界破壞——在 development 模式下「能跑」，但實際上已經洩漏了 userId。
4. **AI 代理最容易犯的認證錯誤是「把 middleware 當 gate」。** 在 middleware 裡加上「未登入就重導向」的邏輯，導致所有頁面都變成必須登入才能看。AGENTS.md 把「browsing stays public」寫進操作手冊，就是為了防止這個錯誤。這和 design-system node 的「你不設計 UI」是同一種防護模式：用寫下來的規則限制 AI 的自由度。

## 對後續的影響

- Clerk 的 user id 是進度追蹤（progress）的 key——理解 auth state 的流動路徑，是理解後續 progress API 的基礎。
- 在自己的 Next.js 專案上可直接套用：環境變數分類表 + `.env.example` 註解 + AGENTS.md 安全規則。
- 與 design-system node 的「兩道鎖」（規則 + 規格）互相印證：安全邊界也是「規則（AGENTS.md）+ 邊界（NEXT_PUBLIC_ 前綴 + server-only 原則）」的組合。

## 待覆核／開放問題

- Next.js 16 的 proxy 重命名只是語義更準確，還是有行為改變？——目前理解是純重命名，待實測確認。
- CodeRabbit PR 審查的實際覆蓋率如何？能否偵測到 client component 裡的隱性 token 使用？
- Clerk 的 handshake 機制在 token 過期時自動重新驗證——這個「自動登入」的邊界在哪裡？session timeout 是 Clerk 端控制還是 client 端？
