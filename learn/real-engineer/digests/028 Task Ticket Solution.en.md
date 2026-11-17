---
source: sources/real-engineer/20261116/course/028 Task Ticket Solution.en.txt
source_type: text
source_lines: 87
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L43
---

# L1 overview

- 實作場：agent 自行觸發 wizard skill，因它已讀過 research、map 與相依 ticket，知道已選 Knock，甚至去查 Knock docs 以確保步驟不是編的。
- 只花 44k tokens 就產出一支 bash setup wizard；作者刻意不在 agent 內執行，而是複製到獨立終端跑，並在旁邊開瀏覽器。
- wizard 會自動開對的頁面、逐步指示：註冊／登入、建 Cadence 組織、留在免費開發方案、切到 development 環境。
- 安全性重點：wizard 不連 agent，所以可以直接貼 secret，不會送到模型供應商。
- 建立的資源：建立 in-app feed channel 名為 cadence feed、取 channel id、public／secret API key、產生 application signing key（base64 單行），最後開啟 enhanced security mode。
- 四個值寫入 .env（feed channel id、public API key、secret API key、signing key），且已被 git ignore。
- 驗證發現 signing key 被截斷，作者手動重貼後重驗通過，agent 還真的對 Knock API 發了一個 signed token 呼叫，才把 resolution 寫回 map。

# L2 detail

- `#L1-L11` — 說明 model-invoked skill 能否被觸發取決於 description 與用字；agent 成功觸發，表示它讀過研究、map 與相依 ticket，知道已選 Knock，並去查 Knock docs 找確切 dashboard 路徑以免亂編步驟。
- `#L12-L20` — 只有 44k tokens 就得到 bash wizard；作者把腳本複製到獨立終端執行（不在 agent 裡），左邊 agent、右邊瀏覽器，因為 wizard 會自動開 URL。
- `#L21-L33` — 逐步操作：開 dashboard.knock.app、註冊／登入、為 Cadence 建組織、留在免費 developer 方案、用左上環境切換器選 development；貼上 dashboard URL 存查；強調 wizard 不接 agent，因此 secret 不會離開本機。
- `#L34-L58` — 自己動手做敏感步驟：在 channels 與 sources 建 in-app feed channel 名為 cadence feed 並貼 channel id；在 platform API keys 取 public key、private／secret key；產生 application signing key 並貼 base64 單行；開啟 enhanced security mode（wizard 誠實承認 docs 沒寫開關位置，最後在 API keys 頁找到）。
- `#L59-L87` — 四個值寫入 .env 且被 git ignore；請 agent 驗證後發現 signing key 被截斷，作者手動重貼再驗；agent 在不讀出金鑰的情況下驗格式，還對 Knock API 發出真實 signed token 呼叫，確認後把 resolution 記到 map，本地設定可用、可以開始 prototyping；作者補充 wizard skill 非必要但在一次設定多家供應商時非常有用。
