import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { coreStylesheet, LAYER_DECLARATION } from "../steps.mjs";
import { ui } from "../ui.mjs";
import { addArgs, dlx, run } from "../util.mjs";
import { init } from "./init.mjs";

const WELCOME = `import { Checkbox, Field, Input } from "@loamui/core";
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

const nextLayout = (stylesheet) => `import type { Metadata } from "next";
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

const TANSTACK_INDEX = `import { createFileRoute } from "@tanstack/react-router";
import Welcome from "../components/Welcome";

export const Route = createFileRoute("/")({ component: Welcome });
`;

const VITE_APP = `import Welcome from "./components/Welcome";

export default function App() {
  return <Welcome />;
}
`;

const scaffolds = {
  next: {
    label: "Next.js",
    scaffold(pm, dir) {
      const flags = [dir, "--ts", "--app", "--empty", "--no-tailwind", "--no-src-dir", "--yes"];
      switch (pm) {
        case "pnpm":
          return run("pnpm", ["create", "next-app@latest", ...flags, "--use-pnpm"]);
        case "yarn":
          return run("yarn", ["create", "next-app", ...flags, "--use-yarn"]);
        case "bun":
          return run("bun", ["create", "next-app@latest", ...flags, "--use-bun"]);
        default:
          return run("npx", ["create-next-app@latest", ...flags, "--use-npm"]);
      }
    },
    // The scaffold has no globals.css and its layout has no <head>; both are
    // written whole, with the stylesheet link for the version just installed.
    foundation(target) {
      const app = join(target, "app");
      mkdirSync(app, { recursive: true });
      writeFileSync(join(app, "layout.tsx"), nextLayout(coreStylesheet(target)));
      writeFileSync(join(app, "page.tsx"), `"use client";\n\n${WELCOME}`);
      writeFileSync(join(app, "welcome.css"), WELCOME_CSS);
    },
  },
  "tanstack-start": {
    label: "TanStack Start",
    scaffold(pm, dir) {
      const [bin, args] = dlx(pm, [
        "@tanstack/cli@latest",
        "create",
        dir,
        "--blank",
        "--framework",
        "React",
        "--package-manager",
        pm,
        "-y",
      ]);
      return run(bin, args);
    },
    // The blank starter's styles.css is a reset; for a fresh app the layer
    // order is the whole file. init links the stylesheet from the root route.
    foundation(target) {
      const src = join(target, "src");
      mkdirSync(join(src, "components"), { recursive: true });
      writeFileSync(join(src, "styles.css"), `${LAYER_DECLARATION}\n`);
      writeFileSync(join(src, "components", "Welcome.tsx"), WELCOME);
      writeFileSync(join(src, "components", "welcome.css"), WELCOME_CSS);
      writeFileSync(join(src, "routes", "index.tsx"), TANSTACK_INDEX);
    },
  },
  vite: {
    label: "Vite + React",
    scaffold(pm, dir) {
      const template = ["--template", "react-ts"];
      switch (pm) {
        case "pnpm":
          return run("pnpm", ["create", "vite@latest", dir, ...template]);
        case "yarn":
          return run("yarn", ["create", "vite", dir, ...template]);
        case "bun":
          return run("bun", ["create", "vite", dir, ...template]);
        default:
          return run("npm", ["create", "vite@latest", dir, "--", ...template]);
      }
    },
    // The template's index.css is an unlayered reset, the thing init refuses
    // to wire over in an existing project; for a fresh app the layer order is
    // the whole file. main.tsx already imports it; init links the stylesheet
    // from index.html.
    foundation(target) {
      const src = join(target, "src");
      mkdirSync(join(src, "components"), { recursive: true });
      writeFileSync(join(src, "index.css"), `${LAYER_DECLARATION}\n`);
      writeFileSync(join(src, "components", "Welcome.tsx"), WELCOME);
      writeFileSync(join(src, "components", "welcome.css"), WELCOME_CSS);
      writeFileSync(join(src, "App.tsx"), VITE_APP);
      rmSync(join(src, "App.css"), { force: true });
    },
  },
};

/**
 * A new application with LoamUI set up: the framework's own scaffolder runs
 * first, then the foundation files are written and `init` completes the rest.
 */
export function create({ dir, pm, agent, framework }) {
  const kind = scaffolds[framework];
  const target = resolve(process.cwd(), dir);
  if (existsSync(target) && readdirSync(target).length) {
    ui.fail(`${dir} is not empty. Run \`loamui init\` inside an existing project instead.`);
    return 1;
  }

  ui.heading(`Creating a LoamUI + ${kind.label} app in ${basename(target)}`);
  if (!kind.scaffold(pm, dir).ok) {
    ui.fail(`Creating the ${kind.label} app failed; see the output above.`);
    return 1;
  }

  // The foundation links the stylesheet for the installed core version, so core goes in first.
  ui.step("Installing @loamui/core");
  if (!run(pm, addArgs(pm, ["@loamui/core"]), { cwd: target }).ok) {
    ui.fail("Installing @loamui/core failed; see the output above.");
    return 1;
  }
  kind.foundation(target);

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
