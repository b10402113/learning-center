---
subject: mobile-app-course
status: confirmed
path: practice-first
created: 2026-10-02
---

# ROADMAP — mobile-app-course

## Goal
把一個想法用 AI coding agent 端到端做成一個真的能上架 App Store 的 mobile app：plan → UI → features → backend → dev build → EAS → TestFlight → 送審。以三門課程的 demo app 當練手載體（Codexgram 社群 app／Convex、Cal AI 熱量追蹤／Neon + trigger.dev、Dentify 診所 app／Next.js + Neon），並把 Codex 與 Claude Code 兩條工作流並行對照——主要用 Codex 實作，Claude Code 的路線以閱讀對照學。

## Learning path
**實作優先（practice-first）**：先在第一個 app（Cal AI）上跑完整條 pipeline，把每個技術點都綁在真的能跑、能上手機的程式碼上，而不是先學抽象的堆疊；之後的 Codexgram（Convex 全託管後端）與 Dentify（Next.js 後端 + 網頁 dashboard + Stream）當作同一條 pipeline 的變體與對照，逐步加深。Tier 1 只用來建立「怎麼用 agent 蓋 app」的最小地基；Tier 2 在 Cal AI 上一次走完 plan → design → UI → auth → data → 背景任務 → 監控 → 出 build → 合規；Tier 3、4 換後端範式與更複雜的領域（社群 realtime、預約＋網頁後台＋聊天視訊）重跑一次；Tier 5 收斂成可重複的 playbook。

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe mobile-app-course/<node-id>` to measure a node, then `/nodes mobile-app-course/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 打好地基：怎麼用 agent 蓋一個 app
1. **[[learn/mobile-app-course/nodes/mobile-stack-model|Expo / React Native 心智模型]]**
   - Goal: 說清楚 Expo / React Native 怎麼跑、JS 與 native 的界線、為何真功能一定要 dev build 而非 Expo Go
   - Sources:
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
     - [[sources/mobile-app-course/20261001/codexgram-master/src/app/_layout.tsx]]
2. **[[learn/mobile-app-course/nodes/agent-build-workflow|Agent 工作流與 repo 慣例]]**
   - Goal: 跑起 plan → build → self-check → review → commit 的建造迴圈，並用 AGENTS.md / CLAUDE.md 固定專案慣例
   - Sources:
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/codexgram-master/convex/_generated/ai/guidelines.md]]
3. **[[learn/mobile-app-course/nodes/idea-to-plan|訪談式規劃：從想法到 plan.md]]**
   - Goal: 用訪談式 plan mode 把想法收斂成 goals / features / pages / stack，產出 plan.md 並完成 V1 取捨
   - Sources:
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
     - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
4. **[[learn/mobile-app-course/nodes/git-review-hygiene|版控與 AI Code Review]]**
   - Goal: 用分支 / PR / AI commit message / CodeRabbit 安全地版控 agent 產出，並把 secrets 擋在 repo 外
   - Sources:
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
     - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]

### Tier 2 — 第一個 app：Cal AI（消費型 + AI 背景任務，Neon + trigger.dev）
5. **[[learn/mobile-app-course/nodes/expo-scaffold-nativewind|建立 Expo 專案與 NativeWind]]**
   - Goal: scaffold 出乾淨的 Expo app、reset demo、裝好 NativeWind 並在模擬器跑起來
   - Sources:
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
     - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/metro.config.js]]
6. **[[learn/mobile-app-course/nodes/design-to-ui-loop|設計到 UI 的比對迴圈]]**
   - Goal: 從 plan 產出 UI 設計與 design system，用 screenshot-compare 迴圈把畫面做到與參考一致
   - Sources:
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
     - [[sources/mobile-app-course/20261001/codexgram-master/src/components/social/feed.tsx]]
