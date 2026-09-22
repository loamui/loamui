import type { Blockquote, Nodes, Paragraph, PhrasingContent, Root, RootContent } from "mdast";
import { gfmToMarkdown } from "mdast-util-gfm";
import { phrasing } from "mdast-util-phrasing";
import { toMarkdown } from "mdast-util-to-markdown";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import {
  PACKAGE_COMMANDS,
  PACKAGE_MANAGERS,
  SKILL_AGENTS,
  packageCommand,
  type PackageCommandName,
} from "../src/renderer/shared/package-commands.js";

const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);
type Element = Extract<Nodes, { type: "mdxJsxFlowElement" | "mdxJsxTextElement" }>;

function blocks(children: Nodes[]): Blockquote["children"] {
  const result: Blockquote["children"] = [];
  let paragraph: Paragraph | undefined;
  for (const child of children) {
    if (phrasing(child)) {
      if (!paragraph) {
        paragraph = { type: "paragraph", children: [] };
        result.push(paragraph);
      }
      paragraph.children.push(child);
    } else {
      paragraph = undefined;
      result.push(child as Blockquote["children"][number]);
    }
  }
  return result;
}

function attribute(node: Element, name: string): string | undefined {
  const attr = node.attributes.find(
    (item) => item.type === "mdxJsxAttribute" && item.name === name,
  );
  if (attr?.type !== "mdxJsxAttribute" || attr.value == null) return undefined;
  if (typeof attr.value !== "string")
    throw new Error(`${node.name}.${name} must be a literal string`);
  return attr.value;
}

function metadata(tree: Root): { title: string; description: string } {
  const values: Record<string, string> = {};
  for (const node of tree.children) {
    if (node.type !== "mdxjsEsm") continue;
    for (const statement of node.data?.estree?.body ?? []) {
      if (
        statement.type !== "ExportNamedDeclaration" ||
        statement.declaration?.type !== "VariableDeclaration"
      )
        continue;
      for (const declaration of statement.declaration.declarations) {
        if (declaration.id.type !== "Identifier" || declaration.id.name !== "metadata") continue;
        if (declaration.init?.type !== "ObjectExpression")
          throw new Error("metadata must be an object literal");
        for (const property of declaration.init.properties) {
          if (property.type !== "Property" || property.computed)
            throw new Error("metadata must use static properties");
          const key =
            property.key.type === "Identifier"
              ? property.key.name
              : property.key.type === "Literal"
                ? property.key.value
                : undefined;
          if (key !== "title" && key !== "description") continue;
          if (property.value.type !== "Literal" || typeof property.value.value !== "string")
            throw new Error(`metadata.${key} must be a literal string`);
          values[key] = property.value.value;
        }
      }
    }
  }
  if (!values.title || !values.description)
    throw new Error("Missing metadata title or description");
  return { title: values.title, description: values.description };
}

function commands(name: string): RootContent[] {
  if (!Object.hasOwn(PACKAGE_COMMANDS, name)) throw new Error(`Unknown command: ${name}`);
  const agents = name === "skill" ? SKILL_AGENTS : [SKILL_AGENTS[0]];
  const markdown = agents
    .flatMap((agent) => [
      ...(name === "skill" ? [`**${agent.label}**`, ""] : []),
      ...PACKAGE_MANAGERS.flatMap((manager) => [
        `**${manager}**`,
        "",
        "```bash",
        packageCommand(name as PackageCommandName, manager, agent.value),
        "```",
        "",
      ]),
    ])
    .join("\n");
  return processor.parse(markdown).children;
}

export function mdxToMarkdown(
  source: string,
  {
    path,
    componentCount,
    tokenTable,
  }: { path: string; componentCount: number; tokenTable: () => string },
): { body: string; title: string; description: string } {
  const tree = processor.parse({ value: source, path });
  const meta = metadata(tree);

  function previewTables(node: Nodes): Nodes[] {
    if (
      (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
      node.name === "ComputedTokens"
    )
      return processor.parse(tokenTable()).children;
    return "children" in node ? node.children.flatMap(previewTables) : [];
  }

  function convert(node: Nodes): Nodes[] {
    if (node.type === "mdxjsEsm") return [];
    if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
      const statement = node.data?.estree?.body[0];
      if (!statement) return [];
      const expression =
        statement.type === "ExpressionStatement" ? statement.expression : undefined;
      if (expression?.type === "Literal" && ["string", "number"].includes(typeof expression.value))
        return [{ type: "text", value: String(expression.value) }];
      if (
        expression?.type === "MemberExpression" &&
        !expression.computed &&
        expression.object.type === "Identifier" &&
        expression.object.name === "COMPONENTS" &&
        expression.property.type === "Identifier" &&
        expression.property.name === "length"
      )
        return [{ type: "text", value: String(componentCount) }];
      throw new Error(
        `Unsupported Markdown expression at ${path}:${node.position?.start.line}: ${node.value}`,
      );
    }
    if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
      if (node.name === "summary") return [];
      if (node.name === "PackageCommands") return commands(attribute(node, "name") ?? "");
      if (node.name === "PromptBlock") {
        const prompt = attribute(node, "prompt");
        if (!prompt) throw new Error("PromptBlock requires a literal prompt");
        return [
          {
            type: "blockquote",
            children: [{ type: "paragraph", children: [{ type: "text", value: prompt }] }],
          },
        ];
      }
      if (node.name === "ComputedTokens") return processor.parse(tokenTable()).children;
      const classes = attribute(node, "className")?.split(/\s+/) ?? [];
      if (classes.includes("block")) return previewTables(node);

      const children = node.children.flatMap(convert);
      const inline = children.flatMap((child) =>
        child.type === "paragraph" ? child.children : [child],
      ) as PhrasingContent[];
      if (classes.includes("site-callout"))
        return [{ type: "blockquote", children: blocks(children) }];
      switch (node.name) {
        case null:
        case "div":
        case "span":
        case "details":
          return node.type === "mdxJsxFlowElement" ? blocks(children) : children;
        case "p":
          return [{ type: "paragraph", children: inline }];
        case "strong":
          return [{ type: "strong", children: inline }];
        case "em":
          return [{ type: "emphasis", children: inline }];
        case "a": {
          const url = attribute(node, "href");
          if (!url) throw new Error("Markdown links require a literal href");
          return [{ type: "link", url, children: inline }];
        }
        case "code":
          return [
            {
              type: "inlineCode",
              value: inline
                .map((child) => {
                  if (child.type !== "text") throw new Error("Inline code must contain text");
                  return child.value;
                })
                .join(""),
            },
          ];
        default:
          throw new Error(
            `No Markdown conversion for <${node.name}> at ${path}:${node.position?.start.line}`,
          );
      }
    }
    if ("children" in node) {
      const children = node.children.flatMap(convert);
      if (node.type === "paragraph" && children.length === 0) return [];
      return [{ ...node, children } as Nodes];
    }
    return [node];
  }

  const markdown = { ...tree, children: tree.children.flatMap(convert) as RootContent[] };
  return {
    ...meta,
    body: toMarkdown(markdown, {
      bullet: "-",
      emphasis: "_",
      fences: true,
      listItemIndent: "one",
      extensions: [gfmToMarkdown({ tablePipeAlign: false })],
    }),
  };
}
