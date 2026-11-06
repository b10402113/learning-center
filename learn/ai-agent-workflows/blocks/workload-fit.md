---
id: workload-fit
title: Workload Fit（工作型態適配）
label: Workload Fit
subject: ai-agent-workflows
type: concept
status: draft
summary: 先看工作有多需要確定性，再決定多代理架構；同一架構換工作型態可能完全相反。
aliases: []
prerequisites: []
related:
  - simplicity-first
  - supervisor-cost
  - control-ownership-spectrum
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L106-L151]]
created: 2026-11-06T00:00:00.000Z
updated: 2026-11-06T00:00:00.000Z
---

# Workload Fit（工作型態適配）

## 定義

Workload fit 是指架構與工作型態的匹配程度。同一個多代理拓撲，在需要高度確定性的工作上可能明顯不合適，在容許探索與機率性答案的工作上卻可能運作良好。選型前要先問：這份工作需要多可靠的結果、能接受多少不確定性。

## 為什麼重要

多代理領域的公開評價經常互相矛盾：有人說多代理在 production 表現很好，也有人說不該打造多代理。兩邊可能都誠實，差別在他們處理的工作型態不同。忽略這一點，就會把別人的成功案例直接套用到不適合的場景。

## 如何運作

1. 判斷工作對確定性的要求：錯了會怎樣？能不能重跑？
2. 若需要較高確定性，優先考慮可靠度較高的組合，例如平行化搭配投票，用多次執行與聚合拉出穩定度。
3. 若涉及醫療照護、金融銀行等直接關乎生命安全或財產的領域，要更保守，通常不建議直接採用高自主性的多代理架構。
4. 若既有程式庫已有 LLM，且能用明確 workflow 解決，優先選 workflow，而不是多代理。
5. 調低 `temperature`、調整 `top_p` 可以壓制隨機性，但模型本質上仍在預測下一個 token，不可能達到百分之百的傳統確定性。

## 例子

需要「跑很多次再取多數決」的任務，可以選擇平行化加投票：同一請求發給多個實例執行 3、5、10 次，再聚合結果。相反地，一個需要嚴格可重現結果的財務計算流程，就不該把控制權交給會在 runtime 自由畫箭頭的 agent。

## 邊界與常見誤解

- **不是「多代理一定不可靠」**：可靠度取決於拓撲與驗證設計，而不是「多代理」三個字。
- **調參不是確定性**：`temperature` 與 `top_p` 只能降低隨機性，不能保證每次相同。
- **別人的 benchmark 不等於你的 workload**：研究任務與寫程式對可靠度的要求不同。
- **保守不等於不用 LLM**：可以用 workflow 把 LLM 放在受控的單點，而不是整段交給 agent。

## 進階

在不確定性與控制權之間的整體取捨，見 [[control-ownership-spectrum]]。選型時「先選最簡單」的原則，見 [[simplicity-first]]；多代理的成本倍數見 [[supervisor-cost]]。
