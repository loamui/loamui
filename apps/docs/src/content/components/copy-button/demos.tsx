"use client";

import { useState } from "react";
import { CopyButton } from "@loamui/core";

export function CopyButtonOnCopyDemo() {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <div style={{ display: "grid", gap: "var(--loam-space-2xs)", justifyItems: "start" }}>
      <CopyButton value="LOAM-4F7K-2Q9X" onCopy={setCopied}>
        Copy code
      </CopyButton>
      <p>{copied ? `On the clipboard: ${copied}` : "Nothing copied yet."}</p>
    </div>
  );
}
