"use client";

import { Field, PasswordInput } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <Field.Root className="forgot-password-on-label">
      <div className="label-row">
        <Field.Label>Password</Field.Label>
        <a href="/forgot-password">Forgot your password?</a>
      </div>
      <PasswordInput name="password" autoComplete="current-password" required />
    </Field.Root>
  );
}
