---
source: Quantitative Trading How to Build Your Own Algorithmic Trading Business
source_hash: 85466da2a2d214aec44932922682e05441571fb59ada56466871d8da1057eeef
source_lines: 9932
created: 2026-08-16
updated: 2026-08-16
---

## Overview (L1)
- Preface — The author argues a retail trader can compete with institutions, that it is more logical to become a profitable $100,000 trader before a $100 million trader, and that a personal track record is the surest path into institutional money management. He specifies the background needed (basic statistics and Excel, optionally MATLAB) and scopes the book as teaching how to *find* a strategy, not an encyclopedia of strategies.
- Chapter 1 "The Whats, Whos, and Whys of Quantitative Trading" — Defines quantitative/algorithmic trading, distinguishes it from technical analysis and extends it to fundamental and news inputs. Profiles who can become a quant trader and builds the business case: scalability via leverage, low time demand through automation, and no marketing.
- Chapter 2 "Fishing for Ideas" — Shows that finding ideas is easy (books, academic papers, forums, blogs); the hard part is developing a *taste* for what suits you and what is viable. Walks through personal-fit criteria (working hours, programming, capital, goal) and a battery of quick screening tests (benchmark/Sharpe, drawdown, transaction costs, survivorship bias, data-snooping bias, niche protection).

## Sections (L2)
### WHO IS THIS BOOK FOR?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#WHO IS THIS BOOK FOR?]]`
- Summary: Written for two audiences — aspiring independent ("retail") traders and finance/technical students who want institutional quant-trading careers. The author contends it is more logical to become a profitable $100,000 trader before a $100 million trader, citing Thorp and Simons as examples of managers who started with their own money.
- Key claims: A profitable personal track record is the surest way to get through the door of top banks/funds; independent trading forces focus on simple profitable strategies, order-entry nitty-gritty, and risk management (personal bankruptcy is a real possibility).
- Learner-relevant: Anchors the whole book's premise — the reader's own track record is a stepping stone, and risk management is not optional.

### WHAT KIND OF BACKGROUND DO YOU NEED?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#WHAT KIND OF BACKGROUND DO YOU NEED?]]`
- Summary: No math/computer whiz required; only basic statistics (averages, standard deviations, fitting a straight line) and basic Excel familiarity. Advanced stochastic calculus or neural networks are explicitly unnecessary.
- Key claims: MATLAB is the recommended backtesting/data-processing tool (with a tutorial in the appendix), but cheaper alternatives exist for retail traders; students often have free/cheap MATLAB access.
- Learner-relevant: Sets the real prerequisite bar low and names the one tool (MATLAB) the book uses for examples.

### WHAT WILL YOU FIND IN THIS BOOK?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#WHAT WILL YOU FIND IN THIS BOOK?]]`
- Summary: Not an encyclopedia; it teaches how to find and refine a profitable strategy, ensure it stays profitable in the future, scale up/wind down by real-life profitability, automate execution, and manage risk and psychology. Examples focus on statistical arbitrage in stocks (no options).
- Key claims: Chapter order maps to business setup steps — find strategy (Ch 2), backtest (Ch 3), set up infrastructure (Ch 4), build execution (Ch 5), money/risk management (Ch 6), advanced concepts (Ch 7), niche/growth reflections (Ch 8), plus a MATLAB appendix; readers get free premium-content access via a password in a later chapter.
- Learner-relevant: Provides the roadmap of the whole course and a free-resource hook (epchan.blogspot.com and epchan.com/subscriptions).

### What Is Quantitative Trading? (Ch 1 intro)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#CHAPTER 1]]`
- Summary: Quantitative/algorithmic trading is trading based strictly on buy/sell decisions of computer algorithms, designed from historical backtests. It includes but exceeds technical analysis, incorporating fundamental data (revenue, cash flow, debt-to-equity) and even parsed news events.
- Key claims: As long as you can convert information into bits and bytes a computer understands, it can be part of quantitative trading; subjective chartist techniques like "head and shoulders patterns" are not quantifiable and are excluded.
- Learner-relevant: Gives the book's working definition and the "anything quantifiable" criterion for what counts as a quant input.

### WHO CAN BECOME A QUANTITATIVE TRADER?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#WHO CAN BECOME A QUANTITATIVE TRADER?]]`
- Summary: Institutional quant traders are often physicists/mathematicians/engineers, but statistical arbitrage (stocks, futures, sometimes currencies) needs only high-school-level math, statistics, programming, or economics. The author's own advanced PhD/IBM background lost money until he switched to the simplest strategies, echoing Einstein: "Make everything as simple as possible."
- Key claims: Typical independent quant traders (a former hedge fund trader, a brokerage programmer, an ex-biochemist, an architect) mostly use Excel and prior finance experience plus a savings nest egg; the ideal trader balances fear and greed and does not need immediate profits.
- Learner-relevant: Counteracts the myth that advanced degrees are needed — simplicity and savings/risk-appetite matter more.

### THE BUSINESS CASE FOR QUANTITATIVE TRADING
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#THE BUSINESS CASE FOR QUANTITATIVE TRADING]]`
- Summary: Similar to any small business (start small, ~$50,000 initial investment) but differs in scalability, low time demand, and no marketing. It is not a get-rich-quick scheme; overleveraging for overnight riches is dangerous.
- Key claims: Scaling up often just means changing the leverage number in your program — brokerages lend without negotiation; a proprietary firm may let you trade a $2 million portfolio intraday on $50,000 equity (×40 leverage), far beyond SEC Regulation T.
- Learner-relevant: Establishes leverage as the scaling mechanism and warns against using it for get-rich-quick ambitions.

### Scalability
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Scalability]]`
- Summary: Quantitative trading is very scalable "up to a point" because scaling means changing the leverage number, not negotiating with bankers or VCs. Profit growth is steady, not 200% a year like a dot-com.
- Key claims: Brokerages and proprietary firms provide the leverage; overleveraging in pursuit of overnight riches is dangerous (detailed in Chapter 6).
- Learner-relevant: Connects scalability directly to leverage, the same lever that creates the risk.

### Demand on Time
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Demand on Time]]`
- Summary: Quantitative trading is highly automated and takes little operational time. The author spends ~2 hours before market open (download/process data, read news, generate and launch orders, update P&L spreadsheet) and ~30 minutes near the close.
- Key claims: Manual override often makes performance worse; at a former hedge fund some colleagues came in only once a month. The real time cost is research/backtesting on new strategies, which can be done whenever you like.
- Learner-relevant: Quantifies realistic daily time commitment (~2.5 hours) and flags the psychology of resisting manual intervention.

### The Nonnecessity of Marketing
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#The Nonnecessity of Marketing]]`
- Summary: Unlike most small businesses, trading requires no marketing because counterparties base decisions on price alone. This lets you focus exclusively on the product (strategy + software), not on influencing others' perception of you.
- Key claims: The absence of marketing is "the biggest and most obvious difference" and may be the ultimate beauty of the business (assuming you are not managing other people's money).
- Learner-relevant: A concrete differentiator that justifies the independent-trading route.

### THE WAY FORWARD
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#THE WAY FORWARD]]`
- Summary: Lists the questions Chapters 2–6 answer (find strategy, recognize good vs bad, backtest, implement business+tech infrastructure, scale capital while managing losses). The author's own start took only three months to find/backtest a first strategy and start trading with $100,000.
- Key claims: Compared to his dot-com firm (3× more investment, 5× more people, 24× longer to fail at 100% loss), profitable quant trading "has been a breeze."
- Learner-relevant: Sets expectations for speed and de-risking versus a conventional startup.

### Where Can We Find Good Strategies?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Where Can We Find Good Strategies?]]`
- Summary: Finding ideas is not the hardest part — hundreds of public ideas exist (Table 2.1 lists academic sites, financial sites/blogs, trader forums, and magazines). Most ready-made strategies do not withstand careful backtesting, but can often be modified into profitability.
- Key claims: The first strategy he traded independently was a PEAD version from academic research (referenced in Chapter 7); a Wealth-Lab strategy with a claimed high Sharpe ratio only became a main profit center after simple modifications (shorter holding period, different entry/exit times). Running a blog rewards each revealed "secret" with multiple reader ideas.
- Learner-relevant: Reframes the challenge from "find an idea" to "refine a basic idea," and names concrete idea sources.

### HOW TO IDENTIFY A STRATEGY THAT SUITS YOU
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#HOW TO IDENTIFY A STRATEGY THAT SUITS YOU]]`
- Summary: Whether a strategy is viable often depends on you, not the strategy. Introduces the four personal-fit dimensions — working hours, programming skills, trading capital, and goal.
- Key claims: The difficulty is developing a "taste" for which strategies suit your circumstances and look viable before devoting time to backtest.
- Learner-relevant: Frames strategy selection as a self-matching problem first, not a raw-return problem.

### Your Working Hours
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Your Working Hours]]`
- Summary: Part-time traders should favor overnight-holding (not intraday) strategies unless fully automated. The author's personal path: daily ETF limit orders before open while employed, then once-at-open/once-at-close after going independent, later adding an auto-scanning program.
- Key claims: Trading remains "part-time" for the author by design, which is partly why he trades quantitatively in the first place.
- Learner-relevant: Shows how working hours map to holding period and automation level.

### Your Programming Skills
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Your Programming Skills]]`
- Summary: Programmers (Visual Basic, Java, C#, C++) can run high-frequency strategies and trade many securities; non-programmers should settle for once-a-day or few-position strategies. Hiring a software contractor is a fallback.
- Key claims: Programming skill directly gates strategy frequency and breadth.
- Learner-relevant: A simple capability gate connecting coding fluency to strategy scope.

### Your Trading Capital
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Your Trading Capital]]`
- Summary: Do not trade quantitatively with under $50,000; the high/low divide is $100,000. Low capital pushes toward maximum leverage — futures/currencies/options over stocks, intraday (Reg T leverage 4) over overnight (leverage 2), directional over dollar/market-neutral (which needs twice the capital).
- Key claims: Capital determines retail vs proprietary account, data quality (survivorship-bias-free data is much more expensive), real-time market data access, news and fundamental databases (Table 2.2). Platinum futures (NYMEX) carry a $8,100 margin but ~$100,000 nominal value and 6% daily moves are "not too rare" ($6,000 P&L swing); the E-mini S&P 500 (ES) has ~$67,500 nominal value and 6%+ moves only twice in 15 years, hence a $4,500 margin.
- Learner-relevant: Gives hard dollar thresholds and leverage ratios that determine the feasible strategy set; notes survivorship-biased Yahoo! Finance data can still work for intraday strategies.

### Your Goal
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Your Goal]]`
- Summary: Income-seeking traders need shorter holding periods (more regular profit realization, possibly via staggered subportfolios); long-term capital gain seekers can hold longer. The more regularly you want income, the shorter the holding period should be.
- Key claims: The buy-and-hold-is-best-for-long-term-growth belief is mathematically false; maximum long-term growth comes from the maximum-Sharpe-ratio strategy given sufficient leverage (barring tax and margin limits), so a high-Sharpe short-term strategy beats a lower-Sharpe long-term one even for growth goals.
- Learner-relevant: Corrects a common misconception and foreshadows the Sharpe-ratio/leverage connection in Chapter 6.

