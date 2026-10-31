---
id: domain-language
title: "Domain Language：一個概念，一個名字"
subject: real-agent
tier: 1
order: 1
status: written
goal: "用 GLOSSARY.md 把散在 UI、email 與識別字的三種叫法收斂成一種，並在程式裡改到一致。"
digests:
  - 001 Domain Language.en.md
  - 002 Using Grill with Docs.en.md
  - 003 Using Grill with Docs Solution.en.md
prerequisites: []
steps:
  - id: three-names-one-thing
    title: "同一個東西，三個名字"
    purpose: "能從 UI、email 與識別字指出同一概念的多個名字，並說明它如何讓 agent 重複造碼。"
    sources:
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L1-L48]]"
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L49-L84]]"
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L85-L120]]"
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L121-L176]]"
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L177-L220]]"
  - id: ubiquitous-language
    title: "Ubiquitous language：每個地方都用同一個字"
    purpose: "能用 ubiquitous language 說明 glossary 為什麼要讓產品文字、團隊對話與程式使用同一個詞。"
    sources:
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L221-L280]]"
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L281-L348]]"
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L349-L392]]"
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L393-L444]]"
      - "[[sources/real-agent/20261030/Language/001 Domain Language.en.srt#L445-L467]]"
  - id: grill-with-docs
    title: "用 Grill with Docs 找出正確的字"
    purpose: "能用 Grill with Docs 開場，盤點所有別名並問出使用者真正會說的字。"
    sources:
      - "[[sources/real-agent/20261030/Language/002 Using Grill with Docs.en.srt#L1-L16]]"
      - "[[sources/real-agent/20261030/Language/002 Using Grill with Docs.en.srt#L17-L31]]"
      - "[[sources/real-agent/20261030/Language/002 Using Grill with Docs.en.srt#L32-L63]]"
      - "[[sources/real-agent/20261030/Language/002 Using Grill with Docs.en.srt#L64-L91]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L1-L27]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L28-L47]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L48-L81]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L82-L116]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L117-L163]]"
  - id: scenario-testing
    title: "Scenario testing：一個詞還是兩個詞"
    purpose: "能用 scenario testing 判斷一個概念需要一個詞還是兩個詞，並定出它的生命週期與邊界。"
    sources:
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L164-L211]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L212-L311]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L312-L451]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L452-L567]]"
  - id: unify-the-application
    title: "把應用程式統一在那個字上"
    purpose: "能把定稿的 glossary 落到程式：改 enum、變數、文案與 migration，讓三處說同一個字。"
    sources:
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L568-L700]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L701-L866]]"
      - "[[sources/real-agent/20261030/Language/003 Using Grill with Docs Solution.en.srt#L867-L1055]]"
created: 2026-10-30
updated: 2026-10-30
---

# Domain Language：一個概念，一個名字

## Lesson

課程先給你看三個名字指同一件事的現場：UI 說 cancel、email 說 reversal、帳戶頁說 chargeback，識別字也各走各的。這個 node 用 `/grill-with-docs` 把概念問清楚、寫成 GLOSSARY.md，再回頭把三處程式改到同一個字。它同時是整條系統的基座——後面 ADR、ticket、spec 都靠這份字表說話。

## Steps

1. [同一個東西，三個名字](domain-language/three-names-one-thing.md)
2. [Ubiquitous language：每個地方都用同一個字](domain-language/ubiquitous-language.md)
3. [用 Grill with Docs 找出正確的字](domain-language/grill-with-docs.md)
4. [Scenario testing：一個詞還是兩個詞](domain-language/scenario-testing.md)
5. [把應用程式統一在那個字上](domain-language/unify-the-application.md)
