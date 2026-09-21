"use client";

import { Field, Range } from "@loamui/core";
import "./example.css";

const MARKS = [
  { value: 0, label: "0%" },
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "100%" },
];

export default function Example() {
  return (
    <Field.Root className="slider-with-marks">
      <Field.Label>Target soil moisture</Field.Label>
      <Field.Description>The irrigation runs until the bed's sensor reads this.</Field.Description>
      <Range.Control name="moisture" min={0} max={100} step={5} defaultValue={50} marks={MARKS} />
    </Field.Root>
  );
}
