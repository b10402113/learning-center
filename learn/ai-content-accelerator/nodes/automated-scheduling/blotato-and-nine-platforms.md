# Blotato：我們在 RoboNuggets 用的那一個

你剪好一支短片，想發到 Instagram、TikTok、YouTube Shorts。於是你打開第一個平台，上傳影片，把 caption 複製貼上，送出。再打開第二個平台，再做一次。第三個平台，再來一次。三段一樣的內容，你手動做了三遍。

如果一天要發三支，這件事就吃掉你整個晚上。而且沒有任何一個環節需要你的判斷。排程工具處理的就是這種差事。它把重複上傳與貼上的動作從你身上拿走，讓你的時間回到內容本身。

<!--image:1-->

## 一支影片，九個平台

排程工具是 Blotato。基本用法很單純：你給它一支影片，選好時間，它幫你發到九個社群平台。

不是每個平台都重新做一次。同一支影片、你挑的時間，一次排進去。

## agent 可以直接操作

Blotato 真正關鍵的地方，在於開發者把它做成了 agent 可以操作的樣子。

所以如果你用的是 Codex 或 Claude Code，你不需要打開 Blotato 的介面點來點去。你只要跟 agent 說：這些內容今天幾點要出去、要送哪幾支影片、配哪些 captions，它就會把整批內容排好。排完之後，你在行事曆上就看得到每一則的位置。

它適合放進自動化的內容產線。排程這一步不是由你去操作工具，而是由 agent 替你操作工具。

<!--image:2-->

## 它可以連到哪九個平台

Blotato 能連結的平台是這九個：

- Instagram
- Facebook
- TikTok
- YouTube
- LinkedIn
- Twitter
- Threads
- Pinterest
- Bluesky

清單不長，但涵蓋短影音、圖文與文字型社群。你平常發 shorts 的那幾個通路，都在裡面。

## 一次性設定：API key 與 account ID

要讓 agent 真的能動手，前面需要一次設定。設定完之後，你其實不用再打開 Blotato 的 UI，因為後續都交給 agent。

那一次設定需要三樣東西：一個 Blotato 帳號、你的 API key，以及把帳號連結一次。API key 在 Blotato 的設定裡找得到。

連結帳號時，按最上面的按鈕，它會帶你到一個 single sign-on 頁面，讓你逐一授權各個平台帳號。授權完成後，你會拿到一組 account ID。

把 account ID 和 API key 一起交給 agent。這兩樣加起來，等於給它直接發文到這些平台的能力。之後就只剩下一句話：幫我排程。

<!--image:3-->

## 把偏好寫成 skill

每次都要重新交代時間與平台，也很煩。所以把這些偏好寫進一個叫 `/post` 的 skill。

skill 裡先設好規則：貼文要在哪些時間出去、要發到哪些帳號、要發到哪裡。預設它會連到 Blotato，而 Blotato 已經連著你的各個帳號，排程就由 agent 接手。

要改節奏，不用改流程，改 skill 就好。想一天發五次，可以。想一天只發一次，也可以。你也可以直接叫 agent 依你的需求調整。

## 排完之後，去 calendar 檢查

想看排程結果，就到 Blotato 的 calendar 分頁。

每一天會有幾則貼文排在那裡，分別對應 TikTok、YouTube Shorts、Instagram，一路排到接下來七天。點進任何一則，你都能檢查那則 caption。

整個流程裡，你唯一需要看一眼的地方就是這裡。你要給 agent 多大的自由度，由你決定：全部交給它，或是先在這裡逐則檢查 caption 再送出去。

## 你要發出的那個東西

打開 Blotato，把一個平台連好，拿到 API key 與 account ID。然後用你手上那支已經剪好的影片，叫 agent 排一則貼文出去，再回 calendar 確認它真的在那裡。

先讓一個平台跑起來。九個平台是之後的事。
