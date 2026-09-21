import assert from "node:assert/strict";
import { readFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const external = ["react", "react-dom", "react/jsx-runtime"];
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));

async function bundle(contents, options = {}) {
  return build({
    stdin: { contents, resolveDir: root, sourcefile: "consumer.js" },
    // Pin esbuild's working directory so the metafile's relative output paths
    // mean the same thing wherever the test is run from. Without it the paths
    // resolve against process.cwd(), and running from the repo root instead of
    // the package silently breaks the lookup below.
    absWorkingDir: root,
    bundle: true,
    format: "esm",
    minify: true,
    treeShaking: true,
    external,
    write: false,
    logLevel: "silent",
    ...options,
  });
}

test("every public component entry point resolves to the root's named exports", async () => {
  const main = await import("@loamui/core");
  for (const [subpath, entry] of Object.entries(pkg.exports)) {
    if (subpath === "." || typeof entry === "string") continue;
    const exports = await import(`@loamui/core/${subpath.slice(2)}`);
    assert.ok(Object.keys(exports).length, `${subpath} has runtime exports`);
    for (const [name, value] of Object.entries(exports)) {
      assert.equal(main[name], value, `${subpath}: ${name} matches the root export`);
    }
    await readFile(join(root, entry.types), "utf8");
  }
  // Two shapes, and no hybrids.
  //
  // A component with parts is a namespace, and you build it from those parts:
  // there is no one-invocation shortcut past them, because asking consumers to
  // compose IS the composition model. Each part is its own module, so it keeps
  // its own client reference and shakes on its own. A component with no parts
  // worth exposing is a plain callable export, with no `.Root` standing between
  // a consumer and a tag that says nothing more than the tag does.
  //
  // A part is worth exposing when it renders something you could not otherwise
  // get. That is the whole test, and it is why Checkbox and Radio have none:
  // with no label they already ARE the bare control, and the tick is painted in
  // CSS, so there is no indicator element to hand out.
  const NAMESPACES = [
    "Alert", "Avatar", "Badge", "Breadcrumbs", "Carousel", "Combobox", "DateInput",
    "Details", "Drawer", "ErrorSummary", "Field", "Fieldset", "FileInput", "Menu",
    "Modal", "Nav", "Pagination", "Popover", "RadioGroup", "Range", "Search",
    "SegmentedControl", "Select", "Stepper", "Switch", "Table", "Tabs", "Toast", "Tooltip",
  ];
  const CALLABLE = [
    "Button", "Card", "Checkbox", "CopyButton", "Input", "Loader", "Meter",
    "PasswordInput", "Price", "Progress", "QuantityInput", "Radio", "Rating",
    "Separator", "SignpostLink", "Skeleton", "SkipLink", "Textarea",
    "Time", "Toasts", "VisuallyHidden",
  ];

  // Every exported component is in exactly one bucket: the rule is the whole
  // surface, not a sample of it.
  const components = Object.entries(main)
    .filter(([k, v]) => /^[A-Z]/.test(k) && (typeof v === "function" || (v && typeof v === "object" && v.Root)))
    .map(([k]) => k);
  assert.deepEqual(
    components.sort(),
    [...NAMESPACES, ...CALLABLE].sort(),
    "every component is classified, and nothing ships unclassified",
  );

  for (const name of NAMESPACES) {
    assert.equal(typeof main[name], "object", `${name} is a namespace of parts`);
    assert.equal(typeof main[name].Root, "function", `${name}.Root is the root part`);
    assert.notEqual(typeof main[name], "function", `${name} offers no callable shortcut`);
  }

  for (const name of CALLABLE) {
    assert.equal(typeof main[name], "function", `${name} is callable`);
    assert.equal(main[name].Root, undefined, `${name} has no parts, so no Root`);
  }

  // No part survives that only renamed what the component already renders.
  assert.equal(main.Checkbox.Control, undefined, "Checkbox with no label is the bare control");
  assert.equal(main.Radio.Control, undefined, "Radio with no label is the bare control");
  assert.equal(main.Badge.Dot, undefined, "a status dot is an icon child, not a part");
  // Badge's label is a part, so what sits beside it is composed on one side.
  assert.equal(typeof main.Badge.Text, "function", "Badge.Text holds the label");

  // Anatomy completeness: a namespace exposes every element its scope styles,
  // so the library never ships a component for half a table. `check:anatomy`
  // gates this against the stylesheets; these pin the two that were partial.
  for (const part of ["Caption", "Thead", "Tbody", "Tfoot", "Tr", "Th", "Td"]) {
    assert.equal(typeof main.Table[part], "function", `Table.${part} is a part`);
  }
  for (const part of ["Option", "OptGroup"]) {
    assert.equal(typeof main.Select[part], "function", `Select.${part} is a part`);
  }

  for (const name of ["ModalRoot", "TabsTab", "FieldDescription", "RadioGroupRoot", "RadioGroupLegend"]) {
    assert.equal(main[name], undefined, `${name} is not a second way to say ${name}`);
  }
});

