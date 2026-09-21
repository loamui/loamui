import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Task list",
  description:
    "The sections of a multi-step application, each a linked title with what it needs and where it stands.",
  category: "data-display",
  uses: ["Badge"],
  notes: {
    modern:
      "A list under a heading that names it: each task is a list item holding a link, a paragraph and a status, and a task that cannot be started yet is plain text rather than a dead link. Each row is a two-column grid with the status spanning both rows, so it sits level with the title whether or not a description follows, and below a narrow width the rows restack. A completed task’s status is a success region and one under way an info region, so each Badge takes its colour from what the task means; a task not yet started declares nothing and its Badge stays neutral.",
    accessible:
      "Each title is described by its description and its status, so a screen reader hears Choose a plot, link, then what it needs and In progress, without a journey across the row; the list role is restored where the markers are stripped.",
  },
  composition:
    "The only component is the Badge; the row, the title and the description are the page's own elements, arranged in the markup where a reader can see and reorder them.",
  tags: ["application", "steps", "checklist", "onboarding", "progress"],
  order: 5,
};
