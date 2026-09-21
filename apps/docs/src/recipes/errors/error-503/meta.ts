import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Service unavailable",
  description:
    "A 503 page: the code, All our servers are busy, one line on what is happening and what to do, and a Button that refreshes the page.",
  category: "errors",
  uses: ["Button"],
  notes: {
    modern:
      "A section named by its own h1; the way out is a button rather than a link, because refreshing is an action on this page and goes nowhere new. The page is a container so its type answers its own width, the title balances its lines and the description wraps prettily, with nothing sized to a viewport. The actions row is a primary region, so the Button takes the primary colour from where it sits rather than from a prop; primary is the brand slot, neutral until a theme fills it, and the row declares where the one action belongs.",
    accessible:
      "The copy says what is happening and that the basket is safe before it says what to do, and the button says what it does in full: Refresh the page, not Retry.",
  },
  composition:
    "Button is dropped in as it comes; the reload is the page's one line of behaviour, on the Button's own onClick.",
  tags: ["503", "busy", "unavailable", "maintenance", "error page", "refresh"],
  order: 4,
};
