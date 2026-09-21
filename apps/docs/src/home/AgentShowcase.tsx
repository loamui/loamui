"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Card, SignpostLink, Tabs } from "@loamui/core";
import { CodeBlock } from "@/renderer/components/CodeBlock";
import { PromptBlock } from "@/renderer/shared/CopyPanel";
import { PackageCommands } from "@/renderer/shared/PackageCommands";
import "@/home/AgentShowcase.css";

/**
 * The homepage's "ask, get, look under the hood" panel: the prompt a
 * developer gives their agent, the live result the agent's code renders,
 * and the code itself. The code strings are synced from the real files
 * (scripts/sync-agent-demo.mjs), so the tabs cannot drift from the render.
 */
export function AgentShowcase({
  prompt,
  tsx,
  css,
  caption,
  children,
}: {
  prompt: string;
  tsx: string;
  css: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="site-AgentShowcase">
      <Card>
        <div className="site-AgentAsk">
          <h3>Add the skill</h3>
          <PackageCommands name="skill" />
          <div className="promptBox">
            <PromptBlock prompt={prompt} label="Then try a prompt" />
          </div>
          <p>
            <SignpostLink render={<Link href="/docs/agent-workflow" />}>
              Build with the skill
            </SignpostLink>
          </p>
          <p>
            New project? <Link href="/docs/installation">Install LoamUI</Link>. For setup help,
            follow <Link href="/docs/agent-workflow">Build with the skill</Link>.
          </p>
        </div>
      </Card>
      <Card>
        <div className="site-AgentResult">
          <p className="eyebrow">Explore the result</p>
          <Tabs.Root defaultValue="result">
            <Tabs.List aria-label="Generated code">
              <Tabs.Tab value="result">Preview</Tabs.Tab>
              <Tabs.Tab value="tsx">React</Tabs.Tab>
              <Tabs.Tab value="css">CSS</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="result" className="site-AgentShowcase-panel">
              <div className="site-AgentShowcase-stage">{children}</div>
            </Tabs.Panel>
            <Tabs.Panel value="tsx" className="site-AgentShowcase-panel">
              <CodeBlock code={tsx} language="tsx" />
            </Tabs.Panel>
            <Tabs.Panel value="css" className="site-AgentShowcase-panel">
              <CodeBlock code={css} language="css" />
            </Tabs.Panel>
          </Tabs.Root>
          <p className="caption">{caption}</p>
        </div>
      </Card>
    </div>
  );
}
