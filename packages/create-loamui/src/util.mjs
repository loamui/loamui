import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const styles = {
  reset: "[0m",
  dim: "[2m",
  bold: "[1m",
  green: "[32m",
  yellow: "[33m",
  red: "[31m",
  cyan: "[36m",
};

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, text) => (useColor ? `${code}${text}${styles.reset}` : text);

export const ui = {
  info: (m) => console.log(m),
  step: (m) => console.log(`${paint(styles.cyan, "›")} ${m}`),
  ok: (m) => console.log(`${paint(styles.green, "✓")} ${m}`),
  warn: (m) => console.log(`${paint(styles.yellow, "!")} ${m}`),
  fail: (m) => console.log(`${paint(styles.red, "✗")} ${m}`),
  heading: (m) => console.log(`\n${paint(styles.bold, m)}`),
  dim: (m) => console.log(paint(styles.dim, m)),
  plain: paint,
  styles,
};

/** Run a command, inheriting stdio. Returns true on exit code 0. */
export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: options.quiet ? "pipe" : "inherit",
    encoding: "utf8",
    ...options,
  });
  return { ok: result.status === 0, status: result.status ?? 1, stdout: result.stdout, stderr: result.stderr };
}

/** The four package managers this tool understands. */
export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"];

/** Detect the package manager from the invoking `npm_config_user_agent`. */
export function detectPackageManager() {
  const agent = process.env.npm_config_user_agent ?? "";
  for (const pm of PACKAGE_MANAGERS) {
    if (agent.startsWith(`${pm}/`)) return pm;
  }
  return "npm";
}

/** Build the add-dev-dependencies argv for a package manager. */
export function addDevArgs(pm, packages) {
  switch (pm) {
    case "pnpm":
      return ["add", "-D", ...packages];
    case "yarn":
      return ["add", "-D", ...packages];
    case "bun":
      return ["add", "-d", ...packages];
    default:
      return ["install", "--save-dev", ...packages];
  }
}

/** Build the add-dependencies argv for a package manager. */
export function addArgs(pm, packages) {
  switch (pm) {
    case "npm":
      return ["install", ...packages];
    default:
      return ["add", ...packages];
  }
}

/** Build the "run a published package once" argv (dlx / npx). */
export function dlxArgs(pm, rest) {
  switch (pm) {
    case "pnpm":
      return ["dlx", ...rest];
    case "yarn":
      return ["dlx", ...rest];
    case "bun":
      return ["x", ...rest];
    default:
      return ["--yes", ...rest];
  }
}

/** The binary that runs a published package once for a package manager. */
export function dlxBin(pm) {
  return pm === "npm" ? "npx" : pm;
}

export function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Resolve the authored layout of a Next.js project: whether it uses a `src/`
 * directory, the app directory, and the CSS paths the generated scripts target.
 */
export function projectLayout(cwd) {
  const hasSrc = existsSync(join(cwd, "src", "app"));
  const appDir = hasSrc ? join("src", "app") : "app";
  const hasComponents = !hasSrc && existsSync(join(cwd, "components"));
  const cssRoots = hasSrc ? ["src"] : hasComponents ? ["app", "components"] : ["app"];
  return {
    hasSrc,
    appDir,
    cssRoots,
    lintGlob: hasSrc
      ? "src/**/*.css"
      : hasComponents
        ? "{app,components}/**/*.css"
        : "app/**/*.css",
    compositionArgs: cssRoots.join(" "),
  };
}
