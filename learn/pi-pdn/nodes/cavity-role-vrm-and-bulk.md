---
id: cavity-role-vrm-and-bulk
title: "Cavity 的角色，與 VRM、bulk 電容"
subject: pi-pdn
tier: 5
order: 16
status: draft
goal: "說明 cavity 對 die 為何幾乎透明、VRM 為何是 series RL，並從 Ztarget 反推 bulk 電容。"
digests:
  - pdn-principles.12.part.md
  - pdn-principles.13.part.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Cavity 的角色，與 VRM、bulk 電容

## Lesson

從 die 墊片往板子看，1 吋與 10 吋的 cavity 給出幾乎一樣的阻抗，因為 cavity 對 die 而言只是個 lumped 電容，唯一真正的 PDN 任務是低 spreading inductance。頻率的另一端則是 VRM：它是一個 series RL，而 bulk 電容的唯一工作是撐住阻抗，直到 VRM 來得及反應。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
