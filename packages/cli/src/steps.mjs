import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { addArgs, addDevArgs, dlx, hasDependency, installedPath, readJson, run } from "./util.mjs";

export const ASSETS = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

export const LOAM_LAYERS = ["loamui.tokens", "loamui.elements", "loamui.components"];
export const LAYER_DECLARATION = `@layer ${LOAM_LAYERS.join(", ")};`;

export const STYLELINT_FILES = ["stylelint-base.mjs", "stylelint.config.mjs"];
export const CHECKER_FILES = ["check-composition.mjs", "scope-rules.mjs", "spacing-rules.mjs"];
export const STYLELINT_DEPS = [
  "stylelint",
  "stylelint-config-standard",
  "stylelint-config-modern",
  "stylelint-config-alphabetical-order",
  "stylelint-use-nesting",
];
export const CHECKER_DEPS = [
  "postcss",
  "postcss-value-parser",
  "loamui-typescript@npm:typescript@^5.9.2",
];
export const OXLINT_CONFIG = ".oxlintrc.json";
export const OXFMT_CONFIG = ".oxfmtrc.json";

/** Project-owned copies of packaged assets, keyed by where init puts them. */
export const OWNED_COPIES = {
  "stylelint-base.mjs": "stylelint-base.mjs",
  "stylelint.config.mjs": "stylelint.config.mjs",
  "scripts/loamui/check-composition.mjs": "check-composition.mjs",
  "scripts/loamui/scope-rules.mjs": "scope-rules.mjs",
  "scripts/loamui/spacing-rules.mjs": "spacing-rules.mjs",
  [OXLINT_CONFIG]: OXLINT_CONFIG,
  [OXFMT_CONFIG]: OXFMT_CONFIG,
};

/** Pinned, and bumped on purpose: the installer runs with the user's permissions. */
export const SKILLS_INSTALLER = "skills@1.7.0";
export const COMPANIONS = [
  { repo: "moderncss/skills", skill: "modern-css" },
  { repo: "GoogleChrome/modern-web-guidance", skill: "modern-web-guidance" },
];

const LEGACY_STYLESHEET = "https://loamui.com/loamui-core.css";
const STYLESHEET_PATTERN =
  /https:\/\/cdn\.jsdelivr\.net\/npm\/@loamui\/core@[^/]+\/dist\/styles\.css/;

/**
 * The stylesheet for the installed core, served immutable from the npm CDN.
 * Null until core is installed: the version is read, never guessed.
 */
export function coreStylesheet(cwd) {
  const core = installedPath(cwd, "@loamui/core");
  const version = core && readJson(join(core, "package.json"))?.version;
  return version ? `https://cdn.jsdelivr.net/npm/@loamui/core@${version}/dist/styles.css` : null;
}

/**
 * True when the stylesheet's first statement is an @layer list naming the
 * three LoamUI layers in order. A combined order (Tailwind 4's, for example)
 * counts; a declaration after an @import does not, because the layers it
 * names may already exist by then.
 */
