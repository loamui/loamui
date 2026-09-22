// The component manifest: each component's identity (name, slug, category,
// description) lives here once, in curated sidebar order. The registry
// joins page content onto these entries by slug. JSX-free, so the sidebar
// and command menu can import it without pulling in demo code.

import type { Category } from "@/renderer/types";
import { recipesByCategory } from "../recipes/catalog";

export interface NavItem {
  name: string;
  slug: string;
  category: Category;
  description: string;
}

export interface GuideLink {
  name: string;
  href: string;
  children?: GuideLink[];
}

export const GETTING_STARTED: GuideLink[] = [
  { name: "Introduction", href: "/docs" },
  {
    name: "Installation",
    href: "/docs/installation",
    children: [
      { name: "Next.js", href: "/docs/installation/nextjs" },
      { name: "TanStack Start", href: "/docs/installation/tanstack-start" },
      { name: "Vite", href: "/docs/installation/vite" },
    ],
  },
  { name: "Build with the skill", href: "/docs/agent-workflow" },
];

export const GUIDES: GuideLink[] = [
  { name: "Contextualism", href: "/docs/contextualism" },
  { name: "Layout", href: "/docs/layout" },
  { name: "Typography", href: "/docs/typography" },
  { name: "Accessibility", href: "/docs/accessibility" },
];

// The sidebar reads tokens → element styles → components, primitive to
// primitive. Components is a peer destination (its own overview page); the
// component categories nest beneath it.
export const PRIMITIVES: { name: string; href: string }[] = [
  { name: "Tokens", href: "/docs/tokens" },
  { name: "Element styles", href: "/docs/element-styles" },
  { name: "Components", href: "/docs/components" },
];

// The recipes, for the command menu: the index, then one entry per
// category. Derived from the recipes' own category list, so search cannot
// offer a category the site does not have. Deliberately absent from the
// docs sidebar, which lists the library, not the gallery built from it.
export const EXAMPLES_NAV: { name: string; href: string }[] = [
  { name: "All recipes", href: "/recipes" },
  { name: "Building your own recipes", href: "/recipes/guide" },
  ...recipesByCategory().map(({ category: c }) => ({ name: c.title, href: `/recipes/${c.slug}` })),
];

export const CATEGORY_ORDER = [
  "Inputs",
  "Data display",
  "Feedback",
  "Disclosures",
  "Navigation",
  "Utilities",
] as const;

