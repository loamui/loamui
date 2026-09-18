import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectPackageManager } from "../src/util.mjs";
import { detectFramework } from "../src/frameworks.mjs";
import { detectConflicts } from "../src/conflicts.mjs";
import { steps, LAYER_DECLARATION, CORE_STYLESHEET } from "../src/setup.mjs";

const tmp = () => mkdtempSync(join(tmpdir(), "create-loamui-"));
function writePkg(dir, deps = {}, scripts = {}) {
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "fix", dependencies: deps, scripts }));
}
function nextFixture() {
  const dir = tmp();
  writePkg(dir, { next: "16.0.0", react: "19.0.0" });
  mkdirSync(join(dir, "app"), { recursive: true });
  return dir;
}
function viteFixture() {
  const dir = tmp();
  writePkg(dir, { vite: "6.0.0", react: "19.0.0" });
  mkdirSync(join(dir, "src"), { recursive: true });
  return dir;
}
function stepById(dir, id, agent = "none") {
  return steps({ pm: "npm", agent, framework: detectFramework(dir) }).find((s) => s.id === id);
}

test("detectPackageManager reads the invoking agent", () => {
  const original = process.env.npm_config_user_agent;
  process.env.npm_config_user_agent = "pnpm/9.0.0 npm/? node/v20";
  assert.equal(detectPackageManager(), "pnpm");
  process.env.npm_config_user_agent = "";
  assert.equal(detectPackageManager(), "npm");
  if (original === undefined) delete process.env.npm_config_user_agent;
  else process.env.npm_config_user_agent = original;
});

test("detectFramework identifies Next, Vite, CRA and unknown projects", () => {
  const next = nextFixture();
  assert.equal(detectFramework(next).id, "next");
  assert.equal(detectFramework(next).layerFile, "app/globals.css");
  assert.equal(detectFramework(next).layerImport.file, "app/layout.tsx");
  assert.equal(detectFramework(next).stylesheet.mode, "code");

  const nextSrc = tmp();
  writePkg(nextSrc, { next: "16.0.0", react: "19.0.0" });
  mkdirSync(join(nextSrc, "src", "app"), { recursive: true });
  assert.equal(detectFramework(nextSrc).layerFile, "src/app/globals.css");

  const vite = viteFixture();
  assert.equal(detectFramework(vite).id, "vite");
  assert.equal(detectFramework(vite).stylesheet.file, "index.html");
  assert.equal(detectFramework(vite).layerImport.specifier, "./index.css");

  const cra = tmp();
  writePkg(cra, { "react-scripts": "5.0.0", react: "18.0.0" });
  assert.equal(detectFramework(cra).id, "cra");
  assert.equal(detectFramework(cra).stylesheet.file, "public/index.html");

  const unknown = tmp();
  writePkg(unknown, {});
  assert.equal(detectFramework(unknown).id, "unknown");
  assert.equal(detectFramework(unknown).layerFile, null);
});

test("a Vite project without React is not treated as a LoamUI target", () => {
  const dir = tmp();
  writePkg(dir, { vite: "6.0.0", vue: "3.0.0" });
  const fw = detectFramework(dir);
  assert.equal(fw.id, "unknown");
  assert.match(fw.reason, /no react dependency/);
});

test("layer step auto-wires globals.css for Next, preserving existing content", () => {
  const dir = nextFixture();
  const layer = stepById(dir, "layer");
  assert.equal(layer.wiring, true);
  assert.equal(layer.check(dir), false);
  assert.equal(layer.fix(dir), true);
  assert.equal(layer.check(dir), true);
  assert.ok(readFileSync(join(dir, "app", "globals.css"), "utf8").startsWith(LAYER_DECLARATION));

  const withCss = nextFixture();
  writeFileSync(join(withCss, "app", "globals.css"), "body { margin: 0; }\n");
  stepById(withCss, "layer").fix(withCss);
  const css = readFileSync(join(withCss, "app", "globals.css"), "utf8");
  assert.ok(css.startsWith(LAYER_DECLARATION) && css.includes("body { margin: 0; }"));
});

