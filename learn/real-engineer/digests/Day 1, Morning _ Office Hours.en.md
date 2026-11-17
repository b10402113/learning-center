---
source: sources/real-engineer/20261116/course/Day 1, Morning _ Office Hours.en.txt
source_type: text
source_lines: 521
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 多個 repository 怎麼共用一個 software factory？用一個 agent repo 放 skills、AGENTS.md、steering 與 wiki，其他 repo 只放連結、需要時才 clone；20 個左右沒問題，400 個要靠檔案結構做漸進揭露。
- 用什麼指標防止程式碼退化？作者坦言目前沒有公認指標（覆蓋率、deep module 數、LOC 對介面大小都不可靠），而且指標一旦變成目標就會被扭曲；課程前五個煞車章節才是他現在的答案。
- 一個人做新專案值得投資 factory 嗎？值得。factory 是一組可攜的實務而非程式碼，先付時間成本換日後每個專案的速度；人的角色從寫產品變成「打造製造產品的迴圈」。
- UI 設計在 agent 流程裡怎麼辦？agent 沒有眼睛、主要吃文字，作者靠自己的前端直覺加上大量 prototyping（Wayfinder 會要求），再輔以設計類 skills。
- 怎麼追蹤 factory？拆成「agent 現在在做什麼」與「專案要往哪走」；前者要 observability 工具，後者要避免 cognitive debt，靠持續 planning 與 domain modeling。
- chief of staff skill 是什麼？每個專案一條長期 thread，所有工作交給 sub-agent 以保護 context，sub-agent 之間只傳 context pointer；wiki 是能活過 session 的 markdown，且被定義成「有日期、引用 commit 的歷史紀錄」。
- agent 自主開發下怎麼保品質與安全？用 one-way door / two-way door 決定是否必須人工複查；流程是實作者 agent、另一個 agent 自動 review，最後才進人工抽檢。
- 團隊場景怎麼用？factory 程式碼放在 agent repo，並在團隊原本就在的 Slack / Discord 裡 grill，而不是在 terminal 一對一對話。

# L2 detail

- `#L1-L37` — 多 repository 的 software factory：一個 agent repo 集中 skills、AGENTS.md、steering 與 wiki，其他 repo 以連結加「需要時 clone」接入；約 20 個 repo 可行，400 個則需要檔案結構與漸進揭露，否則 agent 的決策空間過大。
- `#L38-L66` — 問該用什麼指標防退化：覆蓋率、deep module 數量、LOC 對介面大小都不可靠，幾十年來沒有定論；把指標當目標會被扭曲，所以不要過度最佳化指標，先把「好的 agent codebase」定義清楚再談度量。
- `#L67-L82` — 問 solo dev 做新 web app 值不值得：值得。software factory 不是建築或基礎設施，而是一組可搬到下一個專案的實務；前提是時間預算允許，因為它是先投資、之後每個專案回收。
- `#L83-L106` — 問 UI 設計與 prototyping 怎麼放進流程：agent 以文字為主、對圖像較弱，作者靠自己的前端經驗做判斷，在 Wayfinder session 中反覆 prototyping，並搭配 impeccable、Emil Kowalski 等設計 skills。
- `#L107-L152` — 問東西越做越多、怎麼不忘記：分兩層——用 observability 平台（如 langfuse）看 agent 在做什麼、花多少；用 planning 加 domain modeling 對抗 cognitive debt，讓 glossary 成為人與 agent 一起維護的語言。
- `#L153-L232` — 介紹實驗中的 chief of staff skill：一個專案一條長期 thread，所有工作丟 sub-agent 以保護 context window，sub-agent 只透過 context pointer、研究筆記、commit、wiki 溝通；wiki 是互相連結、能跨 session 存活的 markdown，放在 agent repo，靈感來自 Andrej Karpathy 的 LLM wiki。
- `#L233-L302` — wiki 的關鍵補充是「它是歷史紀錄」：每條主張標日期，涉及程式碼就引用當時的 commit，避免過期內容被誤認為現況；chief of staff 也會自動跑 retro 與 to-spec→implement，但策略面幾乎沒成功，模型只做戰術任務，因此還沒打算正式發布。
- `#L303-L318` — 兩個補充：tribal knowledge 就用一般 markdown 資料夾存，作者不追求 second brain；技能通常先手寫初稿、讓 agent 補（例如 wiki 段落），發布前再手寫一次。
- `#L319-L354` — 問自主開發下的品質與安全：用 PR skill 裡的 one-way door / two-way door 判斷風險；流程是 implementer agent 實作、另一個 agent 自動 review、最後才人工，人工只抽檢容易回滾的部分，agent 也能代替部分手動 QA 點擊流程。
- `#L355-L384` — 用自己做的 Discord office-hours 應用示範「fully verifiable」：給 agent dummy server、真實 token、第二個會提問的 bot 與各種資料來源，讓它走真實路徑亂試，結果找出並修掉大量問題。
- `#L385-L446` — 問 retro PR 改了 skill 怎麼證明有效：automated checks 只吃 CPU，便宜就大量堆；automated review 花 token，要節制，AGENTS.md 保持精簡，並警覺 no-op（如「make no mistakes」）與 sediment。順帶說 Docker sandboxes 與 sandcastle 無法準確比較，前者偏 human-in-the-loop，後者偏 AFK。
- `#L447-L521` — 兩個場景：時間緊迫的專案（hackathon）不該搞 factory，因為它是長期投資；團隊才是真正需要幫助的場景，factory 程式碼要放在 agent repo，難點在早期對齊，建議在團隊原本就在的 Slack / Discord 裡 grill，並多做 pair / mob programming。最後是社群閒聊與收尾感謝。
