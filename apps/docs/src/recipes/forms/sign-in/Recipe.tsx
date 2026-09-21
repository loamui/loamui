"use client";

import { useId } from "react";
import { Button, Card, Checkbox, Field, Input, PasswordInput } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card render={<div className="sign-in" />}>
      <h1 id={`${instanceId}-sign-in-title`}>Sign in</h1>
      <form action="/sign-in" method="post" aria-labelledby={`${instanceId}-sign-in-title`}>
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Input name="email" type="email" autoComplete="email" inputMode="email" required />
        </Field.Root>
        <Field.Root>
          <Field.Label>Password</Field.Label>
          <PasswordInput name="password" autoComplete="current-password" required />
        </Field.Root>
        <Field.Item>
          <Field.Label>
            <Checkbox name="remember" /> Keep me signed in
          </Field.Label>
        </Field.Item>
        <div className="actions">
          <Button type="submit">Sign in</Button>
        </div>
      </form>
      <p className="footer">
        New to Hedgerow? <a href="/sign-up">Create an account</a>
      </p>
    </Card>
  );
}
