# 相機與 deep-link

Type: task
Status: ready-for-agent
Parent: `.scratch/knowledge-nebula/spec.md`

## What to build

地圖的導覽控制與可分享性：開場鳥瞰整塔（像遊戲關卡選擇畫面），可 grab 拖移、滾輪/縮放手勢檢查細節，zoom/reset 按鈕回到鳥瞰。目前位置以 hash deep-link 表達（`#s=<subject>&p=<path-id>`），可分享、重整不丟失，開啟時自動聚焦該 tile。

## Acceptance criteria

- [ ] 載入時鳥瞰整塔（所有樓層可見）
- [ ] grab 拖移平移、滾輪縮放
- [ ] zoom/reset 按鈕回到鳥瞰
- [ ] hash deep-link `#s=<subject>&p=<path-id>` 可分享；開啟後還原 subject、選取並聚焦該 tile
- [ ] 切換 subject 與選取 tile 都會寫回 hash
- [ ] 縮放/平移有合理的邊界（不會把塔移到視野外迷失）

## Reference files

- [ ] `.scratch/knowledge-nebula/spec.md`
- [ ] `chartr/web/src/lib/starmap/starmap.ts`（pan/zoom/相機先例）

## Blocked by

01 — 資料契約 + 生成器 + 鋸齒塔渲染（tracer bullet）
