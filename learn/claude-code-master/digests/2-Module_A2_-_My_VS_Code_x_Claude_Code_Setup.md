---
source: sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/2-Module A2 - My VS Code x Claude Code Setup/2-Module_A2_-_My_VS_Code_x_Claude_Code_Setup.en.vtt
source_type: text
source_lines: 529
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Install path — use VS Code (free, open source) as the IDE, then install the Claude Code extension from Anthropic in the Extensions tab; if the sidebar icon is missing, right-click the sidebar and toggle Claude Code back on.
- Workspace choice — open a folder in the Explorer before chatting; for a first run choose an empty folder (e.g. "my workspace") that will grow into your operating system / second brain holding business documents, outputs, tools, and connections.
- `/init` — starts Claude Code's setup sequence: it scans the current workspace, reports verbosity (durations, live status, `bash` and `glob` tool calls), and asks questions about your context and business to generate starter files.
- Generated files — a `claude.md`, a README, a `.gitignore`, and standard folders; all are easy to edit later because Claude Code rewrites files quickly.
- `claude.md` semantics — Claude Code reads this file at the start of every new session and pre-injects its whole text into the session, which is why a fact written there (name "Jay", lives in Sydney) is answered correctly by an otherwise context-free chatbot.
- VS Code workflow — right-click the Explorer and "Reveal in File Explorer" to see the real files, and drag/drop editor tabs to lay out multiple sessions concurrently when running several agents.

# L2 detail

- `#L1-L110` — Quick-start framing, why the author prefers an IDE, VS Code being free/open source, installing the Claude Code extension from Anthropic, and toggling the sidebar icon via right-click.
- `#L111-L230` — Opening an empty folder as the workspace, what the Explorer shows, and how the folder will accumulate personal context, tools, and Claude Code output over the course.
- `#L231-L340` — Running `/init`, its startup scan of the workspace, the verbose agent UI (durations, status updates, `bash` and `glob` terminal commands), and answering its setup questions.
- `#L341-L430` — Letting `/init` create default files and folders (`claude.md`, README, `.gitignore`), why regenerating/editing them later is cheap, and "Reveal in File Explorer" to confirm they are real files.
- `#L431-L529` — The `claude.md` demo: adding "my name is Jay, I live in Sydney", saving, asking Claude Code "what's my name and where do I live?", and the explanation that every session pre-injects `claude.md`; closes with dragging multiple VS Code tabs to run agents concurrently.
