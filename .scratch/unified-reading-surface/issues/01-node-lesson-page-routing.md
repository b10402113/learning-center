# 01 — Node 課文全頁：共享文件頁 + 路由 + breadcrumb + 捲動

Type: task
Status: ready-for-agent
Parent: `.scratch/unified-reading-surface/spec.md`

## What to build

學習者貼上 `#/nodes/<subject>/<id>` 時直接落地一堂課的完整三欄文件頁（課文），
`#/elements/<subject>/<id>?from=<node>` 落地 element 的完整文件頁；兩者共用同一套
三欄版面——左課程導覽（只列課程節點）、中央文章、右欄。element 頁右欄 = 本頁 TOC →
進度卡 → subject 元素索引；node 頁右欄 = 本頁 TOC → 進度卡 → 該 node 教的/關聯元素。
element 頁 breadcrumb 顯示 `subject / 來源課文 / element 標題`，點課文段隨時跳回該堂課；
無來源時退回第一個教授它的 node、再無則 `subject / 元素 / title`。node 頁 breadcrumb 為
`subject / 課文標題`。長文可向下捲動到底。此票同時建立路由純函式契約與來源解析，
是唯一單測 seam。

## Acceptance criteria

- [ ] `parseHash` 解析 `#/nodes/<subject>/<id>` 回傳 node 路由；`#/elements/<subject>/<id>?from=<node>` 回傳 element 路由與 `from`；無 `from` / 空 hash / 不認識 prefix 一律回退（沿用既有 fallback）；含需 URL-encode 字元時 `buildNodeHash`/`buildElementHash` → `parseHash` 正確 round-trip
- [ ] 來源解析純函式：`from` 指向真實存在的 node 時採用；否則退回第一個教授該 element 的 node；沒有教授 node 時回退「無來源」
- [ ] 既有 `hashlink.test.ts`、`completion.test.ts`、`progress.test.ts`、`mdx.test.tsx`、`generator.test.ts` 全數保持綠；`npm run typecheck` 與 `npm run build` 通過
- [ ] `#/nodes/<subject>/<id>` 落地 node 課文全頁：左課程導覽（只列課程節點）、中央課文（既有 MDX 管線、頁頭擁有標題）、右欄 TOC→進度→該 node 教的與關聯元素；status/duration/goal 依實際資料欄位顯示，缺則優雅省略
- [ ] element 頁收斂為共享文件頁：左欄移除元素清單（只留課程）；右欄 = 本頁 TOC → 進度卡 → subject 元素索引；點左欄 node 直接跳到該課文全頁、點索引 element 跳到該 element 全頁
- [ ] element 頁 breadcrumb `subject / 來源課文 / element 標題`：點 subject 回地圖、點課文段跳回該課文全頁；deep-link 帶 `?from` 落地後 breadcrumb 直接可用
- [ ] 長文可向下捲動（element 與 node 全頁皆然）；既有 element 功能（測驗 gating、video 播放、wikilink、聚焦模式、完成標記與地圖同步）回歸不變
- [ ] 人工驗證（`npm run dev`）：node/element deep-link 落地、breadcrumb 往返課文、兩頁版面一致

## Reference files

- [ ] `knowledge-map/src/lib/hashlink.ts` + `__tests__/hashlink.test.ts`（路由契約、來源解析、唯一單測 seam）
- [ ] `knowledge-map/src/App.tsx`（分派 node 路由；`?from` 傳入 element 頁）
- [ ] `knowledge-map/src/components/ElementPage.tsx`（收斂為共享文件頁：左欄、右欄、breadcrumb）
- [ ] `knowledge-map/src/components/NodePage.tsx`（新增，node 課文三欄頁）
- [ ] `knowledge-map/src/lib/mdxRegistry.ts`、`mdxComponents.tsx`、`completion.ts`、`progress.ts`（文章渲染與完成度重用）
- [ ] `knowledge-map/src/app.css`（`.element-page` grid 捲動修復）

## Blocked by

None — can start immediately.
