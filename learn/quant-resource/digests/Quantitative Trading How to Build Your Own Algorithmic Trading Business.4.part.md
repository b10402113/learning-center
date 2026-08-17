# Digest — Quantitative Trading How to Build Your Own Algorithmic Trading Business (part 4)

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
