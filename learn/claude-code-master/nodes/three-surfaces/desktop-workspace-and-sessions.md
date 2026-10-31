# 選一個 workspace，按 Trust Workspace，然後開 split view

desktop app 打開後，就是一個聊天視窗，外觀看起來和 ChatGPT、Gemini 或 claude.ai 的對話視窗很像。真正的差別在左上角：那裡有三個分頁。不過，不管你之後要跑幾個 session，第一步都一樣——先指定一個資料夾。

這篇只談 desktop app：如何指定 workspace、按下 Trust Workspace 代表授權了什麼，以及如何用 split view 同時執行多個 session。模型和 harness 在其他介面中也一樣，差別只在介面。

## 左上角的三個分頁：Chat、Claude Work、Claude Code

第一個分頁是 Chat，主要用來解釋事情，也是三個分頁中能力最弱的。作者說他很少使用，因為 Claude Work 和 Claude Code 幾乎什麼都能做。

第二個是 Claude Work，很多教學中都會提到。作者認為，它是 Claude Code 的精簡版：在 Claude Work 裡能做的事，用 Claude Code 也都做得到。

<!--image:1-->

第三個是 Claude Code，也是三個分頁中功能最完整的。它的名字裡有「Code」，是因為它最初是為軟體開發而設計；但它能自動化的工作遠不只寫程式，因此現在的用途早已不限於軟體開發。

如果你想要最簡單、最不讓人有壓力的體驗，從 desktop app 開始完全沒問題。代價是，它也是三種介面中功能最有限的一種，後面會逐漸遇到限制。

## workspace 就是筆電上的一個資料夾

開始使用時，第一件事是選擇 workspace。所謂 workspace，就是筆電上的一個資料夾，沒有更複雜的意思。

操作方式是點左上角的資料夾圖示，再選擇 open a folder。你可以選裝置上的任何資料夾；示範中使用的是一個名為 My Workspace 的空資料夾。選好後，左側就會列出你開啟過的 workspace，以及各自對應的 session。

選資料夾看起來只是個簡單步驟，卻也界定了後續自動化的範圍：Claude Code 能接觸到的檔案，就是這個資料夾裡的檔案。

## 按下 Trust Workspace，授予的是「寫入」權限

選好資料夾後，畫面會出現 Trust Workspace。按下去，就代表允許 Claude Code 檢視這個資料夾，並在裡面建立或寫入檔案。

<!--image:2-->

示範中用了一個最簡單的例子來測試：要求 Claude Code 在 workspace 裡建立一個 Hello World 文字檔。它便會直接在你的裝置上建立檔案。

這項權限之後會變得很重要，因為開始自動化後，你做的就不會只有建立一個文字檔。你可能會在多個 session 中大量建立簡報、影片和圖片；等流程調校得夠好，這個資料夾就會逐漸變成你的 operating system 或 second brain——一個可以直接提問、查找資料的地方。

示範中的 Robo 資料夾就是這樣逐漸累積出來的：裡面有圖片、影片和多個 markdown 檔案，總容量約 8 GB，全都是 Claude Code 建立的。作者甚至不記得裡面有哪些檔案，因為現在的模型幾乎能瞬間掃過整份檔案清單，即使有幾千個檔案也一樣。

所以，選資料夾不只是行政流程，它決定了 agent 能接觸到哪些內容。

## 一個 workspace 可以有很多個 session

同一個 workspace 可以開啟多個 session。左側的 filter 可以切換目前檢視的專案；點選 plus，就能開啟新的 session，並在左側清單中看到它。

這裡要分清楚兩個層次：資料夾界定工作範圍，session 則是這個範圍內的一段對話。同一份檔案可以由多個 session 讀取或修改，而每個 session 都有自己的上下文。

<!--image:3-->

## split view：讓 agent 同時在旁邊執行

真正的差別就在這裡。Claude Code 是 agent。當你請它做 deep research 時，它會先問幾個問題，確認你想要的成果，再自行執行幾分鐘，最後才交出結果。這段時間，你只能等著。

因此，你可以再開一個 session 處理其他事情。先在左側選取一個 session，點選 ellipsis，再選 open in split view，就能讓它在旁邊同時執行。最多可以重複這個操作四次，也就是最多同時在畫面上看到四個 session。

<!--image:4-->

示範中，作者把 session 一個個開到 split view，再分別交付任務。這就是 power user 同時使用多個 agent 的方式：不坐著等，而是把工作分派給四個正在執行的 agent，哪個先完成，就先查看哪個的結果。

這也是他認為 split view 能讓產出提升十倍的原因——你不再受限於單一任務的等待時間。

## 但這也是他不把 desktop app 當作每日主力的原因

split view 很好用，但版面配置的彈性有限。你可以調整各個 pane 的寬度，卻不能把 tab 拖出來，也不能重新排序。想依照自己的習慣整理版面，並不容易。

因此，他日常主要使用 VS Code extension：在那裡開啟的 session 會出現在新視窗中，可以拖到左側、依照自己的習慣排列，也能同時對照同一個 workspace 的檔案樹。

desktop app 的優點很明確：介面最不嚇人，也能把多個 session 放在同一個畫面裡。缺點也同樣明確：畫面配置不由你決定。

## 順手看看另外兩個區塊：Routines 和 Customize

desktop app 還有一個優點：routine（排程任務）在這裡很容易找到。切換到 Routines 分頁，就能查看各種可設定的 routine，也可以暫停、恢復，或用日曆檢視。不過，routine 一多，用介面管理反而會變得更麻煩。

另一個區塊是 Customize。這裡列出 Claude Code 可以使用的所有 skill，也能手動新增；connector（也就是 MCP connector）也能在這裡查看。

但作者自己不會透過這個介面新增 skill。Claude Code 就像住在你電腦裡的數位員工，skill 通常可以直接用自然語言請它建立或修改。等 skill 累積到八、九十個時，單看清單也沒什麼幫助；要修改哪個 skill，直接請它去改對應的檔案會更快。

## 先把這一層用順

desktop app 是三種介面中最不嚇人、功能也最有限的一種。它的價值不在於功能最多，而在於能讓你完整走過「資料夾 → 權限 → session」這個流程：選一個資料夾、按下 Trust Workspace、開啟幾個 session，再用 split view 讓它們同時執行。

熟悉這個流程後，desktop app 還有兩個值得一看的區塊：Routines 和 Customize。它們分別管理「會自動執行的工作」和「agent 可以使用的能力」，也是這個介面最早開始顯得不夠用的地方。

之後換到 VS Code extension，你會發現資料夾、模型和 harness 都沒有變，差別只是終於可以自行安排版面。
