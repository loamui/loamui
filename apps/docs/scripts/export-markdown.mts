// Generate public Markdown, offline skill references and search data from docs sources.
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  rmSync,
  renameSync,
  copyFileSync,
} from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { componentForExport, COMPONENTS, CATEGORY_ORDER } from "../src/site/nav.js";
import type { ComponentContent } from "../src/renderer/types.js";
import { RECIPE_CATEGORIES } from "../src/recipes/categories.js";
import { RECIPE_META } from "../src/recipes/generated/meta.js";
import { linkedRecipePrompt } from "../src/recipes/recipe-prompt.js";
import { PILLARS } from "../src/recipes/types.js";
import { mdxToMarkdown } from "./mdx-to-markdown.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = join(ROOT, "src", "app");
const PUBLIC = join(ROOT, "public");
// Links in llms.txt must be absolute: agents fetch it from anywhere and
// resolve the linked twins without a base URL.
const ORIGIN = process.env.SITE_ORIGIN ?? "https://loamui.com";
// The published `loamui` agent skill carries the same twins as offline
// references (skills/loamui/references/), regenerated here so they can't
// drift from the site. `check:skill` fails CI if the committed copy is stale.
const SKILL_REFS_FINAL = join(ROOT, "..", "..", "skills", "loamui", "references");
// Every twin is written to a staging directory and swapped in at the end,
// so a failure part-way leaves the committed references untouched instead
// of half-deleted. (A swallowed error once removed all 48 and reported
// success.)
const SKILL_REFS = SKILL_REFS_FINAL + ".staging";
const SETUP_ASSETS = [
  "stylelint-base.mjs",
  "stylelint.config.mjs",
  "check-composition.mjs",
  "scope-rules.mjs",
  "spacing-rules.mjs",
];

/**
 * The site search reads this: one entry per twin, with the twin's full prose,
 * so a phrase in a page's body finds the page. Title-only matching never did.
 */
const searchIndex: { url: string; title: string; description: string; text: string }[] = [];

function writeBoth(publicFile: string, refFile: string, md: string) {
  mkdirSync(dirname(publicFile), { recursive: true });
  writeFileSync(publicFile, md);
  mkdirSync(dirname(refFile), { recursive: true });
  writeFileSync(refFile, md);
  // Every twin opens with the same two frontmatter lines; the body follows
  // the preamble. Fences are indexed as-is: a prop or class name in a code
  // sample is exactly what a reader searches for.
  const front = /^---\ntitle: (.*)\ndescription: (.*)\n---\n/.exec(md);
  const url = "/" + relative(PUBLIC, publicFile).split("\\").join("/").replace(/\.md$/, "");
  searchIndex.push({
    url: url === "/docs" ? "/docs" : url,
    title: front?.[1] ?? "",
    description: front?.[2] ?? "",
    text: md
      .slice(front?.[0].length ?? 0)
      .replace(PREAMBLE, "")
      .replace(/\s+/g, " ")
      .trim(),
  });
}

const PREAMBLE = [
  "> LoamUI documentation, generated from the same source as the live page —",
  "> treat it as authoritative for `@loamui/core`.",
].join("\n");

const esc = (s: string) => s.replaceAll("|", "\\|").replaceAll("\n", " ");

function table(headers: string[], rows: string[][]): string {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map(esc).join(" | ")} |`),
  ].join("\n");
}

function propsTable(
  rows: { name: string; type?: string; default?: string; description?: string }[],
) {
  return table(
    ["Prop", "Type", "Default", "Description"],
    rows.map((r) => [
      `\`${r.name}\``,
      r.type ? `\`${r.type}\`` : "—",
      r.default ? `\`${r.default}\`` : "—",
      r.description ?? "",
    ]),
  );
}

function tokenTable(): string {
  const css = readFileSync(join(ROOT, "..", "..", "packages", "core", "src", "tokens.css"), "utf8");
  const end = css.indexOf("[data-theme=");
  const root = css.slice(css.indexOf(":root {"), end === -1 ? undefined : end);
  const rows: string[][] = [];
  for (const m of root.matchAll(/^\s*(--loam-[\w-]+):\s*([^;]+);/gms)) {
    rows.push([`\`${m[1]}\``, `\`${m[2]!.replace(/\s+/g, " ").trim()}\``]);
  }
  return table(["Token", "Value"], rows);
}

