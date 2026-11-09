# Course App 文章字體大小控制

狀態：**已定案、尚未實作**
目標：在 header 加一組字體控制，只縮放閱讀用的 Markdown 內文，讓讀者不必依賴瀏覽器 zoom 也能調大字。

## 1. 背景與邊界

目前 `⌘ +` / `Ctrl +` 走的是瀏覽器頁面縮放，會連側欄、header、圖表一起放大；文章字級本身則寫死在 `src/components/Markdown.jsx` 的 Tailwind class（如 `prose-p:text-[1.08rem]`）。本功能補上「只放大文章」的缺口。

約束：

- 只放大 Markdown 內文（`.prose`），不動側欄、header、麵包屑、quiz 介面、來源清單。
- 不改變文章欄寬（`max-w-[816px]`）、不放大圖片、不改變程式區塊與表格的版面結構。
- 不攔截 `⌘ +` / `⌘ −`；瀏覽器縮放照常可用，兩者效果相乘。
- 不加任何套件；沿用現有 Tailwind + CSS 變數。
- 不做滑桿、不做拖曳、不做字體家族切換。
- 字級切換瞬間生效，不加 `transition: font-size`（reflow 卡頓，且違反 Quiet Paper Motion 只動 `opacity` / `transform` 的約定）。

## 2. 互動定義

在 header 主題按鈕左邊放一組 pill：

```text
[ A− ][ 125% ][ A+ ]
```

- 級距固定 5 級：`90% / 100% / 110% / 125% / 140%`，預設 `100%`。
- `A−` / `A+` 逐級切換；到上下界時 `disabled`。
- 中間百分比按鈕按一下重設回 `100%`，並作為目前級距的顯示。
- `role="group"` + `aria-label="文章字體大小"`；三顆按鈕都有 `aria-label` 與 `title`。
- 小螢幕只留 `A− 100% A+`，不顯示額外文字；與主題按鈕同尺寸，不擠壓 logo。
- 偏好存 `localStorage`，key `lc.articleFont`；重新載入、切換科目與 step 都保留。
- 無效值（`null`、`NaN`、超出範圍）吸附到最接近的合法級距，預設 `1`。

## 3. 技術方案（選定：CSS 變數 + em）

### 為什麼不用其他做法

| 做法 | 問題 |
| --- | --- |
| `html { font-size }` | 側欄、header、所有 `rem` 版型一起放大，不是文章專屬。 |
| 對文章容器 `zoom` | 連圖片、邊框、padding、欄寬一起縮放；`816px` 會溢出或需要再補償寬度。 |
| 逐元素用 `rem` 覆寫 | 需要 5 份 class 或行內 style，難維護且會和 Tailwind typography 打架。 |
| 滑桿 | 佔 header 空間、精度難控制、行動裝置不好按。 |

### 做法

把 `.prose` 自身的基準字級接上 CSS 變數，內文所有級距改成 `em`，外層再以變數控制基準值。`max-width: 70ch` 與單位為 `em` 的行高會自然跟著字級變化，維持每行字數。

## 4. 檔案改動

### 4.1 `src/index.css`

在現有 `:root` 加預設值：

```css
:root {
  --article-font-scale: 1;
}
```

在現有 unlayered 的 `.prose` 區塊（約 `index.css:492`）加：

```css
.prose {
  font-size: calc(1rem * var(--article-font-scale, 1));
}
```

`index.css` 這條規則未包在 `@layer` 內，會蓋過 typography plugin 的 `.prose { font-size: 1rem }`，不需要提高 specificity。

### 4.2 `src/components/Markdown.jsx`

把內文級距從 `rem` 改成 `em`（相對於 `.prose` 基準字級）：

```diff
- prose-h2:text-[1.5rem]
+ prose-h2:text-[1.5em]
- prose-h3:text-[1.2rem]
+ prose-h3:text-[1.2em]
- prose-h4:text-[1.05rem]
+ prose-h4:text-[1.05em]
- prose-p:text-[1.08rem]
+ prose-p:text-[1.08em]
- prose-li:text-[1.08rem]
+ prose-li:text-[1.08em]
- prose-pre:text-[0.88rem]
+ prose-pre:text-[0.88em]
- prose-th:text-sm
+ prose-th:text-[0.875em]
```

`prose-code:text-[0.85em]` 已經是 `em`，不動。

### 4.3 新增 `src/lib/article-font.mjs`

純函式，供 UI 與測試共用：

```js
export const ARTICLE_FONT_STEPS = [0.9, 1, 1.1, 1.25, 1.4];
export const DEFAULT_ARTICLE_FONT = 1;

export function normalizeArticleFont(value) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return DEFAULT_ARTICLE_FONT;
  let best = ARTICLE_FONT_STEPS[0];
  for (const step of ARTICLE_FONT_STEPS) {
    if (Math.abs(step - parsed) < Math.abs(best - parsed)) best = step;
  }
  return best;
}

export function nextArticleFont(current, direction) {
  const index = ARTICLE_FONT_STEPS.indexOf(normalizeArticleFont(current));
  const next = index + Math.sign(direction);
  if (next < 0 || next >= ARTICLE_FONT_STEPS.length) return null;
  return ARTICLE_FONT_STEPS[next];
}

export function formatArticleFont(scale) {
  return `${Math.round(normalizeArticleFont(scale) * 100)}%`;
}
```

