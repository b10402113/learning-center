---
subject: next-js
status: confirmed
path: systems
created: 2026-10-04
---

# ROADMAP — next-js

## Goal

成為 Next.js 高手，能**看懂 AI 寫的架構**。三層能力按序推進、重心放中間：
1. **讀懂** — 能解釋 AI 產出的每個檔案與資料流（route handler 在幹嘛、元件的 server/client 身分、資料從哪進哪出）。
2. **判斷（重心）** — 一眼看出 AI 架構決策哪裡對、哪裡踩雷：快取放錯、server/client 邊界畫錯、server action 濫用、N+1 query 等。
3. **主導** — 能先講清楚正確架構，再讓 AI 照著寫，而不是被 AI 的產出牽著走。

## Learning path

**Systems / 架構分層：** 沿著一台 Next.js app 的層次往上鋪，先建立「整台機器怎麼組起來」的心智模型，再逐層鑽進規則與取捨，最後用真實 codebase 做驗收。

**Angle:** 不按課程影片順序，而按「一台 app 由哪幾層組成」排序——從全貌與渲染模型開始，然後是路由／元件／資料層、變更與信任邊界（server actions / auth）、持久層（Mongoose）、橫切面（state / styling / loading / SEO / 效能 / 部署），最後回到 DevFlow 全端資料流與 AI 架構驗收。

**Tier 結構:**
- Tier 1 — 全貌與心智模型：Next.js 作為 framework、CSR/SSR/RSC/hydration、專案分層、runtime 與渲染策略。
- Tier 2 — 路由、元件、資料層：檔案式路由與 layout、元件組合與 client 邊界、RSC 抓資料與 request dedup、fetch 快取、revalidation 與多層快取、串流與 PPR、Route Handlers。
- Tier 3 — 變更與信任邊界：Server Actions 模型、Zod 驗證契約、錯誤處理與 logging、action 模式與交易、NextAuth 認證邊界、credentials 與 User/Account 分離。
- Tier 4 — 持久層：MongoDB 資料建模、Mongoose 模型與型別、aggregation 與進階查詢。
- Tier 5 — 橫切面：狀態管理、URL state、樣式與設計系統、loading/error 邊界、SEO 與 metadata、效能最佳化、部署與 production。
- Tier 6 — 綜合驗收：DevFlow 全端資料流走讀、AI 架構驗收與判斷。

**Optimizes for:** 先看到整體架構與各層如何相扣，再往下鑽；每一層都用「AI 常犯版 vs 正解版」對照，直接服務「判斷 AI 架構」的學習重心。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe next-js/<node-id>` to measure a node, then `/nodes next-js/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 全貌與心智模型

