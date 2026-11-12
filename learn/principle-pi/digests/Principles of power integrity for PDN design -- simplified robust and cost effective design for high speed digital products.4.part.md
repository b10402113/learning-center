---
source: sources/principle-pi/20261111/course/Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.4.part.txt
source_type: text
source_lines: 427
part: 4
status: absorbed
absorbed_at: 2026-11-11
created: 2026-11-11
updated: 2026-11-11
---

# L1 overview

- Defines the power delivery network (PDN) as every interconnect from the VRM pads to the circuits on the die: board power/ground planes, cables, connectors, and all power-supply capacitors. Its three jobs are to distribute low-noise DC voltage and power, provide a low-noise signal return path, and mitigate EMI without adding radiated emissions.
- Explains why PDN noise matters physically: voltage noise collapses the eye vertically, spreads edge crossings horizontally into jitter, and can cause setup/hold failures in core circuits. A measured microprocessor example shows 125 mV of Vdd–Vss noise at 300 MHz, and a jitter example shows roughly 1 ps of jitter per mV of rail noise.
- Sets the design budget: total single-ended receiver noise margin is about 15% of signal swing, split equally among reflection, crosstalk, and PDN noise, giving the familiar 5% PDN allocation; noise-sensitive blocks like ADCs and PLLs may need under 1%, held from DC to 5–10 GHz.
- Introduces the "PDN ecology": the whole series of interconnects whose combined impedance profile, as seen at the die pads, converts transient gate current into rail noise. Noise depends on the overlap of current spectrum peaks with impedance peaks, so microcode and gate utilization matter as much as hardware.
- Distinguishes a product that merely "works" in a test suite from a robust design, and formalizes the limit as target impedance Ztarget = ΔVnoise / Imax-transient. If the PDN impedance stays below this at all frequencies, worst-case noise stays inside spec.
- Defines the PDN ratio (actual peak impedance divided by target impedance) as the risk metric: below 1 is low risk, around 2 is still acceptable, and 10 or above is almost certainly unacceptable. Cost buys margin, so the core trade-off is cost versus failure risk, weighed differently for consumer versus avionic products.
- Shows how to sculpt the impedance profile: on-die capacitance, on-package capacitors, package lead inductance, board vias, planes, decoupling and bulk capacitors, and the VRM each own a region of the profile, while the interfaces between them are where most PDN design work happens.
- Closes with a ten-point bottom line restating the definition, purposes, 5% noise allocation, current-times-impedance origin of noise, 1 ps/mV jitter sensitivity, primacy of the impedance profile, and the target-impedance and PDN-ratio metrics.

# L2 detail

