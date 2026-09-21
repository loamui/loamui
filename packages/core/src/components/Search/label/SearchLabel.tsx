"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import { useSearchContext } from "../root/SearchRootContext.js";

export interface SearchLabelProps extends PartProps<"label"> {}

/**
 * The box's name, read but not seen. Not needed when a Field around the
 * Input names it visibly.
 */
export function SearchLabel({ className, children, ref, ...rest }: SearchLabelProps) {
  const ctx = useSearchContext("Search.Label");
  return (
    <label
      ref={ref}
      className={cx("loam-VisuallyHidden", className)}
      htmlFor={ctx.inputId}
      {...rest}
    >
      {children}
    </label>
  );
}
