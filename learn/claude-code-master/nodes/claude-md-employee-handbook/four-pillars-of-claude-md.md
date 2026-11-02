# 好的 CLAUDE.md 的四個支柱

上一段請你列一次 workspace 裡的檔案。列完你就會看到，其中最常被讀的那一份是 CLAUDE.md；接下來就是決定它的內容。

你的專案裡大概已經有一個 CLAUDE.md。每次你開一個新的 session，Claude Code 會把它讀進來，變成這個 agent 的指令。所以問題通常不在要不要寫；真正要決定的是裡面該放什麼。

作者把它想成員工手冊：新人第一天要交代的事情就那幾件。在他看來，一份好的 CLAUDE.md 有四件事要做好：identity、goals、rules，以及 workspace 的地圖。這四段寫好，一份很簡單的 CLAUDE.md 就能走很遠。

## 每一場對話的開頭，它都會被讀一次

CLAUDE.md 是一個 markdown 文字檔。你每次跟 Claude Code 開一個新的 chat session，它就被讀一次，內容變成 agent 這整場對話的指令。它不是設定一次就放著的東西，而是每一場對話的起點。

<!--image:1-->

也因為這樣，它不需要複雜。作者自己的 CLAUDE.md 就很簡單，identity 那段只有三行。你可以先看自己的 workspace 裡有沒有這個檔案，再一段一段補。

## 第一根支柱：identity

identity 要建立兩件事：你正在對話的這個 agent 是誰，以及你是誰。作者給了 agent 一個名字 Robo，角色是 chief of staff，另外寫一行它的 vibe。名字不是必要的，他覺得這樣比較有趣。

那一行 vibe 比你想的重要，尤其當這個 agent 是要做給客戶或另一個人用的時候。除了它能做什麼，你還得交代它用什麼態度做事。

## 第二根支柱：goals

goals 是你希望它每次都記住的目標。不用寫得很細。重點是它至少知道你在往哪裡走；這樣你問到工作的某一段，它心裡有你的終點，就能照著那個終點給建議。

作者的版本裡有一個 conversation filter：每一個建議都先過一次「這件事有沒有把我們推向那些目標？」。你要寫多細都可以，但光是 identity 和 goals 這兩段，他就覺得跟 agent 一起工作的方式改善很多。

<!--image:2-->

## 第三根支柱：rules

rules 才是員工手冊真正的部分。它規定 agent 怎麼行動、什麼不要碰，還有你希望它怎麼工作。

作者的 rules 分幾類。寫作類：避開 em dash，因為那是 AI 寫作很常見的破綻；一律用平實、非技術的英文，因為他教的對象不是開發者。核准類：生成式 AI 模型每次呼叫都要花 credits，所以執行那類指令前要先取得同意。

這些規則沒有標準答案，你怎麼用 Claude Code，大致就決定要放哪些規則。你可以養成一個習慣：每次你覺得「這裡應該有一條規則」，就直接請 Claude 去改它自己的 CLAUDE.md，把那條加進去。另外，也請它在合理的時候主動對自己的 CLAUDE.md 提出建議。這條規則換到哪個 workspace 都用得上。

<!--image:3-->

## 第四根支柱：workspace map

最後一段把 CLAUDE.md 變成你 workspace 的地圖，也就是你的 second brain。作者在 map 那段列出自己事業的幾個領域：content、community、product development、design、operations；也標出這些領域的專案在 workspace 資料夾裡的確切位置。

<!--image:4-->

這份內容是照他的設定客製的，你不會長得一樣。你只要記住一件事：你的 workspace 需要一份結構化的地圖。當 context 和 memory 越積越多，Claude Code 才找得到你要的東西，不會在自己的 workspace 裡迷路。

這件事也不用想太多。用的過程中，只有當你發現它沒達到預期，或做出跟你要的不一樣的事，才需要回頭更新 CLAUDE.md。

## 四段都有，就夠了

只要你的 CLAUDE.md 至少有 identity 的輪廓、你替它設的 goals、rules，還有 workspace 的 map，一份簡單的 CLAUDE.md 就能帶你走很遠。
