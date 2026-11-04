# box 只覆蓋邊界的兩塊，另外兩塊是你自己的

box 的檔案和網路邊界已經設定好：`./box`起一個 dev container。掛載進去的只有這個 repo，對外連線也只允許白名單上的項目。盒裡的 Claude Code 開 `--dangerously-skip-permissions`，就不會再詢問權限。

這很容易讓人以為盒子已經萬無一失，其實不是。盒子只負責其中一部分的邊界。

## 邊界分四塊，盒子只管兩塊

邊界分成四部分：檔案、網路、秘密和重置。

box 管檔案和網路。檔案方面，盒裡只能看到這個 repo，看不到 Mac 的家目錄。網路方面，對外連線預設 DROP，只有白名單上的項目可以通過。這兩項會在盒子啟動時自動生效。

另外兩項要自己管理，盒子不會幫你處理。

秘密方面，只提供 agent 完成這項工作所需的 token。token 的效期要短，scope 只開放一個 repo。不要把整把鑰匙都放進盒子裡。

重置方面，如果 agent 把東西弄壞，檔案可以用 git 還原，盒子則可以依照 recipe 重新建立。重新建立的成本應該接近零。這是 dev container 比手動調整過的機器更好的地方。

<!--image:1-->

盒子能做的是限制範圍。你還得留意範圍裡放了什麼，以及出問題後要怎麼處理。

## 從攻擊者角度再次驗證

盒子設定好後，別只確認它能不能啟動，也要確認邊界真的擋得住。進入盒子，試著從攻擊者的角度往外取得東西。

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L19-L41 -->
```bash
./box bash

# a shell inside the box

whoami

# node

ls ~/.ssh/id_*

# No such file or directory: no private keys

ls /Users

# your Mac's home folders are not there

curl https://example.com

# blocked by the firewall

npm ping

# PONG: npm is on the allowlist
```

五個指令會得到兩類結果。該被擋下的項目包括：沒有私鑰、看不到主機的家目錄，也不能連線到任意 host。該通過的項目包括：npm 可以連上白名單內的項目，並收到 PONG。兩類結果都符合預期，邊界才算設在正確的位置。

<!--image:2-->

## 盒子擋不住 prompt injection

即使邊界驗證通過，還有個殘酷的事實：prompt injection 在盒子裡一樣會成功。

攻擊路徑是先讓不可信內容進入 window，再把資料送出去。盒子能擋住「送出去」這一步，因為白名單以外的 host 都會被擋下來。但它管不了「不可信內容進入 window」這一步。agent 讀取客訴 email、issue 或 README 時，裡面的文字會和你的指令出現在同一個 window。模型無法分辨哪些文字是你下的指令。

因此，盒子的作用不是防止 injection，而是限制 injection 能偷走的東西。agent 受騙時，攻擊者能取得的只有這個 repo、白名單內可以連線的 host，以及你放進盒子裡的內容。最後一項要特別留意：放進去的每個 token，都可能從邊界內被帶出去。

<!--image:3-->

## 惡意 repo 能竊取整個 box

另一種更直接的威脅，是在惡意 repo 上執行工作。原則是：秘密不要放進 box，而且只在信任的 repo 上執行 box。

簡單來說，box 不是永遠不會被突破的保險，而是把損害限制在可以丟棄的範圍內。在信任的 repo 上執行時，出問題就 reset 後重來。在不信任的 repo 上執行時，repo 一啟動，就能把整個 box 裡的內容當成可用資源。

## 把 recipe 放在 repo 裡，讓 agent 幫你建立

box 的 recipe 就在 TicketBay 的 `.devcontainer/README.md`。把這份 recipe 交給 agent，請它為你的 code 建立同樣的 box。這符合 harness 的思路：邊界不是靠手動逐項設定，而是由 repo 裡的幾個檔案組成，因此可以複製，也能讓 agent 讀懂後照著建立。

四條規則：

- 邊界設定一次後，就讓盒子裡的 agent 使用 full permissions。
- 白名單要精簡，只有工具確實需要時才加入 host。
- 秘密留在盒子外，只在信任的 repo 上執行盒子。
- approval prompt 不是邊界。

<!--image:4-->

盒子只是邊界的一部分，並不是全部。你還要處理盒子管不到的三件事：放進去的是哪些 token、出問題時如何 reset，以及盒子擋不住的 injection 會從哪裡進來。把這三件事處理好，agent 才能真正放著執行。
