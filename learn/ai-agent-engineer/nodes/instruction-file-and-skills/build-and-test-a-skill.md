# 寫出一個好 skill

前面談的是 skill 該有的形狀：資料夾、description 與 progressive disclosure。真的要動手寫時，你可能有一套固定流程，像是每次發布前都要跑同一組檢查，或希望 agent 遇到某種需求時，照團隊慣用的順序處理。把流程寫進 skill，不只是把步驟貼進 `SKILL.md`：還要讓 agent 在對的時機載入它，並把每次都相同的操作交給腳本執行。

## 先問清楚流程，再開始寫

先訪談使用者，一次問一個問題，並附上你建議的答案，讓對方能快速確認或修正。訪談要弄清楚五件事：

<!--image:1-->

- **觸發情境：**什麼情況會開始這項工作？請使用者提供 3 到 5 種實際會輸入的說法。
- **專屬知識：**有哪些模型無法自行知道的命令、路徑、系統名稱、操作順序或常見原因？
- **禁止事項：**有哪些事情絕不能發生？把每一項整理成硬性規則或注意事項。
- **固定步驟：**哪些操作每次都一樣，例如命令、檢查或固定格式的檔案？這些適合做成腳本。
- **安裝位置：**skill 是只供目前專案使用，放在 `.claude/skills/<名稱>/`，還是要讓所有專案共用，放在 `~/.claude/skills/<名稱>/`？其他工具也使用相同格式，但可能有各自的技能資料夾。

如果使用者已經提供檢查表、操作手冊或完整文件，就從材料整理答案並寫下假設，不必重複訪談。訪談完成時，應能列出所有步驟，並標明哪些需要判斷、哪些是固定操作。

## 先寫描述，讓 skill 找得到

agent 選擇是否載入 skill 時，看到的是描述，不是 `SKILL.md` 的完整內容。因此，描述要使用讀者真的會說的話，而不是只寫一個籠統摘要。

<!--image:2-->

第一句要在 57 個字元以內點出任務。接著用 `Use when …` 列出訪談中收集到的觸發說法，再簡述 skill 會做什麼、絕不會做什麼。描述上限是 1,024 個字元；Claude Code 的清單會在 1,536 個字元處截斷。

例如，「協助部署」不夠具體。若使用者會說「部署到正式環境」、「發布」或「回滾」，就應把這些說法寫進描述。完成後，逐一確認訪談收集的每種說法都出現在描述中，或有意思相近的表達。

描述的作用是觸發載入，不是概括整份文件。正文寫得再好，如果描述模糊，skill 仍可能不會被選中。

## 用資料夾分開入口、腳本和參考資料

`SKILL.md` 是入口，盡量控制在 100 行以內。固定操作放進 `scripts/`；只有特定步驟才需要的長篇資料放進 `references/`；完整示範案例可以放在 `examples/`。

<!--image:3-->

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/skills/skills/write-great-skill/references/skill-template.md#L5-L13 -->

```text
<name>/
  SKILL.md            frontmatter + steps + gotchas
  scripts/<step>.sh   one script per mechanical step (chmod +x)
  references/<topic>.md   long material one step needs
  examples/<case>.md  one finished case, start to end (optional)
```

每份參考資料都要由需要它的步驟連結，而且連結只多一層。不要期待 agent 自己去讀 `references/` 裡的檔案。

**判斷留在指令，固定操作交給腳本。**例如需要根據情況選擇處理方式，適合寫成指令；每次都照同一順序執行的檢查，則應放進腳本，並在 `SKILL.md` 寫出確切呼叫方式。

每個步驟都要有三個部分：用祈使句說明要做什麼、提供確切命令或路徑，最後用 `Done when …` 說明 agent 如何確認完成。腳本也應在第一個錯誤時停止、檢查參數和前置條件，並逐步印出正在執行的操作。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/skills/skills/write-great-skill/references/skill-template.md#L42-L75 -->

