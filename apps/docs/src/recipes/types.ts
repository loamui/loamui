import type { ComponentType } from "react";

/**
 * The two pillars, keyed the way an example's `meta.notes` names them.
 * Modern gathers the platform, the CSS and contextualism, which is the
 * paradigm running through all three primitives rather than a thing beside
 * them. Accessible gathers the UX and accessibility practice. Composition is
 * not a pillar: it is specific to components, and a recipe explains its own
 * in `meta.composition`.
 */
export const PILLARS = [
  { key: "modern", name: "Modern" },
  { key: "accessible", name: "Accessible" },
] as const;

export type PillarKey = (typeof PILLARS)[number]["key"];

/** A category folder under src/recipes, in display order. */
export interface RecipeCategory {
  /** The folder name and the URL segment: /recipes/<slug>. */
  slug: string;
  title: string;
  /** One line under the title on the category page and the index rail. */
  blurb: string;
}

/** What a recipe says about itself: src/recipes/<category>/<slug>/meta.ts. */
export interface RecipeMeta {
  title: string;
  /** One sentence: what the section is and what it is for. */
  description: string;
  /** The problem this recipe solves and how to choose it over related recipes. */
  whenToUse?: string;
  /** Must equal the folder the example lives in; the gate checks. */
  category: string;
  /**
   * The `@loamui/core` components the example imports, by export name
   * ("Button", "Badge"). Must match the import line exactly; the gate
   * checks. Empty when the example is element styles alone.
   */
  uses: string[];
  /**
   * One paragraph per pillar on the judgment this example encodes. Only the
   * pillars with a specific decision to explain; these are rationale, not certification.
   */
  notes: Partial<Record<PillarKey, string>>;
  /**
   * How this recipe composes the primitives. Not a pillar, and rendered apart
   * from them: composition is the components' own concern, and the Components
   * page carries the general argument.
   */
  composition?: string;
  /** Application data, actions or services needed when using this recipe. */
  integration?: string;
  /** Free-text search terms beyond the title ("landing", "marketing"). */
  tags?: string[];
  /** Position within the category (lower first); ties break by slug. */
  order?: number;
}

/** The raw text of an example's two source files, read from disk at build. */
export interface RecipeSource {
  tsx: string;
  css: string;
}

/** One example's identity and meta, as generated-meta.ts lists it (JSX-free). */
export interface RecipeMetaEntry {
  slug: string;
  category: string;
  meta: RecipeMeta;
}

/** One example with its component, as generated.ts lists it. */
export interface RecipeEntry extends RecipeMetaEntry {
  Recipe: ComponentType;
}
