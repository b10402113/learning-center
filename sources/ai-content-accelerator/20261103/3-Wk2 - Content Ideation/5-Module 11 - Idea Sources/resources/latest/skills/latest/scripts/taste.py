#!/usr/bin/env python3
"""Save the picks a user pasted back from a results page into this skill's taste file.

    python scripts/taste.py add -      # the pasted idea cart on standard input (or a file path instead of -)
    python scripts/taste.py like -     # the rewritten "What you like" list on standard input, one line each
    python scripts/taste.py show       # print the taste file
    add [--skill /latest]              # which skill's picks to keep; picks for another skill are left for it

The cart is the text the page's "Copy for my agent" button made (it starts with "Idea cart:").
The script does every write, because agents often guard their own skills folder: it keeps the
log and the counts, and "like" swaps in the list the agent wrote (topics, formats, sources and
angles, 8 lines at most). Needs only the Python standard library.
"""
import datetime
import re
import sys
from collections import Counter
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
TASTE = SKILL / "taste.md"

HEAD = """# Taste

What you liked, saved from the idea carts you pasted back. Your agent reads this before every run of this skill: it ranks ideas that fit higher and shapes the angles around them. Edit it freely.

## What you like
<!-- The agent rewrites this list after each paste: topics, formats, sources and angles, in plain words, 8 lines at most. -->
- Nothing saved yet.
"""
FIELDS = ("From", "Source", "Numbers", "Link", "Angle", "Why it helps", "Your version", "Fit my taste file", "My note")


def parse_cart(text):
    """Turn the pasted cart text into a list of picks (dicts)."""
    picks, cur = [], None
    for raw in text.splitlines():
        line = raw.rstrip()
        m = re.match(r"^(\d+)\.\s+(.+)$", line)
        if m and not raw.startswith(" "):
            cur = {"title": m.group(2).strip()}
            picks.append(cur)
            continue
        if cur is None:
            continue
        stripped = line.strip()
        for f in FIELDS:
            if stripped.startswith(f + ":"):
                cur[f] = stripped[len(f) + 1:].strip()
                break
    return [p for p in picks if p.get("Link")]


def clean(s):
    return str(s or "").replace("|", "/").strip()


def read_taste():
    """Return (the 'What you like' part, the saved pick lines)."""
    if not TASTE.is_file():
        return HEAD, []
    text = TASTE.read_text(encoding="utf-8")
    like = text.split("## Counts", 1)[0].split("## Picks", 1)[0].rstrip() + "\n"
    lines = []
    if "## Picks" in text:
        lines = [l for l in text.split("## Picks", 1)[1].splitlines() if l.startswith("- ")]
    return like, lines


def line_fields(line):
    """A saved pick line: date | where | who | title | link | note."""
    parts = [p.strip() for p in line[2:].split(" | ")]
    return parts + [""] * (6 - len(parts))


def write_taste(like, lines):
    rows = [line_fields(l) for l in lines]
    wheres = Counter(r[1] for r in rows if r[1])
    whos = Counter(r[2] for r in rows if r[2])
    last = max((r[0] for r in rows), default="")
    top = lambda c: ", ".join(f"{k} {v}" for k, v in c.most_common(12)) or "none yet"
    counts = (f"## Counts\n- Picks saved: {len(rows)}{', last on ' + last if last else ''}\n"
              f"- Platforms and formats: {top(wheres)}\n- Sources: {top(whos)}\n")
    body = like.rstrip() + "\n\n" + counts + "\n## Picks\n" + "\n".join(lines) + ("\n" if lines else "")
    TASTE.write_text(body, encoding="utf-8", newline="\n")


def read_input(src):
    """Text from standard input when src is '-', else from the file."""
    if src == "-":
        sys.stdin.reconfigure(encoding="utf-8")
        return sys.stdin.read()
    try:
        return Path(src).read_text(encoding="utf-8")
    except OSError as exc:
        print(f"Could not read {src}: {exc}")
        sys.exit(1)


def set_like(src):
    """Swap the 'What you like' list for the lines given, 8 at most."""
    items = [l.strip().lstrip("-*").strip() for l in read_input(src).splitlines()]
    items = [l for l in items if l][:8]
    if not items:
        print("No lines given. Send the list one line per item.")
        sys.exit(1)
    like, lines = read_taste()
    intro = like.split("## What you like", 1)[0] if "## What you like" in like else HEAD.split("## What you like", 1)[0]
    comment = "<!-- The agent rewrites this list after each paste: topics, formats, sources and angles, in plain words, 8 lines at most. -->"
    new_like = intro.rstrip() + "\n\n## What you like\n" + comment + "\n" + "\n".join("- " + i for i in items) + "\n"
    write_taste(new_like, lines)
    print(f"Saved the 'What you like' list ({len(items)} lines) to {TASTE}.")


def add(cart_file, skill):
    picks = parse_cart(read_input(cart_file))
    if not picks:
        print("No picks found. Paste the whole text from Copy for my agent (it starts with 'Idea cart:').")
        sys.exit(1)
    mine = [p for p in picks if p.get("From", "").split(",")[0].strip().lower() == skill.lower()]
    others = len(picks) - len(mine)
    like, lines = read_taste()
    saved = {line_fields(l)[4] for l in lines}
    today = datetime.date.today().isoformat()
    new = []
    for p in mine:
        if p["Link"] in saved:
            continue
        src = [s.strip() for s in p.get("Source", "").split("|")]
        where, who = (src + ["", ""])[:2]
        note = clean(p.get("My note"))
        lines.append(f"- {today} | {clean(where)} | {clean(who)} | {clean(p['title'])} | {p['Link']}" + (f" | note: {note}" if note else ""))
        saved.add(p["Link"])
        new.append(p)
    write_taste(like, lines)
    print(f"Saved {len(new)} new {skill} pick(s) to {TASTE} ({len(mine) - len(new)} already saved"
          f"{f', {others} for another skill left for it' if others else ''}). {len(lines)} picks in total.")
    if new:
        print("\nNew picks, for rewriting the 'What you like' list:")
        for p in new:
            print(f"- {p['title']}\n  Source: {p.get('Source', '')}\n  Angle: {p.get('Angle', '')}")
            for f in ("Why it helps", "Your version", "My note"):
                if p.get(f):
                    print(f"  {f}: {p[f]}")
    current = [l for l in like.split("## What you like", 1)[-1].splitlines() if l.startswith("- ")]
    print("\nThe 'What you like' list now:\n" + "\n".join(current))
    print("\nNext: rewrite that list from the picks (topics, formats, sources and angles they share, merged with what "
          "is there, 8 lines at most) and send it to: python scripts/taste.py like -")


def main(argv):
    skill = "/latest"
    if "--skill" in argv:
        i = argv.index("--skill")
        skill = argv[i + 1] if i + 1 < len(argv) else skill
        argv = argv[:i] + argv[i + 2:]
    if argv[:1] == ["add"] and len(argv) == 2:
        add(argv[1], skill)
    elif argv[:1] == ["like"] and len(argv) == 2:
        set_like(argv[1])
    elif argv[:1] == ["show"]:
        print(TASTE.read_text(encoding="utf-8") if TASTE.is_file() else f"No taste file yet. It starts at {TASTE} on the first paste.")
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main(sys.argv[1:])
