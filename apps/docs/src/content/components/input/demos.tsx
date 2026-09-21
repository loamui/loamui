"use client";

import { Button, Field, Input } from "@loamui/core";

export function InputBasicDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input />
      </Field.Root>
    </div>
  );
}

export function InputDisabledDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Account ID</Field.Label>
        <Input defaultValue="acct_8f2c" disabled />
      </Field.Root>
    </div>
  );
}

export function InputContainersDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--loam-space-s)", inlineSize: "100%" }}>
      <div
        style={{
          containerType: "inline-size",
          inlineSize: "min(100%, 16rem)",
          padding: "var(--loam-space-xs)",
          border: "1px dashed var(--loam-color-line)",
          borderRadius: "var(--loam-radius-md)",
        }}
      >
        <Field.Root>
          <Field.Label>In a narrow container</Field.Label>
          <Input />
        </Field.Root>
      </div>
      <div
        style={{
          containerType: "inline-size",
          inlineSize: "min(100%, 30rem)",
          padding: "var(--loam-space-xs)",
          border: "1px dashed var(--loam-color-line)",
          borderRadius: "var(--loam-radius-md)",
        }}
      >
        <Field.Root>
          <Field.Label>In a wide one</Field.Label>
          <Input />
        </Field.Root>
      </div>
    </div>
  );
}

export function InputDescriptionDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Username</Field.Label>
        <Field.Description>This will be your public handle.</Field.Description>
        <Input required />
      </Field.Root>
    </div>
  );
}

export function InputErrorDemo() {
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

export function InputNativeValidationDemo() {
  return (
    <form
      style={{
        display: "grid",
        gap: "var(--loam-space-xs)",
        maxInlineSize: "20rem",
        inlineSize: "100%",
      }}
      onSubmit={(event) => event.preventDefault()}
    >
      <Field.Root>
        <Field.Label>Work email</Field.Label>
        <Input type="email" required />
      </Field.Root>
      <Button type="submit">Check email</Button>
    </form>
  );
}

export function InputNumericDemo() {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--loam-space-xs)",
        maxInlineSize: "20rem",
        inlineSize: "100%",
      }}
    >
      <Field.Root>
        <Field.Label>Account number</Field.Label>
        <Input inputMode="numeric" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Weight in kilograms</Field.Label>
        <Input inputMode="decimal" />
      </Field.Root>
    </div>
  );
}

export function InputSectionsDemo() {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--loam-space-xs)",
        maxInlineSize: "20rem",
        inlineSize: "100%",
      }}
    >
      <Field.Root>
        <Field.Label>Handle</Field.Label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto minmax(0, 1fr)",
            alignItems: "center",
            gap: "var(--loam-space-2xs)",
          }}
        >
          <span aria-hidden="true">@</span>
          <Input />
        </div>
      </Field.Root>
      <Field.Root>
        <Field.Label>Site name on .dev</Field.Label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            alignItems: "center",
            gap: "var(--loam-space-2xs)",
          }}
        >
          <Input />
          <span aria-hidden="true">.dev</span>
        </div>
      </Field.Root>
    </div>
  );
}

export function InputSizedDemo() {
  return (
    <Field.Root>
      <Field.Label>Sort code</Field.Label>
      <Input inputMode="numeric" size={6} />
    </Field.Root>
  );
}

export function InputAutofillDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input type="email" autoComplete="email" />
      </Field.Root>
    </div>
  );
}
