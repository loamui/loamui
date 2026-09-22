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