export function declaresLayerOrder(source) {
  const first = /^\s*@layer\s+([^;{]+);/.exec(source.replace(/\/\*[\s\S]*?\*\//g, ""));
  if (!first) return false;
  const names = first[1].split(",").map((name) => name.trim());
  const positions = LOAM_LAYERS.map((layer) => names.indexOf(layer));
  return positions.every((at, i) => at !== -1 && (i === 0 || at > positions[i - 1]));
}

const read = (cwd, file) =>
  existsSync(join(cwd, file)) ? readFileSync(join(cwd, file), "utf8") : null;

/** Project copies that differ from what this version of loamui ships. Reported, never overwritten. */
export function driftedCopies(cwd) {
  return Object.entries(OWNED_COPIES)
    .filter(([file, asset]) => {
      const own = read(cwd, file);
      return own !== null && own !== readFileSync(join(ASSETS, asset), "utf8");
    })
    .map(([file]) => file);
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

const hasScript = (cwd, name) => Boolean(readJson(join(cwd, "package.json"))?.scripts?.[name]);

function copyAssets(targetDir, files) {
  mkdirSync(targetDir, { recursive: true });
  for (const file of files) copyFileSync(join(ASSETS, file), join(targetDir, file));
  return true;
}

function skillPresent(cwd, name) {
  return (
    existsSync(join(cwd, ".claude", "skills", name, "SKILL.md")) ||
    existsSync(join(cwd, ".agents", "skills", name, "SKILL.md"))
  );
}

function installSkill(cwd, pm, repo, skill, agent) {
  const [bin, args] = dlx(pm, [
    SKILLS_INSTALLER,
    "add",
    repo,
    "--skill",
    skill,
    "--agent",
    agent,
    "--yes",
  ]);
  return run(bin, args, { cwd }).ok;
}

function layerStep(fw) {
  const file = fw.layerFile;
  return {
    id: "layer",
    wiring: true,
    title: file
      ? `${file} declares the layer order`
      : "a global stylesheet declares the layer order",
    check: (cwd) => (file ? declaresLayerOrder(read(cwd, file) ?? "") : false),
    describe: () => `write "${LAYER_DECLARATION}" as the first line of ${file}`,
    fix:
      fw.autoWireLayer && file
        ? (cwd) => {
            const existing = read(cwd, file) ?? "";
            if (existing.includes(LAYER_DECLARATION)) return false; // present, but not first
            mkdirSync(dirname(join(cwd, file)), { recursive: true });
            writeFileSync(
              join(cwd, file),
              existing ? `${LAYER_DECLARATION}\n\n${existing}` : `${LAYER_DECLARATION}\n`,
            );
            return true;
          }
        : undefined,
    manual: () =>
      `Add "${LAYER_DECLARATION}" as the first line of your global stylesheet (see ${fw.stylesheet.docs}).`,
  };
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The layer file only takes effect once the framework's entry imports it. A
 * bare side-effect import can be added; a URL import that head() links from
 * is the starter's own shape, so its absence is reported instead.
 */
function layerImportStep(fw) {
  const { file, specifier, bare } = fw.layerImport;
  const pattern = new RegExp(`import\\b[^;]*?["']${escapeRegExp(specifier)}["']`);
  const step = {
    id: "layer-import",
    wiring: true,
    title: `${file} imports ${specifier}`,
    check: (cwd) => pattern.test(read(cwd, file) ?? ""),
    describe: () => `add import "${specifier}"; to ${file}`,
    manual: () =>
      bare
        ? `Add import "${specifier}"; to ${file} so the layer declaration loads.`
        : `Import ${specifier} in ${file} and link it from head(), as the starter does (see ${fw.stylesheet.docs}).`,
  };
  if (bare)
    step.fix = (cwd) => {
      const source = read(cwd, file);
      if (source === null) return false;
      if (pattern.test(source)) return true;
      const line = `import "${specifier}";\n`;
      // A "use client" or "use server" directive must stay the first statement.
      const directive = /^(\s*["'](?:use client|use server)["'];?[^\S\n]*\n)/.exec(source);
      writeFileSync(
        join(cwd, file),
        directive ? directive[1] + line + source.slice(directive[1].length) : line + source,
      );
      return true;
    };
  return step;
}

function stylesheetStep(fw) {
  const { mode, file, docs } = fw.stylesheet;
  const source = (cwd) => read(cwd, file) ?? "";
  const linked = (cwd) => STYLESHEET_PATTERN.test(source(cwd));
  const legacy = (cwd) => source(cwd).includes(LEGACY_STYLESHEET);
  const bundled = (cwd) => source(cwd).includes("@loamui/core/styles.css");
  const url = (cwd) => coreStylesheet(cwd) ?? "<the URL init prints>";
  const link = (cwd) => `<link rel="stylesheet" href="${url(cwd)}" />`;
  const entry = (cwd) => `{ rel: "stylesheet", href: "${url(cwd)}" }`;
  const where = (cwd) =>
    mode === "links"
      ? `${entry(cwd)} first in the links array of head() in ${file}`
      : `${link(cwd)} inside <head>${file ? ` in ${file}` : ""}`;
  const manual = (cwd) =>
    legacy(cwd)
      ? `Replace the unversioned ${LEGACY_STYLESHEET} link in ${file} with ${url(cwd)}.`
      : bundled(cwd)
        ? `Remove the @loamui/core/styles.css import in ${file} and add ${where(cwd)}.`
        : `Add ${where(cwd)} (see ${docs}).`;
  const step = {
    id: "stylesheet",
    wiring: true,
    title: file ? `${file} links the core stylesheet` : "the core stylesheet is linked",
    check: (cwd) => linked(cwd) && !bundled(cwd),
    describe: (cwd) => `add ${where(cwd)}`,
    manual,
  };
  if (mode === "manual") return step;

  step.fix = (cwd) => {
    const src = read(cwd, file);
    const href = coreStylesheet(cwd);
    if (src === null || !href || bundled(cwd)) return false;
    if (STYLESHEET_PATTERN.test(src)) return true;
    if (legacy(cwd)) {
      writeFileSync(join(cwd, file), src.replaceAll(LEGACY_STYLESHEET, href));
      return true;
    }
    if (mode === "links") {
      // First in the links array of head(), in the file's own quote style and indentation.
      const links = /links:\s*\[\n?([^\S\n]*)/.exec(src);
      if (!links) return false;
      const quote = /rel:\s*'/.test(src) ? "'" : '"';
      const indent = links[1];
      const at = links.index + links[0].length - indent.length;
      const line = `${indent}{ rel: ${quote}stylesheet${quote}, href: ${quote}${href}${quote} },\n`;
      writeFileSync(join(cwd, file), src.slice(0, at) + line + src.slice(at));
      return true;
    }
    const tag = `<link rel="stylesheet" href="${href}" />`;
    const closing = src.search(/<\/head>/i);
    if (closing !== -1) {
      const indent = /[^\S\n]*$/.exec(src.slice(0, closing))[0];
      writeFileSync(
        join(cwd, file),
        `${src.slice(0, closing)}  ${tag}\n${indent}${src.slice(closing)}`,
      );
      return true;
    }
    // A layout with a body and no head: give it one. Anything else is theirs to edit.
    const body = src.search(/<body[\s>]/i);
    if (mode !== "code" || body === -1 || /<head[\s>]/i.test(src)) return false;
    const indent = /[^\S\n]*$/.exec(src.slice(0, body))[0];
    writeFileSync(
      join(cwd, file),
      `${src.slice(0, body)}<head>\n${indent}  ${tag}\n${indent}</head>\n${indent}${src.slice(body)}`,
    );
    return true;
  };
  return step;
}

/** The project's own "run everything" command, in its package manager's idiom. */
function runScript(pm, name) {
  return pm === "npm" ? `npm run ${name}` : pm === "bun" ? `bun run ${name}` : `${pm} ${name}`;
}

const CHECKS = ["lint:css", "lint:js", "check:composition", "format:check"];

const INSTRUCTIONS_MARK = "## LoamUI";

function instructions(pm, fw) {
  const layer = fw.layerFile ?? "the global stylesheet";
  const lines = [
    INSTRUCTIONS_MARK,
    "",
    "This project uses LoamUI (`@loamui/core`): contextual tokens, element styles and",
    "components. Read the `loamui` skill before writing UI, and the `modern-css` and",
    "`modern-web-guidance` skills it names.",
    "",
    `- The stylesheet is linked in ${fw.stylesheet.file ?? "the root document"} for the installed`,
    `  version; \`${layer}\` declares the layer order first.`,
    `- Composition lives under ${fw.cssRoots.map((r) => `\`${r}/\``).join(", ")}: recipe rules in`,
    '  `@layer loamui.components` inside `@scope (.recipe) to ([class*="loam-"])`, spacing',
    "  and colour from `--loam-*` tokens, parts composed rather than props configured.",
    `- Before finishing any UI change run \`${runScript(pm, "check")}\` (${CHECKS.join(", ")})`,
    "  and fix what it reports; never disable a check to pass it.",
    `- \`${pm === "npm" ? "npx" : pm === "bun" ? "bunx" : `${pm} dlx`} loamui@latest doctor\` reports the setup; \`init\` completes it.`,
    "",
  ];
  return lines.join("\n");
}

function instructionsStep(pm, fw, agent) {
  const file = "AGENTS.md";
  return {
    id: "agent-instructions",
    title: `${file} carries the LoamUI section`,
    check: (cwd) => (read(cwd, file) ?? "").includes(INSTRUCTIONS_MARK),
    describe: () =>
      `add a "${INSTRUCTIONS_MARK}" section to ${file}${agent === "claude-code" ? " and import it from CLAUDE.md" : ""}`,
    fix: (cwd) => {
      const existing = read(cwd, file);
      if (existing?.includes(INSTRUCTIONS_MARK)) return true;
      const section = instructions(pm, fw);
      writeFileSync(
        join(cwd, file),
        existing ? `${existing.trimEnd()}\n\n${section}` : `# Agent instructions\n\n${section}`,
      );
      if (agent === "claude-code") {
        const claude = read(cwd, "CLAUDE.md") ?? "";
        if (!/^@AGENTS\.md\s*$/m.test(claude))
          writeFileSync(
            join(cwd, "CLAUDE.md"),
            claude ? `${claude.trimEnd()}\n\n@AGENTS.md\n` : "@AGENTS.md\n",
          );
      }
      return true;
    },
  };
}

/**
 * The ordered setup steps for a project. Each has `check`, a `describe` for
 * a dry run, and either `fix` or `manual` instructions. Steps tagged
 * `wiring` change the cascade and are held back while a conflict stands.
 */
export function steps({ pm, agent, framework: fw }) {
  const list = [
    {
      id: "core",
      title: "@loamui/core installed",
      check: (cwd) => hasDependency(cwd, "@loamui/core"),
      describe: () => `${pm} ${addArgs(pm, ["@loamui/core"]).join(" ")}`,
      fix: (cwd) => run(pm, addArgs(pm, ["@loamui/core"]), { cwd }).ok,
    },
    layerStep(fw),
    ...(fw.layerImport ? [layerImportStep(fw)] : []),
    stylesheetStep(fw),
    {
      id: "stylelint-files",
      title: "Stylelint configuration in the project",
      check: (cwd) => STYLELINT_FILES.every((f) => existsSync(join(cwd, f))),
      describe: () => `copy ${STYLELINT_FILES.join(" and ")} beside package.json`,
      fix: (cwd) => copyAssets(cwd, STYLELINT_FILES),
    },
    {
      id: "stylelint-deps",
      title: "Stylelint dependencies installed",
      check: (cwd) => hasDependency(cwd, "stylelint"),
      describe: () => `${pm} ${addDevArgs(pm, STYLELINT_DEPS).join(" ")}`,
      fix: (cwd) => run(pm, addDevArgs(pm, STYLELINT_DEPS), { cwd }).ok,
    },
    {
      id: "lint-css-script",
      title: "lint:css script present",
      check: (cwd) => hasScript(cwd, "lint:css"),
      describe: () => `add the lint:css script: stylelint "${fw.lintGlob}"`,
      fix: (cwd) => upsertScript(cwd, "lint:css", `stylelint "${fw.lintGlob}"`),
    },
    {
      id: "checker-files",
      title: "composition checker in scripts/loamui",
      check: (cwd) => CHECKER_FILES.every((f) => existsSync(join(cwd, "scripts", "loamui", f))),
      describe: () => `copy ${CHECKER_FILES.join(", ")} into scripts/loamui/`,
      fix: (cwd) => copyAssets(join(cwd, "scripts", "loamui"), CHECKER_FILES),
    },
    {
      id: "checker-deps",
      title: "composition checker dependencies installed",
      check: (cwd) => hasDependency(cwd, "postcss") && hasDependency(cwd, "loamui-typescript"),
      describe: () => `${pm} ${addDevArgs(pm, CHECKER_DEPS).join(" ")}`,
      fix: (cwd) => run(pm, addDevArgs(pm, CHECKER_DEPS), { cwd }).ok,
    },
    {
      id: "check-composition-script",
      title: "check:composition script present",
      check: (cwd) => hasScript(cwd, "check:composition"),
      describe: () =>
        `add the check:composition script: node scripts/loamui/check-composition.mjs ${fw.compositionArgs}`,
      fix: (cwd) =>
        upsertScript(
          cwd,
          "check:composition",
          `node scripts/loamui/check-composition.mjs ${fw.compositionArgs}`,
        ),
    },
    {
      id: "oxlint-config",
      title: `${OXLINT_CONFIG} in the project`,
      check: (cwd) => existsSync(join(cwd, OXLINT_CONFIG)),
      describe: () => `copy ${OXLINT_CONFIG} beside package.json`,
      fix: (cwd) => copyAssets(cwd, [OXLINT_CONFIG]),
    },
    {
      id: "oxlint-dep",
      title: "oxlint installed",
      check: (cwd) => hasDependency(cwd, "oxlint"),
      describe: () => `${pm} ${addDevArgs(pm, ["oxlint"]).join(" ")}`,
      fix: (cwd) => run(pm, addDevArgs(pm, ["oxlint"]), { cwd }).ok,
    },
    {
      id: "lint-js-script",
      title: "lint:js script present",
      check: (cwd) => hasScript(cwd, "lint:js"),
      describe: () => "add the lint:js script: oxlint",
      fix: (cwd) => upsertScript(cwd, "lint:js", "oxlint"),
    },
    {
      id: "oxfmt-config",
      title: `${OXFMT_CONFIG} in the project`,
      check: (cwd) => existsSync(join(cwd, OXFMT_CONFIG)),
      describe: () => `copy ${OXFMT_CONFIG} beside package.json`,
      fix: (cwd) => copyAssets(cwd, [OXFMT_CONFIG]),
    },
    {
      id: "oxfmt-dep",
      title: "oxfmt installed",
      check: (cwd) => hasDependency(cwd, "oxfmt"),
      describe: () => `${pm} ${addDevArgs(pm, ["oxfmt"]).join(" ")}`,
      fix: (cwd) => run(pm, addDevArgs(pm, ["oxfmt"]), { cwd }).ok,
    },
    {
      id: "format-scripts",
      title: "format and format:check scripts present",
      check: (cwd) => hasScript(cwd, "format") && hasScript(cwd, "format:check"),
      describe: () => "add the format script: oxfmt, and format:check: oxfmt --check",
      fix: (cwd) =>
        upsertScript(cwd, "format", "oxfmt") && upsertScript(cwd, "format:check", "oxfmt --check"),
    },
    {
      id: "check-script",
      title: "check script runs every check",
      check: (cwd) => hasScript(cwd, "check"),
      describe: () =>
        `add the check script: ${CHECKS.map((name) => runScript(pm, name)).join(" && ")}`,
      fix: (cwd) =>
        upsertScript(cwd, "check", CHECKS.map((name) => runScript(pm, name)).join(" && ")),
    },
    instructionsStep(pm, fw, agent),
  ];

  if (agent !== "none") {
    for (const { repo, skill } of [{ repo: "loamui/loamui", skill: "loamui" }, ...COMPANIONS]) {
      list.push({
        id: `skill:${skill}`,
        title: `${skill} skill installed for ${agent}`,
        check: (cwd) => skillPresent(cwd, skill),
        describe: () => `install the ${skill} skill from ${repo} for ${agent}`,
        fix: (cwd) => installSkill(cwd, pm, repo, skill, agent),
      });
    }
  }

  return list;
}
