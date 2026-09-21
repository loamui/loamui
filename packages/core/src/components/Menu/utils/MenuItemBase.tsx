"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { useMenuContext } from "../root/MenuRootContext.js";

export interface MenuItemRenderProps {
  role: "menuitem" | "menuitemcheckbox" | "menuitemradio";
  tabIndex: -1;
  "aria-disabled": true | undefined;
  "aria-checked": boolean | undefined;
  onClick: (e: ReactMouseEvent<Element>) => void;
  children?: ReactNode;
  className?: string;
}

export interface ItemBaseProps extends Omit<PartProps<"button">, "onClick" | "role"> {
  /** The action. Runs before the menu closes. */
  onClick?: (e: ReactMouseEvent<Element>) => void;
  /** Close the menu when the item is activated. */
  closeOnClick?: boolean;
  /** Disable without removing from the accessibility tree. */
  disabled?: boolean;
  /** Substitute your own element (e.g. a router Link). */
  render?: RenderProp<MenuItemRenderProps>;
  children?: ReactNode;
}

export interface MenuItemProps extends ItemBaseProps {
  /** Renders the item as a link instead of a button. */
  href?: string;
  /** Close the menu when the item is activated. @default true */
  closeOnClick?: boolean;
}

/**
 * The item anatomy every kind shares: a `<button>` (or `<a>` via `href`)
 * carrying the role, the roving tabIndex, and the activate-then-close flow.
 */
export function ItemBase({
  kind: role,
  checked,
  href,
  onClick,
  closeOnClick,
  disabled,
  render,
  className,
  children,
  ...rest
}: ItemBaseProps & {
  kind: MenuItemRenderProps["role"];
  checked?: boolean;
  href?: string;
}) {
  const ctx = useMenuContext(
    `Menu.${role === "menuitem" ? "Item" : role === "menuitemcheckbox" ? "CheckboxItem" : "RadioItem"}`,
  );

  // The node goes in with the entry: it is what settles painted order, and
  // what roving focus and typeahead move to. An item may be a button, a link
  // or the consumer's own element, so the ref rides the wiring either way.
  const node = useRef<HTMLElement | null>(null);
  const { registerItem } = ctx;
  useEffect(() => registerItem({ node: node.current, disabled }), [registerItem, disabled]);

  const itemProps: MenuItemRenderProps = {
    role,
    tabIndex: -1,
    "aria-disabled": disabled || undefined,
    "aria-checked": checked,
    onClick: (e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
      if (closeOnClick) ctx.closeAndRefocus();
    },
  };

  // The render path must honor the same merge contract as the built-ins:
  // consumer children/className/rest ride along with the wiring.
  if (render) {
    return (
      <>
        {renderWithProps(render, {
          ...rest,
          ...itemProps,
          ref: node,
          children,
          className: cx("item", className),
        })}
      </>
    );
  }
  const target =
    href !== undefined ? (
      <a href={href} className={cx("item", className)} {...(rest as PartProps<"a">)}>
        {children}
      </a>
    ) : (
      <button type="button" className={cx("item", className)} {...rest}>
        {children}
      </button>
    );
  return <>{renderWithProps(target, { ...itemProps, ref: node })}</>;
}