### A TASTE FOR PLAUSIBLE STRATEGIES AND THEIR PITFALLS
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#A TASTE FOR PLAUSIBLE STRATEGIES AND THEIR PITFALLS]]`
- Summary: Before backtesting a candidate strategy, run quick checks so you don't waste time or money. The following sections are the screening battery ("healthy skepticism").
- Key claims: A handful of quick judgments filters out unsuitable strategies before any in-depth backtest.
- Learner-relevant: The core takeaway — pre-backtest screening as a time/money saver.

### How Does It Compare with a Benchmark and How Consistent Are Its Returns?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#How Does It Compare with a Benchmark and How Consistent Are Its Returns?]]`
- Summary: Compare a long-only strategy to a market index; a dollar-neutral strategy's benchmark is the risk-free rate (3-month T-bill, ~4% at writing). Use information ratio for long-only and Sharpe ratio for dollar-neutral (a special case of information ratio).
- Key claims: Information Ratio = Average of Excess Returns / Standard Deviation of Excess Returns, where Excess Returns = Portfolio Returns − Benchmark Returns. Sharpe ratio generalizes across strategies since everyone agrees on the risk-free rate but not the benchmark index. Rule of thumb: Sharpe < 1 is unsuitable standalone; profitable almost every month → Sharpe > 2; profitable almost every day → Sharpe > 3. Higher Sharpe beats higher nominal return because it permits higher leverage (the leveraged return is what matters).
- Learner-relevant: Delivers the exact formulas and Sharpe thresholds plus the key insight that leveraged return, not nominal return, is what matters.

### How Deep and Long Is the Drawdown?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#How Deep and Long Is the Drawdown?]]`
- Summary: A drawdown at time t is current equity minus the global maximum of the equity curve on/before t. Maximum drawdown is the high-watermark minus the post-maximum global minimum; maximum drawdown duration is the longest recovery time.
- Key claims: Drawdowns are usually percentage-measured (denominator = equity at high watermark). The maximum drawdown and its duration typically do not overlap in the same period. Example (Figure 2.1): max drawdown ~$1.8×10⁴ (from ~$2.3×10⁴ to ~$0.5×10⁴) over ~20 months (Feb 2001–Oct 2002). Ask yourself: can you tolerate 20%/3 months or 10%/1 month?
- Learner-relevant: Defines the terms precisely with a worked example and turns tolerance into a personal compatibility test.

### How Will Transaction Costs Affect the Strategy?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#How Will Transaction Costs Affect the Strategy?]]`
- Summary: Costs include commissions, liquidity (bid-ask spread), opportunity cost of unexecuted limit orders, market impact of large orders, and slippage from order-to-execution delay. Estimate cost as half the average bid-ask spread plus commission.
- Key claims: S&P 500 stocks cost ~5 basis points per transaction (10 bp round-trip); ES (E-mini S&P 500) costs ~1 bp. A Bollinger-band mean-reverting strategy on ES entering/exiting every 5 minutes has Sharpe ~3 before costs but −3 after subtracting 1 bp of transaction costs.
- Learner-relevant: Concrete bp figures and a vivid example of how costs can flip a great backtest to unprofitable.

### Does the Data Suffer from Survivorship Bias?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Does the Data Suffer from Survivorship Bias?]]`
- Summary: Survivorship bias arises when a database omits stocks (or funds) that disappeared via bankruptcy, delisting, merger, or acquisition, so only survivors remain. It inflates backtest performance, especially for "value"/buy-cheap strategies that disproportionately pick soon-to-bankrupt names.
- Key claims: Ask whether a strategy was tested on survivorship-bias-free ("point-in-time") data; if not, be skeptical. Bias-free data is much more expensive.
- Learner-relevant: Gives the precise definition, its direction of bias, and the "point-in-time" term to probe for.

### How Did the Performance of the Strategy Change over the Years?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#How Did the Performance of the Strategy Change over the Years?]]`
- Summary: Most strategies backtest much better 10 years ago — fewer competing quant funds, wider spreads, and more missing (bankrupt) stocks inflating early-period returns. Pay most attention to recent-year performance, not overall numbers.
- Key claims: Regime shifts (decimalization, elimination of the short-sale rule, subprime meltdown) make financial time series nonstationary, so "more data = more robust" fails for finance. Demand good recent-data performance rather than a single stationary model.
- Learner-relevant: Explains why nonstationarity invalidates the naive "more data is better" intuition in finance.

### Does the Strategy Suffer from Data-Snooping Bias?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Does the Strategy Suffer from Data-Snooping Bias?]]`
- Summary: A 100-parameter strategy can be optimized to look fantastic historically yet fail going forward because it fits unrepeatable historical accidents. Even one or two parameters (entry/exit thresholds) risk this bias.
- Key claims: The more rules/parameters a model has, the more likely data-snooping bias; simple models stand the test of time. Minimizing its impact is deferred to Chapter 3.
- Learner-relevant: States the bias, links it to parameter count, and endorses simplicity (Occam's razor in finance).

### ARTIFICIAL INTELLIGENCE AND STOCK PICKING (sidebar)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#ARTIFICIAL INTELLIGENCE AND STOCK PICKING]]`
- Summary: The author is skeptical of AI (neural networks, decision trees, genetic algorithms) for trading because many-parameter models overfit transient noise. AI works in consumer marketing/fraud detection because those patterns are consistent and data are abundant; financial data has far fewer statistically independent observations (tick data is serially correlated).
- Key claims: Working AI models for him use a sound econometric basis, few parameters, linear regression only, conceptual simplicity, and optimizations in a lookback moving window with no future data, whose effect is validated on unseen future data.
- Learner-relevant: Lists the author's concrete constraints for any model he trusts, reinforcing the simplicity principle.

### Does the Strategy "Fly under the Radar" of Institutional Money Managers?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Does the Strategy "Fly under the Radar" of Institutional Money Managers?]]`
- Summary: An independent trader need not pursue high-capacity strategies; capacity is how much a strategy can absorb without hurting returns. Seek low-capacity niches — trading too often, few stocks daily, or infrequent seasonal commodity futures positions.
- Key claims: Niches are likely still profitable precisely because giant hedge funds have not yet arbitraged them away.
- Learner-relevant: Inverts the institutional instinct — low capacity is a feature for the small trader, not a bug.

### SUMMARY (Ch 2)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#SUMMARY]]`
- Summary: Whittle promising ideas to a handful using the four personal-fit questions (time, programming, capital, goal) then filter via the six quick tests (benchmark, Sharpe, drawdown, survivorship bias, recent-year performance, niche protection). Then proceed to rigorous backtesting in Chapter 3.
- Key claims: Represents the chapter's decision pipeline as one consolidated checklist.
- Learner-relevant: A reusable pre-backtest screening checklist for evaluating any candidate strategy.

## Overview (L1)
- Chapter 3: Backtesting — A quantitative strategy must be backtested yourself even when published in full detail, to confirm you understand it, replicate it exactly, catch errors, and experiment with variations. The chapter covers common platforms (Excel, MATLAB, TradeStation, high-end), historical databases and their pitfalls (split/dividend adjustment, survivorship bias, high/low noise), performance measurement (Sharpe ratio, drawdown), common pitfalls (look-ahead bias, data-snooping bias, transaction costs), and strategy refinement.

## Sections (L2)
### Common Backtesting Platforms
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#COMMON BACKTESTING PLATFORMS]]`
- Summary: Surveys the platforms available for backtesting, starting with economical, widely used options suited to start-ups.
- Key claims: Commercial backtesting platforms range up to tens of thousands of dollars; the author focuses on those that are economical and widely used.
- Learner-relevant: Choose a platform matched to your model's complexity and your budget — simple is often best.

### Excel
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Excel]]`
- Summary: The most basic and most common tool for retail and institutional traders. Its "What You See Is What You Get" (WYSIWYG) nature means data and program sit together and nothing is hidden.
- Key claims: Look-ahead bias is unlikely in Excel because you can align dates with data columns and signals (unless you use macros, which breaks WYSIWYG); backtesting and live trade generation can be done from the same spreadsheet, eliminating duplicated programming.
- Learner-relevant: Excel's main weakness is that it can backtest only fairly simple models — but the author argues simple models are often the best.

### MATLAB
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#MATLAB]]`
- Summary: One of the most common backtesting platforms among quantitative analysts and traders in large institutions, ideal for strategies involving large portfolios (e.g., 1,500 symbols).
- Key claims: It has built-in advanced statistical/mathematical modules (e.g., principal component analysis used in factor models) and a large third-party freeware ecosystem; it is useful for web scraping; it costs over $1,000, but clones exist — O-Matrix, Octave, Scilab — costing several hundred dollars or free, with more expensive clones being more MATLAB-compatible.
- Learner-relevant: MATLAB is easy to learn and quick for a complete backtest, but it is clumsy as an execution platform, so you typically build a separate execution system in another language.

