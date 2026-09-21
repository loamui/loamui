"use client";

import { Field, Range } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <Field.Root className="slider-with-output">
      <Field.Label>Row spacing</Field.Label>
      <Field.Description>Carrots do well at 15 cm; brassicas want the room.</Field.Description>
      <Range.Root>
        <Range.Control name="spacing" min={15} max={60} step={5} defaultValue={30} />
        <Range.Output labels={{ value: (n) => `${n} cm` }} />
      </Range.Root>
    </Field.Root>
  );
}
