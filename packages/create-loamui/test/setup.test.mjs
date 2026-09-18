import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectPackageManager, projectLayout } from "../src/util.mjs";
import { steps, LAYER_DECLARATION } from "../src/setup.mjs";

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), "create-loamui-"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "fix", scripts: {} }));
  mkdirSync(join(dir, "app"), { recursive: true });
  return dir;
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

test("projectLayout distinguishes src/ from app/", () => {
  const src = mkdtempSync(join(tmpdir(), "create-loamui-src-"));
  mkdirSync(join(src, "src", "app"), { recursive: true });
  assert.equal(projectLayout(src).appDir, join("src", "app"));
  assert.equal(projectLayout(src).lintGlob, "src/**/*.css");

  const app = mkdtempSync(join(tmpdir(), "create-loamui-app-"));
  mkdirSync(join(app, "app"), { recursive: true });
  assert.equal(projectLayout(app).appDir, "app");
  assert.equal(projectLayout(app).compositionArgs, "app");
});

test("globals step creates the layer declaration and reports satisfied", () => {
  const dir = fixture();
  const layout = projectLayout(dir);
  const globals = steps({ pm: "npm", agent: "none", layout }).find((s) => s.id === "globals");
  assert.equal(globals.check(dir), false);
  assert.equal(globals.fix(dir), true);
  assert.equal(globals.check(dir), true);
  assert.match(readFileSync(join(dir, "app", "globals.css"), "utf8"), new RegExp(`^${LAYER_DECLARATION.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
});

test("globals step preserves existing content by prepending", () => {
  const dir = fixture();
  writeFileSync(join(dir, "app", "globals.css"), "body { margin: 0; }\n");
  const layout = projectLayout(dir);
  const globals = steps({ pm: "npm", agent: "none", layout }).find((s) => s.id === "globals");
  globals.fix(dir);
  const css = readFileSync(join(dir, "app", "globals.css"), "utf8");
  assert.ok(css.startsWith(LAYER_DECLARATION));
  assert.ok(css.includes("body { margin: 0; }"));
});

test("script steps add commands without clobbering existing ones", () => {
  const dir = fixture();
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "fix", scripts: { "lint:css": "custom" } }));
  const layout = projectLayout(dir);
  const list = steps({ pm: "npm", agent: "none", layout });
  const lint = list.find((s) => s.id === "lint-css-script");
  assert.equal(lint.check(dir), true); // already present, left untouched
  lint.fix(dir);
  assert.equal(JSON.parse(readFileSync(join(dir, "package.json"), "utf8")).scripts["lint:css"], "custom");

  const composition = list.find((s) => s.id === "check-composition-script");
  assert.equal(composition.check(dir), false);
  composition.fix(dir);
  assert.match(
    JSON.parse(readFileSync(join(dir, "package.json"), "utf8")).scripts["check:composition"],
    /check-composition\.mjs app/,
  );
});

test("agent 'none' omits skill steps; an agent adds skill + two companions", () => {
  const layout = projectLayout(fixture());
  const none = steps({ pm: "npm", agent: "none", layout }).map((s) => s.id);
  assert.ok(!none.some((id) => id === "skill" || id.startsWith("companion:")));
  const withAgent = steps({ pm: "npm", agent: "claude-code", layout }).map((s) => s.id);
  assert.ok(withAgent.includes("skill"));
  assert.ok(withAgent.includes("companion:modern-css"));
  assert.ok(withAgent.includes("companion:modern-web-guidance"));
});
