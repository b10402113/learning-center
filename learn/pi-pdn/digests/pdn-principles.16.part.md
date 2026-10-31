---
source: sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt
source_type: text
source_lines: 25393
part: 16
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- **Goal and design flow (§10.1)** — Robust PDN design means keeping die voltage in spec under all operating conditions at lowest cost; robustness is a spectrum from fully robust (aircraft, life support) to reasonably robust, and the practical flow is rules of thumb first, spreadsheet optimization second, field-solver/circuit simulation last, with "overdesign" as purchasable insurance.
- **Power-integrity principles recap (§10.2)** — Everything reduces to target impedance from transient current, then to the three figures of merit of each impedance peak: resonant frequency, characteristic impedance Z0, and q-factor; series resonance makes valleys, parallel resonance makes peaks, and the peaks (not the dips) threaten the rail.
- **The PDN Resonance Calculator (§10.3–10.5)** — A six-section linearized spreadsheet models three peaks a decade apart; lines 1–12 set Vdd, max/min/leakage current, transient current and AC/DC target impedance, while lines 13–24 derive clock-edge (0th droop) charge, switching load capacitance, on-die capacitance with its 60/40 R_die split, and the dynamic leakage damping resistance.
- **Extracting L and R from geometry (§10.6–10.7)** — Vertical paths use the twin-rod formula with skin-depth scaling from a 100 MHz reference and a checkerboard reduction factor; horizontal paths use sheet inductance (nH/square) and sheet resistance times the number of squares; the worked default shows the PCB cavity sheet inductance dominates the bump loop.
- **Three loops and their figures of merit (§10.8–10.9)** — Bandini Mountain (on-die C + package L), the MLCC–bulk loop, and the bulk–VRM loop are analyzed independently when separated by a decade; lines 55–60 output fres, peak impedance, PDN ratio, Z0, q, and the impulse, step, and resonant square-wave voltage responses.
- **Damping and q-factor (§10.10)** — Peak impedance is Z0 × q, so lowering q is the lever; the four loss sources are leakage, load loss, on-die ESR, and bump-loop resistance, combined like parallel resistors, and the often-omitted load and leakage terms dominate the damping in the worked 44 MHz example.

# L2 detail

- `#L20306-L20404` — Chapter 10 opening and §10.1: defines robust vs reasonably robust PDN, lists the cost of over-robustness, lays out the three-step flow (rules of thumb → spreadsheet → field solver), and frames overdesign as risk insurance.
- `#L20405-L20712` — §10.2 summarizes power-integrity principles: frequency-domain impedance from the die, the LTI caveat for SMPS and on-die capacitance, target impedance from time-averaged current, three ways to estimate transient current, series vs parallel RLC topologies and their q and peak-impedance formulas, the π/2 target margin, Bandini Mountain remedies, and the four loop-inductance layout guidelines.
- `#L20713-L20804` — §10.3 introduces the PDN Resonance Calculator (PRC) spreadsheet, its role as a sizing/planning and model-to-hardware correlation tool rather than a verification tool, and its six sections covering three peaks spaced about a decade apart.
- `#L20805-L20893` — §10.4 walks PRC lines 1–12: Vdd, maximum/minimum current consumed, leakage current, maximum and minimum dynamic current, AC tolerance, transient current, AC target impedance (6.3 mΩ default), DC noise tolerance, and DC target impedance (1 mΩ default).
- `#L20894-L21017` — §10.5 walks PRC lines 13–24: clock frequency, charge per clock cycle (4.5 nC), switching load capacitance (4.5 nF), switch factor (4.5%), on-die capacitance (100 nF), the R_die1/R_die2 60/40 ESR split with the 250 ps RC rule, leakage coefficient a, and the 330 mΩ dynamic leakage resistance.
- `#L21018-L21259` — §10.6 extracts mounting inductance and resistance: twin-rod loop inductance per length and DC resistance, skin depth with a 100 MHz / 6.6 µm reference and √f scaling, multiple-pair parallel loop inductance, checkerboard reduction factor (asymptote 0.7 at diameter/pitch = 25%, falling as pins crowd), and plane sheet inductance/resistance as nH or Ω per square times the number of squares.
- `#L21260-L21306` — §10.7 applies extraction to a default geometry (30 µm C4 on 200 µm pitch, 0.5 mm BGA on 1 mm pitch): 1.9 nH bottom-side vs 0.37 nH top-side capacitor mounting, 29 pH package vertical, 19 pH for 18 BGA via pairs, 95 pH sheet from a 76 µm cavity, and 141 pH total loop; Tables 10.4 and 10.5 hold the vertical/horizontal and RLC summary sections.
- `#L21307-L21452` — §10.8 defines the three loops and reads PRC lines 26–44: package series L and R at DC/resonance, board via and spreading L with VRM output inductance, capacitor count and value, ESR from the 0402 MLCC relation, capacitor body ESL, via and pad resistance, via loop inductance, and the final per-capacitor RLC results.
- `#L21453-L21548` — §10.9 reads PRC lines 55–60: resonant frequency, peak impedance, PDN ratio to target, characteristic impedance, q-factor, then the clock-edge (impulse) droop, the step-current droop from Z0 × I_step, and the resonant square-wave peak-to-peak voltage; also maps first/second/third droop to the highest/middle/lowest frequency peaks.
- `#L21549-L21803` — §10.10 explains damping: Z_peak = Z0 × q, the four loss mechanisms (leakage, load loss, on-die ESR, bump-loop R), parallel-form (q = R/Z0) and series-form (q = Z0/R) q equations, overall q as the parallel combination dominated by the smallest term, and ADS correlation at 44 MHz (163 mΩ unloaded, 67 mΩ at 9 A, 91 mΩ at 50% duty 8 A).
