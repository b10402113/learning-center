---
id: second-brain
title: "Second Brain：整份 workspace 的活地圖"
subject: rubric
tier: 1
order: 3
status: written
goal: "解釋節點圖如何由掃描重建，以及把檢索移出模型為何能省 token。"
digests:
  - 03-second-brain.md
  - rubric-second-brain.md
prerequisites:
  - learn/rubric/nodes/agentic-os-and-arms.md
steps:
  - id: living-map
    author: "google/gemini-3.8-flash"
    title: "Second Brain：工作區的動態地圖與磁碟重建機制"
    purpose: "說明 Second Brain 這張圖代表什麼，以及每次載入為何都從磁碟重建。"
    sources:
      - "[[sources/rubric/20261108/course/03-second-brain.txt#L3-L5]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/scan.js#L129-L189]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/scan.js#L196-L316]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/scan.js#L322-L400]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/server.js#L88-L101]]"
  - id: classification-rules
    author: "google/gemini-3.8-flash"
    title: "Second Brain 檔案分類機制：部門、ARMS 與存取權限的判定優先序"
    purpose: "用部門、ARMS 與 access 規則解釋檔案如何被分類，並說出優先序為何重要。"
    sources:
      - "[[sources/rubric/20261108/course/03-second-brain.txt#L3-L5]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/scan.js#L31-L42]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/scan.js#L46-L79]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/config/workspace.json#L1-L34]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/config/departments.json#L1-L62]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/config/access-overrides.json#L1-L3]]"
  - id: graph-on-screen
    author: "google/gemini-3.8-flash"
    title: "將工作區圖譜化為可導覽的互動地圖"
    purpose: "說明前端如何把同一份 graph 模型畫成可導覽的互動地圖，並支援展開與搜尋。"
    sources:
      - "[[sources/rubric/20261108/course/03-second-brain.txt#L3-L5]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/server.js#L30-L50]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/server.js#L65-L70]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/public/_core.js#L39-L63]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/public/_core.js#L114-L192]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/public/index.html#L63-L152]]"
  - id: retrieval-outside-model
    author: "google/gemini-3.8-flash"
    title: "將記憶檢索移出模型：用 bytes 與毫秒計算的檢索成本"
    purpose: "解釋 recall 與 store 為何把檢索移出模型，並用 bytes 與毫秒衡量省下的成本。"
    sources:
      - "[[sources/rubric/20261108/course/03-second-brain.txt#L3-L5]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/brain.js#L39-L160]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/brain.js#L163-L220]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/brain.js#L224-L242]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/brain.js#L246-L277]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/snippets/claude-md.md#L1-L23]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/config/workspace.json#L1-L34]]"
      - "[[sources/rubric/20261108/supplement/rubric-second-brain/README.md#L1-L153]]"
created: 2026-11-08
updated: 2026-11-08
---

# Second Brain：整份 workspace 的活地圖

## Lesson

Second Brain 現在隨 Agentic OS v2 一起下載，不再有獨立壓縮檔。它把 workspace 的每個檔案、skill、memory、routine 與外部 app 畫成一張可互動的圖，並用確定性程式碼而不是模型來檢索與儲存事實；這個節點會拆開掃描、索引與前端的資料流。

## Steps

1. [Second Brain：工作區的動態地圖與磁碟重建機制](second-brain/living-map.md)
2. [Second Brain 檔案分類機制：部門、ARMS 與存取權限的判定優先序](second-brain/classification-rules.md)
3. [將工作區圖譜化為可導覽的互動地圖](second-brain/graph-on-screen.md)
4. [將記憶檢索移出模型：用 bytes 與毫秒計算的檢索成本](second-brain/retrieval-outside-model.md)
