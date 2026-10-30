---
id: reconnect-after-restart
title: "重啟之後，從哪一行接回來"
subject: agent-harness2
tier: 2
order: 6
status: written
goal: "啟動 DBOS、以 workflow ID 接回、client 重連時 replay 事件，並實際殺掉 server 驗證。"
digests:
  - 10-durable-agent-loop.md
  - 11-connecting-dbos-to-the-server.md
  - 12-durable-execution-recap.md
  - 7-durable-execution-setup-with-neondb.md
  - 8-implementing-durable-execution.md
  - 9-durable-tools.md
  - harness-engineering.1.part.md
  - harness-engineering.2.part.md
  - harness-engineering.3.part.md
prerequisites: []
steps:
  - id: env-before-dbos
    title: "環境變數要比資料庫早一步載入"
    purpose: "說明為何 env.ts 必須先 import，並把 ensureSchema、DBOS.setConfig、DBOS.launch 收進 main()。"
    sources:
      - "[[sources/agent-harness2/20261029/11-connecting-dbos-to-the-server.txt#L1-L96]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/server/env.ts#L1-L6]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/server/index.ts#L1-L92]]"
  - id: start-workflow-on-submit
    title: "收到 submit-task 就啟動 workflow"
    purpose: "用 DBOS.startWorkflow 啟動任務，並用 workflow ID 讓重啟後已完成的 step 被跳過。"
    sources:
      - "[[sources/agent-harness2/20261029/11-connecting-dbos-to-the-server.txt#L159-L186]]"
      - "[[sources/agent-harness2/20261029/10-durable-agent-loop.txt#L212-L250]]"
      - "[[sources/agent-harness2/20261029/9-durable-tools.txt#L498-L539]]"
      - "[[sources/agent-harness2/20261029/7-durable-execution-setup-with-neondb.txt#L177-L203]]"
  - id: replay-history-on-connect
    title: "client 一連上，就把 history 逐筆 replay"
    purpose: "在 on connection 用 history() 逐筆補送事件，讓重新整理的瀏覽器接回沒看到的進度。"
    sources:
      - "[[sources/agent-harness2/20261029/11-connecting-dbos-to-the-server.txt#L187-L211]]"
      - "[[sources/agent-harness2/20261029/8-implementing-durable-execution.txt#L357-L372]]"
      - "[[sources/agent-harness2/20261029/12-durable-execution-recap.txt#L137-L169]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/bus.ts#L1-L29]]"
  - id: kill-server-and-reconnect
    title: "把 server 殺掉，再啟動，它自己接回來"
    purpose: "實際殺掉 server 再重啟，從接續的串流與 messages 角色判斷解釋 workflow 為何能自己續跑。"
    sources:
      - "[[sources/agent-harness2/20261029/11-connecting-dbos-to-the-server.txt#L331-L369]]"
      - "[[sources/agent-harness2/20261029/12-durable-execution-recap.txt#L170-L214]]"
created: 2026-10-29
updated: 2026-10-29
---

# 重啟之後，從哪一行接回來

## Lesson

把 DBOS 接上 server，讓斷線的 workflow 能被接回。你會實際殺掉 server、重啟，再看 client 用 `history` replay 補上沒收到的事件——這是「狀態真的持久化」唯一可信的證明。

## Steps

1. [環境變數要比資料庫早一步載入](reconnect-after-restart/env-before-dbos.md)
2. [收到 submit-task 就啟動 workflow](reconnect-after-restart/start-workflow-on-submit.md)
3. [client 一連上，就把 history 逐筆 replay](reconnect-after-restart/replay-history-on-connect.md)
4. [把 server 殺掉，再啟動，它自己接回來](reconnect-after-restart/kill-server-and-reconnect.md)
