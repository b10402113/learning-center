---
subject: video-editing
status: confirmed
path: concept-first
created: 2026-10-03
---

# ROADMAP — video-editing

## Goal

用 coding agent（Claude Code / Codex）端到端產出成品影片：從原始素材或一句 brief 出發，安裝與設定 HyperFrames，用 ffmpeg + Whisper 剪片，套用設計系統（DESIGN.md），渲染 1080p，再用時間碼回饋迭代。不只是「跑得動流程」，而是能交付一支有品牌風格、有 motion graphics 的影片。

## Learning path

**Concept-first（概念優先）：** 先建立「影片就是程式碼」的心智模型與整條產線的地圖，再進入規則與操作，最後把工藝複用成自己的 skill。

**Angle:** 先知道為什麼（agent 寫的是 HTML/CSS/JS、three.js、ffmpeg，不是生成式影片模型），再知道怎麼做（轉錄 → 剪 → 設計系統 → 分鏡 → 算圖 → 執導），最後知道怎麼複用（語彙庫 → `/animate` skill → `/generate`）。

**Tier 結構:**
- Tier 1 — 心智模型：為什麼是程式碼、工具鏈與工作區、三層駕馭法（one-shot／分鏡／執導）＋ BIT 迴圈。
- Tier 2 — 產線：逐字稿稽核 → 剪靜音與 NG → 設計系統 → 分鏡 → HyperFrames 算圖 → 執導。
- Tier 3 — 工藝與複用：動態圖像語彙庫 → `/animate` skill 校準 → `/generate` 生圖生影。

**Optimizes for:** 先有全貌再動手，每一步都知道自己在整條產線的哪裡；符合「先大圖、再步驟」的學習偏好。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe video-editing/<node-id>` to measure a node, then `/nodes video-editing/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 心智模型

