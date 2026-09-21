"use client";

import { useRequiredContext } from "../../../hooks/use-required-context.js";
import { ItemBase } from "../utils/MenuItemBase.js";
import type { ItemBaseProps } from "../utils/MenuItemBase.js";
import { MenuRadioGroupContext } from "../group/MenuGroupContext.js";

export interface MenuRadioItemProps extends ItemBaseProps {
  /** The value this item selects. */
  value: string;
  /**
   * Close the menu when the item is activated. Off by default, as for
   * CheckboxItem. @default false
   */
  closeOnClick?: boolean;
}

/** One choice of a `Menu.RadioGroup` (`role="menuitemradio"`). */
export function MenuRadioItem({
  value,
  onClick,
  closeOnClick = false,
  ...props
}: MenuRadioItemProps) {
  const group = useRequiredContext(MenuRadioGroupContext, "Menu.RadioItem", "Menu.RadioGroup");
  return (
    <ItemBase
      kind="menuitemradio"
      checked={group.value === value}
      closeOnClick={closeOnClick}
      onClick={(e) => {
        onClick?.(e);
        group.select(value);
      }}
      {...props}
    />
  );
}
