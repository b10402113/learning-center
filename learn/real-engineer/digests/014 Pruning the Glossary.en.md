---
source: sources/real-engineer/20261116/course/014 Pruning the Glossary.en.txt
source_type: text
source_lines: 19
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L370
---

# L1 overview

- 比喻：給作者一個抽屜就會被塞滿線材；給 agent 一個 markdown 檔，它就會塞滿垃圾。
- 練習：`npm run reset` 到 `seed-bloated-glossary` commit，`GLOSSARY.md` 多了一個 `other terms` 區塊，裡面有些未必屬於這個領域。
- 任務：跑 `grill-with-docs` session，把 glossary 修剪到只剩真正需要的東西。
- 這是任何高 churn repo 的 markdown 檔自然會發生的沉積現象，且示範用的沉積算客氣了——現實中有數百到數千行、多數條目根本沒在用。
- 修剪能力是操作 domain language 的必備技能，目標是留下一份尖銳、可再用的 glossary。

# L2 detail

- `#L1-L3` — 以抽屜塞線材比喻 agent 塞 markdown：給 agent 一個 markdown 檔，它最後會把垃圾塞滿。
- `#L4-L10` — 執行 `npm run reset`、重設分支到 `seed-bloated-glossary`，看到 `GLOSSARY.md` 被加了 `other terms` 區塊，內容未必屬於這個領域；本課任務就是修剪它並整理出修剪規則。
- `#L11-L19` — 這是 markdown 檔（尤其高 churn repo、有成員不用這些 skill 時）的自然沉積；作者的示範不算多，見過幾百上千行、大量未使用詞條的檔案。任務是開 agent 跑 `grill-with-docs`，要求把 glossary 修剪到只剩需要的部分，最後得到一份可再用的尖銳 glossary。
