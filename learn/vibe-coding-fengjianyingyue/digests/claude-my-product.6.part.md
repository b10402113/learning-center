---
source: claude-my-product
source_type: codebase
source_lines: 938
language: mixed
file_count: 36
part: 6
status: absorbed
absorbed_at: 2026-09-26
created: 2026-09-26
updated: 2026-09-26
---

## Overview (L1)

This part covers the "monetize → visualize → promote" tail of the 财务管家 (personal-finance app) vibe-coding workflow. After the PRD/UI/frontend/backend/delivery stages, the same product is packaged and sold: content operations produce demo deliverables (AI-generated travel PPTs, a 201-page quant strategy 说明书, an operations manual, a fundraising deck), data visualization turns the app's own analytics into a dashboard and a Q1 report, and copywriting/promotion turns the app into marketing copy, an AI-narrated promo video, and a reusable Remotion + TTS video pipeline. The through-line is that a non-professional demo stack (single HTML files, ECharts, Remotion, edge-tts, PIL+ffmpeg) is used to fabricate a complete go-to-market artifact set around one small product. The `ppt-master-main/` tree here and in `010…自媒体与运营/` is vendored third-party tooling and is summarized only.

## Sections (L2)

### 010a-travel-ppt
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运维）/无锡三日游v2.pptx]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运维）/无锡三日游.pptx]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运维）/beijing_images/beijing_greatwall.png]]
- Purpose: AI-generated travel decks used as a content-ops demo — showing the workflow can mass-produce polished marketing/social content, not just software.
- Key claims: Two 无锡三日游 decks (v1 7 slides, v2 8 slides) follow the same skeleton — cover, 3-day itinerary, per-day sights/food/hotel, food roundup, practical info, closing. v2 adds a slide and richer per-day content (蠡湖日落, 梵天花海, 玉兰饼). AI image folders exist for three cities (`beijing_images`, `nanjing_images`, `wuxi_images`; 3–5 PNGs each, 2–3 MB apiece) plus `cyberpunk_puppy.png` / `miyazaki.png` style samples.
- Learner-relevant: Demonstrates prompt-driven deck generation from a fixed template and the "one product → derivative content" monetization pattern; the beijing/nanjing images were produced for a deck built by the root-level `create_beijing_ppt*.py` scripts (out of this part's scope) and the vendored ppt-master skill.

### 010b-ops-manual
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运营）/项目运营手册.docx]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运营）/项目运营手册.pdf]]
- Purpose: The content-operations playbook for running the app as a media/product business (docx and 3-page ReportLab-generated PDF carry the same V1.0 text).
- Key claims: Defines positioning (lightweight personal/family finance tool), three user tiers (individuals, couples/families, small-business owners), five core features (quick entry, category mgmt, multi-account, monthly stats, Excel export). Operations: user tiers and feedback/客诉 SLAs (24h/72h), cold-start via 5–10 seed users, word-of-mouth→paid growth, content scope limited to 记账 topics, publishing cadence (Tue/Thu), platform mix (公众号/知乎/小红书 first), real-person IP not corporate account, private-domain funnel, weekly check-in/社群 activation, and a risk register (backup, 30-min outage plan, negative-review handling, login lockout). Version V1.0 dated 2026-05.
- Learner-relevant: Shows the marketing/ops layer as a spec parallel to the engineering spec — same "write a document, generate artifacts from it" loop.

