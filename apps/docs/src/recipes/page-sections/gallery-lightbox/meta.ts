import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Gallery with lightbox",
  description:
    "Six photographs in a grid of figures, each a link to the full-size file that opens it in a Modal once JavaScript arrives.",
  category: "page-sections",
  uses: ["Modal"],
  notes: {
    modern:
      "Every thumbnail is an a whose href is the full-size file, so the gallery works before hydration and a modified click still opens a new tab; the lightbox is a native dialog with its backdrop, Escape and focus restore. An auto-fill grid of square, object-fit thumbnails answers its own width, and the Modal’s width is set through its public --loam-modal-size rather than a rule inside it.",
    accessible:
      "The dialog is named by the figure's caption, or the alt when there is none, so it is never an unnamed dialog; the list keeps role=list so the count survives list-style: none.",
  },
  composition:
    "Modal.Root, Popup and Close are arranged in the markup; the example holds the open state and which photo, and reaches the dialog's insides from a second scope rooted at its own element.",
  tags: ["photos", "images", "grid", "modal", "lightbox"],
  order: 12,
};
