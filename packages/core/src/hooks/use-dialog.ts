"use client";

import { createContext, useEffect, useId, useMemo, useRef } from "react";
import type { MouseEvent as ReactMouseEvent, Ref, RefObject } from "react";
import { useRequiredContext } from "./use-required-context.js";
import { composeRefs, idList } from "../utils/render.js";
import { usePresence } from "./use-presence.js";
import { useOpenState } from "./use-popup.js";
import type { OpenStateOptions } from "./use-popup.js";
import { useSupports } from "./use-support.js";

/**
 * The dialog engine behind Modal and Drawer. The Popup is a native
 * `<dialog>` opened with `showModal()`, so the top layer, `::backdrop`,
 * focus containment, Escape handling and focus-restore-to-opener all come
 * from the browser. Light dismiss uses the `closedby` attribute where
 * supported, with a small coordinate-check fallback elsewhere. Trigger and
 * Close use the Invoker Commands API (`commandfor` / `command`) once its
 * support is confirmed, and plain click handlers before that.
 */

export interface DialogState {
  /** Which component owns this state: parts throw under the wrong Root. */
  component: string;
  open: boolean;
  /** True once the Invoker Commands API is confirmed (commandfor/command). */
  invokers: boolean;
  setOpen: (open: boolean) => void;
  /** The Trigger's element (native dialog close restores focus to it). */
  triggerRef: RefObject<HTMLButtonElement | null>;
  dialogId: string;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  registerTitle: () => () => void;
  registerDescription: () => () => void;
}

export const DialogContext = createContext<DialogState | null>(null);

/** The Invoker Commands API (`commandfor` / `command`), probed on the element prototype. */
function supportsInvokerCommands(): boolean {
  return (
    typeof HTMLButtonElement !== "undefined" && "commandForElement" in HTMLButtonElement.prototype
  );
}

/** Reads the dialog state, throwing when the part is under the wrong Root. */
export function useDialogContext(component: string, part: string): DialogState {
  const root = `${component}.Root`;
  const ctx = useRequiredContext(DialogContext, `${component}.${part}`, root);
  if (ctx.component !== component) {
    throw new Error(`${component}.${part} must be rendered inside <${root}>.`);
  }
  return ctx;
}

/** Root-level state: open state, the invoker probe, ids and part registration. */
export function useDialogRoot(component: string, options: OpenStateOptions): DialogState {
  const [open, setOpen] = useOpenState(options);
  const [hasTitle, registerTitle] = usePresence();
  const [hasDescription, registerDescription] = usePresence();
  const invokers = useSupports(supportsInvokerCommands);

  const autoId = useId();
  const dialogId = `${autoId}-${component.toLowerCase()}`;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return useMemo<DialogState>(
    () => ({
      component,
      open,
      setOpen,
      invokers,
      triggerRef,
      dialogId,
      titleId: `${dialogId}-title`,
      descriptionId: `${dialogId}-description`,
      hasTitle,
      hasDescription,
      registerTitle,
      registerDescription,
    }),
    [
      component,
      open,
      setOpen,
      invokers,
      dialogId,
      hasTitle,
      hasDescription,
      registerTitle,
      registerDescription,
    ],
  );
}

/** Wiring the Trigger attaches to whatever it renders. */
export interface DialogTriggerRenderProps {
  type: "button";
  /** Declarative invoker wiring (Invoker Commands API) where supported. */
  commandfor: string | undefined;
  command: "show-modal" | undefined;
  "aria-haspopup": "dialog";
  "aria-expanded": boolean;
  /** Styling hook: present while the dialog is open. */
  "data-popup-open": "true" | undefined;
  onClick: (e: ReactMouseEvent<Element>) => void;
  ref: Ref<HTMLButtonElement>;
}

export function dialogTriggerProps(ctx: DialogState): DialogTriggerRenderProps {
  return {
    ref: ctx.triggerRef,
    type: "button",
    // Enhanced: once hydration has probed for invoker support, the browser
    // owns open via commandfor (no click handler needed). The dialog's toggle
    // event syncs state either way.
    commandfor: ctx.invokers ? ctx.dialogId : undefined,
    command: ctx.invokers ? "show-modal" : undefined,
    "aria-haspopup": "dialog",
    "aria-expanded": ctx.open,
    "data-popup-open": ctx.open ? "true" : undefined,
    onClick: () => {
      if (!ctx.invokers) ctx.setOpen(true);
    },
  };
}

/** Wiring the Close part attaches to whatever it renders. */
export interface DialogCloseRenderProps {
  type: "button";
  /** Declarative invoker wiring (Invoker Commands API) where supported. */
  commandfor: string | undefined;
  command: "close" | undefined;
  onClick: (e: ReactMouseEvent<Element>) => void;
}

