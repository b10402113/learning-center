# Tool call 是請求，不是執行

上一節把 stream 翻成事件之後，其中一種 part 是 tool call：模型開始說「幫我跑這個工具」。

這時最容易誤會的是，以為模型會自己執行工具。其實不會。

**Tool call 是請求，不是執行。**

這一節把兩件事拆開講：模型到底回傳了什麼、工具執行結果要怎麼配對回去。

## 模型只回傳名稱與參數

先把事實說清楚：LLM 手上沒有你的程式碼，OpenAI 的伺服器上也沒有你的函式。你寫的工具，只存在自己的 server 上。

那模型到底回傳了什麼？

回到你把 tools 傳進 `streamText` 的那一刻。當時你提供了三件事：

- 工具的名稱
- 工具的說明
- 工具需要的參數格式

模型回應時，就是拿這些資訊做決定：選哪個工具、帶哪些參數。

它只會回傳工具的名稱與參數。就這樣，沒有別的。

<!--image:1-->

## 我們是 LLM 的小幫手

函式不會自己跑起來，除非我們去執行它。

實際流程是：模型提供工具名稱與參數，我們把這份請求轉成一次真正的函式執行。執行完成後，再把結果送回模型，告訴它：

「記得你剛才叫我跑的那個工具嗎？這是它的結果。」

講得誇張一點，harness 就是 LLM 的小幫手。模型說要跑什麼，我們就照著執行，完成後再回來報告結果。這就是 tool calling 的整個流程。

<!--image:2-->

順帶一提，有些平台的伺服器上本身就有工具，例如內建的搜尋功能。你可以直接要求平台使用這些工具，讓它們在平台自己的機器上執行。

但你自己寫的函式，永遠只會在自己的 server 上執行。

## toolCallID：把結果配對回去

模型每次要求執行工具時，都會在它的伺服器上產生一組 **tool call ID**。這組 ID 就像配對用的編號。

回傳執行結果時，也要帶回同一組 tool call ID。

模型要怎麼知道這個結果是在回應哪一筆請求？靠的就是這組 ID。

如果沒有把 ID 帶回去，多數 LLM 會直接出錯：它收到一則工具結果，卻找不到對應的 tool call ID，不知道該把結果接到哪一筆請求上。

<!--image:3-->

## 發一個事件，讓 UI 知道發生什麼事

<!-- derived -->
```js
for (const call of toolCalls) {
  // LLM 只是「請求」，所以事件型別叫 tool request
  emit({
    type: "tool request",
    workflowID,
    toolCallID: call.toolCallID,
    name: call.name,
    arguments: call.args,
  });

  const output = await runTool(call.name, call.args); // 真正的執行在我們這邊
  messages.push({ role: "tool", toolCallID: call.toolCallID, content: output }); // 帶回同一個 ID
}
```

事件的型別叫做 **tool request**，用來提醒系統這件事正在發生：工具還沒被執行，LLM 只是請求我們去跑。

事件裡要帶上：

- workflow ID
- tool call ID
- 工具名稱
- 工具參數

UI 拿到這些資訊，才能在畫面上顯示對應的小方塊：這次呼叫了什麼工具、輸入是什麼、結果是什麼、現在跑到哪個狀態。

如果不發送這個事件，UI 就什麼都不知道。

<!--image:4-->

## 沒有 tool call，這一輪就結束了

拿到 tool calls 之後，要先確認裡面有沒有內容。

`stream` 要先 `await`，tool calls 也要等它完成後，才知道模型有沒有要求執行工具。

如果 tool calls 是空的，代表模型沒有要求我們執行任何工具，這一輪就完成了。這時候取出最終文字，發送一個 `model completed`，再發送一個 `workflow completed`，整個流程就結束。

如果有一筆以上的 tool call，就進入剛才說的循環：

1. 執行工具
2. 把結果帶回去
3. 讓模型繼續處理

這個被叫去執行工具的過程，就是前面說的：我們在當 LLM 的小幫手。

工具跑完、結果也回填了，迴圈會再轉一圈。那這一輪到底什麼時候才算結束？下一節回來收尾。
