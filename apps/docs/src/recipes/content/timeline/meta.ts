import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Timeline",
  description:
    "Five dated events in order, each with a marker, a date, a title and a line, joined by a hairline.",
  whenToUse:
    "Use for dated events in chronological order. Choose the Stepper component for progress through a task rather than adapting this history layout.",
  category: "content",
  uses: [],
  integration:
    "Replace the fictional history with chronological events and valid machine-readable dates. Select heading levels to fit the surrounding section. This presents a static history; use Stepper for progress through an interactive task.",
  notes: {
    modern:
      "An ol carries the order and a time element carries each date with its machine-readable value, while the dots and the connecting line are pseudo-elements, so nothing decorative reaches the accessibility tree. Layered scoped CSS measures the list through its outer wrapper, so each event and its connector resolve the same spacing tokens; named grid areas position the content, lh centres the decorative dot on the date line, and a negative margin joins the gaps.",
    accessible:
      "The list keeps role=list so its count survives list-style: none, and in forced colours the dot keeps an outline and the connector its ink where the fills would vanish.",
  },
  composition:
    "Element styles alone: an ordered list, headings, paragraphs and time, so no component is imported and no Stepper is bent into a history.",
  tags: ["history", "events", "dates", "changelog", "milestones"],
  order: 19,
};
