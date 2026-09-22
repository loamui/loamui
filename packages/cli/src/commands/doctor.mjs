import { detectConflicts } from "../conflicts.mjs";
import { detectFramework } from "../frameworks.mjs";
import { preflight } from "../preflight.mjs";
import { driftedCopies, steps } from "../steps.mjs";
import { ui } from "../ui.mjs";

/** The state of LoamUI setup in the project at `cwd`, as data. */
export function inspect({ cwd, pm, agent }) {
  const problems = preflight(cwd);
  if (problems.length) return { complete: false, problems };

  const framework = detectFramework(cwd);
  const conflicts = detectConflicts(cwd, framework).map((c) => ({
    id: c.id,
    title: c.title,
    detail: c.detail,
    fixable: Boolean(c.fix),
  }));
  const checks = steps({ pm, agent, framework }).map((step) => {
    const ok = step.check(cwd);
    return {
      id: step.id,
      title: step.title,
      ok,
      heldBack: !ok && Boolean(step.wiring) && conflicts.length > 0,
      manual: !ok && !step.fix ? step.manual(cwd) : null,
    };
  });
  const drift = driftedCopies(cwd);
  return {
    complete: conflicts.length === 0 && checks.every((c) => c.ok),
    problems: [],
    framework: { id: framework.id, label: framework.label, reason: framework.reason ?? null },
    conflicts,
    checks,
    drift,
  };
}

/** Report LoamUI setup without changing it. Exit 1 on any gap; `--json` prints the report as data. */
export function doctor({ cwd, pm, agent, json = false }) {
  const report = inspect({ cwd, pm, agent });
  if (json) {
    ui.info(JSON.stringify(report, null, 2));
    return report.complete ? 0 : 1;
  }

  if (report.problems.length) {
    for (const problem of report.problems) ui.fail(problem);
    return 1;
  }

  ui.heading(`Checking LoamUI setup — ${report.framework.label}`);
  if (report.framework.reason) ui.warn(`${report.framework.reason} Checking what applies.`);

  if (report.conflicts.length) ui.heading("Conflicts");
  for (const conflict of report.conflicts) {
    ui.fail(conflict.title);
    ui.dim(`  ${conflict.detail}`);
    if (conflict.fixable) ui.dim("  `loamui init` resolves this.");
  }

  ui.heading("Checks");
  for (const check of report.checks) {
    if (check.ok) ui.ok(check.title);
    else if (check.heldBack) ui.warn(`${check.title} — held back by the conflict above`);
    else if (check.manual) ui.fail(`${check.title} — ${check.manual}`);
    else ui.fail(check.title);
  }

  if (report.drift.length) {
    ui.heading("Project copies");
    for (const file of report.drift)
      ui.warn(
        `${file} is not the copy this version of loamui installs; if you customised it, keep yours, and compare before updating.`,
      );
  }

  ui.heading("Result");
  if (report.complete) {
    ui.ok("LoamUI setup is complete.");
    return 0;
  }
  ui.info(
    "Run `loamui init` to complete the setup; `loamui init --dry-run` shows what it would do.",
  );
  return 1;
}
