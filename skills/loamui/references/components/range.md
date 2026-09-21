---
title: Range
description: Pick a numeric value from a range.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Range

Pick a numeric value from a continuous range. Compose it inside a Field for its label, description and error.

## Import

```tsx
import { Field, Range } from "@loamui/core";
```

## Usage

### Basic usage

Rendered bare, the control needs an aria-label; a Field.Label (below) is the usual way to name it.

```tsx
<Range.Control defaultValue={40} aria-label="Value" />
```

### Labelled inside a Field

Wrap the control in Field.Root: it reads its id, description and error wiring from the field, the composition pattern shared by all form controls.

```tsx
<Field.Root>
  <Field.Label>Volume</Field.Label>
  <Field.Description>Applies to alerts only.</Field.Description>
  <Range.Control defaultValue={70} />
</Field.Root>
```

### Steps

Snap to increments with the step prop.

```tsx
<Field.Root>
  <Field.Label>Fertiliser (kg)</Field.Label>
  <Range.Control min={0} max={100} step={10} defaultValue={30} />
</Field.Root>
```

### Marks

marks are points on the track: they go to a <datalist> the input references, so the thumb snaps to them, and the stylesheet draws a tick under each.

```tsx
<Field.Root>
  <Field.Label>Zoom</Field.Label>
  <Range.Control min={0} max={100} defaultValue={50} marks={[{ value: 0 }, { value: 25 }, { value: 50 }, { value: 75 }, { value: 100 }]} />
</Field.Root>
```

### Marks with labels

A mark's label is written under its tick, aligned to where the thumb sits at that value. Label the ends, or the values that mean something; the ticks in between can stay bare.

```tsx
<Field.Root>
  <Field.Label>Fertiliser</Field.Label>
  <Range.Control
    min={0}
    max={100}
    step={25}
    defaultValue={50}
    marks={[
      { value: 0, label: "None" },
      { value: 50, label: "Standard" },
      { value: 100, label: "Heavy" },
    ]}
  />
</Field.Root>
```

### Value above the thumb

Range.Root carries the value between the Range and a Range.Output, a native <output for> bound to the input, which the stylesheet places above the thumb. labels.value formats the number.

```tsx
<Field.Root>
  <Field.Label>Volume</Field.Label>
  <Range.Root>
    <Range.Control defaultValue={70} />
    <Range.Output labels={{ value: (n) => `${n}%` }} />
  </Range.Root>
</Field.Root>
```

### Bounds and step

min, max and step are the platform's own; the output and the marks read them from the input, so the same anatomy holds for any range.

```tsx
<Field.Root>
  <Field.Label>Year</Field.Label>
  <Range.Root>
    <Range.Control min={1990} max={2030} step={5} defaultValue={2010} marks={[{ value: 1990, label: "1990" }, { value: 2010, label: "2010" }, { value: 2030, label: "2030" }]} />
    <Range.Output labels={{ value: String }} />
  </Range.Root>
</Field.Root>
```

### Disabled

disabled reaches the native input: the track and thumb dim, the value stays readable, and the control leaves the Tab sequence.

```tsx
<Field.Root>
  <Field.Label>Alert volume</Field.Label>
  <Range.Control defaultValue={50} disabled />
</Field.Root>
```

## When to use it

- For imprecise, pick-a-feel values where the position matters more than the exact number: volume, brightness, intensity.
- When the effect of the value is visible as it changes, so users steer by the result rather than the figure.

## When not to

- For exact numbers the user already knows (an amount, a year, a reference). Use Input with inputMode="numeric" or "decimal"; landing on one precise value on a track is slow and error-prone, especially on touch. A small count adjusted one at a time is QuantityInput.
- For choosing among a few discrete options. Use RadioGroup, where every option is visible and labelled.

## How it works

### Show the current value

The thumb shows an approximate position. Display the chosen number with Range.Output, a native <output> bound to the input that follows the thumb. Field.Label accepts any content and the control is stateless, so the value can instead ride in the label, driven by value and onChange.

```tsx
const [volume, setVolume] = useState(70);

<Field.Root>
  <Field.Label>Volume: {volume}</Field.Label>
  <Range.Control
    value={volume}
    onChange={(e) => setVolume(e.target.valueAsNumber)}
  />
</Field.Root>
```

### Steps match the precision users care about

step sets the smallest move a user can make, so match it to differences that actually matter: nobody sets fertiliser to 43 kg. A coarser step makes every reachable value a bigger target: easier with arrow keys, a mouse, or a thumb. If users need finer precision than a comfortable step allows, the value is exact and belongs in an Input.

## Accessibility

- Renders a native <input type="range">: arrow keys adjust the value and Home/End jump to the ends, with the current value announced. There is no custom key handling to maintain.
- Always give it an accessible name: a Field.Label in the surrounding Field.Root, or an aria-label when rendering it bare.
- Assistive tech hears the value change as it moves; sighted users have no equivalent unless you render the value visibly: Range.Output, or the value in the label.
- Range.Output is a native <output for>, so it is bound to the input and announced as a status; marks are a real <datalist>, which the platform snaps to, and the drawn ticks and labels are a picture of it, hidden from assistive technology rather than exposed as a list of options after the slider.

## Parts

### Range.Control

The native range input. It self-wires inside Field.Root; Range.Root is optional when composing an output.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `min` | `number` | `0` | Minimum value. |
| `max` | `number` | `100` | Maximum value. |
| `step` | `number` | `1` | Increment between valid values. |
| `defaultValue` | `number` | — | Initial value for uncontrolled usage. |
| `marks` | `Array<{ value: number; label?: string }>` | — | Points on the track: forwarded to a <datalist> the input references, drawn as ticks under the track with each label beneath its tick. |
| `...others` | `InputHTMLAttributes` | — | All native <input type="range"> props are forwarded. |

### Range.Root

The optional <div> wrapper that carries the value between Range and Range.Output; native <div> props are forwarded. Not needed for a range without an output.

### Range.Output

The current value as a native <output for> bound to the input, placed above the thumb. Belongs inside Range.Root; native <output> props are forwarded, and children replace the formatted value.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `labels` | `{ value?: (value: number) => string }` | `{ value: (n) => new Intl.NumberFormat().format(n) }` | Formats the value the output shows. |

## Custom properties

| Property | Syntax | Default | Description |
| --- | --- | --- | --- |
| `--loam-range-thumb-size` | `CSS length` | `calc(1.25 * var(--loam-text-sm))` | The thumb's diameter. The marks and the output read the same property to sit over the thumb, so set it on the Range's ancestor, never on the input alone, and give it a length rather than an em: they read it from a smaller font size. |