```bash
#!/usr/bin/env bash
# <name>.sh — <what it does, one line>.
# Usage: scripts/<name>.sh <args> [--yes]   (dry run unless --yes)
set -euo pipefail

YES=0
ARGS=()
for a in "$@"; do
  case "$a" in
    --yes) YES=1 ;;
    -h|--help) sed -n '2,3p' "$0"; exit 0 ;;
    *) ARGS+=("$a") ;;
  esac
done
[ "${#ARGS[@]}" -eq 1 ] || { echo "usage: $0 <arg> [--yes]" >&2; exit 2; }

run() {                     # print every step; act only with --yes
  echo "+ $*"
  if [ "$YES" -eq 1 ]; then "$@"; fi
}

# Preconditions: fail early with a message that says what to fix.
git diff --quiet || { echo "working tree not clean: commit or stash first" >&2; exit 1; }

run <command 1>
run <command 2>
[ "$YES" -eq 1 ] || echo "Dry run only. Run again with --yes to act."
```

會推送、標記版本、部署、發布或傳送內容的腳本，預設只能預演，只有加上 `--yes` 才能真的執行。`SKILL.md` 必須要求 agent 先展示預演結果並取得核准。只讀操作，例如建置、測試和 lint，則可直接執行。

## 檢查結構和腳本

完成初稿後，執行 `node <this-skill>/scripts/check-skill.mjs <new-skill-folder>`。這個檢查器會檢查 frontmatter、名稱與資料夾是否相符、描述長度和第一句、連結指向的檔案、腳本執行權限、未完成標記、`SKILL.md` 長度，以及空泛用語。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/skills/skills/write-great-skill/scripts/check-skill.mjs#L1-L178 -->

````javascript
#!/usr/bin/env node
// check-skill.mjs — mechanical checks for one skill folder. Read-only.
// Usage: node scripts/check-skill.mjs <skill-folder>
// Exit 0: no FAIL (warnings may remain). Exit 1: at least one FAIL. Exit 2: bad usage.
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, basename, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const LIMITS = {
  nameMax: 64,
  descSpec: 1024, // Agent Skills spec maximum
  descClaudeCode: 1536, // Claude Code cuts the skill listing here
  firstSentence: 57, // Hermes shows this much of a description
  bodyWarn: 150,
  bodyFail: 500,
};

const FILLER = [
  "make sure", "ensure that", "best practice", "as needed", "as appropriate", "properly",
  "clean code", "meaningful name", "be careful", "high-quality", "high quality", "robust",
  "comprehensive", "this skill helps", "it is important", "don't forget", "feel free",
];

