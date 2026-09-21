"use client";

import { useId, useState } from "react";
import { Field, Meter, PasswordInput } from "@loamui/core";
import "./recipe.css";

// This is length feedback, not an estimate of resistance to guessing.
const MIN_LENGTH = 12;

export default function Recipe() {
  const instanceId = useId();
  const [value, setValue] = useState("");
  const length = Array.from(value).length;
  const met = length >= MIN_LENGTH;
  const feedback =
    value === ""
      ? "Nothing typed yet"
      : `${length} characters. ${met ? "Length requirement met" : `${MIN_LENGTH - length} more needed`}.`;

  return (
    <Field.Root className="password-strength" id={`${instanceId}-new-password`}>
      <Field.Label>Password</Field.Label>
      <Field.Description>
        This example requires at least {MIN_LENGTH} characters and checks length only. Use a unique
        password; meeting this requirement does not establish its strength.
      </Field.Description>
      <PasswordInput
        name="password"
        autoComplete="new-password"
        aria-describedby={`${instanceId}-new-password-description ${instanceId}-new-password-rules`}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <div className="strength">
        <Meter
          value={Math.min(length, MIN_LENGTH)}
          min={0}
          max={MIN_LENGTH}
          low={MIN_LENGTH - 0.5}
          high={MIN_LENGTH - 0.5}
          optimum={MIN_LENGTH}
          label="Password length"
          aria-valuetext={feedback}
        />
        <span aria-live="polite">
          <span aria-hidden="true">{value ? `${length} characters` : ""}</span>
          <span className="loam-VisuallyHidden">{value ? feedback : ""}</span>
        </span>
      </div>
      <ul className="rules" id={`${instanceId}-new-password-rules`} role="list">
        <li data-met={met || undefined}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            {met ? (
              <path
                d="M3 8.5 6.5 12 13 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
          At least {MIN_LENGTH} characters
          <span className="loam-VisuallyHidden">, {met ? "met" : "not met"}</span>
        </li>
      </ul>
    </Field.Root>
  );
}
