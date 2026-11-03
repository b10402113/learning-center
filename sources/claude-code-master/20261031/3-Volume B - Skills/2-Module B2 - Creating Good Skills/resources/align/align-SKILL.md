---
name: align
description: Pre-work alignment check. Before starting any task, ask the user short numbered clarifying questions so direction is clear before effort is spent. Triggers on "/align", "align", "/align [task]", "align [task]".
---

# Align: Clarify Intent Before Working

## What This Does

When the user invokes `align`, pause whatever the pending or current request is and ask short numbered questions to lock in direction. Goal: catch misalignment before any real work happens, not after.

## When To Use

- The user types `/align` on its own -> align on the most recent pending request in the conversation
- The user types `/align [task]` or `align [task]` -> align on that task before starting
- Bare-text "align" at the start of a turn -> same as above

Do NOT invoke this skill silently on your own. It only fires when the user asks for it.

## Process

### Step 1: Identify The Target

What request are we aligning on?

- If `/align [task]` - that task is the target
- If `/align` alone - the most recent unhandled request from the user in this conversation
- If unclear - ask "align on what?" as your single question and stop

### Step 2: Generate Numbered Questions

Rules:

- **Cap at 5 questions.** Pick the most load-bearing ones - the ones where a wrong assumption would waste the most effort.
- **At least 1 question always.** Even if the task seems clear, force one sanity-check question. The point of `/align` is friction-on-purpose.
- **If the user asks for more, ask more.** "Give me more" -> expand past 5.
- **Short, layman language.** No jargon. One sentence per question where possible.
- **Offer A/B/C inline when options would be faster than open-ended.** But keep options short - one line each, max.
- **Mix open and option-style.** Don't make every question A/B/C - some things genuinely need an open answer.
- **Prioritise:** scope > format > audience > constraints > nice-to-haves.

Format:

```
Aligning on [one-line restatement of the task].

1. [Question]?
2. [Question] - A) ... B) ... C) ...?
3. [Question]?
```

### Step 3: Wait For Answers

The user will reply with answers in one message. They may:

- Answer all numbered questions
- Skip some - for any number they don't address, **assume best judgment** and proceed
- Say "do whatever you recommend" - use best judgment for everything
- Add new direction beyond the questions - incorporate it

Do not ask follow-up rounds unless the user explicitly asks for more alignment. One round is the default.

### Step 4: Restate & Proceed

In 1-2 lines, restate the locked-in direction. Call out anything where the user's answer changed your default assumption - those are the highest-risk reversals if missed.

Format:

```
Got it - [tight restatement]. Changed from default: [thing], [thing]. Starting now.
```

Then start the work. No further confirmation needed.

## What NOT To Do

- Don't ask more than 5 questions on the first round (unless the user asks)
- Don't ask questions whose answers are already obvious from context or memory
- Don't pad with generic "any other thoughts?" questions - every question must be load-bearing
- Don't restate at length - 1-2 lines, then go
- Don't keep asking - single round, then work
- Don't invoke align on your own initiative for normal tasks; the user decides when alignment is worth the friction

## Scope

Single task only. Invoking `/align` aligns the current task and exits - it does not turn on a persistent "alignment mode" for the rest of the session. To align again, the user invokes again.

## Example

User: `/align write a launch email for our new feature`

Response:
```
Aligning on a launch email for the new feature.

1. Who is it going to - existing customers, trial users, or your full list?
2. Goal - A) drive upgrades B) book demos C) just inform?
3. Length - A) short 3-line note B) full email with sections C) subject line + teaser only?
4. Tone - same as your recent emails, or pushing harder on urgency this time?
5. Any specific result or number from the feature you want featured?
```

The user answers, you restate in 1-2 lines, then draft.
