"use client";

import { createContext } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";
import type { PopupState } from "../../../hooks/use-popup.js";

export interface MenuContextValue extends PopupState {
  /** Where focus should land when the menu opens. */
  focusOnOpen: { current: "first" | "last" };
  /** Close and return focus to the trigger (item activation, Escape). */
  closeAndRefocus: () => void;
  registerItem: (item: MenuItemEntry) => () => void;
  /** The focusable items in the order they are painted. */
  items: () => HTMLElement[];
}

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext(part: string): MenuContextValue {
  return useRequiredContext(MenuContext, part, "Menu.Root");
}

/**
 * What an item tells the Root about itself. The items are the Root's own
 * collection rather than something re-read from the popup: an item may be a
 * button, a link or a consumer's own element through `render`, so a query
 * would couple roving focus to markup the consumer controls.
 */
export interface MenuItemEntry {
  node: HTMLElement | null;
  disabled?: boolean;
}

/**
 * The focusable items of every kind, in the order they are painted; disabled
 * items are skipped. Registration order is mount order, which groups and
 * conditional items do not preserve, so the nodes settle the order.
 */
export function inPaintedOrder(items: Iterable<MenuItemEntry>): HTMLElement[] {
  return [...items]
    .filter((item) => !item.disabled && item.node)
    .sort((a, b) =>
      a.node!.compareDocumentPosition(b.node!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    )
    .map((item) => item.node!);
}
