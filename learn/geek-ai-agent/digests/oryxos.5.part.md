---
source: oryxos
source_type: codebase
source_lines: 145505
language: java
file_count: 250
part: 5
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — oryxos (part 5)

Scope: the IM channel layer — the 19 `oryxos-channel-*` modules (`alipay`, `cli`, `dingtalk`, `discord`, `douyin`, `feishu`, `gchat`, `matrix`, `mattermost`, `qq`, `slack`, `teams`, `telegram`, `wecom`, `weixin`, `weixin-kf`, `weixin-mini`, `weixin-mp`, `whatsapp`) plus the channel SPI they implement in `oryxos-core/channel/`. Covers the SPI, how a new channel is added, inbound/outbound symmetry, and the mechanism families.

## Overview (L1)

- **SPI (port) in `oryxos-core`** — `InboundChannelAdapter` is the single contract (`name/type/boundAgent/start/stop/status/sendReply`, optional `openProgressStream`). A normalized `InboundMessage` record is the only inbound model; all dedup/routing/session/reply/audit semantics converge in `InboundMessageService`, so an adapter only does *platform protocol ↔ normalized model* plus connection lifecycle. Adapters are pure POJOs (no Spring), wired explicitly by the runtime.
- **Push / persistent-connection family (免公网回调, no public callback)** — the platform opens a long-lived socket/long-poll and pushes events. `feishu` (oapi-sdk WS), `wecom` (`WeComWsClient`), `dingtalk` (Stream), `slack` (Socket Mode), `discord` (Gateway), `qq` (Gateway Hello→Identify→Heartbeat), `telegram` (`getUpdates` long-poll), `matrix` (`/sync` long-poll), `weixin` (iLink Bot long-poll). These need credentials + reconnect, not signature verification. `wecom` is the only *exclusive-connection* type: clustered deployments serialize it through a lease (`ChannelLeaseCoordinator`) so replicas never kick each other.
- **Webhook / HTTP-callback family (needs a public URL)** — the platform POSTs to `/api/v1/channels/inbound/{name}`. Each adapter implements the optional `InboundWebhookHandler` and owns its own verification/challenge/decrypt: `whatsapp` (HMAC-SHA256 `X-Hub-Signature-256` + `hub.challenge`), `teams` (Azure Bot), `gchat` (HTTP endpoint), `mattermost` (outgoing webhook token), `douyin` (`x-douyin-signature`), `alipay` (RSA2 `verifygw`, GBK form), and the WeChat trio `weixin-kf` / `weixin-mp` / `weixin-mini` (`MsgCrypt` AES decrypt + `echostr` URL verification; kf then pulls via `sync_msg`).
- **CLI channel** — `oryxos-channel-cli` is the odd one: `CliChannel` reads stdin/writes stdout but is *not* an `InboundChannelAdapter`; it calls `AgentService`/`SessionManager` directly, proving the same core entry point is reachable without the IM abstraction.
- **Inbound/outbound symmetry** — one adapter instance is both receiver and reply target (`replyVia`). Inbound normalizes and may pre-claim a `message_id` before expensive media download; outbound chunks platform limits, applies `OutboundGuard`, and threads/mentions per chat kind. Optional `InboundProgressStream` gives streaming UX where the platform supports editable messages (feishu/wecom/dingtalk/discord/slack).

## Structure (L2)

### oryxos-core/src/main/java/io/oryxos/core/channel/InboundChannelAdapter.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/channel/InboundChannelAdapter.java]]`
- Purpose: The channel SPI. "One instance = one platform app's one connection." Adapter converts platform protocol ↔ normalized model and manages connection lifecycle; it must not copy dedup/routing/session/audit (those live in `InboundMessageService`).
- Key exports: `name()`, `type()`, `boundAgent()`, `start()`, `stop()`, `status()`, `sendReply(chatId, text, replyToMessageId)`, `openProgressStream(...)` (default empty).
- Dependencies: none (core-only contract); implemented by every `oryxos-channel-*` adapter.
- Learner-relevant: Canonical port/adapter (hexagonal) boundary. `start()` must fail loud on unresolved credentials or missing bound Agent, never silently (FR-013/SC-008).

