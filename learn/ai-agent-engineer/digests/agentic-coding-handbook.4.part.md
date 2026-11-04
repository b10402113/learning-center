---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.4.part.txt
source_type: text
source_lines: 251
part: 4
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- 第 4 章 Review Engineering — 主張 agent 寫程式遠快於人逐行閱讀，因此要用三個問題(做對的事嗎、做對了嗎、該讀哪幾行)篩掉閱讀量,全章對應 dmoka/skills 的三組技能。
- Lesson 4.1 The review tax — 用 GitHub、Meta、Google DORA 的數據說明審查負擔(verification tax)已成 AI 變現的首要障礙;核心心法是把審查對象從程式碼改成意圖,並用「出錯機率 / 出錯代價 / 你會不會發現」三問決定讀多少。
- Lesson 4.2 Grill the plan — 在寫任何程式前用 grill-me 逐一逼問決策,再要求 2–3 個方案比較可測性、diff 大小、依賴數,最後寫下驗收準則。
- Lesson 4.3 A skeptical reviewer — 作者不能自審,要用全新 context(甚至不同模型)的 adversarial-tester 扮演 QA,先給驗收準則與 AGENTS.md 再審,輸出限定為問題優先、無讚美、PROVED/REASONED 標記、最後給 merge 判決。
- Lesson 4.4 PR tour + triage — Git diff 依字母排序而非理解順序,PR Tour 重整單一 PR 的閱讀順序(intent → intent map → ask-why → 值得看的行 → 閱讀順序 → 噪音),PR Triage 依「需要多少注意力」排序整個佇列,兩者都只指路、不下安全結論。

# L2 detail

- `#L1-L24` — 章名與 Review Engineering 的定位:三個問題(是否做對的事、是否做對、該讀哪幾行),各自對應 dmoka/skills 的一個技能。
- `#L25-L51` — Lesson 4.1 開場:GitHub 容量規劃從 10 倍升到 30 倍、Meta 變更行數一年翻倍且 80% 增幅來自 agent、審查時效下降;DORA 稱之為 verification tax。主張改為審查意圖,並列出三問(出錯機率、代價、是否會察覺)。
- `#L52-L92` — 三問落成兩條處理準則(低風險就不讀、由 agent 跑給你看;高風險就預設它錯了,派懷疑型 reviewer 對照計畫),並附「問題 / 時機 / 技能」對照表:grill-me、adversarial-tester、pr-tour 與 pr-triage。
- `#L93-L116` — Lesson 4.2:壞 PR 多源於需求誤解,故在寫碼前 grill 計畫;grill-me 一次問一題並附建議答案、能自查程式庫就不問人;課程示範的退票需求問了 11 題,最後確認每個分支都被涵蓋。
- `#L117-L140` — 寫碼變便宜,所以先要 2–3 個方案比較可測性、diff 大小、依賴數,選定後把共識寫成白話驗收準則、不准寫程式;示範列出七條準則的前三條(取消次數與時機、退款與手續費總額一致性、按比例退款與回補座位)。
- `#L141-L175` — Lesson 4.3:作者自審會繼承盲點,需全新 context、只看程式碼、最好換模型;adversarial-tester 給 agent「攻擊而非驗證」的 QA 身分,派 sub-agent 審查;並示範審查指令:指定 diff 範圍、準則檔與 AGENTS.md、只審本次變更、舊 bug 另列、問題優先無讚美、結尾給 merge 判決、每項標 PROVED 或 REASONED。
- `#L176-L194` — Review shape 的五條守則(問題優先與判決、標示證據等級、REASONED 需人自己讀、只審本次變更、PR 要小);課程示範審了五分鐘給出 don't merge 與六項發現(兩個 PROVED、四個 REASONED),並舉手續費按每次取消計算與載入新退款預覽時按鈕仍可點為例。
- `#L195-L217` — Lesson 4.4:Git diff 依字母排序造成理解斷裂;PR Tour 為單一 PR 產出一頁,順序為 intent、intent map、ask-why(意圖解釋不到的檔案)、最多八行值得檢查、閱讀順序(測試緊鄰被測程式)、最後收折噪音(lockfile、生成檔、改名)。
- `#L218-L237` — PR Tour 課程示範約六分鐘,ask-why 抓到放寬所有測試時限的 config,首要可疑行是手續費(四次單筆取消付兩歐 vs 一次全取消付 0.8 歐,違反準則二);PR Triage 依注意力分 critical/high/medium/low,看變更內容而非大小或標題,每級指向關鍵行,每個 PR 用獨立 judge,多 repo 只需設定一次。
- `#L238-L251` — 為何順序重要:Appendix C 的研究顯示標註 AI 撰寫不會讓審查者更謹慎;PR Tour 把閱讀順序改成意圖→重要檔案→噪音;PR Tour 與 PR Triage 只指路,從不宣稱 safe 或 ready to merge,合併決定仍留給人與懷疑型 reviewer。
