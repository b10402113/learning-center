---
id: sandbox-code-mode
title: "Sandbox：不可信程式的執行邊界"
subject: agent-harness
tier: 3
order: 6
status: written
goal: "用 code mode 解釋為什麼要跑模型寫的程式，並說出 vm 沙箱擋得住與擋不住什麼。"
prerequisites: []
steps:
  - id: why-run-model-code
    title: "為什麼要讓模型自己寫程式跑"
    purpose: "能說出 sandbox 的兩個動機，並用「12 輪工具 vs 一次執行」說明 code mode 想解決的問題。"
    sources:
      - "[[sources/agent-harness/20260915/13-code-mode-security.txt#L1-L40]]"
      - "[[sources/agent-harness/20260915/13-code-mode-security.txt#L41-L104]]"
  - id: code-mode-deterministic
    title: "Code mode 的帳單：把算術外包給程式"
    purpose: "能用退款案例解釋為什麼 deterministic 的程式比模型推理更可靠，並指出工具呼叫次數下降。"
    sources:
      - "[[sources/agent-harness/20260915/13-code-mode-security.txt#L105-L134]]"
      - "[[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#L1-L37]]"
      - "[[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#L68-L140]]"
      - "[[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#L141-L178]]"
  - id: vm-sandbox-runsandbox
    title: "用 node:vm 蓋一個最小沙箱"
    purpose: "能寫出 runInSandbox：只注入 API 與 console、用 async IIFE 包裝、以 Promise.race 逾時。"
    sources:
      - "[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#L1-L57]]"
      - "[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#L58-L90]]"
      - "[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#L91-L107]]"
      - "[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#L108-L148]]"
      - "[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#L149-L168]]"
  - id: run-code-tool-and-limits
    title: "runCode 接回 tool 迴圈，以及 vm 擋不住的事"
    purpose: "能把 runCode 接進 runTool，並說明 vm 的逃脫風險、正式環境替代方案與 timeout 沒接上的缺口。"
    sources:
      - "[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#L169-L243]]"
      - "[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#L244-L302]]"
      - "[[sources/agent-harness/20260915/13-code-mode-security.txt#L135-L162]]"
      - "[[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#L179-L223]]"
created: 2026-10-24
updated: 2026-10-24
---

# Sandbox：不可信程式的執行邊界

## Lesson

Code mode 讓模型寫一支程式，取代十幾次工具往返；一旦執行模型寫的程式，沙箱就從選配變成必要。這個節點把 runCode 接進既有的 tool 迴圈，並誠實標出 vm 邊界的極限。

## Steps

1. [為什麼要讓模型自己寫程式跑](sandbox-code-mode/why-run-model-code.md)
2. [Code mode 的帳單：把算術外包給程式](sandbox-code-mode/code-mode-deterministic.md)
3. [用 node:vm 蓋一個最小沙箱](sandbox-code-mode/vm-sandbox-runsandbox.md)
4. [runCode 接回 tool 迴圈，以及 vm 擋不住的事](sandbox-code-mode/run-code-tool-and-limits.md)
