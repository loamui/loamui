import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Forgot password on the label",
  description:
    "A password field whose label row carries a link to reset the password at its end: beside the label, not inside it.",
  category: "forms",
  uses: ["Field", "PasswordInput"],
  notes: {
    modern:
      'A link, because resetting a password goes somewhere; the box is core’s PasswordInput with autoComplete="current-password", so a password manager fills it and the Show password toggle keeps its own name. The row is a wrapping flex line with space between: on a narrow field the link drops to a second line and keeps to the end edge by an auto margin, with no breakpoint.',
    accessible:
      "The link sits beside the label, not in it: a link inside a <label> is inside the box's click target and its words join the field's name, so a screen reader would hear the field as Password Forgot your password. Here the field is named Password and the link is a link.",
  },
  composition:
    "Field.Label and PasswordInput as core ships them; the example adds one row element around the label so the link can share its line without being a child of it.",
  tags: ["password", "forgot password", "label", "link", "sign in"],
  order: 17,
};
