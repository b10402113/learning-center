# Agent 的內建迴圈：Read → Decide → Act → Observe

不管你用的是哪一套 coding agent，它跑的都是同一個迴圈：讀取、決定、行動、觀察，然後重複，直到任務結束。五分鐘的小任務可能跑八圈，複雜功能可能跑八十圈。整台機器的神祕感，就濃縮在這四個字裡面。

[[sources/agentic-engineer/20261014/3. How Coding Agents Work/1. The Agent Loop.srt#the-agent-loop]]

## 四個階段各在做什麼

**Read（讀取）**：agent 先找資料。它不知道按鈕在哪個檔案，所以第一件事是搜尋，grep 關鍵字、打開找到的元件、繼續讀到有足夠線索為止。讀的對象是「它被允許看到的東西」，不是整個宇宙。

**Decide（決定）**：讀到東西之後，它才有辦法判斷。看見按鈕元件、看見 on-click handler，於是決定「去查這個 handler 實際呼叫了什麼」。決定永遠建立在它剛剛讀到的內容上——這是後面所有問題的根源。

**Act（行動）**：不是描述，是真的動手。打開檔案、改程式、跑 bash 做 type check、build 專案看有沒有弄壞別的東西。這一步會真的改變磁碟上的狀態。

**Observe（觀察）**：看動作的結果回來什麼。編譯過了嗎？測試紅了嗎？執行輸出說了什麼？觀察的結果會餵進下一圈，成為下一次 Read 的起點。

## 真實案例：一個什麼都不做的登入按鈕

示範用的是一個小型的任務管理 app，有登入頁、受保護的 dashboard、任務的新增／完成／刪除，session 用 cookie 帶過。整個 app 小到可以在一次坐下的時間讀完，但又真實到不像玩具。

[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/overview.md]]

Bug 的設定刻意做得很安靜：輸入 email 和密碼、按下登入，什麼都沒發生。沒有錯誤訊息、沒有 console error、沒有跳轉。這一點很重要，因為會噴錯的 bug 沒什麼好診斷的，agent 讀 stack trace 就結束了。要讓 agent 真的去探索、假設、驗證，就得給它一個沒有任何錯誤訊息指路的 bug。

機制是這樣：auth 邏輯裡有一個 handler registry，本質上就是一個把字串 key 對到函式的物件，用 optional chaining 去查。某次 refactor 把函式改名了，但某處還留著舊名字的引用。查不到 key 就回傳 `undefined`，optional chaining 讓「呼叫一個 undefined」變成什麼都不做，於是錯誤被完全吞掉。這不是刻意設計的陷阱，command registry、action map、快捷鍵處理器都是真實世界裡的同款寫法。

還有一個硬條件：這個 bug 不能被 TypeScript 在 build 時抓到。把 registry 型別標成 `Record<string, YourFunctionType>`，用不存在的字串 key 去索引依然合法，因為 compiler 不可能知道執行時某個字串到底存不存在。寫完 bug 之後跑一次完整 build，必須零錯誤，否則就代表 bug 放錯地方了，得搬到 TypeScript 靜態驗證不到的位置。

## 把迴圈拆開來看

使用者的 prompt 只有一句：「這個 app 的登入按鈕按了好像沒反應，可以幫我查一下為什麼嗎？」按 enter 之後，迴圈開始跑。

**第一圈**

- **Read**：agent 不知道按鈕在哪，所以先 grep login，打開找到的元件，再讀相關檔案，直到找到按鈕所在的元件。
- **Decide**：有了材料才能決策。它看見按鈕元件、看見 on-click handler，於是決定「查這個 handler 到底呼叫了什麼」。
- **Act**：打開檔案、跑 type check、嘗試 build，確認自己有沒有弄壞東西。
- **Observe**：結果回來了。handler 呼叫的函式已經不存在——refactor 時改了名，引用沒跟著更新。

這一圈結束，agent 對 bug 已經有具體假設了。它沒有停在這裡，而是又跑了一圈。

**第二圈**

- **Read**：查那個函式被搬到哪裡去了。
- **Decide**：確認找到的是正確的那一個。
- **Act**：提出修正，問你「要不要套用」。
- **Observe**：等你 approve 或 reject。

修正套用之後再登入一次，這次按鈕呼叫到正確的函式，畫面回覆「你這個新使用者在這平台上還沒有帳號」。這是預期行為，bug 結束。

值得注意的是，這個案例裡 agent 花了不只一圈才定位問題，中間還有來回確認的步驟。它不是在猜，而是在用每一圈的觀察結果縮小範圍。

## 壞讀取如何複利

這是整堂課最該記住的一段。

每一圈都是一次「做對的機會」，也是一次「做錯的機會」。而四個階段是有依賴關係的：

- 讀到的東西不完整，**Decide 就建立在一個洞上**。
- 基於壞決定去 **Act**，動作本身就偏了。
- **Observe** 只會確認這個錯誤，然後把它餵進下一圈。

錯誤不會被關在某一圈裡，它會一圈一圈複利，因為每一圈都踩在上一圈的結果上。這也是為什麼一個 session 可能前幾圈看起來很正常，然後慢慢飄走。不是模型突然變笨，而是三圈前的一個壞讀取或壞決定，還在塑造後面每一圈。

所以「架構與指揮」的具體含義是：你沒辦法看見它跑的每一圈，但你可以控制三件事——

1. **它能讀什麼**：檔案範圍、專案結構、命名清不清楚。命名清楚，搜尋就快又準；命名晦澀，agent 就在無關檔案裡打轉。
2. **你幫它把決定講得多清楚**：prompt 的資訊量、限制條件、你已經知道的線索。
3. **你多仔細檢查它觀察到什麼、回報什麼**：不是看它自信不自信，是看它的結論有沒有對應到實際輸出。

目標是貼著這個迴圈夠近，近到它開始飄的時候，你在第三圈就抓到，而不是第三十圈。

## 重點整理

- 所有 coding agent 都是 Read → Decide → Act → Observe 的迴圈，重複到任務完成。
- Act 是真的動手（改檔、跑指令），不是描述；Observe 的結果會成為下一圈的輸入。
- 沒有錯誤訊息的 bug 才逼得出真正的探索：搜尋、假設、驗證。
- 壞讀取 → 壞決定 → 壞行動 → 觀察確認錯誤 → 餵進下一圈，錯誤會複利。
- 你能控制的是讀取範圍、決定的清晰度、以及對觀察結果的檢查密度。

## Sources

- [[sources/agentic-engineer/20261014/3. How Coding Agents Work/1. The Agent Loop.srt#the-agent-loop]]
- [[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/overview.md]]
