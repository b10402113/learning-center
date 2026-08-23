# Mission: 跨階段引導：指標、文件與技能

## Why
學會在 AI 輔助開發的多個 session 之間有效引導代理，讓它持續照你的意圖做事，而不會在 session 切換時丟失脈絡或讓上下文失控。

## Success looks like
- 能在 phase boundary 主動判斷該繼續、清空、壓縮、交接或派子代理
- 能用 Push vs Point 策略管理 steering 檔案，讓規則在需要時出現、不需要時不佔位
- 能把穩定流程封裝成可攜式 skill，並在不同專案間重用
- 能定期修剪 steering，移除沉積物和 no-op

## Constraints
- 以繁體中文教學
- 課程需可獨立完成，每課短小精悍
- 以實作為導向，每個概念都要有可操作的練習

## Out of scope
- 模型底層原理（next token prediction 等）
- 特定 harness 的深入操作細節
- 純理論的 token 計費分析
