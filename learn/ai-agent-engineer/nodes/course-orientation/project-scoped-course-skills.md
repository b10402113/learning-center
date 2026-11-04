# 課程 skills 的一次性安裝

TicketBay 的 unit tests 跑綠之後，最後一步是把課程 skills 裝好。如果你在 TicketBay 專案裡使用 Claude Code，skills 必須安裝在專案的 `.claude/skills/`，不能只安裝在自己電腦的全域目錄。這樣進入 `./box` 時，Claude Code 才能讀取專案中的 skills；全域安裝在 `~/.claude/skills/` 的內容則不會掛進 box。

<!--image:1-->

先在自己的電腦開啟 TicketBay 資料夾，也就是 `<DEV_DIR>/ticket-bay`。執行以下指令會安裝十個 skills：`dmoka/skills` 裡的九個，以及獨立存放在 `dmoka/quicke2e` 的 QuickE2E。這些 skills 會安裝給 Claude Code 使用，並產生記錄來源的 `skills-lock.json`。不要加上 `-g` 或 `--global`，否則 skills 會安裝到全域位置。

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L235-L235 -->

```bash
npx -y skills add dmoka/skills --skill '*' --agent claude-code -y && npx -y skills add dmoka/quicke2e --skill quicke2e --agent claude-code -y
```

這次安裝不會取代 TicketBay 原有的 `debug-runbook`。QuickE2E 不需要另外安裝 Python 或 `uv`；`uv` 只供 README 提到的選用本機引擎使用。

安裝後，Git 會把 `.claude/skills/` 和 `skills-lock.json` 顯示為尚未追蹤的檔案。不要把這些檔案提交到分支，因為切換到課程分支時，已提交的檔案可能會從工作目錄消失。改用 `.git/info/exclude` 忽略這些檔案，讓它們不會被提交，但仍保留在本機。

<!--image:2-->

安裝完成後、自己新增 skills 之前，執行：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L252-L253 -->

```bash
git ls-files --others --exclude-standard --directory .claude/skills skills-lock.json \
  >> "$(git rev-parse --git-path info/exclude)"
```

這會將目前未追蹤的 skill 資料夾和 `skills-lock.json` 加進排除清單，且只忽略這些路徑。之後自己放進 `.claude/skills/` 的新 skill 仍會出現在 `git status`。執行 `cat .git/info/exclude` 可以檢查清單內容。

### 用 Done when 確認安裝完成

留在 TicketBay 資料夾中，執行以下檢查：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L270-L274 -->

```bash
for s in grill-me pr-tour pr-triage mutation-testing legacy-testing adversarial-tester \
         bug-triage agent-safety-audit write-great-skill quicke2e; do
  test -f ".claude/skills/$s/SKILL.md" || echo "missing: $s"
done
git status --short | grep -E '^\?\? (\.claude/skills/|skills-lock\.json)'
```

十個 skills 都安裝完成時，前半段不會輸出任何內容；如果有缺漏，則會印出 `missing:` 和 skill 名稱。後半段也應該沒有輸出，表示 `.claude/skills/` 和 `skills-lock.json` 沒有被 Git 列為未追蹤檔案。兩項檢查都沒有輸出，就代表安裝完成。

如果看到 `npx: command not found`，表示尚未安裝 Node。遇到網路錯誤或 `git clone failed` 時，請檢查網路和 GitHub 登入狀態，再重新執行安裝指令；重跑不會造成問題。日後要更新 skills，可執行 `npx -y skills update -p -y`。