### oryxos-core/src/main/java/io/oryxos/core/channel/InboundMessage.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/channel/InboundMessage.java]]`
- Purpose: The normalized inbound record all channels produce and orchestration consumes: `channelType, channelName, messageId, chatKind, userId, chatId, content, textual, mentionedBot, attachments`. Enforces non-blank identity fields and the invariant "GROUP ⇒ `mentionedBot == true`".
- Key exports: `processable()` (text OR has attachments); constructor validation.
- Dependencies: `InboundAttachment`, `ChatKind`.
- Learner-relevant: The narrow waist of the channel layer. Non-@ group messages must be dropped in the normalizer (never construct this object), so orchestration never sees noise.

### oryxos-core/src/main/java/io/oryxos/core/channel/InboundMessageService.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/channel/InboundMessageService.java]]`
- Purpose: Shared orchestration for every channel (B1–B10 contracts): dedup `message_id` → route by `boundAgent` → P2P keeps a `channel+user+agent` session while GROUP is stateless per-@ → reply (reference original in group, direct in DM) → audit. Confirmation returns fast; ReAct runs on a virtual thread. Handles `/new`, `/stop`, unsupported-type and offline-asset replies, and delayed "processing" notices.
- Key exports: `onMessage`, `onClaimedMessage`, `tryClaim`, `beginSlowWork`; reply constants; `ActiveRunRegistry`.
- Dependencies: `AgentService`, `AgentExecutionService`, `SessionManager`, `ProfileRegistry`, `MessageDeduplicator`, `InboundMediaEnricher`, `InboundAssetGovernanceGate`.
- Learner-relevant: The clearest example of "adapters adapt, core decides": every cross-channel behavior is parameterized and pinned by `InboundMessageServiceContractTestBase` against both a real channel and a stub.

### oryxos-core/src/main/java/io/oryxos/core/channel (config, status, registry, admin)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/channel/ChannelConfig.java]]`
- Purpose: Declarative channel management. `ChannelConfig` = one `.oryxos/channels.yaml` entry (`name/type/app_id/app_secret/agent/enabled/extra/governance`; secrets must be `${ENV}` placeholders). `ChannelConfigLoader` has separate `load()` (resolved, for connecting) vs `loadRaw()` (literals preserved, for admin CRUD — never writes plaintext secrets back). `ChannelStatus` is the state machine (`CONNECTED/DISCONNECTED/DISABLED/STANDBY/ERROR`). `InboundChannelRegistry` is a live name→adapter map. `ChannelAdminService` does add/update/remove/startAll/stopAll (validate → persist → disconnect old → connect new), and only ever creates adapters through a `type → factory` map, so it never depends on a channel module.
- Key exports: `ChannelConfig`, `ChannelConfigLoader`, `ChannelStatus.State`, `InboundChannelRegistry`, `ChannelAdminService`.
- Dependencies: `ProfileRegistry`, `AssetGovernance`, factory map supplied by the runtime.
- Learner-relevant: Dependency inversion in practice — core knows "a channel" but no concrete channel; admin changes hot-reconnect without restart.

### oryxos-core/src/main/java/io/oryxos/core/channel (dedup, lease, backoff, webhook types)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/channel/SharedReceiptDeduplicator.java]]`
- Purpose: Resilience primitives. `MessageDeduplicator` (in-memory / `SharedReceiptDeduplicator` = local cache + shared receipt table under cluster), `ReconnectBackoff` (exponential delay shared by wecom/dingtalk), `ChannelLeaseCoordinator` (single-owner lease for exclusive-connection channels), `InboundWebhookHandler` + `WebhookRequest`/`WebhookResponse` (HTTP face), `OutboundGuard`, `InboundProgressStream` + `PlaceholderProgressStream` (thinking → optional tool line → terminal, with heartbeat).
- Key exports: `markIfFirst`, `ReconnectBackoff.delayMs`, `ChannelLeaseCoordinator.manage/unmanage`, `onWebhook`, `OutboundGuard.check`, `PlaceholderProgressStream`.
- Dependencies: `CoordinationStore` (cluster), metrics recorder.
- Learner-relevant: Exactly-once input under retries and at-most-one connection under clustering are solved once, in core, not per channel.

