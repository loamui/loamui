---
title: ErrorSummary
description: List form errors as links to their fields.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# ErrorSummary

A box at the top of a form listing every error as a link to its field.

## Import

```tsx
import { Button, ErrorSummary, Field, Input } from "@loamui/core";
```

## Usage

### After a failed submit

Submit the empty form: the summary appears, takes keyboard focus so the problem is announced, and its link moves focus into the field.

```tsx
<form onSubmit={onSubmit}>
  {errors.length > 0 && (
    <ErrorSummary.Root>
      <ErrorSummary.Title />
      <ErrorSummary.List>
        <ErrorSummary.Item href="#demo-email">Enter your email address</ErrorSummary.Item>
      </ErrorSummary.List>
    </ErrorSummary.Root>
  )}
  <Field.Root invalid={Boolean(emailError)} id="demo-email">
    <Field.Label>Email address</Field.Label>
    <Field.Error>{emailError}</Field.Error>
    <Input />
  </Field.Root>
  <Button type="submit">Save and continue</Button>
</form>
```

## When to use it

- At the top of a form after a failed submit, listing every field error in the order the fields appear.
- Whenever there is more than one field on the form: with a single field, the field's own error carries the message alone.

## When not to

- For a single global failure that has no field to link to: use an Alert.
- While the user is still typing: the summary responds to a submit attempt, not to keystrokes.

## How it works

### Same words in both places

Each item repeats its field's error message exactly, so the message reads identically in the summary, beside the field, and out of context. Write both from the Field page's error-message doctrine.

### Links land the user in the field

Each item combines fragment navigation with focus management: activating the link scrolls to the field and focuses it so the user can type a correction.

### Order follows the form

List errors in the order the fields appear on the page, so fixing them top to bottom walks the form once.

### Placement and the page title

Render the summary at the top of the main content, above the page heading, so it is the first thing encountered after the failed submit. Prefix the document title with "Error: " as well; a reloaded or re-announced tab then states the failure before anything else.

### Multi-field controls

A control made of several fields, like DateInput, takes one item per error, linked to the first field that error applies to: give the DateInput.Root id="date-of-birth" and point the item at #date-of-birth-day, or straight at #date-of-birth-year when the error names the year.

## Accessibility

- The summary takes keyboard focus when it appears (tabIndex -1 + focus), so assistive technology announces the group, labelled by its title, as soon as the submit fails.
- The Title renders "There is a problem" by default and labels the region via aria-labelledby.
- Items are real links: right-click, open-in-new-tab and AT link lists all behave; activation focuses the field so the correction can start immediately.
- Keep the user's failed input in the fields: never clear values when showing errors.

## Parts

### ErrorSummary.Root

The focusable group; native <div> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `autoFocus` | `boolean` | `true` | Moves keyboard focus to the summary when it mounts. |

### ErrorSummary.Title

An <h2> labelling the region; children default to "There is a problem". Native heading props are forwarded.

### ErrorSummary.List

The list of errors; native <ul> props are forwarded.

### ErrorSummary.Item

One error: a real link to the field's fragment that focuses the target on activation. Native <li> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Substitute the built-in <a>, e.g. a router link; the wiring (href, focus handling) merges onto it. |
| `href` | `string` | — | Fragment link to the field the error belongs to (required). |
| `onClick` | `(event: MouseEvent<HTMLAnchorElement>) => void` | — | Runs on activation, before focus moves to the field. Prevent the default to keep the fragment out of the URL; the field is focused either way. |

