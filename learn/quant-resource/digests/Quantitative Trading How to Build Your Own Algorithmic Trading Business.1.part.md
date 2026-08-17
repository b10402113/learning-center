# Digest — Quantitative Trading How to Build Your Own Algorithmic Trading Business (part 1)

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
