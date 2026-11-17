# 用 Seam 與 Adapter 拆解難以測試的程式碼

診斷出某個模組該加深之後，常會發現它根本連測都測不了；這時需要的是接縫的詞彙。

當程式碼變得難以寫測試時，往往是因為缺少精準的詞彙，很難一眼指出問題出在哪裡。

例如在一個專案中，`access.server.ts` 完全沒有任何測試檔。它非常難測：內部會自行讀取 session cookie、呼叫 `resolveCountryRequest`，還直接連向全域資料庫。

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/access.server.ts#L1-L13 -->

```typescript
import { data } from "react-router";
import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import {
  UserRole,
  users,
  courses,
  enrollments,
  purchases,
} from "~/db/schema";
import { getCurrentUserId } from "~/lib/session";
import { resolveCountry } from "~/lib/country.server";
import { checkPppAccess } from "~/lib/ppp";
```

為什麼這類模組會難以測試？要說清楚這個問題，需要用到軟體工程的兩個核心觀念：**Seam（接縫）** 與 **Adapter（配接器）**。

## 什麼是 Seam 與 Adapter？

模組之間會彼此依賴、互相呼叫，而它們相遇、銜接的地方，就是模組介面所在的位置。

<!--image:1-->

**Seam（接縫）**是指**不必直接修改該處程式碼，就能改變系統行為的地方**。許多憑感覺隨意堆疊寫出的程式碼（vibe-coded），本質上就是缺乏接縫的遺留代碼（legacy code）。接手 legacy codebase 時，往往會因為接縫嚴重不足，導致測試無從下手。接手後的第一步，就是找出需要調整的模組，並在周圍切出接縫。

接縫所對接的具體實作，就是源自 Ports and Adapters 架構的 **Adapter（配接器）**。它負責在接縫處滿足該介面的需求。

在目前的架構中，loader 會呼叫 `access.server.ts`，而 `access.server.ts` 直接寫死了對真實資料庫的呼叫：

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

只要執行 `access.server.ts` 的測試，就非得連上真實資料庫不可。如果直接對著正式環境跑測試，很有可能誤刪線上資料。

解決方法是在 `access.server.ts` 與資料庫之間切出一道接縫。有了接縫，背後的實作就能隨時抽換：在實際運作時，接上存取正式資料庫的 live database adapter；在測試環境中，則替換成 test database adapter。

## 從小函式看接縫：以 daysSince 為例

接縫在程式碼裡到底長什麼樣子？來看計算天數差距的工具函式 `daysSince`：

<!-- source: sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/utils.ts#L17-L21 -->

```typescript
/** Whole days between an ISO timestamp and now. Negative values clamp to 0. */
export function daysSince(iso: string): number {
  const elapsed = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(elapsed / 86_400_000));
}
```

將計算邏輯抽成函式是個好做法，能避免重複邏輯散落各處。但是這個函式內部直接呼叫了 `Date.now()`，強烈依賴當前的系統時間。

這讓測試變得繁瑣。我們必須在測試框架裡設定假計時器（fake timers）來撥動系統時間，而且每次測試結束後都得手動還原。這樣雖然行得通，但並不乾脆。

<!--image:2-->

如果在 `daysSince` 上切出一道接縫，讓外部可以主動傳入當前時間：

<!-- derived -->
```typescript
export function daysSince(iso: string, now: number = Date.now()): number {
  const elapsed = now - new Date(iso).getTime();
  return Math.max(0, Math.floor(elapsed / 86_400_000));
}
```

多出來的這個 `now` 參數就是接縫。寫測試時不需要動用假計時器，只要在測試程式裡定義好 `now` 的時間戳記並傳進去即可。這道接縫讓 `daysSince` 既能在正式環境使用真實時間，又能在測試環境輕鬆改用假時間。

## 在 access.server.ts 切出一刀

同樣的概念套回 `access.server.ts`。具體的做法是：將原本龐雜的 `getAccess` 拆分成輕量的 request adapter，並讓核心的 `resolveAccess` 函式接受從外部傳入的資料庫實例。

<!--image:3-->

這種架構調整，背後正是接縫的運作原理：

- **Seam（接縫）**：模組介面所在的位置，讓你不必改動該處程式碼就能替換行為。
- **Adapter（配接器）**：在接縫處滿足該介面的具體實作（例如 Production DB 或 In-Memory Mock DB）。

掌握了接縫與配接器的思維，就擁有了重構遺留程式碼的核心能力。面對任何難以寫測試的模組，只要找出寫死相依的邊界、切出接縫、換上配接器，程式碼就能重獲可測試性與彈性。

下一個 step 就把這套思維套到一個真實的肥大 loader 上。
