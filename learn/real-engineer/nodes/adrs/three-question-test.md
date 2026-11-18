# 三道檢驗題，判斷決策該不該寫進 ADR

如果把架構決策記錄（ADR）的權限交給 AI Agent，只要給它一個放 Markdown 文件的資料夾，它往往會把所有大小細節全寫進去。
文件數量會因此無限膨脹，最後根本沒人想讀。

記錄 ADR 必須非常謹慎節制。
評估一個技術或商業決策該不該立案存檔，可以用三個問題來檢驗：

1. **難以回頭嗎？**（Hard to reverse）
2. **缺乏脈絡時會讓人感到意外嗎？**（Surprising without context）
3. **這是不是真正取捨後的結果？**（Result of a real trade-off）

### 輕量套件不用記，重大架構轉換才要寫

決定使用 recharts 來畫圖表，或是改用 sonner 來彈出提示通知（toast），並不需要寫 ADR。

答案通常是不需要。
因為這些周邊套件隨時都能替換，改動成本很低。
但如果決定把整個專案從 React 搬遷到 Vue，要走回頭路就極其困難，必須投入大量工程工時。
這種代價高昂、難以復原的決定，才值得留下一份 ADR。

![第 1 段配圖](./three-question-test-assets/image-1.webp)

### 藏在程式碼裡的驚喜：退款天數的計算案例

決策不一定都是更換前端框架這種顯眼的大事。
許多關鍵決定其實藏在細微的業務邏輯裡。
缺少上下文時，接手的人或 AI 很容易做出錯誤假設。

例如計算退款資格的函式邏輯：

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.$slug.tsx#L434-L464 -->

```tsx
// Compare whole days, not hours — a purchase at 23:00 should still get its
// full fourteenth day.
function asDayString(when: Date) {
  const year = when.getFullYear();
  const month = String(when.getMonth() + 1).padStart(2, "0");
  const day = String(when.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
...
  const purchasedDay = asDayString(new Date(purchase.createdAt));
  const windowEnd = new Date(purchase.createdAt);
  windowEnd.setDate(windowEnd.getDate() + CANCEL_WINDOW_DAYS);
  const lastDayInWindow = asDayString(windowEnd);
  const todayDay = asDayString(new Date());
  const isWithinWindow =
    todayDay >= purchasedDay && todayDay <= lastDayInWindow;

  if (!isWithinWindow) return null;
```

這段程式碼的關鍵在於 `isWithinWindow` 的天數判定。
如果在 9 月 20 日上午 9 點購課，按小時精確計算，14 天的退款期限截止點會是 10 月 4 日上午 9 點。

![第 2 段配圖](./three-question-test-assets/image-2.webp)

但系統並沒有按小時算，而是透過 `asDayString` 把時間抹平為整天。
退款期限因此會延伸到 10 月 4 日午夜 12 點，等於給了學員更多申請退款的緩衝時間。

缺乏背景脈絡時，這種實作方式會讓人感到意外。
當 AI Agent 讀到這段程式碼並嘗試重構時，很可能會覺得該用精確的時間戳記計算，順手改回按小時比對。
這就完全破壞了原本刻意為學員爭取緩衝時間的設計。

### 在決策當下留下紀錄

專案裡往往塞滿了這類只寫在程式碼中、在其他地方完全看不出原因的微小決策。

把「有真實取捨、事後看會感到意外」的關鍵決策統一存放在專案頂層的 `docs/adr` 資料夾。
AI Agent 在規劃與修改功能時，就能隨時找到並參考這些歷史脈絡。

記錄必須在拍板定案的當下完成。
針對需求進行深入推敲與盤問（grilling）時，正是各種架構與業務決策成型的時刻。
在透過文件梳理需求時，領域建模與架構決策記錄通常也會在此時同步進行。
