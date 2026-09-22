"use client";

import { useCallback, useMemo, useRef } from "react";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { usePopupRoot } from "../../../hooks/use-popup.js";

import { MenuContext, inPaintedOrder } from "./MenuRootContext.js";
import type { MenuContextValue, MenuItemEntry } from "./MenuRootContext.js";

/**
 * A list of actions opened from a trigger, composed from parts.
 *
 * The Popup renders with the native `popover` attribute (top layer, light
 * dismiss, Escape) and CSS anchor positioning where supported, falling back
 * to a wrapper-anchored panel elsewhere: the same engine as Popover. On top
 * of it sits the APG menu-button pattern: ArrowDown/ArrowUp from the trigger
 * open and focus the first/last item, arrow keys rove focus through the
 * items (looping), Home/End jump, typing jumps to the next matching item,
 * and activating an item closes the menu and returns focus to the trigger.
 *
 * Menus are for *actions* (rename, duplicate, delete…). For choosing a value
 * that persists, use Select; for navigation, prefer visible links. A setting
 * that lives in the menu is a `CheckboxItem` (on/off) or a `RadioGroup` of
 * `RadioItem`s (one of a set).
 *
 * ```tsx
 * <Menu.Root>
 *   <Menu.Trigger>Options</Menu.Trigger>
 *   <Menu.Popup>
 *     <Menu.Item onClick={rename}>Rename</Menu.Item>
 *     <Menu.Item href="/export">Export…</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Group>
 *       <Menu.GroupLabel>Danger zone</Menu.GroupLabel>
 *       <Menu.Item onClick={remove}>Delete</Menu.Item>
 *     </Menu.Group>
 *   </Menu.Popup>
 * </Menu.Root>
 * ```
 */
export interface MenuRootProps extends PartProps<"span"> {
  open?: boolean;
  defaultOpen?: boolean;
  /** Called whenever the open state should change. */
  onOpenChange?: (open: boolean) => void;
}

export function MenuRoot({
  open,
  defaultOpen,
  onOpenChange,
  className,
  children,
  ...rest
}: MenuRootProps) {
  const popup = usePopupRoot("menu", { open, defaultOpen, onOpenChange });
  const focusOnOpen = useRef<"first" | "last">("first");
  const { setOpen, triggerRef } = popup;

  const closeAndRefocus = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, [setOpen, triggerRef]);

  const itemsRef = useRef(new Map<MenuItemEntry, MenuItemEntry>());

  const registerItem = useCallback((item: MenuItemEntry) => {
    itemsRef.current.set(item, item);
    return () => {
      itemsRef.current.delete(item);
    };
  }, []);

  const items = useCallback(() => inPaintedOrder(itemsRef.current.values()), []);

  const value = useMemo<MenuContextValue>(
    () => ({ ...popup, focusOnOpen, closeAndRefocus, registerItem, items }),
    [popup, closeAndRefocus, registerItem, items],
  );

  return (
    <MenuContext value={value}>
      <span className={cx("loam-Menu", className)} {...rest}>
        {children}
      </span>
    </MenuContext>
  );
}

/** Wiring the Trigger attaches to whatever it renders. */
