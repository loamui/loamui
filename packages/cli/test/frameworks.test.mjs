import assert from "node:assert/strict";
import { test } from "node:test";
import { detectFramework } from "../src/frameworks.mjs";
import { preflight } from "../src/preflight.mjs";
import { detectPackageManager } from "../src/util.mjs";
import { nextProject, project, tmp, viteProject } from "./fixtures.mjs";

test("package-manager binaries get the .cmd suffix on Windows only", async () => {
  const { binary } = await import("../src/util.mjs");
  assert.equal(binary("npm", "win32"), "npm.cmd");
  assert.equal(binary("npx", "win32"), "npx.cmd");
  assert.equal(binary("bun", "win32"), "bun");
  assert.equal(binary("npm", "darwin"), "npm");
});

test("the package manager is the one that invoked us", () => {
  const original = process.env.npm_config_user_agent;
  process.env.npm_config_user_agent = "pnpm/9.0.0 npm/? node/v20";
  assert.equal(detectPackageManager(), "pnpm");
  process.env.npm_config_user_agent = "";
  assert.equal(detectPackageManager(), "npm");
  if (original === undefined) delete process.env.npm_config_user_agent;
  else process.env.npm_config_user_agent = original;
});

test("Next is wired through app/ or src/app/, Vite through index.html", () => {
  const next = detectFramework(nextProject());
  assert.equal(next.id, "next");
  assert.equal(next.layerFile, "app/globals.css");
  assert.equal(next.layerImport.file, "app/layout.tsx");
  assert.equal(next.stylesheet.mode, "code");

  const src = project({ next: "16.0.0", react: "19.0.0" }, { dirs: ["src/app"] });
  assert.equal(detectFramework(src).layerFile, "src/app/globals.css");

  const vite = detectFramework(viteProject());
  assert.equal(vite.id, "vite");
  assert.equal(vite.stylesheet.file, "index.html");
  assert.equal(vite.layerImport.specifier, "./index.css");
});

test("Remix and unknown projects are guided, not edited", () => {
  const remix = detectFramework(project({ "@remix-run/react": "2.0.0", react: "19.0.0" }));
  assert.equal(remix.stylesheet.file, "app/root.tsx");
  const unknown = detectFramework(project({ react: "19.0.0" }));
  assert.equal(unknown.id, "unknown");
  assert.equal(unknown.layerFile, null);
});

test("preflight stops without a package.json or without React", () => {
  assert.match(preflight(tmp())[0], /No package.json/);
  assert.match(preflight(project({ vite: "6.0.0", vue: "3.0.0" }))[0], /no react dependency/);
  assert.deepEqual(preflight(nextProject()), []);
});