### oryxos-channel-slack (representative push channel, read in depth)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-slack/src/main/java/io/oryxos/channel/slack/SlackChannelAdapter.java]]`
- Purpose: The template for a long-connection adapter. `SlackSocketClient` opens Socket Mode (`apps.connections.open` with the App-Level `xapp-` token), ACKs envelopes and pushes `events_api` events; `SlackEventNormalizer` maps `message`/`app_mention` → `InboundMessage` (ignores bot self and edit/delete subtypes); `SlackMessageSender` posts via `chat.postMessage` (Bot `xoxb-` token), chunking to 3500 chars and using `thread_ts` for group replies; `SlackInboundMediaResolver` downloads `url_private` attachments with the bot token, falling back to the remote URL on failure; `SlackProgressStream` = placeholder + tool line + terminal; `SlackDisconnectKind` (GRACEFUL vs ABRUPT) drives reconnect via exponential backoff.
- Key exports: `SlackChannelAdapter`, `SlackSocketClient`, `SlackEventNormalizer`, `SlackMessageSender`, `SlackInboundMediaResolver`, `SlackProgressStream`.
- Dependencies: `io.oryxos.core.channel.*` (SPI + helpers); Slack Web API over `java.net.http`.
- Learner-relevant: Shows the full adapter anatomy (socket client, normalizer, sender, media resolver, progress stream, reconnect) and the credential-mapping convention (`app_id`/`app_secret` overloaded per platform, documented in the class javadoc).

### oryxos-channel-feishu

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-feishu/src/main/java/io/oryxos/channel/feishu/FeishuChannelAdapter.java]]`
- Purpose: The original enterprise channel. Lark `oapi-sdk` WS long connection (`EventDispatcher.newBuilder("", "")`) — no public callback, no signature checking; SDK auto-reconnects with heartbeat while the adapter tracks state. `FeishuEventNormalizer` handles @ detection/stripping; `FeishuMessageSender` chunks + sandbox-checks; `FeishuProgressCard`/`FeishuStreamListener` update an interactive card in place; `closeQuietly` bounds the SDK's blocking `close()` so shutdown is not dragged out.
- Key exports: `FeishuChannelAdapter`, `FeishuEventNormalizer`, `FeishuMessageSender`, `FeishuProgressCard`, `FeishuStreamListener`.
- Dependencies: `com.lark.oapi` SDK, core SPI.
- Learner-relevant: Best example of "reuse an SDK's long connection to avoid running a public callback server"; also documents an operational trap (blocking SDK close) and how to fence it.

### oryxos-channel-wecom

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-wecom/src/main/java/io/oryxos/channel/wecom/WeComChannelAdapter.java]]`
- Purpose: WeCom smart-bot long connection (`WeComWsClient`), symmetric to feishu. Adds media AES decryption (`WeComMediaAesDecrypt`), reconnect, and progress stream. Uniquely marked as an exclusive-connection type in `ChannelAdminService` (`EXCLUSIVE_CONNECTION_TYPES = {"wecom"}`), so cluster mode routes it through `ChannelLeaseCoordinator` (owner builds the connection, others `STANDBY`, takeover on lease expiry).
- Key exports: `WeComChannelAdapter`, `WeComWsClient`, `WeComEventNormalizer`, `WeComMessageSender`, `WeComMediaAesDecrypt`, `WeComProgressStream`.
- Dependencies: core SPI, `CoordinationStore` (via coordinator).
- Learner-relevant: The single-connection platform is the clearest case study for distributed ownership/fencing vs. random-replica fan-out.

