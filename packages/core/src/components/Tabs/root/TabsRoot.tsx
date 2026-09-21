"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { TabsContext } from "./TabsRootContext.js";
import type { TabsContextValue, TabsTabEntry } from "./TabsRootContext.js";

export interface TabsRootProps extends Omit<PartProps<"div">, "onChange" | "defaultValue"> {
  /** The active tab's value. Use when the component is controlled. */
  value?: string;
  /** The tab active by default. Use when the component is not controlled. */
  defaultValue?: string;
  /** Called with the new value when the active tab changes. */
  onValueChange?: (value: string) => void;
  children?: ReactNode;
}

export function TabsRoot({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  children,
  ...rest
}: TabsRootProps) {
  const baseId = useId();
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue ?? null);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : uncontrolled;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  // The tabs, keyed by value. `tabCount` mirrors the map's size so an effect
  // can wait for the collection to settle; the map is the source.
  const tabsRef = useRef(new Map<string, TabsTabEntry>());
  const [tabCount, setTabCount] = useState(0);

  const registerTab = useCallback((tab: TabsTabEntry) => {
    tabsRef.current.set(tab.value, tab);
    setTabCount(tabsRef.current.size);
    return () => {
      tabsRef.current.delete(tab.value);
      setTabCount(tabsRef.current.size);
    };
  }, []);

  // Registration order is mount order, which a reordered list does not
  // preserve, so the nodes settle the order — the one question only the
  // document can answer.
  const enabledTabs = useCallback(
    () =>
      [...tabsRef.current.values()]
        .filter((tab) => !tab.disabled && tab.node)
        .sort((a, b) =>
          a.node!.compareDocumentPosition(b.node!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        ),
    [],
  );

  const ctx = useMemo<TabsContextValue>(
    () => ({ value, setValue, isControlled, baseId, registerTab, enabledTabs, tabCount }),
    [value, setValue, isControlled, baseId, registerTab, enabledTabs, tabCount],
  );

  return (
    <TabsContext value={ctx}>
      <div className={cx("loam-Tabs", className)} {...rest}>
        {children}
      </div>
    </TabsContext>
  );
}

/** The row of tab controls. */
