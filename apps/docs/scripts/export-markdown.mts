/**
 * Markdown twins for every docs page, plus /llms.txt — all SOURCE-derived,
 * generated in one prebuild step into public/ so `next dev` and the static
 * export both serve raw text/markdown at the sibling URL
 * (/docs/tokens → /docs/tokens.md).
 *
 * Guides are authored as page.mdx: markdown IS their source, so the twin is
 * the same file with imports/JSX islands resolved (lead → paragraph,
 * callout → blockquote, live demos omitted — the fences and prose are the
 * document). Component pages render from the same registry data the page
 * renders. Nothing derives from built output, so nothing can drift.
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  rmSync,
  copyFileSync,
} from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { componentForExport, COMPONENTS, CATEGORY_ORDER } from "../src/site/nav.js";
import type { ComponentContent } from "../src/renderer/types.js";
import { EXAMPLE_CATEGORIES } from "../src/examples/categories.js";
import { EXAMPLE_META } from "../src/examples/generated-meta.js";
import { linkedRecipePrompt } from "../src/examples/recipe-prompt.js";
import { PILLARS } from "../src/examples/types.js";
import {
  PACKAGE_COMMANDS,
  SKILL_AGENTS,
  packageCommand,
  PACKAGE_MANAGERS,
  type PackageCommandName,
} from "../src/renderer/package-commands.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = join(ROOT, "src", "app");
const PUBLIC = join(ROOT, "public");
// Links in llms.txt must be absolute: agents fetch it from anywhere and
// resolve the linked twins without a base URL.
const ORIGIN = process.env.SITE_ORIGIN ?? "https://loamui.com";
// The published `loamui` agent skill carries the same twins as offline
// references (skills/loamui/references/), regenerated here so they can't
// drift from the site. `check:skill` fails CI if the committed copy is stale.
const SKILL_REFS = join(ROOT, "..", "..", "skills", "loamui", "references");
const SETUP_ASSETS = [
  "stylelint-base.mjs",
  "stylelint.config.mjs",
  "check-composition.mjs",
  "scope-rules.mjs",
  "spacing-rules.mjs",
];

/** Write the same markdown to public/ (served) and the skill references (committed). */
function writeBoth(publicFile: string, refFile: string, md: string) {
  mkdirSync(dirname(publicFile), { recursive: true });
  writeFileSync(publicFile, md);
  mkdirSync(dirname(refFile), { recursive: true });
  writeFileSync(refFile, md);
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

/** Every `--loam-*` declaration in the :root band of tokens.css, as a table. */
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

/** Guide twin: /docs/tokens → public/docs/tokens.md + references/guides/tokens.md. */
function writeGuideTwin(route: string, md: string) {
  const file = route === "/" ? join(PUBLIC, "index.md") : join(PUBLIC, route.slice(1) + ".md");
  const slug =
    route === "/" ? "index" : route === "/docs" ? "introduction" : route.split("/").at(-1)!;
  writeBoth(file, join(SKILL_REFS, "guides", `${slug}.md`), md);
}

/** Component twin: public/docs/components/<slug>.md + references/components/<slug>.md. */
function writeComponentTwin(slug: string, md: string) {
  writeBoth(
    join(PUBLIC, "docs", "components", `${slug}.md`),
    join(SKILL_REFS, "components", `${slug}.md`),
    md,
  );
}

// Start the skill references from empty so removed pages don't linger.
rmSync(SKILL_REFS, { recursive: true, force: true });
// Generated recipe twins must disappear when their catalog entries are disabled.
for (const directory of ["examples", "recipes"])
  rmSync(join(PUBLIC, directory), { recursive: true, force: true });

// Remove the retired standalone setup twin; its content is in agent-workflow.
rmSync(join(PUBLIC, "docs", "project-setup.md"), { force: true });

// ---- guides: page.mdx source → markdown --------------------------------

/** Strip JSX tags to their markdown-ish text content. */
function jsxToText(s: string): string {
  return s
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\{"\s*"\}/g, " ")
    .replace(/<\/?code>/g, "`")
    .replace(/<\/?strong>/g, "**")
    .replace(/<\/?em>/g, "_")
    .replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Ignore fenced examples when locating MDX module exports. */
function moduleSource(src: string): string {
  let fence = false;
  return src
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) {
        fence = !fence;
        return " ".repeat(line.length);
      }
      return fence ? " ".repeat(line.length) : line;
    })
    .join("\n");
}

