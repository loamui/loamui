import type { ComponentContent } from "@/renderer/types";
import { DateInput, ErrorSummary } from "@loamui/core";

export function DateInputDemo() {
  return (
    <DateInput.Root name="date-of-birth" autoComplete="bday">
      <DateInput.Legend>Date of birth</DateInput.Legend>
      <DateInput.Description>For example, 27 3 2007</DateInput.Description>
      <DateInput.Fields>
        <DateInput.Day />
        <DateInput.Month />
        <DateInput.Year />
      </DateInput.Fields>
    </DateInput.Root>
  );
}

export function DateInputWholeErrorDemo() {
  return (
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
  );
}

export function DateInputPartErrorDemo() {
  return (
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
  );
}

export function DateInputMonthYearDemo() {
  return (
    <DateInput.Root name="card-expiry">
      <DateInput.Legend>Expiry date</DateInput.Legend>
      <DateInput.Description>For example, 3 2031</DateInput.Description>
      <DateInput.Fields>
        <DateInput.Month />
        <DateInput.Year />
      </DateInput.Fields>
    </DateInput.Root>
  );
}

export function DateInputSummaryDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--loam-space-xs)", inlineSize: "100%" }}>
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
    </div>
  );
}

const doc: ComponentContent = {
  slug: "date-input",
  lead: "Composable labelled fields for a date the user already knows.",
  importLine: `import { DateInput, ErrorSummary } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "Type a memorable date into separate Day, Month and Year Fields in a fieldset named by the legend, each a core Field around a core Input sized to its answer. Day and year raise a numeric keypad on touch devices; the month keeps the full keyboard so names like Mar are accepted too.",
      code: `<DateInput.Root name="date-of-birth" autoComplete="bday">
  <DateInput.Legend>Date of birth</DateInput.Legend>
  <DateInput.Description>For example, 27 3 2007</DateInput.Description>
  <DateInput.Fields>
    <DateInput.Day />
    <DateInput.Month />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>`,
      render: () => <DateInputDemo />,
    },
    {
      title: "Error on the whole date",
      description:
        "Set invalid on Root to mark all fields invalid when you cannot tell which part is wrong. Error supplies the message.",
      code: `<DateInput.Root invalid>
  <DateInput.Legend>Date of birth</DateInput.Legend>
  <DateInput.Description>For example, 27 3 2007</DateInput.Description>
  <DateInput.Error>Enter your date of birth</DateInput.Error>
  <DateInput.Fields>
    <DateInput.Day />
    <DateInput.Month />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>`,
      render: () => <DateInputWholeErrorDemo />,
    },
    {
      title: "Error on one part",
      description:
        "When the message names a specific part, invalid on Root narrows the invalid styling to that field. The user's correct answers keep their values and their normal borders.",
      code: `<DateInput.Root invalid={["year"]} name="membership-start">
  <DateInput.Legend>When did your membership start?</DateInput.Legend>
  <DateInput.Description>For example, 27 3 2019</DateInput.Description>
  <DateInput.Error >
    Membership start date must include a year
  </DateInput.Error>
  <DateInput.Fields>
    <DateInput.Day defaultValue="27" />
    <DateInput.Month defaultValue="3" />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>`,
      render: () => <DateInputPartErrorDemo />,
    },
    {
      title: "Month and year only",
      description:
        "Render only the parts the question needs: the naming, autofill and error wiring adapt to whichever are present.",
      code: `<DateInput.Root name="card-expiry">
  <DateInput.Legend>Expiry date</DateInput.Legend>
  <DateInput.Description>For example, 3 2031</DateInput.Description>
  <DateInput.Fields>
    <DateInput.Month />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>`,
      render: () => <DateInputMonthYearDemo />,
    },
  ],
  whenToUse: [
    "For dates the user knows or can look up: a date of birth, the issue or expiry date on a document.",
    "When the answer must be an exact date submitted with a form: day, month and year, or only the parts the question needs.",
  ],
  whenNotToUse: [
    "For choosing a date from availability (booking an appointment, picking a delivery slot), where a calendar shows which dates are possible.",
    'For a single free-text answer where an approximate date is fine ("summer 2019"): use Input.',
  ],
  howItWorks: [
    {
      title: "Typed, not picked",
      body: "Nobody finds their birthday by paging a calendar back four decades. A date the user already knows is three short answers, and separate fields make each answer unambiguous. Reserve calendar widgets for dates that are genuinely chosen from a selection, and even then keep a text fallback.",
    },
    {
      title: "Example dates that teach the format",
      body: 'Give an example in the Description, and choose it so it can only be read one way: a day above 12 (so it cannot be a month) and a month of 9 or less without a leading zero (so it is clear none is needed). "27 3 2007" answers both questions users actually have; "01 02 2003" answers neither.',
    },
    {
      title: "Highlight only the wrong part",
      body: 'If one field is empty or impossible, say so ("[Date] must include a year") and pass its name in the Root invalid array to mark only that field invalid. If you cannot tell which part is wrong, or the parts are individually fine but the date is not real, set Root invalid to true so the whole date is highlighted. Either way the user\'s correct entries are never cleared.',
    },
    {
      title: "Autofill for dates of birth",
      body: "When the date is the user's own date of birth, pass autoComplete=\"bday\" to the Root: each part gets the matching bday-day / bday-month / bday-year value, so browsers can fill it and assistive technology knows the field's purpose. This is WCAG 1.3.5 (Identify Input Purpose). Leave it off for any other date: a wrong autofilled birthday in a membership-start field is worse than typing.",
    },
    {
      title: "Linking from an ErrorSummary",
      body: "Pass an id to the Root and the fields become {id}-day, {id}-month and {id}-year. Point the summary item at the first field in error (the year in the example below) so activating it lands the user exactly where the correction starts. The summary here has autoFocus off because it is rendered with the page rather than after a failed submit; leave the default on in a form.",
      code: `<ErrorSummary.Root autoFocus={false}>
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
  <DateInput.Error >
    Membership start date must include a year
  </DateInput.Error>
  <DateInput.Fields>
    <DateInput.Day defaultValue="27" />
    <DateInput.Month defaultValue="3" />
    <DateInput.Year />
  </DateInput.Fields>
</DateInput.Root>`,
      render: () => <DateInputSummaryDemo />,
    },
    {
      title: "Accept how people write dates",
      body: 'Users copy dates from documents that disagree about format. The month field accepts names as well as digits ("jan", "january"), which measurably reduces errors, so only day and year raise the numeric keypad. Accept a leading zero and its absence, and validate on submit rather than while typing: a field that complains about "3" before the user has finished "31" teaches them to distrust the form.',
    },
  ],
  errors: [
    {
      situation: "Nothing is entered",
      message: "Enter [whatever the date is]",
    },
    {
      situation: "The date is incomplete",
      message: "[Whatever the date is] must include a [day/month/year]",
    },
    {
      situation: "The date is not a real date",
      message: "[Whatever the date is] must be a real date",
    },
    {
      situation: "The date must be in the past",
      message: "[Whatever the date is] must be in the past",
    },
    {
      situation: "The date must be in the future",
      message: "[Whatever the date is] must be in the future",
    },
  ],
  accessibility: [
    "The group is a native <fieldset> named by its <legend>, so screen readers announce the question with each of the fields.",
    "Each part is a core Field with its own visible Field.Label: Day, Month, Year by default; pass children to swap them for other languages. The group's own words, the optional marker and the hidden error prefix, come from labels on the Root.",
    'The Description and Error are linked to the fieldset via aria-describedby, and the Error uses role="alert" so it is announced as it appears; invalid fields also set aria-invalid.',
    'Day and year use inputMode="numeric" (a number pad without the hazards of type="number"); the month field keeps the full keyboard so names like "jan" can be typed.',
    "The parts are sized to their answers through the Input's native size attribute (two characters, three for a month that may be a name, four for the year); width is information about the expected length.",
  ],
  parts: [
    {
      name: "DateInput.Root",
      description: "The fieldset and the wiring; native <fieldset> props are forwarded.",
      props: [
        {
          name: "invalid",
          type: 'boolean | ("day" | "month" | "year")[]',
          default: "false",
          description:
            "Explicit validation state for all fields or named parts; available before hydration. Supply aria-describedby for initial server message associations.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Prefix for each field's submitted name: {name}-day, {name}-month, {name}-year.",
        },
        {
          name: "autoComplete",
          type: `"bday"`,
          description: "Wires browser date-of-birth autofill (WCAG 1.3.5).",
        },
        {
          name: "labels",
          type: "{ optional?: ReactNode; errorPrefix?: ReactNode }",
          default: '{ optional: "(optional)", errorPrefix: "Error: " }',
          description:
            "The group's own words, read by the Legend and the Error. Pass them in the page's language.",
        },
      ],
    },
    {
      name: "DateInput.Legend",
      description:
        "Names the group (this is Fieldset.Legend); native <legend> props and ref are forwarded.",
      props: [
        {
          name: "optional",
          type: "boolean",
          default: "false",
          description: "Marks the whole question optional in text (labels.optional).",
        },
      ],
    },
    {
      name: "DateInput.Description",
      description:
        "Helper text linked to the group: give an example date. Native <p> props are forwarded.",
    },
    {
      name: "DateInput.Error",
      description: 'Error message announced via role="alert"; native <p> props are forwarded.',
    },
    {
      name: "DateInput.Fields",
      description: "Lays out the row of parts; native <div> props and ref are forwarded.",
    },
    {
      name: "DateInput.Day",
      description:
        'The day part: a core Field around a core Input with the right name, autocomplete, inputMode="numeric" and a size of two characters. All Input props are forwarded: value, onChange, maxLength and ref.',
      props: [
        {
          name: "children",
          type: "ReactNode",
          default: `"Day"`,
          description: "The visible field label.",
        },
      ],
    },
    {
      name: "DateInput.Month",
      description:
        "The month part, wired like DateInput.Day. It keeps the full keyboard so a name like Mar can be typed, and is sized to three characters.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          default: `"Month"`,
          description: "The visible field label.",
        },
      ],
    },
    {
      name: "DateInput.Year",
      description:
        'The year part, wired like DateInput.Day: inputMode="numeric" and a size of four characters.',
      props: [
        {
          name: "children",
          type: "ReactNode",
          default: `"Year"`,
          description: "The visible field label.",
        },
      ],
    },
  ],
};

export default doc;
