"use client";

import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

import type { PartProps } from "../../../utils/props.js";

import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";

/** Wiring the Item attaches to whatever it renders. */
export interface ErrorSummaryItemRenderProps {
  href: string;
  onClick: (e: ReactMouseEvent<HTMLAnchorElement>) => void;
  children?: ReactNode;
  className?: string;
}

export interface ErrorSummaryItemProps extends Omit<PartProps<"a">, "href" | "onClick"> {
  /**
   * Substitute the built-in <a> — e.g. a router link; the wiring
   * (href, focus handling, children) merges onto it.
   */
  render?: RenderProp<ErrorSummaryItemRenderProps>;
  /** The target field's fragment (e.g. "#email"). */
  href: string;
  onClick?: (e: ReactMouseEvent<HTMLAnchorElement>) => void;
  children?: ReactNode;
}

export function ErrorSummaryItem({
  href,
  onClick,
  render,
  className,
  children,
  ...rest
}: ErrorSummaryItemProps) {
  // Fragment navigation scrolls to the field but does not focus it; move
  // focus so the user can start typing the correction immediately.
  const focusTarget = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const id = href.startsWith("#") ? href.slice(1) : href;
    const target = document.getElementById(id);
    if (target instanceof HTMLElement) {
      requestAnimationFrame(() => target.focus());
    }
  };

  const wiring = { href, onClick: focusTarget, children, className };
  return (
    <li>
      {render ? (
        renderWithProps(render, { ...rest, ...wiring })
      ) : (
        <a {...rest} href={href} onClick={focusTarget} className={className}>
          {children}
        </a>
      )}
    </li>
  );
}
