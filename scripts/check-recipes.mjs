// Gate for the docs recipes (apps/docs/src/recipes/<category>/<slug>/).
//
// An recipe is a folder that people copy, so the folder is the contract:
//   1. the four files are present: Recipe.tsx, recipe.css, meta.ts,
//      recipe.test.tsx;
//   2. Recipe.tsx imports only "@loamui/core", "react" and "./recipe.css",
//      and default-exports a component;
//   3. meta.uses names exactly the @loamui/core components Recipe.tsx
//      imports (cx and renderWithProps are plumbing, not components);
//   4. meta.category is the folder, and the folder's category is listed in
//      categories.ts;
//   5. Recipe.tsx carries "use client" when it uses client hooks or passes
//      a function as a prop. Named core parts and useId can be composed from
//      synchronous server components;
//   6. recipe.css has no rule outside a `@scope (.<slug>…) to
//      ([class*="loam-"])` block, and its root class is the slug: the donut
//      is the one rule of composing, and every scope must start at the
//      recipe's own root;
//   7. no raw colours in recipe.css (tokens only) and no lorem ipsum.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "apps", "docs", "src", "recipes");
const REQUIRED = ["Recipe.tsx", "recipe.css", "meta.ts", "recipe.test.tsx"];
const ALLOWED_IMPORTS = new Set(["@loamui/core", "react", "./recipe.css"]);
const PLUMBING = new Set(["cx", "renderWithProps"]);

const failures = [];
const fail = (dir, msg) => failures.push(`${relative(ROOT, dir)}: ${msg}`);

const categoriesSrc = readFileSync(join(DIR, "categories.ts"), "utf8");
const listed = new Set([...categoriesSrc.matchAll(/\bslug:\s*"([^"]+)"/g)].map((m) => m[1]));

/** Strip comments so braces and at-rules can be scanned. */
function stripCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Top-level statements of a stylesheet: [prelude, body] for each block, or a bare declaration. */
function topLevel(css) {
  const out = [];
  let depth = 0,
    start = 0;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === '"' || ch === "'") {
      // Skip a string literal: a brace inside `content: "{"` is not a block.
      for (i++; i < css.length && css[i] !== ch; i++) if (css[i] === "\\") i++;
    } else if (ch === "{") {
      if (depth === 0) out.push({ prelude: css.slice(start, i).trim(), at: i });
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) start = i + 1;
    } else if (ch === ";" && depth === 0) {
      const stray = css.slice(start, i).trim();
      if (stray) out.push({ prelude: stray, stray: true });
      start = i + 1;
    }
  }
  const tail = css.slice(start).trim();
  if (tail) out.push({ prelude: tail, stray: true });
  return out;
}

