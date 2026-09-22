---
title: Select
description: Choose one option from a list.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Select

A native select with a fluid chevron, accessible and zero-JS. Compose it inside a Field for its label, description and error.

## Import

```tsx
import { Field, Select } from "@loamui/core";
```

## Usage

### Basic usage

Inside Field.Root the select reads its id from the field, so Field.Label is wired without any props.

```tsx
<Field.Root>
  <Field.Label>Country</Field.Label>
  <Select.Root>
    <Select.Option>Canada</Select.Option>
    <Select.Option>United Kingdom</Select.Option>
    <Select.Option>United States</Select.Option>
  </Select.Root>
</Field.Root>
```

### Starting unanswered

An unanswered start is an option like any other: a first child with an empty value, disabled so it can never be chosen. The select starts on it, so a required field the user skipped is caught, and the prompt reads muted until answered.

```tsx
<Field.Root>
  <Field.Label>Country</Field.Label>
  <Select.Root>
    <Select.Option value="" disabled>
      Pick a country
    </Select.Option>
    <Select.Option value="ca">Canada</Select.Option>
    <Select.Option value="uk">United Kingdom</Select.Option>
    <Select.Option value="us">United States</Select.Option>
  </Select.Root>
</Field.Root>
```

### Groups and disabled options

Options pass straight to the native select, so optgroup and disabled work exactly as the platform defines them.

```tsx
<Field.Root>
  <Field.Label>Instrument</Field.Label>
  <Select.Root>
    <Select.OptGroup label="Strings">
      <Select.Option>Violin</Select.Option>
      <Select.Option>Cello</Select.Option>
    </Select.OptGroup>
    <Select.OptGroup label="Brass">
      <Select.Option>Trumpet</Select.Option>
      <Select.Option disabled>Tuba (unavailable)</Select.Option>
    </Select.OptGroup>
  </Select.Root>
</Field.Root>
```

### With a description

Field.Description links to the select via aria-describedby, the same wiring every control gets inside a Field.

```tsx
<Field.Root>
  <Field.Label>Country</Field.Label>
  <Field.Description>Where you are resident for tax.</Field.Description>
  <Select.Root>
    <Select.Option>United States</Select.Option>
    <Select.Option>Canada</Select.Option>
  </Select.Root>
</Field.Root>
```

### Error state

A Field.Error before the control marks the field invalid and is announced: the message's presence is the state.

```tsx
<Field.Root invalid>
  <Field.Label>Country</Field.Label>
  <Field.Error>Select a country</Field.Error>
  <Select.Root>
    <Select.Option value="" disabled>
      Pick a country
    </Select.Option>
    <Select.Option>Canada</Select.Option>
    <Select.Option>United Kingdom</Select.Option>
    <Select.Option>United States</Select.Option>
  </Select.Root>
</Field.Root>
```

## When to use it

- For choosing one option from a longer list (roughly 5+) where showing them all would take too much space.
- When the options are familiar and the user doesn't need to compare them side by side.

## When not to

- For a small set of options the user should see at once: use Radio, which shows every choice up front.
- For yes/no or on/off: use Checkbox or Switch.
- For unrestricted text entry: use Input.

## How it works

### Start without a value

Make the first child a disabled option with an empty value, so the field starts unanswered and required validation catches an untouched select. With no such option the first real one is pre-selected, and users who skip the field silently submit an answer they never chose. Write the prompt as a native option element.

### Order the options

List options alphabetically so users can predict where an answer sits in a long menu, the reason to use a Select at all. Depart only for an order that is genuinely more useful in the domain, like months in calendar order or years newest-first.

### A select conceals its options

Until opened, the menu shows one value and hides every alternative, so users can't survey or compare the choices. The cost shows up in usability testing: people try to type into the closed control, mistake the focused option for a selected one, and struggle to operate the menu zoomed in. That is the cost that makes RadioGroup the better control for small sets. Reserve Select for long lists of familiar answers users recognise rather than weigh up.

## Accessibility

- Wraps a native <select>, so keyboard interaction, typeahead and the mobile picker come from the platform.
- Inside a Field.Root it self-wires: the label, description and error are linked via id / aria-describedby / aria-invalid, with the error announced as role="alert". See the Field page.
- A prompt is a disabled first option with an empty value, so it is never a selectable value; the select starts on it when nothing else is chosen.
- Under forced colours the danger border colour is dropped, so an invalid select carries its state as an outline in a system colour, with the focus ring offset further out.

## Error messages

| Situation | Message |
| --- | --- |
| Nothing is selected | `Select [whatever the label asks for]` |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Native <option> / <optgroup> elements, passed straight through. A leading <option value="" disabled> is the unanswered start. |
| `wrapperProps` | `PartProps<"div">` | — | Props for the box around the select, which positions the chevron. className, style, ref and every other prop land on the <select> itself; this is the one way to reach the box. |
| `...others` | `SelectHTMLAttributes` | — | All native <select> props, and ref, are forwarded to the <select>, except size (a listbox is not this component). |

