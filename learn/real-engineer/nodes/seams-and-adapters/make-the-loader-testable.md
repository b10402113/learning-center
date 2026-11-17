# 重構 300 行的遺留 Loader：抽取深層模組、注入依賴與變異測試驗證

有了 seam 與 adapter 的觀念，就可以拿一個真實的肥大 loader 開刀。

接手維護龐大的舊程式碼時，最棘手的問題往往不是邏輯太深奧，而是所有邏輯全都塞在框架的入口函式裡。以講師數據分析頁面（`instructor.analytics.tsx`）為例，單一檔案就長達 2,000 行。光是負責抓取資料的 `loader` 就佔了將近 300 行。它的上方還堆疊了約 600 行的輔助函式（helper functions），而且完全沒有任何測試保護。

這個 `loader` 難以測試的原因主要有三個：
1. 它在內部直接呼叫全域資料庫實例（Global Database）。
2. 它在三個不同位置直接呼叫系統時鐘（例如 `new Date()`），產生不可控的時間依賴。
3. 實作細節全部內嵌（inlined），沒有抽成獨立函式。

原始的 `loader` 架構如下：

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/instructor.analytics.tsx#L797-L860 -->

```tsx
export async function loader({ request, url }: Route.LoaderArgs) {
  const { userId, isAdmin } = await requireInstructorOrAdmin(request);

  const range = parseAnalyticsRange(url.searchParams.get("range"));
  const tab: AnalyticsTab =
    url.searchParams.get("tab") === "course" ? "course" : "overview";

  // Instructors are pinned to their own figures; only an admin may look
  // elsewhere, and null means "every instructor".
  const instructorId = isAdmin
    ? parseId(url.searchParams.get("instructor"))
    : userId;
...
  const questionConditions = [
    isNull(comments.parentId),
    isNull(comments.deletedAt),
    // Staff asking their own question shouldn't queue up as work for themselves.
    ne(questionAuthor.role, UserRole.Admin),
    ne(comments.userId, courses.instructorId),
    notExists(staffReply),
  ];
```

如果直接針對這個 `loader` 寫測試，它只接收框架傳入的 `request` 與 `url`。外部缺乏接縫（seam）可以注入測試用的資料庫或特定時間點。

要提高測試覆蓋率、讓後續重構更有保障，最好的策略是將 `loader` 縮到極小，把龐大的商業邏輯交給「深層模組」（deep module）處理。

---

## 建立接縫：設計深層模組介面

深層模組的核心概念是「介面極小，隱藏的實作極多」。重構的第一步不是直接改寫商業邏輯，而是先確立介面設計：

<!--image:1-->

> 「在 Instructor Analytics 路由中有一個很難測試的 loader，我想徹底把它測過一遍。請在其中插入接縫（seams），並在動手前先跟我確認介面設計。」

抽出的新模組為 `InstructorAnalyticsServer.ts`，只對外導出單一函式 `getInstructorAnalytics`。這個函式接收一個物件參數：
- `database`：注入的資料庫實例。
- `viewer`：當前使用者身分（包含 `userId` 與 `isAdmin`）。
- `params`：原始的 `URLSearchParams`。
- `now`：注入的當前時間。

### 為什麼接收原始 `URLSearchParams`？

讓函式直接接收未解析的 `URLSearchParams`，而不是解析後的 `range` 與 `tab`，是重要的設計關鍵。這樣能把安全規則（例如「講師強制鎖定看自己的數據」、「課程所有權檢查」）全部收攏進模組內部。這些規則也因此能直接透過測試驗證。模組承擔更多邏輯、隱藏更多細節，模組本身就變得更深。

維持「單一函式」而非每個面板（panel）切一個函式，可以保證程式碼的內聚力（locality），避免邏輯散落。專案其他地方如果已有記憶體資料庫（in-memory database），直接沿用即可，不必另外做假資料庫（fake）。

---

## 縮減 Loader 與前後端分離

介面確立後執行重構原本 300 行的 `loader` 直接縮減成大約四行：

<!--image:2-->

<!-- derived -->

```tsx
export async function loader({ request, url }: Route.LoaderArgs) {
  const viewer = await requireInstructorOrAdmin(request);
  return getInstructorAnalytics({
    database: db,
    viewer,
    params: url.searchParams,
    now: new Date(),
  });
}
```

這項改動帶來兩大效益：
1. **前後端關注點分離**：原本 2,000 行的 `instructor.analytics.tsx` 降到約 1,000 行。留下來的幾乎全是純 JSX 前端畫面邏輯，後端查詢與計算邏輯全數移入 `getInstructorAnalytics`。
2. **獲得測試接縫**：商業邏輯本體與框架的 `request` 解耦。測試時可以自由傳入記憶體資料庫與固定的 `now` 時間字串。

---

## 建立測試與多樣化案例

在模組旁建立測試檔，先設定基礎假資料（fixtures）與種子資料（seeding）。資料包含一位講師、一門課、第二位講師、一位管理員與另一門課。

測試函式可以針對講師或管理員身分執行。有了乾淨的測試設定，測試程式碼會非常精簡。例如驗證安全鎖定規則：

<!-- derived -->

```ts
// 假定建立一位學生 Sam Student，購買第一位講師的課程付了 1,000，購買第二位講師的課程付了 5,000
// 當第一位講師登入查詢時，不論 URL 的 query params 如何竄改，都只能看到 1,000 的數據，看不到 5,000
```

測試直接呼叫深層模組，不必啟動完整的 HTTP 伺服器，就能涵蓋真實且龐大的商業邏輯。

---

## 用刻意植入 Bug 驗證測試品質

測試寫完且全數通過（Green）後，如何確認測試真的具備防護力？此時可以用「植入 Bug」（變異測試，mutation testing 的概念）來驗證。

<!--image:3-->

可以在模組內部逐一故意放入錯誤邏輯。例如在實作中刻意放進 12 個 bug：
- 其中 10 個 bug 在植入後，現有測試立刻失敗並抓出問題。
- 另外 2 個 bug 順利溜過測試，代表這兩處邏輯存在覆蓋盲點。
- 針對這溜過的 2 個 bug，立即補上對應的測試案例將其覆蓋。

透過「縮小入口、抽取深層模組、依賴注入、植入 bug 驗證測試」的重構流程，原本毫無保護的龐雜舊程式碼，就能轉變成具備高度防護力、易於維護與修改的健全架構。
