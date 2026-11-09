---
id: validate-the-judge
title: "用真人標籤驗證 judge"
subject: ai-eval
tier: 2
order: 7
status: written
goal: "能用 agreement matrix、Cohen's κ 與 false-pass quadrant 判斷一個 judge 能不能上線。"
digests:
  - lesson3.en.md
  - AI_Evals_InPractice_Week2_Deck.md
  - lesson4.en.md
  - Week-2-Assignment-1-Step-by-Step-Walkthrough.md
prerequisites:
  - learn/ai-eval/nodes/binary-judge-rubric.md
steps:
  - id: agreement-matrix
    author: "google/gemini-3.8-flash"
    title: "用 2×2 一致性矩陣檢驗 LLM Judge：看懂四個象限的判決意義"
    purpose: "能從真人標籤與 judge 判決建出 2×2 agreement matrix，並讀出四個格子各自的意義。"
    sources:
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L341-L460]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L701-L820]]"
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L1011-L1160]]"
      - "[[sources/ai-eval/20261108/supplement/code/Week-2-Assignment-1-Step-by-Step-Walkthrough.txt#L110-L119]]"
  - id: cohens-kappa
    author: "google/gemini-3.8-flash"
    title: "評估 LLM 裁判的可靠度：計算並解讀 Cohen's κ"
    purpose: "能算出並解讀 Cohen's κ，說明為何 94% agreement 可能只有 κ 0.24，並用 0.6 當門檻。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L1011-L1160]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L231-L340]]"
      - "[[sources/ai-eval/20261108/supplement/lesson4.en.txt#L161-L280]]"
  - id: false-pass-quadrant
    author: "google/gemini-3.8-flash"
    title: "如何解讀評測矩陣中的 False Pass，並用 TPR 與 TNR 抓出偏誤方向"
    purpose: "能在 false-pass quadrant 上定位錯誤，並用 TPR／TNR 一起判斷 judge 的錯誤方向。"
    sources:
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L341-L460]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L701-L820]]"
      - "[[sources/ai-eval/20261108/supplement/lesson4.en.txt#L281-L420]]"
      - "[[sources/ai-eval/20261108/supplement/code/Week-2-Assignment-1-Step-by-Step-Walkthrough.txt#L120-L136]]"
  - id: diagnose-and-gate
    author: "google/gemini-3.8-flash"
    title: "裁決評測分歧：從補齊邊界規則到訂定上線門檻"
    purpose: "能逐條裁決 disagreement、補邊界規則後在 held-out set 重驗，並寫下 ship／no-ship 門檻。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L1331-L1500]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L584-L700]]"
      - "[[sources/ai-eval/20261108/supplement/code/Week-2-Assignment-1-Step-by-Step-Walkthrough.txt#L147-L162]]"
created: 2026-11-08
updated: 2026-11-09
---

# 用真人標籤驗證 judge

## Lesson

judge 不能假設可用：要拿真人標籤對照，算 agreement 與 Cohen's κ，逐條讀 false pass，才決定能不能上線。這條節點把「我覺得 judge 很準」變成可反駁的數字，也解釋為什麼 94% agreement 可能只有 κ 0.24，以及 TPR/TNR 為什麼要一起看。通過門檻之後，還要到 held-out set 上再驗一次。

## Steps

1. [用 2×2 一致性矩陣檢驗 LLM Judge：看懂四個象限的判決意義](validate-the-judge/agreement-matrix.md)
2. [評估 LLM 裁判的可靠度：計算並解讀 Cohen's κ](validate-the-judge/cohens-kappa.md)
3. [如何解讀評測矩陣中的 False Pass，並用 TPR 與 TNR 抓出偏誤方向](validate-the-judge/false-pass-quadrant.md)
4. [裁決評測分歧：從補齊邊界規則到訂定上線門檻](validate-the-judge/diagnose-and-gate.md)
