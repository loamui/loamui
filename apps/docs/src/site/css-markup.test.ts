import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import postcss from "postcss";

/**
 * A stylesheet and the markup it styles are edited together, and nothing
 * else ties them: a class renamed on one side leaves the other selecting
 * nothing, silently. The recipes rail once shipped unstyled that way. These
 * walk the docs site's own CSS and TSX (not the recipes, which have their
 * own gate) and require every class to be spoken for on both sides.
 */
const SRC = resolve(process.cwd(), "src");
const FOLDERS = ["site", "renderer", "home", "app", "content"].map((d) => join(SRC, d));

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}
const files = FOLDERS.flatMap((d) => walk(d));
const css = files.filter((f) => f.endsWith(".css")).map((f) => readFileSync(f, "utf8"));
const tsx = files
  .filter((f) => /\.(tsx|mdx)$/.test(f) && !/\.test\.tsx$/.test(f))
  .map((f) => readFileSync(f, "utf8"))
  .concat(readFileSync(resolve(process.cwd(), "mdx-components.tsx"), "utf8"));

/** Every `.class` a stylesheet's selectors name — selectors only, so a
 * layer name or a file extension in a comment is never mistaken for one. */
const selected = new Set<string>();
for (const sheet of css)
  postcss.parse(sheet).walk((node) => {
    const text =
      node.type === "rule"
        ? node.selector
        : node.type === "atrule" && node.name === "scope"
          ? node.params
          : "";
    for (const m of text.matchAll(/\.([a-zA-Z][\w-]*)/g)) selected.add(m[1]!);
  });
/**
 * Every class token the markup applies: a `className` attribute or object
 * key, plus any quoted word — a class chosen from data (`menu-card ${status}`
 * with `status: "sold-out"`) reaches the DOM through a string literal
 * somewhere. That last net is wide on purpose; the check that matters is
 * the CSS side, and it is exact.
 */
const applied = new Set(
  tsx.flatMap((s) =>
    [...s.matchAll(/className(?:=|:\s*)(?:"([^"]*)"|\{`([^`]*)`\})/g)]
      .flatMap((m) => (m[1] ?? m[2] ?? "").split(/\s+/))
      .concat([...s.matchAll(/"([a-zA-Z][\w-]*)"/g)].map((m) => m[1]!))
      .filter(Boolean),
  ),
);
// Core's own classes are the library's, applied by its components.
const isCore = (c: string) => c.startsWith("loam-");
// Numeric-looking tokens are values inside rules, not classes (e.g. `.5` in `0.5rem`).
const isClass = (c: string) => /^[a-zA-Z]/.test(c);

const tsxFiles = files.filter((f) => /\.tsx$/.test(f) && !/\.test\.tsx$/.test(f));

describe("docs site CSS and markup agree", () => {
  it("never applies a malformed class string", () => {
    // A template literal with `$"…"` instead of `${…}` puts the quote marks
    // and the dollar sign into the DOM as the class name, and every rule for
    // the intended classes silently stops matching.
    const bad = tsxFiles.flatMap((f) => {
      const text = readFileSync(f, "utf8");
      return [...text.matchAll(/className=\{`[^`]*\$"[^`]*`\}/g)].map((m) => `${f}: ${m[0]}`);
    });
    expect(bad, bad.join("\n")).toEqual([]);
  });

  it("selects only classes the markup applies", () => {
    const orphans = [...selected].filter((c) => isClass(c) && !isCore(c) && !applied.has(c));
    expect(orphans, `selected in CSS but applied by no markup: ${orphans.join(", ")}`).toEqual([]);
  });
});
