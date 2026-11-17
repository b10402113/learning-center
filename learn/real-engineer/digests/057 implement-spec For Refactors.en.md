---
source: sources/real-engineer/20261116/course/057 implement-spec For Refactors.en.txt
source_type: text
source_lines: 171
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L202
  - cohort-005-project.6.part.md#L1-L42
---

# L1 overview

- 這課把前一課的 grilling 走完，再依序 to spec、to tickets、implement spec；作者明言是給想看完端到端流程的人，可以跳過。
- grilling 的一個關鍵決策：viewer 與 per-course 權限合成一個 module 的兩個 entry point（候選 B），因為這批 code 屬於同一件事。
- viewer 這個詞被放棄，經 domain modeling 改叫 person，以接上 glossary 既有的四種角色（student、instructor、platform admin、team admin）。
- 也拒絕硬造「course steward」之類的新詞，改用能力命名（can manage the course…）；`courseAccess` 選擇回傳 decision 而不是 throw。
- grilling 抖出一連串真 bug：seat claim 把 team licence country 與學生國家比較而擋下申領、seat 學生自己沒購買所以 `getAccess` 從不擋、platform admin 反而被某些地方擋在外面。
- 新 glossary 詞：purchasing power price（依買方國家折扣的價格）與 country lock（以此價格購入的購買只能在該國使用），並為此開 ADR。
- 用了 design it twice（出自《A Philosophy of Software Design》）：派三個 sub-agent 各做最小介面、彈性介面、最常見 caller 最好用的介面，再挑混合方案。
- 最終 `app/permissions` module 有 `person.server.ts` 與 `coursePermissions.server.ts` 兩個 entry point，暴露 decide、getCourseDecisions、requireCapability；`npm run check` 通過 644 個測試。

# L2 detail

