import { existsSync } from "node:fs";
import { join } from "node:path";
import { dependencies } from "./util.mjs";

const INSTALL_DOCS = "https://loamui.com/docs/installation";

function cssPaths(roots) {
  return {
    cssRoots: roots,
    lintGlob: roots.length === 1 ? `${roots[0]}/**/*.css` : `{${roots.join(",")}}/**/*.css`,
    compositionArgs: roots.join(" "),
  };
}

/** The first candidate that exists, or the first candidate when none does yet. */
function firstExisting(cwd, candidates) {
  return candidates.find((file) => existsSync(join(cwd, file))) ?? candidates[0];
}

function next(cwd) {
  const hasSrc = existsSync(join(cwd, "src", "app"));
  const appDir = hasSrc ? "src/app" : "app";
  const hasComponents = !hasSrc && existsSync(join(cwd, "components"));
  const roots = hasSrc ? ["src"] : hasComponents ? ["app", "components"] : ["app"];
  const layout = firstExisting(cwd, [
    `${appDir}/layout.tsx`,
    `${appDir}/layout.jsx`,
    `${appDir}/layout.js`,
  ]);
  return {
    id: "next",
    label: "Next.js App Router",
    layerFile: `${appDir}/globals.css`,
    layerImport: { file: layout, specifier: "./globals.css" },
    autoWireLayer: true,
    // The link goes into an existing <head>, or a new one before <body>; any other layout is theirs to edit.
    stylesheet: { mode: "code", file: layout, docs: `${INSTALL_DOCS}/nextjs` },
    ...cssPaths(roots),
  };
}

function vite(cwd) {
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

function guided(id, label, docs, roots, file = null) {
  return {
    id,
    label,
    layerFile: null,
    layerImport: null,
    autoWireLayer: false,
    stylesheet: { mode: "manual", file, docs },
    ...cssPaths(roots),
  };
}

/** Detect the framework and the paths LoamUI setup depends on. */
export function detectFramework(cwd) {
  const deps = dependencies(cwd);
  if (deps.next) return next(cwd);
  if (deps["@tanstack/react-start"])
    return guided("tanstack-start", "TanStack Start", `${INSTALL_DOCS}/tanstack-start`, ["src"]);
  if (deps["@remix-run/react"] || deps["@remix-run/dev"])
    return guided("remix", "Remix", INSTALL_DOCS, ["app"], "app/root.tsx");
  if (deps.vite) return vite(cwd);
  return {
    ...guided("unknown", "this project", INSTALL_DOCS, [
      existsSync(join(cwd, "src")) ? "src" : "app",
    ]),
    reason: "No supported framework detected.",
  };
}
