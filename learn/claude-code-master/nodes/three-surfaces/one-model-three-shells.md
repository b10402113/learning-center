# 同樣的模型，同樣的 harness

你打開 Claude Code，目前可能只用過其中一種介面。有人用桌面 app，有人在 VS Code 裡開，有人只開終端機。三個都能用，所以你很容易以為這是三個不同的產品，甚至以為換一個就會換到不同的模型。

先講結論：底下是同一個東西。換介面不會換到比較笨或比較聰明的東西。

## 底下是同一組模型，同一層 harness

不管你選哪個介面，跑的都是 Anthropic 那三個分層模型：Opus、Sonnet、Haiku，能力從最強到最弱排下來。

外面那層 harness 也相同。harness 是 Anthropic 包在模型外面的那一組程式碼與 system prompt，Claude Code 的能力就是它給的。

<!--image:1-->

所以三個介面的差別不在腦，在外殼。外殼決定兩件事：你看得到多少檔案，以及你用什麼方式派工作。

## 三個外殼，同一個下載頁

三個版本都在 claude.ai/downloads。頁面往下滑，找到 Claude Code，就能選終端機版、VS Code 版，或桌面 app 版。

VS Code 版屬於 IDE，也就是 integrated development environment，整合開發環境：檔案在同一個軟體裡看得到，工作也在同一個軟體裡做完。

裝哪個都不影響你之後換。工作區還是同一個資料夾，換外殼不用搬家。

## 桌面 app：最不嚇人，但看檔案最不方便

桌面 app 長得像你熟悉的聊天視窗，跟 claude.ai 的對話框差不多。它的定位是最簡單、最不嚇人，如果你剛開始，這是最低的門檻。

但左上角其實有三個 tab，能力不一樣：

- Chat：只幫你解釋事情，三個裡面最弱。
- Claude Work：Claude Code 的簡化版。
- Claude Code：三個裡面最強。

作者的判斷是：Claude Work 能做的，Claude Code 都能做。所以想學這套工具，直接從 Claude Code 開始。

用法上，第一步是選 workspace。workspace 就是你電腦上的一個資料夾，按資料夾圖示挑一個就好。接著它會問你要不要 trust workspace，這個動作等於給權限，讓 Claude Code 讀這個資料夾，也在裡面寫檔案、建檔案。

選好之後，你就是在一個聊天視窗裡派工作。要並行，就開新 session，再用 split view 把其他 session 拉到旁邊。最多可以並排四個。這對「一個 session 跑深度研究，另一個 session 做別的事」很有用。

<!--image:2-->

限制也在這裡。這四個分割視窗只能調大小，不能拖出來，也不能重新排序。作者說，這就是他沒把桌面 app 當每天主要工具的原因。

桌面 app 另外有兩個地方值得知道：

- Routines tab：routine 就是排程任務。可以在這裡暫停、恢復，也能用日曆看。但 routine 一多，用介面管理會比想像中難。
- Customize：這裡列出 Claude Code 能用的 skill，也能列出 MCP connector。

作者自己幾乎不在這裡加 skill。他直接在對話裡用自然語言叫 Claude Code 建。等到 skill 累積到八十幾個，這個清單也就沒有看的意義了。要改某個 skill，叫 Claude Code 去讀、去改，比你自己點進去快。

## VS Code extension：看得到檔案，也排得動 session

多數人，包括初學者，他建議從 IDE 開始。裝法是在 VS Code 的 extensions 裡搜尋 Claude Code for VS Code，然後安裝。VS Code 開源、免費，存在很多年了。

打開同一個 workspace 資料夾之後，你會看到兩件事同時存在：

1. 左邊的 session 清單，跟桌面 app 看到的一樣。
2. 中間的編輯器，可以預覽文字檔、圖片，裝個 plugin 也能預覽 PDF。

這是它跟桌面 app 最大的差別。Claude Code 寫完檔案，你可以叫它在這裡打開，檔案就直接開在 VS Code 的編輯器裡。你不用切到另一個應用程式，去確認它到底寫了什麼。

session 也更好排。新開的 session 是一個新視窗，可以拖到左邊或右邊，版面自己決定。作者說他常在一個視窗裡同時跑多個 session 切來切去，產出大概是單一對話視窗的四倍。雙擊某個分割視窗，寬度會平均分配。他也常用第二螢幕放這些 agent，等它們跑完再進去審。

<!--image:3-->

缺點是 skill 沒有清單介面。要看清單，按 `/` 看 slash command，那就是 Claude Code 能用的 skill。MCP server 也列在同一區。

## Terminal：最原始，也最囉唆

終端機版是最早的介面，本來就為開發者而做。所以它話最多，每一步做什麼都印出來，你看得到它到底跑了哪些動作。

代價是你看不到檔案。叫它開一個檔案，它會用 VS Code 或你系統預設的程式開。作者就遇到多開了第三個應用程式的狀況，那不是他要的。另外，你要先自己會幾個終端機指令，才有辦法切到你要的 workspace 資料夾。

<!--image:4-->

它也是最嚇人的一個。但新功能常常先在這裡出現。作者提到，有些功能最早只存在於終端機版，`/insights` 這一類指令也是；至少在 VS Code 與桌面 app 裡，它們沒有那麼好用。

所以他自己的做法是：需要終端機時，從 VS Code 裡開。View → Terminal 就會在下方面板出現，而且已經停在你的 workspace。這樣兩邊的優點都拿到。

## 怎麼選

一句話版本：多數人從 VS Code extension 開始，十分鐘到三十分鐘就會習慣。桌面 app 最不嚇人，適合當第一步。終端機功能最多，但多數人不需要每天用。

介面之外，真正要記住的是這個對照：

| | 看得到檔案嗎 | 工作方式 |
|---|---|---|
| 桌面 app | 對話視窗為主，檔案在 workspace 裡產生 | 開 session、split view，最多四個 |
| VS Code | 看得到，直接在編輯器預覽 | session 可自由拖放排版 |
| Terminal | 看不到，開檔要交給其他程式 | 純文字輸入輸出，指令要先會 |

這張表就是全部。三個外殼，一個模型，一個 harness。你挑的只是檔案看不看得到，還有工作怎麼排。

接下來先從 desktop app 走起，因為它最不嚇人，也最快讓你撞到這套外殼的第一個限制。
