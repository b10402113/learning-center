# 從 Grilling、Spec 到 Implement Spec：完整走完一次架構重構

掃描報告給出候選與提案之後，最後要處理的是怎麼把它們走完；這一節把整條路徑串起來。

重構若只隨手修改程式碼，容易越改越發散。要將零散的權限邏輯整合成介面清晰、邊界受強制約束的模組，最穩健的做法是把流程切成四個階段：

1. **Grilling**：釐清邊界條件、修復隱藏 Bug 並收斂領域模型（Domain Modeling）。
2. **to spec**：把共識沉澱為明確的規格與測試接縫（Seam）。
3. **to tickets**：將規格拆解成具相依關係的有向無環圖（DAG）工單。
4. **implement-spec**：由 Agent 依據規格自動實作並通過所有測試。

---

## 延續 Grilling：在重構前釐清邊界與領域模型

接續先前的討論，進入實作前必須先透過提問（Grilling）逐一排查潛在的行為衝突與架構設計：

<!--image:1-->

- **Q1（存取 Bug）**：確認在這次重構中一併修復發現的權限 Bug。
- **Q2（模組邊界）**：原本有兩個候選方案，一個負責把 Request 解析為請求者，另一個負責判斷權限。兩者本質上屬於同一塊內聚邏輯，因此直接整合為帶有兩個進入點的單一模組。
- **Q3（國家代碼攜帶）**：評估 Viewer 是否需要直接帶有當前國家（current country）。只有部分購買力平價（PPP）檢查才需要國家資訊，因此要注意 `ResolveCountry` 是否會產生非必要的呼叫。若此呼叫成本不高，就不需要過度拆分。

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/ppp.ts#L46-L76 -->

```typescript
/**
 * Pure function to check if PPP access should be blocked.
 * Returns blocked=true when a discounted purchase is accessed from a different country.
 */
export function checkPppAccess(
  coursePrice: number,
  coursePppEnabled: boolean,
  purchaseCountry: string | null,
  currentCountry: string | null
): { blocked: boolean; blockedCountry: string | null; purchaseCountry: string | null } {
  const result = { blocked: false, blockedCountry: null as string | null, purchaseCountry: null as string | null };

  // Skip: free courses or PPP-disabled courses
  if (coursePrice <= 0 || !coursePppEnabled) return result;
...
  // Discounted purchase — verify country match
  if (currentCountry && currentCountry !== purchaseCountry) {
    result.blocked = true;
    result.blockedCountry = currentCountry;
    result.purchaseCountry = purchaseCountry;
  }

  return result;
}
```

- **Q4（領域命名收斂）**：針對「課程擁有者或平台管理員」這類角色，不額外創造新名詞（如 `course steward`），而是直接以能力（Capability）命名，例如「可管理課程（can manage the course）」、「可審查討論（can moderate discussions）」。
- **Q5（錯誤處理機制）**：課程存取判斷不需要拋出例外（throw），直接回傳純決策物件（plain decision）最為單純。
- **Q6 & Q7（劃位限制與過度防護）**：檢查發現現有系統在學生領取團隊席位（claim seat）時，若團隊授權的購買國家與學生所在國家不同就會擋下，這屬於非預期的 Bug；但領取席位後的存取檢查（get access）因為學生本身沒有購買紀錄，所以不會阻擋。評估後先保留這個既有行為。
- **Q8（平台管理員權限不一致）**：現有系統中平台管理員被排除在部分操作之外，這不合理，管理員應具備所有功能的存取權限。
- **Q9（請求者命名）**：詞彙表（Glossary）已有 Student、Instructor、Platform Admin、Team Admin 四種角色，但缺少代表發送請求者的統稱。詞彙表過去曾非正式使用「Person」，此處正式採用 **Person** 取代語意模糊的 Viewer。
- **Q10 & Q11（能力定義與擺放位置）**：確認模組需回傳的各項課程權限能力，並確立相關程式碼的擺放位置。
- **Q12（PPP 規則收斂）**：將領域名詞明確定義：
  - **Purchasing power price**：依買方所在國家決定的折扣價。
  - **Country lock**：以購買力平價折扣購買的項目，僅限於購買國境內使用。
