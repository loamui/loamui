"use client";

import type { ReactNode } from "react";
import { DialogContext, useDialogRoot } from "../../../hooks/use-dialog.js";
import { COMPONENT } from "./DrawerRootContext.js";

/**
 * An edge-anchored panel that slides in over the page, composed from parts.
 *
 * The Popup renders a native `<dialog>` opened with `showModal()`, so the top
 * layer, `::backdrop`, focus containment, Escape handling and
 * focus-restore-to-opener all come from the browser: a Drawer is a Modal
 * pinned to an edge with a slide transition. Light dismiss uses the `closedby`
 * attribute where supported, with a coordinate-check fallback elsewhere.
 *
 * Reach for a Drawer for navigation and secondary content that shouldn't take
 * over the whole screen (a mobile menu, filters, a details side-sheet). For a
 * focused, must-answer task, use Modal instead.
 *
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Trigger>Menu</Drawer.Trigger>
 *   <Drawer.Popup side="start">
 *     <Drawer.Title>Navigation</Drawer.Title>
 *     <nav>…</nav>
 *     <Drawer.Close aria-label="Close" />
 *   </Drawer.Popup>
 * </Drawer.Root>
 * ```
 */
export interface DrawerRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  /** Called whenever the open state should change (either path). */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function DrawerRoot({ open, defaultOpen, onOpenChange, children }: DrawerRootProps) {
  const value = useDialogRoot(COMPONENT, { open, defaultOpen, onOpenChange });
  return <DialogContext value={value}>{children}</DialogContext>;
}
