---
title: Price
description: A monetary amount, written for people.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Price

A monetary amount written for people, with the number kept for machines.

## Import

```tsx
import { Price } from "@loamui/core";
```

## Usage

### A plan's price

Price sizes nothing itself: it takes the font of whatever it sits in, here a paragraph set large and bold. What the amount covers is written as its children and set small beside it.

```tsx
<p style={{ fontSize: "var(--loam-text-2xl)", fontWeight: 700 }}>
  <Price value={24} currency="GBP">
    per seat, per month
  </Price>
</p>
```

### Whole and fractional amounts

Whole amounts drop their zeros and fractional ones keep them, so £24 and £9.50 sit together without either looking wrong. The figures are lining and tabular, so a column of them stays straight.

```tsx
<ul>
  <li>
    <Price value={9.5} currency="GBP" />
  </li>
  <li>
    <Price value={120} currency="GBP" />
  </li>
  <li>
    <Price value={1250.25} currency="GBP" />
  </li>
</ul>
```

### Locales

The locale decides grouping, the decimal mark and where the symbol sits. Set it to the page's language rather than leaving it to the reader's device, so the server and the browser write the same text.

```tsx
<Price value={1250.5} currency="EUR" locale="de-DE" />
<Price value={1250.5} currency="EUR" locale="fr-FR" />
<Price value={1250} currency="JPY" locale="ja-JP" />
```

### Signed amounts

A summary of changes shows which way each one goes. signDisplay is Intl.NumberFormat's: exceptZero writes a sign on every non-zero amount, so a credit and a charge read apart at a glance.

```tsx
<dl>
  <dt>Prorated credit</dt>
  <dd>
    <Price value={2} currency="GBP" signDisplay="exceptZero" />
  </dd>
  <dt>New plan</dt>
  <dd>
    <Price value={-4.65} currency="GBP" signDisplay="exceptZero" />
  </dd>
</dl>
```

## When to use it

- Any amount of money the reader is meant to weigh: a plan's price, a line in an order, a total, a figure in a table column.
- Where prices sit in a column or a row and must line up: the tabular figures do that without a monospace face.

## When not to

- For numbers that are not money (a count, a percentage, a duration). Write them as text, or as a plain <data> element if a machine needs the value.
- For a running-text mention where the amount is incidental ("it cost about £20"). The element adds machine value and figure styling the sentence does not need.

## How it works

### The amount takes the type around it

A price is a headline on a plan and a cell in a table, and the same element serves both because it sets no size, weight or family of its own. Put it inside the heading, paragraph or cell and style that; the amount inherits.

### Zeros only when they mean something

£24.00 says the pence matter and there are none; £24 says the pence do not matter. Whole amounts drop their zeros and fractional amounts keep theirs, so £9.50 keeps its trailing zero and a list of both reads cleanly.

### Locale is a fact of the page, not a guess

The amount is written the way the page's language writes money. The locale defaults to a fixed value rather than the reader's device so the server and the browser produce the same text; set it from the page's language.

## Accessibility

- Renders a <data> element: inline text to assistive tech, read as the amount's written form ("£24 per seat, per month"), with the plain number in its value attribute for scripts and agents.
- The qualifier is real text in a <small>, not a title or aria-label, so it is read in order and copied with the amount.
- Nothing about the amount is carried by colour or size alone; the figure is the text.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | The amount in the currency's major unit: 24 for £24, 9.5 for £9.50. |
| `currency` | `string` | — | The ISO 4217 currency code: "GBP", "USD", "EUR". |
| `locale` | `string` | `"en"` | The BCP 47 locale the amount is written in: grouping, decimal mark and symbol placement. Set it to the page's language. |
| `signDisplay` | `"auto" \| "always" \| "never" \| "exceptZero" \| "negative"` | `"auto"` | When the sign is written, as Intl.NumberFormat has it: auto marks negative amounts only; exceptZero marks every non-zero amount, for a summary of credits and charges. |
| `children` | `ReactNode` | — | What the amount covers ("per seat, per month"), written after it in small text. |
| `...others` | `HTMLAttributes<HTMLDataElement>` | — | All native <data> props are forwarded. |