### oryxos-channel-dingtalk, oryxos-channel-discord, oryxos-channel-qq

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-qq/src/main/java/io/oryxos/channel/qq/QqGatewayClient.java]]`
- Purpose: Three more push channels built on the same shape. `dingtalk` = Stream connection with `DingTalkStreamClient` + auto-reconnect (aligned with wecom) + progress stream. `discord` = Gateway WebSocket (`DiscordGatewayClient`) + progress stream + media resolver. `qq` = official-bot Gateway WebSocket with `Hello → Identify → Heartbeat` and `QqAccessTokenClient` token exchange; group @ and DM events normalized; inbound media downloaded like feishu/discord.
- Key exports: `DingTalkChannelAdapter/DingTalkStreamClient/DingTalkEventNormalizer/DingTalkMessageSender`; `DiscordChannelAdapter/DiscordGatewayClient/...`; `QqChannelAdapter/QqGatewayClient/QqAccessTokenClient/QqEventNormalizer/QqMessageSender`.
- Dependencies: core SPI; each own protocol client over `java.net.http` WebSocket.
- Learner-relevant: Shows the socket-protocol variations (ACK envelopes, heartbeat/identify handshakes) that a normalizer+client split absorbs so the adapter stays thin.

### oryxos-channel-telegram, oryxos-channel-matrix, oryxos-channel-weixin

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-telegram/src/main/java/io/oryxos/channel/telegram/TelegramChannelAdapter.java]]`
- Purpose: Long-poll instead of WebSocket, still "no public callback". `telegram` polls Bot API `getUpdates` (35s timeout, offset tracking, bot-username @ match). `matrix` polls Client-Server `/sync` (40s timeout, `since` token, DM/room timeline events, `extra.homeserver`). `weixin` is a personal-WeChat iLink bot: long-poll inbound + `sendmessage` reply, with `WeixinContextTokenStore` for context tokens and image/voice/file/video inbound.
- Key exports: `TelegramChannelAdapter/TelegramEventNormalizer/TelegramMessageSender`; `MatrixChannelAdapter/MatrixEventNormalizer/MatrixMessageSender/MatrixDirectRooms/MatrixInboundMediaResolver`; `WeixinChannelAdapter/WeixinIlinkClient/WeixinEventNormalizer/WeixinMessageSender/WeixinContextTokenStore/WeixinAesCdn`.
- Dependencies: core SPI; platform HTTP APIs.
- Learner-relevant: Long-poll is a third push mechanism (no inbound server, but also no SDK); offset/cursor management is the reliability core.

### oryxos-channel-whatsapp (representative webhook channel)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-whatsapp/src/main/java/io/oryxos/channel/whatsapp/WhatsAppChannelAdapter.java]]`
- Purpose: Cloud API shared webhook + Graph send. Implements `InboundWebhookHandler`: GET `hub.mode/hub.verify_token/hub.challenge` subscription handshake; POST verified by HMAC-SHA256 (`X-Hub-Signature-256`) over the raw body with the App Secret. Outbound is hard-refused outside the 24h session window (tracked per user) rather than silently dropped. `WhatsAppEventNormalizer` unpacks the nested entry/changes/value payload.
- Key exports: `WhatsAppChannelAdapter`, `WhatsAppEventNormalizer`, `WhatsAppMessageSender`, `SESSION_WINDOW`.
- Dependencies: core `InboundWebhookHandler` + SPI; Graph API.
- Learner-relevant: Cleanest reference for webhook security (challenge handshake + HMAC) and platform business rules (24h window) enforced at the adapter edge.

