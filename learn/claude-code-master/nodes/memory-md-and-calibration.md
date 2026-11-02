---
id: memory-md-and-calibration
title: "MEMORY.md、自動記憶與 calibrate"
subject: claude-code-master
tier: 3
order: 10
status: written
goal: "建出「索引指向 artifact」的 MEMORY.md，知道自動記憶何時寫、何時該用 `/calibrate` 回寫。"
digests:
  - 5-Module_C5_-_Memory_MD_explained.md
  - 6-Module_C6_-_Automatic_memory.md
  - 7-Module_C7_-_Memory_in_context.md
  - 8-Module_C8_-_The_calibrate_skill.md
prerequisites: []
steps:
  - id: memory-md-is-the-index
    title: "MEMORY.md 就是一份索引"
    purpose: "分辨 CLAUDE.md 與 MEMORY.md 兩層記憶，並說明 MEMORY.md 為何是索引而不是儲存。"
    sources:
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/5-Module C5 - Memory MD explained/5-Module_C5_-_Memory_MD_explained.en.vtt#L1-L43]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/5-Module C5 - Memory MD explained/5-Module_C5_-_Memory_MD_explained.en.vtt#L44-L76]]"
  - id: memory-artifact-and-pointer-chain
    title: "memory.md 其實只是一份短清單"
    purpose: "說明一個 memory artifact 的 name／description／body 形狀，以及巢狀指標如何只載入相關檔案。"
    sources:
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/5-Module C5 - Memory MD explained/5-Module_C5_-_Memory_MD_explained.en.vtt#L77-L124]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/5-Module C5 - Memory MD explained/5-Module_C5_-_Memory_MD_explained.en.vtt#L125-L160]]"
  - id: automatic-memory-writes
    title: "memory.md 是怎麼自己填滿的？"
    purpose: "判斷自動記憶何時自己寫入，並用自然語言要求它記住某件事，而不是手改檔案。"
    sources:
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/6-Module C6 - Automatic memory/6-Module_C6_-_Automatic_memory.en.vtt#L1-L34]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/6-Module C6 - Automatic memory/6-Module_C6_-_Automatic_memory.en.vtt#L35-L75]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/6-Module C6 - Automatic memory/6-Module_C6_-_Automatic_memory.en.vtt#L76-L115]]"
  - id: memory-context-bill
    title: "超過五萬 token，就該審記憶檔了"
    purpose: "用 `/context` 量出兩份記憶的 token，並在超過五萬時決定先砍哪一個。"
    sources:
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/7-Module C7 - Memory in context/7-Module_C7_-_Memory_in_context.en.vtt#L1-L25]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/7-Module C7 - Memory in context/7-Module_C7_-_Memory_in_context.en.vtt#L26-L60]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/7-Module C7 - Memory in context/7-Module_C7_-_Memory_in_context.en.vtt#L61-L115]]"
  - id: calibrate-at-session-end
    title: "每次結束 session，都用一次叫 calibrate 的 skill"
    purpose: "在 session 結尾跑 `/calibrate`，把修正寫回 memory 與 skill，讓下一次從更好的預設開始。"
    sources:
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/8-Module C8 - The calibrate skill/8-Module_C8_-_The_calibrate_skill.en.vtt#L1-L44]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/8-Module C8 - The calibrate skill/8-Module_C8_-_The_calibrate_skill.en.vtt#L45-L67]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/8-Module C8 - The calibrate skill/8-Module_C8_-_The_calibrate_skill.en.vtt#L68-L107]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/8-Module C8 - The calibrate skill/8-Module_C8_-_The_calibrate_skill.en.vtt#L108-L132]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/8-Module C8 - The calibrate skill/8-Module_C8_-_The_calibrate_skill.en.vtt#L133-L187]]"
created: 2026-10-31
updated: 2026-10-31
---

# MEMORY.md、自動記憶與 calibrate

## Lesson

MEMORY.md 不是把所有記憶塞進一個檔，而是一個索引，指向一個一個 artifact。自動記憶會自己寫，`/calibrate` 則負責把 session 裡的修正變成下一次的預設。

## Steps

1. [MEMORY.md 就是一份索引](memory-md-and-calibration/memory-md-is-the-index.md)
2. [memory.md 其實只是一份短清單](memory-md-and-calibration/memory-artifact-and-pointer-chain.md)
3. [memory.md 是怎麼自己填滿的？](memory-md-and-calibration/automatic-memory-writes.md)
4. [超過五萬 token，就該審記憶檔了](memory-md-and-calibration/memory-context-bill.md)
5. [每次結束 session，都用一次叫 calibrate 的 skill](memory-md-and-calibration/calibrate-at-session-end.md)
