#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { create } from "../src/commands/create.mjs";
import { doctor } from "../src/commands/doctor.mjs";
import { init } from "../src/commands/init.mjs";
import { ui } from "../src/ui.mjs";
import { PACKAGE_MANAGERS, detectPackageManager } from "../src/util.mjs";

const AGENTS = ["claude-code", "codex", "none"];
const HELP = `loamui — set up LoamUI in a project, or create one

Usage:
  loamui init [options]          Set up LoamUI in the current project
  loamui doctor [options]        Check the setup and report what is missing
  loamui create <dir> [options]  Create a Next.js app with LoamUI set up

Options:
  --dry-run                      init: show what would change without changing it
  --agent <claude-code|codex|none>
                                 Agent to install the skills for (default: claude-code)
  --pm <pnpm|npm|yarn|bun>       Package manager (default: the one that ran this)
  -y, --yes                      Accept defaults without prompting
  -h, --help                     Show this help
  -v, --version                  Show the version
`;

function parse(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "-y" || arg === "--yes") opts.yes = true;
    else if (arg === "-h" || arg === "--help") opts.help = true;
    else if (arg === "-v" || arg === "--version") opts.version = true;
    else if (arg === "--agent") opts.agent = argv[++i];
    else if (arg === "--pm") opts.pm = argv[++i];
    else if (arg.startsWith("-")) {
      ui.fail(`Unknown option: ${arg}`);
      ui.info(HELP);
      process.exit(1);
    } else opts._.push(arg);
  }
  return opts;
}

function oneOf(name, value, allowed) {
  if (value !== undefined && !allowed.includes(value)) {
    ui.fail(`Invalid --${name} "${value}". Expected one of: ${allowed.join(", ")}.`);
    process.exit(1);
  }
}

async function ask(question, fallback) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question(`${question} `)).trim() || fallback;
  } finally {
    rl.close();
  }
}

async function main() {
  const opts = parse(process.argv.slice(2));
  if (opts.help) return void ui.info(HELP);
  if (opts.version) {
    const pkg = JSON.parse(
      readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"), "utf8"),
    );
    return void ui.info(pkg.version);
  }
  oneOf("agent", opts.agent, AGENTS);
  oneOf("pm", opts.pm, PACKAGE_MANAGERS);

  const [command, ...rest] = opts._;
  const interactive = process.stdin.isTTY && !opts.yes;
  const pm = opts.pm ?? detectPackageManager();
  const cwd = process.cwd();
  let agent = opts.agent;
  if (!agent) {
    agent =
      interactive && command !== "doctor"
        ? await ask(
            `Agent to install the skills for? (${AGENTS.join("/")}) [claude-code]`,
            "claude-code",
          )
        : "claude-code";
    oneOf("agent", agent, AGENTS);
  }

  switch (command) {
    case "init":
      process.exitCode = init({ cwd, pm, agent, dryRun: Boolean(opts.dryRun) });
      return;
    case "doctor":
      process.exitCode = doctor({ cwd, pm, agent });
      return;
    case "create": {
      const dir = rest[0] ?? (interactive ? await ask("Project directory?", "my-app") : "my-app");
      process.exitCode = create({ dir, pm, agent });
      return;
    }
    case undefined:
      ui.info(HELP);
      return;
    default:
      ui.fail(`Unknown command: ${command}`);
      ui.info(HELP);
      process.exitCode = 1;
  }
}

main().catch((error) => {
  ui.fail(error?.stack ?? String(error));
  process.exit(1);
});
