# 一頁管好你所有腳本

上一步說明了為什麼不能讓腳本留在聊天視窗，也講了 Rubric Scripts 的價值。這一步開始動手：把它裝起來，把 shortlist 載進去，讓 agent 幫你把點子變成可以審的腳本。

Rubric 是一整套為 RoboNuggets 社群自己做、自己維護的客製軟體，每個工具都設計成 agent-ready，能直接跟 agent 一起操作。Rubric Scripts 是其中一個。它把散在對話裡的腳本收成一頁，讓你看得到、審得動，也讓 skill 有地方愈磨愈準。

## 安裝只有兩步

1. 把 install prompt 貼進你的 agent
2. 輸入 `slash rubric scripts`，頁面就打開了

install prompt 會幫你打開 Rubric Scripts。它是一套瀏覽器端軟體，基本上就在你的 Google Chrome 裡跑起來。多數人看到的是 localhost，也就是你自己的機器在跑，不是別人的伺服器。

安裝時它會附上一個 skill 指令：`slash rubric scripts`。之後你把點子餵給 agent，它會照你的語氣、挑最合適的 hook，把點子轉成腳本，給你幾個版本可以選，再直接載進 Rubric Scripts。

預設它會去找你的 hooks 跟 tone 這兩個 skill。如果你還沒建，它也會教你怎麼建。

<!--image:1-->

## 把 shortlist 載進來

上一週用 `slash latest`、`slash outliers` 收集到的 shortlist，直接載進去；或當場再跑一次那兩個 skill 也可以。

你的 agent 會用 `slash script` skill，替每個點子寫一份腳本。每份附上三個 hook 選項，來自 `slash hooks`；整份腳本的語氣則來自 `slash tone`。

每份腳本進到頁面時，hook 都會被標亮。那一行就是觀眾會不會停下來的分水嶺，值得被單獨看見。

## 打開一份腳本長什麼樣

左邊是所有點子，可以直接切換。右邊是腳本本身，三個 hook 都在上面，每一個都能自己編輯，想手動微調就直接打字。

右邊還會有一份寫好的 caption，附上 SEO 最佳實踐，以及這支影片整體在講什麼的細節。這是你在聊天視窗裡不想看到的東西：內容、caption、註解全擠在一起，畫面非常亂。

點子一多，就用搜尋或篩選器過濾。排序可以依自訂順序、最後編輯、最新加入、閱讀時間最短，或直接字母排序。檢視方式能切卡片式或清單式，也有淺色與深色模式。

<!--image:2-->

## 留評論，一次改完

腳本進到頁面之後，審稿的方式不是重寫，是在句子旁邊留意見：反白那句、寫下你真正會怎麼講，看完三份按一次 copy comments for all scripts，agent 就會把所有腳本一起修好。打開 teach my slash tone，它還會把同一批意見寫回 tone skill。

操作的細節，下一步會拆開講。

<!--image:3-->

## 介面是拿來改的

`agent-ready` 的應用程式，就是拿來改的。caption 想每次都短一點、hook 想要四個而不是三個、某個視窗根本不需要，都直接叫 agent 改。這部分下一步也會一起講。

## 腳本要拿去錄

腳本改到順了，就送到你真的會讀的地方：手機上的 Telegram、電腦前的一個頁面，或自己的 teleprompter。怎麼把整批腳本一次錄完，留給這個 node 的最後一步。

## 讀完你要發出的那個東西

挑一份 shortlist 上的點子，貼進 `slash rubric scripts`，打開它，挑一個 hook，留一則具體的評論，然後按 copy comments for all scripts。腳本從此不在聊天視窗裡，它在你每天會開的那一頁。
