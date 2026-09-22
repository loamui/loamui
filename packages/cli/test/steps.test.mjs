import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { detectFramework } from "../src/frameworks.mjs";
import { LAYER_DECLARATION, coreStylesheet, declaresLayerOrder, steps } from "../src/steps.mjs";
import { TAILWIND4_LAYER_ORDER } from "../src/conflicts.mjs";
import { installCore, nextProject, step, viteProject } from "./fixtures.mjs";

const read = (dir, file) => readFileSync(join(dir, file), "utf8");

test("the layer order must come first, and may be part of a combined order", () => {
  assert.equal(declaresLayerOrder(`${LAYER_DECLARATION}\nbody { margin: 0 }`), true);
  assert.equal(
    declaresLayerOrder(`/* note */\n${TAILWIND4_LAYER_ORDER}\n@import "tailwindcss";`),
    true,
  );
  assert.equal(declaresLayerOrder(`@import "x.css";\n${LAYER_DECLARATION}`), false);
  assert.equal(
    declaresLayerOrder("@layer loamui.components, loamui.tokens, loamui.elements;"),
    false,
  );
  assert.equal(declaresLayerOrder("body { margin: 0 }"), false);
});

test("the stylesheet URL is the installed core's version, never a guess", () => {
  const dir = nextProject();
  assert.equal(coreStylesheet(dir), null);
  installCore(dir, "0.3.1");
  assert.equal(
    coreStylesheet(dir),
    "https://cdn.jsdelivr.net/npm/@loamui/core@0.3.1/dist/styles.css",
  );
});

test("the layer step writes globals.css for Next and keeps what was there", () => {
  const dir = nextProject();
  const layer = step(dir, "layer");
  assert.equal(layer.wiring, true);
  assert.equal(layer.check(dir), false);
  assert.match(layer.describe(dir), /first line of app\/globals.css/);
  assert.equal(layer.fix(dir), true);
  assert.equal(layer.check(dir), true);

  const existing = nextProject({}, { files: { "app/globals.css": "body { margin: 0; }\n" } });
  step(existing, "layer").fix(existing);
  const css = read(existing, "app/globals.css");
  assert.ok(css.startsWith(LAYER_DECLARATION) && css.includes("body { margin: 0; }"));
});

test("the layer import goes into the layout, after a directive, once", () => {
  const dir = nextProject(
    {},
    {
      files: { "app/layout.tsx": "export default function L({ children }) { return children; }\n" },
    },
  );
  const imported = step(dir, "layer-import");
  assert.equal(imported.check(dir), false);
  assert.equal(imported.fix(dir), true);
  assert.equal(imported.check(dir), true);
  imported.fix(dir);
  assert.equal(read(dir, "app/layout.tsx").split("./globals.css").length - 1, 1);

  const client = nextProject(
    {},
    { files: { "app/layout.tsx": '"use client";\nexport default function L() {}\n' } },
  );
  step(client, "layer-import").fix(client);
  assert.ok(read(client, "app/layout.tsx").startsWith('"use client";\nimport "./globals.css";\n'));
});

test("an unknown framework gets instructions for the layer, not an edit", () => {
  const dir = nextProject();
  const unknown = {
    ...detectFramework(dir),
    id: "unknown",
    layerFile: null,
    layerImport: null,
    autoWireLayer: false,
  };
  const list = steps({ pm: "npm", agent: "none", framework: unknown });
  assert.equal(list.find((s) => s.id === "layer").fix, undefined);
  assert.match(
    list.find((s) => s.id === "layer").manual(dir),
    /first line of your global stylesheet/,
  );
  assert.equal(
    list.find((s) => s.id === "layer-import"),
    undefined,
  );
});

test("the stylesheet link goes into an HTML head once, and only once core is installed", () => {
  const dir = viteProject(
    {},
    { files: { "index.html": "<html><head><title>x</title></head><body></body></html>" } },
  );
  const link = step(dir, "stylesheet");
  assert.equal(link.check(dir), false);
  assert.equal(link.fix(dir), false, "no core, no version, no link");
  installCore(dir, "0.2.0");
  assert.equal(link.fix(dir), true);
  assert.equal(link.check(dir), true);
  link.fix(dir);
  assert.equal(read(dir, "index.html").split("@loamui/core@0.2.0").length - 1, 1);
});

test("a Next layout with the unversioned hosted link has it replaced in place", () => {
  const dir = nextProject(
    {},
    {
      files: {
        "app/layout.tsx": '<link rel="stylesheet" href="https://loamui.com/loamui-core.css" />',
      },
    },
  );
  installCore(dir, "0.2.0");
  const link = step(dir, "stylesheet");
  assert.equal(link.check(dir), false);
  assert.match(link.manual(dir), /Replace the unversioned .* with <link .*@loamui\/core@0.2.0/);
  assert.equal(link.fix(dir), true);
  assert.equal(
    read(dir, "app/layout.tsx"),
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@loamui/core@0.2.0/dist/styles.css" />',
  );
  assert.equal(link.check(dir), true);
});

