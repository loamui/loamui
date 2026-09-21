import type { ComponentContent } from "@/renderer/types";
import { Checkbox, Field } from "@loamui/core";

export function CheckboxErrorDemo() {
  return (
    <Field.Root invalid>
      <Field.Error>Accept the terms of service to continue</Field.Error>
      <>
        <Field.Label>
          <Checkbox /> Accept the terms of service
        </Field.Label>
      </>
    </Field.Root>
  );
}

export function CheckboxFieldDemo() {
  return (
    <Field.Root>
      <Field.Label>
        <Checkbox /> Subscribe to the newsletter
      </Field.Label>
      <Field.Description>A short summary, once a week.</Field.Description>
    </Field.Root>
  );
}

const doc: ComponentContent = {
  slug: "checkbox",
  lead: "A native checkbox with an adjacent label and description.",
  importLine: `import { Checkbox, Field } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "One self-contained opt-in. The label is a complete statement of what ticking the box does, and the box starts unticked so every tick is a deliberate act.",
      code: `<Field.Item><Field.Label><Checkbox /> Subscribe to the newsletter</Field.Label></Field.Item>`,
      render: () => (
        <Field.Item>
          <Field.Label>
            <Checkbox /> Subscribe to the newsletter
          </Field.Label>
        </Field.Item>
      ),
    },
    {
      title: "Checked",
      description:
        "defaultChecked starts the box ticked for a form the browser owns; checked with onChange holds it yourself. A ticked start is for a setting that is already on, never for consent.",
      code: `<Field.Item><Field.Label><Checkbox defaultChecked /> Auto-renew</Field.Label></Field.Item>`,
      render: () => (
        <Field.Item>
          <Field.Label>
            <Checkbox defaultChecked /> Auto-renew
          </Field.Label>
        </Field.Item>
      ),
    },
    {
      title: "With description",
      description:
        "Field.Description is helper text under the label, joined to the box through aria-describedby, so the consequence of ticking is read with the choice.",
      code: `<Field.Item><Field.Label><Checkbox /> Share anonymised usage data</Field.Label><Field.Description>Helps us improve the product. You can opt out anytime.</Field.Description></Field.Item>`,
      render: () => (
        <div style={{ maxInlineSize: "24rem" }}>
          <Field.Item>
            <Field.Label>
              <Checkbox /> Share anonymised usage data
            </Field.Label>
            <Field.Description>
              Helps us improve the product. You can opt out anytime.
            </Field.Description>
          </Field.Item>
        </div>
      ),
    },
    {
      title: "Disabled",
      description:
        "disabled reaches the native input: the row is dimmed and skipped by Tab. A ticked, disabled box shows a setting that is on and not the user's to change here. Disabled is detected on the input (:has(input:disabled)), never declared on the row.",
      code: `<Field.Item><Field.Label><Checkbox disabled /> Email receipts</Field.Label></Field.Item>
<Field.Item><Field.Label><Checkbox defaultChecked disabled /> Two-factor authentication</Field.Label></Field.Item>`,
      render: () => (
        <div style={{ display: "grid", gap: "var(--loam-space-xs)" }}>
          <Field.Item>
            <Field.Label>
              <Checkbox disabled /> Email receipts
            </Field.Label>
          </Field.Item>
          <Field.Item>
            <Field.Label>
              <Checkbox defaultChecked disabled /> Two-factor authentication
            </Field.Label>
          </Field.Item>
        </div>
      ),
    },
    {
      title: "Error state",
      description:
        "Set invalid on Field.Root and compose Field.Error before the checkbox for its announced message.",
      code: `<Field.Root invalid>
  <Field.Error>Accept the terms of service to continue</Field.Error>
  <><Field.Label><Checkbox /> Accept the terms of service</Field.Label></>
</Field.Root>`,
      render: () => <CheckboxErrorDemo />,
    },
    {
      title: "Composed inside a Field",
      description:
        "The bare Checkbox carries no label prop: it reads its id, aria-describedby and aria-invalid from the surrounding Field, so the label lives on Field.Label and nothing wires them by hand.",
      code: `<Field.Root>
  <Field.Label>
    <Checkbox /> Subscribe to the newsletter
  </Field.Label>
  <Field.Description>A short summary, once a week.</Field.Description>
</Field.Root>`,
      render: () => <CheckboxFieldDemo />,
    },
  ],
  whenToUse: [
    "For a single on/off choice (accept terms, stay signed in).",
    "For selecting any number of options from a list: group related checkboxes in a Fieldset.",
    "Inside a Field for full control, compose the bare box so labels never nest: <Field.Label><Checkbox /> …</Field.Label>.",
  ],
  whenNotToUse: [
    "For one choice among several mutually exclusive options: use Radio.",
    "For an instant on/off toggle that takes effect immediately: use Switch.",
  ],
  howItWorks: [
    {
      title: "A native checkbox, styled by accent-color",
      body: 'This is a plain <input type="checkbox">. No custom SVG box. The elements layer paints it with the platform\'s own accent-color (the neutral primary), so the checked and indeterminate marks, keyboard behaviour and forced-colours support all come from the browser. The component adds Field wiring and the invalid affordance. Field.Label provides a comfortable click target. Clicking that label toggles the native control. A context region recolours it because accent-color follows the primary token.',
    },
    {
      title: "One box or a group",
      body: "A single checkbox is for one self-contained agreement or opt-in whose label is a complete statement (“Agree to the terms of service”). Several related options belong in a Fieldset whose legend asks the question. Because checkboxes and radios look alike, say in the legend or description that users can select all that apply.",
    },
    {
      title: "Write the label positively",
      body: "The label states what happens when the box is ticked, in positive, unambiguous words: “Send me email updates”, never “Don't send me emails”. A negated label makes ticking mean refusing and unticking a double negative, and users acting quickly resolve it wrong.",
    },
    {
      title: "Leave boxes unticked",
      body: "A pre-ticked box gets submitted by everyone who never read it, so the data records a choice nobody made, and for consent it records nothing at all. Start unticked, so every tick is a deliberate act.",
    },
  ],
  errors: [
    {
      situation: "A required agreement is unticked",
      message: "Select [whatever the checkbox label states] to continue",
    },
    {
      situation: "Nothing in a required group is selected",
      message: "Select [whatever the legend asks for]",
    },
    {
      situation: "Too many options are selected",
      message: "Select no more than [N] [things]",
    },
  ],
  accessibility: [
    'Renders a real <input type="checkbox"> wrapped by its label, so clicking the text toggles it and the state is announced natively.',
    "Supports an indeterminate (mixed) visual for a 'select all' parent, set on the DOM node. It describes the display while the submitted value remains checked or unchecked.",
    "The checkbox reads label, description and validation wiring from Field.Root or Field.Item. Use Field.Item for each option in a group so its label and description remain independent.",
    "Disabled is detected on the native input (:has(input:disabled) on the row), never declared on a wrapper.",
    "Errors come from Field composition: wrap the checkbox in a Field.Root and add a Field.Error before the control, and set invalid on Root for validation. The message is announced.",
    "Group multiple checkboxes under a Fieldset so the legend names the set in the accessibility tree.",
  ],

  props: [
    {
      name: "indeterminate",
      type: "boolean",
      default: "false",
      description: "Sets the native partially checked state.",
    },
    {
      name: "...others",
      type: "InputHTMLAttributes",
      description:
        "Native input props except type and size, including ref. Compose labels and descriptions through Field.",
    },
  ],
};
export default doc;
