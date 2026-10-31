---
source: sources/agentic-engineer/20261030/2. Agentic Mindset
source_type: text
source_lines: 1054
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- **Why AI Coding Falls Apart** — 前 30 分鐘好用、兩小時後崩壞不是錯覺，而是兩個結構性成因：模型只讀得到公開程式碼，所以給你「平均寫法」而不是你的專案版本；而且它會朝著你「說出口」的目標規劃，把你沒說的部分全用預設值填掉。兩者疊起來就是大 prompt → 大輸出 → 驗不了 → 更大的 prompt 的迴圈。處方不是更長的 prompt，而是工作流，以及一個日常診斷問題：是它沒有 context，還是它替你做了那些該由你做的決定。
- **Direct the AI, Don't Rely on Hope** — 兩個成因都源自錯誤的心智模型：把 agent 當精靈，許願、不靈就改寫更長的願望。正解是「你是架構師，agent 是引擎」：引擎快、不知疲倦，但沒有判斷力；判斷力本來就是你的工作。同一個任務，一句「做購物車」換來 300 行無法審閱的 diff，說清楚範圍與完成定義則換來 40 行兩分鐘讀完的 diff——因為 agent 是指數放大器，放大的是你給的方向。會希望的人可被取代，能把模糊問題轉成清楚方向的人更值錢。
- **Skit: How to Outsmart a Genie** — 純影片、無逐字稿（來源檔只有一條 YouTube 連結）。課堂用它當「跟精靈鑽漏洞 vs. 直接許願」的比喻素材，沒有可引用的文字內容，因此不列 L2。
- **Vibe Coding vs. Agentic Engineering** — 同一個 Stripe checkout 任務、同一個模型，開發者 A 八分鐘交出 240 行、看不懂就 push，兩小時後 production webhook 因少接 raw body parser 而爆；開發者 B 先盤點專案現況、把 SDK 版本／路由慣例／webhook 需求寫進 AGENTS.md、把任務縮到單一 payment intent endpoint，讀 60 行、抓到少一個 auth guard、測過才 commit。差別不是技術也不是模型，是誰在主導。打字曾是瓶頸時兩人看不出差別，AI 拆掉瓶頸後差距立刻現形——AI 沒有製造差距，只是把它暴露出來。Vibe coding 不是新手錯誤，是沒有系統時的預設值。

# L2 detail

