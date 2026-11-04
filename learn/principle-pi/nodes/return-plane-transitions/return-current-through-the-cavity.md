# 掉下來不是問題，落地才是問題

多層板上的高速訊號很難一輩子待在同一層。訊號從一層換到另一層時，訊號線要鑽一顆 via 穿過去。同一時間，return current 也得跟著換到另一片平面。

這一步就是全部麻煩的起點。訊號本身在 transmission line 上跑得好好的；問題發生在它「換層」的那一刻，return current 找不到原本那條舒服的路。

## 先把一個常見誤解釘死：平面上的 DC 電壓不影響 Z0

return plane 上的 DC 電壓，對 transmission line 的 characteristic impedance 沒有影響。對訊號在訊號線與 return path 之間傳播的品質，也沒有影響。

5 V、甚至 12 V 的電源平面，當 return path 跟 ground plane 一樣好用。這點反直覺：「ground 才乾淨」聽起來像常識。但 Z0 只由幾何與介質決定，跟那片銅被拉在某個直流電位上無關。DC 電位不會改變訊號看到的阻抗。

盯著疊構圖，看到某一段的 return plane 是 Vdd 而不是 Vss，先別急著判定它「阻抗有問題」。DC 電位這件事，跟雜訊無關。

<!--image:1-->

## 問題出在「換層」那一步

訊號線從多層板的一層換到另一層，而它的 return current 必須跟著換平面層時，return current 就必須在兩片平面之間流動。

麻煩就在這裡。

有人從樓上掉下來，掉下來的部分不是問題，落地才是問題。訊號在 transmission line 上傳播是「掉下來」；換層時 return current 硬要穿過兩片平面之間的那層介質，才是「落地」。

那層介質加上上下兩片銅，就是一個 cavity。return current 要從上面那片平面走到下面那片平面，沒有別的路，只能穿過這個 cavity 的阻抗。

<!--image:2-->

## 穿過阻抗，就會在兩片平面之間壓出電壓

return current 流過由兩片平面構成的 cavity 阻抗時，就等於在 cavity 上產生一個電壓——兩片平面之間的電壓。

這個電壓最初只出現在 signal via 穿過 cavity 的位置附近。它不會乖乖待在那裡：它會往 cavity 裡射出一道 propagating voltage wave。

於是任何其他穿過這個 cavity 的 via，都會撿到這個 transient voltage。對那些 via 上的訊號來說，這就是 cross talk。

<!--image:3-->

## 這就是高頻雜訊被注入 cavity 的主要機制

高頻雜訊被注入 cavity 最主要的方式，就是 return current 穿過相鄰兩片平面之間的阻抗、感應出 transient voltage。它造成兩個後果——cross talk，以及可能貢獻到 radiated emissions。

還有一個常被搞混的邊界要畫清楚：這兩個效應都涉及 power plane，但跟「把電源乾淨地送到 core rail」這件事無關。cavity 的雜訊幾乎不是 PI 問題；它是 SI 與 EMC 的問題。

同一組平面同時被電源與訊號借用。訊號借它當 return path 時產生的雜訊，帳要記在 SI 頭上，不是記在 PDN 的阻抗預算上。

<!--image:4-->

## 為什麼還是要弄懂它的 root cause

這條雜訊路徑用的就是電源分配用的那兩片平面，躲不掉。把 root cause 講清楚，才訂得出設計準則。

雜訊的大小不是憑空決定的，它是 return current 穿過 cavity 阻抗的結果。只要還有人換層，return current 就有機會在相鄰的兩片 return plane 之間驅動出雜訊電壓。這無法完全避免，只能靠設計去壓。

要怎麼壓——降低 cavity 阻抗、把阻抗峰推到訊號頻寬之外、用 via 把平面短路起來——屬於設計手段。這裡只要留下一個判斷：**訊號換層時，return current 走的那條路，是通過了什麼。**

## Checkpoint

拿到一顆換層的 signal via，你會先問哪三件事？

1. 它穿過的是哪兩片平面？這兩片平面之間是不是一個 cavity？
2. return current 從上面那片走到下面那片，路徑上是什麼阻抗？這條路徑在訊號頻寬內是電感、是電容、還是有共振峰？
3. 如果這條路徑很糟，受害的是誰——是 die 上的 core rail，還是 cavity 另一端那些無辜的 via？

如果第三題你答「core rail」，關鍵原則是：DC 電壓不影響 Z0；雜訊也不是從電源分配那條路進去的，而是從換層那一步進去的。
