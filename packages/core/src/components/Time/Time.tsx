import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";

export type TimeStyle = "full" | "long" | "medium" | "short";

export interface TimeProps extends Omit<PartProps<"time">, "children" | "dateTime"> {
  /** The moment or calendar date: an ISO 8601 string ("2026-08-12", "2026-08-12T14:30:00Z") or a Date. */
  value: Date | string;
  /**
   * The BCP 47 locale the date is written in: the order of the parts, the
   * names of months and days, 12- or 24-hour time. Pass the page's
   * language; the default is a fixed value only so the server and the
   * browser write the same text. @default "en"
   */
  locale?: string;
  /**
   * How much of the date to write, from "short" (12/08/2026) to "full"
   * (Wednesday, 12 August 2026). @default "medium" when no timeStyle is set
   */
  dateStyle?: TimeStyle;
  /** How much of the time to write, from "short" (14:30) to "full" (with the zone). Off by default. */
  timeStyle?: TimeStyle;
  /**
   * Write the distance from a reference moment instead ("3 days ago",
   * "in 2 hours"), in the largest unit that fits. The reference is supplied,
   * never read from the clock, so the server and the browser write the same
   * words.
   */
  relative?: { now: Date | string };
  /**
   * The IANA time zone a moment is written in ("Europe/London"). A fact of
   * the page, like `locale`: without it the server and the browser each use
   * their own zone and can disagree on the hour, or the day. Calendar dates
   * ignore it (they are formatted in UTC so the day never shifts).
   */
  timeZone?: string;
  /** Your own words in place of the written form ("Yesterday"); the machine-readable dateTime stays. */
  children?: ReactNode;
}

// A value with no time part is a calendar date, and a calendar date is the
// same everywhere: 12 August is 12 August in Auckland and in Los Angeles.
// Date parses it as UTC midnight, so it is written in UTC too, or a reader
// west of Greenwich would see the day before.
const CALENDAR_DATE = /^\d{4}(?:-\d{2}){0,2}$/;

// Largest unit first; a unit is chosen when the distance rounds to at least
// one of it. Months and years are the calendar's rough ones (30 and 365
// days): the wording is a distance, not a date.
const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
  ["second", 1000],
];

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function formatRelative(locale: string, value: Date, now: Date): string {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const distance = value.getTime() - now.getTime();
  for (const [unit, ms] of UNITS) {
    // A unit is chosen once a whole one has passed, then the distance is
    // rounded within it: 12 hours is "in 12 hours", never "tomorrow".
    if (Math.abs(distance) < ms) continue;
    return format.format(Math.sign(distance) * Math.round(Math.abs(distance) / ms), unit);
  }
  return format.format(0, "second");
}

/**
 * A date or time: a `<time>` element whose text is the moment written for
 * people and whose `dateTime` is the ISO form for machines.
 *
 * The date takes the type around it. A Time sizes nothing itself, so it
 * reads as the heading, byline or table cell it sits in; it only fixes the
 * figures (lining, tabular) so a column of dates stays straight. Give it a
 * `relative` reference and it writes the distance instead ("3 days ago"),
 * against the moment you supply rather than the clock, so the server and the
 * browser agree. Write your own words as children ("Yesterday") and the
 * machine-readable `dateTime` stays.
 *
 * ```tsx
 * <p>Published <Time value="2026-08-12" locale="en-GB" /></p>
 * ```
 */
export function Time({
  value,
  locale = "en",
  dateStyle,
  timeStyle,
  relative,
  timeZone,
  className,
  children,
  ref,
  ...rest
}: TimeProps) {
  const date = toDate(value);
  // A string is passed through as written: "2026-08-12" is a date, and
  // widening it to a moment would say more than the author did.
  const dateTime = value instanceof Date ? value.toISOString() : value;

  let text: ReactNode = children;
  if (text == null || text === false) {
    if (relative) {
      // The reference moment is a prop, never Date.now(): a render on the
      // server and the render that hydrates it happen at different times,
      // and text that differs between them is a hydration error.
      text = formatRelative(locale, date, toDate(relative.now));
    } else {
      const calendar = typeof value === "string" && CALENDAR_DATE.test(value);
      text = new Intl.DateTimeFormat(locale, {
        dateStyle: dateStyle ?? (timeStyle ? undefined : "medium"),
        timeStyle,
        timeZone: calendar ? "UTC" : timeZone,
      }).format(date);
    }
  }

  return (
    <time ref={ref} dateTime={dateTime} className={cx("loam-Time", className)} {...rest}>
      {text}
    </time>
  );
}
