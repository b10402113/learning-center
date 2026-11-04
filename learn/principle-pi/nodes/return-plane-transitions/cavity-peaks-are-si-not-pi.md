# 為什麼峰值阻抗值得在意

一條單端訊號帶著 300 mV 的擺幅、200 ps 的邊緣，穿過 power 與 ground 平面之間的 cavity。

訊號本身沒事。但在 cavity 另一端、根本沒接這條線的 victim via 上，卻量到約 5 mV 的雜訊——而那顆 via 的訊號擺幅也不過 300 mV。

這個雜訊不是沿著電源軌送過來的，也不是 PDN 供電不穩。它來自訊號自己換層時，return current 撞上 cavity 的峰值阻抗。

要算的是：200 ps 邊緣、6 mA 的 return current，會在 victim 上造成多少雜訊；以及為什麼這筆帳要記在 SI 上，而不是 PI。

## 雜訊的樣子：阻抗曲線上的峰，對上時域的振鈴

一個 6 吋見方、由 power 與 ground 平面組成、接上 VRM 的 cavity，它的阻抗曲線有兩類峰。

低頻的峰：VRM 的串聯電感把平面「短路」；這個電感與 cavity 電容形成並聯共振，在約 55 MHz 出現一個峰值阻抗。

再往上是 cavity 的模態共振，從大約 0.5 GHz 開始。

一個 200 ps 的 transient current 從 aggressor via 穿過 cavity 時，會帶起等量、反向的 return current 一起穿過 cavity；它走鄰近的 via，或走位移電流。

這個擾動的頻寬到 0.35 / 0.2 ns ≈ 1.7 GHz，會覆蓋並激發 55 MHz、0.5 GHz、1 GHz 這幾個峰。

Figure 7.1 的上半是 cavity 的阻抗曲線，下半是 cavity 對角兩顆 victim via 上量到的雜訊。

兩顆 via 位在相反角落，看到的雜訊大小卻差不多，頻率成分落在 55 MHz 與約 0.5 GHz。

這是「長距離」的證據：雜訊不是只有隔壁 via 才有，整個 cavity 一起被抬起來。

<!--image:1-->

## 6 mA 是怎麼來的

訊號擺幅 300 mV、走在 50 Ω 環境，訊號電流是 300 mV / 50 Ω = 6 mA。

單端訊號的 return current 與訊號電流等量、反向，所以穿過 cavity 的 return current 就是 6 mA。

邊緣 200 ps 決定這個擾動的頻譜能延伸到多高：BW ≈ 0.35 / RT = 0.35 / 0.2 ns ≈ 1.7 GHz。

凡是落在 1.7 GHz 以下的 cavity 峰，都躲不掉這條邊緣。

6 mA 本身不大，但它帶著一路延伸到 1.7 GHz 的頻譜。

這段頻譜上只要有某個高阻抗的峰，那個峰就會把 6 mA 乘成不小的電壓。雜訊電壓就是阻抗與 return current 的乘積。

<!--image:2-->

## 5 mV 有多大：1.5%，十倍就是 15%

每顆 victim via 上的雜訊峰值約 5 mV。對 300 mV 的訊號擺幅來說，這是 1.5%。

這 5 mV 不是哪條「壞線」上才有。任何一條剛好穿過同一個 cavity 的 via 都會撿到；它只因為穿過 cavity 就中了。

如果同時有 10 條訊號一起換層，victim 上就約有 15% 的訊號擺幅變成雜訊。

因為是長距離耦合，這 10 條 aggressor 可以散落在 6 吋見方 cavity 的任何角落，不需要擠在一起。

它難查的原因：找不到「那一條」干擾源，干擾可以來自整個 cavity 的任意位置。

時域上可以看到兩個明顯的頻率成分：低頻週期約 20 ns（約 50 MHz），高頻約 0.5 GHz——正好對上阻抗曲線的前兩個峰。

<!--image:3-->

## 為什麼是 SI 的問題，而不是 PI 的問題

問題出在 power 與 ground 這對平面上，直覺會想把它記到 PI 帳上。但把訊號路徑拆開看，受影響的是訊號，不是供電。

- **誰被傷到**：cavity 雜訊是靠「其他訊號 via」當成 cross talk 撿走的，也可能輻射出去（EMC）。被傷到的是訊號與電磁相容，不是核心電路的供電品質。
- **為什麼 PI 看不到**：晶片上的 rail 是隔著 package lead inductance 往 cavity 看的。這個電感會把高頻的 cavity 模態峰值阻抗遮掉，所以晶片端在供電上根本看不到這些高頻峰值阻抗。cavity 的峰值阻抗對「把乾淨電壓送到核心邏輯」幾乎不重要。
- **誰在注入**：把雜訊打進 cavity 的是訊號的 return current——訊號換層時被迫穿過 cavity 的那一股，不是 PDN 的供電電流。

cavity 共振先是 SI 問題，有時會再變成 EMC 問題，很少是 PI 問題。

峰值阻抗在 PI 上幾乎不重要，在 SI 與 EMC 上卻非常重要。

它用到了同一對 plane，但和「把電送到核心 rail」是兩回事。

<!--image:4-->

## 那要怎麼辦：只能動阻抗

雜訊電壓 = 阻抗 × 電流。電流是訊號的 return current，不可避免；只要訊號換層，它就一定穿過 cavity。能動的只剩阻抗。

方向有兩條：

- **把峰壓低**：把 cavity 的峰值阻抗工程到夠低，讓切換電流乘上去也生不出大電壓。
- **把峰推高**：把峰值阻抗推到訊號頻寬之外（超過 1.7 GHz 那條線），讓 transient 根本打不到它。

兩條路都得靠「調整 cavity 的特性」來做：薄介質、shorting via、以及同電壓 return plane。

## 給自己的 checkpoint

- 一條 300 mV、200 ps 的單端訊號換層，return current 有多大？（300 mV / 50 Ω = 6 mA）
- 它會激發到多高頻率以下的 cavity 峰？（BW ≈ 0.35 / 0.2 ns ≈ 1.7 GHz）
- 一顆 victim via 約撿到多少？10 條 aggressor 一起換層呢？（約 5 mV / 1.5%；約 15%）
- 這件事該記在 SI 還是 PI 帳上，為什麼？（SI；晶片 rail 隔著 package lead inductance 看不到高頻 cavity 峰，被傷的是 cross talk 與 EMC）
