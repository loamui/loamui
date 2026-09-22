// Lint the exported MDX/component/recipe prose and literal site TSX copy.
// Exports preserve code fences; TSX is parsed so source code is not prose.
import { readdirSync, readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CODE_KEYS = new Set(["code", "tsx", "css", "importLine"]);

export function extractSiteProse(source, file = "source.tsx") {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const blocks = [];
  function text(node) {
    if (ts.isJsxText(node)) return node.text.replace(/\s+/g, " ");
    if (ts.isJsxExpression(node))
      return node.expression && ts.isStringLiteralLike(node.expression)
        ? node.expression.text
        : " ";
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const tag = ts.isJsxElement(node) ? node.openingElement.tagName.getText(tree) : "";
      if (["code", "pre", "script", "style"].includes(tag)) return " `code` ";
      const result = node.children.map(text).join("");
      return /^(p|div|section|article|li|h[1-6]|form)$/.test(tag) ? `\n\n${result}\n\n` : result;
    }
    return " ";
  }
  function visit(node) {
    if (
      (ts.isPropertyAssignment(node) || ts.isVariableDeclaration(node)) &&
      CODE_KEYS.has(node.name.getText(tree))
    )
      return;
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      blocks.push(text(node));
      return;
    }
    if (
      ts.isStringLiteralLike(node) &&
      node.text.trim().split(/\s+/).length >= 4 &&
      !node.text.includes("<")
    )
      blocks.push(node.text);
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return blocks
    .join("\n\n")
    .replace(/&(?:rsquo|apos);/g, "'")
    .replace(/&(?:ldquo|rdquo|quot);/g, '"')
    .replace(/&amp;/g, "&");
}

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const temporary = mkdtempSync(join(tmpdir(), "loam-site-prose-"));
  try {
    const targets = [];
    const originals = new Map();
    const sources = ["apps/docs/src/app", "apps/docs/src/site", "apps/docs/src/renderer"]
      .flatMap((dir) => files(join(ROOT, dir)))
      .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"));
    const references = files(join(ROOT, "skills/loamui/references")).filter((file) =>
      file.endsWith(".md"),
    );
    for (const file of [...sources, ...references]) {
      const source = readFileSync(file, "utf8");
      const prose = file.endsWith(".tsx")
        ? extractSiteProse(source, file)
        : source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
      const target = join(temporary, `${targets.length}.md`);
      // UI docs deliberately repeat component names and use terms such as
      // "step". Those are technical vocabulary, not narrative movement or
      // rhetorical repetition. Paragraph-length and fragment heuristics also
      // misread API names such as FieldRoot. Other prose rules still apply.
      const exceptions =
        "<!-- textlint-disable slopless/body-action-density, slopless/word-repetition, slopless/fragment-stacking, slopless/paragraph-length -->\n\n";
      writeFileSync(target, exceptions + prose.replace(/[‘’]/g, "'").replace(/[“”]/g, '\"'));
      targets.push(target);
      originals.set(target, relative(ROOT, file));
    }
    const result = spawnSync(
      process.execPath,
      [join(ROOT, "node_modules/slopless/dist/cli.js"), ...targets],
      { encoding: "utf8", maxBuffer: 10_000_000 },
    );
    if (result.error) throw result.error;
    if (result.stderr) process.stderr.write(result.stderr);
    const reports = JSON.parse(result.stdout || "[]");
    for (const report of reports)
      for (const message of report.messages)
        console.error(
          `${originals.get(report.filePath)} (extracted prose line ${message.line}): ${message.ruleId}: ${message.message}`,
        );
    if (reports.length !== targets.length)
      throw new Error("Slopless did not inspect every prepared document");
    process.exitCode = result.status ?? 1;
    if (!process.exitCode)
      console.log(
        `check-site-prose: ${sources.length} TSX sources and ${references.length} exported references checked. Dynamic runtime copy needs review.`,
      );
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}
