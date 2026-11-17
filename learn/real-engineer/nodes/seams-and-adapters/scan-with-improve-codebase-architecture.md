# 用 improve-codebase-architecture 找出模組深化候選

前幾個 step 都是靠人工一個一個找接縫；當 codebase 一大，先讓 agent 掃一遍會快得多。

調整程式碼庫架構時，很難將重構前後的變化視覺化，也不容易一眼看出改動是否真的能改善系統結構。純文字的 AI 輸出往往無法清楚呈現架構藍圖。`improve-codebase-architecture` 這項技能就是為了解決這個問題。

它會掃描程式碼庫中的淺模組（shallow module），找出造成架構摩擦的段落。接著透過視覺化的 HTML 報告提出「深化（deepening）」提案，協助把分散混亂的邏輯整合成邊界清晰的深模組（deep module）。

## improve-codebase-architecture 的運作機制

這項技能可以直接由使用者呼叫。執行時會依序進行以下步驟：

<!--image:1-->

1. **載入領域詞彙與設計標準**：明確呼叫包含 `codebase-design` 的技能工具，取得專案的領域詞彙表（glossary）與架構術語，確保後續分析使用一致的詞彙。
2. **界定範圍並探索程式碼庫（Scope before you scan）**：先鎖定核心熱點（hot spots），帶著預設問題清單比對詞彙表與呼叫點。
3. **產出視覺化 HTML 報告**：將所有深化候選整理成網頁報告，呈現改動前後的結構對比，看清架構變化後再決定採納哪些重構。
4. **進入深入對話與領域塑模**：選定提案後，系統會自動呼叫 `grilling` 確認規格，並呼叫 `domain-modeling` 協助替整併出的新模組命名，再將新定義回饋給詞彙表。

一般不需要指定特定檔案，直接對代理人輸入「`improve codebase architecture`」，系統就會執行全域掃描。人工作業或程式碼審查時若發現明顯失控的區塊，也可以指定目標。以專案中的 `app/lib/access.server.ts` 為例，可以直接提示代理人：「我們的 `access.server.ts` 越來越失控了，是個適合深化的候選，請針對它進行改善。」

原本的存取權限檢查散落在各個路由，內部實作混亂且介面過淺：

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/access.server.ts#L86-L132 -->

```typescript
export async function getAccess(
  request: Request,
  courseId: number
): Promise<Access> {
  const userId = await getCurrentUserId(request);
  if (!userId) return SIGNED_OUT;

  const user = getUserById(userId);
  if (!user) return SIGNED_OUT;

  const course = getCourseById(courseId);
  const isAdmin = user.role === UserRole.Admin;
  const isOwningInstructor = course?.instructorId === userId;
  const isStaff = isAdmin || isOwningInstructor;
  const enrolled = isUserEnrolled(userId, courseId);
...
    canViewContent: isStaff || (enrolled && !ppp.blocked),
  };
}
```

## 讀懂報告中的關鍵指標與三個提案

代理人完成子任務掃描後，系統會開啟一份亮色模式（light mode）的 HTML 報告。報告頂端列出了幾項關鍵的現況數據：

<!--image:2-->

- 只有 4 個路由引用了 `access.server.ts`，卻有 25 個路由自行重新實作存取檢查。
- 整個程式碼庫中複製貼上了 15 份 `getUserById` 函式。
- 現有的 `access.server.ts` 測試數量為 0。

報告針對這些問題提出了對應的架構重構提案：

### 提案一：深化課程存取模組（Deepening Course Access Module）

- **現況問題**：模組太淺，各個路由直接存取資料庫並自行判斷邏輯。由於規則不一致，課程內容路由（lesson route）甚至會將內文直接回傳給沒有權限的訪客。
- **重構方案**：在 `app/modules/` 底下建立獨立的課程存取模組，統一回答「使用者是否被允許執行這項操作（may they）」。資料庫連線直接注入該模組，測試時則沿用 `createTestDb` 函式。
- **架構效益**：
  - **局部性（Locality）**：權限邏輯集中在單一模組，一次刪除 9 處重複函式。
  - **槓桿（Leverage）**：單一介面支援 15 處呼叫點，成為程式碼庫的核心深模組。

### 提案二：建立請求檢視者接縫（Viewer Seam）

- **現況問題**：每個路由都必須自行解析 `Request`、讀取 Cookie 中的 `userId`、查詢使用者並確認角色。各路由散落著 18 處拋出 401 錯誤的程式碼，錯誤訊息共有 4 種不同措辭。目前的 `getCurrentUserId` 只是 Cookie Session 的淺層封裝。
- **重構方案**：建立專門將 `Request` 轉換為 `Viewer` 的介面模組。課程存取模組只需接收 `Viewer`，不再依賴原始的 HTTP `Request`。所有 401 檢查與拒絕邏輯統一由該函式處理。

### 提案三：命名並統一購買國別規則（PPP Rule）

- **現況問題**：領域詞彙表沒有明確定義購買力平價（Purchasing Power Parity, PPP）阻擋規則。3 個不同的呼叫點針對未知國家各自實作了不同的 PPP 重算比對邏輯。
- **重構方案**：將國別規則收攏至單一位置，消除非預期的邏輯分歧，同時在領域詞彙表中明確記錄此概念。

報告末尾還包含一項標註為「投機性（speculative）」的提案（統一 Team Admin 的定義），這類提案可以直接略過。

## 評估與推進重構決策

報告給出的最優先建議是實作提案一（建立課程存取深模組），並強烈建議搭配提案二（Viewer 接縫）。將請求轉為 Viewer 能徹底解開權限檢查與 HTTP 傳輸細節的耦合，再合併提案三解決 PPP 的重複邏輯，三者可以相輔相成。

<!--image:3-->

在代理人對話中直接回覆採納「提案 1、2、3」，代理人就會進入 `grilling` 深入訪談階段，進一步確認改動細節。架構重構通常十分消耗 Token，最佳工作流程是先透過訪談產出規格（to-spec），拆解成工單（to-tickets），最後再逐步實作（implement-spec）。

未來所有新增的深模組都要收納在 `app/modules/` 目錄下，讓專案中的 Dependency Cruiser 持續監控並守護模組邊界。透過這套流程，複雜的權限架構能沉澱為可靠的深模組，也為後續撰寫功能與測試打下穩固基礎。
