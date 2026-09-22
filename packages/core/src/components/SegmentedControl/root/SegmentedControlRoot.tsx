"use client";

import { useCallback, useId, useMemo, useRef } from "react";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import {
  SegmentedControlContext,
  SegmentedControlContextValue,
} from "../root/SegmentedControlRootContext.js";

/**
 * A set of mutually exclusive options drawn as one row of segments: a
 * native radio group in a pill, so it works as a form control (the radios
 * submit under `name`) and as a view switcher (`onValueChange`).
 *
 * ```tsx
 * <SegmentedControl.Root name="view" defaultValue="list" onValueChange={setView}>
 *   <SegmentedControl.Legend>View</SegmentedControl.Legend>
 *   <SegmentedControl.Item value="list">List</SegmentedControl.Item>
 *   <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
 * </SegmentedControl.Root>
 * ```
 *
 * The Legend names the group and is painted inside the pill before the
 * segments; render it inside `VisuallyHidden` when the segments
 * say it themselves. The arrow keys move the choice, as on any radio
 * group, and the chosen segment is drawn by the stylesheet from the
 * radio's own `:checked`.
 */
export interface SegmentedControlRootProps extends Omit<
  PartProps<"fieldset">,
  "onChange" | "defaultValue"
> {
  /**
   * Shared `name` for every radio in the group: what the choice submits
   * under. Auto-generated when omitted.
   */
  name?: string;
  value?: string;
  defaultValue?: string;
  /** Fires with the newly chosen value when a segment is picked. */
  onValueChange?: (value: string) => void;
}

export function SegmentedControlRoot({
  name,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ref,
  ...rest
}: SegmentedControlRootProps) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const select = useCallback((next: string) => onValueChangeRef.current?.(next), []);
  const ctx = useMemo<SegmentedControlContextValue>(
    () => ({ name: groupName, value, defaultValue, select }),
    [groupName, value, defaultValue, select],
  );
  return (
    <SegmentedControlContext value={ctx}>
      <fieldset
        ref={ref}
        // radiogroup, not the fieldset's implicit group: the precise role
        // for a set of radios, which is what the segments are.
        role="radiogroup"
        className={cx("loam-SegmentedControl", className)}
        {...rest}
      >
        {children}
      </fieldset>
    </SegmentedControlContext>
  );
}
