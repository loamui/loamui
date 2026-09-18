import { existsSync } from "node:fs";
import { join } from "node:path";
import { detectPackageManager, ui } from "./util.mjs";
import { detectFramework } from "./frameworks.mjs";
import { detectConflicts } from "./conflicts.mjs";
import { steps } from "./setup.mjs";

/** Verify (and with --fix, complete) LoamUI setup in the current project. */
export async function doctor({ pm, agent, fix }) {
  const cwd = process.cwd();

  if (!existsSync(join(cwd, "package.json"))) {
    ui.fail("No package.json here. Run this inside your application, or scaffold one with `create-loamui my-app`.");
    return 1;
  }

  const framework = detectFramework(cwd);
  const resolvedPm = pm ?? detectPackageManager();
  ui.heading(`Checking LoamUI setup — ${framework.label}${fix ? " (fixing gaps)" : ""}`);
  if (framework.id === "unknown")
    ui.warn("No supported framework detected. Checking what applies; wire the stylesheet by hand.");

  const conflicts = detectConflicts(cwd, framework);
  const blockWiring = conflicts.some((c) => c.severity === "blocking");
  if (conflicts.length) {
    ui.heading("Conflicts");
    for (const c of conflicts) {
      ui.fail(c.title);
      ui.dim(`  ${c.detail}`);
    }
    ui.warn("Cascade wiring (layer order and stylesheet link) is held back until this is resolved.");
    ui.heading("Checks");
  }

  const blocked = [];
  const missing = [];
  const manual = [];
  for (const step of steps({ pm: resolvedPm, agent, framework })) {
    if (step.check(cwd)) {
      ui.ok(step.title);
      continue;
    }
    if (step.wiring && blockWiring) {
      ui.warn(`${step.title} — held back by the conflict above`);
      blocked.push(step);
      continue;
    }
    if (!fix) {
      ui.fail(step.title);
      if (step.manual) manual.push(step.manual(cwd));
      else missing.push(step);
      continue;
    }
    if (step.fix?.(cwd) && step.check(cwd)) {
      ui.ok(`${step.title} — fixed`);
    } else if (step.manual) {
      manual.push(step.manual(cwd));
      ui.warn(`${step.title} — ${step.manual(cwd)}`);
    } else {
      ui.fail(`${step.title} — could not fix automatically`);
      missing.push(step);
    }
  }

  ui.heading("Result");
  if (!missing.length && !manual.length && !blocked.length) {
    ui.ok("LoamUI setup is complete.");
    if (agent !== "none")
      ui.dim("If the skill was just installed, open a new agent session so it is discovered.");
    return 0;
  }

  if (blocked.length)
    ui.info("Resolve the conflict above (your agent with the LoamUI skill can do this), then re-run.");
  if (!fix && (missing.length || manual.length))
    ui.info("Re-run with --fix to apply the additive fixes automatically.");
  for (const line of manual) ui.warn(line);
  return 1;
}
