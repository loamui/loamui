import type { ComponentContent } from "@/renderer/types";
import { ErrorSummaryDemo } from "./demos";

const doc: ComponentContent = {
  slug: "error-summary",
  lead: "A box at the top of a form listing every error as a link to its field.",
  importLine: `import { Button, ErrorSummary, Field, Input } from "@loamui/core";`,
  demos: [
    {
      title: "After a failed submit",
      description:
        "Submit the empty form: the summary appears, takes keyboard focus so the problem is announced, and its link moves focus into the field.",
      code: `<form onSubmit={onSubmit}>
  {errors.length > 0 && (
    <ErrorSummary.Root>
      <ErrorSummary.Title />
      <ErrorSummary.List>
        <ErrorSummary.Item href="#demo-email">
          Enter your email address
        </ErrorSummary.Item>
      </ErrorSummary.List>
    </ErrorSummary.Root>
  )}
  <Field.Root invalid={Boolean(emailError)} id="demo-email">
    <Field.Label>Email address</Field.Label>
    <Field.Error>{emailError}</Field.Error>
    <Input />
  </Field.Root>
  <Button type="submit">Save and continue</Button>
</form>`,
      render: () => <ErrorSummaryDemo />,
    },
  ],
  whenToUse: [
    "At the top of a form after a failed submit, listing every field error in the order the fields appear.",
    "Whenever there is more than one field on the form: with a single field, the field's own error carries the message alone.",
  ],
  whenNotToUse: [
    "For a single global failure that has no field to link to: use an Alert.",
    "While the user is still typing: the summary responds to a submit attempt, not to keystrokes.",
  ],
  howItWorks: [
    {
      title: "Same words in both places",
      body: "Each item repeats its field's error message exactly, so the message reads identically in the summary, beside the field, and out of context. Write both from the Field page's error-message doctrine.",
    },
    {
      title: "Links land the user in the field",
      body: "Each item combines fragment navigation with focus management: activating the link scrolls to the field and focuses it so the user can type a correction.",
    },
    {
      title: "Order follows the form",
      body: "List errors in the order the fields appear on the page, so fixing them top to bottom walks the form once.",
    },
    {
      title: "Placement and the page title",
      body: 'Render the summary at the top of the main content, above the page heading, so it is the first thing encountered after the failed submit. Prefix the document title with "Error: " as well; a reloaded or re-announced tab then states the failure before anything else.',
    },
    {
      title: "Multi-field controls",
      body: 'A control made of several fields, like DateInput, takes one item per error, linked to the first field that error applies to: give the DateInput.Root id="date-of-birth" and point the item at #date-of-birth-day, or straight at #date-of-birth-year when the error names the year.',
    },
  ],
  accessibility: [
    "The summary takes keyboard focus when it appears (tabIndex -1 + focus), so assistive technology announces the group, labelled by its title, as soon as the submit fails.",
    'The Title renders "There is a problem" by default and labels the region via aria-labelledby.',
    "Items are real links: right-click, open-in-new-tab and AT link lists all behave; activation focuses the field so the correction can start immediately.",
    "Keep the user's failed input in the fields: never clear values when showing errors.",
  ],
  parts: [
    {
      name: "ErrorSummary.Root",
      description: "The focusable group; native <div> props are forwarded.",
      props: [
        {
          name: "autoFocus",
          type: "boolean",
          default: "true",
          description: "Moves keyboard focus to the summary when it mounts.",
        },
      ],
    },
    {
      name: "ErrorSummary.Title",
      description:
        'An <h2> labelling the region; children default to "There is a problem". Native heading props are forwarded.',
    },
    {
      name: "ErrorSummary.List",
      description: "The list of errors; native <ul> props are forwarded.",
    },
    {
      name: "ErrorSummary.Item",
      description:
        "One error: a real link to the field's fragment that focuses the target on activation. Native <li> props are forwarded.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description:
            "Substitute the built-in <a>, e.g. a router link; the wiring (href, focus handling) merges onto it.",
        },
        {
          name: "href",
          type: "string",
          description: "Fragment link to the field the error belongs to (required).",
        },
        {
          name: "onClick",
          type: "(event: MouseEvent<HTMLAnchorElement>) => void",
          description:
            "Runs on activation, before focus moves to the field. Prevent the default to keep the fragment out of the URL; the field is focused either way.",
        },
      ],
    },
  ],
};

export default doc;
