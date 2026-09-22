import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { TAILWIND4_LAYER_ORDER, detectConflicts } from "../src/conflicts.mjs";
import { detectFramework } from "../src/frameworks.mjs";
import { nextProject, step, viteProject } from "./fixtures.mjs";

const conflicts = (dir) => detectConflicts(dir, detectFramework(dir));

test("a clean project has no conflicts", () => {
  assert.deepEqual(conflicts(nextProject()), []);
});

test("Tailwind 3 is reported with the Preflight choice and no fix", () => {
  const [tw] = conflicts(nextProject({ tailwindcss: "^3.4.0" }));
  assert.match(tw.title, /Tailwind CSS 3/);
  assert.match(tw.detail, /Preflight/);
  assert.equal(tw.fix, undefined);
});

test("Tailwind 4 is fixed by writing the combined layer order first, and the layer step then passes", () => {
  const dir = nextProject(
    { tailwindcss: "^4.1.0" },
    { files: { "app/globals.css": '@import "tailwindcss";\n' } },
  );
  const [tw] = conflicts(dir);
  assert.match(tw.title, /Tailwind CSS 4/);
  assert.match(tw.describe, /first line of app\/globals.css/);
  assert.equal(tw.fix(dir), true);
  const css = readFileSync(join(dir, "app/globals.css"), "utf8");
  assert.ok(css.startsWith(TAILWIND4_LAYER_ORDER));
  assert.ok(css.includes('@import "tailwindcss"'));
  assert.equal(step(dir, "layer").check(dir), true);
  tw.fix(dir);
  assert.equal(
    css,
    readFileSync(join(dir, "app/globals.css"), "utf8"),
    "running the fix again changes nothing",
  );
});

test("Tailwind 4 referenced only from a nested stylesheet is still found", () => {
  const dir = viteProject({}, { files: { "src/styles/app.css": '@import "tailwindcss";\n' } });
  const [tw] = conflicts(dir);
  assert.equal(tw.id, "tailwind");
  assert.match(tw.title, /Tailwind CSS 4/);
  assert.equal(typeof tw.fix, "function");
});

test("another design system is reported, never wired over", () => {
  const [ds] = conflicts(nextProject({ "@mantine/core": "8.0.0" }));
  assert.equal(ds.id, "design-system");
  assert.match(ds.title, /Mantine/);
  assert.equal(ds.fix, undefined);
});

test("a reset package or import is reported; a comment mentioning one is not", () => {
  assert.equal(conflicts(nextProject({ "modern-normalize": "3.0.0" }))[0].id, "reset");
  const imported = viteProject({}, { files: { "src/base.css": '@import "normalize.css";\n' } });
  assert.equal(conflicts(imported)[0].id, "reset");
  const comment = viteProject(
    {},
    { files: { "src/base.css": "/* we dropped normalize.css */\nbody{}\n" } },
  );
  assert.deepEqual(conflicts(comment), []);
});
