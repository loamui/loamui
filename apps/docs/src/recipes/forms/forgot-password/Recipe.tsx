"use client";

import { useId } from "react";
import { Button, Card, Field, Input } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card render={<div className="forgot-password" />}>
      <h1 id={`${instanceId}-forgot-password-title`}>Forgot your password?</h1>
      <p className="description">
        Enter the email address you signed up with. If it has an account, we will send a link to set
        a new password.
      </p>
      <form
        action="/forgot-password"
        method="post"
        aria-labelledby={`${instanceId}-forgot-password-title`}
      >
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Input name="email" type="email" autoComplete="email" inputMode="email" required />
        </Field.Root>
        <div className="actions">
          <Button type="submit">Send reset link</Button>
        </div>
      </form>
      <p className="footer">
        <a href="/sign-in">Back to sign in</a>
      </p>
    </Card>
  );
}
