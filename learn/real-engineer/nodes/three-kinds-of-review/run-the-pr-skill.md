# 執行 PR Skill：依 Diff 生成 Body 並分三段驗收

前三步拆解了一份好 PR body 該有的三個段落；現在換你實際跑一次。

在日常開發中，寫 Pull Request（PR）說明往往很花時間，也容易流於形式。

透過設定好的 PR skill，AI agent 能自動讀取 Git diff、執行驗證，並產出結構嚴謹的 PR 說明。

這能加速審查，也能幫助團隊判斷需要投入多少人工精力審查。

### 建立測試用 PR 並取得編號

在終端機直接執行 `npm run create PR`。

這是專案預先配置的工具，能依據特定 commit 自動建立 PR。

如果先前執行過，系統會提示 PR 已存在並詢問是否覆蓋，確認替換即可。

執行完成後，會產生名為 `seed bookmarks notes diff` 的草稿 PR（Draft PR）。

打開這個 PR，可以看到它自動設定了 base branch（準備合併進去的目標分支）以及 PR branch（包含本次變更 commits 的分支）。點進 Files changed 分頁，可以看到所有修改過的檔案，形式與一般 repo 完全一致。

<!--image:1-->

目前 PR 只缺少描述改動細節的 PR body。

請記下這個 PR 的編號（例如 34）。

### 請 Agent 根據 Diff 生成 PR Body

打開 agent，確認工作目錄中有 `PR skill.md` 檔案。

agent 通常會自動辨識並載入這個 skill，不需手動喚起。

對 agent 輸入指令：

<!-- source: sources/real-engineer/20261116/course/039 Running The PR Skill Solution.en.txt#L1 -->

```text
could you take PR number 34 and write a PR body for it?
```

Agent 載入 skill 後會讀取 diff，並在背景執行專案的型別檢查（type check）與測試套件（test suite）收集佐證資料。

接著 agent 會產出 PR body 草稿，並列出程式碼中的不一致處。

確認內容後，直接讓 agent 發布（post）到 PR 上。

一份符合規格的 PR body 會著重在三個段落，我們依序用這三個部分進行驗收：

<!--image:2-->

### 第一段：用偽代碼與描述理解改動內容

摘要的文字說明非常精簡。

主要透過類似 JSX 風格的偽代碼 diff 來呈現結構變化：

* **Lesson viewer**：新增書籤開關（bookmark toggle），讓使用者切換書籤；同時加入課堂筆記區塊與儲存筆記（save note）功能。
* **Sidebar 元件**：新增「已儲存（saved）」按鈕，點擊可前往儲存筆記頁面。這個按鈕只有「學生（students）」看得到。agent 採用了「students」而非泛稱的「learners」，因為 PR skill 會讀取專案的領域詞彙表（glossary），確保用語符合業務定義。
* **Saved 路由**：列出書籤與筆記清單，書籤依建立時間排序，筆記依最後編輯時間排序。
* **Instructor student roster 元件**：新增學生筆記清單，讓講師查看每位學生在各課堂寫的筆記。
* **Schema 變更**：新增 `bookmarks` 與 `notes` 兩張資料表。

### 第二段：檢查驗證證據（Evidence）

PR body 的第二個重點，是提供改動能正常運作的證據。

在此案例中，agent 明確指出證據偏弱。

型別檢查與現有測試套件雖然全部通過，但測試套件完全沒有針對新增的 bookmarks 或 notes 撰寫測試。

Agent 直接點出這個缺漏，審查者不需要自行人工比對測試覆蓋率。

### 第三段：評估合併危險度（Merge Danger）

第三個區塊要判斷這次合併屬於「單向門（one-way door）」還是「雙向門（two-way door）」，也就是改動是否容易安全還原：

<!--image:3-->

* **單向門判定**：本次的 `migration 012` 只有新增資料表。一旦學生開始上線寫筆記，後續若要 rollback，只能留下孤立資料表（orphan tables），或是刪除學生已經寫入的資料。
* **隱私爆炸半徑（Blast Radius）與邏輯矛盾**：詞彙表（glossary）定義學生筆記為個人私密內容，instructor roster 實作上卻把每位學生的筆記公開給講師查看，兩者產生業務邏輯衝突。
* **效能與資料完整性缺陷**：
  * saved 路由讀取時，每筆書籤或筆記約觸發 3 次資料庫查詢，存在 N+1 查詢問題，需要最佳化。
  * 外鍵（foreign key）設定為 `ON DELETE NO ACTION`，導致被引用的課堂（lessons）與使用者（users）資料後續無法正常刪除。

### 驗收後的價值

這份簡短的 PR body 包含高密度的關鍵資訊。

單向門的判定代表改動必須經過嚴格的人工審查。

Agent 在消耗極少 token 的情況下，就找出了缺少測試、隱私規格衝突、N+1 查詢與外鍵約束等問題。

在耗費工程師精力手動審查前，就能先要求修正這些低品質的實作。

PR skill 的架構可以依團隊需求調整，目標在於加快審查步調，並精準衡量 PR 所需的人工審查成本。
