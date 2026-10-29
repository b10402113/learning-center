# 重跑 3–5 次：label 穩定才算 judge 有把握

上一篇留下一個訊號：同一個 pair 換位之後，兩次判決不一致。當時我們把它記成 tie。

但記成 tie 只是把問題藏起來，沒回答真正的疑問：judge 對這條 trace 到底有沒有把握？

這件事沒辦法從單次判斷看出來。你得讓它多判幾次。

## Judge 自己就是不穩定的

LLM-as-judge 本身是隨機的（stochastic）。同一條 trace、同一個 judge，跑兩次可能拿到不同的 label；temperature 設得越高，這種情況通常越明顯。

這和上一篇那三種偏誤不是同一回事。

偏誤有方向，總往同一邊偏，所以可以設計控制方法把它抵銷。隨機性沒有固定方向，只是在同一個判斷附近晃。換位或改 rubric 條款都抵銷不了它，只能實際量出它有多大。

量法很直接：同一條 trace，將 temperature 設為大於 0，重跑 3–5 次。

<!--image:1-->

## 看 reasoning 變，還是 label 變

重跑之後看兩件事，而且兩件事的意思完全不同：

第一，reasoning 有沒有變；第二，final label 有沒有翻動。

判準是：**reasoning 可以變，label 要穩。**

為什麼可以接受 reasoning 改變？因為它只是模型走到結論的路徑。同一個判斷，模型這次可能先談正確性，下次先談完整性；用詞和順序都不一樣，最後還是停在 Pass。

那通常表示 rubric 的定義夠清楚，模型只是從不同角度走到同一個結論。

為什麼不能接受 label 翻動？因為 label 是下游拿來算比率、TPR、TNR 和信賴區間的資料。同一條 trace 今天算 Pass、明天算 Fail，你的通過率就不再是同一種量測，只是一組會自己跳動的數字。

<!--image:2-->

<!-- derived -->
```json
{
  "trace_id": "trace-0182",
  "runs": ["Pass", "Pass", "Fail", "Pass", "Pass"],
  "label_stable": false,
  "reasoning_varied": true
}
```

這筆紀錄的重點不是「4 比 1，所以算 Pass」。`label_stable` 是 false，這才是重點。

它告訴你：這條 trace 落在 judge 的模糊地帶。

<!--image:3-->

## Label 翻動時，該修的不是 judge 的溫度

看到 label 翻動，最直覺的反應是把 temperature 調成 0，讓它每次都給出相同答案。

這樣重跑確實每次都一樣，但你量到的是解碼的穩定，不是 rubric 清不清楚。模糊還在，只是被藏起來。

比較正確的讀法是：judge 對這條 trace 不確定，而不確定通常是 criterion 定義不夠細造成的。

處理方式是回到 rubric：把模稜兩可的地方寫得更具體，或補上更多 examples，讓模型知道遇到這種邊界情況時該歸在哪一邊。

那些 label 翻動的 trace 不要丟掉。它們是最有價值的樣本，因為正好標出了 rubric 的邊界。

把這些案例收進 examples，下一版的 judge 就能少一個模糊點。

## 穩定率是 judge 的健康指標

跑完之後，每條 trace 會留下一個小陣列：五次重跑裡幾次 Pass、幾次 Fail。

接著算出「五次結果全部相同」的比例，這就是這個 judge 在這批資料上的穩定率。

這個數字要和 judge 版本一起記錄。它不進最終的通過率計算，但能幫你判斷這個 judge 適不適合大規模跑。

連同一條 trace 都判得不穩，它對新 trace 的判斷也沒有太大意義。

不過，這裡量到的穩定度，只代表「今天、這批資料、這個模型版本」的結果。

下一個問題：production 資料慢慢改變，或你升級 judge 使用的模型之後，這套判斷還準嗎？
