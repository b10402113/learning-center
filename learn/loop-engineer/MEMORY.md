---
subject: loop-engineer
language: zh-Hant
created: 2026-10-03
updated: 2026-10-03
---

# MEMORY — loop-engineer

## Goal
把散落在 OryxOS、agent-harness、Claude Code 日常使用裡的 loop 經驗，收斂成一套**可複製的工程準則**，並能用固定契約（goal / evidence / tools / state / guardrails / termination）設計、實作、驗證一個可上線的 **issue-resolution agent**（對齊課程 capstone）。終點是「在真實 repo 上交付一個有 trace、checkpoint、approval、以證據收尾的 agent」，而不是理解 agent loop 是什麼。課程的兩份 mock exam 當成 **readiness gate**，決策框架（看到 agent 產品或故障能說出缺哪層 loop control、該 approve/fix/escalate）是副產品；labs 只挑有價值的做，不逐字照抄。

## Why
**可複製性 + 可辯護性**。要的是能把 loop engineering 從「我做過、感覺對」變成「我能講清楚、能複製、能在公司的 Java 平台重推導」，並對別人（或未來的自己）證明：這個 loop 為什麼這樣設計、失敗時怎麼收、上線前憑什麼放行。geek-ai-agent 已有 OryxOS 這條線，這裡補的是「審查與放行」那一層判斷力，讓「一個人交付遠超一個人的事」在生產環境站得住，而不是 demo 好看。

## Prior experience
- 自寫過 OryxOS 的 ReAct loop（JDK 21 + Spring Boot）——loop 內部已熟，不重教。
- 打造過 TypeScript agent harness runtime（durable execution、memory compaction、handoff、階層式 sub-agents、durable HITL）——agent-harness 主題。
- Claude Code / opencode 重度使用者：approval、sub-agent、hook、worktree、skill、MCP 都有體感。
- LangGraph 多節點 agent + SSE 串流（llm-project）；DDIA 的冪等／event log／一致性讀過。
- Python、TypeScript、Java 日常可用。
- **要深教的新知**：正式的四態終止模型與 stop-rule 設計、evidence vault / generation-vs-verification 的獨立驗證協定、multi-agent handoff contract 與 delegation-loop 防護、production readiness review 的九項檢查、以及本課 lab 的契約細節。

## Anchors
- OryxOS 自寫的 ReAct loop——每個 loop layer 都可對照「我的 loop 缺這層會怎樣」。
- agent-harness 的 event log——trace / replay / checkpoint 的物理對照。
- 公司的 Java 平台——Loop/Harness 準則最終要搬回去的地方。
- 日常使用 Claude Code / opencode——從「使用者的體感」反推「內部怎麼做」。
- 本課的 capstone 與 labs——可直接對照契約、evidence、readiness 的實作。

## Habits & constraints
- 每週 1–3 小時，時間破碎；長段在週末或晚間。
- Mac 環境；能跑 Python 3.10+（課程 labs 為 dependency-free Python）。
- 無硬性 deadline，中等壓力。
- 每篇要能一次讀完、可隨時中斷再繼續；labs 有空才跑，不綁進主進度。

## Knowledge type
mixed，**procedural 為主**。核心是「能自己設計、跑出並審查一個受控 loop」；declarative 部分（四態終止、風險分級、evidence 準則、oversight 模式）在做的脈絡裡講，不空談。

## How to teach me
- **架構優先，程式碼為佐證**：先講清楚這一層為什麼存在、契約是什麼，再用課程的 Python 片段對照；不要求每步都自己跑。
- **略讀**已熟的部分（單一 loop、tool dispatch、Claude Code 操作）；**深教**新內容（termination/guardrails、verification/evidence、multi-agent contracts、human oversight/readiness）。
- 每課開頭先用「這解掉什麼問題／缺這層會怎樣」帶價值，再進核心；不名詞轟炸。
- 簡潔、密度高、不要廢話；每篇能碎片化讀完，結尾落在「真的能跑或真的能決定」的事上。
- 講「為什麼」的機制（為什麼要有 evidence gate、為什麼 stop rule 要分 defensive/semantic、為什麼 handoff 要有 contract）幫我記住「怎麼做」。
- 輸出語言 **zh-Hant**；程式碼、識別字、API 名稱與產品名稱保持英文。