- **Q13 & Q14**：確認空狀態（Empty state）處理方式與實作路徑。

收斂完成後，觸發領域建模技能（Domain modeling skill）更新 `glossary.md`。將「Country lock」定義為「以購買力平價購買的項目僅限於購買國使用」，不滲入實作細節，日後實作變更時詞彙表依然適用。

---

## 介面雙重設計（Design it Twice）

在《A Philosophy of Software Design》中提過一個技巧：同一個介面設計兩次以上，再取各方案的優點。人工設計多個版本相當耗時，交給 AI Agent 時，可調派多個子 Agent 同步發散不同走向的介面：

<!--image:2-->

1. **設計 A（靈活性優先）**：呼叫端詢問動作權限，例如 `await coursePermissions.requirePerson(slug)` 搭配 `permission: 'lesson.complete'`。
2. **設計 B（極簡化介面）**：提供 `demand` 函式與 `courseCapabilitiesOf`。
3. **設計 C（常見呼叫端最佳化）**：提供極度簡化的 `requireCapability` 與 `requirePlatformAdmin`。

最終採用 **B 與 C 的混合方案**，兼顧深模組（Deep module）內部的功能完整性，以及常用呼叫端的易用性。

在擬定介面時常會浮現未曾考慮的細節，例如 Q24 定義了「受國家鎖定限制的學生（Country locked student）」。針對「團隊授權的 Country lock 僅在領取席位時套用」這項特殊規則，建立架構決策紀錄（ADR）留存，並將詞彙表與 ADR 的更新合併至 main 分支。

---

## to spec 與 to tickets：建立測試接縫與工作相依圖

確認共識後，呼叫 `to spec` 生成規格：

<!--image:3-->

- 系統會確認需要設置的**測試接縫（Test Seams）**位置。
- 規格確認後發布至 GitHub Issue（如 Issue #36）。
- 執行 `to tickets`，將重構工作拆解成 11 張工單，並自動排列出有向無環圖（DAG），標明工單之間的相依順序。

重構的工單拆分可保持彈性，只要相依關係明確，就能進入實作階段。

---

## implement-spec：產出邊界受強制的深模組

清空上下文後，以規格編號執行實作（`implement spec 36`）：

<!-- derived -->

```bash
# 在實作分支上執行驗證
npm run check
```

系統在 `permissions` 下建立了完整的模組，包含兩個主要進入點：
- `person.server.ts`
- `coursePermissions.server.ts`

<!--image:4-->

模組顯式宣告內部需要的依賴（例如資料庫），形成天然的測試接縫。公開介面對外提供三個核心能力：
- `decide`：判斷特定人（或訪客）是否能查看、參與或管理課程。
- `getCourseDecisions`：取得特定課程的所有決策清單。
- `requireCapability`：在路由中強制檢查權限。

### 實際呼叫場景

在路由層（例如 `course.lessons.quiz.tsx`），原本散落各處的判斷邏輯全部收斂為高槓桿的呼叫：

<!-- derived -->
```typescript
// 課程管理權限檢查
await requireCapability(request, 'manageCourse');

// 平台管理員檢查
await people.requirePlatformAdmin(request);
```

重構後的模組帶來幾項明確好處：
- **深模組設計**：隱藏繁瑣的國家比對與角色權限檢查，呼叫端只用極少程式碼就能確保安全性。
- **高槓桿性（High Leverage）**：後續由 Agent 開發新功能時，不需在每個路由重寫權限檢查邏輯，能大幅節省 Token 並降低出錯率。
- **真實反映行為的測試**：測試針對邊界接縫驗證，避免寫出「測試自己實作細節」的重言式測試（Tautological tests）。