7. **[[learn/mobile-app-course/nodes/welcome-onboarding-flow|Welcome 與 Onboarding 流程]]**
   - Goal: 建多頁 welcome / onboarding，批次建造並正確 gate（onboarding 先於 auth、空狀態處理）
   - Sources:
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/onboarding/steps.ts]]
     - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/components/onboarding.tsx]]
8. **[[learn/mobile-app-course/nodes/clerk-auth-apple-google|Clerk 多供應商登入]]**
   - Goal: 接 Clerk Google / Apple 登入，理解「有 Google 必有 Apple」的審核規則並實測登入 / 登出
   - Sources:
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
     - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
9. **[[learn/mobile-app-course/nodes/clerk-db-sync-webhooks|Clerk 與資料庫同步（Webhook）]]**
   - Goal: 分清 identity 與 app data，用 Clerk webhook + 背景 task + ngrok 把使用者自動同步進 DB
   - Sources:
     - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
     - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/trigger/clerk-users.ts]]
     - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/webhooks/clerk/route.ts]]
10. **[[learn/mobile-app-course/nodes/neon-drizzle-schema|Neon + Drizzle 資料建模]]**
    - Goal: 用 Neon Postgres + Drizzle 建模、migrate、seed，理解 schema 是 app 與 task 的共同真相
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/db/schema.ts]]
      - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/scripts/seed.ts]]
11. **[[learn/mobile-app-course/nodes/background-ai-jobs|trigger.dev 背景任務與 Retry]]**
    - Goal: 把易失敗的長時 AI 工作移出請求路徑，寫 task、看 retry 語意、用 runs / logs 除錯
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/trigger/generate-plan.ts]]
      - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/trigger/analyze-meal.ts]]
12. **[[learn/mobile-app-course/nodes/camera-scan-media|拍照掃描與媒體上傳]]**
    - Goal: 做出拍照 / 選圖 → 上傳 ImageKit → pending → 非同步分析 → 即時更新的完整功能
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/app/(app)/camera.tsx]]
      - [[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/lib/imagekit.ts]]
13. **[[learn/mobile-app-course/nodes/sentry-monitoring|Sentry 錯誤監控]]**
    - Goal: 接 Sentry 抓真實錯誤與結構化 logs、session replay、tracing，並做測試頁與使用者回饋
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
14. **[[learn/mobile-app-course/nodes/ship-to-testflight|EAS Build、真機與 TestFlight]]**
    - Goal: 用 EAS 出 build 到真機 / TestFlight，理解 OTA 能與不能更新什麼，並用 build log 修配置
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
15. **[[learn/mobile-app-course/nodes/appstore-compliance-legal|App Store 合規與法律頁]]**
    - Goal: 產出隱私政策、條款、刪帳號、support URL 與 landing page 並部署，讓 app 通過審核
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]

### Tier 3 — 第二個 app：Codexgram（社群 + realtime，Convex 全託管後端）
16. **[[learn/mobile-app-course/nodes/convex-backend-model|Convex 後端模型]]**
    - Goal: 用 Convex 建 schema / queries / mutations 與 reactive 查詢，理解它與自寫 API server 的差異
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/schema.ts]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/posts.ts]]
17. **[[learn/mobile-app-course/nodes/convex-auth-clerk|Convex × Clerk 身分驗證]]**
    - Goal: 開 Clerk↔Convex 整合、用 auth.config 驗 JWT、在 server 端推導身分且不信 client 傳來的 identity
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/auth.config.ts]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/lib/auth.ts]]
18. **[[learn/mobile-app-course/nodes/social-graph-features|社交圖與貼文功能]]**
    - Goal: 用 posts / likes / comments / follows / bookmarks / 全文搜尋 / index / 分頁建模並查詢社交圖
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/social.ts]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/postInteractions.ts]]
19. **[[learn/mobile-app-course/nodes/realtime-messaging|即時私訊]]**
    - Goal: 建 conversations / messages / inbox 的即時私訊，含 optimistic send / retry 與未讀指示
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/messaging.ts]]
      - [[sources/mobile-app-course/20261001/codexgram-master/src/components/social/messages.tsx]]
