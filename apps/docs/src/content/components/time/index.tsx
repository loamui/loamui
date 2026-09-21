import { Time } from "@loamui/core";
import type { ComponentContent } from "@/renderer/types";

const list = {
  display: "grid",
  gap: "var(--loam-space-3xs)",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const doc: ComponentContent = {
  slug: "time",
  lead: "A date or time written for people, with the ISO form kept for machines.",
  importLine: `import { Time } from "@loamui/core";`,
  demos: [
    {
      title: "A date",
      description:
        "Time sizes nothing itself: it takes the font of whatever it sits in. dateStyle decides how much of the date is written, from numerals to the weekday; medium is the default because it is unambiguous in every locale and short enough for a byline or a cell.",
      code: `<Time value="2026-08-12" locale="en-GB" dateStyle="short" />
<Time value="2026-08-12" locale="en-GB" />
<Time value="2026-08-12" locale="en-GB" dateStyle="full" />`,
      render: () => (
        <ul style={list}>
          <li>
            <Time value="2026-08-12" locale="en-GB" dateStyle="short" />
          </li>
          <li>
            <Time value="2026-08-12" locale="en-GB" />
          </li>
          <li>
            <Time value="2026-08-12" locale="en-GB" dateStyle="full" />
          </li>
        </ul>
      ),
    },
    {
      title: "Date and time",
      description:
        "Add timeStyle and the value is a moment rather than a day. Give the moment its zone in the value (the trailing Z, or an offset) so it is one instant everywhere; without a timeZone it is written in whatever zone the code runs in.",
      code: `<Time value="2026-08-12T14:30:00Z" locale="en-GB" dateStyle="medium" timeStyle="short" />`,
      render: () => (
        <Time value="2026-08-12T14:30:00Z" locale="en-GB" dateStyle="medium" timeStyle="short" />
      ),
    },
    {
      title: "In a time zone",
      description:
        "timeZone names the zone a moment is written in, a fact of the page like locale. Without it the server and the browser each use their own zone and can disagree on the hour, or on the day, which is a hydration error; with it both write the same words. Calendar dates ignore it, since 12 August is 12 August everywhere.",
      code: `<Time value="2026-08-12T14:30:00Z" locale="en-GB" timeStyle="short" timeZone="Europe/London" />
<Time value="2026-08-12T14:30:00Z" locale="en-US" timeStyle="short" timeZone="America/Los_Angeles" />
<Time value="2026-08-12T14:30:00Z" locale="en-GB" timeStyle="full" timeZone="Asia/Tokyo" />`,
      render: () => (
        <ul style={list}>
          <li>
            <Time
              value="2026-08-12T14:30:00Z"
              locale="en-GB"
              timeStyle="short"
              timeZone="Europe/London"
            />
          </li>
          <li>
            <Time
              value="2026-08-12T14:30:00Z"
              locale="en-US"
              timeStyle="short"
              timeZone="America/Los_Angeles"
            />
          </li>
          <li>
            <Time
              value="2026-08-12T14:30:00Z"
              locale="en-GB"
              timeStyle="full"
              timeZone="Asia/Tokyo"
            />
          </li>
        </ul>
      ),
    },
    {
      title: "Relative to a moment",
      description:
        "Given relative, the text is the distance from a reference moment, in the largest unit that fits. The reference is one you supply, fixed at 10:30 on 12 August here, and never the clock: a page is rendered on the server at one moment and hydrated in the browser at another, and text that differs between them is a hydration error. Pass the moment the page was built or the request was served.",
      code: `<Time value="2026-08-12T08:30:00Z" relative={{ now: "2026-08-12T10:30:00Z" }} />
<Time value="2026-08-09" relative={{ now: "2026-08-12T10:30:00Z" }} />
<Time value="2026-09-12" relative={{ now: "2026-08-12T10:30:00Z" }} />`,
      render: () => (
        <ul style={list}>
          <li>
            <Time value="2026-08-12T08:30:00Z" relative={{ now: "2026-08-12T10:30:00Z" }} />
          </li>
          <li>
            <Time value="2026-08-09" relative={{ now: "2026-08-12T10:30:00Z" }} />
          </li>
          <li>
            <Time value="2026-09-12" relative={{ now: "2026-08-12T10:30:00Z" }} />
          </li>
        </ul>
      ),
    },
    {
      title: "Your own words",
      description:
        "Children replace the written form when an editor's wording reads better than the machine's, and the dateTime attribute still carries the ISO date, so the element stays meaningful to scripts and assistive tech.",
      code: `<Time value="2026-08-11">Yesterday</Time>`,
      render: () => <Time value="2026-08-11">Yesterday</Time>,
    },
  ],
  whenToUse: [
    "Any date or moment the reader is meant to place: when an article was published, when an order ships, the time of an event, the dates down a table column.",
    "Where a distance reads better than a date, such as activity feeds and comment threads, with relative and a reference moment the page already knows.",
  ],
  whenNotToUse: [
    'For a duration ("2 h 15 min", "3 days"). A duration measures elapsed time; use Time for a specific point in time. Write it as text, or on a <time> element of your own with a duration in its datetime attribute.',
    "For a countdown or a clock that ticks. A value that changes while the page is open is a live region that must announce itself politely; this element writes a moment once and leaves it.",
  ],
  howItWorks: [
    {
      title: "Machine-readable, always",
      body: "The text is for people and changes with the locale and the style; the dateTime attribute is the ISO form and never changes. A string is passed through as written, so a calendar date stays a date rather than being widened to midnight in some zone, and a Date is written as its ISO string. Scripts, search engines and assistive tech read the attribute; readers read the words.",
    },
    {
      title: "Locale is a fact of the page, not a guess",
      body: "The date is written the way the page's language writes dates: the order of the parts, the month names, 12- or 24-hour time. The locale defaults to a fixed value rather than the reader's device so the server and the browser produce the same text; set it from the page's language. The same goes for the zone a moment is written in: pass timeZone rather than letting each side use its own. A calendar date is written as the day it names wherever it is read, since 12 August is 12 August everywhere.",
    },
    {
      title: "Relative needs a reference moment",
      body: '"3 days ago" is only true from somewhere. Reading the clock at render would give the server one answer and the browser another, minutes or hours apart, and the two would disagree at hydration. So the reference is a prop: the moment the page was built or the request was served, which both sides know. If the distance must stay fresh while the page is open, re-render with a new reference on your own schedule.',
    },
  ],
  accessibility: [
    "Renders a <time> element: inline text to assistive tech, read as the written words, with the ISO form in its datetime attribute for scripts and agents.",
    "A relative time is only a distance. When the exact moment matters, write the date nearby as well, or in a title on the element, rather than making the reader work it out.",
    "Nothing about the date is carried by colour or size alone; the words are the text, and children that replace them are read in their place.",
  ],
  props: [
    {
      name: "value",
      type: "Date | string",
      description:
        'The moment or calendar date: an ISO 8601 string ("2026-08-12", "2026-08-12T14:30:00Z") or a Date. A string is written to dateTime as given; a Date as its ISO string.',
    },
    {
      name: "locale",
      type: "string",
      default: '"en"',
      description:
        "The BCP 47 locale the date is written in: the order of the parts, month and day names, 12- or 24-hour time. Set it to the page's language.",
    },
    {
      name: "dateStyle",
      type: '"full" | "long" | "medium" | "short"',
      default: '"medium"',
      description:
        "How much of the date to write, from numerals to the weekday. Defaults to medium unless only timeStyle is set, in which case only the time is written.",
    },
    {
      name: "timeStyle",
      type: '"full" | "long" | "medium" | "short"',
      description:
        "How much of the time to write, from hours and minutes to the zone. Off by default.",
    },
    {
      name: "relative",
      type: "{ now: Date | string }",
      description:
        'Write the distance from the reference moment instead ("3 days ago", "in 2 hours"), in the largest unit that fits. Supply the moment; it is never read from the clock.',
    },
    {
      name: "timeZone",
      type: "string",
      description:
        'The IANA time zone a moment is written in ("Europe/London"). Without it the server and the browser each use their own zone and can disagree on the hour, or the day. Calendar dates ignore it: they are written in UTC so the day never shifts.',
    },
    {
      name: "children",
      type: "ReactNode",
      description:
        'Your own words in place of the written form ("Yesterday"). The dateTime attribute is unaffected.',
    },
    {
      name: "...others",
      type: "TimeHTMLAttributes<HTMLTimeElement>",
      description: "All native <time> props except dateTime are forwarded.",
    },
  ],
};

export default doc;
