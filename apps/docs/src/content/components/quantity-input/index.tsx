import type { ComponentContent } from "@/renderer/types";
import {
  QuantityInputBoundsDemo,
  QuantityInputCartDemo,
  QuantityInputControlledDemo,
  QuantityInputDisabledDemo,
  QuantityInputStepDemo,
} from "./demos";

const doc: ComponentContent = {
  slug: "quantity-input",
  lead: "A count a person adjusts by one: items in a cart, guests, seats. Compose it inside a Field for its label, description and error.",
  importLine: `import { Field, QuantityInput } from "@loamui/core";`,
  demos: [
    {
      title: "In a cart line",
      description:
        "The input is a native number field with a name, so the form posts the count like any other value. The buttons step it and the row takes the type and height of the controls around it.",
      code: `<Field.Root>
  <Field.Label>Quantity</Field.Label>
  <QuantityInput name="quantity" defaultValue={1} min={1} />
</Field.Root>`,
      render: () => <QuantityInputCartDemo />,
    },
    {
      title: "With bounds",
      description:
        "Fewer disables at min and More at max, so the ends are visible before they are reached. A value typed past a bound is not clamped: it is left invalid for the field to report after a submit attempt.",
      code: `<Field.Root>
  <Field.Label>Seats</Field.Label>
  <Field.Description>Between 1 and 5.</Field.Description>
  <QuantityInput defaultValue={1} min={1} max={5} />
</Field.Root>`,
      render: () => <QuantityInputBoundsDemo />,
    },
    {
      title: "Step and button names",
      description:
        "step is how much one press changes the count, and the arrow keys follow it. Fewer and More are the buttons' accessible names; labels replaces them when the page's own words say more, or when the page is not in English.",
      code: `<Field.Root>
  <Field.Label>Copies</Field.Label>
  <Field.Description>Sold in packs of 10.</Field.Description>
  <QuantityInput
    defaultValue={10}
    min={10}
    step={10}
    labels={{ decrement: "One pack fewer", increment: "One pack more" }}
  />
</Field.Root>`,
      render: () => <QuantityInputStepDemo />,
    },
    {
      title: "Disabled",
      description:
        "disabled reaches the input and both buttons, so nothing in the row can be pressed or typed into, and the description says why.",
      code: `<Field.Root>
  <Field.Label>Quantity</Field.Label>
  <Field.Description>Out of stock.</Field.Description>
  <QuantityInput defaultValue={1} min={1} disabled />
</Field.Root>`,
      render: () => <QuantityInputDisabledDemo />,
    },
    {
      title: "Controlled",
      description:
        "Drive it with value and onChange. A press of either button arrives through onChange like a typed change, so the live count can be shown wherever it helps.",
      code: `const [guests, setGuests] = useState(2);

<Field.Root>
  <Field.Label>Guests: {guests}</Field.Label>
  <QuantityInput
    value={guests}
    min={1}
    max={8}
    onChange={(e) => setGuests(e.target.valueAsNumber)}
  />
</Field.Root>`,
      render: () => <QuantityInputControlledDemo />,
    },
  ],
  whenToUse: [
    "For a small whole count the user nudges rather than composes: items in a cart, guests at a table, seats, copies. The usual move is one more or one fewer, and a press is faster than selecting the figure and retyping it.",
    "Where the bounds are part of the question (at least one, at most what is in stock): the buttons show the ends by disabling, before an error has to say so.",
  ],
  whenNotToUse: [
    'For a large or arbitrary number the user already knows, such as an account number, a weight or a year. Pressing a button forty times is not entry; use Input with inputMode="numeric".',
    "For a value chosen by feel along a visible scale, such as volume or brightness. Use Range, where the position is the point and the exact figure is not.",
  ],
  howItWorks: [
    {
      title: "The input is the value of record",
      body: "Nothing is held in React: the count lives in the native input, so a form posts it under its name, a reset restores its default, and value with onChange controls it exactly as they control an Input. The buttons adjust the value of that same input.",
    },
    {
      title: "The buttons step the native value",
      body: "Fewer and More call the input's own stepDown() and stepUp() and then fire the input and change events a browser fires for its spinner. Arrow keys still step the focused input, the step prop governs both, and the native spinner is hidden because it would duplicate the buttons in a corner of the box. This is the one place the library reaches for a number input: elsewhere a number is typed, and Input's guidance stands.",
    },
    {
      title: "Bounds disable and announce",
      body: "At min, Fewer disables; at max, More disables. A disabled button is announced as unavailable, so a screen-reader user hears the end where a sighted one sees it. A count typed past a bound is deliberately not clamped: silently changing what someone typed hides the mistake, so the input stays invalid and the field reports it after a submit attempt, in words that say the allowed range.",
    },
  ],
  errors: [
    {
      situation: "The count is out of range",
      message: "[Label] must be between [min] and [max]",
    },
    {
      situation: "The field is empty",
      message: "Enter [how many of whatever the label asks for]",
    },
  ],
  accessibility: [
    "Inside a Field.Root the input reads its id from the field, so Field.Label is a real <label> tied to it; outside one, pass aria-label or aria-labelledby. In development a count with no name at all is reported to the console. The buttons carry their own names, Fewer and More, which labels replaces when the words of the page differ.",
    'Renders a native <input type="number"> with inputMode="numeric": arrow keys step the focused value, touch devices raise a number pad, and constraint validation reports a value outside min and max through the Field, announced with aria-invalid after a submit attempt.',
    "The buttons are native <button>s with disabled at the bounds and aria-hidden glyphs, so their state and names come from the platform. Focus stays on the button after a press, so repeated presses need no re-navigation.",
  ],
  props: [
    {
      name: "min",
      type: "number",
      default: "0",
      description: "The smallest count allowed; Fewer disables here.",
    },
    {
      name: "max",
      type: "number",
      description: "The largest count allowed; More disables here.",
    },
    {
      name: "step",
      type: "number",
      default: "1",
      description: "How much one press changes the count.",
    },
    {
      name: "defaultValue",
      type: "number",
      description: "Initial count for uncontrolled usage.",
    },
    {
      name: "value",
      type: "number",
      description: "The count, when controlled; pair it with onChange.",
    },
    {
      name: "labels",
      type: "{ decrement?: string; increment?: string }",
      default: '{ decrement: "Fewer", increment: "More" }',
      description: "The buttons' accessible names, for another language or the page's own words.",
    },
    {
      name: "wrapperProps",
      type: 'PartProps<"div">',
      description:
        "Props for the row that holds the buttons. className, style, ref and every other prop land on the <input> itself.",
    },
    {
      name: "...others",
      type: "InputHTMLAttributes",
      description:
        'All native <input type="number"> props, and ref, are forwarded to the <input>, including name, disabled, required and onChange.',
    },
  ],
  contextual: true,
};

export default doc;
