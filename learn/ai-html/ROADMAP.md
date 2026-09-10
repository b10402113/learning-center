---
subject: ai-html
status: confirmed
path: 素材到影片（practice-first — 從最終目標出發，先做出東西再回頭理解）
created: 2026-09-11
---

# ROADMAP — ai-html

## Goal

將任意素材（PDF、筆記、程式碼、文章、逐字稿）直接轉成全動畫知識講解影片，用繁體中文發布。中間產物是 HTML slides 和 HTML articles，最終成品是帶動畫的知識影片。

## Learning path

**素材到影片（practice-first）** — 從「我想做什麼」出發，先做出可看的成品，再回頭理解底層架構。Tiers 從理解工具開始，經過 slides 和 articles 兩種輸出格式，最後接入 video pipeline 串成完整流程。優化動機維持和快速看到結果。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 理解工具

1. **[[learn/ai-html/nodes/agent-skill-architecture|Agent Skill 架構]]**
   - Goal: 理解 agent skill 的結構：SKILL.md、references、模板、驗證腳本
   - Sources:
     - [[sources/ai-html/20260910/garden-skills.md#harness-architecture]]
     - [[sources/ai-html/20260910/frontend-slides.codebase.md#skill-architecture]]
     - [[sources/ai-html/20260910/boring-video-studio.md#artifact-lifecycle]]

2. **[[learn/ai-html/nodes/html-as-native-output|HTML 作為 AI 原生輸出]]**
   - Goal: 為什麼 HTML 是 AI 原生輸出語言；零依賴單檔輸出的設計哲學
   - Sources:
      - [[sources/ai-html/20260910/frontend-slides.srt#159]]
      - [[sources/ai-html/20260910/frontend-slides/SKILL.md]]
      - [[sources/ai-html/20260910/frontend-slides.md#62]]

### Tier 2 — HTML Slides

3. **[[learn/ai-html/nodes/slide-fundamentals|投影片基礎]]**
   - Goal: 用 agent skill 生成一組可播放的 HTML 投影片（1920×1080 固定舞台、鍵盤/觸控導航）
   - Sources:
     - [[sources/ai-html/20260910/frontend-slides.codebase.md#pipeline]]
     - [[sources/ai-html/20260910/guizang-ppt-skill.md#production-pipeline]]
     - [[sources/ai-html/20260910/Claude HTML Slides.srt.md#three-layer-method]]

4. **[[learn/ai-html/nodes/token-theming|Token 主題系統]]**
   - Goal: 用 CSS custom properties 做 token-driven 主題系統，一套 token 換整體外觀
   - Sources:
     - [[sources/ai-html/20260910/html-ppt-skill.md#theme-architecture]]
     - [[sources/ai-html/20260910/frontend-slides.codebase.md#visual-presets]]
     - [[sources/ai-html/20260910/guizang-ppt-skill.md#dual-design-system]]

5. **[[learn/ai-html/nodes/slide-animation|投影片動畫]]**
   - Goal: 兩 tier 動畫系統：CSS 進入效果 + 即時 canvas FX，理解情感-動畫對應
   - Sources:
     - [[sources/ai-html/20260910/html-ppt-skill.md#animation-system]]
     - [[sources/ai-html/20260910/frontend-slides.codebase.md#animation-patterns]]
     - [[sources/ai-html/20260910/Claude HTML Slides.srt.md#animation-components]]

6. **[[learn/ai-html/nodes/slide-templates|投影片模板]]**
   - Goal: 理解模板架構：34 templates × 31 layouts 的組合邏輯，progressive-disclosure 載入
   - Sources:
     - [[sources/ai-html/20260910/frontend-slides.codebase.md#templates]]
     - [[sources/ai-html/20260910/guizang-ppt-skill.md#locked-layout]]

7. **[[learn/ai-html/nodes/presenter-mode|簡報模式]]**
   - Goal: 雙窗口同步簡報模式：BroadcastChannel、鍵盤控制、演示者視圖
   - Sources:
     - [[sources/ai-html/20260910/html-ppt-skill.md#presenter-mode]]
     - [[sources/ai-html/20260910/guizang-ppt-skill.md#presenter-mode]]
     - [[sources/ai-html/20260910/frontend-slides.codebase.md#navigation]]

### Tier 3 — HTML Articles

8. **[[learn/ai-html/nodes/reacticle-protocol|Reacticle 元件協議]]**
   - Goal: 26 個語意 React 元件的分類與組合：structure / insight / media / decision / technical / interaction / free
   - Sources:
     - [[sources/ai-html/20260910/reacticle.md#component-protocol]]
     - [[sources/ai-html/20260910/garden-skills.md#reacticle-protocol]]
     - [[sources/ai-html/20260910/garden-skills-1.srt.md#beautiful-article]]

9. **[[learn/ai-html/nodes/editorial-layout|編輯排版]]**
   - Goal: 掌握 5 個設計 dial 和反 AI-slop 規則（21 macrostructures × 50 archetypes × 21 themes）
   - Sources:
     - [[sources/ai-html/20260910/hallmark.md#design-system]]
     - [[sources/ai-html/20260910/garden-skills.md#design-engineering]]
     - [[sources/ai-html/20260910/garden-skills-1.srt.md#quality-gates]]

10. **[[learn/ai-html/nodes/article-theming|文章主題]]**
    - Goal: 11 套編輯主題（Tufte、Press、Shannon、Vignelli…）：CSS tokens + Markdown authoring profiles
    - Sources:
      - [[sources/ai-html/20260910/reacticle.md#theme-system]]
      - [[sources/ai-html/20260910/garden-skills.md#theme-as-contract]]
      - [[sources/ai-html/20260910/garden-skills-1.srt.md#eleven-themes]]

11. **[[learn/ai-html/nodes/long-form-structure|長文結構]]**
    - Goal: 多章節長文的結構組織：如何把一篇長文拆成多個 Reacticle 元件流暢銜接
    - Sources:
      - [[sources/ai-html/20260910/reacticle.md#semantic-categories]]
      - [[sources/ai-html/20260910/garden-skills-1.srt.md#editorial-workflow]]
      - [[sources/ai-html/20260910/hallmark.md#macrostructures]]

12. **[[learn/ai-html/nodes/article-export|文章輸出]]**
    - Goal: 文章輸出：PDF export、剪貼簿複製、分享流程
    - Sources:
      - [[sources/ai-html/20260910/reacticle.md#export-utilities]]
      - [[sources/ai-html/20260910/garden-skills.md#build-and-export]]
      - [[sources/ai-html/20260910/frontend-slides.codebase.md#delivery]]

### Tier 4 — Video Pipeline

13. **[[learn/ai-html/nodes/html-to-animation|HTML 轉動畫]]**
    - Goal: 為什麼 HTML 畫面 → 錄影比 AI 生成影片更可控；核心路徑理解
    - Sources:
      - [[sources/ai-html/20260910/garden-skills-2.srt.md#html-based-video]]
      - [[sources/ai-html/20260910/boring-video-studio.md#orchestrator]]
      - [[sources/ai-html/20260910/Jacky-motion.md#hybrid-architecture]]

14. **[[learn/ai-html/nodes/srt-driven-motion|SRT 驅動動畫]]**
    - Goal: SRT 時間線架構：逐字稿驅動動畫節奏，6 階段 4 確認門工作流
    - Sources:
      - [[sources/ai-html/20260910/Jacky-motion.md#srt-timeline]]
      - [[sources/ai-html/20260910/boring-video-studio.md#beats-to-storyboard]]
      - [[sources/ai-html/20260910/garden-skills-2.srt.md#four-stage-workflow]]

15. **[[learn/ai-html/nodes/tts-and-audio|TTS 與音訊]]**
    - Goal: TTS 語音合成整合：真人錄音 vs TTS 的取捨，音訊-視覺同步
    - Sources:
      - [[sources/ai-html/20260910/garden-skills-2.srt.md#tts-synthesis]]
      - [[sources/ai-html/20260910/boring-video-studio.srt.md#tts-vs-real-voice]]
      - [[sources/ai-html/20260910/Jacky-motion.md#audio-sync]]

16. **[[learn/ai-html/nodes/recording-and-render|錄屏與渲染]]**
    - Goal: 錄屏出片工具鏈：Playwright 自動化、輸出品質控制、格式選擇
    - Sources:
      - [[sources/ai-html/20260910/garden-skills-2.srt.md#screen-recording]]
      - [[sources/ai-html/20260910/Jacky-motion.md#validation]]
      - [[sources/ai-html/20260910/frontend-slides.codebase.md#export]]

17. **[[learn/ai-html/nodes/video-quality|影片品質]]**
    - Goal: 影片三維度品質檢驗：結構節奏、視覺品質、動態流暢度
    - Sources:
      - [[sources/ai-html/20260910/garden-skills-1.srt.md#three-dimension-qc]]
      - [[sources/ai-html/20260910/Jacky-motion.md#validation]]
      - [[sources/ai-html/20260910/hallmark.md#slop-test-gates]]

### Tier 5 — 串成 Pipeline

18. **[[learn/ai-html/nodes/harness-design|Harness 設計]]**
    - Goal: Harness 六層架構：上下文管理、工具系統、執行編排、狀態記憶、評估觀測、約束恢復
    - Sources:
      - [[sources/ai-html/20260910/garden-skills-1.srt.md#harness-six-layers]]
      - [[sources/ai-html/20260910/garden-skills.md#harness-architecture]]
      - [[sources/ai-html/20260910/boring-video-studio.md#orchestrator]]

19. **[[learn/ai-html/nodes/personal-pipeline|你的個人 Pipeline]]**
    - Goal: 串起完整流程：素材 intake → slides/articles → 動畫 → 錄製 → 成品
    - Sources:
      - [[sources/ai-html/20260910/boring-video-studio.md#full-pipeline]]
      - [[sources/ai-html/20260910/garden-skills-2.srt.md#end-to-end]]
      - [[sources/ai-html/20260910/Jacky-motion.md#workflow]]

## Status

- [x] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
