# TPR 與 TNR：為何不用 precision/recall 估真 pass rate

上一節提到，只有在 **TPR 與 TNR 都超過 90%** 時，才可以停手。

不過前面只是引用這兩個指標，還沒真的算過。

這一節把它們從 2×2 的結果算出來。算完你會發現，TPR 和 TNR 不只用來評估 judge 準不準，也直接回答一件事：

> 用 judge 估出的通過率，究竟會偏高，還是偏低？

## 先約定兩個詞

開始算之前，先固定判斷方向，否則後面的比率很容易看反。

這裡把 **Pass 當作 positive**，把 **Fail 當作 negative**。

這個約定沒有對錯，重點是從頭到尾用同一個方向。實務上的文件也可能反過來定義，所以看到數字時，先確認對方把哪一類當成 positive。

## 從 2×2 的結果開始

dev set 跑完後，你手上其實只有四個數量。

令 **P** 為人工標記為 Pass 的總數，其中有 **p** 筆被 judge 正確判成 Pass。

令 **F** 為人工標記為 Fail 的總數，其中有 **f** 筆被 judge 正確判成 Fail。

把這四個數字放進表格：

| | judge 判 Pass | judge 判 Fail |
| --- | --- | --- |
| 人工標 Pass | p（判對） | P − p（false fail） |
| 人工標 Fail | F − f（false pass） | f（判對） |

上一節提到的 **false pass** 與 **false fail** 就是表格裡的另外兩格。

它們不只是描述錯誤的形容詞，是可以實際數出來的數量。

<!--image:1-->

## 兩個比率，兩個分母

有了這四個數字，就可以算出：

- **TPR = p / P**：在所有真正的 Pass 中，judge 正確判成 Pass 的比例。
- **TNR = f / F**：在所有真正的 Fail 中，judge 正確判成 Fail 的比例。

分母要看清楚：

- TPR 的分母是 **P**，也就是人工標記為 Pass 的總數。
- TNR 的分母是 **F**，也就是人工標記為 Fail 的總數。

兩個比率各自以一個人工標籤族群為分母，彼此不重疊，合起來剛好涵蓋整個 dev set。

這也是為什麼 dev set 裡的 Pass 與 Fail 都要有足夠數量：分母太小，一個案例就能讓比率大幅波動。

<!--image:2-->

## 為什麼是這兩個，而不是 precision 和 recall？

你的最終目標只有一個：**估出應用真正的通過率**。

judge 只是代替人工、幫忙算 trace 通過率的工具。你真正想知道的是它估出的通過率會偏多少，不是 judge 的成績單。

judge 會把通過率算錯，只有兩個方向：

- 漏掉真正的 Pass。
- 放過真正的 Fail。

TPR 與 TNR 剛好各自對應其中一種錯誤：

- **TPR 低**，代表 judge 漏掉真正的 Pass。你數出的通過率會**偏低**。
- **TNR 低**，代表 judge 放過真正的 Fail。你數出的通過率會**偏高**。

judge 判定為 Pass 的數量等於：

> 判對的 Pass ＋ 誤放的 Fail  
> = p + (F − f)

但真正的 Pass 數量是 **P**。

所以 TNR 下降時，代表有更多真正的 Fail 被算進 Pass，這些多出來的案例會把估出的通過率往上推。

<!--image:3-->

## precision 和 recall 沒有錯，只是回答不同問題

precision 和 recall 當然可以算，但它們不一定直接對準「修正通過率偏差」這個目標。

在把 Pass 定義為 positive 的情況下：

- **recall** 的定義其實就是 TPR：在真正的 Pass 中，judge 找回了多少。
- **precision** 則是 judge 判為 Pass 的案例中，有多少真的屬於 Pass。

precision 關心的是「judge 說 Pass 的時候有多可靠」，TPR 和 TNR 關心的則是人工標籤的兩個族群：

- 真正的 Pass 有多少被漏掉？
- 真正的 Fail 有多少被放過？

當目標是修正通過率偏差，這兩個方向更直接：漏掉真正的 Pass 會讓通過率偏低，放過真正的 Fail 會讓通過率偏高。

整理成一句：

> **TPR 與 TNR 分別以人工標籤的 Pass、Fail 為分母；precision 則以 judge 判為 Pass 的案例為分母，而 recall 在這個定義下等同於 TPR。**

## 這兩個數字在決策上怎麼用

算出 TPR 與 TNR 之後，它們不是拿來比大小的。

它們是你的校正參數。

之後你在 production trace 上跑同一個 judge，會得到一個原始通過率。這個數字可能帶有偏差，偏差的方向和大小，就要靠 TPR 和 TNR 提供線索。

到這裡，你有一組在 dev set 上穩定下來的 prompt，知道兩個比率怎麼算，也知道各種錯誤會把結果推向哪個方向。

剩下的問題是：這些數字是在 dev set 上調出來的，要拿什麼證明它們在沒看過的資料上也成立？

下一節會把 judge 凍結，再拿到 test set 上量一次。