function writeGuideTwin(route: string, md: string) {
  const file = route === "/" ? join(PUBLIC, "index.md") : join(PUBLIC, route.slice(1) + ".md");
  const slug =
    route === "/" ? "index" : route === "/docs" ? "introduction" : route.split("/").at(-1)!;
  writeBoth(file, join(SKILL_REFS, "guides", `${slug}.md`), md);
}

function writeComponentTwin(slug: string, md: string) {
  writeBoth(
    join(PUBLIC, "docs", "components", `${slug}.md`),
    join(SKILL_REFS, "components", `${slug}.md`),
    md,
  );
}

// Start the staging directory from empty so removed pages don't linger.
rmSync(SKILL_REFS, { recursive: true, force: true });
// Every twin under these is regenerated below, so a page retired since the
// last export leaves no stale copy behind.
for (const directory of ["docs", "examples", "recipes"])
  rmSync(join(PUBLIC, directory), { recursive: true, force: true });

// ---- guides: page.mdx source → markdown --------------------------------

function* mdxFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* mdxFiles(p);
    else if (name === "page.mdx") yield p;
  }
}

const guides: { route: string; title: string; description: string }[] = [];
for (const file of mdxFiles(APP)) {
  const route0 = "/" + relative(APP, dirname(file)).split("\\").join("/");
  const route = route0 === "/." ? "/" : route0;
  const { body, title, description } = mdxToMarkdown(readFileSync(file, "utf8"), {
    path: file,
    componentCount: COMPONENTS.length,
    tokenTable,
  });
  const front = [
    "---",
    `title: ${title}`,
    `description: ${description}`,
    "---",
    "",
    PREAMBLE,
    "",
  ].join("\n");
  writeGuideTwin(route, `${front}\n${body}`);
  guides.push({ route, title, description });
}

// ---- component pages: registry data → markdown -------------------------

