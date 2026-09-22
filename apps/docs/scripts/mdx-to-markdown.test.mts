// @vitest-environment node

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import type { Code, Nodes } from "mdast";
import { describe, expect, it } from "vitest";
import { mdxToMarkdown } from "./mdx-to-markdown.mjs";

const metadata = 'export const metadata = { title: "Guide", description: "A useful guide." };';
const tokenTable = "| Token | Value |\n| --- | --- |\n| `--loam-space-s` | `1rem` |\n";
const options = { path: "test.mdx", componentCount: 48, tokenTable: () => tokenTable };
const parser = unified().use(remarkParse).use(remarkMdx);

function codeBlocks(node: Nodes): Pick<Code, "lang" | "meta" | "value">[] {
  if (node.type === "code") return [{ lang: node.lang, meta: node.meta, value: node.value }];
  return "children" in node ? node.children.flatMap(codeBlocks) : [];
}

describe("MDX Markdown conversion", () => {
  it("reads metadata containing braces and escaped quotes without evaluating module code", () => {
    const source = String.raw`import {
  Example,
  Other as Renamed,
} from "./demos";

export const metadata = {
  title: "A } \"quoted\" title",
  description: 'A {brace} and an escaped \'quote\'.',
};

export function unused() {
  throw new Error("Do not execute exports");
}

# Read this

Keep the guidance.
`;
    const result = mdxToMarkdown(source, options);
    expect(result.title).toBe('A } "quoted" title');
    expect(result.description).toBe("A {brace} and an escaped 'quote'.");
    expect(result.body).toBe("# Read this\n\nKeep the guidance.\n");
  });

  it("preserves module syntax and expressions inside tilde and long backtick fences", () => {
    const source = [
      metadata,
      "",
      "~~~tsx",
      'import { Button } from "@loamui/core";',
      "export const count = {COMPONENTS.length};",
      "~~~",
      "",
      "````markdown example",
      "```tsx",
      'export default function Example() { return "{COMPONENTS.length}"; }',
      "```",
      "````",
      "",
      "There are {COMPONENTS.length} components.",
    ].join("\n");
    const { body } = mdxToMarkdown(source, options);
    expect(codeBlocks(parser.parse(body))).toEqual(codeBlocks(parser.parse(source)));
    expect(body).toContain("There are 48 components.");
  });

  it("retains rich callout text, links and code", () => {
    const { body } = mdxToMarkdown(
      `${metadata}

<div className="site-callout">
  <p><strong>Read this:</strong> use <a href="/docs/tokens">tokens</a> and <code>gap</code>.</p>
  <p>Keep the <em>second paragraph</em> too.</p>
</div>
`,
      options,
    );
    expect(body).toContain("> **Read this:** use [tokens](/docs/tokens) and `gap`.");
    expect(body).toContain("> Keep the _second paragraph_ too.");
    expect(body).not.toContain("site-callout");
  });

  it("keeps inline callout content together as one paragraph", () => {
    const { body } = mdxToMarkdown(
      `${metadata}\n\n<div className="site-callout">Hello <strong>world</strong>.</div>`,
      options,
    );
    expect(body).toBe("> Hello **world**.\n");
  });

  it("keeps actual paragraphs distinct after inline callout content", () => {
    const { body } = mdxToMarkdown(
      `${metadata}\n\n<div className="site-callout">Hello <strong>world</strong>.<p>Next paragraph.</p><p>Final paragraph.</p></div>`,
      options,
    );
    expect(body).toBe("> Hello **world**.\n>\n> Next paragraph.\n>\n> Final paragraph.\n");
  });

  it("omits disclosure summaries while retaining their complete body", () => {
    const { body } = mdxToMarkdown(
      `${metadata}

<details>
<summary>Expand implementation reference</summary>

## Required setup

Keep this explanation.

- Install the package.
- Run the build.

</details>
`,
      options,
    );
    expect(body).toContain("## Required setup");
    expect(body).toContain("Keep this explanation.");
    expect(body).toContain("- Install the package.\n- Run the build.");
    expect(body).not.toContain("Expand implementation reference");
    expect(body).not.toContain("<details>");
  });

  it("retains computed tokens nested in demo wrappers and removes other live demos", () => {
    const { body } = mdxToMarkdown(
      `${metadata}

Before the table.

<div className="block">
  <div>
    <ComputedTokens />
  </div>
  <InteractiveExample />
</div>

<div className="block">
  <AnotherExample />
</div>

After the table.
`,
      options,
    );
    expect(body).toContain("Before the table.");
    expect(body).toContain("`--loam-space-s`");
    expect(body).toContain("`1rem`");
    expect(body).toContain("After the table.");
    expect(body).not.toMatch(/ComputedTokens|InteractiveExample|AnotherExample|<div/);
  });

  it("extracts inline computed tokens without retaining preview text", () => {
    const { body } = mdxToMarkdown(
      `${metadata}\n\n<div className="block">See <ComputedTokens /></div>`,
      options,
    );
    expect(body).toContain("`--loam-space-s`");
    expect(body).toContain("`1rem`");
    expect(body).not.toMatch(/See|ComputedTokens|<div/);
  });

  it("expands package commands into executable examples for each package manager", () => {
    const { body } = mdxToMarkdown(`${metadata}\n\n<PackageCommands name="install" />`, options);
    expect(codeBlocks(parser.parse(body)).map((block) => block.value)).toEqual([
      "pnpm add @loamui/core",
      "npm install @loamui/core",
      "yarn add @loamui/core",
      "bun add @loamui/core",
    ]);
  });

  it("includes both supported skill agents and preserves literal prompt content", () => {
    const { body } = mdxToMarkdown(
      `${metadata}

<PackageCommands name="skill" />

<PromptBlock prompt="Use &quot;tokens&quot; for {names}." />
`,
      options,
    );
    expect(body).toContain("**Claude Code**");
    expect(body).toContain("**Codex**");
    const commands = codeBlocks(parser.parse(body)).map((block) => block.value);
    expect(
      commands.filter((command) => command.endsWith("--agent claude-code --yes")),
    ).toHaveLength(4);
    expect(commands.filter((command) => command.endsWith("--agent codex --yes"))).toHaveLength(4);
    expect(body).toContain('> Use "tokens" for {names}.');
  });

  it.each([
    "<UnsupportedWidget />",
    "The result is {loadData()}.",
    "<a href={destination}>Read more</a>",
    "<PromptBlock prompt={message} />",
    '<PackageCommands name="unknown" />',
  ])("rejects unsupported content instead of silently removing it: %s", (content) => {
    expect(() => mdxToMarkdown(`${metadata}\n\n${content}`, options)).toThrow();
  });

  it("rejects dynamic metadata", () => {
    expect(() =>
      mdxToMarkdown(
        'export const metadata = { title: getTitle(), description: "Guide" };',
        options,
      ),
    ).toThrow();
  });
});

const appDirectory = fileURLToPath(new URL("../src/app/", import.meta.url));
const pages = readdirSync(appDirectory, { recursive: true })
  .filter((path) => String(path).endsWith("/page.mdx"))
  .map(String)
  .sort();

it.each(pages)("preserves every fenced code example in %s", (path) => {
  const source = readFileSync(`${appDirectory}/${path}`, "utf8");
  const { body, title, description } = mdxToMarkdown(source, { ...options, path });
  expect(title).not.toBe("");
  expect(description).not.toBe("");
  expect(codeBlocks(parser.parse(body))).toEqual(
    expect.arrayContaining(codeBlocks(parser.parse(source))),
  );
});
