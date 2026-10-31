---
id: design-with-taste
title: "怎麼做出「不像 AI 生成」的網站"
subject: claude-code-master
tier: 7
order: 13
status: written
goal: "能走完 CRAFT 的 Create 段——抓區塊、/html 預覽、建設計系統、UI Sniping、/tweak、生圖——做出有品味的頁面。"
digests:
  - volume-f-taste-and-design.md
prerequisites: []
steps:
  - id: create-the-base
    title: "Create 的第一步：先決定有哪些區塊，再用 /html 預覽"
    purpose: "能列出一頁式網站該有的區塊、砍成第一版清單，再用 /html 把計畫變成可審的預覽頁。"
    sources:
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/2-Module F2 - Creating the Base/index.html#L94-L98]]"
  - id: build-design-system-x
    title: "把品味鎖進 Design System X：一個 prompt 洗掉 AI 味"
    purpose: "能用 /robo 重繪現有頁面，並把色碼、字體、間距與「不要什麼」寫成可重用的 /design-system-x skill。"
    sources:
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/3-Module F3 - Awesome Design Systems/index.html#L94-L98]]"
  - id: snipe-and-tweak
    title: "UI Sniping 與 /tweak：撿別人的元件，用自己的滑桿調"
    purpose: "能從 21st.dev 與 Robo Capture 取得元件，再用 /tweak 即時調整並把結果寫回原始碼。"
    sources:
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/4-Module F4 - UI Sniping/index.html#L94-L98]]"
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/5-Module F5 - -tweak/index.html#L94-L98]]"
  - id: generate-visuals
    title: "缺素材就自己生：/generate 接 Fal AI 生圖生影"
    purpose: "能判斷 Fal AI、Kie AI、WaveSpeed 的取捨，用 /generate 生出素材並放進頁面區塊。"
    sources:
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/6-Module F6 - Creative AI Aggregators/index.html#L94-L98]]"
  - id: grow-system-and-claude-design
    title: "讓系統長大：加互動元件，順便看 Claude Design"
    purpose: "能用一個 prompt 把互動元件加進 Design System X，並說出 Claude Design 在視覺工作流的位置。"
    sources:
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/7-Module F7 - Component Building/index.html#L94-L98]]"
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/8-Bonus- Claude Design/index.html#L94-L98]]"
created: 2026-10-28
updated: 2026-10-31
---

# 怎麼做出「不像 AI 生成」的網站

## Lesson

在 AI 時代，前端品味才是真正的差異點，別再交那種一眼就看出是「vibe-coded」的網站。這一課走 CRAFT 的前半段：先研究該有哪些區塊並用 `/html` 把計畫視覺化預覽，再用設計系統把 AI 味洗掉，用 UI Sniping 拆別人做好的元件、用 `/tweak` 拉滑桿即時改，最後接 AI 生圖補素材。

## Steps

1. [Create 的第一步：先決定有哪些區塊，再用 /html 預覽](design-with-taste/create-the-base.md)
2. [把品味鎖進 Design System X：一個 prompt 洗掉 AI 味](design-with-taste/build-design-system-x.md)
3. [UI Sniping 與 /tweak：撿別人的元件，用自己的滑桿調](design-with-taste/snipe-and-tweak.md)
4. [缺素材就自己生：/generate 接 Fal AI 生圖生影](design-with-taste/generate-visuals.md)
5. [讓系統長大：加互動元件，順便看 Claude Design](design-with-taste/grow-system-and-claude-design.md)
