"use client";

import { ItemBase } from "../utils/MenuItemBase.js";
import type { MenuItemProps } from "../utils/MenuItemBase.js";

/** A command. Closes the menu on activation unless `closeOnClick` says not to. */
export function MenuItem({ closeOnClick = true, ...props }: MenuItemProps) {
  return <ItemBase kind="menuitem" closeOnClick={closeOnClick} {...props} />;
}
