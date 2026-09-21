import type { ComponentContent } from "@/renderer/types";
import {
  SegmentedControlDisabledDemo,
  SegmentedControlFormDemo,
  SegmentedControlSchemeDemo,
  SegmentedControlViewDemo,
} from "./demos";

const doc: ComponentContent = {
  slug: "segmented-control",
  lead: "A set of mutually exclusive options drawn as one row of segments: a native radio group in a pill, so it submits like a form control and switches views like a toolbar, with the arrow keys moving the choice either way.",
  importLine: `import { SegmentedControl, VisuallyHidden } from "@loamui/core";`,
  demos: [
    {
      title: "As a view switcher",
      description:
        "Hold the value and let the view follow it. The Legend is painted inside the pill before the segments, so the row reads as a labelled control; an svg before a segment's text is its icon, sized on the text.",
      code: `const [view, setView] = useState("list");

<SegmentedControl.Root value={view} onValueChange={setView}>
  <SegmentedControl.Legend>View</SegmentedControl.Legend>
  <SegmentedControl.Item value="list">
    <ListIcon />
    List
  </SegmentedControl.Item>
  <SegmentedControl.Item value="grid">
    <GridIcon />
    Grid
  </SegmentedControl.Item>
</SegmentedControl.Root>
<p>{view === "list" ? "Showing the list." : "Showing the grid."}</p>`,
      render: () => <SegmentedControlViewDemo />,
    },
    {
      title: "In a form",
      description:
        "The segments are native radios sharing one name, so the choice submits with the form and needs no JavaScript to do it. Uncontrolled here: defaultValue seeds the first render and the radios remember the rest.",
      code: `<form onSubmit={submit}>
  <SegmentedControl.Root name="range" defaultValue="week">
    <SegmentedControl.Legend>Range</SegmentedControl.Legend>
    <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
    <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
    <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
  </SegmentedControl.Root>
  <button type="submit">Apply</button>
</form>`,
      render: () => <SegmentedControlFormDemo />,
    },
    {
      title: "As a scheme picker",
      description:
        "Icon-only segments sit in circles, each with hidden text as its name, and the Legend is hidden the same way: the group is still named, not painted. This one is live: choosing changes this site's colour scheme and remembers it, the way the site's own toggle does.",
      code: `const [scheme, setScheme] = useState("system");

<SegmentedControl.Root value={scheme} onValueChange={choose}>
  <VisuallyHidden render={<SegmentedControl.Legend />}> Colour scheme</VisuallyHidden>
  <SegmentedControl.Item value="system">
    <SystemIcon />
    <VisuallyHidden>System</VisuallyHidden>
  </SegmentedControl.Item>
  <SegmentedControl.Item value="light">
    <LightIcon />
    <VisuallyHidden>Light</VisuallyHidden>
  </SegmentedControl.Item>
  <SegmentedControl.Item value="dark">
    <DarkIcon />
    <VisuallyHidden>Dark</VisuallyHidden>
  </SegmentedControl.Item>
</SegmentedControl.Root>`,
      render: () => <SegmentedControlSchemeDemo />,
    },
    {
      title: "Disabled",
      description:
        "A disabled segment keeps its place in the row so the set reads the same, and drops out of the choice: the arrow keys skip it and a click does nothing. Disable the Root to disable the whole group, as on any fieldset: the chosen segment stays drawn, so the reader still sees what the setting is, and every radio is skipped by Tab.",
      code: `<SegmentedControl.Root defaultValue="monthly">
  <SegmentedControl.Legend>Billing</SegmentedControl.Legend>
  <SegmentedControl.Item value="monthly">Monthly</SegmentedControl.Item>
  <SegmentedControl.Item value="yearly">Yearly</SegmentedControl.Item>
  <SegmentedControl.Item value="lifetime" disabled>
    Lifetime
  </SegmentedControl.Item>
</SegmentedControl.Root>

<SegmentedControl.Root defaultValue="week" disabled>
  <SegmentedControl.Legend>Range</SegmentedControl.Legend>
  <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
  <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
  <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
</SegmentedControl.Root>`,
      render: () => <SegmentedControlDisabledDemo />,
    },
  ],
  whenToUse: [
    "For a choice between two to five short options that should all be visible at once: a view (list or grid), a range (day, week, month), a billing period, a colour scheme.",
    "Where the choice takes effect at once and the reader needs to see which option is on: a toolbar or a settings row rather than a form waiting to be submitted, though it submits too.",
  ],
  whenNotToUse: [
    "For more than five options, or options with long labels: the row stops fitting and the segments stop reading as one control. Use RadioGroup, or Select when the list is long.",
    "For an on/off setting: that is a Switch. A segmented control asks which one, not whether.",
    "To switch between panels of content on the page: that is Tabs, which carries the tab and panel semantics a screen reader expects for that pattern.",
  ],
  howItWorks: [
    {
      title: "Native radios, drawn as segments",
      body: "Each segment is a label around a real radio, hidden visually but not from anything else. The browser supplies what a set of radios has always had: one choice at a time, the arrow keys moving it, focus on the checked option, and a value that submits under the group's name. The stylesheet reads the radio's own :checked to draw the chosen segment, so there is no state to keep in step with the DOM.",
    },
    {
      title: "The legend is the name",
      body: "The Legend names the group, and a screen reader announces it with each option, so write it as the question the segments answer: “View”, “Range”, “Colour scheme”. It is painted inside the pill before the segments. When the segments say it themselves (three scheme icons under a heading that already reads “Appearance”), compose it with VisuallyHidden using render={<SegmentedControl.Legend />}: the name stays, the paint goes.",
    },
    {
      title: "Icon-only segments keep their words",
      body: "An icon is an svg child, aria-hidden and sized on the text. A segment that shows only an icon still needs a name, so put the words beside it in a VisuallyHidden component; the stylesheet detects that shape and draws the segment as a circle. A segment with no words is unnamed, and a set of unnamed radios is a set of unanswerable questions.",
    },
    {
      title: "A form control and a view switcher are the same control",
      body: "Give the Root a name and the choice submits with the form, before or without JavaScript. Give it value and onValueChange and the choice drives the view. Both at once is fine: a search page's sort order can submit and update the results as it changes. The control does not know which it is for, and it does not need to.",
    },
    {
      title: "It stands in a row of controls",
      body: "The pill is built to the same anatomy as Button and the form controls (1px borders, the same padding and line height), so it height-aligns with them by construction in a toolbar or a form row, at every container width. There is no size prop; the fluid tokens size it from the container like everything else.",
    },
  ],
  accessibility: [
    'The Root is a native <fieldset> carrying role="radiogroup", named by its Legend; each segment is a native <input type="radio"> inside a <label>, so the segment is its target and its name.',
    "Keyboard: Tab reaches the checked segment, ArrowLeft/ArrowRight and ArrowUp/ArrowDown move the choice and check it, Space checks a focused one. Disabled segments are skipped. All of it is the browser's own radio behaviour.",
    "The visible segment carries the focus ring, using the shared ring colour and width.",
    "A line-strong edge and a raised surface identify the chosen segment; under forced colours it is painted in Highlight and HighlightText, the focus ring in the system focus colour and a disabled segment in GrayText.",
    "A Legend rendered through VisuallyHidden still names the group; only its paint is removed.",
  ],
  parts: [
    {
      name: "SegmentedControl.Root",
      description:
        'The <fieldset> with role="radiogroup"; native <fieldset> props (disabled, form) and ref are forwarded.',
      props: [
        {
          name: "name",
          type: "string",
          description:
            "The name every radio shares and the choice submits under. Auto-generated when omitted.",
        },
        {
          name: "value",
          type: "string",
          description: "The chosen value, controlled. Pair with onValueChange.",
        },
        {
          name: "defaultValue",
          type: "string",
          description: "The initial choice when uncontrolled.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Fires with the newly chosen value when a segment is picked.",
        },
      ],
    },
    {
      name: "SegmentedControl.Legend",
      description:
        "The group's name, a <legend> painted inside the pill before the segments; native <legend> props and ref are forwarded. Compose it with VisuallyHidden using render={<SegmentedControl.Legend />}.",
    },
    {
      name: "SegmentedControl.Item",
      description:
        "One segment: a <label> around a native radio. Children are the visible label (text, an svg icon, or an icon beside hidden text); className, ref and native <label> props land on the label.",
      props: [
        {
          name: "value",
          type: "string",
          description: "The value this segment submits and reports.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Takes the segment out of the choice; it keeps its place in the row.",
        },
        {
          name: "inputProps",
          type: "InputHTMLAttributes",
          description:
            "Props for the radio inside (aria-describedby, data-*). Its type, name, value, checked state and change handler are the component's.",
        },
      ],
    },
  ],
  cssProps: [
    {
      name: "--loam-segmented-control-segment-size",
      syntax: "CSS length",
      default: "the segment's own height",
      description:
        "The minimum inline size of a segment, so an icon-only segment is a circle and every segment in a set of short words can be given one width. Set it on the Root or any ancestor.",
    },
  ],
};

export default doc;
