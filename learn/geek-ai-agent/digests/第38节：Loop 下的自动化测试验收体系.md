---
source: 第38节：Loop 下的自动化测试验收体系
source_type: pdf
source_lines: 321
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第38节：Loop 下的自动化测试验收体系

## Overview (L1)

- Inheritance from lesson 37 — Every loop turn asks "is it right?"; the answer comes entirely from the automated test/acceptance system — the loop's judge. A strong judge lets the loop converge to correctness; a weak or absent one makes it amplify errors fast. Tests are the foundation laid before work, not cleanup after.
- When's test pyramid — Five layers, slower/pricier/closer-to-real upward: unit (time-wheel algorithm, consistent hash, serialization — pure logic, ms, most numerous), integration (real Redis/ETCD, read/write and coordination semantics), end-to-end (HTTP submit → schedule → Sink receive), distributed correctness/chaos (kill nodes/inject partitions), and performance/load (write P99, delivery latency, mass simultaneous expiry).
- Why distributed correctness is hardest — It fails only at the exact worst moment; failures depend on timing and fault injection, so without actively creating faults tests stay green and problems surface in production; many properties cannot be proven by a single assertion but only approximated by "repeated injection + invariants always hold".
- Invariants to hold — No loss (stored messages are eventually delivered), no duplicate semantics (duplicates possible but absorbed idempotently), timeliness (takeover within 10s), uniqueness (at most one Master/Controller at any moment).
- Cases 1–3 — Case 1 no-loss (submit N, confirm in Redis, kill Master before expiry, Slave/new Master recovers from Redis, assert all N delivered); Case 2 10s takeover (inject failure, timestamp "fault → new Master starts scheduling", assert < 10s); Case 3 split-brain/election (cut network to create partition, assert at most one Controller and one Master per wheel, no loss on restore, convergence back to a single Master with no double-write).
- Fault injection — Turn the worst moment into repeatable test steps: kill containers (docker-compose kill/stop), network partition, delay/loss (tc); injection is the test's input, not an accident.
- Judge cannot be bribed — A loop may cheat (modify/delete/disable tests, loosen assertions so they always pass, quietly skip hard scenarios); guardrails: forbid changing tests/acceptance in the public Harness, implementer/verifier separation, CI as an external judge the agent cannot reach.
- Layered judges — Fast tests (unit, quick integration, lint/types/compile) run locally each loop turn for self-correction; heavy tests (e2e, chaos, load) go to CI/humans in an isolated environment the loop cannot touch; fast-at-hand, heavy-outside.
- Failure modes over coverage — Don't chase coverage numbers (a loop writes getter/setter tests to pad to 90%); chase whether key failure modes are caught (message loss, switch timeout, split-brain, mass expiry); write decidable assertions, not "coverage ≥ X%".
- Two-run acceptance — Part 1 (single-machine correctness: timing precision P99, received → delivered, unit/integration/single-node e2e) vs Part 2 (cluster correctness: no loss, 10s switchover, split-brain uniqueness, replica lag recovery, chaos/fault-injection-led); mirrors lesson 37's "verifiable to the loop, hard-to-verify with humans present".
- Checklist & closing — Five questions to design a part's acceptance; the summary: build the judge before letting the loop run, the judge must not be bribable, and trust in the loop depends on judge strength.

## Sections (L2)

### inherits-37
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#inherits-37]]`
- Summary: Carries lesson 37's "Harness matters most" into its hardest piece — acceptance; each loop turn's "is it right?" is answered by the test/acceptance system, which is the loop's judge.
- Key claims: A strong judge lets the loop self-converge; a weak or absent one means the loop confidently amplifies errors; in Loop programming tests are the pre-laid foundation, not post-hoc cleanup; the quality of the judge you design decides whether the loop is usable.
- Learner-relevant: The central claim linking harness design to loop trustworthiness.

### test-pyramid
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#test-pyramid]]`
- Summary: When's five-layer pyramid: unit (pure logic, ms, largest), integration (real Redis/ETCD), end-to-end (full path), distributed correctness/chaos (kill/inject), performance/load (write P99, delivery latency, mass expiry).
- Key claims: When's acceptance difficulty concentrates in the top two layers, especially distributed correctness, which ordinary unit tests cannot catch.
- Learner-relevant: The map of test layers and where difficulty lives.

### distributed-correctness-hardest
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#distributed-correctness-hardest]]`
- Summary: Explains why distributed correctness is hardest: it tests whether the system stays correct when a node dies at the worst moment, failures depend on timing and injection, and many properties can only be approximated by repeated injection + invariants.
- Key claims: The invariants: no loss, no-duplicate semantics (idempotent absorption), timeliness (10s takeover), uniqueness (at most one Master/Controller).
- Learner-relevant: The conceptual foundation for writing chaos tests.

