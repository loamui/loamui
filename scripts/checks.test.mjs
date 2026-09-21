import { test } from "node:test";
import assert from "node:assert/strict";
import { bypassesScale, checkedFiles, spacingFindings } from "./check-spacing.mjs";
import { nakedScopes, proseBoundaryFindings } from "./check-scope.mjs";
import { extractSiteProse } from "./check-site-prose.mjs";

test("spacing catches nested CSS, column gaps and var fallbacks", () => {
  assert.equal(
    spacingFindings(
      "@scope (.card) { @layer ui { :scope { column-gap: var(--gap, 12px); } }}",
      "example.css",
    ).length,
    1,
  );
  assert.equal(bypassesScale("min(1rem, 4cqi)"), true);
  assert.equal(bypassesScale("var(--loam-space-s)"), false);
  assert.equal(bypassesScale("clamp(1rem, 2cqi, 2rem)"), false);
  assert.equal(bypassesScale("calc(1rem + 2cqi) 8px"), true);
  assert.equal(bypassesScale("-1px"), false);
});

test("spacing inspects React objects, not copied code strings", () => {
  assert.equal(
    spacingFindings(
      'const style = { columnGap: 12 }; const view = <div style={{ marginBlock: "1rem" }}/>;',
      "demo.tsx",
    ).length,
    2,
  );
  assert.equal(spacingFindings('const code = `gap: "1rem"`;', "demo.tsx").length, 0);
  assert.ok(checkedFiles().some((file) => file.endsWith("/heroes/hero-with-image/recipe.css")));
  assert.ok(!checkedFiles().some((file) => file.endsWith("/forms/sign-up/recipe.css")));
});

test("scope inspection finds nested type rules independently of indentation", () => {
  assert.equal(
    nakedScopes("@scope (.host) { @layer ui { :scope { h2 {color: red} } } }").length,
    1,
  );
  assert.equal(
    nakedScopes('@scope (.host) to (.preview, [class*="loam-"]) { h2 {color: red} }').length,
    0,
  );
  assert.equal(nakedScopes("@scope (.host) { @keyframes fade { from {opacity:0} } }").length, 0);
});

test("site prose includes rendered copy and joins inline markup, excluding code", () => {
  const prose = extractSiteProse(
    'const title = "A useful page title"; const code = "This is a code example"; const page = <p>Build with <strong>the native platform</strong>.</p>;',
  );
  assert.match(prose, /A useful page title/);
  assert.match(prose, /Build with the native platform\./);
  assert.doesNotMatch(
    extractSiteProse('const demo = { code: "This is a code example" };'),
    /code example/,
  );
});

test("article styles protect embedded recipes as well as core roots", () => {
  assert.equal(proseBoundaryFindings("@scope (.site-prose) { ul {display:flex} }").length, 2);
  assert.equal(
    proseBoundaryFindings(
      '@layer loamui.ui { @scope (.site-prose) to (.block, [class*="loam-"]) { ul {display:flex} } }',
    ).length,
    0,
  );
});

test("consumer Stylelint config resolves installed tokens and rejects CSS regressions", async (t) => {
  const { mkdtemp, mkdir, copyFile, symlink, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const { createRequire } = await import("node:module");
  const { default: stylelint } = await import("stylelint");
  const require = createRequire(import.meta.url);
  const root = fileURLToPath(new URL("..", import.meta.url));
  const project = await mkdtemp(join(tmpdir(), "loam-consumer-lint-"));
  t.after(() => rm(project, { recursive: true, force: true }));
  await mkdir(join(project, "node_modules", "@loamui"), { recursive: true });
  await symlink(join(root, "packages/core"), join(project, "node_modules/@loamui/core"), "dir");
  for (const name of [
    "stylelint-config-standard",
    "stylelint-config-modern",
    "stylelint-config-alphabetical-order",
    "stylelint-use-nesting",
  ]) {
    // Resolve each installed package root, without assuming npm's directory layout.
    const { dirname } = await import("node:path");
    const { existsSync } = await import("node:fs");
    let directory = dirname(require.resolve(name));
    while (!existsSync(join(directory, "package.json"))) directory = dirname(directory);
    await symlink(directory, join(project, "node_modules", name), "dir");
  }
  for (const name of ["stylelint-base.mjs", "stylelint.config.mjs"])
    await copyFile(join(root, "skills/loamui/assets", name), join(project, name));

  const lint = (declarations) =>
    stylelint.lint({
      code: `@layer loamui.components {
      @scope (.recipe) to ([class*="loam-"]) {
        :scope {
          ${declarations}
        }
      }
    }`,
      codeFilename: join(project, "src/recipe.css"),
      configFile: join(project, "stylelint.config.mjs"),
    });
  const valid = await lint("display: block grid;\ngap: var(--loam-space-m);");
  assert.equal(
    valid.errored,
    false,
    JSON.stringify(valid.results.map((result) => result.warnings)),
  );
  for (const [declarations, rule] of [
    ["gap: var(--loam-space-does-not-exist);", "no-unknown-custom-properties"],
    ["margin-left: var(--loam-space-m);", "property-layout-mappings"],
    ["color: var(--loam-color-fg) !important;", "declaration-no-important"],
  ]) {
    const result = await lint(declarations);
    assert.ok(result.errored);
    assert.ok(
      result.results[0].warnings.some((warning) => warning.rule === rule),
      rule,
    );
  }
});

test("consumer checker uses its compiler API independently of the application's TypeScript", async (t) => {
  const { mkdtemp, mkdir, copyFile, symlink, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join, dirname } = await import("node:path");
  const { createRequire } = await import("node:module");
  const { spawnSync } = await import("node:child_process");
  const { existsSync } = await import("node:fs");
  const require = createRequire(import.meta.url);
  const project = await mkdtemp(join(tmpdir(), "loam-checker-compiler-"));
  t.after(() => rm(project, { recursive: true, force: true }));
  await mkdir(join(project, "node_modules/typescript"), { recursive: true });
  // TypeScript 7's root export has version information, not the old compiler API.
  await writeFile(
    join(project, "node_modules/typescript/package.json"),
    JSON.stringify({ name: "typescript", main: "index.cjs" }),
  );
  await writeFile(
    join(project, "node_modules/typescript/index.cjs"),
    'module.exports = { version: "7.0.2" };',
  );
  for (const name of ["postcss", "postcss-value-parser", "loamui-typescript"]) {
    let directory = dirname(require.resolve(name));
    while (!existsSync(join(directory, "package.json"))) directory = dirname(directory);
    await symlink(directory, join(project, "node_modules", name), "dir");
  }
  for (const name of ["check-composition.mjs", "scope-rules.mjs", "spacing-rules.mjs"])
    await copyFile(
      new URL(`../skills/loamui/assets/${name}`, import.meta.url),
      join(project, name),
    );
  const run = () =>
    spawnSync(process.execPath, ["check-composition.mjs", "example.tsx"], {
      cwd: project,
      encoding: "utf8",
    });
  await writeFile(
    join(project, "example.tsx"),
    'const view = <div style={{ gap: "var(--loam-space-s)" }} />;',
  );
  assert.equal(run().status, 0);
  await writeFile(join(project, "example.tsx"), 'const view = <div style={{ gap: "12px" }} />;');
  const failure = run();
  assert.equal(failure.status, 1);
  assert.match(failure.stderr, /gap: 12px bypasses spacing tokens/);
});
