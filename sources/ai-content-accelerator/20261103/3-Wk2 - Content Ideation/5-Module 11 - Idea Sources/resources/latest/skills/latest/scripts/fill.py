#!/usr/bin/env python3
"""Write a results page from a results JSON, then open it in the browser.

    python scripts/fill.py <results.json> [out.html] [--no-open]

The page is assets/results.html with three things put inside it: the run's data, the bundled
fonts (so it works offline) and the size of the taste file. It opens from any folder.
Out defaults to the JSON's own path with .html instead of .json.

Opening: on by default. --no-open skips it for one run; the environment variable
RESULTS_NO_OPEN=1 skips it everywhere. Exits 1 on a broken shape and writes nothing.
Needs only the Python standard library (3.8 or newer).
"""
import base64
import json
import os
import re
import sys
import webbrowser
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
TEMPLATE = SKILL / "assets" / "results.html"
FONTS = SKILL / "assets" / "fonts"
TASTE = SKILL / "taste.md"

LATIN = ("U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, "
         "U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD")
LATIN_EXT = ("U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, "
             "U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF")
FONT_FACES = [  # family, file, weight, characters it covers
    ("Outfit", "outfit-latin.woff2", "400 600", LATIN),
    ("Outfit", "outfit-latin-ext.woff2", "400 600", LATIN_EXT),
    ("Doto", "doto-latin.woff2", "900", LATIN),
]
EM_DASH = chr(0x2014)


def fail(msg):
    print(msg)
    sys.exit(1)


def check(data):
    """Hard problems stop the write; soft ones are printed and the page is still written."""
    errors, warnings = [], []
    if data.get("kind") not in ("latest", "outliers"):
        errors.append('"kind" must be "latest" or "outliers"')
    items = data.get("items")
    if not isinstance(items, list):
        errors.append('"items" must be a list')
        items = []
    if not (data.get("run") or {}).get("topic"):
        warnings.append("run.topic is empty, so the header has no topic")
    for i, it in enumerate(items, 1):
        title = (it or {}).get("title")
        if not isinstance(title, str) or not title.strip():
            errors.append(f"item {i} has no title")
            continue
        if not re.match(r"^https?://", str(it.get("url") or ""), re.I):
            errors.append(f'item {i} ("{title[:40]}") needs a real http(s) link')
        if data.get("kind") == "latest":
            if len(title) > 100:
                warnings.append(f"item {i} title is over 100 characters")
            for key, cap in (("angle", 280), ("why", 160)):
                if not it.get(key):
                    warnings.append(f"item {i} has no {key}")
                elif len(it[key]) > cap:
                    warnings.append(f"item {i} {key} is over {cap} characters")
        else:
            for key in ("multiplier", "views", "normal"):
                try:
                    float(it.get(key))
                except (TypeError, ValueError):
                    errors.append(f'item {i} needs a number in "{key}"')
    if EM_DASH in json.dumps(data, ensure_ascii=False):
        warnings.append('the data holds an em dash; swap it for " - " or a comma')
    return errors, warnings


def taste_picks():
    """How many picks the taste file holds: one line each under its '## Picks' heading."""
    if not TASTE.is_file():
        return 0
    text = TASTE.read_text(encoding="utf-8")
    part = text.split("## Picks", 1)
    return sum(1 for line in part[1].splitlines() if line.startswith("- ")) if len(part) == 2 else 0


def font_css():
    """The bundled fonts as inline @font-face rules, or None when a file is missing (the page then uses Google Fonts)."""
    rules = []
    for family, name, weight, rng in FONT_FACES:
        path = FONTS / name
        if not path.is_file():
            return None
        b64 = base64.b64encode(path.read_bytes()).decode("ascii")
        rules.append(f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};font-display:swap;"
                     f"src:url(data:font/woff2;base64,{b64}) format('woff2');unicode-range:{rng};}}")
    return "<style>" + "".join(rules) + "</style>"


def open_page(path):
    if os.environ.get("RESULTS_NO_OPEN") == "1":
        return False
    uri = path.resolve().as_uri()
    if os.environ.get("RESULTS_OPEN_DRYRUN") == "1":
        print("Would open: " + uri)
        return True
    return webbrowser.open(uri)


def main(argv):
    no_open = "--no-open" in argv
    args = [a for a in argv if a != "--no-open"]
    if not args:
        fail("Usage: python scripts/fill.py <results.json> [out.html] [--no-open]")
    src = Path(args[0])
    try:
        data = json.loads(src.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        fail(f"Could not read {src}: {exc}")
    errors, warnings = check(data)
    if errors:
        fail("Not written. Fix these first:\n- " + "\n- ".join(errors))

    picks = taste_picks()
    run = data.setdefault("run", {})
    if picks and "taste" not in run:
        run["taste"] = {"picks": picks, "file": str(TASTE)}

    try:
        html = TEMPLATE.read_text(encoding="utf-8")
    except OSError as exc:
        fail(f"Could not read the page template {TEMPLATE}: {exc}")
    block = re.compile(r'(<script id="results" type="application/json">)[\s\S]*?(</script>)')
    if not block.search(html):
        fail(f'The template has no <script id="results" type="application/json"> block: {TEMPLATE}')
    # "<" is escaped so no title can close the script tag early; the two separators break some older parsers.
    payload = (json.dumps(data, ensure_ascii=False).replace("<", "\\u003c")
               .replace(chr(0x2028), "\\u2028").replace(chr(0x2029), "\\u2029"))
    html = block.sub(lambda m: m.group(1) + payload + m.group(2), html, count=1)
    title = ("Outliers" if data["kind"] == "outliers" else "Latest") + ": " + str(run.get("topic") or "results")
    title = title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    html = re.sub(r"<title>[\s\S]*?</title>", lambda m: f"<title>{title}</title>", html, count=1)
    fonts = font_css()
    if fonts:
        html = re.sub(r"<!--fonts:start-->[\s\S]*?<!--fonts:end-->", lambda m: fonts, html, count=1)
    else:
        warnings.append(f"font files missing in {FONTS}; the page falls back to Google Fonts (needs internet)")

    out = Path(args[1]) if len(args) > 1 else src.with_suffix(".html")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8", newline="\n")
    for w in warnings:
        print("warning: " + w)
    print(f"Wrote {out.resolve()} ({data['kind']}, {len(data.get('items') or [])} items)")
    if not no_open and open_page(out):
        print("Opened it in your browser.")


if __name__ == "__main__":
    main(sys.argv[1:])