1. **[[learn/video-editing/nodes/code-based-video-model|為什麼影片是程式碼]]**
   - Goal: 能解釋為什麼 agentic 剪片是「寫程式」（HTML/CSS/JS、three.js、ffmpeg），而不是生成式影片模型，並說出 agent 實際產出哪些檔案與素材。
   - Sources:
     - [[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#under-the-hood-code-based-video]]
     - [[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#svg-output-format]]
     - [[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#agents-md-single-instructions-file]]
     - [[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#taste-and-workflow-differentiator]]
     - [[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Sonnet 5.5 context]]
     - [[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Ask for SVGs]]
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#LEVEL 1]]
     - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#tools-hyperframes]]
     - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#refined-vs-unrefined-skills]]

2. **[[learn/video-editing/nodes/tool-stack-and-workspace|工具鏈與工作區設定]]**
   - Goal: 能把工作區架起來：agent 與模型／effort、HyperFrames、hyperframes-helper skill、轉錄工具、ffmpeg、金鑰與 `.env`，以及護欄（lint 0 error、付費前先確認）。
   - Sources:
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#intro-what-is-hyperframes]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#hyperframes-helper-skill]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#three-levels-of-video-automation]]
     - [[sources/video-editing/20261003/hyperframes-helper-main/README.md]]
     - [[sources/video-editing/20261003/hyperframes-helper-main/CLAUDE.md]]
     - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#tools-assemblyai]]
     - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#tools-agent-platforms]]
     - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#03]]
     - [[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#Why Sonnet 5.5]]
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#README]]

3. **[[learn/video-editing/nodes/three-levels-of-steering|三層駕馭：one-shot、分鏡、執導]]**
   - Goal: 能針對一個任務選對駕馭層級（one-shot／分鏡／執導），並把它放進 Build→Integrate→Tune 迴圈。
   - Sources:
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#The 3 levels]]
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#LEVEL 1]]
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#LEVEL 2]]
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#LEVEL 3]]
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#Why it's still worth it]]
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#Where this goes next]]
     - [[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#level-one-one-shot-prompting]]
     - [[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#level-two-storyboarding]]
     - [[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#level-three-directing-final-video]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#bit-framework]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level1-website-to-video]]
     - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#three-step-refinement-process]]

### Tier 2 — 產線（原始素材 → 成品）

4. **[[learn/video-editing/nodes/transcribe-and-audit|轉錄與逐字稿稽核]]**
   - Goal: 能把原始素材轉成可信的逐字稿（AssemblyAI／Whisper／Scribe 的取捨），管好 API key，並產出原稿 vs 乾淨稿的並排稽核頁。
   - Sources:
     - [[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#STEP 1 Cut]]
     - [[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Step 1 Transcribe and cut]]
     - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#tools-assemblyai]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level3-cut-raw-footage-ffmpeg-whisper]]
     - [[sources/video-editing/20261003/hyperframes-helper-main/README.md]]

5. **[[learn/video-editing/nodes/cut-silences-and-retakes|剪掉靜音與 NG 重錄]]**
   - Goal: 能剪掉靜音、冷場與 NG 重錄，輸出 HyperFrames 可精準 seek 的 `cut.mp4`（ffmpeg trim/concat、最後一版規則、1 秒 GOP）。
   - Sources:
     - [[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#STEP 1 Cut]]
     - [[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Step 1 Transcribe and cut]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level3-cut-raw-footage-ffmpeg-whisper]]
     - [[sources/video-editing/20261003/hyperframes-helper-main/README.md]]

6. **[[learn/video-editing/nodes/design-system-look|設計系統與品牌外觀]]**
   - Goal: 能用 `DESIGN.md` 設計系統讓每支影片有一致、符合品牌的外觀，而不是通用的 AI 預設樣板。
   - Sources:
     - [[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#STEP 2 Grab a Design System]]
     - [[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Step 2 Design system and animate]]
     - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#feedback-reference-designs]]
     - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#04]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level3-storyboard-title-cards]]

7. **[[learn/video-editing/nodes/storyboard-before-render|先分鏡，再渲染]]**
   - Goal: 能用 HTML 分鏡（場景、時間、文案預覽）先規劃影片，並用帶時間碼的釘選留言定調，再進入渲染。
   - Sources:
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#LEVEL 2]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level2-storyboards]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level3-storyboard-title-cards]]
     - [[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#level-two-storyboarding]]
     - [[sources/video-editing/20261003/hyperframes-helper-main/README.md]]
     - [[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Step 2 Design system and animate]]

8. **[[learn/video-editing/nodes/animate-with-hyperframes|用 HyperFrames 算圖與品管]]**
   - Goal: 能用 HyperFrames 渲染出對齊逐字稿的動態圖像影片，並做品管（composition 契約、Studio 時間軸、1080p 抽格檢查）。
   - Sources:
     - [[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#STEP 2 Animate your cut]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#level3-storyboard-title-cards]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#hyperframes-studio-applying-motion-graphics]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#motion-graphics-from-21st-dev-and-3d-logo]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#iteration-and-final-render-choice]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#html-component-inspiration-21st-dev]]
     - [[sources/video-editing/20261003/hyperframes-helper-main/README.md]]
     - [[sources/video-editing/20261003/hyperframes-helper-main/CLAUDE.md]]
     - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#tools-hyperframes]]

9. **[[learn/video-editing/nodes/direct-with-timestamped-feedback|用時間碼回饋執導]]**
   - Goal: 能用時間碼釘選回饋「執導」已渲染的影片，限定範圍重渲染，補完最後 10–20% 且不回歸。
   - Sources:
     - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#LEVEL 3]]
     - [[sources/video-editing/20261003/Opus 5.5 Video Editing is Unbelievably Good (master it in 12 mins).srt#level-three-directing-final-video]]
     - [[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#STEP 3 Direct]]
     - [[sources/video-editing/20261003/Turn Claude Into a Video Editing GENIUS (in 3 simple steps).srt#Step 3 Direct and codify]]
     - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#iteration-and-final-render-choice]]

### Tier 3 — 工藝與複用

10. **[[learn/video-editing/nodes/motion-graphics-vocabulary|動態圖像語彙庫]]**
    - Goal: 能建立個人動態圖像語彙庫：可複用的 recipe（液態玻璃、去背、地球儀、像素圖示、數字 count-up）與 21st.dev 版型。
    - Sources:
       - [[sources/video-editing/20261003/hyperframes-helper-main/README.md]]
       - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#html-component-inspiration-21st-dev]]
      - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#motion-graphics-from-21st-dev-and-3d-logo]]
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#05]]
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#06]]
      - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#element-library]]
      - [[sources/video-editing/20261003/The 3 Levels of AI Motion Graphics.pdf#The reels in the video]]

11. **[[learn/video-editing/nodes/build-and-refine-animate-skill|打造並校準 /animate skill]]**
    - Goal: 能把每次修正沉澱成可複用的 `/animate` skill（pattern 化、calibrate、吸收而非堆疊），並維護已登記的元素庫。
    - Sources:
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#readme]]
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#01]]
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#02]]
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#03]]
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#04]]
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#07]]
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#08]]
      - [[sources/video-editing/20261003/build-your-own-animate-guide.pdf#09]]
      - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#refined-vs-unrefined-skills]]
      - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#feedback-adding-rules]]
      - [[sources/video-editing/20261003/GPT6 Astra one-shots motion graphics like never before (NEW Skill).srt#step-three-calibrate-and-iterate]]
      - [[sources/video-editing/20261003/Sonnet 5.5 Video Editing Guide.pdf#Make it a skill]]
      - [[sources/video-editing/20261003/Claude Video Editing just got a MAJOR upgrade (Hyperframes V2).srt#integrate-tune-calibrate-skill]]
      - [[sources/video-editing/20261003/hyperframes-helper-main/CLAUDE.md]]

12. **[[learn/video-editing/nodes/generate-images-and-video|用 /generate 生圖生影]]**
    - Goal: 能用 `/generate` skill 便宜又安全地生圖生影（聚合商路由、per-model recipe、成本護欄、sidecar log、gallery），作為自架的 Higgsfield 替代方案。
    - Sources:
      - [[sources/video-editing/20261003/generate-skill-guide.pdf#readme]]
      - [[sources/video-editing/20261003/generate-skill-guide.pdf#the-idea]]
      - [[sources/video-editing/20261003/generate-skill-guide.pdf#setup]]
      - [[sources/video-editing/20261003/generate-skill-guide.pdf#the-brain]]
      - [[sources/video-editing/20261003/generate-skill-guide.pdf#the-recipes]]
      - [[sources/video-editing/20261003/generate-skill-guide.pdf#the-models]]
      - [[sources/video-editing/20261003/generate-skill-guide.pdf#the-guardrails]]
      - [[sources/video-editing/20261003/generate-skill-guide.pdf#bonus]]
      - [[sources/video-editing/20261003/generate-skill-guide.pdf#where-this-goes-next]]
      - [[sources/video-editing/20261003/This 1 Claude Skill fully replaces your Higgsfield Subscription.srt#generate-skill-image-ad-demo]]
      - [[sources/video-editing/20261003/This 1 Claude Skill fully replaces your Higgsfield Subscription.srt#higgsfield-as-model-wrapper]]
      - [[sources/video-editing/20261003/This 1 Claude Skill fully replaces your Higgsfield Subscription.srt#higgsfield-controversies]]
      - [[sources/video-editing/20261003/This 1 Claude Skill fully replaces your Higgsfield Subscription.srt#model-aggregators-and-pricing]]
      - [[sources/video-editing/20261003/This 1 Claude Skill fully replaces your Higgsfield Subscription.srt#aggregator-recommendations]]
      - [[sources/video-editing/20261003/This 1 Claude Skill fully replaces your Higgsfield Subscription.srt#skill-anatomy-and-routing]]
      - [[sources/video-editing/20261003/This 1 Claude Skill fully replaces your Higgsfield Subscription.srt#generations-gallery-ui]]
      - [[sources/video-editing/20261003/This 1 Claude Skill fully replaces your Higgsfield Subscription.srt#customizing-and-adding-models]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
