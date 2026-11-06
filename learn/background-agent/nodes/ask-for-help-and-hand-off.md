---
id: ask-for-help-and-hand-off
title: "求助並交接"
subject: background-agent
tier: 2
order: 14
status: written
goal: "能實作 request_help 的暫停與恢復，並說明人的回答是上下文、不是世界已恢復的證據。"
digests:
  - 24-asking-for-help.md
  - lessons-06-incident-drill.md
  - server.md
  - web.md
prerequisites:
  - learn/background-agent/nodes/the-waiting-loop.md
  - learn/background-agent/nodes/put-a-human-in-control.md
steps:
  - id: help-is-a-policy-not-a-failure
    author: "google/gemini-3.8-flash"
    title: "request_help 是模型選出的下一個動作"
    purpose: "能說明 request_help 是模型提出、由 harness 政策表判定為 help 的合法行動，而不是迴圈失敗。"
    sources:
      - "[[sources/background-agent/20261105/24-asking-for-help.vtt#L207-L341]]"
      - "[[sources/background-agent/20261105/lessons/06-incident-drill/index.md#L6-L13]]"
      - "[[sources/background-agent/20261105/lessons/06-incident-drill/index.md#L33-L50]]"
      - "[[sources/background-agent/20261105/server/tool-policy.ts#L1-L15]]"
      - "[[sources/background-agent/20261105/server/agent-brain.ts#L28-L37]]"
  - id: pause-with-a-question
    author: "google/gemini-3.8-flash"
    title: "Agent 需要資訊"
    purpose: "能把問題寫成 approval、停在 needs_help，並在 operator inbox 等到有人回答。"
    sources:
      - "[[sources/background-agent/20261105/24-asking-for-help.vtt#L342-L412]]"
      - "[[sources/background-agent/20261105/lessons/06-incident-drill/index.md#L81-L100]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L141-L170]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L175-L226]]"
      - "[[sources/background-agent/20261105/server/operator.ts#L40-L49]]"
      - "[[sources/background-agent/20261105/web/src/App.tsx#L415-L545]]"
  - id: resume-the-same-run
    author: "google/gemini-3.8-flash"
    title: "同一條 run 繼續"
    purpose: "能讓同一條 run 收到回答後 continue 從頭重新觀察，而不是另開分支或新 run。"
    sources:
      - "[[sources/background-agent/20261105/24-asking-for-help.vtt#L413-L511]]"
      - "[[sources/background-agent/20261105/24-asking-for-help.vtt#L512-L650]]"
      - "[[sources/background-agent/20261105/lessons/06-incident-drill/index.md#L101-L121]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L171-L184]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L228-L273]]"
  - id: answer-is-context-not-evidence
    author: "google/gemini-3.8-flash"
    title: "人的回答是新上下文，不是復原證據"
    purpose: "能解釋人的回答只是新上下文，完成仍須由重讀後的健康狀態與目標條件證明。"
    sources:
      - "[[sources/background-agent/20261105/24-asking-for-help.vtt#L651-L712]]"
      - "[[sources/background-agent/20261105/24-asking-for-help.vtt#L713-L765]]"
      - "[[sources/background-agent/20261105/24-asking-for-help.vtt#L766-L812]]"
      - "[[sources/background-agent/20261105/24-asking-for-help.vtt#L813-L842]]"
      - "[[sources/background-agent/20261105/lessons/06-incident-drill/index.md#L14-L21]]"
      - "[[sources/background-agent/20261105/lessons/06-incident-drill/index.md#L122-L128]]"
      - "[[sources/background-agent/20261105/server/agent-brain.ts#L28-L37]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L63-L121]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L100-L133]]"
created: 2026-11-05
updated: 2026-11-05
---

# 求助並交接

## Lesson

有些問題不在代理的工具範圍內，這時 request_help 是合法的下一步，而不是失敗。這個節點讓代理停下來問人、把回答當成上下文、再重新觀察，並說明為什麼人的回答不能當成世界已恢復的證據。

## Steps

1. [request_help 是模型選出的下一個動作](ask-for-help-and-hand-off/help-is-a-policy-not-a-failure.md)
2. [Agent 需要資訊](ask-for-help-and-hand-off/pause-with-a-question.md)
3. [同一條 run 繼續](ask-for-help-and-hand-off/resume-the-same-run.md)
4. [人的回答是新上下文，不是復原證據](ask-for-help-and-hand-off/answer-is-context-not-evidence.md)
