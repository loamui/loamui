"use client";

import { Field, Input } from "@loamui/core";

/** A field whose explicit invalid state is exposed through aria-invalid. */
export function DetectedErrorDemo() {
  return (
    <div style={{ maxInlineSize: "22rem" }}>
      <Field.Root invalid>
        <Field.Label>Workspace name</Field.Label>
        <Field.Error>Names can only contain letters, numbers and dashes.</Field.Error>
        <Input defaultValue="my workspace!" />
      </Field.Root>
    </div>
  );
}
