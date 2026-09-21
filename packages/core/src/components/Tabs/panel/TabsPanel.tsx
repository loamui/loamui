"use client";

import { useEffect, useMemo, useRef } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs } from "../../../utils/render.js";
import { useTabsContext } from "../root/TabsRootContext.js";

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

export function TabsPanel({ value, className, children, ref: refProp, ...rest }: TabsPanelProps) {
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
