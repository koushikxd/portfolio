#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

const ROOT = new URL("..", import.meta.url).pathname;
const BASELINE = join(ROOT, "comment-baseline.json");
const DIRS = ["app", "components", "hooks", "lib", "scripts"];
const EXTENSIONS = /\.(tsx?|mjs|css)$/;
const EXEMPT = /^\/\/\s*biome-ignore/;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return EXTENSIONS.test(entry.name) ? [path] : [];
  });
}

function cssComments(text) {
  return [...text.matchAll(/\/\*[\s\S]*?\*\//g)].map((m) => ({
    pos: m.index,
    end: m.index + m[0].length,
  }));
}

function tsComments(text, path) {
  const kind = path.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(
    path,
    text,
    ts.ScriptTarget.Latest,
    true,
    kind
  );
  const found = new Map();
  const collect = (ranges) => {
    for (const range of ranges ?? []) found.set(range.pos, range);
  };
  const visit = (node) => {
    if (node.kind !== ts.SyntaxKind.JsxText) {
      collect(ts.getLeadingCommentRanges(text, node.pos));
      collect(ts.getTrailingCommentRanges(text, node.end));
    }
    node.getChildren(source).forEach(visit);
  };
  visit(source);
  return [...found.values()];
}

function commentsIn(path) {
  const text = readFileSync(path, "utf8");
  const ranges = path.endsWith(".css")
    ? cssComments(text)
    : tsComments(text, path);
  return ranges
    .map(({ pos, end }) => ({
      line: text.slice(0, pos).split("\n").length,
      text: text.slice(pos, end),
    }))
    .filter((comment) => !EXEMPT.test(comment.text))
    .sort((a, b) => a.line - b.line);
}

const counts = {};
const listing = [];
for (const dir of DIRS) {
  for (const path of walk(join(ROOT, dir))) {
    const file = relative(ROOT, path);
    const comments = commentsIn(path);
    if (comments.length) counts[file] = comments.length;
    for (const c of comments)
      listing.push(`${file}:${c.line}  ${c.text.split("\n")[0]}`);
  }
}

const args = process.argv.slice(2);
if (args.includes("--list")) {
  console.log(listing.join("\n"));
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE, "utf8"));

const files = new Set([...Object.keys(counts), ...Object.keys(baseline)]);
const grew = [...files].filter((f) => (counts[f] ?? 0) > (baseline[f] ?? 0));
const shrank = [...files].filter((f) => (counts[f] ?? 0) < (baseline[f] ?? 0));

if (args.includes("--update")) {
  if (grew.length) {
    console.error(`Refusing to raise the baseline for: ${grew.join(", ")}`);
    process.exit(1);
  }
  const sorted = Object.fromEntries(Object.entries(counts).sort());
  writeFileSync(BASELINE, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(
    `Baseline: ${listing.length} comments in ${Object.keys(sorted).length} files`
  );
  process.exit(0);
}

for (const f of grew) {
  console.error(
    `${f}: ${counts[f]} comments, baseline allows ${baseline[f] ?? 0}. Comments are banned; delete it or record the decision in docs/adr/.`
  );
}
for (const f of shrank) {
  console.error(
    `${f}: ${counts[f] ?? 0} comments, baseline still says ${baseline[f]}. Run \`pnpm lint:comments --update\` to lock in the drop.`
  );
}
if (grew.length || shrank.length) process.exit(1);
console.log(`Comments: ${listing.length} (baseline holds)`);
