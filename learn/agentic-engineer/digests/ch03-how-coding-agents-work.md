---
source: sources/agentic-engineer/20261030/3. How Coding Agents Work
source_type: text
source_lines: 1983
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
supplements:
  - code-ai-course-demos-login-bug.md#L1-L30
  - code-ai-course-demos-login-bug.md#L1-L90

---

# L1 overview

- **The Agent Loop** — 所有 coding agent 都跑同一個四拍迴圈：read → decide → act → observe，重複到任務完成。五分鐘的任務可能跑 8 圈，複雜功能可能 80 圈；每一圈都是做對或做錯的機會，而錯誤不會被隔離，會逐圈複合。你能控制的三個槓桿是：允許它讀什麼、幫它把決定講清楚、多嚴格檢查它回報的觀察結果。
- **What the Agent Sees** — agent 不「知道」你的專案，它只知道當下載入 context window 的東西：本次對話、它明確用工具讀過的檔案、always-on 設定（如 CLAUDE.md）、系統指令。規則很硬：你沒說、它沒讀，它就不知道。所以「它應該知道」的挫折，幾乎都是可修的 context 缺口。
- **How Agents Read Your Codebase** — 背後沒有索引、沒有 embeddings、沒有預建專案地圖；只有 grep、glob、read 三個 on-demand 工具，像第一天上班的新人一樣邊搜邊讀。示範中一個「auth 在哪」的問題花了 1 次搜尋、1 次過濾決策、4 次讀檔。因為沒有索引，檔名與結構直接決定它要搜多久、燒多少 context。
- **Context Windows and Why They Fill** — 所有讀到的東西都進同一個有硬上限的容器，有些工具開到 100 萬 tokens 仍比預期快滿。填滿窗口的多數不是答案，而是「找到答案的成本」：整檔載入、幾十筆搜尋結果、猜錯且不退費的檔案。放大到 30–40 次往返的真實 session，探索本身就會把巨大窗口吃掉。
- **Context Rot: Quality Slips Before The Window Fills** — 2025 年對 18 個前沿模型的測試顯示，全部模型都隨 token 增加而品質下降，且不是快滿才開始：宣稱 200k 的模型在 50k 就可測退化。兩種獨立效應：位置（U 型，埋在中間差 20–30 分）與長度（92% → 68%；改寫過的事實在約 32k tokens 時掉到短 context 準確率一半以下）。
- **Topic Switching: When Unrelated Work Pulls Focus** — 就算窗口只半滿，無關材料也會搶注意力：每主題獨立時 100% 正確，八個無關主題塞進同一段對話後掉到約 75%。這叫 contextual distraction。日常症狀是重複（已否決的方案再提）、遺忘（早先決定又被問）、矛盾（同一問題兩次不同答案），原因是相關／無關比例變了，不是模型變差。
- **Clearing vs. Compacting** — 重置有兩種：clearing 清空窗口，之後裡面有什麼你完全知道；compacting 讓模型把對話摘要成濃縮版，你在它變成新 context 前無法審閱，重要細節可能被壓掉或悄悄改寫。判準：下一步越依賴早先的精確細節就越該 clear，越依賴大方向與動能就越該 compact。
- **Tokens: What Costs What** — 讀很貴、推理很便宜（指 tool call 之間例行的快速判斷）。貴：整檔讀取（300 行檔就是約 300 行的 token）、搜尋結果、長對話歷史（60 則往返背著全部 60 則）、冗長輸出。便宜：精準問題、小範圍讀取。交付任務前先問：這會逼它廣泛閱讀還是精準閱讀？

# L2 detail

