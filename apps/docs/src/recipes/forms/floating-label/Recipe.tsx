"use client";

import { useId } from "react";
import { Field, Input } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Field.Root className="floating-label" id={`${instanceId}-full-name`}>
      <label htmlFor={`${instanceId}-full-name`}>Full name</label>
      {/* One space: :placeholder-shown is true exactly while the box is
          empty, and a space shows nothing. The label is never the hint. */}
      <Input name="name" autoComplete="name" placeholder=" " />
    </Field.Root>
  );
}
