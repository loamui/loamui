import { detectConflicts } from "../conflicts.mjs";
import { detectFramework } from "../frameworks.mjs";
import { preflight } from "../preflight.mjs";
import { steps } from "../steps.mjs";
import { ui } from "../ui.mjs";

/**
 * Complete LoamUI setup in the project at `cwd`, additively: nothing that
 * exists is replaced, and running it again changes nothing. With `dryRun`
 * it prints what it would do and touches nothing.
 */
export function init({ cwd, pm, agent, dryRun = false }) {
  const problems = preflight(cwd);
  if (problems.length) {
    for (const problem of problems) ui.fail(problem);
    return 1;
  }

  const framework = detectFramework(cwd);
  ui.heading(`${dryRun ? "Planning" : "Setting up"} LoamUI — ${framework.label}`);
  if (framework.reason) ui.warn(`${framework.reason} The stylesheet needs wiring by hand.`);

  let blocked = false;
  const conflicts = detectConflicts(cwd, framework);
  if (conflicts.length) ui.heading("Conflicts");
  for (const conflict of conflicts) {
    if (conflict.fix && dryRun) {
      ui.step(`${conflict.title} — would ${conflict.describe}`);
    } else if (conflict.fix && conflict.fix(cwd)) {
      ui.ok(`${conflict.title} — resolved: ${conflict.describe}`);
    } else {
      ui.fail(conflict.title);
      ui.dim(`  ${conflict.detail}`);
      blocked = true;
    }
  }
  if (blocked)
    ui.warn(
      "The cascade wiring (layer order and stylesheet link) is held back until this is resolved.",
    );

  ui.heading("Setup");
  const held = [];
  const manual = [];
  const failed = [];
  for (const step of steps({ pm, agent, framework })) {
    if (step.check(cwd)) {
      ui.ok(step.title);
      continue;
    }
    if (step.wiring && blocked) {
      ui.warn(`${step.title} — held back`);
      held.push(step);
      continue;
    }
    if (dryRun) {
      if (step.fix) ui.step(`${step.title} — would ${step.describe(cwd)}`);
      else {
        ui.warn(`${step.title} — by hand: ${step.manual(cwd)}`);
        manual.push(step.manual(cwd));
      }
      continue;
    }
    const done = Boolean(step.fix?.(cwd)) && step.check(cwd);
    if (done) ui.ok(`${step.title} — done`);
    else if (step.manual) {
      ui.warn(`${step.title} — by hand: ${step.manual(cwd)}`);
      manual.push(step.manual(cwd));
    } else {
      ui.fail(`${step.title} — could not be completed`);
      failed.push(step);
    }
  }

  ui.heading("Result");
  if (dryRun) {
    ui.info("Nothing was changed. Run `loamui init` to apply.");
    for (const line of manual) ui.warn(`By hand: ${line}`);
    return blocked || failed.length ? 1 : 0;
  }
  if (!held.length && !manual.length && !failed.length) {
    ui.ok("LoamUI setup is complete.");
    if (agent !== "none")
      ui.dim("Open a new agent session in this project so the skills are discovered.");
    return 0;
  }
  if (held.length) ui.info("Resolve the conflict above, then run `loamui init` again.");
  for (const line of manual) ui.warn(line);
  if (failed.length)
    ui.info("See the output above for what could not be completed, then run `loamui init` again.");
  return 1;
}
