"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { popupTriggerProps } from "../../../hooks/use-popup.js";
import type { PopupTriggerRenderProps } from "../../../hooks/use-popup.js";
import { Button } from "../../Button/Button.js";
import { useMenuContext } from "../root/MenuRootContext.js";

export interface MenuTriggerRenderProps extends PopupTriggerRenderProps {
  "aria-haspopup": "menu";
  onKeyDown: (e: ReactKeyboardEvent<Element>) => void;
}

export interface MenuTriggerProps extends PartProps<"button"> {
  /**
   * Substitute your own element as the trigger, or pass a function receiving
   * the wiring props. Without it, the Trigger renders a LoamUI Button, which
   * adapts to its context like any Button.
   */
  render?: RenderProp<MenuTriggerRenderProps>;
}

export function MenuTrigger({ render, children, ...rest }: MenuTriggerProps) {
  const ctx = useMenuContext("Menu.Trigger");
  const base = popupTriggerProps(ctx);

  const triggerProps: MenuTriggerRenderProps = {
    ...base,
    "aria-haspopup": "menu",
    onClick: (e) => {
      ctx.focusOnOpen.current = "first";
      base.onClick(e);
    },
    // APG menu button: ArrowDown opens focusing the first item, ArrowUp the
    // last. (Enter/Space are native button activation → onClick.)
    onKeyDown: (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      ctx.focusOnOpen.current = e.key === "ArrowDown" ? "first" : "last";
      ctx.setOpen(true);
    },
  };

  return render ? (
    <>{renderWithProps(render, mergeProps(triggerProps, { children, ...rest }))}</>
  ) : (
    <>{renderWithProps(<Button {...rest}>{children}</Button>, triggerProps)}</>
  );
}
