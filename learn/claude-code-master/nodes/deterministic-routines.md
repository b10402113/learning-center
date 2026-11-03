---
id: deterministic-routines
title: "不用 token 的 deterministic routine"
subject: claude-code-master
tier: 4
order: 12
status: written
goal: "用 Modal 建一條不花 token 的 deterministic pipeline，並判斷何時不該讓 LLM 參與。"
digests:
  - 5-Module_D4_-_Deterministic_Routines.md
  - 6-Tip_-_Voice_Dictation_App_I_Use.md
prerequisites: []
steps:
  - id: no-brain-no-tokens
    title: "需要一個大腦嗎：什麼時候該用 Claude routine，什麼時候交給 Modal"
    purpose: "能判斷一段自動化需不需要 LLM，並說明不需要判斷的流程為什麼該離開 Claude routine。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/5-Module D4 - Deterministic Routines/5-Module_D4_-_Deterministic_Routines.en.vtt#L1-L50]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/5-Module D4 - Deterministic Routines/5-Module_D4_-_Deterministic_Routines.en.vtt#L351-L445]]"
  - id: modal-app-is-a-python-function
    title: "Modal 的 app，就是一組 Python function"
    purpose: "能說明 Modal 的 app 與 function 是什麼，並說出它和 n8n、Make.com 的差別。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/5-Module D4 - Deterministic Routines/5-Module_D4_-_Deterministic_Routines.en.vtt#L51-L200]]"
  - id: build-the-digest-pipeline
    title: "在你睡覺時，routine 照樣跑"
    purpose: "能請 Claude 寫出並部署一條每天抓 subreddit 熱門貼文、寄摘要信的 Modal pipeline。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/5-Module D4 - Deterministic Routines/5-Module_D4_-_Deterministic_Routines.en.vtt#L201-L300]]"
  - id: secrets-and-the-llm-exception
    title: "把 API key 鎖進 Modal secret vault"
    purpose: "能把 API key 放進 Modal secret，並在真的需要摘要時決定要不要加一個 LLM。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/5-Module D4 - Deterministic Routines/5-Module_D4_-_Deterministic_Routines.en.vtt#L301-L350]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/5-Module D4 - Deterministic Routines/5-Module_D4_-_Deterministic_Routines.en.vtt#L351-L445]]"
  - id: speak-instead-of-type
    title: "用語音 prompt AI agent 的驚人效果"
    purpose: "能用語音輸入取代打字，降低每天操作 routine 與寫 prompt 的摩擦。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/6-Tip - Voice Dictation App I Use/6-Tip_-_Voice_Dictation_App_I_Use.en.vtt#L1-L48]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/6-Tip - Voice Dictation App I Use/6-Tip_-_Voice_Dictation_App_I_Use.en.vtt#L49-L145]]"
created: 2026-10-31
updated: 2026-11-02
---

# 不用 token 的 deterministic routine

## Lesson

不是所有自動化都需要一個 brain；不需要判斷的流程用 Python + Modal，跑起來幾乎不花 token。這一節要能判斷哪一種 routine 根本不該用 LLM。

## Steps

1. [需要一個大腦嗎：什麼時候該用 Claude routine，什麼時候交給 Modal](deterministic-routines/no-brain-no-tokens.md)
2. [Modal 的 app，就是一組 Python function](deterministic-routines/modal-app-is-a-python-function.md)
3. [在你睡覺時，routine 照樣跑](deterministic-routines/build-the-digest-pipeline.md)
4. [把 API key 鎖進 Modal secret vault](deterministic-routines/secrets-and-the-llm-exception.md)
5. [用語音 prompt AI agent 的驚人效果](deterministic-routines/speak-instead-of-type.md)
