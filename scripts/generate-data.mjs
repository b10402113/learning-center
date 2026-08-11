import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEARN_ROOT = join(REPO_ROOT, "learn");
const OUT = join(REPO_ROOT, "knowledge-map", "src", "data", "graph.json");

const STATUS_ORDER = ["draft", "confirmed", "nodes-written", "content-written", "edges-written"];
const ALLOWED_STATUS = new Set(STATUS_ORDER);

export function coerce(value) {
  const trimmed = value.trim();
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

export function unquote(value) {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseFrontmatter(md) {
  const data = {};
  const match = md.match(/^---\n([\s\S]*?)\n---\n?/);
  let body = md;
  if (match) {
    body = md.slice(match[0].length);
    let current = null;
    for (const raw of match[1].split("\n")) {
      const line = raw.trimEnd();
      if (!line.trim()) continue;
      const listStart = line.match(/^([\w-]+):\s*$/);
      if (listStart) {
        current = listStart[1];
        data[current] = [];
        continue;
      }
      const kv = line.match(/^([\w-]+):\s*(.*)$/);
      if (kv) {
        current = kv[1];
        const value = unquote(kv[2].trim());
        if (value === "[]") data[current] = [];
        else data[current] = coerce(value);
        continue;
      }
      const item = line.match(/^\s*-\s+(.*)$/);
      if (item && current) {
        data[current].push(coerce(unquote(item[1].trim())));
      }
    }
  }
  return { data, body };
}

export function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text) {
  const tokens = [];
  let out = text.replace(/`([^`]+)`/g, (_m, code) => {
    tokens.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
    tokens.push(`<a href="${escapeHtml(url)}">${renderInline(label)}</a>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = out.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, label) => {
    if (target.startsWith("sources/")) {
      tokens.push(`<span class="source-ref">${escapeHtml(target)}</span>`);
    } else {
      const text = label || target.split("/").pop();
      tokens.push(
        `<a class="wikilink" data-target="${escapeHtml(target)}">${renderInline(text)}</a>`,
      );
    }
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, (_m, inner) => {
    tokens.push(`<strong>${renderInline(inner)}</strong>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, (_m, pre, inner) => {
    tokens.push(`${pre}<em>${renderInline(inner)}</em>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });
  out = escapeHtml(out).replace(/\u0000(\d+)\u0000/g, (_m, i) => tokens[Number(i)]);
  return out;
}

