---
title: Carousel
description: A scroll-snap track of items, paged and announced.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Carousel

A scroll-snap track of items with buttons that page it, indicators that jump to an item and a live status. The track is an ordinary scroller: a wheel, a swipe and the arrow keys all work without the buttons, and the current item is read from the scroll position, so every part follows a swipe as faithfully as a click.

## Import

```tsx
import { Carousel, Card } from "@loamui/core";
```

## Usage

### Basic usage

A named region over a track of Cards. Scroll the track or page it with the buttons; each item snaps into place. Tab reaches the track and ArrowLeft and ArrowRight page it. The heading names the region through aria-labelledby, in place of the default labels.region.

```tsx
<Carousel.Root aria-labelledby="guides">
  <h2 id="guides">Guides</h2>
  <Carousel.Track>
    <Carousel.Item>
      <Card>
        <h3>Tokens</h3>
        <p>Four hues, eight neutrals and two fluid scales; everything else is derived.</p>
      </Card>
    </Carousel.Item>
    <Carousel.Item>…</Carousel.Item>
  </Carousel.Track>
  <div className="row">
    <Carousel.Previous />
    <Carousel.Next />
  </div>
</Carousel.Root>
```

### With indicators

One dot per item, named by labels.indicator, the current one marked with aria-current. The current item is whichever is first at least half in view, read from the scroll position, so the dots follow a swipe and a wheel as well as a click; a click scrolls that item to the start of the track.

```tsx
<Carousel.Root labels={{ region: "Guides" }}>
  <Carousel.Track>…</Carousel.Track>
  <div className="row">
    <Carousel.Previous />
    <Carousel.Next />
  </div>
  <Carousel.Indicators />
</Carousel.Root>
```

### Looping

Without loop, Previous is disabled at the start and Next at the end, so the buttons say where the track can still go. With loop they never disable: at an end they wrap around to the other.

```tsx
<Carousel.Root labels={{ region: "Guides" }} loop>
  <Carousel.Track>…</Carousel.Track>
  <div className="row">
    <Carousel.Previous />
    <Carousel.Next />
  </div>
  <Carousel.Indicators />
</Carousel.Root>
```

### Item size

Items share one width, the public --loam-carousel-item-size, 20rem unless you set it on the Root, and never wider than the track, so a narrow container still shows one whole item. Each item is a region of its own: set --loam-context on one and its content adapts.

```tsx
<Carousel.Root labels={{ region: "Contexts" }} style={{ "--loam-carousel-item-size": "10rem" }}>
  <Carousel.Track>
    <Carousel.Item style={{ "--loam-context": "primary" }}>
      <Card>primary</Card>
    </Carousel.Item>
    <Carousel.Item style={{ "--loam-context": "success" }}>
      <Card>success</Card>
    </Carousel.Item>
    …
  </Carousel.Track>
  <div className="row">
    <Carousel.Previous />
    <Carousel.Next />
  </div>
</Carousel.Root>
```

### Other words

labels replaces every default string: the region's name, the buttons' names, the indicators' names and the status. Children on Previous or Next name the button instead of labels; the chevron is the default child.

```tsx
<Carousel.Root
  labels={{
    region: "Guides",
    previous: "Précédent",
    next: "Suivant",
    indicator: (i, n) => `Diapositive ${i} sur ${n}`,
    status: (i, n) => `Diapositive ${i} sur ${n}`,
  }}
>
  <Carousel.Track>…</Carousel.Track>
  <div className="row">
    <Carousel.Previous>Précédent</Carousel.Previous>
    <Carousel.Next>Suivant</Carousel.Next>
  </div>
  <Carousel.Indicators />
</Carousel.Root>
```

## When to use it

- A run of similar items, cards, images or quotes, where the reader is invited to browse and any one of them is a fine place to stop.
- When the page must work without JavaScript: the track supports native scrolling, with buttons, indicators and status added after hydration.

## When not to

- A list nobody scrolls: three items that fit side by side belong in a grid, where all of them are visible without paging.
- Content that must all be seen, such as terms, steps or the plans on a pricing page: a carousel hides everything past the first page, and most readers never page.
- A slideshow that advances on its own. Nothing here moves without the reader; motion the reader did not ask for takes the content away before it is read, and a control to stop it is a poor substitute for never starting.

## How it works

### A scroller, not a slideshow

The track is a list in a scrollport with snap points, so the browser does the moving: a swipe, a wheel, a trackpad and the arrow keys all work before any script runs, with the platform's own physics and the reader's own motion preference. The parts around it only read and nudge that scroll position. Previous and Next scroll by one width of the track; an indicator scrolls its item to the start; nothing keeps a copy of the position that could drift from where the track really is.

