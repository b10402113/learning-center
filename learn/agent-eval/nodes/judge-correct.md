---
id: judge-correct
title: "Correct & quantify the judge: Rogan-Gladen + bootstrap CI"
subject: agent-eval
tier: 2
order: 4
status: written
goal: "De-bias an observed pass rate with the Rogan-Gladen estimator, wrap it in a bootstrap 95% CI, and decide ship/hold from interval width vs. threshold."
prerequisites: []
steps:
  - id: why-raw-rate-lies
    title: "為什麼未修正的通過率會騙人：judge 的誤差往哪邊推"
    purpose: "能說明 judge 的 TPR/TNR 如何把觀察通過率系統性推高或壓低，並指出哪個方向會讓你誤判。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1483-L1492]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1627-L1640]]"
  - id: rogan-gladen
    title: "Rogan-Gladen 修正：把 judge 的 TPR/TNR 誤差扣掉"
    purpose: "能用 p_obs 與 TPR/TNR 算出 Rogan-Gladen 修正值 θ̂，並在分母接近零時正確拒絕下結論。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1493-L1502]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1503-L1518]]"
  - id: bootstrap-ci
    title: "Bootstrap 95% 信賴區間：這個修正後的數字有多穩"
    purpose: "能對 test set 做 bootstrap 重抽樣、重算修正值，取出 2.5/97.5 百分位當 95% 信賴區間。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1519-L1549]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1550-L1626]]"
  - id: ship-or-hold
    title: "看區間下決定：ship、補資料，還是先修 judge"
    purpose: "能拿 θ̂ 與信賴區間對照門檻，判斷這次該 ship、該補資料，還是該先修 judge。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1627-L1640]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1641-L1644]]"
created: 2026-10-29
updated: 2026-10-29
---

# Correct & quantify the judge: Rogan-Gladen + bootstrap CI

## Lesson

Here the judge becomes a measuring instrument: you correct its imperfect TPR/TNR with the Rogan-Gladen estimator and put a bootstrap confidence interval around the result. The payoff is the course's core judgment — deciding to ship or hold from the interval width against a threshold, not from a single point estimate.

## Steps

1. [為什麼未修正的通過率會騙人：judge 的誤差往哪邊推](judge-correct/why-raw-rate-lies.md)
2. [Rogan-Gladen 修正：把 judge 的 TPR/TNR 誤差扣掉](judge-correct/rogan-gladen.md)
3. [Bootstrap 95% 信賴區間：這個修正後的數字有多穩](judge-correct/bootstrap-ci.md)
4. [看區間下決定：ship、補資料，還是先修 judge](judge-correct/ship-or-hold.md)
