import type { ComponentContent } from "@/renderer/types";
import { FieldsetCheckboxDemo, FieldsetOptionalDemo, FieldsetRadioDemo } from "./fieldset.client";

const doc: ComponentContent = {
  slug: "fieldset",
  lead: "Groups related controls under a shared, semantic label using a native fieldset and legend.",
  importLine: `import { Fieldset, RadioGroup, Checkbox, Radio } from "@loamui/core";`,
  demos: [
    {
      title: "Grouping checkboxes",
      description:
        "The legend names the group in the accessibility tree, the correct way to label a set of related controls.",
      code: `<Fieldset.Root>
  <Fieldset.Legend>Email notifications</Fieldset.Legend>
  <Field.Item><Field.Label><Checkbox defaultChecked /> Product updates</Field.Label></Field.Item>
  <Field.Item><Field.Label><Checkbox defaultChecked /> Security alerts</Field.Label></Field.Item>
  <Field.Item><Field.Label><Checkbox /> Marketing</Field.Label></Field.Item>
</Fieldset.Root>`,
      render: () => <FieldsetCheckboxDemo />,
    },
    {
      title: "Optional group",
      description: "Mark the whole group optional in words rather than with an asterisk.",
      code: `<Fieldset.Root>
  <Fieldset.Legend optional>Interests</Fieldset.Legend>
  <Field.Item><Field.Label><Checkbox /> Design</Field.Label></Field.Item>
  <Field.Item><Field.Label><Checkbox /> Engineering</Field.Label></Field.Item>
</Fieldset.Root>`,
      render: () => <FieldsetOptionalDemo />,
    },
    {
      title: "With a RadioGroup",
      description:
        "RadioGroup.Root is a Fieldset.Root, so RadioGroup.Legend labels the set of radios.",
      code: `<RadioGroup.Root name="plan" defaultValue="pro">
  <RadioGroup.Legend>Plan</RadioGroup.Legend>
  <Field.Item><Field.Label><Radio value="free" /> Free</Field.Label></Field.Item>
  <Field.Item><Field.Label><Radio value="pro" /> Pro</Field.Label></Field.Item>
  <Field.Item><Field.Label><Radio value="team" /> Team</Field.Label></Field.Item>
</RadioGroup.Root>`,
      render: () => <FieldsetRadioDemo />,
    },
  ],
  whenToUse: [
    "To label a set of related controls (a group of checkboxes, or a set of radios) with a single group name.",
    "Whenever a group of inputs needs one shared question or heading above them.",
  ],
  whenNotToUse: [
    "For a single labelled control: use Field (or a control's own label).",
    "As a generic layout box: Fieldset carries grouping semantics, not only spacing.",
  ],
  howItWorks: [
    {
      title: "The legend is the question",
      body: "Write the legend as the question the group answers: “How should we contact you?”, not the category “Contact”. Screen readers announce it alongside each control's own label, so every option is heard in the context of the question. That also keeps each control's label short: the shared part of the wording lives in the legend once, not in every label.",
    },
    {
      title: "One question per fieldset",
      body: "Everything inside the fieldset is announced under the legend's name, so a fieldset holding two unrelated questions mislabels half its controls. Give each question its own fieldset, and avoid nesting them: a legend inside a legend multiplies what is read before every control. Some services go as far as one question per page with the legend as the page heading; the component follows the same one-legend-one-question rule.",
    },
  ],
  accessibility: [
    "Renders a native <fieldset> + <legend>: the legend is announced as the group's name when a control inside receives focus.",
    'This is preferred over a <div role="group"> with aria-labelledby: the native semantics are better supported.',
    "The browser's default fieldset border, margin and padding are reset so it composes with any native CSS layout.",
  ],
  parts: [
    {
      name: "Fieldset.Root",
      description:
        "Renders a native <fieldset> grouping the controls; native <fieldset> props and ref are forwarded.",
      props: [
        {
          name: "labels",
          type: "{ optional?: ReactNode }",
          default: '{ optional: "(optional)" }',
          description:
            "The Fieldset's own words, read by the Legend: the text after an optional legend. Pass it in the page's language.",
        },
      ],
    },
    {
      name: "Fieldset.Legend",
      description: "The accessible group label; native <legend> props are forwarded.",
      props: [
        {
          name: "optional",
          type: "boolean",
          default: "false",
          description:
            'Appends labels.optional ("(optional)"). Optional is marked in words, not with an asterisk.',
        },
      ],
    },
  ],
};

export default doc;
