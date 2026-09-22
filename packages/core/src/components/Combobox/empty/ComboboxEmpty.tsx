"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useComboboxContext } from "../root/ComboboxRootContext.js";

export interface ComboboxEmptyProps extends PartProps<"li"> {}

/**
 * Shown in the list when it has no Options. Children default to
 * `labels.empty`. It is a sighted-user message: a listbox may hold only
 * options, so it is hidden from assistive technology, which hears the
 * count from the status region instead.
 */
export function ComboboxEmpty({ className, children, ...rest }: ComboboxEmptyProps) {
  const ctx = useComboboxContext("Combobox.Empty");
  if (ctx.count > 0) return null;
  return (
    <li role="presentation" aria-hidden className={cx("empty", className)} {...rest}>
      {children ?? ctx.labels.empty}
    </li>
  );
}