### Example 3.1: Using MATLAB to Scrape Web Pages for Financial Data
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Example 3.1: Using MATLAB to Scrape Web Pages for Financial Data]]`
- Summary: Shows MATLAB used for text parsing, retrieving a stock's historical prices from Yahoo! Finance via `urlread`, then `regexp` to extract date and number fields, and `str2double` to parse open/high/low/close/volume/adjusted close.
- Key claims: The script retrieves only one web page at a time, so it is a simple illustration of MATLAB's text-processing functions rather than a full history retriever.
- Learner-relevant: Demonstrates that MATLAB can double as a data-retrieval and parsing tool, not just a numerical engine.

### TradeStation
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#TradeStation]]`
- Summary: A brokerage providing an all-in-one backtesting and execution platform linked to its servers.
- Key claims: Advantages — historical data is readily available and you can immediately generate and transmit orders to the brokerage from the same program; disadvantages — you are tied to TradeStation as your broker, and its proprietary language is less flexible than MATLAB and lacks some advanced statistical/mathematical functions.
- Learner-relevant: A good choice if you prefer ease of use of an all-in-one system; the author does not include TradeStation examples because he has not used it.

### High-End Backtesting Platforms
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#High-End Backtesting Platforms]]`
- Summary: A partial list of institutional-grade platforms for those with financial resources: FactSet's Alpha Testing, Clarifi's ModelStation, Quantitative Analytics' MarketQA, Barra's Aegis System, Logical Information Machines, Alphacet's Discovery.
- Key claims: The author has personal experience only with Logical Information Machines (excellent for futures strategies, weaker for equities) and Alphacet Discovery (integrates data retrieval, backtesting, optimization with machine learning, and automated execution across futures, equities, and currencies).
- Learner-relevant: High-end platforms combine data, backtest, optimization, and execution in one, but are priced beyond most start-ups.

### Finding and Using Historical Databases
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#FINDING AND USING HISTORICAL DATABASES]]`
- Summary: Explains how to find free/low-cost historical data and the pitfalls specific to stock and ETF data. Table 3.1 lists sources with pros/cons (e.g., finance.yahoo.com free and split/dividend adjusted but survivorship-biased and one-symbol-at-a-time; CSIdata.com low cost, source of Yahoo/Google data but split-not-dividend adjusted; CRSP.com survivorship-bias free but expensive and monthly-updated; GainCapital.com free long-history intraday forex).
- Key claims: Expensive vendors (Bloomberg, Dow Jones, FactSet, Thomson Reuters, Tick Data) cater to established institutions and are typically out of price range for individuals/start-ups.
- Learner-relevant: Google the exact data type (e.g., "free historical intraday futures data") before paying for anything.

### Are the Data Split and Dividend Adjusted?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Are the Data Split and Dividend Adjusted?]]`
- Summary: Explains how to adjust prices for splits and dividends. For an N-to-1 split (N usually 2, but can be fractional; N<1 is a reverse split) with ex-date T, multiply all prices before T by 1/N. For a dividend $d per share with ex-date T, multiply all prices before T by `(Close(T–1) – d)/Close(T–1)`.
- Key claims: Adjusting by a multiplier (not subtracting $d) preserves historical daily returns pre- and post-adjustment; this is Yahoo! Finance's method. Unadjusted data shows a price drop at the ex-date open that may trigger an erroneous signal.
- Learner-relevant: Prefer data already split-and-dividend adjusted; otherwise you must find a separate splits/dividends database (e.g., earnings.com) and apply adjustments yourself.

### Example 3.2: Adjusting for Splits and Dividends
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Example 3.2: Adjusting for Splits and Dividends]]`
- Summary: Walks through adjusting IGE (an ETF) prices. IGE had a 2:1 split on ex-date June 9, 2005 (N=2, multiply prior prices by 1/2). It then lists nine dividends from 6/21/2005 to 9/26/2007, each with its own multiplier, e.g. 0.998618, 0.997488, … 0.997214.
- Key claims: Each adjustment is a multiplier, so the aggregate dividend multiplier is the product (0.998618 × 0.997488 × … × 0.997214 = 0.976773), and the combined split+dividend multiplier for prices before 6/9/2005 is 0.976773 × 0.5 = 0.488386. The resulting adjusted close prices match Yahoo!'s after rounding to two decimals.
- Learner-relevant: Verifies the book's adjustment formula reproduces Yahoo! Finance's adjusted close, a useful validation exercise.

### Are the Data Survivorship Bias Free?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Are the Data Survivorship Bias Free?]]`
- Summary: Free/cheap databases generally have survivorship bias; bias-free databases are expensive and may be unaffordable for a start-up.
- Key claims: Overcome it by collecting point-in-time data yourself (save each day's prices for your whole universe) or by backtesting on more recent data so results aren't distorted by missing (delisted) stocks.
- Learner-relevant: For a start-up, self-collected point-in-time data is a practical route to a survivorship-bias-free database.

### Example 3.3: An Example of How Survivorship Bias Can Artificially Inflate a Strategy's Performance
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Example 3.3: An Example of How Survivorship Bias Can Artificially Inflate a Strategy's Performance]]`
- Summary: A toy "buy low-price stocks" strategy: from the 1,000 largest stocks by market cap, buy the 10 lowest closing prices at the start of the year and hold for one year (explicitly warned "hazardous to your financial health").
- Key claims: With a survivorship-bias-free database, all but one stock (MDM) were delisted during 2001 (the dot-com bust), and the portfolio returned –42%. With a survivorship-biased database that missed the delisted stocks, the portfolio returned a fictitious 388%. The –42% is what a trader would actually experience; the 388% is purely survivorship bias.
- Learner-relevant: A concrete, quantifiable demonstration that survivorship bias can turn a losing strategy into an apparently spectacular one.

### Does Your Strategy Use High and Low Data?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Does Your Strategy Use High and Low Data?]]`
- Summary: For almost all daily stock data, high and low prices are far noisier than open and close, so a buy limit order below a day's recorded high might not have been filled (small orders, different routing, or unfiltered erroneous ticks).
- Key claims: A backtest relying on high/low data is less reliable than one relying on open/close; even market-on-open (MOO) and market-on-close (MOC) orders may not fill at the shown open/close (primary vs. composite exchange pricing), but open/close discrepancies usually hurt less than high/low errors, since the latter almost always inflate backtest returns.
- Learner-relevant: After retrieving data, error-check by computing daily returns (including previous-high-to-today's-close) and inspecting days whose returns are ~4 standard deviations from the mean — extreme returns should be accompanied by news or a market index move, else the data is suspect.

### Performance Measurement
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#PERFORMANCE MEASUREMENT]]`
- Summary: Argues the Sharpe ratio and drawdowns are the two most important performance measures for cross-strategy comparison, rather than average annualized returns.
- Key claims: Average annualized returns are ambiguous because of denominator questions — long-short (one side or both sides of capital?), leveraged vs. unleveraged, moving-average vs. end-of-period equity. Quoting Sharpe ratio and drawdown avoids most of these problems.
- Learner-relevant: Standardize on Sharpe ratio and drawdown for honest comparisons across strategies and traders.

### Sharpe Ratio Subtleties (risk-free rate and annualization)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#PERFORMANCE MEASUREMENT]]`
- Summary: Details subtleties of Sharpe ratio calculation. A dollar-neutral (long-short) portfolio is self-financing — the short proceeds pay for the longs — so financing cost is small and the margin balance earns credit interest near the risk-free rate rF; hence the excess return is `R + rF – rF = R`, and you ignore the risk-free rate.
- Key claims: Only subtract the risk-free rate if the strategy incurs financing cost (e.g., long-only overnight). Annualizing: average annual return = 12 × average monthly return; annual standard deviation = √12 × monthly standard deviation (assuming serially uncorrelated returns, per Sharpe 1994), so annualized Sharpe = √NT × Sharpe based on period T. For an hourly strategy trading NYSE hours only, NT = 252 × 6.5 = 1,638 (a common mistake is 252 × 24 = 6,048).
- Learner-relevant: The formula `Annualized Sharpe Ratio = √NT × Sharpe Ratio Based on T` and the correct period count (use trading hours, not 24) are the key takeaways.

### Example 3.4: Calculating Sharpe Ratio for Long-Only Versus Market-Neutral Strategies
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Example 3.4: Calculating Sharpe Ratio for Long-Only Versus Market-Neutral Strategies]]`
- Summary: Computes the Sharpe ratio of buying-and-holding IGE from 11/26/2001 to 11/14/2007 (4% per annum risk-free rate), in Excel and MATLAB, then the market-neutral version that also shorts an equal dollar amount of SPY.
- Key claims: Daily return `=(G3-G2)/G2`; excess daily return `=H3-0.04/252`; Sharpe `=SQRT(252)*AVERAGE(excess)/STDEV(excess)` → 0.789317538 for the buy-and-hold. The hedged long-short version nets `(dailyret – dailyretSPY)/2` (divide by 2 for twice the capital) → Sharpe 0.783681.
- Learner-relevant: A complete, copy-pasteable recipe for Sharpe computation in both Excel and MATLAB, including the divide-by-2 capital adjustment for long-short.

### Example 3.5: Calculating Maximum Drawdown and Maximum Drawdown Duration
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Example 3.5: Calculating Maximum Drawdown and Maximum Drawdown Duration]]`
- Summary: Continues the market-neutral example to compute maximum drawdown. The "high watermark" at each close is the maximum cumulative compounded return up to that time; drawdown = `(1+high watermark)/(1+cumulative return) – 1`.
- Key claims: Excel: cumulative return `=(1+M3)*(1+L4)-1`; high watermark `=MAX(N3,M4)`; drawdown `=(1+N3)/(1+M3)-1`; max drawdown = 0.1053 (10.53%); drawdown duration `=IF(O3=0,0,P2+1)`; max drawdown duration = 497 trading days. MATLAB `calculateMaxDD(cumret)` returns both.
- Learner-relevant: The high-watermark-then-drawdown recipe (and its MATLAB function) is directly reusable for reporting drawdown on any strategy.

