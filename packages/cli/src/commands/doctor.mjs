import { detectConflicts } from "../conflicts.mjs";
import { detectFramework } from "../frameworks.mjs";
import { preflight } from "../preflight.mjs";
import { steps } from "../steps.mjs";
import { ui } from "../ui.mjs";

/** Report LoamUI setup in the project at `cwd` without changing it. Exit 1 on any gap. */
export function doctor({ cwd, pm, agent }) {
  const problems = preflight(cwd);
  if (problems.length) {
    for (const problem of problems) ui.fail(problem);
    return 1;
  }

  const framework = detectFramework(cwd);
  ui.heading(`Checking LoamUI setup — ${framework.label}`);
  if (framework.reason) ui.warn(`${framework.reason} Checking what applies.`);

  const conflicts = detectConflicts(cwd, framework);
  if (conflicts.length) ui.heading("Conflicts");
  for (const conflict of conflicts) {
    ui.fail(conflict.title);
    ui.dim(`  ${conflict.detail}`);
    if (conflict.fix) ui.dim("  `loamui init` resolves this.");
  }

  ui.heading("Checks");
  let gaps = 0;
  for (const step of steps({ pm, agent, framework })) {
    if (step.check(cwd)) {
      ui.ok(step.title);
      continue;
    }
    gaps++;
    if (step.wiring && conflicts.length) ui.warn(`${step.title} — held back by the conflict above`);
    else if (step.fix) ui.fail(step.title);
    else ui.fail(`${step.title} — ${step.manual(cwd)}`);
  }

  ui.heading("Result");
  if (!gaps && !conflicts.length) {
    ui.ok("LoamUI setup is complete.");
    return 0;
  }
  ui.info(
    "Run `loamui init` to complete the setup; `loamui init --dry-run` shows what it would do.",
  );
  return 1;
}
