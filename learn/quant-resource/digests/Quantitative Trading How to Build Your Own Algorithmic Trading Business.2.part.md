# Digest — Quantitative Trading How to Build Your Own Algorithmic Trading Business (part 2)

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
