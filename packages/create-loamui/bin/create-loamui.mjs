#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PACKAGE_MANAGERS, detectPackageManager, ui } from "../src/util.mjs";
import { scaffold } from "../src/scaffold.mjs";
import { doctor } from "../src/doctor.mjs";

const AGENTS = ["claude-code", "codex", "none"];
const HELP = `create-loamui — scaffold a LoamUI app or verify LoamUI setup

Usage:
  create-loamui [directory] [options]      Scaffold a new LoamUI application
  create-loamui doctor [options]           Check (and optionally complete) setup in the current project

Options:
  --agent <claude-code|codex|none>   Coding agent to install the skill for (default: claude-code)
  --pm <pnpm|npm|yarn|bun>           Package manager (default: detected from the invoker)
  --framework <next>                 Framework to scaffold (default: next)
  --fix                              doctor only: apply additive fixes
  -y, --yes                          Skip prompts and accept defaults
  -h, --help                         Show this help
  -v, --version                      Show the version
`;

function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--fix") opts.fix = true;
    else if (arg === "-y" || arg === "--yes") opts.yes = true;
    else if (arg === "-h" || arg === "--help") opts.help = true;
    else if (arg === "-v" || arg === "--version") opts.version = true;
    else if (arg === "--agent") opts.agent = argv[++i];
    else if (arg === "--pm") opts.pm = argv[++i];
    else if (arg === "--framework") opts.framework = argv[++i];
    else if (arg.startsWith("--")) {
      ui.fail(`Unknown option: ${arg}`);
      process.exit(1);
    } else opts._.push(arg);
  }
  return opts;
}

function validate(name, value, allowed) {
  if (value === undefined) return;
  if (!allowed.includes(value)) {
    ui.fail(`Invalid --${name} "${value}". Expected one of: ${allowed.join(", ")}.`);
    process.exit(1);
  }
}

async function prompt(question, fallback) {
  if (!process.stdin.isTTY) return fallback;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(`${question} `)).trim();
    return answer || fallback;
  } finally {
    rl.close();
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) return void ui.info(HELP);
  if (opts.version) {
    const pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"), "utf8"));
    return void ui.info(pkg.version);
  }

  validate("agent", opts.agent, AGENTS);
  validate("pm", opts.pm, PACKAGE_MANAGERS);
  validate("framework", opts.framework, ["next"]);

  const pm = opts.pm ?? detectPackageManager();
  const interactive = process.stdin.isTTY && !opts.yes;

  if (opts._[0] === "doctor") {
    const agent = opts.agent ?? "claude-code";
    process.exitCode = await doctor({ pm, agent, fix: Boolean(opts.fix) });
    return;
  }

  let dir = opts._[0];
  if (!dir) dir = interactive ? await prompt("Project directory?", "my-app") : "my-app";

  let agent = opts.agent;
  if (!agent) {
    agent = interactive
      ? await prompt(`Coding agent to set up? (${AGENTS.join("/")}) [claude-code]`, "claude-code")
      : "claude-code";
    validate("agent", agent, AGENTS);
  }

  process.exitCode = await scaffold({ dir, pm, agent, framework: opts.framework ?? "next" });
}

main().catch((error) => {
  ui.fail(error?.stack ?? String(error));
  process.exit(1);
});
