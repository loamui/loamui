import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Language picker",
  description:
    "A menu of languages as a radio group, each named in itself with a two-letter code beside it, the chosen one shown on the button that opens it.",
  category: "forms",
  uses: ["Menu"],
  notes: {
    modern:
      "Each name carries its language’s lang attribute, so a screen reader switches voice to say Cymraeg as Welsh and Deutsch as German; the codes are ISO 639-1 text, not flags, since a flag names a country and a language crosses several. The code glyph’s scope is rooted at the glyph itself, once for the trigger and every item, cut in currentcolor so it follows the Button’s channel and the item’s highlight, and forced colours give it an edge in place of the tint.",
    accessible:
      "The trigger is named Language: English by hidden words before the visible name, so its purpose is said before its value; the items are menuitemradios with aria-checked, the arrows move between them and a typed letter jumps to a language. A site whose languages live at their own addresses lists them as links with hreflang instead.",
  },
  composition:
    "Menu.Root, Trigger, Popup, RadioGroup, GroupLabel and RadioItem as core ships them: the chosen language is the group's value, and closeOnClick on each item closes the menu on a choice because a language is one setting, not one of several adjusted in a visit.",
  tags: ["language", "locale", "menu", "radio", "i18n", "picker"],
  order: 21,
};
