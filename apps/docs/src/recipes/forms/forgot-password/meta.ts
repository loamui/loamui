import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Forgot password",
  description:
    "Asking for a reset link: one email field, a line saying what will happen, one action, and the way back to signing in.",
  category: "forms",
  uses: ["Button", "Card", "Field", "Input"],
  notes: {
    modern:
      'A native form named by its heading, with one email field carrying autoComplete="email" and inputMode="email" so a phone offers the keyboard with @ on it. One field, so the card is mostly type: the description between the title and the form takes over the title’s gap, and the 24rem cap keeps that paragraph to two lines. The actions row declares --loam-context: primary because the one Button is the form’s action; primary is the brand slot, neutral until a theme fills it, so the declaration says where the action belongs, not that it stands out.',
    accessible:
      'The line before the field says what happens next, and says "if it has an account": the same words after submitting whether or not the address is known, because "no account with that address" tells a stranger which addresses are customers one guess at a time. The footer keeps a way back for the visitor who typed the wrong address.',
  },
  composition:
    "The account-form shape again with the fields cut to one: the description slots between the title and the form and takes over the title's gap.",
  tags: ["reset password", "recovery", "account", "email"],
  order: 3,
};
