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

/** The first existing candidate, or the first candidate when none exists yet. */
function firstExisting(cwd, candidates) {
  return candidates.find((file) => existsSync(join(cwd, file))) ?? candidates[0];
}

function nextDescriptor(cwd) {
  const hasSrc = existsSync(join(cwd, "src", "app"));
  const appDir = hasSrc ? "src/app" : "app";
  const hasComponents = !hasSrc && existsSync(join(cwd, "components"));
  const roots = hasSrc ? ["src"] : hasComponents ? ["app", "components"] : ["app"];
  const layout = firstExisting(cwd, [`${appDir}/layout.tsx`, `${appDir}/layout.jsx`, `${appDir}/layout.js`]);
  return {
    id: "next",
    label: "Next.js App Router",
    layerFile: `${appDir}/globals.css`,
    // The layer file only takes effect once the root layout imports it.
    layerImport: { file: layout, specifier: "./globals.css" },
    autoWireLayer: true,
    // A layout is code; editing an arbitrary one to add the <link> safely is
    // out of scope, so it is reported (the scaffolder writes it for a fresh app).
    stylesheet: { mode: "code", file: layout, docs: `${INSTALL_DOCS}/nextjs` },
    ...cssPaths(roots),
  };
}

function unknownDescriptor(cwd, reason) {
  return {
    id: "unknown",
    label: "this project",
    reason,
    layerFile: null,
    layerImport: null,
    autoWireLayer: false,
    stylesheet: { mode: "manual", file: null, docs: INSTALL_DOCS },
    ...cssPaths([existsSync(join(cwd, "src")) ? "src" : "app"]),
  };
}

/** Detect the framework and the paths LoamUI setup depends on. */
export function detectFramework(cwd) {
  const pkg = readJson(join(cwd, "package.json")) ?? {};
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  if (deps.next) return nextDescriptor(cwd);

  if (deps["@tanstack/react-start"]) {
    return {
      id: "tanstack-start",
      label: "TanStack Start",
      layerFile: null,
      layerImport: null,
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
      layerImport: null,
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
      layerImport: {
        file: firstExisting(cwd, ["src/index.tsx", "src/index.jsx", "src/index.js"]),
        specifier: "./index.css",
      },
      autoWireLayer: true,
      stylesheet: { mode: "html", file: "public/index.html", docs: INSTALL_DOCS },
      ...cssPaths(["src"]),
    };
  }

  if (deps.vite) {
    // LoamUI is a React library; a Vite project without React is not a target.
    if (!deps.react) return unknownDescriptor(cwd, "This Vite project has no react dependency.");
    return {
      id: "vite",
      label: "Vite",
      layerFile: "src/index.css",
      layerImport: {
        file: firstExisting(cwd, ["src/main.tsx", "src/main.jsx", "src/main.ts", "src/main.js"]),
        specifier: "./index.css",
      },
      autoWireLayer: true,
      stylesheet: { mode: "html", file: "index.html", docs: INSTALL_DOCS },
      ...cssPaths(["src"]),
    };
  }

  return unknownDescriptor(cwd);
}
