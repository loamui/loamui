"use client";

import { useLayoutEffect } from "react";
import { useNav } from "../root/NavRootContext.js";
import { useRef } from "react";
import type { ReactNode, ToggleEvent } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";

export interface NavGroupProps extends Omit<PartProps<"details">, "open"> {
  open?: boolean;
  defaultOpen?: boolean;
  /** Fires with the new state when the reader opens or closes the group. */
  onOpenChange?: (open: boolean) => void;
  /** A GroupTitle, then a nested List. */
  children?: ReactNode;
}

/**
 * A fold of related links: a native `details`, so it opens and closes
 * without JavaScript. Share a `name` across groups and the browser keeps
 * one open at a time. A group holding the current page is styled as such
 * by the stylesheet, from the Link's own `aria-current`.
 */
export function NavGroup({
  open,
  defaultOpen,
  onOpenChange,
  onToggle,
  className,
  children,
  ref,
  ...rest
}: NavGroupProps) {
  useNav("Nav.Group");
  const controlled = open !== undefined;
  // What the attribute should read now. A toggle that lands on it is our
  // own synchronisation (React setting the prop, or the revert below), not
  // a reader's action, and is not reported.
  const expected = useRef(controlled ? open : (defaultOpen ?? false));
  useLayoutEffect(() => {
    if (controlled) expected.current = open;
  }, [controlled, open]);
  const handleToggle = (event: ToggleEvent<HTMLDetailsElement>) => {
    onToggle?.(event);
    const next = event.currentTarget.open;
    if (next === expected.current) return;
    if (controlled) event.currentTarget.open = expected.current;
    else expected.current = next;
    onOpenChange?.(next);
  };
  return (
    <details
      ref={ref}
      className={cx("group", className)}
      open={controlled ? open : defaultOpen}
      onToggle={handleToggle}
      {...rest}
    >
      {children}
    </details>
  );
}