- `#L1-L80` — `1. Why AI Coding Falls Apart.srt` — 開場的情境重演：新專案丟一句 prompt，AI 自動 scaffold auth、設好路由，前 30 分鐘覺得「這改變一切」。接著裂縫出現——重複寫已經存在的函式、貼錯誤回去修 A 壞 B、只要求改一處卻重寫三個檔、context 變長後回應變慢變不準；兩小時後已經分不清它在幫忙還是在產出自信滿滿但沒力氣檢查的程式碼，只好開新對話重新解釋一遍。
- `#L81-L198` — `1. Why AI Coding Falls Apart.srt` — 根因一：模型給你平均，不是你的版本。它是在大量公開程式碼上預測下一個 token，所以產出的是「這件事最常見的寫法」——一般正確，但預設就是通用；而你的 API client、慣例、上週做的決定從不在它的訓練資料裡，也不在它眼前，除非你放進去。於是請它呼叫你的 API，它寫出 plain fetch 加自己的錯誤處理，不是無視你的 client，是根本不知道它存在。比喻：你以為在跟熟悉 codebase 的資深工程師合作，其實是跟一個剛進門、對專案的全部認識都來自這段對話的萬能約聘。
- `#L199-L318` — `1. Why AI Coding Falls Apart.srt` — 根因二：它朝著你「說的」規劃，不是朝著你「想的」。現代 agent 其實會規劃——讀檔、擬方案、跑測試、失敗自我修正，這個迴圈真的有效；問題是規劃的目標本身。它會把你沒說的全部填成最可能的預設值：一句「做購物車功能」，它默默做了十個你看不到的決定（state 形狀、API 介面、錯誤處理），不問、直接選。因為程式跑得起來、它自己寫的測試也過，所以看不出問題，直到這些決定累積成 300 行、動到你沒想到的檔案的 diff——無法審、無法乾淨地測、壞了也找不到，因為所有東西同時改變。它沒有「沒規劃」，只是朝著規格不足的目標規劃，並用它的猜測補滿，而不是你的決定。
- `#L319-L383` — `1. Why AI Coding Falls Apart.srt` — 兩個成因合起來就是多數開發者卡住的迴圈：大 prompt → 大輸出 → 無法驗證 → 出錯 → 更大的 prompt 去修 → 更無法驗證，變成混亂。直覺永遠一樣：繼續 prompt，加更多細節、換模型、開新對話；但更長更嚴格的訊息沒辦法讓模型認識一個它從未讀過的 codebase，也不可能用蠻力把模糊目標變具體。這是拿一句話去解工程問題。問題從不在 prompt，而在系統——或說缺乏系統，這門課補的就是這個：不是技巧或 prompt hack，而是真的工作流，會刻意為 agent 鋪 context、先規劃再動手、讓你保持控制而不是只能祈禱。
- `#L384-L438` — `1. Why AI Coding Falls Apart.srt` — 全課可重複使用的診斷：東西出錯時只問一個問題——「agent 是沒有 context，還是它替你做了那些本該由你做的決定？」幾乎每次都是這兩者之一。結尾預告下一課要談讓這一切成立的思維轉換，因為技術只有在心態先轉過來之後才落得了地。
- `#L1-L76` — `2. Direct the AI Dont Rely on Hope.srt` — 把上一課兩個成因追到更深一層：對「你在跟什麼東西合作」的心智模型錯了。多數人把 agent 當精靈——寫一個願望（prompt）、希望回來的東西接近你心裡想的；不像就重寫願望，再不像就寫更長的願望，這個迴圈不會斷，直到你換掉那個模型。講者也預告會連結下一支「跟精靈鑽漏洞」的影片，說那種嘗試跟 prompt 的處境很像。
- `#L77-L176` — `2. Direct the AI Dont Rely on Hope.srt` — 正確的心智模型：你是架構師，agent 是引擎。你不再當「期待好輸出的人」，而是決定什麼算好輸出的人——設下限制條件、做真正的決定、必要時說「不要這樣，要那樣」，並且理解每一個被做出的選擇。引擎很快、不知疲倦，一小時產出的程式碼比你一天打得還多，但它沒有判斷力；判斷力是你的工作，而且一直都是。最好的資深工程師帶 junior 也不是幫他寫每一行，也不是丟一句「去做整個 app」就走，而是給 context、定方向、審回來的东西、在事情要出錯前先攔下來——你跟 agent 就是這個關係，只是你的 junior 每分鐘打一千字、永不疲倦。
- `#L177-L266` — `2. Direct the AI Dont Rely on Hope.srt` — 用數字對照「沒主導」與「有主導」：一句「做購物車功能」，agent 會做 20 個無聲決定，交給你 300 行無法審的 diff；同一個任務若有主導，是你先定義購物車是什麼、會動到什麼、完成的定義長什麼樣，還有什麼不做，然後 agent 只拿到一件有真實限制的差事，交出 40 行兩分鐘讀得完的 diff——同一個 agent、同一個模型，變的是迴圈裡的人做了什麼。也可以把 agent 看成乘數：它放大你給的方向，模糊的方向被放大成災難，清楚的方向被放大成可用的軟體。所以害怕被取代的開發者想反了：只會「希望」的人可被取代，因為誰都能打一句模糊的願望；能把模糊問題轉成引擎可執行的清楚方向的人，價值反而更高。
- `#L267-L315` — `2. Direct the AI Dont Rely on Hope.srt` — 行動指令：接下來整門課，每次發現自己又滑回「希望」就抓住自己——在送出模糊 prompt 並交叉手指之前停下來，問「資深工程師會怎麼做」，因為你是工程總監，所以去主導（direct）。最後預告下一課用同一個任務比較兩位開發者：一個 vibe coding，一個 agentic engineering，把差距攤開來看。
- `#L1-L80` — `4. Vibe Coding vs. Agentic Engineering.srt` — 開發者 A 的對照組：開新對話打「幫我做一個 Stripe checkout 功能」，agent 立刻 scaffold payment intent、建 API route、加 webhook handler，連套件都裝好；八分鐘後得到三個新檔、240 行、看起來能跑。他其實讀不懂那份 diff，但看起來對，就 push 了。兩小時後 production 的 webhook 拋出從沒見過的簽章驗證錯誤——agent 加了 handler，卻沒有接上 Stripe 要求的 raw body parser。這是它默默做錯的決定，而 A 沒有任何機會攔到，因為他從沒真的審過被建出來的東西；現在他得在一個完全沒有原始 context 的新 session 裡，除錯自己沒寫過的程式。
- `#L81-L176` — `4. Vibe Coding vs. Agentic Engineering.srt` — 開發者 B：同一個任務，但在寫第一句 prompt 之前先做一件不太一樣的事——盤點專案已經有什麼（auth middleware、既有的 API 慣例、環境變數裡已經有的 Stripe key），把真正重要的 context 更新進 AGENTS.md（SDK 版本、這個專案的路由樣式、webhook 需要 raw body parsing）。然後切範圍：不是「checkout 功能」（那是很多件事），而是先做 payment intent endpoint，就這一件。agent 拿到一件有完整 context 的差事，產出 60 行；他讀了，發現 route 少了 auth guard（專案要求每個受保護 endpoint 都要有），發訊息立刻修好、測試、commit，再切下一步：webhook handler。同樣一件差事、完整 context、可完整審閱的輸出。
- `#L177-L236` — `4. Vibe Coding vs. Agentic Engineering.srt` — 診斷這場對照：同一個 AI、同一個任務，A 出貨更快但弄壞 production，B 乾淨出貨。差別不是技術，甚至不是模型，而是誰在控制——A 在反應、希望 agent 自己搞定；B 在主導，給 agent 剛好需要的東西去把一件事做好。也解釋這個差距為什麼此刻感覺很突然：當打字是瓶頸時，這兩種人看起來差不多，都受限於打得多快；AI 一夜之間拆掉那個瓶頸，於是「理解自己在做什麼」與「憑感覺硬上」之間的落差瞬間可見。AI 沒有製造這個差距，它只是把它暴露出來——A 與 B 一直都存在，只是現在幾小時內就能分辨。
- `#L237-L301` — `4. Vibe Coding vs. Agentic Engineering.srt` — 這個差距會複利：一次 session 沒有方向地跑越久，偏離越遠；產出越多，越不可審；越不可審，越容易在 production 壞掉。所以 vibe coding 不是新手的錯誤，而是預設值——沒有系統時阻力最小的那條路。這門課就是那個系統。收尾預告下一個模組要打開引擎蓋：agent 實際怎麼運作、它看到什麼、怎麼讀你的 codebase、以及為什麼 context 比你想的更快被填滿；理解機器之後，蓋在它上面的一切才會說得通。
