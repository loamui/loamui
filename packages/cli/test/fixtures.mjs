import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectFramework } from "../src/frameworks.mjs";
import { steps } from "../src/steps.mjs";

export const tmp = () => mkdtempSync(join(tmpdir(), "loamui-cli-"));

export function project(deps = {}, { scripts = {}, dirs = [], files = {} } = {}) {
  const dir = tmp();
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "fixture", dependencies: deps, scripts }),
  );
  for (const d of dirs) mkdirSync(join(dir, d), { recursive: true });
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(join(dir, file, ".."), { recursive: true });
    writeFileSync(join(dir, file), content);
  }
  return dir;
}

export const nextProject = (extra = {}, options = {}) =>
  project({ next: "16.0.0", react: "19.0.0", ...extra }, { dirs: ["app"], ...options });

export const viteProject = (extra = {}, options = {}) =>
  project({ vite: "6.0.0", react: "19.0.0", ...extra }, { dirs: ["src"], ...options });

/** Pretend core is installed at `version`, so the stylesheet URL can be read. */
export function installCore(dir, version = "0.2.0") {
  mkdirSync(join(dir, "node_modules", "@loamui", "core"), { recursive: true });
  writeFileSync(
    join(dir, "node_modules", "@loamui", "core", "package.json"),
    JSON.stringify({ version }),
  );
}

export const step = (dir, id, agent = "none") =>
  steps({ pm: "npm", agent, framework: detectFramework(dir) }).find((s) => s.id === id);
