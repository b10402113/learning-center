---
subject: cliff-note
status: draft # draft → confirmed
path: practice-first
created: 2026-10-06
---

# ROADMAP — cliff-note

## Goal

用 AI 從頭到尾做出一支簡短的旁白動畫，整個流程自己走一遍：寫腳本 → 做旁白 → 排分鏡/時間碼 → 讓 AI 生成場景 → 匯出成影片檔。學會「自己出主意、讓 AI 動手、自己檢查結果」這個分工，而不是親手寫動畫程式。

## Learning path

**practice-first（實作優先）**。先用最小可跑的成果建立手感，再按「一個階段一個階段」的節奏把同一支 Sam 範例做完，最後換成自己的題目。優化的是動能與「每一步都收在看得到的產出」——最適合初學者、不想先讀完整理論、要靠動手維持節奏、成本敏感（先跑免費/本地路徑）的人。

- **Tier 1 先把最小成果跑起來**：先把 workspace 開好、跑通環境檢查並匯出第一個可播檔；再看懂五階段管線與「AI 動手、你導演＋檢查」的分工。先在螢幕上看到東西，才回頭掛概念。
- **Tier 2 用 Sam 範例逐階段做一遍**：照 Voice → Words/Storyboard → Scene → Export 的順序，一個節點收一個階段，每段都要檢查。
- **Tier 3 換成自己的題目**：保留範例專案，另開新專案，把偏好設定帶著走，用同一條管線做完自己的一支短片。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe cliff-note/<node-id>` to measure a node, then `/nodes cliff-note/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 先把最小成果跑起來

1. **[[learn/cliff-note/nodes/workspace-and-first-export|開好工作區、匯出第一個可播檔]]**
   - Goal: 在自己電腦上開好一個可重複使用的 workspace（prepared 或請 AI 建），跑通環境檢查，並匯出、播放一個無聲測試片段。
   - Sources:
     - [[sources/cliff-note/20261006/3-1.3 Get the Workspace Ready with Your AI/video.en.vtt#route-a-premium-workspace]]
     - [[sources/cliff-note/20261006/3-1.3 Get the Workspace Ready with Your AI/video.en.vtt#route-b-build-your-own]]
     - [[sources/cliff-note/20261006/3-1.3 Get the Workspace Ready with Your AI/video.en.vtt#setup-check]]
     - [[sources/cliff-note/20261006/3-1.3 Get the Workspace Ready with Your AI/video.en.vtt#create-course-project]]
     - [[sources/cliff-note/20261006/3-1.3 Get the Workspace Ready with Your AI/video.en.vtt#write-and-review-brief]]

2. **[[learn/cliff-note/nodes/pipeline-and-division-of-labour|看懂五階段與「AI 動手、你檢查」的分工]]**
   - Goal: 說出 Voice→Words→Storyboard→Scene→Export 五階段，並能用「輸入 / 產出檔 / 檢查點」描述任何一段交接。
   - Sources:
     - [[sources/cliff-note/20261006/1-1.1 Welcome and Your Route Through This Module/video.en.vtt#intro-ai-does-the-file-work]]
     - [[sources/cliff-note/20261006/1-1.1 Welcome and Your Route Through This Module/video.en.vtt#project-through-stages]]
     - [[sources/cliff-note/20261006/1-1.1 Welcome and Your Route Through This Module/index.html#your-first-small-exercise]]
     - [[sources/cliff-note/20261006/2-1.2 How This Video Was Made/index.html#intro]]
     - [[sources/cliff-note/20261006/2-1.2 How This Video Was Made/index.html#find-the-part-you-need]]
     - [[sources/cliff-note/20261006/2-1.2 How This Video Was Made/index.html#try-one-handoff]]

### Tier 2 — 用 Sam 範例逐階段做一遍

3. **[[learn/cliff-note/nodes/script-and-voice|腳本與旁白]]**
   - Goal: 對照來源寫出並審過一份腳本，再做或選一段聽完整的 voice take。
   - Sources:
     - [[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#ask-for-the-script]]
     - [[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#review-the-script]]
     - [[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#choose-the-voice-route]]
     - [[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#generate-and-listen]]
     - [[sources/cliff-note/20261006/4-1.4 Ask for a Script, Then Make the Voice/video.en.vtt#fix-and-select]]

4. **[[learn/cliff-note/nodes/timings-and-storyboard|時間碼與分鏡]]**
   - Goal: 從實際錄音產生逐字稿＋時間碼，寫出「每句話配什麼畫面」的 cues 分鏡，並抽查文字與時間兩件事。
   - Sources:
     - [[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#stage-overview]]
     - [[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#transcription-setup]]
     - [[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#transcribe-and-verify]]
     - [[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#storyboard-plan]]
     - [[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#storyboard-check]]
     - [[sources/cliff-note/20261006/5-1.5 Turn the Voice into a Visual Plan/video.en.vtt#compile-and-save-cues]]

5. **[[learn/cliff-note/nodes/scene|場景]]**
   - Goal: 讓 AI 依計畫做出場景，用靜格、播放與縮小視窗檢查畫面真的解釋得通。
   - Sources:
     - [[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#setup-from-plan-to-scene]]
     - [[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#scene-location-and-correction]]
     - [[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#review-the-explanation]]
     - [[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#visuals-fit-the-teaching]]
     - [[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#stills-preview-and-small-size-check]]
     - [[sources/cliff-note/20261006/6-1.6 Let AI Build the Scene/video.en.vtt#restyle-and-finalize]]

6. **[[learn/cliff-note/nodes/fix-and-export|修正與匯出]]**
   - Goal: 找出第一個看不懂的時刻、給一處具體修正，先小量測試匯出，再檢查真正的 MP4 並保存可重現指令。
   - Sources:
     - [[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#watch-the-preview]]
     - [[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#give-one-correction]]
     - [[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#check-fix-in-context]]
     - [[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#export-explained-and-test]]
     - [[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#save-the-command]]
     - [[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#check-exported-file]]
     - [[sources/cliff-note/20261006/7-1.7 Fix What You See, Then Export/video.en.vtt#final-review-and-recap]]

### Tier 3 — 換成自己的題目

7. **[[learn/cliff-note/nodes/your-own-idea|用自己的題目重跑一次]]**
   - Goal: 保留範例專案、另開新專案，帶上偏好設定，用同一條管線做完自己的約 30 秒動畫。
   - Sources:
     - [[sources/cliff-note/20261006/8-1.8 Make the Next Video with Your Own Idea/video.en.vtt#choose-your-idea]]
     - [[sources/cliff-note/20261006/8-1.8 Make the Next Video with Your Own Idea/video.en.vtt#keep-project-create-new-folder]]
     - [[sources/cliff-note/20261006/8-1.8 Make the Next Video with Your Own Idea/video.en.vtt#reuse-instructions-and-fresh-brief]]
     - [[sources/cliff-note/20261006/8-1.8 Make the Next Video with Your Own Idea/video.en.vtt#review-each-handoff]]
     - [[sources/cliff-note/20261006/8-1.8 Make the Next Video with Your Own Idea/video.en.vtt#carry-preferences-forward]]
     - [[sources/cliff-note/20261006/8-1.8 Make the Next Video with Your Own Idea/video.en.vtt#start-small-and-scope-changes]]
     - [[sources/cliff-note/20261006/8-1.8 Make the Next Video with Your Own Idea/video.en.vtt#review-export-and-share]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
