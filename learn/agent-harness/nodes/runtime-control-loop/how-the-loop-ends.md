# 迴圈怎麼結束：回答、maxSteps、失敗

你的 agent 迴圈已經會吐字了：模型的 token 一串串流進 UI，看起來什麼都會。

但還有一個問題沒回答——這一圈到底什麼時候算「結束」？

如果沒有定義好收尾方式，UI 的 spinner 不知道該轉到什麼時候，使用者也分不清 agent 是答完了、卡住了，還是出錯了。

這一節拆開來看三件事：正常怎麼收尾、出事怎麼收尾，還有為什麼最後都必須發出明確的事件。

## 正常收尾：LLM 不再叫工具

每一圈結束時，harness 會拿到這次的 tool calls，也就是 LLM 要求執行的工具清單。

因為回應是 stream，所以這裡要先 `await`，等串流結束後，才能取得完整結果。

判斷只看一件事：tool calls 是 0 個，代表 LLM 沒有要叫任何工具，它已經把話說完了。

這時候取出最終文字，並發出兩個事件：

<!--image:1-->

<!-- derived -->
```ts
const toolCalls = await result.toolCalls;

if (toolCalls.length === 0) {
  const text = await result.text();
  emit({ type: "model completed", workflowId, text });
  emit({ type: "workflow completed", workflowId, output: text });
  return;
}
```

`model completed` 對 UI 說：模型這一段講完了，完整文字在這裡。

`workflow completed` 對 UI 說：整個 workflow 已經完成，final output 就是這段文字。

發完事件後就 `return`。這是正常收尾唯一的出口。

過程中還可能有 `tool completed` 這類中繼事件，表示工具完成了一輪工作。不過，這些事件記錄的是過程，不是最後的結局。

## 掉出迴圈就是出事

正常的完成分支一定會 `return`。

這句話倒過來看，重點就很清楚：後面的程式是掉出迴圈後才執行到的，就代表這一輪沒有正常完成。

會被踢出迴圈的原因只剩兩種：

- 跑到 `max steps`，也就是超過設定的最大步數。
- 發生原本沒預料到的意外。

不管是哪一種，收尾事件都一樣是 `workflow failed`，還要留一則訊息給使用者：

<!-- derived -->
```ts
// 正常完成的分支都已經 return，能走到這裡就是被踢出迴圈
emit({ type: "workflow failed", workflowId, message: "max steps" });
```

拿 `return` 當護欄的好處是，不需要另外設一個 flag 來記錄「有沒有正常結束」。

只要確認所有正常路徑都會 `return`，剩下掉出迴圈的情況，就一律視為異常。

<!--image:2-->

## LLM 呼叫本身也會出錯

還有一種失敗，不是發生在迴圈控制，而是呼叫 LLM 的那一步就出錯了。

原因可能很多，例如被 rate limiting 擋下來、自己的程式有 bug，或模型服務整個掛掉。

這些錯誤都要接住，先把錯誤顯示給使用者，然後結束 workflow：

<!-- derived -->
```ts
} catch (error) {
  emit({ type: "workflow failed", workflowId, error: String(error) });
  return;
}
```

這裡的 `String(error)` 是把錯誤轉成字串。

不是每個丟進來的東西都有可以呼叫的 `toString`。`String()` 會盡力把參數轉成字串，效果類似在後面拼上一個空字串，也就是 `+ ""`。

錯誤放進事件之前，一定要先轉成字串，UI 那端才不需要猜測它的型別。

## 三個結局，兩種收尾事件

把這一段整理起來，每一圈的結局只有三條路：

- **LLM 不叫工具**：取出最終文字，發出 `model completed` 和 `workflow completed`。
- **被踢出迴圈**：遇到 `max steps` 或意外，發出 `workflow failed`。
- **呼叫 LLM 出錯**：可能是 rate limiting、程式 bug 或服務掛掉，發出 `workflow failed`，並把錯誤轉成字串。

正常與異常各自對應一個收尾事件：`workflow completed` 與 `workflow failed`。

UI 不需要知道內部是怎麼判斷的，只要認得這兩個事件就夠了：

- 收到 `workflow completed`，停止 spinner，顯示答案。
- 收到 `workflow failed`，停止 spinner，顯示錯誤。

<!--image:3-->

「迴圈怎麼結束」，說到底就是把結束的理由翻譯成 UI 看得懂的事件。
