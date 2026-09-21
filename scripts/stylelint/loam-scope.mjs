// Stylelint rule: no dead rules inside a donut scope.
//
// `@scope (.loam-X) to ([class*="loam-"])` fences core parts out of a
// stylesheet, and the fence excludes the limit element itself. So a rule
// inside the donut whose subject carries a `loam-` class never matches —
// neither `.loam-X-item { … }` nor a bare `li { … }` when the component
// renders `<li className="loam-X-item">`. Breadcrumbs shipped exactly that
// and nothing noticed.
//
// The checks live in the skill's scope-rules module, shared with consuming
// projects; this file only lets Stylelint run them, so a finding shows in
// the editor and honours a per-line disable like any other rule.
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import postcss from "postcss";
import stylelint from "stylelint";
import { nakedScopes, scopeFindings } from "../../skills/loamui/assets/scope-rules.mjs";

const ruleName = "loamui/scope";
const messages = stylelint.utils.ruleMessages(ruleName, {
  dead: (selector, why) =>
    `\`${selector}\` ${why}. Move the rule into that element's own @scope block, or add the donut: @scope (root) to ([class*="loam-"]).`,
  prose: (why) => why,
});
const DONUT = /to\s*\([^)]*\[class\*="loam-"\]/;

/** The article scope hosts recipes and core roots: it must fence both. */
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

/**
 * The sibling .tsx sources that render this stylesheet's markup. An editor
 * lints unsaved buffers and stdin, whose "directory" may not exist: with no
 * markup to compare against, the markup-dependent checks simply have
 * nothing to report.
 */
function siblingSources(file) {
  const dir = dirname(file);
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names
    .filter((name) => name.endsWith(".tsx") && !/\.(stories|test)\.tsx$/.test(name))
    .map((name) => readFileSync(join(dir, name), "utf8"));
}

const rule = (primary) => (root, result) => {
  if (!primary) return;
  const file = root.source?.input.file;
  if (!file) return;
  const css = root.source.input.css;
  const report = (line, message) => {
    let node = root;
    root.walk((candidate) => {
      if (candidate.source?.start?.line === line) {
        node = candidate;
        return false;
      }
    });
    stylelint.utils.report({ ruleName, result, node, message });
  };

  if (basename(file) === "prose.css")
    for (const why of proseBoundaryFindings(css)) report(1, messages.prose(why));

  const sources = siblingSources(file);
  const hostsCore =
    basename(file) === "prose.css" ||
    sources.some(
      (source) => source.includes(`"./${basename(file)}"`) && /from "@loamui\/core"/.test(source),
    );
  for (const finding of scopeFindings(css, sources.join("\n"), { hostsCore }))
    report(finding.line, messages.dead(finding.sel, finding.why));
};

rule.ruleName = ruleName;
rule.messages = messages;
export { nakedScopes };
export default stylelint.createPlugin(ruleName, rule);
