"use client";

import { useEffect, useMemo, useRef } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs } from "../../../utils/render.js";
import { useTabsContext } from "../root/TabsRootContext.js";

export interface TabsTabProps extends Omit<PartProps<"button">, "value"> {
  /** Unique value linking this tab to its panel. */
  value: string;
}

export function TabsTab({
  value,
  disabled,
  className,
  children,
  onClick,
  ref: refProp,
  ...rest
}: TabsTabProps) {
  const { value: active, setValue, baseId, registerTab } = useTabsContext("Tabs.Tab");
  const selected = active === value;
  const node = useRef<HTMLButtonElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, node), [refProp]);

  // The node goes in with the entry: it is what settles painted order, and
  // what roving focus moves to.
  useEffect(
    () => registerTab({ value, disabled, node: node.current }),
    [registerTab, value, disabled],
  );

  return (
    <button
      {...rest}
      ref={composedRef}
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      // aria-disabled, not native disabled: the tab stays in the a11y tree
      // (announced as disabled) but is skipped by roving focus and can't be
      // activated, the same pattern as Menu items.
      aria-disabled={disabled || undefined}
      data-tab-value={value}
      className={cx("tab", className)}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
        setValue(value);
      }}
    >
      {children}
    </button>
  );
}

/** The panel shown for its matching tab. */
