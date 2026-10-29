# 一題多輸出：Success@k、Precision@k、Recall@k

前面幾篇都把一條 trace 當成一個 case：一個輸入、一個輸出，再由 judge 給一個 Pass 或 Fail。

但 agent 常常不是這樣運作。它一次可能產生多個候選答案、檢索好幾份文件，或提出多個選項。這時候要評估的是一整組輸出，不再只是單一輸出。

只挑第一個候選來判斷，量到的是「第一個候選好不好」；「這個 agent 能不能做到」是另一個問題，兩者差很多。group-wise metrics 就是來補這個差的。

## Success@k：至少中一個

Success@k 在 code generation 的情境也叫 Pass@k。定義是：所有評估題目中，前 k 個輸出至少有一個正確的題目比例。

例如，一個 code generator 每題產生五個候選，Pass@5 就是「至少有一個候選通過所有 unit test」的題目比例。

這個數字回答的是：「這個 agent 有沒有能力做到？」

它不在意其他四個候選有多差，只要其中一個過關，這題就算成功。

<!--image:1-->

所以，k 一定要寫出來。k 越小，越接近「一次就答對」的能力；k 越大，越接近「多試幾次能不能答對」。

Pass@5 和 Pass@1 代表的是兩個不同的問題，不能直接拿來互相比較。

## Precision@k：前 k 個裡有幾個是真的

Precision@k 量的是：前 k 個輸出中，正確項目占了多少比例。

舉個例子：LLM 提出 5 個 API call，其中 3 個合法。那麼：

**Precision@5 = 3 ÷ 5 = 0.6**

這個數字回答的是：「排在前面的結果乾不乾淨？」

當使用者或下游系統只會查看前幾個結果時，precision 幾乎就是他們實際感受到的品質。

<!--image:2-->

## Recall@k：該找到的有沒有被漏掉

Recall@k 量的是覆蓋率：所有正確項目中，有多少出現在前 k 個結果裡。

例如總共有 10 個正確答案，前 3 個建議裡找到其中 3 個：

**Recall@3 = 3 ÷ 10 = 0.3**

這個數字回答的是：「有沒有漏掉該找到的東西？」

書上那句話講得準：高 precision 配低 recall，表示系統猜得準，卻漏掉很多答案。

<!--image:3-->

## 三個數字，三個不同的問題

把三個指標並排看，差別就清楚了：

- **Success@k**：這批題目中，有多少比例至少成功一次？
- **Precision@k**：拿出來的前 k 個結果中，有多少是真的？
- **Recall@k**：應該被找到的項目中，有多少真的進了前 k 個？

一個 agent 可能有很高的 Pass@5，卻有很低的 Precision@5：它多試幾次總會答對，但每次吐出的前五個結果裡，有四個是垃圾。

這種 agent 適合當候選產生器，卻不適合直接把輸出交給使用者。

反過來，precision 高、recall 低的系統，就像一個很保守的檢索器：交給你的結果幾乎都正確，但很多好東西根本沒有被找出來。

## 接到 judge 上怎麼算

前提和前面一樣：每個候選都要有一個 Pass 或 Fail 的 label，來源可以是你的 judge 或 code check。

有了 label 之後，三個指標的聚合方式不一樣：

- **Success@k 是題目層級的**：每題檢查前 k 個結果中，是否至少有一個 Pass，再對所有題目取平均。
- **Precision@k 是組內的**：每題計算前 k 個結果中，Pass 所占的比例。
- **Recall@k 需要一個分母**：也就是「總共有幾個正確項目」。如果題目有 gold set，計算會很直接；但如果沒有可靠的「應該找到哪些」清單，recall 就算不出來，不要硬湊。

<!-- derived -->
```python
def success_at_k(labels, k):
    return int(any(labels[:k]))

def precision_at_k(labels, k):
    top = labels[:k]
    return sum(top) / len(top) if top else 0.0

def recall_at_k(labels, k, total_relevant):
    return sum(labels[:k]) / total_relevant if total_relevant else 0.0
```

三個函式都吃同一份 label 陣列，差別只在分子和分母怎麼取。

所以報這組指標時，要把 k 和總數一起寫出來。不然讀者還原不出你到底算了什麼。

## 先別急著慶祝 Success@k

Success@k 有一個很容易被濫用的地方：它只看「有沒有一個答對」，完全不管其他候選長什麼樣。

如果 agent 每次產生的五個候選，其實只是同一段話換個說法，Pass@5 可能會非常漂亮。但那只是同一次成功被算了五次。

對使用者來說，他並沒有五個真正不同的選擇，只有一個選擇的五種寫法。

<!--image:4-->

所以 group-wise metrics 只回答了一半的問題。接下來要問：這組輸出彼此有多像？

如果五個候選幾乎一模一樣，這些 @k 數字就只是系統在重複計算同一件事。
