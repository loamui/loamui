"use client";

import { useState } from "react";
import { Alert, Button } from "@loamui/core";
import type { CSSProperties } from "react";

export function AlertDismissibleDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--loam-space-xs)",
        inlineSize: "100%",
        justifyItems: "start",
      }}
    >
      {open ? (
        <Alert.Root>
          <Alert.Body>
            <Alert.Title>Draft restored</Alert.Title>
            <Alert.Description>We recovered the draft you were editing.</Alert.Description>
          </Alert.Body>
          <Alert.Close onClose={() => setOpen(false)} />
        </Alert.Root>
      ) : (
        <Button onClick={() => setOpen(true)}>Show the alert again</Button>
      )}
    </div>
  );
}

export function AlertComposedDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div
      style={
        {
          "--loam-context": "warning",
          display: "grid",
          gap: "var(--loam-space-xs)",
          inlineSize: "100%",
          justifyItems: "start",
        } as CSSProperties
      }
    >
      {open ? (
        <Alert.Root>
          <Alert.Icon>
            <span aria-hidden>⚠</span>
          </Alert.Icon>
          <Alert.Body>
            <Alert.Title render={<h2 />}>Storage almost full</Alert.Title>
            <Alert.Description>Free up space to keep syncing.</Alert.Description>
          </Alert.Body>
          <Alert.Close onClose={() => setOpen(false)} labels={{ close: "Hide this warning" }} />
        </Alert.Root>
      ) : (
        <Button onClick={() => setOpen(true)}>Show the warning again</Button>
      )}
    </div>
  );
}
