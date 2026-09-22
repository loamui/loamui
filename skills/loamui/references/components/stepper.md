---
title: Stepper
description: Where a sequence has got to, detected from the current step.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Stepper

An ordered list of steps that shows how far a sequence has got. Mark the step it has reached with aria-current and the rest is detected: the steps before it are complete, the steps after it upcoming, in paint and in words a screen reader hears.

## Import

```tsx
import { Stepper } from "@loamui/core";
```

## Usage

### Basic usage

An order under way. The one attribute the consumer sets, aria-current="step" on the second Step, decides everything else: the first step is complete (a strong marker with a check, a strong connector, and "Completed" in hidden text), the second is current (a ring, "Current step"), and the two after it are upcoming (hollow markers, muted titles). In a container 40rem or wider the steps sit in a row.

```tsx
<Stepper.Root>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title>Order placed</Stepper.Title>
    <Stepper.Description>We have your order and your payment has cleared.</Stepper.Description>
  </Stepper.Step>
  <Stepper.Step aria-current="step">
    <Stepper.Marker />
    <Stepper.Title>Being packed</Stepper.Title>
    <Stepper.Description>
      Your items are being picked and packed at the warehouse.
    </Stepper.Description>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title>Dispatched</Stepper.Title>
    <Stepper.Description>
      We will send the tracking number when the courier collects it.
    </Stepper.Description>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title>Delivered</Stepper.Title>
    <Stepper.Description>Usually two working days after dispatch.</Stepper.Description>
  </Stepper.Step>
</Stepper.Root>
```

### Stacked

The same list in a narrower container stacks, the connector running down from each marker to the next. There is no orientation prop: the list is a row when it has room and a column when it does not, so a sidebar and a page get the right shape from their width alone. To keep it stacked, give it less than 40rem.

```tsx
<div style={{ maxInlineSize: "24rem" }}>
  <Stepper.Root>…</Stepper.Root>
</div>
```

### A numbered list

With no current step there is nothing to detect and the list is a plain sequence: every marker shows its number. Here each Title renders an h3 through render, because these steps are sections of the page and belong in its outline.

```tsx
<Stepper.Root labels={{ list: "Getting started" }}>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title render={<h3 />}>Install the package</Stepper.Title>
    <Stepper.Description>npm install @loamui/core, nothing else.</Stepper.Description>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title render={<h3 />}>Import the stylesheet once</Stepper.Title>
    <Stepper.Description>At the app root; no provider, no config.</Stepper.Description>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title render={<h3 />}>Compose from parts</Stepper.Title>
    <Stepper.Description>
      Semantic markup first; a component when the element needs more.
    </Stepper.Description>
  </Stepper.Step>
</Stepper.Root>
```

### Steps the reader can go back to

In a checkout, a complete step is a page the reader may return to: its Title renders a link through render, and the link takes the Title's class, so the step looks the same and reads as a link. The current step and the upcoming ones stay plain text.

```tsx
<Stepper.Root labels={{ list: "Checkout" }}>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title render={<a href="/checkout/basket" />}>Basket</Stepper.Title>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title render={<a href="/checkout/address" />}>Delivery address</Stepper.Title>
  </Stepper.Step>
  <Stepper.Step aria-current="step">
    <Stepper.Marker />
    <Stepper.Title>Payment</Stepper.Title>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title>Review</Stepper.Title>
  </Stepper.Step>
</Stepper.Root>
```

### Other words

labels replaces the list's name and the two hidden words, so a page in another language announces its own.

```tsx
<Stepper.Root labels={{ list: "Commande", complete: "Terminée", current: "Étape en cours" }}>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title>Commande passée</Stepper.Title>
  </Stepper.Step>
  <Stepper.Step aria-current="step">
    <Stepper.Marker />
    <Stepper.Title>En préparation</Stepper.Title>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Marker />
    <Stepper.Title>Expédiée</Stepper.Title>
  </Stepper.Step>
</Stepper.Root>
```

## When to use it

