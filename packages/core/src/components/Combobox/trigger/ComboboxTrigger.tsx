"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { Button } from "../../Button/Button.js";
import type { ButtonProps } from "../../Button/Button.js";
import { useComboboxContext } from "../root/ComboboxRootContext.js";

export interface ComboboxTriggerRenderProps {
  type: "button";
  /** Out of the Tab sequence: the box already reaches the list by keyboard. */
  tabIndex: -1;
  /** The name from `labels.toggle`, unless children name the button. */
  "aria-label": string | undefined;
  "aria-expanded": boolean;
  "aria-controls": string;
  /** Styling hook — present while the list is open. */
  "data-popup-open": "true" | undefined;
  onMouseDown: (e: ReactMouseEvent<Element>) => void;
  onClick: (e: ReactMouseEvent<Element>) => void;
}

export interface ComboboxTriggerProps extends Omit<ButtonProps, "render"> {
  /**
   * Substitute your own element as the trigger, or pass a function receiving
   * the wiring props. Without it, the Trigger renders a LoamUI Button with
   * a chevron, named by `labels.toggle`.
   */
  render?: RenderProp<ComboboxTriggerRenderProps>;
}

/**
 * A button that shows or hides the list, for pointer users. A chevron
 * named by `labels.toggle` by default; children take the chevron's place
 * and name the button instead.
 */
export function ComboboxTrigger({ render, children, ...rest }: ComboboxTriggerProps) {
  const ctx = useComboboxContext("Combobox.Trigger");

  const triggerProps: ComboboxTriggerRenderProps = {
    type: "button",
    tabIndex: -1,
    "aria-label": children == null ? ctx.labels.toggle : undefined,
    "aria-expanded": ctx.open,
    "aria-controls": ctx.listId,
    "data-popup-open": ctx.open ? "true" : undefined,
    // Keep focus in the box: a button that took it would blur the box and
    // close the list before the click could open it.
    onMouseDown: (e) => e.preventDefault(),
    onClick: () => {
      ctx.inputRef.current?.focus({ preventScroll: true });
      if (ctx.open) ctx.close();
      else ctx.setOpen(true);
    },
  };

  return render ? (
    <>{renderWithProps(render, mergeProps(triggerProps, { children, ...rest }))}</>
  ) : (
    <>
      {renderWithProps(
        <Button {...rest}>
          {children ?? (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </Button>,
        triggerProps,
      )}
    </>
  );
}