- `#L1-L6` — 接續前一課的 grilling，然後 to spec、to tickets、implement spec。作者說是為了課程完成論者而錄，想看完整流程的人可以留下，否則可跳過。
- `#L7-L17` — Q1：這輪要不要順手修掉 access bugs？要。Q2：該做一個 module 還是兩個？候選二是把 request 變成 viewer、候選一決定 viewer 對課程能做什麼；skill 建議 B（一個 module、兩個 entry point），作者同意，因為這些 code 屬於同一件事。Q3：viewer 要不要帶當前 country？作者注意到「viewer」這個詞越用越順但不太喜歡，想做點 domain modeling，找更貼近既有 glossary 的說法；同時擔心若讓 viewer 帶 country，`resolveCountry` 可能在不需要的地方被呼叫（只有部分 PPP 檢查需要），不過若呼叫不貴就無妨。
- `#L18-L29` — Q4：怎麼稱呼「擁有該課的 instructor 或 platform admin」？選項是造一個像 course steward 的詞，或不用名詞、直接以能力命名（can manage the course、can moderate discussions）；skill 建議 B，作者同意——不需要就不必硬加術語。Q5：`courseAccess` 該 throw 還是回傳 decision？作者認為回傳樸素的 decision 即可。Q6：seat claim 是否該比一般 content 更嚴格？現況是 team licence 的 country 與學生 country 不同就擋下申領，作者確認這是意外行為，值得質疑。
- `#L30-L44` — Q7–Q8 又挖出 bug：seat 學生自身沒有購買紀錄，所以 `getAccess` 從不擋他們，只在申領座位時檢查一次、之後不再檢查（作者同意 skill 的建議先維持現狀）。Q8 是 platform admin 目前被某些功能擋在外面，顯不合理——平台管理員應該什麼都能存取。接著 Q9：該怎麼稱呼簽入的人而不是 viewer？glossary 已有 student、instructor、platform admin、team admin 四種角色，卻沒有「發出這個 request 的人」的詞；文件已非正式地用 person，於是採用 person。Q10–Q11：module 要回答哪些 per-course capabilities、某些 code 放哪裡，作者都同意建議。
- `#L45-L63` — Q12 是 glossary 命名，成果出色：purchasing power price（依買方所在國家設定的折扣價）與 country lock（以 purchasing power price 購入的購買，只能在購買國使用）。作者稱讚 agent 很擅長 brainstorm domain 術語，這兩個詞他自己想會更慢。Q13–Q14（empty state 等）直接同意。接著 skill 呼叫 domain modeling 更新 `glossary.md`，寫入這兩個詞；作者照例掃一遍確認沒夾帶實作細節，覺得 country lock 那條有點臃腫，要求精簡。之後討論 module 與 entry point 命名，作者很滿意。
- `#L64-L91` — 提到藏在 codebase design／improve-codebase-architecture skill 裡的技巧：design it twice。出處是《A Philosophy of Software Design》的一章——把同一個介面設計兩次再互相比較、取兩者之長；在 AI 時代成本只是 token，所以派兩個 sub-agent 各做一份再挑。作者說自己都忘了 skill 有這招，因為不常用。Q18–Q19 是如何追蹤這批工作——答案就是 spec + tickets。country lock 的敘述被改寫得更乾淨：「以 purchasing power price 購買的購買只對購買國有效」，不會隨實作變動。接著它設計了三個介面：最小介面、為彈性設計、讓最常見 caller 變得最簡單；因為這函式幾乎每個 route 都會用到，值得燒 token 做對。
- `#L92-L113` — 三個設計：A 走彈性，caller 以動作詢問（`coursePermissions.require(person, slug, "lesson.complete")`）；B 最小，例如 `demand`、`courseCapabilitiesOf`；C 以最常見 caller 為中心，直接 `requireCapability`、`requirePlatformAdmin`。作者說自己平常不太審這些，除非想學 API 設計；skill 建議 B 與 C 的混合，並附上 depth 與 locality 的比較，作者接受。後面還有幾題 grilling，並指出把設計落成（哪怕只是 pseudocode）會抖出先前沒想到的事，可能需要再 grill 一輪——Q24 已能寫出「country locked student」這種句子，正是 glossary 的回報。
- `#L114-L133` — 作者強調建立 domain language 的儀式感有點繁瑣，但這些小句子會不斷回本。skill 也問是否要為「team licence 的 country lock 只在申領座位時適用」開 ADR，作者同意，因為這確實不直覺。至此共識成形：`app/permissions` module、bug fixes、country lock 行為變更與測試。接著用 to spec 轉成規格——它會主動問要在哪些 seams 測試，正好呼應整節課的主題，作者全部接受。規格發布成 GitHub issue；有一項 needs action（glossary 變更與新 ADR 要進 main），作者通常直接 commit 到 main（或走 PR）。
- `#L134-L153` — to tickets 產生一張有向無環圖，共 11 張票；作者對 refactor 一向寬鬆審查，因為重構很耗 token，於是直接說 tickets look good。清空 context 後以 `implement spec 36` 執行；結果在本地分支 `spec-36-permissions` 上，`npm run check` 通過 644 個測試。新 module 位於 `permissions`，有兩個 entry point：`person.server.ts` 與 `coursePermissions.server.ts`；因為它明確宣告依賴（database），seam 是內建的。介面暴露 decide、getCourseDecisions、requireCapability。實際使用上，`course.lessons.quiz.tsx` 只憑 request 就要求 manage 這門課的 capability，砍掉各 route 大量重複 code；`people.requirePlatformAdmin` 也被 loader 直接使用。
- `#L154-L171` — 檢視測試：有 fixtures（owning instructor 等），`permissions.decide` 回答「這個人或沒有人可否 view、take、manage 這門課」，內容相當完整。作者總結這一節：permission 結構大幅改善，現在有一個邊界被強制執行、caller 能拿到高 leverage 的 deep module；每個 agent 建功能都會更省 token，測試更能反映真實行為、tautological test 更少且會一直如此。只要持續在 feature work 旁一步步往上爬、持續改善 codebase，agent 的表現就會越來越好。
