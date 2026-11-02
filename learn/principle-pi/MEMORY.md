---
subject: principle-pi
language: zh-Hant
created: 2026-10-31
updated: 2026-10-31
---

# MEMORY — principle-pi

## Goal

拿到一片高速數位板（或一個 package），能自己走完一次 PDN 決策：從 transient current 定出 target impedance、在 Z(f) 曲線圖上指出每一個 peak 是誰造成的、決定要幾顆 MLCC／多少 bulk／要不要 on-package decoupling，再用 PRC 算表與時間域模擬把這組選擇驗證一次。

判準不是背公式，而是看到一條 Z(f) 或一張 droop 波形，能說出「這個 peak 的 fres、Z0、q 是多少，哪個元素在主導，拿掉它會怎樣」，並且知道自己結論的失效邊界（rogue wave、量測 artifact、微碼）。範圍是整本十章的骨架，重心放在 Ch1–2、4–6、8–10；Ch3 的量測只教到「看得懂量測、知道自己量到的可能不是真的」，不教架設實驗室。

## Why

電機本科讀過電路學與電磁學，但學校把 RLC 共振、電感、傳輸線教成考試題；真實板子上同樣的東西變成 eye closure、Vdd collapse、cavity noise，中間那條線沒人帶我走過。這本書正好是那條線：把已經學過的物理，接上「一片板子要怎麼設計」的工程判斷。

## Prior experience

- 電機／電子本科：電路學、電子學、電磁學都修過；RLC、複數阻抗、transmission line、Maxwell 的符號看得懂，但細節生疏，需要複習才敢用。
- 會看 schematic、datasheet，用過基本實驗室設備（示波器、電源供應器），沒有自己的 VNA。
- 沒有實際 PDN 設計、SI/PI 分析或量產板 debug 的經驗。
- 軟體能力強（TypeScript／Node、Python）：能寫腳本掃參數、跑 ngspice／QUCS、讀 S-parameter 檔。

## Anchors

- 學校的 RLC 共振曲線 ↔ 書裡的 series RLC dip 與 parallel RLC peak：同一個數學，換成 PDN 就是谷與峰。
- 電磁學的 B field、Faraday's law ↔ loop inductance 與 spreading inductance：電感是「每安培圈出多少磁力線」。
- 寫程式「先量 baseline 再優化」↔ target impedance 與 PDN ratio：先定驗收線，再談要放哪些零件。
- 讀 log-log 阻抗圖 ↔ 讀濾波器的 Bode 圖，只是把頻率響應的語言換成電源軌。
- 做 side project 時「多拉一條線」的直覺 ↔ 多加一顆 MLCC 其實是多一條 loop；接腳距離就是電感。
- 除錯時「先確認量測本身可信」↔ 書中反覆提醒的 fixture artifact 與假的低阻抗。

## Habits & constraints

- 每週 3–5 小時，單次 60–90 分鐘，平日晚間；桌機為主。
- 學習常被打斷，node 要能一段一段讀，每篇自成一件事。
- 沒有實驗室：量測章節以讀懂波形／曲線與 artifact 為主，不要求親手架台。
- 模擬以免費工具為主（ngspice／QUCS），必要時用 Python 畫 Z(f)、掃參數。

## Knowledge type

mixed，前後半不同調。Tier 1–4（阻抗語言、RLC、電感、電容、cavity）以 declarative 為主，要建立可複用的心智模型；Tier 5–7（ecology、暫態、PRC、量測）轉為 procedural，重點是「給一個情境，我能做出判斷並算得出數字」。整體以 declarative 打底、procedural 收尾。

## How to teach me

- 每篇從一個真實波形、量測曲線或失敗案例開場，先看到現象，再給解釋。
- 公式只留能拿來判斷的：Z0 = √(L/C)、fres = 159/√(L[nH]·C[nF])、Zpeak ≈ q·Z0；其餘推導壓到最小。
- 每個 node 結尾放一個可回答的 checkpoint：「這條曲線你會怎麼判斷？」，而不是名詞回顧。
- 名詞定義、歷史、書目壓到最短；q、Z0、Bandini Mountain 這類術語第一次出現就釘死，之後直接引用。
- 偏好「同一件事換兩個視角」的對照：die 看是峰、board 看是谷；series RLC 與 parallel RLC 的同一組數學。
