# 0002 — Tailwind v4 @theme：把設計稿變成可執行的 CSS 變數

- **日期**: 2026-08-22
- **Node**: design-system-boundary（step 2 / 4）
- **來源**:
  - `sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:1701-2100`
  - `learn/vertex-learning-platform/elements/tailwind-v4-tokens.mdx`

## 非顯而易見的領悟

1. **@theme 的變數名自動對應 utility class，這是最大的心智槓桿。** `--color-primary` → `bg-primary/text-primary/border-primary`、`--spacing-4` → `p-4/gap-4`、`--radius-md` → `rounded-md`。不需要在 config 宣告、不需要註冊——記住「變數名 = utility 命名空間」這條規則，就能從設計稿直接推到 class。
2. **提取是機械性搬運，不是設計判斷。** 四個層次（色彩 / 字級 / 間距 / 圓角陰影）都是照抄設計稿數值。這與 Lesson 1 的「AI 只複製不設計」是同一信念的技術化：token 讓「複製」變成查表。
3. **字級 token 一定要含 line-height 與 font-weight**，只記 font-size 會造成排版不一致——這是設計稿轉 token 時最容易被忽略的一層。
4. **v4 對 AI 的價值在於「讀一個檔案就夠」**：沒有 JS config 的翻譯層，AI（與人）的上下文負擔大幅下降。

## 對後續的影響

- step 3（typed component library）將直接引用這些 token（`bg-primary`、`rounded-md`…），所以命名對應規則要牢記。
- step 4（showcase）驗證的就是「元件庫 + token 組合」的渲染，token 檔是比對基準。
- 在自己的 Next.js 專案：取品牌色 → 寫 `--color-primary` → `npm run dev` 驗證 `bg-primary`，是今晚就能跑完的最小閉環。

## 待覆核／開放問題

- @theme 未宣告的 `--color-x` 為何不能用：合理推測是 Tailwind v4 只把「宣告在 @theme 內」的變數納入 utility 生成，外部 CSS 變數不會自動變成 class——待實測確認。
- 間距若是非 4 倍數，記錄成 token 但可能偏離 scale 習慣——一致性優先於數學規則，這個取捨需要實作時驗證。
