---
title: Popover
description: Floating content anchored to a trigger.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Popover

A click-triggered floating panel, composed from parts and rendered in the browser's top layer via the native popover attribute.

## Import

```tsx
import { Button, Field, Input, Popover } from "@loamui/core";
```

## Usage

### Basic usage

Compose the panel from parts. In browsers with the popover attribute and anchor positioning, the top layer, light dismiss and Escape come from the browser: no z-index, no portal, no document listeners; elsewhere a lean wrapper-anchored fallback re-implements the same behaviour.

```tsx
<Popover.Root>
  <Popover.Trigger>Toggle</Popover.Trigger>
  <Popover.Popup>
    <Popover.Title>Anchored panel</Popover.Title>
    <Popover.Description>
      Rendered in the browser's top layer. Click outside or press Escape to close.
    </Popover.Description>
  </Popover.Popup>
</Popover.Root>
```

### With form content

Popovers can hold interactive content. Compose freely: parts can be reordered, styled, or omitted.

```tsx
<Popover.Root>
  <Popover.Trigger>Add product</Popover.Trigger>
  <Popover.Popup>
    <form onSubmit={(e) => e.preventDefault()}>
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Input />
      </Field.Root>
      <Field.Root>
        <Field.Label>Price</Field.Label>
        <Input inputMode="decimal" />
      </Field.Root>
      <Button type="submit">Save</Button>
    </form>
  </Popover.Popup>
</Popover.Root>
```

### Substituting the trigger element

The built-in trigger is a LoamUI Button. To use a different element, pass it via render; the wiring (popovertarget, aria-expanded, anchor name) merges onto it.

```tsx
<Popover.Root>
  <Popover.Trigger
    render={
      <button type="button" aria-label="Filters">
        ⚙
      </button>
    }
  />
  <Popover.Popup>
    <Popover.Description>
      The Trigger's wiring merged onto your own button. It opens the popover and carries the
      aria-expanded state.
    </Popover.Description>
  </Popover.Popup>
</Popover.Root>
```

## When to use it

- For small, contextual panels of supplementary content or actions anchored to a trigger: filters, quick settings, action menus.
- When the user should be able to dismiss casually (click away) without losing surrounding page context.

## When not to

- For blocking, must-complete tasks or destructive confirmations, use Modal, which traps focus.
- For a short text label describing a control, use Tooltip.
- For disclosure of inline page content, use the Details component (a native <details>), or plain layout.

## How it works

### Light dismiss is the contract

A popover closes on outside click and Escape; that is what distinguishes it from Modal. Never put an action with consequences inside one: a surface the user can dismiss by accident must only ever hold things that are safe to abandon.

### The trigger announces what it opens

Popover.Trigger renders aria-haspopup="dialog" and aria-expanded, and closing returns focus to it. Keep the trigger a real button: moving the popover behind a hover or a bare span breaks the promise those attributes make to screen-reader users.

### Card-sized at most

A popover earns its place when it holds a handful of controls: a filter set, a quick form. When the content wants headings or scrolling, it stops being glanceable and starts being a page in the wrong place; move it to a Modal or the page itself.

## Accessibility

- Where the popover attribute and anchor positioning are both supported, the browser provides top-layer rendering, light dismiss and Escape; other browsers get a wrapper-anchored fallback with the same behaviour re-implemented in a few lines of JS, a deliberate no-polyfill, progressive-enhancement trade-off, per the browser support policy in CONTRIBUTING.
- Dialog semantics match what aria-haspopup="dialog" promises screen-reader users: opening moves focus into the panel and closing returns it to the trigger.
- Trigger is a real <button> with aria-expanded; Popover.Title and Popover.Description automatically label the dialog via aria-labelledby / aria-describedby.
- Collision handling uses position-try flipping at viewport edges in supporting browsers; the fallback keeps the requested side.

## Parts

### Popover.Root

Groups the parts and owns open state (controlled or uncontrolled). Renders an inline wrapper used by the fallback positioning.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called whenever the open state should change. |

### Popover.Trigger

A LoamUI Button wired as the popup's invoker (popovertarget, aria-expanded, anchor name); it adapts to context like any Button. All native <button> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Substitute your own action element (a button, since triggers act and links go). |

### Popover.Popup

The floating panel (role="dialog", popover attribute); native <div> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `"bottom" \| "top"` | `"bottom"` | Which side of the trigger the panel opens toward. |

### Popover.Title

Optional heading that labels the popup for assistive technology; native heading props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Substitute the heading element so its level follows the page (render={<h3 />}); defaults to an <h2>. |

### Popover.Description

Optional supporting text wired via aria-describedby; native <p> props are forwarded.

### Popover.Close

A button that closes the popup from inside; native <button> props are forwarded.

## Custom properties

| Property | Syntax | Default | Description |
| --- | --- | --- | --- |
| `--loam-popover-size` | `CSS length` | `20rem` | The panel's widest extent; content sizes it between a floor derived from this and the cap. Never wider than the viewport. |