export const COMPONENTS: NavItem[] = [
  {
    name: "Field",
    slug: "field",
    category: "Inputs",
    description: "Composable form-field primitive.",
  },
  {
    name: "Fieldset",
    slug: "fieldset",
    category: "Inputs",
    description: "Group controls under a semantic label.",
  },
  {
    name: "ErrorSummary",
    slug: "error-summary",
    category: "Inputs",
    description: "List form errors as links to their fields.",
  },
  {
    name: "Button",
    slug: "button",
    category: "Inputs",
    description: "Trigger an action or event.",
  },
  {
    name: "Input",
    slug: "input",
    category: "Inputs",
    description: "A labelled text field.",
  },
  {
    name: "PasswordInput",
    slug: "password-input",
    category: "Inputs",
    description: "A password box with a show toggle.",
  },
  {
    name: "Textarea",
    slug: "textarea",
    category: "Inputs",
    description: "Multi-line text input.",
  },
  {
    name: "Select",
    slug: "select",
    category: "Inputs",
    description: "Choose one option from a list.",
  },
  {
    name: "Combobox",
    slug: "combobox",
    category: "Inputs",
    description: "A text box with a list of suggestions under it.",
  },
  {
    name: "DateInput",
    slug: "date-input",
    category: "Inputs",
    description: "Labelled fields for a memorable date.",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "Inputs",
    description: "Toggle a single option on or off.",
  },
  {
    name: "Radio",
    slug: "radio",
    category: "Inputs",
    description: "Choose one option from a set.",
  },
  {
    name: "SegmentedControl",
    slug: "segmented-control",
    category: "Inputs",
    description: "Choose one option from a row of segments.",
  },
  {
    name: "Switch",
    slug: "switch",
    category: "Inputs",
    description: "An on/off toggle switch.",
  },
  {
    name: "Range",
    slug: "range",
    category: "Inputs",
    description: "Pick a numeric value from a range.",
  },
  {
    name: "Search",
    slug: "search",
    category: "Inputs",
    description: "The page's search, as a landmark.",
  },
  {
    name: "QuantityInput",
    slug: "quantity-input",
    category: "Inputs",
    description: "A count adjusted one at a time.",
  },
  {
    name: "Rating",
    slug: "rating",
    category: "Inputs",
    description: "Stars as real inputs, or as a picture of a score.",
  },
  {
    name: "FileInput",
    slug: "file-input",
    category: "Inputs",
    description: "Choose a file, or drop it.",
  },
  {
    name: "CopyButton",
    slug: "copy-button",
    category: "Inputs",
    description: "Copy a value and say so.",
  },
  {
    name: "Badge",
    slug: "badge",
    category: "Data display",
    description: "Compact status or label pill.",
  },
  {
    name: "Price",
    slug: "price",
    category: "Data display",
    description: "A monetary amount, written for people.",
  },
  {
    name: "Time",
    slug: "time",
    category: "Data display",
    description: "A date or time, written for people.",
  },
  {
    name: "Card",
    slug: "card",
    category: "Data display",
    description: "A flexible surface container.",
  },
  {
    name: "Avatar",
    slug: "avatar",
    category: "Data display",
    description: "Represent a user with an image or initials.",
  },
  {
    name: "Table",
    slug: "table",
    category: "Data display",
    description: "Display rows and columns of data.",
  },
  {
    name: "Separator",
    slug: "separator",
    category: "Data display",
    description: "A rule between groups of content.",
  },
  {
    name: "Carousel",
    slug: "carousel",
    category: "Data display",
    description: "A scroll-snap track of items, paged and announced.",
  },
  {
    name: "Stepper",
    slug: "stepper",
    category: "Data display",
    description: "Where a sequence has got to, detected from the current step.",
  },
  {
    name: "Alert",
    slug: "alert",
    category: "Feedback",
    description: "Draw attention to an important message.",
  },
  {
    name: "Progress",
    slug: "progress",
    category: "Feedback",
    description: "Show completion of a task.",
  },
  {
    name: "Meter",
    slug: "meter",
    category: "Feedback",
    description: "A measurement within a known range.",
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    category: "Feedback",
    description: "Placeholder while content loads.",
  },
  {
    name: "Loader",
    slug: "loader",
    category: "Feedback",
    description: "Indicate an ongoing process.",
  },
  {
    name: "Toast",
    slug: "toast",
    category: "Feedback",
    description: "Transient notifications.",
  },
  {
    name: "Details",
    slug: "details",
    category: "Disclosures",
    description: "Native disclosure for secondary content.",
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    category: "Disclosures",
    description: "Reveal info on hover or focus.",
  },
  {
    name: "Modal",
    slug: "modal",
    category: "Disclosures",
    description: "A focused dialog over the page.",
  },
  {
    name: "Drawer",
    slug: "drawer",
    category: "Disclosures",
    description: "An edge-anchored panel that slides in.",
  },
  {
    name: "Popover",
    slug: "popover",
    category: "Disclosures",
    description: "Floating content anchored to a trigger.",
  },
  {
    name: "Menu",
    slug: "menu",
    category: "Disclosures",
    description: "A list of actions opened from a trigger.",
  },
  {
    name: "Tabs",
    slug: "tabs",
    category: "Navigation",
    description: "Switch between related views.",
  },
  {
    name: "SignpostLink",
    slug: "signpost-link",
    category: "Navigation",
    description: "Signpost the way into a task.",
  },
  {
    name: "SkipLink",
    slug: "skip-link",
    category: "Navigation",
    description: "Jump straight to the main content.",
  },
  {
    name: "Breadcrumbs",
    slug: "breadcrumbs",
    category: "Navigation",
    description: "Show the current page's location.",
  },
  {
    name: "Pagination",
    slug: "pagination",
    category: "Navigation",
    description: "Navigate between pages of content.",
  },
  {
    name: "Nav",
    slug: "nav",
    category: "Navigation",
    description: "Lists of links with the current one marked.",
  },
  {
    name: "VisuallyHidden",
    slug: "visually-hidden",
    category: "Utilities",
    description: "Name a control for assistive technology alone.",
  },
];

export function componentsByCategory() {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: COMPONENTS.filter((c) => c.category === category),
  })).filter((g) => g.items.length > 0);
}

export function componentForExport(name: string): NavItem | undefined {
  return (
    COMPONENTS.find((component) => component.name === name) ??
    COMPONENTS.filter(
      (component) =>
        name.startsWith(component.name) && /^[A-Z]/.test(name.slice(component.name.length)),
    ).sort((a, b) => b.name.length - a.name.length)[0]
  );
}
