---
source: sources/pi-pdn/20261030/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.txt
source_type: text
source_lines: 25393
part: 6
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- **Partial inductance (4.10)** — Splits loop inductance into partial self- and partial mutual terms so each segment can be engineered; self-inductance falls with wider conductors, mutual inductance rises as conductors come closer, and loop L = 2(Lself − M) for identical signal/return paths.
- **Exact round geometries and round-loop approximations (4.11–4.12)** — Only coax, twin rods, and rod over plane have exact closed-form loop inductance; rod-over-plane is half the twin-rod value by image theory, and a round loop scales as a·ln(a), giving the 25 nH/inch of circumference rule of thumb.
- **Wide coupled conductors and sheet inductance (4.13)** — The parallel plate approximation makes loop inductance scale linearly with length and dielectric thickness and inversely with width, so every square of a plane pair has the same sheet inductance (86 pH/sq at h = 2.7 mils); accurate only when width is ≥ 10× dielectric thickness, and about 10 nH/inch when width equals dielectric thickness.
- **Uniform transmission line approximation (4.14)** — L = Z0 × TD holds for any uniform line regardless of cross section; every 50 Ω line in FR4 is about 8.3 nH/inch, and any impedance formula (IPC microstrip, stripline) yields a loop inductance estimate, with transmission-line formulas good below aspect ratio 3 and parallel plate above it.
- **Rule of thumb, S-parameter extraction, and bottom line (4.15–4.17)** — A narrow conductor with its return far away is about 25 nH/inch (1 nH/mm); a 3D field solver's S-parameters with the far port shorted let you extract loop inductance from return loss, valid quasi-statically up to 1/20 wavelength.

# L2 detail

- `#L5927-L6028` — Defines loop inductance as a property of the whole loop, then introduces partial self-inductance (self-field rings around a segment, set chiefly by width) and partial mutual inductance (field rings from one segment around another, set chiefly by separation); loop L = (Lself,s − M) + (Lself,r − M), reducing to 2(Lself − M) for identical conductors, giving the short/wider/closer design guidelines.
- `#L6029-L6121` — States only coax, two round rods, and rod over plane have exact loop inductance per length; gives the coax ln(b/a) form, the twin-rod ln(2s/r) form with the s >> r approximation, and the rod-over-plane form at half the twin-rod value via image theory; works the BGA via pair (r = 5 mils, s = 40 mils → 21 pH/mil, 1.3 nH in a 64-mil board) and the 24 AWG wire over a plane (10 nH/inch), noting h/r ratio means shortening length matters most.
- `#L6122-L6227` — Derives the high-frequency circular loop approximation L ∝ a·ln(a/WR), shows a 1.75-inch-radius loop predicting the 247 nH measured value, stresses that Dk does not affect inductance (magnetic fields ignore dielectrics), and normalizes to circumference to establish about 25 nH/inch (1 nH/mm) of circumference for 0.5–2 inch radius loops.
- `#L6228-L6413` — Presents the parallel plate approximation L = µ0·Len·h/w = Lsq × n, defines sheet inductance Lsq = µ0·h (86 pH/sq for 2.7 mils), demonstrates square counting (1000 mil × 100 mil = 10 squares = 860 pH), then quantifies the breakdown for narrow traces: 30% error at 10:1 aspect ratio, 300% at 1:1, effective-width correction, and the 10 nH/inch rule when width equals dielectric thickness.
- `#L6414-L6574` — Shows L = Z0 × TD for any uniform transmission line (50 Ω, 1 nsec → 50 nH), derives TD from length and Dkeff, gives 8.3 nH/inch for 50 Ω FR4 lines and about 16.6 nH for a 2-inch line, notes the sheet-inductance estimate is 2× too high at low aspect ratio, and lists IPC microstrip and stripline Z0 formulas from which loop inductance per length follows.
- `#L6575-L6629` — Consolidates the quick-estimate philosophy ("an OK answer NOW"), shows the straight-rod partial self-inductance formula and that 30-gauge 1-inch wire is also about 25 nH/inch, and states the general rule of thumb: 25 nH/inch or 1 nH/mm for narrow conductors with the return far away, with better approximations needed for wide conductors close together.
- `#L6630-L6816` — Explains 3D field solvers as the tool for arbitrary geometry and S-parameters as their output, then extracts loop inductance for a 10-mil via pair on 40-mil pitch in a 62-mil board by shorting port 2, converting S11 to Zin via the reflection coefficient, and computing L from Im(Z)/ω; result is 1.5 nH versus 1.3 nH from the twin-rod estimate, with the ideal-inductor model valid to about 5 GHz per the 1/20-wavelength limit.
- `#L6817-L6862` — Bottom-line list of ten principles: loop inductance sets high-frequency PDN impedance, inductance is field-ring creation per amp, loop inductance differs from field density, the quasi-static limit is 1/20 wavelength (0.6/length in inches, GHz, in air), only three geometries are exact, three geometric levers reduce L, all squares have equal sheet inductance, the parallel plate approximation holds to 10:1 aspect ratio, and equal Z0 in equal material means equal inductance per length.
- `#L6863-L6880` — Reference list for the chapter: Grover, Kraus, Paul, Young, Bogatin, the Clemson inductance calculator, and Shlepnev's Simbeor.
