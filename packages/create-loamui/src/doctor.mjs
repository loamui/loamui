import { existsSync } from "node:fs";
import { join } from "node:path";
import { detectPackageManager, projectLayout, readJson, run, ui } from "./util.mjs";
import { steps } from "./setup.mjs";

function detectFramework(cwd) {
  const pkg = readJson(join(cwd, "package.json")) ?? {};
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  if (all.next) return "next";
  if (all["@tanstack/react-start"]) return "tanstack-start";
  return null;
}

/** Verify (and with --fix, complete) LoamUI setup in the current project. */
export async function doctor({ pm, agent, fix }) {
  const cwd = process.cwd();

  if (!existsSync(join(cwd, "package.json"))) {
    ui.fail("No package.json here. Run this inside your application, or scaffold one with `create-loamui my-app`.");
    return 1;
  }

  const framework = detectFramework(cwd);
  if (framework !== "next") {
    ui.warn(
      framework === "tanstack-start"
        ? "TanStack Start setup verification is not automated yet; follow the docs at loamui.com/docs/installation/tanstack-start."
        : "No supported framework detected (expected Next.js). Checking what applies anyway.",
    );
  }

  const resolvedPm = pm ?? detectPackageManager();
  const layout = projectLayout(cwd);

  ui.heading(`Checking LoamUI setup${fix ? " (fixing gaps)" : ""}`);

  const missing = [];
  const manual = [];
  for (const step of steps({ pm: resolvedPm, agent, layout })) {
    if (step.check(cwd)) {
      ui.ok(step.title);
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
      ui.warn(`${step.title} — ${step.manual(cwd)}`);
      manual.push(step.manual(cwd));
    } else {
      ui.fail(`${step.title} — could not fix automatically`);
      missing.push(step);
    }
  }

  ui.heading("Result");
  if (!missing.length && !manual.length) {
    ui.ok("LoamUI setup is complete.");
    if (agent !== "none")
      ui.dim("If the skill was just installed, open a new agent session so it is discovered.");
    return 0;
  }

  if (!fix) {
    ui.info("Re-run with --fix to apply the additive fixes automatically.");
  }
  for (const line of manual) ui.warn(line);
  return missing.length || manual.length ? 1 : 0;
}
