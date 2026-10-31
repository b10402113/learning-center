---
id: plans-models-and-effort
title: "方案、模型與 effort"
subject: claude-code-master
tier: 1
order: 3
status: written
goal: "用 `/usage`、token 單位與 effort 等級判斷哪個方案、模型、思考深度值得花。"
digests:
  - 3-Module_A3_-_Pricing_and_Usage.md
  - 5-Module_A5_-_Models.md
  - 7-Module_A7_-_Effort_Levels.md
prerequisites: []
steps:
  - id: plans-tokens-and-usage
    title: "定價與用量"
    purpose: "用方案層級、token 單位與 `/usage` 三個限制，算出自己這個月還能燒多少額度。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/3-Module A3 - Pricing and Usage/3-Module_A3_-_Pricing_and_Usage.en.vtt#L1-L230]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/3-Module A3 - Pricing and Usage/3-Module_A3_-_Pricing_and_Usage.en.vtt#L231-L382]]"
  - id: model-tiers-and-defaults
    title: "這個選擇沒有標準答案"
    purpose: "說出 Haiku 到 Fable 的能力與價差，並依方案選出每天的預設模型。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/5-Module A5 - Models/5-Module_A5_-_Models.en.vtt#L1-L215]]"
  - id: subscription-vs-api-pricing
    title: "一旦超額，你付的會是 API 價格"
    purpose: "分辨訂閱與 API 計價的差別，知道超額後啟用 usage credits 為什麼會變貴。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/5-Module A5 - Models/5-Module_A5_-_Models.en.vtt#L216-L307]]"
  - id: effort-levels-and-tradeoffs
    title: "Effort Levels：Claude 動手前要想多用力"
    purpose: "說明 effort 如何改動 reasoning token 預算，並依任務型態選 low 到 max。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/7-Module A7 - Effort Levels/7-Module_A7_-_Effort_Levels.en.vtt#L1-L250]]"
  - id: effort-in-practice
    title: "升 effort 不會自動給你更好的結果"
    purpose: "用 low／max 的實測數字判斷升 effort 值不值得，並解釋 Ultra Code 為何先別碰。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/7-Module A7 - Effort Levels/7-Module_A7_-_Effort_Levels.en.vtt#L251-L451]]"
created: 2026-10-31
updated: 2026-10-31
---

# 方案、模型與 effort

## Lesson

方案決定你一個月有多少 token，模型決定每個 token 多貴，effort 決定同一個 prompt 要想多久。三者一起看，才不會在一個小任務上燒掉一週的額度。

## Steps

1. [定價與用量](plans-models-and-effort/plans-tokens-and-usage.md)
2. [這個選擇沒有標準答案](plans-models-and-effort/model-tiers-and-defaults.md)
3. [一旦超額，你付的會是 API 價格](plans-models-and-effort/subscription-vs-api-pricing.md)
4. [Effort Levels：Claude 動手前要想多用力](plans-models-and-effort/effort-levels-and-tradeoffs.md)
5. [升 effort 不會自動給你更好的結果](plans-models-and-effort/effort-in-practice.md)
