---
title: Textarea
description: Multi-line text input.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Textarea

The multi-line text box. Compose it inside a Field for its label, description and error.

## Import

```tsx
import { Field, Textarea } from "@loamui/core";
```

## Usage

### Basic usage

Inside Field.Root the textarea reads its id from the field, so Field.Label is wired without any props.

```tsx
<Field.Root>
  <Field.Label>Notes</Field.Label>
  <Textarea />
</Field.Root>
```

### With description

Field.Description is linked to the textarea through aria-describedby, so the hint is read with the field. State a length limit here, before the answer is written, rather than in an error after it.

```tsx
<Field.Root>
  <Field.Label>Bio</Field.Label>
  <Field.Description>A short description for your public profile.</Field.Description>
  <Textarea required />
</Field.Root>
```

### Error state

A Field.Error before the control marks the field invalid and is announced: the message's presence is the state.

```tsx
<Field.Root invalid>
  <Field.Label>Message</Field.Label>
  <Field.Error>Message must be 20 characters or more</Field.Error>
  <Textarea defaultValue="Too short" />
</Field.Root>
```

## When to use it

- For multi-line, free-form text: messages, comments, addresses, notes.
- When the expected input is longer than a single line or the user may want to add line breaks.

## When not to

- For single-line values (names, emails): use Input.
- For a fixed set of options: use Select, Radio or Checkbox.

## How it works

### Auto-grow is built in

Where the platform supports field-sizing: content, the field grows with the answer and then scrolls (no JS, no measuring). rows is real either way: it is the field's height where auto-grow is unsupported, and where it is supported the field starts at that many lines and grows to ten, or to its rows when asked for more. Body-sized text uses a 1.5 line height for reading longer answers, and the native textarea owns the tappable padding. Set rows to match the expected answer: three rows asks for a note, ten invites an essay.

### Keep resize on

The field is user-resizable in the block direction (resize: block), so anyone can make room for a long answer without horizontal drag ever breaking the layout. Don't remove it with CSS: taking resize away removes user control and gains nothing. Disabled fields drop the handle automatically.

### Limits live in the description

State a length limit up front in the Field.Description (“Your answer must be 200 characters or fewer”) rather than springing it as an error after the user has written too much. LoamUI does not ship a live character counter, so keep the validation message in exactly the words the description used: the rule then reads the same before and after the mistake.

### Never disable copy and paste

People draft long answers elsewhere and paste them in; blocking paste, or clearing the field on validation, punishes exactly the users taking the most care. The field keeps whatever arrives, and errors describe the rule the text broke.

## Accessibility

- Inside a Field.Root it self-wires, so the label, description and error share one accessible wiring (label tied by id, aria-describedby, aria-invalid). See the Field page.
- Field.Error uses role="alert" so the message is announced when it appears.
- Resizes vertically only, so horizontal resize can't break the layout; give enough default rows to hint at the expected length.

## Error messages

| Situation | Message |
| --- | --- |
| The text contains a disallowed character | `[Label] must not include [characters]` |
| The field is empty | `Enter [whatever the label asks for]` |
| The answer is too long | `[Label] must be [N] characters or fewer` |
| The answer is too short | `[Label] must be [N] characters or more` |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `number` | `3` | Visible text rows: the field's height, and where the platform grows the field with its content, the height it starts at. |
| `wrapperProps` | `PartProps<"div">` | — | Props for the bordered box around the textarea. className, style, ref and every other prop land on the <textarea> itself; this is the one way to reach the box. |
| `...others` | `TextareaHTMLAttributes` | — | All native <textarea> props, and ref, are forwarded to the <textarea>. |