### The current item is detected

An IntersectionObserver on the items reports how much of each is in view, and the first one at least half in view is current. That is what the indicators mark, what the buttons disable on (the first item wholly in view means the start, the last one the end) and what the status announces, so every part agrees with the scroll position however it was reached. There is no active prop to keep in step.

### The buttons disable, but keep focus

At an end without loop, the unavailable button carries aria-disabled rather than the disabled attribute. A button that becomes disabled under a keyboard user's focus drops that focus to the top of the page; aria-disabled keeps the button in the tab order, announced as unavailable, and its click does nothing. Pass loop and the buttons never disable: at an end they wrap to the other.

### Announce where it stopped, not where it passed

A fling passes several items, and only the one the track stops on is news. The status region waits for the track to be still before it speaks, and says nothing on mount: the resting position is not a change. The words come from labels.status, one string per position.

### Arrangement is yours

The Root is a grid that stacks whatever you put in it, in the order you put it: a heading, the track, the buttons, the indicators. Put Previous and Next in a row of your own, or beside the heading; the Root hands them the track from wherever inside it they sit. A Card, an image, a figure or a quote goes in an Item, which is a grid, so the content stretches to the row's height.

## Accessibility

- The Root is a <section> named by labels.region ("Carousel") unless you pass aria-label or aria-labelledby, with aria-roledescription="carousel", so assistive technology exposes a carousel region and reads its name.
- The Track is a list in the tab order (tabIndex 0, yours to change), so a keyboard can reach a scroller a pointer would swipe. ArrowLeft and ArrowRight page it, Home and End go to the ends; the keys are left alone when focus is on something inside an item, so a control in an item keeps its own keys.
- Previous and Next are LoamUI Buttons named by labels.previous and labels.next, with a chevron as the default child. At an end without loop they carry aria-disabled, staying focusable and announced, and their click does nothing; the stylesheet paints that state as it paints a disabled Button, and names it in GrayText under forced colours.
- Indicators are real <button>s in a list, each named by labels.indicator ("Go to slide 2 of 5") with aria-current on the current one; each is a 1.75em target on the text-sm scale (at least 24px at every container width) around a 0.6em mark. In forced colours every dot keeps a border and the current one an outline.
- A polite live region announces labels.status once the track has settled on a new item. It is empty on mount and silent until the track moves.
- Smooth scrolling is opt-in through the reader's motion preference; with reduced motion the track jumps.

## Parts

### Carousel.Root

The <section> region. Declares its own container so the fluid tokens answer the carousel's width, observes the items, hands the Track to the buttons and indicators, and holds the live status. Native <section> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `loop` | `boolean` | `false` | At either end, Previous and Next wrap around instead of carrying aria-disabled. |
| `labels` | `{ region?: string; previous?: string; next?: string; indicator?: (i: number, n: number) => string; status?: (i: number, n: number) => string }` | `{ region: "Carousel", previous: "Previous", next: "Next", indicator: (i, n) => "Go to slide i of n", status: (i, n) => "Slide i of n" }` | The default strings: the region's name (unless you pass aria-label or aria-labelledby), the buttons' names, each indicator's name and the status read once the track settles. i is 1-based. |

### Carousel.Track

The scroller: a <ul> laid out as a column grid with inline scroll snapping, in the tab order, paged by the arrow keys. Native <ul> props are forwarded; tabIndex defaults to 0.

### Carousel.Item

One <li>: a snap point that hosts your content and stretches it to the row's height. Native <li> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Substitute your own element; it receives the wiring (ref, class, children). |

### Carousel.Previous

A LoamUI Button that pages the Track back by one of its widths; aria-disabled at the start unless loop. A chevron is the default child; children name the button in place of labels.previous. Native <button> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Substitute your own element; it receives the wiring props. |

### Carousel.Next

A LoamUI Button that pages the Track forward by one of its widths; aria-disabled at the end unless loop. A chevron is the default child; children name the button in place of labels.next. Native <button> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Substitute your own element; it receives the wiring props. |

### Carousel.Indicators

A <ul> with one <button> per item, named by labels.indicator, the current one carrying aria-current. A click scrolls that item to the start of the Track. Native <ul> props are forwarded.

## Custom properties

| Property | Syntax | Default | Description |
| --- | --- | --- | --- |
| `--loam-carousel-item-size` | `CSS length` | `20rem` | The width every item shares, set on the Root or any ancestor. An item is never wider than the track, so a narrow container still shows one whole item. |

