# 在 Route 層找出淺模組並排定深化清單

上一節的 deletion test 是在單一函式上判斷；這一節把它放大到整個 route 層。

當專案規模變大、程式碼陸續由 AI agent 經手後，route 層往往會堆積大量瑣碎的檢查與細節。

這些模組通常介面很薄，甚至直接把商業邏輯硬塞進 handler 裡，變成所謂的「淺模組」（shallow module）。

要找出這類模組並排出重構優先順序，可以直接提示 agent 探索後端程式碼。

目標是找出哪些程式碼該透過刪除測試（deletion test）直接移除，或是需要「深化」（deepen）成封裝完整的獨立核心。

## 提示詞與探索目標

給 agent 的探索 prompt 需要明確設定評估標準與範圍：

> 檢視程式碼庫，列出幾個潛在的淺模組候選，讓我們可以用刪除測試直接刪除，或是加以深化。

探索範圍優先鎖定在後端。

後端牽涉核心資安風險，也是逐步拉高測試涵蓋率的關鍵起點。

前端雖然也能做類似檢查，但若前端測試套件還不夠完整，先把心力放在後端效益最高。

agent 遍歷了專案檔案，直接整理出一份具體的候選清單，過程中沒有分派額外的 sub-agent。

## 候選一：肥大的課程路由檔案

Agent 提出的第一個改善對象，是龐大的課程章節檔案 `courses.$slug.lessons.$lessonId`。

<!--image:1-->

這個檔案混雜了過多職責，裡面還出現許多 `any` 型別。

這通常是 agent 為了繞過嚴格型別檢查留下的痕跡。

更嚴重的問題在於邏輯漏洞。

以提交測驗的 action 為例，程式碼開頭只檢查了使用者是否登入：

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.$slug.lessons.$lessonId.tsx#L872-L883 -->

```tsx
export async function action({ params, request }: Route.ActionArgs) {
  const { slug, lessonId } = parseParams(params, lessonParamsSchema);

  const course = getCourseBySlug(slug);
  if (!course) {
    throw data("Course not found", { status: 404 });
  }

  const currentUserId = await getCurrentUserId(request);
  if (!currentUserId) {
    throw data("You must be logged in", { status: 401 });
  }
```

在處理 `submit-quiz` 的分支中，程式直接計算了測驗結果：

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.$slug.lessons.$lessonId.tsx#L952-L976 -->

```tsx
  if (intent === "submit-quiz") {
    const quizId = Number(formData.get("quizId"));
    if (isNaN(quizId)) {
      throw data("Invalid quiz ID", { status: 400 });
    }
...
    const result = computeResult(currentUserId, quizId, selectedAnswers);
    if (!result) {
      throw data("Failed to score quiz", { status: 500 });
    }

    return { quizResult: result };
  }
```

這裡完全沒有確認該使用者是否真正具備存取權限（access）。

只要是登入狀態，就算沒有購買課程，也能送出答案。

正確的做法是把邏輯收攏進深模組。Agent 建議將這段邏輯深化為一個新模組（例如 `submitQuizAttempt`）。

深化之後，route 本身只需要兩行宣告：先呼叫 `requireContentAccess`，接著執行 `submitQuizAttempt`。

複雜的驗證與計算細節交給深模組處理，route 就能保持乾淨清晰。

<!--image:2-->

## 候選二：缺少測試的存取控制模組

第二個候選項目是 `access.server.ts`。

這份檔案是全系統最關鍵的資安核心，卻沒有任何對應的測試檔。

最核心的防線處於零測試防護的狀態。

它難以測試的原因在於跟外部環境高度耦合。

它會直接讀取 session cookie、呼叫 `resolveCountryRequest`，還會存取全域資料庫：

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/access.server.ts#L86-L99 -->

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
```

介面不好用，雪上加霜的是，大多數 route 根本沒有使用這個模組。

許多 route 選擇自己重寫一遍檢查步驟：先抓使用者 ID、撈角色資料，接著確認權限並判斷是否為管理員。

<!--image:3-->

在 `instructor.$courseId.tsx` 的 loader 中可以看到這種寫法：

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/instructor.$courseId.tsx#L553-L586 -->

```tsx
export async function loader({ params, request }: Route.LoaderArgs) {
  const currentUserId = await getCurrentUserId(request);

  if (!currentUserId) {
    throw data("Select a user from the DevUI panel to manage courses.", {
      status: 401,
    });
  }

  const user = getUserById(currentUserId);

  if (
    !user ||
    (user.role !== UserRole.Instructor && user.role !== UserRole.Admin)
  ) {
    throw data("Only instructors and admins can access this page.", {
      status: 403,
    });
  }
...
  if (course.instructorId !== currentUserId && user.role !== UserRole.Admin) {
    throw data("You can only edit your own courses.", { status: 403 });
  }
```

類似的檢查邏輯也重複出現在 `instructor.courseID.lessons.lessonID.quiz.tsx` 等其他路由中。

到處複製程式碼會破壞局部性（locality）。

未來存取規則一旦調整，就必須逐一翻遍所有路由修改。

依據刪除測試的標準，這些散落各處的行內副本（inline copies）才是應該刪掉的對象。

邏輯複雜度被分散在多個呼叫端，只要漏掉一個副本，就會形成資安破口。

這份模組的深化方向針對 `access.server.ts`，agent 建議將它深化：
1. 外層做成輕量的轉接層（thin adapter），負責處理 request 與 session。
2. 內層抽成乾淨的核心函式（core function），單純接收資料庫 ID、使用者 ID、課程 ID 與國家代碼來判斷權限，不再綁定全域物件或請求物件。

<!--image:4-->

## 通過刪除測試的小模組

除了需要深化的對象，探索過程也找出了看似很小、但能通過刪除測試的模組。

例如 `lib/notes.ts` 裡的 `MAX_NOTE_LENGTH` 常數。

這段程式碼只有短短幾行，但前端與後端都在使用。

如果把它刪掉，定義與校驗的複雜度就會流回各個呼叫端，因此保留它是正確的選擇。

## 重構先後順序建議

針對後續改善步驟，綜合上述分析，agent 排出了一份處理順序：

<!--image:5-->

1. **測驗排序與學習進度（quiz ordering and progress）**：先處理商業邏輯明確、能快速補齊測試的流程。
2. **存取控制核心（access core）**：將 `access.server.ts` 拆成純核心與薄轉接器，換取最高價值的測試覆蓋效益。
3. **遷移講師路由（instructor routes）**：移除散落在各個講師路由的行內權限檢查，統一收進新建立的 access 核心。

只要架構方向清晰，戰術層面的探索就能交由 AI agent 執行。

透過「深化模組」與「刪除測試」這兩項原則，就能精準找出程式碼庫中最該改善的位置。
