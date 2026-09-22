---
source: 第19节：Notify 模块 原理解析、实现与代码讲解
source_type: pdf
source_lines: 473
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第19节：Notify 模块 原理解析、实现与代码讲解

## Overview (L1)

- Notify 是什么 — the outbound counterpart to inbound Channel adapters: how an Agent proactively pushes a result out when no requester is waiting (scheduled/日报 scenarios).
- 动手前想清楚 — define the interface before the implementation; core phase ships only a generic webhook adapter; safety check is wired in but detailed in the Sandbox lessons; destination lives in Profile config.
- 代码怎么写 — `NotifyChannelAdapter` + `NotifyTarget` + `WebhookNotifyAdapter` + `NotifyTools.notify`, using the `ProfileContext` ThreadLocal.
- 验收 harness — two batches: `WebhookNotifyAdapterTest` now, `NotifyToolsTest` after lesson 20/24 wiring (ordering assertion `enforce` before `send`).
- 怎么用怎么验 — configure `notify_channels`, Agent decides when to call; manual real-webhook and interface-neutrality checks.
- 主流 Notify 渠道与对接 — survey of enterprise channels, their webhook payload differences, onboarding steps and extension paths.

## Sections (L2)

### 一-notify-是什么

- Locator: `[[sources/geek-ai-agent/20260922/第19节：Notify 模块 原理解析、实现与代码讲解.pdf#一-notify-是什么]]`
- Summary: CLI and Web Service are "human-push" request-response paths; when the trigger becomes automatic ("到点自动"), that path breaks and the Agent must decide where and how to send results — that is Notify's job.
- Key claims: Inbound (ChannelAdapter) and outbound (NotifyChannelAdapter) must both use the adapter plugin pattern to stay symmetric; without it every business Skill hand-writes its own webhook/MCP integration; NotifyTools unifies the most common "push a message out" action.
- Learner-relevant: First appearance of the "interface first" habit later reused by Memory and Sandbox.

### 二-动手前先想清楚

- Locator: `[[sources/geek-ai-agent/20260922/第19节：Notify 模块 原理解析、实现与代码讲解.pdf#二-动手前先想清楚]]`
- Summary: Four decisions: abstract an interface expressing intent ("deliver content to a notification target") without channel-specific words; core phase covers only a generic webhook; safety validation is a placeholder to be detailed in Sandbox 23/24; destination is Profile config, not conversation content.
- Key claims: Implementation-order note — `NotifyChannelAdapter` / `NotifyTarget` / `WebhookNotifyAdapter` are immediately implementable, but full `NotifyTools` wiring depends on the `@Tool` registration (lesson 20) and `Sandbox.enforce` (23/24), so its completion point is after lesson 24.
- Learner-relevant: Demonstrates sequencing teaching vs. build order and the interface-first plugin pattern.

### 三-代码怎么写

- Locator: `[[sources/geek-ai-agent/20260922/第19节：Notify 模块 原理解析、实现与代码讲解.pdf#三-代码怎么写]]`
- Summary: `NotifyChannelAdapter.send(NotifyTarget, String)` with `NotifyTarget(channelType, Map<String,String> config)`; `WebhookNotifyAdapter` POSTs `{"content": content}` to `config["url"]`; `NotifyTools.notify(content, channel)` resolves the target from the current Profile's `notify_channels`, calls `sandbox.enforce(...HTTP_REQUEST...)`, then `adapter.send`.
- Key claims: The signature contains no channel-specific concept, so swapping webhook for a per-vendor adapter changes `NotifyTools` zero lines; `channel` is optional and defaults to the first channel; Profile example `notify_channels: [{type: webhook, url: ${TEAM_WEBHOOK_URL}}]`.
- Learner-relevant: Concrete interface-first implementation and the config-not-conversation rule for destinations.

### 四-验收-harness

- Locator: `[[sources/geek-ai-agent/20260922/第19节：Notify 模块 原理解析、实现与代码讲解.pdf#四-验收-harness]]`
- Summary: Batch 1 `WebhookNotifyAdapterTest` uses MockWebServer to assert the POST body carries `content`, the URL comes from `NotifyTarget.config` (not hardcoded), and 5xx propagates rather than being swallowed. Batch 2 `NotifyToolsTest` mocks Sandbox and Adapter: unconfigured `notify_channels` errors explicitly, missing `channel` uses the first channel, and `enforce` is called before `send` (asserted with `InOrder`).
- Key claims: The ordering assertion is the most critical — reversed order equals a whitelist bypass; "not configured" must fail loudly, never silently.
- Learner-relevant: Teaches order-of-operations security assertions and failure-loudness.

### 五-怎么用做完怎么验

- Locator: `[[sources/geek-ai-agent/20260922/第19节：Notify 模块 原理解析、实现与代码讲解.pdf#五-怎么用做完怎么验]]`
- Summary: Once `notify_channels` is configured the Agent decides autonomously whether to call notify (e.g., daily weather pushed to a group); manual checks verify a real webhook receives the message and the interface-neutrality self-test (would swapping in the WeChat SDK require changing the signature? No).
- Key claims: Notify completes the "Agent can not only speak but send outward" exit; without it scheduled/日报 agents would leave results rotting in the Session.
- Learner-relevant: Ties Notify to the scheduled-module and weather/日报 demos.

### 六-主流-notify-渠道与对接说明

- Locator: `[[sources/geek-ai-agent/20260922/第19节：Notify 模块 原理解析、实现与代码讲解.pdf#六-主流-notify-渠道与对接说明]]`
- Summary: Surveys enterprise channels by scenario (team collaboration, personal alerts, alert-on-call, formal reach) and their access forms; gives the judgment rule "one POST to a URL = core-phase reachable; connections/token refresh/request signing = extension phase". Details per-vendor webhook payload differences (WeCom/飞书/钉钉/Slack/Discord/Telegram/ntfy/Lark/Teams), real gotchas (DingTalk requires one of three security settings; Feishu signature optional; Teams classic webhook retired in favor of Power Automate), a 5-step onboarding (create bot → env-var URL → Profile → domain into Sandbox whitelist → test message), and two extension paths for mismatched payloads (per-`channelType` dedicated adapters, or MCP for rich formats).
- Key claims: "All webhooks" ≠ "same JSON format" — core `WebhookNotifyAdapter` sends `{"content": ...}` while each vendor differs; regardless of channel, `NotifyChannelAdapter.send(NotifyTarget, String)` still needs no change; webhook URL token is itself the credential, so it must never be written plaintext/logged/committed.
- Learner-relevant: Provides concrete integration anchors and the selection principle "plain text → notify+webhook; specialized format/auth → dedicated adapter; rich card → MCP".
