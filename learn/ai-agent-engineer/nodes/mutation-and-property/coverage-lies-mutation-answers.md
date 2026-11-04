# Code coverage 不是品質指標

你交給 agent 一項任務，它說做完了，測試也全都通過。打開 app，卻發現有個頁面載不出來、一個按鈕沒反應，還有一個價格算錯。

測試漏掉 bug，可能有三種原因：測試沒有檢查行為、重要案例沒寫進測試，或每個部件單獨測試都通過，但整合後出了問題。

很多團隊會把 code coverage 設為 pipeline 的門檻，例如 90% 或 100%，達標就 deploy。但 code coverage 不是品質指標。即使完全沒有 assertion，也可能拿到 100% coverage，因為 coverage 計算的是「測試跑過哪些程式碼行」，不是「測試有沒有檢查任何結果」。

在 TicketBay 的 refund module 中，即使把測試檔裡所有 assertion 都刪掉，coverage 仍然是 100%。

Coverage 只能指出哪些程式碼區域沒有被測到，無法說明已經被測到的區域是否測得好。要衡量測試品質，可以使用 mutation testing。

<!--image:1-->

## mutant、killed、survived

工具會對程式碼做一個小幅修改。修改後的版本叫作 mutant，接著工具會讓所有測試都跑一次，結果只有兩種：

- 至少一個測試失敗：mutant 被 killed，代表測試檢查到了受影響的行為。
- 所有測試都通過：mutant survived，代表缺少檢查這項行為的測試案例，或缺少相關的 assertion。

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L335-L349 -->
```ts
function canDrinkAlcohol(age: number) {
return age >= 18;

// the mutant: age > 18

}
// tests: 25 → true, 17 → false, 10 → false

all green against the mutant

// missing: 18 → true

this test kills the mutant
```

這個 mutant 之所以能存活，是因為沒有任何測試檢查十八歲這條界線。補上這項測試後，再讓測試對 mutant 執行，它就會失敗，mutant 也就被 killed。工具會在整個 codebase 重複這個流程，每次只改一個 mutant。

<!--image:2-->

## 四種主要型別

| 型別 | 修改內容 |
| --- | --- |
| Operator | 把加號改成減號 |
| Conditional | 翻轉一個條件：`>=` 變 `>` |
| Statement | 刪掉一行 |
| Value | 改變回傳值：`return total;` 變 `return 0;` |

每種技術棧還有幾十種 mutant。JavaScript、TypeScript 和 C# 可以使用 Stryker，Java 可以使用 Pitest，Python 可以使用 mutmut，Rust 可以使用 cargo-mutants。

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L387-L388 -->
```bash
./box npx stryker run --mutate src/domain/fees.ts
```

## mutation score

報告會列出每個檔案的 mutation score、被 killed 的 mutant，以及 survivors。mutation score 的計算方式是「被 killed 的 mutant 數量除以全部 mutant 數量」。因此，100% 的 mutation score 比 100% 的 coverage 更能反映測試品質。

Coverage 就像麵包上塗了醬。Coverage 告訴你有多少麵包面積被塗到，mutation score 則告訴你塗的是果醬、奶油乳酪，還是 Nutella。小孩不在乎百分比，只想知道是不是 Nutella。

知道該看的是 mutation score 之後，下一步是實際跑一次工具。第一次執行不需要整個 repo，但在動手之前，得先確認 baseline 是綠的。

<!--image:3-->