### Common Backtesting Pitfalls to Avoid
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#COMMON BACKTESTING PITFALLS TO AVOID]]`
- Summary: Backtesting is creating historical trades from information available at the time and measuring subsequent performance; an erroneous backtest usually produces performance better than actual trading.
- Key claims: Survivorship bias (already covered) inflates performance; the chapter adds two more common pitfalls — look-ahead bias and data-snooping bias — with tips to avoid them.
- Learner-relevant: Treat backtest results as an optimistic upper bound; actively hunt the biases that inflate them.

### Look-Ahead Bias
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Look-Ahead Bias]]`
- Summary: Using information available only after the trade instant. Example: "Buy when the stock is within 1 percent of the day's low" uses the day's low, unknowable until close. Another: using regression coefficients from the entire data set to generate daily signals.
- Key claims: Avoid it by using lagged historical data — compute moving averages, highs/lows, and volume from data up to the close of the previous period only (no lag needed if you enter only at the close). It is easier to avoid in Excel/WYSIWYG (cell highlighting reveals current-day data) than MATLAB, where you must remember to lag. A final MATLAB check: save positions from full data (file A), re-run on data truncated by N days (file B), truncate A to match, and compare — if A and B differ, you have look-ahead bias.
- Learner-relevant: The truncate-and-compare positions test is a concrete, mechanical way to detect subtle look-ahead bias in any backtest program.

### Data-Snooping Bias
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Data-Snooping Bias]]`
- Summary: Backtest performance inflated relative to future performance because model parameters were over-optimized on transient noise in historical data. Especially serious in finance due to limited independent data.
- Key claims: Only data within the past 10 years are really suitable for building predictive models, and regime shifts can make even a few-year-old data obsolete. Rule of thumb: do not employ more than five parameters (entry/exit thresholds, holding period, lookback period, etc.). Not all data-snooping is parameter optimization — qualitative choices (enter at open vs. close, hold overnight, large- vs. mid-cap universe) made to optimize backtests also count.
- Learner-relevant: The less independent data you have, the fewer adjustable parameters you should use; cap parameters at five.

### Sample Size (safeguard against data-snooping)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Sample Size]]`
- Summary: The most basic safeguard is having enough backtest data relative to free parameters.
- Key claims: Rule of thumb — data points needed = 252 × number of free parameters (purely experiential, not from statistical literature). A 3-parameter daily model needs ≥3 years of daily data; a 3-parameter model updating every minute needs ≥252/390 year ≈ 7 months of one-minute data. Warning: 7 months of minute-by-minute data is effectively only ~7×21 = 147 daily data points, insufficient for a 3-parameter daily model.
- Learner-relevant: The 252× parameters heuristic (and the daily-vs-minute data-point trap) calibrates how much data to gather.

### Out-of-Sample Testing (safeguard against data-snooping)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Out-of-Sample Testing]]`
- Summary: Divide data into two parts — optimize parameters/decisions on the first (training set) and test on the second, more recent part (test set).
- Key claims: The two portions should be roughly equal; with insufficient training data, have at least one-third as much test data as training data. If test-set performance is not at least reasonable, the model has data-snooping bias — cure by simplifying and eliminating parameters. More rigorous: moving optimization of parameters, which adapts parameters to changing data and eliminates parameter data-snooping (see "Parameterless Trading Models").
- Learner-relevant: Split-then-validate is the core defense; never tune on the test set.

### Parameterless Trading Models (sidebar)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#PARAMETERLESS TRADING MODELS*]]`
- Summary: "No free parameters" doesn't mean no lookback/thresholds — it means all such parameters are dynamically optimized in a moving lookback window, so nothing like a fixed profit cap is an input.
- Key claims: The advantage is minimizing overfitting to multiple input parameters (data-snooping bias), so backtest performance is much closer to forward performance. Note that parameter optimization need not pick one best set — averaging trading decisions over different parameter sets is often better. Computationally challenging; the author used Alphacet Discovery for his near-parameterless regime-switching model (Example 7.1).
- Learner-relevant: Averaging over parameter sets is a cheaper, more robust alternative to a single optimal set.

### Paper Trading and Published Strategies (out-of-sample testing continued)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Out-of-Sample Testing]]`
- Summary: The ultimate out-of-sample test is paper trading — running the model on actual unseen data, the most reliable test short of trading it.
- Key claims: Paper trading reveals look-ahead errors and operational issues (discussed fully in Chapter 5). If a strategy comes from a published source, the period between publication and your test is a genuine out-of-sample period, as good as paper trading, provided you do not optimize parameters on it.
- Learner-relevant: Published strategies give you a free, honest out-of-sample window.

### Example 3.6: Pair Trading of GLD and GDX
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Example 3.6: Pair Trading of GLD and GDX]]`
- Summary: Backtests a pair-trading strategy, optimizing thresholds on a training set (first 252 days) and observing the effect on the test set. GLD reflects spot gold and GDX is a basket of gold-mining stocks, so their prices should move in tandem (full cointegration deferred to Chapter 7).
- Key claims: Uses regression (`ols`) on the training set to find the hedge ratio; spread = GLD − hedgeRatio×GDX; z-score = (spread − spreadMean)/spreadStd; buy spread at z-score ≤ −2, short at ≥ 2, exit when |z-score| ≤ 1. Sharpe on training set ≈ 2.3 and test set ≈ 1.5, so the strategy is considered free of data-snooping bias. Changing entry to 1 standard deviation and exit to 0.5 standard deviation raises training Sharpe to 2.9 and test Sharpe to 2.1 — a better set. The look-ahead check (cutoff=60 days, compare position files) prints nothing, confirming no look-ahead bias.
- Learner-relevant: A worked end-to-end example of train/test splitting, parameter optimization, and the look-ahead bias check in one strategy.

### Sensitivity Analysis (strategy robustness)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Sensitivity Analysis]]`
- Summary: After optimizing parameters and verifying test-set performance, vary parameters and small qualitative features to see how performance changes on both sets.
- Key claims: If any parameter set other than the optimal one is unacceptable, the model likely suffers data-snooping bias. Try simplifying the model — remove conditions one by one and see when training performance deteriorates unacceptably and whether test performance drops correspondingly. Eliminate as many conditions/parameters as possible with no significant test-set decrease. Do not add/adjust parameters to improve the test set (that turns the test set into a training set). Finally, divide capital across different parameter values and condition sets — averaging over parameters further reduces deviation of live performance from backtest.
- Learner-relevant: Aggressively simplify the model, then average over remaining parameter values rather than trusting a single optimum.

