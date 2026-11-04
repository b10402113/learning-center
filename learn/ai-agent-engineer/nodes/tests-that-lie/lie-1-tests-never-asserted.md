# Mutants：被殺死，或存活

上一段的第一種假綠是：測試跑完了，卻沒有檢查行為。要抓這種漏，很多團隊會在 pipeline 裡設定 code coverage 門檻，例如 90% 或 100%，達標後就讓程式進入上線流程。

這種做法背後藏著一個假設：覆蓋率高，就代表測試有檢查程式行為。

但這個假設不成立。覆蓋率不是品質指標。

## 100% 覆蓋率也可能沒有任何斷言

Coverage 計算的是「測試跑過哪些行」，不是「測試檢查了什麼」。

因此，就算整份測試檔沒有任何 assertion，覆蓋率還是可能達到 100%。

TicketBay 的退款模組就是如此：刪掉測試檔裡所有斷言，覆蓋率仍然是 100%。

Coverage 只能指出哪些地方沒有被測到，無法說明已經跑過的程式碼有沒有經過行為檢查。

要知道測試是否真的驗證了行為，可以改用 mutation testing。

<!--image:1-->

## 工具只做一件事：小幅改壞程式碼

Mutation testing 的做法很直接：工具對程式碼做一個小改動，修改後的版本稱為 mutant，再用所有測試跑一次。

結果只有兩種：

- 至少一個測試失敗：mutant 被殺死（killed）。測試確實偵測到這段行為的改變。
- 所有測試都通過：mutant 存活（survived）。你可能少了一個測試案例，或少了一個斷言。

## 一條 18 歲的線

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L335-L349 -->
```ts
function canDrinkAlcohol(age: number) {
  return age >= 18;

  // the mutant: age > 18
}

// tests: 25 → true, 17 → false, 10 → false
// all green against the mutant

// missing: 18 → true
// this test kills the mutant
```

測試有三個案例：輸入 25 得到 true、輸入 17 得到 false、輸入 10 得到 false。

把 `>=` 改成 `>` 後，這三個案例都會通過，mutant 因此存活。

<!--image:2-->

原因只有一個：沒有測試檢查 18 歲這個邊界。

補上「18 得到 true」這個案例，再用 mutant 跑一次，測試就會失敗，mutant 也就被殺死。

工具會用同樣的方式，一個 mutant 接一個 mutant 地檢查整個 codebase。

## 四種主要改法

| 類型 | 改什麼 |
| --- | --- |
| Operator | 把加號改成減號 |
| Conditional | 翻轉條件：`>=` 變成 `>` |
| Statement | 刪掉一行 |
| Value | 改回傳值：`return total;` 變成 `return 0;` |

每種語言的生態系還有幾十種改法。

現成工具包括：支援 JavaScript、TypeScript 和 C# 的 Stryker，支援 Java 的 Pitest，支援 Python 的 mutmut，以及支援 Rust 的 cargo-mutants。

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L387-L388 -->
```bash
./box npx stryker run --mutate src/domain/fees.ts
```

工具跑完後會產生報告，列出每個檔案的 mutation score，以及被殺死和存活的 mutant。

Mutation score 的計算方式是：被殺死的 mutant 數量除以 mutant 總數。

## coverage 是麵包，mutation score 是抹醬

Coverage 像麵包，mutation score 像抹在上面的醬。

Coverage 顯示麵包有多少部分被蓋住；mutation score 則顯示上面抹的是果醬、奶油乳酪，還是 Nutella。

小孩不在乎那個百分比，只在乎上面是不是 Nutella。

因此，100% 的 mutation score 能說明的測試品質，比 100% 的 coverage 多得多。

<!--image:3-->

## 交給 agent 之後

mutation-testing skill（dmoka/skills）會做四件事：

1. 安裝符合 stack 的 mutation 工具。
2. 執行工具，找出缺少哪些測試。
3. 用一句話說明每個存活的 mutant：改了什麼、為什麼測試仍然通過，以及這會放過哪一種真實 bug。
4. 寫出缺少的測試，再執行一次工具，確認每個 mutant 都被殺死。

它會先檢查無聲 bug 代價最高的地方，例如金錢、權限和資料寫入。

TicketBay 的退款程式有六個存活的 mutant，其中五個不會改變 payout，剩下一個會。

Agent 解釋了那個 mutant，接著補上能殺死它的測試。

## 四條規則

- 只檢查你改動的程式碼：每個 mutant 都要被殺死，或排除並寫明理由。
- 從無聲 bug 代價最高的地方開始。
- 不要用整個 repo 的分數當 gate。沒有適用所有專案的理想數字。
- 不要讓 agent 自行把 mutant 標成 equivalent。它必須先詢問你，並附上理由。

## 殺不死的 mutant

有些 mutant 無法被殺死，因為改過的程式對每一種輸入都會回傳相同結果。

例如，費用超過 100 時一律以 100 計；把 `>` 改成 `>=` 後，在 100 這個輸入上，兩個版本都會回傳 100，沒有任何測試能分辨差異。

這種 mutant 稱為 equivalent mutant。

排除它，並用註解寫明使用了哪一個 mutator，以及排除的理由：

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L429-L430 -->
```ts
// Stryker disable next-line <Mutator>: equivalent — <why>
```

如果 equivalent mutant 太多，影響判斷，可以只對最關鍵的程式路徑執行 mutation testing。

這樣一來，要判斷的 mutant 會變少，但檢查到的程式碼也會減少。這是一種取捨，不是免費的。

斷言補齊了，只解決第一種假綠。下一段處理第二種：該測的輸入，從來沒寫成案例。
