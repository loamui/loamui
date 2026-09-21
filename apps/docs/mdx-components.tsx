import type { MDXComponents } from "mdx/types";
import type { ReactElement, ReactNode } from "react";
import { CodeBlock } from "@/renderer/components/CodeBlock";
import { PromptBlock } from "@/renderer/shared/CopyPanel";
import { PackageCommands, PackageManagerProvider } from "@/renderer/shared/PackageCommands";
import "@/app/docs/prose.css";

/** Native fences render through the site's CodeBlock. */
function Pre({ children }: { children?: ReactNode }) {
  const code = children as ReactElement<{ className?: string; children?: string }>;
  const language = code?.props?.className?.replace("language-", "") ?? "tsx";
  const text = typeof code?.props?.children === "string" ? code.props.children.trimEnd() : "";
  return (
    <div className="block">
      <CodeBlock code={text} language={language} />
    </div>
  );
}

function Prompt({ prompt }: { prompt: string }) {
  return (
    <div className="block">
      <PromptBlock prompt={prompt} />
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: ({ children }: { children?: ReactNode }) => (
      <PackageManagerProvider>
        <div className="site-prose">{children}</div>
      </PackageManagerProvider>
    ),
    pre: Pre,
    PromptBlock: Prompt,
    PackageCommands,
    ...components,
  };
}
