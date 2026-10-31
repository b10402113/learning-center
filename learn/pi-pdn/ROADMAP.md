---
subject: pi-pdn
status: draft
path: concept-first
created: 2026-10-30
---

# ROADMAP — pi-pdn

## Goal

拿到一片高速數位板的電源架構，能自己做出一組說得出理由的 PDN 決策：從 transient current 定出 target impedance、在阻抗曲線圖上指出每一個 peak 是誰造成的、決定要幾顆 MLCC／多少 bulk／要不要 on-package decoupling，並用 VNA 或 two-port 量測資料驗證自己的判斷。判準是看到一條 Z(f) 曲線或一張 droop 波形，能說出「這個 peak 的 fres、Z0、q 是多少，哪個元素在主導，拿掉它會怎樣」。

## Learning path

**Concept-first（概念優先）**：先把 impedance 與 RLC 的語言建立起來，再逐一拆開三個被動元素（電感、電容、平面／cavity），接著把它們組成 PDN ecology 與暫態響應，最後才用量測與設計流程收尾。

這條路徑最佳化「心智模型的完整度」：每個新元件都掛回 Tier 1 的 Z(f) 曲線與 fres／Z0／q 三個數字，所以看到任何 peak 都能立刻定位。它適合想把「為什麼」先補齊、之後再進入算表與量測的人；代價是前三分之一的抽象期比較長，實作數字要等到 Tier 5 之後才密集出現。

Tier 1 建立 Z(f) 與共振的語言；Tier 2–3 是兩個被動元件的物理；Tier 4 處理平面與 cavity，並接上 return path 的實際失效；Tier 5 把元件組成 ecology 與三個峰；Tier 6 換到時間域；Tier 7 用量測與 PRC 算表把整套判斷收斂成可執行的流程。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 心智模型：PDN 與阻抗語言

1. **[電源傳輸網路（PDN）是什麼，為什麼要在乎](nodes/pdn-what-and-why.md)**
   - Goal: 用 die 自己的 switching current 打在 PDN 阻抗上解釋 rail noise，並說出 PDN 的三個用途與 1 ps/mV 的 eye 代價。

2. **[PDN 設計的阻抗基本原理](nodes/impedance-fundamentals.md)**
   - Goal: 能把 PDN 看成 Z(f)、用 1 A 電流源模擬阻抗，並分出演算 series RLC 的谷與 parallel RLC 的峰。

3. **[串並聯 RLC 的共振特性，與晶片／板子兩個視角](nodes/rlc-resonance-and-two-views.md)**
   - Goal: 對任何阻抗峰說出 fres、Z0、q、Zmax，並解釋同一結構為何從 die 看是峰、從 board 看是谷。

### Tier 2 — 被動元件 I：電感

4. **[PDN 設計為什麼要在乎電感](nodes/why-inductance-matters.md)**
   - Goal: 用「每安培圈出多少磁力線」說明電感是幾何量，並解釋它為何主導高頻阻抗、是最便宜的降 peak 槓桿。

5. **[迴路電感與部分電感、自感與互感](nodes/loop-and-partial-inductance.md)**
   - Goal: 把 loop L 拆成 partial self/mutual 逐段設計，並說明 skin depth 為何讓內電感消失。

6. **[從幾何估算迴路電感：圓迴路、sheet inductance 與經驗法則](nodes/inductance-from-geometry.md)**
   - Goal: 用 25 nH/inch、8.3 nH/inch、32 pH/mil×h 估出板子與封裝的迴路電感。

### Tier 3 — 被動元件 II：電容

7. **[實用 MLCC：series RLC、並聯與兩顆電容之間的 PRF](nodes/mlcc-series-rlc-and-parallel-resonance.md)**
   - Goal: 用三元件 RLC 解釋 MLCC 的谷與峰，並說明兩顆不同容值為何在中間生出一個 parallel peak。

8. **[多少電容才夠，ESR 從哪裡來](nodes/capacitance-and-esr.md)**
   - Goal: 從 Ztarget 與 VRM 頻率反推容值，並用 ESR 估計式與 controlled-ESR 的 q 值選零件。

9. **[電容的 mounting inductance 與原廠 S-parameter 模型](nodes/mounting-inductance-and-vendor-models.md)**
   - Goal: 把 2 nH 的 mounted L 拆成 trace/body/via/spreading，用五個槓桿壓到 sub-0.5 nH，並避開 vendor 檔案的陷阱。

