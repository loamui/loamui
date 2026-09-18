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

function anyCss(cwd, roots, test, limit = 400) {
  const seen = [];
  const walk = (dir, depth) => {
    if (depth > 6 || seen.length > limit) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (["node_modules", ".git", ".next", ".output", "dist", "build"].includes(entry.name)) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path, depth + 1);
      else if (entry.name.endsWith(".css")) {
        seen.push(path);
        try {
          if (test(readFileSync(path, "utf8"), path)) return path;
        } catch {
          /* unreadable */
        }
      }
    }
    return undefined;
  };
  for (const root of roots) {
    const hit = walk(join(cwd, root), 0);
    if (hit) return hit;
  }
  return null;
}

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
  const tailwindCss = anyCss(cwd, roots, (css) => /@tailwind\b|@import\s+["']tailwindcss/.test(css));
  if (deps.tailwindcss || tailwindConfig || tailwindCss) {
    conflicts.push({
      id: "tailwind",
      severity: "blocking",
      title: "Tailwind CSS detected",
      detail:
        "Tailwind's Preflight is an unlayered reset; it overrides LoamUI's element layer. " +
        "Choose one: (a) use Tailwind for utilities only and disable Preflight, letting LoamUI own " +
        "elements; or (b) scope LoamUI to a subtree with @scope and adopt route by route. Ask your " +
        "agent with the LoamUI skill to apply either path — do not wire LoamUI over a live Preflight.",
    });
  }

  const resetPkg = RESET_PACKAGES.find((name) => deps[name]);
  const resetImport = resetPkg
    ? null
    : anyCss(cwd, roots, (css) => RESET_PACKAGES.some((name) => css.includes(name)));
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
