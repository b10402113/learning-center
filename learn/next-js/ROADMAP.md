---
subject: next-js
status: draft # draft → confirmed
path: concept-first
created: 2026-10-05
---

# ROADMAP — next-js

## Goal

成為 Next.js 高手，能**看懂 AI 寫的架構**。三層能力依序推進，重心放中間：

1. **讀懂** — 能解釋 AI 產出的每個檔案與資料流（route handler 在幹嘛、元件的 server/client 身分、資料從哪進哪出）。
2. **判斷（重心）** — 一眼看出 AI 架構決策哪裡對、哪裡踩雷：快取放錯、server/client 邊界畫錯、server action 濫用、N+1 query 等。
3. **主導** — 能先講清楚正確架構，再讓 AI 照著寫。

文章以 zh-Hant（台灣繁體）撰寫，技術名詞保留英文；每個概念以「AI 常犯版 vs 正解版」對照。

## Learning path

**concept-first（概念優先）。** 先建立心智模型，再學操作規則，才知道規則為何存在；接著才是機制與實作。優化目標是「從第一原理判斷 AI 架構」，適合宣告性知識為主、瓶頸在取捨判斷的學習者。

分層順序：

- **Tier 1 — 心智模型**：Next.js 為何存在、web 渲染如何演進（vanilla → React CSR → server-render + hydration）、Server/Client Component 的邊界、App Router 的檔案結構與路由。
- **Tier 2 — 操作規則**：rendering 策略（SSG/ISR/SSR/PPR）、資料抓取、快取與 revalidation、loading/error/streaming、SEO/metadata。
- **Tier 3 — 機制**：Route Handlers、Server Actions、MongoDB/Mongoose 資料建模、認證與 session、驗證與型別契約、錯誤處理與 logging。
- **Tier 4 — 實作與判斷**：URL state、表單、UI/styling、CRUD 與交易、投票/聲望/推薦、aggregation、AI 整合、runtime 與效能、部署，最後以「審查 AI 架構」總收束。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 心智模型：Next.js 為何存在、渲染怎麼運作

