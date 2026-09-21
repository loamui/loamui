"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, Input } from "@loamui/core";

export function FieldComposeDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Description>We&apos;ll only use this to reply.</Field.Description>
        <Input />
      </Field.Root>
    </div>
  );
}

export function FieldErrorDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Error>
          Enter an email address in the correct format, like name@example.com
        </Field.Error>
        <Input defaultValue="not-an-email" />
      </Field.Root>
    </div>
  );
}

export function FieldOptionalDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label optional>Company</Field.Label>
        <Input />
      </Field.Root>
    </div>
  );
}

export function FieldCustomControlDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Amount</Field.Label>
        <Field.Description>A bare native input, not a LoamUI control.</Field.Description>
        <Field.Control render={(props) => <input {...props} inputMode="decimal" />} />
      </Field.Root>
    </div>
  );
}

export function FieldFormDemo() {
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setErrors({
      name: data.get("name") ? undefined : "Enter your full name",
      email: data.get("email") ? undefined : "Enter your email address",
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      style={{ display: "grid", gap: "var(--loam-space-s)", maxInlineSize: "22rem" }}
    >
      <Field.Root invalid={Boolean(errors.name)}>
        <Field.Label>Full name</Field.Label>
        <Field.Error>{errors.name}</Field.Error>
        <Input name="name" autoComplete="name" />
      </Field.Root>
      <Field.Root invalid={Boolean(errors.email)}>
        <Field.Label>Email address</Field.Label>
        <Field.Description>We&apos;ll only use this to reply.</Field.Description>
        <Field.Error>{errors.email}</Field.Error>
        <Input name="email" type="email" autoComplete="email" />
      </Field.Root>
      <div>
        <Button type="submit">Save and continue</Button>
      </div>
    </form>
  );
}
