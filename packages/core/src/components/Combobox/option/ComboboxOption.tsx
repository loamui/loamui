"use client";

import { isValidElement, useEffect, useId, useLayoutEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

import type { PartProps } from "../../../utils/props.js";
import { mergeProps, renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { useComboboxContext } from "../root/ComboboxRootContext.js";
import { optionLabel } from "../input/ComboboxInput.js";

export interface ComboboxOptionRenderProps {
  id: string;
  role: "option";
  "aria-selected": boolean;
  "aria-disabled": true | undefined;
  /** Styling hook — present on the option the keyboard or pointer is on. */
  "data-highlighted": "true" | undefined;
  "data-value": string;
  "data-label": string | undefined;
  onClick: (e: ReactMouseEvent<Element>) => void;
  onMouseMove: (e: ReactMouseEvent<Element>) => void;
  children?: ReactNode;
  className?: string;
}

export interface ComboboxOptionProps extends Omit<PartProps<"li">, "value"> {
  /** What the choice submits and `onValueChange` receives. */
  value: string;
  /** The text the box shows once chosen. @default the option's text content */
  label?: string;
  /** Present but not choosable; skipped by the keyboard. */
  disabled?: boolean;
  /** Substitute your own element; it receives the wiring props. */
  render?: RenderProp<ComboboxOptionRenderProps>;
}

export function ComboboxOption({
  id: idProp,
  value,
  label,
  disabled,
  render,
  className,
  children,
  ...rest
}: ComboboxOptionProps) {
  const ctx = useComboboxContext("Combobox.Option");
  const autoId = `${useId()}-option`;
  const renderedId = isValidElement<{ id?: string }>(render) ? render.props.id : undefined;
  const id = renderedId ?? idProp ?? autoId;
  const selected = ctx.value !== null && ctx.value === value;
  const highlighted = ctx.highlightedId === id;

  const { registerOption, releaseHighlight, adoptLabel } = ctx;
  const textRef = useRef<HTMLElement | null>(null);

  // Settle registrations before the Root announces the result count.
  useLayoutEffect(() => {
    const unregister = registerOption({ id, value, disabled, ref: textRef });
    return () => {
      unregister();
      releaseHighlight(id);
    };
  }, [registerOption, releaseHighlight, id, value, disabled]);

  // A defaultValue names an option before its label is known; the option
  // supplies it once, unless the user has already typed.
  useEffect(() => {
    if (!selected) return;
    const el = textRef.current;
    if (el) adoptLabel(optionLabel(el));
  }, [selected, adoptLabel]);

  const optionProps: ComboboxOptionRenderProps = {
    id,
    role: "option",
    "aria-selected": selected,
    "aria-disabled": disabled || undefined,
    "data-highlighted": highlighted ? "true" : undefined,
    "data-value": value,
    "data-label": label,
    onClick: (e) => {
      if (disabled) return;
      ctx.commit(value, optionLabel(e.currentTarget as HTMLElement));
    },
    onMouseMove: () => {
      if (!disabled && !highlighted) ctx.highlight(id);
    },
  };

  const wiring = { ...optionProps, ref: textRef };
  return (
    <>
      {render
        ? renderWithProps(render, mergeProps(wiring, { ...rest, children, className }), { id })
        : renderWithProps(
            <li className={className} {...rest}>
              {children}
            </li>,
            wiring,
          )}
    </>
  );
}
