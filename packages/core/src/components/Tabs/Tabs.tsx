"use client";

import { createContext, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cx } from "../../utils.js";
import type { PartProps } from "../../utils.js";
import { useRequiredContext } from "../../context.js";
import { composeRefs } from "../../render.js";

/**
 * What a Tab tells the Root about itself. The tabs are the Root's own
 * collection rather than something re-read from the DOM: roving focus and the
 * fallback selection both need to know which tabs exist and which are
 * disabled, and that is the Tab's own knowledge, not the markup's.
 */
export interface TabsTabEntry {
  value: string;
  disabled?: boolean;
  node: HTMLButtonElement | null;
}

interface TabsContextValue {
  value: string | null;
  setValue: (value: string) => void;
  isControlled: boolean;
  /** Stable id prefix so tab/panel aria wiring links up. */
  baseId: string;
  registerTab: (tab: TabsTabEntry) => () => void;
  /** The selectable tabs in the order they are painted. */
  enabledTabs: () => TabsTabEntry[];
  /** Changes whenever the collection does, so effects can depend on it. */
  tabCount: number;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(part: string): TabsContextValue {
  return useRequiredContext(TabsContext, part, "Tabs.Root");
}

export interface TabsRootProps extends Omit<PartProps<"div">, "onChange" | "defaultValue"> {
  /** The active tab's value. Use when the component is controlled. */
  value?: string;
  /** The tab active by default. Use when the component is not controlled. */
  defaultValue?: string;
  /** Called with the new value when the active tab changes. */
  onValueChange?: (value: string) => void;
  children?: ReactNode;
}

export interface TabsListProps extends PartProps<"div"> {}

export interface TabsTabProps extends Omit<PartProps<"button">, "value"> {
  /** Unique value linking this tab to its panel. */
  value: string;
}

export interface TabsPanelProps extends PartProps<"div"> {
  /** Value of the tab this panel belongs to. */
  value: string;
}

/**
 * Switch between related panels of content, composed from parts.
 *
 * Supports uncontrolled (`defaultValue`) and controlled (`value`/`onValueChange`)
 * usage.
 *
 * ```tsx
 * <Tabs.Root defaultValue="account">
 *   <Tabs.List>
 *     <Tabs.Tab value="account">Account</Tabs.Tab>
 *     <Tabs.Tab value="security">Security</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="account">…</Tabs.Panel>
 *   <Tabs.Panel value="security">…</Tabs.Panel>
 * </Tabs.Root>
 * ```
 */
function TabsRoot({
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
function TabsList({
  className,
  children,
  onKeyDown: onKeyDownProp,
  ref: refProp,
  ...rest
}: TabsListProps) {
  const { value, setValue, isControlled, enabledTabs, tabCount } = useTabsContext("Tabs.List");
  const listRef = useRef<HTMLDivElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, listRef), [refProp]);

  // The type requires an initial selection. This runtime fallback also keeps
  // plain JavaScript and stale values accessible by selecting the first
  // enabled tab instead of leaving every panel hidden. It waits on tabCount
  // because the tabs register in their own effects, after this one first runs.
  useEffect(() => {
    if (isControlled) return;
    const tabs = enabledTabs();
    if (tabs.length === 0 || tabs.some((tab) => tab.value === value)) return;
    setValue(tabs[0]!.value);
  }, [isControlled, setValue, value, enabledTabs, tabCount]);

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
function TabsTab({
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
function TabsPanel({ value, className, children, ref: refProp, ...rest }: TabsPanelProps) {
  const { value: active, setValue, baseId } = useTabsContext("Tabs.Panel");
  const selected = active === value;
  const ref = useRef<HTMLDivElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, ref), [refProp]);

  // hidden="until-found" lets find-in-page reach inactive panels;
  // `beforematch` activates the matched tab. React normalises `hidden` to a
  // boolean, so the attribute value must be set imperatively. The boolean
  // form renders on server and client alike (a hydration-safe baseline); the
  // effect upgrades it where the browser supports until-found.
  useEffect(() => {
    const el = ref.current;
    if (!el || !("onbeforematch" in HTMLElement.prototype)) return;
    if (selected) el.removeAttribute("hidden");
    else el.setAttribute("hidden", "until-found");
  }, [selected]);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("onbeforematch" in HTMLElement.prototype)) return;
    const onBeforeMatch = () => setValue(value);
    el.addEventListener("beforematch", onBeforeMatch);
    return () => el.removeEventListener("beforematch", onBeforeMatch);
  }, [setValue, value]);

  return (
    <div
      {...rest}
      ref={composedRef}
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!selected}
      tabIndex={0}
      className={cx("panel", className)}
    >
      {children}
    </div>
  );
}

export { TabsRoot, TabsList, TabsTab, TabsPanel };
