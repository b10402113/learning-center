# 把每個 loop 的輸出看清楚

把批准流程的三個環節串起來之後，最後要實際走過核准、拒絕與過期三條結局。當自主代理人（agent）在維運系統中具備修改環境的能力時，最關鍵的保護機制往往是「人機協同審批」（Human-in-the-loop, HITL）。但在實際部署前，如果沒有親自走過每一種審批與狀態競爭分支，並在執行日誌裡看清楚流程怎麼流轉，就很容易在線上事故時對代理人的行為產生誤判。

透過注入發布異常（fault release），你可以實際演練代理人面對危險動作時的三條結局：核准（approve）、拒絕（reject）與過期失效（stale），並學會在 Inngest 的 run view 中看懂每一個迴圈（loop）的步驟輸出。

## 觸發異常與等待審批

要驗證審批流程，首先在環境中觸發一個故障發布（`fault release`）。代理人啟動執行後，會在迴圈中觀察到服務狀態降級（degraded），並判斷需要執行回復（rollback）。

然而，這類具有破壞性或修改關鍵狀態的操作，會在代理人的安全框架（harness）層級被攔截。系統不會直接執行 rollback，而是將提議的動作（proposed action）寫入資料庫，並對外發出審批請求。

在前端介面中，收件匣（inbox）會輪詢這張資料庫資料表。當有未處理的提議時，收件匣就會出現審批卡片，代理人工作流程則進入等待事件的休眠狀態。這段等待可以維持數小時甚至更久，直到人類做出決定。

<!--image:1-->

在收件匣中，人類可以輸入審批備註，並決定核准或拒絕：

<!-- source: sources/background-agent/20261105/web/src/App.tsx#L490-L551 -->

```tsx
                    {message.status === 'pending' && (
                      <div className='reply-composer'>
                        <label htmlFor='reply-input'>
                          {message.action === 'request_help'
                            ? 'Reply to the agent'
                            : 'Decision note (optional)'}
                        </label>
                        <textarea
                          id='reply-input'
                          value={answers[message.id] ?? ''}
                          onChange={(event) =>
                            setAnswers((current) => ({
                              ...current,
                              [message.id]: event.target.value,
                            }))
                          }
                          placeholder='Add context for the agent…'
                          rows={4}
                        />
                        <div className='composer-actions'>
                          <button
                            className='button button-secondary'
                            disabled={busy}
                            onClick={() =>
                              void act(
                                '/api/approvals/decide',
                                {
                                  approvalId: message.id,
                                  decision: 'rejected',
                                  reason: (answers[message.id] ?? '').trim() || undefined,
                                },
                                'Decision sent.',
                              )
                            }
                          >
                            {message.action === 'request_help' ? 'Cannot help' : 'Deny'}
                          </button>
                          <button
                            className='button button-primary'
                            disabled={
                              busy ||
                              (message.action === 'request_help' &&
                                !(answers[message.id] ?? '').trim())
                            }
                            onClick={() =>
                              void act(
                                '/api/approvals/decide',
                                {
                                  approvalId: message.id,
                                  decision: 'approved',
                                  reason: (answers[message.id] ?? '').trim() || undefined,
                                },
                                'Response sent.',
                              )
                            }
                          >
                            <Send size={14} />
                            {message.action === 'request_help' ? 'Send answer' : 'Approve action'}
                          </button>
                        </div>
                      </div>
                    )}
```

## 結局一：核准（Approve）與接續執行

當你在收件匣點擊核准（Approve action），前端會向後端發送 `/api/approvals/decide`，並拋出事件（例如 `agent/approval.decided`）。

Inngest 收到事件後會重新觸發工作流程。因為前面觀察狀態、產生提議的所有步驟結果都已經被快取（cached），工作流程不會重頭計算，而是直接從等待點瞬間接續（resume）。

接著，代理人從資料庫取出人類的決定，確認為核准後，便真正呼叫 rollback 動作。動作執行完成後，系統狀態會發生變更（例如版本從 V1 升級到 V2）。進入下一個迴圈時，代理人再次觀察環境，確認服務已恢復健康（healthy），判斷已無後續任務，順利結束執行。

## 結局二：拒絕（Reject / Deny）與向上呈報

如果在收到審批請求時，你在收件匣點擊了拒絕（Deny），前端發送的決定會是 `rejected`。

同樣地，工作流程接續執行並讀取審批結果。由於動作遭到拒絕，代理人絕不會去執行 rollback，線上發布維持原狀。此時代理人會將目前的處理結果視為受阻，並在下一步向上呈報（escalate），記錄人類拒絕的理由後結束或轉交人工接手。

## 結局三：狀態已改變的過期失效（Stale）

第三種常見的邊界情況是狀態過期（stale）。在分散式系統中，從代理人提出提議到人類核准，中間往往間隔了一段時間。如果這段期間內環境狀態已經被其他維運人員或排程改動，盲目執行原本的動作就會造成非預期的破壞。

為了防範這個問題，代理人在執行動作時會帶上當初觀察到的版本號（version）。如果底層執行時發現版本不符，就會回傳 `stale: true`：

<!--image:2-->

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L187-L211 -->

```typescript
      const result = await step.run(`execute-action-${cycle}`, () =>
        executeAction(
          environmentId,
          runId,
          actionId,
          decision.action,
          policy === 'read' ? undefined : state.world.version,
        ),
      )
      if (result.stale === true) {
        await step.run(`stale-action-${cycle}`, () =>
          logAgentActivity(
            environmentId,
            runId,
            'act',
            'Action rejected because service state changed',
            result,
          ),
        )
        continue
      }
      await step.run(`settle-status-${cycle}`, () =>
        setRun(runId, 'waiting', 'Waiting briefly before observing the effect'),
      )
      await step.sleep(`settle-${cycle}`, process.env.AGENT_SETTLE_DELAY ?? '1s')
```

當偵測到 `result.stale === true` 時，代理人會記錄一筆「動作因服務狀態改變而被拒絕」的活動日誌，並直接 `continue` 跳過後續的冷卻等待，立刻進入下一個迴圈重新觀察最新狀態。

## 在 Inngest Run View 讀懂每個 Loop 的輸出

要確認上述三條路徑是否符合預期，最直覺的工具就是 Inngest 的 run view。

在工作流程的設計中，通常會以迴圈週期（cycle）來為步驟命名，例如 `execute-action-1`、`settle-1`、`execute-action-2` 等。在 Inngest 的視覺化介面中，你可以清楚看到代理人一共執行了幾個迴圈才完成任務：

<!--image:3-->

1. **展開步驟階層**：整個執行會依序展開成 Loop 1、Loop 2、Loop 3 等區塊。每一個區塊代表一個完整的主動觀察與反應週期。
2. **檢視各步驟輸出**：點擊任意一個步驟節點，右側面板會顯示該步驟回傳的完整資料與關聯 metadata。例如在等待審批時，可以看到等待事件的 payload；在執行 rollback 步驟時，可以看到動作回傳的狀態變更結果。
3. **比對前後狀態**：觀察每個 loop 開頭的狀態觀察輸出，就能明確追蹤狀態版本何時從異常轉為已回復，以及代理人是否在環境恢復後做出終止判斷。

透過這種結構化的步驟命名與執行圖表，你不需要自行拼湊分散的日誌，就能在單一介面裡完整驗證審批的每一條分支走向。
