// Gate: no dead rules inside a donut scope.
//
// `@scope (.loam-X) to ([class*="loam-"])` fences core parts out of a
// stylesheet, and the fence excludes the limit element itself. So a rule
// inside the donut whose subject carries a `loam-` class never matches:
// neither `.loam-X-item { … }` nor a bare `li { … }` when the component
// renders `<li className="loam-X-item">`. Breadcrumbs shipped exactly that
// and nothing noticed. This scanner walks every component stylesheet in both
// packages and the examples, finds rules nested (at any depth) in a donut, and fails when the
// rule's subject compound either names a `.loam-` class or is a bare element
// that the component's TSX gives a `loam-` class.
// Run: node scripts/check-scope.mjs

import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import postcss from "postcss";
import { pathToFileURL } from "node:url";
import { scopeFindings } from "../skills/loamui/assets/scope-rules.mjs";
export { nakedScopes } from "../skills/loamui/assets/scope-rules.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const ROOTS = [
  "packages/core/src/components",
  "apps/docs/src/recipes",
  "apps/docs/src/app",
  "apps/docs/src/site",
  "apps/docs/src/renderer",
  "apps/docs/src/home",
].map((p) => join(ROOT, p));
const DONUT = /to\s*\([^)]*\[class\*="loam-"\]/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".css")) out.push(full);
  }
  return out;
}

export function proseBoundaryFindings(css) {
  const findings = [];
  postcss.parse(css).walkAtRules("scope", (scope) => {
    if (!/^\(\.site-prose\)(?:\s|$)/.test(scope.params)) return;
    if (!/to\s*\([^)]*\.block(?:[\s,)]|$)/.test(scope.params) || !DONUT.test(scope.params))
      findings.push("article scope must exclude preview blocks and core roots");
    let parent = scope.parent;
    while (parent && !(parent.type === "atrule" && parent.name === "layer")) parent = parent.parent;
    if (!parent) findings.push("article styles must have an explicit cascade layer");
  });
  return findings;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const findings = [];
  const proseFile = join(ROOT, "apps/docs/src/app/docs/prose.css");
  for (const why of proseBoundaryFindings(readFileSync(proseFile, "utf8")))
    findings.push({ file: proseFile, line: 1, sel: ".site-prose", why });

  for (const root of ROOTS) {
    for (const file of walk(root)) {
      const dir = dirname(file);
      const sources = readdirSync(dir)
        .filter((name) => name.endsWith(".tsx") && !/\.(stories|test)\.tsx$/.test(name))
        .map((name) => readFileSync(join(dir, name), "utf8"));
      const hostsCore =
        basename(file) === "prose.css" ||
        sources.some(
          (source) =>
            source.includes(`"./${basename(file)}"`) && /from "@loamui\/core"/.test(source),
        );
      for (const finding of scopeFindings(readFileSync(file, "utf8"), sources.join("\n"), {
        hostsCore,
      }))
        findings.push({ file, ...finding });
    }
  }

  if (findings.length) {
    console.error(`check-scope: ${findings.length} scope problem(s).\n`);
    for (const f of findings) {
      console.error(`  ${relative(ROOT, f.file)}:${f.line}  \`${f.sel}\` — ${f.why}`);
    }
    console.error(
      `\nEither move the rule into that element's own @scope block, or add the donut: @scope (root) to ([class*="loam-"]).`,
    );
    process.exit(1);
  }
  console.log(
    `check-scope: static scope checks passed (${ROOTS.length} roots). Verify rendered cascade and embedded recipe boundaries in a browser.`,
  );
}
