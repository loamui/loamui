"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";
import "./Preview.css";

type Tab = "preview" | "code" | "css";

export function Preview({
  code,
  css,
  children,
}: {
  code: string;
  /** The component's real, complete stylesheet (plain, zero-runtime CSS). */
  css?: string;
  children: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("preview");
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const tabs: Tab[] = css ? ["preview", "code", "css"] : ["preview", "code"];
  const labels: Record<Tab, string> = {
    preview: "Preview",
    code: "Code",
    css: "CSS",
  };

  // APG tabs pattern: one tab stop, arrow keys move selection.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.indexOf(tab);
    let next: number | undefined;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    const target = tabs[next];
    if (!target) return;
    setTab(target);
    listRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <div className="site-Preview">
      {/* interactive-supports-focus is off for this file (.oxlintrc):
          focus roves between the tabs; the list is never a stop */}
      <div
        className="tabs"
        role="tablist"
        aria-label="Example view"
        ref={listRef}
        onKeyDown={onKeyDown}
      >
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            id={`${baseId}-tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`${baseId}-panel-${t}`}
            tabIndex={tab === t ? 0 : -1}
            className="tab"
            onClick={() => setTab(t)}
            type="button"
          >
            {labels[t]}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${baseId}-panel-${tab}`} aria-labelledby={`${baseId}-tab-${tab}`}>
        {tab === "preview" && <div className="stage">{children}</div>}
        {tab === "code" && <CodeBlock code={code} className="code" />}
        {tab === "css" && css && <CodeBlock code={css} language="css" className="code" />}
      </div>
    </div>
  );
}
