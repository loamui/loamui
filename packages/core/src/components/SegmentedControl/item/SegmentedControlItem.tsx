"use client";

import type { ChangeEvent, ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

import { useSegmentedControl } from "../root/SegmentedControlRootContext.js";

export interface SegmentedControlItemProps extends PartProps<"label"> {
  /** The value this segment submits and reports. */
  value: string;
  /** Takes the segment out of the choice. */
  disabled?: boolean;
  /**
   * Props for the radio inside (`aria-describedby`, `data-*`); `className`,
   * `ref` and the rest land on the `<label>`, which is the segment.
   */
  inputProps?: Omit<
    PartProps<"input">,
    "checked" | "defaultChecked" | "disabled" | "name" | "onChange" | "type" | "value"
  >;
  /** The segment's visible label: text, an `svg` icon, or an icon beside hidden text. */
  children?: ReactNode;
}

/**
 * One segment: a `label` around a native radio, so the whole segment is
 * the target and the radio keeps focus and the arrow keys. The stylesheet
 * draws the chosen state from the radio's `:checked`.
 */
export function SegmentedControlItem({
  value,
  disabled,
  inputProps,
  className,
  children,
  ref,
  ...rest
}: SegmentedControlItemProps) {
  const group = useSegmentedControl("SegmentedControl.Item");
  const { className: inputClassName, ...input } = inputProps ?? {};
  const selection =
    group.value !== undefined
      ? { checked: group.value === value }
      : { defaultChecked: group.defaultValue === value };
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) group.select(value);
  };
  return (
    <label ref={ref} className={cx("segment", className)} {...rest}>
      <input
        {...input}
        className={cx("loam-VisuallyHidden", inputClassName)}
        type="radio"
        name={group.name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        {...selection}
      />
      {children}
    </label>
  );
}
