---
source: sources/real-engineer/20261116/course/046 Rescuing A Legacy Codebase.en.txt
source_type: text
source_lines: 71
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.2.part.md#L1-L2264
---

# L1 overview

- Vibe coding 借用 Andrej Karpathy 的定義：完全不看 code、把 code 當不存在；這種 codebase 常已上線，卻沒人敢動。
- 對 coding agent 來說，codebase 就是它的 environment：它看到的 code、能跑的測試、型別檢查、自動化檢查，全部是環境的一部分；環境隨便做，agent 就難做事。
- 複雜度（complexity）的定義取自 John Ousterhout《A Philosophy of Software Design》：任何與系統結構相關、讓系統難以理解與修改的東西；所以好的 codebase 就是「容易改」的 codebase。
- 程式設計有兩個活動：tactical programming 是眼前把 bug 修掉、功能上線、測試轉綠；strategic programming 是讓 codebase 長期健康。
- Ousterhout 的 tactical tornado 是產出極快但完全戰術導向、留下一路廢墟的工程師；agent 正是 tactical tornado，而且樂此不疲。
- SWE benchmark 這類排行榜只量 tactical 完成度（任務有沒有做完），不量 codebase 做完之後變好還是變壞。
- 結論：strategic 的責任只能由你承擔——你手上有一百個 tactical programmer，但他們需要有人替他們想長期。

# L2 detail

- `#L1-L11` — 說明本段前提：可能你自己 vibe code、也可能接手別人的 vibe coded codebase；程式大致能跑、甚至已上線，但你對它感到害怕。引用 Karpathy 的原始說法（give into the vibes、forget that the code even exists、不再讀 diff）指出 vibe coding 就是不看 code 的 coding。
- `#L12-L22` — 用 model／harness／agent／environment 的圖說明：model + harness 組成 agent，agent 在某個 environment 裡運作；對 coding agent 而言 environment 就是你的 codebase（看得到的 code、可存取的資料、能跑的測試、型別檢查、自動化檢查）。環境若毫無照料地生成，agent 註定難工作。
- `#L23-L31` — 2026 年初作者投入改善 agent 環境，主要參照 Ousterhout《A Philosophy of Software Design》。定義 complexity 為「系統結構中讓系統難以理解與修改的任何東西」，並由此推出：好 codebase 就是容易改的 codebase；難改的 codebase 會在 agent 改一處時產生無法預測的漣漪。
- `#L32-L43` — 借用 Ousterhout 的兩種編程活動：tactical programming 是地面上的士官，只管打字、驗證、讓東西能動；strategic programming 是想贏整場戰爭的將軍，管 codebase 的長期健康。人類開發者通常會在改動時混合兩者。
- `#L44-L71` — 但並非所有開發者都如此：Ousterhout 的 tactical tornado 產出遠快於同僚、卻完全 tactical，留下一路破壞；這段 2018 年的文字用來形容 agent 再貼切不過。agent 只看到眼前任務，不會問 codebase 是否正在變差；排行榜也只衡量任務完成與否。因此若要環境隨時間變好，必須有人承擔 strategic 工作，而那個人就是你。
