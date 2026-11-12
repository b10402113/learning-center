---
subject: principle-pi
status: confirmed
path: source-faithful
created: 2026-11-11
---

# ROADMAP — principle-pi

## Goal

沿 Smith & Bogatin《Principles of Power Integrity for PDN Design — Simplified》的章節順序，建立 PDN 設計的完整心智模型：從阻抗與 target impedance，到量測、電感、電容、平面、生態系、暫態，最後用 PRC 試算表完成一次可驗證的設計。

## Learning path

**原書順序（source-faithful）**：完全照作者 Ch1 → Ch10 的鋪陳，每一章一個 tier。這條路徑最佳化與原書章節、圖表與 Bottom Line 的一一對應，最好回查；適合想完整讀完一本書、不跳章、以書為索引的學習者。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 定義與方法論

1. **[什麼是電源傳遞網路（PDN），為何該在意](nodes/what-is-a-pdn.md)**
   - Goal: 說出 PDN 的範圍、三項職責，以及電壓雜訊如何吃掉眼高與抖動。
2. **[「能動」的 PDN 與「穩健」的 PDN](nodes/working-or-robust-pdn.md)**
   - Goal: 用 target impedance 與 PDN ratio 判斷設計風險，而不是只看能不能跑。
3. **[雕塑 PDN 阻抗曲線](nodes/sculpting-the-impedance.md)**
   - Goal: 說出各元件各管哪段頻率，以及為什麼工作發生在它們的交界處。

### Tier 2 — 阻抗基本原理

4. **[為何阻抗是 PDN 的核心指標](nodes/why-impedance.md)**
   - Goal: 在頻域用 V/I 與 jω 描述阻抗，並用 1 A AC 源模擬阻抗。
5. **[真實元件與串聯 RLC](nodes/series-rlc.md)**
   - Goal: 用串聯 RLC 的三個區段解釋電容的實際阻抗曲線與自共振頻率。
6. **[並聯 RLC、共振與 q 值](nodes/parallel-rlc-and-q.md)**
   - Goal: 從並聯 RLC 的峰值推出共振頻率、特性阻抗、q 與峰值阻抗。
7. **[從晶片或電路板看 PDN](nodes/pdn-from-chip-and-board.md)**
   - Goal: 說明同一結構為何從板看是凹陷、從 die 看是峰值，並用阻抗矩陣描述多埠耦合。

### Tier 3 — 量測低阻抗

8. **[用 V/I 與反射法量測阻抗](nodes/measuring-impedance.md)**
   - Goal: 用 VNA 的 S11 與 50 Ω 校正把反射係數換成元件阻抗。
9. **[單埠極限、四點 Kelvin 與雙埠低阻抗](nodes/two-port-low-impedance.md)**
   - Goal: 解釋為何單埠在 0.1 Ω 以下失效，並用雙埠 Kelvin 取得 Z ≈ 25 Ω × S21。
10. **[量測實例：導線迴路、via、MLCC 與 on-die 電容](nodes/measurement-examples.md)**
    - Goal: 把 fixture 時延與損耗納入模型，從實測反推 R、L、ESR 與 on-die 電容。

### Tier 4 — 電感與 PDN 設計

11. **[什麼是電感：磁場、能量與 Maxwell 方程](nodes/what-is-inductance.md)**
    - Goal: 用磁力線環與儲能解釋迴路電感，並區分 B 場密度與電感。
12. **[準靜態近似、內外部電感與局部電感](nodes/loop-and-partial-inductance.md)**
    - Goal: 判斷何時可用集總模型，並用 self 與 mutual 局部電感拆解迴路電感。
13. **[迴路電感的解析近似與經驗法則](nodes/inductance-approximations.md)**
    - Goal: 用 25 nH/inch、片電感與 L = Z0·TD 快速估算常見幾何。

### Tier 5 — MLCC 電容整合