- `#L1-L5` — Chapter 1 title and the opening section heading that asks what the PDN is and why the reader should care.
- `#L6-L14` — Defines the PDN as all interconnects from the voltage regulator modules (VRMs) to the circuits on the die, including power and ground planes, cables, connectors, and all power-supply capacitors; Figure 1.1 is introduced as a typical multi-VRM computer board.
- `#L15-L19` — Figure 1.1 caption: a typical computer motherboard with multiple VRMs and active devices, with the PDN spanning from VRM pads to die circuits.
- `#L20-L28` — The three purposes of the PDN: distribute low-noise DC voltage and power, provide a low-noise return path for all signals, and mitigate EMI without contributing radiated emissions; the book focuses on the first role.
- `#L29-L37` — Consequences of poor noise control: vertical eye collapse from voltage noise, horizontal spreading of reference crossings into jitter, and core-circuit setup and hold-time errors that cause functional failures.
- `#L38-L43` — Tip: a badly designed PDN raises bit error ratios through vertical noise and jitter in both I/O and on-chip circuits, while excessive horizontal core noise causes setup/hold violations.
- `#L44-L48` — PDN noise adds to the transmitter signal or appears on the receiver voltage reference, reducing the noise margin left for all other sources.
- `#L49-L59` — Figure 1.2: measured voltage noise between core Vdd and Vss rails on a microprocessor at 300 MHz clock, sampled at three on-die locations and two rails, showing more than 125 mV of noise.
- `#L60-L62` — Even when this noise alone does not cause a bit failure, it contributes to eye closure and, combined with other sources, can produce a failure.
- `#L63-L78` — Timing impact: propagation delay depends on instantaneous Vdd–Vss, since higher drain-to-source voltage means stronger channel fields and shorter delay; rail noise therefore becomes jitter, with high Vdd pulling in and low Vdd pushing out a clock edge. Figure 1.3 is introduced.
- `#L79-L81` — Figure 1.3 caption: measured jitter on a clock signal in the presence of Vdd-to-Vss voltage noise.
- `#L82-L97` — The jitter experiment: a clock net sharing Vdd with gates driven by a pseudo-random bit sequence (PRBS) draws large transient current and noise; period jitter shows direct voltage-noise-to-jitter correlation at about 1 ps per mV, so 100 mV peak-to-peak noise gives 100 ps jitter, which would consume an entire 500 ps period of a 2 GHz clock.
- `#L98-L101` — Tip: roughly 1 ps/mV is a reasonable jitter-sensitivity estimate for many devices.
- `#L102-L119` — Section 1.2 opens: PDN noise must stay below roughly ±5% of supply, derived from a ~15% receiver noise margin split equally among reflection, crosstalk, and PDN; ADCs and PLLs may need under 1%; the limit holds from DC up to signal bandwidth of 5–10 GHz.
- `#L120-L133` — Root-cause approach: low-frequency noise usually comes from the VRM, so VRM selection is the first step, yet noise remains on die pads because transient gate current drops voltage across the whole interconnect impedance; this entire network is named the PDN ecology.
- `#L134-L138` — Tip: the PDN ecology is the full series of interconnects between die pads and VRM pads, interacting to create the impedance profile seen at the die.
- `#L139-L145` — The interconnects form an impedance profile as applied to the die pads; Figure 1.4 presents a typical example.
- `#L146-L157` — Transient currents through that impedance produce voltage noise on chip pads regardless of VRM stability; Figure 1.5 overlays the transient current spectrum on the impedance profile, whose product yields the voltage noise spectrum and, in time domain, transient noise.
- `#L158-L162` — Figure 1.5 caption: on the left, impedance and current spectrum give acceptable noise; on the right, a slight current-spectrum change gives unacceptable noise.
- `#L163-L180` — Walks through Figure 1.5: the same impedance with a slightly different microcode algorithm and frequency moves a current peak onto a larger impedance peak, exceeding the noise limit; noise depends on the overlap of current frequency components with impedance peaks, so microcode changes can turn a passing product into a failing one.
- `#L181-L186` — Tip: PDN noise depends as much on the die-referenced impedance profile as on the transient current spectrum, and microcode and gate utilization strongly shape that current.
- `#L187-L213` — Section 1.3: because microcode determines the current spectrum, passing a boot or test suite does not prove robustness; a product can work in evaluation and fail in the field under other software. A robust PDN means any code at any frequency and signature produces worst-case noise below the failure threshold, which sets a maximum allowable impedance once paired with the worst-case current.
- `#L214-L225` — Defines target impedance as that maximum allowable PDN impedance with guaranteed performance, gives the relation Ztarget = ΔVnoise / Imax-transient with variable definitions for maximum specified rail noise and worst-case transient current.
- `#L226-L230` — Worked example: a ±50 mV noise spec with 1 A worst-case transient current gives 50 mΩ target impedance, and the target becomes frequency dependent if either term is.
- `#L231-L239` — Caveat: the true worst case needs a transient simulation of the full current waveform and complete impedance profile; target impedance is a practical approximation and figure of merit for a starting point.
- `#L240-L245` — Tip: target impedance is a good design-goal approximation, with the final robust check coming from a full-PDN transient simulation.
- `#L246-L260` — A fully robust PDN stays below target impedance at all frequencies, so worst-case rail collapse stays inside spec except for rare rogue-wave events; Figure 1.6 shows an impedance profile under a 50 mΩ target and the resulting rail noise.
- `#L261-L267` — Figure 1.6 caption: top is the impedance profile held below target from DC to very high bandwidth; bottom is Vdd rail noise under large transient load staying under the 5% spec, with the square wave being clock-driven transient current on a relative scale.
- `#L268-L288` — The worst-case transient current is not flat: its amplitude rolls off at high frequency according to how fast the maximum number of gates can switch, with effective rise time from one clock edge up to 100 cycles; a 2 GHz, 0.5 ns period example needing 20 cycles gives a 10 ns rise and a 35 MHz knee, above which current falls at −20 dB/decade and target impedance rises.
- `#L289-L295` — Figure 1.7 caption: target impedance for a transient current turning on over 20 clock cycles to a 1 A maximum.
- `#L296-L303` — Consequence: the target impedance spec relaxes at high frequency, but locating the knee is hard without knowing transient current and worst-case microcode, so engineering judgment is required for a cost-effective requirement.
- `#L304-L316` — The three-step engineering process: establish a best-guess target from chip function and application, make design decisions to meet that profile where possible, and balance PDN implementation cost against field-failure risk; introduces the PDN ratio as actual impedance over target impedance.
- `#L317-L323` — PDN ratio interpretation: under 1 is low risk, about 2 can still be acceptable, and about 10 almost surely fails, because some microcodes will excite PDN resonances and destabilize the product.
- `#L324-L334` — Lower impedance and lower ratio cost more via extra components, tighter assembly rules that hurt yield, more board or package layers, larger die capacitance area, or expensive materials; paying for margin is "buying insurance," the fundamental PDN trade-off.
- `#L335-L339` — Tip: PDN ratio is a key risk metric, with 2 or lower low risk and 10 or higher high risk.
- `#L340-L346` — The balance is application dependent: cost-driven consumer products may accept a higher ratio, while avionics may justify paying for a ratio below 1.
- `#L347-L367` — Section 1.4: the goal is an acceptable impedance profile from DC to the highest current frequency, sculpted by engineering all elements together; Figure 1.8's schematic lists on-die capacitance, possible on-package capacitors, package lead inductance, board vias, power and ground planes, decoupling capacitors, bulk capacitors, and the VRM.
- `#L368-L381` — Figure 1.8 caption and lesson: specific design features map to specific impedance features (horizontal axis in MHz), so elements can be optimized somewhat independently, but the interfaces between parts are where most PDN design effort goes; the engineer balances cost, risk, performance, and schedule.
- `#L382-L419` — Section 1.5 bottom line, ten points: PDN definition, its purposes, the 5% allocation from three equal noise sources, noise as transient current through impedance, 1 ps/mV jitter sensitivity, the impedance profile as the key metric, target impedance, the PDN ratio with 10 as high risk, the need to sculpt the whole ecology, and the book's invitation.
- `#L420-L427` — References: the 1999 Smith, Anderson, Forehand, Pelc, and Roy paper on power distribution system design methodology and capacitor selection for modern CMOS technology.
