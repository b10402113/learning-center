---
source: sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.14.part.txt
source_type: text
source_lines: 1498
part: 14
status: absorbed
absorbed_at: 2026-11-11
created: 2026-11-11
updated: 2026-11-11
---

# L1 overview

- 10.1 restates the goal: keep die voltage within spec at the lowest cost, distinguishes a fully robust PDN from a reasonably or marginally robust one, and lays out the three-step flow — rules of thumb, a linearized spreadsheet, then field-solver and circuit simulation — with overdesign framed as buying insurance.
- 10.2 summarizes the book's principles: the frequency-domain impedance profile and its two non-LTI exceptions (the SMPS and the switching on-die load), target impedance from maximum time-averaged current, three ways to estimate transient current, and the RLC figures of merit (resonant frequency, characteristic impedance, q-factor) for series versus parallel topologies; it then covers the Bandini Mountain, on-package decoupling, flat board impedance, and the loop-inductance guidelines.
- 10.3 introduces the PDN Resonant Calculator (PRC) spreadsheet as the second-pass tradeoff tool, lists its six sections, and states its core assumption of three impedance peaks roughly a decade apart.
- 10.4 walks lines 1–12 of the PRC: rail voltage, maximum, minimum and leakage current, the derived dynamic and transient currents, the AC tolerance, and the resulting AC target impedance of 6.3 mΩ plus the DC tolerance and 1 mΩ DC target.
- 10.5 walks lines 13–24: clock-edge (0th droop) charge of 4.5 nC per cycle, switching load capacitance of 4.5 nF, a 4.5% switch factor, 100 nF of on-die capacitance, the 60%/40% split of R_die1 and R_die2, and the leakage-derived dynamic damping resistance of 330 mΩ across the on-die capacitance.
- 10.6 shows how mounting inductance and resistance are extracted: the twin-rod approximation for vias, balls and bumps, the DC and skin-depth resistance formulas, parallel-pair combination and the checkerboard reduction factor, and the sheet-inductance formalism for plane pairs.
- 10.7 applies those formulas to a default geometry — 30 µm C4 balls on 200 µm pitch, 0.5 mm BGA balls on 1 mm pitch — and tallies 1.9 nH for bottom-side mounting versus 0.37 nH top-side, 29 pH in the package, 19 pH of parallel BGA via pairs, 95 pH in the 76 µm board cavity, and 141 pH total.
- 10.8 describes the three loops of the PRC and the RLC inputs for each (lines 26–44), noting that peaks at least a decade apart can be analyzed independently while closer peaks require a full circuit simulation.
- 10.9 defines the performance figures of merit (lines 55–60): each peak's resonant frequency, peak impedance, PDN ratio, characteristic impedance and q-factor, plus the three time-domain droops driven by impulse, step, and resonant square-wave currents; it also explains FDTIM and when the spreadsheet must give way to a simulator.
- 10.10 focuses on damping: peak impedance equals Z0 times q, four loss mechanisms contribute (leakage, load loss, on-die ESR, bump-loop resistance), their q-factors combine as reciprocals, and load loss and leakage — the two terms usually omitted from simulations — dominate the result, taking the Bandini Mountain from 163 mΩ unloaded down to 66–67 mΩ at 9 A and 91 mΩ at 50% duty cycle.

# L2 detail

