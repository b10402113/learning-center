---
subject: grokking-ai
status: draft
path: concept-first
created: 2026-11-19
---

# ROADMAP — grokking-ai

## Goal

把《Grokking the AI System Design Interview》的 70 課，整理成一條「從心智模型到能在 45 分鐘內講完一場 AI 系統設計」的學習路徑。（MEMORY.md 的 Goal 尚未填寫，之後可補。）

## Learning path

**概念優先（concept-first）。** 這條路徑先建立可遷移的心智模型，再往下補機器，最後才練實戰與複習。

- **Tier 1 打地基**：這場面試考什麼、三種題型家族怎麼分、系統一旦會學習改變了什麼、回答任何題目的七步框架、以及怎麼把一句模糊的需求界定成可設計的題目。這五個 node 之後每一層都會回來引用。
- **Tier 2 拆機器**：預測型系統的離線面／線上面／回饋迴路、資料與標籤、特徵、推論模式、語意檢索、服務與 rollout、評估、監控、線上實驗。先懂「零件」，後面每個設計題都只是重新組裝這些零件。
- **Tier 3 預測型設計題**：推薦、動態牆、搜尋、廣告、詐騙、有害內容。每題都只比前一題多一個需求，因此照順序讀時，新東西永遠只有一個。
- **Tier 4 生成型與 LLM**：把 LLM 當一個元件（prefill／decode）、推論經濟學、三層服務優化、提示與微調與 RAG 的診斷、評估、RAG 管線、混合檢索與 grounding。
- **Tier 5 產品與代理**：六階段請求路徑、護欄、代理迴圈與工具契約、代理的評估與自治。
- **Tier 6 實戰與複習**：六個 capstone、案例研究法與評析、七個系統設計案例、以及考前回想練習。

排序原則：**每個概念只有一個家**。例如「embedding 與向量檢索」只在 Node 11 完整教，RAG 的 node 引用它而不重教；「提示 vs 微調 vs RAG」只在 Node 24 教；12 個紅旗與決策表只在 Node 38。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 心智模型

1. **[AI 系統設計面試的全貌](nodes/ai-interview-landscape.md)**
   - Goal: 說出這場面試考什麼、五種題目形式、你的角色該深入哪一區，以及每次都要交代的四件事。
2. **[三種題型家族](nodes/three-question-families.md)**
   - Goal: 用「模型輸出什麼」判斷預測型／生成型／代理型，並各說出該家族的設計重心與經典錯誤。
3. **[系統開始學習後改變了什麼](nodes/what-changes-when-system-learns.md)**
   - Goal: 說出四個被打破的經典假設，以及每一個各自需要的新元件。
4. **[回答 AI 設計題的七步框架](nodes/seven-step-framework.md)**
   - Goal: 講出七步的順序、每一步的產出，以及 45 分鐘如何分配到這七步。
5. **[把模糊的 AI 設計題界定成可設計的範圍](nodes/scoping-the-question.md)**
   - Goal: 用五個動作把「長官想用 AI」變成一個有家族、有指標、有數字、有範圍的設計題。

### Tier 2 — 預測型系統的機器

6. **[ML 系統的基本結構](nodes/ml-system-planes.md)**
   - Goal: 畫出離線面、線上面與回饋迴路，並說出模型 registry、logs、feature store 三者怎麼把兩面接起來。
7. **[訓練與服務是兩個系統](nodes/training-vs-serving.md)**
   - Goal: 用「兩個系統共用一個模型」開場，說明兩邊的取捨、訓練管線四階段，以及 skew 與 rollback。
8. **[訓練資料與標籤從哪裡來](nodes/labels-and-training-data.md)**
   - Goal: 依成本、延遲與偏差選標籤來源，並處理類別不平衡、時間切分與洩漏。
9. **[特徵與特徵儲存](nodes/features-and-feature-stores.md)**
   - Goal: 從五種訊號源取特徵，說出批次／串流／請求時三條路徑與 point-in-time 正確性。
10. **[批次推論與線上推論](nodes/inference-modes.md)**
    - Goal: 用「預測是否需要請求當下的資訊」選推論模式、更新節奏與預算浪費的修法。
11. **[語意表徵與向量檢索](nodes/embeddings-and-vector-search.md)**
    - Goal: 解釋 embedding、ANN 與向量索引的取捨，並判斷什麼時候根本不該用它們。
12. **[模型服務的基本功](nodes/model-serving-and-rollout.md)**
    - Goal: 說出延遲預算怎麼切、P99 怎麼看、rollout 階梯與 fallback 階梯怎麼設計。
13. **[離線評估：挑對指標](nodes/offline-evaluation.md)**
    - Goal: 依輸出形狀與 base rate 選指標，並區分「排序能力」與「校準」這兩件事。
14. **[監控、漂移與重訓](nodes/monitoring-drift-retraining.md)**
    - Goal: 分開資料漂移與概念漂移，並用四層監控與三種重訓節奏回應。
15. **[線上實驗與 A/B 測試](nodes/online-experiments.md)**
    - Goal: 說明為何離線只是篩選，並講清 shadow→canary→A/B 的順序、護欄與讀數陷阱。