- A sequence under way, an order's progress, an application's stages, a checkout, where the reader needs to know how far it has got and what comes next.
- Instructions the reader follows in order: a setup guide, an onboarding flow, with a Description under each Title.

## When not to

- A set of things with no order between them: that is a list, or a grid of cards.
- A single step: one action with an explanation is a heading and a paragraph, not a list of one.
- For a quantity such as the amount uploaded, use Progress. Stepper describes discrete stages.

## How it works

### One attribute, three states

The consumer marks the step reached with aria-current="step" and declares nothing else. The stylesheet reads the order from the list: a step with the current one somewhere after it is complete, a step after the current one is upcoming. The same selector chooses the word a screen reader hears: every Step carries both as hidden text, and the wrong one is kept out of the accessibility tree with display: none, so the server HTML already says the right thing and no script keeps a copy of the order. There is no status prop per step, because a step's state is not a fact about the step; it is where the step stands relative to the current one, and only the list knows that.

### Announced as well as painted

The check, the ring and the muted ink are for sighted readers. A screen reader hears the list itself ("2 of 4"), the title, the description and then the word: "Completed" after a complete step, "Current step" after the current one, both from labels. The marker is aria-hidden so its number is not read twice and its check never has to be described.

### Room decides the shape

The steps stack until the Root's container is 40rem wide, then sit in a row with the connector running from each marker to the next. The list declares its own container, so the shape answers the width the list actually has, in a sidebar or across a page, and there is nothing to set. A consumer who wants the list stacked gives it less room.

### A title is whatever the step needs

Stepper.Title is a span, because a progress indicator's steps are not sections of the page and should not appear in its outline. When they are, a setup guide with a paragraph under each step, render it as a heading; when a complete step is a page the reader may return to, render it as a link. The class and the state travel with it.

## Accessibility

- The Root is an <ol> named by labels.list ("Steps") unless you pass aria-label or aria-labelledby; the order is the list's own, so assistive technology announces the position of each step.
- The current step carries aria-current="step", which assistive technology announces, and the same attribute is what the stylesheet reads: the state is declared once.
- A complete step ends with hidden text from labels.complete ("Completed"), the current one with labels.current ("Current step"), so state is never colour alone. Both words are in every step; the stylesheet shows one and removes the other from the accessibility tree with display: none, from the same :has() that paints the step.
- The Marker is aria-hidden: the list carries the order and the Step the state, so the drawn number and the check add nothing a screen reader needs.
- In forced colours every marker keeps a border and the check its own paint; the ring on the current step is an outline and survives on its own; the upcoming markers and the connectors from the current step onward go dashed, so progress reads without the fills.

## Parts

### Stepper.Root

The <ol>. Carries the order and the words, names itself and declares its own container. Native <ol> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `labels` | `{ list?: string; complete?: string; current?: string }` | `{ list: "Steps", complete: "Completed", current: "Current step" }` | The default strings: the list's name (unless you pass aria-label or aria-labelledby) and the hidden words after a complete and the current step. |

### Stepper.Step

One <li>: a Marker, a Title, then an optional Description. Pass aria-current="step" on the step the sequence has reached; the steps before it are complete and the steps after it upcoming, each saying so in hidden text chosen by the stylesheet. Native <li> props are forwarded.

### Stepper.Marker

The circle beside the title, aria-hidden. Empty, it shows the step's number and a check once the step is complete; children (an icon, a short label) take the number's place. Native <span> props are forwarded.

### Stepper.Title

The step's name, a <span>. Native <span> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Render as another element: render={<h3 />} when each step is a section of the page, render={<a href=… />} for a complete step the reader can go back to. |

### Stepper.Description

One or two muted sentences on what happens in this step, a <p>. Native <p> props are forwarded.

## Custom properties

| Property | Syntax | Default | Description |
| --- | --- | --- | --- |
| `--loam-stepper-marker-size` | `CSS length` | `calc(2 * var(--loam-text-md))` | The marker's diameter, and the height of the row the connector runs along. Twice the body text by default, so it rides the fluid scale; set it on the Root or any ancestor. |

