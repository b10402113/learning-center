---
source: sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt
source_type: text
source_lines: 25393
part: 12
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- **The PDN ecology (8.1)** — Six elements (on-die capacitance, package PDN/OPD, board planes, MLCCs, bulk caps, VRM) each dominate a frequency band, but the damaging features are the impedance peaks created at the boundaries between bands, so elements must be optimized together rather than one at a time.
- **High-frequency end (8.2–8.3)** — On-die decoupling capacitance (metallization, gate, load, diffusion, added MIM/MOS) is the only low impedance above ~GHz and cannot be compensated at board level; estimate it as ~10 nF per watt (10% droop rule) with a ~250 ps RC product and sub-mΩ to few-mΩ ESR, while package loop inductance spans a 10,000:1 range (few pH to 10 nH) and is estimated from pair count, 20 pH/mil, and current-carrying limits.
- **The Bandini Mountain (8.4–8.6)** — The parallel resonance of on-die capacitance with package loop inductance is the largest and most important impedance peak, typically 10–100 MHz (up to ~200 MHz on high-end parts); its peak height is set by q-factor and, when only on-die ESR damps it, depends on package inductance alone (L/(250 ps)) — so below 200 MHz board-level resistance is a real damping lever.
- **Board and cavity (8.7–8.9)** — Multiple via pairs lower spreading plus via inductance and push the self-resonance up without moving modal resonances; the cavity is essentially transparent to the die, acting as a lumped capacitor whose only real PDN job is low spreading inductance (≈1 square of sheet inductance) to the decoupling caps, which licenses small "power puddles" instead of full planes.
- **Low frequency: VRM and bulk (8.10–8.11)** — A VRM behaves as a series RL (R ~1–4 mΩ, L ~1 nH–1 µH set by feedback loop speed, not geometry); bulk capacitance must hold impedance under target until the VRM responds, and both frequency- and time-domain derivations give the same minimum estimate, typically 100–1,000 µF.

# L2 detail

- `#L13667-L13688` — Chapter 8 framing: elements interact through parallel resonance to create peak impedances, and the peaks (not the low impedance) cause real failures, so the whole PDN must be analyzed as an ecology rather than component by component.
- `#L13689-L13762` — 8.1 maps six PDN elements onto the impedance-versus-frequency profile seen from the die pads, and warns that optimizing any single region (VRM, MLCC selection) misses the peaks that form at region boundaries.
- `#L13763-L14057` — 8.2 on-die decoupling capacitance from five sources; time-domain estimate of ~10 nF/W for <10% clock-edge droop (1 W, 1 V, 1 GHz), 1 nF/mm² at 90 nm, measured 100 nF unbiased rising to 450 nF biased, 1.2–1.7× density growth per node, ~250 ps RC product giving 5 mΩ at 50 nF, 0.1 pH ESL, and >1 ns horizontal relaxation on large die.
- `#L14058-L14279` — 8.3 package PDN from die pads to board vias; inductive below ~600 MHz (modal cavity resonance or 1/10-wavelength limit), loop inductance from few pH (large BGA, hundreds of pairs) to 10 nH (0.5-inch QFP leads), estimated as 20 pH/mil divided by pair count with pairs set by 2 A per 10 mil via or 0.25 A per 1 mil gold bond, plus ~10 mΩ per via/ball and 1 mΩ/square copper.
- `#L14280-L14466` — 8.4 the Bandini Mountain: parallel resonance of on-die C and package L with the board shorted (50 nF + 250 pH → 45 MHz), high q approaching 1 Ω, named by Steve Weir after the 1984 Bandini fertilizer mountain, measured 33 MHz causing 600 mV peak-to-peak rail noise, and acting as a filter that hides board cavity resonances from the die.
- `#L14467-L14594` — 8.5 estimating the peak frequency: f = 1/(2π√(LC)) plus reverse-engineered C and L in which average power cancels, bounding results at ~10–100 MHz (QFP at 250 MHz low end, 50 mil path at 3 GHz high end), with OPD sized ≥5× the on-die capacitance and its ESR near target impedance.
- `#L14595-L14730` — 8.6 intrinsic damping: characteristic impedance √(L/C) sets the best-case floor (0.07 Ω for 250 pH/50 nF), q ≈ f/200 MHz when only on-die ESR damps, and peak height L/(250 ps) independent of on-die capacitance — 10 mΩ requires ~2.5 pH, leaving three knobs: lower package L, more on-die C, more ESR.
- `#L14731-L14859` — 8.7 cavity probed by multiple via pairs via 3D-solver S-parameters converted with Z11 = Z0(1+S11)/(1−S11); paralleling four ports drops spreading plus BGA via inductance and raises the self-resonant dip while modal resonance frequencies stay fixed; adding a 10 nH/1 mΩ VRM superimposes its own low-frequency resonance.
- `#L14860-L15000` — 8.8 looking from die pads through the package into the cavity: the 45 MHz Bandini peak shifts to ~7 MHz once the VRM inductance is in series, a small peak/dip appears near 180 MHz from cavity capacitance with package spreading inductance, and the cavity's >1 GHz modal peaks never reach the die.
- `#L15001-L15225` — 8.9 cavity role: 1-inch vs 10-inch cavities (100× capacitance) give identical die-pad impedance, so cavity capacitance and size outside the decoupling-cap region are irrelevant; only spreading inductance (~1 square) matters, enabling power puddles, and plane-resonance caps for SI/EMI are a separate requirement from PDN caps.
- `#L15226-L15312` — 8.10 VRM as a series RL (measured 4 mΩ, 500 nH with a 740 µF/4 mΩ/5.7 nH bulk cap; equivalent L from 1 nH to 1 µH reflects feedback-loop speed, estimated from V = L·di/dt with V at 5% of Vdd), whose impedance exceeds target even at low frequency so bulk caps are mandatory.
- `#L15313-L15422` — 8.11 bulk capacitance sizing: the cap impedance must cross target where the VRM does, i.e. equal characteristic impedance √(L/C) ≤ Ztarget (10 mΩ target with 20 nH VRM ⇒ f ≈ 80 kHz, C ≈ 20 µF), and the matching time-domain charge argument gives the same result, typically 100–1,000 µF.