let count = 0;
for (const category of readdirSync(DIR)) {
  const categoryDir = join(DIR, category);
  if (!statSync(categoryDir).isDirectory()) continue;
  // build-recipes writes its output here; it is not a category.
  if (category === "generated") continue;
  if (!listed.has(category)) fail(categoryDir, "folder is not listed in categories.ts");
  for (const slug of readdirSync(categoryDir)) {
    const dir = join(categoryDir, slug);
    if (!statSync(dir).isDirectory()) continue;
    count++;
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(slug)) fail(dir, "folder name must be kebab-case");

    // 1. files
    const missing = REQUIRED.filter((f) => !existsSync(join(dir, f)));
    if (missing.length) {
      fail(dir, `missing ${missing.join(", ")}`);
      continue;
    }
    const tsx = readFileSync(join(dir, "Recipe.tsx"), "utf8");
    const css = readFileSync(join(dir, "recipe.css"), "utf8");
    const meta = readFileSync(join(dir, "meta.ts"), "utf8");

    // 2. imports
    const imports = [
      ...tsx.matchAll(/^import\s+(type\s+)?(?:([\s\S]*?)\s+from\s+)?["']([^"']+)["'];?/gm),
    ];
    const coreNames = new Set();
    for (const [, typeOnly, clause, from] of imports) {
      if (!ALLOWED_IMPORTS.has(from))
        fail(
          dir,
          `Recipe.tsx imports "${from}"; only @loamui/core, react and ./recipe.css are allowed`,
        );
      if (from === "@loamui/core" && clause && !typeOnly) {
        const named = clause.match(/\{([\s\S]*)\}/)?.[1] ?? "";
        for (const part of named.split(",")) {
          const name = part
            .trim()
            .replace(/^type\s+/, "")
            .split(/\s+as\s+/)[0];
          if (name && !part.trim().startsWith("type ") && !PLUMBING.has(name)) coreNames.add(name);
        }
        if (!clause.includes("{"))
          fail(dir, "Recipe.tsx must import @loamui/core by named exports");
      }
    }
    if (!imports.some((m) => m[3] === "./recipe.css"))
      fail(dir, 'Recipe.tsx must import "./recipe.css"');
    if (!/^export default function Recipe\b/m.test(tsx))
      fail(dir, "Recipe.tsx must `export default function Recipe`");
    if (!tsx.includes(`className="${slug}"`))
      fail(dir, `Recipe.tsx must put className="${slug}" on its root element`);
    if (/lorem ipsum/i.test(tsx))
      fail(dir, "Recipe.tsx has placeholder copy (lorem ipsum); write real Hedgerow content");

    // 3. meta.uses
    const usesSrc = meta.match(/\buses:\s*\[([^\]]*)\]/);
    if (!usesSrc) fail(dir, "meta.ts must declare `uses: [...]`");
    const uses = new Set(
      (usesSrc?.[1] ?? "")
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean),
    );
    for (const name of coreNames)
      if (!uses.has(name))
        fail(dir, `meta.uses is missing "${name}", which Recipe.tsx imports from @loamui/core`);
    for (const name of uses)
      if (!coreNames.has(name))
        fail(dir, `meta.uses names "${name}", which Recipe.tsx does not import from @loamui/core`);

    // 4. meta.category
    const metaCategory = meta.match(/\bcategory:\s*"([^"]+)"/)?.[1];
    if (metaCategory !== category)
      fail(dir, `meta.category is "${metaCategory}" but the folder is "${category}"`);
    for (const field of ["title", "description"]) {
      if (!new RegExp(`\\b${field}:\\s*["'\`]`).test(meta))
        fail(dir, `meta.ts must declare \`${field}\``);
    }

    // 5. "use client" where the module needs it
    const isClient = /^\s*["']use client["'];?/m.test(tsx);
    const body = tsx.replace(/^import[\s\S]*?["'][^"']+["'];?$/gm, "");
    // Recipes default-export synchronous functions. useId is available in
    // React's server runtime; conservatively require a boundary for other hooks.
    const hooks = /\buse(?!Id\b)[A-Z]\w*\s*\(/.test(body);
    // A function written into a prop (an event handler, a labels callback)
    // cannot cross from a server module into a client component; Next
    // refuses the page at build time. Arrow functions inside `.map(` calls
    // run on the server and are fine, so only prop values are checked.
    const fnProp = /\b(?:on[A-Z]\w*|labels)=\{\{?[^}]*=>/.test(body);
    if ((hooks || fnProp) && !isClient) {
      const why = hooks ? "hooks" : "a function passed as a prop (a handler or a labels callback)";
      fail(dir, `Recipe.tsx needs "use client": it uses ${why}`);
    }

    // 6. every rule inside the donut, rooted at the slug
    const scopeRe = new RegExp(
      `^@scope\\s*\\(\\.${slug}(?:[\\s>+~.:[#][^)]*)?\\)\\s*to\\s*\\(\\[class\\*="loam-"\\]\\)$`,
    );
    for (const stmt of topLevel(stripCss(css))) {
      if (stmt.stray)
        fail(
          dir,
          `recipe.css has a declaration outside any block: "${stmt.prelude.slice(0, 40)}"`,
        );
      else if (!scopeRe.test(stmt.prelude.replace(/\s+/g, " "))) {
        fail(
          dir,
          `recipe.css rule "${stmt.prelude.slice(0, 60)}" is not inside \`@scope (.${slug}…) to ([class*="loam-"])\``,
        );
      }
    }

    // 7. tokens only
    const colour = stripCss(css).match(
      /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/i,
    );
    if (colour)
      fail(dir, `recipe.css has a raw colour (${colour[0]}); use the --loam-color-* tokens`);
  }
}

if (failures.length) {
  console.error(`check-recipes: ${failures.length} problem(s)\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`check-recipes: OK (${count} recipes, ${listed.size} categories)`);