// Minimal YAML for frontmatter: `key: value`, quoted values, block scalars (| >), plain continuation lines.
export function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0].trim() !== "---") return null;
  const stop = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (stop < 0) return null;
  const fm = {};
  const raw = lines.slice(1, stop);
  for (let i = 0; i < raw.length; i++) {
    const m = raw[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rest] = m;
    let value = rest;
    if (/^[|>][-+]?\s*$/.test(rest)) {
      const block = [];
      while (i + 1 < raw.length && (/^\s+\S/.test(raw[i + 1]) || raw[i + 1].trim() === "")) block.push(raw[++i].trim());
      value = rest.startsWith("|") ? block.join("\n").trim() : block.filter(Boolean).join(" ");
    } else if (rest.startsWith('"')) {
      let s = rest;
      while (!/[^\\]"\s*$/.test(s) && i + 1 < raw.length) s += " " + raw[++i].trim();
      try { value = JSON.parse(s.trim()); } catch { value = s.trim().slice(1, -1); }
    } else if (rest.startsWith("'")) {
      let s = rest;
      while (!/'\s*$/.test(s.slice(1)) && i + 1 < raw.length) s += " " + raw[++i].trim();
      value = s.trim().slice(1, -1).replace(/''/g, "'");
    } else {
      while (i + 1 < raw.length && /^\s+\S/.test(raw[i + 1])) value += " " + raw[++i].trim();
      value = value.trim();
    }
    fm[key] = value;
  }
  return { fm, bodyStart: stop + 1 };
}

export function firstSentence(desc) {
  const m = desc.match(/^.*?[.!?](?=\s|$)/s);
  return (m ? m[0] : desc).trim();
}

const stripFences = (md) => md.replace(/^(```|~~~)[\s\S]*?^\1/gm, "");

function mdFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...mdFiles(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

export function checkSkill(dirArg) {
  const dir = resolve(dirArg);
  const fails = [];
  const warns = [];
  const facts = {};
  const skillMd = join(dir, "SKILL.md");
  if (!existsSync(skillMd)) return { fails: [`no SKILL.md in ${dir}`], warns, facts };
  const text = readFileSync(skillMd, "utf8");
  const parsed = parseFrontmatter(text);
  if (!parsed) return { fails: ["SKILL.md does not start with a --- frontmatter block"], warns, facts };
  const { fm, bodyStart } = parsed;

  // name
  const name = fm.name;
  if (!name) fails.push("frontmatter has no name");
  else {
    if (name.length > LIMITS.nameMax || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name))
      fails.push(`name "${name}": use lowercase letters, digits and single hyphens, at most ${LIMITS.nameMax} characters`);
    if (name !== basename(dir)) fails.push(`name "${name}" differs from the folder name "${basename(dir)}"`);
  }

  // description
  const desc = fm.description;
  if (!desc) fails.push("frontmatter has no description: the agent cannot pick this skill");
  else {
    const first = firstSentence(desc);
    Object.assign(facts, { descriptionChars: desc.length, firstSentence: first, firstSentenceChars: first.length });
    if (desc.length > LIMITS.descClaudeCode)
      fails.push(`description is ${desc.length} characters; Claude Code cuts it at ${LIMITS.descClaudeCode}`);
    else if (desc.length > LIMITS.descSpec)
      warns.push(`description is ${desc.length} characters; the Agent Skills spec allows ${LIMITS.descSpec}, so other tools may reject or cut it`);
    if (first.length > LIMITS.firstSentence)
      warns.push(`first sentence is ${first.length} characters; Hermes shows ${LIMITS.firstSentence}: put the task first, shorter`);
    if (!/use (it )?(this )?when/i.test(desc)) warns.push('description has no "Use when …": list the words a user would say');
    if (/^(this|a|the) skill\b/i.test(desc)) warns.push('description starts with "This skill …": start with the task (trigger words first)');
    if (desc.length < 80) warns.push(`description is only ${desc.length} characters: too vague to be picked`);
  }

  // body
  const bodyLines = text.split(/\r?\n/).slice(bodyStart);
  const body = bodyLines.join("\n");
  facts.bodyLines = bodyLines.length;
  if (bodyLines.length > LIMITS.bodyFail) fails.push(`SKILL.md body is ${bodyLines.length} lines; move material to references/ (limit ${LIMITS.bodyFail})`);
  else if (bodyLines.length > LIMITS.bodyWarn) warns.push(`SKILL.md body is ${bodyLines.length} lines; aim under 100, move one-step material to references/`);
  if (!/^#+\s*gotchas/im.test(body)) warns.push("no Gotchas section: add one, and a line each time the agent gets something wrong");
  if (!/done when/i.test(body)) warns.push('no "Done when" check in any step');

  // placeholders, filler (outside code and quotes)
  bodyLines.forEach((line, i) => {
    const n = bodyStart + i + 1;
    const prose = line.replace(/`[^`]*`/g, "").replace(/"[^"]*"/g, "").replace(/“[^”]*”/g, "");
    if (/\b(TODO|TBD|FIXME)\b/.test(prose)) fails.push(`SKILL.md:${n}: placeholder left: ${line.trim()}`);
    for (const f of FILLER) if (prose.toLowerCase().includes(f)) warns.push(`SKILL.md:${n}: filler "${f}": name the command, path or number instead, or delete the line`);
  });

  // links to files that do not exist (every .md in the skill, relative to that file)
  for (const file of mdFiles(dir)) {
    const md = stripFences(readFileSync(file, "utf8"));
    const rel = file.slice(dir.length + 1);
    const targets = new Set();
    for (const m of md.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) targets.add(m[1]);
    for (const m of md.matchAll(/`((?:scripts|references|examples|assets|templates)\/[^`\s]+)`/g)) targets.add(m[1]);
    for (let t of targets) {
      if (/^([a-z]+:|#)/i.test(t) || /[<>*{}$]/.test(t) || /:\d+$/.test(t)) continue;
      // only paths that belong to the skill: its folders, ./ ../, or another markdown file
      if (!/^(\.{1,2}\/|(scripts|references|examples|assets|templates)\/)/.test(t) && !/\.md(#.*)?$/.test(t)) continue;
      t = t.split("#")[0];
      const fromFile = resolve(dirname(file), t);
      const fromRoot = resolve(dir, t);
      if (!existsSync(fromFile) && !existsSync(fromRoot)) fails.push(`${rel}: links to ${t}, which does not exist`);
    }
  }

  // scripts SKILL.md runs directly (`scripts/x.sh …`, no interpreter in front) need the executable bit
  const sdir = join(dir, "scripts");
  if (existsSync(sdir)) {
    for (const e of readdirSync(sdir, { withFileTypes: true })) {
      if (!e.isFile()) continue;
      const p = join(sdir, e.name);
      const calledDirectly = body.includes("`scripts/" + e.name) || body.includes("`./scripts/" + e.name);
      if (calledDirectly && !(statSync(p).mode & 0o111)) warns.push(`scripts/${e.name} is run directly but is not executable: chmod +x`);
    }
  }
  return { fails, warns, facts };
}

function main() {
  const dir = process.argv[2];
  if (!dir || dir === "-h" || dir === "--help") {
    console.error("usage: node check-skill.mjs <skill-folder>");
    process.exit(2);
  }
  const { fails, warns, facts } = checkSkill(dir);
  if (facts.descriptionChars !== undefined)
    console.log(`description: ${facts.descriptionChars} chars; first sentence: ${facts.firstSentenceChars} chars ("${facts.firstSentence}")`);
  if (facts.bodyLines !== undefined) console.log(`SKILL.md body: ${facts.bodyLines} lines`);
  for (const f of fails) console.log(`FAIL ${f}`);
  for (const w of warns) console.log(`WARN ${w}`);
  console.log(fails.length ? `${fails.length} FAIL, ${warns.length} WARN` : `OK (${warns.length} WARN)`);
  process.exit(fails.length ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
````

檢查器通過不代表每一項都合理。每個警告都要修正，或明確說明為什麼保留。再確認所有機械步驟都呼叫腳本，並用 `bash -n` 或該語言的語法檢查確認腳本沒有語法錯誤；也要執行預演或 `--help`，確認沒有副作用。

若要實際測試 git push 腳本，應指向本機的 bare clone，例如用 `git clone --bare . <tmp>/origin.git` 建立測試目標。不要拿真實雲端帳號、密碼管理器、付款服務或正式環境來測試；先讀工具的 `--help`。

## 和使用者一起修稿

先展示資料夾樹、描述和每支腳本，再逐項檢查：

- 描述第一句是否在 57 個字元內點出任務？
- 使用者真的會輸入的關鍵字是否在描述中？
- 不提 skill 名稱的請求，是否也能觸發它？
- 描述是否說明它不會處理什麼，避免相近但不適合的請求誤觸？
- 每個步驟是否以動作開頭，並以可檢查的 `Done when …` 條件結尾？
- 會對外部系統產生變更的操作，是否先預演並取得核准？
- 每個參考檔案是否都有明確的閱讀時機？

接著問使用者：「你需要這項流程時，會輸入哪些字？」若缺少常用說法，就把它加到描述前段。無法取得使用者回覆時，則在報告末尾列出尚待確認的問題。

## 用 `fires.sh` 測試觸發

檢查器確認的是檔案和格式；要知道 agent 是否真的會載入 skill，還要測試觸發。`fires.sh` 需要 `claude` CLI，並且要在 skill 安裝所在的資料夾執行。

它會為每個請求建立新的 `claude -p` 工作階段，檢查指定 skill 是否被選中。先提供 3 個不提 skill 名稱、但應該觸發的請求，再用 `--not` 加入至少 1 個不應觸發的請求。預期結果是 3 個正向請求全數觸發，負向請求保持安靜，最後印出 `PASS`。

<!--image:4-->

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/skills/skills/write-great-skill/scripts/fires.sh#L1-L39 -->

```bash
#!/usr/bin/env bash
# fires.sh — does a fresh Claude Code session pick this skill by itself?
# Usage: scripts/fires.sh <skill-name> "<request>" ... [--not "<request>" ...]
#   Requests before --not should fire the skill; requests after --not should not.
#   Run it in the folder where the skill is installed (the repo, for .claude/skills/).
#   Each request runs in a new `claude -p` session that cannot write files or run commands.
#   FIRES_ONLY_PROJECT=1 loads only project and bundled skills (no ~/.claude skills, no plugins).
# Prints one line per request, the skills that were picked, two scores, and PASS or FAIL.
set -euo pipefail

[ $# -ge 2 ] || { sed -n '3,8p' "$0" | sed 's/^# \{0,1\}//'; exit 2; }
command -v claude >/dev/null || { echo "claude CLI not found" >&2; exit 2; }
name=$1; shift

extra=()
[ "${FIRES_ONLY_PROJECT:-0}" = 1 ] && extra+=(--setting-sources project,local)

pos_ok=0; pos=0; neg_ok=0; neg=0; expect=fire
for req in "$@"; do
  if [ "$req" = "--not" ]; then expect=quiet; continue; fi
  out=$(claude -p "$req" "${extra[@]+"${extra[@]}"}" --output-format stream-json --verbose \
        --max-turns 3 --permission-mode default \
        --disallowedTools Write Edit NotebookEdit Bash 2>/dev/null || true)
  picked=$(printf '%s' "$out" | grep -o '"name":"Skill","input":{"skill":"[^"]*"' \
           | sed 's/.*"skill":"//; s/"$//' | sort -u | paste -sd, - || true)
  if printf '%s\n' "${picked//,/$'\n'}" | grep -qxE "([a-z0-9-]+:)?$name"; then hit=1; else hit=0; fi
  if [ "$expect" = fire ]; then
    pos=$((pos + 1))
    if [ $hit = 1 ]; then pos_ok=$((pos_ok + 1)); echo "FIRED    ok   $req"
    else echo "MISSED   FAIL $req   (picked: ${picked:-none})"; fi
  else
    neg=$((neg + 1))
    if [ $hit = 0 ]; then neg_ok=$((neg_ok + 1)); echo "QUIET    ok   $req   (picked: ${picked:-none})"
    else echo "FIRED    FAIL $req   (should not fire)"; fi
  fi
done
echo "should fire: $pos_ok/$pos fired"
[ $neg -gt 0 ] && echo "should not fire: $neg_ok/$neg stayed quiet"
if [ $pos_ok = $pos ] && [ $neg_ok = $neg ]; then echo PASS; else echo FAIL; exit 1; fi
```

若正向請求沒有觸發，把使用者漏掉的說法補到描述前段，再重跑測試。若負向請求也觸發，就調整描述，讓它更清楚區分適用情境。設定 `FIRES_ONLY_PROJECT=1` 時，測試只會載入專案和內建 skill，不會載入 `~/.claude` 的 skill 或外掛。

## 刪掉不會改變行為的句子

逐行檢查：如果刪掉這句，agent 會不會做得不一樣？「寫乾淨的程式碼」、「使用有意義的名稱」這類句子，通常沒有提供團隊特有的資訊，應該刪除。

把篇幅留給會讓 agent 偏離預設做法的內容：這個系統的命令、團隊規定的步驟順序、不能踩的陷阱。最後加上 `## Gotchas`，納入訪談提到的每項禁忌；往後每次發現 agent 在這個 skill 裡犯錯，也補上一條說明症狀和真正原因的注意事項。

skill 寫好後，真正的驗收條件不是文件看起來完整，而是描述能抓到正確請求、固定操作由腳本穩定執行，而且觸發測試通過。
