# Digest — Quantitative Trading How to Build Your Own Algorithmic Trading Business (part 5)

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