test("namespace members eliminate unrelated component families", async () => {
  for (const [namespace, part] of [
    ["Field", "Description"],
    ["Tabs", "Tab"],
  ]) {
    const result = await bundle(
      `import { ${namespace} } from "@loamui/core"; export const Used = ${namespace}.${part};`,
    );
    const code = result.outputFiles[0].text;
    assert.doesNotMatch(code, /loam-(?:Checkbox|DateInput|Table|Modal|Range)/);
    assert.ok(Buffer.byteLength(code) < 8192, `${namespace}.${part} stays below 8 KiB`);
  }
});

test("static modules stay server-compatible and interactive modules keep client directives", async () => {
  for (const file of [
    "index",
    "components/Separator/Separator",
    "components/Button/Button",
    "components/Alert/Alert",
    "components/Details/Details",
  ]) {
    const source = await readFile(join(root, `dist/${file}.js`), "utf8");
    assert.doesNotMatch(source, /^["']use client["']/);
  }
  for (const file of [
    "components/Modal/Modal",
    "components/Field/Field",
    "components/Alert/AlertClose",
    "naming",
  ]) {
    const source = await readFile(join(root, `dist/${file}.js`), "utf8");
    assert.match(source, /^["']use client["']/);
  }
});

test("a single component import eliminates unrelated components", async () => {
  for (const [name, limit] of [
    ["Separator", 1024],
    ["Button", 4096],
    // Callable Alert composes its own Close, which is a Button: the price of
    // the one-tag form, and the reason the limit is not Separator's.
    ["Alert", 3584],
  ]) {
    const result = await bundle(`export { ${name} } from "@loamui/core";`);
    const code = result.outputFiles[0].text;
    assert.doesNotMatch(code, /loam-(?:Checkbox|DateInput|Table|Modal|Range)/);
    assert.ok(
      Buffer.byteLength(code) < limit,
      `${name}: ${Buffer.byteLength(code)} bytes exceeds ${limit}`,
    );
  }
});

test("component entry points keep modal code out of eager chunks", async () => {
  const dir = await mkdtemp(join(tmpdir(), "loamui-package-"));
  try {
    // The fixture resolves the workspace package through its public export map.
    const lazy = join(dir, "modal.js");
    await writeFile(
      lazy,
      `import { jsx } from "react/jsx-runtime";
import { Modal } from "@loamui/core/modal";
export default function DeferredModal() {
  return jsx(Modal.Root, { children: jsx(Modal.Popup, { children: "Deferred content" }) });
}`,
    );
    const result = await bundle(
      `export { Separator } from "@loamui/core/separator"; export const loadModal = () => import(${JSON.stringify(lazy)});`,
      {
        splitting: true,
        outdir: join(dir, "out"),
        metafile: true,
        plugins: [
          {
            name: "fixture-package-resolution",
            setup(build) {
              build.onResolve({ filter: /^@loamui\/core(?:\/.*)?$/ }, ({ path }) => {
                const subpath =
                  path === "@loamui/core" ? "." : `.${path.slice("@loamui/core".length)}`;
                return { path: resolve(root, pkg.exports[subpath].import) };
              });
            },
          },
        ],
      },
    );
    const outputs = new Map(result.outputFiles.map((file) => [file.path, file.text]));
    const metadata = new Map(
      Object.entries(result.metafile.outputs).map(([file, meta]) => [resolve(root, file), meta]),
    );
    const entry = [...metadata].find(([, meta]) => meta.entryPoint === "consumer.js");
    assert.ok(entry, "consumer entry exists");
    const eager = new Set();
    function visit(file) {
      if (eager.has(file)) return;
      eager.add(file);
      for (const dependency of metadata.get(file).imports) {
        if (!dependency.external && dependency.kind !== "dynamic-import")
          visit(resolve(root, dependency.path));
      }
    }
    visit(entry[0]);
    for (const file of eager) assert.doesNotMatch(outputs.get(file), /loam-Modal/);
    assert.ok(
      [...outputs].some(([file, code]) => !eager.has(file) && code.includes("loam-Modal")),
      "modal implementation is deferred",
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
