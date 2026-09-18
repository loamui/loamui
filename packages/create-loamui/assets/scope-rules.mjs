/** Static scope checks shared by LoamUI and consuming projects. */
import postcss from "postcss";

const DONUT = /to\s*\([^)]*\[class\*="loam-"\]/;

/** Split a selector list on top-level commas. */
function splitList(selector) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const ch of selector) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/** The last compound of a complex selector, ignoring anything inside (). */
function subject(selector) {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (depth === 0 && /[\s>+~]/.test(ch)) start = i + 1;
  }
  return selector.slice(start).trim();
}

/** Rules nested in a donut, as { selector, line }. */
function donutRules(css) {
  const rules = [];
  const stack = []; // { donut: boolean }
  let prelude = "";
  let line = 1;
  let i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      const skipped = css.slice(i, end + 2);
      line += (skipped.match(/\n/g) || []).length;
      i = end + 2;
      continue;
    }
    if (ch === "\n") line++;
    if (ch === "{") {
      const text = prelude.trim();
      const inDonut = stack.some((b) => b.donut);
      if (text.startsWith("@scope")) stack.push({ donut: DONUT.test(text) });
      else if (text.startsWith("@")) stack.push({ donut: false });
      else {
        stack.push({ donut: false });
        if (inDonut) rules.push({ selector: text, line: line - (text.match(/\n/g) || []).length });
      }
      prelude = "";
    } else if (ch === "}") {
      stack.pop();
      prelude = "";
    } else if (ch === ";") {
      prelude = "";
    } else prelude += ch;
    i++;
  }
  return rules;
}

export function nakedScopes(css) {
  const out = [];
  postcss.parse(css).walkAtRules("scope", (scope) => {
    if (DONUT.test(scope.params)) return;
    const bare = new Set();
    scope.walkRules((rule) => {
      let parent = rule.parent;
      while (parent !== scope) {
        if (
          parent.type === "atrule" &&
          (parent.name === "scope" || parent.name.endsWith("keyframes"))
        )
          return;
        parent = parent.parent;
      }
      for (const match of rule.selector.matchAll(
        /(?:^|[\s>,+~(])([a-z][a-z0-9-]*)(?=[\s.#:[>+~),]|$)/g,
      ))
        bare.add(match[1]);
    });
    if (bare.size) out.push({ root: scope.params, line: scope.source.start.line, bare: [...bare] });
  });
  return out;
}

export function scopeFindings(css, tsx, { hostsCore = false } = {}) {
  const findings = [];
  for (const rule of donutRules(css)) {
    for (const sel of splitList(rule.selector)) {
      const subj = subject(sel);
      if (!subj || subj.startsWith(":scope") || subj === "&" || subj === "*") continue;
      if (/\.loam-/.test(subj)) {
        findings.push({
          line: rule.line,
          sel,
          why: "names a loam- class, which the donut excludes",
        });
        continue;
      }
      const el = subj.match(/^([a-z][a-z0-9]*)(?![\w-])/)?.[1];
      if (!el) continue;
      // The selector's own classes (`div.body` → ["body"]); a rule with none
      // (`li`) applies to every such element the component renders.
      const classes = [...subj.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
      // Every <el …> tag the component renders, with its attribute text.
      const tags = [...tsx.matchAll(new RegExp(`<${el}\\b([^>]*)>`, "gs"))].map((m) => m[1]);
      const hit = tags.some((attrs) => {
        if (!/className=/.test(attrs) || !/loam-/.test(attrs)) return false;
        return (
          classes.length === 0 ||
          classes.every((c) => new RegExp(`["'\`\\s]${c}["'\`\\s]`).test(attrs))
        );
      });
      if (hit) {
        findings.push({
          line: rule.line,
          sel,
          why: `the <${el}> it targets carries a loam- class, which the donut excludes`,
        });
      }
    }
  }
  if (hostsCore) {
    for (const scope of nakedScopes(css)) {
      findings.push({
        line: scope.line,
        sel: `@scope ${scope.root}`,
        why: `hosts core components but has no core boundary; bare ${scope.bare.join(", ")} selectors can reach inside them`,
      });
    }
  }
  return findings;
}
