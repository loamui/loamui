import type { ReactNode } from "react";

export interface Demo {
  title: string;
  description?: string;
  /** Source shown in the Code tab (exact string, already formatted). */
  code: string;
  render: () => ReactNode;
}

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/**
 * A composable part or companion component, documented with its own
 * props table so the reference mirrors the anatomy.
 */
export interface PartDoc {
  /** As written in code: "Modal.Trigger", "RadioGroup", "Field.Item". */
  name: string;
  description: string;
  props?: PropRow[];
}

/** A public CSS custom property — the styling channel, not a prop. */
export interface CssPropRow {
  name: string;
  /** Accepted value space, e.g. "CSS length" or "CSS color". */
  syntax: string;
  default?: string;
  description: string;
}

export interface HookDoc {
  name: string;
  signature: string;
  description: string;
  /** A table of options for the hook's main call, when it takes any. */
  options?: { title: string; rows: PropRow[] };
}

/** A titled passage of usage judgment, optionally with its own example. */
export interface HowItWorksEntry {
  title: string;
  body: string;
  code?: string;
  render?: () => ReactNode;
}

export interface ErrorTemplate {
  situation: string;
  message: string;
}

/**
 * A component's page content, as authored in src/content/components/.
 * Identity (name, category, description) lives once in site/nav.ts — the
 * component manifest — and the registry joins the two by slug.
 */
export interface ComponentContent {
  slug: string;
  /**
   * Page lead rendered under the title. Falls back to the manifest's
   * one-line description, which stays short for the sidebar and search.
   */
  lead?: string;
  importLine: string;
  demos: Demo[];
  /** The component's own props (plus the forwarded-natives row). */
  props?: PropRow[];
  parts?: PartDoc[];
  cssProps?: CssPropRow[];
  hooks?: HookDoc[];
  /**
   * The component answers the surrounding `--loam-context` region. Renders
   * the standard status note once, instead of a per-page pseudo-prop row.
   */
  contextual?: boolean;
  whenToUse?: string[];
  whenNotToUse?: string[];
  accessibility?: string[];
  howItWorks?: HowItWorksEntry[];
  errors?: ErrorTemplate[];
  /** Which package the component ships in (used by the CSS tab). @default "core" */
  pkg?: "core";
}

/** Content joined with its manifest identity — what the page renders. */
export interface ComponentDoc extends ComponentContent {
  name: string;
  category: Category;
  /** One-line summary shown under the title and in search. */
  description: string;
}

export type Category =
  | "Inputs"
  | "Data display"
  | "Feedback"
  | "Disclosures"
  | "Navigation"
  | "Utilities";
