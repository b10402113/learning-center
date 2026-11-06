---
id: read-only-vs-read-write-tools
title: "Read-only vs Read-write Tools（唯讀與讀寫工具）"
label: "Read-only vs Read-write Tools"
subject: ai-agent-workflows
type: contrast
status: draft
summary: "唯讀工具只取資訊，讀寫工具會改變外部狀態；副作用大小決定防護與審批需求。"
aliases: []
prerequisites: []
related:
  - tool-guardrails
sources:
  - "[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L65-L69]]"
created: 2026-11-06
updated: 2026-11-06
---

# Read-only vs Read-write Tools（唯讀與讀寫工具）

## A 是什麼

唯讀工具（read-only）只從外部取得資訊，不改變任何狀態。例如查詢資料、搜尋網頁、讀取訊息。呼叫前後，環境維持原樣。

## B 是什麼

讀寫工具（read-write）會改變外部狀態。例如發送訊息、寫入資料庫、修改檔案、刪除資源。呼叫後，環境已經不同，而且不一定能復原。

## 關鍵差異

差別在副作用與可逆性。唯讀工具失敗通常只是查不到資料；讀寫工具失敗可能造成真實損害，甚至無法回復。因此讀寫工具需要更強的 guardrail、approval 與紀錄。

## 何時用哪個

能用唯讀完成的事，就不要給讀寫權限。真的需要讀寫時，把操作範圍縮到最小，對不可逆動作加上確認或 idempotency key，並保留審計紀錄。

## 進階

早期 agent 幾乎沒有防護，出現過 `rm -rf` 與正式環境資料庫被誤刪的事件。把防護放在工具層，是成本最低也最直接的做法。
