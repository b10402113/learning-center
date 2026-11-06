---
source: sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt
source_type: text
source_lines: 410
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Planning 是把目標拆解成步驟；例子是新增 endpoint：蒐集需求、寫 endpoint、寫測試、跑測試、確認編譯。
- 兩種規劃模式：plan-then-execute 與 ReAct（reasoning and acting）；reasoning model 通常規劃得更好，也更常被放進 agent。
- Plan 是 hypothesis，會隨 feedback 改變；複雜目標可多層拆成 subtask（1A、1B、1A1…）。
- Reflection 是用環境回饋檢查 output 並修正計畫；本質上「只是更多 prompting」，便宜且容易實驗。
- 每次反思都多一次帶完整 trajectory 的呼叫，可能讓帳單三倍，因此要有停止條件或重試上限。
- Self-refine：同一模型 generate → critique → refine，2023 論文在七項任務平均進步約 20%，箭頭仍由開發者畫。
- Reflexion：actor、evaluator、self-reflection LLM 三實體；evaluator 可以是 unit test 等非 LLM 的確定性檢查。
- 反思需要真實外部訊號（測試、編譯器、API error、空檢索、人類）；Google 2023 論文指出沒有外部訊號的自我修正可能讓結果更糟；把學習寫進權重靠 fine-tuning 與 RLVR。

# L2 detail

- `#L1-L15` — 銜接：設計系統決定 agent 如何思考與行動，開發者則要決定它可動用的記憶工具；本節談 planning 與 reflection。
- `#L16-L35` — Planning 的定義：把目標分解成步驟；以新增 endpoint 為例，依序蒐集需求、寫 endpoint、寫測試、跑測試、確認編譯。
- `#L36-L50` — 兩種模式 plan-then-execute 與 ReAct；reasoning model 規劃較好，是它在 agent 中受歡迎的原因。
- `#L51-L63` — Copilot／Claude 回覆前跑出的 reasoning 就是一種計畫：先想需要做哪些 action，再繼續執行。
- `#L64-L90` — 計畫是會因回饋改變的 hypothesis；複雜目標可拆成 tasks、subtasks 與更細的 1A1、1A2；agent 需要能規劃也能反思。
- `#L91-L113` — 反思：agent 評估 output、在結束前修改計畫；回饋可能來自環境，例如編譯失敗或 API 回錯誤碼。
- `#L114-L144` — Reflection 就是更多 prompting；改幾個字就能實驗、容易 ship 與 review，任何角色都能做。
- `#L145-L179` — 成本：每次反思都多一個 call，且帶著整條 trajectory；可能不小心讓帳單變三倍，所以要設「想過幾次還錯就停」的 guardrail。
- `#L180-L219` — Self-refine（2023）：模型產生答案、拿回同一模型自我批評、再把答案加回饋重試，直到停止條件；七項任務平均約 +20%；箭頭仍由我們寫。
- `#L220-L259` — Reflexion（拼法有 X）：不只反思單一答案，而是讓 agent 對過去任務做口頭反思；actor 執行動作，evaluator 看整條 trajectory 評分，且 evaluator 不必是 LLM。
- `#L260-L283` — self-reflection LLM 把 trajectory 與分數寫成一段文字，連同資訊交回 actor 再試，直到 evaluator 判定正確或觸及停止條件。
- `#L284-L300` — 反思會累積在記憶中；第三次嘗試時 agent 看得到前幾次失敗的教訓，因此能不用人工介入就改善。
- `#L301-L316` — 學習發生在 context window，比 fine-tuning 快又便宜，但 context 一清空就消失，除非另外存進長期記憶。
- `#L317-L351` — Google 2023《Large Language Models Cannot Self-Correct Reasoning Yet》：沒有外部訊號時自我修正不一定變好，甚至會把對的改錯；應把時間花在找 unit test、編譯器、API error、空檢索或人類等真實訊號。
- `#L352-L398` — Self-improvement 是把改善寫進權重，靠 fine-tuning 與 RLVR（reinforcement learning with verifiable rewards），例如 2+2 或測試是否全過；這是模型變強的原因，但 RL 是否會限制可解問題仍有爭論。
- `#L399-L410` — 收束：tools、memory、planning、reflection 都談完；接下來要看控制流程的光譜——多少箭頭由人寫，多少由模型在 runtime 決定。
