"use client";

import { Badge } from "@loamui/core";
import type { CSSProperties } from "react";

export function BadgeDotDemo() {
  return (
    <>
      <span style={{ "--loam-context": "success" } as CSSProperties}>
        <Badge.Root>
          {" "}
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="8" cy="8" r="4" />
          </svg>
          <Badge.Text>Live</Badge.Text>
        </Badge.Root>
      </span>
      <span style={{ "--loam-context": "warning" } as CSSProperties}>
        <Badge.Root>
          {" "}
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="8" cy="8" r="4" />
          </svg>
          <Badge.Text>Pending</Badge.Text>
        </Badge.Root>
      </span>
      <span style={{ "--loam-context": "danger" } as CSSProperties}>
        <Badge.Root>
          {" "}
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="8" cy="8" r="4" />
          </svg>
          <Badge.Text>Offline</Badge.Text>
        </Badge.Root>
      </span>
      <Badge.Root>
        {" "}
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <circle cx="8" cy="8" r="4" />
        </svg>
        <Badge.Text>Draft</Badge.Text>
      </Badge.Root>
    </>
  );
}
