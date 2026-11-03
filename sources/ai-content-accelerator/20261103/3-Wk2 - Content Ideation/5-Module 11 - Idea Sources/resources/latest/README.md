# Latest

Type `/latest` and your agent checks the last 7 days of what people said about your niche: social media, Reddit, YouTube, Hacker News, GitHub and the web, plus the go-to sources you add. You get up to 10 ranked content ideas, opened on a results page in your browser. Each one has a working title, an angle (what you would say and show), why it matters now, the platform and a real source link you can open.

## What's inside

```
skills/
├── latest/        # the /latest skill: the window, your niche, your sources, the idea rules
│   ├── scripts/   # fill.py writes and opens the results page, taste.py saves what you liked
│   ├── assets/    # the results page and its fonts (Outfit and Doto, SIL Open Font License)
│   └── references/results-page.md   # the page's data shape, for your agent
└── last30days/    # the free research engine /latest runs (by Matt Van Horn, MIT license, unchanged copy of v3.27.1)
```

## Set it up

New to skills? Hand this whole folder to your agent and let it do these steps with you. It takes about 15 minutes, most of it the first run.

**For the agent doing the setup:** the user may be new to this. Explain each step in one plain sentence, run the commands for them, and check each step worked before the next one.

1. **Check Python.** The research engine needs Python 3.12 or newer. Run `python --version` (or `python3 --version`). If it is older or missing, install it: Windows `winget install Python.Python.3.12`, Mac `brew install python@3.12`, Linux `sudo apt install python3.12`. The results page needs nothing more.
2. **Copy both skills.** Copy `skills/latest/` and `skills/last30days/` into your agent's skills folder, side by side. `/latest` finds `last30days` because they sit next to each other. If `last30days` is already installed, keep whichever version is newer.
3. **Turn on YouTube (optional, free).** On Windows run `pip install yt-dlp`. On Mac the first run installs it for you.
4. **Make it yours.** Ask the user four things, then write the answers into the block marked YOUR DEFAULTS in `skills/latest/SKILL.md`:
   - their niche (the default topic)
   - who their audience is
   - what they make (short videos, posts, newsletters, podcasts)
   - their go-to sources, the places news in their niche lands first: Reddit communities, X accounts, and websites such as official docs, blogs, forums or a trending list
5. **First run.** Type `/latest`. The first time, the research engine runs a one-time setup that can take several minutes and asks two questions: whether it may use your X login, and whether you want a free ScrapeCreators key for TikTok and Instagram. Saying no to both is fine.

## Use it

- `/latest` - your default niche, last 7 days
- `/latest home gym equipment` - any other niche, just name it
- `/latest crochet patterns --days 14` - a longer window
- Plain words work too: "latest on crochet patterns, last 28 days"

Your agent gives you a short list in chat and opens the full results page in your browser. The page and its data are saved in the `output` folder inside the skill, one pair per run, and work offline.

On the page:

- **Find:** search (press `/`), filter by platform, source and your taste, sort by rank, newest or engagement.
- **Read:** open a card for the angle, why it helps, every public count and the real link. Expand all opens every card.
- **Pick:** press Add on the ideas you like. In the cart, drag them into order and write a note on each, then press **Copy for my agent** and paste it back. Download .md saves the list as a file.

Don't want the page to open by itself? Set `Open the results page when done` to no in YOUR DEFAULTS. The page is still written.

To change the window for good, ask your agent "set my /latest window to 14 days", or change `Default window` in YOUR DEFAULTS. A fast niche (like AI) suits 7 days. A slower one may need 14 or 28 to find enough.

## Teach it your taste

When you paste your cart back, your agent saves what you liked (topics, formats, sources, angles) to `taste.md` in the skill folder. Every later run reads it first: ideas that fit rank higher, get a "Your taste" tag, and their angles lean toward the formats you pick. Open `taste.md` any time to read or edit it.

## Tips

- **Too few results?** Go to a bigger niche or a broader topic. Or cast a wider net: run /latest over 14 or 28 days, or add more peer accounts to /outliers.
- **Be creative with topics,** not just your industry or job. Go from broad to narrow: AI, then local AI. Claude in general, then Claude for 3D work in Blender.
- **Teach it your taste.** Add the ideas you like to the cart, press Copy for my agent and paste it back to your agent. It saves what you liked to the skill's taste file and uses it to rank and shape your next run.

## Add your own sources

Every niche has a well of knowledge: the places news lands first, before anyone makes a video about it. Put yours in YOUR DEFAULTS and `/latest` checks them on every run that fits the topic:

- **Reddit communities** - names without `r/`, for example `homegym, GarageGym`
- **X accounts** - handles without `@` (needs X access, see below)
- **TikTok or Instagram creators** - handles (needs a ScrapeCreators key)
- **Websites** - up to 5 pages that list new things: a docs changelog, a blog, a forum, a trending list. `/latest` opens each one and keeps what is new in the window.

The examples in the block are for an AI niche. Swap them for yours.

## What it needs

| | What | Cost |
|---|---|---|
| Required | An agent that can run commands and search the web | - |
| Required | Python 3.12 or newer | Free |
| Works with no keys | Reddit, YouTube (with yt-dlp), Hacker News, GitHub, Polymarket and the web | Free |
| Optional | X: your x.com login read from your browser (Firefox on Windows and Linux; Chrome, Firefox or Safari on Mac), or cookies pasted by hand | Free |
| Optional | TikTok and Instagram: a ScrapeCreators key | 10,000 free calls, then pay as you go |

## Good to know

- **A run takes about 2 to 3 minutes.** The first run takes longer while the engine sets up.
- **Every link is real.** `/latest` only uses links that came back from the research, and it checks a thing's release date before calling it news.
- **Reddit links can refuse automated checks.** They open fine in your browser.
- **Non-tech niches:** GitHub and Hacker News often return near misses. `/latest` drops off-niche items, and your own sources matter more there.
- **Your cart lives in your browser,** shared by every results page you open, so picks from /latest and /outliers land in one list.
- **Updating the engine:** the newest `last30days` is at https://github.com/mvanhorn/last30days-skill (its `skills/last30days/` folder). `/latest` never edits it, so you can replace it any time.

## License

`/latest` is CC BY 4.0: use it, change it, share it, keep the credit. `last30days` is a separate project by Matt Van Horn under the MIT license; its license file is inside `skills/last30days/`. The bundled Outfit and Doto fonts are under the SIL Open Font License; their license files sit beside them in `skills/latest/assets/fonts/`.
