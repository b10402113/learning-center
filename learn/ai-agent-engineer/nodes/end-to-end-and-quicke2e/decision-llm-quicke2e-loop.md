# Decision LLM 與 QuickE2E：模型只做選擇，判定交給程式

每一條沒有 Playwright 測試的流程，仍然得有人親自走一遍。現有做法各有一個明顯缺口：LLM agent 確實能在瀏覽器裡操作，但每次判斷「下一步該點什麼？」都要花上好幾秒，還會消耗 token；腳本化測試不需要模型，速度快、成本低，但 UI 一改就容易失效。

QuickE2E 採用介於兩者之間的做法，把「決定下一步」縮到最精簡。decision LLM 只負責做決定。給它一個 state（一頁畫面）和幾個有型別的題目，它就會從清單中選一個選項、給出刻度上的分數，或回答帶有信心值的 yes／no，接著由程式照答案執行。它完全不生成文字，因此速度約比一般 LLM 快一百倍，成本約低三百倍。

Jev（TypeSafe AI）就是這種 decision LLM。它不生成句子，只讀取幾個允許標籤的 logits。

## 迴圈只有四拍

QuickE2E 的快照→候選→選擇→判定迴圈分成四步：測試檔設定目標，以及每個「可以輸入的值」（例如一個 email）；QuickE2E 在真實瀏覽器裡打開頁面，整理出合法動作清單（CLICK Pay、TYPE_TEXT Email）；decision LLM 根據目標挑選動作；最後由**程式**檢查結果，包括目前頁面，以及使用者看得到的文字。

`src/loop.mjs` 整個流程可看成三條線，各自指向不同的位置：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L1-L4 -->
```js
// The run loop. A decision model picks each step; nothing in the loop generates text.
//   decisions  -> the engine: jev (hosted, OpenRouter), vercel (Jev via the Vercel AI Gateway) or local
//   text input -> from the test spec
//   "am I done?" -> deterministic assertion
```

決策由引擎負責，文字來自 spec，「完成了嗎」則由確定性斷言判定。三件事各有不同的負責者，構成整個設計。

<!--image:1-->

## 一次決策長什麼樣子

送給引擎的 request 只有兩個欄位：`state` 與 `questions`。`state` 是這一頁的摘要，會把 token 樣的網址片段換成 `:id` 的 url、標題、可選元素清單（角色、標籤、值）、表單目前的狀態值，以及最近五步的動作歷史。`questions` 是一個型別為 `choice` 的題目，包含候選清單，以及兩條指令：目標和規則。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L49-L50 -->
```js
const RULES = "Choose the one operation that advances the goal from this page. " +
  "Do not repeat a step that is already satisfied. Fill required fields before submitting.";
```

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L347-L348 -->
```js
const questions = { action: { type: "choice", criteria, instructions: { goal, rules } } };
const t0 = performance.now();
```

候選清單中的每一項都是一個字串，例如 `CLICK 7 Pay [button]`，內容依序是動作、編號、標籤，最後是角色。角色是後來才加上的。沒有角色時，模型只能根據標籤，在 `CLICK 5 Clients`（導覽連結）和 `CLICK 12 Client`（表單裡的下拉選單）之間猜選，結果曾以 0.55 的信心選中導覽連結，離開表單。

引擎有三種：`jev`（hosted，透過 OpenRouter）、`vercel`（同一個 Jev，透過 Vercel AI Gateway），以及 `local`（在 Apple Silicon 上執行的小模型，會把候選標籤讀成 logits，不需要 key，也不花錢）。

## 候選是預算下的合法動作，不是整頁選單

一頁上可能有幾十個可點擊的項目，但一次決策只有 1,024 個 token 的預算。因此快照之後會先壓縮候選：依角色排序，文字框、密碼框和下拉選單排最前面；按鈕、tab、checkbox、開關和 radio 排第二層；其餘項目排在後面。接著從分數最低的項目開始刪除，直到每條候選都能放進字母上限。