- `#L1-L100` — `1. The Agent Loop.srt` — 開場：心態是架構與指揮，但要指揮得好得先懂底層，不必深到技術細節，只要知道按下 enter 後發生什麼。所有 coding agent 不分工具都跑同一個迴圈：read → decide → act → observe，然後重複到任務完成。接著進 demo：一個只有登入表單與任務清單的極簡 app，登入鈕按了沒反應；對 Claude Code（CLI 或 extension）說「登入鈕好像沒作用，可以幫我查為什麼嗎」，按下 enter 即時觀察迴圈發生。
- `#L101-L200` — `1. The Agent Loop.srt` — 讀取階段：因為不知道按鈕在哪，第一步是 grep login、開啟找到的 component、繼續讀相關檔案直到命中。讀完才進入 decide：看到按鈕 component 與 on-click handler，決定去查 handler 實際呼叫什麼。接下來是 act——不是描述而是真的工具呼叫：開檔、用 bash 跑 type check、再試 build 看有沒有弄壞東西。最後 observe：看回傳結果，發現 handler 呼叫了一個重構後已不存在的函式，改名了但引用沒更新。
- `#L201-L300` — `1. The Agent Loop.srt` — observe 之後它又跑了一輪：read 查函式被搬到哪、decide 確認是正確那個、act 提出修正、observe 等你 approve 或 reject。實際登入後回「你還沒有帳號」，正是預期行為，證明按鈕已呼叫正確函式。接著抽象化：這一輪 read/decide/act/observe 是 agent 一切行為的原子單位；五分鐘任務可能跑 8 次，複雜功能可能 80 次。
- `#L301-L408` — `1. The Agent Loop.srt` — 對架構師的意義：每一圈都是做對或做錯的機會。讀得不完整，decide 就建在缺口上；依壞決定行動，observe 只把錯誤確認下來餵進下一圈——錯誤不會被隔離，會逐圈複合，所以 session 前幾圈看起來正常、之後慢慢漂移；不是模型變差，是三圈前的一個壞讀取還在塑造之後每一圈。可控制的是：它被允許讀什麼、你幫它把 decide 講得多清楚、你多嚴格檢查它 observe 後回報什麼——目標是在第 3 圈而非第 30 圈抓到漂移。下一課：它實際「看到」什麼。
- `#L1-L39` — `2. What the Agent Sees (9_11_2026 1：22：42 PM).txt` — 讀過才算知道：上一課的 bug 追查不是附帶情節，而是迴圈存在的理由——它不從「知道」開始。context window 只裝四類東西：本次對話、明確用工具讀過的檔案、always-on 設定（如 CLAUDE.md）、系統指令；Slack 討論、README、ticket、上週 session 都不在。規則：你沒說、它沒讀，它就不知道。四種「它應該知道」的失敗成因——別的 session 講過、以為 repo 裡就有等於讀過、只告訴同事或寫在文件、講得太早被擠出窗口——全是可修的 context 缺口。心態轉變：每個 prompt 前先問「它現在手上真的有那個檔案／慣例／限制嗎」，沒有就先解決 context 問題，還不是交付任務的時候。
- `#L1-L100` — `3. How Agents Read Your Codebase.srt` — 破除最常見的錯誤假設：不是 Google 式搜尋，背後沒有 index、沒有 embeddings database、沒有預建專案地圖。它找東西的方式跟你第一次開這個 codebase 一樣——搜尋，然後開檔。工具就三個：grep 跨檔搜文字、glob 依 pattern 找檔、read 開檔看內容；沒有捷徑、沒有魔法，每次都是 on-demand 呼叫，而且整個過程可以即時看到。
- `#L101-L260` — `3. How Agents Read Your Codebase.srt` — 在乾淨 context 問「這個專案的 auth 在哪處理」。它不直接回答，先搜：用 bash 跑基本 grep auth，因為還不知道位置所以撒很大的網，只先猜可能是 .ts 或 .js。回來一堆檔，但它還沒開始開檔——先依檔名與上下文判斷哪些真的相關。接著開 auth.ts，讀對了：認證核心就在這個檔，不是只有檔名含 auth。再順著檔案裡的引用讀其他相關檔，這一刻才從「找到可能相關」變成「真的懂它在做什麼」。
- `#L261-L400` — `3. How Agents Read Your Codebase.srt` — 答案：auth 分四層，credentials 與 handler registry 在 lib.ts，另讀了 sessions、actions、proxy，回答精確並引用實際檔案與函式。代價是 1 次搜尋 + 1 次過濾決策 + 4 次讀檔，好幾個 tool call 只為一個簡單問題。結論：沒有索引，命名與結構在做真正的工作——auth 邏輯在 auth.ts 就一次 grep 命中；在 utils2.ts 裡叫 handleThing 就得多搜、多開、多猜、多燒 context。你不只為人寫程式，也為一個每開新 session 都從零、像第一天上班的新人寫程式。
- `#L1-L271` — `4. Context Windows and Why They Fill.srt` — 所有搜尋、過濾、讀取都進同一個容器：context window，有硬上限，整個 session 的東西都住在裡面；有些工具支援到 100 萬 tokens，但仍比預期快滿。重建 auth 範例：問題本身很小，但每個 match、每個路徑、每段周邊文字都佔真 token；開檔是整檔載入，含所有 import、註解、上下不相關的程式；還開了一個後來無關的第二檔，猜錯不會退費；真正要的答案只是最後一小段。所以填滿窗口的多數不是有用部分，而是「找到有用部分的成本」。放大到真實 session（30–40 次往返建一個功能），每輪重複 search → open → 有時猜錯 → 抽取答案，即使巨大窗口也會滿——不是專案太大，是探索本質上就貴。好結構＝少猜錯、少浪費、留更多空間給真正的工作；窗口真的滿了 agent 不會停，而是開始行為不同。
- `#L1-L36` — `5. Context Rot： Quality Slips Before The Window Fills (9_11_2026 1：26：48 PM).txt` — context rot 有名字也有量測：2025 年 Chroma 系統性測試 18 個前沿模型，每一個都同一模式——token 越多、輸出品質越差，不是部分而是全部。也不是快滿才發生：宣稱 200k 窗口的模型在 50k（四分之一）就有可測退化；盒子上的數字是技術上限，不是品質開始下滑的點，退化是連續的、不是斷崖。兩種獨立效應：positional degradation——U 型，開頭與結尾用得好，埋在中間差 20–30 分，這解釋「二十輪前講過的決定像消失了」（不是不見，是落在模型最不擅長取用的位置）；length degradation——即使資訊放在最好位置，周邊越長準確率仍掉，受控實驗從 92% 掉到 68%，另有研究顯示改寫而非逐字重述的事實在約 32k tokens 時，多數模型掉到短 context 準確率的一半以下。所以不只「別埋在中間」，也別假設空間越大越可靠。
- `#L1-L26` — `6. Topic Switching： When Unrelated Work Pulls Focus (9_11_2026 1：27：19 PM).txt` — 第二個問題與「多滿」無關，是「什麼在競爭注意力」：半空的窗口也能把模型帶偏。實驗：每個主題各自乾淨 context 時答對 100%，把八個無關主題折進同一段持續長大的對話後掉到約 75%；模型沒變，變的只是無關材料的比例。這現象叫 contextual distraction（2025），即使先前材料與主題相關、不是隨機雜訊，也會把注意力從當前問題拉走。實務結論：一個 session 漂過 bug fix → 設計討論 → 無關功能 → 再回 bug，比拆成數個短而聚焦的 session 更差。三種日常症狀：重複（已否決的方案再提，因為否決被後續內容淹沒）、遺忘（早先已定的決定又被問一次，資訊還在但被埋住且被競爭掉）、矛盾（同一問題在長 session 不同時間點得到不同答案）。不是模型在第 80 則訊息變差，是「競爭注意力的量 vs. 與當前決策相關的量」比例變了。
- `#L1-L279` — `7. Clearing vs. Compacting.srt` — 重置不是一個動作而是兩個，選錯代價比想像高。Clearing：整個窗口清空，空對話、什麼都不帶，下一個 prompt 從零開始。Compacting：把當前對話摘要成濃縮版留在窗口，不是空的，但更小且被重塑。兩者解同一個問題（窗口塞太多），方式差很多。Compacting 紙上更好（何必丟掉，縮小就好），但陷阱是摘要由模型產生、你在它變成新 context 前無法審閱；重要東西被壓掉或被微妙改寫到意思變了，你不一定會發現——因為被丟掉的東西按定義已不在眼前可查。Clearing 沒有這個風險，之後窗口裡有什麼你完全知道：什麼都沒有，直到你自己再放。用 clear：真正新且無關的任務、session 已漂移出現重複／遺忘／矛盾、或你寧可重講那兩三個關鍵事實也不想信任摘要。用 compact：深陷一個長而連續的任務、停下來重講全部比有損摘要更花時間、對話歷史本身對後續有價值（例如長時間來回討論設計決策）、失去討論的形狀比略不完美的摘要更痛。底層原則：下一步越依賴早先的精確細節就越該 clear，越依賴大方向與動能就越該 compact。
- `#L1-L130` — `8. Tokens What Costs What.srt` — 一切讀、寫、推理都以 token 計，token 只是小塊文字，大約每個幾個字元；不必精算，只要知道哪些活動燒得凶、哪些幾乎不佔。最重要的一句：讀很貴，推理很便宜——這句解釋 context 預算幾乎所有去向。
- `#L131-L260` — `8. Tokens What Costs What.srt` — 貴的四類：讀檔是最大宗，每個檔整檔載入，300 行的檔就是約 300 行的 token，不管它只需要其中 10 行；搜尋結果，每個 grep match、glob 路徑、周邊 context、行號全進窗口，大 codebase 的廣泛搜尋可回幾十筆，無關的也照付；長對話歷史，每次往返都留到被 clear 或 compact，60 則往返的 session 背著全部 60 則的成本、不只最近幾則；冗長輸出，長篇解釋或大塊生成程式碼是在回應本身花 token，不只花在讀了什麼。
- `#L261-L390` — `8. Tokens What Costs What.srt` — 便宜的：短而聚焦的迴圈內推理（依窗口既有資訊決定下一步，例如「下一個該開哪個檔」「這符合我要找的嗎」），相對餵給它的閱讀幾乎不花錢——決定很便宜，蒐集做決定的資訊不是。範圍限定：這只指 tool call 之間例行的快速判斷，不是所有推理都免費；開 extended thinking 解難 bug 或複雜設計取捨會花真 token，但同時很有價值。另外便宜的是精準問題（「validateSession 在做什麼」遠比「解釋這個專案的認證怎麼運作」便宜，因為模糊版強迫更大範圍搜尋與開更多檔）與小範圍讀取（開 20 行的 utility 遠比開 400 行檔去挖同一個函式便宜）。
- `#L391-L524` — `8. Tokens What Costs What.srt` — 回到前面：命名與結構的價值現在能用 token 算——壞命名＝更多搜尋、更多猜、更多開檔，每一步都貴且原本不必要，所以基本工程習慣在今天更重要。也讓 clear vs. compact 有更利的判準：若 session 已把大量 token 燒在與後續無關的廣泛探索上，清掉幾乎不花成本（重述幾個事實），還省下背著死重前進。實務只要一個習慣：交付任務前問「這會逼它廣泛閱讀還是精準閱讀」——「重構付款模組」是廣泛的，「改 payments 檔裡的 calculateTax 讓它處理新稅率」是精準的，後者不只清楚，還幾乎跳過所有昂貴探索。可用 Claude Code 的 /context 指令看當前 session 的即時 token 分解與剩餘空間。收尾：迴圈、可見範圍、搜尋、窗口為何滿、退化、重置、成本都已具備，下一課要讀一個走偏的真實 session 並找出它從哪裡開始出錯。
