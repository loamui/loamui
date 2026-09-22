// Check literal React style objects in core, the site and published recipes.
// CSS is covered by the Stylelint rule loamui/spacing (scripts/stylelint);
// this script exists because .tsx is the one place Stylelint cannot look.
// Fluid calc()/clamp() ramps and em geometry are deliberate exceptions.
// A -1px margin is allowed for border overlap and visually hidden geometry.
// Other functions (including var() fallbacks) are inspected rather than skipped.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spacingFindings } from "../packages/cli/assets/spacing-rules.mjs";
export { bypassesScale, spacingFindings } from "../packages/cli/assets/spacing-rules.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

export function checkedFiles() {
  const published = new Set(
    [
      ...readFileSync(join(ROOT, "apps/docs/src/recipes/recipes.ts"), "utf8").matchAll(
        /^\s*"([^"\n]+)"/gm,
      ),
    ].map((m) => m[1]),
  );
  return ["packages/core/src", "apps/docs/src"]
    .flatMap((dir) => walk(join(ROOT, dir)))
    .filter((file) => {
      if (!/\.(css|tsx)$/.test(file) || /\.(test|stories)\.tsx$/.test(file)) return false;
      const recipe = relative(ROOT, file).match(/^apps\/docs\/src\/recipes\/([^/]+\/[^/]+)\//);
      return !recipe || published.has(recipe[1]);
    });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // checkedFiles() still lists CSS — checks.test.mjs pins that — but the CSS
  // findings now come from Stylelint, so only the .tsx half runs here.
  const files = checkedFiles().filter((file) => file.endsWith(".tsx"));
  const findings = files.flatMap((file) =>
    spacingFindings(readFileSync(file, "utf8"), file).map((finding) => ({ file, ...finding })),
  );
  for (const finding of findings)
    console.error(
      `${relative(ROOT, finding.file)}:${finding.line} ${finding.prop}: ${finding.value}`,
    );
  if (findings.length) {
    console.error(
      `check-spacing: ${findings.length} literal spacing values bypass tokens. Use --loam-space-* or --loam-space-fixed-*.`,
    );
    process.exitCode = 1;
  } else
    console.log(
      `check-spacing: ${files.length} TSX files checked (CSS runs under Stylelint as loamui/spacing). Runtime values and calc()/clamp() ramps require review.`,
    );
}