test("script steps add commands without clobbering existing ones", () => {
  const dir = nextProject({}, { scripts: { "lint:css": "custom" } });
  assert.equal(step(dir, "lint-css-script").check(dir), true);
  step(dir, "lint-css-script").fix(dir);
  assert.equal(JSON.parse(read(dir, "package.json")).scripts["lint:css"], "custom");

  const composition = step(dir, "check-composition-script");
  assert.equal(composition.check(dir), false);
  composition.fix(dir);
  assert.match(
    JSON.parse(read(dir, "package.json")).scripts["check:composition"],
    /check-composition\.mjs app/,
  );
});

test("every step can describe itself for a dry run", () => {
  const dir = nextProject();
  for (const s of steps({ pm: "pnpm", agent: "claude-code", framework: detectFramework(dir) }))
    assert.equal(typeof s.describe(dir), "string", s.id);
});

test("agent 'none' installs no skills; an agent gets loamui and both companions", () => {
  const dir = nextProject();
  const ids = (agent) =>
    steps({ pm: "npm", agent, framework: detectFramework(dir) }).map((s) => s.id);
  assert.ok(!ids("none").some((id) => id.startsWith("skill:")));
  assert.deepEqual(
    ids("claude-code").filter((id) => id.startsWith("skill:")),
    ["skill:loamui", "skill:modern-css", "skill:modern-web-guidance"],
  );
});

test("Oxlint and Oxfmt get their configs and scripts, and an existing format script is kept", () => {
  const dir = nextProject({}, { scripts: { format: "prettier --write ." } });
  for (const id of ["oxlint-config", "oxfmt-config"]) {
    const s = step(dir, id);
    assert.equal(s.check(dir), false);
    assert.equal(s.fix(dir), true);
    assert.equal(s.check(dir), true);
  }
  assert.ok(read(dir, ".oxlintrc.json").includes('"jsx-a11y"'));
  step(dir, "lint-js-script").fix(dir);
  step(dir, "format-scripts").fix(dir);
  const scripts = JSON.parse(read(dir, "package.json")).scripts;
  assert.equal(scripts["lint:js"], "oxlint");
  assert.equal(scripts.format, "prettier --write .");
  assert.equal(scripts["format:check"], "oxfmt --check");
});

test("a Next layout gets the link in its head, or a head if it has none; a layout that bundles core is left alone", () => {
  const withHead = nextProject(
    {},
    {
      files: {
        "app/layout.tsx":
          "export default function L({ children }) {\n  return (\n    <html>\n      <head>\n        <title>x</title>\n      </head>\n      <body>{children}</body>\n    </html>\n  );\n}\n",
      },
    },
  );
  installCore(withHead, "0.2.0");
  assert.equal(step(withHead, "stylesheet").fix(withHead), true);
  assert.match(
    read(withHead, "app/layout.tsx"),
    /<title>x<\/title>\n {8}<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/@loamui\/core@0\.2\.0\/dist\/styles\.css" \/>\n {6}<\/head>/,
  );

  const noHead = nextProject(
    {},
    {
      files: {
        "app/layout.tsx":
          'export default function L({ children }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n',
      },
    },
  );
  installCore(noHead, "0.2.0");
  assert.equal(step(noHead, "stylesheet").fix(noHead), true);
  assert.match(
    read(noHead, "app/layout.tsx"),
    /<html lang="en">\n {6}<head>\n {8}<link [^\n]*\/>\n {6}<\/head>\n {6}<body>/,
  );
  assert.equal(step(noHead, "stylesheet").check(noHead), true);

  const bundled = nextProject(
    {},
    {
      files: {
        "app/layout.tsx": 'import "@loamui/core/styles.css";\n<html><head></head><body /></html>',
      },
    },
  );
  installCore(bundled, "0.2.0");
  assert.equal(step(bundled, "stylesheet").fix(bundled), false);
  assert.match(
    step(bundled, "stylesheet").manual(bundled),
    /Remove the @loamui\/core\/styles\.css import/,
  );
});

test("the check script and the agent instructions are written once, in the package manager's idiom", () => {
  const dir = nextProject({}, { files: { "AGENTS.md": "# Notes\n\nKeep the API stable.\n" } });
  const list = steps({ pm: "pnpm", agent: "claude-code", framework: detectFramework(dir) });
  const check = list.find((s) => s.id === "check-script");
  check.fix(dir);
  assert.equal(
    JSON.parse(read(dir, "package.json")).scripts.check,
    "pnpm lint:css && pnpm lint:js && pnpm check:composition && pnpm format:check",
  );

  const agents = list.find((s) => s.id === "agent-instructions");
  assert.equal(agents.check(dir), false);
  agents.fix(dir);
  assert.equal(agents.check(dir), true);
  const md = read(dir, "AGENTS.md");
  assert.ok(md.startsWith("# Notes\n\nKeep the API stable."), "existing content kept");
  assert.match(md, /## LoamUI/);
  assert.match(md, /`app\/globals\.css` declares the layer order/);
  assert.match(md, /run `pnpm check` \(lint:css, lint:js, check:composition, format:check\)/);
  assert.match(md, /`pnpm dlx loamui@latest doctor`/);
  assert.equal(read(dir, "CLAUDE.md"), "@AGENTS.md\n");
  agents.fix(dir);
  assert.equal(md, read(dir, "AGENTS.md"), "running again adds nothing");
});