function componentMarkdown(doc: ComponentContent, name: string, description: string): string {
  const out: string[] = [];
  out.push("---", `title: ${name}`, `description: ${description}`, "---", "", PREAMBLE, "");
  out.push(`# ${name}`, "", doc.lead ?? description, "");
  out.push("## Import", "", "```tsx", doc.importLine, "```", "");

  out.push("## Usage", "");
  for (const demo of doc.demos) {
    out.push(`### ${demo.title}`, "");
    if (demo.description) out.push(demo.description, "");
    out.push("```tsx", demo.code, "```", "");
  }

  if (doc.whenToUse?.length)
    out.push("## When to use it", "", ...doc.whenToUse.map((b) => `- ${b}`), "");
  if (doc.whenNotToUse?.length)
    out.push("## When not to", "", ...doc.whenNotToUse.map((b) => `- ${b}`), "");

  if (doc.howItWorks?.length) {
    out.push("## How it works", "");
    for (const h of doc.howItWorks) {
      out.push(`### ${h.title}`, "", h.body, "");
      if (h.code) out.push("```tsx", h.code, "```", "");
    }
  }

  if (doc.accessibility?.length)
    out.push("## Accessibility", "", ...doc.accessibility.map((b) => `- ${b}`), "");

  if (doc.errors?.length) {
    out.push("## Error messages", "");
    out.push(
      table(
        ["Situation", "Message"],
        doc.errors.map((e) => [e.situation, `\`${e.message}\``]),
      ),
      "",
    );
  }

  if (doc.props?.length) {
    out.push("## Props", "");
    if (doc.contextual)
      out.push(
        "Status is not a prop: it comes from the surrounding `--loam-context` region (see the Contextualism guide).",
        "",
      );
    out.push(propsTable(doc.props), "");
  }

  if (doc.parts?.length) {
    out.push("## Parts", "");
    for (const part of doc.parts) {
      out.push(`### ${part.name}`, "", part.description, "");
      if (part.props?.length) out.push(propsTable(part.props), "");
    }
  }

  if (doc.cssProps?.length) {
    out.push("## Custom properties", "");
    out.push(
      table(
        ["Property", "Syntax", "Default", "Description"],
        doc.cssProps.map((p) => [
          `\`${p.name}\``,
          `\`${p.syntax}\``,
          p.default ? `\`${p.default}\`` : "—",
          p.description ?? "",
        ]),
      ),
      "",
    );
  }

  if (doc.hooks?.length) {
    out.push("## Hooks", "");
    for (const hook of doc.hooks) {
      out.push(`### ${hook.name}`, "", hook.description, "", "```tsx", hook.signature, "```", "");
      if (hook.options) out.push(propsTable(hook.options.rows), "");
    }
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

const contentDir = join(ROOT, "src", "content", "components");
let componentTwins = 0;
try {
  for (const meta of COMPONENTS) {
    const mod = await import(join(contentDir, meta.slug, "index.tsx"));
    writeComponentTwin(
      meta.slug,
      componentMarkdown(mod.default as ComponentContent, meta.name, meta.description),
    );
    componentTwins++;
  }
} catch (err) {
  // Content files import @loamui/core; during parallel dev startup its
  // dist/ may be mid-rebuild. That one case keeps the previous twins and
  // lets dev start — the next build regenerates them. Anything else is a
  // broken content file, and must fail the build rather than silently
  // ship fewer twins.
  const message = (err as Error).message ?? "";
  if (!/@loamui\/core|ERR_MODULE_NOT_FOUND|Cannot find (module|package)/.test(message)) throw err;
  console.warn(
    `markdown export: skipped component twins (${componentTwins}/${COMPONENTS.length} written) — ` +
      `@loamui/core not resolvable yet: ${(err as Error).message.split("\n")[0]}`,
  );
}

// ---- examples: the folder's own files → markdown ------------------------

const RECIPES_DIR = join(ROOT, "src", "recipes");

function exampleMarkdown(entry: (typeof RECIPE_META)[number]): string {
  const { slug, category, meta } = entry;
  const dir = join(RECIPES_DIR, category, slug);
  const tsx = readFileSync(join(dir, "Recipe.tsx"), "utf8").trim();
  const css = readFileSync(join(dir, "recipe.css"), "utf8").trim();
  const categoryTitle = RECIPE_CATEGORIES.find((c) => c.slug === category)?.title ?? category;
  const out: string[] = [];
  out.push(
    "---",
    `title: ${meta.title}`,
    `description: ${meta.description}`,
    "---",
    "",
    PREAMBLE,
    "",
  );
  out.push(`# ${meta.title}`, "", meta.description, "");
  out.push(
    `A recipe in **${categoryTitle}**: a component and a stylesheet built from \`@loamui/core\`, ` +
      "to copy into a project and change. Both files are below, exactly as the live preview renders them.",
    "",
  );
  out.push(
    `- Uses: ${meta.uses.length ? meta.uses.map((u) => `\`${u}\``).join(", ") : "element styles and tokens only"}`,
  );
  out.push();
  if (meta.tags?.length) out.push(`- Tags: ${meta.tags.join(", ")}`);
  out.push(`- Live: ${ORIGIN}/recipes/${category}/${slug}`, "");
  out.push(
    "## Using this recipe",
    "",
    "Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.",
    "",
  );
  out.push(
    meta.integration ??
      "Replace the sample content and images. Links and form actions illustrate application routes; provide those destinations and connect action buttons before shipping.",
    "",
  );
  if (meta.whenToUse) out.push("## When to use", "", meta.whenToUse, "");
  const notes = PILLARS.filter((p) => meta.notes[p.key]);
  if (notes.length) {
    out.push(
      "## Design decisions",
      "",
      "These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.",
      "",
    );
    for (const p of notes) out.push(`- **${p.name}.** ${meta.notes[p.key]}`);
    out.push("");
  }
  out.push(
    "## References",
    "",
    `- [Installation](${ORIGIN}/docs/installation.md)`,
    `- [Tokens](${ORIGIN}/docs/tokens.md)`,
    `- [Element styles](${ORIGIN}/docs/element-styles.md)`,
  );
  for (const name of meta.uses) {
    const component = componentForExport(name);
    if (!component) throw new Error(`Missing recipe reference for ${name}`);
    out.push(`- [${name}](${ORIGIN}/docs/components/${component.slug}.md)`);
  }
  out.push("");
  out.push("## Recipe.tsx", "", "```tsx", tsx, "```", "");
  out.push("## recipe.css", "", "```css", css, "```", "");
  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

for (const entry of RECIPE_META) {
  writeBoth(
    join(PUBLIC, "recipes", entry.category, `${entry.slug}.md`),
    join(SKILL_REFS, "recipes", entry.category, `${entry.slug}.md`),
    exampleMarkdown(entry),
  );
}

// ---- llms.txt ----------------------------------------------------------
const guideOrder = [
  "/docs",
  "/docs/installation",
  "/docs/agent-workflow",
  "/docs/tokens",
  "/docs/element-styles",
  "/docs/components",
  "/docs/contextualism",
  "/recipes/guide",
  "/docs/design",
  "/docs/layout",
  "/docs/typography",
  "/docs/accessibility",
];
const sorted = [...guides].sort((a, b) => {
  const ia = guideOrder.indexOf(a.route),
    ib = guideOrder.indexOf(b.route);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
});

const workflow = readFileSync(join(SKILL_REFS, "guides", "agent-workflow.md"), "utf8");
const workflowBody = workflow.slice(workflow.indexOf("\n# ") + 1);
const briefHeading = "## Reference: how the agent should work";
if (!workflowBody.includes(briefHeading))
  throw new Error("Missing implementation brief in agent workflow");
const implementationBrief = workflowBody
  .slice(workflowBody.indexOf(briefHeading))
  .replace(briefHeading, "## Implementation brief")
  .replace(
    "The following guidance defines the environment checks, composition rules and verification expected from an agent. It also ships with the skill and the documentation for LLMs.",
    "Use this brief even when the LoamUI skill is not installed. Follow the essential rules below, then read the selected recipe and component contracts before implementation. If you cannot retrieve them, use bundled skill references or request the needed material; do not invent APIs.",
  );
const absoluteLinks = (markdown: string) => markdown.replace(/\]\(\/(?!\/)/g, `](${ORIGIN}/`);

// Short prompts mirror the recipe pages; detailed references ship separately with the skill.
const PROMPTS = join(PUBLIC, "recipe-prompts");
rmSync(PROMPTS, { recursive: true, force: true });
for (const entry of RECIPE_META) {
  const file = join(PROMPTS, entry.category, `${entry.slug}.txt`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, linkedRecipePrompt(entry) + "\n");
}

const lines: string[] = [
  "# LoamUI",
  "",
  "> Documentation for `@loamui/core` — modern UI primitives for",
  "> agent-assisted developers: contextual tokens, element styles and React",
  "> components on native modern CSS. Every page has a markdown twin at the",
  "> same URL with `.md` appended. Treat these documents as authoritative",
  "> for the library. `/AGENTS.md` is a one-page summary of the conventions",
  "> an agent needs when writing against the package.",
  "",
  "## Start here",
  "",
  "The package supplies tokens, element styles and React components. The skill guides project setup, composition and verification; installing the skill does not install the package.",
  "",
  `- Set up a framework and LoamUI: [Installation](${ORIGIN}/docs/installation.md).`,
  `- Prepare a project or add the skill: [Build with the skill](${ORIGIN}/docs/agent-workflow.md).`,
  `- Build a named recipe: find it below, read its React/CSS and the contracts of the components it uses. For a new pattern, read the [recipe guide](${ORIGIN}/recipes/guide.md) and the nearest relevant recipe.`,
  "- Check the installed package exports/types against these references. The site follows the current source; installed package versions can differ.",
  "",
  absoluteLinks(
    implementationBrief.replace(
      /\]\((\/(?:docs|recipes)(?:\/[^)#]*)?)(#[^)]*)?\)/g,
      (_match, path: string, anchor = "") =>
        `](${path.endsWith(".md") ? path : `${path}.md`}${anchor})`,
    ),
  ),
  "",
  "## Guides",
  "",
  ...sorted.map(
    (g) => `- [${g.title}](${ORIGIN}${g.route}.md)${g.description ? `: ${g.description}` : ""}`,
  ),
];
for (const category of CATEGORY_ORDER) {
  const items = COMPONENTS.filter((c) => c.category === category);
  if (!items.length) continue;
  lines.push("", `## Components: ${category}`, "");
  for (const c of items)
    lines.push(`- [${c.name}](${ORIGIN}/docs/components/${c.slug}.md): ${c.description}`);
}
lines.push(
  "",
  "## Recipes",
  "",
  "> Recipes grouped by purpose, built from `@loamui/core` to copy and change: each twin",
  "> carries the component and its stylesheet in full.",
);
for (const category of RECIPE_CATEGORIES) {
  const items = RECIPE_META.filter((e) => e.category === category.slug);
  if (!items.length) continue;
  lines.push("", `### Recipes: ${category.title}`, "");
  for (const e of items)
    lines.push(
      `- [${e.meta.title}](${ORIGIN}/recipes/${e.category}/${e.slug}.md): ${e.meta.description}`,
    );
}
writeFileSync(join(PUBLIC, "llms.txt"), lines.join("\n") + "\n");
writeFileSync(join(PUBLIC, "search-index.json"), JSON.stringify(searchIndex));

