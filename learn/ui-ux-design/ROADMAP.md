---
subject: ui-ux-design
status: draft # draft → confirmed
path: concept-first
created: 2026-10-07
---

# ROADMAP — ui-ux-design

## Goal

能獨立完成一個真實產品的 UI/UX 設計並交付——從 brief → sitemap → userflow → wireframe → UI → prototype → 可用性測試，自己走完整條設計流程，把「一人出貨」缺的設計這半邊補齊。先不綁定特定專案，先把通用方法學通；就業／作品集／求職那一整段也納入（case study、作品集、CV、面試）。

## Learning path

**概念優先（concept-first）：** 先建立心智模型，再進規則，再進實作，最後收在職涯。

**Angle:** 先知道「設計在解什麼問題、整條流程長什麼樣、怎麼判斷好壞」，再分層學規則——使用者的規則（研究與定義）→ 結構與流程的規則（IA、flow、wireframe）→ 視覺語言的規則（字體、色彩、元件、design system）→ 工具（Figma），然後把方法在兩個真專案（Pride landing page、Accom.ai booking app）上走一遍，最後把流程變成求職作品集。

**優化:** 「先懂再做」。對應 MEMORY 的 declarative-first 節奏：每篇收在一個可檢查的產出或一個能做的決定，不名詞轟炸。

**Tier 結構（由一般到具體）:** Tier 1 心智模型 → Tier 2 使用者的規則 → Tier 3 結構與流程的規則 → Tier 4 視覺語言的規則 → Tier 5 工具 → Tier 6 實作演練 → Tier 7 職涯。

**Node 數:** 基線 `target = clamp(round(70315 / 500), 3, 30) = 30`；本計畫 **27**，落在 ±40% 內。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe ui-ux-design/<node-id>` to measure a node, then `/nodes ui-ux-design/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 心智模型：設計是什麼、怎麼運作

