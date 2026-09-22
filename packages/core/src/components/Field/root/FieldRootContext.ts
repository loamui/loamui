"use client";

import { createContext, use } from "react";
import type { ReactNode } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";
import { useIsoLayoutEffect } from "../../../hooks/use-id-registry.js";
import { idList } from "../../../utils/render.js";
import type { FieldControlRenderProps } from "../control/FieldControl.js";

export interface FieldLabels {
  /** The text after an optional Label's words. @default "(optional)" */
  optional?: ReactNode;
  /**
   * The hidden words before an Error's message, so the announcement is
   * unmistakable out of context. @default "Error: "
   */
  errorPrefix?: ReactNode;
}

export const DEFAULT_LABELS: Required<FieldLabels> = {
  optional: "(optional)",
  errorPrefix: "Error: ",
};

export interface FieldContextValue {
  fieldId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  /** Composed aria-describedby (description + error ids that are present). */
  describedBy: string | undefined;
  labels: Required<FieldLabels>;
  registerControl: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
  registerError: (id: string) => () => void;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(part: string): FieldContextValue {
  return useRequiredContext(FieldContext, part, "Field.Root");
}

/**
 * Read the accessibility props for a control from its surrounding Field.
 *
 * Pass the control's own `aria-describedby` and the returned one is the
 * Field's ids (description, then error) followed by the control's own, each
 * id once, so a control inside a Field keeps any description it brings.
 * Outside a `Field.Root` only that own value comes back, so a control can
 * wire itself to the Field when composed inside one
 * (`<Field.Label><Checkbox /> …</Field.Label>`) and fall back to its
 * own props when used standalone. The shape matches
 * {@link FieldControlRenderProps}.
 */
export function useFieldControlProps(
  ariaDescribedby?: string,
  id?: string,
): Partial<FieldControlRenderProps> {
  const ctx = use(FieldContext);
  const registerControl = ctx?.registerControl;
  useIsoLayoutEffect(() => {
    if (id !== undefined && registerControl) return registerControl(id);
  }, [id, registerControl]);
  if (!ctx) return { "aria-describedby": idList(ariaDescribedby) };
  return {
    id: ctx.fieldId,
    "aria-describedby": idList(ctx.describedBy, ariaDescribedby),
    "aria-invalid": ctx.invalid || undefined,
  };
}
