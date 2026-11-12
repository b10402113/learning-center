---
source: sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.2.part.txt
source_type: text
source_lines: 352
part: 2
status: absorbed
absorbed_at: 2026-11-11
created: 2026-11-11
updated: 2026-11-11
---

# L1 overview

- Power integrity is poorly defined and spans everything from the VRM to the on-die core rails and on-die capacitance. The PDN is specifically the interconnects, intentional energy storage, and damping between the VRM and the on-die Vdd-Vss rails; PI is about the quality of power seen by die circuits.
- There is a gray area between PI and SI: cavity noise from signals crossing planes, and switching noise or ground bounce from I/O currents through common package lead inductance. The book argues this boundary matters because solutions differ — board decoupling helps core Vdd noise but rarely fixes return-plane bounce, and can even worsen cavity-to-signal cross talk through parallel resonances.
- Many problems get lazily lumped under "power integrity," each with a different root cause and different best practices. The authors insist on naming the specific problem, its root cause, and its own remedies rather than blindly applying generic or contradictory recommendations.
- Robust PDN must be designed in, not tested in: failures are hard to reproduce and may depend on specific microcode and current patterns. Every PDN is unique, so the answer to most questions is "it depends" and must be settled by defining the problem and putting in the numbers.
- The book's four-element methodology is: start from established best practices, understand the underlying principles (applied Maxwell's equations), know the common problems and their root causes, and use analysis tools to explore cost-performance-risk-schedule tradeoffs.
- It is a handbook for practicing engineers: minimal mathematical formalism, equations used as shorthand for what matters, simple simulations and measured data as anchors. Five navigation features include approximations, figures with extended captions, TIPS, a 10-point "The Bottom Line" per chapter, and a companion PDN resonance calculator spreadsheet.
- The ten chapters run from the PDN and target impedance, through impedance and low-impedance measurement, inductance, MLCC integration, planes and spreading inductance, return-plane signal integrity, the PDN ecology peak, transient current spectra, and a spreadsheet-based first-pass design workflow.

# L2 detail

- `#L1-L4` — Preface title page.
- `#L5-L17` — Power integrity is confusing and undefined; the field spans VRM to on-die rails and capacitance, and the PDN is defined as the interconnects, energy storage, and damping between VRM and die.
- `#L18-L37` — PI is the quality of power at the die; cavity noise and I/O switching noise sit in the SI/PI gray area, and board capacitors help core Vdd noise but not return-plane bounce, sometimes worsening cross talk via parallel resonances.
- `#L38-L52` — Solving starts with identifying the problem and root cause; this book targets Vdd-rail self-aggression from core switching, with methods that also transfer to other SI, PI, and EMI problems.
- `#L53-L67` — "Power integrity" is too broad a label; lists the first peripheral problems, including I/O-driven Vcc noise, ground bounce, VRM self-aggression, and return-path discontinuities.
- `#L68-L90` — Remaining peripheral problems involve noise transferring onto the board PDN and cross talk between package/board PDN and Vdd, I/O rails, or signals; each has a distinct root cause and remedy.
- `#L91-L100` — Published PDN recommendations are often wrong or contradictory because they solve one specific problem and get generalized; engineers must state the problem, root cause, and practice explicitly.
- `#L101-L114` — A poor PDN fails at the worst time and is hard to reproduce, so quality cannot be tested in; robustness ranges from a low-impedance VRM alone to tightly specified capacitors and restricted microcode.
- `#L115-L127` — Every PDN is unique in requirements, chip, microcode, and cost/performance/risk/schedule constraints; "it depends" answers require numbers and analysis.
- `#L128-L151` — Four elements of an efficient design process — best practices, applied Maxwell principles, common problems and root causes, and analysis tools for tradeoffs — and the book's handbook goal.
- `#L152-L159` — As a Prentice Hall "Simplified" book, it minimizes mathematical formalism and omits detailed derivations and heavy numerical simulation.
- `#L160-L171` — Mathematical rigor still matters, but applying principles beats deriving everything; because each design is custom, guidelines require engineering judgment.
- `#L172-L181` — Do not brute-force everything in a 3D full-wave simulator; judgment rests on principles, known failure modes, and targeted tool use.
- `#L182-L197` — The authors bring over 70 years of combined SI/PI experience rescuing failed designs; engineers must become their own expert rather than trusting hearsay.
- `#L198-L215` — Equations are shorthand for which terms matter, supported by simple simulations and measured data from test vehicles and real systems.
- `#L216-L231` — Navigation feature 1–2: break real problems into simplest form with approximations, and present results graphically in figures with extended captions.
- `#L232-L247` — Features 3–5: TIPS highlighting key observations, a 10-point "The Bottom Line" per chapter, and the PDN resonance calculator spreadsheet plus supplemental material on informit and beTheSignal.
- `#L248-L262` — The book is a training manual; Chapter 1 introduces the PDN, low impedance, the impedance profile, and target impedance as the design figure of merit.
- `#L263-L271` — Chapter 2 reviews impedance via series and parallel RLC circuits and shows how any free SPICE simulator can act as an impedance analyzer.
- `#L272-L276` — Chapter 3 covers measuring low impedance, with PDN targets from 1 Ω down below 1 mΩ and special techniques for components and the whole PDN ecology.
- `#L277-L284` — Chapter 4 covers inductance: what it is, how physical design affects it, estimating loop inductance, and why low loop inductance cuts peak impedance.
- `#L285-L292` — Chapter 5 covers MLCC behavior alone and in combination, the five tactics for reducing peak impedance, and engineering low mounting inductance.
- `#L293-L299` — Chapter 6 covers power/ground planes, spreading inductance as their key property, and the claim that plane cavity resonances are unimportant for die-level power quality.
- `#L300-L310` — Chapter 7 treats return-plane switching noise as a signal integrity problem distinct from PI, with different root cause and different solutions.
- `#L311-L317` — Chapter 8 presents the PDN ecology: the peak from on-die capacitance and package lead inductance, and board-level ways to reduce it.
- `#L318-L327` — Chapter 9 covers CMOS transient current spectra and three waveforms — clock-edge impulse, step, and repetitive square wave — and how impedance, current, and voltage interrelate.
- `#L328-L337` — Chapter 10 assembles the method with a spreadsheet-based first-pass design technique and worked scenarios validated against measured PDN data.
- `#L338-L352` — Authors' signature (Larry Smith and Eric Bogatin, January 2017) and product registration instructions with ISBN 9780132735551.