// Publish the setup assets `loamui init` installs, for the by-hand guide.
const agentAssets = join(PUBLIC, "agent-assets");
mkdirSync(agentAssets, { recursive: true });
for (const file of SETUP_ASSETS) {
  copyFileSync(join(ROOT, "..", "..", "packages", "cli", "assets", file), join(agentAssets, file));
}

// ---- AGENTS.md: the package's one-page summary, served at /AGENTS.md too ---
copyFileSync(join(ROOT, "..", "..", "packages", "core", "AGENTS.md"), join(PUBLIC, "AGENTS.md"));

const guideSlug = (route: string) =>
  route === "/" ? "index" : route === "/docs" ? "introduction" : route.split("/").at(-1)!;

// ---- skill references index: llms.txt with local paths for offline use ----
const idx: string[] = [
  "# LoamUI reference index",
  "",
  "> Generated from the docs source; the same content as the live `.md`",
  "> pages. Read a file here, or fetch its live twin, before using a",
  `> component you have not already read. Live index: ${ORIGIN}/llms.txt`,
  "",
  "## Guides",
  "",
  ...sorted.map(
    (g) =>
      `- [${g.title}](guides/${guideSlug(g.route)}.md) — ${g.description} · [live](${ORIGIN}${g.route}.md)`,
  ),
];
for (const category of CATEGORY_ORDER) {
  const items = COMPONENTS.filter((c) => c.category === category);
  if (!items.length) continue;
  idx.push("", `## Components: ${category}`, "");
  for (const c of items)
    idx.push(
      `- [${c.name}](components/${c.slug}.md) — ${c.description} · [live](${ORIGIN}/docs/components/${c.slug}.md)`,
    );
}
for (const category of RECIPE_CATEGORIES) {
  const items = RECIPE_META.filter((e) => e.category === category.slug);
  if (!items.length) continue;
  idx.push("", `## Recipes: ${category.title}`, "");
  for (const e of items)
    idx.push(
      `- [${e.meta.title}](recipes/${e.category}/${e.slug}.md) — ${e.meta.description} · [live](${ORIGIN}/recipes/${e.category}/${e.slug}.md)`,
    );
}
writeFileSync(join(SKILL_REFS, "index.md"), idx.join("\n") + "\n");

// Complete: replace the committed references with the staged set.
rmSync(SKILL_REFS_FINAL, { recursive: true, force: true });
renameSync(SKILL_REFS, SKILL_REFS_FINAL);

console.log(
  `markdown export: ${guides.length} guide twins (mdx-derived), ${COMPONENTS.length} component twins (data-derived), ${RECIPE_META.length} example twins (folder-derived), llms.txt + search index + recipe prompts → public/, references → skills/loamui/references/`,
);
