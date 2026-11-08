# Agent 記憶的三級演進：從混亂檔案堆到視覺化第二大腦

在開始使用 Claude Code 這類 AI 代理（Agent）時，多數人的工作區通常只是一個單純的資料夾。每當你請 Agent 處理新任務，它就會產生新的筆記、程式碼與紀錄。剛開始檔案只有幾十個，互動過程通常很順暢，但隨著使用頻率增加，這個工作區很快就會面臨嚴重的效能瓶頸。

Agent 的記憶系統（Memory）會隨著檔案規模經歷三個不同階段的演進，每個階段都在解決特定的檢索與認知問題。

## 第一級：未經整理的檔案堆

最基礎的第一級就是把所有東西塞在同一個工作區目錄。例如在實作中，直接把電腦裡的 `Robo` 資料夾指定為 Agent 的工作空間。

![第 1 段配圖](./memory-three-levels-assets/image-1.webp)

一開始檔案很少時，你幾乎感覺不到異狀。但隨著使用時間拉長，產生的上下文與檔案不斷累積，Agent 在裡面翻找資料就會變得越來越吃力。以實際案例來說，直到把這套目錄接入第二大腦系統進行盤點，才驚訝地發現該資料夾裡已經堆積了將近六萬個檔案。

當檔案數量達到這種規模時，如果沒有合適的記憶結構，會立即帶來兩個致命影響：

1. **檢索速度大幅下降**：Agent 每次要找資料都得在大海裡撈針，回應時間越來越長。
2. **方案額度迅速耗盡**：Agent 遍歷大量目錄與讀取無關檔案，會消耗巨額的上下文 token，讓你帳戶的使用量以驚人的速度燒完。

只要在檢索記憶時感覺到系統開始變慢，就代表必須從第一級升級到第二級。

## 第二級：為 Agent 最佳化的 Router 檔案

升級到第二級的核心概念，是把工作區整理成「專為 Agent 最佳化」的結構。

如果你是千禧世代（Millennials）或 X 世代，在 Windows 或 Mac 等圖形化作業系統普及的年代，通常都會養成一套整理習慣：建立層層分明的資料夾、把檔名改得整齊漂亮，方便人類自己在檔案總管裡一層層點選、肉眼辨識。

但在由 Agent 操作檔案的新典範中，你不需要把心力花在迎合人類瀏覽習慣的檔名和目錄樹。Agent 解析文字檔案的速度極快，它最需要的不是深層目錄，而是「路由器檔案」（Router files）。

在這種結構下，工作區的中樞是一份全域的引導檔，例如 `CLAUDE.md`（或 `AGENTS.md`）。它本身就是一個頂層路由器，負責定義你處理的各個業務「部門」（Departments）。當你在處理內容創作時，它能引導 Agent 只在內容相關的檔案範圍內運作；當你切換到社群維護時，它就切換到對應的檔案清單。

![第 2 段配圖](./memory-three-levels-assets/image-2.webp)

除了頂層路由器，每個部門也會有自己的專用路由器。例如名為 `content.md` 的檔案中，只會記錄該領域所需的技能清單與參考資料檔案路徑。Agent 接到內容相關的任務時，只要先讀取 `content.md`，就能立刻沿著清單鎖定目標檔案，用最少的步驟與最低的 token 消耗找到答案。

在底層實作上，系統只要透過簡單的設定檔指定頂層路由器與記憶索引，就能讓 Agent 自行運作：

<!-- source: sources/rubric/20261108/supplement/rubric-agentic-os-v2/config/workspace.json#L1-L14 -->

```json
{
  "_note": "Where your workspace lives. Your agent fills this in at install (BRAIN.md, step 1). Paths are relative to root, except root itself, which is an absolute path (or relative to this OS folder).",
  "root": "",
  "routerDoc": "AGENTS.md",
  "instructionDocs": ["AGENTS.md"],
  "skillDirs": [],
  "memoryDir": "",
  "memoryIndex": "MEMORY.md",
  "projectsDir": "",
  "sharedPrefixes": [],
  "visibleRoots": [],
  "routing": {},
  "maxFiles": 500000
}
```

而在檢索時，程式只需要先讀取單一索引核心（Hub），透過關鍵字計算關聯分數並指向目標檔案，不需在每次查詢時遍歷整個硬碟：

<!-- source: sources/rubric/20261108/supplement/rubric-agentic-os-v2/engine/brain.js#L44-L63 -->

```javascript
  const read = p => { const s = fs.readFileSync(p, 'utf8'); bytes += Buffer.byteLength(s); return s; };
  const qw = words(query);

  // 1) index hop: MEMORY.md is the hub and the ONLY always-read file
  //    (category indexes stay closed - filenames cover their contents)
  const pointers = []; // {file, score, line}
  const hub = path.join(MEM, MEM_INDEX);
  if (fs.existsSync(hub)) {
    for (const line of read(hub).split('\n')) {
      const m = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (!m) continue;
      const lw = words(line);
      let score = 0;
      for (const w of qw) {
        if (lw.includes(w)) score += 3;
        else if (lw.some(x => x.startsWith(w) || w.startsWith(x))) score += 1;
      }
      if (score > 0) pointers.push({ file: path.resolve(MEM, m[2]), score, line: line.trim() });
    }
  }
```

要建立這套路由器架構，並不需要人工逐一打字整理。只要把寫好的提示詞（Prompt）截圖或複製給 Claude Code，它就能自動為你現有的工作區搭建出這套路由器檔案。

## 第三級：視覺化的第二大腦

當路由器運作順暢後，記憶系統就能推進到第三級：具備視覺圖譜的第二大腦（Visual Second Brain）。

路由器檔案雖然解決了 Agent 檢索速度與 token 消耗的問題，但對人類而言，整個工作區的關聯依然是抽象的。第三級系統把檔案、技能、部門路由器與全域中樞轉化為視覺化的節點圖，解決了兩大問題：

![第 3 段配圖](./memory-three-levels-assets/image-3.webp)

1. **看清系統的全局關聯**：你能一眼看出中樞檔案如何連接到不同部門、部門又如何延伸到各個參考檔與特定技能。對於偏好圖像思考的人來說，這種格式比傳統冷冰冰的檔案列表更容易理解全貌。
2. **極速的視覺化搜尋與預覽**：在傳統的檔案總管裡，如果要翻出一個很久沒用的清理技能（例如 `cleanup`），往往需要層層翻找資料夾；但在視覺化第二大腦中，只要直接搜尋，畫面就能立刻定位該技能節點並提供內容預覽。

從檔案堆、路由器檔案到視覺化第二大腦，這三級演進並不是推翻前一層，而是先降低 Agent 的檢索阻力，再反過來降低人類理解系統全貌的認知負擔。
