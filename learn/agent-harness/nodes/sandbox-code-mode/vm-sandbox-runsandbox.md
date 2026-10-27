# 用 node:vm 蓋一個最小沙箱

如果讓模型自己寫程式碼，再直接執行它，就等於把主程式交給一段你不知道內容的字串。

要讓這段程式跑起來，卻不讓它碰到你的檔案、網路和記憶體，你需要先畫出一道界線。Node.js 內建的 `node:vm`，就能提供這條界線：把程式碼放進隔離的 `context` 中執行。

這個函式叫做 `runInSandbox`。顧名思義，就是把一段程式碼丟進沙箱裡執行。

![第 1 段配圖](./vm-sandbox-runsandbox-assets/image-1.webp)

## runInSandbox：三個輸入，一個結果

`runInSandbox` 接收三個東西。

第一個是 `code`，也就是模型寫出來的程式碼字串。第二個是 `api`，代表沙箱裡可以使用的工具，其實就是一張「函式名稱對應到函式」的表。第三個是 `options`，用來調整沙箱設定，其中最重要的是 `timeout`。

`timeout` 以毫秒為單位，預設設為 2 秒，不讓程式無限制地跑下去。

另外，還要準備一個 `logs` 陣列，型別是字串陣列。它用來記錄沙箱裡發生的事情，之後你才能知道程式在裡面印出了什麼。

<!-- derived -->
```ts
import vm from "node:vm";

type SandboxResult = {
  ok: boolean;
  result?: unknown;
  logs?: string[];
  error?: unknown;
};

type SandboxAPI = Record<string, (...args: unknown[]) => unknown>;

async function runInSandbox(
  code: string,
  api: SandboxAPI,
  options: { timeoutMs?: number } = {},
): Promise<SandboxResult> {
  const timeoutMs = options.timeoutMs ?? 2000;
  const logs: string[] = [];

  const context = vm.createContext({
    api,
    console: {
      log: (...args: unknown[]) => {
        logs.push(
          args.map((a) => (typeof a === "string" ? a : String(a))).join(" "),
        );
      },
    },
  });

  const wrapped = `(async () => {
${code}
})()`;

  try {
    const pending = vm.runInContext(wrapped, context, {
      timeout: timeoutMs,
    }) as Promise<unknown>;
    const result = await withTimeout(pending, timeoutMs);
    return { ok: true, result, logs };
  } catch (error) {
    return { ok: false, error };
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeoutMs),
    ),
  ]);
}
```

## context 就是它的全世界

沙箱的關鍵在 `vm.createContext`。

你建立一個 `context`，這個 `context` 就會成為程式碼執行時的環境：全域物件、可以使用的變數，以及能呼叫的函式，全都由它決定。

它能碰到的東西，只有你親手放進 `context` 的那些項目。

![第 2 段配圖](./vm-sandbox-runsandbox-assets/image-2.webp)

我們只放兩樣東西進去。

第一樣是 `api`，也就是你決定要交給模型的工具。模型在沙箱裡能呼叫的函式只有這些，一個不多。

第二樣是 `console`。當沙箱裡的程式呼叫 `console.log` 時，訊息不會直接印到你的終端機，而是會先被接住：把傳入的參數逐一轉成字串，再用空格串起來，最後放進 `logs` 陣列。

<!-- derived -->
```ts
const context = vm.createContext({
  api,
  console: {
    log: (...args: unknown[]) => {
      logs.push(
        args.map((a) => (typeof a === "string" ? a : String(a))).join(" "),
      );
    },
  },
});
```

重點就在「只放兩樣」。

模型寫的程式在 `context` 裡找不到你的檔案系統，也找不到 `process` 全域物件，更找不到主程式裡的其他東西。它能碰到的，就只有 `api` 和 `console`。

少了這道界線，所謂的 sandbox 就只剩下一句口號。

## async IIFE：讓模型可以 await

模型常常會想寫非同步程式：呼叫工具取得結果、處理結果，再用 `await` 等待下一個步驟。

可是你收到的 `code` 只是一段字串，不是函式主體。直接丟進 `runInContext` 時，沒辦法在頂層使用 `await`。

解法很簡單：在外面包一層 **async IIFE**。IIFE 是「立即呼叫的函式」，也就是函式建立後馬上執行。

只要包上這一層，模型寫的程式碼就可以使用 `await`。

![第 3 段配圖](./vm-sandbox-runsandbox-assets/image-3.webp)

<!-- derived -->
```ts
const wrapped = `(async () => {
${code}
})()`;
```

把 `code` 放進 `(async () => { ... })()` 中間，再立即呼叫它。這樣一來，程式就知道自己是在 `async` 函式裡執行，隨時可以使用 `await`。

這只是讓模型寫程式時更方便，不必另外處理「我現在到底能不能使用 `await`」這個問題。

## runInContext 加 try/catch

接下來才是真正執行程式碼。

用 `vm.runInContext` 傳入 `wrapped`、`context` 和 `timeout`，就能取得執行結果。因為外面包了 `async IIFE`，這個結果 `pending` 會是一個 Promise。

但我們不直接 `await` 它，而是交給 `withTimeout` 處理，確保程式不會超過指定時限。

成功時，回傳 `{ ok: true, result, logs }`；如果發生錯誤，就接住錯誤，回傳 `{ ok: false, error }`。

## withTimeout：Promise.race 先到先贏

`withTimeout` 的工作很單純：確認程式碼能不能在指定時間內跑完。

它的核心是 `Promise.race`。規則就像賽跑一樣：誰先完成，就回傳誰的結果。

![第 4 段配圖](./vm-sandbox-runsandbox-assets/image-4.webp)

<!-- derived -->
```ts
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeoutMs),
    ),
  ]);
}
```

我們把兩個東西一起丟進 `race`：

- 一個是正在執行的程式，也就是 `pending`
- 另一個是計時器，會在 `timeoutMs` 毫秒後呼叫 `reject`

如果程式先跑完，就回傳程式的結果；如果計時器先到，就回傳逾時錯誤。

先到的獲勝，較慢的那個則被丟掉。

## `ok: true` 和 `ok: false` 是講給模型聽的

回傳物件用 `ok: true` 和 `ok: false`，而不是直接丟出例外，因為這個結果之後要交回給模型閱讀。

模型需要一個一看就懂的訊號：

- `ok: false` 代表「這件事做壞了」
- `ok: true` 代表「成功」

這就像用大白話告訴模型結果，讓它直接知道接下來該繼續，還是換一個做法。
