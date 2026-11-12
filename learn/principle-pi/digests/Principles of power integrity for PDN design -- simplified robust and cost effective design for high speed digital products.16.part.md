---
source: sources/principle-pi/20261111/supplement/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.16.part.txt
source_type: text
source_lines: 1766
part: 16
status: skipped
skip_reason: "書籍索引，僅為詞條與頁碼對照"
created: 2026-11-11
updated: 2026-11-11
---

# L1 overview

- Book index (A–Z), a lookup list of terms with page numbers, not teaching prose.
- Most-referenced concepts: target impedance, impedance profiles and flat impedance, Bandini Mountain (characteristic impedance, frequency, damping, peak impedance).
- Also heavily indexed: cavity/plane modal resonance, spreading inductance, capacitor mounting inductance, ESR/ESL, VRM, ODC/OPD/MLCC.
- Measurement and modeling entries: VNA, two-port low-impedance, four-point Kelvin, S-parameters, 3D field solvers (ADS, QUCS, Simbeor).
- Useful as a concept checklist; page numbers map to the printed book, not to these lines.

# L2 detail

- `#L1-L120` — NUMBERS, A, B, start of C: 0th droop, 1-inch copper loop, 3D field solver, 0603 MLCC; Ampere's Law, ADS, inductance approximations, measurement artifacts; Bandini Mountain; capacitance, bulk/MLCC/ODC.
- `#L121-L240` — C continued: cavity modes, fringe field, PCB cavity, peak impedance, signal-integrity design, spreading inductance, C-symbols, characteristic impedance, circuits, Class 1/2/3, clock edge current.
- `#L241-L360` — C–D: clock edge and dynamic/transient current, current waveforms; damping, dB, DC blocking capacitors, decoupling, density, PDN design goals, dielectric, Dk, domains, DUT.
- `#L361-L480` — D–E–F: dielectric/magnetic-field notes, driving resonance, dynamic current; EMC/EMU, energy density, ESL/ESR; FDTIM, field lines, fixture artifacts, flat impedance, frequency terms, fringe field.
- `#L481-L600` — G–H–I: gating, ground bounce, Henrys, higher-bandwidth cap models; Iclk_edge, IDC, ideal capacitors, impedance (Bandini Mountain, matrix, measurement, profiles).
- `#L601-L720` — I continued: impedance profiles and signal-integrity design, target impedance, transfer impedance; impulse current; inductance (mounting, density, loop, Maxwell, mutual, quasi-static, sheet, skin depth, spreading, via, VRM).
- `#L721-L840` — I–J–K–L: inductance continued, inductors, inrush, interconnect, internal inductance, SI units; Kelvin/Kramers-Kronig; L symbols, LDO, loop inductance/resistance, lossy line models, low-impedance measurement.
- `#L841-L960` — L–M–N: low-frequency plane properties, lumped circuit, L via/VRM; magnetic fields, Maxwell's Equations, measurement, minimum capacitance, MLCC, modal resonance; nanoHenrys, narrow cavities, noise terms.
- `#L961-L1080` — N–O–P: modal-resonance suppression list, modeling, mounted-capacitor loop inductance, mounting inductance; ODC, on-die PDN, OPD, optimization; package PDN, parallel plate/resonant frequency.
- `#L1081-L1200` — P continued: PDN ecology (Bandini Mountain, bulk/MDLC/ODC/OPD, package, PCB cavity), PDN ratio and response, PRC, peak impedance, planes, power puddles, PRF.
- `#L1201-L1320` — P–Q–R: planes/spreading inductance, transmission lines, PLLs, Poisson profile, ports, power gating, PRBS, PRC, PRF, profiles; q-factor, quasi-static, QUCS; R reactance, resistance, resonance.
- `#L1321-L1440` — R–S: resonance, PDN response, return current, reverse-engineering, ringing, RLC circuits, rogue wave; saturating spreading inductance, scattering parameters, SCL, signal-integrity design.
- `#L1441-L1560` — S–T: signal integrity, SSN, sine waves, skin depth, SMPS, S-parameters, SpiCAP, spreading inductance, SRF, step current, suppression; tantalum, target impedance, Telegrapher's, temperature, transient current.
- `#L1561-L1680` — T–V: transient response, transmission lines, two-port measurement; uniform conductors, Vdd/Vss rails, VNA, vias, voltage droop, voltage noise, voltage stability.
- `#L1681-L1766` — V–W–X–Y–Z: voltage-noise index, VRM, Vss rails, current waveforms, Webers, wide cavities/conductors, wire loop, working PDN; X2Y, Z symbols (ZC, ZDUT, Zpeak, Zport, Ztarget).
