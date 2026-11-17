---
source: sources/real-engineer/20261116/course/018 Q&A _ Domain Language.en.txt
source_type: text
source_lines: 97
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L370
---

# L1 overview

- 一份 glossary 常常不夠：quiz 的 `question` 與 discussion 的 `question` 是不同東西，先靠前綴（`quiz question` / `discussion question`）分開，就像 `platform admin` 與 `team admin` 從不單稱 admin。
- 前綴太多時就表示有兩個 bounded context 硬塞進同一份 glossary；`domain-modeling` 支援 root 單一 context，或用 `GLOSSARY-MAP.md` 對應多份 glossary，ADR 也可全域或分 context。
- glossary 要在寫 spec 之前就合併：先改 glossary、必要時先改程式命名，spec 與 ticket 才指向正確的檔案。
- 好詞來自使用者：把產品用語對齊使用者心裡的說法。
- 不需要一開始就有 glossary，可以邊做邊長；但只建真正需要的條目，慢慢來，否則做出品質差、之後還要修剪的條目。
- 不能讓 agent 獨自擁有 glossary——那是把 glossary 變成 dumpster fire 最快的方法；維護 glossary 是人對 code base 健康度最高價值的貢獻之一。

# L2 detail

- `#L1-L2` — 收束本節：domain language 怎麼運作、ADR 怎麼運作、如何用 `grill-with-docs` 在動工前把語言磨利，以及這些做法帶來的好處；接著進入常見問答。
- `#L3-L16` — Q1「一份 glossary 夠嗎？應用變大怎麼辦？」以 Cadence 的 quiz `question`（有 DB entity）與 lesson `discussion` 裡的 question / answer 為例：若都叫 question 很快就混亂。解法是一直加前綴（`quiz question`、`discussion question`），永不單說 question；這與 `platform admin` / `team admin` 不單稱 admin 同理，且已寫進 glossary 的 avoid 區段。
- `#L17-L36` — 但前綴過多時，代表其實有兩套對話、兩套用詞。引用 Eric Evans：大型專案同時存在多個 model，理想上全公司共用一套語言，實務上各部門不同。以 refund / chargeback 為例，產品只需 refund 一個詞，finance 部門另有更細的 model；兩者都對，這是兩個 ubiquitous language，DDD 稱之為 **bounded context**。同一 repo 若有多個 context 就要明示：`domain-modeling` 支援 root 單一 context，或 `GLOSSARY-MAP.md` 對應不同區塊的 glossary；ADR 也可全域共用或只屬於某個 context。規則是：感覺有兩個 bounded context 要塞進同一份 glossary 時就拆。
- `#L37-L48` — Q2「什麼時候 ship glossary 更新？」在 grill-with-docs → spec → ticket → implement → code review 的迴圈中，作者主張在**寫 spec 之前**、決策與團隊確認後就合併 glossary；需要改名的程式也在 spec 之前改，這樣 spec 與 ticket 指向的檔名已經是新的，code base 更好導覽。
- `#L49-L60` — Q3「怎麼挑好詞？」我們多數時候是為別人、為真實使用者做產品，最好的領域語言來自使用者。把產品用語對齊使用者心裡的想法，產品就既好用又好維護；做法很簡單：認真聽使用者，從他們的說法裡挖 glossary 條目。專案早期尤其該多跟使用者談，才能正確 model 需求。
- `#L61-L78` — Q4「用 grill-with-docs 需要先有 glossary 嗎？」不需要——本節示範了從零開始慢慢長出來。作者認為 glossary 永遠不會完成，邊緣總有可定義的東西；而且新增與修剪都很費思考，等於即時釐清產品。建議慢慢走、只建此刻要建的東西所需條目，因為趕出來的條目品質差、之後還得修剪。
- `#L79-L88` — Q5「能讓 agent 獨自擁有並維護 glossary 嗎？」作者認為那是最快把 glossary 變成 dumpster fire 的方式。這種語言的價值在 ubiquitous：程式、團隊、產品都用它；團隊是人加上 agent，agent 若自行發明術語就會與團隊脫節。結論是不行，且維護 glossary 是人對 code base 健康度最高價值的貢獻之一。
- `#L89-L97` — 收尾：鼓勵去找出定義自己產品的語言；延伸閱讀是 Eric Evans 的「藍皮書」（會附連結）與 Vaughn Vernon 的著作。重申核心：ubiquitous language、找到對的字、並讓這些字在產品各處都被使用。