### Tier 4 — 平面、cavity 與 return path

10. **[平面就是 cavity：低頻電容、迴路電感與 spreading inductance](nodes/planes-as-cavities.md)**
    - Goal: 用 1 nF/in²/mil、Lsq = 32 pH/mil×h、Lspread ∝ ln(R2/R1) 算出一個 cavity 的 C 與 L。

11. **[Cavity 的自共振，與電容擺哪裡才有效](nodes/cavity-self-resonance-and-capacitor-interaction.md)**
    - Goal: 算出 cavity 的 series LC fres ≈ 1 GHz/D，並用 Lspread/Lmount 判斷它是 transparent 還是 location matters。

12. **[Cavity 的 modal resonance 與衰減](nodes/cavity-modal-resonance-and-attenuation.md)**
    - Goal: 算出 f_mn、說明哪個 probe 位置激不起奇模，並用薄介質同時降 Z0 與加阻尼。

13. **[訊號換 return plane 時，cavity noise 怎麼來](nodes/return-plane-transitions.md)**
    - Goal: 解釋 return current 換層如何把 via 電流變成平面間電壓波，並估出 victim via 上的 mV。

14. **[壓制 cavity 共振：shorting via、DC blocking 電容與阻尼](nodes/suppressing-cavity-resonance.md)**
    - Goal: 用 1/6 波長規則算 shorting via 間距、用 n_caps 算 DC blocking 電容數，並用 ESR 壓下平行峰。

### Tier 5 — PDN 生態系與三個峰

15. **[PDN ecology 與 Bandini Mountain](nodes/pdn-ecology-and-bandini-mountain.md)**
    - Goal: 把六個 PDN 元件對到 Z(f) 頻段，並算出 Bandini 峰的 fres、Z0、q 與 L/(250 ps) 的 peak 下限。

16. **[Cavity 的角色，與 VRM、bulk 電容](nodes/cavity-role-vrm-and-bulk.md)**
    - Goal: 說明 cavity 對 die 為何幾乎透明、VRM 為何是 series RL，並從 Ztarget 反推 bulk 電容。

17. **[MLCC 選值：單值、三值、FDTIM 與 OPD](nodes/mlcc-value-strategy-fdtim-opd.md)**
    - Goal: 判斷「加 10 µF」何時是錯的，並用 FDTIM、controlled-ESR 或 OPD 做出一條 1–200 MHz 的平阻抗。

### Tier 6 — 暫態電流與電壓響應

18. **[Transient current 與 CMOS 的電流波形](nodes/transient-current-and-cmos-waveforms.md)**
    - Goal: 從 clock-edge charge 推出 impulse/step/resonance 三種波形，並解釋 droop 的因是 ODC 放電、不是 di/dt。

19. **[阻抗峰的方程式與三種電流波形](nodes/impedance-peak-equations-and-waveforms.md)**
    - Goal: 用 Z0 = √(L/C)、Q = Z0/R、peak ≈ Q·Z0 從波形反推 RLC，或從 RLC 預測波形。

20. **[暫態下的 target impedance、rogue wave 與 gating](nodes/transient-target-impedance-rogue-waves.md)**
    - Goal: 說明 Ztarget 在暫態為何成立、多峰如何疊出超標的 rogue wave，並算出 clock/power gating 的代價。

### Tier 7 — 量測、驗證與設計流程

21. **[量低阻抗：VNA、two-port 與 fixture 陷阱](nodes/measuring-low-impedance.md)**
    - Goal: 用 Z = 25 Ω × S21 量 sub-mΩ 阻抗，並認出 phase delay、contact resistance、spatial attenuation 三個 fixture artifact。

22. **[用 PRC 算表走一遍設計流程](nodes/prc-spreadsheet-design-flow.md)**
    - Goal: 從 dI 與 Vdd 填到 PRC lines 1–60，得到三個峰的 fres/Z0/q 與三種波形的電壓響應。

23. **[從量測反推 PDN，並讓模擬對上量測](nodes/reverse-engineering-and-correlation.md)**
    - Goal: 用五個量測反推 ODC、loop L、Z0，並用 SCL 模型把 droop 與 resonance 對到量測 ±5% 內。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
