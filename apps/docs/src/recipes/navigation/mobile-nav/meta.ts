import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Mobile nav",
  description:
    "Navigation for a narrow screen: a Menu button in the header opens a panel from the start edge holding the site's links, with the current page marked and a button to close it.",
  category: "navigation",
  uses: ["Drawer", "Nav"],
  notes: {
    modern:
      "The panel is a native dialog opened with showModal(), so the top layer, focus containment, Escape and focus returning to the Menu button on close are the browser’s, not a script’s. The links take a 2.75rem line through Nav’s public --loam-nav-link-size, set on the panel and inherited: the smallest target a thumb hits reliably, without touching Nav’s own rules.",
    accessible:
      "The button says Menu in words and reports the panel with aria-expanded; the panel is named by its title, the nav inside by Primary, the close button by hidden text beside its icon, and the current page by aria-current.",
  },
  composition:
    "Drawer and Nav are assembled in the markup, title and close button in the panel's first row; the Drawer holds its own open state and its trigger reports it, so the example keeps none.",
  tags: ["hamburger", "drawer", "off-canvas", "mobile menu"],
  order: 4,
};
