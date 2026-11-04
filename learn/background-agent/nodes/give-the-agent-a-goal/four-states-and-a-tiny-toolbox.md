# 四種不同的資訊，一份很小的工具清單

上一段把迴圈拆成觀察、決定、行動三步，接著要問的是：每一步究竟把哪些資訊交給模型。在設計處理線上事故的自主代理（Agent）時，許多人常遇到的困擾是模型「搞不清楚狀況」：它可能把十分鐘前收到的警報內容當成當下的系統狀態、把過去某次觀察到的結果當成現況，甚至把「自己提議要執行的動作」直接當成「已經生效的結果」。

要避免代理產生這類混淆，關鍵在於將傳遞給模型的資訊釐清為四種不同性質的維度，同時將代理能呼叫的工具目錄精簡到最小。

## 分辨四種截然不同的資訊

在每一次決策循環中，代理接觸到的資訊其實包含四個不同層次：

<!--image:1-->

1. **世界狀態（World state）**：外部系統「現在」的真實面貌。例如呼叫結帳服務（checkout）時當下回傳的即時狀態。
2. **調查狀態（Run state）**：本次調查任務本身的元數據（metadata），包含事故的目標、目前的調查進度，以及代理已經做出幾次決策。
3. **執行歷程（Execution history）**：系統已經確認記錄（checkpoint）下來、過去代理確實執行過的所有動作。
4. **事件歷程（Event history）**：過去收到的各項警報與通知。這類紀錄只代表「世界可能已經改變」的提示，並不等於系統當前現況。

這四者的差別看似直觀，但在工程實作中極易混淆。一旦把事件歷程中的警報 payload 直接當成世界狀態的當前快照，代理就可能對早已恢復正常的系統做不必要的重試；若把執行歷程中發出的指令當成世界狀態，代理就會誤以為系統已經修復。釐清這四種資訊的邊界，代理才能根據反饋踏出穩健、有界限的一步，然後再次確認外部世界。

## 一份刻意維持極小的工具清單

與動輒掛載幾十個工具或 MCP 伺服器的通用代理不同，事故排查代理只需要一份小而緊湊的工具清單。工具越少，邊界越清楚，模型的決策就越容易檢查與驗證。

這套極小的工具目錄只有七個動作，分別承擔三類職責：

<!--image:2-->

- **搜集證據**：`inspect_logs`（查看日誌）與 `inspect_changes`（查看近期變更），兩者皆屬於唯讀動作，用來了解背景資訊。
- **改變系統**：`disable_feature`（關閉特定功能）與 `rollback_release`（回滾發布），這兩個動作會直接對結帳等外部服務產生寫入或變更效果。
- **生命週期請求**：`wait`（等待系統反應）、`request_help`（向人類求助）與 `complete`（結束調查）。這些動作並不直接修改外部系統，而是由負責驅動代理的 harness 來解讀並決定流程走向。

在程式碼中，這些工具會被賦予明確的政策標籤：

<!-- source: sources/background-agent/20261105/server/tool-policy.ts#L1-L15 -->

```typescript
import type { ActionName } from '../shared/types'

// The harness reads policy metadata; it does not branch on checkout fault flags.
export const actionPolicy: Record<
  ActionName,
  'read' | 'write' | 'approval' | 'help' | 'terminal' | 'wait'
> = {
  inspect_logs: 'read',
  inspect_changes: 'read',
  disable_feature: 'write',
  rollback_release: 'approval',
  request_help: 'help',
  complete: 'terminal',
  wait: 'wait',
}
```

把工具政策寫死在程式碼中（例如明確標示哪些動作需要審批、哪些動作會終止調查），比在提示詞裡告誡模型「請小心操作」有效得多。此外，日誌與變更內容都只是供模型判斷的「證據」，不是「指令」；透過嚴格的工具政策與清晰的資訊分界，代理即使在面對複雜的日誌與外部雜訊時，也能保持行為受控。
