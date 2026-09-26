---
source: JDK与Maven环境
source_type: pdf
source_lines: 9
status: absorbed
absorbed_at: 2026-09-26
created: 2026-09-26
updated: 2026-09-26
---

# Digest — JDK与Maven环境 (vibe-coding prompt playbook: Java toolchain)

## Overview (L1)

- `JDK与Maven环境.txt` — prompts to check that a Java toolchain is ready, download JDK/Maven, and have the agent configure environment variables for the learner's OS.

## Sections (L2)

### check-readiness

- Locator: `[[sources/vibe-coding-fengjianyingyue/20260926/JDK与Maven环境.txt#check-readiness]]`
- Summary: "请你检查本地的java开发环境是否就绪。只检查，不做其他操作。" with links to jdk.java.net/archive and maven download pages.
- Key claims: inspect-only again; the agent can reason about a machine's environment, not just its files.
- Learner-relevant: environment readiness as a pre-flight step before the enterprise Java stage.

### configure-env-vars

- Locator: `[[sources/vibe-coding-fengjianyingyue/20260926/JDK与Maven环境.txt#configure-env-vars]]`
- Summary: after the learner downloads JDK/Maven to placeholder paths, prompt the agent to configure `JAVA_HOME`/`MAVEN_HOME`/PATH for the OS.
- Key claims: the learner supplies the concrete path ("目录在xxxxx"); the agent handles OS-specific config.
- Learner-relevant: the human-supplies-specifics / agent-handles-boilerplate division of labor that recurs across the playbook.

## Sources

- [[sources/vibe-coding-fengjianyingyue/20260926/JDK与Maven环境.txt]]
