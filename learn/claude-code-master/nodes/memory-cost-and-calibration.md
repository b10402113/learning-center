---
id: memory-cost-and-calibration
title: "怎麼讓它每聊一次就更懂你"
subject: claude-code-master
tier: 4
order: 8
status: draft
goal: "能算出兩個記憶檔的 token 成本、判斷健康大小，並用 calibrate skill 把每次修正回寫成記憶與 skill。"
prerequisites: []
steps: []
created: 2026-10-28
updated: 2026-10-28
---

# 怎麼讓它每聊一次就更懂你

## Lesson

記憶是雙面刃：兩個記憶檔每個 session 都會載入，所以你得知道它們的 token 成本與健康大小，用 context 指令定期稽核。真正讓 chatbot 變成隊友的是 calibrate skill——在每次 session 結尾回顧你在哪裡糾正過它，把那些教訓折回記憶、並建議 skill 更新，於是它一次比一次更貼近你。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
