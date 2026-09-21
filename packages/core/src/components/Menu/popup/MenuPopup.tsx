"use client";

import { useMemo, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { composeRefs } from "../../../utils/render.js";
import { popupProps, usePopup } from "../../../hooks/use-popup.js";
import { useMenuContext } from "../root/MenuRootContext.js";

export interface MenuPopupProps extends PartProps<"div"> {
  /** Which side of the trigger the menu opens toward. @default "bottom" */
  side?: "bottom" | "top";
}

export function MenuPopup({
  side = "bottom",
  className,
  children,
  style,
  onKeyDown,
  ref: refProp,
  ...rest
}: MenuPopupProps) {
  const ctx = useMenuContext("Menu.Popup");
  const ref = ctx.popupRef;
  const composedRef = useMemo(() => composeRefs(refProp, ref), [refProp, ref]);
  const typeahead = useRef({ query: "", at: 0 });

  // Focus the first/last item on open; return focus to the trigger on close
  // when it would otherwise be lost. Menus move focus; they never trap it.
  usePopup(ctx, {
    focusOnOpen: (el) => {
      const found = ctx.items();
      const target = ctx.focusOnOpen.current === "last" ? found[found.length - 1] : found[0];
      (target ?? el).focus({ preventScroll: true });
    },
    onEscape: ctx.closeAndRefocus,
  });

  // The APG keyboard pattern, on real focus (items rove with tabIndex -1).
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const items = ctx.items();
    if (items.length === 0) return;
    const current = items.indexOf(document.activeElement as HTMLElement);

    const focusAt = (i: number) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };

    switch (e.key) {
      case "ArrowDown":
        focusAt(current + 1);
        break;
      case "ArrowUp":
        focusAt(current - 1);
        break;
      case "Home":
        focusAt(0);
        break;
      case "End":
        focusAt(items.length - 1);
        break;
      case "Tab":
        // Tab leaves the menu: close it and let focus move on naturally.
        ctx.setOpen(false);
        break;
      default: {
        // Typeahead: printable characters accumulate for half a second and
        // jump to the next item whose text starts with the query.
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
        const now = Date.now();
        const t = typeahead.current;
        t.query = (now - t.at < 500 ? t.query : "") + e.key.toLowerCase();
        t.at = now;
        const from = current >= 0 ? current + (t.query.length === 1 ? 1 : 0) : 0;
        for (let i = 0; i < items.length; i++) {
          const item = items[(from + i) % items.length];
          if (item?.textContent?.trim().toLowerCase().startsWith(t.query)) {
            e.preventDefault();
            item.focus();
            break;
          }
        }
      }
    }
  };

  return (
    // rest cannot override what follows: role, the roving tabIndex and
    // the typeahead handlers are the menu pattern itself.
    <div
      {...rest}
      {...popupProps(ctx, side, style)}
      ref={composedRef}
      role="menu"
      tabIndex={-1}
      className={cx("loam-Menu-popup", className)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

/** Wiring an Item attaches to whatever it renders. */
