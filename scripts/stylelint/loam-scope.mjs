// Scope limits exclude the boundary element itself, making rules targeting it dead.
// This adapter supplies local markup to the consumer skill's shared checks.
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import postcss from "postcss";
import stylelint from "stylelint";
import { nakedScopes, scopeFindings } from "../../packages/cli/assets/scope-rules.mjs";

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

function markupSources(file) {
  const dir = dirname(file);
  let names;
  try {
    names = readdirSync(dir, { recursive: basename(dirname(dir)) === "components" });
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

  const sources = markupSources(file);
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
