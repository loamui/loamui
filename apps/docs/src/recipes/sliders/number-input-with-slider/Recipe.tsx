"use client";

import { useId, useState } from "react";
import { Field, Input, Range } from "@loamui/core";
import "./recipe.css";

const MIN = 10;
const MAX = 30;

export default function Recipe() {
  const instanceId = useId();
  const [value, setValue] = useState(20);
  // What the box shows can lag the value: a half-typed number is not yet
  // a temperature, and clearing the box is not asking for zero.
  const [text, setText] = useState("20");

  const settle = (next: number) => {
    const clamped =
      Number.isFinite(next) && Number.isInteger(next) ? Math.min(MAX, Math.max(MIN, next)) : value;
    setValue(clamped);
    setText(String(clamped));
  };

  return (
    <Field.Root className="number-input-with-slider" id={`${instanceId}-propagator`}>
      <Field.Label id={`${instanceId}-propagator-label`}>Propagator temperature</Field.Label>
      <Field.Description id={`${instanceId}-temperature-hint`}>
        Whole degrees between {MIN} and {MAX} °C. Invalid or fractional entries return to the last
        temperature when you leave the field.
      </Field.Description>
      <div className="row">
        <div className="temperature">
          <Input
            name="temperature"
            inputMode="numeric"
            pattern="[0-9]*"
            size={3}
            value={text}
            onChange={(event) => {
              const raw = event.currentTarget.value;
              setText(raw);
              const n = Number(raw);
              if (raw !== "" && Number.isInteger(n) && n >= MIN && n <= MAX) setValue(n);
            }}
            onBlur={() => settle(text === "" ? value : Number(text))}
          />
          <span aria-hidden="true">°C</span>
        </div>
        <Field.Item>
          <Range.Control
            aria-describedby={`${instanceId}-temperature-hint`}
            id={`${instanceId}-propagator-slider`}
            aria-labelledby={`${instanceId}-propagator-label`}
            min={MIN}
            max={MAX}
            step={1}
            value={value}
            onChange={(event) => settle(event.currentTarget.valueAsNumber)}
          />
        </Field.Item>
      </div>
    </Field.Root>
  );
}
