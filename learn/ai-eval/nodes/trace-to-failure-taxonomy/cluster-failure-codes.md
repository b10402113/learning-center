# 從失敗 Trace 歸納出清楚可數的 Failure Code

一條條標完 pass/fail 之後，手邊會留下一堆散落的失敗；這篇要把那些失敗收斂成可以數的代碼。

在打造 AI Agent 時，最讓人沮喪的情境之一就是系統上線或測試時突然爆出一堆錯誤。如果團隊只盯著平台記錄檔（Logs），往往只有在系統出事時才會去翻，而且很難看清模型到底在思考與決策的哪一步走偏。Trace 記錄了 Agent 的軌跡（Trajectory）與完整決策脈絡，但如果每個人只用「模型回答不太好」或「感覺答非所問」這種模糊的質化評語，錯誤就會淪為無法統計的意見，團隊也無從著手排定修復優先級。

要建立有效的自動化評測（Evals），必須從手動的錯誤分析（Error Analysis）開始。核心目標就是把個別的失敗案例，聚類並定義成具體、可量化的 Failure Code。

---

## 為什麼需要優先級分類？

剛推出產品或做 Agent 測試時，發現的錯誤數量往往非常龐大。哪怕是像 Anthropic 這樣的頂尖團隊，GitHub 上可能隨時都有八、九萬個未解決的問題。現實中不可能一口氣修完所有問題，有些錯誤甚至不值得花時間修。

團隊必須懂得排優先級。決定修復順序通常看兩件事：嚴重程度（包括爆炸半徑與商業成本）與發生頻率。例如：
- **嚴重且高成本的問題**：Agent 誤判退款條件，導致公司直接損失金錢（Bad Refund Scenario），這類錯誤必須第一時間修復。
- **低影響的問題**：回答稍微冗長（Too Verbose），這可以往後排，甚至暫時不處理。

<!--image:1-->

只有把雜亂的失敗行為「分桶（Bucket）」聚類並計算次數（例如某個錯誤在 8 次測試中出現了 5 次），量化數據才能轉化為明確的修復決策。

---

## 良好 Failure Code 的四項特徵

要讓評估代碼真正發揮作用，每個 Code 都必須符合以下四個條件：

<!--image:2-->

1. **名稱固定（Named）**：團隊內部擁有共同語言與詞彙，所有人稱呼同一個錯誤時都使用相同的代碼。
2. **二元判斷（Binary）**：非黑即白，只有符合或不符合、通過或失敗，不要設計成 1 到 5 分的模糊級距。
3. **具體明確（Specific）**：定義必須非常清晰，當兩位不同的人來檢視同一個 Trace 時，能給出完全一致的標註結果。
4. **可量化計數（Countable）**：每個 Code 都可以被統計出現次數與頻率，讓頻率成為排定分流（Triage）的重要依據。

以 Coding Agent 的 8 個工作階段（Sessions）為例，透過明確標註，可以清楚看出各類失敗模式的分布與最高優先級問題：

| Failure Code | 出現頻率 |
| :--- | :--- |
| Unverified Status Reporting（未經驗證便回報狀態） | 5 / 8 |
| Weak Preview Test Coverage（預覽測試覆蓋不足） | 5 / 8 |
| Stale Domain Terminology（使用過時的領域術語） | 3 / 8 |
| Poor Identifier Naming（識別碼命名不佳） | 3 / 8 |
| Spec Quality Issue（規格品質問題） | 3 / 8 |
| Wrong Mechanism for Job（選用錯誤的實作機制） | 3 / 8 |
| Acted Before Diagnosing（未診斷就直接行動） | 3 / 8 |
| Unwarranted Default Override（無正當理由覆蓋預設值） | 2 / 8 |
| System Internals Misunderstood（誤解系統內部運作） | 2 / 8 |
| Missed Existing Asset（遺漏已存在的資源） | 1 / 8 |

---

## 三步驟分析 Trace 並建立分類體系

將失敗案例轉化為可回歸測試評估的標準流程分為三步：取得 Trace（Source）、人工標註（Annotate）、聚類歸納（Cluster）。

<!--image:3-->

### 1. 檢視與標註 Trace

首先收集 QA 環境、沙盒環境或正式環境中的失敗 Trace（例如 30 筆輸入範例）。可以利用瀏覽器開啟單一 HTML 的輕量 Trace Viewer 工具，上傳 OpenTelemetry（OTel）格式的 JSON 檔案：
- 檢視帶有錯誤標籤的 Trace 列表。
- 展開帶有執行時間長度條（Duration Bars）的 Span 樹狀結構，查看完整的決策細節。
- 逐一標註是通過或失敗，並附上初步備註，再匯出為 JSON 或 CSV 檔案。

親自花 20 分鐘肉眼逐筆看過並標註 Trace 非常關鍵。略過這個手動步驟，就很難建立對 Agent 實際失敗原因的直覺理解。

### 2. 聚類成二元 Code 並統計

重新檢視所有被標為失敗的 Trace，將行為聚類成 5 個以上的二元 Code。每個 Code 都可以寫成一個「是 / 否」的判斷句，並加上一行簡短定義：
- `WRONG_TOOL`：Agent 是否針對使用者的請求呼叫了錯誤的工具？
- `REFUND_POLICY_MISQUOTE`：退款決策是否違背了明文規定的退款政策？

接著計算每一種 Code 在樣本中出現的次數。因為一次失敗的 Trace 可能同時觸發多種問題，因此各個 Code 的次數加總可以超過原本的樣本總數（非互斥）。

### 3. 對齊品質維度並找出反常案例

為了讓團隊全盤掌握系統狀況，歸納出的每個 Code 可以進一步對齊到軟體評估的六大品質維度之一：
- 模型品質（Model Quality）
- 產品行為（Product Behavior）
- 安全性（Safety）
- 可靠性（Reliability）
- 成本（Cost）
- 延遲（Latency）

最後，挑出**發生頻率最高的前三名失敗模式**作為修復優先重點；同時務必保留**一個目前尚無法合理解釋的反常失敗（Unexplained Anomaly）**。這些當下看不懂的反常案例往往隱藏了系統未知的盲點，是後續迭代測試與優化評估的重要種子。
