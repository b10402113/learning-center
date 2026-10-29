# 多輸出不能都一樣：cosine 相似度與平均成對相似度

上一篇留下了一個不太舒服的問題：Pass@5 很漂亮，但五個候選答案可能只是同一段話換了五種說法。

對使用者來說，那等於只有一個選擇被重複五次。

所以要分開量兩件事：

1. 這組輸出是否正確，也就是上一篇提到的三種 @k 指標。
2. 這組輸出彼此有多相似，也就是本篇要處理的多樣性。

## 先把文字變成可以比較的向量

要比較兩段文字「像不像」，得先把文字轉成向量。

這要靠 **embedding**：它把每段文字轉成一組數字，語意越近的文字，向量方向通常也越近。

有向量之後，就能用 **cosine similarity**（餘弦相似度）比較兩個向量的夾角。這個數字反映兩段文字在語意上有多近；就算用詞完全不同，也可能被認出來。

同一個工具能做兩種比較，但不能混在一起：

- **候選答案和 reference 比較**：例如拿候選答案去對照原始輸入或理想答案，衡量的是 **relevance**，也就是有沒有答到重點。
- **候選答案彼此比較**：把候選答案兩兩相比，衡量的是 **diversity**，也就是它們是不是一直在講同一件事。

## 平均成對相似度：一個數字代表整組有多重複

多樣性不能只看其中一對答案。

如果要知道整組輸出有多重複，就要把組內所有該比較的 pair 都算過，再取平均。這個數字稱為**平均成對相似度**。

令 \(O = \{o_1, \ldots, o_N\}\) 代表一組輸出，\(e_i\) 是輸出 \(o_i\) 的 embedding，\(P\) 是要比較的 index pair 集合，公式如下：

\[
\text{AvgSimilarity}
=
\frac{1}{|P|}
\sum \cos(e_i, e_j)
\]

平均相似度越低，通常代表這組輸出的多樣性越高。

<!--image:1-->

書上的實作如下：

<!-- source: sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1655-L1670 -->

```python
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Example: 5 embeddings, each 384-dim
embeddings = np.random.rand(5, 384)

# Pairwise similarity matrix
sim_matrix = cosine_similarity(embeddings)

# Average of unique pairs (exclude diagonal)
triu_indices = np.triu_indices_from(sim_matrix, k=1)
avg_similarity = sim_matrix[triu_indices].mean()

print(f"Average pairwise similarity: {avg_similarity:.4f}")
```

這段程式有兩個細節值得注意。

第一，`triu_indices` 取的是矩陣的上三角，而且排除對角線。因為每個向量跟自己比，相似度一定是 1，算進去只會把平均值往上拉。

第二，範例用的是亂數向量，所以跑出來的數字沒有意義。這段程式的用途是示範怎麼接上計算流程，不是示範某個實際結果。

## 選錯 pair，指標就答錯問題

公式中最容易被忽略的部分，是 \(P\)：**到底要比較哪些 pair？**

書上的例子是時尚推薦。真正想知道的問題是：「今天的推薦，和過去一週的推薦像不像？」

因此，\(P\) 只放這種 pair：其中一個輸出來自今天，另一個來自過去七天。一天大約比七次，看的是短期內有沒有一直推薦相似的東西。

如果偷懶，把組內所有 pair 全部拿來平均，可能會出現兩個問題：

- 衡量焦點被稀釋。
- 今天和昨天幾乎一樣的推薦，可能被其他不相關的 pair 蓋掉。

最後平均起來看似沒有問題，但使用者實際收到的，可能還是昨天那一套衣服。

所以選 pair 之前，先問自己一句：

**我到底害怕哪一種重複？**

是同一題的五個候選答案互相抄，還是不同日期的推薦越來越像？這兩個問題的答案不同，\(P\) 的定義也應該不同。

<!--image:2-->

## 放進 dashboard 一起看

平均成對相似度不該單獨解讀，而要和 @k 指標並排查看：

- **Success@k 高、平均相似度低**：代表 agent 真的產生了多個有效，而且彼此不同的答案。
- **Success@k 高、平均相似度也高**：代表它可能只是把同一個答案重複五次，讓 @k 分數看起來偏高。

實際做法是把平均相似度當成 group-wise 指標的附帶欄位，和 @k 一起記錄。

如果看到 Success@5 突然上升，先確認平均相似度有沒有同時上升。假如兩者一起升高，那不一定代表 agent 變強，也可能只是它變得更懶了。

<!--image:3-->

## 這些指標合起來代表什麼？

走到這裡，judge 才算從「能判斷」變成「能長期相信」。

回頭看這五篇，其實是在補五種不同的漏洞：

- **偏誤**：靠換位、長度中立和換 judge 模型，抵銷系統性的偏差。
- **隨機性**：同一條 trace 重跑 3–5 次，等 label 穩定後才算有把握。
- **過期**：資料漂移和模型升級可能讓原本的對齊失效，所以要定期重算 TPR、TNR，並一起管理版本。
- **多輸出**：一題有多個候選答案時，用 Success@k、Precision@k、Recall@k 回答「有多少答案是對的」。
- **多樣性**：用 cosine 相似度和平均成對相似度回答「這些答案是不是其實都一樣」。

這些做法沒有一項是為了讓單一數字變得更好看。

它們真正要確認的是：dashboard 上那個通過率，究竟反映 agent 的實際表現，還是只是 judge 自己製造出來的雜訊。
