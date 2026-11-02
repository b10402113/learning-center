---
subject: principle-pi
status: draft
path: book-order
created: 2026-10-31
---

# ROADMAP — principle-pi

## Goal

拿到一片高速數位板或一個 package，能自己走完一次 PDN 決策：從 transient current 定出 target impedance、在 Z(f) 圖上指出每個 peak 是誰造成的、決定 MLCC／bulk／OPD 的數量，再用 PRC 算表與時間域模擬驗證，並知道自己結論的失效邊界。

## Learning path

**Book-order（照書走）**：直接依原書十章順序推進。Tier 1 建立 PDN 與阻抗的語言，並用一章確認「量到的數字可不可信」；Tier 2–4 依序拆開電感、電容、平面／cavity 三種被動結構；Tier 5 處理換層時的 cavity noise；Tier 6 把元素組成 ecology；Tier 7 換到時間域；Tier 8 用 PRC 算表收尾。

這條路徑最佳化「與原書對照」：每個 node 對應書中一段連續章節，可以一手拿書、一手看課程，不需要先接受一套重新編排的架構。代價是概念隨章節自然出現，後面的 node 才補齊術語；好處是任何一段都能獨立回去查書。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 語言與量測（Ch1–Ch3）

1. **[電源傳輸網路的工程設計](nodes/engineering-the-pdn.md)**
   - Goal: 用 die 的 switching current 打在 PDN 阻抗上解釋 rail noise，說出 5% budget 與 target impedance 的來源。

2. **[頻域中的阻抗](nodes/impedance-in-the-frequency-domain.md)**
   - Goal: 把 PDN 看成 Z(f)，用 1 A 交流電流源模擬阻抗，並分清理想元件與真實元件。

3. **[Series／parallel RLC 與晶片／板子兩個視角](nodes/series-parallel-rlc-and-two-views.md)**
   - Goal: 對任何阻抗峰說出 fres、Z0、q，並解釋同一結構為何從 die 看是峰、從 board 看是谷。

4. **[量測低阻抗與 fixture artifact](nodes/measuring-low-impedance.md)**
   - Goal: 用 V/I、反射係數與 two-port S21 量低阻抗，並從曲線辨認 fixture 造成的假 R／假 L。

### Tier 2 — 電感（Ch4）

5. **[電感是什麼：磁場、能量與 loop／partial 電感](nodes/what-is-inductance.md)**
   - Goal: 用 L = ψ/I 與 U = ½LI² 說明電感只由幾何決定，並把它拆成內外電感與 partial self／mutual。

6. **[估算 loop inductance：從圓導線到經驗法則](nodes/estimating-loop-inductance.md)**
   - Goal: 用圓迴路、寬導體、均勻傳輸線與 25 nH/inch 經驗法則估出板級 loop L，並從 S-parameter 萃取。

### Tier 3 — 電容（Ch5）

7. **[真實電容的 series RLC 與 parallel resonance](nodes/real-capacitor-and-parallel-resonance.md)**
   - Goal: 用 series RLC 描述 mounted MLCC，算出 PRF 與 peak impedance，並用值域重疊把峰壓低。

8. **[ESR、mounting inductance 與 vendor 模型](nodes/esr-mounting-and-vendor-models.md)**
   - Goal: 從 spec 估 ESR、拆解 via 與 trace 的 mounting L，並判斷 vendor S-parameter 模型可不可信。

### Tier 4 — 平面與 cavity（Ch6）

9. **[平面的關鍵角色：parallel-plate C 與 spreading inductance](nodes/planes-as-cavities.md)**
   - Goal: 算出 cavity 的低頻電容、sheet inductance 與兩點間的 spreading L，說明厚度為何是第一階變數。

10. **[電容與 cavity 的互動，及 cavity modal resonance](nodes/cavity-resonance-and-capacitor-interaction.md)**
    - Goal: 算出 cavity 自共振與電容–cavity 平行峰，並說明 modal resonance 何時與 die 電源無關。

### Tier 5 — 換層與 cavity noise（Ch7）

11. **[訊號換 return plane 時，如何馴服 SI 問題](nodes/return-plane-transitions.md)**
    - Goal: 解釋 via 換層如何激發 cavity wave，並用 via 數與間距滿足 plane-bounce 判準。

12. **[Return plane 的阻尼與設計原則](nodes/return-plane-damping-rules.md)**
    - Goal: 用 shorting via、DC blocking 電容、cavity loss 與 controlled ESR 把 cavity 峰壓到目標以下。

### Tier 6 — PDN ecology（Ch8）

13. **[PDN ecology 與 Bandini Mountain](nodes/pdn-ecology-and-bandini-mountain.md)**
    - Goal: 說出六個元素各管哪個頻段，並用 f0、Z0、q、Zpeak 描述 ODC–package L 形成的峰。

14. **[Bandini 的阻尼、cavity 的角色與 VRM／bulk](nodes/bandini-damping-cavity-and-vrm-bulk.md)**
    - Goal: 找出 Bandini 的主要阻尼來源，說出 cavity 的真實角色，並算出 VRM–bulk 的低頻平行峰。

15. **[Board MLCC 策略：FDTIM、CES 與 OPD](nodes/board-mlcc-strategy.md)**
    - Goal: 用 FDTIM 或 controlled-ESR 排出 flat board profile，並判斷 OPD 與多晶片同軌的利弊。

### Tier 7 — 暫態電流與電壓雜訊（Ch9）

16. **[Transient current 與阻抗峰方程式](nodes/transient-current-and-impedance-peaks.md)**
    - Goal: 從 CMOS clock edge 推出電流波形，並用 impulse／step／resonance 把 f、Z0、q 換成 droop。

17. **[Q 值、rogue wave 與 switched-capacitor load](nodes/q-rogue-waves-and-scl.md)**
    - Goal: 用 q 解釋 ringing、1.6× 裕度與 rogue wave，並用 SCL 與 gating 判斷真實晶片的電流。

### Tier 8 — 設計流程（Ch10）

18. **[設計流程與 PRC 算表](nodes/design-flow-and-prc.md)**
    - Goal: 走完 rules → spreadsheet → simulation 三段流程，並把案例參數填進 PRC 的前 24 行。

19. **[PRC 的三個 loop、figure of merit 與阻尼](nodes/prc-loops-and-damping.md)**
    - Goal: 把 PDN 拆成三個峰，各自算出 q 與阻尼來源，並用 frequency／time domain 互相驗證。

20. **[案例優化、從量測反推與模擬對量測](nodes/case-study-and-correlation.md)**
    - Goal: 用 91 → 51 mΩ 的案例示範取捨，並從 impulse／step／resonance 量測反推 PDN。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