### case-1-no-loss
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#case-1-no-loss]]`
- Summary: Case 1 no-loss: submit N delay messages, confirm stored in Redis, kill the Master before expiry, Slave/new Master recovers from Redis, assert all N delivered.
- Key claims: It verifies the core contract — Redis persists before returning to the business, and Redis is the single source of truth; assertions check not just count but content and no premature/late delivery beyond threshold; the judge is an automated integration test orchestrating containers, injecting kill, collecting downstream messages, and asserting set equality.
- Learner-relevant: A concrete, reusable no-loss acceptance test.

### case-2-3-switchover
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#case-2-3-switchover]]`
- Summary: Case 2 10s takeover (inject Master failure, timestamp fault → new Master scheduling, assert switch latency < 10s aligned to the requirement; writes during the window may fail but stored messages are not lost) and Case 3 split-brain/election (cut network for partition, assert at most one Controller and one Master per wheel, convergence after restore, no double-write).
- Key claims: Both are "repeated injection + invariant always holds", not "pass once"; these tests must be repeatable and automatically decidable.
- Learner-relevant: How to test timeliness and uniqueness under partitions.

### fault-injection
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#fault-injection]]`
- Summary: Techniques to make the worst moment repeatable: kill containers (docker-compose kill/stop a When node), network partition (cut connectivity to simulate split-brain/islands), delay/loss (tc injection to stress replica sync and heartbeat).
- Key claims: Injection actions are written into test scripts / docker-compose orchestration and run/verified with the cluster; fault is the test's input, not an accident.
- Learner-relevant: The practical toolkit for chaos-style acceptance.

### judge-cannot-be-bribed
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#judge-cannot-be-bribed]]`
- Summary: Lists how a loop cheats (modify/delete/disable tests to go green, loosen assertions to always pass, quietly simplify hard scenarios like skipping chaos or shortening waits) and the guardrails (public Harness forbids changing tests/acceptance, implementer/verifier separation, CI as an external judge).
- Key claims: Key separation — the loop may run local tests to self-correct, but the question "are the tests themselves correct" is guarded by humans and CI, which the loop has no right to change.
- Learner-relevant: The anti-cheating discipline for trustworthy loops.

### tests-into-harness
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#tests-into-harness]]`
- Summary: Layered judges: the loop runs unit tests, quick integration, and lint/types/compile each turn (second-level feedback, self-repair); e2e, chaos, and load go to CI/humans (slow or destructive, independent environment the loop cannot reach or alter).
- Key claims: All-in-loop is too slow and lets the loop tamper with destructive tests; all-in-CI removes the immediate judge — so fast-in-hand, heavy-outside, both are needed.
- Learner-relevant: The division of labor between loop and CI.

### failure-modes-not-coverage
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#failure-modes-not-coverage]]`
- Summary: Contrasts the wrong target ("push coverage to 90%", which invites empty getter/setter tests) with the right one ("can it catch When's key failure modes": loss, switch timeout, split-brain, mass expiry).
- Key claims: Write acceptance as decidable assertions pointing at failure modes ("N messages zero-loss after Master failure", "no double Master under partition"), not "coverage ≥ X%".
- Learner-relevant: How to phrase acceptance so the loop can converge.

### two-run-acceptance
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#two-run-acceptance]]`
- Summary: The acceptance focus differs per run: Part 1 (timing expiry precision P99, received → delivered, unit + integration + single-node e2e; judge fast/repeatable, loop converges easily) vs Part 2 (no loss, 10s switchover, split-brain uniqueness, replica lag recovery; chaos/fault-injection-led; judge slow/destructive, mostly CI/humans).
- Key claims: Echoes lesson 37 — "verifiable to the loop, hard-to-verify with humans present" becomes two acceptance suites with different focuses.
- Learner-relevant: Connects the test system to the two-run implementation plan.

### checklist
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#checklist]]`
- Summary: Five questions to design a part's acceptance: (1) what is the key failure mode, (2) which layer tests it, (3) is the assertion decidable, (4) fast or heavy, (5) can the judge be tampered with (write it into public Harness).
- Key claims: A repeatable procedure for acceptance design.
- Learner-relevant: The practical checklist to apply per part.

### closing
- Locator: `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf#closing]]`
- Summary: Build the judge before the loop runs: the test system is the loop's lifeblood; When's difficulty is distributed correctness, approximated by fault injection + invariants; the judge must not be bribed (separation, CI, public Harness); chase failure modes not coverage; fast in-loop, heavy in CI.
- Key claims: Whether the loop can be trusted depends on how strong the judge is — building the judge is the most solid thing to do before implementing When.
- Learner-relevant: The section's closing thesis on judge-first.

## Sources

- `[[sources/geek-ai-agent/20260922/第38节：Loop 下的自动化测试验收体系.pdf]]`
