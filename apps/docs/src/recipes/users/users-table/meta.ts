import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Users table",
  description:
    "The team as a Table: a picture and a name heading each row, their role, an email and a phone number as links, and a menu of actions at the end named for the person.",
  category: "users",
  uses: ["Avatar", "Menu", "Table"],
  notes: {
    modern:
      'A real table with a caption, column headers and a row header per person, so a cell is announced with the row and column it belongs to; the email and phone are mailto: and tel: links, and removing someone is a submit button in a method="post" form. The Table’s own element is the scroll wrapper and the example’s root, so three cells are shaped from one scope while the Avatars and the Menus inside stay behind the donut; the actions column is sized to its button by an inline size of zero.',
    accessible:
      "Every menu button is named Actions for Imogen Hartley, so a screen reader moving down the column knows whose actions each opens; the Avatar is hidden because the name is printed beside it, and the last column's header is read though not seen.",
  },
  composition:
    "Each row's Menu is the whole component, trigger and all, dropped into a cell: the trigger is Menu's default Button holding an icon and hidden words, and the items are links and a form.",
  tags: ["table", "team", "members", "actions", "menu", "contacts"],
  order: 5,
};
