---
subject: video-editing
language: zh-Hant
created: 2026-10-03
updated: 2026-10-03
---

# MEMORY — video-editing

## Goal
用 coding agent（Claude Code / Codex）端到端產出成品影片：從原始素材或一句 brief 出發，安裝與設定 HyperFrames，用 ffmpeg + Whisper 剪片，套用設計系統（DESIGN.md），渲染 1080p，再用時間碼回饋迭代。不只是「跑得動流程」，而是能交付一支有品牌風格、有 motion graphics 的影片。

## Why
自己做內容，不外包剪輯師、不另外請 motion designer，也不訂閱 Higgsfield 這類工具。速度與成本要自己掌控——影片是為了自己的個人品牌與開發者內容。

## Prior experience
- 熟練使用 coding agent（Claude Code / Codex）與終端機 CLI
- 寫過 Claude skill / prompt（SKILL.md、agents.md、slash command）
- 有輕度剪片經驗（非專業）
- 沒有 code-based motion graphics（HTML/JS、three.js、GSAP）經驗

## Anchors
- 自己的品牌 / 產品與視覺識別（logo、配色、字體，可整理成 DESIGN.md 餵進 pipeline）
- 自己錄的原始素材（螢幕錄影、講解、demo）
- 個人品牌 / 開發者內容的發布管道
- 已寫過 Claude skill —— hyperframes-helper、`/animate`、`/generate` 這類 skill 對他並不陌生
- 終端機 + ffmpeg 風格的工具鏈

## Habits & constraints
- 每週約 3–6 小時，平日晚上 + 週末
- Mac（darwin）環境
- API 花費：pay-as-you-go、成本敏感；偏好先走免費 / 本地路徑（本地 Whisper），必要時才付費生圖生影
- 每次學習最好留下一個「跑得起來、看得到」的成品

## Knowledge type
Procedural-dominant。核心是 do 出來——跑 pipeline、寫 prompt/規則、剪片、下指令修。概念（HyperFrames 怎麼 render、ffmpeg filter、motion 原則）只為支撐當下的操作而即時補上。

## How to teach me
先給大圖與心智模型（這一步在整條 pipeline 的哪裡、為什麼要它），再進步驟。看不到全貌會分心。每一課收在一個「跑得起來、看得到」的結果上；不要純理論灌輸。
