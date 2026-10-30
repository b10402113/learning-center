---
id: suppressing-cavity-resonance
title: "壓制 cavity 共振：shorting via、DC blocking 電容與阻尼"
subject: pi-pdn
tier: 4
order: 14
status: draft
goal: "用 1/6 波長規則算 shorting via 間距、用 n_caps 算 DC blocking 電容數，並用 ESR 壓下平行峰。"
digests:
  - pdn-principles.11.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# 壓制 cavity 共振：shorting via、DC blocking 電容與阻尼

## Lesson

cavity noise 是阻抗乘上電流，所以兩個槓桿是壓低 Z0 與加大衰減；而最有效的次序是「同電壓平面就用 shorting via 短接」，逼不得已才用 DC blocking 電容。這個 node 給出 1/6 波長與 n_caps = L_mount/L_via + 1 兩個可算的規則，並說明為什麼最後還是要靠 ESR 把平行峰壓下去。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
