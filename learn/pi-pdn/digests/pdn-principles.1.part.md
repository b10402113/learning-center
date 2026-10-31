---
source: sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt
source_type: text
source_lines: 25393
part: 1
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- **Preface — defining the problem** — Power integrity is a fuzzy umbrella term; the book narrows it to noise on the on-die Vdd core rail caused by the die's own switching current ("self-aggression"). Lists seven neighboring PDN/SI problems (I/O ground bounce, VRM load-impedance noise, return-path discontinuity, cavity-to-rail cross talk) and insists each has a distinct root cause, so blanket "power integrity" recommendations are often wrong or contradictory.
- **Preface — methodology and book map** — A robust PDN must be designed in, not tested in, because failures are microcode-dependent and hard to reproduce. The recommended process has four parts: start from best practices, understand applied Maxwell's equations, know the common failure root causes, then use analysis tools to trade cost/performance/risk/schedule. Also previews the ten-chapter arc and the book's "Simplified series" style (approximations, extended figure captions, TIPS, ten-point chapter summaries).
- **Ch1 §1.1 — What the PDN is and why it matters** — The PDN spans every interconnect from VRM pads to die circuits: board planes, cables, connectors, decoupling and bulk capacitors. Its three jobs are clean DC power, a low-noise signal return path, and EMI mitigation; the book teaches the first. PDN noise closes the eye vertically and horizontally, and rail noise becomes jitter at roughly 1 ps per mV (measured 125 mV noise example; 100 mV p-p → 100 ps p-p, a whole 2 GHz period).
- **Ch1 §1.2–1.3 — Target impedance and PDN ratio** — The 5% rail-noise budget comes from splitting a ~15% receiver noise margin three ways between reflection, crosstalk, and PDN (ADCs/PLLs need <1%). Noise is set by the product of the transient current spectrum and the impedance profile of the whole "PDN ecology," not by VRM stability alone. Defines Ztarget = ΔVnoise / Imax-transient (50 mV / 1 A → 50 mΩ), notes it relaxes above a knee frequency (e.g. 35 MHz for a 20-cycle, 2 GHz turn-on), and defines PDN ratio = peak impedance / target (≈2 low risk, ≥10 high risk).
- **Ch1 §1.4–1.5 — Sculpting the profile and the bottom line** — Each PDN element (on-die capacitance, package capacitors, package lead inductance, vias, planes, decoupling and bulk capacitors, VRM) maps to a recognizable feature of the impedance-vs-frequency curve, which lets parts be optimized semi-independently — but the interfaces are where the design actually lives. Ends with the ten-point chapter summary and the target-impedance reference (Smith et al., IEEE TAP 1999).

# L2 detail

- `#L442-L541` — Preface: why power integrity is ill-defined; scopes the book to Vdd core-rail self-aggression; enumerates seven adjacent PDN/SI problems with distinct root causes and warns against generalizing single-problem fixes.
- `#L542-L592` — "Meeting the challenge of robust PDN design": failures are microcode-specific and non-reproducible, each PDN is unique, and the four-element design process (best practices, applied Maxwell, known root causes, trade-off analysis).
- `#L593-L656` — "Who this book is really for": deliberate minimal math, equations as shorthand for which terms matter, the case against simulating everything in 3D full-wave, and the authors' 70 years of combined experience.
- `#L657-L688` — "Five features": simplified approximations, story-telling extended figure captions, TIPS boxes, end-of-chapter "The Bottom Line" ten-pointers, and the companion PDN resonance calculator spreadsheet.
- `#L689-L837` — Chapter-by-chapter outline (Ch1–Ch10 synopsis, from target impedance through the spreadsheet design method) plus acknowledgments and author biographies.
- `#L838-L938` — §1.1: PDN definition and Figure 1.1–1.3; three PDN purposes; eye closure, setup/hold failures, propagation-delay dependence on Vdd, and the 1 ps/mV jitter sensitivity rule of thumb.
- `#L939-L1023` — §1.2: 5% noise budget (15% margin split three ways), <1% for ADC/PLL, DC-to-5–10 GHz bandwidth, "PDN ecology" impedance profile, and how microcode shifts current spectral peaks onto impedance peaks (Figure 1.5).
- `#L1024-L1183` — §1.3: why passing a test suite is not robust; definition and derivation of Ztarget = ΔVnoise/Imax-transient; frequency-dependent target and the 35 MHz knee example; PDN ratio as risk metric and the cost-versus-risk trade-off across consumer and avionic products.
- `#L1184-L1218` — §1.4: the full PDN ecology schematic (die cap, package caps, lead inductance, vias, planes, decoupling, bulk, VRM) mapped to impedance-profile features; element isolation works only if interfaces are respected.
- `#L1219-L1264` — §1.5 "The Bottom Line" ten-point chapter summary and the reference to the Smith et al. 1999 target-impedance paper.
