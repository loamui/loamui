import type { ComponentContent } from "@/renderer/types";
import { Field, Radio, RadioGroup } from "@loamui/core";

export function RadioBasicDemo() {
  return (
    <RadioGroup.Root defaultValue="system">
      <RadioGroup.Legend>Theme</RadioGroup.Legend>
      <Field.Item>
        <Field.Label>
          <Radio value="system" /> System
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="light" /> Light
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="dark" /> Dark
        </Field.Label>
      </Field.Item>
    </RadioGroup.Root>
  );
}

export function RadioDescriptionsDemo() {
  return (
    <RadioGroup.Root>
      <RadioGroup.Legend>Delivery</RadioGroup.Legend>
      <Field.Item>
        <Field.Label>
          <Radio value="standard" /> Standard
        </Field.Label>
        <Field.Description>Arrives in 3-5 business days.</Field.Description>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="express" /> Express
        </Field.Label>
        <Field.Description>Guaranteed next-day delivery.</Field.Description>
      </Field.Item>
    </RadioGroup.Root>
  );
}

export function RadioHorizontalDemo() {
  return (
    <RadioGroup.Root orientation="horizontal">
      <RadioGroup.Legend>Contact preference</RadioGroup.Legend>
      <Field.Item>
        <Field.Label>
          <Radio value="email" /> Email
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="phone" /> Phone
        </Field.Label>
      </Field.Item>
    </RadioGroup.Root>
  );
}

export function RadioDisabledDemo() {
  return (
    <RadioGroup.Root>
      <RadioGroup.Legend>Plan</RadioGroup.Legend>
      <Field.Item>
        <Field.Label>
          <Radio value="basic" /> Basic
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="pro" /> Pro
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="legacy" disabled /> Legacy
        </Field.Label>
      </Field.Item>
    </RadioGroup.Root>
  );
}

export function RadioGroupErrorDemo() {
  return (
    <RadioGroup.Root invalid>
      <RadioGroup.Legend>Plan</RadioGroup.Legend>
      <RadioGroup.Description>You can change it later.</RadioGroup.Description>
      <RadioGroup.Error>Select a plan to continue</RadioGroup.Error>
      <Field.Item>
        <Field.Label>
          <Radio value="basic" /> Basic
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="pro" /> Pro
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="legacy" /> Legacy
        </Field.Label>
      </Field.Item>
    </RadioGroup.Root>
  );
}

export function RadioGroupLabelsDemo() {
  return (
    <RadioGroup.Root invalid labels={{ optional: "(facultatif)", errorPrefix: "Erreur : " }}>
      <RadioGroup.Legend optional>Formule</RadioGroup.Legend>
      <RadioGroup.Error>Choisissez une formule</RadioGroup.Error>
      <Field.Item>
        <Field.Label>
          <Radio value="basic" /> Essentielle
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="pro" /> Pro
        </Field.Label>
      </Field.Item>
    </RadioGroup.Root>
  );
}