export function renderMarkdown(md) {
  const lines = md.split("\n");
  const out = [];
  let para = [];
  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${renderInline(para.join(" "))}</p>`);
      para = [];
    }
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      flushPara();
      i++;
      continue;
    }
    if (line.trim().startsWith("```")) {
      flushPara();
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(`<pre class="code-block"><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushPara();
      const level = heading[1].length;
      out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      i++;
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara();
      const buf = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      out.push(`<blockquote><p>${renderInline(buf.join(" "))}</p></blockquote>`);
      continue;
    }
    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem) {
      flushPara();
      out.push("<ul>");
      while (i < lines.length) {
        const m = lines[i].match(/^\s*-\s+(.*)$/);
        if (!m) break;
        out.push(`<li>${renderInline(m[1])}</li>`);
        i++;
        if (i < lines.length && /^\s+-\s+/.test(lines[i])) {
          out.push("<ul>");
          while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
            const nested = lines[i].match(/^\s*-\s+(.*)$/);
            out.push(`<li>${renderInline(nested[1])}</li>`);
            i++;
          }
          out.push("</ul>");
        }
      }
      out.push("</ul>");
      continue;
    }
    const orderedItem = line.match(/^\d+\.\s+(.*)$/);
    if (orderedItem) {
      flushPara();
      out.push("<ol>");
      while (i < lines.length) {
        const m = lines[i].match(/^\d+\.\s+(.*)$/);
        if (!m) break;
        out.push(`<li>${renderInline(m[1])}</li>`);
        i++;
      }
      out.push("</ol>");
      continue;
    }
    para.push(line);
    i++;
  }
  flushPara();
  return out.join("\n");
}

function stripSubjectPrefix(value) {
  return String(value).split("/").pop();
}

function extractNodeLinks(body, subject) {
  const links = new Set();
  const re = new RegExp(
    `\\[\\[learn\\/${subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\/nodes\\/([^\\]|]+)`,
    "g",
  );
  let m;
  while ((m = re.exec(body)) !== null) {
    links.add(m[1]);
  }
  return [...links];
}

function parseTiers(roadmap) {
  const tiers = [];
  for (const line of roadmap.split("\n")) {
    const m = line.match(/^#{1,6}\s*Tier\s+(\d+)\s+[—-]\s+(.+)$/);
    if (m) {
      tiers.push({ tier: Number(m[1]), title: m[2].trim() });
    }
  }
  return tiers;
}

export function buildSubjectGraph({ subject, roadmap, pathFiles, nodeFiles, edgeFiles }) {
  const paths = [];
  for (const content of Object.values(pathFiles)) {
    const { data, body } = parseFrontmatter(content);
    if (!data.id) continue;
    const html = renderMarkdown(body);
    paths.push({
      id: data.id,
      title: data.title ?? data.id,
      tier: Number(data.tier) || 1,
      order: Number(data.order) || 0,
      duration: data.duration ?? "",
      goal: data.goal ?? "",
      status: ALLOWED_STATUS.has(data.status) ? data.status : "draft",
      taughtNodeIds: (data.nodes ?? []).map(stripSubjectPrefix),
      sources: data.sources ?? [],
      contentHtml: html,
      fullArticleHtml: html,
    });
  }
  paths.sort((a, b) => a.tier - b.tier || a.order - b.order);

  const nodes = {};
  for (const content of Object.values(nodeFiles)) {
    const { data, body } = parseFrontmatter(content);
    if (!data.id) continue;
    nodes[data.id] = {
      id: data.id,
      title: data.title ?? data.id,
      tier: Number(data.tier) || 1,
      order: Number(data.order) || 0,
      taughtBy: (data.paths ?? []).map(stripSubjectPrefix),
      sources: data.sources ?? [],
      bodyHtml: renderMarkdown(body),
      connections: extractNodeLinks(body, subject),
    };
  }

  const tierTitleById = new Map(parseTiers(roadmap).map((t) => [t.tier, t.title]));
  const byTier = new Map();
  for (const p of paths) {
    if (!byTier.has(p.tier)) byTier.set(p.tier, []);
    byTier.get(p.tier).push(p.id);
  }
  const tiers = [...byTier.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([tier, pathIds]) => ({
      tier,
      title: tierTitleById.get(tier) ?? `Tier ${tier}`,
      pathIds,
    }));

  const nodeToPaths = new Map();
  for (const p of paths) {
    for (const nodeId of p.taughtNodeIds) {
      if (!nodeToPaths.has(nodeId)) nodeToPaths.set(nodeId, []);
      nodeToPaths.get(nodeId).push(p);
    }
  }

  const edges = [];
  const seen = new Set();
  const pushEdge = (from, to, kind, label) => {
    if (from === to) return;
    const key = `${from}\u0000${to}\u0000${kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push(label ? { from, to, kind, label } : { from, to, kind });
  };

  for (let i = 0; i + 1 < paths.length; i++) {
    pushEdge(paths[i].id, paths[i + 1].id, "spine");
  }

  for (const teachingPaths of nodeToPaths.values()) {
    for (let i = 0; i < teachingPaths.length; i++) {
      for (let j = i + 1; j < teachingPaths.length; j++) {
        pushEdge(teachingPaths[i].id, teachingPaths[j].id, "shared-concept");
      }
    }
  }

  for (const content of Object.values(edgeFiles)) {
    const { data } = parseFrontmatter(content);
    if (!data.from || !data.to) continue;
    const fromNode = stripSubjectPrefix(data.from);
    const toNode = stripSubjectPrefix(data.to);
    const fromPaths = nodeToPaths.get(fromNode) ?? [];
    const toPaths = nodeToPaths.get(toNode) ?? [];
    for (const fp of fromPaths) {
      for (const tp of toPaths) {
        pushEdge(fp.id, tp.id, "explicit", data.title);
      }
    }
  }

  edges.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to) || a.kind.localeCompare(b.kind));

  const nodesList = Object.values(nodes);
  for (const p of paths) {
    const related = new Set();
    for (const nodeId of p.taughtNodeIds) {
      const node = nodes[nodeId];
      if (!node) continue;
      for (const c of node.connections) related.add(c);
      for (const other of nodesList) {
        if (other.connections.includes(nodeId)) related.add(other.id);
      }
    }
    for (const nodeId of p.taughtNodeIds) related.delete(nodeId);
    p.relatedNodeIds = [...related].sort();
  }

  return {
    subject,
    tiers,
    paths,
    nodes,
    edges,
  };
}

export function scanSubject(subject, learnRoot) {
  const sub = join(learnRoot, subject);
  const read = (rel) => readFileSync(join(sub, rel), "utf8");
  const list = (dir) => {
    const dirPath = join(sub, dir);
    if (!existsSync(dirPath)) return {};
    return Object.fromEntries(
      readdirSync(dirPath, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(".md"))
        .map((e) => [`${dir}/${e.name}`, read(`${dir}/${e.name}`)]),
    );
  };
  return {
    roadmap: read("ROADMAP.md"),
    pathFiles: list("paths"),
    nodeFiles: list("nodes"),
    edgeFiles: list("edges"),
  };
}

export function loadAllSubjects(learnRoot) {
  const subjects = readdirSync(learnRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(learnRoot, e.name, "ROADMAP.md")))
    .map((e) => e.name)
    .sort();
  return subjects.map((subject) => {
    const scanned = scanSubject(subject, learnRoot);
    return buildSubjectGraph({
      subject,
      roadmap: scanned.roadmap,
      pathFiles: scanned.pathFiles,
      nodeFiles: scanned.nodeFiles,
      edgeFiles: scanned.edgeFiles,
    });
  });
}

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === fileURLToPath(import.meta.url)) {
  const graphs = loadAllSubjects(LEARN_ROOT);
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(graphs, null, 2)}\n`);
  console.log(`wrote ${OUT} (${graphs.length} subjects)`);
}
