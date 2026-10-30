---
source: sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt
source_type: text
source_lines: 25393
part: 8
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- **Mounting inductance of a capacitor (5.12)** — The mounted loop inductance splits into surface-trace, capacitor-body, and via contributions plus cavity spreading; summing them with the mutual term explains why a conventional 0603 on a 10 mil cavity runs about 2 nH. Five knobs — short traces, wide traces, cavity near the surface, reverse-aspect-ratio bodies, multiple vias — cut it, with X2Y/IDC and via-in-pad reaching 200 pH.
- **Vendor S-parameter models and their traps (5.13)** — Vendor two-port files come from a series microstrip fixture, so their ESL belongs to the fixture, not the capacitor; files are silently "corrected" for passivity and reciprocity, sometimes corrupted, and sometimes mislabeled (a 10 nF part extracting as 5.8 nF).
- **Extracting a usable RLC model (5.14)** — Short port 2, convert S11 to Z(f), then pull C from the imaginary part at low frequency, ESL from the inductive slope, and ESR from the |Z| minimum; a simple series RLC fits well until mounting inductance gets small.
- **Higher-bandwidth lossy transmission line model (5.15)** — Below roughly 1 nH of mount inductance the capacitor behaves as an open-ended distributed line: inductance falls and ESR rises with frequency because current stops using the upper plates, which conveniently damps parallel-resonance Q. A 10-section ladder with Df, Lsect, and Rsect reproduces this, and quarter-wave resonance explains why probing a capacitor's top amplifies noise at SRF.
- **Bottom line (5.16)** — Ten condensed rules: RLC is remarkably good, parallel peaks between dissimilar caps are the real enemy, and mounted ESL below 4 nH is always achievable, below 2 nH is routine, below 0.5 nH is good design.

# L2 detail

