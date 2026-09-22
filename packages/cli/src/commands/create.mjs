import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { coreStylesheet } from "../steps.mjs";
import { ui } from "../ui.mjs";
import { addArgs, run } from "../util.mjs";
import { init } from "./init.mjs";

const NEXT_FLAGS = ["--ts", "--app", "--empty", "--no-tailwind", "--no-src-dir"];

const layoutSource = (stylesheet) => `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoamUI App",
  description: "Built with LoamUI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="${stylesheet}" />
      </head>
      <body>{children}</body>
    </html>
  );
}
`;

const PAGE = `"use client";

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
      <Field.Item>
        <Field.Label>
          <Checkbox /> Send me product updates
        </Field.Label>
      </Field.Item>
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
  switch (pm) {
    case "pnpm":
      return run("pnpm", ["create", "next-app@latest", dir, ...NEXT_FLAGS, "--use-pnpm", "--yes"]);
    case "yarn":
      return run("yarn", ["create", "next-app", dir, ...NEXT_FLAGS, "--use-yarn", "--yes"]);
    case "bun":
      return run("bun", ["create", "next-app@latest", dir, ...NEXT_FLAGS, "--use-bun", "--yes"]);
    default:
      return run("npx", ["create-next-app@latest", dir, ...NEXT_FLAGS, "--use-npm", "--yes"]);
  }
}

/**
 * A new Next.js App Router application with LoamUI set up: the framework's
 * own scaffolder runs first, then the foundation files are written and
 * `init` completes the rest.
 */
export function create({ dir, pm, agent }) {
  const target = resolve(process.cwd(), dir);
  if (existsSync(target) && readdirSync(target).length) {
    ui.fail(`${dir} is not empty. Run \`loamui init\` inside an existing project instead.`);
    return 1;
  }

  ui.heading(`Creating a LoamUI + Next.js app in ${basename(target)}`);
  if (!createNextApp(pm, dir).ok) {
    ui.fail("create-next-app failed; see the output above.");
    return 1;
  }

  // The layout carries the stylesheet link for the installed core version,
  // so core goes in before the layout is written.
  ui.step("Installing @loamui/core");
  if (!run(pm, addArgs(pm, ["@loamui/core"]), { cwd: target }).ok) {
    ui.fail("Installing @loamui/core failed; see the output above.");
    return 1;
  }
  const app = join(target, "app");
  mkdirSync(app, { recursive: true });
  writeFileSync(join(app, "layout.tsx"), layoutSource(coreStylesheet(target)));
  writeFileSync(join(app, "page.tsx"), PAGE);
  writeFileSync(join(app, "welcome.css"), WELCOME_CSS);

  const status = init({ cwd: target, pm, agent });
  if (status !== 0) return status;

  ui.heading("Verifying");
  run(pm, ["run", "format"], { cwd: target, quiet: true });
  for (const script of ["lint:css", "lint:js", "check:composition", "format:check"]) {
    const result = run(pm, ["run", script], { cwd: target, quiet: true });
    ui[result.ok ? "ok" : "warn"](`${script} ${result.ok ? "passed" : "reported findings"}`);
  }

  ui.heading(`Done — ${basename(target)} is ready`);
  if (dir !== ".") ui.info(`  cd ${dir}`);
  ui.info(`  ${pm} run dev`);
  if (agent !== "none") {
    ui.info("");
    ui.info(`Open ${agent} in this folder in a new session, confirm the loamui skill is listed,`);
    ui.info('then say: "Use the LoamUI skill to build a profile form."');
  }
  return 0;
}
