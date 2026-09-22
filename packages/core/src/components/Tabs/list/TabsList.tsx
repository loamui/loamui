"use client";

import { useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import { composeRefs } from "../../../utils/render.js";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useTabsContext } from "../root/TabsRootContext.js";

export interface TabsListProps extends PartProps<"div"> {}

export function TabsList({
  className,
  children,
  onKeyDown: onKeyDownProp,
  ref: refProp,
  ...rest
}: TabsListProps) {
  const { value, setValue, isControlled, enabledTabs } = useTabsContext("Tabs.List");
  const listRef = useRef<HTMLDivElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, listRef), [refProp]);

  useEffect(() => {
    if (isControlled) return;
    const tabs = enabledTabs();
    if (tabs.length === 0 || tabs.some((tab) => tab.value === value)) return;
    setValue(tabs[0]!.value);
  }, [isControlled, setValue, value, enabledTabs]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDownProp?.(event);
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;

    const tabs = enabledTabs();
    if (tabs.length === 0) return;

    const list = listRef.current!;
    // Which tab has focus is the document's own answer, so it is asked here
    // and matched against the collection rather than re-querying the markup.
    const current = tabs.findIndex((tab) => tab.node === document.activeElement);
    let nextIndex = current;
    const direction = getComputedStyle(list).direction || list.closest<HTMLElement>("[dir]")?.dir;
    const rtl = direction === "rtl";

    switch (event.key) {
      case "ArrowRight":
        nextIndex =
          current < 0
            ? 0
            : rtl
              ? (current - 1 + tabs.length) % tabs.length
              : (current + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex =
          current < 0
            ? tabs.length - 1
            : rtl
              ? (current + 1) % tabs.length
              : (current - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
    }

    event.preventDefault();
    tabs[nextIndex]?.node?.focus();
    tabs[nextIndex]?.node?.click();
  };

  return (
    // interactive-supports-focus is off for this file (.oxlintrc):
    // focus roves between the tabs; the list itself is never a stop
    <div
      {...rest}
      ref={composedRef}
      role="tablist"
      className={cx("loam-Tabs-list", className)}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

/** A single tab control. */
