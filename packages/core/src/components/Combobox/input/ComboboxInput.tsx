"use client";

import { useMemo } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  Ref,
} from "react";
import { composeRefs, renderWithProps } from "../../../utils/render.js";
import { Input } from "../../Input/Input.js";
import type { InputProps } from "../../Input/Input.js";
import { useComboboxContext } from "../root/ComboboxRootContext.js";

export interface ComboboxInputProps extends Omit<InputProps, "value" | "defaultValue" | "type"> {}

/** The combobox wiring the Input part attaches to the library's Input. */
interface ComboboxInputWiring {
  ref: Ref<HTMLInputElement> | undefined;
  type: "text";
  role: "combobox";
  "aria-autocomplete": "list";
  "aria-expanded": boolean;
  "aria-controls": string;
  "aria-activedescendant": string | undefined;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick: (e: ReactMouseEvent<HTMLInputElement>) => void;
  onKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => void;
}

/**
 * The text box: the library's Input as the combobox, with the list's
 * state and the highlighted option reflected in ARIA. Native `<input>`
 * props pass through; inside a `Field.Root` it is named and described by
 * the Field.
 */
export function ComboboxInput({ ref, style, ...rest }: ComboboxInputProps) {
  const ctx = useComboboxContext("Combobox.Input");
  const inputRef = useMemo(() => composeRefs(ref, ctx.inputRef), [ref, ctx.inputRef]);
  // The native input itself anchors the suggestions, even inside caller markup.
  const inputStyle = { ...style, anchorName: ctx.anchorName } as CSSProperties;

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!ctx.open) ctx.setOpen(true);
        ctx.moveHighlight(ctx.open ? "next" : "first");
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!ctx.open) ctx.setOpen(true);
        ctx.moveHighlight(ctx.open ? "previous" : "last");
        break;
      case "Home":
      case "End":
        if (!ctx.open) return;
        e.preventDefault();
        ctx.moveHighlight(e.key === "Home" ? "first" : "last");
        break;
      case "Enter": {
        if (!ctx.open || !ctx.highlightedId) return;
        const option = ctx.getOption(ctx.highlightedId);
        const node = option?.ref.current;
        if (!option || !node) return;
        e.preventDefault();
        ctx.commit(option.value, optionLabel(node));
        break;
      }
      case "Escape":
        // Once to close the list, once more to clear the box (APG).
        if (ctx.open) {
          e.preventDefault();
          ctx.close();
        } else if (ctx.inputValue !== "") {
          e.preventDefault();
          ctx.clear();
        }
        break;
      case "Tab":
        if (ctx.open) ctx.close();
        break;
    }
  };

  const wiring: ComboboxInputWiring = {
    ref: inputRef,
    type: "text",
    role: "combobox",
    "aria-autocomplete": "list",
    "aria-expanded": ctx.open,
    "aria-controls": ctx.listId,
    "aria-activedescendant": ctx.open ? (ctx.highlightedId ?? undefined) : undefined,
    value: ctx.inputValue,
    onChange: (e) => ctx.type(e.target.value),
    onClick: () => {
      if (!ctx.open) ctx.setOpen(true);
    },
    onKeyDown: handleKeyDown,
  };

  // The browser's own suggestions would sit on top of the list.
  return <>{renderWithProps(<Input autoComplete="off" {...rest} style={inputStyle} />, wiring)}</>;
}

/** The text an option commits: its `label`, else what it says. */
export function optionLabel(option: HTMLElement): string {
  return option.dataset.label ?? option.textContent?.trim() ?? "";
}

/** Wiring the Trigger attaches to whatever it renders. */
