import { existsSync } from "node:fs";
import { join } from "node:path";
import { readJson } from "./util.mjs";

const TANSTACK_DOCS = "https://loamui.com/docs/installation/tanstack-start";
const INSTALL_DOCS = "https://loamui.com/docs/installation";

function cssPaths(roots) {
  return {
    cssRoots: roots,
    lintGlob: roots.length === 1 ? `${roots[0]}/**/*.css` : `{${roots.join(",")}}/**/*.css`,
    compositionArgs: roots.join(" "),
  };
}

function nextDescriptor(cwd) {
  const hasSrc = existsSync(join(cwd, "src", "app"));
  const appDir = hasSrc ? "src/app" : "app";
  const hasComponents = !hasSrc && existsSync(join(cwd, "components"));
  const roots = hasSrc ? ["src"] : hasComponents ? ["app", "components"] : ["app"];
  return {
    id: "next",
    label: "Next.js App Router",
    layerFile: `${appDir}/globals.css`,
    autoWireLayer: true,
    // A layout is code; editing an arbitrary one safely is out of scope, so the
    // link is reported (the scaffolder writes it for a fresh app).
    stylesheet: { mode: "code", file: `${appDir}/layout.tsx`, docs: `${INSTALL_DOCS}/nextjs` },
    ...cssPaths(roots),
  };
}

/** Detect the framework and the paths LoamUI setup depends on. */
export function detectFramework(cwd) {
  const pkg = readJson(join(cwd, "package.json")) ?? {};
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const src = existsSync(join(cwd, "src"));

  if (deps.next) return nextDescriptor(cwd);

  if (deps["@tanstack/react-start"]) {
    return {
      id: "tanstack-start",
      label: "TanStack Start",
      layerFile: null,
      autoWireLayer: false,
      stylesheet: { mode: "manual", file: null, docs: TANSTACK_DOCS },
      ...cssPaths(["src"]),
    };
  }

  if (deps["@remix-run/react"] || deps["@remix-run/dev"]) {
    return {
      id: "remix",
      label: "Remix",
      layerFile: null,
      autoWireLayer: false,
      stylesheet: { mode: "manual", file: "app/root.tsx", docs: INSTALL_DOCS },
      ...cssPaths(["app"]),
    };
  }

  if (deps["react-scripts"]) {
    return {
      id: "cra",
      label: "Create React App",
      layerFile: "src/index.css",
      autoWireLayer: true,
      stylesheet: { mode: "html", file: "public/index.html", docs: INSTALL_DOCS },
      ...cssPaths(["src"]),
    };
  }

  if (deps.vite) {
    return {
      id: "vite",
      label: "Vite",
      layerFile: "src/index.css",
      autoWireLayer: true,
      stylesheet: { mode: "html", file: "index.html", docs: INSTALL_DOCS },
      ...cssPaths(["src"]),
    };
  }

  return {
    id: "unknown",
    label: "this project",
    layerFile: null,
    autoWireLayer: false,
    stylesheet: { mode: "manual", file: null, docs: INSTALL_DOCS },
    ...cssPaths([src ? "src" : "app"]),
  };
}
