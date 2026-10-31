# 一開始，建議你用 IDE

你把 Claude Code 安裝好之後，第一個冒出來的問題通常不是「它會不會做」，而是「我要在哪裡用它」。Desktop app 打開後就是一個聊天視窗，跟 ChatGPT 或 claude.ai 沒什麼兩樣；但真的開始每天用它做事，你就會遇到一些很具體的問題：它剛剛寫的檔案在哪裡、看起來是什麼樣子？我想同時交代兩件事，卻只有一個視窗可以用。

這一段要介紹的是我自己的 daily driver：VS Code 的 Claude Code extension。它的價值不在於功能比別人多，而在於你工作的內容一直都在你看得到的地方。

## 先講清楚：三個介面底下是同一套東西

不管你選哪一個介面，底下用的都是同一組模型——Opus、Sonnet、Haiku，也就是 Anthropic 由強到弱的三個層級——以及同一個 harness，也就是 Anthropic 包在模型外層的程式碼和 system prompt。差別只在介面，以及進階介面多出來的那些功能。

所以，你不是在選哪一個比較聰明，而是在選自己每天要在哪裡工作。

## IDE 的意思是「在同一個地方完成所有事」

IDE 是 integrated development environment，也就是整合開發環境。這個名稱很直白：它是一個讓你進行開發工作的軟體環境。之所以叫 integrated，是因為你看得到所有檔案，也可以在同一個軟體裡完成工作。

<!--image:1-->

我推薦的 IDE 是 Visual Studio Code。它是開源軟體，問世多年，而且可以免費下載。

要在 VS Code 裡使用 Claude Code，只要在 extensions 裡搜尋「Claude Code for VS Code」，然後安裝即可。VS Code 也讓你自行調整介面：更換主題、移動面板，都可以照自己的習慣設定。

## workspace 就是一個資料夾

我第一次真正搞懂這件事，是發現 workspace 其實就是筆電上的一個資料夾。

如果你之前在 Desktop app 裡已經有一個 workspace，現在想搬到 IDE，做法就是開一個新視窗，再打開同一個資料夾。開新視窗、選擇資料夾，VS Code 就會開始在那個資料夾裡運作。它會詢問你是否信任這個資料夾的作者。選擇信任之後，Claude Code 才能讀取資料夾、在裡面編輯檔案或建立新檔案。

我自己的 Robo workspace 現在大約有 8 GB，裡面的圖片、影片和 Markdown 檔案都是 Claude Code 產生的。老實說，我根本記不得裡面有哪些檔案，因為現在的模型幾乎能瞬間掃過整份檔案清單。這個資料夾用久了，就成了我的 operating system，或是有人說的 second brain。

順帶一提，有個地方很容易讓人誤會：VS Code 自己也內建了一個 chat 視窗，那是 VS Code 讓自己更具 agent 能力的一種嘗試。你不需要用它，因為你用的是 Claude Code。

## 它可以直接在編輯器裡打開檔案

這是我最喜歡 VS Code 的一點，也是 Desktop app 做不到的事。

<!--image:2-->

我請它建立一個文字檔，內容寫著「Hello Robo Nuggets」，它就會把檔案寫進 workspace。接著，我請它「在這裡打開」；因為它知道自己是在 IDE 裡運作，所以不會叫你去檔案總管找檔案，而是直接在 VS Code 編輯器裡開啟那個文字檔。

從這裡開始，不管是預覽文字檔、圖片，還是安裝 Claude Code 推薦的外掛來檢視 PDF，都可以在同一個視窗裡完成。不管你做的是哪一類知識工作，幾乎都能在一個 IDE 裡處理。

## 開多個 session，並把它們排成一排

Desktop app 也能開多個 session、分割檢視，最多可以同時開四個。但我在 VS Code 裡的做法更直接：開一個新 session，它就會成為一個新視窗，接著把它往左拖。再開一個，再往左拖。你想怎麼排列都可以。

<!--image:3-->

我幾乎一直都是這樣工作：在同一個視窗裡開好幾個 session，自己管理、自己切換。跟只有一個聊天視窗相比，大概能同時處理四倍的工作。雙擊其中一個視窗，它們的寬度就會自動平均分配。我有一台第二螢幕，就讓這些 agent 各自在上面執行；等它們做完，我再進去 review。

這也是我不把 Desktop app 當作 daily driver 的原因。它的分割視窗目前只能調整大小，不能拖出來或重新排序，所以想按照自己的習慣整理時，會受到不少限制。

## 少的那一塊：skills 沒有清單

VS Code extension 唯一讓我不太滿意的地方，是沒有一個介面能讓你一次看完所有 skills。

替代方法是輸入「/」，slash commands 就會列出 Claude Code 可以存取的所有 skills。我自己有八十幾個。真的需要整理時，我也不會一個一個點開修改，而是請 Claude Code 逐一檢視，建議哪些可以停用、刪除或精簡。MCP connectors 也找得到，就在 MCP servers 底下。

## terminal 還是要用，但不把它當 daily driver

對多數人來說，我一律建議從 VS Code extension 開始，因為三種介面裡，terminal view 最讓人有距離感。

不過，terminal 有它最強的地方：功能最多。有些功能會先在 terminal 推出，例如 Ultra Code；`/insights` 有些指令到現在也還是只能在 terminal 裡使用，或至少在 extension 和 Desktop app 裡沒那麼好用。所以，懂一點 terminal，對想嘗試新功能的人來說很值得。

我只是不會從 terminal 進入 Claude Code。要用 terminal 時，我會從 IDE 開啟：點選 View → Terminal，它就會在目前的 workspace 裡開啟。輸入 claude，就會從這個資料夾開始運作。

terminal 的缺點也很具體。你請它打開一個檔案，它會用系統預設的程式開啟，結果就是又多開一個應用程式；而且你在 terminal 裡看不到檔案內容。缺少檔案可視性，這個問題幾乎每天都會讓你碰上一回。

<!--image:4-->

所以，我的 daily driver 還是 VS Code extension：用起來比較熟悉，也更有彈性、更整合。要開檔案或圖片，都能在同一個應用程式裡完成。

Desktop app 是最不讓人有壓力的選擇。但說真的，VS Code extension 用個 10 到 30 分鐘，通常就會習慣了。

## 所以，選一個你願意每天打開的介面

三個介面底下用的都是同一組模型、同一個 harness。真正的差別在於介面，以及進階介面多出來的功能。選一個你願意每天打開的介面，先把 workspace 放進去，再開始讓它幫你做事。

把 terminal 也放進來一起比較，就更容易看出自己剛才選的是哪一種取捨。下一篇，我會把三個介面整理成一張表。
