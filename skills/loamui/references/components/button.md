---
title: Button
description: Trigger an action or event.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Button

A native button whose appearance is decided by its context, not by props.

## Import

```tsx
import { Button, Checkbox, Loader, VisuallyHidden } from "@loamui/core";
```

## Usage

### Contexts

Buttons are neutral by default. Declare --loam-context on a region and the buttons inside re-answer their colour; there are no variant props. Primary is the neutral near-black in the white-label default, so a primary region reads as the same quiet button until a theme sets --loam-color-primary; danger shows the remap. See the Contextualism guide.

```tsx
<Button>Neutral</Button>

<div style={{ "--loam-context": "primary" }}>
  <Button>Save changes</Button>
</div>

<div style={{ "--loam-context": "danger" }}>
  <Button>Delete</Button>
</div>
```

### A region adapts every component

--loam-context isn't a button feature: everything in the region answers it. Here the checkbox's fill, the button's tint and the loader's stroke all take the danger colour, and focus rings inside follow. Intent is declared once on the container, not as a colour prop on each control.

```tsx
<div style={{ "--loam-context": "danger" }}>
  <Field.Item>
    <Field.Label>
      <Checkbox defaultChecked /> Also delete backups
    </Field.Label>
  </Field.Item>
  <Button>Delete account</Button>
  <Loader label="Deleting" />
</div>
```

### Size and width from context

There are no size or fullWidth props. Body-text and spacing tokens give the button a generous default and adapt it to its container. Labels can wrap when text is enlarged or translated; height grows with the content. Width is the parent's decision: a container of 16rem or less makes a button span it, a grid or stacked-flex region stretches its buttons (that is the platform's own layout at work), and a flex row shrink-wraps them to their labels.

```tsx
<div style={{ containerType: "inline-size", inlineSize: "14rem" }}>
  <Button>Save changes</Button>
</div>

<div style={{ containerType: "inline-size", inlineSize: "24rem" }}>
  <Button>Save changes</Button>
</div>

<div style={{ display: "grid", gap: "var(--loam-space-xs)", inlineSize: "min(100%, 18rem)" }}>
  <Button>Save changes</Button>
  <Button>Cancel</Button>
</div>
```

### Icons, composed as children

There are no leftSection or rightSection props. An svg child is detected via :has() and gets flex layout, a gap and 1em sizing. Icon-only is detected from the accessible name: the aria-label (or aria-labelledby) an icon-only button needs anyway, or a VisuallyHidden child beside the icon, and it becomes square.

```tsx
<Button>
  <IconCheck aria-hidden />
  Approve
</Button>

<Button aria-label="Approve">
  <IconCheck aria-hidden />
</Button>

<Button>
  <IconCheck aria-hidden />
  <VisuallyHidden>Approve</VisuallyHidden>
</Button>
```

### Another element

render substitutes the element and merges the Button's class and wiring onto it. Not for navigation, which is SignpostLink; here a native <summary> wears the button so a disclosure's toggle looks like the action it is.

```tsx
<details>
  <Button render={<summary />}>Show details</Button>
  <p>The disclosure is native; the summary wears the button.</p>
</details>
```

### Loading state

There is no loading prop. For a genuine busy state, add disabled and compose a Loader (marked aria-hidden so it isn't announced) into the children; it is detected and sized like an icon. This is the one sanctioned use of a disabled button; see “Avoid disabled buttons” below.

```tsx
<Button disabled>
  <Loader aria-hidden /> Saving
</Button>
```

## When to use it

- To trigger an action in the current context: submitting a form, opening a dialog, confirming a choice.
- For destructive or risky operations, inside a danger region, so the whole surrounding context signals the stakes rather than one red button.

## When not to

- To navigate to another page or URL: use a link. A button that navigates breaks right-click, middle-click and "open in new tab".
- For many low-emphasis choices at once: consider a Menu or Tabs instead of a row of equal buttons.

## How it works

### Buttons act, links navigate

The element must match the behaviour, not the look. When a design wants a button-sized call-to-action that navigates, do not dress a Button as a link: use SignpostLink, which keeps real link semantics (right-click, middle-click, open-in-new-tab, link announcement) with the prominence the design asks for. The reverse holds too: an <a> with an onClick that mutates data is still a button in disguise.

### Buttons don't submit by accident

A bare <button> inside a form is a native submit button, so Button defaults type="button": a Cancel button can never submit the form it sits in. Pass type="submit" on the one button that should. The render path forwards your element untouched, so a render={<button/>} keeps the native default and needs its own type.

### Avoid disabled buttons

A disabled submit button has poor contrast, can't receive focus in most browsers, and, worst of all, gives no feedback about why it's disabled or how to fix it; users are left guessing which field is wrong. Keep the button enabled, validate on submit, and answer a bad submission with specific field errors (see Field). The one good use of disabled is a genuine busy state, paired with a composed Loader.

### Prevent double submission on the server

Button deliberately ships no preventDoubleClick or debounce prop. A client-side debounce doesn't prevent duplicates (retries, impatient refreshes and flaky networks bypass it), while it does hide real failures by swallowing clicks that deserved a response. Make the operation safe to repeat instead: an idempotency key or server-side dedupe, with disabled + <Loader/> as visible feedback while the request is in flight, not as the safety mechanism.

### One primary action per section

Emphasis is a property of the region, not the button: wrap the section's single most important action in a primary context (--loam-context: "primary") and leave every other button neutral. Two "primary" buttons side by side ask the user to make a decision the interface should have made: if everything is emphasised, nothing is.

## Accessibility

- Always renders a real <button>, so keyboard focus, Enter/Space activation and the button role come from the platform.
- Write a specific label: the text should make sense out of context ("Save changes", not "OK"). Icon-only buttons need a name: aria-label, aria-labelledby, or a VisuallyHidden child beside the icon; any of the three also makes the button square.
- For a loading state, add disabled and compose a Loader (marked aria-hidden) into the children so it isn't announced as content.
- Focus is shown with a :focus-visible ring (never removed without a replacement), and colour is never the only signal of state.

## Props

Status is not a prop: it comes from the surrounding `--loam-context` region (see the Contextualism guide).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The button content: label, and any composed icons/spinner. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Unlike a native <button>, never a submit button unless you say so. |
| `render` | `element \| (props) => node` | — | Substitute the rendered element; the Button's classes and wiring merge onto yours. Not for navigation: a call-to-action that goes somewhere is a SignpostLink. |
| `...others` | `ButtonHTMLAttributes` | — | All native <button> props are forwarded. |

## Custom properties

| Property | Syntax | Default | Description |
| --- | --- | --- | --- |
| `--loam-button-color` | `CSS color` | `var(--loam-color-fg)` | The button's single colour channel. Set it to recolour one instance or a wrapper component; background, border, hover and active are all derived from it. |
| `--loam-button-radius` | `CSS length` | `var(--loam-radius-md)` | Corner rounding; set it per instance or on a wrapper component. |