/** Serialize an .mdx source file to plain markdown. */
function mdxToMarkdown(src: string): { md: string; title: string; description: string } {
  const meta = moduleSource(src).match(
    /export const metadata = \{[\s\S]*?title: "([^"]+)"[\s\S]*?description:\s*\n?\s*"([^"]+)"/,
  );
  const title = meta?.[1] ?? "";
  const description = meta?.[2] ?? "";

  // Drop the metadata export (balanced-brace scan). MDX-level imports are
  // dropped line by line in the walk below, where code fences are known —
  // a multi-line regex here once swallowed everything between an `import`
  // inside one fence and the next `from "…"` in another.
  let s = src;
  const mi = moduleSource(s).indexOf("export const metadata");
  if (mi > -1) {
    let depth = 0,
      j = s.indexOf("{", mi),
      k = j;
    for (; ; k++) {
      if (s[k] === "{") depth++;
      else if (s[k] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    k = s.indexOf(";", k) + 1;
    s = s.slice(0, mi) + s.slice(k);
  }
  // Other top-level exports (helper components/styles) — drop line blocks.
  // Other top-level exports (helper components, icons): drop each one by
  // scanning to the bracket that closes it, whatever bracket opened it.
  for (
    let ei = moduleSource(s).indexOf("\nexport const ");
    ei > -1;
    ei = moduleSource(s).indexOf("\nexport const ")
  ) {
    const start = ei + 1;
    const open = s.slice(start).search(/[({[]/);
    if (open === -1) break;
    const pairs: Record<string, string> = { "(": ")", "{": "}", "[": "]" };
    const stack: string[] = [];
    let k = start + open;
    for (; k < s.length; k++) {
      const ch = s[k]!;
      if (pairs[ch]) stack.push(pairs[ch]);
      else if (ch === stack[stack.length - 1]) {
        stack.pop();
        if (stack.length === 0) {
          // `() => (` … `)`: an arrow's parameter list closes first; carry
          // on to the body it introduces.
          const arrow = /^\s*=>\s*/.exec(s.slice(k + 1));
          if (!arrow) break;
          const next = s.slice(k + 1 + arrow[0].length).search(/[({[]/);
          if (next === -1) break;
          k = k + 1 + arrow[0].length + next - 1;
        }
      }
    }
    const lineEnd = s.indexOf("\n", k);
    s = s.slice(0, start) + s.slice(lineEnd === -1 ? s.length : lineEnd + 1);
  }
  // Inline template expressions the page computes from the manifest.
  s = s.replaceAll("{COMPONENTS.length}", String(COMPONENTS.length));

  const out: string[] = [];
  let i = 0;
  let inFence = false;
  const lines = s.split("\n");
  while (i < lines.length) {
    const line = lines[i]!;
    // Code fences are verbatim: their JSX is documentation, not an island,
    // and their imports are the example's own.
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      out.push(line);
      i++;
      continue;
    }
    if (inFence) {
      out.push(line);
      i++;
      continue;
    }
    if (/^import (?:.* from )?"[^"]+";\s*$/.test(line)) {
      i++;
      continue;
    }
    if (
      /^\s*<\/?details(?:\s[^>]*)?>\s*$/.test(line) ||
      /^\s*<summary\b.*<\/summary>\s*$/.test(line)
    ) {
      i++;
      continue;
    }
    const command = /^<PackageCommands name="([^"]+)" \/>$/.exec(line);
    if (command) {
      const name = command[1] as PackageCommandName;
      if (!Object.hasOwn(PACKAGE_COMMANDS, name)) throw new Error(`Unknown command: ${name}`);
      const agents = name === "skill" ? SKILL_AGENTS : [SKILL_AGENTS[0]];
      for (const agent of agents) {
        if (name === "skill") out.push(`**${agent.label}**`, "");
        for (const manager of PACKAGE_MANAGERS) {
          out.push(
            `**${manager}**`,
            "",
            "```bash",
            packageCommand(name, manager, agent.value),
            "```",
            "",
          );
        }
      }
      i++;
      continue;
    }
    if (/^\s*<\w/.test(line)) {
      // A JSX island: consume until tags balance.
      let block = "";
      let depth = 0;
      do {
        const l = lines[i]!;
        block += l + "\n";
        depth += (l.match(/<[A-Za-z][^/>]*(?<!\/)>/g) ?? []).length; // opening tags
        depth += (l.match(/<[A-Za-z][^>]*\/>/g) ?? []).length * 0; // self-closing: net 0
        depth -= (l.match(/<\/[A-Za-z][^>]*>/g) ?? []).length; // closing tags
        i++;
      } while (i < lines.length && depth > 0);

      if (/<PromptBlock\b/.test(block)) {
        const prompt = /^\s*<PromptBlock\s+prompt="([^"]*)"\s*\/>\s*$/.exec(block);
        if (!prompt)
          throw new Error("MDX prompts must use a literal PromptBlock prompt attribute.");
        out.push("> " + prompt[1]!.replace(/\s+/g, " ").trim(), "");
      } else if (/className=\{prose\.callout\}/.test(block)) {
        out.push("> " + jsxToText(block), "");
      } else if (/<ComputedTokens/.test(block)) {
        // The live table reads getComputedStyle; the twin gets the same
        // names and their declared values, straight from tokens.css.
        out.push(tokenTable(), "");
      }
      // other islands (live demos) are omitted — the prose + fences are the doc
      continue;
    }
    out.push(line);
    i++;
  }

  const body = out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const front = [
    "---",
    `title: ${title}`,
    `description: ${description}`,
    "---",
    "",
    PREAMBLE,
    "",
  ].join("\n");
  return { md: `${front}\n${body}\n`, title, description };
}

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
  const { md, title, description } = mdxToMarkdown(readFileSync(file, "utf8"));
  writeGuideTwin(route, md);
  guides.push({ route, title, description });
}

// Old agents and bookmarks still receive the maintained guide at its former URL.
// Only the new route is advertised in llms.txt and the skill's index.
copyFileSync(join(PUBLIC, "recipes", "guide.md"), join(PUBLIC, "docs", "composing.md"));

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
  // dist/ may be mid-rebuild. Keep the previous twins and let dev start —
  // the next build regenerates them.
  console.warn(
    `markdown export: skipped component twins (${componentTwins}/${COMPONENTS.length} written) — ` +
      `@loamui/core not resolvable yet: ${(err as Error).message.split("\n")[0]}`,
  );
}

// ---- examples: the folder's own files → markdown ------------------------

const EXAMPLES_DIR = join(ROOT, "src", "examples");

/** An example's twin: its meta, the pillar notes, then both files in fences. */
function exampleMarkdown(entry: (typeof EXAMPLE_META)[number]): string {
  const { slug, category, meta } = entry;
  const dir = join(EXAMPLES_DIR, category, slug);
  const tsx = readFileSync(join(dir, "Example.tsx"), "utf8").trim();
  const css = readFileSync(join(dir, "example.css"), "utf8").trim();
  const categoryTitle = EXAMPLE_CATEGORIES.find((c) => c.slug === category)?.title ?? category;
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
  out.push("## Example.tsx", "", "```tsx", tsx, "```", "");
  out.push("## example.css", "", "```css", css, "```", "");
  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

for (const entry of EXAMPLE_META) {
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
for (const entry of EXAMPLE_META) {
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
for (const category of EXAMPLE_CATEGORIES) {
  const items = EXAMPLE_META.filter((e) => e.category === category.slug);
  if (!items.length) continue;
  lines.push("", `### Recipes: ${category.title}`, "");
  for (const e of items)
    lines.push(
      `- [${e.meta.title}](${ORIGIN}/recipes/${e.category}/${e.slug}.md): ${e.meta.description}`,
    );
}
writeFileSync(join(PUBLIC, "llms.txt"), lines.join("\n") + "\n");

// Publish the same setup assets that ship with the skill.
const agentAssets = join(PUBLIC, "agent-assets");
mkdirSync(agentAssets, { recursive: true });
for (const file of SETUP_ASSETS) {
  copyFileSync(join(ROOT, "..", "..", "skills", "loamui", "assets", file), join(agentAssets, file));
}

// ---- AGENTS.md: the package's one-page summary, served at /AGENTS.md too ---
copyFileSync(join(ROOT, "..", "..", "packages", "core", "AGENTS.md"), join(PUBLIC, "AGENTS.md"));

// Retire the old aggregate; focused twins and the offline skill retain every example.
rmSync(join(PUBLIC, "llms-full.txt"), { force: true });
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
for (const category of EXAMPLE_CATEGORIES) {
  const items = EXAMPLE_META.filter((e) => e.category === category.slug);
  if (!items.length) continue;
  idx.push("", `## Recipes: ${category.title}`, "");
  for (const e of items)
    idx.push(
      `- [${e.meta.title}](recipes/${e.category}/${e.slug}.md) — ${e.meta.description} · [live](${ORIGIN}/recipes/${e.category}/${e.slug}.md)`,
    );
}
writeFileSync(join(SKILL_REFS, "index.md"), idx.join("\n") + "\n");

console.log(
  `markdown export: ${guides.length} guide twins (mdx-derived), ${COMPONENTS.length} component twins (data-derived), ${EXAMPLE_META.length} example twins (folder-derived), llms.txt + recipe prompts → public/, references → skills/loamui/references/`,
);
