import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Run a command with the caller's stdio unless `quiet`; never through a shell. */
export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
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

export function hasDependency(cwd, name) {
  return Boolean(dependencies(cwd)[name]) || existsSync(join(cwd, "node_modules", name));
}
