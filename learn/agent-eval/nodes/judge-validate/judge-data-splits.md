# Judge 當分類器：train/dev/test 切分與 leakage

你手上有一批已標註 Pass／Fail 的 trace，也寫好了一版 judge prompt。跑完結果看起來「還不錯」。

問題是，這個「還不錯」是對誰說的？

如果你用同一批標註資料調整 prompt，再用同一批資料計算準確率，量到的可能只是 judge 記住了這批資料。換一批新的 trace，它就可能完全失準。

這種情況在傳統機器學習裡叫做 **overfit（過度擬合）**，judge 也會踩上同一個坑。

## 把 judge 想成一個分類器

設計 LLM-as-judge 很像訓練一個分類器，差別只在於這裡的「訓練」不是調模型參數，而是做 prompt engineering。

分類器用 gradient descent 從資料裡學出參數，judge 不是。範例是你挑的，指令是你寫的，模型只是在 context 裡照你的要求判斷。

所以 judge 的「訓練成果」不是模型權重，而是一段 prompt。

這個對照很有用：分類器要切資料才不會騙自己，judge 也一樣。把標註好的 trace 切成三組，彼此不能重疊。

<!--image:1-->

## 三組資料，三種角色

**Training set** 是建立 prompt 時可以用的範例池。

裡面的例子通常是明確的 Pass 與 Fail，用來說明 failure mode 的邊界：什麼情況該判成功、什麼情況該判失敗。

不過「可以使用」不等於要把所有範例都塞進 prompt。

**Dev set（development set，開發集）** 是另一組標註 trace，通常比 training set 大，用來反覆修正 prompt。

每次改 prompt，不管是調指令、改判斷標準或換 few-shot 範例，都要在 dev set 上重跑一次，再拿 judge 的判斷跟人工標籤比對。

這裡有一條硬規則：**dev set 的範例絕對不能出現在 prompt 裡。**

只要 judge 看過某一題的答案，你量到的就不是它判斷新資料的能力了。

**Test set（測試集）** 留到最後才用。

只有在 prompt 定稿後，才拿 test set 算 judge 的 alignment。開發期間不要看它的結果，它才能當成 judge 真實準確度的無偏估計。

具體來說，你會拿到 **true positive rate（TPR）** 和 **true negative rate（TNR）** 兩個數字，之後再拿它們修正 production trace 的通過率估計。

三組的差別可以記成一句話：

**train 的範例可以放進 prompt，dev 用來改 prompt，test 在定稿前完全不能碰。**

## Leakage：分數好看的最常見原因

範例跨組重複使用，尤其是把 dev 或 test 的範例放進 prompt，就叫 **data leakage（資料洩漏）**。

<!--image:2-->

資料洩漏會墊高準確率的估計。你以為 judge 變準了，其實只是先讓它看過考題。

傳統監督式學習也有這個問題，但 judge 更容易踩線：prompt 就像一張便利貼，想到什麼就貼上去，沒有機制會阻止你把評估資料放進去。

洩漏在實務上通常長這樣：

你在 dev set 裡看到一個很漂亮的邊界案例，心想「這個放進 few-shot 一定很有用」，就把它貼進 prompt。

下一輪的 dev 分數果然跳高，你很高興。但從這一刻起，這個案例就不能再算進 dev 分數了，因為它已經在 prompt 裡。

## 比例該怎麼配

judge 不需要很大的 training set。

In-context learning 通常在少量、挑選過的範例之後就開始飽和，範例再多，多出來的效果很快就會變小。

所以資料應該多留給評估。典型的切法是：

- Training set：10%～20%
- Dev set：40%～45%
- Test set：40%～45%

<!--image:3-->

這跟教科書常見的 80／10／10 完全相反，別被過去的習慣拖著走。

你調的是文字 prompt，不是幾百萬個模型參數，所以這裡容易不夠的是評估資料，不是訓練資料。

## 兩組評估資料都要有足夠的 Fail

還有一件事要一起決定：dev 和 test 裡，Pass 和 Fail 各要放多少。

原則是兩組都要有足夠的 Pass 與 Fail 範例，理想上各有 30～50 個。

因為之後要算的 TPR 和 TNR 是兩個獨立的比率，TNR 的分母是 Fail 的數量。Fail 只有 5 個的話，TNR 就會被單一案例牽著走，數字晃得很大。

<!--image:4-->

評估組的比例不需要反映真實世界的發生率。

假設你的 agent 很少失敗，真實資料裡 Fail 只占 2%，你在 dev 和 test 裡還是可以刻意把 Fail 加到接近一半。

這種不平衡是刻意安排、也可以接受的。代價是 test set 上的原始通過率不能直接當成真實世界的通過率，因為樣本組成先被你調過了。

這件事之後會再處理。現在只要抓住一點：**評估組的組成是為了方便量測，不是為了模擬真實世界。**

## 切完之後你會看到什麼

切分完成後，你手上應該有三份清單，而且能指出每一筆 trace 屬於哪一組，以及為什麼放在那裡。

最常見的錯誤不是比例切錯，而是三組之間有重複。

例如同一個 trace 用不同 id 出現兩次，或同一段對話被切成兩半，一半進 train、一半進 dev，這些都算洩漏。

所以切分前先去重，切分完再檢查一次三組的交集。

到這裡，你有了三組互不重疊的資料，也知道每一組要做什麼。

下一個問題是：dev set 上的修正迴圈實際怎麼跑？要看哪些 disagreement、改 prompt 的哪個部分、什麼時候該停手。
