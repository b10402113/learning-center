---
source: sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt
source_type: text
source_lines: 25393
part: 5
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- **Why inductance dominates PDN impedance (4.1)–(4.2)** — Interconnects are modeled as transmission lines that collapse to L and C elements at low frequency; the VRM inductance against bulk capacitance sets the low-frequency parallel resonance, capacitors set mid-band peaks, and interconnect loop inductance (capacitors, planes, vias) dominates at high frequency. Lowering inductance is the cheapest lever on peak impedance. Capacitance is reframed as the efficiency of storing charge per unit voltage to prepare the analogy.
- **What inductance is and how it impedes (4.3)–(4.4)** — Inductance is the efficiency of a conductor loop at creating magnetic field line rings per amp, not the number of rings, so it is a geometric property independent of current and dielectric (ferrites excepted). Six principles of magnetic fields, flux counting in Webers, and Faraday's law give V = L dI/dt and Z = jωL; inductance stays roughly constant while its impedance rises with frequency.
- **Quasi-static validity and field density (4.5)–(4.6)** — The quasi-static approximation drops propagation when structure size is under 1/20 wavelength (about 0.6 GHz per inch in air, halved in FR4); lumped capacitor models hold past 1 GHz while 12-inch boards need full-wave above ~30 MHz. B is a flux density in Wb/m² (Tesla, 10⁴ Gauss), not the field itself, and inductance is the half-space integral of B per amp.
- **Inductance as stored magnetic energy (4.7)** — Energy density e = B²/2µ0 shows energy lives in field-line compression, not in individual lines; U = ½LI² recasts inductance as efficiency of storing energy per amp squared and yields an inductance density dL/dv ∝ (B/I)², which motivates wider conductors, shorter length, and tight signal-return spacing.
- **Loop inductance, Maxwell, and skin depth (4.8)–(4.9)** — Only a closed loop makes inductance unambiguous: integrate B over the enclosed area, subject to ∇·B = 0 and Ampère's law, with Biot-Savart giving dB from each current element (a double integral, so use closed forms or field solvers). Internal inductance comes from field lines inside the conductor, is permeability-dependent and vanishes with skin depth (2.1 µm in copper at 1 GHz, 21 µm at 10 MHz); external inductance is geometry-only and is the high-frequency value.

# L2 detail

- `#L4677-L4727` — Chapter 4 opening and section 4.1: PDN design targets an impedance profile, interconnects reduce to L and C at low frequency, and the VRM-inductance/bulk-capacitance parallel resonance plus capacitor and via/plane loop inductance set peaks across the band; reducing inductance is the lowest-cost path to lower high-frequency and peak impedance.
- `#L4728-L4817` — Section 4.2 capacitance review: C = Q/V measures the efficiency of storing charge at the cost of voltage, depends only on overlap area, spacing, and dielectric constant, and yields I = C dV/dt with a waveform-dependent time-domain impedance versus the simple frequency-domain Z = 1/(jωC).
- `#L4818-L5073` — Section 4.3 definition of inductance: loop inductance is flux per amp, L = ψ/I, framed as efficiency of creating field-line rings per amp; six magnetic-field principles, closed rings countable in Webers (10⁸ Maxwells), right-hand rule, dielectric transparency (ferrites and ferromagnetic metals excepted), and the three geometry levers of length, cross-sectional spreading, and signal-return spacing.
- `#L5074-L5174` — Section 4.4 impedance of an inductor: Faraday's law ΔV = dψ/dt gives V = L dI/dt (back emf, or equivalently an applied voltage driving a changing current), and in the frequency domain Z = jωL; inductance is nearly frequency-independent while its impedance grows with frequency, which is why low inductance matters.
- `#L5175-L5329` — Section 4.5 quasi-static approximation: ignoring field propagation when phase variation is under 1/20 cycle, i.e. length < λ/20, giving roughly 0.6 GHz per inch in air, halved in FR4; lumped models suffice for small structures past 1 GHz, 12-inch boards need full-wave above ~30 MHz, and a 10 cm wire loop measures within 10% of ideal to 40 MHz.
- `#L5330-L5451` — Section 4.6 magnetic field density: B = dψ/da is flux per unit area in Wb/m² (Tesla = 10⁴ Gauss), is a density rather than the field itself, and the total flux (hence inductance) is the surface integral of B over a half plane from the conductor to infinity.
- `#L5452-L5594` — Section 4.7 magnetic energy: energy density e = B²/2µ0 (µ0 = 32 nH/inch = 32 pH/mil) means energy is stored in field-line compression, total U = ∫(B²/2µ0)dv = ½LI², giving inductance density dL/dv = (B/I)²/µ0 and the design rules of wider, shorter, and closer-spaced conductors.
- `#L5595-L5715` — Section 4.8 Maxwell's equations and loop inductance: a closed current loop lets every surrounding field line be counted through the enclosed area, L = (1/I)∫B·da, constrained by ∇·B = 0 and ∇×B = µ0J; Biot-Savart gives dB = (µ0 I/4π)(dl × r)/r³, making inductance a double integral usually handled by closed-form approximations, 2D/3D quasi-static solvers, or full-wave solvers.
- `#L5716-L5926` — Section 4.9 internal and external inductance and skin depth: internal inductance arises from field lines inside the conductor, scales with relative permeability (1 for copper, silver, aluminum; ~200 for alloy 42), and disappears as current crowds to the surface with skin depth δ ∝ 1/√(fσµr) — 2.1 µm in copper at 1 GHz, 21 µm at 10 MHz — so external, geometry-only inductance dominates (alloy 42 matches copper above ~10 MHz but needs silver plating for resistance) and internal inductance is typically under 10% of the total.