字母上限是固定的：引擎會把每個候選對應到**一個字母**，只讀取那 52 個字母的 logits。第 52 條以後的候選根本不會送進模型判斷。因此 `src/loop.mjs` 裡的 `LETTER_CEILING` 是 52，而 `WAIT`、`DONE`、`BLOCKED` 這幾個逃生選項永遠排在最後，也就最先被刪除。

壓縮還會直接移除不合法的動作，而不是把它們留在清單裡，再用指令要求模型別選。同一個例子也顯示了這個做法的必要性：listbox／menu 開啟時，裡面的選項是唯一合法動作。此時若仍把 `WAIT`／`BLOCKED` 放進候選，模型可能會選擇逃生門；實測信心值為 `BLOCKED` 的 0.9997。刪除錯誤選項後，模型給出 `CLICK`，信心值是 1.00。

<!--image:2-->

## 拿掉壞選項，而不是叮嚀模型

這個原則適用於整份候選清單：

- **不提供 `DONE`。** 程式會在**每一個快照**上先檢查目標。因此輪到模型回答時，「完成了嗎」按定義就是 false。保留這個選項只會多出一種失敗方式：模型誤報完成。
- **`BLOCKED` 只會在真的無事可做時出現。** 只要頁面上還有 spec 的值等著輸入或選擇，就代表仍有進展，因此 `BLOCKED` 不該列為選項。
- **`neverClick` 的元素不會出現在候選清單中**，框架的 dev-tools 按鈕也一樣，因為它們不是 app 的一部分。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L853-L868 -->
```js
const addMeta = (space, listboxOpen) => {
  // An open list with a choice already made (a multi-select stays open: MUI) can be closed; without
  // this the form behind it was unreachable (launch test 2026-10-07, 0/2). A list with nothing
  // chosen yet gets no escape option (2026-09-21: WAIT/DONE/BLOCKED there were taken over a pick).
  if (listboxOpen) { if (space.all.some((r) => r.a.popup && r.a.role === "option" && r.a.selected)) space.criteria.CLOSE = "close the open list"; return; }
  space.criteria.WAIT = "wait for the page";
  // No DONE option. The goal is checked deterministically on EVERY snapshot before this decision,
  // so when the model is asked, "done" is false by construction; offering it only created a
  // failure mode (Jev 27/30 from false DONEs in the spike; the local engine answered DONE four
  // times in a row on late-enable.html and card-year.html). Take the bad option away.
  const specWork = Object.keys(space.criteria).some((k) => k.startsWith("TYPE_TEXT:") || k.startsWith("SELECT:"));
  if (!specWork) space.criteria.BLOCKED = "nothing can progress";
};
```

候選清單之外還有兩道閘門，確保模型只能從合法選項中選擇。第一道是答案必須符合**我們**提供的 key。任何不在清單裡的答案都會被當成 `BLOCKED`，絕不執行。第二道是信心值低於 0.3 的選擇不會執行，而是直接算一次 `BLOCKED`。這是因為曾有一次拒絕測試，在信心值只有 0.22 時真的按下付款。打字與選單是例外，因為這類選擇沒有副作用。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L1066-L1067 -->
```js
// The engine must return one of OUR keys. Anything else is treated as BLOCKED, never acted on.
if (!(d.choice in space.criteria)) { invalidChoice = d.choice; d.choice = "BLOCKED"; }
```

## 文字只從 spec 來

模型不寫字，連測試資料也不會寫。只有當欄位在 spec 的 `inputs` 裡有對應值時，`TYPE_TEXT` 這個候選才會出現。找不到 key 的欄位不會列入候選，因為它不是這次測試的欄位；把它列入清單只會造成硬失敗。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L380-L385 -->
```js
// Text comes from the test spec. No model invents test data.
// Same resolution as compact()'s suppression check, or the loop offers a field it cannot fill.
function specValue(flow, action, keyMap) {
  const k = keyFor(action.label, flow.inputs, action.role) ?? keyMap?.get(action.label) ?? null;
  return k === null ? null : flow.inputs[k];
}
```

