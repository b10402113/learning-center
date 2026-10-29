---
id: hand-off-control
title: "把控制權交出去：handoff"
subject: agent-harness2
tier: 4
order: 9
status: written
goal: "說出 handoff ≠ subagent，實作 runtime 攔截 handoff、切換 agent、補對應 tool result。"
prerequisites: []
steps:
  - id: handoff-vs-subagent
    title: "Handoff 是交棒，不是叫 subcontractor"
    purpose: "能說出 handoff 是控制權完全移交、subagent 是幕後 subcontractor，並舉出何時該拆 agent。"
    sources:
      - "[[sources/agent-harness2/20261029/19-agent-handoffs.txt#L1-L51]]"
      - "[[sources/agent-harness2/20261029/19-agent-handoffs.txt#L52-L91]]"
      - "[[sources/agent-harness2/20261029/19-agent-handoffs.txt#L92-L132]]"
      - "[[sources/agent-harness2/20261029/19-agent-handoffs.txt#L133-L164]]"
  - id: agent-is-data
    title: "Agent 只是 name、system prompt 和 tools"
    purpose: "能把 agent 當成 name／system prompt／tools 三欄資料，並寫出 triage 缺 issueRefund、billing 持有它的權限切分。"
    sources:
      - "[[sources/agent-harness2/20261029/19-agent-handoffs.txt#L165-L199]]"
      - "[[sources/agent-harness2/20261029/19-agent-handoffs.txt#L200-L244]]"
      - "[[sources/agent-harness2/20261029/19-agent-handoffs.txt#L245-L285]]"
      - "[[sources/agent-harness2/20261029/20-billing-agent-handoff-tool.txt#L1-L42]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/agents.ts#L4-L38]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/agents.ts#L43-L65]]"
  - id: handoff-tool-runtime-switch
    title: "handoff 是工具，但切換留在 runtime"
    purpose: "能寫出 issueRefund 與 handoff 的 schema，並說出為什麼 handoff 不能在 tool 層執行、要由 runtime 切換。"
    sources:
      - "[[sources/agent-harness2/20261029/20-billing-agent-handoff-tool.txt#L43-L80]]"
      - "[[sources/agent-harness2/20261029/20-billing-agent-handoff-tool.txt#L80-L105]]"
      - "[[sources/agent-harness2/20261029/20-billing-agent-handoff-tool.txt#L106-L160]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L79-L87]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L89-L95]]"
  - id: intercept-switch-tool-result
    title: "攔截 handoff、切換 agent、補 tool result"
    purpose: "能在 runtime 攔截 handoff、切換 currentAgent 並補上對應 tool call ID 的 tool result。"
    sources:
      - "[[sources/agent-harness2/20261029/20-billing-agent-handoff-tool.txt#L161-L191]]"
      - "[[sources/agent-harness2/20261029/20-billing-agent-handoff-tool.txt#L192-L235]]"
      - "[[sources/agent-harness2/20261029/20-billing-agent-handoff-tool.txt#L236-L287]]"
      - "[[sources/agent-harness2/20261029/20-billing-agent-handoff-tool.txt#L288-L308]]"
      - "[[sources/agent-harness2/20261029/21-agent-triage-handoff.txt#L1-L20]]"
      - "[[sources/agent-harness2/20261029/21-agent-triage-handoff.txt#L21-L40]]"
      - "[[sources/agent-harness2/20261029/21-agent-triage-handoff.txt#L41-L72]]"
      - "[[sources/agent-harness2/20261029/21-agent-triage-handoff.txt#L73-L110]]"
      - "[[sources/agent-harness2/20261029/21-agent-triage-handoff.txt#L111-L130]]"
      - "[[sources/agent-harness2/20261029/21-agent-triage-handoff.txt#L131-L183]]"
      - "[[sources/agent-harness2/20261029/21-agent-triage-handoff.txt#L184-L240]]"
      - "[[sources/agent-harness2/20261029/21-agent-triage-handoff.txt#L241-L277]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L28-L33]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L72-L79]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L97]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L129-L131]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L149-L165]]"
created: 2026-10-29
updated: 2026-10-29
---

# 把控制權交出去：handoff

## Lesson

handoff 是把整個 loop 的控制權交出去，不是叫 subagent 幫忙。你會把寫死的 workflow 抽象成 agent primitive、在 runtime 攔截 handoff tool、切換 active agent，並補上一則對應 tool call ID 的 tool result——否則 API 直接壞掉。

## Steps

1. [Handoff 是交棒，不是叫 subcontractor](hand-off-control/handoff-vs-subagent.md)
2. [Agent 只是 name、system prompt 和 tools](hand-off-control/agent-is-data.md)
3. [handoff 是工具，但切換留在 runtime](hand-off-control/handoff-tool-runtime-switch.md)
4. [攔截 handoff、切換 agent、補 tool result](hand-off-control/intercept-switch-tool-result.md)
