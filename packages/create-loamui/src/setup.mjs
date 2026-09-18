import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { addArgs, addDevArgs, dlxArgs, dlxBin, readJson, run } from "./util.mjs";

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

export const LAYER_DECLARATION = "@layer loamui.tokens, loamui.elements, loamui.components;";
export const CORE_STYLESHEET = "https://loamui.com/loamui-core.css";

const STYLELINT_DEPS = [
  "stylelint",
  "stylelint-config-standard",
  "stylelint-config-modern",
  "stylelint-config-alphabetical-order",
  "stylelint-use-nesting",
];
const CHECKER_DEPS = ["postcss", "postcss-value-parser", "loamui-typescript@npm:typescript@^5.9.2"];
const STYLELINT_FILES = ["stylelint-base.mjs", "stylelint.config.mjs"];
const CHECKER_FILES = ["check-composition.mjs", "scope-rules.mjs", "spacing-rules.mjs"];
const COMPANIONS = [
  { repo: "moderncss/skills", skill: "modern-css" },
  { repo: "GoogleChrome/modern-web-guidance", skill: "modern-web-guidance" },
];

function hasDependency(cwd, name) {
  const pkg = readJson(join(cwd, "package.json")) ?? {};
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  return Boolean(all[name]) || existsSync(join(cwd, "node_modules", name));
}

function upsertScript(cwd, name, command) {
  const path = join(cwd, "package.json");
  const pkg = readJson(path);
  if (!pkg) return false;
  pkg.scripts ??= {};
  if (pkg.scripts[name]) return true; // never clobber an existing script
  pkg.scripts[name] = command;
  writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`);
  return true;
}

function copyAssets(targetDir, files) {
  mkdirSync(targetDir, { recursive: true });
  for (const file of files) copyFileSync(join(ASSETS, file), join(targetDir, file));
}

function globalsHasLayerOrder(source) {
  const layer = source.indexOf(LAYER_DECLARATION);
  if (layer === -1) return false;
  const firstImport = source.indexOf("@import");
  const firstOtherLayer = source.replace(LAYER_DECLARATION, " ".repeat(LAYER_DECLARATION.length)).indexOf("@layer");
  const before = (other) => other === -1 || layer < other;
  return before(firstImport) && before(firstOtherLayer);
}

function skillPresent(cwd, name) {
  return (
    existsSync(join(cwd, ".claude", "skills", name, "SKILL.md")) ||
    existsSync(join(cwd, ".agents", "skills", name, "SKILL.md"))
  );
}

function installSkill(cwd, pm, repo, skill, agent) {
  const rest = ["skills@latest", "add", repo, "--skill", skill, "--agent", agent, "--yes"];
  return run(dlxBin(pm), dlxArgs(pm, rest), { cwd }).ok;
}

/**
 * The ordered setup steps. Each reports whether it is satisfied and can apply
 * an additive fix. `scaffold` steps run only for a brand-new application.
 */
export function steps({ pm, agent, layout }) {
  const list = [
    {
      id: "core",
      title: "@loamui/core installed",
      check: (cwd) => hasDependency(cwd, "@loamui/core"),
      fix: (cwd) => run(pm, addArgs(pm, ["@loamui/core"]), { cwd }).ok,
    },
    {
      id: "globals",
      title: `${layout.appDir}/globals.css declares the layer order`,
      check: (cwd) => {
        const path = join(cwd, layout.appDir, "globals.css");
        return existsSync(path) && globalsHasLayerOrder(readFileSync(path, "utf8"));
      },
      fix: (cwd) => {
        const path = join(cwd, layout.appDir, "globals.css");
        const existing = existsSync(path) ? readFileSync(path, "utf8") : "";
        if (existing.includes(LAYER_DECLARATION)) return false; // present but misordered — needs a human
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, existing ? `${LAYER_DECLARATION}\n\n${existing}` : `${LAYER_DECLARATION}\n`);
        return true;
      },
    },
    {
      id: "stylesheet",
      title: "root layout links the core stylesheet",
      check: (cwd) => {
        const path = join(cwd, layout.appDir, "layout.tsx");
        if (!existsSync(path)) return false;
        const source = readFileSync(path, "utf8");
        return source.includes(CORE_STYLESHEET) && !source.includes("@loamui/core/styles.css");
      },
      // Editing an arbitrary layout safely is out of scope; report and guide.
      manual: (cwd) => {
        const path = join(cwd, layout.appDir, "layout.tsx");
        if (existsSync(path) && readFileSync(path, "utf8").includes("@loamui/core/styles.css"))
          return `Remove the \`@loamui/core/styles.css\` import in ${layout.appDir}/layout.tsx and add <link rel="stylesheet" href="${CORE_STYLESHEET}" /> inside <head>.`;
        return `Add <link rel="stylesheet" href="${CORE_STYLESHEET}" /> inside <head> in ${layout.appDir}/layout.tsx.`;
      },
    },
    {
      id: "stylelint-files",
      title: "Stylelint configuration copied to the project",
      check: (cwd) => STYLELINT_FILES.every((f) => existsSync(join(cwd, f))),
      fix: (cwd) => (copyAssets(cwd, STYLELINT_FILES), true),
    },
    {
      id: "stylelint-deps",
      title: "Stylelint dependencies installed",
      check: (cwd) => hasDependency(cwd, "stylelint"),
      fix: (cwd) => run(pm, addDevArgs(pm, STYLELINT_DEPS), { cwd }).ok,
    },
    {
      id: "lint-css-script",
      title: "lint:css script present",
      check: (cwd) => Boolean((readJson(join(cwd, "package.json"))?.scripts ?? {})["lint:css"]),
      fix: (cwd) => upsertScript(cwd, "lint:css", `stylelint "${layout.lintGlob}"`),
    },
    {
      id: "checker-files",
      title: "composition checker copied to scripts/loamui",
      check: (cwd) => CHECKER_FILES.every((f) => existsSync(join(cwd, "scripts", "loamui", f))),
      fix: (cwd) => (copyAssets(join(cwd, "scripts", "loamui"), CHECKER_FILES), true),
    },
    {
      id: "checker-deps",
      title: "composition checker dependencies installed",
      check: (cwd) => hasDependency(cwd, "postcss") && hasDependency(cwd, "loamui-typescript"),
      fix: (cwd) => run(pm, addDevArgs(pm, CHECKER_DEPS), { cwd }).ok,
    },
    {
      id: "check-composition-script",
      title: "check:composition script present",
      check: (cwd) => Boolean((readJson(join(cwd, "package.json"))?.scripts ?? {})["check:composition"]),
      fix: (cwd) =>
        upsertScript(cwd, "check:composition", `node scripts/loamui/check-composition.mjs ${layout.compositionArgs}`),
    },
  ];

  if (agent !== "none") {
    list.push({
      id: "skill",
      title: `LoamUI skill installed for ${agent}`,
      check: (cwd) => skillPresent(cwd, "loamui"),
      fix: (cwd) => installSkill(cwd, pm, "loamui/loamui", "loamui", agent),
    });
    for (const { repo, skill } of COMPANIONS) {
      list.push({
        id: `companion:${skill}`,
        title: `companion skill ${skill} installed for ${agent}`,
        check: (cwd) => skillPresent(cwd, skill),
        fix: (cwd) => installSkill(cwd, pm, repo, skill, agent),
      });
    }
  }

  return list;
}

export { ASSETS, STYLELINT_FILES, CHECKER_FILES, STYLELINT_DEPS, CHECKER_DEPS, COMPANIONS };
