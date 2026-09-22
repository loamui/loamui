"use client";

import { createContext } from "react";
import type { ReactNode } from "react";

/**
 * Groups related controls under a shared, semantic label.
 *
 * Renders a native `<fieldset>` + `<legend>`, which is the accessible way to
 * label a set of checkboxes or radios (the legend names the group in the
 * accessibility tree). Prefer this over a `<div role="group">` with
 * `aria-labelledby`.
 *
 * ```tsx
 * <Fieldset.Root>
 *   <Fieldset.Legend>Notifications</Fieldset.Legend>
 *   …controls…
 * </Fieldset.Root>
 * ```
 */

/** The words a Fieldset says on its own, each with an English default. */
export interface FieldsetLabels {
  /** The text after an optional Legend's words. @default "(optional)" */
  optional?: ReactNode;
}

export const DEFAULT_LABELS: Required<FieldsetLabels> = {
  optional: "(optional)",
};

// A Legend outside a Root (or under one without labels) reads the defaults.
export const FieldsetContext = createContext<Required<FieldsetLabels>>(DEFAULT_LABELS);