test("layer-import step adds the import to the layout, keeping a directive first", () => {
  const dir = nextFixture();
  writeFileSync(join(dir, "app", "layout.tsx"), "export default function L({ children }) { return children; }\n");
  const step = stepById(dir, "layer-import");
  assert.equal(step.wiring, true);
  assert.equal(step.check(dir), false);
  assert.equal(step.fix(dir), true);
  assert.equal(step.check(dir), true);
  assert.ok(readFileSync(join(dir, "app", "layout.tsx"), "utf8").startsWith('import "./globals.css";\n'));
  step.fix(dir);
  assert.equal(readFileSync(join(dir, "app", "layout.tsx"), "utf8").split("./globals.css").length - 1, 1);

  const client = nextFixture();
  writeFileSync(join(client, "app", "layout.tsx"), '"use client";\nexport default function L() {}\n');
  stepById(client, "layer-import").fix(client);
  const source = readFileSync(join(client, "app", "layout.tsx"), "utf8");
  assert.ok(source.startsWith('"use client";\nimport "./globals.css";\n'));
});

test("layer step has no automatic fix for an unknown framework", () => {
  const dir = tmp();
  writePkg(dir, {});
  const layer = stepById(dir, "layer");
  assert.equal(layer.fix, undefined);
  assert.match(layer.manual(dir), /first line of your global stylesheet/);
  assert.equal(stepById(dir, "layer-import"), undefined);
});

test("stylesheet step injects the link into an HTML head, idempotently", () => {
  const dir = viteFixture();
  writeFileSync(join(dir, "index.html"), "<html><head><title>x</title></head><body></body></html>");
  const step = stepById(dir, "stylesheet");
  assert.equal(step.check(dir), false);
  assert.equal(step.fix(dir), true);
  assert.equal(step.check(dir), true);
  step.fix(dir);
  const html = readFileSync(join(dir, "index.html"), "utf8");
  assert.equal(html.split(CORE_STYLESHEET).length - 1, 1); // exactly one link
});

test("script steps add commands without clobbering existing ones", () => {
  const dir = nextFixture();
  writePkg(dir, { next: "16.0.0", react: "19.0.0" }, { "lint:css": "custom" });
  assert.equal(stepById(dir, "lint-css-script").check(dir), true);
  stepById(dir, "lint-css-script").fix(dir);
  assert.equal(JSON.parse(readFileSync(join(dir, "package.json"), "utf8")).scripts["lint:css"], "custom");

  const composition = stepById(dir, "check-composition-script");
  assert.equal(composition.check(dir), false);
  composition.fix(dir);
  assert.match(
    JSON.parse(readFileSync(join(dir, "package.json"), "utf8")).scripts["check:composition"],
    /check-composition\.mjs app/,
  );
});

test("agent 'none' omits skill steps; an agent adds skill + two companions", () => {
  const dir = nextFixture();
  const none = steps({ pm: "npm", agent: "none", framework: detectFramework(dir) }).map((s) => s.id);
  assert.ok(!none.some((id) => id === "skill" || id.startsWith("companion:")));
  const withAgent = steps({ pm: "npm", agent: "claude-code", framework: detectFramework(dir) }).map((s) => s.id);
  assert.ok(["skill", "companion:modern-css", "companion:modern-web-guidance"].every((id) => withAgent.includes(id)));
});

test("detectConflicts flags Tailwind by version, including nested CSS, and resets", () => {
  const clean = nextFixture();
  assert.equal(detectConflicts(clean, detectFramework(clean)).length, 0);

  const v3 = nextFixture();
  writePkg(v3, { next: "16.0.0", react: "19.0.0", tailwindcss: "^3.4.0" });
  const [three] = detectConflicts(v3, detectFramework(v3));
  assert.equal(three.severity, "blocking");
  assert.match(three.title, /Tailwind CSS 3/);
  assert.match(three.detail, /Preflight/);

  // Tailwind 4 referenced only from a nested stylesheet, no dependency entry.
  const v4 = viteFixture();
  mkdirSync(join(v4, "src", "styles"), { recursive: true });
  writeFileSync(join(v4, "src", "styles", "app.css"), '@import "tailwindcss";\n');
  const [four] = detectConflicts(v4, detectFramework(v4));
  assert.equal(four.id, "tailwind");
  assert.match(four.title, /Tailwind CSS 4/);
  assert.match(four.detail, /@layer theme, base, loamui.tokens/);

  const reset = nextFixture();
  writePkg(reset, { next: "16.0.0", react: "19.0.0", "modern-normalize": "3.0.0" });
  assert.equal(detectConflicts(reset, detectFramework(reset))[0].id, "reset");

  const nestedReset = viteFixture();
  mkdirSync(join(nestedReset, "src", "styles"), { recursive: true });
  writeFileSync(join(nestedReset, "src", "styles", "base.css"), '@import "normalize.css";\n');
  assert.equal(detectConflicts(nestedReset, detectFramework(nestedReset))[0].id, "reset");
});
