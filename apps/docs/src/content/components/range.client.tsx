"use client";

import { useState } from "react";
import { Field, Range } from "@loamui/core";

export function RangeFieldDemo() {
  return (
    <div style={{ maxInlineSize: "22rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Volume</Field.Label>
        <Field.Description>Applies to alerts only.</Field.Description>
        <Range.Control defaultValue={70} />
      </Field.Root>
    </div>
  );
}

export function RangeStepsDemo() {
  return (
    <div style={{ maxInlineSize: "22rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Fertiliser (kg)</Field.Label>
        <Range.Control min={0} max={100} step={10} defaultValue={30} />
      </Field.Root>
    </div>
  );
}

export function RangeDisabledDemo() {
  return (
    <div style={{ maxInlineSize: "22rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Locked</Field.Label>
        <Range.Control defaultValue={50} disabled />
      </Field.Root>
    </div>
  );
}

export function RangeValueDemo() {
  const [volume, setVolume] = useState(70);
  return (
    <div style={{ maxInlineSize: "22rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Volume: {volume}</Field.Label>
        <Range.Control value={volume} onChange={(e) => setVolume(e.target.valueAsNumber)} />
      </Field.Root>
    </div>
  );
}

export function RangeMarksDemo() {
  return (
    <div style={{ maxInlineSize: "22rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Zoom</Field.Label>
        <Range.Control
          min={0}
          max={100}
          defaultValue={50}
          marks={[{ value: 0 }, { value: 25 }, { value: 50 }, { value: 75 }, { value: 100 }]}
        />
      </Field.Root>
    </div>
  );
}

export function RangeMarkLabelsDemo() {
  return (
    <div style={{ maxInlineSize: "22rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Fertiliser</Field.Label>
        <Range.Control
          min={0}
          max={100}
          step={25}
          defaultValue={50}
          marks={[
            { value: 0, label: "None" },
            { value: 50, label: "Standard" },
            { value: 100, label: "Heavy" },
          ]}
        />
      </Field.Root>
    </div>
  );
}

export function RangeOutputDemo() {
  return (
    <div style={{ maxInlineSize: "22rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Volume</Field.Label>
        <Range.Root>
          <Range.Control defaultValue={70} />
          <Range.Output labels={{ value: (n) => `${n}%` }} />
        </Range.Root>
      </Field.Root>
    </div>
  );
}

export function RangeBoundsDemo() {
  return (
    <div style={{ maxInlineSize: "22rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Year</Field.Label>
        <Range.Root>
          <Range.Control
            min={1990}
            max={2030}
            step={5}
            defaultValue={2010}
            marks={[
              { value: 1990, label: "1990" },
              { value: 2010, label: "2010" },
              { value: 2030, label: "2030" },
            ]}
          />
          <Range.Output labels={{ value: String }} />
        </Range.Root>
      </Field.Root>
    </div>
  );
}
