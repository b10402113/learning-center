---
subject: pi-pdn
language: zh-Hant
created: 2026-10-30
updated: 2026-10-30
---

# MEMORY — pi-pdn

## Goal

拿到一片高速數位板的電源架構，能自己做出一組說得出理由的 PDN 決策：從 transient current 定出 target impedance、在阻抗曲線图上指出每一個 peak 是誰造成的、決定要幾顆 MLCC／多少 bulk／要不要 on-package decoupling，並用 VNA 或 two-port 量測資料驗證自己的判斷。

判準不是背出公式，而是看到一條 Z(f) 曲線或一張 droop 波形，能說出「這個 peak 的 fres、Z0、q 是多少，哪個元素在主導，拿掉它會怎樣」。

## Why

電機本科讀過電路學與電磁學，但學校把 RLC 共振、電感、傳輸線教成考試題；真實板子上同樣的東西變成 eye closure、Vdd collapse、cavity noise，中間那條線沒人帶我走過。這本書正好是那條線：把已經學過的物理，接上「一片板子要怎麼設計」的工程判斷。

## Prior experience

- 電機／電子本科：電路學、電子學、電磁學都修過；RLC、阻抗、transmission line、Maxwell 的符號看得懂，但細節生疏。
- 會看 schematic、datasheet、基本實驗室量測（示波器、電源供應器）。
- 沒有實際 PDN 設計、SI/PI 分析或量產板 debug 經驗。
- 軟體能力強（TypeScript／Node、Python）；能寫腳本掃參數、跑 ngspice／QUCS、讀 S-parameter 檔。

## Anchors

- 學校的 RLC 共振曲線 ↔ 書裡的 series RLC dip 與 parallel RLC peak：同一個數學，換成 PDN 就是「谷與峰」。
- 電磁學的 B field、Faraday's law ↔ loop inductance 與 spreading inductance：電感是「每安培能圍出多少磁力線圈」。
- 示波器上看到的電源 ripple ↔ PDN noise；記憶體／CPU 主機板的 VRM → die 供電路徑就是 PDN。
- 電容在電路學裡是「儲能元件」↔ 在 PDN 裡是「低阻抗旁路」，而且真正決定成敗的是 mounting inductance 不是容值。
- 寫程式做參數掃描 ↔ PRC spreadsheet 掃設計空間：同一種「先建模型、再掃參數、看哪個 peak 超標」的工作流。
- 訊號完整性常見的 eye diagram ↔ PDN noise 在垂直方向壓 eye、在水平方向造成 jitter（約 1 ps/mV）。
- 「東西會動，但沒人知道為什麼」↔ 這本書的立場：robust 是設計出來的，不是測試出來的。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次（沿用既有節奏）。
- macOS；可安裝 ngspice／QUCS、用 Python 讀 S2P、開 spreadsheet。
- 以模擬與讀圖為主；量測章節先學會「看得懂別人的量測與陷阱」，有儀器再補實作。
- 一次一小段，能算一個數字、畫一條曲線，比讀完一章重要。

## Knowledge type

mixed，但**程序性主導**。事實（公式、元件參數、量測定义）只學到夠用；重心是工程判斷——哪個 peak 威脅最大、該降 L 還是加 R、電容擺哪裡才有效、量到的曲線哪些是 fixture artifact。

## How to teach me

- 先看失敗長相，再學機制：eye closure、droop、cavity resonance、rogue wave，先看到波形壞掉，再回頭拆是哪個 peak。
- 每個抽象立刻綁到一個數字、一條曲線或一個 rule of thumb（Ztarget = ΔV/ΔI、25 nH/inch、1 nF/in² per mil、fres ≈ 1 GHz / 板子英吋）。
- 每個 node 留一個「弄壞它」的動作：拿掉 on-die cap、把 dielectric 變厚、少放幾顆電容、把 return plane 切開，看阻抗曲線與波形怎麼變。
- 公式只留會用的那幾個，其餘用圖與近似說明；不要推導給我看。
- 技術名詞保留英文（target impedance、ESL、cavity、Bandini Mountain、FDTIM），不要硬翻。
- 不喜歡：名詞堆疊、沒有前因後果的公式清單、先學完理論才准動手。
