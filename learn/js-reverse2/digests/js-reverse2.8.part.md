---
source: js-reverse2
source_type: codebase
source_lines: 192819
language: javascript
part: 8
status: absorbed
absorbed_at: 2026-10-05
created: 2026-10-05
updated: 2026-10-05
---

# Digest — js-reverse2 (part 8)

## Overview (L1)
- Advanced protection: JSVMP virtual-machine obfuscation — Day23 teaches the core VMP idea (algorithm logic encrypted to a bytecode string, external data passed at runtime, decoded then executed by a switch interpreter), demonstrated in C and mirrored onto IDA analysis.
- Day24–day25 are a real reverse-engineering case ("元宝"/Yuanbao web SDK, `yb_v2_vendor_qimei`): a JSVMP-hosted signature algorithm built from a custom bytecode VM plus RC4, a shuffled base64 alphabet, XOR with a salt, and a timestamp/nonce parameter bundle.
- The large `log2.txt` / `logs (2).txt` / `logs (3).txt` are runtime VM dispatch traces (JSON per switch case) recorded to reconstruct the VM; `元宝.js` / `yuanbao.js` are the analyst's reconstructed reference implementations of the encoder/decoder chain.

## Sections (L2)

### day23-jsvmp-concept
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day23：逆向高阶案例1/JSVMP 虚拟机保护技术教程.md]]`
- Summary: Defines true VMP: the *algorithm logic* (the instruction set) is encrypted into a fixed opaque string, while operands are input at runtime; decode then run on a switch-based virtual machine. Distinguishes the wrong approach (encoding the whole computation `10+20-5` into a string) from the right one (encoding only the operators `+ -`, passing 10/20/5 as arguments).
- Key claims: encrypted instruction string + external data → decode → switch VM → result; instruction set fixed/encrypted, data variable; IDA sees only the cipher string, not the algorithm; encoding `byte + 0x20` maps bytecode into printable ASCII and back to a C string; VM struct = code pointer + args + pc + stack + sp.
- Learner-relevant: the mental model that separates *protected logic* from *runtime data* is the anchor for every later JSVMP case; reusable at any layer (native or JS).

### day23-jsvmp-c-walkthrough
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day23：逆向高阶案例1/JSVMP 虚拟机保护技术教程.md]]`
- Summary: Complete C implementation of an `a + b - c` VM: opcode table `0x01 LOAD_ARG / 0x02 ADD / 0x03 SUB / 0x04 RETURN`, a `decode()` that subtracts `0x20`, `vm_init`/`vm_execute`, plus a decoder/encoder demo and per-step `vm->code` memory/stack walkthrough. Shows what an IDA analyst actually sees and the 6-step crack path (find string → locate decoder → understand algorithm → decode manually → analyze opcode semantics → restore logic).
- Key claims: `opcode = vm->code[vm->pc++]` with operands read as subsequent bytes; stack-based evaluation (push args, pop on ADD/SUB); `vm->code` is a decoded `unsigned char*` built at runtime by `malloc`; IDA shows the opaque string in `.rodata`, e.g. `"! !!\"!\"#$"`, and a flattened switch; advanced hardening = multiple instruction sets, segmented/concatenated instruction sets, function-pointer dispatch instead of switch, anti-debug with wrong decode key, network-fetched instructions.
- Learner-relevant: practice traces (change `a+b-c` to `a*b+c`, add `OP_MUL`/`OP_CMP`/`OP_JMP`) build the exact skills needed on the JS case; the "decode by hand, then emulate the stack" loop is the reusable core technique.

