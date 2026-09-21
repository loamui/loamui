"use client";

import { useId } from "react";
import { Button, Card, Checkbox, Field, Input, PasswordInput } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card render={<div className="sign-up" />}>
      <h1 id={`${instanceId}-sign-up-title`}>Create an account</h1>
      <form action="/sign-up" method="post" aria-labelledby={`${instanceId}-sign-up-title`}>
        <Field.Root>
          <Field.Label>Full name</Field.Label>
          <Input name="name" autoComplete="name" required />
        </Field.Root>
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Field.Description>Order updates and your membership card come here.</Field.Description>
          <Input name="email" type="email" autoComplete="email" inputMode="email" required />
        </Field.Root>
        <Field.Root>
          <Field.Label>Password</Field.Label>
          <Field.Description>
            At least 12 characters. A few unrelated words are easier to remember than one word with
            numbers in it.
          </Field.Description>
          <PasswordInput name="password" autoComplete="new-password" minLength={12} required />
        </Field.Root>
        <Field.Item>
          <Field.Label>
            <Checkbox name="consent" required />{" "}
            {
              <>
                I agree to the <a href="/terms">membership terms</a> and the{" "}
                <a href="/privacy">privacy policy</a>
              </>
            }
          </Field.Label>
        </Field.Item>
        <div className="actions">
          <Button type="submit">Create account</Button>
        </div>
      </form>
      <p className="footer">
        Already a member? <a href="/sign-in">Sign in</a>
      </p>
    </Card>
  );
}
