# 六個 job 平行跑，紅燈點名是哪條 lane

TicketBay 的 gate 是一個 GitHub Actions 檔案：`.github/workflows/gate.yml`。

它分成六個 job，每條 lane 各有一個 job，六個 job 同時執行。

如果出現紅燈，失敗的檢查會直接指出是哪條 lane 出錯。

六條 lane 全部跑完大約要兩分半。

再透過 branch protection，把六個檢查設為 required。

## 六條 lane 各自分工

| lane | 檢查什麼 | 跑什麼 |
|---|---|---|
| secrets | 用 gitleaks 掃描整個 git 歷史 | gitleaks |
| unit | unit、property 測試與 type check | test:unit、typecheck |
| integration | 針對真 Postgres 執行整合測試 | test:integration |
| http | REST API 與 HTTP property | test:http |
| ui | 用 Playwright 測試關鍵 UI 流程 | test:ui |
| mutation | 只測改動行的 mutation | mutate-changed.mjs |

每條 lane 只檢查一種項目，彼此不重疊。

因此，每條 lane 都獨立成一個 job；哪條亮紅燈，就能知道是哪一種檢查沒通過。

<!--image:1-->

## 速度取捨：該快的快，該慢的分開跑

六條 lane 同時執行，全部跑完大約要兩分半。

unit lane 不碰資料庫，也不開 Docker，因此速度最快。

unit 只測 domain、payments、lib 三個資料夾。

integration 和 http 需要連到真 Postgres，會透過 Testcontainers 啟動容器，各自有 15 分鐘的時限。

ui 最慢，時限是 20 分鐘。

它會在真實瀏覽器中執行，只測關鍵的錢路徑：帶折扣訂票、活動開始前退款，以及活動開始後拒絕退款。

Playwright 設定會開啟 fullyParallel，並啟動正式 build 和專用的 Postgres 容器。

mutation 的時限也是 20 分鐘。

它只在 pull request 上執行，而且只測改動過的 domain 行，不會因為整個 repo 而拖慢。

每個 job 都有自己的 timeout。

concurrency 設定會取消同一個 ref 上仍在執行的舊 gate。

<!--image:2-->

## secret scan：掃描整個歷史

secrets lane 排在清單第一個，並且和其他測試一樣會阻擋 gate。

只要它失敗，整個 gate 就會失敗。

checkout 時會抓取完整歷史（fetch-depth 設為 0），再用 gitleaks 和 `--all` 掃描所有分支。

原因很簡單：就算金鑰後來被刪掉，它仍可能留在歷史裡。

因此，只要掃到金鑰，就要撤銷它並換一把新的。

刪掉金鑰不代表它已經作廢。

gitleaks 以 `.gitleaks.toml` 作為設定，用 `--redact` 遮掉敏感內容，並透過 `--exit-code 1` 在找到金鑰時以失敗結束。

<!--image:3-->

## 一個 job 一條 lane，才好除錯

每條檢查都拆成獨立的 job，紅燈就能指出是哪條 lane 出錯。

六條 lane 全部通過，這個 PR 才算通過 gate。

在 branch protection 上，這六條 lane 就是 required check。

六條 lane 各自檢查不同角度，合起來才能更完整地確認 code 能不能跑。

這六條裡面，mutation 那條的規矩最多，也最容易在 PR 上卡住人，所以下一段單獨拆它。
