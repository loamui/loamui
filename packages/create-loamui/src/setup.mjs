import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from "node:fs";
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

function layerOrderedFirst(source) {
  const layer = source.indexOf(LAYER_DECLARATION);
  if (layer === -1) return false;
  const firstImport = source.indexOf("@import");
  const masked = source.replace(LAYER_DECLARATION, " ".repeat(LAYER_DECLARATION.length));
  const firstOtherLayer = masked.indexOf("@layer");
  const before = (other) => other === -1 || layer < other;
  return before(firstImport) && before(firstOtherLayer);
}

function anyCssHasLayer(cwd, roots) {
  for (const root of roots) {
    const base = join(cwd, root);
    let entries;
    try {
      entries = readdirSync(base, { recursive: true });
    } catch {
      continue;
    }
    for (const rel of entries) {
      if (typeof rel === "string" && rel.endsWith(".css")) {
        try {
          if (layerOrderedFirst(readFileSync(join(base, rel), "utf8"))) return true;
        } catch {
          /* ignore */
        }
      }
    }
  }
  return false;
}

function linkInHead(source) {
  return source.includes(CORE_STYLESHEET);
}

function injectLink(cwd, file) {
  const path = join(cwd, file);
  if (!existsSync(path)) return false;
  const source = readFileSync(path, "utf8");
  if (source.includes(CORE_STYLESHEET)) return true;
  const closing = source.search(/<\/head>/i);
  if (closing === -1) return false;
  const link = `    <link rel="stylesheet" href="${CORE_STYLESHEET}" />\n`;
  writeFileSync(path, source.slice(0, closing) + link + source.slice(closing));
  return true;
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

function layerStep(fw) {
  const file = fw.layerFile;
  return {
    id: "layer",
    wiring: true,
    title: file ? `${file} declares the layer order` : "a global stylesheet declares the layer order",
    check: (cwd) =>
      file
        ? existsSync(join(cwd, file)) && layerOrderedFirst(readFileSync(join(cwd, file), "utf8"))
        : anyCssHasLayer(cwd, fw.cssRoots),
    fix:
      fw.autoWireLayer && file
        ? (cwd) => {
            const path = join(cwd, file);
            const existing = existsSync(path) ? readFileSync(path, "utf8") : "";
            if (existing.includes(LAYER_DECLARATION)) return false; // present but misordered
            mkdirSync(dirname(path), { recursive: true });
            writeFileSync(path, existing ? `${LAYER_DECLARATION}\n\n${existing}` : `${LAYER_DECLARATION}\n`);
            return true;
          }
        : undefined,
    manual: () =>
      `Add "${LAYER_DECLARATION}" as the first line of your global stylesheet (see ${fw.stylesheet.docs}).`,
  };
}

function stylesheetStep(fw) {
  const { mode, file, docs } = fw.stylesheet;
  const noBundledImport = (cwd) => {
    if (!file || !existsSync(join(cwd, file))) return true;
    return !readFileSync(join(cwd, file), "utf8").includes("@loamui/core/styles.css");
  };
  const base = {
    id: "stylesheet",
    wiring: true,
    title: "the core stylesheet is loaded",
  };
  if (mode === "html") {
    return {
      ...base,
      title: `${file} links the core stylesheet`,
      check: (cwd) => existsSync(join(cwd, file)) && linkInHead(readFileSync(join(cwd, file), "utf8")),
      fix: (cwd) => injectLink(cwd, file),
      manual: () => `Add <link rel="stylesheet" href="${CORE_STYLESHEET}" /> to <head> in ${file}.`,
    };
  }
  if (mode === "code") {
    return {
      ...base,
      title: `${file} links the core stylesheet`,
      check: (cwd) =>
        existsSync(join(cwd, file)) &&
        linkInHead(readFileSync(join(cwd, file), "utf8")) &&
        noBundledImport(cwd),
      manual: (cwd) =>
        !noBundledImport(cwd)
          ? `Remove the @loamui/core/styles.css import in ${file} and add <link rel="stylesheet" href="${CORE_STYLESHEET}" /> inside <head>.`
          : `Add <link rel="stylesheet" href="${CORE_STYLESHEET}" /> inside <head> in ${file}.`,
    };
  }
  return {
    ...base,
    check: (cwd) => (file ? existsSync(join(cwd, file)) && linkInHead(readFileSync(join(cwd, file), "utf8")) : false),
    manual: () =>
      `Load ${CORE_STYLESHEET} through a <link> in your root document's <head> (see ${docs}).`,
  };
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The layer file only takes effect once the framework entry imports it. */
function layerImportStep(fw) {
  const { file, specifier } = fw.layerImport;
  const pattern = new RegExp(`import\\s+["']${escapeRegExp(specifier)}["']`);
  return {
    id: "layer-import",
    wiring: true,
    title: `${file} imports ${specifier}`,
    check: (cwd) => existsSync(join(cwd, file)) && pattern.test(readFileSync(join(cwd, file), "utf8")),
    fix: (cwd) => {
      const path = join(cwd, file);
      if (!existsSync(path)) return false;
      const source = readFileSync(path, "utf8");
      if (pattern.test(source)) return true;
      const line = `import "${specifier}";\n`;
      // A "use client" / "use server" directive must stay the first statement.
      const directive = /^(\s*["'](?:use client|use server)["'];?[^\S\n]*\n)/.exec(source);
      writeFileSync(path, directive ? directive[1] + line + source.slice(directive[1].length) : line + source);
      return true;
    },
    manual: () => `Add import "${specifier}"; to ${file} so the layer declaration loads.`,
  };
}

/**
 * The ordered setup steps for a project. `framework` supplies the CSS paths and
 * delivery. Steps tagged `wiring` change the cascade; a caller that has found a
 * blocking conflict should report them rather than apply them.
 */
export function steps({ pm, agent, framework }) {
  const fw = framework;
  const list = [
    {
      id: "core",
      title: "@loamui/core installed",
      check: (cwd) => hasDependency(cwd, "@loamui/core"),
      fix: (cwd) => run(pm, addArgs(pm, ["@loamui/core"]), { cwd }).ok,
    },
    layerStep(fw),
    ...(fw.layerImport ? [layerImportStep(fw)] : []),
    stylesheetStep(fw),
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
      fix: (cwd) => upsertScript(cwd, "lint:css", `stylelint "${fw.lintGlob}"`),
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
        upsertScript(cwd, "check:composition", `node scripts/loamui/check-composition.mjs ${fw.compositionArgs}`),
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
