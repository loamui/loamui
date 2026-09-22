"use client";

import { Tabs } from "@loamui/core";
import { CodeBlock } from "../components/CodeBlock";
import { CopyAction } from "../shared/CopyPanel";
import type { RecipeSource } from "@/recipes/types";
import "./RecipeCode.css";

/** Both files as one markdown pair, for a paste into a chat or a PR. */
export function fencedPair(source: RecipeSource): string {
  return `\`\`\`tsx\n${source.tsx.trim()}\n\`\`\`\n\n\`\`\`css\n${source.css.trim()}\n\`\`\`\n`;
}

/**
 * The recipe's two files, verbatim from disk, in tabs: the component and
 * its stylesheet. Each block copies itself; "Copy both" copies a fenced
 * pair so the whole recipe travels as one paste.
 */
export function RecipeCode({ source }: { source: RecipeSource }) {
  return (
    <Tabs.Root defaultValue="tsx" className="site-RecipeCode">
      <div className="bar">
        <Tabs.List aria-label="Recipe files">
          <Tabs.Tab value="tsx">Recipe.tsx</Tabs.Tab>
          <Tabs.Tab value="css">recipe.css</Tabs.Tab>
        </Tabs.List>
        <CopyAction value={fencedPair(source)} label="Copy both files" />
      </div>
      <Tabs.Panel value="tsx" className="panel">
        <CodeBlock code={source.tsx} language="tsx" className="code" />
      </Tabs.Panel>
      <Tabs.Panel value="css" className="panel">
        <CodeBlock code={source.css} language="css" className="code" />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
