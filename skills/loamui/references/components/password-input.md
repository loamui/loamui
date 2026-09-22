---
title: PasswordInput
description: A password box with a show toggle.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# PasswordInput

A password box with a toggle that shows what was typed. Compose it inside a Field for its label, description and error.

## Import

```tsx
import { Field, PasswordInput } from "@loamui/core";
```

## Usage

### Signing in

The library's Input with type password, with a Button that shows the text. The toggle sits beside the input when both fit and below it in narrower spaces. Inside Field.Root the input reads its id from the field, so Field.Label is wired without any props; autoComplete tells a password manager which password this is.

```tsx
<Field.Root>
  <Field.Label>Password</Field.Label>
  <PasswordInput name="password" autoComplete="current-password" />
</Field.Root>
```

### Making one up

autoComplete="new-password" tells a browser or password manager this is a password to make up and save, not one to look up, and stops it filling the current one. The rule lives in Field.Description, before the answer is given.

```tsx
<Field.Root>
  <Field.Label>Choose a password</Field.Label>
  <Field.Description>
    At least 12 characters. A few unrelated words are easier to remember than one word with
    numbers in it.
  </Field.Description>
  <PasswordInput name="new-password" autoComplete="new-password" />
</Field.Root>
```

### Error state

A Field.Error before the control marks the box invalid and is announced, exactly as it does for Input.

```tsx
<Field.Root invalid>
  <Field.Label>Password</Field.Label>
  <Field.Error>Enter your password</Field.Error>
  <PasswordInput name="password" autoComplete="current-password" />
</Field.Root>
```

### In another language

The toggle's words come from labels; the rest is the page's own.

```tsx
<Field.Root>
  <Field.Label>Mot de passe</Field.Label>
  <PasswordInput
    name="password"
    autoComplete="current-password"
    labels={{ show: "Afficher le mot de passe" }}
  />
</Field.Root>
```

## When to use it

- For any password the user types: signing in, making one up, confirming a change. The toggle lets a long password be checked by reading it rather than retyped.
- Inside a Field.Root, which ties the label, the rule in the description and the error together; the control self-wires from the surrounding field.

## When not to

- For a one-time code or a PIN sent to the user: it is not a secret they chose, so use Input with inputMode numeric and autoComplete one-time-code.
- Password policy belongs to your application. Explain its actual requirements beside the field and avoid strength claims based only on length.

## How it works

### Show, never confirm

A second 'confirm password' box doubles the typing and catches only the mistake the user made twice. A toggle that shows the password catches every mistake, once, and costs one press. The toggle is a Button with visible words, not an eye icon alone: it is used more when it can be read.

### One signal for the state

The toggle's name is constant, Show password, and aria-pressed says whether it is on. A button whose name changed to Hide password as well would announce the state twice, and a screen reader user pressing it would hear a different button than the one they pressed. Pressed is the one signal a toggle button gives.

### Shown as text, left alone

Once shown, the box is an ordinary text input, so the browser would happily capitalise the first letter on a phone or underline a made-up word as a spelling mistake. Both are off, always, so what the user sees is what they typed.

### Say which password it is

Pass the autofill purpose yourself: autoComplete="current-password" to sign in, "new-password" to make one up. It is the one thing a password manager needs to know to fill the right value, or to offer a generated one, and it is WCAG 1.3.5 (Identify Input Purpose).

## Accessibility

- Inside a Field.Root the input reads its id from the field, so Field.Label is a real <label> tied to it, and Field.Description and Field.Error are linked via aria-describedby; Field.Root invalid sets aria-invalid.
- The toggle is a native <button type="button"> with a constant name and aria-pressed; pressing it swaps the input between type password and type text without moving focus or changing the value.
- The box is the library's Input, so its focus ring, invalid state and forced-colours treatment are Input's own.

## Error messages

| Situation | Message |
| --- | --- |
| The field is empty | `Enter your password` |
| A new password breaks a rule | `Enter a password of at least [N] characters` |
| The password is wrong | `The email address or password is incorrect` |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `labels` | `{ show?: ReactNode }` | `{ show: "Show password" }` | The toggle's name, for another language. It never changes with the state. |
| `wrapperProps` | `PartProps<"div">` | — | Props for the row that holds the box and the toggle. className, style, ref and every other prop land on the <input> itself. |
| `...others` | `InputProps` | — | All native Input props except type are forwarded to the <input>. Compose any surrounding content explicitly. |

