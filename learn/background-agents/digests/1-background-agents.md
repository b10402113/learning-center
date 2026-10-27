---
source: sources/background-agents/20261027/1-background-agents.md
source_type: text
source_lines: 102
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 定義的收斂 — 從觀眾的各種說法（無止境 loop、Kubernetes operator、事件觸發的 process）出發，再收斂到「不用你開口，事情也會完成」。
- prompt 換成 goal — 從單一任務改成持續維持某種世界狀態，agent 負責讓願景保持成立。
- Durable — 失敗時自己重試、必要時暫停再回來，比同步 chat agent 更有韌性；但不是要取代 chat agent。
- 權限契約 — 判斷「需不需要核准」不能交給會 hallucinate 的 LLM，必須切成 LLM 負責模糊判斷、harness 負責 deterministic 阻擋。
- harness 核心 — observe、decide、act 迴圈，差別在於不做 tool calling、且 agent 可以真正停下來等待。

# L2 detail

- `#L1-L11` — 請觀眾定義 background agent：無止境 loop、Kubernetes operator、被外部事件觸發的 process，以及與 chat agent 的對比。
- `#L12-L26` — 生產力解鎖論點：chat agent 受限於打字速度且是同步的，真正的高生產力是事情在你沒開口時也完成。
- `#L27-L36` — 從給 prompt 改成給 goal：agent 強制維持某個願景或均衡狀態，並比 chat agent 更 durable。
- `#L37-L46` — durable 的具體差異：API 失敗、timeout 時持續嘗試、可暫停恢復，但不取代所有 chat agent。
- `#L47-L60` — 盯 email 的個人案例：本地模型與自建 harness 的隱私考量，強調架構一致、工具可替換。
- `#L61-L77` — 權限問題：背景執行時誰有權限做什麼；把核准判斷交給 LLM 會失效，因此要切開 LLM 與 harness 的職責。
- `#L78-L102` — observe-decide-act 迴圈，與標準 tool loop 的差異（不做 tool calling、agent 可以等待而不燒算力），並預告下一節。
