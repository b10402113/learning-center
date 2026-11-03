# Align — clarify intent before working

A tiny skill that adds friction-on-purpose. When you type `/align`, your agent stops and asks a few short, numbered questions to lock in direction *before* it spends effort. Catch a wrong assumption in 30 seconds instead of after a 10-minute build.

## What's inside

```
align/
└── .claude/
    └── skills/
        └── align/
            └── SKILL.md   # the skill
```

## Install

1. Unzip this folder.
2. Copy the `.claude/skills/align/` folder into your own project's `.claude/skills/` directory.
   (If you don't have one yet, create `.claude/skills/` at the root of your project and drop `align/` inside.)
3. Start your agent in that project. The skill loads automatically.

## Use it

- `/align` on its own - aligns on your most recent request in the conversation
- `/align [task]` - aligns on that specific task before starting

The agent asks up to 5 numbered questions (with A/B/C options where that's faster), waits for one round of answers, restates the locked-in direction in a line or two, then gets to work. No endless back-and-forth - one round, then go.

## Why it works

- **Capped at 5 questions** - it picks the load-bearing ones, the places a wrong guess costs the most.
- **Always at least one question** - even on "obvious" tasks, one sanity check.
- **One round only** - it does not turn into a persistent interrogation mode.
- **Priority order** - scope first, then format, audience, constraints, nice-to-haves.

## License

**CC BY 4.0.** Free to use, adapt, and build on - for any purpose, including commercial - as long as you give appropriate credit. See the `LICENSE` file.
