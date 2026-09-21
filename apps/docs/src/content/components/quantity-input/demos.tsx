"use client";

import { useState } from "react";
import { Field, Price, QuantityInput } from "@loamui/core";

export function QuantityInputCartDemo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--loam-space-s)" }}>
      <span>Field notebook</span>
      <Field.Root style={{ inlineSize: "auto" }}>
        <Field.Label>Quantity</Field.Label>
        <QuantityInput name="quantity" defaultValue={1} min={1} />
      </Field.Root>
      <Price value={12} currency="GBP" />
    </div>
  );
}

export function QuantityInputBoundsDemo() {
  return (
    <Field.Root>
      <Field.Label>Seats</Field.Label>
      <Field.Description>Between 1 and 5.</Field.Description>
      <QuantityInput defaultValue={1} min={1} max={5} />
    </Field.Root>
  );
}

export function QuantityInputStepDemo() {
  return (
    <Field.Root>
      <Field.Label>Copies</Field.Label>
      <Field.Description>Sold in packs of 10.</Field.Description>
      <QuantityInput
        defaultValue={10}
        min={10}
        step={10}
        labels={{ decrement: "One pack fewer", increment: "One pack more" }}
      />
    </Field.Root>
  );
}

export function QuantityInputDisabledDemo() {
  return (
    <Field.Root>
      <Field.Label>Quantity</Field.Label>
      <Field.Description>Out of stock.</Field.Description>
      <QuantityInput defaultValue={1} min={1} disabled />
    </Field.Root>
  );
}

export function QuantityInputControlledDemo() {
  const [guests, setGuests] = useState(2);
  return (
    <Field.Root>
      <Field.Label>Guests: {guests}</Field.Label>
      <QuantityInput
        value={guests}
        min={1}
        max={8}
        onChange={(e) => setGuests(e.target.valueAsNumber)}
      />
    </Field.Root>
  );
}
