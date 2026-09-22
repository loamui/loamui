"use client";

import { useMemo } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { usePresence } from "../../../hooks/use-presence.js";
import { usePopupRoot } from "../../../hooks/use-popup.js";
import { PopoverContext } from "./PopoverRootContext.js";
import type { PopoverContextValue } from "./PopoverRootContext.js";

/**
 * A click-triggered floating panel, composed from parts.
 *
 * The Popup renders with the native `popover` attribute, so the browser
 * provides the top layer (no z-index, no clipping by ancestor overflow),
 * light dismiss and Escape. Positioning uses CSS anchor positioning where
 * supported. In browsers without both features the same parts fall back to
 * a wrapper-anchored panel with JS dismiss handling; the enhanced and
 * fallback paths share one React state.
 *
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>Open settings</Popover.Trigger>
 *   <Popover.Popup>
 *     <Popover.Title>Settings</Popover.Title>
 *     <Popover.Description>Quick preferences.</Popover.Description>
 *     <Popover.Close>Done</Popover.Close>
 *   </Popover.Popup>
 * </Popover.Root>
 * ```
 */
export interface PopoverRootProps extends PartProps<"span"> {
  open?: boolean;
  defaultOpen?: boolean;
  /** Called whenever the open state should change (either path). */
  onOpenChange?: (open: boolean) => void;
}

export function PopoverRoot({
  open,
  defaultOpen,
  onOpenChange,
  className,
  children,
  ...rest
}: PopoverRootProps) {
  const popup = usePopupRoot("popup", { open, defaultOpen, onOpenChange });
  const [hasTitle, registerTitle] = usePresence();
  const [hasDescription, registerDescription] = usePresence();

  const value = useMemo<PopoverContextValue>(
    () => ({
      ...popup,
      titleId: `${popup.popupId}-title`,
      descriptionId: `${popup.popupId}-description`,
      hasTitle,
      hasDescription,
      registerTitle,
      registerDescription,
    }),
    [popup, hasTitle, hasDescription, registerTitle, registerDescription],
  );

  return (
    <PopoverContext value={value}>
      <span className={cx("loam-Popover", className)} {...rest}>
        {children}
      </span>
    </PopoverContext>
  );
}

/** Wiring the Trigger attaches to whatever it renders. */
