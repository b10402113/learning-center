---
source: sources/real-engineer/20261116/course/090 Whiteboard Your Own Tasks.en.txt
source_type: text
source_lines: 81
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L45
---

# L1 overview

- 基礎設施定了，接著要定「工廠到底要做什麼」；先把語彙釘死：runner 是可丟棄的機器，run 是在 runner 上的一次執行，task 是跑在 runner 上的工作單位。
- explore、implement、review 各自都是可以丟到 runner 上執行的 task；這一節要腦力激盪出一批可跑的 task。
- 方法是離開 agent、回到白板：作者準備了 tldraw 模板，做的是系統設計而非實作練習。
- 模板是唯讀的，要用左上角三點「copy to my workspace」複製到自己的工作區；不想用 tldraw 也可以用 Excalidraw 之類自行重畫。
- 圖上的每個節點同時代表「做什麼」與「在哪個部件上做」：例如第一步落在 ticket tracker（使用者標記 agent:explore 當觸發），orchestrator 排 runner，runner 分組並派 sub-agent，同一台 runner 上完成並回傳 verdict。
- 練習時要一邊畫一邊想自己 provision 的那套：這是 Linear、這是我自建的 Inngest、這跑在 Daytona，再回到 Linear。

# L2 detail

- `#L1-L11` — 承接上一課「設施已選定但還沒定要做什麼」；重新定義語彙：runner 是可丟棄機器，run 是其上的一次執行，task 是要交給 runner 執行的工作，explore／implement／review 都是 task 的實例。
- `#L12-L40` — 方法與工具：離開 agent，回到作者最愛的白板思考；使用他做好的 tldraw 模板來 mock 工廠流程；模板唯讀，用左上三點 copy to my workspace 複製（需註冊免費帳號），也可改用 Excalidraw 等其他繪圖工具；強調即使 AI 時代，畫圖設計軟體仍是必要技能。
- `#L41-L68` — 操作技巧與圖例語意：快捷鍵（cmd 縮放、space 拖曳、alt 複製），左側元件拖到右側；每個節點同時標示步驟與執行位置；以 explore tickets 為例說明分支邏輯——使用者在 tracker 標記 label 觸發、orchestrator 排 runner、runner 分組並在同一 runner 上派 sub-agent、回傳 verdict，需要更多資訊就留言到 ticket，判斷簡單就回報 orchestrator 直接進 implement。
- `#L69-L81` — 不必畫完整條流程，可以用省略號表示「後面照理會接下去」；熟悉工具後開始做系統設計練習；畫的時候要把上一課選的實際服務代入（Linear → 自建 Inngest → Daytona → 回 Linear），這樣設計才會具體。
