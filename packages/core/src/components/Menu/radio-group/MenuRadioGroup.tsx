"use client";

import { useCallback } from "react";
import { useMemo, useState } from "react";

import type { PartProps } from "../../../utils/props.js";
import {
  MenuGroupContext,
  MenuRadioGroupContext,
  useGroupLabel,
} from "../group/MenuGroupContext.js";

export interface MenuRadioGroupProps extends PartProps<"div"> {
  value?: string;
  defaultValue?: string;
  /** Fires with the value of the item activated. */
  onValueChange?: (value: string) => void;
}

/**
 * One-of-a-set settings inside the menu (`role="group"` of
 * `role="menuitemradio"` items). A `Menu.GroupLabel` inside labels it.
 */
export function MenuRadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...rest
}: MenuRadioGroupProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const controlled = valueProp !== undefined;
  const select = useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );
  const radio = useMemo(() => ({ value, select }), [value, select]);
  const { value: group, labelledBy } = useGroupLabel();
  return (
    <MenuGroupContext value={group}>
      <MenuRadioGroupContext value={radio}>
        <div role="group" aria-labelledby={labelledBy} className={className} {...rest}>
          {children}
        </div>
      </MenuRadioGroupContext>
    </MenuGroupContext>
  );
}