1. **[[learn/next-js/nodes/framework-mental-model|Next.js 作為 framework：加在 React 上的那一層]]**
   - Goal: 能說出 Next.js 相對 React 多加了哪幾層（routing、rendering、data、backend、metadata），以及 framework vs library 的差別，判斷一個 Next.js 專案在哪些地方比純 React「多做了事」。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Birth]]
     - [[sources/next-js/20261004/EBOOK.pdf#Introduction]]
     - [[sources/next-js/20261004/EBOOK.pdf#Roadmap]]
     - [[sources/next-js/20261004/006 -  Before Next.js.en.srt#Before Next.js]]
     - [[sources/next-js/20261004/007 -  Introduction to Next.js.en.srt#Introduction to Next.js]]
     - [[sources/next-js/20261004/HTML/013 -  Birth of Server Components.html#Birth of Server Components]]
     - [[sources/next-js/20261004/HTML/034 -  What is Serverless Backend.html#What is Serverless Backend]]

2. **[[learn/next-js/nodes/rendering-model|渲染模型：CSR / SSR / RSC / hydration]]**
   - Goal: 能用 CSR / SSR / RSC / hydration 四個詞解釋一個頁面從請求到互動的完整生命週期，並指出任一元件是在 server 還是 client 執行、為什麼。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#How it works]]
     - [[sources/next-js/20261004/EBOOK.pdf#The vanilla — HTML, CSS, and JavaScript]]
     - [[sources/next-js/20261004/EBOOK.pdf#The React way]]
     - [[sources/next-js/20261004/EBOOK.pdf#The Next.js Way - A blend of both]]
     - [[sources/next-js/20261004/EBOOK.pdf#Client Vs. Server]]
     - [[sources/next-js/20261004/008 -  How Web Works.en.srt#How Web Works]]
     - [[sources/next-js/20261004/010 -  React Client and Server Components.en.srt#React Client and Server Components]]
     - [[sources/next-js/20261004/024 -  Client vs. Server Paradigm.en.srt#Client vs. Server Paradigm]]
     - [[sources/next-js/20261004/HTML/004 -  React Client and Server Components.html#React Client and Server Components]]

3. **[[learn/next-js/nodes/project-structure-layers|專案結構與分層：feature 放哪裡]]**
   - Goal: 能指出一個 App Router 專案的每個資料夾對應架構的哪一層，並判斷一段新 feature code 該放在哪一層、放在哪個檔案。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Create a Next.js Application]]
     - [[sources/next-js/20261004/009 -  Next.js Project Structure.en.srt#Next.js Project Structure]]
     - [[sources/next-js/20261004/015 -  Create a Next.js Application.en.srt#Create a Next.js Application]]
     - [[sources/next-js/20261004/HTML/001 -  Next.js installation.html#Next.js installation]]
     - [[sources/next-js/20261004/HTML/002 -  Next.js Project Structure.html#Next.js Project Structure]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/layout.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/layout.tsx]]

4. **[[learn/next-js/nodes/runtime-and-rendering-strategies|執行環境與渲染策略：Node / Edge、SSG / ISR / SSR / PPR]]**
   - Goal: 能依「內容多久變一次、需不需要即時」選出 SSG / ISR / SSR / PPR，並判斷一段 route 該跑 Node 還是 Edge runtime、理由是什麼。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Rendering]]
     - [[sources/next-js/20261004/EBOOK.pdf#Different Runtimes]]
     - [[sources/next-js/20261004/EBOOK.pdf#Node vs Edge Runtime]]
     - [[sources/next-js/20261004/EBOOK.pdf#Limitations of Edge Runtime]]
     - [[sources/next-js/20261004/EBOOK.pdf#Edge Function]]
     - [[sources/next-js/20261004/EBOOK.pdf#Use Case]]
     - [[sources/next-js/20261004/012 -  Data Fetching (CSR, SSR, ISR, PPR).en.srt#Data Fetching (CSR, SSR, ISR, PPR)]]
     - [[sources/next-js/20261004/025 -  Different Rendering Strategies.en.srt#Different Rendering Strategies]]
     - [[sources/next-js/20261004/149 -  Advanced Next.js.en.srt#Advanced Next.js]]

### Tier 2 — 路由、元件、資料層

5. **[[learn/next-js/nodes/file-based-routing-layouts|檔案式路由、layout 與 route groups]]**
   - Goal: 能由 URL 反推檔案樹，正確使用 nested / dynamic / route groups / layout，並判斷 AI 給的路由結構是否會產生錯誤的 URL 或重複的 layout。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Routing]]
     - [[sources/next-js/20261004/011 -  Routing, Handling Errors & Loadings.en.srt#Routing, Handling Errors & Loadings]]
     - [[sources/next-js/20261004/023 -  File Based Routing.en.srt#File Based Routing]]
     - [[sources/next-js/20261004/032 -  Create Auth Routes.en.srt#Create Auth Routes]]
     - [[sources/next-js/20261004/HTML/003 -  App Router.html#App Router]]
     - [[sources/next-js/20261004/HTML/005 -  Routing, Handling Errors & Loadings.html#Routing, Handling Errors & Loadings]]

6. **[[learn/next-js/nodes/component-composition-patterns|元件組合模式：server shell + client island]]**
   - Goal: 能用 server shell + client island 組裝畫面，辨認哪些元件該維持 server、哪些 leaf 才需要 client，並看出 props-in / JSX-out 的純元件。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Client Vs. Server]]
     - [[sources/next-js/20261004/024 -  Client vs. Server Paradigm.en.srt#Client vs. Server Paradigm]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/components/DataRenderer.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/components/cards/QuestionCard.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/components/navigation/RightSidebar.tsx]]

7. **[[learn/next-js/nodes/client-islands-and-dynamic-imports|Client 邊界陷阱與 client-only 套件]]**
   - Goal: 能判斷 `"use client"` 是否被濫用、哪些第三方套件（MDX editor、next-themes）必須隔離成 client island 或 dynamic import（ssr:false），以及會不會把 server component 拉進 client bundle。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Client Vs. Server]]
     - [[sources/next-js/20261004/024 -  Client vs. Server Paradigm.en.srt#Client vs. Server Paradigm]]
     - [[sources/next-js/20261004/053 -  Question Editor.en.srt#Question Editor]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/components/editor/index.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/context/Theme.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/components/votes/Votes.tsx]]

8. **[[learn/next-js/nodes/server-data-fetching|在 RSC 裡抓資料：何時 server、何時 client]]**
   - Goal: 能在 RSC 裡直接 async 抓資料，說出與 useEffect fetch 相比在 FCP / SEO / dedup / 金鑰安全上的差異，並辨認 N+1 與 network waterfall。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Data Fetching]]
     - [[sources/next-js/20261004/012 -  Data Fetching (CSR, SSR, ISR, PPR).en.srt#Data Fetching (CSR, SSR, ISR, PPR)]]
     - [[sources/next-js/20261004/091 -  Fetch and Display Questions.en.srt#Fetch and Display Questions]]
     - [[sources/next-js/20261004/098 -  Fetch Question Details.en.srt#Fetch Question Details]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/page.tsx]]

9. **[[learn/next-js/nodes/fetch-caching-and-dedup|Fetch 快取與 request dedup]]**
   - Goal: 能解釋 Next.js 擴充的 fetch 為何自動快取、request dedup 發生在哪一層，並判斷一段 fetch 的快取行為是否符合預期。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Data Fetching]]
     - [[sources/next-js/20261004/EBOOK.pdf#Cache]]
     - [[sources/next-js/20261004/148 -  How to SEO-optimize websites in Nextjs.en.srt#How to SEO-optimize websites in Nextjs]]
     - [[sources/next-js/20261004/149 -  Advanced Next.js.en.srt#Advanced Next.js]]

10. **[[learn/next-js/nodes/revalidation-and-cache-layers|Revalidation 與多層快取]]**
   - Goal: 能區分 time-based 與 on-demand revalidation（revalidatePath / revalidateTag）、React cache 與 unstable_cache，並指出「快取放錯」導致資料不更新的根因。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Backend]]
     - [[sources/next-js/20261004/EBOOK.pdf#Cache]]
     - [[sources/next-js/20261004/129 -  Optimization.en.srt#Optimization]]
     - [[sources/next-js/20261004/148 -  How to SEO-optimize websites in Nextjs.en.srt#How to SEO-optimize websites in Nextjs]]
     - [[sources/next-js/20261004/149 -  Advanced Next.js.en.srt#Advanced Next.js]]

11. **[[learn/next-js/nodes/streaming-suspense-ppr|串流、Suspense、PPR 與 after()]]**
   - Goal: 能用 Suspense 串流獨立資料、把 pending 的 promise 傳給 client 用 `use()` 解，並判斷何時該用 after() 把副作用延到回應之後。
   - Sources:
     - [[sources/next-js/20261004/101 -  Question Views (Approach  3).en.srt#Question Views (Approach 3)]]
     - [[sources/next-js/20261004/114 -  Integrate Actions on UI.en.srt#Integrate Actions on UI]]
     - [[sources/next-js/20261004/129 -  Optimization.en.srt#Optimization]]
     - [[sources/next-js/20261004/149 -  Advanced Next.js.en.srt#Advanced Next.js]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/questions/[id]/page.tsx]]

12. **[[learn/next-js/nodes/route-handlers-rest|Route Handlers 與 REST API 設計]]**
   - Goal: 能用 route.ts 建出 resource-oriented 的 REST 端點（動態 segment、params vs searchParams、狀態碼），並判斷什麼時候該用 route handler、什麼時候 server action 更合適。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Backend]]
     - [[sources/next-js/20261004/EBOOK.pdf#Nested Routes]]
     - [[sources/next-js/20261004/EBOOK.pdf#URL Query Parameters]]
     - [[sources/next-js/20261004/069 -  Introduction to Route Handlers^.en.srt#Introduction to Route Handlers]]
     - [[sources/next-js/20261004/070 -  Create & Read User Routes.en.srt#Create & Read User Routes]]
     - [[sources/next-js/20261004/076 -  API Fetch Handler.en.srt#API Fetch Handler]]
     - [[sources/next-js/20261004/HTML/035 -  Common API Things to Keep in Mind.html#Common API Things to Keep in Mind]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/api/users/route.ts]]

### Tier 3 — 變更與信任邊界

13. **[[learn/next-js/nodes/server-actions-model|Server Actions 模型：use server 與 POST 轉譯]]**
   - Goal: 能解釋 `"use server"` 的兩種建立方式、從 client 呼叫時被轉成 POST 的機制與安全含意，以及 server actions 的限制（無法給 webhook / 外部呼叫）。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Server Actions]]
     - [[sources/next-js/20261004/EBOOK.pdf#Server Components]]
     - [[sources/next-js/20261004/EBOOK.pdf#No rocket science here]]
     - [[sources/next-js/20261004/EBOOK.pdf#People got a bit confused]]
     - [[sources/next-js/20261004/EBOOK.pdf#Limitations]]
     - [[sources/next-js/20261004/081 -  Server Action Demo.en.srt#Server Action Demo]]
     - [[sources/next-js/20261004/083 -  Server Action Handler.en.srt#Server Action Handler]]

14. **[[learn/next-js/nodes/zod-validation-contracts|Zod 驗證契約]]**
   - Goal: 能為每個 server 入口寫 Zod schema（含 partial / pick / extend 的複用），並在 action 與 form 兩端共用同一份契約擋掉不合法的 input。
   - Sources:
     - [[sources/next-js/20261004/052 -  Question Form.en.srt#Question Form]]
     - [[sources/next-js/20261004/067 -  Implement Error Handling.en.srt#Implement Error Handling]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/validations.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/handlers/action.ts]]

15. **[[learn/next-js/nodes/error-handling-and-logging|錯誤處理與 logging]]**
   - Goal: 能建立 error class 階層與集中的 handleError / logger，讓 route handler 與 server action 回傳一致的 response 形狀，並在失敗時看得懂原因。
   - Sources:
     - [[sources/next-js/20261004/066 -  The Art of Failing Gracefully.en.srt#The Art of Failing Gracefully]]
     - [[sources/next-js/20261004/067 -  Implement Error Handling.en.srt#Implement Error Handling]]
     - [[sources/next-js/20261004/068 -  Implement Logging.en.srt#Implement Logging]]
     - [[sources/next-js/20261004/080 -  Debugging oAuth.en.srt#Debugging oAuth]]
     - [[sources/next-js/20261004/HTML/033 -  The Art of Failing Gracefully.html#The Art of Failing Gracefully]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/http-errors.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/handlers/error.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/logger.ts]]

16. **[[learn/next-js/nodes/server-action-patterns-transactions|Server Action 模式與交易]]**
   - Goal: 能用 action() wrapper 把 validate → authorize → dbConnect → transaction → revalidatePath 串成一致模式，並設計多集合寫入的 atomic transaction。
   - Sources:
     - [[sources/next-js/20261004/083 -  Server Action Handler.en.srt#Server Action Handler]]
     - [[sources/next-js/20261004/087 -  Create Question Action.en.srt#Create Question Action]]
     - [[sources/next-js/20261004/103 -  Create Answer Action.en.srt#Create Answer Action]]
     - [[sources/next-js/20261004/112 -  Create Vote Actions.en.srt#Create Vote Actions]]
     - [[sources/next-js/20261004/139 -  Implement Question Delete Functionality.en.srt#Implement Question Delete Functionality]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/handlers/action.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/question.action.ts]]

17. **[[learn/next-js/nodes/auth-boundary-nextauth|認證邊界：NextAuth、session 與 middleware]]**
   - Goal: 能說出 authentication vs authorization、session 存在 cookie 的哪裡，設定 NextAuth provider / callback，並解釋為何用 Mongoose 的 auth 不能放在 edge middleware。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Middleware]]
     - [[sources/next-js/20261004/030 -  What is Authentication.en.srt#What is Authentication]]
     - [[sources/next-js/20261004/031 -  HTTP State Management Mechanisms.en.srt#HTTP State Management Mechanisms]]
     - [[sources/next-js/20261004/034 -  Setup NextAuth with GitHub Provider.en.srt#Setup NextAuth with GitHub Provider]]
     - [[sources/next-js/20261004/035 -  Implement Github SignIn.en.srt#Implement Github SignIn]]
     - [[sources/next-js/20261004/078 -  The Edge Case.en.srt#The Edge Case]]
     - [[sources/next-js/20261004/086 -  Auth Checks and Logout.en.srt#Auth Checks and Logout]]
     - [[sources/next-js/20261004/HTML/016 -  What is Authentication.html#What is Authentication]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/auth.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/middleware.ts]]

18. **[[learn/next-js/nodes/credentials-auth-accounts|Credentials 登入與 User / Account 分離]]**
   - Goal: 能實作 email/password 註冊與登入（bcrypt、credentials provider），並解釋 user 與 account 為何分開、一個 user 如何同時綁 credentials 與 OAuth。
   - Sources:
     - [[sources/next-js/20261004/077 -  Flow of Application.en.srt#Flow of Application]]
     - [[sources/next-js/20261004/079 -  Accounts for oAuth.en.srt#Accounts for oAuth]]
     - [[sources/next-js/20261004/084 -  Sign Up implementation.en.srt#Sign Up implementation]]
     - [[sources/next-js/20261004/085 -  Sign In implementation.en.srt#Sign In implementation]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/auth.action.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/database/account.model.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/database/user.model.ts]]

### Tier 4 — 持久層

19. **[[learn/next-js/nodes/data-modeling-mongodb|MongoDB 資料建模：array-of-refs vs join collection]]**
   - Goal: 能為一組需求畫出實體關係，判斷哪些關係該用 embedded array、哪些該用 join collection，並說明 schema 選擇對查詢與擴展的影響。
   - Sources:
     - [[sources/next-js/20261004/055 -  Thinking in Backend.en.srt#Thinking in Backend]]
     - [[sources/next-js/20261004/056 -  Setup MongoDB and Mongoose.en.srt#Setup MongoDB and Mongoose]]
     - [[sources/next-js/20261004/057 -  Architect Database Structure.en.srt#Architect Database Structure]]
     - [[sources/next-js/20261004/HTML/024 -  Architect Database Structure.html#Architect Database Structure]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/database/index.ts]]

20. **[[learn/next-js/nodes/mongoose-models-typing|Mongoose 模型與型別]]**
   - Goal: 能寫出型別安全的 Mongoose model（schema + interface + Document、refs、denormalized counters），並用 model guard 與 connection singleton 避免 hot-reload 問題。
   - Sources:
     - [[sources/next-js/20261004/058 -  Create User Model.en.srt#Create User Model]]
     - [[sources/next-js/20261004/059 -  Create Account Model.en.srt#Create Account Model]]
     - [[sources/next-js/20261004/060 -  Create Question Model.en.srt#Create Question Model]]
     - [[sources/next-js/20261004/062 -  Create Tag Models.en.srt#Create Tag Models]]
     - [[sources/next-js/20261004/063 -  Create Vote Model.en.srt#Create Vote Model]]
     - [[sources/next-js/20261004/065 -  Create Interaction Model.en.srt#Create Interaction Model]]
     - [[sources/next-js/20261004/HTML/032 -  The Mongoose Types.html#The Mongoose Types]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/database/user.model.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/mongoose.ts]]

21. **[[learn/next-js/nodes/aggregation-advanced-queries|Aggregation 與進階查詢]]**
   - Goal: 能寫出 aggregation pipeline（match / lookup / unwind / group / project）做出跨集合的列表與統計（saved questions、user top tags、recommendation）。
   - Sources:
     - [[sources/next-js/20261004/122 -  Get All Saved Questions Action.en.srt#Get All Saved Questions Action]]
     - [[sources/next-js/20261004/136 -  Implement User Tags.en.srt#Implement User Tags]]
     - [[sources/next-js/20261004/143 -  Build Recommendation System.en.srt#Build Recommendation System]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/question.action.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/user.action.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/collection.action.ts]]

### Tier 5 — 橫切面

22. **[[learn/next-js/nodes/state-management-nextjs|狀態管理：local / global / URL]]**
   - Goal: 能判斷一份狀態屬於 local、global 還是 URL，並說出為什麼 hook-based global state library 會把整棵子樹逼成 client component。
   - Sources:
     - [[sources/next-js/20261004/042 -  What’s State Management.en.srt#What’s State Management]]
     - [[sources/next-js/20261004/043 -  Different types of State Management.en.srt#Different types of State Management]]
     - [[sources/next-js/20261004/044 -  State Management in Next.js.en.srt#State Management in Next.js]]
     - [[sources/next-js/20261004/HTML/018 -  What’s State Management.html#What’s State Management]]
     - [[sources/next-js/20261004/HTML/019 -  Different types of State Management.html#Different types of State Management]]
     - [[sources/next-js/20261004/HTML/020 -  State Management in Next.js.html#State Management in Next.js]]

23. **[[learn/next-js/nodes/url-state-search-filter-pagination|URL 狀態：search / filter / pagination]]**
   - Goal: 能把 search / filter / sort / pagination 全部實作成 URL state（debounce、保留既有參數、toggle 移除），讓每個畫面可分享、可重現。
   - Sources:
     - [[sources/next-js/20261004/045 -  URL State Management.en.srt#URL State Management]]
     - [[sources/next-js/20261004/046 -  Different URL Parameters in Next.js.en.srt#Different URL Parameters in Next.js]]
     - [[sources/next-js/20261004/047 -  How to do URL State Management.en.srt#How to do URL State Management]]
     - [[sources/next-js/20261004/049 -  Local Search Bar.en.srt#Local Search Bar]]
     - [[sources/next-js/20261004/050 -  Filter in Next.js.en.srt#Filter in Next.js]]
     - [[sources/next-js/20261004/126 -  Implement Pagination.en.srt#Implement Pagination]]
     - [[sources/next-js/20261004/HTML/021 -  URL State Management.html#URL State Management]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/url.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/components/search/LocalSearch.tsx]]

24. **[[learn/next-js/nodes/styling-design-system|樣式與設計系統：Tailwind v4、shadcn、fonts、themes]]**
   - Goal: 能用 Tailwind v4 的 CSS-first theme 定義設計 token、安裝 shadcn 元件、接上 next/font 與 theme provider，並判斷樣式該放全域 token 還是元件。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#CSS Modules]]
     - [[sources/next-js/20261004/EBOOK.pdf#TailwindCSS]]
     - [[sources/next-js/20261004/EBOOK.pdf#Which is the best option for styling]]
     - [[sources/next-js/20261004/019 -  Tailwind CSS Setup.en.srt#Tailwind CSS Setup]]
     - [[sources/next-js/20261004/020 -  Tailwind CSS Theming.en.srt#Tailwind CSS Theming]]
     - [[sources/next-js/20261004/021 -  Setup Fonts.en.srt#Setup Fonts]]
     - [[sources/next-js/20261004/026 -  Set up the themes.en.srt#Set up the themes]]
     - [[sources/next-js/20261004/027 -  Installing ShadCN UI.en.srt#Installing ShadCN UI]]
     - [[sources/next-js/20261004/HTML/009 -  Tailwind CSS Setup.html#Tailwind CSS Setup]]
     - [[sources/next-js/20261004/HTML/015 -  Installing ShadCN UI.html#Installing ShadCN UI]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/globals.css]]

25. **[[learn/next-js/nodes/loading-and-error-boundaries|Loading 與 error 邊界]]**
   - Goal: 能用 loading.tsx、error.tsx（client）、not-found 建立 route-level 的 loading / error 邊界，並判斷該用檔案慣例還是 Suspense 做局部邊界。
   - Sources:
     - [[sources/next-js/20261004/011 -  Routing, Handling Errors & Loadings.en.srt#Routing, Handling Errors & Loadings]]
     - [[sources/next-js/20261004/145 -  Use of Loading file.en.srt#Use of Loading file]]
     - [[sources/next-js/20261004/146 -  Use of Error File.en.srt#Use of Error File]]
     - [[sources/next-js/20261004/HTML/046 -  Introduction to Loadings and Errors.html#Introduction to Loadings and Errors]]
     - [[sources/next-js/20261004/HTML/047 -  Use of Loading file.html#Use of Loading file]]
     - [[sources/next-js/20261004/HTML/048 -  Use of Error File.html#Use of Error File]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/community/loading.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/community/error.tsx]]

26. **[[learn/next-js/nodes/seo-and-metadata|SEO 與 metadata]]**
   - Goal: 能用 static metadata、generateMetadata 與 file-based metadata 產生 title / description / Open Graph / sitemap，並判斷動態頁面該在哪裡生成 metadata。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#SEO and Metadata]]
     - [[sources/next-js/20261004/014 -  SEO & Metadata.en.srt#SEO & Metadata]]
     - [[sources/next-js/20261004/022 -  Assets and Metadata.en.srt#Assets and Metadata]]
     - [[sources/next-js/20261004/147 -  How to SEO-optimize websites in Nextjs_.en.srt#How to SEO-optimize websites in Nextjs]]
     - [[sources/next-js/20261004/HTML/049 -  What is SEO？.html#What is SEO？]]
     - [[sources/next-js/20261004/HTML/051 -  More on Metadata.html#More on Metadata]]

27. **[[learn/next-js/nodes/performance-optimization|效能最佳化]]**
   - Goal: 能找出 sequential await 的 waterfall 並用 Promise.all 平行化，套用 image / font 最佳化與 code splitting，並用 React cache 去掉重複請求。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Rendering]]
     - [[sources/next-js/20261004/129 -  Optimization.en.srt#Optimization]]
     - [[sources/next-js/20261004/148 -  How to SEO-optimize websites in Nextjs.en.srt#How to SEO-optimize websites in Nextjs]]
     - [[sources/next-js/20261004/149 -  Advanced Next.js.en.srt#Advanced Next.js]]
     - [[sources/next-js/20261004/HTML/052 -  Optimization Strategies.html#Optimization Strategies]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/next.config.ts]]

28. **[[learn/next-js/nodes/deployment-production|部署與 production]]**
   - Goal: 能把專案部署到 Vercel：設定 env、recreate OAuth callback、修 build 期的 client/server import 與 lint/TS 錯誤，並選對 runtime。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Node vs Edge Runtime]]
     - [[sources/next-js/20261004/150 -  Deploy on Vercel.en.srt#Deploy on Vercel]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/next.config.ts]]

### Tier 6 — 綜合驗收

29. **[[learn/next-js/nodes/devflow-architecture-walkthrough|DevFlow 全端資料流走讀]]**
   - Goal: 能沿著 DevFlow 把一個 feature（例如「建立問題」或「投票」）從 route → layout → server action → model → UI 的完整資料流講一遍，指認每一層的檔案與責任。
   - Sources:
     - [[sources/next-js/20261004/077 -  Flow of Application.en.srt#Flow of Application]]
     - [[sources/next-js/20261004/082 -  Flow of Application^.en.srt#Flow of Application]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/layout.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/page.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/questions/[id]/page.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/question.action.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/vote.action.ts]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/database/index.ts]]

30. **[[learn/next-js/nodes/ai-architecture-review-judgment|AI 架構驗收與判斷]]**
   - Goal: 能對一份 AI 產出的 Next.js 專案做架構驗收：抓出 cache 放錯、server/client 邊界畫錯、N+1、server action 濫用、schema 不 scalable 等常見踩雷，並先講出正確架構再讓 AI 照著寫。
   - Sources:
     - [[sources/next-js/20261004/EBOOK.pdf#Introduction]]
     - [[sources/next-js/20261004/078 -  The Edge Case.en.srt#The Edge Case]]
     - [[sources/next-js/20261004/115 -  Fix Vote Issue.en.srt#Fix Vote Issue]]
     - [[sources/next-js/20261004/129 -  Optimization.en.srt#Optimization]]
     - [[sources/next-js/20261004/143 -  Build Recommendation System.en.srt#Build Recommendation System]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/app/(root)/page.tsx]]
     - [[sources/next-js/20261004/jsmasterypro_devflow/lib/actions/question.action.ts]]

## Status

- [x] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
