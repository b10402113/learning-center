---
subject: quant-resource
status: draft
created: 2026-08-17
---

# ROADMAP — quant-resource

## Goal
能建立並回測自己的股票統計套利策略（用 Python），從找想法、寫回測、評估（Sharpe/回撤）、到確認策略沒有資料窺探偏誤。

## How to use
按順序閱讀節點。每個節點是一個由 10–15 分鐘步驟組成的 step-DAG。先執行 `/probe quant-resource/<node-id>` 測量該節點的掌握度，再執行 `/nodes quant-resource/<node-id>` 確認並開始學習。

## Nodes

### Tier 1 — 建立心智模型
1. **[[learn/quant-resource/nodes/quant-trading-foundations|量化交易基礎]]** — 10–15 分鐘
   - Goal: 定義量化交易、誰能做、商業模式、以及散戶為何能與機構競爭
   - Sources:
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#CHAPTER 1]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Conclusion]]

2. **[[learn/quant-resource/nodes/finding-screening-strategies|尋找與篩選策略]]** — 10–15 分鐘
   - Goal: 從想法來源到四個個人適配問題＋六個快速篩選測試，建立策略品味
   - Sources:
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#CHAPTER 2]]

### Tier 2 — 回測引擎
3. **[[learn/quant-resource/nodes/backtesting-data-platforms|回測入門：資料與平台]]** — 10–15 分鐘
   - Goal: 選擇回測平台、取得歷史資料、處理分割／股息調整與存活者偏誤
   - Sources:
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#COMMON BACKTESTING PLATFORMS]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#FINDING AND USING HISTORICAL DATABASES]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Are the Data Split and Dividend Adjusted?]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Are the Data Survivorship Bias Free?]]

4. **[[learn/quant-resource/nodes/performance-measurement-bias|績效衡量與偏誤偵測]]** — 10–15 分鐘
   - Goal: 計算 Sharpe ratio 與最大回撤、辨識並避免 look-ahead bias 與 data-snooping bias
   - Sources:
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#PERFORMANCE MEASUREMENT]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#COMMON BACKTESTING PITFALLS TO AVOID]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Look-Ahead Bias]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Data-Snooping Bias]]

5. **[[learn/quant-resource/nodes/transaction-costs-refinement|交易成本、策略改良與紙上交易]]** — 10–15 分鐘
   - Goal: 建模交易成本、改良策略而不引入偏誤、用紙上交易驗證策略
   - Sources:
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#TRANSACTION COSTS]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#STRATEGY REFINEMENT]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Testing Your System by Paper Trading]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Why Does Actual Performance Diverge from Expectations?]]

### Tier 3 — 營運基礎設施
6. **[[learn/quant-resource/nodes/execution-business-infrastructure|執行系統與交易事業架構]]** — 10–15 分鐘
   - Goal: 選擇半自動／全自動執行系統、零售 vs 自營商、券商、硬體與網路基礎設施
   - Sources:
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Business Structure: Retail or Proprietary?]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Choosing a Brokerage or Proprietary Trading Firm]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Physical Infrastructure]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#What an Automated Trading System Can Do for You]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Building a Semiautomated Trading System]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Building a Fully Automated Trading System]]

### Tier 4 — 資金與風險管理
7. **[[learn/quant-resource/nodes/kelly-optimal-leverage|Kelly 公式與最優槓桿]]** — 10–15 分鐘
   - Goal: 用 Kelly 公式決定資金分配與槓桿，理解幾何成長率與 Sharpe 的關係
   - Sources:
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#OPTIMAL CAPITAL ALLOCATION AND LEVERAGE]]

8. **[[learn/quant-resource/nodes/risk-management-psychology|風險管理實務與交易心理]]** — 10–15 分鐘
   - Goal: 應用 half-Kelly、回撤上限、停損判斷、以及對抗絕望與貪婪的心理紀律
   - Sources:
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#RISK MANAGEMENT]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#IS THE USE OF STOP LOSS A GOOD RISK MANAGEMENT PRACTICE]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#PSYCHOLOGICAL PREPAREDNESS]]

### Tier 5 — 進階策略工具箱
9. **[[learn/quant-resource/nodes/stat-arb-toolkit|統計套利核心技術]]** — 10–15 分鐘
   - Goal: 區分均值回歸與動能策略、檢定共整合、理解因子模型與出場策略
   - Sources:
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#MEAN-REVERTING VERSUS MOMENTUM STRATEGIES]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#REGIME SWITCHING]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#STATIONARITY AND COINTEGRATION]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#FACTOR MODELS]]
     - [[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#WHAT IS YOUR EXIT STRATEGY]]

## Status
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written