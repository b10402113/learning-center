---
source: sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/6-Module A6 - Permission Modes/6-Module_A6_-_Permission_Modes.en.vtt
source_type: text
source_lines: 727
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Five modes — the toggle near the chat window offers Ask before edits, Edit automatically, Plan mode, Auto mode, and Bypass permissions; top modes give more control but less speed, bottom modes give more speed but less control.
- Enabling hidden modes — fresh installs show only three modes; Auto mode and Bypass permissions (a.k.a. "dangerously skip permissions") must be enabled in Claude Code settings (gear icon → Settings → search "Claude code").
- Ask before edits vs Edit automatically — Ask before edits approves every edit; Edit automatically edits the selection or whole file immediately, though the demo shows a `bash` call (opening `demo.md` in Notepad) still requiring approval, with options to allow once, for the session, or for the whole project.
- Plan mode — Claude presents a plan in a side panel before acting, with choices to auto-accept, edit manually, or keep planning; the author finds it unnecessary because you can ask for a plan in natural language inside Auto mode and get it inline in chat.
- Auto mode rationale — Auto mode lets Claude pick the best permission behavior per task and only interrupts for potentially destructive actions; the author has not seen destructive commands run without permission in Auto or Bypass.
- Bypass permissions — the pre-Auto default for speed; it still asks before destructive commands, but requires workspace-level setup to prohibit dangerous commands, so the author now recommends Auto mode as the speed/control balance.

# L2 detail

- `#L1-L60` — The five permission modes, the control-versus-speed trade-off, and the recommendation to use Auto mode for most people.
- `#L61-L170` — Enabling Auto mode and Bypass permissions ("dangerously skip permissions") via Settings → search "Claude code", after which all five modes are available.
- `#L171-L250` — Ask before edits and Edit automatically explained with a `demo.md` date-insertion task; the Notepad `bash` command requires approval with allow-once / session / project options.
- `#L251-L340` — Why many people operate this way now that Auto mode judges destructive intent, the author's experience that destructive commands are not run without permission, and the move into Plan mode.
- `#L341-L450` — Plan mode demo on a longer article: plan side panel, auto-accept vs manual edits vs continue planning, and why plan mode is not popular.
- `#L451-L560` — Plan mode is redundant because natural language ("give me a plan") produces an inline plan in Auto mode that is cleaner and easier to give feedback on.
- `#L561-L650` — Bypass permissions as the prior default for speed; models are smart enough to still request permission for destructive commands, but bypass requires setting up prohibited commands per workspace.
- `#L651-L727` — Auto mode demo asking to delete the whole workspace: Claude pauses, calls it destructive and irreversible, and asks for confirmation; closing recommendation to use Auto mode every time.
