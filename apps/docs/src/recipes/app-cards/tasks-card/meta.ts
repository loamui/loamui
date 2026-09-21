import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Tasks card",
  description:
    "A milestone in a Card: a due date, a title and description, a Progress with the count of tasks done beneath it, and the team on it as an Avatar.Group.",
  category: "app-cards",
  uses: ["Avatar", "Card", "Progress", "Time"],
  notes: {
    modern:
      "The due date is a time element whose text is written for people and whose dateTime is the date; the bar is the native progress element and the team is a list, one item per person. The Card is a flex column whose foot takes the slack with an auto margin, so a row of milestones lines its teams up, and the count is set in tabular figures at the end, under the end of the fill.",
    accessible:
      "The bar speaks 60% of tasks done through labels.value and the count is written out beside it; the group is named Working on this and each avatar is an image with the person's name as its alt.",
  },
  composition:
    "Avatar.Group wraps each child in a list item; the overflow count is another composed Avatar; the avatar size is its public property, set on the foot rather than passed to each Avatar.",
  tags: ["milestone", "project", "tasks", "team", "deadline"],
  order: 7,
};
