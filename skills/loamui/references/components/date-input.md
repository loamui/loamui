---
title: DateInput
description: Labelled fields for a memorable date.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# DateInput

Composable labelled fields for a date the user already knows.

## Import

```tsx
import { DateInput, ErrorSummary } from "@loamui/core";
```

## Usage

### Basic usage

Type a memorable date into separate Day, Month and Year Fields in a fieldset named by the legend, each a core Field around a core Input sized to its answer. Day and year raise a numeric keypad on touch devices; the month keeps the full keyboard so names like Mar are accepted too.

```tsx
<DateInput.Root name="date-of-birth" autoComplete="bday">
  <DateInput.Legend>Date of birth</DateInput.Legend>
  <DateInput.Description>For example, 27 3 2007</DateInput.Description>
  <DateInput.Fields>
    <DateInput.Day />
    <DateInput.Month />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>
```

### Error on the whole date

Set invalid on Root to mark all fields invalid when you cannot tell which part is wrong. Error supplies the message.

```tsx
<DateInput.Root invalid>
  <DateInput.Legend>Date of birth</DateInput.Legend>
  <DateInput.Description>For example, 27 3 2007</DateInput.Description>
  <DateInput.Error>Enter your date of birth</DateInput.Error>
  <DateInput.Fields>
    <DateInput.Day />
    <DateInput.Month />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>
```

### Error on one part

When the message names a specific part, invalid on Root narrows the invalid styling to that field. The user's correct answers keep their values and their normal borders.

```tsx
<DateInput.Root invalid={["year"]} name="membership-start">
  <DateInput.Legend>When did your membership start?</DateInput.Legend>
  <DateInput.Description>For example, 27 3 2019</DateInput.Description>
  <DateInput.Error>Membership start date must include a year</DateInput.Error>
  <DateInput.Fields>
    <DateInput.Day defaultValue="27" />
    <DateInput.Month defaultValue="3" />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>
```

### Month and year only

Render only the parts the question needs: the naming, autofill and error wiring adapt to whichever are present.

```tsx
<DateInput.Root name="card-expiry">
  <DateInput.Legend>Expiry date</DateInput.Legend>
  <DateInput.Description>For example, 3 2031</DateInput.Description>
  <DateInput.Fields>
    <DateInput.Month />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>
```

## When to use it

- For dates the user knows or can look up: a date of birth, the issue or expiry date on a document.
- When the answer must be an exact date submitted with a form: day, month and year, or only the parts the question needs.

## When not to

- For choosing a date from availability (booking an appointment, picking a delivery slot), where a calendar shows which dates are possible.
- For a single free-text answer where an approximate date is fine ("summer 2019"): use Input.

## How it works

### Typed, not picked

Nobody finds their birthday by paging a calendar back four decades. A date the user already knows is three short answers, and separate fields make each answer unambiguous. Reserve calendar widgets for dates that are genuinely chosen from a selection, and even then keep a text fallback.

### Example dates that teach the format

Give an example in the Description, and choose it so it can only be read one way: a day above 12 (so it cannot be a month) and a month of 9 or less without a leading zero (so it is clear none is needed). "27 3 2007" answers both questions users actually have; "01 02 2003" answers neither.

### Highlight only the wrong part

If one field is empty or impossible, say so ("[Date] must include a year") and pass its name in the Root invalid array to mark only that field invalid. If you cannot tell which part is wrong, or the parts are individually fine but the date is not real, set Root invalid to true so the whole date is highlighted. Either way the user's correct entries are never cleared.

### Autofill for dates of birth

When the date is the user's own date of birth, pass autoComplete="bday" to the Root: each part gets the matching bday-day / bday-month / bday-year value, so browsers can fill it and assistive technology knows the field's purpose. This is WCAG 1.3.5 (Identify Input Purpose). Leave it off for any other date: a wrong autofilled birthday in a membership-start field is worse than typing.

### Linking from an ErrorSummary

Pass an id to the Root and the fields become {id}-day, {id}-month and {id}-year. Point the summary item at the first field in error (the year in the example below) so activating it lands the user exactly where the correction starts. The summary here has autoFocus off because it is rendered with the page rather than after a failed submit; leave the default on in a form.

