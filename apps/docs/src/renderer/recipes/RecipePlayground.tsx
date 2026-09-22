"use client";

import type { ReactNode } from "react";
import { Tabs } from "@loamui/core";
import type { RecipeSource } from "@/recipes/types";
import { CodeBlock } from "../components/CodeBlock";
import { RecipeStage } from "./RecipeStage";
import "./RecipePlayground.css";

export function RecipePlayground({
  title,
  source,
  children,
}: {
  title: string;
  source: RecipeSource;
  children: ReactNode;
}) {
  return (
    <div className="site-RecipePlayground">
      <Tabs.Root defaultValue="preview">
        <Tabs.List aria-label={`${title} preview and source`}>
          <Tabs.Tab value="preview">Preview</Tabs.Tab>
          <Tabs.Tab value="react">React</Tabs.Tab>
          <Tabs.Tab value="css">CSS</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="preview">
          <RecipeStage title={title}>{children}</RecipeStage>
        </Tabs.Panel>
        <Tabs.Panel value="react">
          <CodeBlock code={source.tsx} language="tsx" />
        </Tabs.Panel>
        <Tabs.Panel value="css">
          <CodeBlock code={source.css} language="css" />
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
