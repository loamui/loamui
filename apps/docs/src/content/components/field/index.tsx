import type { ComponentContent } from "@/renderer/types";
import {
  FieldFormDemo,
  FieldComposeDemo,
  FieldCustomControlDemo,
  FieldErrorDemo,
  FieldOptionalDemo,
} from "./demos";

const doc: ComponentContent = {
  slug: "field",
  lead: "A composable form-field primitive that wires label, description, error and accessibility for any control.",
  importLine: `import { Field, Input, Button } from "@loamui/core";`,
  demos: [
    {
      title: "Composing a field",
      description:
        "Assemble the parts in order (label, description, error, control): the message sits above the control so it is read before the answer is given. Field.Root links the label to the control and gathers the description and error into aria-describedby; the LoamUI controls (Input, Select, Textarea, Range) self-wire from the surrounding field, so no extra part is needed around them.",
      code: `<Field.Root>
  <Field.Label>Email</Field.Label>
  <Field.Description>We'll only use this to reply.</Field.Description>
  <Input />
</Field.Root>`,
      render: () => <FieldComposeDemo />,
    },
    {
      title: "Error state",
      description:
        'Set invalid on Field.Root for the validation state. Field.Error supplies the message and is announced via role="alert".',
      code: `<Field.Root invalid>
  <Field.Label>Email</Field.Label>
  <Field.Error>
    Enter an email address in the correct format, like name@example.com
  </Field.Error>
  <Input defaultValue="not-an-email" />
</Field.Root>`,
      render: () => <FieldErrorDemo />,
    },
    {
      title: "Optional field",
      description:
        "Mark optional fields in words rather than flagging required ones with an asterisk: most fields are required, so the exceptions are the useful signal.",
      code: `<Field.Root>
  <Field.Label optional>Company</Field.Label>
  <Input />
</Field.Root>`,
      render: () => <FieldOptionalDemo />,
    },
    {
      title: "A whole form",
      description:
        "Fields compose into a form with nothing extra: each control self-wires, each Field.Error appears where its field is, and submit is an ordinary button. For the summary that belongs at the top of a longer form, see ErrorSummary.",
      code: `<form onSubmit={onSubmit} noValidate>
  <Field.Root invalid={Boolean(errors.name)}>
    <Field.Label>Full name</Field.Label>
    <Field.Error>{errors.name}</Field.Error>
    <Input name="name" autoComplete="name" />
  </Field.Root>
  <Field.Root invalid={Boolean(errors.email)}>
    <Field.Label>Email address</Field.Label>
    <Field.Description>We'll only use this to reply.</Field.Description>
    <Field.Error>{errors.email}</Field.Error>
    <Input name="email" type="email" autoComplete="email" />
  </Field.Root>
  <Button type="submit">Save and continue</Button>
</form>`,
      render: () => <FieldFormDemo />,
    },
    {
      title: "Custom controls via Field.Control",
      description:
        "Field.Control wires the field's id, aria-describedby and aria-invalid onto any element: an element to clone, or a function receiving the typed props. The built-in controls never need it; reach for it when bringing your own.",
      code: `<Field.Root>
  <Field.Label>Amount</Field.Label>
  <Field.Description>A bare native input, not a LoamUI control.</Field.Description>
  <Field.Control
    render={(props) => <input {...props} inputMode="decimal" />}
  />
</Field.Root>`,
      render: () => <FieldCustomControlDemo />,
    },
  ],
  whenToUse: [
    "For every labelled form control: wrap Input, Select, Textarea or Range in Field.Root and add Field.Label, Field.Description and Field.Error as needed. The control wires itself to the field.",
    "To give a custom or third-party control the same accessible label/description/error wiring, via Field.Control.",
  ],
  whenNotToUse: [
    "For naming a whole set of controls: use Fieldset and give each option its own Field.Item.",
    "As a layout grid: Field only arranges a single control and its supporting text.",
  ],
  howItWorks: [
    {
      title: "Server rendering and custom IDs",
      body: "Parts can live inside custom child components. They register their actual IDs in client layout effects; custom IDs and conditional removal are supported. For description and error links in initial server HTML, supply stable IDs on the parts and aria-describedby on the control. Put the control ID on Root when it must be fixed before hydration. invalid is explicit and works during server rendering.",
    },
    {
      title: "Writing error messages",
      body: "An error message says what happened and how to fix it, in the words of the question itself: if the label asks “How many hours do you work a week?”, the error is “Enter how many hours you work a week”, never “This field is required”. Use an instruction (“Enter your first name”) when the field is empty and a description (“Name must be 35 characters or fewer”) when the value breaks a rule. Write in plain, positive language: no “please” (it implies a choice), no “sorry” (it doesn't help), no “valid/invalid” (vague), no jargon or error codes, no humour. Keep the user's input on screen while showing the error: never clear the field.",
    },
    {
      title: "Writing labels and hints",
      body: "Labels are sentence case with no trailing colon, and name the thing the field asks for. A Field.Description is a single short sentence; never put links in it, because text reached through aria-describedby is announced, not focusable, so a link there is unreachable for the people it is read to.",
    },
    {
      title: "When validation runs",
      body: "Two paths, one timing rule. Native constraints (required, type, minlength) open the error state only after a submit attempt. Once open, the error remains while the value is invalid and clears as soon as the correction is valid. The render path is explicit: set invalid on Field.Root from the validation result and render Field.Error for its message. Error content does not determine validity. Neither path validates on blur or complains mid-word.",
    },
    {
      title: "Styling state from outside",
      body: 'Everything the family knows about a field is expressed in selectors you can target: [aria-invalid="true"] on the control, :has(> p.error) on the .loam-Field root, :has(input:disabled) on a control box (disabled is detected on the native control, never declared on a wrapper), and :focus-within on the field box. There are no visual state props to mirror; the DOM is the contract.',
    },
    {
      title: "One error, one place, one wording",
      body: 'The message renders once, inside the field, tied to the control by aria-describedby and announced by role="alert". The wiring is automatic when Field.Error has content. Keep the wording identical anywhere else it appears so it reads the same out of context.',
    },
  ],
  errors: [
    {
      situation: "The field is empty",
      message: "Enter [whatever the label asks for]",
    },
    {
      situation: "The value is the wrong format",
      message: "[Label] must be [format], like [example]",
    },
    {
      situation: "The value is too long / too short",
      message: "[Label] must be [N] characters or fewer / or more",
    },
    {
      situation: "The value is out of range",
      message: "[Label] must be between [min] and [max]",
    },
  ],
  accessibility: [
    "Field.Root generates one id and hands it to Field.Label (via htmlFor) and to the control, so label and control are always associated.",
    "After hydration, description and error ids are added to the control's aria-describedby when those parts are present, ahead of any aria-describedby the control carries itself, each id once: a control that brings its own description keeps it.",
    'Field.Root invalid sets aria-invalid on the control, including server HTML. Field.Error is announced with role="alert"; a visually hidden "Error: " prefix (labels.errorPrefix on the Root) makes the announcement unmistakable out of context.',
    "The LoamUI controls read this wiring from context; Field.Control hands it to arbitrary elements, letting you keep semantic, native controls instead of re-implementing them.",
  ],
  parts: [
    {
      name: "Field.Item",
      description:
        "A local label and description scope for one option within a group. Inherits Field validation state while giving its control independent IDs. Can also be used outside Field.Root. Native div props are forwarded; id sets the control ID.",
    },
    {
      name: "Field.Root",
      description:
        "Wraps a field and provides context. The invalid prop supplies validation state independently of message content. Native <div> props are forwarded.",
      props: [
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          description: "Explicit validation state, available before hydration.",
        },
        {
          name: "id",
          type: "string",
          description: "Base id for the control; auto-generated when omitted.",
        },
        {
          name: "labels",
          type: "{ optional?: ReactNode; errorPrefix?: ReactNode }",
          default: '{ optional: "(optional)", errorPrefix: "Error: " }',
          description:
            "The Field's own words, read by Field.Label and Field.Error: the text after an optional label, and the hidden words before an error. Pass them in the page's language.",
        },
      ],
    },
    {
      name: "Field.Label",
      description: "Label tied to the control; native <label> props and ref are forwarded.",
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
      name: "Field.Description",
      description: "Helper text, linked via aria-describedby; native <p> props are forwarded.",
    },
    {
      name: "Field.Control",
      description:
        "Wires id, aria-describedby and aria-invalid onto an arbitrary element. The LoamUI controls self-wire from the field and don't need it.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description:
            "The element to wire: an element to clone, or a function receiving the props.",
        },
      ],
    },
    {
      name: "Field.Error",
      description:
        'Error message with role="alert"; renders nothing for empty strings, whitespace, null or false. It does not set validation state. Native <p> props are forwarded.',
    },
  ],
};

export default doc;