20. **[[learn/mobile-app-course/nodes/convex-media-storage|Convex 檔案儲存與上傳]]**
    - Goal: 在 serverless 後端處理檔案儲存、/upload 與 /media HTTP actions、影片時長解析與尺寸限制
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/uploads.ts]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/http.ts]]
21. **[[learn/mobile-app-course/nodes/seeding-and-backend-tests|寫實 Seed 與後端測試]]**
    - Goal: 冪等 seed 出寫實資料量，用 convex-test + vitest 測權限、不變量、分頁與清理
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/seed.ts]]
      - [[sources/mobile-app-course/20261001/codexgram-master/convex/social.test.ts]]

### Tier 4 — 第三個 app：Dentify（local business + 網頁 dashboard + Stream）
22. **[[learn/mobile-app-course/nodes/monorepo-nextjs-backend|Monorepo 與 Next.js 後端骨架]]**
    - Goal: 把 repo 重構成 apps/mobile + web monorepo，用 Next.js 與 proxy 做路由保護
    - Sources:
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/proxy.ts]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/layout.tsx]]
23. **[[learn/mobile-app-course/nodes/nextjs-api-handlers|Next.js API Route Handlers]]**
    - Goal: 寫 Route Handlers + route() 包裝 + requireAuth / requireStaff 守衛，給 mobile 一個有型別、受保護的 API
    - Sources:
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/appointments/route.ts]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/http.ts]]
24. **[[learn/mobile-app-course/nodes/drizzle-neon-booking-domain|預約領域模型（Drizzle + Neon）]]**
    - Goal: 建正確的預約領域模型：時區、working hours、availability、防重複預約的寫入守衛
    - Sources:
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/scheduling.ts]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/booking.ts]]
25. **[[learn/mobile-app-course/nodes/staff-dashboard-server-components|員工 Dashboard（Server Components）]]**
    - Goal: 用 Server Components 直讀 Drizzle（不繞 HTTP）做員工 dashboard 與 Server Actions
    - Sources:
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/page.tsx]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/patients/[id]/actions.ts]]
26. **[[learn/mobile-app-course/nodes/stream-chat-video|Stream 即時聊天與視訊]]**
    - Goal: 用 Stream 建即時聊天與視訊通話（token endpoint、typing / 已讀 / 附件、通話控制）
    - Sources:
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/lib/stream.tsx]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/stream/token/route.ts]]
27. **[[learn/mobile-app-course/nodes/ai-assistant-streaming|串流 AI 助理]]**
    - Goal: 做會逐字串流的 app 內 AI 助理，對話歷史持久化到 DB，支援圖片附件與領域 prompt
    - Sources:
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/assistant.tsx]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/ai/chat/route.ts]]
28. **[[learn/mobile-app-course/nodes/observability-deep|觀測深化：Logs / Tracing / Agent Tracing]]**
    - Goal: 深入 Sentry logs / tracing / agent tracing 與 beforeSendLog 去識別化，並用 Expo Observe 看效能
    - Sources:
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/sentry-logs.tsx]]
      - [[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/instrumentation.ts]]
29. **[[learn/mobile-app-course/nodes/security-review-at-scale|大規模 PR 安全審查]]**
    - Goal: 對上萬行初始 PR 做 CodeRabbit AI 審查，處理 injection / auth bypass / XSS / SSRF / CSRF 等級問題並合併
    - Sources:
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]

### Tier 5 — 換成你的 app
30. **[[learn/mobile-app-course/nodes/build-to-publish-playbook|可重複的上架 Playbook]]**
    - Goal: 把三條 pipeline 收斂成可重複的 playbook：怎麼選後端、怎麼砍 V1、要補的 payments / push / 上架缺口
    - Sources:
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]
      - [[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Codex - FULL COURSE 2026.srt]]
      - [[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]

## Status

- [x] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
