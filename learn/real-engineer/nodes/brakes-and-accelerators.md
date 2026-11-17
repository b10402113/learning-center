---
id: brakes-and-accelerators
title: "煞車與加速器"
subject: real-engineer
tier: 1
order: 1
status: written
goal: "能用「先裝煞車、再踩油門」說出這門課的順序，並把 Cadence 跑在自己的 fork 上、用 reset 與 cherry-pick 跟上課程。"
digests:
  - 001 Where We're Going.en.md
  - 002 Which Model Should I Use.en.md
  - 003 Setting Up Your Agent.en.md
  - 006 Repo Setup.en.md
  - 007 How To Take This Course.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites: []
steps:
  - id: brakes-before-accelerators
    author: "google/gemini-3.8-flash"
    title: "先裝煞車再踩油門：打造真正可靠的軟體工廠"
    purpose: "能用「先裝煞車、再踩油門」說出這門課的順序，並認出哪些做法屬於煞車。"
    sources:
      - "[[sources/real-engineer/20261116/course/001 Where We're Going.en.txt#L1-L37]]"
  - id: prepare-agent-and-model
    author: "google/gemini-3.8-flash"
    title: "挑選模型方案與清理全域設定：讓 Agent 進入起跑狀態"
    purpose: "能用 Opus 等級的訂閱與乾淨的全域設定，把 agent 準備成課程示範的起跑狀態。"
    sources:
      - "[[sources/real-engineer/20261116/course/002 Which Model Should I Use.en.txt#L1-L27]]"
      - "[[sources/real-engineer/20261116/course/003 Setting Up Your Agent.en.txt#L1-L25]]"
  - id: fork-cadence
    author: "google/gemini-3.8-flash"
    title: "建置 Cadence 專案：從 Clone、建立自己的 Public Repo 到啟動開發伺服器"
    purpose: "能把 Cadence clone 下來、fork 成自己的 public repo，並在本機跑起 dev server。"
    sources:
      - "[[sources/real-engineer/20261116/course/006 Repo Setup.en.txt#L1-L57]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/README.md#L1-L161]]"
  - id: sync-with-checkpoints
    author: "google/gemini-3.8-flash"
    title: "如何在實作課程中同步程式碼檢查點"
    purpose: "能用 reset、cherry-pick、pull 跟上課程檢查點，並在 reset 後補跑安裝與 seed。"
    sources:
      - "[[sources/real-engineer/20261116/course/007 How To Take This Course.en.txt#L1-L63]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/README.md#L1-L161]]"
created: 2026-11-16
updated: 2026-11-16
---

# 煞車與加速器

## Lesson

這門課的中心命題不是「agent 有多快」，而是「你憑什麼信任它替你出貨」。先建立這個心智模型，再把練習環境（fork 出來的 Cadence repo、reset 與 cherry-pick 的檢查點機制）弄到可以重複實驗，後面每一層煞車才有地方安裝。

## Steps

1. [先裝煞車再踩油門：打造真正可靠的軟體工廠](brakes-and-accelerators/brakes-before-accelerators.md)
2. [挑選模型方案與清理全域設定：讓 Agent 進入起跑狀態](brakes-and-accelerators/prepare-agent-and-model.md)
3. [建置 Cadence 專案：從 Clone、建立自己的 Public Repo 到啟動開發伺服器](brakes-and-accelerators/fork-cadence.md)
4. [如何在實作課程中同步程式碼檢查點](brakes-and-accelerators/sync-with-checkpoints.md)
