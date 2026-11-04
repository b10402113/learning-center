# 讀 outcome 判斷真 bug，把通過的 run 變成 Playwright spec

QuickE2E 跑完後，不會只給你一個「好」或「壞」的勾，而是一份紀錄：包含 outcome、每一步的決策，以及每條斷言是否成立。上一段說判定交給程式，這裡要看的就是程式留下的那份紀錄。

判斷要由你來做，而且要照順序：先看程式給出的原因，再看 trace，最後才判斷問題出在 app、spec 沒有跑到，還是工具。

這三種問題需要不同的人修。要是混在一起，最糟的情況就是把一條紅色的 spec 改成綠色。

三個角色從頭到尾都不能混在一起：**你**（大模型）負責想案例、寫 spec，只做一次；**Jev** 負責駕駛每一步，成本低、速度快，可以反覆執行，而且只會從工具提供的選項中挑選；**程式**負責判斷通過或失敗，永遠不是模型，也不是你。

## 先看原因，再看 trace

一次 FAIL 不只會印出一行結果。往下看，`why()` 會逐行列出可能的原因：哪條斷言沒有成立、實際看到什麼、哪個 submit 被哪個欄位擋住、哪個動作一直打轉，以及哪個必填欄位仍然空著。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/bin/quicke2e.mjs#L244-L251 -->
```js
if (rec.startStatus) lines.push(`the start page answered HTTP ${rec.startStatus}${[401, 403].includes(rec.startStatus) ? ": it needs a login (storageState) or basic-auth credentials in the base URL" : ""}`);
for (const a of rec.assertions || []) if (!a.held) lines.push(`not met: ${a.kind} ${JSON.stringify(a.value)}${a.actual != null ? ` (was ${JSON.stringify(a.actual)})` : ""}`);
if (rec.loop) lines.push(`loop: ${rec.loop.op} "${rec.loop.label}" ran ${rec.loop.times}x on an unchanged page; stopped before the next one`);
for (const h of rec.heldBack || []) lines.push(h.key
  ? `held back: "${h.label}" until "${h.waitingFor}" is filled (spec key "${h.key}")`
  : `held back: "${h.label}" until "${h.waitingFor}" is set; the spec has no key for it: add "${String(h.waitingFor).toLowerCase()}": "<value>" to inputs`);
if (rec.lowConfidence) lines.push(`low confidence: the engine's picks stayed under ${rec.minConfidence} (best ${rec.lowConfidence.confidence} for ${rec.lowConfidence.op} "${rec.lowConfidence.label}")`);
```

這些資訊能幫你分清楚問題：`not met: expect "Refunded €0.00" (was "Refunded €98.00")` 代表 app 壞了；`held back: "Pay €92.70" until "Discount code" is filled` 代表 spec 少提供一個值；`loop: CLICK "Next" ran 3x` 代表流程走錯了路。

這三種情況需要不同的修正，只有第一種才算「發現」。

<!--image:1-->

看完原因還不確定，再查看 trace。

trace 會保留每一步當時提供給引擎的選項（`offered`），因此能分清楚是「模型選錯」，還是「根本沒有提供這個選項」。

這一層通常能把 spec 的問題和 app 的問題分開。

## outcome 是第一層判斷

紀錄中的 `outcome` 是迴圈停止的原因，也能先把結果大致分類：

- `DONE_VERIFIED`：每條斷言都在某個快照上成立，表示通過。
- `ABSENT_SEEN`：畫面上出現了某句「只有成功才會出現」的文字，表示 app 接受了它本該拒絕的攻擊。這是發現，欄位 `absentSeen` 會存下那句文字。
- `SERVER_ERROR`：某個頁面回傳 HTTP 5xx。這也是 app 的 bug，而且很容易被誤認為工具問題。欄位 `httpStatus` 會提供狀態碼，接著要自己打開該網址查看錯誤。
- `MAX_STEPS`、`MODEL_BLOCKED`、`LOOP`：表示**沒走到**。這類結果沒有判決，既不能算通過，也不能算 bug。
- `WEAK_ASSERTION`、`NOT_REFUSED`、`AUTH_REQUIRED`、`NO_SPEC_VALUE`：表示 spec 或環境有問題，還沒輪到 app 接受檢驗。

`MAX_STEPS`、`MODEL_BLOCKED`、`NO_SPEC_VALUE` 這三種情況最需要謹慎處理。

它們看起來像失敗，但迷路的攻擊案例既不能證明 app 接受了攻擊，也不能證明 app 拒絕了攻擊，因此沒有提供任何結論。

誠實的報告會把它們標成「無判決」，不會悄悄把它們算進通過的數量。

## precheck：工作開始前，斷言必須是假的

spec 有一種很難發現的問題：斷言在測試開始前就已經成立。

這樣的 spec 永遠會是綠色，什麼也證明不了，看起來卻和正常的 spec 一模一樣。

因此 QuickE2E 會先檢查每條斷言：在資料庫重新 reset 後，載入每條 flow 的起始頁，再用**和 `checkGoal()` 相同的判斷方式**（網址 regex，加上正規化後的文字子字串）檢查一次。

每條 flow 的結果都必須是 FALSE，否則這條 spec 什麼也沒證明。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/examples/ticketbay/precheck.mjs#L16-L27 -->
```js
for (const f of FLOWS) {
  const page = await browser.newPage();
  await page.goto(base + f.start, { waitUntil: "networkidle" });
  const text = norm(await page.evaluate(() => document.body.innerText));
  const urlOk = f.expectUrl ? new RegExp(f.expectUrl).test(page.url()) : true;
  const each = (f.expect || []).map((w) => [w, text.includes(norm(w))]);
  const all = urlOk && each.every(([, v]) => v);
  if (all) bad++;
  console.log(`${f.name.padEnd(20)} goal-on-start-page=${all ? "TRUE (WEAK!)" : "FALSE"}  url=${urlOk}  `
    + each.map(([w, v]) => `${JSON.stringify(w)}=${v}`).join("  "));
```

CLI 裡相同的檢查叫 `weak()`。

有一種重要的例外：載入攻擊，例如「打開別人的訂單」，本身就是透過載入起始網址發動的攻擊。

這種情況要在 **control** 頁面檢查，也就是 app 會回答「yes」的頁面。

在那裡，斷言必須是假的，而且每個 `expectAbsent` 的字串都必須**確實存在**，才能證明成功標記是真的，而且文字也寫對了。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/bin/quicke2e.mjs#L334-L339 -->
```js
if (!(w.weak || w.absent)) return false;
const msg = w.absent ? `"${w.absent}" is already visible on ${w.at}. expectAbsent must name a state only success reaches.`
  : flow.control ? `the assertion is also true on the control page ${w.at}, so it cannot tell a refusal from a success.`
  : `the assertion is already true on ${w.at} before any work.`;
out(`${w.absent ? "ABSENT_ON_START" : "WEAK_ASSERTION "} ${flow.name}: ${msg}`);
if (cmd === "check" || !flag("--allow-weak")) { all.push(skipped(flow, w.absent ? "ABSENT_ON_START" : "WEAK_ASSERTION", msg)); failed++; return true; }
```

如果被判定為 `WEAK_ASSERTION`，唯一的解法是重寫斷言。

用 `--allow-weak` 把紅燈改成綠燈，只是拆掉門，不是修好門。

<!--image:2-->

## spec 本身也要先通過檢查

載入第一頁之前，CLI 會先檢查 spec 的格式。

這項檢查是為了避免幾種具體問題：應該放陣列的地方如果放了字串，字串會被逐字元讀取，變成一條一條的斷言（`expect: "Your todos"` 會變成十條單字母斷言，接著全部成立）；`expectAbsent` 如果放成字串，就會被整個忽略，導致攻擊 spec 永遠抓不到攻擊；欄位名稱拼錯（`expected`），則會讓 flow 完全沒有斷言。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/bin/quicke2e.mjs#L127-L129 -->
```js
for (const k of Object.keys(f)) if (!FIELDS.includes(k)) {
  const s = { timeout: "navTimeout or maxTimeMs", url: "start or expectUrl", value: "inputs", values: "inputs", steps: "maxSteps" }[k] ?? closest(k, FIELDS);
  out.push(s ? `unknown field "${k}" (did you mean "${s}"?)` : `unknown field "${k}"`);
}
```

還有一條最基本的規則：完全沒有斷言的 flow 會直接被拒絕，也就是 `no assertion: add expectUrl, expect, expectState, expectSeen, expectAbsent or expectGone (code decides pass or fail from them)`。

斷言不是文件，而是測試本身。

exit code 也會替 CI 區分結果；在自動化流程裡，這比訊息更重要：`0` 表示全部通過；`1` 表示有 run 失敗，或 spec 沒通過前置檢查，或起始頁無法連線；`2` 表示用法錯誤、spec 不合法，或 key 被拒；`3` 表示**所有**失敗都來自引擎（逾時、429、5xx），可以重試，不能據此判定 app 有問題。

## 不要把紅色的 spec 改成綠色

規則只有一條，也是整套流程的底線：**永遠不要為了讓 spec 通過而修改 spec**。

紅色的拒絕案例或攻擊案例，本身就是發現。

把它調寬鬆，只是把 bug 從報告裡刪掉。

每份 app bug 報告都應該包含相同資訊：違反的規則在哪裡（`rule — file:line`，從原始碼找出的那一行）、是哪條 spec 抓到問題，以及實際發生的情況（`outcome`、`absentSeen`、最終網址）。

還要補上一項最重要的建議：能有效防止這個 bug 的**最低層級**測試是什麼。

如果違反的是 domain 規則，應該替那個函式補上單元測試；如果違反的是 route 行為，則應該補上 API 測試。

E2E 抓到 bug，不代表只有 E2E 才該負責防止它再發生。

報告也要按照順序排列：先列 happy path，再列邊界、拒絕和攻擊案例。

原因很實際：流程本身壞掉時，攻擊案例無法分辨 app 是拒絕攻擊，還是 app 根本壞了。

因此，在 happy path 通過之前，同一條流程的其他案例都應先暫緩。

最後，也要列出**沒有執行**的攻擊，以及各自應由哪一層負責：竄改標頭、cookie、request body，以及網路層攻擊，都不是 QuickE2E 能做的事，因為它一次只能操作一個瀏覽器、執行一個動作。

這些攻擊應交由 API property test 或程式碼層的對抗測試處理。

## 通過之後：把 run 變成可重複使用的資產

通過的 run 是一份證據，但每次執行都需要模型。

因此 `--emit` 會替每條通過的 flow 產生一條一般的 Playwright spec，也會用同一份 trace 產生定位器：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/bin/quicke2e.mjs#L391-L399 -->
```js
if (rec.passed && opt("--emit")) {
  const { generate } = await import("../codegen/codegen.mjs");
  fs.mkdirSync(opt("--emit"), { recursive: true });
  const f = path.join(opt("--emit"), `${fileName(flow.name)}.spec.ts`);
  ...
  try { fs.writeFileSync(f, generate(rec, flow).code); out(`      emitted ${fx}  (run: npx playwright test ${fx}; ...`); }
```

從這時起，守門工作交給 gate。

執行時不需要模型，也不需要網路，在 Linux CI 上就能跑。

決策模型只在探索時用一次，之後重播不需要額外成本。

<!--image:3-->

## drift 之後：先 replay，不行再 heal

產生的 spec 使用可存取名稱，但名稱可能會變。

`replay-or-heal` 的檔頭會先說清楚：建立在 accessible name 上的 spec **無法撐過**改名，也沒有任何 fallback 鏈能解決這件事。

在一組改名 fixture 上實測，重播 `act()` 自己的階梯，只救回三個定位器中的一個。

那個定位器還是靠「Email 是 Email address 的子字串」，再加上文件順序才找到的；`Password → Passphrase`、`Sign in → Continue` 在每一階都沒有命中。

更糟的是，寬鬆匹配加上 `.first()`，可能會**悄悄綁到錯誤的控制項**。

所以目標不是「讓 spec 撐過 drift」，而是讓 drift 的修復成本低到可以直接修：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/codegen/replay-or-heal.mjs#L15-L22 -->
```js
// Therefore: do not try to make one spec survive drift. Make drift cheap to recover from.
//   1. REPLAY the generated spec. Deterministic, no model, no network, works on Linux CI.
//   2. On failure, RE-EXPLORE with the original goal (the sidecar .flow.json). The explorer is
//      the thing that can read a renamed page, which is the whole premise of the project.
//   3. If the re-explore passes, REGENERATE and print the locator diff. The diff is the review
//      artifact: a rename you meant is a spec you accept; a rename you did not mean is an
//      accessible-name regression the diff just caught.
//   4. If the re-explore also fails, the app is actually broken. Fail.
```

四種 verdict 對應四種結果：`PASS_REPLAY` 表示重播就通過；`HEALED` 表示重新探索成功、spec 重新產生，重播也通過；`FAIL_REAL_REGRESSION` 表示連探索都無法完成，app 確實壞了；`FAIL_HEAL_DID_NOT_REPLAY` 表示 heal 之後重播仍然失敗。

<!--image:4-->

locator diff 是這個流程裡最容易被低估的產物。

它會逐一配對相同 op+role 的定位器，因此 `Password → Passphrase` 看起來會是**一次改名**，而不是刪掉一個再新增一個：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/quicke2e/codegen/replay-or-heal.mjs#L89-L91 -->
```js
if (b.name !== a.name || b.role !== a.role || b.op !== a.op)
  out.push(`~ ${b.op} ${b.role} "${b.name}"  ->  ${a.op} ${a.role} "${a.name}"`);
```

你希望看到的改名，就是你願意接受的 spec 變更。

你不希望看到的改名，則是 diff 剛好抓出的可存取名稱退化。

最後還有一項明確寫在檔案裡的限制：第 2 步需要決策模型，而本地模型只能在 Apple Silicon 上執行。

因此 Linux CI runner 上只有第 1 步和第 4 步可用：CI 會明確指出 drift，開發者再用 Mac 修好它。

這不是權宜作法，而是限制決定的流程設計。

整體分工就是如此：模型負責探索和修復，程式負責判定，CI 則負責在人不在場時，仍然如實呈現結果。
