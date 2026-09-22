---
title: Fieldset
description: Group controls under a semantic label.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Fieldset

Groups related controls under a shared, semantic label using a native fieldset and legend.

## Import

```tsx
import { Fieldset, RadioGroup, Checkbox, Radio } from "@loamui/core";
```

## Usage

### Grouping checkboxes

The legend names the group in the accessibility tree, the correct way to label a set of related controls.

```tsx
<Fieldset.Root>
  <Fieldset.Legend>Email notifications</Fieldset.Legend>
  <Field.Item>
    <Field.Label>
      <Checkbox defaultChecked /> Product updates
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Checkbox defaultChecked /> Security alerts
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Checkbox /> Marketing
    </Field.Label>
  </Field.Item>
</Fieldset.Root>
```

### Optional group

Mark the whole group optional in words rather than with an asterisk.

```tsx
<Fieldset.Root>
  <Fieldset.Legend optional>Interests</Fieldset.Legend>
  <Field.Item>
    <Field.Label>
      <Checkbox /> Design
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Checkbox /> Engineering
    </Field.Label>
  </Field.Item>
</Fieldset.Root>
```

### With a RadioGroup

RadioGroup.Root is a Fieldset.Root, so RadioGroup.Legend labels the set of radios.

```tsx
<RadioGroup.Root name="plan" defaultValue="pro">
  <RadioGroup.Legend>Plan</RadioGroup.Legend>
  <Field.Item>
    <Field.Label>
      <Radio value="free" /> Free
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="pro" /> Pro
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="team" /> Team
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>
```

## When to use it

- To label a set of related controls (a group of checkboxes, or a set of radios) with a single group name.
- Whenever a group of inputs needs one shared question or heading above them.

## When not to

- For a single labelled control: use Field (or a control's own label).
- As a generic layout box: Fieldset carries grouping semantics, not only spacing.

## How it works

### The legend is the question

Write the legend as the question the group answers: “How should we contact you?”, not the category “Contact”. Screen readers announce it alongside each control's own label, so every option is heard in the context of the question. That also keeps each control's label short: the shared part of the wording lives in the legend once, not in every label.

### One question per fieldset

Everything inside the fieldset is announced under the legend's name, so a fieldset holding two unrelated questions mislabels half its controls. Give each question its own fieldset, and avoid nesting them: a legend inside a legend multiplies what is read before every control. Some services go as far as one question per page with the legend as the page heading; the component follows the same one-legend-one-question rule.

## Accessibility

- Renders a native <fieldset> + <legend>: the legend is announced as the group's name when a control inside receives focus.
- This is preferred over a <div role="group"> with aria-labelledby: the native semantics are better supported.
- The browser's default fieldset border, margin and padding are reset so it composes with any native CSS layout.

## Parts

### Fieldset.Root

Renders a native <fieldset> grouping the controls; native <fieldset> props and ref are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `labels` | `{ optional?: ReactNode }` | `{ optional: "(optional)" }` | The Fieldset's own words, read by the Legend: the text after an optional legend. Pass it in the page's language. |

### Fieldset.Legend

The accessible group label; native <legend> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `optional` | `boolean` | `false` | Appends labels.optional ("(optional)"). Optional is marked in words, not with an asterisk. |

