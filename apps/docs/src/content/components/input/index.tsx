import type { ComponentContent } from "@/renderer/types";
import {
  InputAutofillDemo,
  InputBasicDemo,
  InputContainersDemo,
  InputDescriptionDemo,
  InputDisabledDemo,
  InputErrorDemo,
  InputNativeValidationDemo,
  InputNumericDemo,
  InputSectionsDemo,
  InputSizedDemo,
} from "./demos";

const doc: ComponentContent = {
  slug: "input",
  lead: "The single-line text box. Compose it inside a Field for its label, description and error.",
  importLine: `import { Field, Input, Button } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "Inside Field.Root the input reads its id from the field, so Field.Label is wired without any props.",
      code: `<Field.Root>
  <Field.Label>Email</Field.Label>
  <Input />
</Field.Root>`,
      render: () => <InputBasicDemo />,
    },
    {
      title: "Size from context",
      description:
        "There is no visual size prop. Body-text and spacing tokens give the control a readable, generous default and adapt it to its container. The native input owns its padding, so taps inside that padding focus the field. Single-line inputs align with single-line Buttons through shared typography and spacing; neither has a fixed height. The native HTML size attribute still sets an answer width in characters.",
      code: `<div style={{ containerType: "inline-size", inlineSize: "16rem" }}>
  <Field.Root>
    <Field.Label>In a narrow container</Field.Label>
    <Input />
  </Field.Root>
</div>

<div style={{ containerType: "inline-size", inlineSize: "30rem" }}>
  <Field.Root>
    <Field.Label>In a wide one</Field.Label>
    <Input />
  </Field.Root>
</div>`,
      render: () => <InputContainersDemo />,
    },
    {
      title: "Description and required",
      description:
        "Field.Description is linked to the input through aria-describedby, so the hint is announced with the field. required lives on the control as the native attribute: it is never shown as an asterisk, and it drives validation after a submit attempt.",
      code: `<Field.Root>
  <Field.Label>Username</Field.Label>
  <Field.Description>This will be your public handle.</Field.Description>
  <Input required />
</Field.Root>`,
      render: () => <InputDescriptionDemo />,
    },
    {
      title: "Error state",
      description:
        "Set invalid on Field.Root and compose Field.Error before the control for its announced message.",
      code: `<Field.Root invalid>
  <Field.Label>Email</Field.Label>
  <Field.Error>Enter an email address in the correct format, like name@example.com</Field.Error>
  <Input defaultValue="not-an-email" />
</Field.Root>`,
      render: () => <InputErrorDemo />,
    },
    {
      title: "Native validation",
      description:
        'Native constraints such as required and type="email" are announced and styled after a submit attempt, not on blur. Existing errors clear as soon as the value becomes valid.',
      code: `<form>
  <Field.Root>
    <Field.Label>Work email</Field.Label>
    <Input type="email" required />
  </Field.Root>
  <Button type="submit">Check email</Button>
</form>`,
      render: () => <InputNativeValidationDemo />,
    },
    {
      title: "Disabled",
      description:
        "The disabled attribute forwards to the native input: the field is dimmed, skipped by the tab sequence, and shows the not-allowed cursor.",
      code: `<Field.Root>
  <Field.Label>Account ID</Field.Label>
  <Input defaultValue="acct_8f2c" disabled />
</Field.Root>`,
      render: () => <InputDisabledDemo />,
    },
    {
      title: "Prefixes and suffixes",
      description:
        "Use startSection and endSection for content inside the bordered box. Field.Label names the input; include any meaningful unit or suffix in the label or description.",
      code: `<Field.Root>
  <Field.Label>Handle</Field.Label>
  <Input startSection={<span aria-hidden="true">@</span>} />
</Field.Root>

<Field.Root>
  <Field.Label>Site name on .dev</Field.Label>
  <Input endSection={<span aria-hidden="true">.dev</span>} />
</Field.Root>`,
      render: () => <InputSectionsDemo />,
    },
  ],
  whenToUse: [
    "For short, free-form single-line text: names, emails, search terms, URLs.",
    "Inside a Field.Root, which ties the label, helper description and inline error together: the control self-wires from the surrounding field, with message IDs registered after hydration. Supply explicit ARIA links when needed in initial server HTML; see the Field page.",
  ],
  whenNotToUse: [
    "For multi-line text: use Textarea.",
    "For choosing from a fixed set of options: use Select, Radio or Checkbox.",
  ],
  howItWorks: [
    {
      title: "Asking for numbers",
      body: 'Never use type="number": scroll wheels and arrow keys silently change the value, and browsers give poor feedback when the input is invalid. Pass inputMode="numeric" for whole numbers or inputMode="decimal" for amounts (both forward straight to the native input) so touch devices raise a number pad while the field keeps normal text behaviour. A small count a person nudges by one (items in a cart, guests, seats) is QuantityInput, the library\'s one use of a number input: its buttons make the stepping deliberate.',
      code: `<Field.Root>
  <Field.Label>Account number</Field.Label>
  <Input inputMode="numeric" />
</Field.Root>

<Field.Root>
  <Field.Label>Weight in kilograms</Field.Label>
  <Input inputMode="decimal" />
</Field.Root>`,
      render: () => <InputNumericDemo />,
    },
    {
      title: "Codes and references",
      body: 'Values users copy rather than compose (booking references, invoice numbers, licence keys) are not words, so set spellCheck={false} to stop browsers underlining a correct value as a mistake. A digits-only reference also takes inputMode="numeric".',
    },
    {
      title: "Autofill and input purpose",
      body: 'Any field asking for something about the user gets the matching autoComplete value: "name", "email", "postal-code", "bday-day" and the rest of the HTML autofill set, forwarded straight through. This is WCAG 1.3.5 (Identify Input Purpose): it lets browsers fill the answer correctly and lets assistive tech present the field in the user’s own terms.',
      code: `<Field.Root>
  <Field.Label>Email</Field.Label>
  <Input type="email" autoComplete="email" />
</Field.Root>`,
      render: () => <InputAutofillDemo />,
    },
    {
      title: "Placeholders are not labels",
      body: "A placeholder vanishes the moment the user types, is skipped by some assistive technology, and its dimmed colour fails contrast as instruction text. Field.Label is for what the field is; format hints go in Field.Description, which stays visible and is announced. These docs use none at all: the example lives in Field.Description, where it survives typing.",
    },
    {
      title: "Width belongs to the container, or to the answer",
      body: "The field fills whatever it is placed in; there is no width prop. Width is information: a four-character reference in a page-wide box reads as a harder question than it is. For an answer of a known length, the native size attribute is the platform's own measure: the input is as wide as that many characters and it keeps its intrinsic width. DateInput is built on it. For anything else, put the field in a container sized to the expected answer.",
      code: `<Field.Root>
  <Field.Label>Sort code</Field.Label>
  <Input inputMode="numeric" size={6} />
</Field.Root>`,
      render: () => <InputSizedDemo />,
    },
  ],
  errors: [
    {
      situation: "The field is empty",
      message: "Enter [whatever the label asks for]",
    },
    {
      situation: "The value is the wrong format",
      message: "Enter [a/an] [thing] in the correct format, like [example]",
    },
    {
      situation: "The value is too long / too short",
      message: "[Label] must be [N] characters or fewer / or more",
    },
    {
      situation: "The value contains a disallowed character",
      message: "[Label] must only include [allowed characters]",
    },
    {
      situation: "A number is out of range",
      message: "[Label] must be between [min] and [max]",
    },
  ],
  accessibility: [
    "Inside a Field.Root the input reads its id from the field, so Field.Label is a real <label> tied to it: clicking the label focuses the field and screen readers announce it.",
    "Field.Description and Field.Error are linked via aria-describedby, and Field.Root invalid sets aria-invalid, announced together when the field gains focus.",
    'Field.Error uses role="alert" so the message is announced as it appears.',
    "Mark decorative startSection and endSection content aria-hidden, and carry meaningful units in the label or description so non-visual users get them too.",
    "Under forced colours the danger border colour is dropped, so an invalid field carries its state as an outline in a system colour, with the focus ring offset further out.",
    "Mark optional fields in words (Field.Label's optional prop) rather than asterisking required ones: required lives on the control as the native required attribute, which drives validation after submission.",
  ],
  props: [
    {
      name: "startSection / endSection",
      type: "ReactNode",
      description: "Content inside the bordered box, before or after the input.",
    },
    {
      name: "wrapperProps",
      type: 'Omit<PartProps<"div">, "children">',
      description:
        "Props for the bordered wrapper. className, style, ref and other native input props on Input target the input itself.",
    },
    {
      name: "size",
      type: "number",
      description:
        "The native size attribute, honoured: the input is as wide as that many characters and it keeps its intrinsic width.",
    },
    {
      name: "...others",
      type: "InputHTMLAttributes",
      description: "All native <input> props, and ref, are forwarded to the <input>.",
    },
  ],
};

export default doc;
