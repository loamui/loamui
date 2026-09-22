---
title: Alert
description: Draw attention to an important message.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Alert

A prominent message box whose status comes from its context.

## Import

```tsx
import { Alert, Button } from "@loamui/core";
```

## Usage

### Contexts

Alert has no colour or variant props. Declare --loam-context on a one-element wrapper region (a style query is answered by ancestors, never by the element that declares the property) and the status colours follow. See the Contextualism guide.

```tsx
<div style={{ "--loam-context": "info" }}>
  <Alert.Root>
    <Alert.Body>
      <Alert.Title>Heads up</Alert.Title>
      <Alert.Description>A new version is available.</Alert.Description>
    </Alert.Body>
  </Alert.Root>
</div>
<div style={{ "--loam-context": "success" }}>
  <Alert.Root>
    <Alert.Body>
      <Alert.Title>Saved</Alert.Title>
      <Alert.Description>Your changes have been stored.</Alert.Description>
    </Alert.Body>
  </Alert.Root>
</div>
<div style={{ "--loam-context": "warning" }}>
  <Alert.Root>
    <Alert.Body>
      <Alert.Title>Low storage</Alert.Title>
      <Alert.Description>Only 5% of your quota remains.</Alert.Description>
    </Alert.Body>
  </Alert.Root>
</div>
<div style={{ "--loam-context": "danger" }}>
  <Alert.Root>
    <Alert.Body>
      <Alert.Title>Deploy failed</Alert.Title>
      <Alert.Description>Check the build logs.</Alert.Description>
    </Alert.Body>
  </Alert.Root>
</div>
```

### Inherited from a region

--loam-context inherits, so an alert inside a region that already means something needs nothing of its own. Here the region declares danger once: the Alert and the Button beside it both answer it, and neither carries a prop.

```tsx
<div style={{ "--loam-context": "danger" }}>
  <Alert.Root>
    <Alert.Body>
      <Alert.Title>This workspace will be deleted</Alert.Title>
      <Alert.Description>Everything in it is removed for every member.</Alert.Description>
    </Alert.Body>
  </Alert.Root>
  <Button>Delete workspace</Button>
</div>
```

### With icon

Pass any node as the leading icon. It is rendered aria-hidden, so the title carries the meaning on its own.

```tsx
<div style={{ "--loam-context": "info" }}>
  <Alert.Root>
    <Alert.Icon>{<span aria-hidden>ℹ</span>}</Alert.Icon>
    <Alert.Body>
      <Alert.Title>Did you know?</Alert.Title>
      <Alert.Description>
        An alert takes its status from the --loam-context of the region around it.
      </Alert.Description>
    </Alert.Body>
  </Alert.Root>
</div>
```

### Title only

Body content is optional: a one-line message is the title alone, and the live region still announces it.

```tsx
<div style={{ "--loam-context": "success" }}>
  <Alert.Root>
    <Alert.Body>
      <Alert.Title>All systems operational.</Alert.Title>
    </Alert.Body>
  </Alert.Root>
</div>
```

### Dismissible

Add Alert.Close at the inline end and handle dismissal with its onClose prop. Its default accessible name is Dismiss; labels.close supplies another name. The alert does not remove itself: the handler stops rendering it, because only you know whether acknowledging the message ends the condition it reports.

```tsx
const [open, setOpen] = useState(true);

{open && (
  <Alert.Root>
    <Alert.Body>
      <Alert.Title>Draft restored</Alert.Title>
      <Alert.Description>We recovered the draft you were editing.</Alert.Description>
    </Alert.Body>
    <Alert.Close onClose={() => setOpen(false)} />
  </Alert.Root>
)}
```

### Composed from parts

Compose the icon, body, heading and dismiss button explicitly. Alert.Title takes render where the title belongs in the page outline; Alert.Close takes labels for its name.

```tsx
<div style={{ "--loam-context": "warning" }}>
  <Alert.Root>
    <Alert.Icon>
      <span aria-hidden>⚠</span>
    </Alert.Icon>
    <Alert.Body>
      <Alert.Title render={<h2 />}>Storage almost full</Alert.Title>
      <Alert.Description>Free up space to keep syncing.</Alert.Description>
    </Alert.Body>
    <Alert.Close onClose={dismiss} labels={{ close: "Hide this warning" }} />
  </Alert.Root>
</div>
```

## When to use it

- For in-page status the user needs to act on or know about now (a failed deploy, a quota about to run out), placed next to the content it describes.
- When the message must stay on screen: alerts never auto-dismiss, so the information survives until the state it reports changes and you remove it.

## When not to

- For transient confirmations that need no follow-up (“Saved”, “Copied”). Use Toast; an alert that lingers after the moment has passed becomes noise.
- For an error tied to a single form field. Use Field.Root invalid and Field.Error to provide validation state and an associated message.

## How it works

### Render it when it happens

An alert reports the current state of the page the user is on. Information they could act on some other time belongs in ordinary content; a confirmation that expires in seconds belongs in a Toast. Reserving Alert for “this matters here, now” is what keeps it noticeable when it appears.

### Persistent by design

There is no auto-dismiss: an alert exists exactly as long as the condition it reports. Remove it by no longer rendering it when the state changes: a warning that disappears on its own while the problem remains would be lying. Alert.Close is for the message the reader may acknowledge (a restored draft, a notice already read); it reports through onClose and leaves the removal to you, so a dismissed alert is a decision, not a timeout.

### Announcement happens at insertion

A live region announces only when content enters it; an alert rendered with the rest of the page is read in document order. So render the alert conditionally when the condition becomes true, never hidden-then-shown, and the announcement arrives exactly when the event does. Give it role="alert" when that event must interrupt; the default role="status" waits its turn.

## Accessibility

- Renders role="status" by default: a polite live region, which suits a message that is on the page when it loads or that reports a condition rather than an event.
- Pass role="alert" for a message that appears in response to an action and must interrupt: forwarded props are spread after the default, so your role wins and the announcement becomes assertive, read ahead of whatever else was queued.
- A banner already present at page load announces nothing (a live region only fires on insertion): for a post-redirect confirmation, either move keyboard focus to the alert on load, or treat it as a landmark instead: a wrapper with role=region and aria-labelledby pointing at the title.
- The status colour is never announced: write the title so the meaning survives in words (“Deploy failed”, not “Error” on a red tint); the border and tint are visual-only.
- The icon slot is rendered aria-hidden. Icons are decoration here, so any meaning they carry must also be in the text.
- Title text is not the raw status colour: it is mixed toward black (light scheme) or white (dark) so it keeps AA contrast on the tint even for light channels like warning; only the decorative icon carries the raw channel (the border is a softer tint of it).

## Parts

### Alert.Root

The live region: a <div role="status"> carrying the class and the context. Use Alert.Title for the heading; role="alert" overrides the polite default.

### Alert.Icon

The leading icon slot, rendered aria-hidden. Native <span> props are forwarded.

### Alert.Body

The column holding the title and description. Native <div> props are forwarded.

### Alert.Title

The bold heading, in the channel's hue mixed for contrast. A <div> by default.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Substitute the element (render={<h2 />}) where the title belongs in the page outline; the class merges onto it. |

### Alert.Description

The message: full-strength text, muted beside a title so the heading leads. Native <div> props are forwarded.

### Alert.Close

A LoamUI Button at the inline end. Icon-only and named by labels.close unless given children; every Button prop is forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onClose` | `() => void` | — | Called when the button is activated; stop rendering the alert in it. |
| `labels` | `{ close?: string }` | `{ close: "Dismiss" }` | The button's accessible name when it has no children. |

