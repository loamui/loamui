---
title: Sign in with errors
description: A sign-in form that helps people correct missing or mistyped details, with a focused error summary and matching field messages.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Sign in with errors

A sign-in form that helps people correct missing or mistyped details, with a focused error summary and matching field messages.

A recipe in **Forms**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Button`, `Card`, `Checkbox`, `ErrorSummary`, `Field`, `Input`, `PasswordInput`
- Tags: validation, error summary, login, account
- Live: https://loamui.com/recipes/forms/sign-in-with-errors

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Submit the empty form or a mistyped email to try local validation. Pass action for your native POST endpoint; the default is /sign-in. On rejection, render a fresh Example with initialResponse: { values: { email, remember }, errors: { form: 'Email address and password do not match' } }. Use errors.email or errors.password for server field-validation messages. General authentication or service errors belong in errors.form; never reveal whether an account exists. The response restores email and the session choice, focuses the summary after hydration and never accepts or echoes a password. initialResponse initializes a new POST response, not an asynchronous update to a mounted form. Handle authentication and server validation at the endpoint; after success, establish the session and redirect to the signed-in destination. Set an Error: page-title prefix on rejection. Connect the recovery, registration and persistent-session routes. The recipe does not simulate authentication; test the real endpoint with password managers and mobile keyboards.

## When to use

Use for email-and-password sign-in when validation needs a summary as well as errors beside each field. Errors appear after submission, so people can finish entering their details before being asked to correct them.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** A native POST form retains username and current-password autocomplete, and native validation blocks invalid submissions before and after hydration; React handles invalid events to replace browser popups with the error summary, reading built-in validity states without an email regex or additional password rules. Recipe styles sit in loamui.components inside donut scopes: the outer container lets Card and the form resolve fluid tokens locally, element styles supply the heading typography, and grid gap owns form spacing. The action region declares --loam-context: primary, and rendering Field.Error makes the field invalid through the primitive’s detection, so the recipe neither sets aria-invalid manually nor repaints an input border.
- **Accessible.** The form stays enabled while people enter details; errors are reported after a validation attempt, without showing new errors during typing. Correcting a native constraint error clears its message and summary link without moving focus; server errors remain until a new validation attempt. A failed submit mounts a focused ErrorSummary; each further failed attempt focuses it again. Its links focus the corresponding controls through core's wiring. useId keeps the targets unique, values remain entered, and the persistent-session checkbox starts unchecked.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Button](https://loamui.com/docs/components/button.md)
- [Card](https://loamui.com/docs/components/card.md)
- [Checkbox](https://loamui.com/docs/components/checkbox.md)
- [ErrorSummary](https://loamui.com/docs/components/error-summary.md)
- [Field](https://loamui.com/docs/components/field.md)
- [Input](https://loamui.com/docs/components/input.md)
- [PasswordInput](https://loamui.com/docs/components/password-input.md)

## Recipe.tsx

```tsx
"use client";

import { useId, useState, type FormEvent } from "react";
import { Button, Card, Checkbox, ErrorSummary, Field, Input, PasswordInput } from "@loamui/core";
import "./recipe.css";

type SignInResponse = {
  values: { email: string; remember: boolean };
  errors: { email?: string; password?: string; form?: string };
};

export default function Recipe({
  action = "/sign-in",
  initialResponse,
}: {
  action?: string;
  initialResponse?: SignInResponse;
}) {
  const id = useId();
  const [validation, setValidation] = useState({
    email: initialResponse?.errors.email ?? "",
    password: initialResponse?.errors.password ?? "",
    form: initialResponse?.errors.form ?? "",
    attempt: 0,
  });

  function handleValidation(event: FormEvent<HTMLFormElement>) {
    const fields = event.currentTarget.elements;
    const email = fields.namedItem("email") as HTMLInputElement;
    const password = fields.namedItem("password") as HTMLInputElement;
    const emailError = email.validity.valueMissing
      ? "Enter your email address"
      : email.validity.typeMismatch
        ? "Enter an email address in the correct format, like name@example.com"
        : "";
    const passwordError = password.validity.valueMissing ? "Enter your password" : "";

    if (emailError || passwordError) event.preventDefault();
    setValidation((previous) => ({
      email: emailError,
      password: passwordError,
      form: "",
      attempt: previous.attempt + 1,
    }));
  }

  function handleCorrection(event: FormEvent<HTMLFormElement>) {
    const control = event.target;
    if (!(control instanceof HTMLInputElement) || !control.validity.valid) return;
    const { name } = control;
    if (name !== "email" && name !== "password") return;
    setValidation((previous) =>
      previous.attempt > 0 && previous[name] ? { ...previous, [name]: "" } : previous,
    );
  }

  return (
    <div className="sign-in-with-errors">
      <Card>
        <form
          action={action}
          method="post"
          aria-labelledby={`${id}-title`}
          onInvalid={handleValidation}
          onSubmit={handleValidation}
          onInput={handleCorrection}
        >
          <h1 id={`${id}-title`}>Sign in</h1>
          {(validation.email || validation.password || validation.form) && (
            <ErrorSummary.Root key={validation.attempt}>
              <ErrorSummary.Title />
              {validation.form && <p>{validation.form}</p>}
              {(validation.email || validation.password) && (
                <ErrorSummary.List>
                  {validation.email && (
                    <ErrorSummary.Item href={`#${id}-email`}>{validation.email}</ErrorSummary.Item>
                  )}
                  {validation.password && (
                    <ErrorSummary.Item href={`#${id}-password`}>
                      {validation.password}
                    </ErrorSummary.Item>
                  )}
                </ErrorSummary.List>
              )}
            </ErrorSummary.Root>
          )}
          <Field.Root invalid={Boolean(validation.email && validation.email)} id={`${id}-email`}>
            <Field.Label>Email address</Field.Label>
            {validation.email && <Field.Error>{validation.email}</Field.Error>}
            <Input
              name="email"
              defaultValue={initialResponse?.values.email}
              type="email"
              dir="ltr"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="email"
              required
            />
          </Field.Root>
          <Field.Root
            invalid={Boolean(validation.password && validation.password)}
            id={`${id}-password`}
          >
            <Field.Label>Password</Field.Label>
            {validation.password && <Field.Error>{validation.password}</Field.Error>}
            <PasswordInput name="password" autoComplete="current-password" required />
          </Field.Root>
          <a href="/forgot-password">Forgot your password?</a>
          <Field.Item>
            <Field.Label>
              <Checkbox
                name="remember"
                defaultChecked={initialResponse?.values.remember ?? false}
              />{" "}
              Keep me signed in
            </Field.Label>
          </Field.Item>
          <div className="actions">
            <Button type="submit">Sign in</Button>
          </div>
          <p>
            New to Hedgerow? <a href="/sign-up">Create an account</a>
          </p>
        </form>
      </Card>
    </div>
  );
}
```

## recipe.css

```css
@scope (.sign-in-with-errors) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      container-type: inline-size;
      inline-size: 100%;
      margin-inline: auto;
      max-inline-size: 28rem;
    }
  }
}

@scope (.sign-in-with-errors form) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-s);
      grid-template-columns: minmax(0, 1fr);
      overflow-wrap: anywhere;
    }

    h1,
    p {
      margin-block: 0;
    }

    div.actions {
      --loam-context: primary;

      display: block grid;
    }

    p {
      color: var(--loam-color-fg-muted);
      font-size: var(--loam-text-sm);
      text-align: center;
    }
  }
}
```

