---
subject: claude-code-master
status: draft
path: course-order
created: 2026-10-31
---

# ROADMAP — claude-code-master

## Goal

照課程順序 A → G 完整走一遍，把四層 ARMS（Apps、Routines、Memory、Skills）裝進自己的 workspace，而不是再懂一次名詞。驗收判準是「重複工作真的被自動化」：至少一條 routine 在排程上自己跑、一個 skill 會自己觸發、memory 大到能被檢索、一個原本沒有 connector 的 app 接得上，最後用 design system 做出一個真的上線的網站。

## Learning path

**course-order（見習制）** — 照課程的建置順序走：先介面、成本與 workspace 的心智模型，再 skills 與 memory，再 routines 與 apps，最後 taste／design 與 Agentic OS v2。這個角度優化的是「不跳前置、每一步都接得上下一步」；每個 tier 的產物都是下一個 tier 的前提，設計給想完整走一遍、把四層真的裝起來的人。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes claude-code-master/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 介面、成本與 workspace

1. **[三種介面](nodes/three-surfaces.md)**
   - Goal: 能在 desktop、VS Code、terminal 之間選一個日常介面，並說出另外兩個換到什麼。

2. **[Workspace 設定與 GitHub 工具](nodes/workspace-setup-and-github-tools.md)**
   - Goal: 從空資料夾建出第一個 workspace，並用 `/personalize` 安全評估 GitHub 上的工具。

3. **[方案、模型與 effort](nodes/plans-models-and-effort.md)**
   - Goal: 用 `/usage`、token 單位與 effort 等級判斷哪個方案、模型、思考深度值得花。

4. **[Context Window 與權限模式](nodes/context-window-and-permission-modes.md)**
   - Goal: 用 `/context` 讀出預佔的 token，並在五種權限模式之間選出速度與控制的平衡。

5. **[把 workspace 當作業系統（ARMS）](nodes/workspace-as-operating-system.md)**
   - Goal: 用 model／harness／context 與 ARMS 四層解釋自己的 workspace，排出 bottoms-up 建置順序。

### Tier 2 — Skills

6. **[Skill 是什麼](nodes/what-a-skill-is.md)**
   - Goal: 解釋 SKILL.md 的 name／description 預載與 body lazy-load，並知道什麼時候該用 `/` 觸發。

7. **[建立好 skill](nodes/creating-good-skills.md)**
   - Goal: 用「同一個 prompt 打兩次就存」的規則建 skill，並用 `/align` 在動工前對齊。

8. **[進階 skill 與安全安裝](nodes/advanced-and-safe-skills.md)**
   - Goal: 判斷 skill 何時該長出 scripts／references、如何審查社群 skill、以及用 `/context` 抓數量上限。

### Tier 3 — Memory

9. **[CLAUDE.md：agent 的員工手冊](nodes/claude-md-employee-handbook.md)**
   - Goal: 寫出 identity／goals／rules／workspace map 四支柱的 CLAUDE.md，並分清 global 與 project 兩份。

10. **[MEMORY.md、自動記憶與 calibrate](nodes/memory-md-and-calibration.md)**
    - Goal: 建出「索引指向 artifact」的 MEMORY.md，知道自動記憶何時寫、何時該用 `/calibrate` 回寫。

### Tier 4 — Routines

11. **[排程的三種做法](nodes/three-kinds-of-routines.md)**
    - Goal: 分辨 local／cloud／24-7 routine，並把一條 routine 從 draft 跑到排程。

12. **[不用 token 的 deterministic routine](nodes/deterministic-routines.md)**
    - Goal: 用 Modal 建一條不花 token 的 deterministic pipeline，並判斷何時不該讓 LLM 參與。

### Tier 5 — Apps

13. **[接上一個 app 的三條路](nodes/three-ways-to-connect-an-app.md)**
    - Goal: 依 CLI → API → MCP 的成本順序選路，實際把一個 app 接上 Claude Code。

14. **[自己印一個 CLI](nodes/print-your-own-cli.md)**
    - Goal: 用 HAR 抓真實 API，產出 CLI 與 skill，把沒有 connector 的 app 變成自己的工具。

### Tier 6 — Taste 與 Design

15. **[Craft：create 與 rig](nodes/craft-create-and-rig.md)**
    - Goal: 用 Craft 的 create 與 rig 產出 section plan、骨架與可運作的表單。

16. **[Design system、UI sniping 與 tweak](nodes/design-system-sniping-and-tweak.md)**
    - Goal: 用 design system skill 把 generic 頁面變成品牌一致，並用 21st.dev、RoboCapture、`/tweak` 收尾。

17. **[素材、後端與上線](nodes/assets-backend-and-launch.md)**
    - Goal: 用 aggregator 生成素材、用 Resend 接通表單，並用 Playwright 審計後部署上線。

### Tier 7 — Agentic OS v2

18. **[我的 Agentic OS v2](nodes/agentic-os-v2.md)**
    - Goal: 用十二個等級檢查自己的 setup，指出每一層現在缺哪一級。

19. **[Skills、Routines、Apps 的三個等級](nodes/three-levels-skills-routines-apps.md)**
    - Goal: 把 skill 分成 database／artifact／self-triggered、routine 分成 active／passive／capped，各升一級。

20. **[Memory 的三個等級與 Second Brain](nodes/three-levels-memory-and-second-brain.md)**
    - Goal: 用 plain-text routers 與 `brain.js` 取代 vector RAG，量出 second brain 比預設省多少 token。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