### Tier 3 — 預測型設計題

16. **[設計推薦系統](nodes/recommendation-and-funnel.md)**
    - Goal: 用檢索→排序→規則的漏斗回答推薦題，並講清召回、位置偏差與延遲預算。
17. **[設計動態牆與搜尋排序](nodes/feed-and-search-ranking.md)**
    - Goal: 說出多目標價值公式怎麼組，以及「多了一個 query」改變了檢索與排序的哪些部分。
18. **[設計廣告點擊預測](nodes/ad-click-prediction.md)**
    - Goal: 說明 PCTR 為何必須校準，以及延遲轉換與冷啟動怎麼處理。
19. **[設計詐騙偵測](nodes/fraud-detection.md)**
    - Goal: 用成本不對稱設門檻，並處理對手、延遲標籤與被審查的資料。
20. **[設計有害內容偵測](nodes/harmful-content-detection.md)**
    - Goal: 畫出風險漏斗，並解釋為何用曝光率而不是上傳數衡量成效。

### Tier 4 — 生成型與 LLM

21. **[面試高度上的 LLM](nodes/llm-at-interview-altitude.md)**
    - Goal: 把 LLM 當一個元件，講出 prefill／decode、TTFT／TPOT，以及 context assembly 為何是設計工作。
22. **[推論經濟學與信封背面估算](nodes/inference-economics.md)**
    - Goal: 用「單價一個單位 × 量」算出帳單，並判斷自架與 API 的損益兩平點。
23. **[服務優化三層架](nodes/serving-optimizations.md)**
    - Goal: 依序講出避免呼叫、調引擎、換模型三層優化，以及每一層的代價與量測方式。
24. **[提示、微調，還是 RAG](nodes/prompting-finetuning-or-rag.md)**
    - Goal: 用「缺事實還是缺行為」診斷，說出三者的分工、上線時機與不可跨越的紅線。
25. **[評估 LLM 系統](nodes/evaluating-llm-systems.md)**
    - Goal: 說出評估金字塔、judge 怎麼校準，以及 golden set 為何要像 CI 一樣跑。
26. **[RAG 管線：從切塊到回答](nodes/rag-pipeline.md)**
    - Goal: 講出 ingestion 六階段與請求路徑五階段，並指出品質在哪一步就被決定。
27. **[混合檢索、重排與有據可查的回答](nodes/hybrid-search-and-grounding.md)**
    - Goal: 依查詢形狀選 BM25／向量／RRF，並用四層 grounding 把每個 claim 綁回證據。

### Tier 5 — 產品與 Agent

28. **[生成式 AI 產品的六階段請求路徑](nodes/genai-product-designs.md)**
    - Goal: 畫出 gateway→輸入閘→組稿→路由→輸出閘→交付，並說出四種產品原型各自的瓶頸。
29. **[安全與護欄](nodes/safety-and-guardrails.md)**
    - Goal: 解釋 prompt injection 為何關不掉，並用護欄三明治與 action gate 把傷害限制在可承受範圍。
30. **[代理系統：模型提議、執行環境決定](nodes/agentic-systems.md)**
    - Goal: 分辨 workflow 與 agent，並講清工具契約、記憶分層、預算與 action gate。
31. **[評估與控制代理](nodes/agent-evaluation-and-autonomy.md)**
    - Goal: 以 trajectory 為評估單位，並用自治階梯與常駐控制讓代理「用證據換自由」。

### Tier 6 — 實戰演練與複習

32. **[預測型設計總驗收：ETA 平台與你可能認識的人](nodes/capstone-predictive-designs.md)**
    - Goal: 完整走完兩個預測型 capstone，含成本、監控，以及必須在最壞情況下仍成立的隱私不變量。
33. **[生成型設計總驗收：推論帳單與企業文件問答](nodes/capstone-generative-designs.md)**
    - Goal: 走完兩個生成型 capstone，把成本帳單與權限／新鮮度當成設計主軸。
34. **[產品與代理總驗收：SaaS 功能與客服代理](nodes/capstone-product-and-agent.md)**
    - Goal: 走完兩個產品／代理 capstone，把護欄、租戶隔離與「錢的上限寫在程式碼裡」講清楚。
35. **[怎麼跑一場案例研究與評析設計](nodes/how-to-run-a-case-study.md)**
    - Goal: 用七步與時鐘實跑案例，並依嚴重度排序找出一個既有設計的問題。
36. **[系統設計案例：音樂探索、平台級有害內容、視覺搜尋、法律研究](nodes/case-studies-systems.md)**
    - Goal: 對每個案例先做辨識動作，再說明它比已知設計多出來的那一個需求。
37. **[系統設計案例：會議助理、大規模生圖、自主編碼代理](nodes/case-studies-products.md)**
    - Goal: 用不同的延遲體制與成本結構，拆解三個產品型系統的設計。
38. **[考前快速複習：回想、紅旗與決策表](nodes/rapid-review.md)**
    - Goal: 用回想練習、12 個紅旗與決策表，把知識轉換成面試時說得出口的表現。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