### 4.4 新增 `src/components/ArticleFontControl.jsx`

```jsx
import {
  DEFAULT_ARTICLE_FONT,
  formatArticleFont,
  nextArticleFont,
} from "../lib/article-font.mjs";

export default function ArticleFontControl({ value, onChange }) {
  const smaller = nextArticleFont(value, -1);
  const larger = nextArticleFont(value, 1);
  const button =
    "px-2.5 py-1.5 font-label text-[11px] transition-colors " +
    "disabled:cursor-default disabled:text-ink-soft/40 " +
    "enabled:hover:text-accent";

  return (
    <div
      role="group"
      aria-label="文章字體大小"
      className="inline-flex items-center rounded-full border border-hairline bg-surface/70 text-ink ring-1 ring-transparent"
    >
      <button
        type="button"
        className={`${button} rounded-l-full`}
        disabled={!smaller}
        onClick={() => smaller && onChange(smaller)}
        aria-label="縮小文章字體"
        title="縮小文章字體"
      >
        A−
      </button>
      <button
        type="button"
        className={`${button} border-x border-hairline tabular-nums`}
        onClick={() => onChange(DEFAULT_ARTICLE_FONT)}
        aria-label={`文章字體 ${formatArticleFont(value)}，重設為 100%`}
        title="重設文章字體"
      >
        {formatArticleFont(value)}
      </button>
      <button
        type="button"
        className={`${button} rounded-r-full`}
        disabled={!larger}
        onClick={() => larger && onChange(larger)}
        aria-label="放大文章字體"
        title="放大文章字體"
      >
        A+
      </button>
    </div>
  );
}
```

### 4.5 `src/App.jsx`

```js
import ArticleFontControl from "./components/ArticleFontControl.jsx";
import {
  DEFAULT_ARTICLE_FONT,
  normalizeArticleFont,
} from "./lib/article-font.mjs";

const ARTICLE_FONT_KEY = "lc.articleFont";

function initialArticleFont() {
  try {
    return normalizeArticleFont(window.localStorage.getItem(ARTICLE_FONT_KEY));
  } catch {
    return DEFAULT_ARTICLE_FONT;
  }
}
```

state 與 effect：

```js
const [articleFont, setArticleFont] = useState(initialArticleFont);

useEffect(() => {
  document.documentElement.style.setProperty(
    "--article-font-scale",
    String(articleFont)
  );
  try {
    window.localStorage.setItem(ARTICLE_FONT_KEY, String(articleFont));
  } catch {
    /* private mode */
  }
}, [articleFont]);
```

header 內放在主題按鈕之前：

```jsx
<ArticleFontControl value={articleFont} onChange={setArticleFont} />
```

顯示條件：`subjectId && course` 時顯示（與專注模式按鈕一致），首頁不顯示。

### 4.6 新增 `src/lib/article-font.test.mjs`

用 `node:test` + `node:assert/strict`，涵蓋：

- `normalizeArticleFont`：`null` / `"abc"` / `0` / `9` → 合法級距；`1.3` 吸附到 `1.25`。
- `nextArticleFont`：`0.9` 往小回 `null`；`1.4` 往大回 `null`；`1 → 1.1`、`1 → 0.9`。
- `formatArticleFont`：`1 → "100%"`、`1.25 → "125%"`。

`package.json` 的 `test` script 已涵蓋 `src/lib/*.test.mjs`，不需修改。

## 5. 影響範圍

- `.prose` 也用於 `NodeView` 的 lesson intro 與 `BlockView` / block modal 的內文；這些同屬長篇閱讀，會一起套用同一偏好，視為預期行為。
- `StepView` 的 H1、麵包屑、來源清單、quiz 使用固定 `rem`，不隨控制放大；若之後要連同 H1 一起縮放，再另開一張票。
- 瀏覽器 zoom 與文章字級為乘法關係（例如瀏覽器 110% × 文章 125%）。
- 無 `prefers-reduced-motion` 影響（無動畫）。

## 6. 驗收清單

- [ ] 五級切換正常，`100%` 預設；到 `90%` / `140%` 時按鈕 disabled。
- [ ] 重新整理、切換科目、切換 step 後級距保留。
- [ ] 側欄、header、麵包屑、來源清單與 quiz 介面字級不變。
- [ ] 圖片、程式區塊、表格不放大；文章欄寬不變。
- [ ] 375 / 768 / 1280 寬下 140% 無水平滾動、無破版。
- [ ] 百分比按鈕可重設回 100%。
- [ ] 三顆按鈕可用鍵盤操作，`aria-label` 正確。
- [ ] 瀏覽器 `⌘ +` / `⌘ −` 仍可縮放，且與文章字級疊加。
- [ ] `npm test`、`npm run build` 通過。
