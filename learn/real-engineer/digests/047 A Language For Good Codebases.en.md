---
source: sources/real-engineer/20261116/course/047 A Language For Good Codebases.en.txt
source_type: text
source_lines: 153
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L214
---

# L1 overview

- tautological test 只是把實作內容再講一遍（例如斷言 `MAX_RETRIES === 3`）：它測的是 code 的形狀，不是行為，所以毫無價值。
- 該怪的不是 agent，而是允許這種測試被寫出來的 codebase：把資訊藏進 module，壞測試就寫不出來。
- module = interface + implementation；interface 是呼叫者必須知道才能正確使用的一切，implementation 是藏在裡面的實作本體。
- depth = 「呼叫者每學一單位 interface，能換到多少 behavior」；`JSON.parse` 是深 module 的範本（小介面、龐大行為）。
- leverage 是 caller 從深 module 得到的東西，locality 是 maintainer 得到的東西；這兩個性質正是讓 codebase 對 agent 友善的關鍵。
- 深 module 也讓測試只能測對外暴露的 flow，於是 leverage 加倍作用在測試上，抓到的 bug 更多、codebase 更好改。

# L2 detail

- `#L1-L22` — 從 X 上的爭論切入：agent 寫很多爛測試，那是否乾脆禁止 agent 寫測試？作者先承認 agent 傾向寫 tautological test——用常數 `MAX_RETRIES = 3` 與一個只斷言它等於 3 的測試示範；這種測試不測行為、只斷言 code 形狀。真正的病灶是 codebase 讓這種測試得以存在。
- `#L23-L41` — 解答是 codebase design skill：它的主體是一份 glossary。困難在於 agent 每次對話都從不同流派挑字（這次 hexagonal architecture、下次 DDD），glossary 用一組固定詞彙把你鎖住。詞彙多為借來的：module、interface、implementation、depth、seam、adapter、leverage、locality；懂完這八個詞就懂整張圖。
- `#L42-L60` — 定義 module（codebase 內互相通話的區塊，極少是單一巨大 chunk）與它的兩半：interface 是呼叫者需要知道的一切（以 `JSON.parse` 為例：要傳 JSON、會回傳 JS object、非合法 JSON 會丟錯），implementation 是內部為了完成目的所做的一切（tokenizer、escape、surrogate pair、數字格式、錯誤位置、reviver）。`JSON.parse` 把巨量實作藏在相對簡單的 interface 後面。
- `#L61-L70` — 用 depth 判斷 module 好壞：depth 即 Ousterhout 說的「呼叫者每單位 interface 換到的 behavior 量」。`JSON.parse` 幾乎不用學就換到極大價值，因此是 deep module。
- `#L71-L96` — 反例：一個 Git module 把 `ensureIsGitRepo`、`fetch`、`merge` 都暴露出去，呼叫者要學三個函式且永遠得按正確順序呼叫；改成 `deepGit` 只暴露一個 `pull`（內部依序檢查、fetch、merge），呼叫者只需記一個函式。這個好處叫 leverage，且 module 被呼叫越多次越重要——12 個 shallow caller 總有一天會把順序搞錯。
- `#L97-L115` — locality 是 maintainer 得到的好處：要改 pull 的行為，不必逐一走訪 caller，只改那個 canonical 實作，一次修好、全部生效。附帶好處是深 module 讓你放心忘掉 implementation，只用 interface 思考；整個 codebase 都由深 module 組成時，腦中只需記住 interfaces，implementation 可以外包給 agent。
- `#L116-L138` — 回到測試：shallow module 必然讓 agent 為每個函式各寫一個測試，卻未必測它們「照實際方式一起運作」的 flow（fetch 與 merge 可能整合不良）。深 module 讓 agent 沒有選擇、只能測你暴露的 flow，因此 leverage 雙向生效：code 呼叫端與測試都拿到高 leverage，測試覆蓋更多 app、抓更多 bug。
- `#L139-L153` — 收束：好 codebase 裡那個 `MAX_RETRIES` 常數根本不會暴露給測試，它被藏在 interface 之後，這就是「讓壞測試不可能寫出來」。本章後續會把 shallow module 改造成 deep module，收割 leverage（code 與測試）與 locality，讓 agent 更容易導航。
