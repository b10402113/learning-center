---
name: coverage-audit
description: 檢查 learn/<subject> 對 sources/<subject>/course 的內容覆蓋率，列出覆蓋缺口，預設 80% 過關。當使用者要審查課程覆蓋率、找漏教內容或補課時使用。
argument-hint: "<subject> [--threshold <percent>] [--min-gap <lines>]"
---

Invoke as `/coverage-audit <subject> [--threshold <percent>] [--min-gap <lines>]`.

用 citation 的行覆蓋率當硬門檻，再人工把「過場」和「真缺口」分開。Citation 是代理指標：它量的是 step 引用的行範圍，不是文章實際教得多深，所以每個低覆蓋檔都要抽讀一段已引用內容確認文章真的教了。

1. **跑審查**

   ```bash
   node scripts/coverage-audit.mjs --subject <subject> [--threshold 80] [--min-gap 8]
   ```

   輸出有 TOTAL、每檔覆蓋率，以及 `Uncovered runs >= 8 lines` 的缺口清單；exit code 就是過關結果（0 = 達門檻）。要接其他工具時加 `--json`。

   完成標準：指令跑完，拿到 TOTAL、低覆蓋檔清單與所有列出缺口。

2. **分類每個缺口**

   逐個讀 `Uncovered runs` 裡的來源範圍，分成三類：

   - **真缺口** — 定義、取捨、步驟、比較、範例程式、選型建議等會在產品裡用到的內容。
   - **過場** — 自我介紹、課程動機、章節總覽、產品介紹、觀眾 Q&A。
   - **live coding 示範** — 逐字操作、貼輸出；示範裡若帶出新概念（例如每個 chain 步驟可換不同模型），只有那段算真缺口。

   順手從每個低覆蓋檔抽讀一個已引用範圍，確認文章在教而不只是列 citation。

   完成標準：每個列出的缺口都有一個分類與一行理由；每個低覆蓋檔都抽讀過一段已引用內容。

3. **確認是否只是沒對到來源**

   對每個真缺口，用它的 leading words 在 `learn/<subject>/nodes` 搜一輪。概念若已在別的 citation 下教到，標成 `已教／未對應來源`；搜不到才標成 `缺`。

   完成標準：每個真缺口都帶 `已教／未對應來源` 或 `缺`。

4. **判定並報告**

   總覆蓋率 `>=` threshold 是 PASS，`<` threshold 是 FAIL。數值門檻是唯一的過關條件；真缺口照列，供下一輪補課。

   ```text
   Verdict: PASS — 84.6% (threshold 80%)

   | 來源檔 | 覆蓋 | 真缺口 |
   | --- | --- | --- |
   | 13-what-is-a-single-agent-system | 32.5% | 模型維護與選型 L78-L237 |

   Missing content:
   1. <concept> — <source path:lines> (~N lines)
   ```

   排序：先列 FAIL 或缺口最大的檔。每個真缺口寫出概念、來源行號、估計行數與 `缺`／`已教／未對應來源`。

   完成標準：報告有 Verdict、低覆蓋檔表，以及每個真缺口的概念、行號、行數與標記。

5. **收尾**

   要補內容時走 `/article` 或 `/absorb`，把缺口變成某個 step 的來源與文章；每段新增內容都要有 teaching purpose。補完重跑第 1 步。

   完成標準：重跑後 PASS，而且先前每個真缺口都已補上，或被 learner 明確接受保留。

**預設 threshold 80；嚴格審查用 `--threshold 90`。`sources/` 保持唯讀。**
