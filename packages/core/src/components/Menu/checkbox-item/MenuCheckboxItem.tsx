"use client";

import { useState } from "react";
import { ItemBase } from "../utils/MenuItemBase.js";
import type { ItemBaseProps } from "../utils/MenuItemBase.js";

export interface MenuCheckboxItemProps extends ItemBaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Fires with the next checked state on activation. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Close the menu when the item is activated. Off by default: a setting is
   * usually one of several the user adjusts in one visit. @default false
   */
  closeOnClick?: boolean;
}

/**
 * An on/off setting inside the menu (`role="menuitemcheckbox"`). The check
 * glyph is drawn by the stylesheet from `aria-checked`.
 */
export function MenuCheckboxItem({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onClick,
  closeOnClick = false,
  ...props
}: MenuCheckboxItemProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const checked = checkedProp ?? uncontrolled;
  return (
    <ItemBase
      kind="menuitemcheckbox"
      checked={checked}
      closeOnClick={closeOnClick}
      onClick={(e) => {
        onClick?.(e);
        if (checkedProp === undefined) setUncontrolled(!checked);
        onCheckedChange?.(!checked);
      }}
      {...props}
    />
  );
}