```tsx
<ErrorSummary.Root autoFocus={false}>
  <ErrorSummary.Title />
  <ErrorSummary.List>
    <ErrorSummary.Item href="#membership-start-year">
      Membership start date must include a year
    </ErrorSummary.Item>
  </ErrorSummary.List>
</ErrorSummary.Root>

<DateInput.Root invalid={["year"]} id="membership-start" name="membership-start">
  <DateInput.Legend>When did your membership start?</DateInput.Legend>
  <DateInput.Description>For example, 27 3 2019</DateInput.Description>
  <DateInput.Error>Membership start date must include a year</DateInput.Error>
  <DateInput.Fields>
    <DateInput.Day defaultValue="27" />
    <DateInput.Month defaultValue="3" />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>
```

### Accept how people write dates

Users copy dates from documents that disagree about format. The month field accepts names as well as digits ("jan", "january"), which measurably reduces errors, so only day and year raise the numeric keypad. Accept a leading zero and its absence, and validate on submit rather than while typing: a field that complains about "3" before the user has finished "31" teaches them to distrust the form.

## Accessibility

- The group is a native <fieldset> named by its <legend>, so screen readers announce the question with each of the fields.
- Each part is a core Field with its own visible Field.Label: Day, Month, Year by default; pass children to swap them for other languages. The group's own words, the optional marker and the hidden error prefix, come from labels on the Root.
- The Description and Error are linked to the fieldset via aria-describedby, and the Error uses role="alert" so it is announced as it appears; invalid fields also set aria-invalid.
- Day and year use inputMode="numeric" (a number pad without the hazards of type="number"); the month field keeps the full keyboard so names like "jan" can be typed.
- The parts are sized to their answers through the Input's native size attribute (two characters, three for a month that may be a name, four for the year); width is information about the expected length.

## Error messages

| Situation | Message |
| --- | --- |
| Nothing is entered | `Enter [whatever the date is]` |
| The date is incomplete | `[Whatever the date is] must include a [day/month/year]` |
| The date is not a real date | `[Whatever the date is] must be a real date` |
| The date must be in the past | `[Whatever the date is] must be in the past` |
| The date must be in the future | `[Whatever the date is] must be in the future` |

## Parts

### DateInput.Root

The fieldset and the wiring; native <fieldset> props are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `invalid` | `boolean \| ("day" \| "month" \| "year")[]` | `false` | Explicit validation state for all fields or named parts; available before hydration. Supply aria-describedby for initial server message associations. |
| `name` | `string` | — | Prefix for each field's submitted name: {name}-day, {name}-month, {name}-year. |
| `autoComplete` | `"bday"` | — | Wires browser date-of-birth autofill (WCAG 1.3.5). |
| `labels` | `{ optional?: ReactNode; errorPrefix?: ReactNode }` | `{ optional: "(optional)", errorPrefix: "Error: " }` | The group's own words, read by the Legend and the Error. Pass them in the page's language. |

### DateInput.Legend

Names the group (this is Fieldset.Legend); native <legend> props and ref are forwarded.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `optional` | `boolean` | `false` | Marks the whole question optional in text (labels.optional). |

### DateInput.Description

Helper text linked to the group: give an example date. Native <p> props are forwarded.

### DateInput.Error

Error message announced via role="alert"; native <p> props are forwarded.

### DateInput.Fields

Lays out the row of parts; native <div> props and ref are forwarded.

### DateInput.Day

The day part: a core Field around a core Input with the right name, autocomplete, inputMode="numeric" and a size of two characters. All Input props are forwarded: value, onChange, maxLength and ref.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | `"Day"` | The visible field label. |

### DateInput.Month

The month part, wired like DateInput.Day. It keeps the full keyboard so a name like Mar can be typed, and is sized to three characters.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | `"Month"` | The visible field label. |

### DateInput.Year

The year part, wired like DateInput.Day: inputMode="numeric" and a size of four characters.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | `"Year"` | The visible field label. |

