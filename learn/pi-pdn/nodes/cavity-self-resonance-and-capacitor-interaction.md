---
id: cavity-self-resonance-and-capacitor-interaction
title: "Cavity 的自共振，與電容擺哪裡才有效"
subject: pi-pdn
tier: 4
order: 11
status: draft
goal: "算出 cavity 的 series LC fres ≈ 1 GHz/D，並用 Lspread/Lmount 判斷它是 transparent 還是 location matters。"
digests:
  - pdn-principles.9.part.md
  - pdn-principles.10.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Cavity 的自共振，與電容擺哪裡才有效

## Lesson

spreading inductance 大多集中在 via 附近、cavity 電容大多在板邊，所以第一個阻抗谷是 series LC 共振，而不是 modal resonance。這個 node 用 fres ≈ 1 GHz / 板子英吋把 cavity 的谷算出來，並用 Lspread 與 Lmount 的比值回答一個實務問題：電容擺哪裡到底有沒有差。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