key 的比對方式是「最佳匹配，不是第一個匹配」：完全相同的標籤優先於整字相符，整字相符優先於子字串；若仍然平手，就比較 key 的長度。否則，一個名為 `Username` 的欄位可能會拿走原本要給 `Full name` 的 `name`。

欄位名稱改了怎麼辦？如果 `Email` 改成 `E-mail`，字串比對就會失效，decision LLM 因而多回答一題：這個頁面上還有哪些 key 尚未使用，以及哪個 key 應該放進這個欄位。答案仍然只是從 key 清單中**挑出一個選項**，輸入的文字依舊來自 spec。密碼欄位不依賴標籤，而是依賴角色；角色不會因為欄位改名而改變。

<!--image:3-->

## 判定是程式的工作

「完成了嗎」不是交給模型回答的選擇題，而是每個快照都會執行的確定性檢查：最終網址符合 `expectUrl`；使用者看得到的文字包含 `expect` 的每一句；該消失的文字確實不在。這項檢查只要約 2 毫秒，沒有理由等模型來判斷。

流程會**先檢查，再決策**，不會等動作完成後才檢查。因為動作剛啟動的導覽可能和檢查同時發生，讓斷言在一個正要離開的網址上通過。正確通過時，outcome 是 `DONE_VERIFIED`。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L988-L994 -->
```js
// With `control`, loading the start URL IS the action (another user's order), so step 0 counts.
if ((i > 0 || routeRec?.hops?.length || flow.control) && await checkGoal(page, flow, snap)) { outcome = "DONE_VERIFIED"; break; }
```

程式也負責否決。一種情況是「什麼都沒做就通過」：如果流程開始操作前，斷言就已經成立，這不能證明目標真的達成，因此 outcome 會改成 `WEAK_ASSERTION`。另一種情況是原地打轉：同一個動作在完全相同的頁面上重複到第四次，就算作 `LOOP`，流程會立刻停止，並指出造成停滯的動作。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L1299-L1305 -->
```js
// NO ACTION, NO PASS (launch test 2026-10-07, false pass on OrangeHRM): the start check read the page
// while a SPA still showed its spinner; the form then rendered with a " * Required" footnote, and the
// run passed after 11 WAITs without one action. Assertions that hold before the run did anything
// prove nothing.
const acted = steps.some((st) => !["WAIT", "BLOCKED", "DONE"].includes(st.op) && !st.stale && !st.loop) || routeRec?.hops?.length;
```

因此模型不需要「done」這個選項。即使模型想宣告完成，也只有程式能確認。

<!--image:4-->

## 寫哪些案例，付多少錢

每個流程可以寫四種案例：happy path、邊界、規則被打破（例如使用過期的折扣碼），以及攻擊（例如使用別人的訂單，或在網址中放入負數量）。在 TicketBay 的結帳流程上，QuickE2E 比裝有瀏覽器工具的 Claude Code 快十倍，成本約低兩百倍。

費用有兩種方式：使用付費 API，透過 OpenRouter 執行，每次不到十分之一美分；在本機執行則免費，Apple Silicon 的 Mac 可以使用，小模型也放得進只有 8 GB 記憶體的機器。一次執行通過後，QuickE2E 可以替你寫出一條一般的 Playwright 測試，再交給你的 gate 執行。decision LLM 負責探索，程式化的斷言負責守門。

整個設計的核心是：模型只負責從合法選項中挑選；文字只來自 spec；這次是否通過，永遠由程式判定。三者分工明確，才能建立一個每步只需幾百毫秒、每次不到一分錢的 E2E 迴圈。

跑完之後，你拿到的不是一個「好」或「壞」，而是一份紀錄。怎麼讀那份紀錄，是下一段的事。