1. **[[learn/next-js/nodes/why-nextjs|Why Next.js]]**
   - Goal: 說得出 Next.js 相對純 React/vanilla 解決了什麼問題（全端框架、慣例優於設定、SEO/效能承諾），以及它的代價。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Birth]]
     - [[sources/next-js/20261004/EBOOK.pdf#Introduction]]
     - [[sources/next-js/20261004/007 -  Introduction to Next.js.en.srt#Introduction to Next.js]]
     - [[sources/next-js/20261004/006 -  Before Next.js.en.srt#Before Next.js]]

2. **[[learn/next-js/nodes/web-rendering-model|The Web-Rendering Model]]**
   - Goal: 畫得出 vanilla → React CSR → Next 三種渲染模型，並解釋 hydration 與 hydration mismatch 從何而來。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#How it works]]
     - [[sources/next-js/20261004/008 -  How Web Works.en.srt#How Web Works]]
     - [[sources/next-js/20261004/HTML/013 -  Birth of Server Components.html#Birth of Server Components]]

3. **[[learn/next-js/nodes/client-server-components|Server vs Client Components]]**
   - Goal: 對任一元件判斷它該是 Server 還是 Client Component，並說出 `"use client"` 邊界對 bundle、SEO、安全與依賴的後果。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Client Vs. Server]]
     - [[sources/next-js/20261004/010 -  React Client and Server Components.en.srt#React Client and Server Components]]
     - [[sources/next-js/20261004/024 -  Client vs. Server Paradigm.en.srt#Client vs. Server Paradigm]]
     - [[sources/next-js/20261004/HTML/004 -  React Client and Server Components.html#React Client and Server Components]]

4. **[[learn/next-js/nodes/app-router-anatomy|App Router Anatomy]]**
   - Goal: 看懂一個 Next.js 專案的每個檔案在做什麼（`app/`、`layout`/`page`、`children`、config），並知道新程式碼該放哪。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Create a Next.js Application]]
     - [[sources/next-js/20261004/009 -  Next.js Project Structure.en.srt#Next.js Project Structure]]
     - [[sources/next-js/20261004/015 -  Create a Next.js Application.en.srt#Create a Next.js Application]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/layout.tsx]]

5. **[[learn/next-js/nodes/file-based-routing|Routing as a Filesystem]]**
   - Goal: 由資料夾結構推導出完整路由樹（static/nested/dynamic/route groups/nested layouts），並解釋 params 的來源。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Routing]]
     - [[sources/next-js/20261004/023 -  File Based Routing.en.srt#File Based Routing]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/layout.tsx]]

### Tier 2 — 操作規則：渲染、資料與快取

6. **[[learn/next-js/nodes/rendering-strategies|Rendering Strategies]]**
   - Goal: 依「內容多久變一次、要不要即時互動」為每個頁面選對 SSG/ISR/SSR/PPR，並說明 build time 與 run time 的差別。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Rendering]]
     - [[sources/next-js/20261004/012 -  Data Fetching (CSR, SSR, ISR, PPR).en.srt#Data Fetching (CSR, SSR, ISR, PPR)]]
     - [[sources/next-js/20261004/025 -  Different Rendering Strategies.en.srt#Different Rendering Strategies]]

7. **[[learn/next-js/nodes/data-fetching|Data Fetching in Server Components]]**
   - Goal: 在 Server Component 內正確抓資料，避開 request waterfall，判斷何時該 `fetch`、何時直接呼叫資料庫。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Data Fetching]]
     - [[sources/next-js/20261004/012 -  Data Fetching (CSR, SSR, ISR, PPR).en.srt#Data Fetching (CSR, SSR, ISR, PPR)]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/components/navigation/RightSidebar.tsx]]

8. **[[learn/next-js/nodes/caching-revalidation|Caching & Revalidation]]**
   - Goal: 說清楚 Next.js 各層快取（fetch cache、`revalidatePath`/`Tag`、React `cache()`、`unstable_cache`）與 route segment config，並指出 AI 最常把快取放錯的地方。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Data Fetching]]
     - [[sources/next-js/20261004/EBOOK.pdf#Cache]]
     - [[sources/next-js/20261004/149 -  Advanced Next.js.en.srt#Advanced Next.js]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/question.action.ts]]

9. **[[learn/next-js/nodes/loading-error-boundaries|Loading, Error & Streaming]]**
   - Goal: 用 `loading.tsx`/`error.tsx`/Suspense/`after()` 把載入與錯誤狀態放到正確層級，並解釋 streaming 與 page-level 邊界的取捨。
   - Sources:
     - [[sources/next-js/20261004/145 -  Use of Loading file.en.srt#Use of Loading file]]
     - [[sources/next-js/20261004/146 -  Use of Error File.en.srt#Use of Error File]]
     - [[sources/next-js/20261004/101 -  Question Views (Approach  3).en.srt#Question Views (Approach 3)]]
     - [[sources/next-js/20261004/HTML/046 -  Introduction to Loadings and Errors.html#Introduction to Loadings and Errors]]

10. **[[learn/next-js/nodes/metadata-seo|SEO & the Metadata API]]**
    - Goal: 用 config-based 與 file-based metadata 產生正確的 title/description/OG/Twitter，並知道動態路由要用 `generateMetadata` 且避免重複抓取。
    - Sources:
      - [[sources/next-js/20261004/EBOOK.pdf#SEO and Metadata]]
      - [[sources/next-js/20261004/014 -  SEO & Metadata.en.srt#SEO & Metadata]]
      - [[sources/next-js/20261004/147 -  How to SEO-optimize websites in Nextjs_.en.srt#How to SEO-optimize websites in Nextjs]]

### Tier 3 — 機制：後端、資料與身分

11. **[[learn/next-js/nodes/route-handlers|Route Handlers]]**
    - Goal: 用 `route.ts` 寫出正確的 REST 端點（HTTP verbs、params vs searchParams、狀態碼與回應形狀），並判斷何時用 route handler、何時用 server action。
    - Sources:
      - [[sources/next-js/20261004/EBOOK.pdf#Backend]]
      - [[sources/next-js/20261004/069 -  Introduction to Route Handlers^.en.srt#Introduction to Route Handlers]]
      - [[sources/next-js/20261004/076 -  API Fetch Handler.en.srt#API Fetch Handler]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/api.ts]]

12. **[[learn/next-js/nodes/server-actions|Server Actions]]**
    - Goal: 判斷一個 mutation 該用 server action 還是 route handler，並寫出經 Zod 驗證、帶授權、可漸進增強的安全 action。
    - Sources:
      - [[sources/next-js/20261004/EBOOK.pdf#Server Actions]]
      - [[sources/next-js/20261004/083 -  Server Action Handler.en.srt#Server Action Handler]]
      - [[sources/next-js/20261004/081 -  Server Action Demo.en.srt#Server Action Demo]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/handlers/action.ts]]

13. **[[learn/next-js/nodes/data-modeling|Data Modeling (MongoDB/Mongoose)]]**
    - Goal: 在 refs、embedding、join collection 之間做出正確取捨，解釋反正規化計數器、polymorphic model，以及 dev/hot-reload 的 model cache 與連線 singleton 為何必要。
    - Sources:
      - [[sources/next-js/20261004/057 -  Architect Database Structure.en.srt#Architect Database Structure]]
      - [[sources/next-js/20261004/062 -  Create Tag Models.en.srt#Create Tag Models]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/database/question.model.ts]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/mongoose.ts]]

14. **[[learn/next-js/nodes/authentication|Authentication & Sessions]]**
    - Goal: 說清楚 cookie/session/JWT、credentials vs OAuth、user/account 為何分離，並解釋 edge runtime 不能連 Mongoose 時 auth 只能用 route handlers 的架構限制。
    - Sources:
      - [[sources/next-js/20261004/030 -  What is Authentication.en.srt#What is Authentication]]
      - [[sources/next-js/20261004/034 -  Setup NextAuth with GitHub Provider.en.srt#Setup NextAuth with GitHub Provider]]
      - [[sources/next-js/20261004/078 -  The Edge Case.en.srt#The Edge Case]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/auth.ts]]

15. **[[learn/next-js/nodes/validation-contracts|Validation & Typed Contracts]]**
    - Goal: 用共享的 Zod schema 與 `ActionResponse<T>`/DTO 型別，讓 client 表單與 server action 共用同一份契約，並正確處理 async `params` 型別。
    - Sources:
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/validations.ts]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/types/global.d.ts]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/types/action.d.ts]]

16. **[[learn/next-js/nodes/error-logging|Error Handling & Logging]]**
    - Goal: 用錯誤類別階層與集中的 `handleError` 讓 route handler 與 server action 共用回應形狀，並用 Pino 做 runtime-aware 的結構化 logging。
    - Sources:
      - [[sources/next-js/20261004/066 -  The Art of Failing Gracefully.en.srt#The Art of Failing Gracefully]]
      - [[sources/next-js/20261004/067 -  Implement Error Handling.en.srt#Implement Error Handling]]
      - [[sources/next-js/20261004/068 -  Implement Logging.en.srt#Implement Logging]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/http-errors.ts]]

### Tier 4 — 實作與判斷：組裝、最佳化、上線

17. **[[learn/next-js/nodes/url-state|URL State & the Search/Filter/Pagination Pattern]]**
    - Goal: 把搜尋、篩選、分頁都放進 URL（`formUrlQuery`、debounce、`page`/`pageSize`），做到可分享、可 SEO，並判斷何時不該用 URL state。
    - Sources:
      - [[sources/next-js/20261004/047 -  How to do URL State Management.en.srt#How to do URL State Management]]
      - [[sources/next-js/20261004/049 -  Local Search Bar.en.srt#Local Search Bar]]
      - [[sources/next-js/20261004/126 -  Implement Pagination.en.srt#Implement Pagination]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/url.ts]]

18. **[[learn/next-js/nodes/forms|Forms: React Hook Form + Zod]]**
    - Goal: 寫出 schema 驅動、可重用的表單（generic AuthForm、QuestionForm、MDX editor、`useTransition`），並把 server action 正確接進表單。
    - Sources:
      - [[sources/next-js/20261004/037 -  Creating Auth Form.en.srt#Creating Auth Form]]
      - [[sources/next-js/20261004/052 -  Question Form.en.srt#Question Form]]
      - [[sources/next-js/20261004/053 -  Question Editor.en.srt#Question Editor]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/components/forms/AuthForm.tsx]]

19. **[[learn/next-js/nodes/ui-styling|UI & Styling System]]**
    - Goal: 看懂 Tailwind v4 CSS-first 主題、shadcn/ui 元件、theming 與字體/資源的組織方式，並判斷哪些樣式該進 `globals.css`、哪些該留在元件。
    - Sources:
      - [[sources/next-js/20261004/EBOOK.pdf#TailwindCSS]]
      - [[sources/next-js/20261004/019 -  Tailwind CSS Setup.en.srt#Tailwind CSS Setup]]
      - [[sources/next-js/20261004/027 -  Installing ShadCN UI.en.srt#Installing ShadCN UI]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/app/globals.css]]

20. **[[learn/next-js/nodes/crud-transactions|Server Actions in Practice: CRUD & Transactions]]**
    - Goal: 實作多文件寫入（建/改/刪 question、tag upsert 與 join docs、cascade delete、計數器一致），一律包在 transaction 內並正確 revalidate。
    - Sources:
      - [[sources/next-js/20261004/087 -  Create Question Action.en.srt#Create Question Action]]
      - [[sources/next-js/20261004/139 -  Implement Question Delete Functionality.en.srt#Implement Question Delete Functionality]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/question.action.ts]]

21. **[[learn/next-js/nodes/voting-reputation|Voting, Reputation, Badges & Recommendations]]**
    - Goal: 設計 polymorphic 的投票狀態機、交易式計數、interaction log 與聲望計算，並用 aggregation 做 badge 與推薦。
    - Sources:
      - [[sources/next-js/20261004/112 -  Create Vote Actions.en.srt#Create Vote Actions]]
      - [[sources/next-js/20261004/141 -  Build interactions and reputation.en.srt#Build interactions and reputation]]
      - [[sources/next-js/20261004/142 -  Badge System.en.srt#Badge System]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/vote.action.ts]]

22. **[[learn/next-js/nodes/aggregation-queries|Aggregation Pipelines & Advanced Queries]]**
    - Goal: 讀懂並寫出 `$lookup`/`$unwind`/`$group` 這類 pipeline，實作收藏清單、使用者熱門 tag 與跨模型 global search，並避免 N+1。
    - Sources:
      - [[sources/next-js/20261004/122 -  Get All Saved Questions Action.en.srt#Get All Saved Questions Action]]
      - [[sources/next-js/20261004/136 -  Implement User Tags.en.srt#Implement User Tags]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/collection.action.ts]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/general.action.ts]]

23. **[[learn/next-js/nodes/ai-integration|AI Integration]]**
    - Goal: 用 Vercel AI SDK 在 route handler 內產生文字，並設計「人類先寫、AI 潤飾」的 human-in-the-loop 流程，而不是讓 AI 灌水。
    - Sources:
      - [[sources/next-js/20261004/108 -  AI Answer API Route.en.srt#AI Answer API Route]]
      - [[sources/next-js/20261004/110 -  Make Your Answer AI-Perfect.en.srt#Make Your Answer AI-Perfect]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/app/api/ai/answers/route.ts]]

24. **[[learn/next-js/nodes/runtime-performance|Runtime & Performance]]**
    - Goal: 在 Node 與 Edge runtime 之間正確取捨（限制、冷啟動、延遲），並套用圖片/字體優化、平行抓取與 bundling 設定。
    - Sources:
      - [[sources/next-js/20261004/EBOOK.pdf#Node vs Edge Runtime]]
      - [[sources/next-js/20261004/EBOOK.pdf#Limitations of Edge Runtime]]
      - [[sources/next-js/20261004/149 -  Advanced Next.js.en.srt#Advanced Next.js]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/next.config.ts]]

25. **[[learn/next-js/nodes/deployment|Deploying & Operating on Vercel]]**
    - Goal: 把 app 從本機推到正式環境，並解掉環境變數、OAuth callback、build lint/TS、runtime 匯入等常見上線問題。
    - Sources:
      - [[sources/next-js/20261004/150 -  Deploy on Vercel.en.srt#Deploy on Vercel]]
      - [[sources/next-js/20261004/HTML/056 -  Deploy on Vercel.html#Deploy on Vercel]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/next.config.ts]]

26. **[[learn/next-js/nodes/reviewing-ai-architecture|Reviewing AI-Generated Next.js Architecture]]**
    - Goal: 拿一份 AI 生的 Next.js 專案，沿著 request 走一遍（route → rendering → data → cache → mutate → DB），用邊界/快取/auth/資料/錯誤五軸給出對或錯的判斷與修正建議。
    - Sources:
      - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/question.action.ts]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/auth.ts]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/components/votes/Votes.tsx]]
      - [[sources/next-js/20261004/jsmasterypro_devflow/app/api/users/[id]/route.ts]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