### 010c-quant-spec
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运维）/半导体领航者说明书.pdf]]
- Purpose: A large AI-generated "product 说明书" demonstrating the workflow applied to a completely different, sophisticated domain — quantitative hedge-fund strategy research.
- Key claims: 201-page A4 PDF (Chromium/Skia generated, Apr 2026) titled "半导体领航者 — 全球AI硬件产业链量化对冲策略深度说明书" by "QuantumAlpha Capital Research," marked confidential. Structured as five strategies (A AI-compute momentum high-beta; B semiconductor-equipment low-vol value; C cross-market supply-chain arbitrage; D multi-factor neutral; E VIX black-swan tail hedge) plus a comparison appendix. Each strategy has logic definition, factor exposure (Fama-French 5-factor + momentum, Barra, CAPM/Markowitz discussion), backtests (net-value curves, monthly return heatmaps, Brinson attribution), and stress tests. Concrete claimed numbers (e.g., Strategy A: annualized 5.70%, Sharpe 0.144, monthly win 58.3%, max drawdown −73.23%, vol 18.71%; 100 semiconductor names → 13 AI high-beta leaders; R5 aggressive).
- Learner-relevant: The strongest example that the same "design a spec → render a polished document" pipeline scales to glossy institutional-looking financial research; useful for judging credibility/verification of AI-authored artifacts.

### 010d-pitch-deck
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运维）/财务管家A轮融资路演.pptx]]
- Purpose: 5-slide A-round fundraising pitch for 财务管家, another packaged marketing artifact.
- Key claims: Cover (A轮 1000万人民币 / 出让10% / "3秒极速记账 / 100%数据安全 / 免费零门槛"), Pain Points (85% 月光族, 4.5亿+ potential users), Solution (3秒记账, 智能报表, Excel导出), Market (500亿+ market, 4.5亿 users, 68% phone penetration, 32% willingness to pay), Team + contact. A root-level HTML version exists (`财务管家A轮融资路演.html`).
- Learner-relevant: Shows the fundraising narrative template reused across deck and HTML formats; good for the "product story" step.

### 010e-vendored-ppt-master
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运营）/ppt-master-main/index.html]]
- Purpose: Vendored third-party PPT-generation skill (`skills/ppt-master`, also present under `010…自媒体与运维/`); ~13,200 files, not authored here.
- Key claims: Ships its own docs/examples (LizQi themes, SVG slide outputs, `北京3日游_pptmaster.pptx` under a `projects/beijing_travel_ppt169_20260521/` project folder) used to produce the travel decks in 010a.
- Learner-relevant: Acknowledged only as external tooling; do not deep-read or absorb as original material.

### 011a-dataviz-dashboard
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/011.数据可视化/index.html]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/011.数据可视化/chart_data.json]]
- Purpose: A single-file ECharts 5.4.3 operations dashboard ("个人记账APP运营分析仪表盘") visualizing the app's analytics so the numbers can be shown to stakeholders/users.
- Key claims: Gradient hero, four KPI cards (总用户数 99, 总记录数 500, 总收入 ¥1,824,400, 总支出 derived by summing categories), then seven charts: monthly income/expense trend (line), city consumption ranking (bar, 8 cities), payment-method distribution (donut), expense-category (donut, roseType), income-category (donut), member-type distribution (bar), and an expense/income radar. All data is inlined from `chart_data.json` (embedded copy overwrites/changes some values, e.g. city list trimmed to 8, member totals 169/169/162, monthly through 2026-05 only) — a self-contained no-build artifact.
- Learner-relevant: Canonical "data → dashboard" deliverable of the visualize stage; also a caution that the inlined JSON diverges from the standalone `chart_data.json` (which has 6 months, 14 expense categories, and extra `ops` metrics).

### 011b-ops-report
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/011.数据可视化/个人记账APP运营分析报告.docx]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/011.数据可视化/个人记账APP运营分析数据.xlsx]]
- Purpose: The written Q1 2026 operations report and its raw dataset, feeding/paralleling the dashboard.
- Key claims: Report (dated 2026-05-26) gives executive summary, core metrics (99 users, 500 records, ¥1,824,400 income, ¥220,296 expense), income mix (兼职 35.3% / 投资收益 33.4% / 工资 31.3%), expense TOP5, user profile (169/169/162 by member type, city and payment breakdowns), monthly trend Jan–Jun, and four recommendations (membership, tier-1 cities, payment partnerships, social/AA features). The xlsx holds the underlying per-record table: 记录ID / 日期 / 用户ID (USER1000–USER1100) / 城市 / 交易类型 / 分类 / 金额 / 支付方式 / 是否会员 / 备注.
- Learner-relevant: Shows the report and its data source side by side — the raw USER IDs and categories explain where the dashboard's aggregates come from; good for a "figure to source" traceability lesson.

