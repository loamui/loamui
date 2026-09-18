import { mkdirSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { run, ui } from "./util.mjs";
import { detectFramework } from "./frameworks.mjs";
import { CORE_STYLESHEET, steps } from "./setup.mjs";

const LAYOUT_TSX = `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoamUI App",
  description: "Built with LoamUI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="${CORE_STYLESHEET}" />
      </head>
      <body>{children}</body>
    </html>
  );
}
`;

const PAGE_TSX = `"use client";

import { Checkbox, Field, Input } from "@loamui/core";
import "./welcome.css";

export default function Welcome() {
  return (
    <main className="welcome">
      <h1>Welcome to LoamUI</h1>
      <p>Native HTML and components share the same foundation.</p>
      <Field.Root>
        <Field.Label>Your name</Field.Label>
        <Input name="name" autoComplete="name" />
      </Field.Root>
      <Checkbox label="Send me product updates" />
    </main>
  );
}
`;

const WELCOME_CSS = `@layer loamui.components {
  @scope (.welcome) to ([class*="loam-"]) {
    :scope {
      display: block grid;
      gap: var(--loam-space-l);
      max-inline-size: var(--loam-measure);
      padding: var(--loam-space-xl);
    }
  }
}
`;

function createNextApp(pm, dir) {
  const flags = ["--ts", "--app", "--empty", "--no-tailwind", "--no-src-dir"];
  switch (pm) {
    case "pnpm":
      return run("pnpm", ["create", "next-app@latest", dir, ...flags, "--use-pnpm", "--yes"]);
    case "yarn":
      return run("yarn", ["create", "next-app", dir, ...flags, "--use-yarn", "--yes"]);
    case "bun":
      return run("bun", ["create", "next-app@latest", dir, ...flags, "--use-bun", "--yes"]);
    default:
      return run("npx", ["create-next-app@latest", dir, ...flags, "--use-npm", "--yes"]);
  }
}

/** Scaffold a fresh LoamUI application. */
export async function scaffold({ dir, pm, agent, framework }) {
  if (framework !== "next") {
    ui.fail(`Framework "${framework}" is not supported yet. Use --framework next (TanStack Start is coming).`);
    return 1;
  }

  const target = resolve(process.cwd(), dir);
  const name = basename(target);

  ui.heading(`Creating a LoamUI + Next.js app in ${name}`);
  ui.step(`Scaffolding Next.js (${pm})`);
  if (!createNextApp(pm, dir).ok) {
    ui.fail("create-next-app failed. See the output above.");
    return 1;
  }

  ui.step("Writing the LoamUI foundation");
  const appDir = join(target, "app");
  mkdirSync(appDir, { recursive: true });
  writeFileSync(join(appDir, "layout.tsx"), LAYOUT_TSX);
  writeFileSync(join(appDir, "page.tsx"), PAGE_TSX);
  writeFileSync(join(appDir, "welcome.css"), WELCOME_CSS);

  const detected = detectFramework(target);
  const failures = [];
  for (const step of steps({ pm, agent, framework: detected })) {
    if (step.check(target)) {
      ui.ok(step.title);
      continue;
    }
    ui.step(step.title);
    if (step.fix?.(target)) ui.ok(step.title);
    else {
      ui.fail(step.title);
      failures.push(step);
    }
  }

  ui.heading("Verifying");
  const cssCheck = run(pm, ["run", "lint:css"], { cwd: target, quiet: true });
  ui[cssCheck.ok ? "ok" : "warn"](`lint:css ${cssCheck.ok ? "passed" : "reported findings"}`);
  const composition = run(pm, ["run", "check:composition"], { cwd: target, quiet: true });
  ui[composition.ok ? "ok" : "warn"](`check:composition ${composition.ok ? "passed" : "reported findings"}`);

  ui.heading(`Done — ${name} is ready`);
  if (dir !== ".") ui.info(`  cd ${dir}`);
  ui.info(`  ${pm} run dev`);
  if (agent !== "none") {
    ui.info("");
    ui.info(`Open ${agent} in this folder in a new session, confirm the loamui skill is listed,`);
    ui.info('then say: "Use the LoamUI skill to build a profile form."');
  }
  return failures.length ? 1 : 0;
}
