---
id: control-ownership-spectrum
title: Control Ownership Spectrum（控制權光譜）
label: Control Ownership Spectrum
subject: ai-agent-workflows
type: concept
status: draft
summary: 依「誰決定下一個箭頭」把系統分成 workflow、single-agent、multi-agent 三層。
aliases:
  - control-spectrum
prerequisites: []
related:
  - workflow
  - routing
  - prompt-chaining
  - supervisor
  - peer-to-peer-topology
sources:
  - '[[sources/ai-agent-workflows/20261105/course/8-prompt-chaining.txt#L1-L51]]'
  - >-
    [[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L1-L34]]
created: 2026-11-06
updated: '2026-11-06'
---

# Control Ownership Spectrum（控制權光譜）

## 定義

控制權光譜用一個問題區分 LLM 系統：**誰決定下一個箭頭？** 箭頭指的是流程中的連線與分支。光譜有三層，控制權由左到右逐步讓出。

## 為什麼重要

「agent」不是一個非黑即白的標籤，而是一段控制權的讓渡。先認清自己要讓出多少，才不會在只需要固定流程時引入模型的不確定性，也才知道什麼時候該真的放手。

## 如何運作

三層依序是：

1. **Workflow**：所有箭頭由開發者寫死。模型只是其中一個步驟，不挑路徑。
2. **Single-agent**：開發者預先定義一組箭頭，模型自己從這組選項中挑下一個。
3. **Multi-agent**：模型不只挑箭頭，還決定下一個由哪個 agent 來挑。

## 例子

同一個職涯服務，在三層會長成不同樣子。Workflow 版本固定「挑職業 → 排路徑 → 找資金」；single-agent 版本給模型一組工具，讓它自己決定要不要先查學校或先查補助；multi-agent 版本則再讓模型決定把「查補助」交給哪個子 agent。

## 邊界與常見誤解

- **不是成熟度階梯**：往右不代表更進步，只代表讓出更多控制權。
- **不是越多自主越好**：自主換來適應力，代價是 context、可靠性與成本。
- **不是一次決定**：可以先做 workflow，量測後只針對真正需要的環節放寬。
- **光譜描述的是控制權，不是模型能力**：用更大的模型不會自動讓系統往右移。

## 進階

實務順序是從最左邊開始：先把控制權留在手上，用 [[workflow]] 解決問題；只有在明確需要模型自行判斷時，才往 [[routing]] 之後的方向讓出一步。每一次讓渡都應該能回答「這樣換到了什麼」。
