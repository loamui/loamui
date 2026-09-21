"use client";

import { Highlight, Prism, type PrismTheme } from "prism-react-renderer";
import { CopyPanel } from "../shared/CopyPanel";
import { TerminalIcon } from "@/site/Icons";
import { useScrollable } from "../shared/scrollable";
import "./CodeBlock.css";

// The bundled Prism languages omit shell. These rules cover our command listings.
Prism.languages.bash = {
  comment: /(^|\s)#.*/,
  string: /"(?:\\.|[^"\\])*"|'[^']*'/,
  function: {
    pattern: /(^|\n)\s*(?:pnpm|npm|npx|yarn|bunx?|node|cd)(?=\s|$)/,
    lookbehind: true,
  },
  keyword: /(^|\s)--?[\w-]+/,
  punctuation: /\\(?=\n)/,
};
Prism.languages.sh = Prism.languages.bash;

/**
 * The highlighter's palette, drawn from the library's own tokens: every
 * colour is a light-dark() pair the contrast audit already holds to 4.5:1
 * as text on the surface, so one theme serves both schemes and a block
 * re-colours with the page instead of swapping themes after hydration.
 */
const THEME: PrismTheme = {
  plain: { color: "var(--loam-color-fg)", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--loam-color-fg-muted)", fontStyle: "italic" },
    },
    {
      types: ["punctuation", "operator"],
      style: { color: "var(--loam-color-fg-muted)" },
    },
    {
      types: ["keyword", "atrule", "rule", "important", "tag", "deleted"],
      style: { color: "var(--loam-color-danger-strong)" },
    },
    {
      types: ["string", "attr-value", "char", "inserted", "url"],
      style: { color: "var(--loam-color-success-strong)" },
    },
    {
      types: ["function", "class-name", "maybe-class-name", "builtin"],
      style: { color: "var(--loam-color-info-strong)" },
    },
    {
      types: ["property", "selector", "attr-name", "unit"],
      style: { color: "var(--loam-color-link)" },
    },
    {
      types: ["number", "constant", "boolean", "symbol", "regex"],
      style: { color: "var(--loam-color-warning-strong)" },
    },
    {
      types: ["variable", "parameter"],
      style: { color: "var(--loam-color-fg)" },
    },
  ],
};

const LANGUAGE_NAMES: Record<string, string> = {
  tsx: "TSX",
  jsx: "JSX",
  ts: "TypeScript",
  js: "JavaScript",
  css: "CSS",
  bash: "shell",
  sh: "shell",
  html: "HTML",
  json: "JSON",
};

/**
 * A highlighted code listing with the library's own CopyButton (which
 * announces the copy, and its failure). Long lines scroll inside the
 * block; once they do, the block is a named group in the Tab order.
 */
export function CodeBlock({
  code,
  language = "tsx",
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const name = LANGUAGE_NAMES[language] ?? language;
  const scroll = useScrollable<HTMLPreElement>(`${name} code`, "group");

  return (
    <CopyPanel
      className={`site-CodeBlock ${className ?? ""}`}
      value={code.trim()}
      label={name}
      icon={name === "shell" ? <TerminalIcon /> : undefined}
      copyLabel={name === "shell" ? "Copy shell command" : `Copy ${name} code`}
    >
      <Highlight code={code.trim()} language={language} theme={THEME}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="pre" {...scroll}>
            {tokens.map((line, i) => (
              <span key={i} {...getLineProps({ line })} className="line">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            ))}
          </pre>
        )}
      </Highlight>
    </CopyPanel>
  );
}
