import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Password length feedback",
  description:
    "A password field with a native length meter and explicit requirement feedback. It shows what has been checked without claiming to measure password strength.",
  category: "forms",
  uses: ["Field", "Meter", "PasswordInput"],
  integration:
    "This is length feedback, not a password-strength estimator. The twelve-character minimum is an example requirement. Apply your application’s actual password policy and server-side validation; do not accept a password solely because this meter is full.",
  notes: {
    modern:
      "A native meter counts progress toward the stated length requirement, and autoComplete=new-password enables password-manager suggestions. The requirement uses a data-met attribute, text and a currentColor icon, so its state does not depend on colour alone.",
    accessible:
      "The meter has a text equivalent, and the requirement states met or not met in words. Live feedback reports character count and the length requirement only, never Weak or Strong.",
  },
  composition:
    "Field connects the input and its description; an instance-specific ID includes the requirement list in that description.",
  tags: ["password", "meter", "new password", "registration", "rules", "length"],
  order: 8,
};
