import type { ComponentContent } from "@/renderer/types";
import { Field, PasswordInput } from "@loamui/core";

export function PasswordInputSignInDemo() {
  return (
    <div style={{ maxInlineSize: "24rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <PasswordInput name="password" autoComplete="current-password" />
      </Field.Root>
    </div>
  );
}

export function PasswordInputNewDemo() {
  return (
    <div style={{ maxInlineSize: "24rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Choose a password</Field.Label>
        <Field.Description>
          At least 12 characters. A few unrelated words are easier to remember than one word with
          numbers in it.
        </Field.Description>
        <PasswordInput name="new-password" autoComplete="new-password" />
      </Field.Root>
    </div>
  );
}

export function PasswordInputErrorDemo() {
  return (
    <div style={{ maxInlineSize: "24rem", inlineSize: "100%" }}>
      <Field.Root invalid>
        <Field.Label>Password</Field.Label>
        <Field.Error>Enter your password</Field.Error>
        <PasswordInput name="password" autoComplete="current-password" />
      </Field.Root>
    </div>
  );
}

export function PasswordInputLabelsDemo() {
  return (
    <div style={{ maxInlineSize: "24rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Mot de passe</Field.Label>
        <PasswordInput
          name="password"
          autoComplete="current-password"
          labels={{ show: "Afficher le mot de passe" }}
        />
      </Field.Root>
    </div>
  );
}

const doc: ComponentContent = {
  slug: "password-input",
  lead: "A password box with a toggle that shows what was typed. Compose it inside a Field for its label, description and error.",
  importLine: `import { Field, PasswordInput } from "@loamui/core";`,
  demos: [
    {
      title: "Signing in",
      description:
        "The library's Input with type password, with a Button that shows the text. The toggle sits beside the input when both fit and below it in narrower spaces. Inside Field.Root the input reads its id from the field, so Field.Label is wired without any props; autoComplete tells a password manager which password this is.",
      code: `<Field.Root>
  <Field.Label>Password</Field.Label>
  <PasswordInput name="password" autoComplete="current-password" />
</Field.Root>`,
      render: () => <PasswordInputSignInDemo />,
    },
    {
      title: "Making one up",
      description:
        'autoComplete="new-password" tells a browser or password manager this is a password to make up and save, not one to look up, and stops it filling the current one. The rule lives in Field.Description, before the answer is given.',
      code: `<Field.Root>
  <Field.Label>Choose a password</Field.Label>
  <Field.Description>
    At least 12 characters. A few unrelated words are easier to remember
    than one word with numbers in it.
  </Field.Description>
  <PasswordInput name="new-password" autoComplete="new-password" />
</Field.Root>`,
      render: () => <PasswordInputNewDemo />,
    },
    {
      title: "Error state",
      description:
        "A Field.Error before the control marks the box invalid and is announced, exactly as it does for Input.",
      code: `<Field.Root invalid>
  <Field.Label>Password</Field.Label>
  <Field.Error>Enter your password</Field.Error>
  <PasswordInput name="password" autoComplete="current-password" />
</Field.Root>`,
      render: () => <PasswordInputErrorDemo />,
    },
    {
      title: "In another language",
      description: "The toggle's words come from labels; the rest is the page's own.",
      code: `<Field.Root>
  <Field.Label>Mot de passe</Field.Label>
  <PasswordInput
    name="password"
    autoComplete="current-password"
    labels={{ show: "Afficher le mot de passe" }}
  />
</Field.Root>`,
      render: () => <PasswordInputLabelsDemo />,
    },
  ],
  whenToUse: [
    "For any password the user types: signing in, making one up, confirming a change. The toggle lets a long password be checked by reading it rather than retyped.",
    "Inside a Field.Root, which ties the label, the rule in the description and the error together; the control self-wires from the surrounding field.",
  ],
  whenNotToUse: [
    "For a one-time code or a PIN sent to the user: it is not a secret they chose, so use Input with inputMode numeric and autoComplete one-time-code.",
    "Password policy belongs to your application. Explain its actual requirements beside the field and avoid strength claims based only on length.",
  ],
  howItWorks: [
    {
      title: "Show, never confirm",
      body: "A second 'confirm password' box doubles the typing and catches only the mistake the user made twice. A toggle that shows the password catches every mistake, once, and costs one press. The toggle is a Button with visible words, not an eye icon alone: it is used more when it can be read.",
    },
    {
      title: "One signal for the state",
      body: "The toggle's name is constant, Show password, and aria-pressed says whether it is on. A button whose name changed to Hide password as well would announce the state twice, and a screen reader user pressing it would hear a different button than the one they pressed. Pressed is the one signal a toggle button gives.",
    },
    {
      title: "Shown as text, left alone",
      body: "Once shown, the box is an ordinary text input, so the browser would happily capitalise the first letter on a phone or underline a made-up word as a spelling mistake. Both are off, always, so what the user sees is what they typed.",
    },
    {
      title: "Say which password it is",
      body: 'Pass the autofill purpose yourself: autoComplete="current-password" to sign in, "new-password" to make one up. It is the one thing a password manager needs to know to fill the right value, or to offer a generated one, and it is WCAG 1.3.5 (Identify Input Purpose).',
    },
  ],
  errors: [
    {
      situation: "The field is empty",
      message: "Enter your password",
    },
    {
      situation: "A new password breaks a rule",
      message: "Enter a password of at least [N] characters",
    },
    {
      situation: "The password is wrong",
      message: "The email address or password is incorrect",
    },
  ],
  accessibility: [
    "Inside a Field.Root the input reads its id from the field, so Field.Label is a real <label> tied to it, and Field.Description and Field.Error are linked via aria-describedby; Field.Root invalid sets aria-invalid.",
    'The toggle is a native <button type="button"> with a constant name and aria-pressed; pressing it swaps the input between type password and type text without moving focus or changing the value.',
    "The box is the library's Input, so its focus ring, invalid state and forced-colours treatment are Input's own.",
  ],
  props: [
    {
      name: "labels",
      type: "{ show?: ReactNode }",
      default: '{ show: "Show password" }',
      description: "The toggle's name, for another language. It never changes with the state.",
    },
    {
      name: "wrapperProps",
      type: 'PartProps<"div">',
      description:
        "Props for the row that holds the box and the toggle. className, style, ref and every other prop land on the <input> itself.",
    },
    {
      name: "...others",
      type: "InputProps",
      description:
        "All native Input props except type are forwarded to the <input>. Compose any surrounding content explicitly.",
    },
  ],
};

export default doc;
