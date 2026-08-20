---
subject: geek-ai-agent
status: draft
created: 2026-08-19
---

# ROADMAP — geek-ai-agent

## Goal
學會用 AI coding agent 把企業級真實項目「做成」：先建立一套能落地的 AI 編程工作流（SDD + Harness），再真動手從 0 寫出一個 Agent OS（OryxOS：JDK 21 + Spring Boot + 自研 ReAct loop），把「用 AI 把一件事做成」變成肌肉記憶。When（分布式延時系統）以概念與案例理解為主，不真動手。

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 看清 AI 編程（認知篇）
1. **[[learn/geek-ai-agent/nodes/cognition-essence-value|認知篇：本質、價值與真實趨勢]]**
   - Goal: 建立 AI 編程的本質（三層變化與四大推斷）、程式設計師個人價值（三條立身之本）、2026 真實趨勢（GitHub 榜單）與學習路徑的完整認知地圖
   - Sources:
     - [[sources/geek-ai-agent/01 1. 開篇： 課程設計思路、教學思路與學習指南.html#一、課程設計思路]]
     - [[sources/geek-ai-agent/02 2. 認知篇： AI 編程的本質和方法論體系.html#一、目的從未變過]]
     - [[sources/geek-ai-agent/03 3. 認知篇： AI 編程時代程序員的個人價值.html#一、什麼不再是立身之本]]
     - [[sources/geek-ai-agent/04 4. 認知篇： 從 GitHub AI 項目榜單看 AI 編程的真實趨勢.html#一、原始數據 / 事實]]
     - [[sources/geek-ai-agent/08 8. 認知篇收尾：從看清楚到做出來.html#一、7 份材料一起講了什麼]]

2. **[[learn/geek-ai-agent/nodes/cognition-tools-boundary-pillars|認知篇：工具全景、自動化邊界與兩大支柱]]**
   - Goal: 拿到市場地圖 + 工具七層架構地圖，看清 AI 自動化的真實邊界（30% 提速是頂級水平），掌握 SDD + Harness 兩大支柱與「今天就能落地」三步
   - Sources:
     - [[sources/geek-ai-agent/05 5. 認知篇：AI 編程市場觀察和工具全景.html#一、AI 編程的認知三階段]]
     - [[sources/geek-ai-agent/06 6. 認知篇：AI 自動化的邊界與人加 AI 協作的新工作流.html#引子：Bun 用 6 天重寫了 96 萬行代碼]]
     - [[sources/geek-ai-agent/07 7. 認知篇：SDD 和 Harness：AI 編程的兩大支柱.html#一、SDD 和 Harness 各自解決什麼]]

### Tier 2 — 機制深挖與個人能力（擴展篇）
3. **[[learn/geek-ai-agent/nodes/agent-technical-principles|擴展篇：Agent 的技術原理與生態]]**
   - Goal: 用「五組件 + 一循環」抽象看懂所有 Agent 產品與 Agent OS，認識個人持久化 Agent 流派（Hermes Agent）——呼應「搞懂 Agent OS」的核心動機
   - Sources:
     - [[sources/geek-ai-agent/09 9. 擴展篇：Agent 從技術上看到底是什麼.html#one-line-technical-definition]]
     - [[sources/geek-ai-agent/13 13. 擴展篇：Hermes Agent 深度介紹.html#why-hermes]]

4. **[[learn/geek-ai-agent/nodes/sdd-toolchain|擴展篇：SDD 工具鏈——Spec-Kit / OpenSpec / Superpowers]]**
   - Goal: 能按場景選型並使用 Spec-Kit（spec-as-source）與 OpenSpec（delta-spec），理解 Superpowers 的工程紀律——直接服務 OryxOS 的動手環節
   - Sources:
     - [[sources/geek-ai-agent/10 10. 擴展篇：Spec-Kit 和 OpenSpec 的原理和使用教程.html#why-spec-driven-development]]
     - [[sources/geek-ai-agent/12 12. 擴展篇：Superpowers 深度介紹.html#opening-questions]]

5. **[[learn/geek-ai-agent/nodes/skills-and-engineering-capability|擴展篇：Skills 沉澱與 AI 時代的工程能力]]**
   - Goal: 掌握 Skills 的選用與沉澱方法論，理解 AI 時代軟體工程被壓縮到哪裡（驗證鴻溝、認知債、問責），以及工程師能力如何刻意養成
   - Sources:
     - [[sources/geek-ai-agent/11 11. 擴展篇：AI 編程實用 Skills 調研與沉澱指南.html#why-this-guide]]
     - [[sources/geek-ai-agent/14 14. 擴展篇：AI 時代的軟體工程.html#why-this-research]]
     - [[sources/geek-ai-agent/15 15. 擴展篇：AI 時代，程序員的能力還怎麼養成.html#why-this-question]]

### Tier 3 — 項目實踐
6. **[[learn/geek-ai-agent/nodes/oryxos-build|項目：OryxOS——從 0 寫一個 Agent OS]]**
   - Goal: 真動手跑通 Spec-Kit 主導的 AI 編程全流程，從 0 寫出可運行的 OryxOS（JDK 21 + Spring Boot + 自研 ReAct loop）——本課程唯一真動手項目
   - Sources:
     - [[sources/geek-ai-agent/16 16. 項目篇 OryxOS ：業界調研.html#What is Agent OS]]
     - [[sources/geek-ai-agent/17 17. 項目篇 OryxOS：需求文檔.html#Project overview]]
     - [[sources/geek-ai-agent/18 18. 項目篇 OryxOS：技術方案文檔.html#Solution overview]]
     - [[sources/geek-ai-agent/19 19. 項目篇 OryxOS：AI 編程指南.html#Main approach: Spec-Kit + manual prompting hybrid]]

7. **[[learn/geek-ai-agent/nodes/when-case|項目：When——分布式延時系統案例解剖]]**
   - Goal: 以案例理解一個分布式延時投遞組件（ETCD 協調、Redis 持久化、多層時間輪、Master/Slave）與「用 AI 寫分布式系統」的真實能力——概念理解，不真動手
   - Sources:
     - [[sources/geek-ai-agent/20 20. 項目篇 When：業界調研.html#where-delayed-delivery-appears]]
     - [[sources/geek-ai-agent/21 21. 項目篇 When： 項目需求文檔.html#project-overview]]
     - [[sources/geek-ai-agent/22 22. 項目篇 When：技術方案文檔.html#overview]]
     - [[sources/geek-ai-agent/23 23. 項目篇 When：AI 編程實施指引.html#overall-six-step-approach]]

## Status
- [x] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