### Transaction Costs
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#TRANSACTION COSTS]]`
- Summary: No backtest is realistic without transaction costs (commission, liquidity cost, opportunity cost, market impact, slippage, from Chapter 2).
- Key claims: A high-Sharpe strategy before costs can become very unprofitable after costs, illustrated in Example 3.7.
- Learner-relevant: Always re-run a promising backtest with transaction costs before trusting its Sharpe ratio.

### Example 3.7: A Simple Mean-Reverting Model with and without Transaction Costs
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Example 3.7: A Simple Mean-Reverting Model with and without Transaction Costs]]`
- Summary: A mean-reverting model by Khandani and Lo (MIT): buy the stocks with the worst previous one-day returns and short the best. It had great performance since 1995 (Sharpe 4.47 in 2006) ignoring costs. The example tests it on the S&P 500 universe with a 5-basis-point-per-trade cost (a "trade" is a buy or a short, not a round-trip).
- Key claims: On the S&P 500 universe the strategy's 2006 Sharpe is only 0.25 (not 4.47) because the original paper's returns come mostly from small and microcap stocks. After a 5 bp one-way transaction cost the Sharpe collapses to about –3.19 — "very unprofitable". MATLAB `smartsum`/`smartmean`/`smartstd` functions (skipping NaN) are introduced for ragged price series. Historical data for hundreds of symbols is retrieved via HQuote Pro; performance estimates remain upper bounds since survivorship-bias-free data is expensive.
- Learner-relevant: A vivid demonstration that universe choice and 5 bp of transaction cost can flip a 4.47 Sharpe strategy to –3.19.

### Strategy Refinement
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#STRATEGY REFINEMENT]]`
- Summary: How to improve a strategy that doesn't deliver superb backtest performance, without introducing data-snooping bias. The guiding principle is the same as parameter optimization: any change that improves the training set must also improve the test set.
- Key claims: Known simple strategies (e.g., pair trading) are diminishing in return as too many traders erode the profit margin; minor variations are less known and less exploited. Example variations: exclude pharmaceutical stocks (news-driven price shocks) or stocks with pending mergers/acquisitions; change entry/exit timing or frequency; change the stock universe (a strategy good on small-caps can be unprofitable on large-caps). Prefer refinements grounded in fundamental economics or well-studied market phenomena rather than trial and error, else data-snooping bias looms.
- Learner-relevant: Refine only with changes that hold out-of-sample, and anchor refinements in economic rationale.

### Example 3.8: A Small Variation on an Existing Strategy
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Example 3.8: A Small Variation on an Existing Strategy]]`
- Summary: Refines the Example 3.7 mean-reverting strategy (Sharpe 0.25 before costs, –3.19 after) by updating positions at the market open instead of the close (replace "cl" with "op" everywhere in MATLAB).
- Key claims: The single change raises the pre-cost Sharpe from 0.25 to 4.43 and the after-cost Sharpe from –3.19 to a profitable 0.78. The author leaves as an exercise testing on the S&P 400 mid-cap and S&P 600 small-cap universes.
- Learner-relevant: A tiny, economically-motivated change (open vs. close entry) can transform a strategy's profitability — but verify on out-of-sample data.

### Summary
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#SUMMARY]]`
- Summary: Backtesting is a realistic historical simulation; future performance resembling past is not guaranteed. The chapter's issues: data (split/dividend adjustments, high/low noise, survivorship bias), performance measurement (annualized Sharpe ratio, maximum drawdown), look-ahead bias, data-snooping bias (sample size, out-of-sample testing, sensitivity analysis), transaction cost, and strategy refinement.
- Key claims: It is acceptable to skip some precautions initially for a quick sense of a strategy's potential, revisiting each issue after the model goes live; even thorough backtests miss problems obvious after a few months of paper/real trading.
- Learner-relevant: Once a strategy backtests reasonably, the next step is setting up the trading business.

## Overview (L1)
- Chapter 4 "Setting Up Your Business" — The business side of independent trading: choosing between a retail brokerage account and a proprietary trading firm, the criteria for picking a broker/prop firm, and the progressive physical infrastructure (hardware, connectivity, data, co-location) needed to run a quant strategy.
- Chapter 5 "Execution Systems" — How to build an automated trading system (semiautomated vs fully automated), hiring programmers, minimizing transaction costs, paper trading as a bug/out-of-sample test, and diagnosing why live performance diverges from backtests (bugs, costs, data-snooping bias, regime shifts).

## Sections (L2)

### Business Structure: Retail or Proprietary?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Business Structure: Retail or Proprietary?]]`
- Summary: The core business choice for an independent trader: open a retail brokerage account (fully independent) or join a proprietary trading firm (semi-independent) as a member.
- Key claims: Retail leverage is capped by SEC Regulation T at roughly 2x equity for overnight positions (4x intraday); proprietary firms offer much higher "buying power" — up to 20x or more for intraday/hedged positions — but require passing the NASD Series 7 examination; proprietary loss is limited to initial investment (same as an S corp or LLC retail account); some prop-firm rules (no penny stocks, no overnight short positions) are risk-management measures for your own protection.
- Learner-relevant: Match the structure to capital need, strategy style, and skill level — a low-risk market-neutral strategy needing high leverage fits a prop firm, while high-frequency futures trading that needs little capital fits retail; a unique, highly profitable strategy is better kept in retail to avoid a prop firm "piggybacking" on it.

### Choosing a Brokerage or Proprietary Trading Firm
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Choosing a Brokerage or Proprietary Trading Firm]]`
- Summary: Commission rate is the common but incomplete criterion; execution speed, dark-pool liquidity access, product range, API availability, and firm reputation matter more.
- Key claims: Commissions are only part of total transaction costs; dark-pool liquidity (institutional orders away from exchanges, e.g. Liquidnet and ITG's Posit) can improve execution price more than a lower commission — the author's Goldman Sachs REDIPlus / Sigma X engine improved execution by "more than a few cents per share" over Interactive Brokers; an API is essential (without it "high-frequency quantitative trading is impossible"); paper trading accounts exist at Interactive Brokers, Genesis Securities, PFG Futures (futures), and Oanda (currencies); proprietary accounts are not SIPC-insured, so the firm's balance sheet and broker-dealer registration matter (WorldCom, Refco, and Tuco Trading's March 2008 shutdown are cautionary examples).
- Learner-relevant: You can hold multiple retail and proprietary accounts (disclose as "outside business activities" to the NASD) to compare execution cost and infrastructure; check reputation at elitetrader.com.

### Physical Infrastructure
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Physical Infrastructure]]`
- Summary: The trading hardware/environment builds up progressively, from a minimal home office to remote hosted servers near exchanges.
- Key claims: Start-up needs are modest — any dual-core PC, a DSL/cable connection, and an uninterruptible power supply (UPS), under ~$2,000 initial and ~$50/month; a real-time newsfeed (Thomson Reuters/Dow Jones from $100–$200/month, Bloomberg ~$2,000/month with a free radio stream) beats CNBC; upgrades include quad-core (octal-core expected by 2010), multiple monitors, and a T1 line ($700–$1,500/month, 1.5 Mbps, ~2x cable/DSL) since "in fast-moving markets, every millisecond counts"; for resilience use server hosting or co-location ($100s–$1,000s/month) plus GotoMyPC (~$15/month), and co-locate near an Internet backbone for ultra-high-frequency strategies.
- Learner-relevant: A million-dollar portfolio is tradeable on a few thousand dollars of initial infrastructure plus a few hundred a month; the author cites a study (via Michael Mauboussin) showing more information can worsen prediction, so real-time data is not automatically profitable.