- `#L7885-L7937` — Decomposes total capacitor ESL into mounting inductance, cavity spreading inductance, and BGA via-pair loop inductance; the mounted loop equals intrinsic plus mounting partial inductances minus 2× their mutual, and vendor ESL models ignore that mutual, an error that grows for 0201 parts with embedded micro vias.
- `#L7938-L7961` — Round-rod via-pair loop approximation (s, r, Len in mils, valid when s >> r); 10 mil vias at 80 mil pitch give 208 pH, and moving the vias to 40 mil pitch cuts it further, so opposite currents should be brought close together.
- `#L7962-L7990` — Microstrip approximation for the surface trace plus cavity top; h = 10, w = 10, Len = 30 mils yields 435 pH per leg and 870 pH for a symmetric pair.
- `#L7991-L8035` — Capacitor body term with the 5–10 mil solder-fillet offset and 15 mil dielectric fill, using a 20 mil current-centroid height; 0603 body adds 870 pH, so 208 + 870 + 870 ≈ 1948 pH ≈ 2 nH typical mounted inductance.
- `#L8036-L8051` — Backside cap under the BGA: via loop at 23 pH/mil over a 64 mil board gives about 1.5 nH, which must be weighed against cavity spreading plus BGA via inductance for a topside mount.
- `#L8052-L8108` — Reverse aspect ratio capacitors (0306 example): terminals on the long side cut squares from 2 to 0.5, potentially dropping ESR to 25%, giving 300 pH traces + 140 pH body + 100 pH vias = 540 pH, but the lower ESR can raise the parallel peak if loop inductance is not also reduced.
- `#L8109-L8136` — Five-knob design summary (short traces, wide traces, cavity close to the surface, reverse aspect ratio, multiple vias), package build-up substrates with micro vias reaching about 100 pH.
- `#L8137-L8202` — X2Y interdigitated capacitors as four parallel cells: 2 nH each becomes about 0.5 nH, gains come mainly from the via pattern and mutual coupling, and measured loop inductance is 200 pH with via-in-pad versus 900 pH with 20 mil surface traces.
- `#L8203-L8265` — Vendor S-parameters come from a two-port series microstrip fixture whose lead lengths and return-path position set the measured inductance; using them by shorting one port assumes the fixture matches the application, and files show identical S11/S22 from undisclosed passivity/reciprocity correction.
- `#L8266-L8320` — Quality failures to check for: visibly corrupted impedance profiles still released, capacitance mislabeled (10 nF file extracting 5.8 nF), and values measured on a 100/120 Hz impedance bridge that say nothing about MHz-range decoupling.
- `#L8321-L8382` — Extraction recipe: simulate return loss with port 2 shorted to get one-port Z(f), then C = -1/(2πf·imag Z), ESL from the imaginary part in the inductive region, and ESR as the |Z| minimum; a 47 nF 0402 fits C = 42.6 nF, ESL = 0.71 nH, ESR = 0.0298 Ω.
- `#L8383-L8444` — Limits of the flat-ESR RLC fit: real ESR falls with dielectric loss then rises from skin-depth current redistribution, so a single fitted ESR underestimates damping above SRF by more than 2× and should be read as the capacitor's minimum ESR, typically at 1–10 MHz.
- `#L8445-L8520` — On a sub-1 nH fixture the 1 µF capacitor's 300 MHz impedance is 0.4 Ω measured versus 0.9 Ω from RLC, showing intrinsic inductance under half its SRF value; current crowding near the return path raises ESR and lowers L, which lowers parallel-resonance Q.
- `#L8521-L8557` — Lossy transmission line capacitor model: a ladder of plate sections (10 or fewer suffice) with a dissipation factor for dielectric loss (≈0.01 for X5R); Lsect progressively blocks upper plates, producing frequency-dependent L, C, and R.
- `#L8558-L8604` — Parameter relations for the ladder: Csect = Ccap/n and Rsect = n·ESR, while the SRF-derived ESL splits into Lmount + Lbottom + Lplates, with Lcap = Lbottom + Lplates as the intrinsic frequency-dependent term.
- `#L8605-L8671` — Why the lumped substitute misleads: the open-ended plate stack is a quarter-wave resonator at SRF, not a single LC, so an LC fitted to the same dip resonates below the transmission line's actual quarter-wave frequency.
- `#L8672-L8740` — Quarter-wave extraction math: time delay at resonance gives Ltline, and comparing SRF forms shows total line inductance is about 2.47× the ESL extracted from the dip, so Lplates = 2.47·ESL − Lmount − Lbottom; converting an RLC model needs only Lbottom added.
- `#L8741-L8781` — Five-parameter fit to measured data (Df 0.011, Lmount 0.570 nH, Lsect 0.03 nH, Rsect 0.0028 Ω, C 42.6 nF) matches both impedance and extracted inductance, revealing only 30 pH of intrinsic inductance per section and showing how low the real ESL could go.
- `#L8782-L8818` — Practical conversion path: build the ladder in SPICE/QUCS/ADS, optimize C, ESR, ESL, and Lbottom, and cache four parameters per part; on a 100 µF + 1 µF board with plane capacitance the RLC model overpredicts the 3 MHz and 60 MHz parallel peaks, while the measured peaks are only 20% as tall and at higher frequency.
- `#L8819-L8838` — Embedded-capacitor use: the two-port ladder connects die-side metal to ball-side metal through an impedance rather than a short, so high-frequency power transfer from board to die is attenuated as physically expected.
- `#L8839-L8900` — Measurement consequence of quarter-wave behavior: voltage is minimum at the pads and maximum at the open top at SRF, so probing a capacitor's top reads a parallel resonance that amplifies noise; from the board side the same part is a series-resonant sink, so measure at the pads with the capacitor removed.
- `#L8901-L8945` — Bottom line: ideal-capacitor behavior ends near 10 MHz; RLC is a remarkably good model where C dominates low frequency, L high frequency, and ESR sets the SRF minimum; identical caps scale, dissimilar caps create the critical in-between peak damped by lower ESL, closer values, or higher ESR; mounting ESL targets are 4 nH (always), 2 nH (typical care), 0.5 nH (good), and sub-1 nH mounts expose the distributed transmission line model.
- `#L8946-L8969` — References [1]–[6]: AVX Spicap design tools, Roy/Smith/Prymak on ESR and ESL in decoupling, and Smith et al. on distributed SPICE and transmission-line ceramic capacitor models.
