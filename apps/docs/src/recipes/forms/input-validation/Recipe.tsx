"use client";

import { useState } from "react";
import { Field, Input } from "@loamui/core";
import "./recipe.css";

/** The platform's verdict, in the words of the question. */
function problem(validity: ValidityState): string | null {
  if (validity.valueMissing) return "Enter your email address";
  if (validity.typeMismatch) return "Enter an email address with an @, like rowan@example.com";
  return null;
}

export default function Recipe() {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Field.Root invalid={Boolean(touched ? error : null)} className="input-validation">
      <Field.Label>Email address</Field.Label>
      <Field.Description>Order confirmations and sowing notes go here.</Field.Description>
      <Field.Error>{touched ? error : null}</Field.Error>
      <Input
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        required
        onInput={(event) => setError(problem(event.currentTarget.validity))}
        onBlur={(event) => {
          setTouched(true);
          setError(problem(event.currentTarget.validity));
        }}
      />
    </Field.Root>
  );
}
