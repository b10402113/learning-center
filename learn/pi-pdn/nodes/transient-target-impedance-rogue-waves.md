---
id: transient-target-impedance-rogue-waves
title: "暫態下的 target impedance、rogue wave 與 gating"
subject: pi-pdn
tier: 6
order: 20
status: draft
goal: "說明 Ztarget 在暫態為何成立、多峰如何疊出超標的 rogue wave，並算出 clock/power gating 的代價。"
digests:
  - pdn-principles.15.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 暫態下的 target impedance、rogue wave 與 gating

## Lesson

Ztarget = Vtolerance/Itransient 之所以成立，是因為單邊的電流衝擊配上 LC 重新居中後會給出雙邊的電壓擺幅；但在 AC 穩態下它對正弦保守 2 倍、對方波保守 1.6 倍。這個 node 再往前一步：多個同高、高 q 的峰可以把能量疊成超過 ±5% 的 rogue wave，而 clock gating、clock swallowing 與 power gating 正是製造這種波形的來源。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
