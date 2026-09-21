"use client";

import type { ReactNode } from "react";
import { DialogContext, useDialogRoot } from "../../../hooks/use-dialog.js";
import { COMPONENT } from "./ModalRootContext.js";

/**
 * A blocking dialog for must-complete tasks, composed from parts.
 *
 * The Popup renders a native `<dialog>` opened with `showModal()`, so the
 * top layer, `::backdrop`, focus containment, Escape handling and
 * focus-restore-to-opener all come from the browser. Light dismiss uses the
 * `closedby` attribute where supported, with a small coordinate-check
 * fallback elsewhere.
 *
 * ```tsx
 * <Modal.Root>
 *   <Modal.Trigger>Invite teammate</Modal.Trigger>
 *   <Modal.Popup>
 *     <Modal.Title>Invite a teammate</Modal.Title>
 *     <Modal.Description>They'll get an email invitation.</Modal.Description>
 *     <Modal.Close>Cancel</Modal.Close>
 *   </Modal.Popup>
 * </Modal.Root>
 * ```
 */
export interface ModalRootProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called whenever the open state should change (either path). */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function ModalRoot({ open, defaultOpen, onOpenChange, children }: ModalRootProps) {
  const value = useDialogRoot(COMPONENT, { open, defaultOpen, onOpenChange });
  return <DialogContext value={value}>{children}</DialogContext>;
}