### day23-jsvmp-string-encoder
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day23：逆向高阶案例1/JSVMP 虚拟机保护技术教程2.md]]`
- Summary: Second tutorial framing JSVMP as (1) custom instruction set, (2) encode logic to bytecode, (3) interpret via switch-case, (4) obscure. Pipeline: source → encoder → encrypted string → decoder → bytecode array → switch interpreter → result. Demo outputs `"This is jsvmp"` from encoded strings with opcodes `PUSH/PRINT/ADD/SUB/PRINT_NUM/EXIT` and `+0x20` encoding.
- Key claims: storing bytecode as a string hides it from static view and enables Base64/custom-alphabet/XOR/network delivery; decode is the vulnerable point (find the loop, recover the transform); IDA analysis sees `.rodata` cipher strings, a `decode_bytecode` loop, and a switch table; three-layer protection (cipher string → decoder → bytecode → switch VM → output); why a stack machine helps (hides intermediate values, operand-free instructions, forces manual stack simulation); advanced obfuscation = multi-encoding, dynamic/remote decoding, randomized opcodes (ADD need not be `0x03`), VM-in-VM nesting, junk/NOP instructions, wrong-decode anti-debug.
- Learner-relevant: manual encode/decode and "add MUL/DUP" exercises; the concrete switch-case shape here is exactly what appears in the Yuanbao trace logs (Day24–25).

### day24-yuanbao-analysis-process
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day24：逆向高阶案例2/资料/分析过程.txt]]`
- Summary: Live reverse notes for the Yuanbao web SDK (`yb_v2_vendor_qimei.<hash>.js`). Shows the entry parameter bundle, the three-byte grouping (`charCodeAt` → e.g. `[227,110,124]`), a custom base64 alphabet `CDABEFIJHGKLOPMNQRSTWXUVYZabecdfighlmjpqknouyzvrstwx0312546978+/`, and step-by-step decoding of the VM dispatch cases.
- Key claims: input params `h38=19c5...&timestamp=...&platform=web`; custom base64 table reorders standard base64 (digits/letters shuffled); decode works 3 bytes → 4 chars via shift/mask (`>>2`, `&3<<4 | >>4`, `&15<<2 | >>6`, `&63`) then `charAt` on the custom table; VM opcodes observed as `case 19` (build/read the 256-entry substitution array), `case 86` (custom-table `charAt`/`fromCharCode`), plus modular arithmetic (`+` then `% 256`) and XOR combination of array indices (`141 ^ array[12]`, index from `147`); salt `0400b315` decoded via `String.fromCharCode` after hex split; string is Base64-encoded with a **76-char wrapped** variant.
- Learner-relevant: this is the concrete, re-runnable trace of how to move from a minified JS VM to a working decoder; the array-permutation + modular-index + XOR pattern is the reusable deobfuscation tactic.

### day24-tools-reference
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day24：逆向高阶案例2/资料/010ediotor.txt]]`
- Summary: Environment/tooling note pointing to the 010 Editor hex-editor thread (52pojie) for Windows and macwk for macOS; no algorithmic content.
- Key claims: hex editor is the preferred tool for inspecting the raw encoded strings/bytecode; tool acquisition only.
- Learner-relevant: optional setup anchor; skip on first pass.

### day24-vm-dispatch-traces
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day24：逆向高阶案例2/资料/log2.txt]]`
- Summary: ~64.4k-line JSON-lines runtime trace of the Yuanbao JSVMP interpreter, logged one record per executed switch case. Each line is `{"type":"case N","data":<stack/args>,"index":<sp>,"res":<result>}`; dominant cases are `case 80` (60x, base64 alphabet/table work), `case 30` (45x, `apply`/call + param bundle `h38/timestamp/platform`), and `case 42` (27x). Early records dump the entire VM interpreter function source and the `h38` parameter bundle.
- Key claims: trace-driven reversing treats the VM switch as a black box and records opcode, operands, and result to reconstruct semantics; `case 30` carries the `appKey=0WEB05U9OEC1ZNRY`, `version 0.8.10`, `h38`, `timestamp`, `platform=web` inputs; the final records show the finished `DCAxFeb05...7=` base64 output; the dumped interpreter is a flattened `switch(a[++F])` over a global opcode array `a`.
- Learner-relevant: demonstrates instrumentation-logging as the primary tool when static control-flow recovery is too costly; the record schema (opcode/data/result) is reusable across JSVMP targets.

