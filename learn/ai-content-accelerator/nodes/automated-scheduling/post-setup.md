# 一次性設定：API key 跟 account ID

工具能不能替你發文，取決於一件只做一次的事：把帳號與憑證交給它。

`/post` 就是接手這件差事的 skill。要讓它替你發文，得先做一次設定：申請 Blotato 帳號、連接社群帳號、拿到 API key 與 account ID。

## /post 背後是 Blotato

`/post` 本身不發文。它把你的影片交給 Blotato——一個已經連著你社群帳號的排程工具——由 Blotato 執行發佈，最後回你一份內容行事曆。

`/post` 預設送到 Instagram、TikTok、YouTube Shorts 和 Threads。Blotato 其實能接更多平台，一共九個：Instagram、Facebook、TikTok、YouTube、LinkedIn、Twitter、Threads、Pinterest、Bluesky。

設定完成之後，你平常不必再開 Blotato 的介面。只有想看排程時，才進 calendar 分頁。

## 設定四步就好

1. 下載 zip 檔。
2. 把 install prompt 貼進 agent，它會一步一步帶你走。
3. 註冊一個 Blotato 帳號。
4. 在 Blotato 裡連接你的社群帳號，然後複製 API key。

第 4 步有個容易漏的細節：不要順手把 key 貼進聊天視窗。請 agent 開一個安全檔案，由你自己把 key 貼進去。

<!--image:1-->

## 連接帳號會看到什麼

按 Blotato 最上面的連接按鈕，會帶你到 single sign-on 頁面，也就是單一登入。你在那裡逐一授權每個平台。

授權完成後，你會拿到一組 account ID。你的 agent 會跟你要這組 ID。

## 交給 agent 的兩樣東西

API key 在 Blotato 的設定裡找。account ID 在連接帳號之後拿到。新的工具通常都需要一點初始設定，這次就是那一次。

把這兩樣交給 agent，等於給它直接發文到這些平台的能力。之後你要做的，只是叫它幫你排程。

<!--image:2-->

## 新帳號先正常用幾週，再連進來

如果某個帳號是全新的，尤其在 TikTok 上，先正常使用幾週，再把它連進 Blotato。

所以連接帳號的順序不是「先接上再說」。新帳號要先像個真人一樣用一陣子。

<!--image:3-->

## 設定完，第一次跑 /post

設定好之後，打 `/post`，附上你的影片。在你核准之前，什麼都不會出去。你要核准兩件事：每個平台要用的 caption，以及它挑的 cover。

你說一聲 go，它才會把每一則貼文排進行事曆。

還有一個差別要記住：排程不等於已發佈。要等到連結打開，那則貼文才算真的上線。

這次設定你要交出的東西很具體：安全檔案裡的一組 API key，Blotato 裡的一組 account ID。兩樣都給 agent，下一則影片就能直接排進去。
