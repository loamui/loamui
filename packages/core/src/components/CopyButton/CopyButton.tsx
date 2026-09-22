"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { Button } from "../Button/Button.js";
import type { ButtonProps } from "../Button/Button.js";

/** The words the button says. */
export interface CopyButtonLabels {
  /** Shown, and announced, after a successful copy. @default "Copied" */
  copied?: ReactNode;
  /** Announced when the clipboard refuses. @default "Copy failed: select the text and copy it yourself" */
  failed?: ReactNode;
}

export interface CopyButtonProps extends Omit<ButtonProps, "onCopy"> {
  /** The text written to the clipboard. */
  value: string;
  /** The label at rest; an svg child is detected by Button as an icon. @default "Copy" */
  children?: ReactNode;
  /**
   * The words the button says: `copied` is shown, and announced, after a
   * successful copy (default "Copied"); `failed` is announced when the
   * clipboard refuses (no API in an insecure context, permission denied, a
   * document without focus; default "Copy failed: select the text and copy
   * it yourself").
   */
  labels?: CopyButtonLabels;
  /** How long the copied label and announcement stand, in ms. @default 1500 */
  timeout?: number;
  /**
   * Called with the value once it is on the clipboard. Replaces the native
   * `onCopy` event handler: that event fires when a user copies a
   * selection, which a button never holds, so the name is free for the
   * event that matters here.
   */
  onCopy?: (value: string) => void;
}

type Status = "idle" | "copied" | "failed";

/**
 * A Button that copies a string to the clipboard and says so.
 *
 * On click the value goes to the clipboard through the async Clipboard
 * API. On success the label reads `labels.copied` for `timeout` ms and a
 * visually hidden `role="status"` region announces the same words, so
 * the confirmation reaches a screen reader without moving focus. On
 * failure the label stays as it was and the region announces
 * `labels.failed`: the failure is said, never swallowed. The label always
 * reverts, so the button never claims a copy it made a while ago.
 *
 * This is not a toggle, so there is no `aria-pressed`: "Copied" is a
 * transient confirmation, not a state the user can switch back.
 *
 * Renders as a Button plus its status region inside a `span.loam-CopyButton`
 * whose box is `display: contents`. A fragment cannot carry the class the
 * stylesheet scopes on, and a wrapper that kept its box would sit between
 * the Button and the layout that decides its width (a grid region
 * stretches its buttons; a narrow container makes them full width). With
 * `contents` the Button takes part in the parent's layout exactly as a
 * bare Button would, and the Button itself is not restyled: the scope's
 * donut stops at `.loam-Button`. `className`, `style` and `ref` go to the
 * Button, which is the thing there is to style.
 *
 * ```tsx
 * <CopyButton value="pnpm add @loamui/core" />
 *
 * <CopyButton value={token} aria-label="Copy token">
 *   <svg aria-hidden>…</svg>
 * </CopyButton>
 * ```
 */
export function CopyButton({
  value,
  children = "Copy",
  labels,
  timeout = 1500,
  onCopy,
  onClick,
  ...rest
}: CopyButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const copiedLabel = labels?.copied ?? "Copied";
  const failedMessage = labels?.failed ?? "Copy failed: select the text and copy it yourself";
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // The revert timer is the one external system here: clear it on unmount
  // so a copy made just before navigation does not update a gone node.
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      onCopy?.(value);
    } catch {
      setStatus("failed");
    }
    // Back to idle either way: the label reverts so the button stays honest,
    // and the region empties so the next copy is announced again (a live
    // region only speaks when its text changes).
    timer.current = setTimeout(() => setStatus("idle"), timeout);
  };

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) void copy();
  };

  const announcement = status === "copied" ? copiedLabel : status === "failed" ? failedMessage : "";

  return (
    <span className="loam-CopyButton">
      <Button onClick={handleClick} {...rest}>
        {status === "copied" && !rest["aria-label"] ? copiedLabel : children}
      </Button>
      <span role="status" className="loam-VisuallyHidden">
        {announcement}
      </span>
    </span>
  );
}
