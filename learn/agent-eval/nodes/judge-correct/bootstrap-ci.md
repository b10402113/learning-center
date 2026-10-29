# Bootstrap 95% 信賴區間：這個修正後的數字有多穩

上一篇留下了一個問題：θ̂ = 0.87，剛好越過 0.85 的門檻，但這個數字來自一份 test set。

如果換一份 test set，TPR 和 TNR 可能會稍微改變，θ̂ 也會跟著移動。那麼，它到底會動多少？

這個問題不能靠同一份資料再算一次來回答，因為你手上只有這一份 test set。Bootstrap 的做法是：把現有的 test set 當成整個世界的縮影，反覆重抽樣，模擬「如果當初抽到的是另一份資料」的情況。

重抽樣後得到的估計值散得越開，就代表原本的 θ̂ 越不穩定。

## 重抽樣的是哪一份資料

上一篇特別提醒過：

- TPR 和 TNR 來自人工標註的 test set。
- `p_obs` 來自另一大批未標註的 trace。

Bootstrap 要重抽樣的，是前者。

理由很直接：θ̂ 的變異，主要來自 TPR 和 TNR 是從有限樣本中「量」出來的。至於未標註的 trace 算出來的 `p_obs`，它是已經觀察到的固定結果，每一輪都不重新計算它。

每一輪只做三件事：

1. 重抽 test set。
2. 重新計算 TPR 和 TNR。
3. 把新的 TPR、TNR 代回同一條 Rogan–Gladen 公式。

如此一來，每一輪都會得到一個新的 θ̂*。跑完 B 輪後，就會有 B 個 θ̂*。

<!--image:1-->

## 「抽樣」的意思是放回去再抽

這裡的關鍵細節是 **with replacement，也就是放回抽樣**。

抽過的例子會放回去，所以下一次仍然可能抽到同一筆資料。一輪重抽樣裡，同一個例子可能出現好幾次，也可能完全沒有被抽到。

這件事一開始聽起來有點奇怪：怎麼會把同一筆資料算好幾次，卻漏掉另一筆？

但這正是 Bootstrap 想模擬的情況。你手上的 test set，只是所有可能 test set 的其中一份。透過放回抽樣，可以近似回答：

> 如果樣本組成稍微不同，我的估計值會變成什麼樣子？

因此，重抽樣產生的變異，就被拿來當成「換一份資料後，估計值可能怎麼變」的近似。

<!--image:2-->

不過，不是每一輪抽出的樣本都能使用。素材中的程式碼有兩個跳過條件：

- 如果重抽樣後完全沒有 Pass 或完全沒有 Fail，分母就無法計算，因此跳過這一輪。
- 如果 TPR* + TNR* − 1 小於 0.05，也就是前一節提到的分母接近零，同樣跳過。

所以，雖然原本設定執行 B 輪，最後實際留下的有效樣本可能少於 B。

## 從 B 個估計值取出區間

有了這一大批 θ̂* 後，先把它們排序，再取出：

- 第 2.5 百分位，作為下界 L。
- 第 97.5 百分位，作為上界 U。

這兩個數字組成 95% 信賴區間。

### 為什麼是這兩個百分位？

因為 2.5 和 97.5 百分位會框住中間 95% 的估計值，等於把兩端各 2.5% 的極端結果切掉。

所以你拿到的是一段範圍，不再只是單一個點估計：在這些重抽樣結果下，真實通過率大致落在這裡。

<!--image:3-->

素材中的 Python 實作如下，`B` 預設為 20,000 輪：

<!-- source: sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1594-L1624 -->

```python
    # Step 4: Bootstrap CI
    N = len(test_labels)
    idx = np.arange(N)
    samples = []
    for _ in range(B):
        boot_idx = np.random.choice(idx, size=N, replace=True)
        lbl_boot = test_labels[boot_idx]
        pred_boot = test_preds[boot_idx]
        P_boot = lbl_boot.sum()
        F_boot = N - P_boot
        if P_boot == 0 or F_boot == 0:
            continue
        TPR_star = (
            (lbl_boot == 1) & (pred_boot == 1)
        ).sum() / P_boot
        TNR_star = (
            (lbl_boot == 0) & (pred_boot == 0)
        ).sum() / F_boot
        denom_star = TPR_star + TNR_star - 1  # Rogan-Gladen denominator
        if denom_star < 0.05:
            continue  # denominator near zero makes the estimate unreliable
        theta_star = (p_obs + TNR_star - 1) / denom_star
        samples.append(np.clip(theta_star, 0, 1))

    if not samples:
        raise RuntimeError(
            "No valid bootstrap samples; check inputs"
        )

    L, U = np.percentile(samples, [2.5, 97.5])
    return theta_hat, L, U
```

這段程式有兩個地方值得特別注意。

第一，`p_obs` 在整個迴圈裡完全沒有改變。它是在迴圈外先算好的，每一輪都拿同一個 `p_obs`，搭配重新抽出的 TPR* 和 TNR*。

這正好對應前面的設計：變異來自 test set，而不是來自未標註的那批 trace。

第二，是 `if not samples` 這個檢查。

如果所有輪次都被跳過，`np.percentile` 會收到一個空陣列。這時算出的結果沒有意義，後面的決策也會建立在錯誤的數字上。

素材中的處理方式是直接拋出 `RuntimeError`，讓程式停止並提醒你檢查輸入資料。

## 小樣本會看到什麼

這門課使用的資料量不大，因此要先有心理準備：信賴區間可能不會太窄。

回想上一篇的思想實驗：人工標註集只有 50 筆成功、50 筆失敗。在這種規模下，即使重抽樣幾千次，TPR* 和 TNR* 仍會在每一輪之間明顯跳動，θ̂* 的分布也會跟著散開。

當 judge 漏掉很多真正的成功，也就是 TPR 偏低時，這種散開會更加明顯。原因是修正公式會把 `p_obs` 放大一個不小的倍數，原本不大的抽樣誤差，也可能一起被放大。

反過來說，區間寬度本身就是一個診斷訊號。

如果區間很寬，通常代表兩種可能：

- test set 太小。
- judge 的 TPR 或 TNR 還不夠好。

這兩種情況的解法不同，但都指向同一個結論：現在這個數字還不夠穩，不能直接拿來當成上線依據。

<!--image:4-->

## 現在你有三個數字了

到這裡，你手上已經有一套完整的輸出：

- 點估計：θ̂
- 下界：L
- 上界：U

以素材中的例子來說，可能是：

> θ̂ = 0.87，95% 信賴區間為 [0.81, 0.93]。

接下來才是真正困難的部分。

0.87 超過 0.85 的門檻，但區間下界 0.81 沒有超過。這樣到底算不算通過？又該不該上線？

這個判斷沒有一條公式可以直接代勞，還是要看你判斷錯誤的代價有多高。下一篇會把這個決策拆開來看。
