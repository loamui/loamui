"use client";

import type { ReactNode } from "react";
import { CopyButton, VisuallyHidden } from "@loamui/core";
import { CheckIcon, CopyIcon, MessageIcon } from "@/site/Icons";
import "./CopyPanel.css";

export function CopyAction({ value, label }: { value: string; label: string }) {
  return (
    <span className="site-CopyAction">
      <CopyButton
        key={value}
        value={value}
        title={label}
        labels={{
          copied: (
            <>
              <CheckIcon aria-hidden="true" />
              <VisuallyHidden>Copied</VisuallyHidden>
            </>
          ),
          failed: "Could not copy. Select and copy the text in this panel.",
        }}
      >
        <CopyIcon />
        <VisuallyHidden>{label}</VisuallyHidden>
      </CopyButton>
    </span>
  );
}

export function CopyPanel({
  value,
  label,
  icon,
  copyLabel,
  className = "",
  children,
}: {
  value: string;
  label: string;
  icon?: ReactNode;
  copyLabel: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`site-CopyPanel ${className}`}>
      <div className="bar">
        <span className="label">
          {icon}
          {label}
        </span>
        <CopyAction value={value} label={copyLabel} />
      </div>
      {children}
    </div>
  );
}

export function PromptBlock({
  prompt,
  label = "Prompt",
  copyLabel = "Copy prompt",
}: {
  prompt: string;
  label?: string;
  copyLabel?: string;
}) {
  return (
    <CopyPanel value={prompt} label={label} icon={<MessageIcon />} copyLabel={copyLabel}>
      <p className="prompt">{prompt}</p>
    </CopyPanel>
  );
}
