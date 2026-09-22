---
title: Time
description: A date or time, written for people.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Time

A date or time written for people, with the ISO form kept for machines.

## Import

```tsx
import { Time } from "@loamui/core";
```

## Usage

### A date

Time sizes nothing itself: it takes the font of whatever it sits in. dateStyle decides how much of the date is written, from numerals to the weekday; medium is the default because it is unambiguous in every locale and short enough for a byline or a cell.

```tsx
<Time value="2026-08-12" locale="en-GB" dateStyle="short" />
<Time value="2026-08-12" locale="en-GB" />
<Time value="2026-08-12" locale="en-GB" dateStyle="full" />
```

### Date and time

Add timeStyle and the value is a moment rather than a day. Give the moment its zone in the value (the trailing Z, or an offset) so it is one instant everywhere; without a timeZone it is written in whatever zone the code runs in.

```tsx
<Time value="2026-08-12T14:30:00Z" locale="en-GB" dateStyle="medium" timeStyle="short" />
```

### In a time zone

timeZone names the zone a moment is written in, a fact of the page like locale. Without it the server and the browser each use their own zone and can disagree on the hour, or on the day, which is a hydration error; with it both write the same words. Calendar dates ignore it, since 12 August is 12 August everywhere.

```tsx
<Time value="2026-08-12T14:30:00Z" locale="en-GB" timeStyle="short" timeZone="Europe/London" />
<Time
  value="2026-08-12T14:30:00Z"
  locale="en-US"
  timeStyle="short"
  timeZone="America/Los_Angeles"
/>
<Time value="2026-08-12T14:30:00Z" locale="en-GB" timeStyle="full" timeZone="Asia/Tokyo" />
```

### Relative to a moment

Given relative, the text is the distance from a reference moment, in the largest unit that fits. The reference is one you supply, fixed at 10:30 on 12 August here, and never the clock: a page is rendered on the server at one moment and hydrated in the browser at another, and text that differs between them is a hydration error. Pass the moment the page was built or the request was served.

```tsx
<Time value="2026-08-12T08:30:00Z" relative={{ now: "2026-08-12T10:30:00Z" }} />
<Time value="2026-08-09" relative={{ now: "2026-08-12T10:30:00Z" }} />
<Time value="2026-09-12" relative={{ now: "2026-08-12T10:30:00Z" }} />
```

### Your own words

Children replace the written form when an editor's wording reads better than the machine's, and the dateTime attribute still carries the ISO date, so the element stays meaningful to scripts and assistive tech.

```tsx
<Time value="2026-08-11">Yesterday</Time>
```

## When to use it

- Any date or moment the reader is meant to place: when an article was published, when an order ships, the time of an event, the dates down a table column.
- Where a distance reads better than a date, such as activity feeds and comment threads, with relative and a reference moment the page already knows.

## When not to

- For a duration ("2 h 15 min", "3 days"). A duration measures elapsed time; use Time for a specific point in time. Write it as text, or on a <time> element of your own with a duration in its datetime attribute.
- For a countdown or a clock that ticks. A value that changes while the page is open is a live region that must announce itself politely; this element writes a moment once and leaves it.

## How it works

### Machine-readable, always

The text is for people and changes with the locale and the style; the dateTime attribute is the ISO form and never changes. A string is passed through as written, so a calendar date stays a date rather than being widened to midnight in some zone, and a Date is written as its ISO string. Scripts, search engines and assistive tech read the attribute; readers read the words.

### Locale is a fact of the page, not a guess

The date is written the way the page's language writes dates: the order of the parts, the month names, 12- or 24-hour time. The locale defaults to a fixed value rather than the reader's device so the server and the browser produce the same text; set it from the page's language. The same goes for the zone a moment is written in: pass timeZone rather than letting each side use its own. A calendar date is written as the day it names wherever it is read, since 12 August is 12 August everywhere.

### Relative needs a reference moment

"3 days ago" is only true from somewhere. Reading the clock at render would give the server one answer and the browser another, minutes or hours apart, and the two would disagree at hydration. So the reference is a prop: the moment the page was built or the request was served, which both sides know. If the distance must stay fresh while the page is open, re-render with a new reference on your own schedule.

## Accessibility

- Renders a <time> element: inline text to assistive tech, read as the written words, with the ISO form in its datetime attribute for scripts and agents.
- A relative time is only a distance. When the exact moment matters, write the date nearby as well, or in a title on the element, rather than making the reader work it out.
- Nothing about the date is carried by colour or size alone; the words are the text, and children that replace them are read in their place.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Date \| string` | — | The moment or calendar date: an ISO 8601 string ("2026-08-12", "2026-08-12T14:30:00Z") or a Date. A string is written to dateTime as given; a Date as its ISO string. |
| `locale` | `string` | `"en"` | The BCP 47 locale the date is written in: the order of the parts, month and day names, 12- or 24-hour time. Set it to the page's language. |
| `dateStyle` | `"full" \| "long" \| "medium" \| "short"` | `"medium"` | How much of the date to write, from numerals to the weekday. Defaults to medium unless only timeStyle is set, in which case only the time is written. |
| `timeStyle` | `"full" \| "long" \| "medium" \| "short"` | — | How much of the time to write, from hours and minutes to the zone. Off by default. |
| `relative` | `{ now: Date \| string }` | — | Write the distance from the reference moment instead ("3 days ago", "in 2 hours"), in the largest unit that fits. Supply the moment; it is never read from the clock. |
| `timeZone` | `string` | — | The IANA time zone a moment is written in ("Europe/London"). Without it the server and the browser each use their own zone and can disagree on the hour, or the day. Calendar dates ignore it: they are written in UTC so the day never shifts. |
| `children` | `ReactNode` | — | Your own words in place of the written form ("Yesterday"). The dateTime attribute is unaffected. |
| `...others` | `TimeHTMLAttributes<HTMLTimeElement>` | — | All native <time> props except dateTime are forwarded. |

