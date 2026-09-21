import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Sign up",
  description:
    "Creating an account: one name field, an email, a password with its rules stated first, and consent as a choice, on the same card as signing in.",
  category: "forms",
  uses: ["Button", "Card", "Checkbox", "Field", "Input", "PasswordInput"],
  notes: {
    modern:
      'One name field with autoComplete="name", because a single box holds every name in the world in the order its owner writes it; the password takes autoComplete="new-password", the value that tells a password manager to make one up and save it, and minLength carries the rule the description states. The same 24rem Card as Sign in, and the one thing added is the consent line, a Checkbox whose label holds two links and wraps inside the card’s width with no rule of its own. The actions row declares --loam-context: primary because the one Button is the form’s action; primary is the brand slot, neutral until a theme fills it, so the declaration says where the action belongs, not that it stands out.',
    accessible:
      "The password rules sit before the box as a Field.Description, read and announced before anyone types, so nobody meets a rule for the first time in an error; there is no confirm-password field, because seeing the value catches more mistakes than retyping it; consent is an unticked Checkbox with the terms linked inside its label.",
  },
  composition:
    "The same root, form and footer as Sign In with different fields inside: the shape is the example's, the questions are the page's.",
  tags: ["register", "registration", "account", "create account", "consent"],
  order: 2,
};