### oryxos-channel-teams, oryxos-channel-gchat, oryxos-channel-mattermost

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-teams/src/main/java/io/oryxos/channel/teams/TeamsChannelAdapter.java]]`
- Purpose: Enterprise webhook channels. `teams` = Azure Bot webhook (`app_id`/`app_secret`/`extra.tenant_id`), remembers `serviceUrl` per conversation to reply. `gchat` = Google Chat HTTP endpoint (`app_id` resource name, `app_secret` access token). `mattermost` = Outgoing Webhook (`app_secret` webhook token); sending prefers a PAT (`extra.access_token`) because the webhook token usually cannot call `/api/v4/posts`; media resolver included.
- Key exports: `TeamsChannelAdapter/TeamsEventNormalizer/TeamsMessageSender`; `GoogleChatChannelAdapter/...`; `MattermostChannelAdapter/MattermostEventNormalizer/MattermostMessageSender/MattermostInboundMediaResolver`.
- Dependencies: core `InboundWebhookHandler` + SPI.
- Learner-relevant: Shows per-platform auth/tenant variants and the "webhook token ≠ API token" distinction.

### oryxos-channel-alipay, oryxos-channel-douyin

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-alipay/src/main/java/io/oryxos/channel/alipay/AlipayChannelAdapter.java]]`
- Purpose: Consumer-app webhook integrations. `alipay` = Life Account app gateway: RSA2 verification (`AlipayRsa2`) with `verifygw` receipt, GBK form decoding (handled specially by the shared controller), reply via `alipay.open.public.message.custom.send`; `AlipayReplySessionStore` maps conversation→user. `douyin` = business DM: signature check (`x-douyin-signature`), reply via `/im/send/msg/` "scenario one"; `DouyinReplySessionStore` tracks the reply window.
- Key exports: `AlipayChannelAdapter/AlipayRsa2/AlipayEventNormalizer/AlipayApiClient/AlipayReplySessionStore`; `DouyinChannelAdapter/DouyinWebhookSignature/DouyinEventNormalizer/DouyinMessageSender/DouyinReplySessionStore`.
- Dependencies: core `InboundWebhookHandler` + SPI.
- Learner-relevant: Demonstrates crypto verification (RSA2 vs HMAC) and encoding pitfalls (GBK, base64 `+`) that must not leak into core.

