---
title: CopyButton
description: Copy a value and say so.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# CopyButton

A Button that copies a string to the clipboard and says so.

## Import

```tsx
import { CopyButton } from "@loamui/core";
```

## Usage

### Copy a command

Click and the command is on the clipboard. The label reads Copied for a moment and a live region announces the same word, then the label reverts, so the button never claims a copy it made a while ago.

```tsx
<CopyButton value="pnpm add @loamui/core" />
```

### Icon only

An svg child is detected by Button as an icon, and the aria-label names the button and makes it square. The label swaps to Copied only when the button has visible text: an icon-only button keeps its icon and its name, and the confirmation is carried by the announcement alone, so pair it with a Tooltip or nearby text where a sighted user needs to see it.

```tsx
<CopyButton value="pnpm add @loamui/core" aria-label="Copy install command">
  <IconCopy aria-hidden />
</CopyButton>
```

### Your own words

The rest label is the children; the confirmation and the failure are labels.copied and labels.failed, so every word can be translated or made specific. The timeout decides how long the confirmation stands.

```tsx
<CopyButton
  value="https://loamui.dev/docs/components/copy-button"
  labels={{
    copied: "Link copied",
    failed: "The link could not be copied: select it and copy it yourself",
  }}
  timeout={3000}
>
  Copy link
</CopyButton>
```

### After a copy

onCopy is called with the value once it is on the clipboard, and not on failure, so anything that depends on the copy having happened (a note, a step marked done) runs only when it did.

```tsx
const [copied, setCopied] = useState<string | null>(null);

<CopyButton value="LOAM-4F7K-2Q9X" onCopy={setCopied}>
  Copy code
</CopyButton>
<p>{copied ? `On the clipboard: ${copied}` : "Nothing copied yet."}</p>
```

## When to use it

- To put a short string on the clipboard in one action: an install command, a link, a token, an id, a code sample.
- Next to text the reader would otherwise have to select precisely, especially where selection is awkward (a code block, a table cell, a value on a touch screen).

## When not to

- For a whole document or a large export: that is a download (a link to the file), not a clipboard write.
- To share something with another app or person: that is navigator.share and a different button, with its own sheet and its own wording.

## How it works

### The announcement is the feedback

A label that changes from Copy to Copied is invisible to a screen reader, whose focus is sitting on the button it already named. So the same words go into a visually hidden role="status" region, which is polite: it is read after whatever is being read now, without moving focus. The region is in the DOM from the start, since a live region only announces a change, and it empties again after the timeout so the next copy is a change too.

### The label reverts so the button stays honest

Copied is a confirmation, not a state: the clipboard can be overwritten by anything at any time, so a button that kept saying Copied would soon be wrong. The label goes back after the timeout, and there is no aria-pressed, because nothing is toggled. The default of 1.5 seconds is long enough to be read and short enough that a second copy does not have to wait for it.

### Failure is said, not swallowed

The clipboard can refuse: there is no API on an insecure origin, the permission can be denied, and the document may not have focus. There is no selection to fall back on, so the button announces what happened and what to do (select the text and copy it yourself) through the same region, and leaves its label alone. A click that silently did nothing would leave the reader believing the value was copied.

## Accessibility

- Renders a real Button, so focus, Enter and Space, and the button role come from the platform; every Button prop is forwarded, and an icon-only version needs an aria-label like any other icon-only button.
- Success and failure are announced through a visually hidden role="status" region, so a screen reader hears the outcome without focus moving or a dialog opening.
- The confirmation is words, not colour or an icon alone: the visible label and the announcement carry the same text, and both revert.

## Props

Status is not a prop: it comes from the surrounding `--loam-context` region (see the Contextualism guide).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | The text written to the clipboard. |
| `children` | `ReactNode` | `"Copy"` | The label at rest. An svg child is detected by Button as an icon. |
| `labels` | `{ copied?: ReactNode; failed?: ReactNode }` | `{ copied: "Copied", failed: "Copy failed: select the text and copy it yourself" }` | The words the button says: copied is shown, and announced, after a successful copy; failed is announced when the clipboard refuses, and the label is left as it was. |
| `timeout` | `number` | `1500` | How long the copied label and the announcement stand, in ms. |
| `onCopy` | `(value: string) => void` | — | Called with the value once it is on the clipboard. Replaces the native onCopy event, which fires on copying a selection a button never holds. |
| `...others` | `ButtonProps` | — | Every Button prop is forwarded, including className, style, ref and aria-label. |

