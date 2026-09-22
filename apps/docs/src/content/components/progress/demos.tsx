"use client";

import { Progress } from "@loamui/core";

/** A function-valued `labels.value` cannot cross the server/client boundary, so this demo is a client component. */
export function ProgressValueLabelDemo() {
  return (
    <div style={{ inlineSize: "100%" }}>
      <Progress value={75} labels={{ value: (n) => `${n / 25} of 4 files` }}>
        Importing contacts
      </Progress>
    </div>
  );
}
