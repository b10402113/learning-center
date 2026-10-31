---
subject: kubernetes
language: zh-Hant
created: 2026-10-31
updated: 2026-10-31
---

# MEMORY — kubernetes

## Goal

能把一個自己寫的服務（Node／TypeScript API + Postgres）從本機搬到叢集上跑，而且搬兩次：一次在 laptop 的 kind，一次在真的雲上（EKS），中間只改 overlay 的那幾行。

判準不是「知道有哪些物件」，而是：給我一個壞掉的叢集，我能自己看出是哪一層斷掉（image、probe、Service selector、PVC、GatewayClass、IAM），說得出下一步要打哪個指令；最後能把整個環境拆乾淨、不留帳單。

課程的 POC → stable → production 三階段就是這條線，最後要能指著 manifest 說出「這一段在 production 會發生什麼事」。

## Why

手上的東西都是本機 Node 專案：`npm run dev`、`docker run`、一個臨時腳本。換台機器、重開機、想給別人看，就得重來一次；也沒有「壞掉會自己回來」這回事。

Docker 之後那一層一直沒有實感：容器會跑了，但誰決定跑幾個、跑在哪、流量怎麼進來、資料放哪、掛掉誰重啟。Kubernetes 就是那層的預設答案，而這個課程剛好是用一個小 API 從零走到 EKS，不是名詞導覽。

動機的核心是「部署要能重來」——像程式碼一樣進 git、能 diff、能 rollback、能搬到另一個環境。

## Prior experience

- 會 TypeScript／Node.js，讀得懂 Express 與 React；基本 SQL 與 Postgres 概念。
- 終端機工作流熟，會用 Claude Code 之類的工具做自動化；不怕多開幾個 terminal。
- 走過 `agent-harness` 與 `background-agents`：懂 control loop、desired state、durable state、「斷掉之後狀態去哪裡」。
- 分散式概念（consensus、eventual consistency、idempotent、at-least-once）是初學，需要對照日常經驗建立。
- 沒有維運經驗：沒管過叢集、沒碰過 EKS／IAM／VPC，Docker 只到「會 build、會 run」，沒寫過 Deployment／Service manifest。

## Anchors

- 「本機 `node server.js` 關掉就沒了」→ 裸 Pod 沒有 controller，delete 之後不會回來。
- 「服務重啟，記憶體裡的狀態消失」→ 沒有 PVC 的 Postgres，pod 自己長回來但資料歸零（課程第 12、19 集）。
- 「同一份設定貼兩次不該變成兩份」→ declarative apply 的 idempotency，`kubectl apply` 第二次是 `unchanged`。
- 「重送表單就多一筆訂單」→ reconciliation 一直重試，以及為什麼要有 PDB／readiness 當護欄。
- 每天用 Claude Code 的 loop：給目標、看現況、修正 → 跟 kube-controller-manager 的 reconcile 是同一種東西。
- 那個塞滿 md 的筆記 repo（learning-center）→ GitOps：git 是 desired state，叢集只是把它實現出來。
- 「通知寄兩次／刪東西刪不乾淨」→ eventual consistency 的代價：self-heal 會把你想刪的 ALB 重建回來。
- 手動 `docker run` 那條指令存在腦子裡 → 為什麼 manifest 要進 git（課程第 14 集開場講的就是這個）。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次。
- 一次一小段，能在自己機器上跑起來比讀完更重要。
- 環境：macOS + Docker，可以裝 kind／kubectl／eksctl；有 AWS 帳號可以開小叢集，但要記得拆（EKS control plane 按小時計費）。
- 語言：台灣繁體中文，技術名詞保留英文（pod、deployment、service、manifest、reconcile、probe 不硬翻）。

## Knowledge type

mixed，但**程序性主導**。物件欄位、API 版本這類事實只學到夠用；重心是判斷——什麼時候該用 Deployment 還是 StatefulSet／operator、probe 該怎麼設、哪裡該用 overlay、什麼東西屬於叢集內外、這個錯誤是哪一層造成的。

## How to teach me

- 先看壞掉的長相，再學對應的機制：CrashLoopBackOff、Pending PVC、rollout 卡住、selector 對不上，都比定義好記。
- 每個抽象立刻綁到一次 `kubectl` 輸出、一個 YAML 欄位或一行 event。
- 每一段都要有「你現在打這個、會看到什麼」的具體指令。
- 保留「弄壞它」的動作：刪 pod、改壞 selector、把 image tag 指到不存在、縮到 0、drain 節點。
- 名詞先給一句人話再給正式名字；不要名詞堆疊，也不要「先學完理論再動手」。
- 喜歡「同一份東西換環境」的對照：kind 跟 EKS 哪裡一樣、哪裡只有幾行不一樣。