### day25-yuanbao-reconstruction
- Locator: `[[sources/js-reverse2/20261005/JS逆向/day25/yuanbao.js]]`
- Summary: The analyst's reconstructed, runnable encoder for the Yuanbao signature: RC4 (KSA + PRGA) with key `81c61ddbcf19c168e0ae1edd35d9626a`, a plaintext JSON of device/telemetry fields, XOR against a 16-byte keystream prefix, salt `0400b315` prepended as raw bytes, then a **custom-table base64 with 76-char line wrapping** that reproduces the captured `right_str` output.
- Key claims: RC4 key scheduling and PRGA implemented over 256-byte S-box; `real_mingwen` is a numeric-keyed fingerprint object (`appKey`, `h38`, timestamp, `div.ql-editor`, `div#__next`, `qimei`-style fields); afterwards the ciphertext is XORed with `luanma_str` (16 bytes) and hex-encoded before RC4; salt bytes `04 00 b3 15` are prepended; base64 uses the shuffled alphabet `CDABEFIJHGKLOPMNQRSTWXUVYZabecdfighlmjpqknouyzvrstwx0312546978+/=`; the final target matches (`base64(finall_arr) === right_str`).
- Learner-relevant: end-to-end template — RC4 + salt + custom base64 is a common real-world signature stack; the `analysis`/`yuanbao.js` pair shows how to validate a reconstruction by comparing against a captured token.

### day25-analysis-json
- Locator: `[[sources/js-reverse2/20261005/JS逆向/day25/分析]]`
- Summary: Two decrypted plaintext payload examples (JSON) captured at different times, used as `real_mingwen` fixtures to test the reconstruction. Each lists the same numeric schema: `appKey=0WEB05U9OEC1ZNRY`, `h38`, `timestamp`, `platform`, version `0.8.10`, device DOM/editor fields (`div.ql-editor ql-blank`, `div#__next`), and counters.
- Key claims: same structure with differing volatile fields (`timestamp`, `h38`, `8`, `9`, `10`, `24` count, cursor `25`); confirms the algorithm is deterministic given inputs and that device/session fields vary per capture; `h38` looks like a per-session device/request id.
- Learner-relevant: gives concrete expected plaintext for regression-testing any re-implementation; shows which fields are stable (appKey/version/DOM selectors) vs volatile.

### day25-vm-dispatch-traces
- Locator: `[[sources/js-reverse2/20261005/JS逆向/day25/logs (2).txt]]`
- Summary: Two further ~64k-line trace files (`logs (2).txt` and `logs (3).txt`) of the same Yuanbao VM, identical record schema to `log2.txt` and the same case distribution (`case 80` 60x, `case 30` 45x, `case 42` 27x), captured at a later timestamp (mode `1766992847974`).
- Key claims: repeated captures validate that the VM behaviour is stable and the decode is deterministic; same `case 30` parameter record and flat `switch(a[++F])` interpreter; the differing timestamps/h38 show per-session input variation while the VM itself is fixed.
- Learner-relevant: reinforces building a trace-diff toolkit — capture the same function twice and diff the volatile inputs to isolate the algorithm from the data.

### day24-yuanbao-base64-helper
- Locator: `[[sources/js-reverse2/20261005/JS逆向/Day24：逆向高阶案例2/资料/元宝.js]]`
- Summary: Minimal reference helper: a `customTable` base64 encoder over `CDABEFIJHGKLOPMNQRSTWXUVYZabecdfighlmjpqknouyzvrstwx0312546978+/`, a `stringToBytes` using `charCodeAt & 0xFF`, and a hardcoded mangled `str` whose base64 is logged; also re-derives the `0400b315` salt bytes via `parseInt(...,16)` + `String.fromCharCode`.
- Key claims: the custom alphabet is the key to matching the target token; `charCodeAt & 0xFF` safely handles high-bit bytes; salt `0400b315` → chars `\u0004\u0000\u00b3\u0015`; this is the smallest self-contained reproduction of the base64 stage.
- Learner-relevant: template for isolating and testing *just* the custom-base64 transform before adding the RC4/XOR layers.