- `#L1-L19` — Chapter 10 opens: the book's concepts are pulled together into case studies, since transient currents, on-die capacitance and package inductance vary per design but the principles and flow do not.
- `#L20-L46` — Section 10.1 defines the goal (voltage within spec at lowest cost), contrasts fully robust versus reasonably robust PDNs, and notes every PDN is unique with its own cost/risk tradeoffs.
- `#L47-L99` — The three-step design process (judgement and rules of thumb, linearized spreadsheet, field solver plus time/frequency simulation), the option to overdesign as insurance, and the chapter's plan.
- `#L100-L138` — Section 10.2 argues frequency- and time-domain views carry the same information for a linear, time-invariant, passive PDN, names the SMPS and switching on-die load as the two non-LTI exceptions, and derives target impedance from maximum time-averaged current and tolerable noise.
- `#L139-L177` — The hardest parameter is transient current; three estimation approaches are given (gate count and load capacitance, prior-product bench measurements, back-out from measured noise and known impedance), plus the reminder that peaks, not dips, cause violations.
- `#L178-L237` — Resonant peaks are modeled as parallel RLC; the three figures of merit are peak frequency, characteristic impedance and q-factor, and Figure 10.1 shows series resonance (a valley set by ESR) versus the two parallel-resonator loss placements.
- `#L238-L264` — Q-factor for each topology: inverse to R for circuits (a) and (b) where loss is in series with the resonant current, proportional to R for (c) where loss is in parallel with the resonant voltage; the peak impedance at resonance follows from the R placement.
- `#L265-L317` — Step-droop estimation from characteristic impedance, the tip on measuring initial droop to extract the largest current step, and the resonant square-wave result Vpk-pk set by q, valid for q > 2, with the π/2 ≈ 1.6 peak-to-target condition.
- `#L318-L356` — The Bandini Mountain (on-die capacitance against package lead inductance) is usually the dominant peak; ways to lower it are more on-die capacitance, less package inductance, more damping, on-package decoupling (which splits it into two peaks) and optimized board capacitor values.
- `#L357-L407` — A flat, resistive-looking board impedance damps the Bandini peak provided its characteristic impedance and the flat level stay below target; three loop-inductance goals (short, close, wide) translate into four layout guidelines including via-in-pad and thin plane dielectric.
- `#L408-L447` — Section 10.3 motivates the spreadsheet: the whack-a-mole nature of tradeoffs, its role for sizing, planning, optimization and model-to-hardware correlation, and its limits (no artwork, not a verification tool), with Table 10.1 showing the full PRC.
- `#L448-L499` — The PRC's six sections are listed, along with its assumption of three peaks about a decade apart (die/package/MLCC, MLCC/bulk, bulk/VRM) and the tip that its purpose is a fast acceptable answer, not the final design tool.
- `#L500-L548` — Section 10.4, lines 2–7: 1 V rail, 10 A maximum current, 2 A minimum with clock, 1 A leakage (roughly Vdd³), giving 9 A maximum dynamic and 1 A minimum dynamic current.
- `#L549-L588` — Lines 8–12: ±5% AC tolerance, 8 A transient current, the 6.3 mΩ AC target impedance, 1% DC tolerance, and the 1 mΩ DC target impedance based on total current through the series resistance.
- `#L589-L648` — Section 10.5 introduces the 0th droop (clock-edge noise) and lines 14–17: 2,000 MHz clock, 4.5 nC per cycle, 4.5 nF switching load capacitance, and the 4.5% switch factor against total on-die capacitance.
- `#L649-L712` — Lines 19–24: 100 nF on-die capacitance, the R_die1/R_die2 60/40 split (RC ≈ 250 ps regardless of die area), the leakage resistance model with coefficient a, and the 330 mΩ dynamic leakage resistance that damps the on-die capacitance.
- `#L713-L756` — Section 10.6 classifies interconnect as vertical (vias, balls, bumps) or horizontal (planes, traces), and Figure 10.2 maps the R and L elements between on-die capacitance and MLCCs; approximations are accurate to 10–20%.
- `#L757-L800` — The twin-rod formulas: loop inductance per length from spacing D and radius R, DC loop resistance per length, skin depth versus frequency, and the 100 MHz reference point (6.6 µm copper skin depth) with square-root frequency scaling.
- `#L801-L898` — Combining parallel pin pairs: mutual inductance can raise the total, checkerboard Vdd/Vss interleaving lowers it, and Figures 10.4–10.6 show the checkerboard factor saturating at 0.7 for a diameter-to-pitch of 25%, decreasing as pins get closer.
- `#L899-L954` — Horizontal planes: loop inductance equals sheet inductance (nH/square, set only by dielectric thickness) times the number of squares, and sheet resistance time squares gives trace resistance, doubled for the Vdd and Vss paths.
- `#L955-L1001` — Section 10.7's default geometry and its inductance budget: 1.9 nH for bottom-side capacitor mounting versus 0.37 nH top-side, 29 pH package, 19 pH for 18 BGA via pairs, 95 pH of 76 µm cavity (one square), totaling 111 pH in the PCB and 141 pH overall.
- `#L1002-L1055` — Section 10.8 explains why three peaks appear (growing inductance and capacitance away from the die), that the Bandini Mountain is the highest and hardest, and that peaks separated by a decade can be solved independently, with Figure 10.8 giving the equivalent circuit.
- `#L1056-L1147` — The PRC's RLC inputs (lines 26–44): package inductance and DC/AC resistance, board via and spreading inductance, capacitor count and value, 0402 ESR model, body ESL, mounting via resistance and loop inductance, and the resulting parallel-combined series RLC.
- `#L1148-L1219` — Section 10.9's five figures of merit per peak (lines 55–57, 48, 49 — resonant frequency, peak impedance, PDN ratio, characteristic impedance, q) and the three time-domain droops: impulse clock-edge droop, step droop, and resonant square-wave peak voltage.
- `#L1220-L1243` — Three loops yield three peaks and three droops; adding capacitive branches breaks up the inter-branch inductance (the FDTIM approach), after which peaks blur into a flat profile and a circuit simulator is needed — but the Bandini Mountain remains and the PRC still predicts it.
- `#L1244-L1292` — Section 10.10 on damping: peak impedance is Z0 times q, so low q is the goal; four loss sources are named (leakage, load loss, on-die ESR, bump-loop resistance), and intentional series resistance can be added if they are insufficient (Figure 10.9).
- `#L1293-L1368` — Whether a loss is series or parallel sets its q: parallel loss gives q = Rn/Z0, series loss gives q = Z0/Rn; the Bandini loop is a series loop, and leakage, load, on-die ESR and loop ESR q-factors are written out, with load conductance dropping q as current rises.
- `#L1369-L1405` — Overall q is the reciprocal sum, dominated by the smallest contribution; the tables show load damping is lowest and leakage second, both often omitted from frequency-domain simulations (Figure 10.10).
- `#L1406-L1468` — Three load cases against the ADS simulation: no load damping (peak 0.163 Ω), 9 A steady load (q = 3.0, overall 1.8, 66 mΩ predicted versus 67 mΩ simulated), and 8 A at 50% duty (0.200 Ω equivalent, q = 5.5, overall 2.5, 91 mΩ), with 44.10 versus 44.26 MHz agreement.
- `#L1469-L1498` — Time-averaging the load current is what makes frequency-domain analysis valid for a nonlinear die, load damping varies by more than 2× with the assumed current profile, and true understanding requires time-domain simulation, which the next section takes up.