14. **[電容的 RLC 模型與並聯共振](nodes/cap-rlc-and-parallel-resonance.md)**
    - Goal: 用三元件 RLC 描述實裝 MLCC，並預測兩顆電容之間的並聯峰。
15. **[需要多少電容、ESR 模型與受控 ESR](nodes/capacitance-esr-and-controlled-esr.md)**
    - Goal: 從 target 反推 bulk 電容，並用 ESR 與受控 ESR 壓低並聯峰。
16. **[安裝電感、vendor S 參數與高頻模型](nodes/mounting-inductance-and-s-params.md)**
    - Goal: 判斷安裝電感的來源，並從 vendor S 參數萃取 C、ESL 與 ESR。

### Tier 6 — 平面與腔體

17. **[平面的電容、片電感與擴散電感](nodes/plane-capacitance-and-spreading.md)**
    - Goal: 用平行板電容與片電感估算腔體，並解釋擴散電感的對數依賴。
18. **[腔體的串並聯共振與模態共振](nodes/cavity-modal-resonances.md)**
    - Goal: 分辨 LC 凹陷與模態共振，並用薄介電與損耗壓低峰值。

### Tier 7 — 訊號換回路平面

19. **[訊號換回路平面時的腔體雜訊與短接貫孔](nodes/cavity-noise-and-shorting-vias.md)**
    - Goal: 用短接貫孔與同電壓回路平面把腔體共振推到訊號頻寬之上。
20. **[直流阻隔電容、阻尼與回路平面設計準則](nodes/damping-and-plane-design.md)**
    - Goal: 用安裝電感、ESR 與數量準則設計非同電壓平面的去耦合。

### Tier 8 — PDN 生態系

21. **[On-die 電容、封裝 PDN 與 Bandini Mountain](nodes/odc-package-and-bandini.md)**
    - Goal: 解釋 ODC 與封裝迴路電感如何形成整個 PDN 最高的並聯峰。
22. **[腔體、VRM 與 bulk 電容的角色](nodes/cavity-vrm-and-bulk.md)**
    - Goal: 說明 cavity 尺寸為何幾乎無關，以及 VRM 迴路與 bulk 電容如何決定低頻。
23. **[單值與三值 MLCC 選法以及 FDTIM](nodes/mlcc-values-and-fdtim.md)**
    - Goal: 用 FDTIM 從 Bandini 的 Z0 與 q 反推電容數量與值，而不是憑慣例。
24. **[On-package 去耦合與共用電源軌](nodes/opd-and-shared-rails.md)**
    - Goal: 評估 OPD 與其他晶片作為電容對峰值的影響，並守住阻尼。

### Tier 9 — 暫態電流與電壓雜訊

25. **[暫態電流的來源與估計方法](nodes/transient-current-sources.md)**
    - Goal: 從時鐘邊緣電荷推導 PDN 電流，並用最大電流的 50% 設定 worst case。
26. **[三種電流波形與 PDN 的響應](nodes/three-current-waveforms.md)**
    - Goal: 用 impulse、step、resonance 對應不同的阻抗特徵並預測 droop。
27. **[目標阻抗、Q 值、rogue wave 與穩健策略](nodes/target-q-and-robust-strategy.md)**
    - Goal: 分辨 fully 與 marginally robust，並用單一主峰與低 Q 對抗 rogue wave。

### Tier 10 — 整合：實務設計流程

28. **[PDN Resonant Calculator：輸入、三迴路與品質指標](nodes/prc-spreadsheet.md)**
    - Goal: 用試算表把 target、ODC、封裝與板級參數化成三個峰與阻尼。
29. **[案例驗證：SCL 負載、時間域響應與改善](nodes/case-study-and-improvements.md)**
    - Goal: 用時間域模擬驗證試算表預測，並用 OPD、電容值與上升時間改進。
30. **[從量測反推 PDN、風險與成本取捨](nodes/reverse-engineering-and-limits.md)**
    - Goal: 用量測波形反推 PDN 參數，並說出效能、成本與風險的最後取捨。

## Status

- [x] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
