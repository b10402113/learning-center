---
id: rig-audit-deploy
title: "怎麼把它真的上線"
subject: claude-code-master
tier: 7
order: 14
status: written
goal: "能接真表單（Resend）、用 Playwright 自測、部署到 Vercel，並把整段流程存成可重用的建站 skill。"
digests:
  - volume-f-taste-and-design.md
prerequisites: []
steps:
  - id: rig-the-contact-form
    title: "Rig：用 Resend 把聯絡表單接成真的會寄信"
    purpose: "能把聯絡表單接上 Resend API key，按下送出就收到真實郵件。"
    sources:
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/9-Module F8 - Backend Rig and Audit/index.html#L94-L98]]"
  - id: audit-with-playwright
    title: "Audit：讓 agent 用 Playwright 把所有按鈕和表單點過一遍"
    purpose: "能讓 agent 用 Playwright 自己走過每個按鈕與表單，在上線前抓出壞掉的地方。"
    sources:
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/9-Module F8 - Backend Rig and Audit/index.html#L94-L98]]"
  - id: fire-up-on-vercel
    title: "Fire up：幾秒部署到 Vercel，挑一個自己的網址"
    purpose: "能把本機網站部署到 Vercel，並選定一個別人打得開的網址。"
    sources:
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/10-Module F9 - Deployment and Launch!/index.html#L94-L98]]"
  - id: tailor-into-a-website-skill
    title: "Tailor：把整段建站流程存成可重用的 skill"
    purpose: "能把整段建站流程連同修正寫成 website-creation skill，並套到客戶專案上。"
    sources:
      - "[[sources/claude-code-master/20261028/7-Volume F - Taste and Design/10-Module F9 - Deployment and Launch!/index.html#L94-L98]]"
created: 2026-10-28
updated: 2026-10-31
---

# 怎麼把它真的上線

## Lesson

漂亮的首頁還不算完成，這一課走 CRAFT 的後半段：Rig——把聯絡表單接上 Resend、用 API key 真的寄出信；Audit——讓 agent 用 Playwright 自己測過一輪再上線；Fire up——幾秒部署到 Vercel、挑一個網址。最後把整段建站流程（連同修正）寫成一個可重用的 website-creation skill。

## Steps

1. [Rig：用 Resend 把聯絡表單接成真的會寄信](rig-audit-deploy/rig-the-contact-form.md)
2. [Audit：讓 agent 用 Playwright 把所有按鈕和表單點過一遍](rig-audit-deploy/audit-with-playwright.md)
3. [Fire up：幾秒部署到 Vercel，挑一個自己的網址](rig-audit-deploy/fire-up-on-vercel.md)
4. [Tailor：把整段建站流程存成可重用的 skill](rig-audit-deploy/tailor-into-a-website-skill.md)
