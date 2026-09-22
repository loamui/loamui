---
title: Combobox
description: A text box with a list of suggestions under it.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Combobox

A text box with a list of suggestions under it: the ARIA Authoring Practices Guide (APG) editable combobox with a listbox popup. You filter the options; the component manages the highlight, the selection, the open state and what is announced.

## Import

```tsx
import { Combobox, Field, Button } from "@loamui/core";
```

## Usage

### Basic usage

Hold the text in state, render the Options that match it, and end the list with an Empty. Typing opens the list, ArrowDown and ArrowUp move the highlight, Enter chooses (the box takes the option's text, onValueChange its value), Escape closes the list and, pressed again, clears the box. Inside Field.Root the box reads its label from the Field, like every control.

```tsx
const [query, setQuery] = useState("");
const matches = COUNTRIES.filter((c) =>
  c.toLowerCase().includes(query.trim().toLowerCase()),
);

<Field.Root>
  <Field.Label>Country</Field.Label>
  <Combobox.Root inputValue={query} onInputValueChange={setQuery}>
    <Combobox.Input />
    <Combobox.List>
      {matches.map((c) => (
        <Combobox.Option key={c} value={c}>
          {c}
        </Combobox.Option>
      ))}
      <Combobox.Empty />
    </Combobox.List>
  </Combobox.Root>
</Field.Root>
```

### With a trigger

A Trigger beside the box shows the whole list for pointer users. It is a LoamUI Button with a chevron, named by labels.toggle, and out of the Tab sequence: the box already reaches the list by keyboard, so a second tab stop would only be in the way.

```tsx
<Field.Root>
  <Field.Label>Country</Field.Label>
  <Combobox.Root inputValue={query} onInputValueChange={setQuery}>
    <Combobox.Input />
    <Combobox.Trigger />
    <Combobox.List>
      {matches.map((c) => (
        <Combobox.Option key={c} value={c}>
          {c}
        </Combobox.Option>
      ))}
      <Combobox.Empty />
    </Combobox.List>
  </Combobox.Root>
</Field.Root>
```

### Disabled options

A disabled Option stays in the list with aria-disabled: the keyboard skips it and a click does nothing, but the user learns the choice exists. The value an option submits need not be its text: here the label is the plan's name and the value its key.

```tsx
<Combobox.List>
  {matches.map((p) => (
    <Combobox.Option key={p} value={p.toLowerCase()} disabled={p === "Enterprise"}>
      {p}
    </Combobox.Option>
  ))}
  <Combobox.Empty />
</Combobox.List>
```

### In a Field with a description and an error

The box is the library's Input, so Field.Description reaches it through aria-describedby and a rendered Field.Error marks it invalid: the message's presence is the state, exactly as for Input.

```tsx
<Field.Root invalid>
  <Field.Label>Country</Field.Label>
  <Field.Description>Where you are resident for tax.</Field.Description>
  <Field.Error>Choose a country from the list</Field.Error>
  <Combobox.Root inputValue={query} onInputValueChange={setQuery}>
    <Combobox.Input />
    <Combobox.List>…</Combobox.List>
  </Combobox.Root>
</Field.Root>
```

### In a form

Give the Root a name and the chosen option's value is submitted under it through a hidden input, so the form works with FormData or a plain POST like one with a native select. The text the user typed is not submitted; only a choice is.

```tsx
<form onSubmit={handleSubmit}>
  <Field.Root>
    <Field.Label>Country</Field.Label>
    <Combobox.Root name="country" inputValue={query} onInputValueChange={setQuery}>
      <Combobox.Input />
      <Combobox.List>…</Combobox.List>
    </Combobox.Root>
  </Field.Root>
  <Button type="submit">Save</Button>
</form>
```

## When to use it

- For choosing one option from a long list (countries, cities, people, products) where scrolling a Select would be slower than typing a few letters.
- When the user knows roughly what they are looking for and the list confirms the exact entry: an address, a colleague's name, a currency.

## When not to

- For a list short enough to scan: Select shows it in one gesture with the platform's own picker, and Radio shows every choice up front.
- For unrestricted text entry with suggestions (a search box, a tag field): use Input, or Search for the page's search. A combobox promises a choice from the list.
- For the page's search: Search is a landmark with a submit; a combobox is a form control that resolves to one value.

## How it works

### You filter, the component chooses

Which Options appear is your decision: filter by prefix, by substring, by a search index, or fetch them as the user types, then render the matches. The component owns everything after that: the highlight that follows the arrow keys and the pointer, the selection, the open state, and a live count so a screen reader hears how many suggestions there are. Keeping the filter outside the component is what lets it match a name three ways or wait for a server without a prop for each.

### Text and value are two things

The box holds text (inputValue); the control holds a choice (value), set only when an option is chosen. Editing the text after a choice clears the value, because the text no longer names an option, and a form submits the value, never the text. Pass label on an Option when what the box should show once chosen differs from what the option displays.

### Escape twice

The first Escape closes the list and keeps the text; the second clears the box and the choice with it. Users who opened the list by accident lose nothing, and users who want to start over need no clear button.

### Say when there is nothing

End the list with Combobox.Empty so a filter that matches nothing shows a message instead of an empty box that looks broken. Screen-reader users get the same fact from the live count (0 results available), so the message itself is visual: replace its text with children or labels.empty to say what to do next ("No matching country. Check the spelling").

## Accessibility

- Implements the APG editable combobox with a listbox popup: the box is an <input role="combobox"> with aria-autocomplete="list", aria-expanded and aria-controls; the list is a <ul role="listbox"> of <li role="option">; the highlighted option is exposed through aria-activedescendant, so focus never leaves the box.
- ArrowDown and ArrowUp open the list and move the highlight; Home and End jump to its ends while it is open; Enter chooses the highlighted option; Escape closes the list, then clears the box; Tab and clicking outside close it. Typing opens the list.
- A live status region reads the number of suggestions whenever the list changes (labels.status) and falls silent when it closes; Combobox.Empty is the sighted-user counterpart and is hidden from assistive technology, since a listbox may contain only options.
- The Trigger is a real <button> with aria-expanded and aria-controls, named by labels.toggle and excluded from the Tab sequence per the pattern; the box remains the one tab stop.
- Disabled options use aria-disabled rather than being removed, so they stay visible and announced while the keyboard skips them.
- The list is positioned with CSS anchor positioning where supported, flipping above the box at the viewport edge, and sits under the row elsewhere; the highlight has a forced-colours treatment in system colours.

## Error messages

| Situation | Message |
| --- | --- |
| Nothing was chosen from the list | `Choose [whatever the label asks for] from the list` |
| The text matches no option | `[Label] must be one of the options in the list` |

## Parts

### Combobox.Root

Owns the state (text, choice, open), the live status region and the hidden input for form submission. Renders a <div> that lays the box and a Trigger out in one row; native <div> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Controlled choice: the chosen option's value, or null. |
| `defaultValue` | `string \| null` | `null` | Initial choice when uncontrolled; the box shows that option's label. |
| `onValueChange` | `(value: string \| null) => void` | — | Called when an option is chosen, or the choice is cleared (null). |
| `inputValue` | `string` | — | Controlled text in the box. |
| `defaultInputValue` | `string` | `""` | Initial text when uncontrolled. |
| `onInputValueChange` | `(text: string) => void` | — | Called whenever the text should change: typing, choosing, clearing. |
| `open` | `boolean` | — | Controlled open state of the list. |
| `defaultOpen` | `boolean` | `false` | Initial open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called whenever the open state should change. |
| `name` | `string` | — | Submit the choice under this name, through a hidden input. |
| `labels` | `{ status?: (count: number) => string; empty?: string; toggle?: string }` | `{ status: (n) => "n results available", empty: "No results", toggle: "Show options" }` | The default strings: the live count, the Empty message, the Trigger's name. |

### Combobox.Input

The box: the library's Input as the combobox (role="combobox", aria-autocomplete="list", aria-expanded, aria-controls, aria-activedescendant). Inside a Field.Root it is named, described and marked invalid by the Field. All Input props except value, defaultValue and type are forwarded: placeholder, disabled and every native <input> prop. The native input anchors the suggestions. Input’s startSection, endSection and wrapperProps are also forwarded.

### Combobox.Trigger

A LoamUI Button that opens or closes the list and keeps focus in the box. Renders a chevron and is named by labels.toggle unless you pass children or an aria-label; out of the Tab sequence. Native <button> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `element \| (props) => node` | — | Substitute your own element; it receives the wiring props. |

### Combobox.List

The listbox (<ul role="listbox">), hidden until open and positioned under the box. Its children are Options and, last, an Empty. Native <ul> props are forwarded.

### Combobox.Option

One suggestion (<li role="option">). Choosing it, by Enter or click, commits value and puts its label in the box.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | What the choice submits and onValueChange receives. |
| `label` | `string` | `the option's text` | The text the box shows once chosen. |
| `disabled` | `boolean` | — | aria-disabled; skipped by the keyboard and unchoosable by click. |
| `render` | `element \| (props) => node` | — | Substitute your own element; it receives the wiring props. |

### Combobox.Empty

Shown in the list when it has no Options. Children replace labels.empty. A sighted-user message, hidden from assistive technology, which hears the count from the status region. Native <li> props are forwarded.

## Custom properties

| Property | Syntax | Default | Description |
| --- | --- | --- | --- |
| `--loam-combobox-list-size` | `CSS length` | `16rem` | The most height the list takes before it scrolls, always capped at half the viewport. Set it on the Root or any ancestor. |

