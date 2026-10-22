# Harness 才是產品：LLM 之外的基礎設施

同一個模型，兩個 agent。一個在你關掉分頁後什麼都不記得；另一個會自己開 sub-agent、上下文滿了會壓縮，掛掉之後還能從斷點繼續。多數人會說「後面那個比較聰明」，但把模型換掉，後面的還是會贏。差別不在 LLM，在 harness。

## Agent 不是模型，是模型加上一層東西

Scott Moss 的定義很直接：agent 是 LLM 加上 harness。只有 LLM 的時候，你做的是一次性的 inference call：送一段字、拿一段回覆，結束。沒有記憶、沒有工具、沒有下一次。

一旦你想要「可以對話」「會記得剛剛發生什麼」「掛掉會自己站起來」「遇到不同問題會換架構」，這些全部不屬於 LLM，屬於 harness。

## Harness 的工作是基礎設施

把 harness 放大來看，它回答的是一連串「怎麼撐住」的問題：

- 記憶怎麼做？短期、長期、scratch pad、事實，各放在哪？
- 工具有幾種接法？自己寫 tool call，還是走 MCP？那些 server 誰管？
- 長跑任務怎麼辦？一個研究型 agent 要跑十分鐘，使用者關掉 app 之後，它怎麼繼續、之後怎麼通知？

這些都不是 prompt 技巧，是基礎設施。所以 Scott 的說法很硬：沒有 harness，你上不了 production；你會有的只是 transactional inference call。

## 換模型救不了你

這一段是整門課的定調。他看過「harness 差、模型強」被「harness 好、模型弱」打敗。模型都夠好了，連開源模型都很好；真正拉開差距的是誰能把 harness 做好。他甚至說，現在做 AI 最值得投的兩件事就是 harness engineering 和 evals。

用一句話收斂：模型只能做 harness 允許它做的事。這不是修辭，是架構事實——工具權限、上下文長度、能不能續跑，全部由 harness 決定。

## 所以 harness 裡一定要有什麼

沒有一個固定清單，因為 harness 取決於你想交付的體驗。交易型 agent 需要 guardrail、審批、PII 防護；純聊天 agent 未必需要 durable execution。

但有幾件事是基本盤：記憶、tool calling、durable execution。最後一項不是每個 agent 都需要，只是這個課程的主角需要——因為我們要造的是一個能撐住長時間工作的 runtime，而不是又一個聊天框。

接下來，我們先看那個「能跑」的版本長什麼樣子，以及它為什麼一上線就死。