export function dialogCloseProps(ctx: DialogState): DialogCloseRenderProps {
  return {
    type: "button",
    commandfor: ctx.invokers ? ctx.dialogId : undefined,
    command: ctx.invokers ? "close" : undefined,
    onClick: () => {
      // Enhanced path: command="close" closes natively; the dialog's close
      // event syncs state (same flow as Escape/light dismiss).
      if (!ctx.invokers) ctx.setOpen(false);
    },
  };
}

export interface DialogPopupOptions {
  /** A consumer ref for the `<dialog>`, composed with the engine's own. */
  ref?: Ref<HTMLDialogElement>;
  /** Clicking the backdrop closes the dialog. @default true */
  lightDismiss?: boolean;
  /** Consumer-supplied `aria-labelledby`, listed after the Title's id, each id once. */
  labelledBy?: string;
  /** Consumer-supplied `aria-label`, for the development-only naming check. */
  label?: string;
  /** Consumer-supplied `aria-describedby`, listed after the Description's id, each id once. */
  describedBy?: string;
}

/**
 * The Popup's behaviour on the `<dialog>`: state reconciliation, native
 * event sync, the light-dismiss fallback and the body scroll lock. Returns
 * the attributes the dialog must carry; rest must never override them.
 * `aria-labelledby` and `aria-describedby` follow the merge contract: the
 * wiring's ids (Title, Description) first, then the consumer's, each once.
 */
export function useDialogPopup(
  ctx: DialogState,
  { ref: refProp, lightDismiss = true, labelledBy, label, describedBy }: DialogPopupOptions,
) {
  const { open, setOpen } = ctx;
  const ref = useRef<HTMLDialogElement>(null);
  const composedRef = useMemo(() => composeRefs(refProp, ref), [refProp]);

  // Reconcile React state with the native dialog. No dependency array: a
  // controlled parent may reject a close reported by the `close` event, and
  // only an every-render reconcile converges the DOM back.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  });

  // Native closes (Escape, closedby light dismiss, form method="dialog")
  // flow back into state via the `close` event; a native invoker open
  // (command="show-modal") flows in via `toggle`.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onClose = () => setOpen(false);
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState === "open") setOpen(true);
    };
    el.addEventListener("close", onClose);
    el.addEventListener("toggle", onToggle);
    return () => {
      el.removeEventListener("close", onClose);
      el.removeEventListener("toggle", onToggle);
    };
  }, [setOpen]);

  // Light-dismiss fallback for browsers without `closedby` (Safari): a click
  // whose target is the dialog but whose coordinates fall outside its content
  // rect landed on the backdrop.
  useEffect(() => {
    const el = ref.current;
    if (!el || !lightDismiss || "closedBy" in HTMLDialogElement.prototype) return;
    const onClick = (e: MouseEvent) => {
      if (e.target !== el) return;
      const rect = el.getBoundingClientRect();
      const inside =
        rect.top <= e.clientY &&
        e.clientY <= rect.bottom &&
        rect.left <= e.clientX &&
        e.clientX <= rect.right;
      if (!inside) el.close();
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [lightDismiss]);

  // Lock body scroll while open (showModal doesn't; the CSS-only
  // `body:has(dialog:modal)` route would restyle the host page).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // A dialog without a name is announced as, at best, "dialog". Checked
  // each time the dialog opens, from the committed DOM: a name that arrives
  // with the content is in place by then, and a closed dialog is not read.
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !open) return;
    const el = ref.current;
    if (!el) return;
    const named =
      el.hasAttribute("aria-label") ||
      el.hasAttribute("aria-labelledby") ||
      el.contains(document.getElementById(ctx.titleId));
    if (!named) {
      console.error(
        `LoamUI: <${ctx.component}.Popup> has no accessible name. ` +
          `Render a <${ctx.component}.Title> inside it, or give it an aria-label.`,
      );
    }
  }, [open, ctx.component, ctx.titleId]);

  return {
    ref: composedRef,
    id: ctx.dialogId,
    "aria-label": label,
    "aria-labelledby": idList(ctx.hasTitle ? ctx.titleId : undefined, labelledBy),
    "aria-describedby": idList(ctx.hasDescription ? ctx.descriptionId : undefined, describedBy),
    "data-open": open || undefined,
  };
}

/** Registers a Title with the dialog; returns the id it must carry. */
export function useDialogTitle(ctx: DialogState): string {
  const { registerTitle } = ctx;
  useEffect(() => registerTitle(), [registerTitle]);
  return ctx.titleId;
}

/** Registers a Description with the dialog; returns the id it must carry. */
export function useDialogDescription(ctx: DialogState): string {
  const { registerDescription } = ctx;
  useEffect(() => registerDescription(), [registerDescription]);
  return ctx.descriptionId;
}