1. **[[learn/ui-ux-design/nodes/ux-ui-foundations|UX 與 UI 的分野]]**
   - Goal: 分清 UX 與 UI 的職責、兩者如何互補，並能說出好設計如何驅動轉換、留存與信任。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/1. Intro to UX.UI Design/1. Understanding UX and UI Design.en.srt#understanding-ux-and-ui]]
     - [[sources/ui-ux-design/20261007/ui1/1. Intro to UX.UI Design/8. Simple Strategies for a Better User Interface.en.srt#better-user-interface-strategies]]
     - [[sources/ui-ux-design/20261007/ui2/2.1 Differences between UI & UX Lesson Summary (Li).en.srt#differences]]

2. **[[learn/ui-ux-design/nodes/design-thinking-process|設計思維與流程全貌]]**
   - Goal: 用五階段設計思維與迭代觀，說出設計流程每一步在做什麼、為什麼可以回頭走。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/5. UX Design Process/1. Design Thinking Process.en.srt#design-thinking-process]]
     - [[sources/ui-ux-design/20261007/ui1/5. UX Design Process/2. Stages of the Design Thinking Process.en.srt#stages-of-the-design-thinking-process]]
     - [[sources/ui-ux-design/20261007/ui2/1.5 Course walkthrough Lesson Summary (Li).en.srt#walkthrough]]
     - [[sources/ui-ux-design/20261007/ui2/2.2 The Brief Lesson Summary (Li).en.srt#brief]]

3. **[[learn/ui-ux-design/nodes/usability-heuristics|可用性原則與 Nielsen 十項啟示]]**
   - Goal: 內化核心可用性原則與 Nielsen 十項啟示，把它們當成評稿與做設計判斷的檢查表。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/1. Intro to UX.UI Design/5. Key Principles of UX Design.en.srt#key-principles-of-ux-design]]
     - [[sources/ui-ux-design/20261007/ui1/1. Intro to UX.UI Design/6. 10 Usability Heuristics by Jakob Nielsen.en.srt#nielsen-usability-heuristics]]

4. **[[learn/ui-ux-design/nodes/design-roles-and-value|設計角色、職涯路徑與自我定位]]**
   - Goal: 看清 UI/UX/產品/研究等角色光譜與不同公司型態的差異，定位自己要以什麼角色累積什麼能力。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/1. Intro to UX.UI Design/2. Career Opportunities in Design Across Various Types of Companies.en.srt#career-opportunities-companies]]
     - [[sources/ui-ux-design/20261007/ui1/1. Intro to UX.UI Design/3. Common Design Career Paths.en.srt#common-design-career-paths]]
     - [[sources/ui-ux-design/20261007/ui1/1. Intro to UX.UI Design/4. How to Increase Your Value as a UX_UI Designer.mhtml#increase-value-as-designer]]

### Tier 2 — 使用者的規則：研究與定義

5. **[[learn/ui-ux-design/nodes/ux-research-methods|UX 研究方法]]**
   - Goal: 知道質性/量化、態度/行為的分野，能依問題挑選訪談、問卷、五秒測試、卡片分類等合適方法。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/6. Conducting UX Research for Better User Experiences/1. Understanding User Needs An Introduction to UX Research.en.srt#ux-research-intro]]
     - [[sources/ui-ux-design/20261007/ui1/6. Conducting UX Research for Better User Experiences/3. Exploring UX Research Methods.mhtml#ux-research-methods]]
     - [[sources/ui-ux-design/20261007/ui1/6. Conducting UX Research for Better User Experiences/7. ChatGPT for UX UI Design.pdf#chatgpt-for-ux-ui]]

6. **[[learn/ui-ux-design/nodes/competitive-analysis|競品分析]]**
   - Goal: 用競品分析替自己的設計找到定位與缺口，產出一份可用的競品/功能對照。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/6. Conducting UX Research for Better User Experiences/5. Guide to Competitive Analysis.en.srt#competitive-analysis]]
     - [[sources/ui-ux-design/20261007/ui1/6. Conducting UX Research for Better User Experiences/6. Class Project 03 - Competitive Analysis.mhtml#class-project-03-competitive-analysis]]
     - [[sources/ui-ux-design/20261007/ui2/2.2 The Brief Lesson Summary (Li).en.srt#brief]]

7. **[[learn/ui-ux-design/nodes/user-personas|人物誌（User Persona）]]**
   - Goal: 從訪談資料建出有根據的人物誌，區分主要/次要使用者並知道何時用哪個。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/7. Understanding and Defining User Problems/1. User Personas Getting to Know Your Users.en.srt#user-personas]]
     - [[sources/ui-ux-design/20261007/ui1/7. Understanding and Defining User Problems/2. Class Project 04 - Create User Persona.mhtml#class-project-04-persona]]
     - [[sources/ui-ux-design/20261007/ui2/2.2 The Brief Lesson Summary (Li).en.srt#brief]]

8. **[[learn/ui-ux-design/nodes/user-journeys-and-problem-statements|使用者旅程與問題陳述]]**
   - Goal: 用旅程圖與 SMART 問題陳述，把研究收斂成一句以使用者視角定義、可解的問題。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/7. Understanding and Defining User Problems/3. Creating Effective User Journeys.mhtml#user-journeys]]
     - [[sources/ui-ux-design/20261007/ui1/7. Understanding and Defining User Problems/4. Defining the Problem Statement.en.srt#problem-statement]]

### Tier 3 — 結構與流程的規則

9. **[[learn/ui-ux-design/nodes/ideation-techniques|發想技術]]**
   - Goal: 用 brainstorm、brainwriting、worst idea、sketching、storyboard 產出大量候選解，再收斂成可行方案。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/8. Ideation Strategies for User-Centered Design/1. Ideation Techniques.en.srt#ideation-techniques]]

10. **[[learn/ui-ux-design/nodes/sitemaps-and-information-architecture|Sitemap 與資訊架構]]**
    - Goal: 從 job stories 決定哪些頁面與層級需要存在，畫出 logged-out / logged-in 的 sitemap。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui2/3.1 What is a sitemap Lesson Summary (Li).en.srt#sitemap]]
      - [[sources/ui-ux-design/20261007/ui2/3.2 How to create a sitemap Lesson Summary (Li).en.srt#how-to-create-a-sitemap]]
      - [[sources/ui-ux-design/20261007/ui2/3.3 Create your sitemap Lesson Summary (Li).en.srt#create-your-sitemap]]

11. **[[learn/ui-ux-design/nodes/user-flows|使用者流程（User Flow）]]**
    - Goal: 把使用者完成一個目標的路徑畫成流程圖，處理 happy path 與分支、必經與可選步驟。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/8. Ideation Strategies for User-Centered Design/2. Mapping User Flows.en.srt#mapping-user-flows]]
      - [[sources/ui-ux-design/20261007/ui1/8. Ideation Strategies for User-Centered Design/3. Class Project 05 - Create User Flow.mhtml#class-project-05-user-flow]]
      - [[sources/ui-ux-design/20261007/ui2/4.1 What is a userflow Lesson Summary (Li).en.srt#userflow]]
      - [[sources/ui-ux-design/20261007/ui2/4.2 How to create a userflow Lesson Summary (Li).en.srt#how-to-create-a-userflow]]
      - [[sources/ui-ux-design/20261007/ui2/4.3 Create your userflows Lesson Summary (Li).en.srt#create-your-userflows]]

12. **[[learn/ui-ux-design/nodes/wireframing-and-fidelity|Wireframe 與保真度]]**
    - Goal: 選對 lo/mid/hi-fi 與工具，畫出無樣式、強調版面與功能的 wireframe。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/8. Ideation Strategies for User-Centered Design/4. Wireframing (3).en.srt#wireframing]]
      - [[sources/ui-ux-design/20261007/ui1/8. Ideation Strategies for User-Centered Design/5. Class project 06 - Create Low-Fidelity Wireframes.mhtml#class-project-06-wireframes]]
      - [[sources/ui-ux-design/20261007/ui2/5.1 What is a wireframe Lesson Summary (Li).en.srt#wireframe]]
      - [[sources/ui-ux-design/20261007/ui2/5.2 Sketches vs low-hi-fi wireframes vs rapid prototyping Lesson Summary (Li).en.srt#fidelity]]
      - [[sources/ui-ux-design/20261007/ui2/5.7 Create your wireframes Lesson Summary (Li).en.srt#create-your-wireframes]]

13. **[[learn/ui-ux-design/nodes/visual-hierarchy-and-behavior-design|視覺優先序與行為設計]]**
    - Goal: 用 F-pattern、IA 優先序框架與 Fogg 行為模型安排版面，讓關鍵行動更容易發生。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui2/5.3 F Pattern Lesson Summary (Li).en.srt#f-pattern]]
      - [[sources/ui-ux-design/20261007/ui2/5.4 F pattern challenge Lesson Summary (Li).en.srt#f-pattern-challenge]]
      - [[sources/ui-ux-design/20261007/ui2/5.5 My IA priority framework Lesson Summary (Li).en.srt#ia-priority]]
      - [[sources/ui-ux-design/20261007/ui2/5.6 IA priority challenge Lesson Summary (Li).en.srt#ia-priority-challenge]]
      - [[sources/ui-ux-design/20261007/ui2/5.8 What is the - Fogg behaviour model Lesson Summary (Li).en.srt#what-is-the-fogg-behaviour-model]]
      - [[sources/ui-ux-design/20261007/ui2/5.9 Fogg behaviour model - Challenge Lesson Summary (Li).en.srt#fogg-behaviour-model-challenge]]
      - [[sources/ui-ux-design/20261007/ui2/5.10 Optimize your wireframes Lesson Summary (Li).en.srt#optimize-your-wireframes]]

### Tier 4 — 視覺語言的規則

14. **[[learn/ui-ux-design/nodes/typography|字體排印（Typography）]]**
    - Goal: 掌握字體分類、字級階層、行高與行長，能用字體撐起品牌調性並維持可讀性。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/3. User Interface Design/1. Typography 101_ Understanding the Essentials of Typefaces, Fonts, and Layout.mhtml#typography-101]]
      - [[sources/ui-ux-design/20261007/ui2/7.3 Typography Lesson Summary (Li).en.srt#typography]]

15. **[[learn/ui-ux-design/nodes/color-and-lean-branding|色彩與精實品牌（Lean Branding）]]**
    - Goal: 從色彩輪、色彩意義、文化脈絡到配色組合，建出 primary 色與 moodboard，形成整個 UI 的視覺北極星。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/3. User Interface Design/2. Color & Branding_ Learn How to Influence Users' Initial Impression of Your Product.mhtml#color-branding]]
      - [[sources/ui-ux-design/20261007/ui1/3. User Interface Design/3. Color & Behavior_ Learn How to Influence People's Choices.mhtml#color-behavior]]
      - [[sources/ui-ux-design/20261007/ui2/6.2 What is a lean brand strategy Lesson Summary (Li).en.srt#lean-brand]]
      - [[sources/ui-ux-design/20261007/ui2/6.3 Form your lean brand strategy Lesson Summary (Li).en.srt#brand-strategy]]
      - [[sources/ui-ux-design/20261007/ui2/6.4 Color wheel explained Lesson Summary (Li).en.srt#color-wheel]]
      - [[sources/ui-ux-design/20261007/ui2/6.5 The meaning of each color Lesson Summary (Li).en.srt#the-meaning-of-each-color]]
      - [[sources/ui-ux-design/20261007/ui2/6.6 Meaning of each color differ in different contexts Lesson Summary (Li).en.srt#meaning-of-each-color-differ-in-different-contexts]]
      - [[sources/ui-ux-design/20261007/ui2/6.7 Understanding color combinations Lesson Summary (Li).en.srt#color-combinations]]
      - [[sources/ui-ux-design/20261007/ui2/6.8 Form your color palette Lesson Summary (Li).en.srt#color-palette]]

16. **[[learn/ui-ux-design/nodes/ui-component-anatomy|UI 元件解剖]]**
    - Goal: 認得輸入、導覽、資訊與容器四類元件，知道每個元件該在什麼場合出現。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/3. User Interface Design/4. Input Controls and Navigational Components in UI Design.mhtml#input-controls]]
      - [[sources/ui-ux-design/20261007/ui1/3. User Interface Design/5. Informational Components and Containers.mhtml#informational-containers]]

17. **[[learn/ui-ux-design/nodes/design-systems-and-component-libraries|設計系統與元件庫]]**
    - Goal: 理解可重用元件 + style guide 如何帶來一致性與協作效率，並知道導入的取捨。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/9. Interactive Prototyping/2. Design Systems 101_ Create Consistent and Cohesive User Interfaces.mhtml#design-systems-101]]
      - [[sources/ui-ux-design/20261007/ui2/7.0 Welcome to foundational styles Lesson Summary (Li).en.srt#foundational-styles]]

18. **[[learn/ui-ux-design/nodes/visual-craft-and-ui-critique|視覺工藝與 UI 評析]]**
    - Goal: 用留白、對比、階層、點擊數等技巧改善介面，並能像評析 grocery app 那樣診斷畫面的問題並提出修法。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/1. Intro to UX.UI Design/8. Simple Strategies for a Better User Interface.en.srt#better-user-interface-strategies]]
      - [[sources/ui-ux-design/20261007/ui1/3. User Interface Design/6. UI Analysis.en.srt#ui-analysis]]

### Tier 5 — 工具：Figma

19. **[[learn/ui-ux-design/nodes/figma-fundamentals|Figma 基礎操作]]**
    - Goal: 熟悉 Figma 介面、frame/shape、填色、text/color styles 與對齊，能自己重做一次基本操作。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/2. Learn Figma/1. Choosing the right design software.en.srt#design-software]]
      - [[sources/ui-ux-design/20261007/ui1/2. Learn Figma/2. Figma Walkthrough.en.srt#figma-walkthrough]]
      - [[sources/ui-ux-design/20261007/ui1/2. Learn Figma/3. Frames, Shapes, Colours and Basic Design Techniques.en.srt#frames-shapes-colours]]
      - [[sources/ui-ux-design/20261007/ui1/2. Learn Figma/4. Color Styles, Alignment, Position.en.srt#color-styles-alignment]]
      - [[sources/ui-ux-design/20261007/ui1/2. Learn Figma/5. Text Styles.en.srt#text-styles]]

20. **[[learn/ui-ux-design/nodes/figma-responsive-and-constraints|Constraints 與響應式版面]]**
    - Goal: 用 Figma constraints 與 min/max sizing 做出橫向/縱向響應式版面，並懂 breakpoint 與 mobile-first 的取捨。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/1. Intro to UX.UI Design/7. Responsive Design.en.srt#responsive-design]]
      - [[sources/ui-ux-design/20261007/ui1/2. Learn Figma/6. Constraints - Theory.en.srt#constraints-theory]]
      - [[sources/ui-ux-design/20261007/ui1/2. Learn Figma/7. Creating Responsive Design with Constraints.en.srt#responsive-constraints-exercise]]

### Tier 6 — 實作演練：走完整條流程

21. **[[learn/ui-ux-design/nodes/pride-landing-page-build|實作：Pride 音樂 landing page]]**
    - Goal: 從 brief、色彩與字體庫出發，用 Figma 建出六段式的 web landing page。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/1. Intro - Project Brief, Image and Typography Library.en.srt#intro]]
      - [[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/2. Designing Top Navigation & Hero Section.en.srt#nav-hero]]
      - [[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/3. 2nd section.en.srt#trending-songs]]
      - [[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/4. 3rd section.en.srt#genres-carousel]]
      - [[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/5. 4th section.en.srt#trending-artists]]
      - [[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/6. 5th section.en.srt#featured-artist]]
      - [[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/7. 6th section.en.srt#newsletter-footer]]

22. **[[learn/ui-ux-design/nodes/app-ui-kit-foundations|實作：建立 App UI Kit]]**
    - Goal: 用 grid、palette、type、icon、shadow、button、input 建立可重用的 app UI kit 並發佈成 Figma library。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui2/7.1 Grid layouts Lesson Summary (Li).en.srt#grid-layouts]]
      - [[sources/ui-ux-design/20261007/ui2/7.2 Color palette Lesson Summary (Li).en.srt#color-palette]]
      - [[sources/ui-ux-design/20261007/ui2/7.3 Typography Lesson Summary (Li).en.srt#typography]]
      - [[sources/ui-ux-design/20261007/ui2/7.4 Iconography (Li).en.srt#iconography]]
      - [[sources/ui-ux-design/20261007/ui2/7.5 Shadows (Li).en.srt#shadows]]
      - [[sources/ui-ux-design/20261007/ui2/7.6 Buttons (Li).en.srt#buttons]]
      - [[sources/ui-ux-design/20261007/ui2/7.7 Input fields (Li).en.srt#input-fields]]

23. **[[learn/ui-ux-design/nodes/acom-ai-ui-screens|實作：Accom.ai 逐屏 UI]]**
    - Goal: 把 wireframe 配上 UI kit 逐屏變成高保真 UI（header/footer、homepage、搜尋預訂、帳戶、host）。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui2/9.1 Project file overview (Li).en.srt#project-file-overview]]
      - [[sources/ui-ux-design/20261007/ui2/9.2 Header and footer breakdown (Li).en.srt#header-footer]]
      - [[sources/ui-ux-design/20261007/ui2/9.3 Homepage breakdown (Li).en.srt#homepage]]
      - [[sources/ui-ux-design/20261007/ui2/9.4 Search and booking experience breakdown (Li).en.srt#search-booking]]
      - [[sources/ui-ux-design/20261007/ui2/9.5 My bookings breakdown (Li).en.srt#my-bookings]]
      - [[sources/ui-ux-design/20261007/ui2/9.6 Profile settings breakdown (Li).en.srt#profile-settings]]
      - [[sources/ui-ux-design/20261007/ui2/9.7 Authentication breakdown (Li).en.srt#authentication]]
      - [[sources/ui-ux-design/20261007/ui2/9.8 Desktop experience breakdown (Li).en.srt#desktop-experience]]

24. **[[learn/ui-ux-design/nodes/mockups-and-prototyping|高保真 Mockup 與可點擊原型]]**
    - Goal: 把 hi-fi wireframe 上色成 pixel-perfect mockup，並串成可點擊原型與響應式視圖。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/9. Interactive Prototyping/1. Transform Low-Fidelity Wireframes Into High-Fidelity Wireframes.en.srt#transform-low-fidelity-wireframes-into-high-fidelity-wireframes]]
      - [[sources/ui-ux-design/20261007/ui1/9. Interactive Prototyping/3. Create Design Mockups (1).en.srt#design-mockups]]
      - [[sources/ui-ux-design/20261007/ui1/9. Interactive Prototyping/4. Class Project 07 - Create Final Design Mockups.mhtml#class-project-07-mockups]]
      - [[sources/ui-ux-design/20261007/ui2/9.9 Responsive views breakdown (Li).en.srt#responsive-views]]

25. **[[learn/ui-ux-design/nodes/usability-testing-and-handoff|可用性測試與設計交付]]**
    - Goal: 寫測試計畫、跑可用性測試、依嚴重度迭代，再理解技術限制與 handoff 缺口後交付工程並監測成效。
    - Sources:
      - [[sources/ui-ux-design/20261007/ui1/10. Testing & Implementation/1. Usability Testing.en.srt#usability-testing]]
      - [[sources/ui-ux-design/20261007/ui1/10. Testing & Implementation/3. Analyze Usability Test Results.en.srt#analyze-usability-test-results]]
      - [[sources/ui-ux-design/20261007/ui1/10. Testing & Implementation/4. Update designs based on test results.mhtml#update-designs]]
      - [[sources/ui-ux-design/20261007/ui1/10. Testing & Implementation/5. Design Implementation.en.srt#design-implementation]]
      - [[sources/ui-ux-design/20261007/ui1/10. Testing & Implementation/6. Common Gaps in Design Handoff.en.srt#common-gaps-in-design-handoff]]
      - [[sources/ui-ux-design/20261007/ui1/10. Testing & Implementation/7. Monitor the Success of Your Designs.mhtml#monitor-the-success-of-your-designs]]
      - [[sources/ui-ux-design/20261007/ui2/10.2 How to create a test plan Lesson Summary (Li).en.srt#test-plan]]
      - [[sources/ui-ux-design/20261007/ui2/10.6 How to conduct a usability test Lesson Summary (Li).en.srt#how-to-conduct-a-usability-test]]
      - [[sources/ui-ux-design/20261007/ui2/10.8 How to iterate on designs Lesson Summary (Li).en.srt#how-to-iterate-on-designs]]
      - [[sources/ui-ux-design/20261007/ui2/8.1 What is the box model Lesson Summary (Li).en.srt#box-model]]
      - [[sources/ui-ux-design/20261007/ui2/8.3 What is flexbox Lesson Summary (Li).en.srt#flexbox]]
      - [[sources/ui-ux-design/20261007/ui2/8.5 What is CSS grid Lesson Summary (Li).en.srt#css-grid]]
      - [[sources/ui-ux-design/20261007/ui2/8.7 What is position absolute Lesson Summary (Li).en.srt#position-absolute]]

### Tier 7 — 職涯與作品集

26. **[[learn/ui-ux-design/nodes/case-study-and-portfolio|Case Study 與作品集]]**
   - Goal: 把設計流程寫成 ~4 篇高品質 case study，放進自己的作品集網站，讓招募者 3 分鐘內看懂你的判斷。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/11. Launch your UX.UI Design career/4. How to Create a Strong Case Study_ A Step-by-Step Guide.mhtml#case-study]]
     - [[sources/ui-ux-design/20261007/ui1/11. Launch your UX.UI Design career/5. Build an outstanding online portfolio.en.srt#portfolio]]

27. **[[learn/ui-ux-design/nodes/job-search-cv-and-interview|求職：CV、LinkedIn 與面試]]**
   - Goal: 準備好 CV/LinkedIn、找對工作管道，並能通過 UX/UI 面試漏斗（篩選、作品呈現、白板挑戰、offer）。
   - Sources:
     - [[sources/ui-ux-design/20261007/ui1/11. Launch your UX.UI Design career/2. Land UXUI Design Job Tips and Tricks to Succeed - part 1.en.srt#land-uxui-design-job-tips-and-tricks-to-succeed-part-1]]
     - [[sources/ui-ux-design/20261007/ui1/11. Launch your UX.UI Design career/3. Land UXUI Design Job Tips and Tricks to Succeed - part 2.en.srt#land-uxui-design-job-tips-and-tricks-to-succeed-part-2]]
     - [[sources/ui-ux-design/20261007/ui1/11. Launch your UX.UI Design career/6. Get Ready to Apply for UX_UI Design Jobs.mhtml#ready-to-apply]]
     - [[sources/ui-ux-design/20261007/ui1/11. Launch your UX.UI Design career/7. Where to Find UXUI Design Jobs.en.srt#where-to-find-uxui-design-jobs]]
     - [[sources/ui-ux-design/20261007/ui1/11. Launch your UX.UI Design career/8. Create a Job-Winning CV.mhtml#cv]]
     - [[sources/ui-ux-design/20261007/ui1/11. Launch your UX.UI Design career/9. Nail the Interview Process.en.srt#interview]]
     - [[sources/ui-ux-design/20261007/ui2/11.0 Congratulations, Certificate + Final Words Lesson Summary (Li).en.srt#congratulations]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
