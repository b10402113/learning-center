# 從 Rubric Editor 到七天排程

七支 clips 剪好、放進資料夾，工作還沒結束。要一支一支丟上 IG、TikTok、YouTube Shorts。每支都要重新上傳影片、重新貼一次 caption，即使內容一模一樣。一週七支，就是二十一次重複動作。

排程工具的價值就在這裡：同一份內容搬到每個平台，不用你來做。

## /post 做的事

`/post` 用在影片做好、你想讓它出現在所有平台的時候。你把影片交給 agent，agent 送給 Blotato。Blotato 是排程工具，已經連著你各平台帳號。Blotato 執行發佈，最後回你一份內容行事曆。

預設發到 Instagram、TikTok、YouTube Shorts、Threads。Blotato 能接的更多，名單上有九個平台：Instagram、Facebook、TikTok、YouTube、LinkedIn、Twitter、Threads、Pinterest、Bluesky。

<!--image:1-->

沒有預算，手動發也還是選項。另一個方向是 Postiz：開源、免費，但代價很清楚。你要自己架 Docker server 和 Postgres 資料庫。自己維護的排程 App 要真的發到 TikTok、Instagram，還得走過各平台審核流程。有時候要好幾週才會通過。

## 核准前，什麼都不會發出去

`/post` 不會一收到影片就發。它會先停下來，等你核准兩件事：

- 每個平台要用的 caption
- 它挑的 cover

你說 go，它才把每一則貼文排進行事曆。

<!--image:2-->

這裡容易誤會：**排程不等於已經發佈**。貼文只是排進行事曆。要打開連結、內容真的上線，才算發出去。排完之後，記得點開那些連結確認。

## 排一週的具體指令

流程從 Rubric Editor 開始。剪到滿意，按 render all。它會把一段指令複製到剪貼簿。你跟 agent 對話時貼進去，裡面就有那些 reels 的完整細節。

接著輸入 `/post`。直接送出會套用預設值。要給指示就寫清楚，例如：

> 把這些 clips 從今天開始，一天一支，排到七天後，發到我平常發 shorts 的 IG、YouTube Shorts、TikTok。

七支 clips 會被 render，透過 Blotato 排出去。到 Blotato 的 calendar 分頁看，每一天都有三篇貼文，分別在 TikTok、YouTube Shorts、Instagram，一路排到接下來七天。點進任何一篇，都能檢查那則的 caption。

<!--image:3-->

拿到上線後的連結，還可以回頭交代兩件事。請 agent 再排一整週（例如一天三篇），讓內容自己持續出去。或請它把 `/post` 依你這輪改過的地方調整，讓它慢慢學會你喜歡怎麼發。

## 想先看過再發

上面那條路徑有個缺口：caption 沒先檢查就發出去。要更細的控制，可以這樣做。

把同一段從 Rubric Editor 來的指令貼進去，讓它把所有 clips 都 render 出來。影片已經在機器上，直接把那些 MP4 指給 agent 也行。這次不要用 `/post` 排程。改說：我想先在 Rubric Scripts 裡看過，發佈前檢查 captions。

Rubric Scripts 的 video 分頁會填好影片。你可以播放、檢查逐字稿，還有要跟著出去的 caption。想自己按按鈕，就在這裡停用某些平台，或加上更多平台。跟 agent 說一聲就好，整個 template 會幫你填好。改完它再把指令複製到剪貼簿，你送給 agent 執行。

<!--image:4-->

## 時間點的真相

哪個時段、星期幾發，沒有一般人想得那麼重要。真正決定結果的是內容品質，也就是它有沒有用。而且要能發多少就發多少，迭代才會快。

9am、1pm、5pm 這三個時間，唯一的理由是你那時醒著。發錯了，不管是 agent 還是自己的疏失，都能很快手動刪掉收回來。

TikTok 還有地區特性：它會先把內容推給你所在的國家，所以非常地區性。新帳號最早看到的觀眾，往往先是本地的人。這也是把時段設在醒著時段的另一個理由。

全新帳號，尤其 TikTok，先正常使用幾週，再連進排程工具。

## 這週要交出的東西

打開行事曆，七天都有貼文。每一則的 caption 和 cover 都是你看過、點頭放行的。排程不會替你判斷內容好不好。它只負責讓已經做好的東西，準時出現在該出現的地方。
