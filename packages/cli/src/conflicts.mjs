import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dependencies } from "./util.mjs";

/**
 * LoamUI keeps every rule inside `@layer loamui.*`, so any unlayered global
 * CSS wins over its element styles without a build error. These are the
 * setups that ship such CSS. Tailwind 4 is the one that can be resolved by a
 * single declaration; the rest are a decision for the project, so they are
 * reported and the cascade wiring is held back.
 */
export const TAILWIND4_LAYER_ORDER =
  "@layer theme, base, loamui.tokens, loamui.elements, loamui.components, components, utilities;";

const RESET_PACKAGES = [
  "normalize.css",
  "modern-normalize",
  "sanitize.css",
  "reset-css",
  "the-new-css-reset",
  "@csstools/normalize.css",
];

const DESIGN_SYSTEMS = {
  "@mantine/core": "Mantine",
  "@chakra-ui/react": "Chakra UI",
  "@mui/material": "MUI",
  antd: "Ant Design",
  bootstrap: "Bootstrap",
};

const SKIPPED = new Set(["node_modules", ".git", ".next", ".output", "dist", "build"]);

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** The first CSS file under `roots` whose (comment-free) source satisfies `test`. */
function findCss(cwd, roots, test, limit = 400) {
  let visited = 0;
  const walk = (dir, depth) => {
    if (depth > 6 || visited > limit) return null;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return null;
    }
    for (const entry of entries) {
      if (SKIPPED.has(entry.name)) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        const hit = walk(path, depth + 1);
        if (hit) return hit;
      } else if (entry.name.endsWith(".css")) {
        visited++;
        try {
          if (test(stripComments(readFileSync(path, "utf8")))) return path;
        } catch {
          /* unreadable */
        }
      }
    }
    return null;
  };
  for (const root of roots) {
    const hit = walk(join(cwd, root), 0);
    if (hit) return hit;
  }
  return null;
}

function tailwindMajor(deps, css) {
  const match = /(\d+)/.exec(deps.tailwindcss ?? "");
  if (match) return Number(match[1]);
  if (css && /@import\s+["']tailwindcss/.test(css)) return 4;
  if (css && /@tailwind\b/.test(css)) return 3;
  return null;
}

const SUBTREE = "or scope LoamUI to a subtree with @scope and adopt it route by route.";

const TAILWIND_3 =
  "Tailwind 3 emits Preflight unlayered, so it overrides LoamUI's element styles. " +
  "Keep Tailwind for utilities with Preflight disabled (corePlugins.preflight: false) and let LoamUI own elements, " +
  SUBTREE;

const TAILWIND_4 =
  "Tailwind 4 uses real cascade layers, so the first @layer statement the browser sees decides the order. " +
  `Declare one combined order before any other stylesheet: ${TAILWIND4_LAYER_ORDER}`;

function tailwind(cwd, deps, roots) {
  const configured = ["js", "ts", "cjs", "mjs"].some((ext) =>
    existsSync(join(cwd, `tailwind.config.${ext}`)),
  );
  const file = findCss(cwd, roots, (css) => /@tailwind\b|@import\s+["']tailwindcss/.test(css));
  if (!deps.tailwindcss && !configured && !file) return null;

  const css = file ? stripComments(readFileSync(file, "utf8")) : null;
  const major = tailwindMajor(deps, css);
  const conflict = {
    id: "tailwind",
    title: `Tailwind CSS${major ? ` ${major}` : ""} detected`,
    detail:
      major === 3
        ? TAILWIND_3
        : major === 4
          ? TAILWIND_4
          : `${TAILWIND_3} With Tailwind 4: ${TAILWIND_4}`,
  };
  if (major === 4 && file) {
    conflict.describe = `write "${TAILWIND4_LAYER_ORDER}" as the first line of ${file.slice(cwd.length + 1)}`;
    conflict.fix = () => {
      const source = readFileSync(file, "utf8");
      if (source.includes(TAILWIND4_LAYER_ORDER)) return true;
      writeFileSync(file, `${TAILWIND4_LAYER_ORDER}\n\n${source}`);
      return true;
    };
  }
  return conflict;
}

function designSystem(deps) {
  const name = Object.keys(DESIGN_SYSTEMS).find((pkg) => deps[pkg]);
  if (!name) return null;
  return {
    id: "design-system",
    title: `${DESIGN_SYSTEMS[name]} detected (${name})`,
    detail:
      `${DESIGN_SYSTEMS[name]} ships its own global styles, and two element-styling systems do not share a page. ` +
      `Adopt LoamUI in a subtree with @scope, or choose one system for the application.`,
  };
}

function reset(cwd, deps, roots) {
  const pkg = RESET_PACKAGES.find((name) => deps[name]);
  const file = pkg
    ? null
    : findCss(cwd, roots, (css) => RESET_PACKAGES.some((name) => css.includes(name)));
  if (!pkg && !file) return null;
  return {
    id: "reset",
    title: `Global CSS reset detected (${pkg ?? "imported in CSS"})`,
    detail:
      "An unlayered normalize or reset overrides LoamUI's element styles. Move it into a layer ordered below loamui.elements, " +
      SUBTREE,
  };
}

/**
 * Every conflict in the project. A conflict with `fix` can be resolved by
 * `init`; the others hold the cascade steps back until the project decides.
 */
export function detectConflicts(cwd, framework) {
  const deps = dependencies(cwd);
  const roots = framework?.cssRoots ?? ["src", "app", "styles"];
  return [tailwind(cwd, deps, roots), designSystem(deps), reset(cwd, deps, roots)].filter(Boolean);
}
