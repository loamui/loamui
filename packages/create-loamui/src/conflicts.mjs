import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readJson } from "./util.mjs";

// Unlayered global resets that override LoamUI's element layer wholesale.
const RESET_PACKAGES = [
  "normalize.css",
  "modern-normalize",
  "sanitize.css",
  "reset-css",
  "the-new-css-reset",
  "@csstools/normalize.css",
];

const SKIPPED = new Set(["node_modules", ".git", ".next", ".output", "dist", "build"]);

/** Find the first CSS file under `roots` whose source satisfies `test`. */
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
          if (test(readFileSync(path, "utf8"))) return path;
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
  const spec = deps.tailwindcss ?? "";
  const match = /(\d+)/.exec(spec);
  if (match) return Number(match[1]);
  if (css && /@import\s+["']tailwindcss/.test(css)) return 4;
  if (css && /@tailwind\b/.test(css)) return 3;
  return null;
}

const TAILWIND_V3 =
  "Tailwind 3 emits Preflight unlayered, so it overrides LoamUI's element layer. " +
  "Either use Tailwind for utilities only with Preflight disabled (corePlugins.preflight: false) " +
  "and let LoamUI own elements, or scope LoamUI to a subtree with @scope and adopt route by route.";
const TAILWIND_V4 =
  "Tailwind 4 uses real cascade layers, so the first @layer statement the browser sees decides. " +
  "Declare one combined order before any other stylesheet: " +
  "@layer theme, base, loamui.tokens, loamui.elements, loamui.components, components, utilities; " +
  "— or scope LoamUI to a subtree with @scope.";

/**
 * Detect setups that fight LoamUI's all-layered CSS. LoamUI keeps every rule
 * inside `@layer loamui.*`, so any unlayered reset wins over its element
 * styles. These are reported, never auto-resolved: removing someone's reset is
 * a design decision for them and their agent.
 */
export function detectConflicts(cwd, framework) {
  const pkg = readJson(join(cwd, "package.json")) ?? {};
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const conflicts = [];
  const roots = framework?.cssRoots ?? ["src", "app", "styles"];

  const tailwindConfig = ["js", "ts", "cjs", "mjs"].some((ext) =>
    existsSync(join(cwd, `tailwind.config.${ext}`)),
  );
  const tailwindCssFile = findCss(cwd, roots, (css) => /@tailwind\b|@import\s+["']tailwindcss/.test(css));
  if (deps.tailwindcss || tailwindConfig || tailwindCssFile) {
    const css = tailwindCssFile ? readFileSync(tailwindCssFile, "utf8") : null;
    const major = tailwindMajor(deps, css);
    const detail =
      major === 3 ? TAILWIND_V3 : major === 4 ? TAILWIND_V4 : `${TAILWIND_V3} With Tailwind 4: ${TAILWIND_V4}`;
    conflicts.push({
      id: "tailwind",
      severity: "blocking",
      title: `Tailwind CSS${major ? ` ${major}` : ""} detected`,
      detail: `${detail} Ask your agent with the LoamUI skill to apply it; do not wire LoamUI over a live reset.`,
    });
  }

  const resetPkg = RESET_PACKAGES.find((name) => deps[name]);
  const resetImport = resetPkg
    ? null
    : findCss(cwd, roots, (css) => RESET_PACKAGES.some((name) => css.includes(name)));
  if (resetPkg || resetImport) {
    conflicts.push({
      id: "reset",
      severity: "blocking",
      title: `Global CSS reset detected (${resetPkg ?? "imported in CSS"})`,
      detail:
        "An unlayered normalize/reset overrides LoamUI's element layer. Move it into a layer " +
        "ordered below loamui.elements, or scope LoamUI to a subtree, before wiring the stylesheet.",
    });
  }

  return conflicts;
}
