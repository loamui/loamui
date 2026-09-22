"use client";

import { Button } from "../../Button/Button.js";
import type { ButtonProps } from "../../Button/Button.js";

/** The words the Close button speaks. */
export interface AlertCloseLabels {
  /** The button's name when it has no children of its own. @default "Dismiss" */
  close?: string;
}

export interface AlertCloseProps extends ButtonProps {
  /** Called when the button is activated; the consumer stops rendering the alert. */
  onClose?: () => void;
  /**
   * The button's name when it has no children of its own (an icon-only
   * close). @default { close: "Dismiss" }
   */
  labels?: AlertCloseLabels;
}

/**
 * A close button: a LoamUI Button that reports the dismissal through
 * `onClose`. The alert itself does not vanish; the consumer removes it,
 * because an alert exists exactly as long as the condition it reports and
 * only the consumer knows when acknowledging it ends that condition.
 */
export function AlertClose({ onClose, onClick, labels, children, ...rest }: AlertCloseProps) {
  const close = labels?.close ?? "Dismiss";
  return (
    <Button
      aria-label={children ? undefined : close}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onClose?.();
      }}
      {...rest}
    >
      {children ?? (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M4 4l8 8m0-8l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </Button>
  );
}
