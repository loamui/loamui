import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { components } from "@/renderer/registry";

/**
 * The Code tab is a hand-written string, and the preview is formatted JSX;
 * nothing else keeps the two in the same shape. A string written on one
 * line reads as a wall of tags where the preview's source nests, so every
 * JSX snippet must come out of the formatter unchanged.
 */
type Snippet = { where: string; code: string };

const snippets: Snippet[] = components.flatMap((c) => [
  ...c.demos.map((d) => ({ where: `${c.slug} › ${d.title}`, code: d.code })),
  ...(c.howItWorks ?? []).flatMap((h) =>
    h.code ? [{ where: `${c.slug} › ${h.title}`, code: h.code }] : [],
  ),
]);

const jsx = snippets.filter((s) => s.code.trimStart().startsWith("<"));

function formatted(code: string): string {
  return `export const demo = (\n  <>\n${code
    .split("\n")
    .map((l) => (l ? "    " + l : l))
    .join("\n")}\n  </>\n);\n`;
}

function unwrap(src: string): string {
  const lines = src.split("\n");
  return lines
    .slice(2, lines.lastIndexOf("  </>"))
    .map((l) => l.slice(4))
    .join("\n");
}

describe("demo code strings", () => {
  it("are laid out the way the formatter lays out the preview's source", () => {
    const dir = mkdtempSync(join(tmpdir(), "loam-demos-"));
    try {
      jsx.forEach((s, i) => writeFileSync(join(dir, `${i}.tsx`), formatted(s.code)));
      execFileSync("npx", ["oxfmt", dir], { stdio: "ignore" });
      const wrong = jsx.flatMap((s, i) => {
        const out = unwrap(readFileSync(join(dir, `${i}.tsx`), "utf8"));
        return out === s.code ? [] : [`${s.where}\n--- written\n${s.code}\n--- formatted\n${out}`];
      });
      if (process.env.DEMOS_REPORT) writeFileSync(process.env.DEMOS_REPORT, wrong.join("\n\n"));
      expect(wrong, `${wrong.length} of ${jsx.length} snippets differ`).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