### Summary (Chapter 4)
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Summary]]`
- Summary: Retail gives freedom and capital protection but low leverage; proprietary gives high leverage but less freedom and protection. Either way the account must offer low commissions, a variety of instruments, deep liquidity, and an API.
- Key claims: Finding a retail broker took the author under a month; setting up a proprietary account took several months (contracts plus Series 7).
- Learner-relevant: Hold both account types, each tailored to specific strategies, to easily compare execution speed and liquidity depth.

### What an Automated Trading System Can Do for You
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#What an Automated Trading System Can Do for You]]`
- Summary: An ATS retrieves live data, runs the algorithm to generate orders, and submits them; the degree of automation varies. It may also need to scrape non-price data (earnings estimates, dividends) from HTML pages using MATLAB or Perl.
- Key claims: A fully automated system minimizes human errors and delays and is indispensable for high-frequency strategies, but is complex/costly to build (requires Java, C#, or C++); lower-frequency strategies can be semiautomated via Excel/MATLAB plus the broker's basket trader or spread trader.
- Learner-relevant: Choose automation depth by strategy frequency; fully automated trades in a loop, semiautomated generates a wave or two of orders a day.

### Building a Semiautomated Trading System
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Building a Semiautomated Trading System]]`
- Summary: The backtest program generates an order file (triplets like `("IBM", "BUY", "100")`) that is uploaded to a basket trader or spread trader and submitted with one keystroke; DDE links refresh Excel cells with live data.
- Key claims: A DDE link is a cell expression like `=accountid|LAST!IBM` that auto-loads the last price; a basket trader submits many orders for many symbols in one keystroke; a spread trader monitors multiple pairs and enters orders when conditions are met — its limit is on the spread, not individual stocks; the author runs a >1,000-line order file daily through Interactive Brokers' basket trader and uses REDIPlus's spread trader for pair trading (IB's spread trader handles only futures calendar spreads; stock spreads use "Generic Combo").
- Learner-relevant: Semiautomation suits strategies needing only a few order waves per day; DDE-based order submission is too slow for frequent intraday waves.

### Building a Fully Automated Trading System
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Building a Fully Automated Trading System]]`
- Summary: A loop continuously scans prices and submits orders through the broker's API all day — just press "start" in the morning and "close" at day's end.
- Key claims: No brokerage offers a MATLAB API, so order transmission must be written in Visual Basic, Java, C#, or C++; DDE updates are slow and symbol-limited (Interactive Brokers allows only ~100 symbols by default unless you generate large commissions), so an Excel/DDE loop is infeasible for intraday strategies; integrated platforms like TradeStation or Alphacet Discovery trade flexibility for convenience.
- Learner-relevant: Fully automated systems require a compiled-language API implementation, not MATLAB or Excel macros.

### Hiring a Programming Consultant
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Hiring a Programming Consultant]]`
- Summary: Building an ATS usually needs more programming skill than backtesting; a consultant is often cheaper and less headache than DIY.
- Key claims: Fees run $50–$100/hour, most independent-trader projects $1,000–$5,000; find programmers via the broker's API referral page (Interactive Brokers), elitetrader.com, or craigslist (uneven quality, often lacking trading-technology knowledge); protect confidentiality via NDAs, relying on the fact that most strategies are already well known, and compartmentalizing — one programmer builds infrastructure, another implements the strategy with parameters neither fully knows.
- Learner-relevant: A high-frequency strategy justifies hiring help; split the work so no single contractor holds both strategy and execution.

### Minimizing Transaction Costs
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Minimizing Transaction Costs]]`
- Summary: Beyond choosing a low-commission broker, execution method controls commissions, liquidity cost, and market impact.
- Key claims: Avoid stocks under $5 (institutional traders skip them; they raise commission and widen bid-ask spread); cap each order at ~1% of average daily volume — e.g. IRN (S&P 600, ~51,000 avg volume, $4.45) allows only 510 shares (~$2,269); scale position size by market cap using the fourth root of market cap (ratio of largest to smallest capital weight no more than ~10), not linearly; breaking a large order into many small ones cuts market impact but raises slippage; slippage also comes from broker software issues, risk-control checks, and pipeline (exchange access) issues or shallow dark-pool access.
- Learner-relevant: Independent traders rarely hit the 1% volume cap on large caps, but small-cap illiquidity can bite; execution cost should inform broker choice.

### Testing Your System by Paper Trading
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Testing Your System by Paper Trading]]`
- Summary: Paper trading is the only way to find ATS bugs without losing real money, and reveals look-ahead bias and operational bottlenecks.
- Key claims: Compare paper P&L to the backtest; if the gap isn't transaction costs, the software likely has bugs; paper trading gives intuition about P&L volatility, capital usage, trades per day, and data issues; it is a true out-of-sample test that can expose data-snooping bias — though inattention degrades paper performance over time; the author's pre-open routine takes ~20 minutes to download/parse data and ~15 more to transmit orders, so strategies depending on data/news fresher than 35 minutes need a different execution environment.
- Learner-relevant: Paper trade for at least a month; treat pre-open data prep time as a hard constraint on strategy design.

### Why Does Actual Performance Diverge from Expectations?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Why Does Actual Performance Diverge from Expectations?]]`
- Summary: After live underperformance, diagnose in order: software bugs, backtest/live trade mismatch, higher-than-expected execution costs, illiquid-stock market impact — then the two "most dreaded" causes, data-snooping bias and regime shifts.
- Key claims: To test for data-snooping bias, strip the strategy of rules and parameters; if backtest performance collapses, the bias is real; two structural regime shifts: (1) decimalization (April 9, 2001, replacing sixteenths/eighths quotes) cut friction and hurt statistical arbitrage — stat-arb backtests before 2001 look far better than live; (2) the SEC "plus tick"/"zero-plus tick" short-sale rule (eliminated June 2007) means pre-2007 short backtests are artificially inflated; separate from that, hard-to-borrow stocks often make profitable historical short positions unrealizable.
- Learner-relevant: Pre-2001 stat-arb and pre-2007 short-strategy backtests are not comparable to live performance; simpler (fewer parameters) strategies are more robust to data-snooping bias.

## Overview (L1)
- Chapter 6 "Money and Risk Management" — How to choose optimal capital allocation and leverage to maximize long-term compounded growth while limiting drawdowns. Central tool is the Kelly formula (f = m/s²), with half-Kelly as a safety rule, plus risk management (fat tails, black swans, stop-loss), and psychological preparedness against despair and greed.
- Chapter 7 "Special Topics in Quantitative Trading" — The statistical-arbitrageur's arsenal: mean-reverting vs momentum strategies, regime switching, stationarity/cointegration, factor models (APT/Fama-French), exit strategies, seasonal trades, high-frequency trading, and the high-leverage vs high-beta tradeoff.

## Sections (L2)

### Optimal Capital Allocation and Leverage
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#OPTIMAL CAPITAL ALLOCATION AND LEVERAGE]]`
- Summary: Maximizing long-term wealth equals maximizing the long-term compounded growth rate g, which implicitly means avoiding ruin. Under a Gaussian assumption for each strategy's excess returns (mean mi, std si), the optimal allocation vector is F* = C⁻¹M; for independent strategies this collapses to the Kelly formula fi = mi/si². The resulting maximum growth rate is g = r + S²/2, where S is the portfolio Sharpe ratio.
- Key claims: Kelly fraction fi = mi/si² for independent strategies; maximum compounded growth g = r + S²/2 (Sharpe ratio squared drives growth); Kelly f is independent of time scale; the Gaussian assumption is "quite inaccurate" because fat tails produce bigger losses than the bell curve allows.
- Learner-relevant: Optimal leverage equals expected excess return divided by variance; higher Sharpe ratio, not higher raw return, is what compounds wealth.

### (Example 6.1–6.3) The Geometric Random Walk Puzzle and Kelly Calculations
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Example 6.1]]`
- Summary: A 50/50 ±1% random walk actually loses 0.005% (0.5 bp) per minute because compounded growth is g = m − s²/2, so risk always reduces long-term growth. The SPY example (mean excess return 7.231%, std 16.91%, Sharpe 0.4275) gives Kelly f = 0.07231/0.1691² = 2.528 and 13.14% levered growth vs 9.8% unlevered. The three-ETF example (OIH/RKH/RTH) shows F* = C⁻¹M yielding leverages 1.2919, 1.1723, −1.4882 (shorting RTH because its excess return is negative) with portfolio Sharpe 0.4751 and growth 15.29%.
- Key claims: g = m − s²/2 means arithmetic-mean-zero random walk has negative geometric mean; Kelly f is time-scale independent whereas Sharpe ratio is not; retail accounts cap leverage at 2 (overnight) or 4 (intraday), so each fi is scaled down by l/(Σ|fi|).
- Learner-relevant: "Risk always decreases long-term growth rate" — the core justification for risk management; negative-return assets get shorted automatically.

### Risk Management
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#RISK MANAGEMENT]]`
- Summary: Kelly-style risk management dictates reducing position size on losses (realizing them) and increasing on profits — this forced selling is what caused "financial contagion" in the August 2007 quant meltdown (Goldman Global Alpha −22.5%, Renaissance −8.7%). Because returns are not Gaussian (fat tails / "black swan" events per Taleb), traders cut to half-Kelly and further cap leverage using worst historical loss.
- Key claims: Half-Kelly betting is standard practice; maximum historical S&P 500 one-day loss was 20.47% on Black Monday (Oct 19, 1987), so a 20% tolerable drawdown caps leverage at ~1, below half-Kelly 1.26; beyond position risk there are model risk, software risk, and natural disaster risk in decreasing likelihood; model risk is handled by gradually lowering leverage (via trailing Kelly) to zero rather than abrupt shutdown.
- Learner-relevant: Use the smaller of half-Kelly and (max tolerable drawdown ÷ worst historical loss); update capital allocation at least daily and recompute F* with a ~6-month lookback.

