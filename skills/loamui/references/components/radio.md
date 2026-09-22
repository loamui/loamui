---
title: Radio
description: Choose one option from a set.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Radio

A single choice from a small set of visible, mutually exclusive options.

## Import

```tsx
import { Field, Radio, RadioGroup } from "@loamui/core";
```

## Usage

### Basic group

A RadioGroup.Root shares one name so only one option can be selected; RadioGroup.Legend names the set.

```tsx
<RadioGroup.Root defaultValue="system">
  <RadioGroup.Legend>Theme</RadioGroup.Legend>
  <Field.Item>
    <Field.Label>
      <Radio value="system" /> System
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="light" /> Light
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="dark" /> Dark
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>
```

### With descriptions

Each option can carry helper text under its label.

```tsx
<RadioGroup.Root>
  <RadioGroup.Legend>Delivery</RadioGroup.Legend>
  <Field.Item>
    <Field.Label>
      <Radio value="standard" /> Standard
    </Field.Label>
    <Field.Description>Arrives in 3-5 business days.</Field.Description>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="express" /> Express
    </Field.Label>
    <Field.Description>Guaranteed next-day delivery.</Field.Description>
  </Field.Item>
</RadioGroup.Root>
```

### Horizontal

Lay the options out in a row only when there are two, short options. More than that, or longer labels, read better stacked.

```tsx
<RadioGroup.Root orientation="horizontal">
  <RadioGroup.Legend>Contact preference</RadioGroup.Legend>
  <Field.Item>
    <Field.Label>
      <Radio value="email" /> Email
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="phone" /> Phone
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>
```

### Disabled option

Disable a single Radio to keep an unavailable option visible in the set. The rest of the group stays selectable.

```tsx
<RadioGroup.Root>
  <RadioGroup.Legend>Plan</RadioGroup.Legend>
  <Field.Item>
    <Field.Label>
      <Radio value="basic" /> Basic
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="pro" /> Pro
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="legacy" disabled /> Legacy
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>
```

### Group description and error

RadioGroup.Description and RadioGroup.Error are joined to the group with aria-describedby. Set invalid on Root for validation: the message and the danger rings sit on the fieldset and its radios, and every choice stays selectable.

```tsx
<RadioGroup.Root invalid>
  <RadioGroup.Legend>Plan</RadioGroup.Legend>
  <RadioGroup.Description>You can change it later.</RadioGroup.Description>
  <RadioGroup.Error>Select a plan to continue</RadioGroup.Error>
  <Field.Item>
    <Field.Label>
      <Radio value="basic" /> Basic
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="pro" /> Pro
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="legacy" /> Legacy
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>
```

### In another language

The group's own words, the optional marker after the legend and the hidden prefix before an error, come from labels on the Root.

```tsx
<RadioGroup.Root invalid labels={{ optional: "(facultatif)", errorPrefix: "Erreur : " }}>
  <RadioGroup.Legend optional>Formule</RadioGroup.Legend>
  <RadioGroup.Error>Choisissez une formule</RadioGroup.Error>
  <Field.Item>
    <Field.Label>
      <Radio value="basic" /> Essentielle
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="pro" /> Pro
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>
```

## When to use it

- For choosing exactly one option from a small, visible set (roughly 2 to 5).
- Always inside a RadioGroup.Root, which shares a name and labels the set with a <fieldset>/<legend>.

## When not to

- For many options: a Select is more compact.
- For selecting several options: use Checkbox.
- For a single on/off: use Checkbox or Switch.

## How it works

### A native radio, styled by accent-color

This is a plain <input type="radio">: no custom dot. The elements layer paints it with the platform's own accent-color (the neutral primary); selection, keyboard arrow-cycling and forced-colours support come from the browser. Field.Item supplies label and description associations; RadioGroup shares the native name and selection state.

### Never pre-select

A group with a defaultValue lets users miss the question entirely and submit an answer they never gave, and once any radio is selected, the group can never be returned to unanswered. So when every option might be wrong, offer an explicit 'None of the above' option rather than leaving the user stuck. Omit defaultValue so the first selection is always a deliberate choice; reserve a default for the rare setting with one safe, overwhelmingly common value.

### Order the options

List options alphabetically by default, so the order carries no editorial weight. Ordering by expected popularity needs extreme caution: it nudges users toward the top answers and, repeated across every form, can entrench the very distribution it assumed. Orders with intrinsic domain meaning (size, severity, date) are fine.

### Controls sit left of labels

Compose the radio before its label text, keeping every control on the reading edge where screen-magnifier users panning a zoomed viewport will find it next to the text they are reading. Don't restyle labels to the other side: a right-hand control drifts out of the magnified view entirely.

## Accessibility

- RadioGroup.Root renders a native <fieldset> with a <legend>, the accessible way to name a group: screen readers announce the legend when a radio is focused.
- Radios share one name so the browser enforces single-selection and arrow-key navigation natively.
- RadioGroup.Root invalid sets aria-invalid on the fieldset; description and error IDs register after hydration, which carries role="radiogroup", the one place ARIA allows aria-invalid for radios. Required native groups take the same state after a submit attempt and clear it after a selection. The individual radios never claim it; their danger rings are pure CSS answering the group state.
- Disabled is detected on the native input (:has(input:disabled) on the row), never declared on a wrapper.

## Error messages

| Situation | Message |
| --- | --- |
| A yes/no question is unanswered | `Select yes if [the thing is true]` |
| A choice is unanswered | `Select [whatever the legend asks for]` |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label / description` | `ReactNode` | — | Optional content for a complete labelled row. Omit both when composing the control inside Field.Label. |
| `wrapperProps` | `Omit<PartProps<"label">, "children" \| "htmlFor">` | — | Props for the row rendered with label or description. className, style and ref on the component target its native input. |
| `...others` | `InputHTMLAttributes` | — | Native input props except type and size, including ref. Field.Item scopes each option’s label and description. |

## Parts

### RadioGroup.Root

The group: a Fieldset.Root with role="radiogroup" that shares a name and the selection with the <Radio> options inside it, at any depth. Native <fieldset> props and ref are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `invalid` | `boolean` | `false` | Explicit validation state, available in server HTML. Message content is independent; supply aria-describedby for server-rendered associations. |
| `name` | `string` | — | Shared name for all radios (auto-generated if omitted). |
| `value` | `string` | — | Controlled selected value (pair with onChange). |
| `defaultValue` | `string` | — | Initial selected value for uncontrolled usage. |
| `onChange` | `(value: string) => void` | — | Fires with the newly selected value. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Layout direction of the options. |
| `labels` | `{ optional?: ReactNode; errorPrefix?: ReactNode }` | `{ optional: "(optional)", errorPrefix: "Error: " }` | The group's own words, read by the Legend and the Error. Pass them in the page's language. |

### RadioGroup.Legend

The group's name: Fieldset.Legend, so optional marks the group optional in words. Native <legend> props and ref are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `optional` | `boolean` | `false` | Appends labels.optional ("(optional)"); optional is marked in words, not with an asterisk. |

### RadioGroup.Description

Helper text under the legend, joined to the group with aria-describedby. Native <p> props and ref are forwarded.

### RadioGroup.Error

The group's error, announced with role="alert". Validation state is supplied by Root; empty content renders nothing. Native <p> props and ref are forwarded.

