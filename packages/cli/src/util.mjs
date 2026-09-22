import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** Package-manager binaries are .cmd shims on Windows; spawn cannot find them by bare name. */
export function binary(command, platform = process.platform) {
  return platform === "win32" && ["npm", "npx", "pnpm", "yarn"].includes(command)
    ? `${command}.cmd`
    : command;
}

/** Run a command with the caller's stdio unless `quiet`; never through a shell. */
export function run(command, args, options = {}) {
  const result = spawnSync(binary(command), args, {
    stdio: options.quiet ? "pipe" : "inherit",
    encoding: "utf8",
    ...options,
  });
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"];

/** The package manager that invoked us, from npm_config_user_agent; npm otherwise. */
export function detectPackageManager() {
  const agent = process.env.npm_config_user_agent ?? "";
  return PACKAGE_MANAGERS.find((pm) => agent.startsWith(`${pm}/`)) ?? "npm";
}

export function addArgs(pm, packages) {
  return pm === "npm" ? ["install", ...packages] : ["add", ...packages];
}

export function addDevArgs(pm, packages) {
  switch (pm) {
    case "npm":
      return ["install", "--save-dev", ...packages];
    case "bun":
      return ["add", "-d", ...packages];
    default:
      return ["add", "-D", ...packages];
  }
}

/** Run a published package once: dlx for pnpm and yarn, x for bun, npx --yes for npm. */
export function dlx(pm, rest) {
  switch (pm) {
    case "pnpm":
    case "yarn":
      return [pm, ["dlx", ...rest]];
    case "bun":
      return ["bun", ["x", ...rest]];
    default:
      return ["npx", ["--yes", ...rest]];
  }
}

export function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

export function dependencies(cwd) {
  const pkg = readJson(join(cwd, "package.json")) ?? {};
  return { ...pkg.dependencies, ...pkg.devDependencies };
}

/**
 * Where a package is installed, looking up from `cwd` the way Node resolves,
 * so a workspace with hoisted dependencies is found. Null when it is not.
 */
export function installedPath(cwd, name) {
  let dir = cwd;
  for (;;) {
    const candidate = join(dir, "node_modules", name);
    if (existsSync(join(candidate, "package.json"))) return candidate;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function hasDependency(cwd, name) {
  return Boolean(dependencies(cwd)[name]) || installedPath(cwd, name) !== null;
}
