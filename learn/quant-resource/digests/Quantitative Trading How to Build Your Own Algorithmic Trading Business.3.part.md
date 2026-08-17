# Digest — Quantitative Trading How to Build Your Own Algorithmic Trading Business (part 3)

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