### 012a-marketing-copy
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/财务管家推广文案.md]]
- Purpose: Social-media marketing copy for 财务管家, generated from the PRD ("本文基于财务管家PRD V1.0.1生成").
- Key claims: 公众号推文 with three candidate headlines, an emotional "姐妹们" body structured around pain (salary gone, no idea where), the 3-second entry flow, auto statistics, multi-account/family/Excel/pink-UI selling points, a "月存2000" testimonial, and a scan-the-mini-program CTA. Ends with a product-selling-point table and a list of two AI-generated illustrations (app-UI mock + pie-chart mock).
- Learner-relevant: Model of copy engineered from feature specs; the headline variants and pain→solution→proof→CTA structure are reusable patterns.

### 012b-promo-video-remotion
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/finance-promo/src/Root.tsx]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/finance-promo/package.json]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/finance-promo/index.html]]
- Purpose: A Remotion (React) project that renders the 9:16 "FinancePromo" video; the code-based counterpart of the Python renderer.
- Key claims: `package.json` deps are `@remotion/*` 4.x + React 18, scripts for studio/render (`remotion render src/Root.tsx FinancePromo out/video.mp4`). `Root.tsx` defines six scene components (cover, pain points, 3-second bookkeeping, stats features, pink UI, closing) each driven by `interpolate` opacity/scale tied to per-scene frame offsets (3s apart, fps 30), assembled in `FinancePromo` with `<Audio src={staticFile("voiceover.m4a")} />`, exported as `<Composition id="FinancePromo" durationInFrames={540} width={1080} height={1920}>` (~18s, 9:16). `index.tsx` registers the root.
- Learner-relevant: Compact example of programmatic video composition synchronized to narration; scene-per-3-seconds maps 1:1 to the audio script's six sentences.

### 012c-video-audio-pipeline
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/finance-promo/generate_audio.py]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/finance-promo/generate_video.py]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/finance-promo/public/voiceover.m4a]]
- Purpose: The TTS + frame-render + ffmpeg muxing pipeline that produces the promo without Remotion.
- Key claims: `generate_audio.py` uses `edge-tts` (auto-installs if missing) with voice `zh-CN-XiaoxiaoNeural` and a six-sentence Chinese script → `voiceover.mp3`; it declares a `SCENES` table mapping timestamps 0/3/6/9/12/15s to the six scenes. `generate_video.py` renders 540 PIL frames at 1080×1920 (six 3-second scenes drawn with text/emoji and PingFang fonts) then muxes them with the audio via ffmpeg (`libx264`, `yuv420p`, `-shortest`). Hard-coded absolute paths under `/Volumes/lee/workspaces/claude_workspace/...` and legacy naming (a stray space in ` financeira-promo.mp4`) are visible. Outputs: `财务管家推广视频.mp4` (1080×1920, 18s) and ` financeira-promo.mp4` (same, 300 KB); `个人记账APP运营报告视频.mp4` is a separate 12s 1080×1080 report video. The shipped `voiceover.m4a` is actually 35.2s, longer than the 18s composition.
- Learner-relevant: Shows two render paths (declarative Remotion vs imperative PIL+ffmpeg) for the same 18-second promo, plus TTS-driven narration; useful for a "choose your video tooling" comparison and a lesson on script/audio/video duration mismatches.

### 012d-promo-images
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/A_friendly_personal_finance_ma_1779784422.png]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/Colorful_pie_chart_showing_exp_1779784558.png]]
- Purpose: AI-generated marketing illustrations referenced by the copy (app-UI mock and expense pie chart), named with generation timestamps.
- Key claims: Two PNGs (~1.4 MB and ~1.8 MB) match the "已生成配图" list in `财务管家推广文案.md`.
- Learner-relevant: Illustrates the "copy references generated assets" linkage; filenames embed epoch-like timestamps useful for provenance.
