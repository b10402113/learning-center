---
source: sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.11.part.txt
source_type: text
source_lines: 1646
part: 11
status: absorbed
absorbed_at: 2026-11-11
created: 2026-11-11
updated: 2026-11-11
---

# L1 overview

- 8.1 把 PDN 從 VRM 到 die pad 的所有互連視為一個生態系：頻域上六個元素（ODC、package PDN/OPD、board planes、MLCC、bulk 電容、VRM）各主宰一段頻段，但真正決定效能的是元素交界處的並聯共振峰值。單獨優化任一元素（尤其只看 MLCC 選值）會誤導設計，必須整體優化。
- 8.2 on-die decoupling capacitance（ODC）是 GHz 頻段唯一能壓低晶片上電源阻抗的結構，來源有五個。以 q=CV 與 10% droop 的時域模型可反推最小電容（1 W／1 V／1 GHz 約 10 nF），並用 ESR·C ≈ 250 ps 估 ESR；VNA 的 S21→Z21 可量測，偏壓會讓電容由約 100 nF 升到約 450 nF。
- 8.3 package PDN 從 die pad 到 board via，無 OPD 時阻抗呈電感到極高頻，上限由 cavity modal resonance 或路徑長度超過 1/10 波長決定（1 吋 BGA 約 600 MHz 以下可視為集總電感）。等效迴路電感可用每單位長度 20 pH/mil、並聯對數與電流容量反推，範圍從幾 pH 到 10 nH。
- 8.4 Bandini Mountain 是 ODC 與 package loop inductance 的並聯共振，通常是整個 PDN 最高的峰值阻抗；50 nF 加 250 pH 約 45 MHz，實測可造成 600 mVpp 的晶片電壓雜訊。它同時形成濾波器，把 board cavity 的 modal resonance 擋在 die 之外，也成為 SI 與 PI 問題的分界。
- 8.5 固有 Bandini 頻率為 1/(2π√(LC))；把 ODC 與 package L 的反推公式相乘後平均功率會抵消，典型值落在 10–100 MHz，高階元件可達 200 MHz。OPD 能壓低但無法消除峰值，原則是迴路電感最小、電容至少 5 倍 ODC、ESR 接近目標阻抗。
- 8.6 並聯共振可用共振頻率、特性阻抗 Z_char=√(L/C)、峰值阻抗與 Q 四個指標描述。若只有 die 內 ESR 阻尼，峰值阻抗等於 Q·Z_char，與 ODC 無關而只取決於 package L 與 250 ps；因此要壓到 10 mΩ 以下約需 2.5 pH 的封裝電感。
- 8.7 board cavity 需用 3D full-wave 求 S-parameter，再以 Z11=(1+S11)/(1−S11)·Z0 轉成阻抗；阻抗曲線比 S-parameter 好判讀。多個 via pair 並聯不改變 modal 頻率，但會降低 via 與 spreading inductance，並把 self-resonance 往高頻推。
- 8.8 把 die、package、cavity、VRM 接起來看：package L 與 ODC 形成的濾波器讓 die 看不到 1 GHz 以上的 cavity modal resonance；VRM 的 10 nH 會把 Bandini 峰值由 45 MHz 拉到 7 MHz，180 MHz 的小擾動則來自 cavity 電容與 spreading inductance。cavity 用單一集總電容近似即可。
- 8.9 同一組 9 顆電容放在 1 吋與 10 吋 cavity 上，從 die pad 看幾乎完全相同，證明 cavity 的電容與尺寸不重要，唯一重要的是電容到 package 的 spreading inductance（約 1 square）。因此可以用只覆蓋電容與 package 區域的 power puddle，讓多條電源軌共用同一層。
- 8.10 VRM 可用串聯 RL 近似，其 L 是回授迴路時間常數而非實體電感（範圍 1–1000 nH），並可由響應時間與 V=L·di/dt 估算。單靠 VRM 的阻抗在任何頻率都超過合理目標，必須加 bulk 電容；回授越快 L 越低、並聯共振頻率越高。

# L2 detail