const doc: ComponentContent = {
  slug: "radio",
  lead: "A single choice from a small set of visible, mutually exclusive options.",
  importLine: `import { Field, Radio, RadioGroup } from "@loamui/core";`,
  demos: [
    {
      title: "Basic group",
      description:
        "A RadioGroup.Root shares one name so only one option can be selected; RadioGroup.Legend names the set.",
      code: `<RadioGroup.Root defaultValue="system">
  <RadioGroup.Legend>Theme</RadioGroup.Legend>
  <Field.Item>
    <Field.Label>
      <Radio value="system" /> System
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="light" /> Light
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="dark" /> Dark
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>`,
      render: () => <RadioBasicDemo />,
    },
    {
      title: "With descriptions",
      description: "Each option can carry helper text under its label.",
      code: `<RadioGroup.Root>
  <RadioGroup.Legend>Delivery</RadioGroup.Legend>
  <Field.Item>
    <Field.Label>
      <Radio value="standard" /> Standard
    </Field.Label>
    <Field.Description>Arrives in 3-5 business days.</Field.Description>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="express" /> Express
    </Field.Label>
    <Field.Description>Guaranteed next-day delivery.</Field.Description>
  </Field.Item>
</RadioGroup.Root>`,
      render: () => <RadioDescriptionsDemo />,
    },
    {
      title: "Horizontal",
      description:
        "Lay the options out in a row only when there are two, short options. More than that, or longer labels, read better stacked.",
      code: `<RadioGroup.Root orientation="horizontal">
  <RadioGroup.Legend>Contact preference</RadioGroup.Legend>
  <Field.Item>
    <Field.Label>
      <Radio value="email" /> Email
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="phone" /> Phone
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>`,
      render: () => <RadioHorizontalDemo />,
    },
    {
      title: "Disabled option",
      description:
        "Disable a single Radio to keep an unavailable option visible in the set. The rest of the group stays selectable.",
      code: `<RadioGroup.Root>
  <RadioGroup.Legend>Plan</RadioGroup.Legend>
  <Field.Item>
    <Field.Label>
      <Radio value="basic" /> Basic
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="pro" /> Pro
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="legacy" disabled /> Legacy
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>`,
      render: () => <RadioDisabledDemo />,
    },
    {
      title: "Group description and error",
      description:
        "RadioGroup.Description and RadioGroup.Error are joined to the group with aria-describedby. Set invalid on Root for validation: the message and the danger rings sit on the fieldset and its radios, and every choice stays selectable.",
      code: `<RadioGroup.Root invalid>
  <RadioGroup.Legend>Plan</RadioGroup.Legend>
  <RadioGroup.Description>You can change it later.</RadioGroup.Description>
  <RadioGroup.Error>Select a plan to continue</RadioGroup.Error>
  <Field.Item>
    <Field.Label>
      <Radio value="basic" /> Basic
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="pro" /> Pro
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="legacy" /> Legacy
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>`,
      render: () => <RadioGroupErrorDemo />,
    },
    {
      title: "In another language",
      description:
        "The group's own words, the optional marker after the legend and the hidden prefix before an error, come from labels on the Root.",
      code: `<RadioGroup.Root invalid labels={{ optional: "(facultatif)", errorPrefix: "Erreur : " }}>
  <RadioGroup.Legend optional>Formule</RadioGroup.Legend>
  <RadioGroup.Error>Choisissez une formule</RadioGroup.Error>
  <Field.Item>
    <Field.Label>
      <Radio value="basic" /> Essentielle
    </Field.Label>
  </Field.Item>
  <Field.Item>
    <Field.Label>
      <Radio value="pro" /> Pro
    </Field.Label>
  </Field.Item>
</RadioGroup.Root>`,
      render: () => <RadioGroupLabelsDemo />,
    },
  ],
  whenToUse: [
    "For choosing exactly one option from a small, visible set (roughly 2 to 5).",
    "Always inside a RadioGroup.Root, which shares a name and labels the set with a <fieldset>/<legend>.",
  ],
  whenNotToUse: [
    "For many options: a Select is more compact.",
    "For selecting several options: use Checkbox.",
    "For a single on/off: use Checkbox or Switch.",
  ],
  howItWorks: [
    {
      title: "A native radio, styled by accent-color",
      body: 'This is a plain <input type="radio">: no custom dot. The elements layer paints it with the platform\'s own accent-color (the neutral primary); selection, keyboard arrow-cycling and forced-colours support come from the browser. Field.Item supplies label and description associations; RadioGroup shares the native name and selection state.',
    },
    {
      title: "Never pre-select",
      body: "A group with a defaultValue lets users miss the question entirely and submit an answer they never gave, and once any radio is selected, the group can never be returned to unanswered. So when every option might be wrong, offer an explicit 'None of the above' option rather than leaving the user stuck. Omit defaultValue so the first selection is always a deliberate choice; reserve a default for the rare setting with one safe, overwhelmingly common value.",
    },
    {
      title: "Order the options",
      body: "List options alphabetically by default, so the order carries no editorial weight. Ordering by expected popularity needs extreme caution: it nudges users toward the top answers and, repeated across every form, can entrench the very distribution it assumed. Orders with intrinsic domain meaning (size, severity, date) are fine.",
    },
    {
      title: "Controls sit left of labels",
      body: "Compose the radio before its label text, keeping every control on the reading edge where screen-magnifier users panning a zoomed viewport will find it next to the text they are reading. Don't restyle labels to the other side: a right-hand control drifts out of the magnified view entirely.",
    },
  ],
  errors: [
    {
      situation: "A yes/no question is unanswered",
      message: "Select yes if [the thing is true]",
    },
    {
      situation: "A choice is unanswered",
      message: "Select [whatever the legend asks for]",
    },
  ],
  accessibility: [
    "RadioGroup.Root renders a native <fieldset> with a <legend>, the accessible way to name a group: screen readers announce the legend when a radio is focused.",
    "Radios share one name so the browser enforces single-selection and arrow-key navigation natively.",
    'RadioGroup.Root invalid sets aria-invalid on the fieldset; description and error IDs register after hydration, which carries role="radiogroup", the one place ARIA allows aria-invalid for radios. Required native groups take the same state after a submit attempt and clear it after a selection. The individual radios never claim it; their danger rings are pure CSS answering the group state.',
    "Disabled is detected on the native input (:has(input:disabled) on the row), never declared on a wrapper.",
  ],

  props: [
    {
      name: "label / description",
      type: "ReactNode",
      description:
        "Optional content for a complete labelled row. Omit both when composing the control inside Field.Label.",
    },
    {
      name: "wrapperProps",
      type: 'Omit<PartProps<"label">, "children" | "htmlFor">',
      description:
        "Props for the row rendered with label or description. className, style and ref on the component target its native input.",
    },
    {
      name: "...others",
      type: "InputHTMLAttributes",
      description:
        "Native input props except type and size, including ref. Field.Item scopes each option’s label and description.",
    },
  ],
  parts: [
    {
      name: "RadioGroup.Root",
      description:
        'The group: a Fieldset.Root with role="radiogroup" that shares a name and the selection with the <Radio> options inside it, at any depth. Native <fieldset> props and ref are forwarded.',
      props: [
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          description:
            "Explicit validation state, available in server HTML. Message content is independent; supply aria-describedby for server-rendered associations.",
        },
        {
          name: "name",
          type: "string",
          description: "Shared name for all radios (auto-generated if omitted).",
        },
        {
          name: "value",
          type: "string",
          description: "Controlled selected value (pair with onChange).",
        },
        {
          name: "defaultValue",
          type: "string",
          description: "Initial selected value for uncontrolled usage.",
        },
        {
          name: "onChange",
          type: "(value: string) => void",
          description: "Fires with the newly selected value.",
        },
        {
          name: "orientation",
          type: `"vertical" | "horizontal"`,
          default: `"vertical"`,
          description: "Layout direction of the options.",
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
      name: "RadioGroup.Legend",
      description:
        "The group's name: Fieldset.Legend, so optional marks the group optional in words. Native <legend> props and ref are forwarded.",
      props: [
        {
          name: "optional",
          type: "boolean",
          default: "false",
          description:
            'Appends labels.optional ("(optional)"); optional is marked in words, not with an asterisk.',
        },
      ],
    },
    {
      name: "RadioGroup.Description",
      description:
        "Helper text under the legend, joined to the group with aria-describedby. Native <p> props and ref are forwarded.",
    },
    {
      name: "RadioGroup.Error",
      description:
        'The group\'s error, announced with role="alert". Validation state is supplied by Root; empty content renders nothing. Native <p> props and ref are forwarded.',
    },
  ],
};

export default doc;