### Is the Use of Stop Loss a Good Risk Management Practice?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#IS THE USE OF STOP LOSS A GOOD RISK MANAGEMENT PRACTICE]]`
- Summary: Stop loss is a "common fallacy" for catastrophic losses — prices gap discontinuously, so you realize the loss rather than avoid it. Stop loss only helps in a momentum (trending) regime; it is harmful in a mean-reverting regime where losses recover. News-driven moves are momentum ("don't stand in front of a freight train"); large moves with no news are liquidity events likely to mean revert.
- Key claims: Stop loss benefits momentum regimes and harms mean-reverting ones; fundamental/earnings-driven price moves trend, while unexplained liquidity-driven moves revert; exit strategies for each regime are detailed in Chapter 7.
- Learner-relevant: Whether to use a stop depends on the regime you believe you're in, not a blanket rule.

### Psychological Preparedness
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#PSYCHOLOGICAL PREPAREDNESS]]`
- Summary: Even quantitative traders override their systems under abnormal P&L. Behavioral-finance biases include loss aversion/status-quo bias/endowment effect (holding losers, cutting winners), and representativeness bias (overweighting recent results, tweaking parameters after a single loss). The two big trader emotions are despair (shutting down or doubling down on losing models) and greed (overleveraging winners), both leading to overleveraging.
- Key claims: The golden rule is "keep the size of your portfolio under control at all times"; LTCM (2000) and Amaranth Advisors (2006, $6B loss on natural gas calendar spreads by one trader Brian Hunter) fell to overleverage; the author himself lost $1M+ for investors by adding $100M to a six-month-old strategy, then repeated it with an XLE/CL spread sized to ~$500K.
- Learner-relevant: Start with a small portfolio and scale up slowly; having other income/diversions actually improves long-term wealth growth.

### (Chapter 6) Summary and Appendix: Kelly Derivation
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#APPENDIX: A SIMPLE DERIVATION OF THE KELLY FORMULA WHEN RETURN DISTRIBUTION IS GAUSSIAN]]`
- Summary: A superbly performing model is at greatest risk of loss through overconfidence and overleverage. The appendix derives Kelly from the levered compounded growth g(f) = r + fm − s²f²/2; setting dg/df = m − s²f = 0 yields f = m/s².
- Key claims: g(f) = r + fm − s²f²/2 for a Gaussian process; optimal f solves dg/df = m − s²f = 0, i.e., f = m/s².
- Learner-relevant: The single-strategy Kelly formula follows directly from maximizing the compounded-growth function.

### Mean-Reverting Versus Momentum Strategies
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#MEAN-REVERTING VERSUS MOMENTUM STRATEGIES]]`
- Summary: Strategies are profitable only if prices mean-revert or trend; prices can be both depending on time horizon. Assume mean reversion unless expected earnings change (then momentum). Mean-reversion backtests are perilous due to bad quotes inflating performance and survivorship bias (shorts of acquired stocks and buys of bankrupt ones). Momentum comes from slow information diffusion (post-earnings-announcement drift, PEAD), incremental execution of large orders, and herding.
- Key claims: Mean-reverting regimes are more prevalent than trending; Khandani & Lo (2007) built a profitable pre-cost short-term mean-reversal model; competition shrinks the number of mean-reversion opportunities but shortens the momentum holding period.
- Learner-relevant: Backtest mean-reversion only after cleaning bad quotes and removing survivorship bias; momentum's lifetime is shrinking as information diffuses faster.

### Regime Switching
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#REGIME SWITCHING]]`
- Summary: Regimes (bull/bear, high/low volatility, mean-reverting/trending) and their "turning points" are central to markets. Markov/hidden Markov regime-switching models (Nielsen & Olesen, van Norden & Schaller, Kaufmann & Scheicher) are "generally useless" for trading because they assume constant transition probabilities. Turning-points models take a data-mining approach with many input variables (volatility, returns, macro news, media chatter per Schiller).
- Key claims: Volatility regime switching is best modeled by GARCH (useful for options traders, not stock traders); Example 7.1 uses Alphacet Discovery + a perceptron on GS with thresholds ±1%/±3% and 1–60 day holding periods to get 37.93% gross cumulative return over six months (vs 15.77% buy-and-hold) using a 50-day backward-looking moving window to limit data-snooping bias.
- Learner-relevant: Regime detection is best done by data-mining many indicators in a strictly backward-looking window, not by fixed-probability Markov models.

### Stationarity and Cointegration
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#STATIONARITY AND COINTEGRATION]]`
- Summary: A stationary series (integrated of order zero, I(0)) never drifts far from its initial value — ideal for mean reversion. Individual prices are nonstationary, but a long/short pair can be cointegrated (its linear combination is stationary), e.g., GLD vs GDX with hedge ratio 1.6766. The test is the cointegrating augmented Dickey-Fuller test (cadf). Cointegration (long-term price behavior) differs from correlation (short-term return behavior).
- Key claims: GLD/GDX cadf t-statistic −3.36 falls between the 5% crit value −3.343 and 1% crit −3.819 (>95% cointegration); KO vs PEP is not cointegrated (t = −2.14 vs 10% crit −3.038) yet has 0.4849 daily return correlation (P=0); a stationary series guarantees mean-reversion profit only if stationarity persists, but nonstationary series can still offer short-term reversals; CAD/AUD and calendar spreads are other cointegrating examples.
- Learner-relevant: Use cadf (augmented Dickey-Fuller) to test pairs; cointegration ≠ correlation — a pair can be cointegrated but uncorrelated, and vice versa.

### Factor Models
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#FACTOR MODELS]]`
- Summary: Factor models (arbitrage pricing theory, APT) express excess returns R = Xb + u, where X is factor exposures (loadings), b is factor returns (common drivers), and u is specific returns (uncorrelated noise). The Fama-French Three-Factor model uses beta (market sensitivity), market capitalization, and book-to-price ratio.
- Key claims: Fitted over time, the market-cap factor return is usually negative (small caps beat large), book-to-price usually positive (value beats growth), beta positive; a good factor model's R² is ~30–40% (Grinold & Kahn, 1000 stocks, 50 factors); factor returns have momentum, so they're assumed constant one period ahead; factor exposures can even encode mean reversion (negative of prior return); PCA builds factors from eigenvectors of the return covariance matrix with no external data.
- Learner-relevant: Factor models predict returns only if factor returns persist (have momentum); fundamental/macro factor models suffer steep drawdowns when investors' valuation metric shifts (e.g., growth stocks in the late-1990s bubble and Aug/Dec 2007).

### What Is Your Exit Strategy?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#WHAT IS YOUR EXIT STRATEGY]]`
- Summary: Four exit types: fixed holding period, target price/profit cap, latest entry signal, and stop price. For mean reversion, the Ornstein-Uhlenbeck formula dz(t) = −θ(z(t) − µ)dt + dW gives a robust half-life = ln(2)/θ (GLD/GDX ≈ 10 days) to set holding period and target price µ. A reversal model never recommends a stop loss; a momentum model's opposite signal acts like a justified stop.
- Key claims: Momentum optimal holding period is error-prone (few signals, data-snooping, and it shrinks as competition grows); mean-reversion half-life is robust because it uses the whole time series; stop loss suits momentum, not reversal models.
- Learner-relevant: Estimate mean-reversion holding period via Ornstein-Uhlenbeck half-life rather than counting backtest trades; avoid arbitrary stop prices that add parameters and data-snooping bias.

### Seasonal Trading Strategies
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#SEASONAL TRADING STRATEGIES]]`
- Summary: Calendar-effect strategies buy/sell on fixed dates. Equity seasonality (January effect: buying prior-year losers, shorting winners due to tax-loss selling) has mostly disappeared; a year-on-year monthly seasonal strategy (Heston & Sadka) returned >13%/yr pre-2002 but is now dead. Commodity-futures seasonals remain profitable because driven by real demand.
- Key claims: Gasoline RB future trade — buy May contract near April 13, sell April 25 — profitable 11 straight years; natural gas NG trade — buy June contract near Feb 25, sell April 15 — profitable 14 straight years (but caution: Amaranth lost $6B, Bank of Montreal $450M in natural gas); commodity seasonals suffer from few samples (once a year) and thus data-snooping risk, mitigated by testing nearby dates and requiring economic rationale.
- Learner-relevant: Prefer commodity-futures seasonal trades over equity calendar effects; validate with economic sense and date-robustness checks.

### High-Frequency Trading Strategies
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#HIGH-FREQUENCY TRADING STRATEGIES]]`
- Summary: High-frequency (intraday, no overnight positions) strategies achieve high Sharpe ratios via the law of large numbers — hundreds/thousands of small bets per day — enabling high leverage and stratospheric return on equity. They exploit tiny inefficiencies or supply liquidity for a fee, and their small positions make risk management easy (quick deleveraging). Drawbacks: hard to backtest (need bid/ask/order-book data), and execution speed (C code, colocated servers) is a large part of P&L.
- Key claims: High Sharpe ratio is the goal (per Chapter 6), so trade at high frequency; the law of large numbers minimizes day-to-day deviation from mean return; transaction costs are paramount in testing; the true test is often real-time trading with an extremely sophisticated simulator.
- Learner-relevant: High-frequency strategies give the highest long-term compounded growth but require bid/ask data and fast execution — work toward them gradually.

