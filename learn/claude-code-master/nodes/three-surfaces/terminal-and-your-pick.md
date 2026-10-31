# 最嚇人，但功能最多

前面幾篇已經分別介紹過 desktop app、它的 Routines 和 Customize，以及 VS Code extension。現在，你大概也在兩三個地方用過 Claude Code：桌面上的 app、VS Code 旁邊的面板，還有黑底的終端機視窗。三種介面都能用，於是你開始想：每天到底該開哪一個？這篇不比較誰比較強，而是把三種介面的差異攤開，讓你自己挑一個當日常主力。

## 三個介面，同一組模型

先講一件能讓你鬆一口氣的事：不管你用哪一種介面，底下都是同一組模型和同一套 harness。模型分成 Opus、Sonnet、Haiku 三層，能力由強到弱；harness 指的是 Anthropic 包在模型外面的那組程式碼與 system prompt，Claude Code 的能力就是靠它們建立起來的。所以，三者的差別不在於「誰比較聰明」，而在於介面，以及進階介面多出的功能。

<!--image:1-->

三種介面分別是 Claude desktop app、IDE（integrated development environment，整合開發環境）中的 Claude Code extension，以及 terminal。三者的安裝入口都在同一個下載頁，往下找到 Claude Code，就能分別安裝桌面版、VS Code 版和終端機版。

## Desktop app：最不嚇人，但不是日常主力

桌面 app 長得像你熟悉的 ChatGPT 或 Claude 網頁版聊天視窗，最好上手，也最不嚇人。

它其實分成三層：chat 只負責解釋事情，能力最弱；Claude Work 算是 Claude Code 的精簡版；最強的是 Claude Code。課程作者提醒，Work 做得到的事，Code 幾乎都做得到。想練習使用 agentic 工具、想站在技術最前線，就直接從 Code 開始。名字裡雖然有 code，但那只是因為它最初是為軟體開發而設計；如今它能自動化的工作早已不只寫程式。

桌面 app 有不少實用功能：可以同時開啟多個資料夾（workspace），在左側列出所有 session，也能用 split view 把最多四個 session 並排顯示。routines（排程任務）有專屬的 tab，可以暫停、恢復，也能透過日曆查看；Customize 頁面則能一覽所有 skill 與 MCP connector。

不過，作者不把它當日常主力，理由很具體：session 面板只能調整寬度，不能拖出來，也不能重新排序。routine 一多，用圖形介面管理反而更困難。skill 清單也是如此：作者已經有八十幾個 skill，等數量接近九十個，清單就不太有參考價值了。要修改某個 skill，直接請 Claude Code 去讀、去改，比自己在介面上點選快得多。

## VS Code extension：多數人的日常選擇

如果想開始使用，作者建議先從 IDE 入門，而不是桌面 app。IDE 是一種能讓你同時查看所有檔案、並在同一套軟體裡完成各種工作的環境。他推薦免費、開源的 VS Code；只要在擴充市集搜尋 Claude Code for VS Code 就能安裝。

它和桌面 app 最大的差別，在於檔案的可見度。工作區的資料夾會直接列在左側，而且和終端機裡看到的是同一批資料夾。請它開啟檔案時，檔案會直接在 VS Code 編輯器裡打開，文字檔和圖片都可以；PDF 也能透過外掛預覽。作者的 Robo 工作區累積了約 8 GB、上千個檔案，他自己也記不清有哪些，但模型幾乎瞬間就能掃過整份檔案清單。

第二個差別是平行 session。每開一個新 session，就會多一個視窗，可以拖到左邊或右邊，自由安排位置。作者常在同一個視窗裡同時執行好幾個 session，讓工作效率提高好幾倍。雙擊一下，幾個視窗的寬度就會自動均分。如果有第二個螢幕，也可以讓 agent 在另一邊執行，完成後再過去檢查。

它只有一個缺點：沒有「所有 skill 一覽」的介面，只能打 `/` 查看 slash command 清單；MCP server 的清單也能在這裡查看。要整理 skill，就交給 Claude Code 自己處理。

## Terminal：最嚇人，功能最多

terminal 是三種介面裡最嚇人的，尤其是對不熟悉開發的人來說，可能根本沒用過。

使用時，只要在終端機 app 輸入 `claude`，它就會詢問你是否信任這個資料夾。確認信任後，它才會取得讀寫權限。麻煩也在這裡：它預設會從你目前所在的位置開始。想切換到某個 workspace，就得先會幾個終端機指令。這也是作者很少直接開終端機的原因：他通常會在 VS Code 裡開終端機面板，因為那裡已經位於 workspace 中。

terminal 的輸出比另外兩種介面詳細得多，會把每一步做了什麼都印出來。它原本就是為開發者設計的第一種介面，後來的介面也以它為原型。

代價是檔案可見度較低。請它開啟檔案時，檔案會交由系統的預設程式開啟，可能因此跳出另一個 app。作者覺得多開一個視窗很麻煩，寧可直接在 VS Code 裡查看。不過，新功能通常會先在這裡推出：早期的 Ultra Code 就是先在 terminal 上線，`/insights`這類指令到現在也仍然只有 terminal 能用，在 extension 或桌面 app 上就沒那麼方便。

<!--image:2-->

一句話總結：最嚇人，功能最多。

## 怎麼選：三個判準

選哪一種介面，可以先想三個問題。

看不看得到檔案：桌面 app 的聊天視窗看不到檔案；VS Code 看得到，還能預覽；terminal 則看不到，開啟檔案時還得跳到別的程式。

<!--image:3-->

能不能同時跑多個 session：三種介面都可以，但安排方式差很多。桌面 app 最多能並排四個 session，只能調整寬度；VS Code 可以自由拖曳、排列，實際用起來方便得多；terminal 則得自己想辦法。

新功能多久能用到：terminal 最快，VS Code 次之，桌面 app 最慢。

作者的建議是：多數人日常使用 VS Code extension，把桌面 app 當作最不嚇人的入門選擇，terminal 則留給想試用新功能、追上最新進展的時候。他還補充，使用 VS Code 十到三十分鐘後，大多就會習慣。

最後再提醒一次：三種介面背後的模型和 harness 都一樣，差別只在介面，以及進階介面多出的功能。