- `#L1-L22` — 章導言：PDN 最重要的性質是元件間的交互作用，電容與電感並聯會產生共振峰值；業界只看加電容能壓多低，但真正肇禍的是峰值，因此必須把整個 PDN 當成生態系分析。
- `#L23-L40` — 8.1 開場：PDN 是 VRM 到 die 電源軌之間所有互連的集合；頻域觀點便於分析，因為特定元素主宰特定頻段；圖 8.1 給出從 die pad 看出的典型阻抗曲線與各頻段的對應實體元素。
- `#L41-L66` — 六個關鍵元素清單（ODC、含 OPD 的 package PDN、board 電源／地平面、MLCC、VRM 的 bulk 電容、VRM 本體）與其危險：分區優化會在交界處留下未被處理的峰值；Tip 明言最沒有效率的做法就是逐一優化。
- `#L67-L96` — 生態系定義：ODC 與 package PDN 的交互作用產生最大峰值，VRM 與 bulk 電容的交互作用影響供電穩定性；VRM 拆成調節模組與 bulk 電容兩部分；plane 與 MLCC 和 package、ODC 的交互作用可成就或摧毀一個 PDN。
- `#L97-L127` — 8.2：ODC 是唯一影響最高頻段晶片電源軌阻抗的結構，由五個來源組成（電源／地金屬網格、CMOS 閘極電容、訊號負載電容、擴散接面、刻意加入的電容）；圖 8.2 標示五源；ODC 不足時系統其餘部分無法補救。
- `#L128-L159` — 板級手段無法補償 ODC 不足；供應商常不給此參數，只能假設對方已做最低限度設計；以圖 8.3 的充放電迴路建立時域模型，要求在每個 clock edge 的 Vdd droop 小於 10%，即 clock edge noise。
- `#L160-L204` — 由電荷守恆與 q=CV 推導：維持 90% 電壓比所需的 C_ODC；switching factor 的定義；負載能量 ½CV²、每週期充放電兩次使平均功率 P=CV²F；反推 C_load 與 C_ODC，並以 1 W／1 V／1 GHz 得約 10 nF，外推 10 W 約 100 nF、高功率可達 1000 nF。
- `#L205-L231` — die 設計成熟後可用寄生萃取估固有 ODC；不足時以 MOS 或 MIM 結構補足，90 nm CMOS 電容密度約 1 nF/mm²；量測以 VNA 探測 package ball、由 S21 轉 Z21 再以 Z=1/jωC 換算，圖 8.4 顯示電容隨偏壓變化。
- `#L232-L262` — 實測：無偏壓時約 100 nF（金屬網格與擴散電容），上電後閘極與互連電容加入使總量約 450 nF；switching factor 上限約 15%；每個製程節點 ODC 密度先以 1.2 倍、後以 1.7 倍成長，10 nm FinFET 仍在趨勢線上，多數電容來自 wiring channel（圖 8.5）。
- `#L263-L296` — ESR 與電容成反比（並聯效應）；數個節點間 R·C 乘積約 250 ps，因設計者不斷把金屬資源撥給電源路徑以壓低 IR drop；此時間常數隨節點下降；IO 電路不一定遵循；此關係是估算阻尼與 Q 的關鍵。
- `#L297-L334` — 由 ESR ≈ 250 ps／C 得 50 nF→5 mΩ、200 nF→1.2 mΩ 的算例；ESR 量測受探針位置與面積影響，小面積量測再以 RC 常數放大；bump 正下方的垂直 ESR 屬於共振電流路徑，大 die 的有效 ODC 半徑則受水平電源匯流排電阻限制。
- `#L335-L356` — 水平與垂直 RC 常數不同：小 die（數 mm²、方形）relaxation time 為數百 ps，大而狹長的 die 可超過 1 ns；只有 3D 模型能處理分散式效應；當 relaxation time 遠小於 clock 週期時，單一 C、R、L 的集總模型仍高度準確。
- `#L357-L391` — 晶片設計者常因怕 DC IR drop 而拒絕刻意加 ESR，但低功耗電路其實能從中受益，高功耗電路則靠 load damping；ODC 的 ESL 僅約 0.1 pH，串聯阻抗 R+jωL 中電阻在數十 GHz 前都更重要；圖 8.6 為 5 W、1 GHz、50 nF、5 mΩ、0.1 pH 的範例，ESR 在 400 MHz 後顯現、ESL 要到 10 GHz 以上。
- `#L392-L421` — 8.3 package PDN 的範圍：die 到基板的 wire bond／solder ball、die pad 到內部平面、OPD、封裝到板的球或腳、板子 top pad 進入 cavity 的 via；封裝決定 via 位置、板 stackup 決定 via 長度；圖 8.7 對比 leaded 與多層 BGA；無 OPD 時阻抗為電感，直到 modal resonance 或 1/10 波長。
- `#L422-L459` — 方形 cavity 第一模態公式與 Dk≈4 的變數；以 1 吋 BGA 說明；另一條件是總互連長度超過 1/10 波長；低於約 600 MHz 可把單一路徑視為集總電感；等效並聯電感因封裝與板結構差異極大而難以一般化，因此必須向供應商索取封裝模型。
- `#L460-L512` — 等效電感範圍可從數 pH（數百對球的多層封裝）到 10 nH（0.5 吋腳、僅兩對電源地的 QFP），相差一萬倍；以 Lloop=L_per-len·Len/n_pairs、20 pH/mil 估算；BGA 50 mil／100 對得約 10 pH，1 mil 平面 sheet inductance 32 pH、spreading 約 1 square 32 pH，CSP 250 mil／20 對得約 250 pH；精確值需量測或 3D 模擬 S-parameter。
- `#L513-L549` — 由 S11 反推 Lloop 的式子（S 與 Z 均為複數）；另一條路是從電流容量反推：10 mil via 約 2 A、1 mil 金線約 1 A（保守 0.25 A），n_pairs 由最大電流與平均功率決定；10 W、1 V、0.25 A 的算例得約 40 對。
- `#L550-L613` — 合併後的 Lloop 公式與變數；scaling 邏輯（電流容量越大對數越少、L 越大；功率越大對數越多、L 越小）；QFP 範例（250 mil、20 pH/mil、5 W）與 BGA 範例（100 mil、25 W）得到典型值；單對路徑 ESR 約 40 mΩ（via／ball 10 mΩ、½ oz 銅 1 mΩ/square），20 對並聯後約 2 mΩ，遠小於 50 nF ODC 的 5 mΩ；圖 8.8 為 board 端短路時從 chip attach 側看入的阻抗。
- `#L614-L647` — 8.4：board 端短路（最佳情況）時，die pad 看到 ODC 與 package lead inductance 並聯，形成最重要的並聯共振；圖 8.9 以 50 nF、5 mΩ、250 pH 模擬，峰值在約 45 MHz；這是所有元件共有的最大峰值，暫態電流若含該頻成分即肇禍。
- `#L648-L701` — 並聯共振是 PDN 生態系「湧現行為」的第一例；Steve Weir 將其命名為 Bandini Mountain，典故是 1984 洛杉磯奧運時 Bandini 肥料公司堆起的 100 呎肥料山與其失敗廣告，之後該詞被用來指任何巨大的堆肥。
- `#L702-L731` — 峰值高度主要取決於 LC 共振的 Q 與兩元件的 ESR，封裝腳與 ODC 的 ESR 常讓 Q 很高、峰值接近 1 Ω；並聯共振頻率公式與 50 nF／250 pH 得 45 MHz 的計算；OPD 可降低迴路電感並提供阻尼，但峰值仍存在；圖 8.10 是 BGA 測試晶片實測的 33 MHz Bandini Mountain。
- `#L732-L763` — 峰值頻率難以估算，因為 ODC 與封裝電感都隨晶片與封裝而異且供應商不願公布；可寫 microcode 快速翻轉大量閘極、把功率調變在 Bandini 頻率上，形成「power virus」；圖 8.11 顯示 33 MHz 暫態電流造成 600 mVpp 的 die 電壓雜訊，遠超任何合理預算。
- `#L764-L800` — 兩個主導參數（ODC、package L）都掌握在供應商手中；增加 ODC 或降低封裝電感都能顯著壓低峰值，圖 8.12 比較四種組合（ESR 隨 ODC 反比縮放）；Bandini 峰值與第 6、7 章直接探測平面得到的 cavity 峰值無關；在 Bandini 頻率以上由 ODC 主宰，且 package L 與 ODC 會濾掉板級 cavity 共振，這是 SI 與 PI 問題分道之處。
- `#L801-L840` — 8.5：向供應商索取 ODC 與封裝電感（有時需 NDA）；board 端短路時固有 Bandini 頻率公式，50 nF／0.25 nH 得約 45 MHz；在沒有可靠輸入時，把 C_ODC 與 Lloop 的反推式（含功率、Vdd、Fclock、I_max_pair、20 nH/inch、Len）合併使用。
- `#L841-L898` — 合併式中平均功率會抵消：功率越高 ODC 越大，但所需並聯腳數也越多使 L 越低，乘積不變；QFP（250 MHz、0.5 吋腳）與高效能封裝（50 mil、3 GHz）兩個極端例給出約 10–100 MHz 的界線，高階通訊／記憶體可達 200 MHz；OPD 設計哲學：ODC 到 OPD 的迴路電感最小、OPD 電容至少 5 倍 ODC、ESR 接近目標阻抗，可大幅降低但不會消除峰值。
- `#L899-L928` — 為何供應商幾乎不給 Bandini 參數：PI 工程師知道解法就是加 ODC 或降封裝電感，兩者都極昂貴；若客戶拿到參數並與目標阻抗比較，勢必要求修正，而修到符合目標的產品價格會高到無人購買，因此這個「臭味」問題才得到這個名字。
- `#L929-L962` — 8.6：並聯電路四個指標為共振頻率、特性阻抗、共振峰值阻抗與 Q；特性阻抗只由 L、C 決定，是感抗與容抗交會處的阻抗；類比傳輸線特性阻抗但基本定義不同；以 0.25 nH 與 50 nF 計算得約 71 mΩ。
- `#L963-L1016` — 特性阻抗代表最佳情況下可達的最低 PDN 阻抗，也決定步階電流的暫態壓降（第 9 章）；共振頻率公式；Q 取決於 ODC 的 ESR 與板級損耗，當板級損耗遠小於 die 內電阻時由 die 內 ESR 主宰；由 250 ps 規則得 5 mΩ，Q≈14；Q 與 Bandini 頻率成反比（Q≈1/(2πf·RC)），45 MHz 得 Q≈14，200 MHz 時 Q≈3，因此高頻 Bandini 反而較好、封裝電感越低越好。
- `#L1017-L1064` — 峰值阻抗 = Q·Z_char；當只有 die 內 ESR 阻尼時，峰值與 ODC 無關，只取決於封裝電感與 250 ps，這解釋圖 8.12 中同 ESL 的兩條曲線峰值相同；ESL 0.025 nH 對應 0.1 Ω，要低於 10 mΩ 需約 2.5 pH；這些是 board 無損的worst case；三個設計旋鈕：降封裝電感、增 ODC、增迴路或 ODC 的 ESR。
- `#L1065-L1112` — 8.7：cavity 從 via pair 看入的阻抗只能用 3D full-wave 求解，輸出為 S-parameter（端點即觀察點）；以 5 吋見方、10 mil 厚 FR4 為例，中心探測會看到 self-resonance 凹陷與 modal 峰值；由 Z11=(1+S11)/(1−S11)·Z0 轉阻抗，因相位資訊難以目視，習慣看阻抗曲線（圖 8.13）。
- `#L1113-L1165` — 多 via 接觸時 S-parameter 有多埠，可把埠並聯取出等效阻抗；低頻時不論 1 或 10 埠都看到相同 cavity 電容；進入電感主導區後，接觸方式影響 spreading inductance；單一 via pair 的電感顯著，多對並聯後 via 電感被稀釋、只剩 cavity 電感，self-resonance 往高頻移；modal 頻率由半波長決定，不受 via 影響（圖 8.14 四埠並聯例）。
- `#L1166-L1193` — 把 VRM 以串聯 R=1 mΩ、L=10 nH 接到 cavity 並在四點探測，圖 8.15 比較有無 VRM 的阻抗；模擬參數為 5×5 吋、10 mil、Dk=4.3；多點接觸的主要效果是降低 spreading 與 BGA via 電感，讓 cavity 行為更接近純電容。
- `#L1194-L1234` — 8.8：加入封裝與 die 後，cavity 在 1 GHz 以上的 modal resonance 雖有高峰，對 SI／EMI 重要，卻不被 die pad 看見；封裝電感隨頻率上升、ODC 在 Bandini 頻率後阻抗上升，兩者形成濾波；定義三個比較案例（僅 ODC+封裝、僅 cavity+VRM、完整鏈路），圖 8.16 為結果。
- `#L1235-L1281` — 案例 1：board 端短路，45 MHz 為封裝電感與 ODC 的並聯共振；案例 2：VRM 電感與 cavity 電容造成約 30 MHz 峰值、約 200 MHz 的 cavity 串聯 LC 凹陷，1 GHz 以上可見 modal 共振；案例 3：cavity 與 10 nH VRM 使 Bandini 峰值降到 7 MHz；180 MHz 的小峰與凹陷來自封裝電感與 cavity spreading inductance 對 cavity 電容的並聯。
- `#L1282-L1334` — cavity 最簡模型是理想電容，接上 VRM 後等效為 VRM 的 R、L 與 cavity C 並聯；圖 8.17 顯示此集總模型與 3D 結果在 100 MHz 內吻合，之後才出現 spreading inductance 效應；圖 8.18 比較 cavity 內與 die pad 所見；7.2 nF cavity 與 0.25 nH 封裝電感造成 180 MHz 擾動，對 VRM 電感不敏感、對 cavity 電容敏感；cavity 對 die 幾乎透明，建模只需加一顆等效電容，modal 共振對 PI 不重要。
- `#L1335-L1395` — 8.9：從 die pad 看，cavity 共振毫無角色、cavity 就像集總電容，唯一重要的是 MLCC 到 BGA pad 的 spreading inductance（封裝平面同理）；例：9 顆 100 µF、1 nH、25 mΩ 電容分別放在 1 吋與 10 吋（電容差 100 倍）cavity；圖 8.19 依比例畫出；四個阻抗特徵為電容低頻阻抗、電容 SRF、電容 mounting L 與 cavity C 的並聯共振、以及 n=2 的第一模態。
- `#L1396-L1442` — 3D 模擬與估算比較：並聯共振實測 105 MHz 與 1300 MHz（估算 150／1500 MHz，因未含 spreading inductance 而偏高），第一模態 6 GHz 與 0.6 GHz（估算 5.7／0.57 GHz），證明簡單近似有效；再把這兩個 cavity 的行為模型接到 ODC 50 nF 與封裝 250 pH 的鏈路上，電容參數為 100 nF、1 nH、25 mΩ。
- `#L1443-L1473` — 圖 8.21 對比 behavioral S-parameter 模型與「集總電容＋九顆電容並聯」模型；圖 8.22 顯示 1 吋與 10 吋 cavity 從 die pad 看的曲線完全重合；集總模型已很接近，若再加上約 1 square 的 spreading inductance（圖 8.23），兩者幾乎完全吻合，這也是實務上可用的估算值。
- `#L1474-L1535` — 三個設計結論之前兩個：cavity 對 die pad 阻抗的唯一重要作用是提供電容到封裝的低 spreading inductance，cavity 電容與尺寸無關，因此「越薄越好」，這與常見「cavity 提供高頻低阻抗」的說法相反；其次，Bandini 頻率以上的 cavity 峰值（modal 或與其他元件互動）不會被 die 看見，抑制平面共振是為了 SI／EMI，與 PDN 選電容是兩個獨立需求，實務上先選 PDN 電容、再以小體積大容值加裝抑制共振的電容。
- `#L1536-L1559` — 第三個結論：cavity 尺寸不影響 die 端 PDN，因此只需把「電容到被封裝」這段 cavity 設計好；VRM 到電容群的路徑電感可以較高；這導出 power puddle（只在封裝附近鋪設、不外擴的電源／地平面島）與平面分段，讓多條電源軌共用同一層，前提是平面不被當作訊號回流路徑。
- `#L1560-L1606` — 8.10：VRM 以感測線回授與電壓參考比較來控制輸出，切換式靠 dI/dt 打進電感、線性式靠串聯 FET；實務上整個回授電路可用串聯 RL 近似，另加 bulk 電容；實測 DC-DC 範例為 R=4 mΩ、L=500 nH、電容 740 µF／4 mΩ／5.7 nH，與模擬吻合（圖 8.24）；500 nH 是回授迴路時間常數而非實體電感，依調節器類型可從 1 nH 到 1000 nH。
- `#L1607-L1646` — 由響應時間估算等效電感：以 V=L·di/dt、V 取 Vdd 的 5% 容差，1 V／0.5 A／1 µs 得約 100 nH；VRM 自身阻抗在任何頻率都超過合理目標，必須靠 bulk 電容壓低低頻阻抗；回授越快 L 越低、並聯共振頻率越高；在 VRM 與 cavity 電容的並聯共振以上，cavity 阻抗與 VRM 無關；低於 cavity 串聯 LC 共振時阻抗與量測位置無關，之上則取決於到觀察點的 spreading inductance。
