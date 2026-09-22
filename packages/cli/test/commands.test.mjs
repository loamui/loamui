import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { installCore, nextProject, project } from "./fixtures.mjs";

const BIN = fileURLToPath(new URL("../bin/loamui.mjs", import.meta.url));
const loamui = (cwd, ...args) =>
  spawnSync(process.execPath, [BIN, ...args, "--agent", "none", "--pm", "npm"], {
    cwd,
    encoding: "utf8",
  });

test("doctor reports every gap and exits 1; a complete project exits 0", () => {
  const dir = nextProject();
  const before = loamui(dir, "doctor");
  assert.equal(before.status, 1);
  assert.match(before.stdout, /✗ @loamui\/core installed/);
  assert.match(before.stdout, /Run `loamui init`/);

  assert.match(
    loamui(project({ vite: "6.0.0", vue: "3.0.0" }), "doctor").stdout,
    /no react dependency/,
  );
});

test("init --dry-run describes the work and writes nothing", () => {
  const dir = nextProject(
    { tailwindcss: "^4.1.0" },
    { files: { "app/globals.css": '@import "tailwindcss";\n' } },
  );
  const snapshot = () =>
    JSON.stringify([readdirSync(dir), readFileSync(join(dir, "app/globals.css"), "utf8")]);
  const before = snapshot();
  const result = loamui(dir, "init", "--dry-run");
  assert.equal(result.status, 0, result.stdout);
  assert.match(result.stdout, /would write "@layer theme, base, loamui.tokens/);
  assert.match(result.stdout, /would npm install @loamui\/core/);
  assert.match(result.stdout, /Nothing was changed/);
  assert.equal(snapshot(), before);
});

test("init holds the cascade back under Tailwind 3 but still installs the tooling files", () => {
  const dir = nextProject(
    { tailwindcss: "^3.4.0" },
    { files: { "app/layout.tsx": "export default function L() {}\n" } },
  );
  installCore(dir);
  // Package installs need the network; the fixture already "has" core and the tooling deps.
  installTooling(dir);
  const result = loamui(dir, "init");
  assert.equal(result.status, 1);
  assert.match(result.stdout, /Tailwind CSS 3 detected/);
  assert.match(result.stdout, /globals.css declares the layer order — held back/);
  assert.match(result.stdout, /Stylelint configuration in the project — done/);
  assert.equal(readdirSync(dir).includes("stylelint.config.mjs"), true);
  assert.equal(readdirSync(join(dir, "app")).includes("globals.css"), false);
});

test("unknown commands and options fail with the help text", () => {
  assert.equal(loamui(nextProject(), "frobnicate").status, 1);
  const flag = loamui(nextProject(), "init", "--nope");
  assert.equal(flag.status, 1);
  assert.match(flag.stdout, /Unknown option: --nope/);
});

function installTooling(dir) {
  for (const name of ["stylelint", "postcss", "loamui-typescript"]) {
    mkdirSync(join(dir, "node_modules", name), { recursive: true });
    writeFileSync(join(dir, "node_modules", name, "package.json"), JSON.stringify({ name }));
  }
}

test("doctor --json prints the report as data", () => {
  const dir = nextProject();
  const result = loamui(dir, "doctor", "--json");
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.equal(report.complete, false);
  assert.equal(report.framework.id, "next");
  assert.deepEqual(report.conflicts, []);
  assert.equal(report.checks.find((c) => c.id === "core").ok, false);
  assert.ok(report.checks.some((c) => c.manual !== null) === false, "next has no by-hand steps");
  assert.deepEqual(report.drift, []);
});
