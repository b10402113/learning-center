# Replace polish-agent with teach-node writing standard

Step articles previously went through a two-pass pipeline: draft (sub-agent) then polish (polish-agent rewriting the body in a chosen author style). This added complexity — a separate agent, a template system (`polish/<slug>/`), and a `MEMORY.md` `polish` field — without proportional value, since the polish pass often regenerated content sentence-by-sentence and the style templates were hand-maintained overhead.

We replace the polish pass with **teach-node**: a single-pass writing standard where sub-agents write step articles directly in a consistent, component-rich style. Step articles use MDX with React components (`knowledge-map/src/components/teach-node/`) for structured content: `<LearningGoal>`, `<KeyInsight>`, `<DecisionTable>`, `<DecisionTree>`, `<WarningBox>`, `<Analogy>`, `<Quiz>`. The `nodes` skill step 8 and step 9 merge into one step. The `polish` field is removed from `MEMORY.md`. Existing `polish/` directories are retained for reference but no longer referenced by the pipeline. The standalone `teach` skill (workspace model, HTML lessons) is preserved unchanged.

This is hard to reverse because it changes the contract every sub-agent follows when writing step articles, and it removes the polish-agent dispatch path from the nodes pipeline.