### oryxos-channel-weixin-kf, oryxos-channel-weixin-mp, oryxos-channel-weixin-mini

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-weixin-kf/src/main/java/io/oryxos/channel/weixinkf/WeixinKfChannelAdapter.java]]`
- Purpose: The WeChat platform trio, all webhook-based with `MsgCrypt` AES decrypt and `echostr` URL verification. `weixin-mp` (service account) and `weixin-mini` (mini-program customer service) verify/decrypt, normalize text, ack `success` fast, then run the agent and reply via `message/custom/send`. `weixin-kf` (WeCom customer service, `kf/*`) is a *wake-up + pull* model: the callback only signals, then `sync_msg` pulls messages by cursor and `send_msg` replies. Each has its own `AccessTokenClient`, `ApiClient`, `CallbackXml`, and `MsgCrypt`.
- Key exports: `WeixinKfChannelAdapter/WeixinKfMsgCrypt/WeixinKfApiClient/WeixinKfAccessTokenClient/WeixinKfSyncResult`; `WeixinMpChannelAdapter/WeixinMpMsgCrypt/...`; `WeixinMiniChannelAdapter/WeixinMiniMsgCrypt/...`.
- Dependencies: core `InboundWebhookHandler` + SPI; WeChat APIs.
- Learner-relevant: Shows that "webhook" is not one shape — acknowledge-then-reply vs wake-then-pull — and how official crypto/CBOR-style XML is isolated per adapter.

### oryxos-channel-cli

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-channel-cli/src/main/java/io/oryxos/channel/cli/CliChannel.java]]`
- Purpose: Interactive terminal door for `oryxos chat`. Reads stdin (console reader or default charset, not hardcoded UTF-8), writes stdout with a typewriter `StreamListener`, supports `/quit` and `/new`, keeps one `SessionManager` session. Not an `InboundChannelAdapter`; it calls `AgentService.process` directly. Installs the OS user into `PrincipalContext` per turn for `ToolExecutor` RBAC decisions.
- Key exports: `CliChannel`, `TypewriterListener`, `stdinReader`, `stdinFallbackCharset`.
- Dependencies: `AgentService`, `SessionManager`, `PrincipalContext`.
- Learner-relevant: Proves the abstraction is optional — the core engine is reachable without IM normalization; also a minimal streaming-listener example.

### oryxos-cli/src/main/java/io/oryxos/cli/OryxOsRuntime.java (channel wiring)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-cli/src/main/java/io/oryxos/cli/OryxOsRuntime.java]]`
- Purpose: The composition root where channels are actually registered. `inboundChannelFactories(...)` builds a `LinkedHashMap<type, ChannelConfig → InboundChannelAdapter>` via `registerEnterpriseChannelFactories` (feishu, wecom, dingtalk, slack, discord, telegram) and `registerConsumerChannelFactories` (whatsapp, teams, gchat, mattermost, matrix, qq, douyin, weixin, weixin-kf, weixin-mp, weixin-mini, alipay), and the map is injected into `ChannelAdminService`. Cluster mode adds the `ChannelLeaseCoordinator`.
- Key exports: `inboundChannelFactories`, `registerEnterpriseChannelFactories`, `registerConsumerChannelFactories`, `channelAdminService`.
- Dependencies: all channel modules, `ChannelConfigLoader`, `InboundChannelRegistry`, `ProfileRegistry`, `OutboundGuard`.
- Learner-relevant: The exact "one line per channel" registration that makes adding a channel a modular, core-free change (SC-007).

### oryxos-web/src/main/java/io/oryxos/web/controller/ChannelInboundWebhookController.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/controller/ChannelInboundWebhookController.java]]`
- Purpose: Shared inbound webhook surface `GET/POST /api/v1/channels/inbound/{name}`. Looks up the running adapter by name; if it is an `InboundWebhookHandler` it forwards a normalized `WebhookRequest` (method, query, lowercased headers, raw body) and writes the adapter's `WebhookResponse` back verbatim (no `ApiResponse` envelope). Handles form-urlencoded bodies including Alipay's GBK quirk (`+` preserved for base64 signatures). Non-webhook channels 404.
- Key exports: `inboundGet`, `inboundPost`, `parseFormUrlEncodedForCompat`.
- Dependencies: `InboundChannelRegistry`, `InboundWebhookHandler`, `PrincipalHolder`.
- Learner-relevant: The single HTTP entry for all callback channels — one route, adapters own their crypto; also a good illustration of not forcing a uniform response envelope on third-party handshakes.

### docs/*ChannelSetup.md (per-channel setup guides)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/docs/SlackChannelSetup.md]]`
- Purpose: One setup guide per channel (`FeishuChannelSetup.md`, `WeComChannelSetup.md`, and 16 more), documenting platform-side app creation, credential mapping to `app_id`/`app_secret`/`extra`, and the `channels.yaml` entry.
- Key exports: n/a (documentation).
- Dependencies: mirror of each adapter's credential javadoc.
- Learner-relevant: The operational half of the abstraction — every channel reduces to "create an app, map credentials, add a YAML entry".

## How a new channel is added

1. Create a new Maven module `oryxos-channel-<name>` depending on `oryxos-core` (the SPI); keep classes pure POJO with no Spring.
2. Implement `InboundChannelAdapter` (`start`/`stop`/`status`/`sendReply`); optionally implement `InboundWebhookHandler` for callback platforms and override `openProgressStream` for editable-message platforms.
3. Add a `Normalizer` (platform event/JSON/XML → `InboundMessage`, enforcing `GROUP ⇒ mentionedBot` and stripping @) and a `MessageSender` (platform API, chunking, `OutboundGuard.check`), plus a media resolver if attachments exist.
4. Register the `TYPE` constant and a factory lambda in `OryxOsRuntime` (`registerEnterpriseChannelFactories` for push, `registerConsumerChannelFactories` for webhook) — one line, core untouched. Contract tests (`InboundMessageServiceContractTestBase`, `StubChannelAdapter`) pin the zero-core-change claim (SC-007).
5. Add a `channels.yaml` entry (`name/type/app_id/app_secret/agent/extra`); secrets via `${ENV}`. Optional `governance` block for asset ownership/visibility.

## Cross-cutting patterns worth teaching

- **Narrow waist**: `InboundMessage` is the only inbound type; `InboundChannelAdapter` the only outbound type. Everything else is core policy.
- **Two axes of grouping**: (a) connection mechanism (push socket / long-poll / webhook callback / local stdio) determines auth, reconnect, and cluster semantics; (b) chat kind (P2P stateful session vs GROUP stateless @-mention) determines routing and reply threading.
- **Verification stays at the edge**: HMAC, RSA2, `MsgCrypt`, `echostr`, `hub.challenge` are all per-adapter; core never parses platform crypto.
- **Fail-closed**: unresolved `${ENV}` credentials or a missing bound Agent prevent launch with a named error; `OutboundGuard` forces channel-built HTTP through the sandbox whitelist.
- **Exactly-once input**: dedup by `(channelName, messageId)`, upgraded to a shared receipt table in cluster mode.