### Is It Better to Have a High-Leverage Versus a High-Beta Portfolio?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#IS IT BETTER TO HAVE A HIGH-LEVERAGE VERSUS A HIGH-BETA PORTFOLIO]]`
- Summary: Since Kelly growth is proportional to Sharpe ratio squared (not average return), a leveraged low-beta portfolio beats an unleveraged high-beta portfolio of equal average return because it has lower risk. The market chronically underprices high-beta stocks. Dr. Edward Qian's "Risk Parity Portfolios" recommends replacing the 60–40 stock/bond mix with a 23–77 allocation levered 1.8×.
- Key claims: Low-beta stocks give higher Sharpe ratio, so prefer low-beta + leverage; 60/40 is overweight risky assets vs Qian's 23/77 levered 1.8×; caveat — fat tails mean caution with leverage even on low-beta stocks.
- Learner-relevant: To raise growth, lever up low-beta/low-volatility portfolios rather than chase high-beta stocks.

## Overview (L1)
- Chapter 8 "Conclusion: Can Independent Traders Succeed?" — Argues that independent traders can beat institutions because low-capacity market-making strategies yield high Sharpe ratios unavailable to large funds, and because independence frees the trader from institutional constraints and misaligned incentives. Then maps next steps for growing a trading business (higher-frequency data, longer-hold strategies, new markets, automation, taking on investors).
- Appendix "A Quick Survey of MATLAB" — A hands-on tour of MATLAB syntax for backtesting: array initialization, vectorized (loop-free) operations, subarray/logical indexing, multidimensional arrays, cell arrays, built-in functions, toolboxes, and user-defined functions.

## Sections (L2)

### Conclusion: Can Independent Traders Succeed?
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Conclusion]]`
- Summary: Opens with the 2007 hedge-fund losses and the "central mystery": how do independent traders with tiny equity and minimal infrastructure earn high Sharpe ratios while all-star firms fail? The answer is capacity (from Chapter 2).
- Key claims: The key to the mystery is capacity — it is "far, far easier to generate a high Sharpe ratio trading a $100,000 account than a $100 million account"; low-capacity profitable strategies act as market makers, providing short-term liquidity and taking quick profits, a niche large funds cannot use.
- Learner-relevant: Small accounts can exploit simple, profitable strategies that are structurally out of reach for big funds — a reason to be optimistic about independent trading.

### Why Large Funds Fail: Liquidity, Competition, and Constraints
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Conclusion]]`
- Summary: Details three structural disadvantages of large funds: they become the party needing liquidity and must hold longer (exposing them to regime shifts); competition forces overleverage and over-complex models that invite data-snooping bias while funds hold similar positions (Chapter 6); and institutional constraints on strategies reduce returns.
- Key claims: Any institutional constraint (e.g., no long-only, no futures, must be sector-neutral) "tends to decrease its returns"; managers often impose non-quantitative whims, force fast scaling on winners and liquidation on losers, and may not understand quantitative technique.
- Learner-relevant: Every added constraint on a strategy is a lost degree of freedom — the independent trader is closer to the mathematical optimum.

### Misaligned Incentives: Trading Other People's Money
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Conclusion]]`
- Summary: When trading other people's money, upside is nearly unlimited while downside is merely being fired, so traders are driven toward riskier strategies despite risk controls.
- Key claims: Jérôme Kerviel's rogue trades cost Société Générale $7.1 billion and may have indirectly triggered an emergency Fed cut; Kerviel evaded controls for three years because back-office/IT familiarity let him bypass procedures. The author recounts a similar rogue trader at his own bank who fabricated false profits until a computer crash exposed him.
- Learner-relevant: Trading your own money aligns risk with reward in a way institutional employment cannot.

### Next Steps: Growing the Trading Business
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#Next Steps]]`
- Summary: Once a few simple strategies are running, growth comes from increasing the number of strategies, not just Kelly-formula scaling (which is capped by capacity). Beyond capacity, the business grows by investing in data, infrastructure, and personnel.
- Key claims: To grow, look for higher-frequency strategies (requires upgrading infrastructure and buying expensive high-frequency data) or longer-hold strategies (lower Sharpe but higher capacity, needing fundamental data); branch into futures/currencies; form collaborations or hire consultants; automate fully; eventually take on investors or sell a track record for a profit-sharing contract.
- Learner-relevant: Strategies lose potency over time and every decade or so regime changes kill strategies, so ongoing research is mandatory — but as long as markets demand instant liquidity, "there will always be a profitable niche for quantitative trading."

### MATLAB: What It Is and Why Backtest With It
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#A Quick Survey of MATLAB]]`
- Summary: Introduces MATLAB (Mathworks) as the platform used for most strategy examples in the book — an interpreted, array-processing language with an integrated editor/debugger, ideal for portfolio strategies over hundreds of stocks that are hard to backtest in Excel.
- Key claims: It is interpreted (like Visual Basic, unlike C) but far more powerful than Excel/VB thanks to built-in math functions and array processing; many C/VB loops collapse to one line; it has extensive text-processing facilities, a graphics library (many book figures are MATLAB-generated), and code can be compiled into C/C++ executables.
- Learner-relevant: MATLAB's vectorization and graphics make it a practical choice for backtesting multi-stock strategies.

### MATLAB: Basic Syntax and Array Initialization
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#A Quick Survey of MATLAB]]`
- Summary: Covers the core syntax: no declarations needed, `%` for comments, `;` suppresses printing, and `ones(m,n)` for mass initialization.
- Key claims: `x(1)=0.1; x(2)=0.3; x(3)=0.2;` initializes a row vector without declaring size; `y=0.8*ones(1,3)` fills a 3-vector with 0.8.
- Learner-relevant: Learners can start assigning arrays immediately without boilerplate declarations.

### MATLAB: Vectorized Operations vs. Loops
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#A Quick Survey of MATLAB]]`
- Summary: Shows the `for` loop and its one-line vectorized equivalent, then subarray selection, deletion, and concatenation.
- Key claims: `for i=1:3, z(i)=x(i)+y(i), end` becomes `z=x+y`; `w=x([1 3])+z([2 1])` selects and adds reordered elements; `x([1 3])=[]` deletes elements; `u=[z([1 1]); w]` concatenates by rows (with `;`) and `v=[z([1 1]) w]` by columns (without).
- Learner-relevant: This is the core "vector-processing" idiom — replacing loops with array operations is the main productivity win.

### MATLAB: Logical Indexing and `find`
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#A Quick Survey of MATLAB]]`
- Summary: Explains selecting subarrays with logical arrays rather than index arrays.
- Key claims: `vlogical=v<1.1` produces a logical array of 1s/0s; `vlt=v(vlogical)` and the shorthand `vlt=v(v<1.1)` select matching elements; `idx=find(v<1.1)` returns the actual indices `[1 2]`.
- Learner-relevant: Logical indexing is the concise idiom for filtering data (e.g., selecting days where a condition holds).

### MATLAB: Multidimensional Arrays, Transpose, and Cell Arrays
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#A Quick Survey of MATLAB]]`
- Summary: Moves to 2-D matrices and their manipulation, then cell arrays for non-numeric contents.
- Key claims: `x=[1 2 3; 4 5 6; 7 8 9]` builds a 3×3 matrix; `:` selects a whole row/column (`x(1,:)`, `x(:,2)`); `x(1,:)=[]` deletes a row; transpose is the single quote `'`; cell arrays like `C={[1 2 3]; ['a' 'b' 'c' 'd']}` hold strings or arrays.
- Learner-relevant: `:` row/column selection and cell arrays are essential for handling time-series and mixed-format data.

### MATLAB: Built-in Functions and Toolboxes
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#A Quick Survey of MATLAB]]`
- Summary: Notes that most built-in functions operate element-wise on whole arrays, then lists the functions and toolboxes the author actually uses.
- Key claims: Element-wise `log(x)` applies to every element at once; the author's used functions include `sum, cumsum, diag, max, min, mean, std, corrcoef, repmat, reshape, squeeze, sort, sortrow, rand, size, length, eigs, fix, round, floor, ceil, mod, factorial, setdiff, union, intersect, ismember, unique, any, all, eval, eye, ones, strmatch, regexp, regexprep, plot, hist, bar, scatter, try, catch, circshift, datestr, datenum, isempty, isfinite, isnan, islogical, randperm`. Useful toolboxes include optimization, PDE, genetic algorithms, statistics, neural networks, signal processing, wavelet, financial, financial derivatives, GARCH, financial time series, datafeed, and fixed-income.
- Learner-relevant: This is the concrete command vocabulary a learner needs; free community toolboxes (LeSage Econometrics, Murphy Bayes Net, Sheppard GARCH) reduce cost.

### MATLAB: User-Defined Functions and a Personal Utility Library
- Locator: `[[sources/quant-resource/Quantitative Trading How to Build Your Own Algorithmic Trading Business.pdf#A Quick Survey of MATLAB]]`
- Summary: Concludes by encouraging writing custom functions and building a homegrown library of reusable utilities.
- Key claims: All the book's example functions are downloadable from www.epchan.com/book; growing a personal utilities library increases strategy-development productivity.
- Learner-relevant: A reusable function library compounds productivity as strategies accumulate.

